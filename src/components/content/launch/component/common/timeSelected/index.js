import React, { Component } from 'react';
import { Table, Button } from 'antd';
import './style.scss';

const times = {
  time0: [false, false],
  time1: [false, false],
  time2: [false, false],
  time3: [false, false],
  time4: [false, false],
  time5: [false, false],
  time6: [false, false],
  time7: [false, false],
  time8: [false, false],
  time9: [false, false],
  time10: [false, false],
  time11: [false, false],
  time12: [false, false],
  time13: [false, false],
  time14: [false, false],
  time15: [false, false],
  time16: [false, false],
  time17: [false, false],
  time18: [false, false],
  time19: [false, false],
  time20: [false, false],
  time21: [false, false],
  time22: [false, false],
  time23: [false, false]
}

class TimeSelected extends Component {
  state = {
    timeData: [{ // 时间段数据
      key: '1',
      name: '星期一',
      ...times
    }, {
      key: '2',
      name: '星期二',
      ...times
    }, {
      key: '3',
      name: '星期三',
      ...times
    }, {
      key: '4',
      name: '星期四',
      ...times
    }, {
      key: '5',
      name: '星期五',
      ...times
    }, {
      key: '6',
      name: '星期六',
      ...times
    }, {
      key: '7',
      name: '星期日',
      ...times
    }],
    startMoveOver: false, // 启动时间节点点移动事件
    moveOne: true, // 在时间节点内启动一次移动事件内部只做一次操作
    timeGroupSelect: [], // 选中的时间区间
  }

  componentDidMount () {
    var timeSelected = document.querySelector('.time-selected');

    timeSelected.onmousemove = function (event) { // 禁止默认行为
      event.preventDefault();
      window.event.returnValue = false;
    }
  }

  // 时间段选中状态(0 => 0-30， 1 => 30-1)(time => 时间段)(record => 改rowDate)
  periodTimeChooseState = (state, time, record) => {
    const { timeData } = this.state;
    let timeDatas = JSON.parse(JSON.stringify(timeData));

    timeDatas.forEach(item => {
      if (item.key === record.key) {
        item[time][state] = !item[time][state]; // 改变当前选中状态
      }
    })

    this.setState({
      timeData: timeDatas
    }, () => {
      this.getSelectTimeInterval()
    })
  }

  // 时间段区间鼠标按下事件
  onmousedownTimeSlot = () => {
    this.setState({
      startMoveOver: true
    })
  }

  // 时间段区间鼠标松开事件
  onmouseupTimeSlot = () => {
    this.setState({
      startMoveOver: false
    })
  }

  // 时间段区间鼠标移动事件(record => 该节点数据)(state => 前半段or后半段)(time => 该时间节点)
  onmousemoveTimeSlot = (record, state, time, e) => {
    e.preventDefault();
    
    const { timeData, moveOne } = this.state;

    if (moveOne) {
      let timeDatas = JSON.parse(JSON.stringify(timeData));

      timeDatas.forEach(item => {
        if (item.key === record.key) {
          item[time][state] = !item[time][state]; // 改变当前选中状态
        }
      })

      this.setState({
        timeData: timeDatas,
        moveOne: false
      }, () => {
        this.getSelectTimeInterval()
      })
    }
  }

  // 时间段区离开事件
  onmouseoutTimeSlot = () => {
    this.setState({
      moveOne: true
    })
  }

  // 表格每列render
  tableCloumnRender = (tiems, text, record) => {
    const { startMoveOver } = this.state;
    const { disabled } = this.props;

    return (
      <div className="time-group">
        <span 
          className={ record[tiems][0] ? "box active" : "box" } 
          onClick={ disabled ? null : startMoveOver ? null : this.periodTimeChooseState.bind(this, 0, tiems, record) } 
          onMouseDown={ disabled ? null : this.onmousedownTimeSlot } 
          onMouseUp={ disabled ? null : this.onmouseupTimeSlot } 
          onMouseOut={ disabled ? null : this.onmouseoutTimeSlot }
          onMouseMove={ disabled ? null : startMoveOver ? this.onmousemoveTimeSlot.bind(this, record, 0, tiems) : null }>
        </span>

        <span 
          className={ record[tiems][1] ? "box active" : "box" } 
          onClick={ disabled ? null : startMoveOver ? null : this.periodTimeChooseState.bind(this, 1, tiems, record) } 
          onMouseDown={ disabled ? null : this.onmousedownTimeSlot }  
          onMouseUp={ disabled ? null : this.onmouseupTimeSlot } 
          onMouseOut={ disabled ? null : this.onmouseoutTimeSlot }
          onMouseMove={ disabled ? null : startMoveOver ? this.onmousemoveTimeSlot.bind(this, record, 1, tiems) : null }>
        </span>
      </div>
    )
  }

  // 获取已选中的时间段
  getSelectTimeInterval = () => {
    const { timeData } = this.state;
    let selectTimeData = [];

    // 获取选中的数据
    timeData.forEach((item) => {  
      let obj = {};
      let interCol = []; // 区间收集

      for (let val in item) {
        if (val.indexOf('time') > -1) {
          let data = item[val];
          let stop = true; // 判断区间收集叫停

          data.forEach((d, index) => {
            let obj2 = {};

            if (d) {
              stop = true;
              obj2.sunday = item.name; // 当前周天
              obj2.time = Number(val.split('time')[1]); // 当前时间
              obj2.state = index; // 当前点区间（0-30； 30-60）
            } else {
              stop = false;
            }

            if (stop) {
              interCol.push(obj2)
            }
          })
        }
      }

      if (interCol.length) {
        obj.interCol = interCol
        selectTimeData.push(obj)
      }
    })

    // 得到的数据处理成为区间数组
    selectTimeData.forEach(item => { 
      let intervalArray = []; // 区间数组
      let section = []; // 区段
      let len = item.interCol.length;

      item.interCol.forEach((d, index) => { // 每级数据
        if (index !== 0) {
          if ((d.time - 1) === item.interCol[(index - 1)].time) { // 判断是否连续
            if (item.interCol[(index - 1)].state === 0 && d.state === 0 || item.interCol[(index - 1)].state === 0 && d.state === 1 || item.interCol[(index - 1)].state === 1 && d.state === 1) { // 连续中也存在不连续 
              let arry = [];

              if (section.length >= 2) {
                arry.push(section[0])
                arry.push(section[section.length - 1])
              } else {
                arry.push(section[0])
              }

              intervalArray.push(arry)
              section = []
              section.push(d)

              if ((len - 1) === index) { // 判断是否为最后一个
                intervalArray.push(section)
              }
            } else { // 连续
              section.push(d)

              let arry = [];

              if (section.length >= 2) {
                arry.push(section[0])
                arry.push(section[section.length - 1])
              } else {
                arry.push(section[0])
              }

              if ((len - 1) === index) { // 判断是否为最后一个
                intervalArray.push(arry)
              }
            }
          } if (d.time === item.interCol[(index - 1)].time) { // 连续
            section.push(d)

            let arry = [];

            if (section.length >= 2) {
              arry.push(section[0])
              arry.push(section[section.length - 1])
            } else {
              arry.push(section[0])
            }

            if ((len - 1) === index) { // 判断是否为最后一个
              intervalArray.push(arry)
            }
          } else if ((d.time - 1) !== item.interCol[(index - 1)].time) { // 不连续
            let arry = [];

            if (section.length >= 2) {
              arry.push(section[0])
              arry.push(section[section.length - 1])
            } else {
              arry.push(section[0])
            }

            intervalArray.push(arry)
            section = []
            section.push(d)

            if ((len - 1) === index) { // 判断是否为最后一个
              intervalArray.push(section)
            }
          }

        } else { // 第一个数据
          section.push(d);

          if (len === 1) { 
            intervalArray.push(d)
          }
        }
      })
      
      item.intervalArray = intervalArray;
    })

    let timeGroupSelect = [];

    // 将得到的数据转换成文字区间
    selectTimeData.forEach(item => {
      let intervalArray = item.intervalArray;
      let intervalVlaue = item.interCol[0].sunday + ':';
      let section = [];
      
      intervalArray.forEach(d => {
        let afterInterval = '';

        if (d.length === 2) {
          d.forEach((row, index) => {
            let time = String(row.time).length === 1 ? '0' + row.time : row.time;
            // let nextTime = String((Number(time) + 1)).length === 1 ? '0' + (Number(time) + 1) : (Number(time) + 1);

            if (index === 0) {
              afterInterval += row.state === 0 ? time + ':00' : time + ':30';
            } else {
              afterInterval += row.state === 0 ? '~' + time + ':30' : '~' + time + ':59';
            }
          })
        } else {
          if (intervalArray.length === 1) {
            let time = String(d.time).length === 1 ? '0' + d.time : d.time;
            // let nextTime = String((Number(time) + 1)).length === 1 ? '0' + (Number(time) + 1) : (Number(time) + 1);

            afterInterval = d.state === 0 ? time + ':00~' + time + ':30' : time + ':30~' + time + ':59';
          } else {
            let time = String(d[0].time).length === 1 ? '0' + d[0].time : d[0].time;
            // let nextTime = String((Number(time) + 1)).length === 1 ? '0' + (Number(time) + 1) : (Number(time) + 1);

            afterInterval = d[0].state === 0 ? time + ':00~' + time + ':30' : time + ':30~' + time + ':59';
          }
        }

        section.push(afterInterval)
      })

      intervalVlaue += section.join(',');
      timeGroupSelect.push(intervalVlaue)
    })

    this.setState({
      timeGroupSelect
    });

    this.props.childrenGetTimeSelectedData(timeGroupSelect);
  }

  // 撤销所有的选择
  undoAllOptions = () => {
    const { timeData } = this.state;
    let timeDatas = JSON.parse(JSON.stringify(timeData));

    timeDatas.forEach(item => {
      for (let val in item) {
        if (val.indexOf('time') > -1) {
          item[val][0] = false
          item[val][1] = false
        }
      }
    })

    this.setState({
      timeData: timeDatas,
      timeGroupSelect: []
    }, () => {
      this.props.childrenGetTimeSelectedData(this.state.timeGroupSelect);
    })
  }

  render () {
    const { timeData, timeGroupSelect } = this.state;
    const { disabled } = this.props;

    const columns = [{
      title: '星期 / 日期',
      dataIndex: 'name',
      width: '10%',
      render: (text, record) => {
        return <span style={{ display: 'block', width: 75 }}>{ record.name }</span>
      }
    }, {
      title: '上午',
      width: '45%',
      children: [
        {
          title: '0',
          width: '40px',
          dataIndex: 'time0',
          render: this.tableCloumnRender.bind(this, "time0")
        },
        {
          title: '1',
          width: '40px',
          dataIndex: 'time1',
          render: this.tableCloumnRender.bind(this, "time1")
        },
        {
          title: '2',
          width: '40px',
          dataIndex: 'time2',
          render: this.tableCloumnRender.bind(this, "time2")
        },
        {
          title: '3',
          width: '40px',
          dataIndex: 'time3',
          render: this.tableCloumnRender.bind(this, "time3")
        },
        {
          title: '4',
          width: '40px',
          dataIndex: 'time4',
          render: this.tableCloumnRender.bind(this, "time4")
        },
        {
          title: '5',
          width: '40px',
          dataIndex: 'time5',
          render: this.tableCloumnRender.bind(this, "time5")
        },
        {
          title: '6',
          width: '40px',
          dataIndex: 'time6',
          render: this.tableCloumnRender.bind(this, "time6")
        },
        {
          title: '7',
          width: '40px',
          dataIndex: 'time7',
          render: this.tableCloumnRender.bind(this, "time7")
        },
        {
          title: '8',
          width: '40px',
          dataIndex: 'time8',
          render: this.tableCloumnRender.bind(this, "time8")
        },
        {
          title: '9',
          width: '40px',
          dataIndex: 'time9',
          render: this.tableCloumnRender.bind(this, "time9")
        },
        {
          title: '10',
          width: '40px',
          dataIndex: 'time10',
          render: this.tableCloumnRender.bind(this, "time10")
        },
        {
          title: '11',
          width: '40px',
          dataIndex: 'time11',
          render: this.tableCloumnRender.bind(this, "time11")
        }
      ]
    }, {
      title: '下午',
      width: '45%',
      children: [
        {
          title: '12',
          width: '40px',
          dataIndex: 'time12',
          render: this.tableCloumnRender.bind(this, "time12")
        },
        {
          title: '13',
          width: '40px',
          dataIndex: 'time13',
          render: this.tableCloumnRender.bind(this, "time13")
        },
        {
          title: '14',
          width: '40px',
          dataIndex: 'time14',
          render: this.tableCloumnRender.bind(this, "time14")
        },
        {
          title: '15',
          width: '40px',
          dataIndex: 'time15',
          render: this.tableCloumnRender.bind(this, "time15")
        },
        {
          title: '16',
          width: '40px',
          dataIndex: 'time16',
          render: this.tableCloumnRender.bind(this, "time16")
        },
        {
          title: '17',
          width: '40px',
          dataIndex: 'time17',
          render: this.tableCloumnRender.bind(this, "time17")
        },
        {
          title: '18',
          width: '40px',
          dataIndex: 'time18',
          render: this.tableCloumnRender.bind(this, "time18")
        },
        {
          title: '19',
          width: '40px',
          dataIndex: 'time19',
          render: this.tableCloumnRender.bind(this, "time19")
        },
        {
          title: '20',
          width: '40px',
          dataIndex: 'time20',
          render: this.tableCloumnRender.bind(this, "time20")
        },
        {
          title: '21',
          width: '40px',
          dataIndex: 'time21',
          render: this.tableCloumnRender.bind(this, "time21")
        },
        {
          title: '22',
          width: '40px',
          dataIndex: 'time22',
          render: this.tableCloumnRender.bind(this, "time22")
        },
        {
          title: '23',
          width: '40px',
          dataIndex: 'time23',
          render: this.tableCloumnRender.bind(this, "time23")
        }
      ]
    }];

    return (
      <section className="time-selected">
        <Table 
          rowKey={(record, index) => index} 
          columns={columns} 
          dataSource={timeData} 
          bordered 
          pagination={false} 
          rowClassName="no-hover" 
        />

        <div className="time-selected">
          <div className="group">
            {
              timeGroupSelect.map((item,index) => {
                return <p key={ index }>{ item }</p>
              })
            }
          </div>

          <div className="group" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button disabled={ disabled } type="primary" style={{ backgroundColor: '#f5222d', color: 'white' }} onClick={ this.undoAllOptions }>撤销所有选择</Button>
          </div>
        </div>
      </section>
    )
  }
}

export default TimeSelected;
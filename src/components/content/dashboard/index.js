import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import { Chart, Tooltip, Axis, Legend, Line, Point, Guide } from 'viser-react';
import HttpRequest from '@/utils/fetch';
import Customer from '@/components/common/customer';
import { getCookie } from '@/components/common/methods';
import './style.scss';
import { rejects } from 'assert';

// 视图 -start
const DataSet = require('@antv/data-set');
const scale = [{
  dataKey: 'time',
  min: 0,
  max: 1,
}];
const userInfo = JSON.parse(getCookie('userInfo'));
// 视图 -end

// 表格 -start
const columns = [{
  title: '时间',
  dataIndex: 'time',
  key: 'time',
  width: '16.66%',
  render: (text) => {
    return <span>{String(text).length === 1 ? `0${text}:00` : `${text}:00`}</span>
  }
}, {
  title: '展示',
  dataIndex: 'showNum',
  key: 'showNum',
  width: '16.66%'
}, {
  title: '点击',
  dataIndex: 'clickNum',
  key: 'clickNum',
  width: '16.66%'
}, {
  title: '点击率',
  dataIndex: 'clickRate',
  key: 'clickRate',
  width: '16.66%',
  render: (text) => {
    return <span>{`${(text*100).toFixed(2)}%`}</span>
  }
}, {
  title: 'CPM',
  dataIndex: 'cpm',
  key: 'cpm',
  width: '16.66%'
}, {
  title: '花费',
  dataIndex: 'cost',
  key: 'cost',
  width: '16.66%',
  render: (text) => {
    return <span>{text.toFixed(2)}</span>
  }
}];
// 表格 -end

let timer;

class Dashboard extends Component {
  state = {
    kpi: [{ // 指标列表
      name: '展示',
      ename: 'showNum',
      id: 1,
      active: false
    }, {
      name: '点击',
      ename: 'clickNum',
      id: 2,
      active: false
    }, {
      name: '点击率',
      ename: 'clickRate',
      id: 3,
      active: false
    }, {
      name: 'CPM',
      ename: 'cpm',
      id: 4,
      active: false
    }, {
      name: '花费',
      ename: 'cost',
      id: 5,
      active: true
    }],
    detailsList: [], // 详细数据列表
    visualizatData: [], // 趋势图数据
    newTabVal: 'showNum', // 当前tab
    visualList: [], // 当前视图数据
    userNumber: [], // 客户总览
  }

  componentDidMount () {
    this.getCountDay()
    this.getCountVal()
    if (userInfo.userId === -1) {
      this.countUser()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { newTabVal } = this.state;

    if (newTabVal !== nextState.newTabVal) {
      return false;
    }

    return true;
  }

  // 指标切换
  switchTab = (data, e) => {
    let lis = e.target.parentNode.childNodes;
    for (let i = 0; i < lis.length; i++) {
      let item = lis[i];
      item.classList.remove('active')
    }

    e.target.classList.add('active')

    this.setState({
      newTabVal: data.ename
    }, () => {
      this.extractData()
    })
  }

  // 获取详细数据列表
  getCountDay = () => {
    HttpRequest("/count/countDay", "POST", {}, res => {
      this.setState({
        detailsList: res.data
      })
    })
  }

  //获取趋势图数据
  getCountVal = () => {
    HttpRequest("/count/countVal", "POST", {
      type: 1
    }, res => {
      this.setState({
        visualizatData: res.data
      }, () => {
        this.extractData()
      })
    })
  }

  // 提取趋势图数据
  extractData = () => {
    const { newTabVal, visualizatData } = this.state;
    let visualList = [];

    visualizatData.forEach(item => {
      let obj = {};
      obj.time = item.time.length === 1 ? `0${item.time}:00` : `${item.time}:00`;

      item.planDataList.forEach((d, index) => {
        let day = '';

        if (index === 0) {
          day = "今天"
        } else if (index === 1) {
          day = "昨天"
        } else if (index === 2) {
          day = "7天前"
        } else if (index === 3) {
          day = "30天前"
        }

        if (String(d.time) !== "-1") {
          obj[day] = Number(d[newTabVal].toFixed(2))
        }
      })

      visualList.push(obj)
    })

    this.setState({
      visualList
    })
  }

  // 获取客户统计
  countUser = () => {
    HttpRequest("/count/countUser", "POST", {}, res => {
      this.setState({
        userNumber: res.data
      })
    })
  }

  render () {
    const { kpi, detailsList, visualList, userNumber } = this.state;
    const dv = new DataSet.View().source(visualList);
    dv.transform({
      type: 'fold',
      fields: ['今天', '昨天', '7天前', '30天前'],
      key: 'city',
      value: 'temperature',
    });
    const data = dv.rows;

    return (
      <section className="content-box dashboard-box">
        {/* 切换客户 */}
        <Customer />
        {
          userInfo.userId === -1
          ?
          <div className="content-top-name">
            <h4>客户总览</h4>
            <div className="overview-box">
              <div className="block-group">
                <div className="name">
                  <span>有效客户</span>
                  <Icon type="info-circle-o" />
                </div>
                <p className="value" style={{ color: '#1f91fe' }}>{userNumber[1]}</p>
              </div>
              <div className="block-group">
                <div className="name">
                  <span>待审客户</span>
                  <Icon type="info-circle-o" />
                </div>
                <p className="value" style={{ color: '#00ccb2' }}>{userNumber[0]}</p>
              </div>
              <div className="block-group">
                <div className="name">
                  <span>暂停客户</span>
                  <Icon type="info-circle-o" />
                </div>
                <p className="value" style={{ color: '#7e37e1' }}>{userNumber[2]}</p>
              </div>
            </div>
          </div>
          :
          ""
        }
        
        <section className="dashboard-main">
          <section className="tab-box">
            <ul className="dashboard-tabs">
              <li>小时指标</li>

              {
                kpi.map((item, index) => {
                  return <li className={`can-point ${index === 0 ? 'active' : '' }`} key={item.id} onClick={this.switchTab.bind(this, item)}>{item.name}</li>
                })
              }
            </ul>
            
            <div className="tab-content">
              <Chart forceFit height={400} padding={[20, 20, 95, 80]} data={data} scale={scale}>
                <Tooltip crosshairs={{type: 'y'}} />
                <Axis />
                <Legend />
                {/* <Guide type="text" content={"123456"} position={["50%", "0"]} top={true} /> */}
                <Line position="time*temperature" color="city" />
                <Point position="time*temperature" color="city" size={2} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle"/>
              </Chart>
            </div>
          </section>

          <section className="details-listed">
            <h6 className="title">详细数据</h6>

            <div className="table-box">
              <Table rowKey={(item, index) => index} pagination={false} dataSource={detailsList} columns={columns} />
            </div>
          </section>
        </section>
      </section>
    )
  }
}

export default Dashboard;
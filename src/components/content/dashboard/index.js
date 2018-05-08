import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import { Chart, Tooltip, Axis, Legend, Line, Point, Guide } from 'viser-react';
import HttpRequest from '@/utils/fetch';
import './style.scss';

// 视图 -start
const DataSet = require('@antv/data-set');
const sourceData = [
  {time: "00:00", '今天': 62, '昨天': 41, '7天': 24, '30天': 28},
  {time: "01:00", '今天': 72, '昨天': 32, '7天': 26, '30天': 38},
  {time: "02:00", '今天': 67, '昨天': 33, '7天': 28, '30天': 49},
  {time: "03:00", '今天': 74, '昨天': 28, '7天': 26, '30天': 41},
  {time: "04:00", '今天': 73, '昨天': 36, '7天': 31, '30天': 35},
  {time: "05:00", '今天': 68, '昨天': 29, '7天': 31, '30天': 33},
  {time: "06:00", '今天': 78, '昨天': 37, '7天': 29, '30天': 30},
  {time: "07:00", '今天': 68, '昨天': 26, '7天': 31, '30天': 38},
  {time: "08:00", '今天': 73, '昨天': 33, '7天': 32, '30天': 28},
  {time: "09:00", '今天': 64, '昨天': 36, '7天': 24, '30天': 26},
  {time: "10:00", '今天': 72, '昨天': 33, '7天': 25, '30天': 33},
  {time: "11:00", '今天': 55, '昨天': 39, '7天': 32, '30天': 38},
  {time: "12:00", '今天': 59, '昨天': 41, '7天': 29, '30天': 52},
  {time: "13:00", '今天': 44, '昨天': 43, '7天': 35, '30天': 28},
  {time: "14:00", '今天': 58, '昨天': 50, '7天': 40, '30天': 31},
  {time: "15:00", '今天': 58, '昨天': 40, '7天': 43, '30天': 45},
  {time: "16:00", '今天': 52, '昨天': 44, '7天': 32, '30天': 23},
  {time: "17:00", '今天': 47, '昨天': 43, '7天': 36, '30天': 41},
  {time: "18:00", '今天': 68, '昨天': 49, '7天': 36, '30天': 34},
  {time: "19:00", '昨天': 51, '7天': 27, '30天': 31},
  {time: "20:00", '昨天': 41, '7天': 36, '30天': 29},
  {time: "21:00", '昨天': 55, '7天': 38, '30天': 27},
  {time: "22:00", '昨天': 48, '7天': 35, '30天': 38},
  {time: "23:00", '昨天': 62, '7天': 37, '30天': 45}
];
const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'fold',
  fields: ['今天', '昨天', '7天', '30天'],
  key: 'city',
  value: 'temperature',
});
const data = dv.rows;
const scale = [{
  dataKey: 'time',
  min: 0,
  max: 1,
}];
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

class Dashboard extends Component {
  state = {
    kpi: [{ // 指标列表
      name: '展示',
      ename: 'showNum',
      id: 1,
      active: true
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
      id: 5,
      active: false
    }],
    detailsList: [], // 详细数据列表
    visualizatData: [], // 趋势图数据
    newTabVal: 'showNum', // 当前tab
    visualList: [], // 当前视图数据
  }

  componentDidMount () {
    this.getCountDay()
    this.getCountVal()
  }

  // 指标切换
  switchTab = (data) => {
    let deepKpi = JSON.parse(JSON.stringify(this.state.kpi));

    deepKpi.forEach(item => {
      if (item.id === data.id) {
        item.active = true
      } else {
        item.active = false
      }
    })

    this.setState({
      kpi: deepKpi,
      newTabVal: data.ename
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
          day = "today"
        } else if (index === 1) {
          day = "yesterday"
        } else if (index === 2) {
          day = "sevenday"
        } else if (index === 3) {
          day = "month"
        }

        if (String(d.time) !== "-1") {
          obj[day] = d[newTabVal]
        }
      })

      visualList.push(obj)
    })

    console.log(visualList)

    this.setState({
      visualList
    })
  }

  render () {
    const { kpi, detailsList, visualList } = this.state;

    return (
      <section className="content-box dashboard-box">
        <div className="content-top-name">
          <h4>客户总览</h4>

          <div className="overview-box">
            <div className="block-group">
              <div className="name">
                <span>有效客户</span>
                <Icon type="info-circle-o" />
              </div>
              <p className="value" style={{ color: '#1f91fe' }}>10</p>
            </div>
            <div className="block-group">
              <div className="name">
                <span>待审客户</span>
                <Icon type="info-circle-o" />
              </div>
              <p className="value" style={{ color: '#00ccb2' }}>100</p>
            </div>
            <div className="block-group">
              <div className="name">
                <span>暂停客户</span>
                <Icon type="info-circle-o" />
              </div>
              <p className="value" style={{ color: '#7e37e1' }}>1000</p>
            </div>
          </div>
        </div>

        <main className="dashboard-main">
          <section className="tab-box">
            <ul className="dashboard-tabs">
              <li>小时指标</li>

              {
                kpi.map(item => {
                  return <li className={`can-point ${item.active ? 'active' : ''}`} key={item.id} onClick={this.switchTab.bind(this, item)}>{item.name}</li>
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
        </main>
      </section>
    )
  }
}

export default Dashboard;
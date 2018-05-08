import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import { Chart, Tooltip, Axis, Legend, Line, Point, Guide } from 'viser-react';
import HttpRequest from '@/utils/fetch';
import './style.scss';

// 视图 -start
const DataSet = require('@antv/data-set');
const sourceData = [
  {month: "00:00", today: 62, yesterday: 41, sevenday: 24, month1: 28},
  {month: "01:00", today: 72, yesterday: 32, sevenday: 26, month1: 38},
  {month: "02:00", today: 67, yesterday: 33, sevenday: 28, month1: 49},
  {month: "03:00", today: 74, yesterday: 28, sevenday: 26, month1: 41},
  {month: "04:00", today: 73, yesterday: 36, sevenday: 31, month1: 35},
  {month: "05:00", today: 68, yesterday: 29, sevenday: 31, month1: 33},
  {month: "06:00", today: 78, yesterday: 37, sevenday: 29, month1: 30},
  {month: "07:00", today: 68, yesterday: 26, sevenday: 31, month1: 38},
  {month: "08:00", today: 73, yesterday: 33, sevenday: 32, month1: 28},
  {month: "09:00", today: 64, yesterday: 36, sevenday: 24, month1: 26},
  {month: "10:00", today: 72, yesterday: 33, sevenday: 25, month1: 33},
  {month: "11:00", today: 55, yesterday: 39, sevenday: 32, month1: 38},
  {month: "12:00", today: 59, yesterday: 41, sevenday: 29, month1: 52},
  {month: "13:00", today: 44, yesterday: 43, sevenday: 35, month1: 28},
  {month: "14:00", today: 58, yesterday: 50, sevenday: 40, month1: 31},
  {month: "15:00", today: 58, yesterday: 40, sevenday: 43, month1: 45},
  {month: "16:00", today: 52, yesterday: 44, sevenday: 32, month1: 23},
  {month: "17:00", today: 47, yesterday: 43, sevenday: 36, month1: 41},
  {month: "18:00", today: 68, yesterday: 49, sevenday: 36, month1: 34},
  {month: "19:00", yesterday: 51, sevenday: 27, month1: 31},
  {month: "20:00", yesterday: 41, sevenday: 36, month1: 29},
  {month: "21:00", yesterday: 55, sevenday: 38, month1: 27},
  {month: "22:00", yesterday: 48, sevenday: 35, month1: 38},
  {month: "23:00", yesterday: 62, sevenday: 37, month1: 45}
];
const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'fold',
  fields: ['today', 'yesterday', 'sevenday', 'month1'],
  key: 'city',
  value: 'temperature',
});
const data = dv.rows;
const scale = [{
  dataKey: 'month',
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
                <Tooltip />
                <Axis />
                <Legend />
                {/* <Guide type="text" content={"123456"} position={["50%", "0"]} top={true} /> */}
                <Line position="month*temperature" color="city" />
                <Point position="month*temperature" color="city" size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle"/>
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
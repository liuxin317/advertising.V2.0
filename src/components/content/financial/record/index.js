import React, { Component } from 'react';
import { Icon, Button, DatePicker, Table } from 'antd';
import { Link } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import './style.scss';

// const dateFormat = 'YYYY-MM-DD HH:mm:ss',import moment from 'moment';
const { RangePicker } = DatePicker;
const columns = [{
  title: "日期",
  key: 'days',
  dataIndex: 'days',
  render: (text, record) => {
    return <span>{record.days ? record.days : record.days2}</span>
  }
}, {
  title: "存入（元）",
  key: 'inMoney',
  dataIndex: 'inMoney',
}, {
  title: "支出（元）",
  key: 'outMoney',
  dataIndex: 'outMoney',
}];

class Record extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    total: 0, // 总页码
    startTime: '',
    endTime: '',
    recordList: [], // 记录列表
  }
  
  componentDidMount () {
    this.getSelectLogs()
  }

  // 时间选择框监听
  onChangeDate = (date, dateString) => {
    this.setState({
      startTime: dateString[0] ? `${dateString[0]} 00:00:00` : '',
      endTime: dateString[1] ? `${dateString[1]} 23:59:59` : ''
    })
  }

  // 获取列表
  getSelectLogs = () => {
    const { match } = this.props;
    const { pageSize, pageNum, startTime, endTime } = this.state;

    HttpRequest("/sys/selectLogs", "POST", {
      channelId: match.params.id,
      pageSize,
      pageNum,
      startTime,
      endTime
    }, res => {
      this.setState({
        recordList: res.data.ls,
        total: res.data.totalNum
      })
    })
  }

  // 搜索
  onClickSearch = () => {
    this.setState({
      pageNum: 1
    }, () => {
      this.getSelectLogs()
    })
  }

  // 查询pageNum数据
  onChangePage = (number) => {
    this.setState({
      pageNum: number
    }, () => {
      this.getSelectLogs()
    })
  }

  // 无法选择未来的日子
	disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  }

  render () {
    const { match } = this.props;
    const { recordList, total, pageNum, pageSize } = this.state;

    return (
      <section className="content-box record-box">
        <div className="content-top">
          <h4><Link to="/content/financial"><Icon type="left" /> 财务记录</Link></h4>
        </div>

        <div className="record-table">
          <h6 className="name">{match.params.name}</h6>

          <div className="search-group">
            <RangePicker onChange={this.onChangeDate} disabledDate={this.disabledDate} />
            <Button className="search-button" type="primary" shape="circle" icon="search" onClick={this.onClickSearch} />
          </div>

          <div className="table-box">
            <Table 
              rowKey={(record, index) => index}
              columns={columns} 
              dataSource={recordList} 
              pagination={{ showQuickJumper: true, total, current: pageNum, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${total} 条`}}
            />
          </div>
        </div>
      </section>
    )
  }
}

export default Record;
import React, { Component } from 'react';
import { TreeSelect, Select, DatePicker, Input, Button, Icon, Tooltip, Table } from 'antd';
import moment from 'moment';
import HttpRequest from '@/utils/fetch';
import './style.scss';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Option = Select.Option;
const { RangePicker } = DatePicker;
/*二级 - start*/
const treeData = [{
  label: '广告位',
  value: '0-0',
  key: '0-0'
}, {
  label: '广告',
  value: '0-1',
  key: '0-1'
}, {
  label: '日期',
  value: '0-2',
  key: '0-2'
}];
/*二级 - end*/

/*表格 - start*/
const columns = [{
  title: "日期",
  key: 'time',
  dataIndex: 'time',
  sorter: (a, b) => moment(a.time).format('X') - moment(b.time).format('X'),
}, {
  title: "广告计划",
  key: 'inMoney',
  dataIndex: 'inMoney',
}, {
  title: "广告",
  key: 'outMoney',
  dataIndex: 'outMoney',
}, {
  title: "渠道",
  key: 'outMoney1',
  dataIndex: 'outMoney1',
}, {
  title: "广告位",
  key: 'outMoney2',
  dataIndex: 'outMoney2',
}, {
  title: "消耗金额（元）",
  key: 'outMoney3',
  dataIndex: 'outMoney3',
  sorter: (a, b) => a.outMoney3 - b.outMoney3
}, {
  title: "曝光度",
  key: 'outMoney4',
  dataIndex: 'outMoney4',
  sorter: (a, b) => a.outMoney4 - b.outMoney4,
}, {
  title: "点击数",
  key: 'outMoney5',
  dataIndex: 'outMoney5',
  sorter: (a, b) => a.outMoney5 - b.outMoney5,
}, {
  title: "点击率（%）",
  key: 'outMoney6',
  dataIndex: 'outMoney6',
  sorter: (a, b) => a.outMoney6 - b.outMoney6,
}];

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  time: '2017-05-20',
  inMoney: '西湖区湖底公园1号',
  outMoney: 36,  
  outMoney1: 20,  
  outMoney2: 40, 
  outMoney3: 50, 
  outMoney4: 11,  
  outMoney5: 77, 
  outMoney6: 88,
}, {
  key: '2',
  name: '胡彦祖',
  time: '2017-05-30',
  inMoney: '西湖区湖底公园1号',
  outMoney: 13,  
  outMoney1: 40,  
  outMoney2: 10, 
  outMoney3: 77, 
  outMoney4: 55,  
  outMoney5: 88, 
  outMoney6: 66,
}];
/*表格 - end*/

class RealTime extends Component {
  state = {
    second: '',
    startTime: '',
    endTime: '',
    pageNum: 1,
    pageSize: 10,
    total: 0, // 总页码
    reportList: [], // 列表
    userList: [], //客户列表
  }

  componentDidMount () {
    this.getUserList()
  }

  // 二级维度
  onChangeSecond = (value) => {
    console.log('onChange ', value, arguments);
    this.setState({ second: value });
  }

  // 客户
  handleChangeClient (value) {
    console.log(`selected ${value}`);
  }

  // 无法选择未来的日子
	disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  }

  // 时间选择框监听
  onChangeDate = (date, dateString) => {
    this.setState({
      startTime: dateString[0] ? `${dateString[0]}` : '',
      endTime: dateString[1] ? `${dateString[1]}` : ''
    })
  }

  //获取客户列表
  getUserList = () => {
    HttpRequest("/sys/userList", "POST", {
      pageNum: 1,
      pageSize: 100000
    }, res => {
      this.setState({
        userList: res.data.ls
      })
    })
  }

  render () {
    const { second, reportList, total, pageNum, pageSize, userList } = this.state;

    const tProps = {
      treeData,
      value: second,
      onChange: this.onChangeSecond,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '二级维度',
      className: 'ant-select-second',
      style: {
        width: 260,
      },
      dropdownStyle: { maxHeight: 400, overflow: 'auto' }
    };

    return (
      <section className="real-time-box">
        <div className="content-top">
          <h4>实时报表</h4>
        </div>

        <div className="search-group">
          <div className="group">
            <TreeSelect {...tProps} />
          </div>

          <div className="group">
            <Select 
              style={{ width: 150 }} 
              allowClear={true} 
              showSearch
              placeholder="客户" 
              onChange={this.handleChangeClient}
              optionFilterProp="children"
            >
              {
                userList.map(item => {
                  return <Option value={item.id} key={item.id}>{item.cName}</Option>
                })
              }
            </Select>
          </div>

          <div className="group">
            <RangePicker style={{ width: 250 }} onChange={this.onChangeDate} disabledDate={this.disabledDate} />
          </div>

          <div className="group">
            <Input placeholder="搜索" />
          </div>

          <div className="group">
            <Button className="search-button" type="primary" shape="circle" icon="search" />
          </div>

          <div className="group">
            <Tooltip placement="top" title="导出">
              <Button className="export-button" type="primary" icon="export" />
            </Tooltip>
          </div>
        </div>

        <div className="table-box">
          <Table 
            rowKey={(record, index) => index}
            columns={columns} 
            dataSource={dataSource} 
            pagination={{ showQuickJumper: true, total, current: pageNum, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${total} 条`}}
          />
        </div>
      </section>
    )
  }
}

export default RealTime;
import React, { Component } from 'react';
import { TreeSelect, Select, DatePicker, Input, Button, Icon, Tooltip, Table, message } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import HttpRequest from '@/utils/fetch';
import './style.scss';
import { encode } from 'punycode';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD';

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
  title: "广告计划",
  key: 'planName',
  dataIndex: 'planName',
  render: (text, record) => {
    return <Link to={`/content/report/depth/${record.planId}`}>{text}</Link>
  }
}, {
  title: "渠道",
  key: 'channelName',
  dataIndex: 'channelName',
}, {
  title: "消耗金额（元）",
  key: 'totalCost',
  dataIndex: 'totalCost',
  sorter: (a, b) => a.totalCost - b.totalCost
}, {
  title: "曝光度",
  key: 'totalShow',
  dataIndex: 'totalShow',
  sorter: (a, b) => a.totalShow - b.totalShow,
}, {
  title: "点击数",
  key: 'totalClick',
  dataIndex: 'totalClick',
  sorter: (a, b) => a.totalClick - b.totalClick,
}, {
  title: "点击率（%）",
  sorter: (a, b) => (a.totalClick / a.totalShow) - (b.totalClick / b.totalShow),
  render: (text, record) => {
    return <span>{(record.totalClick / record.totalShow) * 100}%</span>
  }
}];
/*表格 - end*/

class RealTime extends Component {
  state = {
    second: [], // 二级维度
    startTime: moment().subtract(7, 'days').format(dateFormat),
    endTime: moment().format(dateFormat),
    pageNum: 1,
    pageSize: 10,
    total: 0, // 总页码
    reportList: [], // 列表
    userList: [], //客户列表
    userId: -1, // 客户ID
    dataSource: [], // 表格数据
    name: '', // 搜索内容
    upLoadUrl: '', // 导出连接
  }

  componentDidMount () {
    this.getUserList()
    this.actualTime()
  }

  // 二级维度
  onChangeSecond = (value) => {
    this.setState({ second: value }, () => {
      this.actualTime()
    });
  }

  // 客户
  handleChangeClient = (value) => {
    this.setState({
      userId: value
    }, () => {
      this.actualTime()
    })
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
    }, () => {
      this.actualTime()
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

  // 提取插入的位置
  columnsSplice = (str, add) => {
    let num = '', isBol = false, targetStr = '';
    if (str === '渠道') {
      targetStr = '广告位'
    } else if (str === '广告计划') {
      targetStr = '广告'
    } else if (str === '日期') {
      targetStr = '日期'
    }

    columns.forEach((item, index) => {
      if (item.title === str) {
        num = index + 1;
      }
      if (item.title === targetStr) {
        isBol = true;
      }
    })

    if (!isBol) {
      if (str === '日期') {
        columns.unshift(add)
      } else {
        columns.splice(num, 0, add)
      }
    }
  }

  // 删除指定的表格列
  columnsRemove = (str) => {
    columns.forEach((item, index) => {
      if (item.title === str) {
        columns.splice(index, 1)
      }
    })
  }

  // 获取实时报表
  actualTime = () =>{
    const { startTime, endTime, pageNum, pageSize, second, userId, name } = this.state;
    let pos = false, ad = false, date = false;
    const setSecond = new Set(second);

    if (setSecond.has('0-1')) { // 广告
      ad = true
    }

    if (setSecond.has('0-0')) { // 广告位
      pos = true
    } 

    if (setSecond.has('0-2')) { // 日期
      date = true
    }

    HttpRequest("/count/actualTime", "POST", {
      startTime,
      endTime,
      pos,
      ad,
      date,
      userId,
      name,
      pageNum,
      pageSize
    }, res => {
      this.setState({
        dataSource: res.data.ls,
        total: res.data.totalNum
      })
    })
  }

  // 导出
  outCsv = () => {
    const { startTime, endTime, pageNum, pageSize, second, userId, name } = this.state;
    let pos = false, ad = false, date = false;
    const setSecond = new Set(second);

    if (setSecond.has('0-1')) { // 广告
      ad = true
    }

    if (setSecond.has('0-0')) { // 广告位
      pos = true
    } 

    if (setSecond.has('0-2')) { // 日期
      date = true
    }

    HttpRequest("/count/outCsv", "POST", {
      startTime,
      endTime,
      pos,
      ad,
      date,
      userId,
      pageNum,
      name,
      pageSize
    }, res => {
      this.setState({
        upLoadUrl: encodeURI(res.data)
      })

      window.open(encodeURI(res.data));
    })
  }

  // 导出判断
  isUpLoadUrl = () => {
    const { upLoadUrl } = this.state;
    if (!upLoadUrl) {
      message.error('导出出错！')
    } else {
      window.open(upLoadUrl);
    }
  }

  // 搜索内容
  onSearch = (value) => {
    this.setState({
      name: value
    }, () => {
      this.actualTime()
    })
  }

  render () {
    const { second, reportList, total, pageNum, pageSize, userList, dataSource } = this.state;

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

    // 根据勾选维度显示列表
    const setSecond = new Set(second);
    if (setSecond.has('0-0')) { // 广告位
      this.columnsSplice('渠道', {
        title: "广告位",
        key: 'posName',
        dataIndex: 'posName',
      })
    } else {
      this.columnsRemove('广告位')
    }
    
    if (setSecond.has('0-1')) { // 广告
      this.columnsSplice('广告计划', {
        title: "广告",
        key: 'adName',
        dataIndex: 'adName',
      })
    } else {
      this.columnsRemove('广告')
    }
    
    if (setSecond.has('0-2')) { // 日期
      this.columnsSplice('日期', {
        title: "日期",
        key: 'days',
        dataIndex: 'days',
        sorter: (a, b) => moment(a.days).format('X') - moment(b.days).format('X'),
      })
    } else {
      this.columnsRemove('日期')
    }

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
            <RangePicker defaultValue={[moment(moment().subtract(7, 'days').format(dateFormat), dateFormat), moment(new Date(), dateFormat)]} style={{ width: 250 }} onChange={this.onChangeDate} disabledDate={this.disabledDate} />
          </div>

          <div className="group">
            <Search
              placeholder="搜索"
              onSearch={this.onSearch}
              enterButton
            />
          </div>

          <div className="group">
            <Tooltip placement="top" title="导出">
              <Button className="export-button" type="primary" icon="export" onClick={this.outCsv} />
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
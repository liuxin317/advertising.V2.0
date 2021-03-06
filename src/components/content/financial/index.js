import React, { Component } from 'react';
import { Table, InputNumber, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import Customer from '@/components/common/customer';
import { getCookie } from '@/components/common/methods';
import './style.scss';

const userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : '';
const menus = userInfo.menus;

class Financial extends Component {
  state = {
    channelMoneyList: [], // 渠道列表
    visible: false, // 日限额弹窗显示状态
    rowData: "", // 当前列的数据
    dayLimit: "", // 当前日限额
    depositVisible: false, // 划账弹窗显示状态
    depositMoney: '', // 当前划账金额
    balanceList: [], // 余额去重累加
  }

  componentDidMount () {
    this.getChannelMoneyList()
  }

  // 获取渠道列表
  getChannelMoneyList = () => {
    HttpRequest("/sys/channelMoneyList", "POST", {}, res => {
      let balanceList = [];

      res.data.forEach((item, index) => {
        item.id = index;

        if (userInfo.userId === -1) { // 查询全部需要去重合并
          let obj = {};
          let num = 0;

          if (!balanceList.length) {
            obj.channelId = item.channelId;
            obj.name = item.name;
            obj.money = item.money;
          } else {
            balanceList.forEach(data => {
              if (data.channelId === item.channelId) {
                data.money += item.money
                num++
              }
            })

            if (num === 0) {
              obj.channelId = item.channelId;
              obj.name = item.name;
              obj.money = item.money;
            }
          }

          if (obj.name) {
            balanceList.push(obj)
          }
        }
      })
      
      this.setState({
        channelMoneyList: res.data,
        balanceList
      })
    })
  }

  // 开启编辑日限弹窗
  openDayLimitModal = (data, name) => {
    let obj = {}
    obj[name] = true;

    if (name === 'visible') {
      obj.dayLimit = data.dayLimit
    }

    this.setState({
      rowData: data,
      ...obj,
    })
  }

  // 确认编辑日限弹窗
  handleOkDayLinmit = () => {
    const { dayLimit, rowData } = this.state;

    if (!dayLimit) {
      message.warning('不能为空！')
    } else {
      HttpRequest("/sys/updateDayLimit", "POST", {
        dayLimit,
        channelId: rowData.channelId,
        userChannelId: rowData.userChannelId
      }, res => {
        message.success('修改成功！')
        this.setState({
          dayLimit: '',
          visible: false
        })
        this.getChannelMoneyList()
      })
    }
  }

  // 取消编辑日限弹窗
  handleCancelDayLinmit = (name) => {
    let obj = {}
    obj[name] = false;

    this.setState({
      ...obj,
      dayLimit: '',
      depositMoney: ''
    })
  }

  // 监听数字框
  onChangeInputNumber = (name, val) => {
    let obj = {};
    obj[name] = val;
    this.setState({
      ...obj
    })
  }

  // 划账确认弹窗
  handleOkDeposit = () => {
    const { depositMoney, rowData } = this.state;

    if (!depositMoney) {
      message.warning('不能为空！')
    } else if (Number(depositMoney) < 500) {
      message.warning('最低金额500')
    }else {
      HttpRequest("/sys/splitMoney", "POST", {
        money: depositMoney,
        channelId: rowData.channelId,
        userChannelId: rowData.userChannelId
      }, res => {
        message.success('转账成功！')
        this.setState({
          depositMoney: '',
          depositVisible: false
        })
        this.getChannelMoneyList()
      })
    }
  }

  render () {
    const { channelMoneyList, rowData, dayLimit, depositMoney, balanceList } = this.state;
    let channelBalanceList = channelMoneyList;
    let columns = [{
      title: '客户ID',
      dataIndex: 'userId',
      key: 'userId',
    }, {
      title: '渠道',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '日限额(元/天)',
      dataIndex: 'dayLimit',
      key: 'dayLimit',
      render: (text, record) => {
        return (
          <div className="operation">
            <span>{text}</span>
            {
              menus.indexOf('153') > -1
              ?
              <a style={{ marginLeft: 10 }} onClick={this.openDayLimitModal.bind(this, record, "visible")}>编辑</a>
              :
              ''
            }
          </div>
        )
      }
    }, {
      title: '剩余余额',
      dataIndex: 'money',
      key: 'money',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <div className="operation">
            {
              menus.indexOf('152') > -1
              ?
              <a style={{ marginRight: 10 }} onClick={this.openDayLimitModal.bind(this, record, "depositVisible")}>划账</a>
              :
              ''
            }
            {
              menus.indexOf('154') > -1
              ?
              <Link to={encodeURI(`/content/financial-record/${record.userChannelId}/${record.name}`)}>财务记录</Link>
              :
              ''
            }
          </div>
        )
      }
    }];

    if (menus.indexOf('152') === -1 && menus.indexOf('154') === -1) {
      columns.splice((columns.length -1), 1)
    }

    if (userInfo.userId === -1) {
      channelBalanceList = balanceList
    }

    return (
      <section className="content-box financial-box">
        {/* 切换客户 */}
        <Customer />

        <div className="content-top">
          <h4>财务管理</h4>
        </div>

        <div className="balance-listed">
          <h6 className="name">余额</h6>

          <ul className="list-box">
            {
              channelBalanceList.map(item => {
                return (
                  <li key={item.channelId}>
                    <p className="money"><em>{item.money}</em>元</p>
                    <p className="title">{item.name}</p>
                  </li>
                )
              })
            }
          </ul>
        </div>

        <div className="table-box">
            <Table 
              rowKey={record => record.id}
              columns={columns} 
              dataSource={channelMoneyList} 
              pagination={false}
            />
        </div>

        {/* 日限额弹窗 */}
        <Modal
          title="编辑日限额"
          maskClosable={false}
          visible={this.state.visible}
          onOk={this.handleOkDayLinmit}
          onCancel={this.handleCancelDayLinmit.bind(this, "visible")}
        >
          <InputNumber value={dayLimit} style={{ width: '100%' }} onChange={this.onChangeInputNumber.bind(this, 'dayLimit')} />
        </Modal>

        {/* 划账弹窗 */}
        <Modal
          title="划账"
          maskClosable={false}
          visible={this.state.depositVisible}
          onOk={this.handleOkDeposit}
          onCancel={this.handleCancelDayLinmit.bind(this, "depositVisible")}
        >
          <p>划账给 { rowData ? rowData.name : '' }</p>
          <div>
            <InputNumber value={depositMoney} min={0} style={{ width: '90%' }} onChange={this.onChangeInputNumber.bind(this, 'depositMoney')} /> 元
          </div>
          <p style={{marginTop: 10}}>最低金额：500元</p>
        </Modal>
      </section>
    )
  }
}

export default Financial;
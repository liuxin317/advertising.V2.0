import React, { Component } from 'react';
import { Select } from 'antd';
import HttpRequest from '@/utils/fetch';
import { getCookie, setCookie } from '@/components/common/methods';
import './style.scss';

const Option = Select.Option;
let userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : '';

class Customer extends Component {
  state = {
    userList: [], // 广告主列表
    nowValue: '', // 当前广告主
  }

  componentDidMount () {
    this.getUserList()
  }

  handleChange = (value) => {
    userInfo.userId = value
    setCookie('userInfo', JSON.stringify(userInfo))

    this.setState({
      nowValue: value
    }, () => {
      window.location.reload()
    })
  }

  //获取客户列表
  getUserList = () => {
    HttpRequest("/sys/userList", "POST", {
      pageNum: 1,
      pageSize: 100000
    }, res => {
      this.setState({
        userList: res.data.ls,
        nowValue: userInfo.userId ? userInfo.userId : res.data.ls[0].id
      }, () => {
        if (!userInfo.userId) {
          userInfo.userId = res.data.ls[0].id
          setCookie('userInfo', JSON.stringify(userInfo))
        }
      })
    })
  }

  render () {
    const { userList, nowValue } = this.state;

    return (
      <section className="customer-box">
        <div className="customer-selected">
          <label className="name" htmlFor="name">客户：</label>
          <Select value={nowValue} style={{ width: 200 }} onChange={this.handleChange}>
            {
              userList.map(item => {
                return <Option value={item.id} key={item.id}>{item.cName}</Option>
              })
            }
          </Select>
        </div>
      </section>
    )
  }
}

export default Customer;
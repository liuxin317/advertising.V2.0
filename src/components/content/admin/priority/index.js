import React, { Component } from 'react';
import { Select, Button, Table, Icon, InputNumber, message } from 'antd';
import HttpRequest from '@/utils/fetch';
import './style.scss';

const Option = Select.Option;

class Priority extends Component {

  state = {
    channelList: [], // 渠道列表
    channelId: '', // 当前渠道
    posList: [], // 广告位列表
    posId: '', // 当前广告位
    userPosList: [], // 权重列表
  }

  componentDidMount () {
    this.getChannels()
  }

  // 获取渠道
  getChannels = () => {
    HttpRequest("plan/channels", "POST", {}, res => {
      this.setState({
        channelList: res.data,
        channelId: res.data.length ? res.data[0].id : ''
      }, () => {
        this.getPosList(1)
      })
    })
  }

  // 监听下拉列表
  handleChange = (name, value) => {
    let obj = {};
    obj[name] = value;
    this.setState({
      ...obj
    }, () => {
      if (name === 'channelId') {
        this.getPosList()
      }
    })
  }

  // 查询广告位
  getPosList = (type) => {
    const { channelId } = this.state;

    HttpRequest("plan/queryPosList", "POST", {
      channelId
    }, res => {
      this.setState({
        posList: res.data,
        posId: res.data.length ? res.data[0].id : ''
      }, () => {
        if (type === 1) {
          this.getSelectUserPos()
        }
      })
    })
  }

  // 权重列表
  getSelectUserPos = () => {
    const { posId } = this.state;
    HttpRequest("sys/selectUserPos", "POST", {
      posId
    }, res => {
      this.setState({
        userPosList: res.data
      })
    })
  }

  // 减权重
  reduceWeight = (data) => {
    const { userPosList, posId } = this.state;
    let deepUserPosList = JSON.parse(JSON.stringify(userPosList));
    let weight = Number(data.weight) - 1;
    let num = 0;

    deepUserPosList.forEach(item => {
      if (data.id !== item.id) {
        if (weight === item.weight) {
          num++
        }
      } else {
        item.weight = weight
      }
    })

    if (num > 0) {
      message.warning('权重不能重复！')
    } else {
      this.updateWeight({ posId, userPosId: data.userPosId, weight });
    }

    this.setState({
      userPosList: deepUserPosList
    })
  }

  // 加权重
  addWeight = (data) => {
    const { userPosList, posId } = this.state;
    let deepUserPosList = JSON.parse(JSON.stringify(userPosList));
    let weight = Number(data.weight) + 1;
    let num = 0;

    deepUserPosList.forEach(item => {
      if (data.id !== item.id) {
        if (weight === item.weight) {
          num++
        }
      } else {
        item.weight = weight
      }
    })

    if (num > 0) {
      message.warning('权重不能重复！')
    } else {
      this.updateWeight({ posId, userPosId: data.userPosId, weight });
    }

    this.setState({
      userPosList: deepUserPosList
    })
  }

  // 监听数字框
  onChangeInputNumber = (data, value) => {
    const { userPosList } = this.state;
    let deepUserPosList = JSON.parse(JSON.stringify(userPosList));
    let weight = value;

    deepUserPosList.forEach(item => {
      if (data.id !== item.id) {
        
      } else {
        item.weight = weight
      }
    })

    this.setState({
      userPosList: deepUserPosList
    })
  }

  // 修改权重
  updateWeight = (rowData) => {
    HttpRequest("sys/updateWeight", "POST", {
      ...rowData
    }, res => {
      message.success('修改成功！')
    })
  }

  render () {
    const { channelList, channelId, posList, posId, userPosList } = this.state;
    const columns = [{
      title: '广告主',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '权重等级',
      dataIndex: 'weight',
      key: 'weight',
      render: (text, record) => {
        return (
          <div className="weight-box">
            <Icon className="icon" onClick={this.reduceWeight.bind(this, record)} type="minus-circle" />
            <InputNumber className="input-number" min={0} max={100} value={text} onChange={this.onChangeInputNumber.bind(this, record)} />
            <Icon className="icon" onClick={this.addWeight.bind(this, record)} type="plus-circle" />
          </div>
        )
      }
    }]

    return (
      <section className="priority-box">
        <div className="content-top">
          <h4>权重调控</h4>
        </div>

        <div className="priority-main">
          <div className="conditions">
            <Select value={ channelId } style={{ width: 180 }} onChange={this.handleChange.bind(this, 'channelId')}>
              {
                channelList.map(item => {
                  return <Option value={item.id} key={item.id}>{item.name}</Option>
                })
              }
            </Select>

            <Select value={ posId } style={{ width: 180, margin: '0 10px' }} onChange={this.handleChange.bind(this, 'posId')}>
              {
                posList.map(item => {
                  return <Option value={item.id} key={item.id}>{item.name}</Option>
                })
              }
            </Select>

            <Button className="search-button" type="primary" shape="circle" icon="search" onClick={this.getSelectUserPos} />
          </div>

          <div className="table-box">
            <Table rowKey={(item, index) => index} pagination={false} dataSource={userPosList} columns={columns} />
          </div>
        </div>
      </section>
    )
  }
}

export default Priority;
import React, { Component } from 'react';
import { Select, Button, InputNumber, message, Modal, Radio } from 'antd';
import HttpRequest from '@/utils/fetch';
import './style.scss';

const Option = Select.Option;
const RadioGroup = Radio.Group;

class LPRegulation extends Component {
  state = {
    channelList: [], // 渠道列表
    channelId: '', // 当前渠道
    posList: [], // 广告位列表
    nowPos: '', // 当前广告数据
    visible: false, // 弹窗状态
    type: 9, // 出价方式9 - CPM 10- CPC
    money: '', // 建议出价
    minMoney: '' // 媒体出价
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
  handleChange = (name, value, option) => {
    let obj = {};
    if (name === 'nowPos') {
      obj[name] = option.props.item
      obj['type'] = option.props.item.type
    } else {
      obj[name] = value
    }
    
    this.setState({
      ...obj
    }, () => {
      if (name === 'channelId') {
        this.getPosList(1)
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
        nowPos: res.data[0],
        type: res.data[0] ? res.data[0].type : 9
      })
    })
  }

  // 弹窗确认按钮
  handleOk = () => {
    const { minMoney } = this.state;

    if (!minMoney) {
      message.warning('请填写媒体底价！')
    } else {
      this.updatePosDetail()
    }
  }

  // 弹窗取消按钮
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  // 监听出价方式
  onChangeType = (e) => {
    this.setState({
      type: e.target.value
    })
  }

  // 打开编辑弹窗
  openEditModal = () => {
    this.setState({
      visible: true,
      minMoney: '',
      money: ''
    })
  }

  // 监听媒体出价
  onChangeInputNumber = (value) => {
    let money = value * (1 + 0.3);
    this.setState({
      minMoney: value,
      money
    })
  }

  // 修改底价
  updatePosDetail = () => {
    const { type, minMoney, nowPos, posList, money } = this.state;
    let deepNowPos = JSON.parse(JSON.stringify(nowPos));
    let deepPosList = JSON.parse(JSON.stringify(posList));

    HttpRequest("/plan/updatePosDetail", "POST", {
      type,
      minMoney,
      id: nowPos.id
    }, res => {
      message.success("修改成功！")
      deepNowPos.type = type;
      deepNowPos.minMoney = minMoney;
      deepNowPos.money = money;

      deepPosList.forEach((item, index) => {
        if (item.id === deepNowPos.id) {
          deepPosList[index] = deepNowPos
        }
      })

      this.setState({
        posList: deepPosList,
        nowPos: deepNowPos,
        visible: false
      })
    })
  }

  render () {
    const { channelList, channelId, posList, nowPos, type, money, minMoney} = this.state;
    
    return (
      <section className="regulation-box">
        <div className="content-top">
          <h4>底价调控</h4>
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

            <Select value={ nowPos ? nowPos.id : '' } style={{ width: 180, margin: '0 10px' }} onChange={this.handleChange.bind(this, 'nowPos')}>
              {
                posList.map(item => {
                  return <Option value={item.id} key={item.id} item={item}>{item.name}</Option>
                })
              }
            </Select>
          </div>
          {
            posList.length
            ?
            <div className="regulation-main">
              <div className="pos-money">
                <div className="pos-row">
                  <label className="key" htmlFor="name">当前出价方式：</label>
                  <em className="value">{ nowPos ? nowPos.type === 9 ? 'CPM' : nowPos.type === 10 ? 'CPC' : '' : '' }</em>
                </div>

                <div className="pos-row">
                  <label className="key" htmlFor="name">当前媒体底价：</label>
                  <em className="value">{ nowPos ? nowPos.minMoney : ''}</em>
                </div>

                <div className="pos-row">
                  <label className="key" htmlFor="name">当前建议出价：</label>
                  <em className="value">{ nowPos ? nowPos.money : ''}</em>
                </div>
              </div>

              <Button style={{ width: 120, marginTop: 20 }} onClick={this.openEditModal}>编辑</Button>
            </div>
            :
            <p style={{ marginTop: 50, textAlign: 'center' }}>无数据</p>
          }
        </div>

        {/* 编辑弹窗 */}
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <div className="pos-money">
            <div className="pos-row">
              <label className="key" htmlFor="name">当前出价方式：</label>
              <em className="value">{ nowPos ? nowPos.type === 9 ? 'CPM' : nowPos.type === 10 ? 'CPC' : '' : '' }</em>
            </div>

            <div className="pos-row">
              <label className="key" htmlFor="name">当前媒体底价：</label>
              <em className="value">{ nowPos ? nowPos.minMoney : ''}</em>
            </div>

            <div className="pos-row">
              <label className="key" htmlFor="name">当前建议出价：</label>
              <em className="value">{ nowPos ? nowPos.money : ''}</em>
            </div>

            <div className="pos-row">
              <label className="key" htmlFor="name">更新出价方式：</label>
              <div className="value">
                <RadioGroup onChange={this.onChangeType} value={type}>
                  <Radio value={9}>CPM</Radio>
                  <Radio value={10}>CPC</Radio>
                </RadioGroup>
              </div>
            </div>

            <div className="pos-row">
              <label className="key" htmlFor="name">更新媒体底价：</label>
              <div className="value">
                <InputNumber value={minMoney} min={0} style={{ width: 120 }} onChange={this.onChangeInputNumber} />
              </div>
            </div>

            <div className="pos-row">
              <label className="key" htmlFor="name">更新建议出价：</label>
              <em className="value">{money}</em>
            </div>
          </div>
        </Modal>
      </section>
    )
  }
}

export default LPRegulation;
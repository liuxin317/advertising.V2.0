import React, { Component } from 'react';
import { Input, Select, Radio, Checkbox, DatePicker, Button } from 'antd';
import HttpRequest from '@/utils/fetch';
import './style.scss';
import Store from '@/store';
import Type from '@/action/Type';

// 广告计划
import AdvertProgram from './component/advertProgram';
// 广告板块
import Advertising from './component/advertising';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

class CreatePlan extends Component {
  state = {
    channelsType: 1, // 渠道类型
    plainOptions: [], // 渠道集合
    moneyType: 1, // 预算类型（1、总预算；2、每日预算）
    launchType: 1, // 投放类型（1、均匀；2、加速）
  }

  componentDidMount () {
    Store.dispatch({ type: Type.LEFT_MENU_STATUS, payload: { leftMenuStatus: 2 } });

    // this.getPutChannels()

    // 监听竖向滚动条
    window.onscroll = function (e) {
      var e = e || window.event;
      var scrolltop = document.documentElement.scrollTop||document.body.scrollTop;
      
      if (scrolltop >= 60) {
        document.querySelector('.menu-plan-box').style.top = 0;
      } else {
        document.querySelector('.menu-plan-box').style.top = (60 - scrolltop) + 'px';
      }
    }
  }

  componentWillUnmount () {
    Store.dispatch({ type: Type.LEFT_MENU_STATUS, payload: { leftMenuStatus: 1 } });
  }

  // 监听设置广告计划
  setPlanHandleChange = (value) => {
    this.setState({
      moneyType: value
    })
  }

  // 监听渠道类别
  onChangeChannelType = (e) => {
    this.setState({
      channelsType: e.target.value
    }, () => {
      this.getPutChannels()
    })
  }

  // 监听选择的渠道
  onChangeChannels = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }

  // 获取渠道集合
  getPutChannels = () => {
    const { channelsType } = this.state;
    
    HttpRequest("/plan/putChannels", "POST", {
      type: channelsType
    }, res => {
      this.setState({
        plainOptions: res.data
      })
    })
  }

  render () {
    const { channelsType, plainOptions, launchType } = this.state;

    return (
      <section className="content-box create-plan">
        {/* 广告计划 */}
        <AdvertProgram />

        {/* 广告板块 */}
        <Advertising />

        {/* 预算 */}
        {/* <div className="create-group">
          <div className="name">
            <Select defaultValue="1" style={{ width: 158, height: 36 }} onChange={this.setPlanHandleChange}>
              <Option value="1">广告计划总预算</Option>
              <Option value="2">广告计划每日预算</Option>
            </Select>
          </div>
          <div className="input-group">
            <Input placeholder="请输入预算" />
          </div>
        </div> */}
  
        {/* 时间对应的tabs */}
        {/* <div className="create-group">
          <div className="name"></div>
          <div className="input-group">
            {
              modeTime === 'day'
              ?
              <AllDay childrenGetTimeSelectedData={ this.childrenGetTimeSelectedData } />
              :
              <TimeSelected childrenGetTimeSelectedData={ this.childrenGetTimeSelectedData } />
            }
          </div>
        </div> */}
        
        {/* 确定 or 取消 */}
        {/* <div className="create-group">
          <div className="name"></div>
          <div className="input-group">
            <Button type="primary">确定并新建广告组</Button>
            <Button style={{ marginLeft: 30 }}>取消</Button>
          </div>
        </div> */}
      </section>
    )
  }
}

export default CreatePlan;
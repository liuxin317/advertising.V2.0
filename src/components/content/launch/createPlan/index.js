import React, { Component } from 'react';
import HttpRequest from '@/utils/fetch';
import './style.scss';
import Store from '@/store';
import Type from '@/action/Type';

// 广告计划
import AdvertProgram from './component/advertProgram';
// 广告板块
import Advertising from './component/advertising';
// 广告创意
import AdvertCreative from './component/advertCreative';

class CreatePlan extends Component {
  state = {
    channelsType: 1, // 渠道类型
    plainOptions: [], // 渠道集合
    moneyType: 1, // 预算类型（1、总预算；2、每日预算）
    launchType: 1, // 投放类型（1、均匀；2、加速）
    plan: "", // 返回的广告计划数据
    advertData: "", // 返回的广告数据
    originalitys: "", // 创意集合
  }

  componentDidMount () {
    Store.dispatch({ type: Type.LEFT_MENU_STATUS, payload: { leftMenuStatus: 2 } });

    // this.getPutChannels()
  }

  componentWillUnmount () {
    Store.dispatch({ type: Type.LEFT_MENU_STATUS, payload: { leftMenuStatus: 1 } });
  }

  // 获取创建广告计划ID
  getPlanID = (data) => {
    console.log(data)
    this.setState({
      plan: data
    })
  }

  // 获取广告板块的数据集合
  getAdvertData = (data) => {
    console.log(data)
    this.setState({
      advertData: data
    })
  }

  // 获取广告创意集合
  getOriginalitys = (data) => {
    console.log(data)
    this.setState({
      originalitys: data
    }, () => {
      this.addAd()
    })
  }

  // 提交创建
  addAd = () => {
    const { plan, advertData, originalitys } = this.state;
    let obj = Object.assign({}, plan, advertData, {originalitys});
    
    HttpRequest("/plan/addAdp", "POST",{
      ad: JSON.stringify(obj)
    }, res => {

    })
  }

  render () {
    return (
      <section className="content-box create-plan">
        {/* 广告计划 */}
        <AdvertProgram getPlanID={ this.getPlanID } />

        {/* 广告板块 */}
        <Advertising getAdvertData={ this.getAdvertData } />
 
        {/* 广告创意 */}
        <AdvertCreative getOriginalitys={ this.getOriginalitys } />
      </section>
    )
  }
}

export default CreatePlan;
import React, { Component } from 'react';
import { message } from 'antd';
import { Redirect } from 'react-router-dom';
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
    one: false, // 广告计划下一步状态
    two: false, // 广告下一步
    redirect: false, // 创建成功状态
    selectedRows: "", // 关联广告位
  }

  componentDidMount () {
    Store.dispatch({ type: Type.LEFT_MENU_STATUS, payload: { leftMenuStatus: 2 } });
  }

  componentWillUnmount () {
    Store.dispatch({ type: Type.LEFT_MENU_STATUS, payload: { leftMenuStatus: 1 } });
  }

  // 获取创建广告计划ID
  getPlanID = (data) => {
    console.log(data)
    this.setState({
      plan: data,
      one: true
    })
  }

  // 获取广告板块的数据集合
  getAdvertData = (data, selectedRows) => {
    console.log(data)
    this.setState({
      advertData: data,
      selectedRows,
      two: true
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
    let obj = Object.assign({}, plan, advertData);

    originalitys.forEach((item, index) => {
      delete originalitys[index]['type']
    })

    console.log(originalitys)
    
    HttpRequest("/plan/addAdp", "POST",{
      ad: JSON.stringify(obj),
      maJson: JSON.stringify(originalitys)
    }, res => {
      message.success('创建成功！')
      setTimeout(() => {
        this.setState({
          redirect: true
        })
      }, 600)
    })
  }

  render () {
    const { one, two, redirect, selectedRows } = this.state;

    if (redirect) {
      return <Redirect push to="/content/launch" />
    }

    return (
      <section className="content-box create-plan">
        {/* 广告计划 */}
        <AdvertProgram one={ one } getPlanID={ this.getPlanID } />

        {/* 广告板块 */}
        <Advertising one={ one } two={ two } getAdvertData={ this.getAdvertData } />
 
        {/* 广告创意 */}
        <AdvertCreative two={ two } getOriginalitys={ this.getOriginalitys } selectedRows={selectedRows} />
      </section>
    )
  }
}

export default CreatePlan;
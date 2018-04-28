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

    // 监听竖向滚动条
    window.onscroll = function (e) {
      // var e = e || window.event;
      var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
      
      if (scrolltop >= 60) {
        document.querySelector('.menu-plan-box').style.top = 0;
      } else if (scrolltop > 0 && scrolltop < 60) {
        document.querySelector('.menu-plan-box').style.top = (60 - scrolltop) + 'px';
      } else if (scrolltop === 0) {
        document.querySelector('.menu-plan-box').style.top = 60 + 'px';
      }
    }
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
      ad: JSON.stringify({"planId":34,"name":"plan10-02","openUrl":"http://www.baidu.com","viewControl":"1、适当放松放松，2、电风扇","clickControl":"1、适当放松放松，2、电风扇","position":1,"mode":2,"dataType":2,"sex":2,"age":"1,5,2,6,3","area":"北京市,天津市,河北省,山西省","system":"1,2","netType":"2,1,5","netComp":"2,1","offLinePerson":"D://person//vpn.txt","blackPerson":"阿大使","whitePerson":"阿斯达","startTime":"2018-04-28","endTime":"2018-05-29","putTime":"星期四：00:00 ~ 23:59,星期五：00:00 ~ 23:59,星期六：00:00 ~ 23:59","channelGather":"1,2,3,4","cycle":{"type":1,"dateShowType":"2","dateClickType":"2","clickNum":20,"showNum":20},"bidSetting":{"bidWay":2,"money":10,"exposureNum":10,"clickLimit":10},"originalitys":[{"type":1,"creativeImgs":["D://material//login_bk02.jpg"],"headPortrait":"D://logo//login_bk03.jpg","copyWrite":"阿斯达斯的","description":"阿斯达斯"},{"type":2,"creativeImgs":["D://material//login_bk02 (1) (1).jpg"],"headPortrait":"D://logo//login_bk03.jpg","copyWrite":"阿斯达","description":"阿斯达"}]})
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
import React, { Component } from 'react';
import { Tabs, Button, Select, Input, InputNumber, Radio, message } from 'antd';
import HttpRequest from '@/utils/fetch';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class AdvertProgram extends Component {
  state = {
    selectdAdvertPlan: 1, // 选择的新建/已有广告计划
    putType: 1, // 投放类型（1、均匀；2、加速）
    existingID: '', // 选择已有的广告ID
    newID: '', // 新建的广告ID
    dayMoney: '', //每日预算
    planName: '', // 计划名称
    havePlans: [], // 已有广告列表
    isClickNext: false, // 是否通过下一步
  }

  componentDidMount () {
    // this.getPlanList()
  }

  // tabs切换
  tabCallback = (key) => {
    this.setState({
      selectdAdvertPlan: key
    })
  }

  // 监听选择已有的广告计划
  handleChangeHavePlans = (value) => {
    this.setState({
      existingID: value
    })
  }

  // 投放类型选择
  onChangeLaunchType = (e) => {
    this.setState({
      putType: e.target.value
    })
  }

  // 监听每日预算的值
  onChangeInput = (value) => {
    this.setState({
      dayMoney: value
    })
  }

  // 监听新建计划名称
  onChangePlanName = (e) => {
    this.setState({
      planName: e.target.value.trim()
    })
  }

  // 广告计划下一步
  nextStep = () => {
    const { selectdAdvertPlan, existingID, dayMoney, planName } = this.state;

    if (Number(selectdAdvertPlan) === 1) {
      if (!existingID) {
        message.warning("请选择已有的广告计划！")
      } else {
        this.setState({
          isClickNext: true
        })

        this.props.getPlanID({planId: existingID})
      }
    } else {
      if (!dayMoney) {
        message.warning("请输入每日预算！")
      } else if (!planName) {
        message.warning("请输入计划名称！")
      } else {
        this.addPlan()
      }
    }
  }

  // 创建广告计划
  addPlan = () => {
    const { dayMoney, planName, putType } = this.state;
    let planJson = JSON.stringify({dayMoney, planName, putType});

    HttpRequest("/plan/addPlan","POST", {
      planJson
    }, res => {
      message.success("创建成功！")
      this.props.getPlanID({planId: res.data.id})
      this.setState({
        isClickNext: true
      })
    })
  }

  // 获取已有的广告列表
  getPlanList = () => {
    HttpRequest("/plan/planList", "POST", {
      type: 1, 
      pageSize: 100000,
      pageNum: 1
    }, res => {
      this.setState({
        havePlans: res.data.ls
      })
    })
  }

  render () {
    const { putType, isClickNext, selectdAdvertPlan, havePlans } = this.state;
    
    return (
      <section className="create-plan__group">
        <h2 id="selected_plan">广告计划</h2>

        <Tabs defaultActiveKey="1" animated={false} onChange={this.tabCallback}>
          <TabPane tab="选择已有广告计划" key="1" disabled={Number(selectdAdvertPlan) === 1 ? false : isClickNext}>
            <Select 
              placeholder="选择已有广告计划" 
              style={{ width: '650px' }} 
              onChange={ this.handleChangeHavePlans }
              disabled={isClickNext}
            >
              {
                havePlans.map(item => {
                  return <Option key={item.id} value={item.id}>{item.planName}</Option>
                })
              }
            </Select>
          </TabPane>

          <TabPane tab="新建广告计划" key="2" disabled={Number(selectdAdvertPlan) === 2 ? false : isClickNext}>
            <h3>计划设置</h3>

            <div className="create-group">
              <label className="name" htmlFor="name">广告每日预算：</label>
              <div className="input-group">
                <InputNumber disabled={isClickNext} min={1} onChange={this.onChangeInput} placeholder="请输入预算" />
              </div>
            </div>

            <div className="create-group">
              <label className="name" htmlFor="name">广告计划名称：</label>
              <div className="input-group">
                <Input disabled={isClickNext} min={1} onChange={this.onChangePlanName} placeholder="请输入广告计划名称" />
              </div>
            </div>

            <div className="create-group">
              <label className="name" htmlFor="name">投放控制：</label>
              <div className="input-group">
                <div className="channel-type launch-type">
                  <RadioGroup disabled={isClickNext} onChange={this.onChangeLaunchType} value={putType}>
                    <Radio value={1}>均匀投放</Radio>
                    <Radio value={2}>加速投放</Radio>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>

        <Button type="primary" className="next-step" onClick={this.nextStep}>下一步</Button>
      </section>
    )
  }
}

export default AdvertProgram;
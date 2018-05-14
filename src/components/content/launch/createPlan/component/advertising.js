import React, { Component } from 'react';
import { Input, Radio, Icon, Checkbox, Row, Col, Table, Collapse, Upload, message, Button, Select, DatePicker, InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import { getCookie } from '@/components/common/methods';
import HttpRequest from '@/utils/fetch';
import Store from '@/store';
import Type from '@/action/Type';
// 地区联动
import RegLinkage from './regLinkage';
// 时间段选择组件
import TimeSelected from '../../component/common/timeSelected';
// 全天选择组件
import AllDay from '../../component/common/allDay';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const radioStyle = {
  display: 'block',
  height: '30px',
  marginBottom: '10px',
  lineHeight: '30px',
};
let conditionalShow = { is: false }, conditionalClick = { is: false }; // 监听的条件判断

class Advertising extends Component {
  state = {
    position: 100, // 广告版位类型(1、PC，2、MOB)
    advertPosition: [{ // 广告版位
      name: 'PC',
      icon: 'desktop',
      id: 100,
      active: true
    }, {
      name: 'MOB',
      icon: 'mobile',
      id: 101,
      active: false
    }],
    mode: 200, // 广告版位渠道类型（200、通用，201、选择渠道）
    dataType: 500, // 流量类型（500、移动WAP，501、APP）
    sex: 1, // 性别(1、男，2、女)
    fileList: [], // 上传列表
    offLinePerson: '', // 文件上传成功后返回地址离线人群包
    blackWhiteList: [{ // 黑白名单
      name: '设置黑名单',
      id: 1,
      active: true
    }, {
      name: '设置白名单',
      id: 2,
      active: false
    }],
    blackWhiteType: 1, // 黑白type
    modeTime: 'day', // 投放時間切換狀態
    cycle: 11, // 周期类别（11、自然, 12、设置）
    money: '', // 出价额度
    name: '', // 广告名称
    openUrl: '', // 落地页链接
    viewControl: '', // 展示监测
    clickControl: '', // 点击监测
    channelGather: '', // 渠道集合
    advertGather: '', // 广告形式集合
    area: '', // 地区集合
    system: '', // 操作系统
    netType: '', // 联网方式
    netComp: '', // 联动运营商
    offLinePerson: '', // 离线人群包
    dmpPerson: '', // DMP人群
    blackPerson: '', // 黑名单
    whitePerson: '', // 白名单
    blackWhiteValue: '', // 黑白输入框的内容
    startTime: '', // 投放开始时间
    endTime: '', // 投放结束时间
    putTime: '', // 投放时间段
    dateShowType: "1", // 1、每日；2、每周
    dateClickType: "1", // 1、每日；2、每周
    showNum: '', // 展示次数
    clickNum: '', // 点击次数
    bidWay: 9, // 出价方式9-cpm、10-cpc
    exposureNum: '', // 曝光次数 
    clickLimit: '', // 点击上限
    isClickNext: false, // 是否通过下一步
    channelsList: [], // 渠道列表
    adPos: '', // 获取广告版位ids
    dataSource: [], // 广告版位列表
  }

  componentDidMount () {
    this.getChannels()
    this.getPos()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.one) {
      Store.dispatch({ type: Type.AD_CEATE_ONE, payload: { adCreateOne: true } });
    }
  }

  // 切换广告版位客户端
  switchAdvertPosition = (id) => {
    const { advertPosition } = this.state;
    let deepAdvertPosition = JSON.parse(JSON.stringify(advertPosition));

    deepAdvertPosition.forEach(item => {
      if (item.id === id) {
        item.active = true
      } else {
        item.active = false
      }
    })

    this.setState({
      advertPosition: deepAdvertPosition,
      position: id
    })
  }

  // 监听广告版位渠道类型
  onChangeAdvertPosition = (e) => {
    this.setState({
      mode: e.target.value
    })
  }

  // 监听选择渠道和广告形式
  onChangeChooseChannel = (name, checkedValues) => {
    let obj = {};
    obj[name] = checkedValues.join(',')
    this.setState({
      ...obj
    })
  }

  // 监听数据类型
  onChangeFlowType = (e) => {
    this.setState({
      dataType: e.target.value
    })
  }

  // 监听性别类型
  onChangeSex = (e) => {
    this.setState({
      sex: e.target.value
    })
  }

  // 监听年龄
  onChangeAge = (checkedValues) => {
    this.setState({
      age: checkedValues.join(',')
    })
  }

  // 监听操作系统
  onChangeOS = (checkedValues) => {
    this.setState({
      system: checkedValues.join(',')
    })
  }

  // 监听联网方式
  onChangeNetMode = (checkedValues) => {
    this.setState({
      netType: checkedValues.join(',')
    })
  }

  // 监听移动运营商
  onChangeMobileOperator = (checkedValues) => {
    this.setState({
      netComp: checkedValues.join(',')
    })
  }

  // 监听上传图片
  uploadFileChange = (info) => {
    let offLinePerson = "";
    let response = info.file.response;
    let fileList = info.fileList;

    if (info.file.status === 'done') {
      offLinePerson = response.data
      if (response.code === 200) {
        message.success(`${info.file.name} 文件上传成功`);
      } else {
        offLinePerson = ""
        message.error(`${info.file.name} 文件上传失败。`);
      }
    } else if (info.file.status === 'error') {
      offLinePerson = ""
      message.error(`${info.file.name} 文件上传失败。`);
    }
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ fileList, offLinePerson });
  }

  // 监听DMP人群包
  handleChangeDMP = (value) => {
    this.setState({
      dmpPerson: value
    })
  }

  // 切换黑白名单
  switchBlackWhiteList= (id) => {
    const { blackWhiteList, blackPerson, whitePerson } = this.state;
    let deepBlackWhiteList= JSON.parse(JSON.stringify(blackWhiteList));

    deepBlackWhiteList.forEach(item => {
      if (item.id === id) {
        item.active = true
      } else {
        item.active = false
      }
    })

    this.setState({
      blackWhiteList: deepBlackWhiteList,
      blackWhiteType: id,
      blackWhiteValue: id === 1 ? blackPerson : whitePerson
    })
  }

  // 监听投放日期
  onChangeDate = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1]
    })
  }

  // 无法选择今天和今天之前的日子
	disabledDate = (current) => {
    return current && current.valueOf() < Date.now() - (24*60*60*1000);
  }

  // 切换投放时间
  handleModeChange = (e) => {
    const modeTime = e.target.value;
    this.setState({ modeTime, putTime: '' });
  }

  // 获取时间段选择的数据
  childrenGetTimeSelectedData = (selectData) => {
    this.setState({
      putTime: selectData.join(',')
    })
  }

  //周期类别选择
  onChangePeriodType = (e) => {
    this.setState({
      cycle: e.target.value
    })
  }

  // 选择周期方式
  setPeriodHandleChange = (type, value) => {
    let obj = {};
    obj[type] = value

    this.setState({
      ...obj
    })
  }

  // 监听出价方式
  onChangeOffer = (e) => {
    this.setState({
      bidWay: e.target.value
    })
  }

  // 监听出价额度
  onChangeMoney = (name, value) => {
    let obj = {};
    obj[name] = value;
    
    this.setState({
      ...obj
    })
  }

  // 监听input框
  onchangeInput = (name, e) => {
    let obj = {}
    obj[name] = e.target.value.trim();
    this.setState({
      ...obj
    })
  }

  // 接受地区选择
  acceptLocalData = (data) => {
    this.setState({
      area: data.join(',')
    })
  }

  // 监听黑白名单框
  blackWhiteChange = (e) => {
    const { blackWhiteType } = this.state;

    let str = blackWhiteType === 1 ? "blackPerson" : "whitePerson";
    let obj = {};
    obj[str] = e.target.value.trim()
    
    this.setState({
      ...obj,
      blackWhiteValue: e.target.value
    })
  }

  // 清空黑白框输入框
  clearBlackWhiteInput = () => {
    const { blackWhiteType } = this.state;
    let str = blackWhiteType === 1 ? "blackPerson" : "whitePerson";
    let obj = {};
    obj[str] = ''

    this.setState({
      ...obj,
      blackWhiteValue: ''
    })
  }

  // 监听inputNumber输入框
  onChangeInputNumber = (type, value) => {
    let obj = {};
    obj[type] = value

    this.setState({
      ...obj
    })
  }

  // 获取渠道数据
  getChannels = () => {
    HttpRequest("/plan/channels", "POST", {}, res => {
      this.setState({
        channelsList: res.data
      })
    })
  }

  // 下一步
  nextStep = () => {
    if (conditionalShow.is) {
      message.warning(conditionalShow.message)
    } else if (conditionalClick.is) {
      message.warning(conditionalClick.message)
    } else {
      const {name, openUrl, viewControl, clickControl, position, mode, dataType, sex, age, area, system, netType, netComp, offLinePerson, blackPerson, whitePerson, startTime, endTime, putTime, cycle, dateShowType, showNum, dateClickType, clickNum, bidWay, money, exposureNum, clickLimit, channelsList, advertGather } = this.state;

      let passParent = {name, openUrl, viewControl, clickControl, client: position, putChannel: mode, adFormat: advertGather, dataType, sex, age, area, system, netType, netComp, offLinePerson, blackPerson, whitePerson, startTime, endTime, putTime};

      let obj = {};

      if (mode === 201) {
        let arr = [];
        arr.push(passParent.putChannel)
        arr.push(this.state.channelGather.split(','))
        passParent.putChannel = arr.join(',')
        passParent.adPos = this.state.adPos
      }

      if (cycle === 11) {
        obj.dateShowType = dateShowType
        obj.dateClickType = dateClickType
      }

      passParent.cycle = { type: cycle, ...obj, clickNum, showNum }
      passParent.bidSetting = { bidWay, money, exposureNum, clickLimit }

      this.setState({
        isClickNext: true
      })

      this.props.getAdvertData(passParent);
    }
  }

  // 监听展示监听和点击监听的规格
  blurDetectionText = (type, e) => {
    let val = e.target.value.trim();
    let num = val.match(/(,|，)/g) ? val.match(/(,|，)/g).length : 0;
    let conditional = {};

    if (num > 2) {
      conditional.is = true;
      conditional.message = `${type}最多填写三条，并以逗号隔开`;

      message.warning(`${type}最多填写三条，并以逗号隔开`)
    } else {
      conditional.is = false;
      conditional.message = '';
    }

    if (type === '展示监听') {
      conditionalShow = conditional;
    } else {
      conditionalClick = conditional;
    }
  }

  // 获取广告版位接口
  getPos = () => {
    HttpRequest("/plan/pos", "POST", {}, res => {
      this.setState({
        dataSource: res.data
      })
    })
  }

  render () {
    const { advertPosition, mode, position, dataType, sex, blackWhiteList, modeTime, blackWhiteValue, cycle, dateShowType, dateClickType, bidWay, channelsList, isClickNext, dataSource } = this.state;
    const { one, two } = this.props;
    
    const props = {
      name: 'file',
      action: '/plan/upLoad',
      data: {
        type: 1,
        token: getCookie('userInfo') ? JSON.parse(getCookie('userInfo')).token : ""
      },
      headers: {
        authorization: 'authorization-text',
      }
    };

    const columns = [{
      title: '广告版位',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '创意形式',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.length - b.type.length
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          adPos: selectedRowKeys.join(',')
        })
      },
      getCheckboxProps: record => ({
        disabled: isClickNext ? true : mode === 200,
        name: record.name,
      })
    };

    return (
      <section className={`create-plan__group ${one ? '' : 'none'}`}>
        <h2>广告</h2>

        {/* 落地页设置 */}
        <div className="column-group">
          <h3 id="land_page">- 落地页设置</h3>

          {/* 广告名称 */}
          <div className="create-group">
            <label className="name" htmlFor="name">广告名称：</label>
            <div className="input-group">
              <Input placeholder="请输入广告名称" disabled={ isClickNext } onChange={ this.onchangeInput.bind(this, "name") } />
            </div>
          </div>

          {/* 落地页 */}
          <div className="create-group">
            <label className="name" htmlFor="name">落地页：</label>
            <div className="input-group">
              <Input placeholder="请输入落地页链接" disabled={ isClickNext } onChange={ this.onchangeInput.bind(this, "openUrl") } />
            </div>
          </div>

          {/* 展示监听 */}
          <div className="create-group">
            <label className="name" htmlFor="name">展示监听：</label>
            <div className="input-group">
              <TextArea rows={3} onChange={ this.onchangeInput.bind(this, "viewControl") } onBlur={this.blurDetectionText.bind(this, "展示监听")} disabled={ isClickNext } placeholder="最多支持填写三条，以逗号分隔" />
            </div>
          </div>

          {/* 点击监听 */}
          <div className="create-group">
            <label className="name" htmlFor="name">点击监听：</label>
            <div className="input-group">
              <TextArea rows={3} onChange={ this.onchangeInput.bind(this, "clickControl") } onBlur={this.blurDetectionText.bind(this, "点击监听")} disabled={ isClickNext } placeholder="最多支持填写三条，以逗号分隔" />
            </div>
          </div>
        </div>

        {/* 广告版位 */}
        <div className="column-group">
          <h3 id="ad_layout">- 广告版位</h3>
          
          <div className="adverted-position__group">
            <ul className="channel-type">
              {
                advertPosition.map(item => {
                  return <li onClick={ this.switchAdvertPosition.bind(this, item.id) } className={item.active ? "active" : ""} key={item.id}><Icon type={item.icon} /> { item.name }</li>
                })
              }
            </ul>

            <div className="adverted-position">
              <RadioGroup style={{ width: '100%' }} disabled={ isClickNext } onChange={this.onChangeAdvertPosition} value={mode}>
                <Radio style={radioStyle} value={200}>通用</Radio>
                {/* 选择渠道 */}
                <Radio style={radioStyle} value={201}>选择渠道</Radio>
                <div className="choose-channel">
                  <Checkbox.Group disabled={isClickNext ? true : mode === 201 ? false : true} style={{ width: '100%' }} onChange={this.onChangeChooseChannel.bind(this, "channelGather")}>
                    <Row>
                      {
                        channelsList.map(item => {
                          return <Col span={4} key={item.id}><Checkbox value={item.id}>{item.name}</Checkbox></Col>
                        })
                      }
                    </Row>
                  </Checkbox.Group>
                </div>
              </RadioGroup>

              {/* 选择广告形式 */}
              <h4>选择广告形式</h4>
              <div className="choose-channel">
                <Checkbox.Group disabled={isClickNext} style={{ width: '100%' }} onChange={this.onChangeChooseChannel.bind(this, "advertGather")}>
                  <Row>
                    <Col span={24} style={{ marginBottom: '10px' }}><Checkbox value="401">banner</Checkbox></Col>
                    {
                      position === 101
                      ?
                      <Col span={24} style={{ marginBottom: '10px' }}><Checkbox value="405">信息流</Checkbox></Col>
                      :
                      ""
                    }
                    <Col span={4}><Checkbox value="402">前贴</Checkbox></Col>
                    <Col span={4}><Checkbox value="403">中贴</Checkbox></Col>
                    <Col span={4}><Checkbox value="404">后贴</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </div>

              {/* 表格 */}
              <Table 
                rowKey={(record, index) => record.id} 
                rowSelection={ rowSelection } 
                dataSource={dataSource} 
                columns={columns} 
                pagination={false} 
              />
            </div>
          </div>
        </div>

        {/* 定向设置 */}
        <div className="column-group">
          <h3 id="directional">- 定向设置</h3>

          {/* 流量类型 */}
          <div className="create-group" style={{ marginLeft: 30 }}>
            <label className="name" htmlFor="name" style={{ width: 'auto' }}>流量类型：</label>
            <div className="input-group">
              <RadioGroup disabled={ isClickNext } onChange={this.onChangeFlowType} value={dataType}>
                <Radio value={500}>移动WAP</Radio>
                <Radio value={501}>APP</Radio>
              </RadioGroup>
            </div>
          </div>
          
          <div className="create-group" style={{ marginLeft: 30 }}>
            <Collapse bordered={false} defaultActiveKey={['1','2','3','4','5']}>
              {/* 人口属性 */}
              <Panel header="人口属性" key="1">
                <div className="pop-attr">
                  {/* 性别 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: 'auto' }}>性别：</label>
                    <div className="input-group">
                      <RadioGroup disabled={ isClickNext } onChange={this.onChangeSex} value={sex}>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* 年龄 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: 'auto' }}>年龄：</label>
                    <div className="input-group">
                      <Checkbox.Group disabled={ isClickNext } style={{ width: '100%' }} onChange={this.onChangeAge}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="3">18-24岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="4">25-34岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="5">35-44岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="6">45-54岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="7">56-64岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="8">64岁以上</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </div>
                  </div>
                </div>
              </Panel>
              {/* 地域定向 */}
              <Panel header="地域定向" key="2">
                <div className="pop-attr">
                    <RegLinkage disabled={ isClickNext } acceptLocalData={ this.acceptLocalData } />
                </div>
              </Panel>
              {/* 设备定向 */}
              <Panel header="设备定向" key="3">
                <div className="pop-attr">
                  {/* 操作系统 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: '90px', textAlign: 'left' }}>操作系统：</label>
                    <div className="input-group">
                      <Checkbox.Group disabled={ isClickNext } style={{ width: '100%' }} onChange={this.onChangeOS}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="600">IOS</Checkbox></Col>
                          <Col span={6}><Checkbox value="601">Android</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* 联网方式 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: '90px', textAlign: 'left' }}>联网方式：</label>
                    <div className="input-group">
                      <Checkbox.Group disabled={ isClickNext } style={{ width: '100%' }} onChange={this.onChangeNetMode}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="700">WIFI</Checkbox></Col>
                          <Col span={6}><Checkbox value="701">2G</Checkbox></Col>
                          <Col span={6}><Checkbox value="702">3G</Checkbox></Col>
                          <Col span={6}><Checkbox value="703">4G</Checkbox></Col>
                          <Col span={6}><Checkbox value="704">其他</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* 移动运营商 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: '90px', textAlign: 'left' }}>移动运营商：</label>
                    <div className="input-group">
                      <Checkbox.Group disabled={ isClickNext } style={{ width: '100%' }} onChange={this.onChangeMobileOperator}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="801">移动</Checkbox></Col>
                          <Col span={6}><Checkbox value="802">联通</Checkbox></Col>
                          <Col span={6}><Checkbox value="803">电信</Checkbox></Col>
                          <Col span={6}><Checkbox value="804">未知</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </div>
                  </div>
                </div>
              </Panel>
              {/* 自定义人群 */}
              <Panel header="自定义人群" key="4">
                <div className="pop-attr">
                    {/* 导入离线人群包 */}
                    <div className="create-group">
                      <label className="name" htmlFor="name" style={{ width: '120px', textAlign: 'left' }}>导入离线人群包：</label>
                      <div className="input-group">
                        <Upload disabled={ isClickNext } {...props} onChange={ this.uploadFileChange } fileList={ this.state.fileList }>
                          <Button>
                            <Icon type="upload" /> 上传
                          </Button>
                        </Upload>
                      </div>
                    </div>

                    {/* 导入DMP人群包 */}
                    {/* <div className="create-group">
                      <label className="name" htmlFor="name" style={{ width: '120px', textAlign: 'left' }}>导入DMP人群包：</label>
                      <div className="input-group">
                        <Select style={{ width: 150 }} placeholder="请选择" onChange={this.handleChangeDMP}>
                          <Option value="jack">Jack</Option>
                          <Option value="lucy">Lucy</Option>
                          <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                      </div>
                    </div> */}
                </div>
              </Panel>
              {/* 黑白名单定向 */}
              <Panel header="黑白名单定向" key="5">
                <div className="pop-attr">
                  <div className="adverted-position__group">
                    <ul className="channel-type">
                      {
                        blackWhiteList.map(item => {
                          return <li onClick={ this.switchBlackWhiteList.bind(this, item.id) } className={item.active ? "active" : ""} key={item.id}> { item.name }</li>
                        })
                      }
                    </ul>

                    <div className="black-white">
                      <TextArea disabled={ isClickNext } rows={4} value={blackWhiteValue} onChange={this.blackWhiteChange} className="input" />
                      <div className="btn-group">
                        <Button disabled={ isClickNext } onClick={this.clearBlackWhiteInput}>清空</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>

        {/* 排期与频次 */}
        <div className="column-group">
          <h3 id="frequency">- 排期与频次</h3>

          {/* 投放日期 */}
          <div className="create-group">
            <label className="name" htmlFor="name">投放日期：</label>
            <div className="input-group">
              <RangePicker disabled={ isClickNext } onChange={this.onChangeDate} disabledDate={this.disabledDate} />
            </div>
          </div>

          {/* 投放时间 */}
          <div className="create-group">
            <label className="name" htmlFor="name">投放时间：</label>
            <div className="input-group">
              <Radio.Group disabled={ isClickNext } onChange={this.handleModeChange} value={modeTime} style={{ marginBottom: 8 }}>
                <Radio.Button value="day">全天投放</Radio.Button>
                <Radio.Button value="time">按时间段投放</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* 时间对应的tabs */}
          <div className="create-group">
            <div className="name"></div>
            <div className="input-group">
              {
                modeTime === 'day'
                ?
                <AllDay disabled={ isClickNext } childrenGetTimeSelectedData={ this.childrenGetTimeSelectedData } />
                :
                <TimeSelected disabled={ isClickNext } childrenGetTimeSelectedData={ this.childrenGetTimeSelectedData } />
              }
            </div>
          </div>

          {/* 频次控制 */}
          <div className="create-group">
            <label className="name" htmlFor="name">频次控制：</label>
            <div className="input-group">
              <div className="channel-type_1">
                <RadioGroup disabled={ isClickNext } onChange={this.onChangePeriodType} value={cycle}>
                  <Radio value={11}>按自然周期</Radio>
                  <Radio value={12}>按设置周期</Radio>
                </RadioGroup>
              </div>

              <div className="channel-group period-group">
                <div className="period-row">
                  {
                    cycle === 11 
                    ?
                    <Select disabled={ isClickNext } defaultValue={ dateShowType } style={{ width: 100 }} onChange={this.setPeriodHandleChange.bind(this, "dateShowType")}>
                      <Option value="1">每日</Option>
                      <Option value="2">每周</Option>
                    </Select>
                    :
                    <span>周期内</span>
                  }
                  <span style={{ margin: '0 10px' }}>展示</span>
                  <span>≤</span>
                  <InputNumber disabled={ isClickNext } min={0} style={{ width: 100, height: 32, margin: '0 10px' }} onChange={this.onChangeInputNumber.bind(this, "showNum")} />
                  <span>次</span>
                </div>

                <div className="period-row">
                  {
                    cycle === 11 
                    ?
                    <Select disabled={ isClickNext } defaultValue={ dateClickType } style={{ width: 100 }} onChange={this.setPeriodHandleChange.bind(this, "dateClickType")}>
                      <Option value="1">每日</Option>
                      <Option value="2">每周</Option>
                    </Select>
                    :
                    <span>周期内</span>
                  }
                  
                  <span style={{ margin: '0 10px' }}>点击</span>
                  <span>≤</span>
                  <InputNumber disabled={ isClickNext } min={0} style={{ width: 100, height: 32, margin: '0 10px' }} onChange={this.onChangeInputNumber.bind(this, "clickNum")} />
                  <span>次</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 出价设置 */}
        <div className="column-group" id="last_bid">
          <h3 id="bid">- 出价设置</h3>

          <div className="offer-box">
            {/* 出价方式 */}
            <div className="create-group">
              <label className="name" htmlFor="name">出价方式：</label>
              <div className="input-group">
                <RadioGroup disabled={ isClickNext } onChange={this.onChangeOffer} value={bidWay}>
                  <Radio value={9}>CPM</Radio>
                  <Radio value={10}>CPC</Radio>
                </RadioGroup>
              </div>
            </div>

            {/* 出价 */}
            <div className="create-group">
              <label className="name" htmlFor="name">出价：</label>
              <div className="input-group">
                <InputNumber disabled={ isClickNext } style={{ width: 200, marginRight: 10 }} min={6.5} onChange={this.onChangeMoney.bind(this, "money")} />
                <span>建议出价6.5元起</span>
              </div>
            </div>

            {/* 每日曝光上限 */}
            <div className="create-group">
              <label className="name" htmlFor="name">每日曝光上限：</label>
              <div className="input-group">
                <InputNumber disabled={ isClickNext } style={{ width: 200, marginRight: 10 }} min={0} onChange={this.onChangeMoney.bind(this, "exposureNum")} />
                <span>次</span>
              </div>
            </div>

            {/* 每日点击上限 */}
            <div className="create-group">
              <label className="name" htmlFor="name">每日点击上限：</label>
              <div className="input-group">
                <InputNumber disabled={ isClickNext } style={{ width: 200, marginRight: 10 }} min={0} onChange={this.onChangeMoney.bind(this, "clickLimit")} />
                <span>次</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`operation ${ two ? 'none' : ''}`}>
          <Button type="primary" className="next-step" style={{ marginTop: 30 }} onClick={this.nextStep}>下一步</Button>
          <Link to="/content/launch"><Button>返回上级</Button></Link>
        </div>
      </section>
    )
  }
}

export default Advertising;
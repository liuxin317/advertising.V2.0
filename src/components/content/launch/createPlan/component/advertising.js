import React, { Component } from 'react';
import { Input, Radio, Icon, Checkbox, Row, Col, Table, Collapse, Upload, message, Button, Select, DatePicker, InputNumber } from 'antd';
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
const dataSource = [{
  key: '1',
  advertPosition: '移动开屏',
  creativeForm: '640x1136单图（文）',
  describe: '开屏广告位'
}, {
  key: '2',
  advertPosition: '浏览器及手腾网',
  creativeForm: '640x330单图（文）',
  describe: '焦点图、悦图、视频暂停'
}, {
  key: '3',
  advertPosition: 'QQ浏览器',
  creativeForm: '640x200单图（文）',
  describe: '热门视频列表等'
}, {
  key: '4',
  advertPosition: 'QQ空间',
  creativeForm: '524x258单图（文）',
  describe: '沉浸视频流'
}, {
  key: '5',
  advertPosition: '移动Banner',
  creativeForm: '640x100微动',
  describe: 'Banner广告位'
}, {
  key: '6',
  advertPosition: 'QQ音乐',
  creativeForm: '80x80单图（文）',
  describe: 'QQ音乐歌单底部Banner'
}];
const columns = [{
  title: '广告版位',
  dataIndex: 'advertPosition',
  key: 'advertPosition',
}, {
  title: '创意形式',
  dataIndex: 'creativeForm',
  key: 'creativeForm',
  sorter: (a, b) => a.creativeForm.length - b.creativeForm.length
}, {
  title: '描述',
  dataIndex: 'describe',
  key: 'describe',
}];

class Advertising extends Component {
  state = {
    position: 1, // 广告版位类型(1、PC，2、MOB)
    advertPosition: [{ // 广告版位
      name: 'PC',
      icon: 'desktop',
      id: 1,
      active: true
    }, {
      name: 'MOB',
      icon: 'mobile',
      id: 2,
      active: false
    }],
    mode: 1, // 广告版位渠道类型（1、通用，2、选择渠道，3、选择广告形式）
    dataType: 1, // 流量类型（1、移动WAP，2、APP）
    sex: 1, // 性别(1、男，2、女)
    fileList: [], // 上传列表
    backFileUrl: "", // 文件上传成功后返回地址 
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
    periodType: 1, // 周期类别（1、自然, 2、设置）
    periodDay: 1, // 周期按时间类型
    offerValue: 1, // 出价方式
    money: '', // 出价额度
    name: '', // 广告名称
    openUrl: '', // 落地页链接
    viewControl: '', // 展示监测
    clickControl: '', // 点击监测
    channelGather: "", // 渠道集合
    advertGather: "", // 广告形式集合
    area: "", // 地区集合
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
    obj[name] = checkedValues
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
      age: checkedValues
    })
  }

  // 监听操作系统
  onChangeOS = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }

  // 监听联网方式
  onChangeNetMode = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }

  // 监听上传图片
  uploadFileChange = (info) => {
    let backFileUrl = "";
    let response = info.file.response;
    let fileList = info.fileList;

    if (info.file.status === 'done') {
      backFileUrl = response.data
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      backFileUrl = ""
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

    this.setState({ fileList, backFileUrl });
  }

  // 监听DMP人群包
  handleChangeDMP = (value) => {
    console.log(`selected ${value}`);
  }

  // 切换黑白名单
  switchBlackWhiteList= (id) => {
    const { blackWhiteList } = this.state;
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
      blackWhiteType: id
    })
  }

  // 监听投放日期
  onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  }

  // 无法选择今天和今天之前的日子
	disabledDate = (current) => {
    return current && current.valueOf() < Date.now() - (24*60*60*1000);
  }

  // 切换投放时间
  handleModeChange = (e) => {
    const modeTime = e.target.value;
    this.setState({ modeTime });
  }

  // 获取时间段选择的数据
  childrenGetTimeSelectedData = (selectData) => {
    console.log(selectData);
  }

  //周期类别选择
  onChangePeriodType = (e) => {
    this.setState({
      periodType: e.target.value
    })
  }

  // 选择周期方式
  setPeriodHandleChange = (value) => {
    this.setState({
      periodDay: value
    })
  }

  // 监听出价方式
  onChangeOffer = (e) => {
    this.setState({
      offerValue: e.target.value
    })
  }

  // 监听出价额度
  onChangeMoney = (value) => {
    this.setState({
      money: value
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
    console.log(data)
    
    this.setState({
      area: data
    })
  }

  render () {
    const { advertPosition, mode, position, periodType, dataType, sex, blackWhiteList, modeTime } = this.state;
    const props = {
      name: 'file',
      action: '/material/uploadMaterial',
      headers: {
        authorization: 'authorization-text',
      }
    };

    return (
      <section className="create-plan__group">
        <h2>广告</h2>

        {/* 落地页设置 */}
        <div className="column-group">
          <h3>- 落地页设置</h3>

          {/* 广告名称 */}
          <div className="create-group">
            <label className="name" htmlFor="name">广告名称：</label>
            <div className="input-group">
              <Input placeholder="请输入广告名称" onChange={ this.onchangeInput.bind(this, "name") } />
            </div>
          </div>

          {/* 落地页 */}
          <div className="create-group">
            <label className="name" htmlFor="name">落地页：</label>
            <div className="input-group">
              <Input placeholder="请输入落地页链接" onChange={ this.onchangeInput.bind(this, "openUrl") } />
            </div>
          </div>

          {/* 展示监听 */}
          <div className="create-group">
            <label className="name" htmlFor="name">展示监听：</label>
            <div className="input-group">
              <TextArea rows={3} onChange={ this.onchangeInput.bind(this, "viewControl") } placeholder="最多支持填写三条，以逗号分隔" />
            </div>
          </div>

          {/* 点击监听 */}
          <div className="create-group">
            <label className="name" htmlFor="name">点击监听：</label>
            <div className="input-group">
              <TextArea rows={3} onChange={ this.onchangeInput.bind(this, "clickControl") } placeholder="最多支持填写三条，以逗号分隔" />
            </div>
          </div>
        </div>

        {/* 广告版位 */}
        <div className="column-group">
          <h3>- 广告版位</h3>
          
          <div className="adverted-position__group">
            <ul className="channel-type">
              {
                advertPosition.map(item => {
                  return <li onClick={ this.switchAdvertPosition.bind(this, item.id) } className={item.active ? "active" : ""} key={item.id}><Icon type={item.icon} /> { item.name }</li>
                })
              }
            </ul>

            <div className="adverted-position">
              <RadioGroup style={{ width: '100%' }} onChange={this.onChangeAdvertPosition} value={mode}>
                <Radio style={radioStyle} value={1}>通用</Radio>
                {/* 选择渠道 */}
                <Radio style={radioStyle} value={2}>选择渠道</Radio>
                <div className="choose-channel">
                  <Checkbox.Group disabled={mode === 2 ? false : true} style={{ width: '100%' }} onChange={this.onChangeChooseChannel.bind(this, "channelGather")}>
                    <Row>
                      <Col span={4}><Checkbox value="A">A</Checkbox></Col>
                      <Col span={4}><Checkbox value="B">B</Checkbox></Col>
                      <Col span={4}><Checkbox value="C">C</Checkbox></Col>
                      <Col span={4}><Checkbox value="D">D</Checkbox></Col>
                      <Col span={4}><Checkbox value="E">E</Checkbox></Col>
                    </Row>
                  </Checkbox.Group>
                </div>

                {/* 选择广告形式 */}
                <Radio style={radioStyle} value={3}>选择广告形式</Radio>
                <div className="choose-channel">
                  <Checkbox.Group disabled={mode === 3 ? false : true} style={{ width: '100%' }} onChange={this.onChangeChooseChannel.bind(this, "advertGather")}>
                    <Row>
                      <Col span={24} style={{ marginBottom: '10px' }}><Checkbox value="banner">banner</Checkbox></Col>
                      {
                        position === 2
                        ?
                        <Col span={24} style={{ marginBottom: '10px' }}><Checkbox value="信息流">信息流</Checkbox></Col>
                        :
                        ""
                      }
                      <Col span={4}><Checkbox value="前贴">前贴</Checkbox></Col>
                      <Col span={4}><Checkbox value="中贴">中贴</Checkbox></Col>
                      <Col span={4}><Checkbox value="后贴">后贴</Checkbox></Col>
                    </Row>
                  </Checkbox.Group>
                </div>

                {/* 表格 */}
                <Table dataSource={dataSource} columns={columns} pagination={false} />
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* 定向设置 */}
        <div className="column-group">
          <h3>- 定向设置</h3>

          {/* 流量类型 */}
          <div className="create-group" style={{ marginLeft: 30 }}>
            <label className="name" htmlFor="name" style={{ width: 'auto' }}>流量类型：</label>
            <div className="input-group">
              <RadioGroup onChange={this.onChangeFlowType} value={dataType}>
                <Radio value={1}>移动WAP</Radio>
                <Radio value={2}>APP</Radio>
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
                      <RadioGroup onChange={this.onChangeSex} value={sex}>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* 年龄 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: 'auto' }}>年龄：</label>
                    <div className="input-group">
                      <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeAge}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="1">18-24岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="2">25-34岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="3">35-44岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="4">45-54岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="5">56-64岁</Checkbox></Col>
                          <Col span={6}><Checkbox value="6">64岁以上</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </div>
                  </div>
                </div>
              </Panel>
              {/* 地域定向 */}
              <Panel header="地域定向" key="2">
                <div className="pop-attr">
                    <RegLinkage acceptLocalData={ this.acceptLocalData } />
                </div>
              </Panel>
              {/* 设备定向 */}
              <Panel header="设备定向" key="3">
                <div className="pop-attr">
                  {/* 操作系统 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: '90px', textAlign: 'left' }}>操作系统：</label>
                    <div className="input-group">
                      <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeOS}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="IOS">IOS</Checkbox></Col>
                          <Col span={6}><Checkbox value="Android">Android</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* 联网方式 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: '90px', textAlign: 'left' }}>联网方式：</label>
                    <div className="input-group">
                      <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeNetMode}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="WIFI">WIFI</Checkbox></Col>
                          <Col span={6}><Checkbox value="2G">2G</Checkbox></Col>
                          <Col span={6}><Checkbox value="3G">3G</Checkbox></Col>
                          <Col span={6}><Checkbox value="4G">4G</Checkbox></Col>
                          <Col span={6}><Checkbox value="其他">其他</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* 移动运营商 */}
                  <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: '90px', textAlign: 'left' }}>移动运营商：</label>
                    <div className="input-group">
                      <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeNetMode}>
                        <Row className="age-row">
                          <Col span={6}><Checkbox value="移动">移动</Checkbox></Col>
                          <Col span={6}><Checkbox value="联通">联通</Checkbox></Col>
                          <Col span={6}><Checkbox value="电信">电信</Checkbox></Col>
                          <Col span={6}><Checkbox value="未知">未知</Checkbox></Col>
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
                        <Upload {...props} onChange={ this.uploadFileChange } fileList={ this.state.fileList }>
                          <Button>
                            <Icon type="upload" /> Click to Upload
                          </Button>
                        </Upload>
                      </div>
                    </div>

                    {/* 导入DMP人群包 */}
                    <div className="create-group">
                      <label className="name" htmlFor="name" style={{ width: '120px', textAlign: 'left' }}>导入DMP人群包：</label>
                      <div className="input-group">
                        <Select defaultValue="lucy" style={{ width: 150 }} onChange={this.handleChangeDMP}>
                          <Option value="jack">Jack</Option>
                          <Option value="lucy">Lucy</Option>
                          <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                      </div>
                    </div>
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
                      <TextArea rows={4} className="input" />
                      <div className="btn-group">
                        <Button type="primary">确认</Button>
                        <Button>清空</Button>
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
          <h3>- 排期与频次</h3>

          {/* 投放日期 */}
          <div className="create-group">
            <label className="name" htmlFor="name">投放日期：</label>
            <div className="input-group">
              <RangePicker onChange={this.onChangeDate} disabledDate={this.disabledDate} />
            </div>
          </div>

          {/* 投放时间 */}
          <div className="create-group">
            <label className="name" htmlFor="name">投放时间：</label>
            <div className="input-group">
              <Radio.Group onChange={this.handleModeChange} value={modeTime} style={{ marginBottom: 8 }}>
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
                <AllDay childrenGetTimeSelectedData={ this.childrenGetTimeSelectedData } />
                :
                <TimeSelected childrenGetTimeSelectedData={ this.childrenGetTimeSelectedData } />
              }
            </div>
          </div>

          {/* 频次控制 */}
          <div className="create-group">
            <label className="name" htmlFor="name">频次控制：</label>
            <div className="input-group">
              <div className="channel-type_1">
                <RadioGroup onChange={this.onChangePeriodType} value={periodType}>
                  <Radio value={1}>按自然周期</Radio>
                  <Radio value={2}>按设置周期</Radio>
                </RadioGroup>
              </div>

              <div className="channel-group period-group">
                <div className="period-row">
                  {
                    periodType === 1 
                    ?
                    <Select defaultValue="1" style={{ width: 100 }} onChange={this.setPeriodHandleChange}>
                      <Option value="1">每日</Option>
                      <Option value="2">每周</Option>
                    </Select>
                    :
                    <span>周期内</span>
                  }
                  <span style={{ margin: '0 10px' }}>展示</span>
                  <span>≤</span>
                  <Input style={{ width: 100, height: 32, margin: '0 10px' }} />
                  <span>次</span>
                </div>

                <div className="period-row">
                  {
                    periodType === 1 
                    ?
                    <Select defaultValue="1" style={{ width: 100 }} onChange={this.setPeriodHandleChange}>
                      <Option value="1">每日</Option>
                      <Option value="2">每周</Option>
                    </Select>
                    :
                    <span>周期内</span>
                  }
                  
                  <span style={{ margin: '0 10px' }}>点击</span>
                  <span>≤</span>
                  <Input style={{ width: 100, height: 32, margin: '0 10px' }} />
                  <span>次</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 出价设置 */}
        <div className="column-group">
          <h3>- 出价设置</h3>

          <div className="offer-box">
            {/* 出价方式 */}
            <div className="create-group">
              <label className="name" htmlFor="name">出价方式：</label>
              <div className="input-group">
                <RadioGroup onChange={this.onChangeOffer} value={this.state.offerValue}>
                  <Radio value={1}>CPM</Radio>
                  <Radio value={2}>CPC</Radio>
                </RadioGroup>
              </div>
            </div>

            {/* 出价 */}
            <div className="create-group">
              <label className="name" htmlFor="name">出价：</label>
              <div className="input-group">
                <InputNumber style={{ width: 200, marginRight: 10 }} min={6.5} onChange={this.onChangeMoney} />
                <span>建议出价6.5元起</span>
              </div>
            </div>

            {/* 每日曝光上限 */}
            <div className="create-group">
              <label className="name" htmlFor="name">每日曝光上限：</label>
              <div className="input-group">
                <InputNumber style={{ width: 200, marginRight: 10 }} min={0} onChange={this.onChangeMoney} />
                <span>次</span>
              </div>
            </div>

            {/* 每日点击上限 */}
            <div className="create-group">
              <label className="name" htmlFor="name">每日点击上限：</label>
              <div className="input-group">
                <InputNumber style={{ width: 200, marginRight: 10 }} min={0} onChange={this.onChangeMoney} />
                <span>次</span>
              </div>
            </div>
          </div>
        </div>

        <Button type="primary" className="next-step" style={{ marginTop: 30 }}>下一步</Button>
      </section>
    )
  }
}

export default Advertising;
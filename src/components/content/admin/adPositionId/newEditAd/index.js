import React, { Component } from 'react';
import { Icon, Input, InputNumber, Select, Button, message, Radio, Upload, Modal } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import { getCookie } from '@/components/common/methods';
import './style.scss';

const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Dragger = Upload.Dragger;

class NewEditAd extends Component {
    state = {
      isNowEdit: 1, // 是否是新建或者编辑页面（1、新建，2编辑）
      fileList: [], // 上传示例图
      previewImage: '', // 上传
      previewVisible: false, // 上传
      channelsList: [], // 渠道列表
      channelId: '请选择', // 渠道ID
      name: '', // 名称
      no: '', // 广告位Id
      text: '', // 创意形式
      descs: '', // 描述
      content: '', // 内容
      width: '', // 尺寸宽度
      height: '', // 尺寸高度,
      limitSize: '', // 大小
      limitCopy: '', // 文案限制
      limitDesc: '', // 描述限制
      type: 9, // 出价方式 10- cpc, 9- cpm
      money: '', // 出价
      state: '', // 仅编辑页面使用
      redirect: false, // 跳转状态
      validation: false, // 验证上传
    }

    componentDidMount() {
      const { match } = this.props; 

      //判断新建还是编辑界面
      if (match.params) {
          let isNowEdit = '';

          if (match.params.state !== 'new') { // 编辑页面
              isNowEdit = 2
              this.detailPos()
          } else {
              isNowEdit = 1
          }

          this.setState({
              isNowEdit
          })
      }

      this.getChannels()
    }

    handleCancel = () => {
      this.setState({ previewVisible: false })
    }

    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }

    // 获取渠道下拉
    getChannels = () => {
      HttpRequest('/plan/channels', "POST", {}, res => {
        this.setState({
          channelsList: res.data
        })
      })
    }

    // 监听渠道下拉
    onChangeSelected = (value) => {
      this.setState({
        channelId: value
      })
    }

    // 监听input框
    onChangeInput = (name, e) => {
      let obj = {}
      obj[name] = e.target.value.trim();

      this.setState({
        ...obj
      })
    }

    // 监听inputNumber框
    onChangeInputNumber = (name, value) => {
      let obj = {}
      obj[name] = value;

      this.setState({
        ...obj
      })
    }

    // 监听单选框
    onChangeRadio = (e) => {
      this.setState({
        type: e.target.value
      })
    }

    // 确认前检测
    confirmationTest = () => {
      const {fileList, channelId, name, no, text, descs, width, height, limitSize, limitCopy, limitDesc, type, money} = this.state;
      
      if (!name) {
        message.warning('请填写广告位名称！')
      } else if (channelId === '请选择') {
        message.warning('请选择渠道！')
      } else if (!no) {
        message.warning('请填写渠道广告位ID！')
      } else if (!text) {
        message.warning('请填写创意形式！')
      } else if (!descs) {
        message.warning('请填写描述！')
      } else if (!width) {
        message.warning('请填写图片尺寸宽度！')
      } else if (!height) {
        message.warning('请填写图片尺寸高度！')
      } else if (!limitSize) {
        message.warning('请填写图片大小限制！')
      } else if (!limitCopy) {
        message.warning('请填写广告文案字数限制！')
      } else if (!limitDesc) {
        message.warning('请填写广告描述字数限制！')
      } else if (!fileList.length) {
        message.warning('请上传示例图！')
      } else {
        let obj = { channelId, name, no, text, descs, type, money};
        let content = { width, height, limitSize, limitCopy, limitDesc };
        let img = [];
        
        obj.content = content;
        fileList.forEach(item => {
          img.push(item.response.data)
        })
        obj.img = img.join(',')

        if (this.state.isNowEdit !== 1) {
          obj.id = this.props.match.params.state
          obj.state = this.state.state
        }
        
        this.addEditAd(obj)
      }
    }

    // 创建/编辑接口
    addEditAd = (data) => {
      const { isNowEdit } = this.state;
      let str = isNowEdit === 1 ? 'addPos' : 'updatePos';

      HttpRequest(`/plan/${str}`, "POST", {
        posJson: JSON.stringify(data)
      }, res => {
        message.success(`${isNowEdit === 1 ? '创建成功！' : '编辑成功！'}`)
        setTimeout(() => {
          this.setState({
            redirect: true
          })
        }, 1000)
      })
    }

    // 查询编辑信息接口
    detailPos = () => {
      const { match } = this.props; 

      HttpRequest('/plan/detailPos', "POST", {
        id: match.params.state
      }, res => {
        let d = res.data;
        let content = JSON.parse(d.content);
        let arr = d.img.split(',');
        let fileList = [];

        arr.forEach((item, index) => {
          let obj = {
            uid: index,
            name: 'xxx.png',
            status: 'done',
            response: {
              data: item
            },
            url: item
          }

          fileList.push(obj)
        })

        this.setState({
          name: d.name,
          channelId: d.channelId,
          no: d.no,
          text: d.text,
          descs: d.descs,
          money: d.money,
          type: d.type,
          width: content.width,
          height: content.height,
          limitSize: content.limitSize,
          limitCopy: content.limitCopy,
          limitDesc: content.limitDesc,
          fileList,
          state: d.state
        })
      })
    }

    // 上传图片change事件
    onChangeUpLoad = (info) => {
      const status = info.file.status;
      let fileList = info.fileList;
      let respone = info.file.response;
      let uid = info.file.uid;
      let deepfileList = JSON.parse(JSON.stringify(fileList));

      if (status === 'uploading') {
        this.setState({
          fileList
        })
      }
      if (status === 'done') {
        if (Number(respone.code) === 200) {
          if (this.state.validation) {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({
              fileList
            })
          }
        } else {
          message.error(`${info.file.name} 上传失败！`);
          deepfileList.forEach((item, index) => {
            if (item.uid === uid) {
              deepfileList.splice(index, 1)
            }
          })
  
          this.setState({
            fileList: deepfileList
          })
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败！`);
        deepfileList.forEach((item, index) => {
          if (item.uid === uid) {
            deepfileList.splice(index, 1)
          }
        })

        this.setState({
          fileList: deepfileList
        })
      }
    }

    render () {
      const { isNowEdit, fileList, previewVisible, previewImage, channelsList, channelId, name, no, text, descs, width, height, limitSize, limitCopy, limitDesc, type, money, redirect } = this.state;
      const _this = this;

      const props = {
        name: 'file',
        listType: "picture-card",
        multiple: true,
        action: '/plan/upLoad',
        data: {
          type: 8,
          token: getCookie('userInfo') ? JSON.parse(getCookie('userInfo')).token : ""
        },
        onPreview: _this.handlePreview,
        beforeUpload (file) {
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
          if (!isJPG) {
            message.error('请上传图片格式为JPG/JPEG!');
          }
  
          const isLt2M = file.size / 1024 < 100;
          if (!isLt2M) {
            message.error('图片大小不能超过100k');
          }
  
          // 对比尺寸
          const suffix ="." + file.name.replace(/^.+\./,'')
          const filename = file.name.replace(suffix,"")
          var img_url = window.URL.createObjectURL(file);
          
          let getWH = (imgUrl,filename,suffix) => {
            return new Promise((resolve,reject)=>{
                  let img = new Image();
                  img.src = imgUrl;
                  img.onload = ()=>{
                      let w = img.width;
                      let h = img.height;
                      // let timestamp=new Date().getTime();
                      // let fileSize = w +"*" + h;
                      // let key = timestamp + filename +"_"+fileSize +"_"+ suffix;
                      resolve({w, h});
                  }
                  img.onerror = ()=>{
                      reject()
                  }
              })
          }
          let result= getWH(img_url,filename,suffix);
          result.then(resp=>{
            return resp.w === 760 && resp.h === 1280
          }).then(res => {
            if (!res) {
              message.error(`${file.name}图片尺寸不为760*1280`);
              setTimeout(() => {
                let deepfileList = JSON.parse(JSON.stringify(_this.state.fileList));
  
                deepfileList.forEach((item, index) => {
                  if (item.uid === file.uid) {
                    deepfileList.splice(index, 1)
                  }
                })
  
                _this.setState({
                  fileList: deepfileList
                })
              }, 500)
            }

            _this.setState({
              validation: res
            })
          })
  
          return isJPG && isLt2M;
        },
        onChange: _this.onChangeUpLoad,
        onRemove (file) {
          let deepfileList = JSON.parse(JSON.stringify(fileList));
          deepfileList.forEach((item, index) => {
            if (item.uid === file.uid) {
              deepfileList.splice(index, 1)
            }
          })
  
          _this.setState({
            fileList: deepfileList
          })
        } 
      };

      if (redirect) {
        return <Redirect push to="/content/admin/ad-position" />
      }

      return (
          <section className="new-edit__ad">
              <h4 className="cloumn-name"><Link to="/content/admin/ad-position"><Icon type="left" /> { isNowEdit === 1 ? '新建广告位' : '编辑广告位' }</Link></h4> 

              <div className="cloumn-group">
                  <div className="input-group">
                      <label className="name"><em>*</em> 广告位名称：</label>
                      <div className="main">
                          <Input value={ name } onChange={ this.onChangeInput.bind(this, 'name') } />
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name"><em>*</em> 渠道：</label>
                      <div className="main">
                        <Select disabled={ isNowEdit === 2 } value={channelId} style={{ width: 200 }} onChange={ this.onChangeSelected }>
                          {
                            channelsList.map(item => {
                              return <Option value={ item.id } key={ item.id }>{ item.name }</Option>
                            })
                          }
                        </Select>
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name"><em>*</em> 渠道广告位ID：</label>
                      <div className="main">
                        <InputNumber disabled={ isNowEdit === 2 } value={no} min={0} onChange={ this.onChangeInputNumber.bind(this, 'no') } />
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name"><em>*</em> 创意形式：</label>
                      <div className="main">
                          <Input value={ text } onChange={ this.onChangeInput.bind(this, 'text') } />
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name"><em>*</em> 描述：</label>
                      <div className="main">
                        <TextArea rows={4} value={ descs } onChange={ this.onChangeInput.bind(this, 'descs') } />
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name"><em>*</em> 广告位内容：</label>
                      <div className="main">
                        <div className="block-group">
                          <h6 className="block-name">图片</h6>
                          <div className="block-main">
                            <div className="block-row">
                              <label className="block-row__title">尺寸：</label>
                              <div className="block-row__cent">
                                <InputNumber value={width} min={0} onChange={ this.onChangeInputNumber.bind(this, 'width') } />
                                <span style={{ margin: '0 5px' }}>*</span>
                                <InputNumber value={height} min={0} onChange={ this.onChangeInputNumber.bind(this, 'height') } />
                              </div>
                            </div>

                            <div className="block-row">
                              <label className="block-row__title">大小限制：</label>
                              <div className="block-row__cent">
                                <InputNumber value={limitSize} min={0} onChange={ this.onChangeInputNumber.bind(this, 'limitSize') }/>
                                <span style={{ margin: '0 5px' }}>KB</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="block-group">
                          <h6 className="block-name">广告文案</h6>
                          <div className="block-main">
                            <div className="block-row">
                              <label className="block-row__title">字数限制：</label>
                              <div className="block-row__cent">
                                <InputNumber value={limitCopy} min={0} onChange={ this.onChangeInputNumber.bind(this, 'limitCopy') } />
                                <span style={{ margin: '0 5px' }}>字</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="block-group">
                          <h6 className="block-name">广告描述</h6>
                          <div className="block-main">
                            <div className="block-row">
                              <label className="block-row__title">字数限制：</label>
                              <div className="block-row__cent">
                                <InputNumber value={limitDesc} min={0} onChange={ this.onChangeInputNumber.bind(this, 'limitDesc') }/>
                                <span style={{ margin: '0 5px' }}>字</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name">出价方式：</label>
                      <div className="main">
                        <RadioGroup value={type} onChange={this.onChangeRadio}>
                          <Radio value={9}>CPM</Radio>
                          <Radio value={10}>CPC</Radio>
                        </RadioGroup>
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name">出价：</label>
                      <div className="main">
                        <InputNumber value={money} min={0} onChange={ this.onChangeInputNumber.bind(this, 'money') } />
                      </div>
                  </div>

                  <div className="input-group">
                      <label className="name"><em>*</em> 示例图：</label>
                      <div className="main">
                        <div className="clearfix">
                          <Dragger {...props} fileList={ fileList } className="upload-box">
                            <p className="ant-upload-drag-icon">
                              <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">760*1280</p>
                            <p className="ant-upload-hint">请点击或拖拽</p>
                            <p className="ant-upload-hint">JPG/JPEG/PNG, 小于100k</p>
                          </Dragger>

                          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                          </Modal>
                        </div>
                      </div>
                  </div>
              </div>

              {/* 按钮 */}
              <div className="btn-group">
                  <Button type="primary" onClick={ this.confirmationTest }>确认</Button>
                  <Link to="/content/admin/ad-position"><Button style={{ marginLeft: 60 }}>取消</Button></Link>
              </div>
          </section>
      )
    }
}

export default NewEditAd;
import React, { Component } from 'react';
import { Upload, Icon, message, Button, Input } from 'antd';
import { getCookie } from '@/components/common/methods';
import './style.scss';

const Dragger = Upload.Dragger;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
  if (!isJPG) {
    message.error('上传的文件格式只能是jpeg、jpg和png!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!');
  }
  return isLt2M && isJPG;
}

class CreativeUpload extends Component {
  state = {
    fileList: [], // 上传列表
    backFileUrl: [], // 成功返回列表
    imageUrl: "", // 上传LOGO图片
    loading: false,
    copyWrite: "", // 广告文案
    description: "", // 广告描述
  }

  // 监听上传LOGO
  handleChangeLOGO = (info) => {
    let response = info.file.response;
    let headPortrait = "";

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      message.success(`${info.file.name} 上传成功！`);
      getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl,
          loading: false,
        })
      });
      headPortrait = response.data;
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
      headPortrait = "";
      this.setState({ loading: false });
    }

    this.setState({
      headPortrait
    })
  }

  // 监听input框
  onChangeInput = (name, e) => {
    let obj = {};
    obj[name] = e.target.value

    this.setState({
      ...obj
    })
  }

  // 向上级传入当前数据
  passParentData = () => {
    const { fileList, headPortrait, copyWrite, description } = this.state;
    const { type } = this.props;
    let creativeImgs = [];

    fileList.forEach(item => {
      if (item.response && item.response.data) {
        creativeImgs.push(item.response.data)
      }
    })

    return {
      type,
      creativeImgs,
      headPortrait, 
      copyWrite,
      description
    }
  }
  
  render () {
    const _this = this;
    const { fileList, imageUrl } = this.state;
    const { type, creativeID } = this.props;

    const props = {
      name: 'file',
      multiple: true,
      action: '/plan/upLoad',
      data: {
        type: 2,
        token: getCookie('userInfo') ? JSON.parse(getCookie('userInfo')).token : ""
      },
      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';

        if (!isJPG) {
          message.error('请上传图片格式为JPG/JPEG!');
        }

        const isLt2M = file.size / 1024 < 50;
        if (!isLt2M) {
          message.error('图片大小不能超过50k');
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
          return resp.w === 640 && resp.h === 180
        }).then(res => {
          if (!res) {
            message.error(`${file.name}图片尺寸不为640*180`);
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
        })

        return isJPG && isLt2M;
      },
      onChange (info) {
        const status = info.file.status;
        let fileList = info.fileList;

        if (status === 'uploading') {
          _this.setState({
            fileList
          })
        }
        if (status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
          _this.setState({
            fileList
          })
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
          _this.setState({
            fileList
          })
        }
      },
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

    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <section className={ type === creativeID ? "creative-component" : "creative-component active"}>
        <div className="creative-group">
          <h3>上传创意</h3>
          <div className="creative-content">
            <div className="left">
              <Dragger {...props} fileList={ fileList }>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">640*180</p>
                <p className="ant-upload-hint">请点击或拖拽</p>
                <p className="ant-upload-hint">JPG/JPEG, 小于50k</p>
              </Dragger>
            </div>

            <div className="right">
              <Button className="sc-btn"><Icon type="folder" />从素材库选择</Button>
            </div>
          </div>
        </div>

        <div className="creative-group">
          <h3>上传品牌LOGO</h3>

          <div className="avatar-uploader-group">
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action='/plan/upLoad'
              data={{ type: 3, token: getCookie('userInfo') ? JSON.parse(getCookie('userInfo')).token : "" }}
              beforeUpload={beforeUpload}
              onChange={this.handleChangeLOGO}
            >
              {imageUrl ? <div className="img-box"><img src={imageUrl} alt="" /></div> : uploadButton}
            </Upload>
          </div>
        </div>

        <div className="creative-group">
          <h3>广告文案</h3>

          <div className="input-box">
            <Input maxLength={20} onChange={this.onChangeInput.bind(this, "copyWrite")} placeholder="不能超过20个字符" />
          </div>
        </div>

        <div className="creative-group"> 
          <h3>广告描述</h3>

          <div className="input-box">
            <Input maxLength={20} onChange={this.onChangeInput.bind(this, "description")} placeholder="不能超过20个字符" />
          </div>
        </div>

        <div className="creative-group">
          <h3>广告预览</h3>
        </div>
      </section>
    )
  }
}

export default CreativeUpload;
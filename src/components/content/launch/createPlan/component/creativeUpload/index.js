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
  }

  // 监听上传LOGO
  handleChangeLOGO = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      message.success(`${info.file.name} 上传成功！`);
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
      this.setState({ loading: false });
    }
  }
  
  render () {
    const _this = this;
    const { fileList, imageUrl } = this.state;

    const props = {
      name: 'file',
      multiple: true,
      action: '/plan/upLoad',
      data: {
        type: 2,
        token: JSON.parse(getCookie('userInfo')).token
      },
      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
        let deepfileList = JSON.parse(JSON.stringify(fileList));

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
            message.error('图片尺寸为640*180');
            _this.setState({
              fileList: deepfileList.splice((deepfileList.length - 1), 1)
            })
          }
        })

        return isJPG && isLt2M;
      },
      onChange (info) {
        const status = info.file.status;
        let fileList = info.fileList;
        // let response = info.file.response;
        // let deepBackFileUrl = JSON.parse(JSON.stringify(backFileUrl));

        if (status === 'uploading') {
          _this.setState({
            fileList
          })
        }
        if (status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
          console.log(fileList)
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
      <section className="creative-component">
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
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action='/plan/upLoad'
              data={{ type: 3, token: JSON.parse(getCookie('userInfo')).token }}
              beforeUpload={beforeUpload}
              onChange={this.handleChangeLOGO}
            >
              {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
            </Upload>
          </div>
        </div>

        <div className="creative-group">
          <h3>广告文案</h3>

          <div className="input-box">
            <Input maxLength={20} placeholder="不能超过20个字符" />
          </div>
        </div>

        <div className="creative-group">
          <h3>广告描述</h3>

          <div className="input-box">
            <Input maxLength={20} placeholder="不能超过20个字符" />
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
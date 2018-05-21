import React, { Component } from 'react';
import { Upload, Icon, message, Button, Input, Modal, Table } from 'antd';
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
    text: "", // 广告文案
    descs: "", // 广告描述
    previewVisible: false,
    previewImage: '',
    posIds: '', // 关联广告位ID
    logo: '', // 头像链接
    url: '', // 创意链接
  }

  // 监听上传LOGO
  handleChangeLOGO = (info) => {
    let response = info.file.response;
    let logo = "";

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
      logo = response.data;
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
      logo = "";
      this.setState({ loading: false });
    }

    this.setState({
      logo
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
    const { fileList, logo, text, descs, posIds } = this.state;
    const { type } = this.props;
    let url = [];

    fileList.forEach(item => {
      if (item.response && item.response.data) {
        url.push(item.response.data)
      }
    })

    return {
      type,
      url: url.join(','),
      logo,
      text,
      descs,
      posIds
    }
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }
  
  render () {
    const _this = this;
    const { fileList, imageUrl, previewVisible, previewImage } = this.state;
    const { type, creativeID, dataSource } = this.props;
    
    const props = {
      name: 'file',
      multiple: true,
      action: '/plan/upLoad',
      listType: "picture-card",
      data: {
        type: 2,
        token: getCookie('userInfo') ? JSON.parse(getCookie('userInfo')).token : ""
      },
      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif';

        if (!isJPG) {
          message.error('请上传图片格式为JPG/JPEG/PNG/GIF!');
        }

        return isJPG;
      },
      onChange (info) {
        const status = info.file.status;
        let fileList = info.fileList;
        let respone = info.file.response;
        let uid = info.file.uid;
        let deepfileList = JSON.parse(JSON.stringify(fileList));

        if (status === 'uploading') {
          _this.setState({
            fileList
          })
        }
        if (status === 'done') {
          if (Number(respone.code) === 200) {
            message.success(`${info.file.name} 上传成功！`);
            _this.setState({
              fileList
            })
          } else {
            message.error(`${info.file.name} 上传失败！`);
            deepfileList.forEach((item, index) => {
              if (item.uid === uid) {
                deepfileList.splice(index, 1)
              }
            })
    
            _this.setState({
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
  
          _this.setState({
            fileList: deepfileList
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
      },
      onPreview: this.handlePreview
    };

    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const columns = [{
      title: '广告位名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '渠道',
      dataIndex: 'channelName',
      key: 'channelName',
    }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          posIds: selectedRowKeys.join(',')
        })
      }
    };

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
                <p className="ant-upload-hint">请点击或拖拽</p>
                <p className="ant-upload-hint">JPG/JPEG/PNG/GIF</p>
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
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </div>

        <div className="creative-group">
          <h3>广告文案</h3>

          <div className="input-box">
            <Input onChange={this.onChangeInput.bind(this, "text")} />
          </div>
        </div>

        <div className="creative-group"> 
          <h3>广告描述</h3>

          <div className="input-box">
            <Input onChange={this.onChangeInput.bind(this, "descs")} />
          </div>
        </div>

        <div className="creative-group">
          <h3>关联广告位</h3>

          <div className="input-box table-box" key={type}>
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
      </section>
    )
  }
}

export default CreativeUpload;
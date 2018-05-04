import React, { Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { getCookie } from '@/components/common/methods';

class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    validation: false, // 验证图片格式
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.init) {
      let arr = nextProps.init.split(',');
      let fileList = [];

      arr.forEach((item, index) => {
        let obj = {
          uid: index,
          name: 'xxx.png',
          status: 'done',
          url: item
        }

        fileList.push(obj)
      })

      this.setState({
        fileList
      })
    }
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

  handleChange = (info) => {
    let fileList = JSON.parse(JSON.stringify(info.fileList));
    let uid = info.file.uid;
    let respone = info.file.response;

    this.setState({ 
      fileList
    })

    if (info.file.status === 'done') {
      if (Number(respone.code) === 200) {
        this.props.backUploadData(fileList);
        message.success(`${info.file.name} 上传成功！`);
      } else {
        message.warning(`${info.file.name} 上传失败！`);
        fileList.forEach((item, index) => {
          if (uid === item.uid) {
            fileList.splice(index, 1)
          }
        })
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
      fileList.forEach((item, index) => {
        if (uid === item.uid) {
          fileList.splice(index, 1)
        }
      })
    }

    this.setState({
      fileList
    })
  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
    const fileList = this.state;

    if (!isJPG) {
      message.error('格式支持PNG、JPG！');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }

    this.setState({
      validation: isJPG
    })
    return isJPG;
  }

  onRemove = (file) => {
    let fileList = JSON.parse(JSON.stringify(this.state.fileList));

    fileList.forEach((item, index) => {
      if (item.uid === file.uid) {
        fileList.splice(index, 1)
      }
    })

    this.props.backUploadData(fileList)
    this.setState({
      fileList
    })
  }

  render () {
    const { previewVisible, previewImage, fileList, validation } = this.state;
    const { type } = this.props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <section  className="clearfix">
        <Upload
          name="file"
          action="/plan/upLoad"
          listType="picture-card"
          fileList={fileList}
          data={{ type, token: getCookie('userInfo') ? JSON.parse(getCookie('userInfo')).token : "" }}
          onPreview={validation ? this.handlePreview : null}
          onChange={validation ? this.handleChange : null}
          beforeUpload={this.beforeUpload}
          onRemove={this.onRemove}
          className="upload-box"
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        <p style={{ fontSize: '14px', color: '#999' }}>支持PNG、JPG格式</p>
      </section>
    )
  }
}

export default PicturesWall;
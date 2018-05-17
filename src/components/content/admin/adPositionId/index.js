import React, { Component } from 'react';
import { Button, Input, Table, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import { getCookie } from '@/components/common/methods';
import './style.scss';

const confirm = Modal.confirm;
const userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : '';
const menus = userInfo.menus;

class AdPositionId extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    total: '', // 总共的数据条数
    adPositionList: [], // 广告主列表
    rowData: '', // 操作列数据
    operationType: '', // 操作类型
    confirmVisible: true, // 确认框状态
  }

  componentDidMount () {
    this.getUserList()
  }

  // 获取广告主列表
  getUserList = () => {
    const { pageNum, pageSize, name } = this.state;
    HttpRequest("/plan/posList", "POST", {
      pageNum,
      pageSize
    }, res => {
      this.setState({
        total: res.data.totalNum,
        adPositionList: res.data.ls
      })
    })
  }

  // 监听input框
  onChangeInput = (name, e) => {
    let obj = {};
    obj[name] = e.target.value.trim();

    this.setState({
      ...obj
    })
  }

  // 确认框
  showConfirm = (type, data) => {
    this.setState({
      rowData: data,
      operationType: type
    })

    let _this = this;

    confirm({
      title: '确认本次操作?',
      visible: _this.state.confirmVisible,
      onOk() {
        if (type === 1) {
          _this.delPos()
        } else if (type === 2) {
          _this.upDatePosState()
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 删除广告位
  delPos = () => {
    const { rowData } = this.state;

    HttpRequest('/plan/delPos', "POST", {
      id: rowData.id
    }, res => {
      message.success('删除成功！');
      this.getUserList();
      this.setState({
        confirmVisible: false
      })
    })
  }

  // 修改广告位状态
  upDatePosState = () => {
    const { rowData } = this.state;

    HttpRequest('/plan/updatePosState', "POST", {
      id: rowData.id,
      state: rowData.state === 0 ? 1 : 0
    }, res => {
      message.success('修改成功！');
      this.getUserList();
      this.setState({
        confirmVisible: false
      })
    })
  }

  render () {
    const { pageNum, pageSize, total, adPositionList } = this.state;
    let columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '广告位名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '渠道',
      dataIndex: 'channelName',
      key: 'channelName',
    }, {
      title: '渠道广告位ID',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '创意形式',
      dataIndex: 'text',
      key: 'text',
    }, {
      title: '描述',
      dataIndex: 'descs',
      key: 'descs',
    }, {
      title: '状态',
      render: (text, record) => {
        return <span>{ record.state === 0 ? '禁用' : '启用' }</span>
      }
    }, {
      title: '操作',
      render : (text, record) => {
        var path = `/content/admin/new-edit-ad/${record.id}`;
        return (
          <div className="operation">
            {
              menus.indexOf('162') > -1
              ?
              <Link to={path}>编辑</Link>
              :
              ''
            }
            {
              menus.indexOf('163') > -1
              ?
              <a style={{ margin: '0 10px' }} onClick={ this.showConfirm.bind(this, 2, record) }>{ record.state === 0 ? '启用' : '禁用' }</a>
              :
              ''
            }
            {
              menus.indexOf('164') > -1
              ?
              <a onClick={ this.showConfirm.bind(this, 1, record) }>删除</a>
              :
              ''
            }
          </div>
        )
      }
    }];

    if (menus.indexOf('162') === -1 && menus.indexOf('163') === -1 && menus.indexOf('164') === -1) {
      columns.splice((columns.length -1), 1)
    }

    return (
      <section className="adPosition-box">
        <div className="content-top">
          <h4>广告位管理</h4>
          <div className="launch-top-button">
            {
              menus.indexOf('161') > -1
              ?
              <Link to="/content/admin/new-edit-ad/new"><Button type="primary">新建广告位</Button></Link>
              :
              ''
            }
          </div>
        </div>

        <div className="advertiser-tables">
          <div className="table-box">
            <Table 
              rowKey={(record, index) => index}
              columns={columns} 
              dataSource={adPositionList} 
              pagination={{ showQuickJumper: true, total, current: pageNum, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${total} 条`}}
            />
          </div>
        </div>
      </section>
    )
  }
}

export default AdPositionId;
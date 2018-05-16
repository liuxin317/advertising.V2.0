import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, message, Modal } from 'antd';
import HttpRequest from '@/utils/fetch';

const confirm = Modal.confirm;

class Account extends Component {
  state = {
    accountList: [], // 账户列表
  }

  componentDidMount () {
    this.querySysUserList()
  }

  // 打开弹窗
  showConfirm = (type, data) => {
    const _this = this;

    confirm({
      title: '确认本次操作吗?',
      onOk() {
        if (type === 1) { // 修改状态
          _this.updateSysUser(data)
        } else { // 删除
          _this.delSysUser(data)
        }
      }
    });
  }

  // 获取账户列表
  querySysUserList = () => {
    HttpRequest("/sys/querySysUserList", "POST", {}, res => {
      this.setState({
        accountList: res.data
      })
    })
  }

  // 修改状态
  updateSysUser = (data) => {
    data.state = data.state === 0 ? 1 : 0;

    HttpRequest("/sys/updateSysUser", "POST", {
      userJson: JSON.stringify(data)
    }, res => {
      message.success('修改成功！')
      this.querySysUserList()
    })
  }

  // 删除
  delSysUser = (data) => {
    HttpRequest("/sys/delSysUser", "POST", {
      id: data.id
    }, res => {
      message.success('删除成功！')
      this.querySysUserList()
    })
  }

  render () {
    const { accountList } = this.state;

    const columns = [{
      title: '账户名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        return <span>{ text === 0 ? '暂停' : '开启' }</span>
      }
    }, {
      title: '联系人',
      dataIndex: 'cUserName',
      key: 'cUserName',
    }, {
      title: '联系人电话',
      dataIndex: 'cUserPhone',
      key: 'cUserPhone',
    }, {
      title: '操作',
      render : (text, record) => {
        var path = `/content/admin/account-new-edit/${record.id}`;
        return (
          <div className="operation">
            <Link to={path}>编辑</Link>
            <a style={{margin: '0 10px'}} onClick={this.showConfirm.bind(this, 1, record)}>{ record.state === 0 ? '开启' : '暂停' }</a>
            <a onClick={this.showConfirm.bind(this, 2, record)}>删除</a>
          </div>
        )
      }
    }];

    return (
      <section className="account-box">
        <div className="content-top">
          <h4>账户管理</h4>
          <div className="launch-top-button">
            <Link to="/content/admin/account-new-edit/new"><Button type="primary">新建账户</Button></Link>
          </div>
        </div>

        <div className="table-box">
            <Table 
              rowKey={(record, index) => index}
              columns={columns} 
              dataSource={accountList} 
              pagination={false}
            />
        </div>
      </section>
    )
  }
}

export default Account;
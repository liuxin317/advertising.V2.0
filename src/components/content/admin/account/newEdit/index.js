import React, { Component } from 'react';
import { Icon, Input, InputNumber, Tree, Button, message } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import '../../advertiser/newAdvertiser/style.scss';
import './style.scss';

const TreeNode = Tree.TreeNode;

class NewEdit extends Component {
  state = {
    isNowEdit: 1, // 是否是新建或者编辑页面（1、新建，2编辑）
    userName: '', // 账户名称
    passWord: '', // 账户密码
    enterPassWord: '', // 再次确认密码
    cUserName: '', // 联系人姓名
    cUserPhone: '', // 联系人电话
    menus: '', // 权限菜单
    accountId: '', // 帐号ID
    autoExpandParent: true,
    checkedKeys: [], // 默认选中权限
    permissions: [], // 权限树
    redirect: false, // 跳转状态
    state: '', // 编辑时需要
  }

  componentDidMount () {
    const { match } = this.props;

    if (match.params) {
      let isNowEdit = '';

      if (match.params.state !== 'new') { // 编辑页面
        isNowEdit = 2
        this.setState({
          accountId: match.params.state
        }, () => {
          this.querySysUser();
        })
      } else {
        isNowEdit = 1
      }

      this.setState({
        isNowEdit
      }, () => {
        this.queryMenus()
      })
    }
  }

  // 监听输入框
  onChangeInput = (name, e) => {
    let obj = {};
    obj[name] = e.target.value.trim()

    this.setState({
      ...obj
    })
  }

  // 监听数字输入框
  onChangeInputNumber = (name, value) => {
    let obj = {};
    obj[name] = value

    this.setState({
      ...obj
    })
  }

  // 获取权限树
  querySysUser = () => {
    const { accountId } = this.state;

    HttpRequest("/sys/querySysUser", "POST", {
      id: accountId
    }, res => {
      console.log(res.data.menus.split(','))
      this.setState({
        cUserName: res.data.cUserName,
        cUserPhone: res.data.cUserPhone,
        passWord: res.data.passWord,
        enterPassWord: res.data.passWord,
        userName: res.data.userName,
        state: res.data.state,
        checkedKeys: res.data.menus.split(',')
      })
    })
  }

  // 查询菜单列表
  queryMenus = () => {
    const { isNowEdit } = this.state;

    HttpRequest("/sys/queryMenus", "POST", {}, res => {
      if (isNowEdit === 1) {
        let checkedKeys = [];
        this.recursive(checkedKeys, res.data);
        this.setState({
          checkedKeys
        })
      }

      this.setState({
        permissions: res.data
      })
    })
  }

  // 递归函数
  recursive = (variable, data) => {
    data.forEach(item => {
      variable.push(String(item.id))
      if (item.menus && item.menus.length) {
        this.recursive(variable, item.menus)
      }
    })
  }

  // 权限树
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.menus) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.menus)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  // 监听树
  onCheck = (e) => {
    this.setState({ checkedKeys: e.checked });
  }

  // 提交
  submitTest = () => {
    const { userName, passWord, enterPassWord, cUserName, cUserPhone, checkedKeys, isNowEdit } = this.state;
    if (!userName) {
      message.warning('请填写账户名称！')
    } else if (!passWord) {
      message.warning('请填写密码！')
    } else if (!enterPassWord) {
      message.warning('请填写再次密码！')
    } else if (enterPassWord !== passWord) {
      message.warning('两次密码输入不一致！')
    } else if (!cUserName) {
      message.warning('请填写联系人姓名！')
    } else if (!cUserPhone) {
      message.warning('请填写联系人电话！')
    } else if (!checkedKeys.length) {
      message.warning('请勾选功能权限！')
    } else {
      if (isNowEdit === 1) { // 新建
        this.addSysUser({userName, passWord, cUserName, cUserPhone, menus: checkedKeys.join(',')})
      } else { // 编辑
        this.updateSysUser({userName, passWord, cUserName, cUserPhone, menus: checkedKeys.join(','), id: this.state.accountId, state: this.state.state})
      }
    }
  }

  // 新建
  addSysUser = (data) => {
    HttpRequest("/sys/addSysUser", "POST", {
      userJson: JSON.stringify(data)
    }, res => {
      message.success('创建成功！')
      setTimeout(() => {
        this.setState({
          redirect: true
        })
      }, 600)
    })
  }

  // 编辑
  updateSysUser = (data) => {
    HttpRequest("/sys/updateSysUser", "POST", {
      userJson: JSON.stringify(data)
    }, res => {
      message.success('修改成功！')
      setTimeout(() => {
        this.setState({
          redirect: true
        })
      }, 600)
    })
  }

  render () {
    const { isNowEdit, userName, passWord, enterPassWord, cUserName, cUserPhone, permissions, autoExpandParent, checkedKeys, redirect } = this.state;

    if (redirect) {
      return <Redirect push to="/content/admin/account" />
    }

    return (
      <section className="new-edit__box">
        <h4 className="cloumn-name"><Link to="/content/admin/account"><Icon type="left" /> { isNowEdit === 1 ? '新建账户' : '编辑账户' }</Link></h4> 

        <div className="cloumn-group">
          <div className="input-group">
              <label className="name"><em>*</em> 账户名称：</label>
              <div className="main">
                  <Input value={ userName } onChange={this.onChangeInput.bind(this, 'userName')} />
              </div>
          </div>

          <div className="input-group">
              <label className="name"><em>*</em> 账户密码：</label>
              <div className="main">
                  <Input type="password" value={ passWord } onChange={this.onChangeInput.bind(this, 'passWord')} />
              </div>
          </div>

          <div className="input-group">
              <label className="name"><em>*</em> 确认密码：</label>
              <div className="main">
                  <Input type="password" value={ enterPassWord } onChange={this.onChangeInput.bind(this, 'enterPassWord')} />
              </div>
          </div>

          <div className="input-group">
              <label className="name"><em>*</em> 联系人姓名：</label>
              <div className="main">
                  <Input value={ cUserName } onChange={this.onChangeInput.bind(this, 'cUserName')} />
              </div>
          </div>

          <div className="input-group">
              <label className="name"><em>*</em> 联系人电话：</label>
              <div className="main">
                  <InputNumber min={0} value={ cUserPhone } onChange={this.onChangeInputNumber.bind(this, 'cUserPhone')} />
              </div>
          </div>

          <div className="input-group">
              <label className="name"><em>*</em> 功能权限：</label>
              <div className="main">
                {
                  checkedKeys && checkedKeys.length && permissions && permissions.length
                  ?
                  <Tree
                    checkable
                    checkStrictly={true}
                    defaultExpandAll={autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                  >
                    {this.renderTreeNodes(permissions)}
                  </Tree>
                  :
                  ''
                }
              </div>
          </div>
        </div>

        {/* 按钮 */}
        <div className="btn-group">
          <Button type="primary" onClick={ this.submitTest }>确认</Button>
          <Link to="/content/admin/account"><Button style={{ marginLeft: 60 }}>取消</Button></Link>
        </div>
      </section>
    )
  }
}

export default NewEdit;
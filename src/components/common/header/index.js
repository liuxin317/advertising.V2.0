import React, { Component } from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { getCookie } from '@/components/common/methods';
import './style.scss';

const userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : '';

class Head extends Component {
  // 切换客户下拉;

  render () {
    const { toggleMenuFun, collapsed } = this.props;

    return (
      <header>
        <menu className="menu-title">
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={ toggleMenuFun ? toggleMenuFun : null } />
          <span>菜单列表</span>
        </menu>
        <div className="user-info">
          <Icon type="user" />
          <span>欢迎！{ userInfo.userName }</span>
        </div>
      </header>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    collapsed: store.common.collapsed,
    toggleMenuFun: store.common.toggleMenuFun
  }
}

const ConnectHead = connect(
  mapStateToProps
)(Head)

export default ConnectHead;
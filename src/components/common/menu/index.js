import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import Store from '@/store';
import Type from '@/action/Type';
import './style.scss';

const SubMenu = Menu.SubMenu;

class MenuBar extends Component {
  state = {
    collapsed: false
  }

  componentDidMount () {
    Store.dispatch({ type: Type.TOGGLE_MENU_FUN, payload: { toggleMenuFun: this.toggleCollapsed } });
  }

  handleClick = (e) => {
    console.log('click ', e);
  }

  // 收缩菜单
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    }, () => {
      Store.dispatch({ type: Type.COLLAPSED, payload: { collapsed: this.state.collapsed } });
    });
  }

  render () {
    return (
      <nav className={ this.state.collapsed ? "menu-box" : "menu-box active" }>
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="1"><Icon type="area-chart" /> <span>Dashboard</span></Menu.Item>
          <Menu.Item key="2"><Link to="/content/launch"><Icon type="shop" /> <span>投放管理</span></Link></Menu.Item>
          <SubMenu key="sub2" title={<span><Icon type="credit-card" /><span>报表管理</span></span>}>
            <Menu.Item key="3">实时报表</Menu.Item>
            <Menu.Item key="4">基础报表</Menu.Item>
          </SubMenu>
          <Menu.Item key="6"><Icon type="pay-circle-o" /> <span>财务管理</span></Menu.Item>
          <SubMenu key="sub3" title={<span><Icon type="user" /><span>管理员</span></span>}>
            <Menu.Item key="8"><Link to="/content/admin/advertiser"><span>广告主管理</span></Link></Menu.Item>
            <Menu.Item key="9"><Link to="/content/admin/ad-position"><span>广告位管理</span></Link></Menu.Item>
            <Menu.Item key="10"><span>优先级调控</span></Menu.Item>
            <Menu.Item key="11"><span>低价调控</span></Menu.Item>
          </SubMenu>
        </Menu>
      </nav>
    )
  }
}

export default MenuBar;

import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Store from '@/store';
import Type from '@/action/Type';
import { getCookie } from '@/components/common/methods';
import './style.scss';

const SubMenu = Menu.SubMenu;
const userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : '';
const menus = userInfo.menus;

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
    const { pathname } = this.props;
    let str = '';
    let defaultSelectedKeys = '';

    if (pathname.indexOf('/content/admin') !== -1) {
      str = 'sub3';
    } else if (pathname.indexOf('/content/report') !== -1) {
      str = 'sub2';
    }

    defaultSelectedKeys = pathname

    if (pathname === '/content') {
      defaultSelectedKeys = '/content/dashboard'
    } else if (pathname.indexOf('/content/admin/advertiser-new-edit') !== -1) {
      defaultSelectedKeys = '/content/admin/advertiser'
    } if (pathname.indexOf('/content/admin/new-edit-ad') !== -1) {
      defaultSelectedKeys = '/content/admin/ad-position'
    } else if (pathname.indexOf('/content/admin/account-new-edit') !== -1) {
      defaultSelectedKeys = '/content/admin/account'
    }

    return (
      <nav className={ this.state.collapsed ? "menu-box" : "menu-box active" }>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[defaultSelectedKeys]}
          defaultOpenKeys={[str]}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="/content/dashboard"><Link to="/content/dashboard"><Icon type="area-chart" /><span>Dashboard</span></Link></Menu.Item>
          {
            menus.indexOf('169') > -1
            ?
            <Menu.Item key="/content/launch"><Link to="/content/launch"><Icon type="shop" /><span>投放管理</span></Link></Menu.Item>
            :
            ''
          }

          {
            menus.indexOf('172') > -1
            ?
            <SubMenu key="sub2" title={<span><Icon type="credit-card" /><span>报表管理</span></span>}>
              {
                menus.indexOf('168') > -1
                ?
                <Menu.Item key="/content/report/real-time"><Link to="/content/report/real-time">实时报表</Link></Menu.Item>
                :
                ''
              }
              {/* {
                menus.indexOf('167') > -1
                ?
                <Menu.Item key="4">基础报表</Menu.Item>
                :
                ''
              } */}
            </SubMenu>
            :
            ''
          }
          {
            menus.indexOf('170') > -1
            ?
            <Menu.Item key="/content/financial"><Link to="/content/financial"><Icon type="pay-circle-o" /><span>财务管理</span></Link></Menu.Item>   
            :
            ''  
          }
          {
            menus.indexOf('171') > -1
            ?
            <SubMenu key="sub3" title={<span><Icon type="user" /><span>管理员</span></span>}>
              {
                menus.indexOf('155') > -1
                ?
                <Menu.Item key="/content/admin/advertiser"><Link to="/content/admin/advertiser"><span>广告主管理</span></Link></Menu.Item>
                :
                ''
              }
              {
                menus.indexOf('156') > -1
                ?
                <Menu.Item key="/content/admin/ad-position"><Link to="/content/admin/ad-position"><span>广告位管理</span></Link></Menu.Item>
                :
                ''
              }
              {
                menus.indexOf('157') > -1
                ?
                <Menu.Item key="/content/admin/priority"><Link to="/content/admin/priority"><span>优先级调控</span></Link></Menu.Item>
                :
                ''
              }
              {
                menus.indexOf('158') > -1
                ?
                <Menu.Item key="/content/admin/regulation"><Link to="/content/admin/regulation"><span>低价调控</span></Link></Menu.Item>
                :
                ''
              }
              {
                userInfo.superUser === 1
                ?
                <Menu.Item key="/content/admin/account"><Link to="/content/admin/account"><span>账户管理</span></Link></Menu.Item>
                :
                ''
              }
            </SubMenu>
            :
            ''
          }
        </Menu>
      </nav>
    )
  }
}

const withMenuBar = withRouter(({history,location,match}) => {
  return <MenuBar pathname={location.pathname} />
})

export default withMenuBar;

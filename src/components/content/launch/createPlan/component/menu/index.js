import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import { Menu } from 'antd';
import Store from '@/store';
import Type from '@/action/Type';
import './style.scss';

const MenuItemGroup = Menu.ItemGroup;

class MenuBar extends Component {
  state = {
    collapsed: false,
    defaultKey: '1', // 默认到那个菜单列表
  }

  componentDidMount () {
    Store.dispatch({ type: Type.TOGGLE_MENU_FUN, payload: { toggleMenuFun: this.toggleCollapsed } });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.adCreateOne || nextProps.adCreateTwo) {
        this.windowScroll()
    }
  }

  componentWillUnmount () {
    window.onscroll = null;
  }

  // scroll事件
  windowScroll = () => {
    let $ = (e) => document.querySelector(e);
    let monitorScrTops = [$("#selected_plan").offsetTop, $("#land_page").offsetTop, $("#ad_layout").offsetTop, $("#directional").offsetTop, $("#frequency").offsetTop, $("#bid").offsetTop, $("#originality").offsetTop];

    // 监听竖向滚动条
    window.onscroll = () => {
      let scrolltop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let defaultKey = "1";
      let actualScrolltop = scrolltop + 30;

      // 监听右侧菜单栏位置
      if ($('.menu-plan-box')) {
        if (scrolltop >= 60) {
          $('.menu-plan-box').style.top = 0;
        } else if (scrolltop > 0 && scrolltop < 60) {
          $('.menu-plan-box').style.top = (60 - scrolltop) + 'px';
        } else if (scrolltop === 0) {
          $('.menu-plan-box').style.top = 60 + 'px';
        }
      }

      $('.one').classList.remove('ant-menu-item-selected')
      $('.two').classList.remove('ant-menu-item-selected')
      $('.three').classList.remove('ant-menu-item-selected')
      $('.four').classList.remove('ant-menu-item-selected')
      $('.five').classList.remove('ant-menu-item-selected')
      $('.six').classList.remove('ant-menu-item-selected')
      $('.seven').classList.remove('ant-menu-item-selected')

      // 监听下拉条所在位置
      if (actualScrolltop <= monitorScrTops[0]) {
        defaultKey = "1"
        $('.one').classList.add('ant-menu-item-selected')
      } else if (actualScrolltop >= monitorScrTops[0]  && actualScrolltop < monitorScrTops[1] ) {
        defaultKey = "1"
        $('.one').classList.add('ant-menu-item-selected')
      } else if (actualScrolltop >= monitorScrTops[1]  && actualScrolltop < monitorScrTops[2] ) {
        defaultKey = "2"
        $('.two').classList.add('ant-menu-item-selected')
      } else if (actualScrolltop >= monitorScrTops[2]  && actualScrolltop < monitorScrTops[3] ) {
        defaultKey = "3"
        $('.three').classList.add('ant-menu-item-selected')
      } else if (actualScrolltop >= monitorScrTops[3]  && actualScrolltop < monitorScrTops[4] ) {
        defaultKey = "4"
        $('.four').classList.add('ant-menu-item-selected')
      } else if (actualScrolltop >= monitorScrTops[4]  && actualScrolltop < monitorScrTops[5] ) {
        defaultKey = "5"
        $('.five').classList.add('ant-menu-item-selected')
      } else if (actualScrolltop >= monitorScrTops[5]  && actualScrolltop < monitorScrTops[6] ) {
        defaultKey = "6"
        $('.six').classList.add('ant-menu-item-selected')
      } else if (actualScrolltop >= monitorScrTops[6]) {
        defaultKey = "7"
        $('.seven').classList.add('ant-menu-item-selected')
      }
    }
  }

  handleClick = (e) => {
    if (e.key) {
      const { adCreateOne, adCreateTwo } = this.props;
      let defaultKey = String(e.key);
      let props = e.item.props;
      let $ = (e) => document.querySelector(e);
      let elmDocTop = $(`#${props.destination}`).offsetTop;

      // 关闭scroll监听菜单事件
      window.onscroll = () => {
        let scrolltop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

        // 监听右侧菜单栏位置
        if (scrolltop >= 60) {
          document.querySelector('.menu-plan-box').style.top = 0;
        } else if (scrolltop > 0 && scrolltop < 60) {
          document.querySelector('.menu-plan-box').style.top = (60 - scrolltop) + 'px';
        } else if (scrolltop === 0) {
          document.querySelector('.menu-plan-box').style.top = 60 + 'px';
        }
      }

      if (adCreateOne) {
        if (defaultKey !== "7") {
          this.rollAnimation(elmDocTop)
          this.setState({
            defaultKey
          })
        }
      }

      if (adCreateTwo) {
        $('.one').classList.remove('ant-menu-item-selected')
        $('.two').classList.remove('ant-menu-item-selected')
        $('.three').classList.remove('ant-menu-item-selected')
        $('.four').classList.remove('ant-menu-item-selected')
        $('.five').classList.remove('ant-menu-item-selected')
        $('.six').classList.remove('ant-menu-item-selected')
        $('.seven').classList.remove('ant-menu-item-selected')

        this.setState({
          defaultKey
        })
        this.rollAnimation(elmDocTop)
      }
    }
  }

  // 滚动动效
  rollAnimation = (elmDocTop, type) => {
    let scrolltop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    let winH = document.documentElement.offsetHeight || document.body.offsetHeight;
    let elmH = document.querySelector('.create-plan').offsetHeight;
    let maxH = elmH - winH;
    
    if (type) {
      if (type === 1) {
        if (scrolltop <= elmDocTop) {
          window.scrollTo(0, elmDocTop)
          // 开启scroll监听菜单事件
          this.windowScroll()
          return false;
        }
      } else {
        if (scrolltop >= elmDocTop) {
          window.scrollTo(0, elmDocTop)
          // 开启scroll监听菜单事件
          this.windowScroll()
          return false;
        }
      }
    } else {
      if (scrolltop === elmDocTop) {
        // 开启scroll监听菜单事件
        this.windowScroll()
        return false;
      }
    }

    setTimeout(() => {
      if (scrolltop > elmDocTop) {
        window.scrollTo(0, scrolltop = scrolltop - 50)
        this.rollAnimation(elmDocTop, 1)
      } else {
        if (scrolltop > maxH) {
          window.scrollTo(0, maxH + 70)
        } else {
          window.scrollTo(0, scrolltop = scrolltop + 50)
          this.rollAnimation(elmDocTop, 2)
        }
      }
    }, 10)
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
    const { defaultKey } = this.state;

    return (
      <aside>
        <nav className={ this.state.collapsed ? "menu-plan-box" : "menu-plan-box active" }>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[defaultKey]}
            mode="inline"
            inlineCollapsed={this.state.collapsed}
          >
            <MenuItemGroup key="g1" title="广告计划">
              <Menu.Item key="1" className="one" destination="selected_plan">选择计划</Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup key="g2" title="广告">
              <Menu.Item key="2" className="two" destination="land_page">落地页设置</Menu.Item>
              <Menu.Item key="3" className="three" destination="ad_layout">广告版位</Menu.Item>
              <Menu.Item key="4" className="four" destination="directional">定向设置</Menu.Item>
              <Menu.Item key="5" className="five" destination="frequency">排期与频次</Menu.Item>
              <Menu.Item key="6" className="six" destination="bid">出价设置</Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup key="g3" title="广告创意">
              <Menu.Item key="7" className="seven" destination="originality">上传创意</Menu.Item>
            </MenuItemGroup>
          </Menu>
        </nav>
      </aside>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    adCreateOne: store.common.adCreateOne,
    adCreateTwo: store.common.adCreateTwo
  }
}

const ConnectMenuBar = connect(
  mapStateToProps
)(MenuBar)

export default ConnectMenuBar;

import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Head from '../common/header';
import Menu from '../common/menu';
import PlanMenu from './launch/createPlan/component/menu';
import loadable from 'react-loadable'; // 代码的拆分和懒加载
import PreLoading from '../common/Preloading';
import './style.scss';

// Dashboard
const Dashboard = loadable({
  loader: () => import('./dashboard'),
  loading: PreLoading
})

// 投放管理
const Launch = loadable({
  loader: () => import('./launch'),
  loading: PreLoading
})

// 创建广告
const createPlan = loadable({
  loader: () => import('./launch/createPlan'),
  loading: PreLoading
})

// 素材管理
const Material = loadable({
  loader: () => import('./material'),
  loading: PreLoading
})

class Content extends Component {
  render () {
    const { match, location, leftMenuStatus } = this.props;
    
    return (
      <section className="content-box">
        <Head />
        <div className="content">
          {
            leftMenuStatus === 2 
            ?
            <PlanMenu />
            :
            <Menu />
          }
          
          {
            location.pathname === match.path
            ?
            <Redirect push to="/content/launch" />
            :
            ''
          }
          <Route path={`${ match.path }/dashboard`} component={ Dashboard } />
          <Route path={`${ match.path }/launch`} component={ Launch } />
          <Route path={`${ match.path }/create-plan`} component={ createPlan } />
          <Route path={`${ match.path }/material`} component={ Material } />
        </div>
      </section>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    leftMenuStatus: store.common.leftMenuStatus
  }
}

const ConnectContent= connect(
  mapStateToProps
)(Content)

export default ConnectContent;
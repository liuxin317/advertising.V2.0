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

// 管理员
const Admin = loadable({
  loader: () => import('./admin'),
  loading: PreLoading
})

// 财务管理
const Financial = loadable({
  loader: () => import('./financial'),
  loading: PreLoading
})

// 财务记录
const Record = loadable({
  loader: () => import('./financial/record'),
  loading: PreLoading
})

// 报表管理
const Report = loadable({
  loader: () => import('./report'),
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
            <Redirect push to="/content/dashboard" />
            :
            ''
          }
          <Route path={`${ match.path }/dashboard`} component={ Dashboard } />
          <Route path={`${ match.path }/launch`} component={ Launch } />
          <Route path={`${ match.path }/create-plan`} component={ createPlan } />
          <Route path={`${ match.path }/material`} component={ Material } />
          <Route path={`${ match.path }/admin`} component={ Admin } />
          <Route path={`${ match.path }/financial`} component={ Financial } />
          <Route path={`${ match.path }/financial-record/:id/:name`} component={ Record } />
          <Route path={`${ match.path }/report`} component={ Report } />
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
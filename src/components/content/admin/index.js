import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable';
import PreLoading from '@/components/common/Preloading';

// 广告主列表页面
const Advertiser = loadable({
  loader: () => import('./advertiser'),
  loading: PreLoading
})

// 创建编辑广告主
const NewAdvertiser = loadable({
  loader: () => import('./advertiser/newAdvertiser'),
  loading: PreLoading
})

// 广告位列表页
const AdPositionId = loadable({
  loader: () => import('./adPositionId'),
  loading: PreLoading
})

// 新建编辑广告位
const NewEditAd = loadable({
  loader: () => import('./adPositionId/newEditAd'),
  loading: PreLoading
})

// 优先级调控
const Priority = loadable({
  loader: () => import('./priority'),
  loading: PreLoading
})

// 低价调控
const LPRegulation = loadable({
  loader: () => import('./LPRegulation'),
  loading: PreLoading
})

class Admin extends Component {
  render () {
    const { match } = this.props;
    
    return (
      <section className="content-box">
        <Route path={`${ match.path }/advertiser`} component={ Advertiser } />
        <Route path={`${ match.path }/new-advertiser/:state`} component={ NewAdvertiser } />
        <Route path={`${ match.path }/ad-position`} component={ AdPositionId } />
        <Route path={`${ match.path }/new-edit-ad/:state`} component={ NewEditAd } />
        <Route path={`${ match.path }/priority`} component={ Priority } />
        <Route path={`${ match.path }/regulation`} component={ LPRegulation } />
      </section>
    )
  }
}

export default Admin;
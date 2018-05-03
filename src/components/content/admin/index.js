import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable';
import PreLoading from '@/components/common/Preloading';

// 广告主列表页面
const Advertiser = loadable({
  loader: () => import('./advertiser'),
  loading: PreLoading
})

const NewAdvertiser = loadable({
  loader: () => import('./advertiser/newAdvertiser'),
  loading: PreLoading
})

class Admin extends Component {
  render () {
    const { match } = this.props;
    
    return (
      <section className="content-box">
        <Route path={`${ match.path }/advertiser`} component={ Advertiser } />
        <Route path={`${ match.path }/new-advertiser`} component={ NewAdvertiser } />
      </section>
    )
  }
}

export default Admin;
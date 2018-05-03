import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable';
import PreLoading from '@/components/common/Preloading';

const Advertiser = loadable({
  loader: () => import('./advertiser'),
  loading: PreLoading
})

class Admin extends Component {
  render () {
    const { match } = this.props;
    
    return (
      <section className="content-box">
        <Route path={`${ match.path }/advertiser`} component={ Advertiser } />
      </section>
    )
  }
}

export default Admin;
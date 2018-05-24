import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable';
import PreLoading from '@/components/common/Preloading';

// 实时报表
const RealTime = loadable({
  loader: () => import('./realTime'),
  loading: PreLoading
});

// 深度报表
const DepthReport = loadable({
  loader: () => import('./depthReport'),
  loading: PreLoading
});

class Report extends Component {
  render () {
    const { match } = this.props;

    return(
      <section className="content-box">
        <Route path={`${match.path}/real-time`} component={RealTime}/>
        <Route path={`${match.path}/depth/:id`} component={DepthReport}/>
      </section>
    )
  }
}

export default Report;

import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PreLoading from '../components/common/Preloading';
import loadable from 'react-loadable'; // 代码的拆分和懒加载

// 主页面
const Content = loadable({
  loader: () => import('../components/content'),
  loading: PreLoading
})

// 登陆界面
const Login = loadable({
  loader: () => import('../components/login'),
  loading: PreLoading
})

class ViewRoute extends Component {
  render () {
    return (
      <section>
        <Switch>
          <Route path="/" exact render={() => <Redirect to='/login' />}/>
          <Route path="/login" component={Login} />
          <Route path="/content" component={Content} />
        </Switch>
      </section>
    )
  }
}

export default ViewRoute;

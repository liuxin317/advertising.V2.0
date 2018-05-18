import React, { Component } from 'react';
import {HashRouter as Router} from 'react-router-dom';
import Loading from './components/common/Loading';
import ViewRoute from './router';

class App extends Component {
  render() {
    return (
      <Router>
        <section className="box">
            <Loading />
            <ViewRoute />
        </section>
      </Router>
    )
  }
}

export default App;

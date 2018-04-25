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

// const mapDispatchToProps = (dispatch) => {
//   return {
//     hideLoadClick: () => { dispatch({ type: Type.LOAD_STATE, payload: { loading: false } }) }
//   }
// }

export default App;

import React, { Component } from 'react';
import LoadImg from '@/imgs/loading.png';
import { IEVersion } from '@/components/common/methods';

class PageLoading extends Component {
  render() {
    if (IEVersion() <= 9) {
      return <div className="PageLoading"></div>
    } else {
      return (
        <section className="load-box">
            <img className="move-img" src={ LoadImg } alt=""/>
        </section>
      )
    }
  }
}

export default PageLoading;

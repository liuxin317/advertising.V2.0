import React, { Component } from 'react';
import { connect } from 'react-redux'; // 容器组件;
import LoadImg from '../../imgs/loading.png';

class Loading extends Component {
    render () {
        const { loadState } = this.props;

        return (
            <section className={ loadState ? "load-box" : "load-box active" }>
                <img className="move-img" src={ LoadImg } alt=""/>
            </section>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        loadState: store.common.loading
    }
}

const ConnectLoad = connect(
    mapStateToProps
)(Loading)

export default ConnectLoad;
import { createStore, combineReducers, applyMiddleware } from 'redux'; // combineReducers合并reducer， applyMiddleware将中间件组成数组依次执行
import thunk from 'redux-thunk';
import common from '../reducer/common';

const Store = createStore(combineReducers({
  common
}), applyMiddleware(thunk));

export default Store;

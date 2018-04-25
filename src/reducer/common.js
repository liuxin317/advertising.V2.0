import Type from '../action/Type';

export default (state = {}, action) => {
  switch (action.type) {
    case Type.LOAD_STATE :
      return Object.assign({}, state, action.payload)
    default :
      return Object.assign({}, state, action.payload)
  }
}
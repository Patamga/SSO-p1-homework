import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import authentication from './authentication'
import registration from './registration'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    authentication,
    registration
  })

export default createRootReducer

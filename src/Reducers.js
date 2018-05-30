import ActionType from './ActionType'
import {combineReducers} from 'redux'

//reducers
const initState = { status: null, userInfo: {} };
const userStore = (state = initState, action) => {
    switch (action.type) {
        case ActionType.DEL:
        case ActionType.UPD:
        case ActionType.ADD: {
            return {
                ...state,
                status: action.type,
                userInfo: action.userInfo
            }
        }
        default:
            return state;
    }
}
const reducer = combineReducers({ userStore: userStore });

export default reducer;

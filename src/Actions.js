import ActionType from './ActionType'

// Actions
class Actions {
    static addUser(name, age, address) {
        return (dispatch) => dispatch({
            type: ActionType.ADD,
            userInfo: { name, age, address }
        });
    }

    static deleteUser(name) {
        return (dispatch) => dispatch({
            type: ActionType.DEL,
            userInfo: { name }
        })
    }

    static updateUser(name, age, address) {
        return (dispatch) => dispatch({
            type: ActionType.UPD,
            userInfo: { name, age, address }
        })
    }
}

export default Actions;
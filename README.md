###redux的理解
> 它主要是一种观察模式设计也叫事件订阅。可以看node.js 的模块EventEmitter  的实现。源代码不多，很多好理解。以下的简化使用也非常好理解。

### redux 简化使用
```
//简化 redux 的实现
import { createStore } from 'redux';

var reducer = (state = 1, action) => {
    switch (action.type) {
        case 'ADD':
            return state + 1;
        case 'DELETE':
            return state - 1;
        default:
            return 100;
    }
}

var store = createStore(reducer);

var init = store.getState();
console.log('init', init);

//VIEW通过connect props注册到store
function lisner() {
    var v = store.getState();
    console.log('the state: ' + v);
}

store.subscribe(lisner);

//定义Action
class Action {
    static add() {
        store.dispatch({ type: 'ADD' });
    }

    static delete() {
        store.dispatch({ type: 'DELETE' });
    }
}

//其它VIEW或者component 调用Action
Action.add();
Action.add();
Action.add();

setTimeout(() => {
    Action.delete();
    Action.delete();
    Action.delete();
}, 2000);

//需要编译成es5, 或者copy以上代码在babel里面转换，运行测试。
```
### 加入到React 中使用。
> 对于Redux结合到React中使用，初始化声明好Reducer Action store.
Reducer的作用是响应并处理state.  而View通过与store进行connect，把View的props与store的state关联。
Action的作用是View可通过dispatch(Action) 。
具体实现请参照以下代码
```
/**
 * 本文章主要是讲解redux的用法，及作用描述
 */
import {
    createStore, applyMiddleware, combineReducers
} from 'redux'
import thunk from 'redux-thunk'
import React from 'react'
import ReactDOM from 'react-dom'
import {
    Provider
} from 'react-redux'
import {
    Component
} from 'react'
import { List, Button, Input, Row, Col, Table } from 'antd';
import { connect } from 'react-redux'
import './App.css'

//ActionType;
const ActionType = { 'ADD': 'ADD', 'DEL': 'DEL', 'UPD': 'UPD' };
//数组删除项
Array.prototype.baoremove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
}

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

//初始化中间件
const logger = store => next => action => {
    if (typeof action === 'function') console.log('dispaching a function');
    else
        console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
}

const middlewares = [thunk, logger];
const createMiddle = applyMiddleware(...middlewares)(createStore);
var configureStore = (initState) => {
    return createMiddle(reducer, initState);
}

let store = configureStore();

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

//VIEW层
class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号'
            }, {
                key: '2',
                name: 'ru',
                age: 42,
                address: '西湖区湖底公园1号'
            }],
            key: 2
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.status === ActionType.ADD) {
            nextProps.userInfo.key = this.state.key + 1;
            nextState.key = nextProps.userInfo.key;
            console.log(nextProps.userInfo);
            this.state.data.push(nextProps.userInfo);
            return true;
        } else if (nextProps.status === ActionType.DEL) {
            let index = -1;
            this.state.data.find((v, k) => {
                if (v.name == nextProps.userInfo.name) {
                    index = k;
                    return v;
                }
            })
            if (index >= 0) {
                this.state.data.baoremove(index);
                return true;
            }

            return false;
        } else if (nextProps.status === ActionType.UPD) {
            var info = nextProps.userInfo;
            this.state.data[info.index] = info.userName;
            return true;
        }
        return true;
    }

    clearUserName() {

    }

    render() {

        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
        }];

        return (<div className='content'>
            {(this.state.data && this.state.data.length > 0) && <Table dataSource={this.state.data} columns={columns} />}

        </div>);
    }
}
var UserView = connect((store) => {
    // console.log('store',store);
    return {
        userInfo: store.userStore.userInfo,
        status: store.userStore.status,
    }
})(UserList);

class Oper extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    delete() {
        this.props.dispatch(Actions.deleteUser(this.state.value));
    }
    update() {
        this.props.dispatch(Actions.addUser(this.state.value, '21', '中国'));
    }
    change(type,e) {
        this.setState({ 'value': e.target.value });
        console.log('et',e,type);
    }

    render() {
        return <div className="oper">
            <Row className='row'>
                <Col span={6}>
                    <Input onChange={this.change.bind(this,'del')} />
                </Col>
                <Col span={6}>
                    <Button  type="primary" onClick={this.delete.bind(this)}>删除</Button>
                </Col>
            </Row>
            <Row className='row'>
                <Col span={6}>
                    <Input onChange={this.change.bind(this,'add')} />
                </Col>
                <Col span={6}><Button type="primary"  onClick={this.update.bind(this)}>添加</Button></Col>
            </Row>
        </div>;
    }
}

var Operation = connect((store) => {
    return {};
})(Oper);

const App = () => (<div className='app'>
    <UserView />
    <Operation />
</div>);

ReactDOM.render(<Provider store={store}><App /></Provider>,
    document.getElementById('root')
);
```
根据项目需要把它划分成了View、Actoins、ActionTypes.js、Reducers, 也便于理解。

## react-demo

- 1.npm i
- 2.npm run start
- 3.http://localhost:3000/

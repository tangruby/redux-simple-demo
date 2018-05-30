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
import ActionType from './ActionType'
import reducer from './Reducers'
import Action from './Actions'
import Operation from './view/oper'
import UserView from './view/userList'

//数组删除项
Array.prototype.baoremove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
}

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

const App = () => (<div className='app'>
    <UserView />
    <Operation />
</div>);

ReactDOM.render(<Provider store={store}><App /></Provider>,
    document.getElementById('root')
);

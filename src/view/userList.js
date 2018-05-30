import {Component} from 'react'
import { connect } from 'react-redux'
import Action from '../Actions'
import React from 'react'
import { List, Button, Input, Row, Col, Table } from 'antd'
import ActionType from '../ActionType'

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

export default UserView;
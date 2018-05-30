import {Component} from 'react'
import { connect } from 'react-redux'
import Actions from '../Actions'
import React from 'react'
import { List, Button, Input, Row, Col, Table } from 'antd';

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

export default Operation;
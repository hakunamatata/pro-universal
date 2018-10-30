import React, { Component } from 'react';
import {
    Table,
    Modal,
    Button,
    Input, 
    InputNumber,
    Popconfirm,
    Form
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    code: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
class RoleManage extends Component {
       
    render() {
        const columns = [{
            title: '角色编码',
            dataIndex: 'code'
        }, {
            title: '角色名称',
            dataIndex: 'name'
        }, {
            title: '是否启用',
            dataIndex: 'enabled'
        }, {
            title: '创建时间',
            dataIndex: 'createDate'
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <a href="javascript:;">Invite {record.name}</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
              </span>
            ),
          }]
        const { visible } = this.props;
        return (<Modal title="角色管理"
            visible={visible}
            footer={null}
            closable={false}
            centered={true}
        >
        <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
             // onClick={this.showModal}
            //   ref={component => {
            //     /* eslint-disable */
            //     this.addBtn = findDOMNode(component);
            //     /* eslint-enable */
            //   }}
            >
              添加角色
            </Button>
        <Table columns={columns} size="small"></Table>
        </Modal>)
    }
}

export default RoleManage;
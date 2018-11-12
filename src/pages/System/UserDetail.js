import React, { PureComponent, Fragment } from 'react';
import {
    Card,
    Button,
    Dropdown,
    Form,
    Icon,
    Switch,
    Col,
    Row,
    Menu,
    DatePicker,
    Popconfirm,
    Input,
    Select,
    Popover,
    message
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import TableForm from './TableForm';
import styles from './UserDetail.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const fieldLabels = {
    name: '仓库名',
    url: '仓库域名',
    owner: '仓库管理员',
    approver: '审批人',
    dateRange: '生效日期',
    type: '仓库类型',
    name2: '任务名',
    url2: '任务描述',
    owner2: '执行人',
    approver2: '责任人',
    dateRange2: '生效日期',
    type2: '任务类型',
};

@connect(({ user, role, loading }) => ({
    user,
    role,
    roading: loading.effects['role/query'],
    loading: loading.effects['user/fetchUser'],
    submitting: loading.effects['user/edit'],
    removing: loading.effects['user/remove'],
}))
@Form.create()
class UserDetailForm extends PureComponent {
    state = {
        width: '100%',
        roles: [],
    };

    componentDidMount() {
        const {
            dispatch,
            role: { list },
            location: { query },
            user: { detail }
        } = this.props;
        const { roles } = this.state;

        if (!query.id || !(typeof query.id === 'string') || query.id === undefined) {
            router.push('/system/user');
        }

        dispatch({
            type: 'user/fetchUser',
            payload: query,
            callback(res) {
                if (res == null) router.push('/system/user');
            },
        });
        dispatch({
            type: 'role/query',
        });

        if (Array.isArray(detail.roles)) {
            let ur = detail.roles.map(r => r.code);
            list.forEach(r => {
                if (!ur.includes(r.code))
                    roles.push(r);
            });
        }
        
        window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFooterToolbar);
    }

    populateRoles = (roles) => {
        this.setState({
            roles: roles
        });
     
    }
    
    getErrorInfo = () => {
        const {
            form: { getFieldsError },
        } = this.props;
        const errors = getFieldsError();
        const errorCount = Object.keys(errors).filter(key => errors[key]).length;
        if (!errors || errorCount === 0) {
            return null;
        }
        const scrollToField = fieldKey => {
            const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
            if (labelNode) {
                labelNode.scrollIntoView(true);
            }
        };
        const errorList = Object.keys(errors).map(key => {
            if (!errors[key]) {
                return null;
            }
            return (
                <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
                    <Icon type="cross-circle-o" className={styles.errorIcon} />
                    <div className={styles.errorMessage}>{errors[key][0]}</div>
                    <div className={styles.errorField}>{fieldLabels[key]}</div>
                </li>
            );
        });
        return (
            <span className={styles.errorIcon}>
                <Popover
                    title="表单校验信息"
                    content={errorList}
                    overlayClassName={styles.errorPopover}
                    trigger="click"
                    getPopupContainer={trigger => trigger.parentNode}
                >
                    <Icon type="exclamation-circle" />
                </Popover>
                {errorCount}
            </span>
        );
    };

    resizeFooterToolbar = () => {
        requestAnimationFrame(() => {
            const sider = document.querySelectorAll('.ant-layout-sider')[0];
            if (sider) {
                const width = `calc(100% - ${sider.style.width})`;
                const { width: stateWidth } = this.state;
                if (stateWidth !== width) {
                    this.setState({ width });
                }
            }
        });
    };

    validate = () => {
        const {
            form: { validateFieldsAndScroll },
            dispatch,
            user: { detail }
        } = this.props;
        const roles = detail.roles || [];
        validateFieldsAndScroll((error, values) => {
            if (!error) {
                // submit the values
                dispatch({
                    type: 'user/edit',
                    payload: {
                        ...values,
                        roles: roles.map(p => p.code)
                    },
                    callback: res => {
                        if (res.err) message.error(res.code);
                        else
                            message.success(
                                <span>
                                    更新成功，
                  <a onClick={() => { router.push('/system/user'); }} >返回列表</a>
                                </span>, 2);
                    },
                });
            }
        });
    };

    removeUser = () => {
        const {
            dispatch,
            location: { query },
        } = this.props;
        if (!query.id || !(typeof query.id === 'string')) {
            message.error('操作失败，请重新加载页面', 3, () => {
                router.push('/system/user');
            });
        }
        dispatch({
            type: 'user/remove',
            payload: query,
            callback: res => {
                if (!res.err) router.push('/system/user');
                else message.error(res.code);
            },
        });
    };
    roleADD = (code) => {
        const {
            dispatch,
        } = this.props;
        const { roles } = this.state;
        dispatch({
            type: 'user/addRole',
            payload: code
        });
        if (roles.includes(code))
            roles.splice(roles.findIndex(r => r == code), 1);

    }

    roleDel = (code) => {
        const {
            dispatch,
        } = this.props;
        const { roles } = this.state;
        dispatch({
            type: 'user/removeRole',
            payload: code
        })
        if (!roles.includes(code))
            roles.push(code);

            
    }
   

    render() {

        const {
            form: { getFieldDecorator },
            loading,
            submitting,
            removing,
            user: { detail },
            role: { list }
        } = this.props;
        const { width, roles } = this.state;
        const roleMenu = (
            <Menu >
                {roles.map(r => (
                    <Menu.Item key={r.code} onClick={() => this.roleADD(r)}>
                        <a rel="noopener noreferrer" >{r.name}</a>
                    </Menu.Item>
                ))}
            </Menu>
        );
        return (
            <PageHeaderWrapper
                loading={loading}
                title={`编辑用户 "${detail.account}"`}
                content={`备注: ${detail.desc || '无'}`}
                wrapperClassName={styles.advancedForm}
            >
                <Card title="基本信息" className={styles.card} bordered={false} loading={loading}>
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col lg={6} md={12} sm={24}>
                                <Form.Item label="账号">
                                    {getFieldDecorator('account', {
                                        initialValue: detail.account,
                                    })(<b>{detail.account}</b>)}
                                </Form.Item>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                                <Form.Item label="手机号码">
                                    {getFieldDecorator('mobile', {
                                        initialValue: detail.phone,
                                    })(
                                        <Input
                                            type="mobile"
                                            maxLength="15"
                                            style={{ width: '100%' }}
                                            placeholder="请输入手机号码"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                                <Form.Item label="邮箱">
                                    {getFieldDecorator('email', {
                                        initialValue: detail.email,
                                    })(
                                        <Input
                                            type="email"
                                            maxLength="50"
                                            style={{ width: '100%' }}
                                            placeholder="请输入邮箱地址"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col lg={6} md={12} sm={24}>
                                <Form.Item label="名称">
                                    {getFieldDecorator('name', {
                                        initialValue: detail.name,
                                    })(
                                        <Input maxLength="20" style={{ width: '100%' }} placeholder="请输入用户名称" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                                <Form.Item label="真实姓名">
                                    {getFieldDecorator('realName', {
                                        initialValue: detail.realName,
                                    })(
                                        <Input maxLength="50" style={{ width: '100%' }} placeholder="请输入真实姓名" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                                <Form.Item label="生日">
                                    {getFieldDecorator('birthday', {
                                        initialValue: detail.birthday ? moment(detail.birthday) : null,
                                    })(<DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col lg={6} md={12} sm={24}>
                                <Form.Item label="性别">
                                    {getFieldDecorator('gender', {
                                        initialValue: detail.sex,
                                    })(
                                        <Select placeholder="请选择性别">
                                            <Option value={0}>男</Option>
                                            <Option value={1}>女</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                                <Form.Item label="座机号">
                                    {getFieldDecorator('telephone', {
                                        initialValue: detail.telephone
                                    })(
                                        <Input maxLength="50" style={{ width: '100%' }} placeholder="请输入座机号" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="账号安全" className={styles.card} bordered={false} loading={loading}>
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col lg={12} md={24} sm={24}>
                                <Form.Item label="允许登录时间范围">
                                    {getFieldDecorator('allow', {
                                        initialValue: [
                                            detail.allowStartTime? moment(detail.allowStartTime) : null,
                                            detail.allowEndTime? moment(detail.allowEndTime) : null,
                                        ],
                                    })(<RangePicker style={{ width: '100%' }} />)}
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={24} sm={24}>
                                <Form.Item label="账号锁定时间范围">
                                    {getFieldDecorator('lock', {
                                        initialValue: [
                                            detail.lockStartTime ? moment(detail.lockStartTime) : null,
                                            detail.lockEndTime ? moment(detail.lockEndTime) : null,
                                        ],
                                    })(<RangePicker style={{ width: '100%' }} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col lg={12} md={24} sm={24}>
                                <Form.Item label="安全问题">
                                    {getFieldDecorator('question', {
                                        initialValue: detail.question,
                                    })(<Input placeholder="请输入安全问题" />)}
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={24} sm={24}>
                                <Form.Item label="安全问题答案">
                                    {getFieldDecorator('answer', {
                                        initialValue: detail.answer,
                                    })(<Input placeholder="请输入安全问题答案" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col lg={24} md={24} sm={24}>
                                <Form.Item label="是否启用">
                                    {getFieldDecorator('enabled', {
                                        valuePropName: 'checked',
                                        initialValue: Boolean(detail.active),
                                    })(
                                        <Switch
                                            checkedChildren={<Icon type="check" />}
                                            unCheckedChildren={<Icon type="close" />}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="角色分配" className={styles.card} bordered={false} loading={loading} >
                    {/* <Card title="角色分配" extra={<a onClick={this.showRoleModel}>管理角色</a>} className={styles.card} bordered={false} loading={loading} > */}
                    {detail.roles ? detail.roles.map(r => (
                        <Card.Grid key={r.code} style={{ width: '25%', textAlign: 'center' }}>
                            {r.name}
                            <Icon type="close-circle" theme="filled" style={{ cursor: 'pointer', color: '#f5222d', marginLeft: '6px' }}  onClick={() => this.roleDel(r)}/></Card.Grid>
                    )) : ''}
                    {roles && roles.length > 0 ? (<Dropdown overlay={roleMenu} trigger={['click']} placement="topLeft">
                        <Card.Grid style={{ width: '25%', textAlign: 'center' }}>
                            <Fragment >
                                <Icon type={'plus'} theme="outlined" style={{ fontSize: '20px' }} />
                            </Fragment>
                        </Card.Grid>
                    </Dropdown>) : ''}

                </Card>
                <FooterToolbar style={{ width }}>
                    {this.getErrorInfo()}
                    <Popconfirm
                        title="确定要删除这个用户吗？"
                        onConfirm={this.removeUser}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="danger" loading={removing}>
                            删除账号
                        </Button>
                    </Popconfirm>
                    {/* <button onClick={()=>this.handleClick()}>ok</button> */}
                    <Button type="primary" onClick={this.validate} loading={submitting}>
                        提交
                    </Button>
                </FooterToolbar>
            </PageHeaderWrapper>
        );
    }
}

export default UserDetailForm;

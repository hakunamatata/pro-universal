import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Input, Icon, Tag, Button, Divider, Form, Row, Col, Select, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import FooterToolbar from '@/components/FooterToolbar'
import moment from 'moment'
import styles from './DetailCms.less';

const { Option } = Select
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 6 }} />
    {text}
  </span>
)

@Form.create()
@connect(({ profile, loading, cms }) => ({
  profile,
  cms,
  loading: loading.effects['profile/fetchBasic'],
}))
class DetailCms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true
    }

  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cms/categoryList',
    });

  }

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'cms/addContent',
          payload: {
            ...values,
          },
          callback:res=>{
            if(res.err==null){
                message.success(
                  <span>
                    发表成功，
                    <a onClick={()=>{this.props.history.push('/cms/search')}}>返回列表</a>
                  </span>
                ,3);
            }else{
              message.error(res.code);
            }
          }
        });
      }
    });
  };

  renderContent() {
    console.log('props', this.props);
    const Content = (
      <div>
        <IconText type={'eye'} text={200} />
        <IconText type={'clock-circle'} text={2000} />
        <IconText type={'user'} text={'张贺'} />
        <a onClick={() => this.setState({ expand: false })}><Icon type='edit' />编辑</a>
        <div style={{ marginTop: 8 }}>
          <Tag>武大经典</Tag>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper title='标题' content={Content}>
        <Card bordered={false}>
          <div style={{ fontFamily: '宋体', fontSize: 16 }}>
            金沙乡4座民房被淹，2座民房地基被浸泡，村民综合服务中心（党员活动室）院坝进水，1处农家乐被淹没，1处零售店商铺被淹，52座牧场临时住房被淹。乡政府机关、金沙小学、金沙卫生院院坝和房屋内积水约40公分
            。伍仲村吊桥、八吉村至西藏江达县跨江大桥、通往乡政府水泥桥被淹没。G215线岗白路金沙至河坡段约3.5公里被淹没。
            </div>
          <div style={{ fontFamily: '宋体', fontSize: 16 }}>
            而朝鲜《劳动新闻》12日就此发表评论认为，重启韩美陆战队演习违反了朝韩今年9月19日签署的停止“所有敌对行动”的协议。评论称，韩朝要延续半岛局势走向对话与和平之路的氛围，不应采取刺激对方的军事行为，要以理性态度处理问题，努力缓解紧张局势。
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }

  renderInput() {
    const {
      form: { getFieldDecorator },
      cms: { catelist }
    } = this.props
    const Content = (
      <Form>
        <Row gutter={8}>
          <Col sm={24} md={8}>
            <Form.Item>
              {getFieldDecorator('title')(
                <Input placeholder='请输入标题' />
              )
              }
            </Form.Item>
          </Col>
          <Col sm={8} md={8}>
            <Form.Item>
              {getFieldDecorator('author')(
                <Input placeholder='请输入作者' />
              )
              }
            </Form.Item>
          </Col>
          <Col sm={8} md={8}>
            <Form.Item>
              {getFieldDecorator('categroyid')(
                <Select placeholder='选择文章类别'>
                  {catelist.map(r => (
                    <Option key={r.id}>{r.name}</Option>
                  ))
                  }
                </Select>
              )
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
    return (
      <PageHeaderWrapper content={Content}>
        <Card bordered={false}>
          <Form>
            <Form.Item>
              {getFieldDecorator('abs')
                (<Input.TextArea placeholder='请输入摘要内容' autosize />)
              }
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('content')(
                <Input.TextArea placeholder='请输入正文内容' style={{ height: 500 }} />
              )
              }
            </Form.Item>
          </Form>
        </Card>
        <FooterToolbar>
          <Button type='primary' onClick={this.validate}>提交</Button>
          <Button type='danger'>删除</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    )
  }

  renderForm() {
    const { expand } = this.state
    return expand ? this.renderContent() : this.renderInput()
  }

  render() {
    return (
      <div>{this.renderForm()}</div>
    )
  }
}

export default DetailCms;

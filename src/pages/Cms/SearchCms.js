import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, List, Tag, Icon, Row, Col, Button, Input, Modal, message } from 'antd';
import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ArticleListContent from '@/components/ArticleListContent';
import Link from 'umi/link'
import styles from './SearchCms.less';

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;
const CreateCategory = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      visible={modalVisible}
      title='创建栏目'
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item label='栏目名称' labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('categoryName', {
          rules: [{
            required: true,
            message: '请输入栏目名称'
          }]
        })(
          <Input placeholder='请输入栏目名称' />
        )
        }
      </Form.Item>
      <Form.Item label='父层栏目' labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('parentid')(
          <Input placeholder="请输入父层栏目" />
        )
        }
      </Form.Item>

    </Modal>
  )
})


@connect(({ loading, cms }) => ({
  loading: loading.models.cms,
  cms
}))


@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  },
}
)
class SearchCms extends Component {
  state = {
    modalVisible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cms/contlist',
      payload: {
        count: 5,
      },
    });

    dispatch({
      type: 'cms/cateList',
    });
  }

  setOwner = () => {
    const { form } = this.props;
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  publishArticle = () => {
    this.props.history.push('/cms/search/detail');
  }


  handleAdd = fields => {
    const {
      dispatch
    } = this.props;
    dispatch({
      type: 'cms/addCategory',
      payload: {
        category: fields.categoryName,
        parent: fields.parentid
      },
      callback: res => {
        if (res.err == null) {
          message.success('添加成功');
          this.handleModalVisible();
          this.props.history.push('/cms/search');
        } else message.error(error(res.code));

      }
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    })
  }


  render() {
    console.log('a', this.props);
    const {
      form,
      cms: { catelist },
      cms: { contentList },
      loading,
    } = this.props;
    const { getFieldDecorator } = form;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const owners = [
      {
        id: 'wzj',
        name: '我自己',
      },
      {
        id: 'wjh',
        name: '吴家豪',
      },
      {
        id: 'zxx',
        name: '周星星',
      },
      {
        id: 'zly',
        name: '赵丽颖',
      },
      {
        id: 'ym',
        name: '姚明',
      },
    ];

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );


    const loadMore =
      contentList.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
                '加载更多'
              )}
          </Button>
        </div>
      ) : null;

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ width: 522 }}
        />
      </div>
    );

    return (
      <PageHeaderWrapper title="文章搜索"
        content={mainSearch}>
        <Fragment>
          <Card bordered={false}>
            <Form layout="inline">
              <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
                <FormItem>
                  {getFieldDecorator('category')(
                    <TagSelect expandable>
                      {catelist.map(r => (
                        <TagSelect.Option value={r.id}>{r.name}</TagSelect.Option>
                      ))
                      }
                    </TagSelect>
                  )}
                </FormItem>

              </StandardFormRow>
              <StandardFormRow title="发布人" grid>
                <Row>
                  <Col lg={16} md={24} sm={24} xs={24}>
                    <FormItem>
                      {getFieldDecorator('owner', {
                        initialValue: ['wjh', 'zxx'],
                      })(
                        <Select
                          mode="multiple"
                          style={{ maxWidth: 286, width: '100%' }}
                          placeholder="选择 owner"
                        >
                          {owners.map(owner => (
                            <Option key={owner.id} value={owner.id}>
                              {owner.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                      <a className={styles.selfTrigger} onClick={this.setOwner}>
                        只看自己的
                    </a>
                    </FormItem>
                  </Col>
                </Row>
              </StandardFormRow>
              <Button type='primary' style={{ marginRight: 8 }} onClick={this.publishArticle}>文章发布</Button>
              <Button type='primary' onClick={() => this.handleModalVisible(true)}>栏目创建</Button>
            </Form>
          </Card>
          <Card
            style={{ marginTop: 24 }}
            bordered={false}
            bodyStyle={{ padding: '8px 32px 32px 32px' }}
          >
            <List
              size="large"
              loading={contentList.length === 0 ? loading : false}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMore}
              dataSource={contentList}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <IconText type="eye" text={item.viewsCount} />,
                  ]}
                  extra={<div className={styles.listItemExtra} />}
                >
                  <List.Item.Meta
                    title={
                      <a className={styles.listItemMetaTitle} href={`/cms/search/detail`}>
                        {item.title}
                      </a>
                    }
                    description={
                      <span>
                        <Tag>{item.category.name}</Tag>
                      </span>
                    }
                  />
                  <ArticleListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
          <CreateCategory {...parentMethods} modalVisible={modalVisible} />
        </Fragment>

      </PageHeaderWrapper>
    );
  }
}

export default SearchCms;

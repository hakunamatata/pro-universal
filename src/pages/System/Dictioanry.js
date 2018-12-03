import React, { PureComponent } from 'react';
import { Button, Card, Modal, Table, TextArea, Input, InputNumber, Popconfirm, Form } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableFormRow = Form.create()(({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
));
const ModalCreateForm = Form.create()(props => {
  const { modalVisible, form, addHandle, closeHandle, confirmLoading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      addHandle(fieldsValue);
    });
  };
  return (
    <Modal
      title="添加目录"
      onCancel={closeHandle}
      onOk={okHandle}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      visible={modalVisible}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="目录编号">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入至少四个字符的编号！', min: 4 }],
        })(<Input placeholder="请输入目录编号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="目录名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入目录编号！' }],
        })(<Input placeholder="请输入目录名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desciption')(<Input.TextArea rows={3} />)}
      </FormItem>
    </Modal>
  );
});
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...rest } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...rest}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: ['code', 'name'].includes(dataIndex),
                        message: `请输入 ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                rest.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
@connect(({ base, loading }) => ({
  base,
  loading: loading.models.base,
}))
@Form.create()
class SystemDictionary extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    editingKey: '',
    subCategoryId: '',
    modalVisible: false,
    modalConfirmLoading: false,
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
      editable: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 150,
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: '操作',
      width: 160,
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a onClick={() => this.saveCategory(record.id, form)} style={{ margin: 8 }}>
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <a
                  onClick={() => {
                    this.cancel(record.id);
                  }}
                >
                  取消
                </a>
              </span>
            ) : (
              <span>
                <a onClick={() => this.addSubCategory(record.id)} style={{ marginRight: '12px' }}>
                  子目录
                </a>
                <a onClick={() => this.edit(record.id)} style={{ marginRight: '12px' }}>
                  编辑
                </a>
                <Popconfirm
                  title="确定要删除这条目录吗？"
                  onConfirm={() => {
                    this.removeCategory(record);
                  }}
                >
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/fetch',
    });
  }

  isEditing = record => {
    return record.id === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  modalShow = () => {
    this.setState({ modalVisible: true });
  };
  modalHide = () => {
    this.setState({ modalVisible: false });
    this.setState({ modalConfirmLoading: false });
  };

  addCategory = fields => {
    const { dispatch } = this.props;
    this.setState({ modalConfirmLoading: true });
    dispatch({
      type: 'base/add',
      payload: {
        parentId: this.state.subCategoryId,
        ...fields,
      },
      callback: () => {
        this.modalHide();
        dispatch({
          type: 'base/fetch',
        });
      },
    });
  };
  addSubCategory(key) {
    this.setState({ subCategoryId: key, modalVisible: true });
  }

  removeCategory(record) {
    const { dispatch } = this.props;
    if (record.children == null || record.children.length == 0)
      dispatch({
        type: 'base/remove',
        payload: {
          id: record.id,
        },
        callback: () => {
          dispatch({
            type: 'base/fetch',
          });
        },
      });
    else
      Modal.warning({
        title: '无法执行删除操作',
        content: '目录下包含子目录, 请先将子目录删除掉, 在执行删除操作',
        onOk() {},
      });
  }

  saveCategory = (id, form) => {
    const { dispatch } = this.props;
    const { validateFields } = form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'base/save',
        payload: {
          id: id,
          ...fieldsValue,
        },
        callback: () => {
          this.cancel();
          dispatch({
            type: 'base/fetch',
          });
        },
      });
    });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const {
      base: { dictionary },
      loading,
    } = this.props;
    const columns = this.columns.map(col => {
      if (!col.editable) return col;

      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    let dataSource = (dictionary || {}).children;
    return (
      <PageHeaderWrapper title="系统字典">
        <Card bordered={false}>
          <Button type="dashed" block style={{ marginBottom: '6px' }} onClick={this.modalShow}>
            添加字典目录
          </Button>
          <Table
            components={components}
            size="small"
            rowKey="id"
            bordered
            loading={loading}
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            rowClassName="editable-row"
          />
        </Card>
        <ModalCreateForm
          modalVisible={this.state.modalVisible}
          confirmLoading={this.state.modalConfirmLoading}
          addHandle={this.addCategory}
          closeHandle={this.modalHide}
        />
      </PageHeaderWrapper>
    );
  }
}

export default SystemDictionary;

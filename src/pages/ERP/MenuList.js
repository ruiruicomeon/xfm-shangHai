import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import { Row, Col, Card, Form, Input, Modal, TreeSelect, Icon, Button, Divider, Radio ,Popconfirm} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import styles from './MenuList.less';

import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { TextArea } = Input;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let values = {};
      if (isNotBlank(modalRecord) && isNotBlank(modalRecord.id)) {
        if (modalRecord.parentId) {
          values = { ...fieldsValue, id: modalRecord.id, parent: modalRecord.parentId };
        } else {
          values = { ...fieldsValue, id: modalRecord.id };
        }
      } else if (modalRecord.parentId) {
        values = { ...fieldsValue, parent: modalRecord.parentId };
      } else {
        values = { ...fieldsValue, parent: 0 };
      }
      handleAdd(values);
    });
  };

  return (
    <Modal
      title={
        modalRecord != null &&
          modalRecord !== 'undefined' &&
          modalRecord.id != null &&
          modalRecord.id !== 'undefined'
          ? '修改菜单'
          : '新建菜单'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
        {form.getFieldDecorator('name', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限标识">
        {form.getFieldDecorator('permission', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.permission)
              ? modalRecord.permission
              : '',
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单排序">
        {form.getFieldDecorator('sort', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.sort)
              ? modalRecord.sort
              : '',
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否可见">
        {form.getFieldDecorator('isShow', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.isShow) ? modalRecord.isShow : '',
        })(
          <Radio.Group>
            <Radio value="1">显示</Radio>
            <Radio value="0">隐藏</Radio>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否处理">
        {form.getFieldDecorator('href', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.href) ? modalRecord.href : '0',
        })(
          <Radio.Group>
            <Radio value="0">不处理</Radio>
            <Radio value="1">处理</Radio>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="target">
        {form.getFieldDecorator('target', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.target) ? modalRecord.target : '',
        })(<Input />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remarks', {
          initialValue: '',
        })(<TextArea rows={3}  />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ sysoffice, loading, sysdept, sysrole }) => ({
  sysoffice,
  ...sysdept,
  formData: sysrole.formData.role,
  menuList: { list: sysrole.formData.menuList },
  loading: loading.models.sysoffice,
}))
@Form.create()
class MenuList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    modalVisible: false,
    formValues: {},
    modalRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysdept/query_dept',
    });

    dispatch({
      type: 'sysrole/form_data',
    });
  }

  componentWillMount(){
    const {dispatch} = this.props
    dispatch({
      type:'sysdept/clear'
    })
    dispatch({
      type:'sysrole/clear'
    })
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sysrole/form_data',
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    dispatch({
      type: 'sysrole/form_data',
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = record => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'sysrole/del_menu',
      payload: {
        id: record.id,
      },
      callback: () => {
        dispatch({
          type: 'sysrole/form_data',
        });
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/add_menu',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'sysrole/form_data',
        });
        this.setState({
          modalVisible: false,
        });
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysrole/form_data',
      });
    });
  };

  handleModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)) {
      this.setState({
        modalRecord: record,
        modalVisible: true,
      });
    }
  };

  lowerModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)) {
      this.setState({
        modalRecord: { parentId: record.id, area: record.area },
        modalVisible: true,
      });
    }
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { areaList, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="归属区域">
              {getFieldDecorator('area')(
                <TreeSelect
                  style={{ width: '100%' }}
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={areaList.list}
                  treeNodeFilterProp="label"
                  
                  treeDefaultExpandAll
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="部门负责人">
              {getFieldDecorator('master')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="部门电话">
              {getFieldDecorator('phone')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { loading, menuList } = this.props;
    const { selectedRows, modalVisible, modalRecord } = this.state;

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: 250,
      render: (text, record) =>{ 
        return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='menu').length>0
        && JSON.parse(getStorage('menulist')).filter(item=>item.target=='menu')[0].children.filter(item=>item.name=='修改')
        .length>0?
      <a onClick={() => this.handleModalChange(record)}>{text}</a>
          :<span>{text}</span>
      },
      },
      {
        title: '菜单排序',
        dataIndex: 'sort',
        width: 100,
      },
      {
        title: '可见',
        dataIndex: 'isShow',
        width: 100,
        render: text => {
          if (isNotBlank(text)) {
            if (text === 0 || text === '0') {
              return <span>隐藏</span>;
            }
            if (text === 1 || text === '1') {
              return <span>显示</span>;
            }
          }
          return '';
        },
      },
      {
        title: '是否处理',
        dataIndex: 'href',
        width: 100,
        render: text => {
          if (isNotBlank(text)) {
            if (text === 0 || text === '0') {
              return <span>不处理</span>;
            }
            if (text === 1 || text === '1') {
              return <span>处理</span>;
            }
          }
          return '';
        },
      },
      {
        title: '权限标识',
        dataIndex: 'permission',
        width: 100,
      },
      {
        title: 'target',
        dataIndex: 'target',
        width: 100,
      },
      {
        title: '操作',
        width: 200,
        render: record => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='menu').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='menu')[0].children.filter(item=>item.name=='修改')
          .length>0?
          <Fragment>
            <a onClick={() => this.handleModalChange(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否确认删除本行?" onConfirm={() => this.removeClick(record)}>
              <a>删除</a>
            </Popconfirm>
            
            <Divider type="vertical" />
            <a onClick={() => this.lowerModalChange(record)}>添加下级菜单</a>
          </Fragment>
          :''
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalRecord,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            
            <div className={styles.tableListOperator} style={{'position':'relative'}}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'menu').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'menu')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
              </Button>
              }
              {selectedRows.length > 0 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'menu').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'menu')[0].children.filter(item => item.name == '修改')
                  .length > 0 && (
                  <span>
                    <Button onClick={() => this.removeClick()}>删除</Button>
                    
                  </span>
                )}
                <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
              </Button>
<span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
权限管理</span>

            </div>
            <StandardTable
              bordered
              scroll={{ x: 1050 }}
              selectedRows={selectedRows}
              loading={loading}
              defaultExpandAllRows
              data={menuList}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default MenuList;

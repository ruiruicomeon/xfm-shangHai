import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, TreeSelect, Button,Popconfirm} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SysRoleList.less';
import { isNotBlank } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ sysrole, loading
  
}) => ({
  ...sysrole,
  dicts: sysrole.dicts,
  
  loading: loading.models.sysrole,
}))
@Form.create()
class SysRoleList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/fetch',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
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
      type: 'sysrole/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysrole/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    let ids = '';
    
    if (isNotBlank(id)) {
      ids = id;
    } 
    if (isNotBlank(ids)) {
      dispatch({
        type: 'sysrole/delete_sysRole',
        payload: {
          id: ids
        },
        callback: () => {
          dispatch({
                    type: 'sysrole/fetch',
                  });
          }
      });
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
        type: 'sysrole/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { officeList,form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="归属部门">
              {getFieldDecorator('office')(
                <TreeSelect
                  style={{ width: '100%' }}
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={officeList.list}
                  treeNodeFilterProp="label"
                  
                  treeDefaultExpandAll
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="英文名称">
              {getFieldDecorator('enname')(<Input  />)}
            </FormItem>
          </Col>
          <div>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </div>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { rolelist, loading, dispatch } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '操作',
        width: 100,
        align:'center',
        render: record => {
          return  <Fragment>
            <Link
              to={`/system/sys-role/form?id=${record.id}`}
            >
              修改
            </Link>
            
          </Fragment>
        },
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        width: 150,
        align:'center',
        render: (text, record) => (
          <Link
            to={`/system/sys-role/form?id=${record.id}`}
          >
            {text}
          </Link>
        ),
      },
      {
        title: '英文名称',
        dataIndex: 'enname',
        width: 150,
        align:'center',
        render: (text, record) => (
          <Link
            to={`/system/sys-role/form?id=${record.id}`}
          >
            {text}
          </Link>
        ),
      },
      {
        title: '基础操作',
        width: 100,
        align:'center',
        render: (text, record) => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='role').length>0
              && JSON.parse(getStorage('menulist')).filter(item=>item.target=='role')[0].children.filter(item=>item.name=='修改')
              .length>0?
                <Fragment>
                  <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                    <a>删除</a>
                  </Popconfirm>
                </Fragment>
          :''
        },
      },
    ];

    const onValidateForm = () => {
      dispatch(routerRedux.push('/system/sys-role/form'));
    };
    
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator} style={{'position':'relative'}}>
              {
                isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='role').length>0
                && JSON.parse(getStorage('menulist')).filter(item=>item.target=='role')[0].children.filter(item=>item.name=='修改')
                .length>0?
                  <Button icon="plus" type="primary" onClick={onValidateForm}>
                新建
                  </Button>
              :
                  <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
                  </Button>
          }
              <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
角色管理
              </span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 750 }}
              
              loading={loading}
              defaultExpandAllRows
              data={rolelist}
              columns={columns}
              
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default SysRoleList;

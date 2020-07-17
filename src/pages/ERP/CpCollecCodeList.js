import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Row, Col, Select, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl ,getPrice } from '@/utils/utils';
import moment from 'moment';
import styles from './CpCollecCodeList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({ cpCollecCode, loading }) => ({
  ...cpCollecCode,
  loading: loading.models.cpCollecCode,
}))
@Form.create()
class CpCollecCodeList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
      }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'del_flag',
		  },
		  callback: data => {
			this.setState({
			  del_flag : data
          })
        }
    });
  }

  gotoForm = () => {
    router.push(`/basicManagement/basis/cp_collec_Code_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/basicManagement/basis/cp_collec_Code_form?id=${id}`);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    let sort = {};
    if(isNotBlank(sorter) && isNotBlank(sorter.field)){
      if(sorter.order === 'ascend'){
        sort = {
          'page.orderBy':`${sorter.field} asc`
        }
      }else if(sorter.order === 'descend'){
        sort = {
          'page.orderBy':`${sorter.field} desc`
        }
      }
    }
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
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
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
        current: 1,
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  editAndDelete = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title: '删除数据',
      content: '确定删除已选择的数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.handleDeleteClick(),
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    let ids = '';
    if (isNotBlank(id)) {
      ids = id;
    } else {
      if (selectedRows.length === 0) {
        message.error('未选择需要删除的数据');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    if (isNotBlank(ids)) {
      dispatch({
        type: 'cpCollecCode/cpCollecCode_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpCollecCode/cpCollecCode_List',
            payload: {
             pageSize: 10,
              ...formValues,
            }
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
      };
      Object.keys(values).map((item) => {
        if( values[item] instanceof moment){
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpCollecCode/cpCollecCode_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    if (isNotBlank(value)) {
      Object.keys(value).map((item) => {
        if( value[item] instanceof moment){
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpCollecCode/cpCollecCode_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpCollecCode/cpCollecCode_List',
            payload: {
             pageSize: 10,
              ...formValues,
            }
          });
        }
      });
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="集采客户">
              {getFieldDecorator('collecClient.name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
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
      const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="集采客户">
              {getFieldDecorator('collecClient.name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('code', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('code', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { selectedRows } = this.state;
    const { loading, cpCollecCodeList } = this.props;
    const columns = [
     {
        title: '详情',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
          </Fragment>
        ),
      },
      {
        title: '集采客户',        
        dataIndex: 'collecClient.name',   
        inputType: 'text',   
        width: 100,          
        editable:  true  ,      
       },
 		{
			title: '名称',        
			dataIndex: 'name',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '编码',        
			dataIndex: 'code',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '金额',        
			dataIndex: 'money',   
			inputType: 'text',   
			width: 100,          
      editable:  true  ,      
      render:text=>(getPrice(text))
 		},
 		{
			title: '备注信息',        
			dataIndex: 'remarks',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
     },
     {
      title: '基础操作',
      width: 100,
      render: (text, record) => {
        return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient').length>0
        && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient')[0].children.filter(item=>item.name=='删除')
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
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{'position':'relative'}}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient')[0].children.filter(item=>item.name=='修改')
.length>0?
  <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
  </Button>
                :
  <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                                新建
  </Button>
  }
                <span style={{fontWeight:550,fontSize:22,position:'absolute',left:'50%', transform:'translateX(-50%)'}}>
            集采编码
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: 700 }}
                selectedRows={selectedRows}
                loading={loading}
                data={cpCollecCodeList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default CpCollecCodeList;
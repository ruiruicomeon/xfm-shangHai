import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input,  Form, Card, Popconfirm, Icon, Row, Col, Select,  message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import moment from 'moment';
import styles from './CpEntrepotList.less';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ cpEntrepot, loading }) => ({
  ...cpEntrepot,
  loading: loading.models.cpEntrepot,
}))
@Form.create()
class CpEntrepotList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  
    ponentDidMount() {
    const { dispatch } = this.props;
    dispatch({
    type: 'cpEntrepot/cpEntrepot_List',
      payload: {
        pageSize: 10,
        type:2
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
    router.push(`/basicManagement/warehouse/pj_warehouse/cp_pj_entrepot_form`);
  }
  gotoUpdateForm = (id) => {
    router.push(`/basicManagement/warehouse/pj_warehouse/cp_pj_entrepot_form?id=${id}`);
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
      type:2
    };
    dispatch({
      type: 'cpEntrepot/cpEntrepot_List',
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
      type: 'cpEntrepot/cpEntrepot_List',
      payload: {
        pageSize: 10,
        current: 1,
        type:2
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
    andleDeleteClick = (id) => {
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
        type: 'cpEntrepot/cpEntrepot_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpEntrepot/cpEntrepot_List',
            payload: {
             pageSize: 10,
              ...formValues,
              type:2
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
        type: 'cpEntrepot/cpEntrepot_List',
        payload: {
   
       ...values,
          pageSize: 10,
          current: 1,
          type:2
        },
      });
    });
  }
;
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
        type: 'cpEntrepot/cpEntrepot_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpEntrepot/cpEntrepot_List',
            payload: {
             pageSize: 10,
              ...formValues,
              type:2
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
					<FormItem label="仓库名">
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
              <Button style={{ marginLeft: 8 }} onClick={this.ha
ndleFormReset}>
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
enderAdvancedForm() {
      const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
					<FormItem label="仓库名">
					  {getFieldDecorator('name', {
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
    const { loading, cpEntrepotList } = this.props;
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
			title: '仓库名',        
			dataIndex: 'name',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
     {
			title: '所属公司',        
			dataIndex: 'office.name',   
			
inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
	  {
        title: '更新时间',
   
     dataIndex: 'finishDate',
        editable:   true  ,
        inputType: 'dateTime',
        width: 100,
        sorter: true,
    
    render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
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
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Button icon="delete" onClick={(e) => this.editAndDelete(e)}> 批量删除</Button>
                  </span>
                )}
              </div>
              <StandardEditTable
                scroll={{ x: 700 }}
                      selectedRows={selectedRows}
                        loading={loading}
                data={cpEntrepotList}
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
            rt default CpEntrepotList;                                                                                                                      
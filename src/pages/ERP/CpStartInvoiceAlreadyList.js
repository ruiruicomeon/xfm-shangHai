import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl ,getPrice} from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import { parse, stringify } from 'qs';
import styles from './CpStartInvoiceList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

    @Form.create()
class SearchForm extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
    if (err) return;
    handleSearchAdd(fieldsValue);
    });
  };

  handleSearchVisiblein = () => {
    const { form, handleSearchVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisible(fieldsValue);
    });
  };

  render() {
    const {
    searchVisible,
    form: { getFieldDecorator },
    handleSearchVisible,
    getCpStartInvoiceLine,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisible}
        onCancel={() => this.handleSearchVisiblein()}
        afterClose={() => this.handleSearchVisiblein()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
        initialValue: [],
      })(<SearchTableList searchList={getCpStartInvoiceLine} />)}
        </div>
      </Modal>
    );
  }
  }


@connect(({ cpStartInvoice, loading }) => ({
  ...cpStartInvoice,
  loading: loading.models.cpStartInvoice,
}))
@Form.create()
class getalreadyCpStartInvoiceList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
      payload: {
        pageSize: 10,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
        formType:2
      }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'Invoice_type',
		  },
		  callback: data => {
			this.setState({
			  Invoice_type : data
          })
        }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'make_need',
		  },
		  callback: data => {
			this.setState({
			  make_need : data
          })
        }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'business_project',
		  },
		  callback: data => {
			this.setState({
			  business_project : data
          })
        }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'make_need',
		  },
		  callback: data => {
			this.setState({
			  make_need : data
          })
        }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'invoiceStatus',
		  },
		  callback: data => {
			this.setState({
			  invoiceStatus : data
          })
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
    router.push(`/business/process/cp_start_invoice_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/business/process/cp_start_invoice_form?id=${id}`);
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
      formType:2,
      genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
    };
    dispatch({
      type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
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
      type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
      payload: {
        pageSize: 10,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
        current: 1,
        formType:2
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
        type: 'cpStartInvoice/cpStartInvoice_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
            payload: {
             pageSize: 10,
              ...formValues,
              genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
              formType:2
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
        type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
          formType:2
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
        type: 'cpStartInvoice/cpStartInvoice_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
            payload: {
             pageSize: 10,
              ...formValues,
              genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
              formType:2
            }
          });
        }
      });
    }
  }


  handleSearchVisible = (fieldsValue) => {
    this.setState({
      searchVisible: false,
      historyfilter:JSON.stringify(fieldsValue.genTableColumn)
    });
    };

    handleSearchChange = () => {
    this.setState({
      searchVisible: true,
    });
    };

    handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
    type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
      payload: {
        ...this.state.formValues,
      genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
      pageSize: 10,
      current: 1,
      formType:2
      },
    });
    this.setState({
      searchVisible: false,
      historyfilter:JSON.stringify(fieldsValue.genTableColumn)
    });
    }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('id', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
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
              <a style={{ marginLeft: 8 }} onClick={this.handleSearchChange}>
                过滤其他 <Icon type="down" />
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
            <FormItem label="单号">
              {getFieldDecorator('id', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户">
              {getFieldDecorator('client.clientCpmpany', {
						initialValue: ''
					  })(
               <Input  />
					  )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="邮编">
              {getFieldDecorator('postcode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="快递公司">
              {getFieldDecorator('company', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开票状态">
              {getFieldDecorator('invoiceStatus', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="寄出日期">
              {getFieldDecorator('sendDate', {
						initialValue: ''
					  })(
  <DatePicker style={{ width: '100%' }}  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createDate', {
						initialValue: ''
					  })(
  <DatePicker style={{ width: '100%' }}  />
					  )}
            </FormItem>
          </Col> */}
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

  handleCompletionClick = (id) => {
		const { dispatch } = this.props;
		const { formValues } = this.state;
		if (isNotBlank(id)) {
			dispatch({
				type: 'cpStartInvoice/cpStartInvoice_ticket',
				payload: {
					id
				},
				callback: () => {
					dispatch({
            type: 'cpStartInvoice/get_alreadyCpStartInvoice_List',
						payload: {
              pageSize: 10,
              genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
              formType:2,
						}
					});
				}
			});
		}
  };
  
  handleFieldChange = (value) => {
    this.setState({
      array: value || []
    })
    }


    gotoUpdateForm=(id,newid,remarks)=>{
      router.push(`/business/process/cp_startInvoice_already_form?id=${id}&newid=${newid}&remarks=${isNotBlank(remarks)?remarks:''}`)
    }


    handleUpldExportClick = type => {
      const {  formValues } = this.state;
      const params = { 
        ...formValues,
        formType:2,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
        'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):''
      }
      window.open(`/api/Beauty/beauty/cpStartInvoice/export1?${stringify(params)}`);
      };

  render() {
    const { selectedRows ,array ,searchVisible} = this.state;
    const { loading, getalreadyCpStartInvoiceList ,getCpStartInvoiceLine} = this.props;


    const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			getCpStartInvoiceLine,
		  }

    const field = [
          {
            title: '是否已退票',        
            dataIndex: 'ticket',   
            inputType: 'text',   
            width: 100,  
            align: 'center' ,        
            editable:  false ,      
            render:(text)=>{
                 if(text==0){
                   return '否'
                 }
                 return '是'
            }
           },
 		{
			title: '单号',        
			dataIndex: 'id',   
			inputType: 'text',   
      width: 150,  
      align: 'center' ,        
      editable:  false ,     
 		},
     {
			title: '订单编号',        
			dataIndex: 'orderCode',   
			inputType: 'text',   
      width: 200,  
      align: 'center' ,        
			editable:  false ,      
 		},
 		{
			title: '单据状态',        
			dataIndex: 'orderStatus',   
			inputType: 'text',   
      width: 100,  
      align: 'center' ,        
			editable:  true  ,      
 		},
 		{
			title: '类型',        
			dataIndex: 'type',   
			inputType: 'text',   
      width: 100,   
      align: 'center' ,       
      editable:  true  ,      
 		},
 		{
			title: '开票方',        
			dataIndex: 'drawer',   
			inputType: 'text',   
      width: 100,  
      align: 'center' ,        
			editable:  true  ,      
 		},
 		{
			title: '业务项目',        
			dataIndex: 'project',   
			inputType: 'text',   
      width: 100,    
      align: 'center' ,      
			editable:  true  ,      
 		},
 		{
			title: '客户',        
			dataIndex: 'client.clientCpmpany',   
      inputType: 'text', 
      align: 'center' ,  
			width: 240,          
      editable:  true  ,      
      render:(text,res)=>{
        if(isNotBlank(text)){
          return text
        }
        return isNotBlank(res.collectClientId)&&isNotBlank(res.collectClientId.name)?res.collectClientId.name:''
      }
 		},
	  {
        title: '业务发生日期',
        dataIndex: 'startDate',
        editable:   true  ,
        align: 'center' ,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
        render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
      },
	  {
        title: '拟定回款日期',
        dataIndex: 'endDate',
        editable:   true  ,
        align: 'center' ,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
        render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
      },
 		{
			title: '应收金额',        
			dataIndex: 'receivableMoney',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
      editable:  true  ,      
      render:text=>(getPrice(text))
 		},
 		{
			title: '开票金额',        
			dataIndex: 'invoiceMoney',   
      inputType: 'text',
      align: 'center' , 
      align: 'center' ,  
			width: 100,          
      editable:  true  ,      
      render:text=>(getPrice(text))
 		},
 		{
			title: '开票方式',        
			dataIndex: 'makeNeed',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '开票内容',        
			dataIndex: 'makeRemarks',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '申请人',        
			dataIndex: 'applyUser',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '代办事项',        
			dataIndex: 'commissionMatter',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '客户名称',        
			dataIndex: 'clientName',   
      inputType: 'text', 
      align: 'center' ,  
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '地址',        
			dataIndex: 'address',   
      inputType: 'text', 
      align: 'center' ,  
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '电话',        
			dataIndex: 'tel',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '税号',        
			dataIndex: 'duty',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '开户行',        
			dataIndex: 'openingBank',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '账号',        
			dataIndex: 'account',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '客户名称',        
			dataIndex: 'clientName1',   
      inputType: 'text', 
      align: 'center' ,  
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '地址',        
			dataIndex: 'address1',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '联系人',        
			dataIndex: 'likeMan',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '手机',        
			dataIndex: 'phone',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '电话',        
			dataIndex: 'tel1',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '邮编',        
			dataIndex: 'postcode',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '快递公司',        
			dataIndex: 'company',   
      inputType: 'text',
      align: 'center' ,   
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '开票状态',        
			dataIndex: 'invoiceStatus',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
	  {
        title: '寄出日期',
        dataIndex: 'sendDate',
        editable:   true  ,
        align: 'center' ,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
      },
	  {
        title: '创建时间',
        dataIndex: 'createDate',
        editable:   false ,
        inputType: 'dateTime',
        align: 'center' ,
        width: 150,
        sorter: true,
      },
	  {
        title: '更新时间',
        dataIndex: 'finishDate',
        editable:   true  ,
        align: 'center' ,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
      },
 		{
			title: '备注信息',        
			dataIndex: 'remarks',   
      inputType: 'text',  
      align: 'center' , 
			width: 200,          
			editable:  true  ,      
 		},
     {
       title: '所属公司',        
       dataIndex: 'createBy.office.name',   
       inputType: 'text',   
       width: 200,
       align: 'center',        
       editable: true,      
     }
    ];


    let fieldArray = [];
    if (isNotBlank(array) && array.length > 0) {
      fieldArray = array.map((item) => {
      if (isNotBlank(item) && isNotBlank(field[item])) {
      return field[item]
      }
      return null;
      })
    } else {
      fieldArray = field;
    }

    const columns = [
      {
        title: '详情',
        width: 100,
        align: 'center' ,
        fixed: 'left',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.gotoUpdateForm(record.first,record.id,record.remarks)}>详情</a>
          </Fragment>
        ),
      },
        ...fieldArray,
        {
          title: '基础操作',
          width: 100,
          align: 'center' , 
          render: (text, record) => {
            return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='already').length>0
            && JSON.parse(getStorage('menulist')).filter(item=>item.target=='already')[0].children.filter(item=>item.name=='退票').length>0 
            &&isNotBlank(record.ticket)&&record.ticket ==0?
              <Popconfirm title="是否确认退票?" onConfirm={() => this.handleCompletionClick(record.id)}>
                <a>退票</a>
              </Popconfirm>
            :''
            },
        },
      ]


    return (
      <PageHeaderWrapper
      title="动态列表展示,默认展示全部."
      content={
        <Select
          mode="multiple"
          style={{ width: '100%', minWidth: 200 }}
          
          onChange={this.handleFieldChange}
        >
          {
    isNotBlank(field) && field.length > 0 && field.map((item, index) => (
      <Option key={item.dataIndex} value={index}>{item.title}</Option>
    ))
    }
        </Select>
  }
      >
        <div className={styles.standardList}>
        <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
            导出
            </Button>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{'position':'relative'}}>
                <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>已开票记录</div>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 150) }}
                loading={loading}
                data={getalreadyCpStartInvoiceList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onChange={this.handleStandardTableChange}
                 onRow={record => {
                  return {
                    onClick:()=> {
                    this.setState({
                      rowId: record.id,
                      })
                    },
                  };
                  }}
                rowClassName={(record, index) => 
									{
                    if(record.id === this.state.rowId){
                      return  'selectRow'
                   }
										if(record.orderStatus == '1'||record.orderStatus=='已处理'){
											  return 'greenstyle'
										}
										if(record.orderStatus == '0'||record.orderStatus=='未处理'){
											return 'redstyle'
										   }
									   if(record.orderStatus == '2'||record.orderStatus=='已关闭'){
											return 'graystyle'
										   }
                    }
                  }
              />
            </div>
          </Card>
        </div>

        
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default getalreadyCpStartInvoiceList;
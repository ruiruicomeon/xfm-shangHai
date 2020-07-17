import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input,  Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import styles from './CpBusinessOrderList.less';
import { parse, stringify } from 'qs';
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
		  cpBusinessOrderSearchList,
		  } = this.props;
		  return (
  <Modal
    width={860}
    title="多字段动态过滤"
    visible={searchVisible}
    onCancel={() => this.handleSearchVisiblein() }
    afterClose={() => this.handleSearchVisiblein() }
    onOk={() => this.okHandle()}
  >
    <div>
      {getFieldDecorator('genTableColumn', {
				  initialValue: [],
				})(<SearchTableList searchList={cpBusinessOrderSearchList} />)}
    </div>
  </Modal>
		  );
		}
	  }
@connect(({ cpBusinessOrder,cpinterior, loading }) => ({
  ...cpBusinessOrder,
  ...cpinterior,
  loading: loading.models.cpinterior,
}))
@Form.create()
class CpBusinessOrderList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
	formValues: {},
	array:[],
	searchVisible: false,
  }

  componentDidMount() {
	const { dispatch } = this.props;
	dispatch({
		type: 'cpinterior/cpBusinessOrder_SearchList',
		payload:{
			type:2
		}
	  });
    dispatch({
      type: 'cpinterior/cpBusinessOrder_List',
      payload: {
		pageSize: 10,
		formType: 2
      }
    });
  }

  gotoForm = () => {
    router.push(`/business/process/cp_internal_order_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/business/process/cp_internal_order_form?id=${id}`);
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
	  formType: 2,
      ...sort,
      ...formValues,
    ...filters,
    genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
    };
    dispatch({
      type: 'cpinterior/cpBusinessOrder_List',
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
      type: 'cpinterior/cpBusinessOrder_List',
      payload: {
        pageSize: 10,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
		current: 1,
		formType: 2
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
        type: 'cpinterior/cpBusinessOrder_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpinterior/cpBusinessOrder_List',
            payload: {
              pageSize: 10,
        ...formValues,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
			  formType: 2
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

      if (!isNotBlank(values.orderStatus)) {
				values.orderStatus = ''
			}

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpinterior/cpBusinessOrder_List',
        payload: {
          ...values,
          pageSize: 10,
          genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
		  current: 1,
		  formType: 2
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
        type: 'cpinterior/cpBusinessOrder_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpinterior/cpBusinessOrder_List',
            payload: {
              pageSize: 10,
              formType: 2,
              ...formValues,
              genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', {
								initialValue: ''
							})(
  <Select  style={{ width: '100%' }} allowClear>
    <Option key={0} value={0}>未处理</Option>
    <Option key={1} value={1}>已处理</Option>
    <Option key={2} value={2}>关闭</Option>
  </Select>
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
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
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
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', {
								initialValue: ''
							})(
  <Select  style={{ width: '100%' }} allowClear>
    <Option key={0} value={0}>未处理</Option>
    <Option key={1} value={1}>已处理</Option>
    <Option key={2} value={2}>关闭</Option>
  </Select>
							)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="意向单号">
              {getFieldDecorator('intentionId', {
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
            <FormItem label="订单分类">
              {getFieldDecorator('orderType', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="业务项目">
              {getFieldDecorator('project', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="业务渠道">
              {getFieldDecorator('dicth', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="业务分类">
              {getFieldDecorator('businessType', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结算类型">
              {getFieldDecorator('settlementType', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="保险公司">
              {getFieldDecorator('insuranceCompanyId', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="采集客户">
              {getFieldDecorator('collectClientId', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="采集编码">
              {getFieldDecorator('collectCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('brand', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="业务员">
              {getFieldDecorator('user.id', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户">
              {getFieldDecorator('client', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="进场类型">
              {getFieldDecorator('assemblyEnterType', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="总成品牌">
              {getFieldDecorator('assemblyBrand', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车型/排量">
              {getFieldDecorator('assemblyVehicleEmissions', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="年份">
              {getFieldDecorator('assemblyYear', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="总成型号">
              {getFieldDecorator('assemblyModel', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="钢印号">
              {getFieldDecorator('assemblySteelSeal', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="VIN码">
              {getFieldDecorator('assemblyVin', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="其他识别信息">
              {getFieldDecorator('assemblyMessage', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="故障代码">
              {getFieldDecorator('assemblyFaultCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="本次故障描述">
              {getFieldDecorator('assemblyErrorDescription', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="相片上传">
              {getFieldDecorator('photo', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="销售明细">
              {getFieldDecorator('salesParticular', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="意向单价">
              {getFieldDecorator('intentionPrice', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="交货时间">
              {getFieldDecorator('deliveryDate', {
						initialValue: ''
					  })(
  <DatePicker style={{ width: '100%' }}  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="付款方式">
              {getFieldDecorator('paymentMethod', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="旧件需求">
              {getFieldDecorator('oldNeed', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开票需求">
              {getFieldDecorator('makeNeed', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="质保项时间">
              {getFieldDecorator('qualityTime', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="质量要求">
              {getFieldDecorator('qualityNeed', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="油品要求">
              {getFieldDecorator('oilsNeed', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="外观要求">
              {getFieldDecorator('guiseNeed', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="安装指导">
              {getFieldDecorator('installationGuide', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物流要求">
              {getFieldDecorator('logisticsNeed', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="其他约定事项">
              {getFieldDecorator('otherBuiness', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="维修项目">
              {getFieldDecorator('maintenanceProject', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="行程里程">
              {getFieldDecorator('tripMileage', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车牌号">
              {getFieldDecorator('plateNumber', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否拍照">
              {getFieldDecorator('isPhotograph', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发货地址">
              {getFieldDecorator('shipAddress', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="维修历史">
              {getFieldDecorator('maintenanceHistory', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="定损员">
              {getFieldDecorator('partFee', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="事故单号">
              {getFieldDecorator('accidentNumber', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="事故说明">
              {getFieldDecorator('accidentExplain', {
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
		  type: 'cpinterior/cpBusinessOrder_List',
		  payload: {
        ...this.state.formValues,
			genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
			pageSize: 10,
      current: 1,
      formType: 2
		  },
		});
		this.setState({
      searchVisible: false,
      historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	  }

		handleFieldChange = (value) => {
			this.setState({
			  array: value || []
			})
			}

      handleUpldExportClick = type => {
        const {  formValues } = this.state;
        const params = { 
          ...formValues,
          genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
          'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):''
        }
        window.open(`/api/Beauty/beauty/interior/export?${stringify(params)}`);
    };
    
    handleUpldExportClickAll = type => {
      const {  formValues } = this.state;
      const params = { 
      ...formValues,
      genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
      'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):'',
      isTemplate:1
      }
      window.open(`/api/Beauty/beauty/interior/export?${stringify(params)}`);
      };

  render() {
    const { selectedRows ,array ,searchVisible ,orderType} = this.state;
    const { loading, cpBusinessOrderList ,cpBusinessOrderSearchList} = this.props;
    const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			cpBusinessOrderSearchList,
		  }
      const field =[{
        title: '订单状态', 
        dataIndex: 'orderStatus', 
		inputType: 'text',
		align: 'center' ,  
        width: 100, 
		editable: true, 
	  },
	 {
		title: '订单编号',        
		dataIndex: 'orderCode',   
		inputType: 'text',
		align: 'center' ,    
		width: 200,          
		editable:  true  ,      
	 },
	 {
        title: '订单分类', 
        dataIndex: 'orderType', 
		inputType: 'text', 
		align: 'center' , 
        width: 100, 
        editable: true, 
      },
	 {
		title: '业务员',        
		dataIndex: 'user.name',   
		inputType: 'text',
		align: 'center' ,    
		width: 150,          
		editable:  true  ,      
	 },
  {
	title: '创建时间',
	dataIndex: 'createDate',
	editable:   false ,
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
	title: '更新时间',
	dataIndex: 'finishDate',
	editable:   true  ,
	inputType: 'dateTime',
	align: 'center' , 
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
    title: '所属公司',        
    dataIndex: 'createBy.office.name',   
    inputType: 'text',   
    width: 200,
    align: 'center',        
    editable: true,      
  }
]
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
    fixed:'left',
        render: (text, record) => {
         return (
           <Fragment>
             <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
           </Fragment>
		  )
        },
      },
		 ...fieldArray
		 ,
		 {
			title: '基础操作',
			width: 100,
			align: 'center' , 
			render: (text, record) => {
			 return ((record.orderStatus === 0 || record.orderStatus === '0'||record.orderStatus === '未处理')&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
			 (item=>item.target=='cpInternalOrder').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder')[0]
			 .children.filter(item=>item.name=='删除').length>0) ?
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
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClickAll()}>
            导出所有
            </Button>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{'position':'relative'}}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
			 (item=>item.target=='cpInternalOrder').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder')[0]
			 .children.filter(item=>item.name=='修改').length>0?
  <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
  </Button>
				:
  <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
								新建
  </Button>
  }
                <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
内部订单
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                selectedRows={null}
                loading={loading}
                data={cpBusinessOrderList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onSelectRow={this.handleSelectRows}
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
export default CpBusinessOrderList;
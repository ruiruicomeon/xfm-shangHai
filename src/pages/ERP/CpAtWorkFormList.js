import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
	Button, Input,  Form, Card, Popconfirm, Icon, Row, Col, Select, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import { parse, stringify } from 'qs';
import styles from './CpAtWorkFormList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
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
			cpAtWorkFormSearchList
		} = this.props;
		return (
  <Modal
    width={860}
    title="多字段动态过滤"
    visible={searchVisible}
    onCancel={() =>   this.handleSearchVisiblein()}
    afterClose={() =>   this.handleSearchVisiblein()}
    onOk={() => this.okHandle()}
  >
    <div>
      {getFieldDecorator('genTableColumn', {
						initialValue: [],
					})(<SearchTableList searchList={cpAtWorkFormSearchList} />)}
    </div>
  </Modal>
		);
	}
}
const getValue = obj =>
	Object.keys(obj)
		.map(key => obj[key])
		.join(',');
@connect(({ cpAtWorkForm, loading }) => ({
	...cpAtWorkForm,
	loading: loading.models.cpAtWorkForm,
}))
@Form.create()
class CpAtWorkFormList extends PureComponent {
	state = {
		expandForm: false,
		selectedRows: [],
		formValues: {},
		searchVisible: false,
		array:[]
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'cpAtWorkForm/cpAtWorkForm_List',
			payload: {
				pageSize: 10,
			}
		});
		dispatch({
			type: 'cpAtWorkForm/cpAtWorkForm_SearchList',
		});
	}

	gotoForm = () => {
		router.push(`/business/process/cp_at_work_form_Form`);
	}

	gotoUpdateForm = (id) => {
		router.push(`/business/process/cp_at_work_form_Form?id=${id}`);
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
		if (isNotBlank(sorter) && isNotBlank(sorter.field)) {
			if (sorter.order === 'ascend') {
				sort = {
					'page.orderBy': `${sorter.field} asc`
				}
			} else if (sorter.order === 'descend') {
				sort = {
					'page.orderBy': `${sorter.field} desc`
				}
			}
		}
		const params = {
			current: pagination.current,
			pageSize: pagination.pageSize,
			...sort,
			...formValues,
			...filters,
			genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],   
		};
		dispatch({
			type: 'cpAtWorkForm/cpAtWorkForm_List',
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
			type: 'cpAtWorkForm/cpAtWorkForm_List',
			payload: {
				genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],   
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
				type: 'cpAtWorkForm/cpAtWorkForm_Delete',
				payload: {
					id: ids
				},
				callback: () => {
					this.setState({
						selectedRows: []
					})
					dispatch({
						type: 'cpAtWorkForm/cpAtWorkForm_List',
						payload: {
							genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],   
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
				if (values[item] instanceof moment) {
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
				type: 'cpAtWorkForm/cpAtWorkForm_List',
				payload: {
					genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],   
					...values,
					pageSize: 10,
					current: 1,
				},
			});
		});
	};

	onSaveData = (key, row) => {
		const {
			formValues,
		} = this.state;
		const { dispatch } = this.props;
		const value = { ...row };
		if (isNotBlank(value)) {
			Object.keys(value).map((item) => {
				if (value[item] instanceof moment) {
					value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
				}
				return item;
			});
			dispatch({
				type: 'cpAtWorkForm/cpAtWorkForm_Update',
				payload: {
					id: key,
					...value
				},
				callback: () => {
					dispatch({
						type: 'cpAtWorkForm/cpAtWorkForm_List',
						payload: {
							genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],   
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
          <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
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
        <FormItem label="品牌">
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
        <FormItem label="故障代码">
          {getFieldDecorator('assemblyFaultCode', {
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
			type: 'cpAtWorkForm/cpAtWorkForm_List',
			payload: {
				...this.state.formValues,
				genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
				pageSize: 10,
				current: 1,
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
		window.open(`/api/Beauty/beauty/cpAtWorkForm/export?${stringify(params)}`);
	  };

	render() {
		const { selectedRows, searchVisible ,array} = this.state;
		const { loading, cpAtWorkFormList, cpAtWorkFormSearchList } = this.props;
		const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			cpAtWorkFormSearchList
		}
		const field = [
			{
				title: '单号',        
				dataIndex: 'id',
				align: 'center' ,    
				inputType: 'text',   
				width: 150,          
				editable: true,      
			},
			{
				title: '意向单号',  
				align: 'center' ,       
				dataIndex: 'intentionId',   
				inputType: 'text',   
				width: 150,          
				editable: true,      
				render:(text)=>{
					if(text=='0000'){
						return ''
					}
					return text
				}
			},
			{
				title: '分类', 
				align: 'center' , 
				dataIndex: 'type', 
				inputType: 'text', 
				width: 100, 
				editable: true, 
				render:(text)=>{
					  if(text==2||text==3){
						  return '总成类型'
					  }if(text==1){
						return '整车类型'
					  }if(text==4){
						 return '内部订单类型'
					  }
					return ''
				}
			  },
			{
				title: '订单状态',        
				dataIndex: 'orderStatus',
				align: 'center' ,    
				inputType: 'text',   
				width: 100,          
				editable: true,      
			},
			{
				title: '订单编号', 
				align: 'center' ,        
				dataIndex: 'orderCode',   
				inputType: 'text',   
				width: 200,          
				editable: true,      
			},
			{
				title: '订单分类',  
				align: 'center' ,       
				dataIndex: 'orderType',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
				render:(text)=>{
					if(text=='总成'||text=='总成/配件'){
						return '再制造'
					}
					return text
				}
			},
			{
				title: '业务项目',        
				dataIndex: 'project',   
				inputType: 'text',
				align: 'center' ,    
				width: 100,          
				editable: true,      
				render:(text,res)=>{
					if(isNotBlank(res.orderType)&&(res.orderType=='总成'||res.orderType=='总成/配件')){
						 return '总成翻新'
					}
					return text
				}
			},
			{
				title: '业务渠道', 
				align: 'center' ,        
				dataIndex: 'dicth',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
			},
			{
				title: '业务分类',        
				dataIndex: 'businessType',   
				inputType: 'text',
				align: 'center' ,    
				width: 100,          
				editable: true,      
			},
			{
				title: '品牌',        
				dataIndex: 'brand',
				align: 'center' ,    
				inputType: 'text',   
				width: 100,          
				editable: true,      
			},
			{
				title: '业务员',        
				dataIndex: 'user.name',   
				inputType: 'text',
				align: 'center' ,    
				width: 150,          
				editable: true,      
			},
			{
				title: '客户',        
				dataIndex: 'client.clientCpmpany',   
				inputType: 'text',
				align: 'center' ,    
				width: 240,          
				editable: true,      
				render:(text,res)=>{
					if(isNotBlank(res.orderType)&&(res.orderType=='总成'||res.orderType=='总成/配件')){
						return isNotBlank(res.user)&&isNotBlank(res.user.name)?res.user.name:''
				   }
				   return text
				}
			},
			{
				title: '进场类型',        
				dataIndex: 'assemblyEnterType',   
				inputType: 'text',
				align: 'center' ,    
				width: 100,          
				editable: true,      
			},
			{
				title: '品牌',        
				dataIndex: 'assemblyBrand',   
				inputType: 'text',
				align: 'center' ,    
				width: 100,          
				editable: true,      
			},
			{
				title: '保险公司',
				dataIndex: 'insuranceCompanyId',
				inputType: 'text',
				width: 100,
				align: 'center',
				editable: true,
			},
			{
				title: '车型/排量',        
				dataIndex: 'assemblyVehicleEmissions',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '年份',        
				dataIndex: 'assemblyYear',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '总成型号',        
				dataIndex: 'assemblyModel',   
				inputType: 'text', 
				align: 'center' ,   
				width: 150,          
				editable: true,      
			},
			{
				title: '总成号',        
				dataIndex: 'cpAssemblyBuild.assemblyCode',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '钢印号',        
				dataIndex: 'assemblySteelSeal',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: 'VIN码',        
				dataIndex: 'assemblyVin',   
				inputType: 'text', 
				align: 'center' ,   
				width: 200,          
				editable: true,      
			},
			{
				title: '其他识别信息',        
				dataIndex: 'assemblyMessage',   
				inputType: 'text',
				align: 'center' ,    
				width: 100,          
				editable: true,      
			},
			{
				title: '故障代码',        
				dataIndex: 'assemblyFaultCode',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '本次故障描述',        
				dataIndex: 'assemblyErrorDescription',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '交货时间',
				dataIndex: 'deliveryDate',
				editable: true,
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
				title: '旧件需求',        
				dataIndex: 'oldNeed',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '质保项时间',        
				dataIndex: 'qualityTime',   
				inputType: 'text',   
				width: 100,  
				align: 'center' ,         
				editable: true,      
	render:(text)=>{
		if(isNotBlank(text)){
			return `${text.split(',')[0]}年${text.split(',')[1]}个月`
		}
		return ''
	}
			},
			{
				title: '质量要求',        
				dataIndex: 'qualityNeed',   
				inputType: 'text',   
				width: 100,   
				align: 'center' ,        
				editable: true,      
			},
			{
				title: '油品要求',        
				dataIndex: 'oilsNeed',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '外观要求',        
				dataIndex: 'guiseNeed',   
				inputType: 'text',   
				width: 100,          
				editable: true,
				align: 'center' ,       
			},
			{
				title: '安装指导',        
				dataIndex: 'installationGuide',   
				inputType: 'text',   
				width: 100,    
				align: 'center' ,       
				editable: true,      
			},
			{
				title: '物流要求',        
				dataIndex: 'logisticsNeed',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '其他约定事项',        
				dataIndex: 'otherBuiness',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '维修项目',        
				dataIndex: 'maintenanceProject',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '行程里程',        
				dataIndex: 'tripMileage',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '车牌号',        
				dataIndex: 'plateNumber',   
				inputType: 'text',
				align: 'center' ,    
				width: 100,          
				editable: true,      
			},
			{
				title: '是否拍照',        
				dataIndex: 'isPhotograph',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '发货地址',        
				dataIndex: 'shipAddress',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '维修历史',        
				dataIndex: 'maintenanceHistory',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '整车检测结果',        
				dataIndex: 'carloadTestingResult',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '整车故障编码',        
				dataIndex: 'carloadFaultCode',   
				inputType: 'text',  
				align: 'center' ,  
				width: 100,          
				editable: true,      
			},
			{
				title: '检测人',        
				dataIndex: 'testingUser',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '维修班组',        
				dataIndex: 'maintenanceCrew.name',   
				inputType: 'text',
				align: 'center' ,    
				width: 100,          
				editable: true,      
			},
			{
				title: '更新时间',
				dataIndex: 'finishDate',
				editable: true,
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
				title: '备注信息',        
				dataIndex: 'remarks', 
				align: 'center' ,   
				inputType: 'text',   
				width: 100,          
				editable: true,      
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
    <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
  </Fragment>
				),
			},
			...fieldArray,
			{
				title: '基础操作',
				width: 100,
				align: 'center' , 
				render: (text, record) => {
					return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm').length>0
					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm')[0].children.filter(item=>item.name=='删除')
					.length>0 ?
					(isNotBlank(record) && isNotBlank(record.orderStatus) && (record.orderStatus==='未处理') ?
  <Fragment>
    <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
      <a>删除</a>
    </Popconfirm>
  </Fragment>
					:'')
					:''
				},
			}
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
    <div className='liststyle'>
	<Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
            导出
            </Button>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>总成施工单</div>
          <StandardEditTable
            scroll={{ x: (fieldArray.length * 100) + 500 }}
            loading={loading}
            data={cpAtWorkFormList}
            bordered
            columns={columns}
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
export default CpAtWorkFormList;

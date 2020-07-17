/**
 * AT待完工清单
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
	Button, Input, Form, Card, Popconfirm, Icon, Row, Col, Select, Tag, Modal
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import { parse, stringify } from 'qs';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import styles from './ATRoadWorkList.less';
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
			completionSearchList,
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
					})(<SearchTableList searchList={completionSearchList} />)}
    </div>
  </Modal>
		);
	}
}
@connect(({ waitinCompletion, loading }) => ({
	...waitinCompletion,
	loading: loading.models.waitinCompletion,
}))
@Form.create()
class ATRoadWorkList extends PureComponent {
	state = {
		expandForm: false,
		formValues: {},
		array: [],
		searchVisible: false
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'waitinCompletion/waitinCompletion_ATList',
			payload: {
				pageSize: 10,
			}
		});
		dispatch({
			type: 'waitinCompletion/completion_SearchList',
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
			type: 'waitinCompletion/waitinCompletion_ATList',
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
			type: 'waitinCompletion/waitinCompletion_ATList',
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

	handleCompletionClick = (id) => {
		const { dispatch } = this.props;
		const { formValues } = this.state;
		if (isNotBlank(id)) {
			dispatch({
				type: 'waitinCompletion/update_Completion',
				payload: {
					type: 2,
					id
				},
				callback: () => {
					dispatch({
						type: 'waitinCompletion/waitinCompletion_ATList',
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
			this.setState({
				formValues: values,
			});
			dispatch({
				type: 'waitinCompletion/waitinCompletion_ATList',
				payload: {
					genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],     
					...values,
					pageSize: 10,
					current: 1,
				},
			});
		});
	};

	handleFieldChange = (value) => {
		this.setState({
			array: value || []
		})
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
			type: 'waitinCompletion/waitinCompletion_ATList',
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

	renderSimpleForm() {
		const { form: { getFieldDecorator } } = this.props;
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
        <FormItem label="品牌">
          {getFieldDecorator('assemblyBrand', {
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
        <FormItem label="订单编号">
          {getFieldDecorator('orderCode', {
								initialValue: ''
							})(
  <Input  />
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

	handleUpldExportClick = type => {
		const {  formValues } = this.state;
		const params = { 
			...formValues,
			type:2,
			genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
			'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):''
		}
		window.open(`/api/Beauty/beauty/cpCarloadConstructionForm/export?${stringify(params)}`);
	  };


	render() {
		const { array, orderStatus, searchVisible, orderType, business_type, old_need, area, quality_need, oils_need, guise_need, is_photograph, installation_guide, business_project, business_dicth, maintenance_project } = this.state;
		const { loading, ATWaitinCompletionList, completionSearchList } = this.props;
		const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			completionSearchList,
		}
		const field = [
			{
				title: '订单状态',        
				dataIndex: 'orderStatus',   
				inputType: 'text',  
				align: 'center' ,  
				width: 100,          
				editable: true,      
			},
			{
				title: '单号',        
				dataIndex: 'id',
				align: 'center' ,    
				inputType: 'text',   
				width: 150,          
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
				dataIndex: 'orderType',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '业务项目',        
				dataIndex: 'project',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '业务渠道',        
				dataIndex: 'dicth',
				align: 'center' ,    
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
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '分公司',        
				dataIndex: 'user.office.name',   
				inputType: 'text',  
				align: 'center' ,  
				width: 150,          
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
				title: '区域',        
				dataIndex: 'user.dictArea',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
				editable: true,      
			},
			{
				title: '客户',  
				align: 'center' ,       
				dataIndex: 'client.clientCpmpany',   
				inputType: 'text',   
				width: 240,          
				editable: true,      
			},
			{
				title: '进场类型',
				align: 'center' ,         
				dataIndex: 'assemblyEnterType',   
				inputType: 'text',   
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
				width: 150,          
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
				width: 100,   
				align: 'center' ,        
				editable: true,      
			},
			{
				title: '外观要求',        
				dataIndex: 'guiseNeed',   
				inputType: 'text',   
				width: 100,  
				align: 'center' ,         
				editable: true,      
			},
			{
				title: '安装指导',        
				dataIndex: 'installationGuide',   
				inputType: 'text', 
				align: 'center' ,   
				width: 100,          
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
				width: 100, 
				align: 'center' ,          
				editable: true,      
			},
			{
				title: '行程里程',        
				dataIndex: 'tripMileage',   
				inputType: 'text',   
				width: 100,  
				align: 'center' ,         
				editable: true,      
			},
			{
				title: '车牌号',        
				dataIndex: 'plateNumber',   
				inputType: 'text',   
				width: 100,  
				align: 'center' ,         
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
				width: 100, 
				align: 'center' ,          
				editable: true,      
			},
			{
				title: '维修历史',        
				dataIndex: 'maintenanceHistory',   
				inputType: 'text',   
				width: 100,  
				align: 'center' ,         
				editable: true,      
			},
			{
				title: '整车检测结果',        
				dataIndex: 'carloadTestingResult',   
				inputType: 'text',   
				width: 100,   
				align: 'center' ,        
				editable: true,      
			},
			{
				title: '整车故障编码',        
				dataIndex: 'carloadFaultCode',   
				inputType: 'text',   
				width: 100,  
				align: 'center' ,         
				editable: true,      
			},
			{
				title: '检测人', 
				align: 'center' ,        
				dataIndex: 'testingUser',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
			},
			{
				title: '维修班组',   
				align: 'center' ,      
				dataIndex: 'maintenanceCrew.name',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
			},
			{
				title: '创建时间',
				align: 'center' , 
				dataIndex: 'createDate',
				editable: false,
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
				align: 'center' , 
				dataIndex: 'updateDate',
				editable: true,
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
				align: 'center' ,       
				dataIndex: 'remarks',   
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
				title: '操作',
				width: 100,
				align: 'center' , 
				fixed: 'left',
				render: (text, record) => {
				return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCarloadConstructionForm3').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCarloadConstructionForm3')[0].children.filter(item=>item.name=='修改')
.length>0 ?
  <Popconfirm title="是否确认完工?" onConfirm={() => this.handleCompletionClick(record.id)}>
    <a>完工</a>
  </Popconfirm>
					:''
				},
			},
			...fieldArray,
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
          <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>总成待完工清单</div>
          <StandardTable
            scroll={{ x: (fieldArray.length * 100) + 500 }}
            selectedRows={null}
            loading={loading}
            data={ATWaitinCompletionList}
            bordered
            columns={columns}
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
export default ATRoadWorkList;
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Select,
	Button,
	Card,
	message,
	Icon,
	Modal,
	Col, Row, 
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpOutProductForm.less';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import SearchTableList from '@/components/SearchTableList';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
Object.keys(obj)
	.map(key => obj[key])
	.join(',');
@Form.create()
class SearchFormzc extends PureComponent {
	okHandle = () => {
		const { form, handleSearchAddzc } = this.props;
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			handleSearchAddzc(fieldsValue);
		});
	};

	handleSearchVisiblezcin = () => {
		const { form, handleSearchVisiblezc } = this.props;
		form.validateFields((err, fieldsValue) => {
			handleSearchVisiblezc(fieldsValue);
		});
	  };

	render() {
		const {
			searchVisiblezc,
			form: { getFieldDecorator },
			handleSearchVisiblezc,
			cpAssemblyBuildSearchList,
		} = this.props;
		return (
  <Modal
    width={860}
    title="多字段动态过滤"
    visible={searchVisiblezc}
    onCancel={() => this.handleSearchVisiblezcin()}
    afterClose={() => this.handleSearchVisiblezcin()}
    onOk={() => this.okHandle()}
  >
    <div>
      {getFieldDecorator('genTableColumn', {
						initialValue: [],
					})(<SearchTableList searchList={cpAssemblyBuildSearchList} />)}
    </div>
  </Modal>
		);
	}
}
const CreateForm = Form.create()(props => {
	const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator },
		selectuser, handleSelectRows, selectedRows, cpAssemblyBuildList ,zcProuctStatisticslist,
		dispatch ,handleSearchChangezc ,that } = props;
	const selectcolumns = [
		{
			title: '操作',
			width: 100,
			align: 'center' ,
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectuser(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		   {
			title: '总成编码',        
			dataIndex: 'purchaseCode',   
			inputType: 'text',   
			width: 200,          
			editable:  true  ,      
		   },
		{
			title: '总成型号',        
			dataIndex: 'assemblyBuild.assemblyModel',   
			inputType: 'text',
			align: 'center' ,    
			width: 150,          
			editable: true,      
		},
		{
			title: '业务项目',        
			dataIndex: 'assemblyBuild.project',   
			inputType: 'text',
			align: 'center' ,   
			width: 100,          
			editable: true,      
		},
		{
			title: '总成号',        
			dataIndex: 'assemblyBuild.assemblyCode',   
			inputType: 'text',
			align: 'center' ,    
			width: 100,          
			editable: true,      
		},
		{
			title: '大号',        
			dataIndex: 'assemblyBuild.maxCode',   
			inputType: 'text',  
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '小号',        
			dataIndex: 'assemblyBuild.minCode',   
			inputType: 'text',
			align: 'center' ,    
			width: 150,          
			editable: true,      
		},
		{
			title: '车型',        
			dataIndex: 'assemblyBuild.vehicleModel',   
			inputType: 'text', 
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '品牌',        
			dataIndex: 'assemblyBuild.assemblyBrand',   
			inputType: 'text', 
			align: 'center' ,   
			width: 100,          
			editable: true,      
		},
		{
			title: '年份',        
			dataIndex: 'assemblyBuild.assemblyYear',   
			inputType: 'text',
			align: 'center' ,    
			width: 100,          
			editable: true,      
		},
		{
			title: '原厂编码',        
			dataIndex: 'assemblyBuild.originalCode',   
			inputType: 'text', 
			align: 'center' ,   
			width: 100,          
			editable: true,      
		},
		{
			title: '数量',        
			dataIndex: 'number',   
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
		title: '仓库',        
		dataIndex: 'cpEntrepot.name',   
		inputType: 'text',   
		width: 150,          
		editable:  true  ,      
	   },
	   {
		title: '库位',        
		dataIndex: 'cpStorage.name',   
		inputType: 'text',   
		width: 150,          
		editable:  true  ,      
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
			inputType: 'text',
			align: 'center' ,    
			width: 150,          
			editable: true,      
		}
	]
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };
	const handleSearch = (e) => {
		e.preventDefault();
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

		  that.setState({
			zcsearch:values
		  })

		  dispatch({
			type: 'cpOutProduct/zcProuct_Statistics',
			payload: {
			  ...values,
			  genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
			  pageSize: 10,
			  current: 1,
			},
		  });
		});
	  };
	const handleFormReset = () => {
				form.resetFields();
				that.setState({
					zcsearch:{}
				})
				dispatch({
				  type: 'cpOutProduct/zcProuct_Statistics',
				  payload: {
					genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
					pageSize: 10,
					current: 1,
				  },
				});
			  };
			  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
				const filters = Object.keys(filtersArg).reduce((obj, key) => {
					const newObj = { ...obj };
					newObj[key] = getValue(filtersArg[key]);
					return newObj;
				}, {});
				const params = {
					...that.state.zcsearch,
					current: pagination.current,
					pageSize: pagination.pageSize,
					genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
					...filters,
				};
				if (sorter.field) {
					params.sorter = `${sorter.field}_${sorter.order}`;
				}
				dispatch({
					type: 'cpOutProduct/zcProuct_Statistics',
					payload: params,
				});
			};
			
		 const	handleModalVisiblein=()=>{
			// form.resetFields();
			// that.setState({
			// 	zcsearch:{}
			// })
			handleModalVisible()
		 }

	return (
  <Modal
    title='总成选择'
    visible={modalVisible}
    onCancel={() => handleModalVisiblein()}
    width='80%'
		>
    <Form onSubmit={handleSearch}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="总成编码">
            {getFieldDecorator('purchaseCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="总成型号">
            {getFieldDecorator('assemblyBuild.assemblyModel', {
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
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
    <StandardTable
      bordered
      scroll={{ x: 2300 }}
      onChange={handleStandardTableChange}
      data={zcProuctStatisticslist}
      columns={selectcolumns}
    />
  </Modal>
	);
});
const CreateFormkw = Form.create()(props => {
	const { handleModalVisiblekw, cpEntrepotList, selectkwflag, selectkw ,dispatch ,form ,form: { getFieldDecorator }} = props;
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center' , 
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectkw(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '仓库名',        
			dataIndex: 'name',
			align: 'center' ,    
			inputType: 'text',   
			width: 150,          
			editable: true,      
		},
		{
			title: '所属公司',        
			dataIndex: 'office.name',   
			inputType: 'text', 
			align: 'center' ,   
			width: 150,          
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
			inputType: 'text',  
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
	];
	const  handleFormReset = () => {
		form.resetFields();
		dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
		  payload: {
			pageSize: 10,
			current: 1,
		  },
		});
	  };
	  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});
		const params = {
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
			payload: params,
		});
	};
	  const formItemLayout = {
		labelCol: {
		  xs: { span: 24 },
		  sm: { span: 7 },
		},
		wrapperCol: {
		  xs: { span: 24 },
		  sm: { span: 12 },
		  md: { span: 10 },
		},
	  };
	 const handleSearch = (e) => {
		e.preventDefault();
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
		  dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
			payload: {
			  ...values,
			  pageSize: 10,
			  current: 1,
			},
		  });
		});
	  };
	return (
  <Modal
    title='选择所属仓库'
    visible={selectkwflag}
    onCancel={() => handleModalVisiblekw()}
    width='80%'
		>
    <Row>
      <Form onSubmit={handleSearch}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="仓库名">
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
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
          </span>
        </Col>
      </Form>
    </Row>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpEntrepotList}
      columns={columnskh}
    />
  </Modal>
	);
});
const CreateForminkw = Form.create()(props => {
	const { handleModalVisibleinkw, cpStorageList, selectinkwflag, selectinkw ,dispatch ,form ,form: { getFieldDecorator }  } = props;
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center' , 
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectinkw(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '配件仓库',        
			dataIndex: 'entrepotName',   
			inputType: 'text', 
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '库位',        
			dataIndex: 'name',   
			inputType: 'text', 
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
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
			title: '备注信息',        
			dataIndex: 'remarks',   
			inputType: 'text', 
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
	];
	const handleSearch = (e) => {
		e.preventDefault();
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
		  dispatch({
			type: 'cpStorage/cpStorage_List',
			payload: {
			  ...values,
			  pageSize: 10,
			  current: 1,
			},
		  });
		});
	  };
	  const formItemLayout = {
		labelCol: {
		  xs: { span: 24 },
		  sm: { span: 7 },
		},
		wrapperCol: {
		  xs: { span: 24 },
		  sm: { span: 12 },
		  md: { span: 10 },
		},
	  };
	  const handleFormReset = () => {
		form.resetFields();
		dispatch({
		  type: 'cpStorage/cpStorage_List',
		  payload: {
			pageSize: 10,
			current: 1,
		  },
		});
	  };
	  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});
		const params = {
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpStorage/cpStorage_List',
			payload: params,
		});
	};
	return (
  <Modal
    title='选择所属库位'
    visible={selectinkwflag}
    onCancel={() => handleModalVisibleinkw()}
    width='80%'
		>
    <Row>
      <Form onSubmit={handleSearch}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="仓库名">
            {getFieldDecorator('entrepotName', {
						initialValue: ''
					  })(
  <Input  />
					  )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="库位名">
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
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
          </span>
        </Col>
      </Form>
    </Row>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpStorageList}
      columns={columnskh}
    />
  </Modal>
	);
});
@connect(({ cpOutProduct, loading, cpEntrepot, cpStorage, cpAssemblyBuild ,cpstatistics}) => ({
	...cpOutProduct,
	...cpEntrepot,
	...cpStorage,
	...cpAssemblyBuild,
	...cpstatistics,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpOutProduct/cpOutProduct_Add'],
}))
@Form.create()
class CpOutProductForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			selectinkwdata: [],
			selectkwdata: [],
			selectkwflag: false,
			selectinkwflag: false,
			orderflag: false,
			modalVisible:false,
			modalRecord:{},
			updataflag:true,
			confirmflag :true,
			updataname:'取消锁定',
			confirmflag1:true,
			location: getLocation()
		}
	}

	componentDidMount() {
		console.log('componentDidMount')
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpOutProduct/cpOutProduct_Get',
				payload: {
					id: location.query.id,
				},
				callback:(res)=>{
					if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
					||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct').length>0
					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct')[0].children.filter(item=>item.name=='修改')
					.length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
					dispatch({
						type: 'sysarea/getFlatCode',
						payload:{
						id:location.query.id,
						type:'ZCCK'
						},
						callback:(imgres)=>{
						this.setState({
							srcimg:imgres.msg.split('|')[0]
						})
						}
						})
					dispatch({
						type: 'sysarea/getFlatOrderdCode',
						payload:{
						id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
						type:'ZCCK'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg1:imgres
						})
						}
						})
					this.props.form.setFieldsValue({
						ck: isNotBlank(res.data) && isNotBlank(res.data.storage) && isNotBlank(res.data.storage.entrepotName) ? res.data.storage.entrepotName : '',
						kw: isNotBlank(res.data) && isNotBlank(res.data.storage) && isNotBlank(res.data.storage.name) ? res.data.storage.name : ''
					});
				}
			});
    }
    
		dispatch({
			type: 'cpOutProduct/zcProuct_Statistics',
			payload: {
				pageSize: 10,
				// genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
			}
		});

		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'zc_stirage_type',
			},
			callback: data => {
				this.setState({
					zc_stirage_type: data
				})
			}
		});
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpOutProduct/clear',
		});
		dispatch({
			type: 'cpStorage/clear',
		});
	}

	handleSubmit = e => {
		const { dispatch, form ,cpOutProductGet} = this.props;
		const { addfileList, location ,modalRecord,selectinkwdata,selectkwdata,updataflag} = this.state;
		e.preventDefault();
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					let photo = [];
					let list = [];
					for (let i = 0; i < addfileList.length; i += 1) {
						if (isNotBlank(addfileList[i].id)) {
							photo = [...photo, addfileList[i].url];
						} else {
							list = [...list, addfileList[i]];
						}
					}
					if (isNotBlank(photo) && photo.length > 0) {
						value.photo = photo.map(row => row).join('|');
					} else {
						value.photo = '';
					}
					value.file = list;
				} else {
					value.photo = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.money = isNotBlank(value.money)?setPrice(value.money):''
				value.assemblyBuild = {}
				value.assemblyBuild.id= isNotBlank(modalRecord)&&isNotBlank(modalRecord.assemblyBuild)?(isNotBlank(modalRecord.assemblyBuild.id)?modalRecord.assemblyBuild.id:''):
				(isNotBlank(cpOutProductGet)&&isNotBlank(cpOutProductGet.assemblyBuild)&&isNotBlank(cpOutProductGet.assemblyBuild.id)?cpOutProductGet.assemblyBuild.id:'')
				value.cpEntrepot = {}
				value.cpEntrepot.Id = isNotBlank(modalRecord) && isNotBlank(modalRecord.cpEntrepot) && isNotBlank(modalRecord.cpEntrepot.id) ? modalRecord.cpEntrepot.id :
				(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.cpEntrepot)&& isNotBlank(cpOutProductGet.cpEntrepot.id)  ?cpOutProductGet.cpEntrepot.id : '')
				if(isNotBlank(modalRecord)&&isNotBlank(modalRecord.id)){
					value.kId =modalRecord.id
				}  
				value.storage = {}
				value.storage.id = isNotBlank(modalRecord) && isNotBlank(modalRecord.cpStorage) && isNotBlank(modalRecord.cpStorage.id) ? modalRecord.cpStorage.id :
				(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.storage)&& isNotBlank(cpOutProductGet.storage.id)  ?cpOutProductGet.storage.id : '')
					value.orderStatus = 1
				if(updataflag){
				dispatch({
					type: 'cpOutProduct/cpOutProduct_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/warehouse/process/cp_out_product_form?id=${location.query.id}`);
						// router.push('/warehouse/process/cp_out_product_list');
					}
				})
			}else{
					dispatch({
					type: 'cpOutProduct/cpOutProduct_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/warehouse/process/cp_out_product_form?id=${location.query.id}`);
						// router.push('/warehouse/process/cp_out_product_list');
					}
				})
			}
			}
		});
	};

	onupdata = ()=>{
		const {location ,updataflag } = this.state
		if(updataflag){
				this.setState({
			updataflag:false,
			updataname:'锁定'
			})
		}else{
			router.push(`/warehouse/process/cp_out_product_form?id=${location.query.id}`);
		}
	}

	onsave = () => {
		const { dispatch, form ,cpOutProductGet} = this.props;
		const { addfileList, location ,modalRecord,selectinkwdata,selectkwdata,updataflag} = this.state;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					let photo = [];
					let list = [];
					for (let i = 0; i < addfileList.length; i += 1) {
						if (isNotBlank(addfileList[i].id)) {
							photo = [...photo, addfileList[i].url];
						} else {
							list = [...list, addfileList[i]];
						}
					}
					if (isNotBlank(photo) && photo.length > 0) {
						value.photo = photo.map(row => row).join('|');
					} else {
						value.photo = '';
					}
					value.file = list;
				} else {
					value.photo = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.money = isNotBlank(value.money)?setPrice(value.money):''
				value.assemblyBuild = {}
				value.assemblyBuild.id= isNotBlank(modalRecord)&&isNotBlank(modalRecord.assemblyBuild)?(isNotBlank(modalRecord.assemblyBuild.id)?modalRecord.assemblyBuild.id:''):
				(isNotBlank(cpOutProductGet)&&isNotBlank(cpOutProductGet.assemblyBuild)&&isNotBlank(cpOutProductGet.assemblyBuild.id)?cpOutProductGet.assemblyBuild.id:'')
				value.cpEntrepot = {}
				value.cpEntrepot.Id = isNotBlank(modalRecord) && isNotBlank(modalRecord.cpEntrepot) && isNotBlank(modalRecord.cpEntrepot.id) ? modalRecord.cpEntrepot.id :
				(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.cpEntrepot)&& isNotBlank(cpOutProductGet.cpEntrepot.id)  ?cpOutProductGet.cpEntrepot.id : '')
				if(isNotBlank(modalRecord)&&isNotBlank(modalRecord.id)){
						value.kId = modalRecord.id
				}
				value.storage = {}
				value.storage.id = isNotBlank(modalRecord) && isNotBlank(modalRecord.cpStorage) && isNotBlank(modalRecord.cpStorage.id) ? modalRecord.cpStorage.id :
				(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.storage)&& isNotBlank(cpOutProductGet.storage.id)  ?cpOutProductGet.storage.id : '')
					if(updataflag){
					value.orderStatus = 0
				dispatch({
					type: 'cpOutProduct/cpOutProduct_Add',
					payload: { ...value },
					callback: () => {
					}
				})
			}else{
				value.orderStatus = 1
				dispatch({
					type: 'cpOutProduct/cpOutProduct_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
					}
				})
			}
			}
		});
	};

	onCancelCancel = () => {
		router.push('/warehouse/process/cp_out_product_list');
	};

	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = file => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	};

	handleImage = url => {
		this.setState({
			previewImage: url,
			previewVisible: true,
		});
	};

	handleRemove = file => {
		this.setState(({ fileList, addfileList }) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			const newaddfileList = addfileList.slice();
			newaddfileList.splice(index, 1);
			return {
				fileList: newFileList,
				addfileList: newaddfileList,
			};
		});
	};

	handlebeforeUpload = file => {
		const { addfileList } = this.state;
		const isimg = file.type.indexOf('image') >= 0;
		if (!isimg) {
			message.error('请选择图片文件!');
		}
		const isLt10M = file.size / 1024 / 1024 <= 10;
		if (!isLt10M) {
			message.error('文件大小需为10M以内');
		}
		if (isimg && isLt10M) {
			if (!isNotBlank(addfileList) || addfileList.length <= 0) {
				this.setState({
					addfileList: [file],
				});
			} else {
				this.setState({
					addfileList: [...addfileList, file],
				});
			}
		}
		return isLt10M && isimg;
	};

	handleUploadChange = info => {
		const isimg = info.file.type.indexOf('image') >= 0;
		const isLt10M = info.file.size / 1024 / 1024 <= 10;
		if (info.file.status === 'done') {
			if (isLt10M && isimg) {
				this.setState({ fileList: info.fileList });
			}
		} else {
			this.setState({ fileList: info.fileList });
		}
	};

	selectinkw = (record) => {
		const {cpOutProductGet} = this.props
		this.props.form.setFieldsValue({
			kw: isNotBlank(record) && isNotBlank(record.name) ? record.name :
			(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.storage) && isNotBlank(cpOutProductGet.storage.name) ? cpOutProductGet.storage.name : '')
		  });
		this.setState({
			selectinkwdata: record,
			selectinkwflag: false
		})
	}

	selectkw = (record) => {
		const { dispatch , cpOutProductGet ,form} = this.props
		const {modalRecord ,location}  = this.state
		dispatch({
			type: 'cpStorage/cpStorage_List',
			payload: {
				pageSize: 10,
				pjEntrepotId: record.id
			}
		});
		this.props.form.setFieldsValue({
			ck: isNotBlank(record) && isNotBlank(record.name) ? record.name :
			(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.storage) && isNotBlank(cpOutProductGet.storage.entrepotName) ? cpOutProductGet.storage.entrepotName : '')
		  });
		this.setState({
			selectkwdata: record,
			selectkwflag: false
		})
		const value = form.getFieldsValue()
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			value.id = location.query.id;
		}
		value.cpEntrepot = {}
		value.cpEntrepot.Id = isNotBlank(record) && isNotBlank(record.id) ? record.id :''
				value.assemblyBuild = {}
				value.assemblyBuild.id = isNotBlank(modalRecord)&&isNotBlank(modalRecord.id)?modalRecord.id:
				(isNotBlank(cpOutProductGet)&&isNotBlank(cpOutProductGet.assemblyBuild)&&isNotBlank(cpOutProductGet.assemblyBuild.id)?cpOutProductGet.assemblyBuild.id:'')
				value.orderStatus = -1
				dispatch({
					type: 'cpOutProduct/cpOutProduct_save_Add',
					payload: { ...value },
					callback: () => {
						dispatch({
							type: 'cpOutProduct/cpOutProduct_Get',
							payload: {
								id: location.query.id,
							},
							callback:(res)=>{
								if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
								||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct').length>0
								&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct')[0].children.filter(item=>item.name=='修改')
								.length==0)) {
									this.setState({ orderflag: true })
								} else {
									this.setState({ orderflag: false })
								}
								this.props.form.setFieldsValue({
									ck: isNotBlank(res.data) && isNotBlank(res.data.storage) && isNotBlank(res.data.storage.entrepotName) ? res.data.storage.entrepotName : '',
									kw: isNotBlank(res.data) && isNotBlank(res.data.storage) && isNotBlank(res.data.storage.name) ? res.data.storage.name : ''
								});
							}
						});
					}
				})
	}

	handleModalVisibleinkw = flag => {
		this.setState({
			selectinkwflag: !!flag
		});
	};

	handleModalVisiblekw = flag => {
		this.setState({
			selectkwflag: !!flag
		});
	};

	onselectkw = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
			payload: {
				current: 1,
				pageSize: 10
			}
		})
		this.setState({
			selectkwflag: true
		})
	}

	showTable = () => {
		this.setState({
			modalVisible: true
		});
	}

	selectuser = (res) => {
		const { dispatch } = this.props;
		const { selectedRows, location } = this.state;
		this.setState({
		  modalVisible: false,
		  modalRecord: res
		})

		this.props.form.setFieldsValue({
			assemblyBuildId:isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.assemblyModel) ? res.assemblyBuild.assemblyModel :'',
			purchaseCode: isNotBlank(res) && isNotBlank(res.purchaseCode) ? res.purchaseCode :'',
			ywxm:isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.project) ? res.assemblyBuild.project :'',
			zch:isNotBlank(res)  && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.assemblyCode) ? res.assemblyBuild.assemblyCode :'',
			dahao:isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.maxCode) ? res.assemblyBuild.maxCode :'',
			xiaohao:isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.minCode) ? res.assemblyBuild.minCode :'',
			zcfl: isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.assemblyType) ? res.assemblyBuild.assemblyType :'',
			chex:isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.vehicleModel) ? res.assemblyBuild.vehicleModel :'',
			pingp:isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.assemblyBrand) ? res.assemblyBuild.assemblyBrand :'',
			nianfen:isNotBlank(res) && isNotBlank(res.assemblyBuild) && isNotBlank(res.assemblyBuild.assemblyYear) ? res.assemblyBuild.assemblyYear :'',
			number: isNotBlank(res) && isNotBlank(res.number) ? res.number :'',
			money:isNotBlank(res) && isNotBlank(res.money) ? getPrice(res.money) :'',
			ck:isNotBlank(res) && isNotBlank(res.cpEntrepot) && isNotBlank(res.cpEntrepot.name) ? res.cpEntrepot.name :'',
			kw:isNotBlank(res) && isNotBlank(res.cpStorage) && isNotBlank(res.cpStorage.name) ? res.cpStorage.name :''
		})


	  }

	  onselectinkw = () => {
		const { dispatch } = this.props;
		this.setState({
		  selectinkwflag: true
		})
	  }

	  handleModalVisible = flag => {
		this.setState({
		  modalVisible: !!flag,
		});
	  };

	  produceTl = () => {
		Modal.confirm({
			title: '生成总成退料单',
			content: '确定生成总成退料单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.suretl(),
		});
	}

	suretl = () => {
		const { dispatch } = this.props
		const { location , confirmflag1} = this.state
		const that =this
        setTimeout(function(){
			that.setState({
			confirmflag1:true
			})
		},1000)

		if(confirmflag1){
		this.setState({
			confirmflag1:false
		})
		dispatch({
			type: 'cpOutProduct/out_material',
			payload: {
				id: location.query.id
			},
			callback: () => {
				this.setState({
					addfileList: [],
					fileList: [],
				});
				router.push(`/warehouse/process/cp_out_product_form?id=${location.query.id}`);
				// router.push('/warehouse/process/cp_out_product_list');
			}
		})
	}
	}

	onRevocation = (record) => {
		Modal.confirm({
			title: '撤销该总成出库单',
			content: '确定撤销该总成出库单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.onUndo(record),
		});
	}

	onUndo = (id) => {
		const { dispatch } = this.props;
		const {confirmflag , location}= this.state
		const that =this
        setTimeout(function(){
			that.setState({
			confirmflag:true
			})
		},1000)

		if(confirmflag){
		this.setState({
			confirmflag:false
		})
		if (isNotBlank(id)) {
			dispatch({
				type: 'cpRevocation/cpOutProduct_Revocation',
				payload: { id  },
				callback: () => {
					this.setState({
						addfileList: [],
						fileList: [],
					});
					router.push(`/warehouse/process/cp_out_product_form?id=${location.query.id}`);
					// router.push('/warehouse/process/cp_out_product_list');
				}
			})
		}
	}
	}

	handleSearchVisiblezc = (fieldsValue) => {
		this.setState({
		  searchVisiblezc: false,
		  historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

	handleSearchChangezc = () => {
		const {dispatch} = this.props
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
		  });
	this.setState({
	 searchVisiblezc: true,
		});
	}

	handleSearchAddzc = (fieldsValue) => {
	const { dispatch } = this.props;
	dispatch({
		  type: 'cpOutProduct/zcProuct_Statistics',
		  payload: {
			  ...this.state.zcsearch,
			genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
			pageSize: 10,
		    current: 1,
				 }
				})
			this.setState({
		  searchVisiblezc: false,
		  historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

	goprint = () => {
		const { location } = this.state
		const w = window.open('about:blank')
		w.location.href = `/#/zc_madeUp_OutStorage?id=${location.query.id}`
	}

	render() {
		const { fileList, previewVisible, previewImage, selectkwdata, selectkwflag, selectinkwflag ,modalVisible, 
			selectinkwdata, orderflag ,modalRecord ,searchVisiblezc ,updataname,updataflag,srcimg,srcimg1} = this.state;
		const {submitting1, submitting,zcProuctStatisticslist, cpOutProductGet, cpEntrepotList, cpStorageList ,cpAssemblyBuildList ,cpAssemblyBuildSearchList ,dispatch} = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 7 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 12 },
				md: { span: 10 },
			},
		};
		const submitFormLayout = {
			wrapperCol: {
				xs: { span: 24, offset: 0 },
				sm: { span: 10, offset: 7 },
			},
		};
		const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传照片</div>
  </div>
		);

       const that = this

		const parentSearchMethodszc = {
			handleSearchVisiblezc: this.handleSearchVisiblezc,
			handleSearchAddzc: this.handleSearchAddzc,
			cpAssemblyBuildSearchList,
			that
		  }
		const parentMethodskw = {
			handleModalVisiblekw: this.handleModalVisiblekw,
			selectkw: this.selectkw,
			cpEntrepotList,
			dispatch,
			that
		}
		const parentMethodsinkw = {
			handleModalVisibleinkw: this.handleModalVisibleinkw,
			selectinkw: this.selectinkw,
			cpStorageList,
			dispatch,
			that
		}
		const parentMethods = {
			handleAdd: this.handleAdd,
			handleModalVisible: this.handleModalVisible,
			selectuser: this.selectuser,
			cpAssemblyBuildList,
			zcProuctStatisticslist,
			dispatch,
			that,
			handleSearchChangezc:this.handleSearchChangezc
		  }
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
总成出库单
      </div>
      {isNotBlank(cpOutProductGet)&&isNotBlank(cpOutProductGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
        </span><img src={isNotBlank(srcimg)?getFullUrl(`/${srcimg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                    </div>}
      {isNotBlank(cpOutProductGet)&&isNotBlank(cpOutProductGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
        </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                           </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" bordered={false}>
          <Row>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='单据状态'>
                <Input
                  
disabled 
                  value={isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.orderStatus) ? (
								cpOutProductGet.orderStatus === 0 || cpOutProductGet.orderStatus === '0' ? '未处理' :(
								cpOutProductGet.orderStatus === 1 || cpOutProductGet.orderStatus === '1' ? '已处理': 
								cpOutProductGet.orderStatus === 2 || cpOutProductGet.orderStatus === '2' ? '关闭': '')):''}
                  style={cpOutProductGet.orderStatus === 0 || cpOutProductGet.orderStatus === '0' ? { color: '#f50' } :(
											  cpOutProductGet.orderStatus === 1 || cpOutProductGet.orderStatus === '1' ? { color: '#87d068' }:{color:'rgb(166, 156, 156)'}               
											  )}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                <Input disabled value={(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.client) && isNotBlank(cpOutProductGet.client.clientCpmpany) ? cpOutProductGet.client.clientCpmpany : '')} />
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                {getFieldDecorator('orderCode', {
								initialValue: isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.orderCode) ? cpOutProductGet.orderCode : '',     
								rules: [
									{
										required: false,   
										message: '请输入订单编号',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成型号'>
                {getFieldDecorator('assemblyBuildId', {
								initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyModel) ? modalRecord.assemblyBuild.assemblyModel :
									(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyModel) ? cpOutProductGet.assemblyBuild.assemblyModel : ''),     
								rules: [
									{
										required: false,   
										message: '请选择总成型号',
									},
								],
							})(<Input style={{width:'50%'}}  disabled />)}
                <Button disabled={orderflag} type='primary' style={{ marginLeft: 8 }} onClick={() => this.showTable()}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成编码'>
                {getFieldDecorator('purchaseCode', {
								initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.purchaseCode) ? modalRecord.purchaseCode :
								(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.purchaseCode) && isNotBlank(cpOutProductGet.purchaseCode) ? cpOutProductGet.purchaseCode : ''),     
								rules: [
									{
										required: false,   
										message: '总成编码',
									},
								],
							})
            (<Input
              disabled
              value={isNotBlank(modalRecord) && isNotBlank(modalRecord.purchaseCode) ? modalRecord.purchaseCode :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.purchaseCode) && isNotBlank(cpOutProductGet.purchaseCode) ? cpOutProductGet.purchaseCode : '')}
            />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
			  {getFieldDecorator('ywxm', {
				  initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.project) ? modalRecord.assemblyBuild.project :
				  (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.project) ? cpOutProductGet.assemblyBuild.project : ''),     
				  rules: [
					  {
						  required: false,   
						  message: '业务项目',
					  },
				  ],
			  })
                (<Input
                  disabled
					value={isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.project) ? modalRecord.assemblyBuild.project :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.project) ? cpOutProductGet.assemblyBuild.project : '')}
				/>
				)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成号'>
			  {getFieldDecorator('zch', {
				    initialValue: isNotBlank(modalRecord)  && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyCode) ? modalRecord.assemblyBuild.assemblyCode :
					(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyCode) ? cpOutProductGet.assemblyBuild.assemblyCode : ''),     
					rules: [
						{
							required: false,   
							message: '总成号',
						},
					],
			  })
                (
                <Input
                  disabled
value={isNotBlank(modalRecord)  && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyCode) ? modalRecord.assemblyBuild.assemblyCode :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyCode) ? cpOutProductGet.assemblyBuild.assemblyCode : '')}
                />
				)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='大号'>
			  {getFieldDecorator('dahao', {
				  initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.maxCode) ? modalRecord.assemblyBuild.maxCode :
				  (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.maxCode) ? cpOutProductGet.assemblyBuild.maxCode : ''),     
				  rules: [
					  {
						  required: false,   
						  message: '大号',
					  },
				  ],
			  })
                (
                <Input
                  disabled
value={isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.maxCode) ? modalRecord.assemblyBuild.maxCode :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.maxCode) ? cpOutProductGet.assemblyBuild.maxCode : '')}
                />
				)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='小号'>
			  {getFieldDecorator('xiaohao', {
				   initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.minCode) ? modalRecord.assemblyBuild.minCode :
				   (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.minCode) ? cpOutProductGet.assemblyBuild.minCode : ''),     
				   rules: [
					   {
						   required: false,   
						   message: '小号',
					   },
				   ],
			  })
                (
                <Input
                  disabled
value={isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.minCode) ? modalRecord.assemblyBuild.minCode :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.minCode) ? cpOutProductGet.assemblyBuild.minCode : '')}
                />
				)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成分类'>
			  {getFieldDecorator('zcfl', {
				   initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyType) ? modalRecord.assemblyBuild.assemblyType :
				   (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyType) ? cpOutProductGet.assemblyBuild.assemblyType : ''),     
				   rules: [
					   {
						   required: false,   
						   message: '总成分类',
					   },
				   ],
			  })
                ( 
                <Input
                  disabled
value={isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyType) ? modalRecord.assemblyBuild.assemblyType :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyType) ? cpOutProductGet.assemblyBuild.assemblyType : '')}
                />
				)}
			  </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型'>
			  {getFieldDecorator('chex', {
				   initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.vehicleModel) ? modalRecord.assemblyBuild.vehicleModel :
				   (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.vehicleModel) ? cpOutProductGet.assemblyBuild.vehicleModel : ''),     
				   rules: [
					   {
						   required: false,   
						   message: '车型',
					   },
				   ],
			  })
                (  
                <Input
                  disabled
value={isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.vehicleModel) ? modalRecord.assemblyBuild.vehicleModel :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.vehicleModel) ? cpOutProductGet.assemblyBuild.vehicleModel : '')}
                />
				)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
			  {getFieldDecorator('pingp', {
				   initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyBrand) ? modalRecord.assemblyBuild.assemblyBrand :
				   (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyBrand) ? cpOutProductGet.assemblyBuild.assemblyBrand : ''),     
				   rules: [
					   {
						   required: false,   
						   message: '品牌',
					   },
				   ],
			  })
                (  
                <Input
                  disabled
value={isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyBrand) ? modalRecord.assemblyBuild.assemblyBrand :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyBrand) ? cpOutProductGet.assemblyBuild.assemblyBrand : '')}
                />
				)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
			  {getFieldDecorator('nianfen', {
				   initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyYear) ? modalRecord.assemblyBuild.assemblyYear :
				   (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyYear) ? cpOutProductGet.assemblyBuild.assemblyYear : ''),     
				   rules: [
					   {
						   required: false,   
						   message: '年份',
					   },
				   ],
			  })
                ( 
                <Input
                  disabled
value={isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBuild) && isNotBlank(modalRecord.assemblyBuild.assemblyYear) ? modalRecord.assemblyBuild.assemblyYear :
              (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyYear) ? cpOutProductGet.assemblyBuild.assemblyYear : '')}
                />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='数量'>
                {getFieldDecorator('number', {
								initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? modalRecord.number :
								(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.number) ? cpOutProductGet.number : ''),     
								rules: [
									{
										required: false,   
										message: '请输入数量',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='金额'>
                {getFieldDecorator('money', {
								initialValue:isNotBlank(modalRecord) && isNotBlank(modalRecord.money) ? getPrice(modalRecord.money) :
									(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.money) ?getPrice(cpOutProductGet.money) : ''),     
								rules: [
									{
										required: false,   
										message: '请输入数量',
									},
								],
							})(
  <Input
    disabled
    
    value={isNotBlank(modalRecord) && isNotBlank(modalRecord.money) ? getPrice(modalRecord.money) :
								(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.money) ?getPrice(cpOutProductGet.money) : '')}
  />
							)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='仓库'>
			  {getFieldDecorator('ck', {
				   initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.cpEntrepot) && isNotBlank(modalRecord.cpEntrepot.name) ? modalRecord.cpEntrepot.name :
				   (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.cpEntrepot)&& isNotBlank(cpOutProductGet.cpEntrepot.name)  ?cpOutProductGet.cpEntrepot.name : ''),     
				   rules: [
					   {
						   required: false,   
						   message: '仓库',
					   },
				   ],
			  })
                (
                <Input
                  style={{width:'100%'}}

disabled 
                  value={isNotBlank(modalRecord) && isNotBlank(modalRecord.cpEntrepot) && isNotBlank(modalRecord.cpEntrepot.name) ? modalRecord.cpEntrepot.name :
									(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.cpEntrepot)&& isNotBlank(cpOutProductGet.cpEntrepot.name)  ?cpOutProductGet.cpEntrepot.name : '')}
                />
				  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='库位'>
			  {getFieldDecorator('kw', {
				   initialValue:isNotBlank(modalRecord) && isNotBlank(modalRecord.cpStorage) && isNotBlank(modalRecord.cpStorage.name) ? modalRecord.cpStorage.name :
				   (isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.storage)&& isNotBlank(cpOutProductGet.storage.name)  ?cpOutProductGet.storage.name : ''),     
				   rules: [
					   {
						   required: false,   
						   message: '库位',
					   },
				   ],
			  })
                (
                <Input
                  style={{width:'100%'}}

disabled 
                  value={isNotBlank(modalRecord) && isNotBlank(modalRecord.cpStorage) && isNotBlank(modalRecord.cpStorage.name) ? modalRecord.cpStorage.name :
								(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.storage)&& isNotBlank(cpOutProductGet.storage.name)  ?cpOutProductGet.storage.name : '')}
                />
				  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='评估类型'>
                {getFieldDecorator('assessType', {
								initialValue: isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assessType) ? cpOutProductGet.assessType : '',     
								rules: [
									{
										required: false,   
										message: '请输入评估类型',
										max: 255,
									},
								],
							})(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='出库类型'>
                {getFieldDecorator('zcStirageType', {
								initialValue: isNotBlank(cpOutProductGet.type)&&cpOutProductGet.type==7?'2f42f460-679e-4481-8c96-455dcd658be4':
								(isNotBlank(cpOutProductGet.type)&&cpOutProductGet.type==8)?'fe972691-5b3f-4178-8446-c13cb2de5d56':
								(isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.zcStirageType) ? cpOutProductGet.zcStirageType : ''),     
								rules: [
									{
										required: false,   
										message: '请输入出库类型',
										max: 255,
									},
								],
							})(<Select
  allowClear
  style={{ width: '100%' }}
  disabled={orderflag}
							>
  {
								  isNotBlank(this.state.zc_stirage_type) && this.state.zc_stirage_type.length > 0 && this.state.zc_stirage_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
								}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                {getFieldDecorator('remarks', {
								initialValue: isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.remarks) ? cpOutProductGet.remarks : '',     
								rules: [
									{
										required: false,
										message: '请输入备注信息',
									},
								],
							})(
  <TextArea
    disabled={orderflag&&updataflag}
    style={{ minHeight: 32 }}
    
    rows={2}
  />
							)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 , textAlign: 'center'}}>
		  {isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.id) &&
          <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
									打印
          </Button>}
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
						<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
	}
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct')[0].children.filter(item=>item.name=='修改')
.length>0&&
<span>
  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} loading={submitting1} disabled={orderflag&&updataflag}>
								保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1} disabled={orderflag&&updataflag}>
								提交
  </Button>
  {
								isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.orderStatus) && (cpOutProductGet.orderStatus === 1 || cpOutProductGet.orderStatus === '1') ?
  <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpOutProductGet.id)} loading={submitting1}>
										撤销
  </Button> : null
							}
</span>}
            <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
			返回
            </Button>
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutProduct')[0].children.filter(item=>item.name=='修改')
.length>0&&
				  <Button style={{ marginLeft: 8 }} onClick={() => this.produceTl()} disabled={!orderflag || cpOutProductGet.isMaterial == 1}>
  {cpOutProductGet.isMaterial == 1 ? '已退料' : '退料'}
</Button>
	}
          </FormItem>
        </Card>
      </Form>
    </Card>
    <SearchFormzc {...parentSearchMethodszc} searchVisiblezc={searchVisiblezc} />
    <CreateForm {...parentMethods} modalVisible={modalVisible} />
    <CreateForminkw {...parentMethodsinkw} selectinkwflag={selectinkwflag} />
    <CreateFormkw {...parentMethodskw} selectkwflag={selectkwflag} />
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  </PageHeaderWrapper>
		);
	}
}
export default CpOutProductForm;
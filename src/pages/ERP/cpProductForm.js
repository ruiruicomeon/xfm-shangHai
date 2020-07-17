import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Select,
	Button,
	Card,
	InputNumber,
	Radio,
	message,
	Icon,
	Upload,
	Modal,
	TreeSelect,
	Col, Row, Popconfirm,
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpProductForm.less';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import StandardEditTable from '@/components/StandardEditTable';
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
class SearchFormgys extends PureComponent {
	okHandle = () => {
		const { form, handleSearchAddgys } = this.props;
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			handleSearchAddgys(fieldsValue);
		});
	};

	handleSearchVisiblegysin = () => {
		const { form, handleSearchVisiblegys } = this.props;
		form.validateFields((err, fieldsValue) => {
			handleSearchVisiblegys(fieldsValue);
		});
	  };

	render() {
		const {
			searchVisiblegys,
			form: { getFieldDecorator },
			handleSearchVisiblegys,
			CpSupplierSearchList,
		} = this.props;
		return (
  <Modal
    width={860}
    title="多字段动态过滤"
    visible={searchVisiblegys}
    onCancel={() => this.handleSearchVisiblegysin()}
    afterClose={() => this.handleSearchVisiblegysin()}
    onOk={() => this.okHandle()}
  >
    <div>
      {getFieldDecorator('genTableColumn', {
						initialValue: [],
					})(<SearchTableList searchList={CpSupplierSearchList} />)}
    </div>
  </Modal>
		);
	}
}
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
			inputType: 'text',
			align: 'center' ,   
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
			align: 'center' ,  
			inputType: 'text',   
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
	const { handleModalVisibleinkw, cpStorageList, selectinkwflag, selectinkw ,dispatch ,form 
		,form: { getFieldDecorator } ,that} = props;
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
			width: 100,          
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

		  that.setState({
			kwsearch:values
		  })

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
		// form.resetFields();
		// that.setState({
		// 	kwsearch:{}
		// })
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
			...that.state.kwsearch,
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

	const handleModalVisibleinkwin = ()=>{
		form.resetFields();
		that.setState({
			kwsearch:{}
		})
		handleModalVisibleinkw()
	}

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
const CreateFormgys = Form.create()(props => {
	const { handleModalVisiblegys, cpSupplierList, selectgysflag, selectgys ,dispatch,form,
		handleSearchChangegys ,that} = props;
	const { getFieldDecorator } = form
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center' ,
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectgys(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '主编号',        
			dataIndex: 'id',
			align: 'center' ,  
			inputType: 'text',   
			width: 150,          
			editable: false,      
		},
		{
			title: '供应商类型',        
			dataIndex: 'type',   
			inputType: 'text', 
			align: 'center' ,  
			width: 100,          
			editable: true,      
		},
		{
			title: '名称',        
			dataIndex: 'name',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '电话',        
			dataIndex: 'phone',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '传真',        
			dataIndex: 'fax', 
			align: 'center' ,  
			inputType: 'text',   
			width: 150,          
			editable: true,      
		},
		{
			title: '联系人',        
			dataIndex: 'linkman',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '所属分公司',        
			dataIndex: 'companyName',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '地址',        
			dataIndex: 'address',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '经营类型',        
			dataIndex: 'runType',   
			inputType: 'text', 
			align: 'center' ,  
			width: 100,          
			editable: true,      
		},
		{
			title: '绑定集团',        
			dataIndex: 'bindingGroup',   
			inputType: 'text', 
			align: 'center' ,  
			width: 100,          
			editable: true,      
		},
		{
			title: '创建者',        
			dataIndex: 'createBy.name',   
			inputType: 'text', 
			align: 'center' ,  
			width: 100,          
			editable: false,      
		},
		{
			title: '创建时间',
			dataIndex: 'createDate',
			editable: false,
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
	const handleFormReset = () => {
		form.resetFields();
		that.setState({
			gyssearch:{}
		})
		dispatch({
		  type: 'cpSupplier/cpSupplier_List',
		  payload: {
			pageSize: 10,
			genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[],
			current: 1,
			status: 0
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
			...that.state.gyssearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
			genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[],
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpSupplier/cpSupplier_List',
			payload: params,
		});
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
			gyssearch:values
		  })

		  dispatch({
			type: 'cpSupplier/cpSupplier_List',
			payload: {
			  ...values,
			  pageSize: 10,
			  genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[],
			  current: 1,
			  status: 0
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

		  const handleModalVisiblegysin=()=>{
			form.resetFields();
			that.setState({
				gyssearch:{}
			})

			handleModalVisiblegys()
		  }


	return (
  <Modal
    title='选择供应商'
    visible={selectgysflag}
    onCancel={() => handleModalVisiblegys()}
    width='80%'
		>
    <Form onSubmit={handleSearch}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="名称">
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
            <a style={{ marginLeft: 8 }} onClick={handleSearchChangegys}>
         过滤其他 <Icon type="down" />
            </a>
          </span>
        </Col>
      </Row>
    </Form>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpSupplierList}
      columns={columnskh}
    />
  </Modal>
	);
});
@connect(({ cpProduct, loading, cpSupplier, cpEntrepot, cpStorage }) => ({
	...cpProduct,
	...cpSupplier,
	...cpEntrepot,
	...cpStorage,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpProduct/cpProduct_Add'],
	submitting2: loading.effects['cpupdata/cpProduct_update'],
}))
@Form.create()
class CpProductForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			selectgysdata: [],
			selectinkwdata: [],
			selectkwdata: [],
			selectgysflag: false,
			selectkwflag: false,
			selectinkwflag: false,
			orderflag: false,
			updataflag:true,
			updataname:'取消锁定',
			confirmflag :true,
			confirmflag1 :true,
			location: getLocation()
		}
	}

	componentDidMount() {
		console.log('componentDidMount')
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpProduct/cpProduct_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (
						res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
						||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct').length>0
						&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct')[0].children.filter(item=>item.name=='修改')
						.length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
					dispatch({
						type: 'sysarea/getFlatCode',
						payload:{
						id:location.query.id,
						type:'ZCRK'
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
						id:isNotBlank(res.data)&&isNotBlank(res.data.zcPurchaseCode)?res.data.zcPurchaseCode:'',
						type:'ZCRK'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg1:imgres
						})
						}
						})
					this.props.form.setFieldsValue({
						ck: isNotBlank(res.data) && isNotBlank(res.data.cpEntrepot) && isNotBlank(res.data.cpEntrepot.name) ? res.data.cpEntrepot.name : '',
						kw: isNotBlank(res.data) && isNotBlank(res.data.storage) && isNotBlank(res.data.storage.name) ? res.data.storage.name : ''
					});
				}
			});
    }
    
    dispatch({
			type: 'cpSupplier/cpSupplier_List',
			payload: {
				pageSize: 10,
				genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
				status: 0
			}
		})
		dispatch({
			type: 'cpSupplier/CpSupplier_SearchList',
			payload: {
			  pageSize: 10,
			}
		  });

    dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
			payload: {
				current: 1,
				pageSize: 10
			}
		})

		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'purchaseType',
			},
			callback: data => {
				this.setState({
					purchaseType: data
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
					make_need: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'oils_need',
			},
			callback: data => {
				this.setState({
					oils_need: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'quality_need',
			},
			callback: data => {
				this.setState({
					quality_need: data
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
					del_flag: data
				})
			}
		});
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpProduct/clear',
		});
	}

	handleSubmit = e => {
		const { dispatch, form, cpProductGet } = this.props;
		const { addfileList, location, selectinkwdata, selectkwdata,selectgysdata ,updataflag} = this.state;
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
				value.supplier = {};
       		    value.supplier.id =isNotBlank(selectgysdata)  && isNotBlank(selectgysdata.id) ? selectgysdata.id :
				   (isNotBlank(cpProductGet) && isNotBlank(cpProductGet.supplier) && isNotBlank(cpProductGet.supplier.id) ? cpProductGet.supplier.id :'')
				value.cpEntrepot = {}
				value.cpEntrepot.id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id : (isNotBlank(cpProductGet) && isNotBlank(cpProductGet.cpEntrepot)
				&& isNotBlank(cpProductGet.cpEntrepot.id) ? cpProductGet.cpEntrepot.id : '')
				value.storage = {}
				value.storage.id = isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id) ? selectinkwdata.id : (isNotBlank(cpProductGet) && isNotBlank(cpProductGet.storage)
					&& isNotBlank(cpProductGet.storage.id) ? cpProductGet.storage.id : '')
				value.orderStatus = 1
				if(updataflag){
				dispatch({
					type: 'cpProduct/cpProduct_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						// router.push('/warehouse/process/cp_product_list');
						router.push(`/warehouse/process/cp_product_form?id=${location.query.id}`);
					}
				})
			}else{
				dispatch({
					type: 'cpupdata/cpProduct_update',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/warehouse/process/cp_product_form?id=${location.query.id}`);
						// router.push('/warehouse/process/cp_product_list');
					}
				})
			}
			}
		});
	};

	onsave = () => {
		const { dispatch, form, cpProductGet } = this.props;
		const { addfileList, location, selectinkwdata,selectgysdata, selectkwdata,updataflag } = this.state;
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
				value.supplier = {};
				value.supplier.id =isNotBlank(selectgysdata)  && isNotBlank(selectgysdata.id) ? selectgysdata.id :
				(isNotBlank(cpProductGet) && isNotBlank(cpProductGet.supplier) && isNotBlank(cpProductGet.supplier.id) ? cpProductGet.supplier.id :'')
				value.cpEntrepot = {}
				value.cpEntrepot.Id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id : (isNotBlank(cpProductGet) && isNotBlank(cpProductGet.cpEntrepot)
				  && isNotBlank(cpProductGet.cpEntrepot.id) ? cpProductGet.cpEntrepot.id : '')
				value.storage = {}
				value.storage.id = isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id) ? selectinkwdata.id : (isNotBlank(cpProductGet) && isNotBlank(cpProductGet.storage)
					&& isNotBlank(cpProductGet.storage.id) ? cpProductGet.storage.id : '')
					if(updataflag){
					value.orderStatus = 0
				dispatch({
					type: 'cpProduct/cpProduct_Add',
					payload: { ...value },
					callback: () => {
					}
				})
			}else{
				value.orderStatus = 1
				dispatch({
					type: 'cpupdata/cpProduct_update',
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
	}

	onupdata = ()=>{
		const {location ,updataflag } = this.state
		if(updataflag){
				this.setState({
			updataflag:false,
			updataname:'锁定'
			})
		}else{
			router.push(`/warehouse/process/cp_product_form?id=${location.query.id}`);
		}
	}

	onCancelCancel = () => {
		router.push('/warehouse/process/cp_product_list');
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

	selectgys = (record) => {
		this.setState({
			selectgysdata: record,
			selectgysflag: false
		})
	}

	handleModalVisiblegys = flag => {
		this.setState({
			selectgysflag: !!flag
		});
	};

	onselectgys = () => {
				this.setState({ selectgysflag: true })
	}

	selectinkw = (record) => {
		const {cpProductGet} = this.props
		this.props.form.setFieldsValue({
			kw: isNotBlank(record) && isNotBlank(record.name) ? record.name :
			(isNotBlank(cpProductGet) && isNotBlank(cpProductGet.storage) && isNotBlank(cpProductGet.storage.name) ? cpProductGet.storage.name : '')
		  });
		this.setState({
			selectinkwdata: record,
			selectinkwflag: false
		})
	}

	selectkw = (record) => {
		const { dispatch ,cpProductGet ,form } = this.props
		const {location ,selectkwdata,selectinkwdata} = this.state
		dispatch({
			type: 'cpStorage/cpStorage_List',
			payload: {
				pageSize: 10,
				pjEntrepotId: record.id
			}
		});
		this.props.form.setFieldsValue({
			ck: isNotBlank(record) && isNotBlank(record.name) ? record.name :
			(isNotBlank(cpProductGet) && isNotBlank(cpProductGet.storage) && isNotBlank(cpProductGet.storage.entrepotName) ? cpProductGet.storage.entrepotName : '')
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
	    value.orderStatus = -1
		dispatch({
			type: 'cpProduct/cpProduct_save_Add',
			payload: { ...value },
			callback: () => {
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
		this.setState({
			selectkwflag: true
		})
	}

	showKwtable = () => {
		const { dispatch } = this.props
		this.setState({
			selectinkwflag: true
		});
	}

	produceTh = () => {
		Modal.confirm({
			title: '生成总成退货单',
			content: '确定生成总成退货单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.sureTh(),
		});
	}

	sureTh = () => {
		const { dispatch } = this.props
		const { location , confirmflag1 } = this.state
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
			type: 'cpProduct/sales_CpProduct',
			payload: {
				id: location.query.id
			},
			callback: () => {
				this.setState({
					addfileList: [],
					fileList: [],
				});
				router.push(`/warehouse/process/cp_product_form?id=${location.query.id}`);
				// router.push('/warehouse/process/cp_product_list');
			}
		})
	}
	}

	onRevocation = (record) => {
		Modal.confirm({
			title: '撤销该总成入库单',
			content: '确定撤销该总成入库单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.onUndo(record),
		});
	}

	onUndo = (id) => {
		const { dispatch } = this.props;
		const {confirmflag ,location}= this.state
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
				type: 'cpRevocation/cpProduct_Revocation',
				payload: { id  },
				callback: () => {
					this.setState({
						addfileList: [],
						fileList: [],
					});
					router.push(`/warehouse/process/cp_product_form?id=${location.query.id}`);
					// router.push('/warehouse/process/cp_product_list');
				}
			})
		}
	}
	}

	handleSearchVisiblegys = (fieldsValue) => {
		this.setState({
			searchVisiblegys: false,
			historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	};

	handleSearchChangegys = () => {
		this.setState({
			searchVisiblegys: true,
		});
	};

	handleSearchAddgys = (fieldsValue) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'cpSupplier/cpSupplier_List',
			payload: {
				...this.state.gyssearch,
				genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
				pageSize: 10,
        current: 1,
        status: 0
			},
		});
		this.setState({
			searchVisiblegys: false,
			historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

	goprint = () => {
		const { location } = this.state
		const w = window.open('about:blank')
		w.location.href = `/#/zc_madeUp_PutStorage?id=${location.query.id}`
	}

	render() {
		const { fileList, previewVisible, previewImage, selectgysflag, selectgysdata, selectkwdata, selectkwflag, selectinkwflag, 
			selectinkwdata, orderflag ,searchVisiblegys,updataflag,updataname,srcimg,srcimg1} = this.state;
		const {submitting1,submitting2, submitting, cpProductGet, cpSupplierList, cpEntrepotList, cpStorageList ,CpSupplierSearchList ,dispatch} = this.props;
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

		const parentSearchMethodsgys = {
			handleSearchVisiblegys: this.handleSearchVisiblegys,
			handleSearchAddgys: this.handleSearchAddgys,
            CpSupplierSearchList,
			searchVisiblegys,
			that
    }
		const parentMethodsgys = {
			handleAddgys: this.handleAddgys,
			handleModalVisiblegys: this.handleModalVisiblegys,
			selectgys: this.selectgys,
			dispatch,
			handleSearchChangegys:this.handleSearchChangegys,
			cpSupplierList,
			selectgysflag,
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
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
总成入库单
      </div>
      {isNotBlank(cpProductGet)&&isNotBlank(cpProductGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
        </span><img src={isNotBlank(srcimg)?getFullUrl(`/${srcimg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                              </div>}
      {isNotBlank(cpProductGet)&&isNotBlank(cpProductGet.zcPurchaseCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
        </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                          </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" bordered={false}>
          <Row>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='单号'>
                <Input  disabled value={isNotBlank(cpProductGet) && isNotBlank(cpProductGet.id) ? cpProductGet.id : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='单据状态'>
                <Input
                  
disabled 
                  value={isNotBlank(cpProductGet) && isNotBlank(cpProductGet.orderStatus) ? (
								cpProductGet.orderStatus === 0 || cpProductGet.orderStatus === '0' ? '未处理' :(
								cpProductGet.orderStatus === 1 || cpProductGet.orderStatus === '1' ? '已处理': 
								cpProductGet.orderStatus === 2 || cpProductGet.orderStatus === '2' ? '关闭': '')):''}
                  style={cpProductGet.orderStatus === 0 || cpProductGet.orderStatus === '0' ? { color: '#f50' } :(
															cpProductGet.orderStatus === 1 || cpProductGet.orderStatus === '1' ? { color: '#87d068' }:{color:'rgb(166, 156, 156)'}               
															)}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='采购单号'>
                <Input  disabled value={isNotBlank(cpProductGet) && isNotBlank(cpProductGet.zcPurchaseCode) ? cpProductGet.zcPurchaseCode : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='供应商' disabled>
                {getFieldDecorator('gys', {
								initialValue: isNotBlank(selectgysdata)  && isNotBlank(selectgysdata.name) ? selectgysdata.name :
									(isNotBlank(cpProductGet) && isNotBlank(cpProductGet.supplier) && isNotBlank(cpProductGet.supplier.name) ? cpProductGet.supplier.name :
									 (isNotBlank(cpProductGet)&&isNotBlank(cpProductGet.user)&&isNotBlank(cpProductGet.user.office)&&isNotBlank(cpProductGet.user.office.name)?cpProductGet.user.office.name:'')),     
								rules: [
									{
										required: false,   
										message: '请输入供应商',
									},
								],
							})(<Input style={{width:'50%'}}  disabled />)}
                <Button disabled={orderflag} type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgys} loading={submitting}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
                {getFieldDecorator('project', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.project) ? cpProductGet.assemblyBuild.project : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入业务项目',
					  },
					],
				  })(<Select
  disabled
  allowClear
  style={{ width: '100%' }}
  
				  >
  {
						isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
					}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成编码'>
                <Input  disabled value={isNotBlank(cpProductGet)&& isNotBlank(cpProductGet.purchaseCode) ? cpProductGet.purchaseCode : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成型号'>
                {getFieldDecorator('assemblyModel', {
					initialValue: isNotBlank(cpProductGet)&& isNotBlank(cpProductGet.assemblyBuild) && isNotBlank(cpProductGet.assemblyBuild.assemblyModel) ? cpProductGet.assemblyBuild.assemblyModel : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成型号',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成号'>
                {getFieldDecorator('assemblyCode', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.assemblyCode) ? cpProductGet.assemblyBuild.assemblyCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成号',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='大号'>
                {getFieldDecorator('maxCode', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.maxCode) ? cpProductGet.assemblyBuild.maxCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入大号',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='小号'>
                {getFieldDecorator('minCode', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.minCode) ? cpProductGet.assemblyBuild.minCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入小号',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成分类'>
                {getFieldDecorator('assemblyType', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.assemblyType) ? cpProductGet.assemblyBuild.assemblyType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成分类',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型'>
                {getFieldDecorator('vehicleModel', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.vehicleModel) ? cpProductGet.assemblyBuild.vehicleModel : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入车型',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
                {getFieldDecorator('assemblyBrand', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.assemblyBrand) ? cpProductGet.assemblyBuild.assemblyBrand : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入品牌',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                {getFieldDecorator('assemblyYear', {
					initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.assemblyYear) ? cpProductGet.assemblyBuild.assemblyYear : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入年份',
					  },
					],
				  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='开票类型'>
                {getFieldDecorator('makeNeed', {
								initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.makeNeed) ? cpProductGet.makeNeed : '',     
								rules: [
									{
										required: true,   
										message: '请输入开票类型',
										max: 255,
									},
								],
							})(<Select
  allowClear
  style={{ width: '100%' }}
  disabled={orderflag&&updataflag}
							>
  {
									isNotBlank(this.state.make_need) && this.state.make_need.length > 0 && this.state.make_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
								}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='仓库'>
                {getFieldDecorator('ck', {
								rules: [
									{
										required: true,   
										message: '请选择仓库',
										max: 255,
									},
								],
							})(<Input style={{width:'50%'}}  disabled />)}
                <Button disabled={orderflag} type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkw} loading={submitting}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='库位'>
                {getFieldDecorator('kw', {
								rules: [
									{
										required: true,   
										message: '请选择库位',
										max: 255,
									},
								],
							})(<Input style={{width:'50%'}}  disabled />)}
                <Button disabled={orderflag} type="primary" style={{ marginLeft: '8px' }} onClick={this.showKwtable} loading={submitting}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='数量'>
                {getFieldDecorator('number', {
								initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.number) ? cpProductGet.number : '',     
								rules: [
									{
										required: true,   
										message: '请输入数量',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='金额'>
                <Input
                  
disabled 
                  value={isNotBlank(cpProductGet) && isNotBlank(cpProductGet.money) ?getPrice(cpProductGet.money) : ''}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='供应商销售订单号'>
                {getFieldDecorator('supplierCode', {
								initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.supplierCode) ? cpProductGet.supplierCode : '',     
								rules: [
									{
										required: true,   
										message: '请输入供应商销售订单号',
										max: 255,
									},
								],
							})(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>	
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='质量标准'>
                {getFieldDecorator('quality', {
								initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.quality) ? cpProductGet.quality : '',     
								rules: [
									{
										required: true,   
										message: '请输入质量标准',
										max: 255,
									},
								],
							})(<Select
  allowClear
  style={{ width: '100%' }}
  disabled={orderflag&&updataflag}
							>
  {
									isNotBlank(this.state.quality_need) && this.state.quality_need.length > 0 && this.state.quality_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
								}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='油品情况'>
                {getFieldDecorator('oils', {
								initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.oils) ? cpProductGet.oils : '',     
								rules: [
									{
										required: true,   
										message: '请输入油品情况',
										max: 255,
									},
								],
							})(<Select
  allowClear
  style={{ width: '100%' }}
  disabled={orderflag&&updataflag}
							>
  {
									isNotBlank(this.state.oils_need) && this.state.oils_need.length > 0 && this.state.oils_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
								}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='测试情况说明' className="allinputstyle">
                {getFieldDecorator('test', {
								initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.test) ? cpProductGet.test : '',     
								rules: [
									{
										required: true,   
										message: '请输入测试情况说明',
										max: 255,
									},
								],
							})(<TextArea  disabled={orderflag&&updataflag} rows={2} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
								initialValue: isNotBlank(cpProductGet) && isNotBlank(cpProductGet.remarks) ? cpProductGet.remarks : '',     
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
		  {isNotBlank(cpProductGet) && isNotBlank(cpProductGet.id) &&
          <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
									打印
          </Button>}
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
						<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
	}
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct')[0].children.filter(item=>item.name=='修改')
.length>0&&<span>
  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} loading={submitting1||submitting2} disabled={orderflag&&updataflag}>
								保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1||submitting2} disabled={orderflag&&updataflag}>
								提交
  </Button>
  {
								isNotBlank(cpProductGet) && isNotBlank(cpProductGet.orderStatus) && (cpProductGet.orderStatus === 1 || cpProductGet.orderStatus === '1') ?
  <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpProductGet.id)} loading={submitting1||submitting2}>
										撤销
  </Button> : null
							}
</span>
							}
            <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
			返回
            </Button>
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProduct')[0].children.filter(item=>item.name=='修改')
.length>0&&
							<Button style={{ marginLeft: 8 }} loading={submitting1||submitting2} onClick={() => this.produceTh()} disabled={!orderflag || cpProductGet.isSales == 1}>
  {cpProductGet.isSales == 1 ? '已退货' : '退货'}
							</Button>
	}
          </FormItem>
        </Card>
      </Form>
    </Card>
    <SearchFormgys {...parentSearchMethodsgys} searchVisiblegys={searchVisiblegys} />
    <CreateForminkw {...parentMethodsinkw} selectinkwflag={selectinkwflag} />
    <CreateFormkw {...parentMethodskw} selectkwflag={selectkwflag} />
    <CreateFormgys {...parentMethodsgys} selectgysflag={selectgysflag} />
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  </PageHeaderWrapper>
		);
	}
}
export default CpProductForm;
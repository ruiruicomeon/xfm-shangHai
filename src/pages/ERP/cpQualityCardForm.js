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
	DatePicker,
	Row, Col
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchTableList from '@/components/SearchTableList';
import StandardTable from '@/components/StandardTable';
import styles from './CpQualityCardForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const CreateFormzc = Form.create()(props => {
	const { handleModalVisiblezc, selectzcflag, selectzc, cpAssemblyBuildList, form, handleSearchChangezc, dispatch,that } = props;
	const { getFieldDecorator } = form
	const columnzcs = [
		{
			title: '操作',
			width: 100,
			align: 'center',
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectzc(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '业务项目',        
			dataIndex: 'project',   
			inputType: 'text',   
			width: 100,
			align: 'center',         
			editable: true,      
		},
		{
			title: '总成型号',        
			dataIndex: 'assemblyModel',   
			inputType: 'text',   
			width: 150,
			align: 'center',       
			editable: true,      
		},
		{
			title: '总成号',        
			dataIndex: 'assemblyCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '大号',        
			dataIndex: 'maxCode',   
			inputType: 'text',   
			width: 150,
			align: 'center',       
			editable: true,      
		},
		{
			title: '小号',        
			dataIndex: 'minCode',   
			inputType: 'text',   
			width: 150,
			align: 'center',        
			editable: true,      
		},
		{
			title: '总成分类',        
			dataIndex: 'assemblyType',   
			inputType: 'text',   
			width: 100,
			align: 'center',     
			editable: true     
		},
		{
			title: '类型编码',        
			dataIndex: 'lxCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',          
			editable: true,      
		},
		{
			title: '分类编码',        
			dataIndex: 'flCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '技术参数',        
			dataIndex: 'technicalParameter',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '车型',        
			dataIndex: 'vehicleModel',   
			inputType: 'text',   
			width: 150,
			align: 'center',         
			editable: true,      
		},
		{
			title: '品牌',        
			dataIndex: 'assemblyBrand',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '年份',        
			dataIndex: 'assemblyYear',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '品牌编码',        
			dataIndex: 'brandCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '一级编码型号',        
			dataIndex: 'oneCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '绑定系列数量',        
			dataIndex: 'bindingNumber',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '原厂编码',        
			dataIndex: 'originalCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '再制造编码',        
			dataIndex: 'makeCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '提成类型',        
			dataIndex: 'pushType',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
			inputType: 'dateTime',
			width: 100,
			align: 'center',
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
			align: 'center',         
			editable: true,      
		},
	];
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
				if (values[item] instanceof moment) {
					values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
				}
				return item;
			});

			that.setState({
				zcsearch:values
			})

			dispatch({
				type: 'cpAssemblyBuild/cpAssemblyBuild_List',
				payload: {
					...values,
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
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
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
			...that.state.zcsearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: params,
		});
	};

	const handleModalVisiblezcin = ()=>{
		form.resetFields();
		that.setState({
			zcsearch:{}
		})
		handleModalVisiblezc()
	}


	return (
  <Modal
    title='选择总成'
    visible={selectzcflag}
    onCancel={() => handleModalVisiblezcin()}
    width='80%'
		>
    <Form onSubmit={handleSearch}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="业务项目">
            {getFieldDecorator('project', {
								initialValue: ''
							})(
  <Input  />
							)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="总成型号">
            {getFieldDecorator('assemblyModel', {
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
            <a style={{ marginLeft: 8 }} onClick={handleSearchChangezc}>
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
      data={cpAssemblyBuildList}
      columns={columnzcs}
    />
  </Modal>
	);
});
const CreateFormkh = Form.create()(props => {
	const { handleModalVisiblekh, cpClientList, selectkhflag, selectcustomer, handleSearchChange, form, dispatch ,that} = props;
	const { getFieldDecorator } = form
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center',
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectcustomer(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '客户',        
			dataIndex: 'clientCpmpany',   
			inputType: 'text',
			align: 'center',    
			width: 240,          
			editable: true,      
		},
		{
			title: '客户编码',        
			dataIndex: 'code',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '联系人',        
			dataIndex: 'name',   
			inputType: 'text',   
			width: 150,
			align: 'center',      
			editable: true,      
		},
		{
			title: '客户分类',        
			dataIndex: 'classify',   
			inputType: 'text',   
			width: 100,
			align: 'center',     
			editable: true,      
		},
		{
			title: '客户级别',        
			dataIndex: 'level',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '联系地址',        
			dataIndex: 'address',   
			inputType: 'text',   
			width: 100,
			align: 'center',     
			editable: true,      
		},
		{
			title: '邮箱',        
			dataIndex: 'email',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '移动电话',        
			dataIndex: 'phone',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '电话',        
			dataIndex: 'tel',   
			inputType: 'text',   
			width: 100,
			align: 'center',         
			editable: true,      
		},
		{
			title: '传真',        
			dataIndex: 'fax',   
			inputType: 'text',   
			width: 100,
			align: 'center',         
			editable: true,      
		},
		{
			title: '税号',        
			dataIndex: 'dutyParagraph',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true,      
		},
		{
			title: '开户账号',        
			dataIndex: 'openNumber',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '开户银行',        
			dataIndex: 'openBank',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '开户地址',        
			dataIndex: 'openAddress',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '开户电话',        
			dataIndex: 'openTel',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '创建者',        
			dataIndex: 'user.name',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: false,      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
			inputType: 'dateTime',
			width: 100,
			align: 'center',
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
			align: 'center',       
			editable: true,      
		}
	];
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
				if (values[item] instanceof moment) {
					values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
				}
				return item;
			});

			that.setState({
				khsearch:values
			})

			dispatch({
				type: 'cpClient/cpClient_List',
				payload: {
					...values,
					pageSize: 10,
					current: 1,
				},
			});
		});
	};
	const handleFormReset = () => {
		form.resetFields();
		that.setState({
			khsearch:{}
		})
		dispatch({
			type: 'cpClient/cpClient_List',
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
			...that.state.khsearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: params,
		});
	};
	const handleModalkh = () => {
		form.resetFields();
		that.setState({
			khsearch:{}
		})
		handleModalVisiblekh()
	}



	return (
  <Modal
    title='选择客户'
    visible={selectkhflag}
    onCancel={() => handleModalkh()}
    width='80%'
		>
    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Form onSubmit={handleSearch}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="客户">
            {getFieldDecorator('clientCpmpany', {
								initialValue: ''
							})(
  <Input  />
							)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="联系人">
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
            <a style={{ marginLeft: 8 }} onClick={handleSearchChange}>
								过滤其他 <Icon type="down" />
            </a>
          </span>
        </Col>
      </Form>
    </Row>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpClientList}
      columns={columnskh}
    />
  </Modal>
	);
});
@connect(({ cpQualityCard, loading, cpClient, cpAssemblyBuild }) => ({
	...cpQualityCard,
	...cpClient,
	...cpAssemblyBuild,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpQualityCard/cpQualityCard_Add'],
}))
@Form.create()
class CpQualityCardForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			selectkhflag: false,
			selectzcflag: false,
			orderflag: false,
			location: getLocation()
		}
	}

	componentDidMount() {
		console.log('componentDidMount')
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpQualityCard/cpQualityCard_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2' || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cqd').length > 0
						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cqd')[0].children.filter(item => item.name == '修改').length == 0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
				}
			});
		}
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

	componentWillUpdate() {
		console.log('componentWillUpdate')
	}

	componentDidUpdate() {
		console.log('componentDidUpdate')
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpQualityCard/clear',
		});
	}

	onsave = () => {
		const { dispatch, form, cpQualityCardGet } = this.props;
		const { addfileList, location, selectkhdata, selectzcdata } = this.state;
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
				value.orderStatus = 0
				value.zbDate = moment(value.zbDate).format("YYYY-MM-DD")
				value.expireDate = moment(value.expireDate).format("YYYY-MM-DD")
				value.client = {}
				value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.client)) ? cpQualityCardGet.client.id : '')
				value.assemblyBuildId = {}
				value.assemblyBuildId.id = (isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id)) ? selectzcdata.id : ((isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.assemblyBuildId)) ? cpQualityCardGet.assemblyBuildId.id : '')
				dispatch({
					type: 'cpQualityCard/cpQualityCard_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
					}
				})
			}
		});
	};

	handleSubmit = e => {
		const { dispatch, form, cpQualityCardGet } = this.props;
		const { addfileList, location, selectkhdata, selectzcdata } = this.state;
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
				value.orderStatus = 1
				value.zbDate = moment(value.zbDate).format("YYYY-MM-DD")
				value.expireDate = moment(value.expireDate).format("YYYY-MM-DD")
				value.client = {}
				value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.client)) ? cpQualityCardGet.client.id : '')
				value.assemblyBuildId = {}
				value.assemblyBuildId.id = (isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id)) ? selectzcdata.id : ((isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.assemblyBuildId)) ? cpQualityCardGet.assemblyBuildId.id : '')
				dispatch({
					type: 'cpQualityCard/cpQualityCard_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/business/process/cp_quality_card_form?id=${location.query.id}`);
						// router.push('/business/process/cp_quality_card_list');
					}
				})
			}
		});
	};

	onCancelCancel = () => {
		router.push('/business/process/cp_quality_card_list');
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

	goprint = () => {
		const { location } = this.state
		const w = window.open('about:blank')
		w.location.href = `/#/cpQualityCardprint?id=${location.query.id}`
	}

	onselectkh = () => {
		const { dispatch } = this.props
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
				pageSize: 10,
			},
			callback: () => {
				this.setState({
					selectkhflag: true
				})
			}
		});
		dispatch({
			type: 'cpClient/cpClient_SearchList'
		})
	}

	handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
	};

	selectcustomer = (record) => {
		this.setState({
			selectkhdata: record,
			selectkhflag: false
		})
	}

	onselectzc = () => {
		const { dispatch } = this.props
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: {
				pageSize: 10,
			}, callback: () => {
				this.setState({
					selectzcflag: true
				})
			}
		});
	}

	handleModalVisiblezc = flag => {
		this.setState({
			selectzcflag: !!flag
		});
	};

	selectzc = (record) => {
		this.props.form.setFieldsValue({
			xh: isNotBlank(record) && isNotBlank(record.assemblyModel) ? record.assemblyModel : '',
		});
		this.setState({
			selectzcdata: record,
			selectzcflag: false
		})
	}

	handleSearchChangezc = () => {
		const { dispatch } = this.props
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
		});
		this.setState({
			searchVisiblezc: true,
		});
	}

	render() {
		const { fileList, previewVisible, previewImage, selectkhflag, selectzcflag, selectzcdata, selectkhdata, orderflag } = this.state;
		const {submitting1, submitting, cpQualityCardGet, cpClientList, cpAssemblyBuildList, dispatch } = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;

		const that =this

		const parentMethodskh = {
			handleAddkh: this.handleAddkh,
			handleModalVisiblekh: this.handleModalVisiblekh,
			selectcustomer: this.selectcustomer,
			cpClientList,
			handleSearchChange: this.handleSearchChange,
			dispatch,
			that
		}
		const parentMethodszc = {
			handleAddzc: this.handleAddzc,
			handleModalVisiblezc: this.handleModalVisiblezc,
			selectzc: this.selectzc,
			cpAssemblyBuildList,
			dispatch,
			handleSearchChangezc: this.handleSearchChangezc,
			that
		}
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
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
						质保卡
      </div>
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Row>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='状态'>
                {getFieldDecorator('orderStatus', {
								initialValue: isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.orderStatus) ? (
									cpQualityCardGet.orderStatus === 0 || cpQualityCardGet.orderStatus === '0' ? '未处理' : (
										cpQualityCardGet.orderStatus === 1 || cpQualityCardGet.orderStatus === '1' ? '已处理' :
											cpQualityCardGet.orderStatus === 2 || cpQualityCardGet.orderStatus === '2' ? '关闭' : '')) : '',     
								rules: [
									{
										required: false,   
										message: '请输入状态',
										max: 64,
									},
								],
							})(<Input
  
  disabled
  value={isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.orderStatus) ? (
									cpQualityCardGet.orderStatus === 0 || cpQualityCardGet.orderStatus === '0' ? '未处理' : (
										cpQualityCardGet.orderStatus === 1 || cpQualityCardGet.orderStatus === '1' ? '已处理' :
											cpQualityCardGet.orderStatus === 2 || cpQualityCardGet.orderStatus === '2' ? '关闭' : '')) : ''}
  style={cpQualityCardGet.orderStatus === 0 || cpQualityCardGet.orderStatus === '0' ? { color: '#f50' } : (
									cpQualityCardGet.orderStatus === 1 || cpQualityCardGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
								)}
							/>)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                {getFieldDecorator('orderCode', {
								initialValue: isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.orderCode) ? cpQualityCardGet.orderCode : '',     
								rules: [
									{
										required: false,   
										message: '请输入订单编号',
										max: 64,
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                {getFieldDecorator('clientId', {
								initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.clientCpmpany) ? selectkhdata.clientCpmpany
									: (isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.client) && isNotBlank(cpQualityCardGet.client.clientCpmpany) ? cpQualityCardGet.client.clientCpmpany : ''),     
								rules: [
									{
										required: false,   
										message: '请输入客户',
										max: 64,
									},
								],
							})(<Input style={{width:'50%'}}  disabled />)}
                <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting} disabled={orderflag}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成'>
                {getFieldDecorator('ab', {
								initialValue: isNotBlank(selectzcdata) && isNotBlank(selectzcdata.assemblyModel) ? selectzcdata.assemblyModel
									: (isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.assemblyBuildId) && isNotBlank(cpQualityCardGet.assemblyBuildId.assemblyModel) ? cpQualityCardGet.assemblyBuildId.assemblyModel : ''),    
								rules: [
									{
										required: false,   
										message: '请输入总成',
										max: 64,
									},
								],
							})(<Input style={{width:'50%'}}  disabled />)}
                <Button style={{ marginLeft: '8px' }} type="primary" onClick={this.onselectzc} loading={submitting} disabled={orderflag}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="质保开始时间">
                {getFieldDecorator('zbDate', {
								initialValue: isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.zbDate) ? moment(cpQualityCardGet.zbDate) : null,
							})(
  <DatePicker
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
    disabled={orderflag}
  />
							)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="质保到期时间">
                {getFieldDecorator('expireDate', {
								initialValue: isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.expireDate) ? moment(cpQualityCardGet.expireDate) : null,
							})(
  <DatePicker
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
    disabled={orderflag}
  />
							)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='AT质保范围'>
                {getFieldDecorator('atScope', {
								initialValue: isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.atScope) ? cpQualityCardGet.atScope : '',     
								rules: [
									{
										required: false,   
										message: '请输入AT质保范围',
										max: 255,
									},
								],
							})(<Input  disabled={orderflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='CVT质保范围'>
                {getFieldDecorator('cvtScope', {
								initialValue: isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.cvtScope) ? cpQualityCardGet.cvtScope : '',     
								rules: [
									{
										required: false,   
										message: '请输入CVT质保范围',
										max: 255,
									},
								],
							})(<Input  disabled={orderflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注" className="allinputstyle">
                {getFieldDecorator('remarks', {
								initialValue: isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.remarks) ? cpQualityCardGet.remarks : '',     
								rules: [
									{
										required: false,
										message: '请输入备注',
									},
								],
							})(
  <TextArea
    style={{ minHeight: 32 }}
    
    rows={2}
    disabled={orderflag}
  />
							)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 ,textAlign:'center'}}>
            <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
								打印
            </Button>
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cqd').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cqd')[0].children.filter(item => item.name == '修改').length > 0 &&
								<span>
  <Button type="primary" onClick={this.onsave} loading={submitting1}>
										保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1}>
										提交
  </Button>
								</span>
							}
            <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
								返回
            </Button>
          </FormItem>
        </Card>
      </Form>
    </Card>
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
    <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
    <CreateFormzc {...parentMethodszc} selectzcflag={selectzcflag} />
  </PageHeaderWrapper>
		);
	}
}
export default CpQualityCardForm;
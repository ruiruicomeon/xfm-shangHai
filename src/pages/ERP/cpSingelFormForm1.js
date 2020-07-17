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
	Row,
	Col,
	Modal,
	TreeSelect,
	Table,
	Divider,
	Popconfirm,
	DatePicker
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, setPrice, getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpOfferFormForm.less';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import stylessp from './style.less';
import StandardEditTable from '@/components/StandardEditTable';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
Object.keys(obj)
	.map(key => obj[key])
	.join(',');
const CreateForm = Form.create()(props => {
	const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator } } = props;
	const okHandle = () => {
		form.validateFields((err, fieldsValue) => {
			form.resetFields();
			const values = { ...fieldsValue };
			values.price = setPrice(values.price)
			handleAdd(values);
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
	return (
  <Modal
    title="新增明细"
    visible={modalVisible}
    onOk={okHandle}
    onCancel={() => handleModalVisible()}
		>
    <FormItem {...formItemLayout} label='名称'>
      {getFieldDecorator('name', {
					initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',     
					rules: [
						{
							required: false,   
							message: '请输入名称',
							max: 255,
						},
					],
				})(<Input  />)}
    </FormItem>
    <FormItem {...formItemLayout} label='单价'>
      {getFieldDecorator('price', {
					initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.code) ? modalRecord.code : '',     
					rules: [
						{
							required: false,   
							message: '请输入单价',
						},
					],
				})(<InputNumber 
  style={{ width: '100%' }}
  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  parser={value => value.replace(/￥\s?|(,*)/g, '')}
  precision={2}
  min={0}
  
				/>)}
    </FormItem>
    <FormItem {...formItemLayout} label='数量'>
      {getFieldDecorator('number', {
					initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.money) ? getPrice(modalRecord.money) : '',     
					rules: [
						{
							required: false,   
							message: '请输入数量'
						},
					],
				})(<InputNumber
  style={{ width: '100%' }}
  precision={0}
  min={1}
  
				/>)}
    </FormItem>
  </Modal>
	);
});
const CreateFormkh = Form.create()(props => {
	const { handleModalVisiblekh, userlist, selectkhflag, selectcustomer, selectedRows, handleSelectRows } = props;
	const columnskh = [
		{
			title: '操作',
			width: 100,
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
			title: '编号',
			dataIndex: 'no',
			width: 150,
		},
		{
			title: '姓名',
			dataIndex: 'name',
			width: 150,
		},
		{
			title: '性别',
			dataIndex: 'sex',
			width: 150,
			render: (text) => {
				if (isNotBlank(text)) {
					if (text === 1 || text === '1') {
						return <span>男</span>
					}
					if (text === 0 || text === '0') {
						return <span>女</span>
					}
				}
				return '';
			}
		},
		{
			title: '电话',
			dataIndex: 'phone',
			width: 150,
		},
		{
			title: '所属大区',
			dataIndex: 'area.name',
			width: 150,
		},
		{
			title: '所属分公司',
			dataIndex: 'companyName',
			width: 150,
		},
		{
			title: '所属部门',
			dataIndex: 'dept.name',
			width: 150,
		},
		{
			title: '所属区域',
			dataIndex: 'areaName',
			width: 150,
		},
		{
			title: '状态',
			dataIndex: 'status',
			width: 150,
			render: (text) => {
				if (isNotBlank(text)) {
					if (text === 0 || text === '0') {
						return <span>在职</span>
					}
					if (text === 1 || text === '1') {
						return <span>离职</span>
					}
				}
				return '';
			},
		},
	];
	return (
  <Modal
    title='选择审核人'
    visible={selectkhflag}
    onCancel={() => handleModalVisiblekh()}
    width='80%'
		>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      data={userlist}
      columns={columnskh}
    />
  </Modal>
	);
});
const CreateFormpass = Form.create()(props => {
	const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass } = props;
	const okHandle = () => {
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			form.resetFields();
			const values = {...fieldsValue};
			handleAddpass(values);
		});
	};
	return (
  <Modal
    title='审批'
    visible={modalVisiblepass}
    onOk={okHandle}
    onCancel={() => handleModalVisiblepass()}
		>
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核理由">
      {form.getFieldDecorator('remarks', {
					initialValue:'',
					rules: [
						{
							required: true,
							message: '请输入审核理由',
						},
					],
				})(<Input  />)}
    </FormItem>
  </Modal>
	);
});
@connect(({ cpOfferForm, loading, cpClient, sysuser ,cpSingelForm ,cpBillMaterial}) => ({
	...cpOfferForm,
	...cpClient,
  ...sysuser,
  ...cpSingelForm,
  ...cpBillMaterial,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpSingelForm/cpSingelForm_Add'],
	submitting2: loading.effects['cpupdata/cpSingelForm_update'],
}))
@Form.create()
class CpOfferFormForm extends PureComponent {
	index = 0

	cacheOriginData = {};

	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			fileList: [],
			modalVisible: false,
			modalRecord: {},
			selectkhdata: [],
			selectshdata1: {},
			selectshdata2: {},
			selectshdata3: {},
			selectshdata4: {},
			selectshdata5: {},
			modalVisiblepass: false,
			indexstatus: '',
			indexflag: 0,
			selectedRows: [],
			showdata: [],
			orderflag: false,
			selectkhflag: false,
			totalmoney: '',
			updataflag:true,
			confirmflag :true,
			updataname:'取消锁定',
			location: getLocation()
		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
        type: 'cpSingelForm/cpSingelForm_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if(res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm').length>0
					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm')[0].children.filter(item=>item.name=='修改').length==0)){
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
					if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
						let photoUrl = res.data.photo.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList: res.data.photo.split('|'),
							fileList: photoUrl
						})
					}
					const allUser = []
					if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
						allUser.push(res.data.oneUser)
					}
					this.setState({
						showdata: allUser
					})
					dispatch({
						type: 'sysarea/getFlatCode',
						payload:{
						id:location.query.id,
						type:'BJD'
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
						type:'BJD'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg1:imgres
						})
						}
						})
				}
			});
			dispatch({
				type: 'cpBillMaterial/cpBillMaterial_middle_List',
				payload: {
				  pageSize: 100,
				  singelId:location.query.id,
				  isTemplate:2
				}
				});
		}
		dispatch({
			type: 'dict/dict',
			callback: data => {
				const insuranceCompany =[]
				const brand=[]
				const approachType =[]
				const collectCustomer=[]
				const orderType =[]
				const business_project=[]
				const business_dicth =[]
				const business_type=[]
				const settlement_type =[]
				const payment_methodd=[]
				const old_need =[]
				const make_need=[]
				const quality_need =[]
				const oils_need=[]
				const guise_need =[]
				const installation_guide=[]
				const is_photograph =[]
				const maintenance_project =[]
				const del_flag=[]
				const classify =[]
				const client_level=[]
				const area = []
					data.forEach((item)=>{
						if(item.type == 'insurance_company'){
							insuranceCompany.push(item)
						}
						if(item.type == 'brand'){
							brand.push(item)
						}
						if(item.type == 'approach_type'){
							approachType.push(item)
						}
						if(item.type == 'collect_customer'){
							collectCustomer.push(item)
						}
						if(item.type == 'orderType'){
							orderType.push(item)
						}
						if(item.type == 'business_project'){
							business_project.push(item)
						}
						if(item.type == 'business_dicth'){
							business_dicth.push(item)
						}
						if(item.type == 'business_type'){
							business_type.push(item)
						}
						if(item.type == 'settlement_type'){
							settlement_type.push(item)
						}
						if(item.type == 'payment_methodd'){
							payment_methodd.push(item)
						}
						if(item.type == 'old_need'){
							old_need.push(item)
						}
						if(item.type == 'make_need'){
							make_need.push(item)
						}
						if(item.type == 'quality_need'){
							quality_need.push(item)
						}
						if(item.type == 'oils_need'){
							oils_need.push(item)
						}
						if(item.type == 'guise_need'){
							guise_need.push(item)
						}
						if(item.type == 'installation_guide'){
							installation_guide.push(item)
						}
						if(item.type == 'maintenance_project'){
							maintenance_project.push(item)
						}
						if(item.type == 'is_photograph'){
							is_photograph.push(item)
						}
						if(item.type == 'del_flag'){
							del_flag.push(item)
						}
						if(item.type == 'classify'){
							classify.push(item)
						}
						if(item.type == 'client_level'){
							client_level.push(item)
						}
						if(item.type == 'area'){
							area.push(item)
						}
					})
					this.setState({
						insuranceCompany,
						brand,approachType,collectCustomer,
						orderType,business_project,business_dicth
						,business_type,settlement_type,payment_methodd,old_need,
						make_need,quality_need,oils_need,guise_need,installation_guide
						,maintenance_project,is_photograph,del_flag,classify,client_level,
						area
					})
			}
		  })
		dispatch({
			type: 'sysuser/fetch',
			payload: {
				'role.id': '3',
				'office.id': getStorage('companyId')
			}
		});
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
				pageSize: 10,
			}
		});
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		this.setState({
			selectkhdata: ''
		})
		dispatch({
			type: 'cpSingelForm/clear',
		});

		dispatch({
			type: 'cpBillMaterial/clear',
		});
	}

	handleSubmit = e => {
		const { dispatch, form } = this.props;
		const { addfileList, location, selectkhdata, cpSingelFormGet, showdata ,updataflag} = this.state;
		e.preventDefault();
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
				value.totalNumber = newshowdata.length
				const idarr = []
				newshowdata.forEach(item => {
					idarr.push(item.id)
				})
				value.ids = idarr.join(',')
				value.orderStatus = 1
				if(updataflag){
				dispatch({
					type: 'cpSingelForm/cpSingelForm_Add',
					payload: { ...value },
					callback: (res) => {
						router.push(`/business/process/cp_singel_form_form?id=${location.query.id}`);
						this.setState({
							addfileList: [],
							fileList: [],
							totalmoney: res.data
						});
					}
				})
			}else{
				dispatch({
					type: 'cpupdata/cpSingelForm_update',
					payload: { ...value },
					callback: () => {
					  this.setState({
						addfileList: [],
						fileList: [],
					  });
					  router.push(`/business/process/cp_singel_form_form?id=${location.query.id}`);
					//   router.push('/business/process/cp_singel_form_list');
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
			router.push(`/business/process/cp_singel_form_form?id=${location.query.id}`);
		}
	}

	onsave = e => {
		const { dispatch, form } = this.props;
		const { addfileList, location, selectkhdata, cpSingelFormGet, showdata ,updataflag } = this.state;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
				const idarr = []
				value.totalNumber = newshowdata.length
				newshowdata.forEach(item => {
					idarr.push(item.id)
				})
				value.ids = idarr.join(',')
			if(updataflag){
				value.orderStatus = 0
				dispatch({
					type: 'cpSingelForm/cpSingelForm_Add',
					payload: { ...value },
					callback: () => {
						dispatch({
							type: 'cpSingelForm/cpSingelForm_Get',
							payload: {
								id: location.query.id,
							},
							callback: (res) => {
								if(res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm').length>0
								&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm')[0].children.filter(item=>item.name=='修改').length==0)){
									this.setState({ orderflag: true })
								} else {
									this.setState({ orderflag: false })
								}
								if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
									let photoUrl = res.data.photo.split('|')
									photoUrl = photoUrl.map((item) => {
										return {
											id: getFullUrl(item),
											uid: getFullUrl(item),
											url: getFullUrl(item),
											name: getFullUrl(item)
										}
									})
									this.setState({
										addfileList: res.data.photo.split('|'),
										fileList: photoUrl
									})
								}
								const allUser = []
								if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
									allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
								} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
									allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
								} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
									allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
								} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
									allUser.push(res.data.oneUser, res.data.twoUser)
								} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
									allUser.push(res.data.oneUser)
								}
								this.setState({
									showdata: allUser
								})
							}
						});
					}
				})
			}else{
				value.orderStatus = 1
				dispatch({
				  type: 'cpupdata/cpSingelForm_update',
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
		router.push('/business/process/cp_singel_form_list');
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

	handleModalVisible = flag => {
		this.setState({
			modalVisible: !!flag,
			modalRecord: {},
		});
	};

	handleModalVisiblepass = flag => {
		this.setState({
			modalVisiblepass: !!flag,
		});
	};

	handleAdd = (value) => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'cpOfferForm/cpOffer_Detail_Add',
			payload: {
				...value,
				cpOfferId: location.query.id
			},
			callback: (res) => {
				this.setState({
					modalVisible: false,
					totalmoney: getPrice(res.data)
				});
				dispatch({
					type: 'cpOfferForm/cpOffer_Detail_List',
					payload: {
						pageSize: 10,
						cpOfferId: location.query.id
					}
				});
			}
		})
	};

	showTable = flag => {
		this.setState({
			modalVisible: true
		});
	};

	onselectkh = (key) => {
		this.setState({
			indexflag: key,
			selectkhflag: true
		})
	}

	handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
	};

	selectcustomer = (record) => {
		const { dispatch } = this.props;
		const { indexflag, showdata } = this.state;
		let newselectkhdata = []
		if (showdata.length === 0) {
			newselectkhdata = []
		} else {
			newselectkhdata = showdata.map(item => ({ ...item }));
		}
		let newindex = ''
		record.status = 0
		showdata.forEach((i, index) => {
			if (i.id === indexflag) {
				newindex = index
			}
		})
		newselectkhdata.splice(newindex, 1, record)
		this.setState({ showdata: newselectkhdata, selectkhflag: false })
	}

	handleDeleteClick = (id) => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'cpOfferForm/cpOffer_Detail_Delete',
			payload: {
				id
			},
			callback: (res) => {
				dispatch({
					type: 'cpOfferForm/cpOffer_Detail_List',
					payload: {
						pageSize: 10,
						cpOfferId: location.query.id
					}
				});
				this.setState({
					totalmoney: getPrice(res.data)
				})
			}
		});
	}

	handleSelectRows = rows => {
		this.setState({
			selectedRows: rows,
		});
	};

	onUndo = (record) => { 
		Modal.confirm({
			title: '撤销该总成施工单',
			content: '确定撤销该总成施工单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.undoClick(record),
		});
	}

	undoClick = (id) => {
		const { dispatch } = this.props
		const {confirmflag,location}= this.state
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
		dispatch({
			type: 'cpAtWorkForm/',
			payload: {
				id
			},
			callback: () => {
				router.push(`/business/process/cp_singel_form_form?id=${location.query.id}`);
				// router.push('/business/process/cp_singel_form_list');
			}
		})
	}
	}

	getRowByKey(key, newData) {
		const { showdata } = this.state;
		return (newData || showdata).filter(item => item.key === key)[0];
	}

	cancel(e, key) {
		this.clickedCancel = true;
		e.preventDefault();
		const { showdata } = this.state;
		const newData = showdata.map(item => ({ ...item }));
		const target = this.getRowByKey(key, newData);
		if (this.cacheOriginData[key]) {
			Object.assign(target, this.cacheOriginData[key]);
			delete this.cacheOriginData[key];
		}
		target.editable = false;
		this.setState({ showdata: newData });
		this.clickedCancel = false;
	}

	newMember = () => {
		const { showdata } = this.state;
		let newData = []
		if (showdata.length === 0) {
			newData = []
		} else {
			newData = showdata.map(item => ({ ...item }));
		}
		newData.push({
			id: this.index,
		});
		this.index += 1;
		this.setState({ showdata: newData });
	};

	remove(key) {
		const { showdata } = this.state;
		const { onChange } = this.props;
		const newData = showdata.filter(item => item.id !== key);
		this.setState({ showdata: newData });
	}

	turnappData = (apps) => {
		if (apps === '待分配') {
			return 0
		}
		if (apps === '待审核') {
			return 1
		}
		if (apps === '撤销') {
			return 2
		}
		if (apps === '通过') {
			return 3
		}
		if (apps === '驳回') {
			return 4
		}
	}

	handleAddpass = (val) => {
		const { dispatch } = this.props
		const { location,indexstatus } = this.state
		dispatch({
			type: 'cpSingelForm/cpSingel_settlement_Add',
			payload: {
				id: location.query.id,
				approvals:indexstatus,
				...val
			},
			callback:()=>{
				dispatch({
					type: 'cpSingelForm/cpSingelForm_Get',
					payload: {
						id: location.query.id,
					},
					callback: (res) => {
						if(res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm').length>0
					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm')[0].children.filter(item=>item.name=='修改').length==0)){
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
						if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
							let photoUrl = res.data.photo.split('|')
							photoUrl = photoUrl.map((item) => {
								return {
									id: getFullUrl(item),
									uid: getFullUrl(item),
									url: getFullUrl(item),
									name: getFullUrl(item)
								}
							})
							this.setState({
								addfileList: res.data.photo.split('|'),
								fileList: photoUrl
							})
						}
						const allUser = []
						if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
							allUser.push(res.data.oneUser)
						}
						this.setState({
							showdata: allUser,
							modalVisiblepass:false
						})
					}
				});
			}
		})
	}

	showsp = (i) => {
		this.setState({
			indexstatus:i,
			modalVisiblepass: true
		})
	}

	repost =()=>{
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'cpSingelForm/cpSingelForm_Resubmit',
			payload: {
				id: location.query.id
			},
			callback:()=>{
				dispatch({
					type: 'cpSingelForm/cpSingelForm_Get',
					payload: {
						id: location.query.id,
					},
					callback: (res) => {
						if(res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm').length>0
						&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm')[0].children.filter(item=>item.name=='修改').length==0)){
							this.setState({ orderflag: true })
						} else {
							this.setState({ orderflag: false })
						}
						if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
							let photoUrl = res.data.photo.split('|')
							photoUrl = photoUrl.map((item) => {
								return {
									id: getFullUrl(item),
									uid: getFullUrl(item),
									url: getFullUrl(item),
									name: getFullUrl(item)
								}
							})
							this.setState({
								addfileList: res.data.photo.split('|'),
								fileList: photoUrl
							})
						}
						const allUser = []
						if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
							allUser.push(res.data.oneUser)
						}
						this.setState({
							showdata: allUser
						})
					}
				});
			}
		})
	}

	onRevocation = (record) => {
		Modal.confirm({
			title: '撤销该报件单',
			content: '确定撤销该报件单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.onUndo(record),
		});
	}

	onUndo = (id) => {
		const { dispatch, cpSingelFormGet } = this.props;
		const {location} = this.state
		if (isNotBlank(id)) {
			dispatch({
				type: 'cpSingelForm/CpSingelForm_Revocation',
				payload: { id: cpSingelFormGet.id },
				callback: () => {
					this.setState({
						addfileList: [],
						fileList: [],
					});
					router.push(`/business/process/cp_singel_form_form?id=${location.query.id}`);
					// router.push('/business/process/cp_singel_form_list');
				}
			})
		}
	}

	goprint = () => {
		const { location } = this.state	
		const w = window.open('about:blank')
		w.location.href = `/#/jobmanage_ToQuote?id=${location.query.id}`
	}

	handleDeleteClickwl = (id) => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
		  type: 'cpPendingSingelForm/cpPendingSingel_del',
		  payload: {
			id
		  },
		  callback: (res) => {
			dispatch({
			  type: 'cpSingelForm/cpSingelForm_Get',
			  payload: {
				id: location.query.id,
			  }
			})
			dispatch({
				type: 'cpBillMaterial/cpBillMaterial_middle_List',
				payload: {
				  pageSize: 100,
				  singelId:location.query.id,
				  isTemplate:2
				}
				});
		  }
		});
	  }

	render() {
		const { fileList, previewVisible, previewImage, modalVisible, selectkhflag, selectkhdata, orderflag, totalmoney, selectedRows, showdata, modalVisiblepass
		, updataflag ,updataname,srcimg,srcimg1} = this.state;
		const {submitting1,submitting2, submitting, cpSingelFormGet, cpOfferDetailList, cpClientList, userlist ,cpBillMaterialMiddleList} = this.props;
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
		const columns = [
			{
				title: '名称',        
				dataIndex: 'name',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
			},
			{
				title: '单价',        
				dataIndex: 'price',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
				render: (text) => {
					if (isNotBlank(text)) {
						return <span>{getPrice(text)}</span>
					}
				}
			},
			{
				title: '数量',        
				dataIndex: 'number',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
			},
			{
				title: '总金额',        
				dataIndex: 'totaoPrice',   
				inputType: 'text',   
				width: 100,          
				editable: true,      
				render: (text) => {
					if (isNotBlank(text)) {
						return <span>{getPrice(text)}</span>
					}
				}
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
		const shstatus = (apps) => {
			if (apps === '0' || apps === 0) {
				return '待审核'
			}
			if (apps === '1' || apps === 1) {
				return '通过'
			}
			if (apps === '2' || apps === 2) {
				return '驳回'
			}
		}
		const columnssh = [
			{
				title: '操作',
				key: 'action',
				width: 100,
				render: (text, record) => {
					if(((isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.approvals) && 
					(cpSingelFormGet.approvals === 0 || cpSingelFormGet.approvals === '0'))||
					(isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.createBy)&&(cpSingelFormGet.approvals === 2 || cpSingelFormGet.approvals === '2')  )||
					(isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.createBy)&&(cpSingelFormGet.approvals === 4 || cpSingelFormGet.approvals === '4')  )
					)){
					return (
  <span>
    <a onClick={e => this.onselectkh(record.id)}>选择</a>
  </span>
					);
					}
					return ''
				}
			},
			{
				title: '审核人姓名',
				dataIndex: 'name',
				key: 'name',
				width: 150,
			},
			{
				title: '审核状态',
				dataIndex: 'status',
				key: 'status',
				width: 100,
				render: (text) => {
					if(isNotBlank(cpSingelFormGet)&&(cpSingelFormGet.approvals!==0||cpSingelFormGet.approvals!=='0')){
						return (<span>{shstatus(text)}</span>)
					}
					return ''
				}
			},
			{
				title: '审核结果',
				dataIndex: 'remarks',
				key: 'remarks',
				width: 250,
			},
			{
				title: '删除',
				key: 'action',
				width: 100,
				render: (text, record) => {
					if(((isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.approvals) && 
					(cpSingelFormGet.approvals === 0 || cpSingelFormGet.approvals === '0'))||
					(isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.createBy)&&(cpSingelFormGet.approvals === 2 || cpSingelFormGet.approvals === '2')  )||
					(isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.createBy)&&(cpSingelFormGet.approvals === 4 || cpSingelFormGet.approvals === '4')  )
					)){
					return (
  <span>
    <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
      <a>删除</a>
    </Popconfirm>
  </span>
					);
					}
					return ''
				}
			},
		];
		const columnswl = [
			{
			  title: '物料编码',        
			  dataIndex: 'cpBillMaterial.billCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '一级编码',        
			  dataIndex: 'cpBillMaterial.oneCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '二级编码',        
			  dataIndex: 'cpBillMaterial.twoCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '一级编码型号',        
			  dataIndex: 'cpBillMaterial.one.model',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '二级编码名称',        
			  dataIndex: 'cpBillMaterial.two.name',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '名称',        
			  dataIndex: 'cpBillMaterial.name',   
			  inputType: 'text',   
			  width: 300,          
			  editable: true,      
			},
			{
			  title: '原厂编码',        
			  dataIndex: 'cpBillMaterial.originalCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '配件厂商',        
			  dataIndex: 'cpBillMaterial.rCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '单位',        
			  dataIndex: 'cpBillMaterial.unit',   
			  inputType: 'text',   
			  width: 100,          
			  editable:  true  ,      
			 },
			{
			  title: '需求数量',        
			  dataIndex: 'number',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '库存数量',        
			  dataIndex: 'repertoryNumber',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
				title: '库存单价',
				dataIndex: 'repertoryPrice',
				inputType: 'text',
				width: 150,
				editable: false,
				render:(text,res)=>{
				  if(isNotBlank(res.id)){
					return getPrice(text)
				  }
				  return `总金额:${getPrice(text)}`
				}
			  },
			{
			  title: '创建时间',
			  dataIndex: 'createDate',
			  editable: false,
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
			  title: '创建时间',
			  dataIndex: 'createDate',
			  editable: false,
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
			  title: '更新时间',
			  dataIndex: 'finishDate',
			  editable: true,
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
			  dataIndex: 'cpBillMaterial.remarks',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
				title: '基础操作',
				width: 100,
				render: (text, record) => {
				return	isNotBlank(record.id)&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm')[0].children.filter(item=>item.name=='删除')
.length>0&&!orderflag?
				<Fragment>
					<Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClickwl(record.id)}>
					<a>删除</a>
					</Popconfirm>
				</Fragment>
				:''
				},
			},
		  ]
		const parentMethods = {
			handleAdd: this.handleAdd,
			handleModalVisible: this.handleModalVisible,
		}
		const parentMethodskh = {
			handleAddkh: this.handleAddkh,
			handleModalVisiblekh: this.handleModalVisiblekh,
			handleSelectRows: this.handleSelectRows,
			selectedRows,
			selectcustomer: this.selectcustomer,
			userlist
		}
		const parentMethodspass = {
			handleAddpass: this.handleAddpass,
			handleModalVisiblepass :this.handleModalVisiblepass,
			modalVisiblepass
		}
		const appData = (apps) => {
			if (apps === 0 || apps === '0') {
				return '待分配'
			}
			if (apps === 1 || apps === '1') {
				return '待审核'
			}
			if (apps === 2 || apps === '2') {
				return '撤销'
			}
			if (apps === 3 || apps === '3') {
				return '通过'
			}
			if (apps === 4 || apps === '4') {
				return '驳回'
			}
		}
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
报件单
      </div>
      {isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
        </span><img src={isNotBlank(srcimg)?getFullUrl(`/${srcimg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                    </div>}
      {isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
        </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                           </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card bordered={false} title="订单信息">
          <Row gutter={12}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='单号'>
                {getFieldDecorator('intentionId', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.id) ? cpSingelFormGet.id : '',     
                      rules: [
                        {
                          required: true,   
                          message: '请输入单号',
                        },
                      ],
                    })(<Input disabled />)}
              </FormItem>
            </Col>
            {isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.type)&&(cpSingelFormGet.type==3)&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单分类'>
                <Input  
                  disabled
                  value='内部订单'
                />
              </FormItem>
            </Col>
	}
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='审核记录人'>
                {getFieldDecorator('createBy.name', {
										initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.createBy) && isNotBlank(cpSingelFormGet.createBy.name)?
										cpSingelFormGet.createBy.name: '',     
										rules: [
											{
												required: false,   
												message: '审核记录人',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col> 
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='审核记录时间'>
                {getFieldDecorator('createBy.name', {
										initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.createDate) ?
										moment(cpSingelFormGet.createDate).format('YYYY-MM-DD HH:mm:ss'): '',     
										rules: [
											{
												required: false,   
												message: '审核记录时间',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col> 
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.orderCode) ? cpSingelFormGet.orderCode : '',     
                      rules: [
                        {
                          required: true,   
                          message: '请输入订单编号',
                        },
                      ],
                    })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='故障描述'>
                {getFieldDecorator('errorDescription', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.errorDescription) ? cpSingelFormGet.errorDescription : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入故障描述',
                        },
                      ],
                    })(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='产品代码'>
                {getFieldDecorator('productCode', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.productCode) ? cpSingelFormGet.productCode : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入产品代码',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='配件解析'>
                {getFieldDecorator('accessoriesParsing', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.accessoriesParsing) ? cpSingelFormGet.accessoriesParsing : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入配件解析',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='配件特殊修改'>
                {getFieldDecorator('accessoriesSpecial', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.accessoriesSpecial) ? cpSingelFormGet.accessoriesSpecial : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入配件特殊修改',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='新增物料需求'>
                {getFieldDecorator('materialDemand', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.materialDemand) ? cpSingelFormGet.materialDemand : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入新增物料需求',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
			<Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='打印次数'>
            		  <Input  disabled value={isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.printNumber) ? cpSingelFormGet.printNumber : ''} />
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.remarks) ? cpSingelFormGet.remarks : '',     
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
        </Card>
        {isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.type)&&(cpSingelFormGet.type==4)&&
        <Card title="客户信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                <Input
                  style={{ width: '100%' }}
                  disabled
                  value={isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.user) ? cpSingelFormGet.user.name : ''}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属公司'>
                <Input
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.user) && isNotBlank(cpSingelFormGet.user.office) ? cpSingelFormGet.user.office.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属区域'>
                <Input
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.user) && isNotBlank(cpSingelFormGet.user.areaName) ? cpSingelFormGet.user.areaName : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='电话'>
                <Input
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.user)  && isNotBlank(cpSingelFormGet.user.phone) ? cpSingelFormGet.user.phone : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
		}
        {!(isNotBlank(cpSingelFormGet)&&isNotBlank(cpSingelFormGet.type)&&(cpSingelFormGet.type==4))&&
        <Card title="客户信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                <Input
                  
				  disabled
				  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) && isNotBlank(cpSingelFormGet.client.clientCpmpany)? cpSingelFormGet.client.clientCpmpany : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="联系人">
                <Input
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) ? cpSingelFormGet.client.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户分类'>
                <Select
                  style={{ width: '100%' }}
                  
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) ? cpSingelFormGet.client.classify : '')}
                >
                  {
                        isNotBlank(this.state.classify) && this.state.classify.length > 0 && this.state.classify.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                </Select>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户编号'>
                <Input
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) ? cpSingelFormGet.client.code : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系地址'>
                <Input
                
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) ? cpSingelFormGet.client.address : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='移动电话'>
                <Input
                 
                  disabled
                  value={(isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) ? cpSingelFormGet.client.phone : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
			}
        <Card title="总成信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
                {getFieldDecorator('assemblyBrand', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyBrand) ? cpSingelFormGet.assemblyBrand : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入品牌',
                        },
                      ],
                    })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型/排量'>
                {getFieldDecorator('assemblyVehicleEmissions', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyVehicleEmissions) ? cpSingelFormGet.assemblyVehicleEmissions : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入车型/排量',
                        },
                      ],
                    })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                {getFieldDecorator('assemblyYear', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyYear) ? cpSingelFormGet.assemblyYear : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入年份',
                        },
                      ],
                    })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成型号'>
                {getFieldDecorator('assemblyModel', {
                      initialValue: isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyModel) ? cpSingelFormGet.assemblyModel : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入总成型号',
                        },
                      ],
                    })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="相片显示" className="allimgstyle">
                {getFieldDecorator('photo', {
										initialValue: ''
									})(
  <Upload
    accept="image/*"
    onChange={this.handleUploadChange}
    onRemove={this.handleRemove}
    beforeUpload={this.handlebeforeUpload}
    fileList={fileList}
    listType="picture-card"
    onPreview={this.handlePreview}
  />
									)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
							打印
          </Button> 
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
				  	<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
	}
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSingelForm')[0].children.filter(item=>item.name=='修改')
.length>0&&
				<span>
  <Button
    style={{ marginLeft: 8 }}
    type="primary"
    onClick={this.onsave}
    loading={submitting2||submitting1} 
    disabled={orderflag&&updataflag}
  >
							保存
  </Button>
  <Button
    style={{ marginLeft: 8 }}
    type="primary"
    htmlType="submit"
    loading={submitting2||submitting1}
    disabled={orderflag&&updataflag}
  >
							提交
  </Button>
  {orderflag&&
  <Button style={{ marginLeft: 8 }} loading={submitting2||submitting1} onClick={() => this.onRevocation(cpSingelFormGet.id)}>
								撤销
  </Button>
						}
</span>
				  }
          <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
		  返回
          </Button>
        </FormItem>
      </Form>
    </Card>
    <div className={styles.standardList}>
      <Card bordered={false} title='物料明细'>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator} />
          <StandardEditTable
            scroll={{ x: 1800 }}
            data={cpBillMaterialMiddleList}
            bordered
            columns={columnswl}
          />
        </div>
      </Card>
    </div>
    <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
    <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
    <CreateForm {...parentMethods} modalVisible={modalVisible} />
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  </PageHeaderWrapper>
		);
	}
}
export default CpOfferFormForm;

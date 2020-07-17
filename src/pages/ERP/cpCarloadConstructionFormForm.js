import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Select,
	Button,
	Card,
	InputNumber,
	message,
	Icon,
	Upload,
	Modal,
	DatePicker,
	Row,
	Col,
	Cascader
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { isNotBlank, getLocation, getFullUrl } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpCarloadConstructionFormForm.less';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
	Object.keys(obj)
		.map(key => obj[key])
		.join(',');
const CreateForm = Form.create()(props => {
	const { handleModalVisible, userlist, selectflag, selectuser, levellist, levellist2, newdeptlist, form, dispatch, that } = props;
	const { getFieldDecorator } = form
	const selectcolumns = [
		{
			title: '操作',
			width: 100,
			align: 'center',
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
			title: '编号',
			dataIndex: 'no',
			align: 'center',
			width: 150,
		},
		{
			title: '姓名',
			dataIndex: 'name',
			align: 'center',
			width: 150,
		},
		{
			title: '性别',
			dataIndex: 'sex',
			align: 'center',
			width: 100,
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
			align: 'center',
			width: 150,
		},
		{
			title: '所属大区',
			dataIndex: 'area.name',
			align: 'center',
			width: 150,
		},
		{
			title: '所属分公司',
			dataIndex: 'companyName',
			align: 'center',
			width: 150,
		},
		{
			title: '所属部门',
			dataIndex: 'dept.name',
			align: 'center',
			width: 150,
		},
		{
			title: '所属区域',
			dataIndex: 'areaName',
			align: 'center',
			width: 150,
		},
		{
			title: '状态',
			dataIndex: 'status',
			align: 'center',
			width: 100,
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
	const handleSearch = e => {
		e.preventDefault();
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			const values = {
				...fieldsValue,
			};
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.no)) {
				values.no = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.name)) {
				values.name = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.companyName)) {
				values.companyName = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
				values.area.id = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
				values.dept = '';
			}
			that.setState({
				formValues: values,
			});
			dispatch({
				type: 'sysuser/fetch',
				payload: {
					'role.id':'f855f9f3ba154f92921a048d94ef7a9b',
					...values ,
					pageSize:10
				},
			});
		});
	};
	const handleFormReset = () => {
		form.resetFields();
		that.setState({
			formValues: {},
		});
		dispatch({
			type: 'sysuser/fetch',
			payload: {
				current: 1,
				pageSize: 10,
				'role.id':'f855f9f3ba154f92921a048d94ef7a9b'
			}
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
			...that.state.formValues,
			...filters,
			'role.id':'f855f9f3ba154f92921a048d94ef7a9b'
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'sysuser/fetch',
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
	const renderSimpleForm = () => {
		return (
  <Form onSubmit={handleSearch}>
    <Row gutter={12}>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="编号">
          {getFieldDecorator('no')(<Input  />)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('name')(<Input  />)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="所属大区">
          {getFieldDecorator('area.id', {
								initialValue: '',
							})(
  <Select style={{ width: '100%' }}  allowClear>
    {isNotBlank(levellist) &&
										isNotBlank(levellist.list) &&
										levellist.list.length > 0 &&
										levellist.list.map(item => (
  <Option value={item.id} key={item.id}>
    {item.name}
  </Option>
										))}
  </Select>
							)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="所属分公司">
          {getFieldDecorator('companyName', {
								initialValue: '',
							})(
  <Select
    
    style={{ width: '100%' }}
    allowClear
  >
    {isNotBlank(levellist2) &&
										isNotBlank(levellist2.list) &&
										levellist2.list.length > 0 &&
										levellist2.list.map(item => (
  <Option value={item.id} key={item.id}>
    {item.name}
  </Option>
										))}
  </Select>
							)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="所属部门">
          {getFieldDecorator('dept', {
								initialValue: '',
							})(
  <Cascader
    options={newdeptlist}
    allowClear
    fieldNames={{ label: 'name', value: 'id' }}
  />
							)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" htmlType="submit">
								查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
								重置
          </Button>
        </div>
      </Col>
    </Row>
  </Form>
		);
	};

	const handleModalVisiblein =()=>{
		// form.resetFields();
		that.setState({
			formValues: {},
		});
		handleModalVisible()
	}


	return (
  <Modal
    title='选择维修班组'
    visible={selectflag}
    onCancel={() => handleModalVisiblein()}
    width='80%'
		>
    <div className={styles.tableList}>
      <div className={styles.tableListForm}>{renderSimpleForm()}</div>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={userlist}
        columns={selectcolumns}
        onChange={handleStandardTableChange}
      />
    </div>
  </Modal>
	);
});
@connect(({ cpCarloadConstructionForm, loading, syslevel, sysdept, sysuser }) => ({
	...cpCarloadConstructionForm,
	...syslevel,
	...sysdept,
	...sysuser,
	newdeptlist: sysdept.deptlist.list,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpCarloadConstructionForm/cpCarloadConstructionForm_Add'],
	submitting2: loading.effects['cpupdata/cpCarloadConstructionForm_update'],
}))
@Form.create()
class CpCarloadConstructionFormForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			fileList: [],
			location: getLocation(),
			orderflag: false,
			sumbitflag: false,
			selectdata: [],
			selectyear: 0,
			selectmonth: 0,
			selectflag: false,
			updataflag: true,
			codenumber: 1,
			confirmflag :true,
			updataname: '取消锁定',
		}
	}

	componentDidMount() {
		const { location } = this.state;
		const { dispatch } = this.props;
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpCarloadConstructionForm/cpCarloadConstructionForm_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
						|| (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpCarloadConstructionForm').length > 0
							&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpCarloadConstructionForm')[0].children.filter(item => item.name == '修改')
								.length == 0)) {
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
					if (isNotBlank(res.data.maintenanceCrew) && isNotBlank(res.data.maintenanceCrew.id)) {
						this.props.form.setFieldsValue({
							wxbz: isNotBlank(res.data.maintenanceCrew.name) ? res.data.maintenanceCrew.name : ''
						})
					}
					if (isNotBlank(res.data.qualityTime)) {
						this.setState({
							selectyear: res.data.qualityTime.split(',')[0],
							selectmonth: res.data.qualityTime.split(',')[1]
						})
					}
					if (isNotBlank(res.data) && isNotBlank(res.data.photo2)) {
						let photoUrl = res.data.photo2.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList1: res.data.photo2.split('|'),
							fileList1: photoUrl
						})
					}
					dispatch({
						type: 'sysarea/getFlatCode',
						payload: {
							id: location.query.id,
							type: '1'
						},
						callback: (imgres) => {
							this.setState({
								srcimg: imgres
							})
						}
					})
					dispatch({
						type: 'sysarea/getFlatOrderdCode',
						payload: {
							id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
							type: 'ZCSGD'
						},
						callback: (imgres) => {
							this.setState({
								srcimg1: imgres
							})
						}
					})
				}
			});
    }
    
		dispatch({
			type: 'sysuser/fetch',
			payload: {
				current: 1,
				pageSize: 10,
				'role.id':'f855f9f3ba154f92921a048d94ef7a9b'
			}
		});
		dispatch({
			type: 'syslevel/fetch',
			payload: {
				type: 1,
			},
		});
		dispatch({
			type: 'syslevel/fetch2',
			payload: {
        type: 2,
        pageSize:100
			},
		});
		dispatch({
			type: 'syslevel/query_office',
		});
		dispatch({
			type: 'sysdept/query_dept'
		});

		dispatch({
			type: 'dict/dict',
			callback: data => {
				const insuranceCompany = []
				const brand = []
				const approachType = []
				const collectCustomer = []
				const orderType = []
				const business_project = []
				const business_dicth = []
				const business_type = []
				const settlement_type = []
				const payment_methodd = []
				const old_need = []
				const make_need = []
				const quality_need = []
				const oils_need = []
				const guise_need = []
				const installation_guide = []
				const is_photograph = []
				const maintenance_project = []
				const del_flag = []
				const classify = []
				const client_level = []
				const area = []
				const logisticsNeed = []
				data.forEach((item) => {
					if (item.type == 'wy') {
						logisticsNeed.push(item)
					}
					if (item.type == 'insurance_company') {
						insuranceCompany.push(item)
					}
					if (item.type == 'brand') {
						brand.push(item)
					}
					if (item.type == 'approach_type') {
						approachType.push(item)
					}
					if (item.type == 'collect_customer') {
						collectCustomer.push(item)
					}
					if (item.type == 'orderType') {
						orderType.push(item)
					}
					if (item.type == 'business_project') {
						business_project.push(item)
					}
					if (item.type == 'business_dicth') {
						business_dicth.push(item)
					}
					if (item.type == 'business_type') {
						business_type.push(item)
					}
					if (item.type == 'settlement_type') {
						settlement_type.push(item)
					}
					if (item.type == 'payment_methodd') {
						payment_methodd.push(item)
					}
					if (item.type == 'old_need') {
						old_need.push(item)
					}
					if (item.type == 'make_need') {
						make_need.push(item)
					}
					if (item.type == 'quality_need') {
						quality_need.push(item)
					}
					if (item.type == 'oils_need') {
						oils_need.push(item)
					}
					if (item.type == 'guise_need') {
						guise_need.push(item)
					}
					if (item.type == 'installation_guide') {
						installation_guide.push(item)
					}
					if (item.type == 'maintenance_project') {
						maintenance_project.push(item)
					}
					if (item.type == 'is_photograph') {
						is_photograph.push(item)
					}
					if (item.type == 'del_flag') {
						del_flag.push(item)
					}
					if (item.type == 'classify') {
						classify.push(item)
					}
					if (item.type == 'client_level') {
						client_level.push(item)
					}
					if (item.type == 'area') {
						area.push(item)
					}
				})
				this.setState({
					insuranceCompany,
					brand, approachType, collectCustomer,
					orderType, business_project, business_dicth
					, business_type, settlement_type, payment_methodd, old_need,
					make_need, quality_need, oils_need, guise_need, installation_guide
					, maintenance_project, is_photograph, del_flag, classify, client_level,
					area, logisticsNeed
				})
			}
		})
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpCarloadConstructionForm/clear',
		});
	}

	handleSubmit = (e) => {
		const { dispatch, form, cpCarloadConstructionFormGet } = this.props;
		const { addfileList, location, selectdata, addfileList1, selectyear, selectmonth, updataflag } = this.state;
		e.preventDefault();
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				this.setState({
					sumbitflag: true
				})
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}
				if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
					value.photo2 = addfileList1.join('|')
				} else {
					value.photo2 = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
				value.qualityTime = `${selectyear}, ${selectmonth}`
				value.maintenanceCrew = {}
				value.maintenanceCrew.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id
					: (isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceCrew) && isNotBlank(cpCarloadConstructionFormGet.maintenanceCrew.id) ? cpCarloadConstructionFormGet.maintenanceCrew.id : '')
				value.orderStatus = 1;
				if (updataflag) {
					dispatch({
						type: 'cpCarloadConstructionForm/cpCarloadConstructionForm_Add',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
							});
							router.push(`/business/process/cp_carload_construction_form_form?id=${location.query.id}`);
							// router.push('/business/process/cp_carload_construction_form_list');
						}
					})
				} else {
					dispatch({
						type: 'cpupdata/cpCarloadConstructionForm_update',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
							});
							router.push(`/business/process/cp_carload_construction_form_form?id=${location.query.id}`);
							// router.push('/business/process/cp_carload_construction_form_list');
						}
					})
				}
			};
		})
	}

	onsave = () => {
		const { dispatch, form, cpCarloadConstructionFormGet } = this.props;
		const { addfileList, location, selectdata, addfileList1, selectyear, selectmonth, updataflag } = this.state;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}
				if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
					value.photo2 = addfileList1.join('|')
				} else {
					value.photo2 = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
				value.qualityTime = `${selectyear}, ${selectmonth}`
				value.maintenanceCrew = {}
				value.maintenanceCrew.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id
					: (isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceCrew) && isNotBlank(cpCarloadConstructionFormGet.maintenanceCrew.id) ? cpCarloadConstructionFormGet.maintenanceCrew.id : '')
				if (updataflag) {
					value.orderStatus = 0
					dispatch({
						type: 'cpCarloadConstructionForm/cpCarloadConstructionForm_Add',
						payload: { ...value }
					})
				} else {
					value.orderStatus = 1
					dispatch({
						type: 'cpupdata/cpCarloadConstructionForm_update',
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
		})
	}

	onupdata = () => {
		const { location, updataflag } = this.state
		if (updataflag) {
			this.setState({
				updataflag: false,
				updataname: '锁定'
			})
		} else {
			router.push(`/business/process/cp_carload_construction_form_form?id=${location.query.id}`);
		}
	}

	onCancelCancel = () => {
		router.push('/business/process/cp_carload_construction_form_list');;
	};

	onUndo = (record) => {
		Modal.confirm({
			title: '撤销该整车单',
			content: '确定撤销该整车单吗？',
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
			type: 'cpCarloadConstructionForm/cpCarloadConstructionForm_revocation',
			payload: {
				id
			},
			callback: () => {
				router.push(`/business/process/cp_carload_construction_form_form?id=${location.query.id}`);
				// router.push('/business/process/cp_carload_construction_form_list');;
			}
		})
		}
	}

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
		const { dispatch } = this.props
		const isimg = file.type.indexOf('image') >= 0;
		if (!isimg) {
			message.error('请选择图片文件!');
		}
		const isLt10M = file.size / 1024 / 1024 <= 10;
		if (!isLt10M) {
			message.error('文件大小需为10M以内');
		}
		if (isimg && isLt10M) {
			dispatch({
				type: 'upload/upload_img',
				payload: {
					file,
					name: 'cpCarloadConstructionFormForm'
				},
				callback: (res) => {
					if (!isNotBlank(addfileList) || addfileList.length <= 0) {
						this.setState({
							addfileList: [res],
						});
					} else {
						this.setState({
							addfileList: [...addfileList, res],
						});
					}
				}
			})
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

	handleCancel1 = () => this.setState({ previewVisible1: false });

	handlePreview1 = file => {
		this.setState({
			previewImage1: file.url || file.thumbUrl,
			previewVisible1: true,
		});
	};

	handleImage1 = url => {
		this.setState({
			previewImage1: url,
			previewVisible1: true,
		});
	};

	handleRemove1 = file => {
		this.setState(({ fileList1, addfileList1 }) => {
			const index = fileList1.indexOf(file);
			const newFileList = fileList1.slice();
			newFileList.splice(index, 1);
			const newaddfileList = addfileList1.slice();
			newaddfileList.splice(index, 1);
			return {
				fileList1: newFileList,
				addfileList1: newaddfileList,
			};
		});
	};

	handlebeforeUpload1 = file => {
		const { addfileList1 } = this.state;
		const { dispatch } = this.props
		const isimg = file.type.indexOf('image') >= 0;
		if (!isimg) {
			message.error('请选择图片文件!');
		}
		const isLt10M = file.size / 1024 / 1024 <= 10;
		if (!isLt10M) {
			message.error('文件大小需为10M以内');
		}
		if (isimg && isLt10M) {
			dispatch({
				type: 'upload/upload_img',
				payload: {
					file,
					name: 'cpCarloadConstructionFormForm'
				},
				callback: (res) => {
					if (!isNotBlank(addfileList1) || addfileList1.length <= 0) {
						this.setState({
							addfileList1: [res],
						});
					} else {
						this.setState({
							addfileList1: [...addfileList1, res],
						});
					}
				}
			})
		}
		return isLt10M && isimg;
	};

	handleUploadChange1 = info => {
		const isimg = info.file.type.indexOf('image') >= 0;
		const isLt10M = info.file.size / 1024 / 1024 <= 10;
		if (info.file.status === 'done') {
			if (isLt10M && isimg) {
				this.setState({ fileList1: info.fileList });
			}
		} else {
			this.setState({ fileList1: info.fileList });
		}
	};

	onselect = () => {
    this.setState({
      selectflag: true
    })
	}

	selectuser = (record) => {
		this.props.form.setFieldsValue({
			wxbz: record.name
		})
		this.setState({
			selectdata: record,
			selectflag: false
		})
	}

	handleModalVisible = flag => {
		this.setState({
			selectflag: !!flag
		});
	};

	editYear = (val) => {
		if (isNotBlank(val)) {
			this.setState({ selectyear: val })
		} else {
			this.setState({ selectyear: 0 })
		}
	}

	editMonth = (val) => {
		if (isNotBlank(val)) {
			this.setState({ selectmonth: val })
		} else {
			this.setState({ selectmonth: 0 })
		}
	}

	goprint = () => {
		const { location, codenumber } = this.state
		const w = window.open('about:blank')
		w.location.href = `/#/Task_Zc_Construction?id=${location.query.id}&code=${codenumber}`
	}

	changeimg = () => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'sysarea/getFlatCode',
			payload: {
				id: location.query.id,
				type: '1'
			},
			callback: (imgres) => {
				this.setState({
					srcimg: imgres,
					codenumber: 1
				})
			}
		})
	}

	changeimg1 = () => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'sysarea/getFlatCode',
			payload: {
				id: location.query.id,
				type: 'ZCBJ'
			},
			callback: (imgres) => {
				this.setState({
					srcimg: imgres,
					codenumber: 2
				})
			}
		})
	}

	render() {
		const { fileList, previewVisible, previewImage, fileList1, previewVisible1, previewImage1, orderflag,
			sumbitflag, selectdata, selectflag, updataname, updataflag, selectmonth, selectyear, srcimg, srcimg1 } = this.state;
		const { submitting1, submitting2, submitting, cpCarloadConstructionFormGet, userlist,
			levellist, levellist2, newdeptlist, dispatch } = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;
		const that = this
		const parentMethods = {
			handleAdd: this.handleAdd,
			handleModalVisible: this.handleModalVisible,
			selectuser: this.selectuser,
			handleSearch: this.handleSearch,
			handleFormReset: this.handleFormReset,
			that,
			userlist,
			levellist, levellist2, newdeptlist, dispatch
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
		const yeardata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
		]
		const monthdata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
			{
				key: 11,
				value: 11
			},
			{
				key: 12,
				value: 12
			},
		]
		const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传照片</div>
  </div>
		);
		return (
  <PageHeaderWrapper>
    <Card bordered={false} style={{ position: 'relative' }}>
      <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
						整车施工单
      </div>
      {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
        <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
							单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
                                                                                                  </div>}
      {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
        <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
							编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
                                                                                                         </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单状态'>
                <Input
                  disabled
                  value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.orderStatus) ? (
												cpCarloadConstructionFormGet.orderStatus === 0 || cpCarloadConstructionFormGet.orderStatus === '0' ? '未处理' : (
													cpCarloadConstructionFormGet.orderStatus === 1 || cpCarloadConstructionFormGet.orderStatus === '1' ? '已处理' :
														cpCarloadConstructionFormGet.orderStatus === 2 || cpCarloadConstructionFormGet.orderStatus === '2' ? '关闭' : '')) : ''}
                  style={cpCarloadConstructionFormGet.orderStatus === 0 || cpCarloadConstructionFormGet.orderStatus === '0' ? { color: '#f50' } : (
												cpCarloadConstructionFormGet.orderStatus === 1 || cpCarloadConstructionFormGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
											)}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='单号'>
                <Input value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.id) ? cpCarloadConstructionFormGet.id : ''} disabled />
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.orderCode) ? cpCarloadConstructionFormGet.orderCode : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单分类'>
                {getFieldDecorator('orderType', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.orderType) ? cpCarloadConstructionFormGet.orderType : '',    
											rules: [
												{
													required: false,
													message: '请选择订单分类',
												},
											],
										})(
  <Select
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.orderType) && this.state.orderType.length > 0 && this.state.orderType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
                {getFieldDecorator('project', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.project) ? cpCarloadConstructionFormGet.project : '',    
											rules: [
												{
													required: false,
													message: '请选择业务项目',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务渠道'>
                {getFieldDecorator('dicth', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.dicth) ? cpCarloadConstructionFormGet.dicth : '',    
											rules: [
												{
													required: false,
													message: '请选择业务渠道',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.business_dicth) && this.state.business_dicth.length > 0 && this.state.business_dicth.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务分类'>
                {getFieldDecorator('businessType', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.businessType) ? cpCarloadConstructionFormGet.businessType : '',    
											rules: [
												{
													required: false,
													message: '请选择业务分类',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.business_type) && this.state.business_type.length > 0 && this.state.business_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
                <Select
                  style={{ width: '100%' }}
                  disabled
                  allowClear
                  value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.brand) ? cpCarloadConstructionFormGet.brand : ''}
                >
                  {
												isNotBlank(this.state.brand) && this.state.brand.length > 0 && this.state.brand.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
                </Select>
              </FormItem>
            </Col>

			<Col lg={12} md={12} sm={24}>
  <FormItem {...formItemLayout} label='保险公司'>
  <Select
	showSearch
	optionFilterProp='children'
	value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.insuranceCompanyId) ? cpCarloadConstructionFormGet.insuranceCompanyId : ''}
	filterOption={(input, option) =>
		option.props.children.indexOf(input) >= 0
	  }
    style={{ width: '100%' }}
    disabled
    allowClear
  >
    {
														isNotBlank(this.state.insuranceCompany) && this.state.insuranceCompany.length > 0 && this.state.insuranceCompany.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
													}
  </Select>
  </FormItem>
									</Col>
          </Row>
        </Card>
        <Card title="总成信息" style={{ marginTop: "20px" }} bordered={false}>
          <Row gutter={12}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='进场类型'>
                <Select
                  allowClear
                  disabled
value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyEnterType) ? cpCarloadConstructionFormGet.assemblyEnterType : ''}
                  style={{ width: '100%' }}
                >
                  {
												isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
                </Select>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) ? cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyBrand : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型/排量'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) ? cpCarloadConstructionFormGet.cpAssemblyBuild.vehicleModel : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) ? cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyYear : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成型号'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) ? cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyModel : ''} />
              </FormItem>
            </Col>
			<Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成号'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) &&isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyCode)? cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyCode : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='钢印号'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblySteelSeal) ? cpCarloadConstructionFormGet.assemblySteelSeal : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='VIN码'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyVin) ? cpCarloadConstructionFormGet.assemblyVin : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='其他识别信息'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyMessage) ? cpCarloadConstructionFormGet.assemblyMessage : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='故障代码'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyFaultCode) ? cpCarloadConstructionFormGet.assemblyFaultCode : ''} />
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='本次故障描述' className="allinputstyle">
                {getFieldDecorator('assemblyErrorDescription', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyErrorDescription) ? cpCarloadConstructionFormGet.assemblyErrorDescription : '',     
											rules: [
												{
													required: false,   
													message: '请输入本次故障描述',
												},
											],
										})(<TextArea disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="相片上传" className="allimgstyle">
                {getFieldDecorator('photo', {
											initialValue: ''
										})(
  <Upload
    disabled
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
        <Card title="业务员信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务员'>
                <Input
                  disabled
                  value={(isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.user) ? cpCarloadConstructionFormGet.user.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='编号'>
                <Input
                  disabled
                  value={(isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.user) ? cpCarloadConstructionFormGet.user.no : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系方式'>
                <Input
                  disabled
                  value={(isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.user) ? cpCarloadConstructionFormGet.user.phone : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属公司'>
                <Input
                  disabled
                  value={(isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.user) && isNotBlank(cpCarloadConstructionFormGet.user.office) ? cpCarloadConstructionFormGet.user.office.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属区域'>
                <Select
                  allowClear
                  notFoundContent={null}
                  style={{ width: '100%' }}
                  value={(isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.user) && isNotBlank(cpCarloadConstructionFormGet.user.dictArea) ? cpCarloadConstructionFormGet.user.dictArea : '')}
                  
                  disabled
                >
                  {
												isNotBlank(this.state.area) && this.state.area.length > 0 && this.state.area.map(item =>
  <Option value={item.value} key={item.value}>
    {item.label}
  </Option>
												)
											}
                </Select>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属部门'>
                <Input
                  disabled
                  value={(isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.user) && isNotBlank(cpCarloadConstructionFormGet.user.dept) ? cpCarloadConstructionFormGet.user.dept.name : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="客户信息" style={{ marginTop: "20px" }} bordered={false}>
          <Row gutter={12}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
				<Input disabled 
				value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) && isNotBlank(cpCarloadConstructionFormGet.client.clientCpmpany) ? cpCarloadConstructionFormGet.client.clientCpmpany : ''}
				 />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="联系人">
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) && isNotBlank(cpCarloadConstructionFormGet.client.user) && isNotBlank(cpCarloadConstructionFormGet.client.user.name) ? cpCarloadConstructionFormGet.client.user.name : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户分类'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) && isNotBlank(cpCarloadConstructionFormGet.client.classify) ? cpCarloadConstructionFormGet.client.classify : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户编号'>
                <Input
                  disabled
                  value={(isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) ? cpCarloadConstructionFormGet.client.code : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系人'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) && isNotBlank(cpCarloadConstructionFormGet.client.name) ? cpCarloadConstructionFormGet.client.name : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系电话'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) && isNotBlank(cpCarloadConstructionFormGet.client.phone) ? cpCarloadConstructionFormGet.client.phone : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系地址'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) && isNotBlank(cpCarloadConstructionFormGet.client.address) ? cpCarloadConstructionFormGet.client.address : ''} />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="一级信息" style={{ marginTop: "20px" }} bordered={false}>
          <Row gutter={12}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="交货时间">
                {getFieldDecorator('deliveryDate', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.deliveryDate) ? moment(cpCarloadConstructionFormGet.deliveryDate) : null,
											rules: [
												{
													required: true,   
													message: '请选择交货时间',
												},
											],
										})(
  <DatePicker
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
    disabled={updataflag}
  />
										)
										}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='旧件需求'>
                {getFieldDecorator('oldNeed', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.oldNeed) ? cpCarloadConstructionFormGet.oldNeed : '',    
											rules: [
												{
													required: false,
													message: '请选择旧件需求',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag}
  >
    {
													isNotBlank(this.state.old_need) && this.state.old_need.length > 0 && this.state.old_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='质保时间'>
                <Select
                  allowClear
                  disabled
                  style={{ width: '50%' }}
                  value={`${this.state.selectyear} 年`}
                  onChange={this.editYear}
                >
                  {
												isNotBlank(yeardata) && yeardata.length > 0 && yeardata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
											}
                </Select>
                <Select
                  allowClear
                  style={{ width: '50%' }}
                  disabled
                  value={`${this.state.selectmonth} 月`}
                  onChange={this.editMonth}
                >
                  {
												isNotBlank(monthdata) && monthdata.length > 0 && monthdata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
											}
                </Select>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='质量要求'>
                {getFieldDecorator('qualityNeed', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.qualityNeed) ? cpCarloadConstructionFormGet.qualityNeed : '',    
											rules: [
												{
													required: true,
													message: '请选择质量要求',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag}
  >
    {
													isNotBlank(this.state.quality_need) && this.state.quality_need.length > 0 && this.state.quality_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='油品要求'>
                {getFieldDecorator('oilsNeed', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.oilsNeed) ? cpCarloadConstructionFormGet.oilsNeed : '',    
											rules: [
												{
													required: false,
													message: '请选择油品要求',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag}
  >
    {
													isNotBlank(this.state.oils_need) && this.state.oils_need.length > 0 && this.state.oils_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='外观要求'>
                {getFieldDecorator('guiseNeed', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.guiseNeed) ? cpCarloadConstructionFormGet.guiseNeed : '',    
											rules: [
												{
													required: false,
													message: '请选择外观要求',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag}
  >
    {
													isNotBlank(this.state.guise_need) && this.state.guise_need.length > 0 && this.state.guise_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='安装指导'>
                {getFieldDecorator('installationGuide', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.installationGuide) ? cpCarloadConstructionFormGet.installationGuide : '',    
											rules: [
												{
													required: false,
													message: '请选择安装指导',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag}
  >
    {
													isNotBlank(this.state.installation_guide) && this.state.installation_guide.length > 0 && this.state.installation_guide.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='物流要求'>
                {getFieldDecorator('logisticsNeed', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.logisticsNeed) ? cpCarloadConstructionFormGet.logisticsNeed : '',     
											rules: [
												{
													required: true,   
													message: '请输入物流要求',
												},
											],
										})(<Select
  allowClear
  style={{ width: '100%' }}
  disabled={updataflag}
										>
  {
												isNotBlank(this.state.logisticsNeed) && this.state.logisticsNeed.length > 0 && this.state.logisticsNeed.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='其他约定事项' className="allinputstyle" className="allinputstyle">
                {getFieldDecorator('otherBuiness', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.otherBuiness) ? cpCarloadConstructionFormGet.otherBuiness : '',     
											rules: [
												{
													required: false,   
													message: '请输入其他约定事项',
												},
											],
										})(<TextArea  disabled={updataflag} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="其他信息" style={{ marginTop: "20px" }} bordered={false}>
          <Row gutter={12}>
            {/* <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='继续施工'>
                {getFieldDecorator('isGo', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.isGo) ? cpCarloadConstructionFormGet.isGo : '1',    
											rules: [
												{
													required: true,
													message: '请选择继续施工',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled={orderflag}
  >
    <Option key='否' value='0'>否</Option>
    <Option key='是' value='1'>是</Option>
  </Select>
										)}
              </FormItem>
            </Col> */}
			<Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='维修项目'>
                {getFieldDecorator('maintenanceProject', {
											initialValue:isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceProject) ? cpCarloadConstructionFormGet.maintenanceProject : '',    
											rules: [
												{
													required: false,
													message: '维修项目',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.maintenance_project) && this.state.maintenance_project.length > 0 && this.state.maintenance_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            {/* <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='维修项目'>
                <Input disabled value={isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceProject) ? cpCarloadConstructionFormGet.maintenanceProject : ''} />
              </FormItem>
            </Col> */}
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='行程里程'>
                {getFieldDecorator('tripMileage', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.tripMileage) ? cpCarloadConstructionFormGet.tripMileage : '',     
											rules: [
												{
													required: false,   
													message: '请输入行程里程',
												},
											],
										})(<InputNumber disabled={updataflag} precision={2} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车牌号' >
                {getFieldDecorator('plateNumber', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.plateNumber) ? cpCarloadConstructionFormGet.plateNumber : '',     
											rules: [
												{
													required: false,   
													message: '请输入车牌号',
												},
											],
										})(<Input disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='是否拍照'>
                {getFieldDecorator('isPhotograph', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.isPhotograph) ? cpCarloadConstructionFormGet.isPhotograph : '4',    
											rules: [
												{
													required: false,
													message: '请选择是否拍照',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag}
  >
    {
													isNotBlank(this.state.is_photograph) && this.state.is_photograph.length > 0 && this.state.is_photograph.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='发货地址' className="allinputstyle">
                {getFieldDecorator('shipAddress', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.shipAddress) ? cpCarloadConstructionFormGet.shipAddress : '',     
											rules: [
												{
													required: false,   
													message: '请输入发货地址',
												},
											],
										})(<TextArea disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='维修历史' className="allinputstyle">
                {getFieldDecorator('maintenanceHistory', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceHistory) ? cpCarloadConstructionFormGet.maintenanceHistory : '',     
											rules: [
												{
													required: true,   
													message: '请输入维修历史',
												},
											],
										})(<TextArea disabled={updataflag} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="整车信息" style={{ marginTop: "20px" }} bordered={false}>
          <Row gutter={12}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='整车检测结果'>
                {getFieldDecorator('carloadTestingResult', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.carloadTestingResult) ? cpCarloadConstructionFormGet.carloadTestingResult : '',     
											rules: [
												{
													required: false,   
													message: '请输入整车检测结果',
												},
											],
										})(<Input  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='整车故障编码'>
                {getFieldDecorator('carloadFaultCode', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.carloadFaultCode) ? cpCarloadConstructionFormGet.carloadFaultCode : '',     
											rules: [
												{
													required: false,   
													message: '请输入整车故障编码',
												},
											],
										})(<Input  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='检测人'>
                {getFieldDecorator('testingUser', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.testingUser) ? cpCarloadConstructionFormGet.testingUser : '',     
											rules: [
												{
													required: false,   
													message: '请输入检测人',
												},
											],
										})(<Input  disabled={orderflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='维修班组'>
                {getFieldDecorator('wxbz', {
											initialValue: '',     
											rules: [
												{
													required: true,   
													message: '请选择维修班组',
												},
											],
										})
											(<Input
  style={{ width: '50%' }}
  disabled
  value={isNotBlank(selectdata) && isNotBlank(selectdata.name) ?
													selectdata.name : (isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceCrew) ? cpCarloadConstructionFormGet.maintenanceCrew.name : '')}
											/>
											)}
                <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselect} loading={submitting} disabled={orderflag}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="相片上传" className="allimgstyle">
                {getFieldDecorator('photo2', {
											initialValue: ''
										})(
  <Upload
    accept="image/*"
    onChange={this.handleUploadChange1}
    onRemove={this.handleRemove1}
    beforeUpload={this.handlebeforeUpload1}
    fileList={fileList1}
    listType="picture-card"
    onPreview={this.handlePreview1}
    disabled={orderflag}
  >
    {isNotBlank(fileList) && fileList.length >= 9 || (orderflag) ? null : uploadButton}
  </Upload>
										)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
											initialValue: isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.remarks) ? cpCarloadConstructionFormGet.remarks : '',     
											rules: [
												{
													required: false,
													message: '请输入备注信息',
												},
											],
										})(
  <TextArea
    disabled={orderflag && updataflag}
    style={{ minHeight: 32 }}
    
    rows={2}
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
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpCarloadConstructionForm').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpCarloadConstructionForm')[0].children.filter(item => item.name == '二次修改')
									.length > 0 &&
								<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
								</Button>
							}
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpCarloadConstructionForm').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpCarloadConstructionForm')[0].children.filter(item => item.name == '修改')
									.length > 0 &&
								<span>
  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting2 || submitting1} disabled={orderflag && updataflag}>
										保存
  </Button>
  <Button
    type="primary"
    htmlType="submit"
    loading={submitting2 || submitting1}
    disabled={orderflag && updataflag}
    style={{ marginLeft: 8 }}
  >
										提交
  </Button>
  {
										orderflag &&
										<Button loading={submitting2 || submitting1} style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpCarloadConstructionFormGet.id)}>
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
    <CreateForm {...parentMethods} selectflag={selectflag} />
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
    <Modal visible={previewVisible1} footer={null} onCancel={this.handleCancel1}>
      <img alt="example" style={{ width: '100%' }} src={previewImage1} />
    </Modal>
  </PageHeaderWrapper>
		);
	}
}
export default CpCarloadConstructionFormForm;

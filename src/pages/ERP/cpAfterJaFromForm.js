import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Select,
	Button,
	Card,
	message,
	Icon,
	Upload,
	Modal,
	DatePicker,
	Col, Row
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation ,getPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpAfterJaFromForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpAfterJaFrom, loading }) => ({
	...cpAfterJaFrom,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpAfterJaFrom/cpAfterJaFrom_Add'],
	submitting2: loading.effects['cpupdata/cpAfterJaFrom_update'],
}))
@Form.create()
class CpAfterJaFromForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			previewVisible1: false,
			previewImage1: {},
			addfileList1: [],
			orderflag: false,
			confirmflag :true,
			updataflag: true,
			updataname: '取消锁定',
			location: getLocation()
		}
	}

	componentDidMount() {
		console.log('componentDidMount')
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpAfterJaFrom/cpAfterJaFrom_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
						|| (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterJaFrom').length > 0
							&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterJaFrom')[0].children.filter(item => item.name == '修改')
								.length == 0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
					dispatch({
						type: 'sysarea/getFlatCode',
						payload: {
							id: location.query.id,
							type: 'SHJA'
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
							type: 'SHJA'
						},
						callback: (imgres) => {
							this.setState({
								srcimg1: imgres
							})
						}
					})

					if (isNotBlank(res.data) && isNotBlank(res.data.oldPhoto)) {
						let photoUrl2 = res.data.oldPhoto.split('|')
						photoUrl2 = photoUrl2.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList2: res.data.oldPhoto.split('|'),
							fileList2: photoUrl2
						})
					}

					if (isNotBlank(res.data) && isNotBlank(res.data.img1)) {
						let photoUrl = res.data.img1.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList: res.data.img1.split('|'),
							fileList: photoUrl
						})
					}
					if (isNotBlank(res.data) && isNotBlank(res.data.y1)) {
						let photoUrl = res.data.y1.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList1: res.data.y1.split('|'),
							fileList1: photoUrl
						})
					}
				}
			});
		}

		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'interiorType',
			},
			callback: data => {
				this.setState({
					interiorType: data
				})
			}
		});

		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'entrustType',
			},
			callback: data => {
				this.setState({
					entrustType: data
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
			type: 'cpAfterJaFrom/clear',
		});
	}

	handleSubmit = e => {
		const { dispatch, form } = this.props;
		const { addfileList, addfileList1, location, updataflag } = this.state;
		e.preventDefault();
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(value.oldTime)) {
					value.oldTime = moment(value.oldTime).format('YYYY-MM-DD')
				}
				if (isNotBlank(value.planEndDate)) {
					value.planEndDate = moment(value.planEndDate).format('YYYY-MM-DD')
				}
				if (isNotBlank(value.planStartDate)) {
					value.planStartDate = moment(value.planStartDate).format('YYYY-MM-DD')
				}
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.img1 = addfileList.join('|')
				} else {
					value.img1 = '';
				}
				if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
					value.y1 = addfileList1.join('|')
				} else {
					value.y1 = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.orderStatus = 1
				if (updataflag) {
					dispatch({
						type: 'cpAfterJaFrom/cpAfterJaFrom_Add',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
								addfileList1: [],
								fileList1: [],
							});
							router.push(`/accessories/process/cp_after_ja_from_form?id=${location.query.id}`);
							// router.push('/accessories/process/cp_after_ja_from_list');
						}
					})
				} else {
					dispatch({
						type: 'cpupdata/cpAfterJaFrom_update',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
								addfileList1: [],
								fileList1: [],
							});
							router.push(`/accessories/process/cp_after_ja_from_form?id=${location.query.id}`);
							// router.push('/accessories/process/cp_after_ja_from_list');
						}
					})
				}
			}
		});
	};

	onupdata = () => {
		const { location, updataflag } = this.state
		if (updataflag) {
			this.setState({
				updataflag: false,
				updataname: '锁定'
			})
		} else {
			router.push(`/accessories/process/cp_after_ja_from_form?id=${location.query.id}`);
		}
	}

	onsave = () => {
		const { dispatch, form } = this.props;
		const { addfileList, addfileList1, location, updataflag } = this.state;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(value.oldTime)) {
					value.oldTime = moment(value.oldTime).format('YYYY-MM-DD')
				}
				if (isNotBlank(value.planEndDate)) {
					value.planEndDate = moment(value.planEndDate).format('YYYY-MM-DD')
				}
				if (isNotBlank(value.planStartDate)) {
					value.planStartDate = moment(value.planStartDate).format('YYYY-MM-DD')
				}
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.img1 = addfileList.join('|')
				} else {
					value.img1 = '';
				}
				if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
					value.y1 = addfileList1.join('|')
				} else {
					value.y1 = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				if (updataflag) {
					value.orderStatus = 0
					dispatch({
						type: 'cpAfterJaFrom/cpAfterJaFrom_Add',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
								addfileList1: [],
								fileList1: [],
							});
							// router.push('/accessories/process/cp_after_ja_from_list');
						}
					})
				} else {
					value.orderStatus = 1
					dispatch({
						type: 'cpupdata/cpAfterJaFrom_update',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
								addfileList1: [],
								fileList1: [],
							});
						}
					})
				}
			}
		});
	};

	onCancelCancel = () => {
		router.push('/accessories/process/cp_after_ja_from_list');
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
		const { dispatch } = this.props
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
			dispatch({
				type: 'upload/upload_img',
				payload: {
					file,
					name: 'businessIntention'
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
		const { dispatch } = this.props
		const { addfileList1 } = this.state;
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
					name: 'businessIntention'
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

	onUndo = (record) => {
		Modal.confirm({
			title: '撤销该售后结案单',
			content: '确定撤销该售后结案单吗？',
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
			type: 'cpRevocation/cpAfterJaFrom_revocation',
			payload: {
				id
			},
			callback: () => {
				router.push(`/accessories/process/cp_after_ja_from_form?id=${location.query.id}`);
				// router.push('/accessories/process/cp_after_ja_from_list');
			}
		})
	}
	}

	render() {
		const { fileList, previewVisible, previewImage, fileList1, previewVisible1, previewImage1, orderflag, updataflag, updataname, srcimg, srcimg1 } = this.state;
		const { submitting1, submitting2, submitting, cpAfterJaFromGet } = this.props;
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
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
						售后结案单
      </div>
      {isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
        <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
							单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
                                                                          </div>}
      {isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
        <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
							编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
                                                                                 </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单状态'>
                {getFieldDecorator('orderStatus', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.orderStatus) ? ((cpAfterJaFromGet.orderStatus === 0 || cpAfterJaFromGet.orderStatus === '0') ? '未处理' : '已处理') : '',     
											rules: [
												{
													required: false,   
													message: '请输入订单状态',
												},
											],
										})(<Input disabled  style={cpAfterJaFromGet.orderStatus === 1 || cpAfterJaFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }} />)}
              </FormItem>
            </Col>
            {/* <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后单号'>
                {getFieldDecorator('entrustCode', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.entrustCode) ? cpAfterJaFromGet.entrustCode : '',     
											rules: [
												{
													required: true,   
													message: '请输入售后单号',
												},
											],
										})(<Input disabled  />)}
              </FormItem>
            </Col> */}
 <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='历史单号'>
                {getFieldDecorator('historyCode', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.historyCode) ? cpAfterJaFromGet.historyCode : '',     
											rules: [
												{
													required: false,   
													message: '历史单号',
												},
											],
										})(<Input disabled  />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='售后编号' className="allinputstyle">
                {getFieldDecorator('orderCode', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.orderCode) ? cpAfterJaFromGet.orderCode : '',     
											rules: [
												{
													required: false,   
													message: '售后编号',
												},
											],
										})(<Input disabled  />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后申请单号'>
                {getFieldDecorator('applyCode', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.applyCode) ? cpAfterJaFromGet.applyCode : '',     
											rules: [
												{
													required: false,   
													message: '请输入售后申请单号',
												},
											],
										})(<Input disabled  />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后次数'>
                {getFieldDecorator('entrustNumber', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.entrustNumber) ? cpAfterJaFromGet.entrustNumber : '',     
											rules: [
												{
													required: false,   
													message: '请输入售后次数',
												},
											],
										})(<Input disabled  />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="质保终止日期">
                {getFieldDecorator('endDate', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.endDate) ? cpAfterJaFromGet.endDate : null,
										})(
											<Input disabled/>
//   <DatePicker
//     disabled
//     
//     format="YYYY-MM-DD"
//     style={{ width: '100%' }}
//   />
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后类型'>
                {getFieldDecorator('entrustType', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.entrustType) ? cpAfterJaFromGet.entrustType : '',     
											rules: [
												{
													required: true,   
													message: '请输入售后类型',
												},
											],
										})(
  <Select
    style={{ width: '100%' }}
    disabled
    allowClear
  >
    {
													isNotBlank(this.state.interiorType) && this.state.interiorType.length > 0 && this.state.interiorType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='本次故障描述'>
                {getFieldDecorator('z', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.z) ? cpAfterJaFromGet.z : '',     
											rules: [
												{
													required: false,   
													message: '请输入本次故障描述',
													max: 5000,
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后地址'>
                {getFieldDecorator('afterAddress', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.afterAddress) ? cpAfterJaFromGet.afterAddress : '',     
											rules: [
												{
													required: false,   
													message: '请输入售后地址',
													max: 500,
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系人'>
                {getFieldDecorator('linkman', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.linkman) ? cpAfterJaFromGet.linkman : '',     
											rules: [
												{
													required: false,   
													message: '请输入联系人',
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='电话'>
                {getFieldDecorator('phone', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.phone) ? cpAfterJaFromGet.phone : '',     
											rules: [
												{
													required: false,   
													message: '请输入电话',
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="计划开始日期">
                {getFieldDecorator('planStartDate', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.planStartDate) ? moment(cpAfterJaFromGet.planStartDate) : null,
										})(
  <DatePicker
    disabled={updataflag}
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="计划结束日期">
                {getFieldDecorator('planEndDate', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.planEndDate) ? moment(cpAfterJaFromGet.planEndDate) : null,
										})(
  <DatePicker
    disabled={updataflag}
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='计划人数'>
                {getFieldDecorator('planNumber', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.planNumber) ? cpAfterJaFromGet.planNumber : '',     
											rules: [
												{
													required: false,   
													message: '请输入计划人数',
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='处理方式'>
                {getFieldDecorator('processMode', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.processMode) ? cpAfterJaFromGet.processMode : '',     
											rules: [
												{
													required: false,   
													message: '请输入处理方式',
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后人员'>
                <Input  disabled value={isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.afterUser) && isNotBlank(cpAfterJaFromGet.afterUser.name) ? cpAfterJaFromGet.afterUser.name : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后安排'>
                {getFieldDecorator('afterArrangement', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.afterArrangement) ? cpAfterJaFromGet.afterArrangement : '',     
											rules: [
												{
													required: false,   
													message: '请输入售后安排',
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='维修方案'>
                {getFieldDecorator('maintenancePlan', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.maintenancePlan) ? cpAfterJaFromGet.maintenancePlan : '',     
											rules: [
												{
													required: false,   
													message: '请输入维修方案',
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='旧件返回日期'>
                {getFieldDecorator('oldTime', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.oldTime) ? moment(cpAfterJaFromGet.oldTime) : '',     
											rules: [
												{
													required: false,   
													message: '请输入旧件返回日期',
												},
											],
										})(
  <DatePicker
    disabled={orderflag && updataflag}
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='现场描述'>
                {getFieldDecorator('sceneDescription', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.sceneDescription) ? cpAfterJaFromGet.sceneDescription : '',     
											rules: [
												{
													required: false,   
													message: '请输入现场描述',
													max: 500,
												},
											],
										})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="故障图片" className="allimgstyle">
                <Upload
                  disabled={updataflag}
                  accept="image/*"
                  onChange={this.handleUploadChange}
                  onRemove={this.handleRemove}
                  beforeUpload={this.handlebeforeUpload}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={this.handlePreview}
                >
                  {(isNotBlank(fileList) && fileList.length >= 4) || (true && updataflag) ? null : uploadButton}
                </Upload>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="更换内容" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='更换配件'>
                {getFieldDecorator('changePj', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.changePj) ? cpAfterJaFromGet.changePj : '',     
											rules: [
												{
													required: false,   
													message: '请输入更换配件',
												},
											],
										})(
  <Select
    style={{ width: '100%' }}
    disabled={updataflag}
    allowClear
  >
    <Option key='0' value='否'>否</Option>
    <Option key='1' value='是'>是</Option>
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='更换总成'>
                {getFieldDecorator('changeZc', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.changeZc) ? cpAfterJaFromGet.changeZc : '',     
											rules: [
												{
													required: false,   
													message: '请输入更换总成',
												},
											],
										})(
  <Select
    style={{ width: '100%' }}
    disabled={updataflag}
    allowClear
  >
    <Option key='0' value='否'>否</Option>
    <Option key='1' value='是'>是</Option>
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='报件内容' className="allinputstyle">
                {getFieldDecorator('quoteDescription', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.quoteDescription) ? cpAfterJaFromGet.quoteDescription : '',     
											rules: [
												{
													required: false,   
													message: '请输入报件内容',
													max: 500,
												},
											],
										})(<TextArea rows={2}  disabled={updataflag} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="处理方法" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='处理方法描述' className="allinputstyle">
                {getFieldDecorator('disposeDescription', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.disposeDescription) ? cpAfterJaFromGet.disposeDescription : '',     
											rules: [
												{
													required: false,   
													message: '请输入处理方法描述',
													max: 500,
												},
											],
										})(<TextArea rows={2}  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="完工图片" className="allimgstyle">
                <Upload
                  disabled={orderflag && updataflag}
                  accept="image/*"
                  onChange={this.handleUploadChange1}
                  onRemove={this.handleRemove1}
                  beforeUpload={this.handlebeforeUpload1}
                  fileList={fileList1}
                  listType="picture-card"
                  onPreview={this.handlePreview1}
                >
                  {(isNotBlank(fileList1) && fileList1.length >= 4) || (orderflag && updataflag) ? null : uploadButton}
                </Upload>
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='物流' className="allinputstyle">
                {getFieldDecorator('logistics', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.logistics) ? cpAfterJaFromGet.logistics : '',     
											rules: [
												{
													required: false,   
													message: '请输入物流',
												},
											],
										})(<TextArea  rows={2} disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='改善方案' className="allinputstyle">
                {getFieldDecorator('program', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.program) ? cpAfterJaFromGet.program : '',     
											rules: [
												{
													required: false,   
													message: '请输入改善方案',
													max: 5000,
												},
											],
										})(<TextArea  rows={2} disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="业务员信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务员'>
                <Input
                  style={{ width: '100%' }}
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.user) ? cpAfterJaFromGet.user.name : getStorage('username'))}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='编号'>
                <Input
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.user) ? cpAfterJaFromGet.user.no : getStorage('userno'))}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系方式'>
                <Input
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.user) ? cpAfterJaFromGet.user.phone : getStorage('phone'))}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属大区'>
                <Input
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.user) && isNotBlank(cpAfterJaFromGet.user.area) ? cpAfterJaFromGet.user.area.name : getStorage('companyname'))}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属公司'>
                <Input
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.user) && isNotBlank(cpAfterJaFromGet.user.office) ? cpAfterJaFromGet.user.office.name : getStorage('companyname'))}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属区域'>
                <Input
                  disabled
                  value={isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.user) && isNotBlank(cpAfterJaFromGet.user.areaName) ? cpAfterJaFromGet.areaName : getStorage('areaname')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属部门'>
                <Input
                  disabled
                  value={isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.user) && isNotBlank(cpAfterJaFromGet.user.dept) ? cpAfterJaFromGet.user.dept.name : getStorage('deptname')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="客户信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                <Input
                  style={{ width: '100%' }}
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.client) ? cpAfterJaFromGet.client.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户分类'>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.client) && isNotBlank(cpAfterJaFromGet.client.classify) ? cpAfterJaFromGet.client.classify : '')}
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
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.client) ? cpAfterJaFromGet.client.code : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系人'>
                <Input
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.client) ? cpAfterJaFromGet.client.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系地址'>
                <Input
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.client) ? cpAfterJaFromGet.client.address : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='移动电话'>
                <Input
                  disabled
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.client) ? cpAfterJaFromGet.client.phone : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="总成信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成型号'>
                <Input
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assmblyBuild) && isNotBlank(cpAfterJaFromGet.assmblyBuild.assemblyModel) ? cpAfterJaFromGet.assmblyBuild.assemblyModel : '')}
                  
disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成号'>
                <Input
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assmblyBuild) && isNotBlank(cpAfterJaFromGet.assmblyBuild.assemblyCode) ? cpAfterJaFromGet.assmblyBuild.assemblyCode : '')}
                  
disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成品牌'>
                <Input
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assmblyBuild) && isNotBlank(cpAfterJaFromGet.assmblyBuild.assemblyBrand) ? cpAfterJaFromGet.assmblyBuild.assemblyBrand : '')}
                  
disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型/排量'>
                <Input
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assmblyBuild) && isNotBlank(cpAfterJaFromGet.assmblyBuild.vehicleModel) ? cpAfterJaFromGet.assmblyBuild.vehicleModel : '')}
                  
disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                <Input
                  value={(isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assmblyBuild) && isNotBlank(cpAfterJaFromGet.assmblyBuild.assemblyYear) ? cpAfterJaFromGet.assmblyBuild.assemblyYear : '')}
                  
disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='进场类型'>
                {getFieldDecorator('assemblyEnterType', {
											initialValue: (isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assemblyEnterType) ? cpAfterJaFromGet.assemblyEnterType : ''),     
											rules: [
												{
													required: false,   
													message: '请输入进场类型',
												},
											],
										})(<Select
  allowClear
  disabled
  style={{ width: '100%' }}
										>
  {
												isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='钢印号'>
                {getFieldDecorator('assemblySteelSeal', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assemblySteelSeal) ? cpAfterJaFromGet.assemblySteelSeal : '',     
											rules: [
												{
													required: false,   
													message: '请输入钢印号',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='VIN码'>
                {getFieldDecorator('assemblyVin', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assemblyVin) ? cpAfterJaFromGet.assemblyVin : '',     
											rules: [
												{
													required: false,   
													message: '请输入VIN码',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='其他识别信息'>
                {getFieldDecorator('assemblyMessage', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assemblyMessage) ? cpAfterJaFromGet.assemblyMessage : '',     
											rules: [
												{
													required: false,   
													message: '请输入其他识别信息',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='故障代码'>
                {getFieldDecorator('assemblyFaultCode', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.assemblyFaultCode) ? cpAfterJaFromGet.assemblyFaultCode : '',     
											rules: [
												{
													required: false,   
													message: '请输入故障代码',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
											initialValue: isNotBlank(cpAfterJaFromGet) && isNotBlank(cpAfterJaFromGet.remarks) ? cpAfterJaFromGet.remarks : '',     
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
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterJaFrom').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterJaFrom')[0].children.filter(item => item.name == '二次修改')
									.length > 0 &&
								<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
								</Button>
							}
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterJaFrom').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterJaFrom')[0].children.filter(item => item.name == '修改')
									.length > 0 && <span>
  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
										保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
										提交
  </Button>
  {orderflag &&
  <Button style={{ marginLeft: 8 }} loading={submitting1 || submitting2} onClick={() => this.onUndo(cpAfterJaFromGet.id)}>
											撤销
  </Button>
									}
</span>}
          <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
								返回
          </Button>
        </FormItem>
      </Form>
    </Card>
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
export default CpAfterJaFromForm;
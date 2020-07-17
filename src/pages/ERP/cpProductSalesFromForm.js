import React, { PureComponent } from 'react';
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
	Col,Row
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpProductSalesFromForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpProductSalesFrom, loading }) => ({
	...cpProductSalesFrom,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpProductSalesFrom/cpProductSalesFrom_Add'],
	submitting2: loading.effects['cpupdata/cpProductSalesFrom_update'],
}))
@Form.create()
class CpProductSalesFromForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			orderflag: false,
			updataflag:true,
			updataname:'取消锁定',
			confirmflag :true,
			location: getLocation()
		}
	}

	componentDidMount() {
		console.log('componentDidMount')
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpProductSalesFrom/cpProductSalesFrom_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (
						res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
						||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductSalesFrom').length>0
						&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductSalesFrom')[0].children.filter(item=>item.name=='修改')
						.length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
					dispatch({
						type: 'sysarea/getFlatCode',
						payload:{
						id:location.query.id,
						type:'ZCTH'
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
						id:isNotBlank(res.data)&&isNotBlank(res.data.purchaseCode)?res.data.purchaseCode:'',
						type:'ZCTH'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg1:imgres
						})
						}
						})
				}
			});
		}
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
			type: 'cpProductSalesFrom/clear',
		});
	}

	handleSubmit = e => {
		const { dispatch, form, cpProductSalesFromGet } = this.props;
		const { addfileList, location ,updataflag} = this.state;
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
				value.storage = {}
				value.storage.id = isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.storage)
					&& isNotBlank(cpProductSalesFromGet.storage.id) ? cpProductSalesFromGet.storage.id : ''
				value.orderStatus = 1
				if(updataflag){
				dispatch({
					type: 'cpProductSalesFrom/cpProductSalesFrom_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/warehouse/process/cp_product_sales_from_form?id=${location.query.id}`);
						// router.push('/warehouse/process/cp_product_sales_from_list');
					}
				})
			}else{
				dispatch({
					type: 'cpupdata/cpProductSalesFrom_update',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/warehouse/process/cp_product_sales_from_form?id=${location.query.id}`);
						// router.push('/warehouse/process/cp_product_sales_from_list');
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
			router.push(`/warehouse/process/cp_product_sales_from_form?id=${location.query.id}`);
		}
	}

	onsave = () => {
		const { dispatch, form, cpProductSalesFromGet } = this.props;
		const { addfileList, location ,updataflag} = this.state;
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
				value.storage = {}
				value.storage.id = isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.storage)
					&& isNotBlank(cpProductSalesFromGet.storage.id) ? cpProductSalesFromGet.storage.id : ''
			if(updataflag){
					value.orderStatus = 0
				dispatch({
					type: 'cpProductSalesFrom/cpProductSalesFrom_Add',
					payload: { ...value },
					callback: () => {
					}
				})
			}else{
				value.orderStatus = 1
				dispatch({
					type: 'cpupdata/cpProductSalesFrom_update',
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
		router.push('/warehouse/process/cp_product_sales_from_list');
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

	onRevocation = (record) => {
		Modal.confirm({
			title: '撤销该总成退货单',
			content: '确定撤销该总成退货单吗？',
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
				type: 'cpRevocation/cpProductSalesFrom_Revocation',
				payload: { id  },
				callback: () => {
					this.setState({
						addfileList: [],
						fileList: [],
					});
					router.push(`/warehouse/process/cp_product_sales_from_form?id=${location.query.id}`);
				}
			})
		}
	}
	}

	goprint = () => {
		const { location } = this.state
		const w = window.open('about:blank')
		w.location.href = `/#/zc_madeUp_GoodsReturn?id=${location.query.id}`
	}

	render() {
		const { fileList, previewVisible, previewImage, orderflag ,updataflag,updataname ,srcimg,srcimg1} = this.state;
		const {submitting2,submitting1, submitting, cpProductSalesFromGet } = this.props;
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
      <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
总成退货单
      </div>	
      {isNotBlank(cpProductSalesFromGet)&&isNotBlank(cpProductSalesFromGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
        </span><img src={isNotBlank(srcimg)?getFullUrl(`/${srcimg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                                </div>}
      {isNotBlank(cpProductSalesFromGet)&&isNotBlank(cpProductSalesFromGet.purchaseCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
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
                  value={isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.orderStatus) ? ((cpProductSalesFromGet.orderStatus === 0 || cpProductSalesFromGet.orderStatus === '0') ? '未处理' : '已处理') : ''}
                  style={cpProductSalesFromGet.orderStatus === 1 || cpProductSalesFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='采购单号'>
                {getFieldDecorator('oldCode', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.oldCode) ? cpProductSalesFromGet.oldCode : '',     
								rules: [
									{
										required: true,   
										message: '请输入采购单号',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='入库单号'>
                {getFieldDecorator('zcPurchaseCode', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.zcPurchaseCode) ? cpProductSalesFromGet.zcPurchaseCode : '',     
								rules: [
									{
										required: true,   
										message: '请输入入库单号',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='供应商'>
                <Input  disabled value={isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.supplier)  && isNotBlank(cpProductSalesFromGet.supplier.name)? cpProductSalesFromGet.supplier.name : ''} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
                {getFieldDecorator('project', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.project) ? cpProductSalesFromGet.assemblyBuild.project : '',     
								rules: [
									{
										required: false,   
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
              <FormItem {...formItemLayout} label='总成型号'>
                {getFieldDecorator('assemblyModel', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.assemblyModel) ? cpProductSalesFromGet.assemblyBuild.assemblyModel : '',     
								rules: [
									{
										required: false,   
										message: '请输入总成型号',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成号'>
                {getFieldDecorator('assemblyCode', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.assemblyCode) ? cpProductSalesFromGet.assemblyBuild.assemblyCode : '',     
								rules: [
									{
										required: false,   
										message: '请输入总成号',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='大号'>
                {getFieldDecorator('maxCode', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.maxCode) ? cpProductSalesFromGet.assemblyBuild.maxCode : '',     
								rules: [
									{
										required: false,   
										message: '请输入大号',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='小号'>
                {getFieldDecorator('minCode', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.minCode) ? cpProductSalesFromGet.assemblyBuild.minCode : '',     
								rules: [
									{
										required: false,   
										message: '请输入小号',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成分类'>
                {getFieldDecorator('assemblyType', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.assemblyType) ? cpProductSalesFromGet.assemblyBuild.assemblyType : '',     
								rules: [
									{
										required: false,   
										message: '请输入总成分类',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型'>
                {getFieldDecorator('vehicleModel', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.vehicleModel) ? cpProductSalesFromGet.assemblyBuild.vehicleModel : '',     
								rules: [
									{
										required: false,   
										message: '请输入车型',
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
                {getFieldDecorator('assemblyBrand', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.assemblyBrand) ? cpProductSalesFromGet.assemblyBuild.assemblyBrand : '',     
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
              <FormItem {...formItemLayout} label='年份'>
                {getFieldDecorator('assemblyYear', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.assemblyBuild) && isNotBlank(cpProductSalesFromGet.assemblyBuild.assemblyYear) ? cpProductSalesFromGet.assemblyBuild.assemblyYear : '',     
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
              <FormItem {...formItemLayout} label='开票类型'>
                {getFieldDecorator('makeNeed', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.makeNeed) ? cpProductSalesFromGet.makeNeed : '',     
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
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.storage) && isNotBlank(cpProductSalesFromGet.storage.entrepotName) ? cpProductSalesFromGet.storage.entrepotName : '',     
								rules: [
									{
										required: true,   
										message: '请输入仓库',
										max: 255,
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='库位'>
                {getFieldDecorator('storageId', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.storage) && isNotBlank(cpProductSalesFromGet.storage.name) ? cpProductSalesFromGet.storage.name : '',     
								rules: [
									{
										required: true,   
										message: '请输入库位',
										max: 255,
									},
								],
							})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='数量'>
                {getFieldDecorator('number', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.number) ? cpProductSalesFromGet.number : '',     
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
                <Input  disabled value={isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.money) ? getPrice(cpProductSalesFromGet.money) : ''} />
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                {getFieldDecorator('remarks', {
								initialValue: isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.remarks) ? cpProductSalesFromGet.remarks : '',     
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
		  {isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.id) &&
          <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
									打印
          </Button>}
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductSalesFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductSalesFrom')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
						<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
	}
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductSalesFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductSalesFrom')[0].children.filter(item=>item.name=='修改')
.length>0&&<span>
  <Button style={{ marginLeft: 8 }} type="primary" onClick={() => { this.onsave() }} loading={submitting1||submitting2} disabled={orderflag&&updataflag}>
								保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1||submitting2} disabled={orderflag&&updataflag}>
								提交
  </Button>
  {
								isNotBlank(cpProductSalesFromGet) && isNotBlank(cpProductSalesFromGet.orderStatus) && (cpProductSalesFromGet.orderStatus === 1 || cpProductSalesFromGet.orderStatus === '1') ?
  <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpProductSalesFromGet.id)} loading={submitting1||submitting2}>
										撤销
  </Button> : null
							}
</span>}
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
  </PageHeaderWrapper>
		);
	}
}
export default CpProductSalesFromForm;
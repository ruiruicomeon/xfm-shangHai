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
  Row,Col
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl,getLocation ,getPrice} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpProductQuitFromForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpProductQuitFrom, loading }) => ({
  ...cpProductQuitFrom,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpProductQuitFrom/cpProductQuitFrom_Add'],
  submitting2: loading.effects['cpupdata/cpProductQuitFrom_update'],
}))
@Form.create()
class CpProductQuitFromForm extends PureComponent {
 constructor(props) {
    super(props);
    this.state = {
    previewVisible: false,
    previewImage: {},
	addfileList: [],
	orderflag:false,
  updataflag:true,
  confirmflag1:true,
			updataname:'取消锁定',
    location:getLocation()
  }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const {location } =this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpProductQuitFrom/cpProductQuitFrom_Get',
        payload: {
          id: location.query.id,
		},
		callback:(res)=>{
			if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
			||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductQuitFrom').length>0
			&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductQuitFrom')[0].children.filter(item=>item.name=='修改')
			.length==0)) {
				this.setState({ orderflag: true })
			} else {
				this.setState({ orderflag: false })
			}
			dispatch({
				type: 'sysarea/getFlatCode',
				payload:{
				id:location.query.id,
				type:'ZCTL'
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
				id:isNotBlank(res.data)&&isNotBlank(res.data.zcPurchaseSalesCode)?res.data.zcPurchaseSalesCode:'',
				type:'ZCTL'
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
			make_need : data
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
      type: 'cpProductQuitFrom/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location ,updataflag } = this.state;
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
		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
		}
		value.orderStatus = 1
		if(updataflag){	
        dispatch({
          type:'cpProductQuitFrom/cpProductQuitFrom_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/warehouse/process/cp_product_quit_from_form?id=${location.query.id}`);
            // router.push('/warehouse/process/cp_product_quit_from_list');
          }
		})
	}else{
		dispatch({
			type:'cpupdata/cpProductQuitFrom_update',
			payload: { ...value },
			callback: () => {
			  this.setState({
				addfileList: [],
				fileList: [],
        });
        router.push(`/warehouse/process/cp_product_quit_from_form?id=${location.query.id}`);
			  // router.push('/warehouse/process/cp_product_quit_from_list');
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
		router.push(`/warehouse/process/cp_product_quit_from_form?id=${location.query.id}`);
	}
}

  onsave = () => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location ,updataflag} = this.state;
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
		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
		}
		if(updataflag){
		value.orderStatus = 0
        dispatch({
          type:'cpProductQuitFrom/cpProductQuitFrom_Add',
          payload: { ...value },
          callback: () => {
          }
		})
	}else{
		value.orderStatus = 1
		dispatch({
			type:'cpupdata/cpProductQuitFrom_update',
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
    router.push('/warehouse/process/cp_product_quit_from_list');
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
		title: '撤销该总成退料单',
		content: '确定撤销该总成退料单吗？',
		okText: '确认',
		okType: 'danger',
		cancelText: '取消',
		onOk: () => this.onUndo(record),
	});
}

onUndo = (id) => {
  const { dispatch } = this.props;
  const {confirmflag1,location}= this.state
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
	if (isNotBlank(id)) {
		dispatch({
			type: 'cpRevocation/cpProductQuitFrom_Revocation',
			payload: { id  },
			callback: () => {
				this.setState({
					addfileList: [],
					fileList: [],
        });
        router.push(`/warehouse/process/cp_product_quit_from_form?id=${location.query.id}`);
				// router.push('/warehouse/process/cp_product_quit_from_list');
			}
		})
  }
}
}

goprint = () => {
  const { location } = this.state
  const w = window.open('about:blank')
  w.location.href = `/#/zc_madeUp_MaterialReturn?id=${location.query.id}`
}

  render() {
    const { fileList, previewVisible, previewImage ,orderflag ,updataflag,updataname,srcimg,srcimg1} = this.state;
    const {submitting1,submitting2, submitting, cpProductQuitFromGet } = this.props;
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
总成退料单
          </div>
          {isNotBlank(cpProductQuitFromGet)&&isNotBlank(cpProductQuitFromGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
            </span><img src={isNotBlank(srcimg)?getFullUrl(`/${srcimg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                                  </div>}
          {isNotBlank(cpProductQuitFromGet)&&isNotBlank(cpProductQuitFromGet.zcPurchaseSalesCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
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
                      value={isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.orderStatus) ? ((cpProductQuitFromGet.orderStatus === 0 || cpProductQuitFromGet.orderStatus === '0') ? '未处理' : '已处理') : ''} 
                      style={cpProductQuitFromGet.orderStatus === 1 || cpProductQuitFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购单号'>
                    {getFieldDecorator('oldCode', {
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.oldCode) ? cpProductQuitFromGet.oldCode : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入采购单号',
					  },
					],
				  })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='出库单号'>
                    {getFieldDecorator('zcPurchaseSalesCode', {
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.zcPurchaseSalesCode) ? cpProductQuitFromGet.zcPurchaseSalesCode : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入出库单号',
					  },
					],
				  })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商'>
                    {getFieldDecorator('supplierId', {
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.client) && isNotBlank(cpProductQuitFromGet.client.name)? cpProductQuitFromGet.client.name : '',     
					rules: [
					  {
						required:  false ,   
						message: '供应商',
					  },
					],
				  })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务项目'>
                    {getFieldDecorator('project', {
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.project) ? cpProductQuitFromGet.assemblyBuild.project : '',     
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
                  <FormItem {...formItemLayout} label='总成型号'>
                    {getFieldDecorator('assemblyModel', {
					initialValue: isNotBlank(cpProductQuitFromGet)&& isNotBlank(cpProductQuitFromGet.assemblyBuild) && isNotBlank(cpProductQuitFromGet.assemblyBuild.assemblyModel) ? cpProductQuitFromGet.assemblyBuild.assemblyModel : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.assemblyCode) ? cpProductQuitFromGet.assemblyBuild.assemblyCode : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.maxCode) ? cpProductQuitFromGet.assemblyBuild.maxCode : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.minCode) ? cpProductQuitFromGet.assemblyBuild.minCode : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.assemblyType) ? cpProductQuitFromGet.assemblyBuild.assemblyType : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.vehicleModel) ? cpProductQuitFromGet.assemblyBuild.vehicleModel : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.assemblyBrand) ? cpProductQuitFromGet.assemblyBuild.assemblyBrand : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.assemblyBuild)&& isNotBlank(cpProductQuitFromGet.assemblyBuild.assemblyYear) ? cpProductQuitFromGet.assemblyBuild.assemblyYear : '',     
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.makeNeed) ? cpProductQuitFromGet.makeNeed : '',     
					rules: [
					  {
						required:  true ,   
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.storage)&& isNotBlank(cpProductQuitFromGet.storage.entrepotName) ? cpProductQuitFromGet.storage.entrepotName : '',     
					rules: [
					  {
						required:  true ,   
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.storage)&& isNotBlank(cpProductQuitFromGet.storage.name) ? cpProductQuitFromGet.storage.name : '',     
					rules: [
					  {
						required:  true ,   
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
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.number) ? cpProductQuitFromGet.number : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入数量',
					  },
					],
				  })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='金额'>
                    <Input disabled  value={isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.money) ? getPrice(cpProductQuitFromGet.money) : ''} />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                    {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.remarks) ? cpProductQuitFromGet.remarks : '',     
					rules: [
					  {
						required:  false ,
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
              {isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.id) &&
          <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
									打印
          </Button>}
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductQuitFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductQuitFrom')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
				<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
  }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductQuitFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpProductQuitFrom')[0].children.filter(item=>item.name=='修改')
.length>0&&<span>
  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} loading={submitting2||submitting1} disabled={orderflag&&updataflag}>
					 保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting2||submitting1} disabled={orderflag&&updataflag}>
					提交
  </Button>
  {
								isNotBlank(cpProductQuitFromGet) && isNotBlank(cpProductQuitFromGet.orderStatus) && (cpProductQuitFromGet.orderStatus === 1 || cpProductQuitFromGet.orderStatus === '1') ?
  <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpProductQuitFromGet.id)} loading={submitting2||submitting1}>
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
export default CpProductQuitFromForm;
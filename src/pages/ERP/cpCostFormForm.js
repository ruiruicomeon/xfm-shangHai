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
  Modal,
  Row,Col
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl,getLocation ,getPrice} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpCostFormForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpCostForm, loading }) => ({
  ...cpCostForm,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpCostFormForm extends PureComponent {
 constructor(props) {
    super(props);
    this.state = {
    previewVisible: false,
    previewImage: {},
	addfileList: [],
	orderflag:false,
	updataflag:true,
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
        type: 'cpCostForm/cpCostForm_Get',
        payload: {
          id: location.query.id,
		},
		callback:(res)=>{
			if (
				res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
				||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCostForm').length>0
				&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCostForm')[0].children.filter(item=>item.name=='修改')
				.length==0)) {
						  this.setState({ orderflag: true })
					  } else {
						  this.setState({ orderflag: false })
			}
	dispatch({
		type: 'sysarea/getFlatCode',
		payload:{
		id:location.query.id,
		type:'CBD'
		},
		callback:(imgres)=>{
		this.setState({
		srcimg:imgres
		})
		}
		})
	dispatch({
		type: 'sysarea/getFlatOrderdCode',
		payload:{
		id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
		type:'CBD'
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
			type: 'business_project',
		  },
		  callback: data => {
			this.setState({
			  business_project : data
          })
        }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'business_type',
		  },
		  callback: data => {
			this.setState({
			  business_type : data
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
			  del_flag : data
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
      type: 'cpCostForm/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location,updataflag} = this.state;
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
          type:'cpCostForm/cpCostForm_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/warehouse/process/cp_cost_form_list');
          }
		})
	}else{
		dispatch({
			type:'cpupdata/cpCostForm_update',
			payload: { ...value },
			callback: () => {
			  this.setState({
				addfileList: [],
				fileList: [],
			  });
			  router.push('/warehouse/process/cp_cost_form_list');
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
		router.push(`/warehouse/process/cp_cost_form_form?id=${location.query.id}`);
	}
}

  onsave = () => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location ,updataflag } = this.state;
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
          type:'cpCostForm/cpCostForm_Add',
          payload: { ...value },
          callback: () => {
          }
		})
	}else{
		value.orderStatus = 1
		dispatch({
			type:'cpupdata/cpCostForm_update',
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
    router.push('/warehouse/process/cp_cost_form_list');
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

  onUndo=id=>{
	Modal.confirm({
		title: '撤销该成本单',
		content: '确定撤销该成本单吗',
		okText: '确认',
		okType: 'danger',
		cancelText: '取消',
		onOk: () => this.undoClick(id),
	});
}

undoClick=id=>{
	const { dispatch } = this.props
	dispatch({
		type: 'cpRevocation/cpCostForm_Revocation',
		payload: {
			id
		},
		callback: () => {
			router.push('/warehouse/process/cp_cost_form_list');
		}
	})
}

  render() {
    const { fileList, previewVisible, previewImage ,orderflag ,updataflag,updataname,srcimg,srcimg1} = this.state;
    const { submitting, cpCostFormGet } = this.props;
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
成本单
          </div>
          {isNotBlank(cpCostFormGet)&&isNotBlank(cpCostFormGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
            </span><img src={isNotBlank(srcimg)&&isNotBlank(srcimg.msg)?getFullUrl(`/${srcimg.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                    </div>}
          {isNotBlank(cpCostFormGet)&&isNotBlank(cpCostFormGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
            </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                           </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" bordered={false}>  
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.orderCode) ? cpCostFormGet.orderCode : '',     
					rules: [
					  {
						required:  false ,   
						message: '请输入订单编号',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务项目'>
                    {getFieldDecorator('project', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.project) ? cpCostFormGet.assmblyBuild.project : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入业务项目',
					  },
					],
				  })(<Select
  allowClear
  disabled
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
					initialValue: isNotBlank(cpCostFormGet)&& isNotBlank(cpCostFormGet.assmblyBuild) && isNotBlank(cpCostFormGet.assmblyBuild.assemblyModel) ? cpCostFormGet.assmblyBuild.assemblyModel : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成型号',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成号'>
                    {getFieldDecorator('assemblyCode', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.assemblyCode) ? cpCostFormGet.assmblyBuild.assemblyCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成号',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='大号'>
                    {getFieldDecorator('maxCode', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.maxCode) ? cpCostFormGet.assmblyBuild.maxCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入大号',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='小号'>
                    {getFieldDecorator('minCode', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.minCode) ? cpCostFormGet.assmblyBuild.minCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入小号',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成分类'>
                    {getFieldDecorator('assemblyType', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.assemblyType) ? cpCostFormGet.assmblyBuild.assemblyType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成分类',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车型'>
                    {getFieldDecorator('vehicleModel', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.vehicleModel) ? cpCostFormGet.assmblyBuild.vehicleModel : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入车型',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='品牌'>
                    {getFieldDecorator('assemblyBrand', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.assemblyBrand) ? cpCostFormGet.assmblyBuild.assemblyBrand : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入品牌',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='年份'>
                    {getFieldDecorator('assemblyYear', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.assmblyBuild)&& isNotBlank(cpCostFormGet.assmblyBuild.assemblyYear) ? cpCostFormGet.assmblyBuild.assemblyYear : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入年份',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    {getFieldDecorator('clientId', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.client) ? cpCostFormGet.client.name: '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入客户',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总金额'>
                    <Input  disabled value={isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.money) ? getPrice(cpCostFormGet.money) : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成成本'>
                    {getFieldDecorator('zccb', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.zcMoney) ? getPrice(cpCostFormGet.zcMoney) : '',     
					rules: [
					  {
						required:   false ,   
						message: '总成成本',
						max: 255,
					  },
					],
				  })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='配件合计金额'>
                    <Input  disabled value={isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.pjTotalMoney) ?getPrice(cpCostFormGet.pjTotalMoney) : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='内部订单编号'>
                    {getFieldDecorator('interiorOrderCode', {
					initialValue: isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.interiorOrderCode) ? cpCostFormGet.interiorOrderCode : '',     
					rules: [
					  {
						required:  false ,   
						message: '请输入内部订单编号',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='内部订单成本金额'>
                    <Input  disabled value={isNotBlank(cpCostFormGet) && isNotBlank(cpCostFormGet.interiorMoney) ? getPrice(cpCostFormGet.interiorMoney) : ''} />
                  </FormItem>
                </Col>
              </Row>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 ,textAlign:'center' }}>
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
export default CpCostFormForm;
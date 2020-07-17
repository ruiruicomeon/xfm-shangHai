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
  DatePicker,
  Col,Row
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl,getLocation ,getPrice} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpPlantSceneFromForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpPlantSceneFrom, loading }) => ({
  ...cpPlantSceneFrom,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpPlantSceneFromForm extends PureComponent {
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
        type: 'cpPlantSceneFrom/cpPlantSceneFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback:(res)=>{
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
          ||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPlantSceneFrom').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPlantSceneFrom')[0].children.filter(item=>item.name=='修改')
          .length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload:{
            id:location.query.id,
            type:'CJXC'
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
            type:'CJXC'
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
			type: 'stirage_type',
		  },
		  callback: data => {
			this.setState({
			  stirage_type : data
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
      type: 'cpPlantSceneFrom/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location ,updataflag} = this.state;
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
          type:'cpPlantSceneFrom/cpPlantSceneFrom_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/warehouse/process/cp_plantScene_from_list');
          }
        })
      }else{
        dispatch({
          type:'cpupdata/cpPlantSceneFrom_update',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/warehouse/process/cp_plantScene_from_list');
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
			router.push(`/warehouse/process/cp_plantScene_from_form?id=${location.query.id}`);
		}
	}

  onsave = () => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location,updataflag } = this.state;
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
          type:'cpPlantSceneFrom/cpPlantSceneFrom_Add',
          payload: { ...value },
          callback: () => {
          }
        })
      }else{
        value.orderStatus = 1
        dispatch({
          type:'cpupdata/cpPlantSceneFrom_update',
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
    router.push('/warehouse/process/cp_plantScene_from_list');
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
      title: '撤销该车间现场库',
      content: '确定撤销该车间现场库吗',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(id),
    });
  }

  undoClick=id=>{
    const { dispatch } = this.props
    dispatch({
      type: 'cpRevocation/cpPlantSceneFrom_Revocation',
      payload: {
        id
      },
      callback: () => {
        router.push('/warehouse/process/cp_plantScene_from_list');
      }
    })
  }

  render() {
    const { fileList, previewVisible, previewImage ,orderflag ,updataflag,updataname,srcimg,srcimg1} = this.state;
    const { submitting, cpPlantSceneFromGet } = this.props;
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
配件车间现场库
          </div>
          {isNotBlank(cpPlantSceneFromGet)&&isNotBlank(cpPlantSceneFromGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
            </span><img src={isNotBlank(srcimg)&&isNotBlank(srcimg.msg)?getFullUrl(`/${srcimg.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                                </div>}
          {isNotBlank(cpPlantSceneFromGet)&&isNotBlank(cpPlantSceneFromGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
            </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                                       </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" bordered={false}> 
              <Row>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="入库时间">
                    <DatePicker
                      disabled
                      value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.startDate) ? moment(cpPlantSceneFromGet.startDate):null}
                      
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="出库时间">
                    <DatePicker
                      disabled
                      value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.endDate) ? moment(cpPlantSceneFromGet.endDate):null}
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='类型'>
                    {getFieldDecorator('type', {
					initialValue: isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.type) ? cpPlantSceneFromGet.type : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入类型',
					  },
					],
				  })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单单号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
					initialValue: isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.orderCode) ? cpPlantSceneFromGet.orderCode : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入订单单号',
					  },
					],
				  })(<Input disabled   />)}
                  </FormItem>
                </Col>
                {isNotBlank(cpPlantSceneFromGet)&&isNotBlank(cpPlantSceneFromGet.type)&&(cpPlantSceneFromGet.type=='内部订单配件'||cpPlantSceneFromGet.type=='内部订单总成')&&
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    <Input disabled  value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.createBy)&& isNotBlank(cpPlantSceneFromGet.createBy.name) ? cpPlantSceneFromGet.createBy.name: ''} />
                  </FormItem>
                </Col>
        }
                {!(isNotBlank(cpPlantSceneFromGet)&&isNotBlank(cpPlantSceneFromGet.type)&&(cpPlantSceneFromGet.type=='内部订单配件'||cpPlantSceneFromGet.type=='内部订单总成'))&&
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    <Input disabled  value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.client)&& isNotBlank(cpPlantSceneFromGet.client.name) ? cpPlantSceneFromGet.client.name: ''} />
                  </FormItem>
                </Col>
        }
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='配件仓库'>
                    <Input disabled value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.pjStorage) && isNotBlank(cpPlantSceneFromGet.pjStorage.entrepotName)? cpPlantSceneFromGet.pjStorage.entrepotName : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='配件库位'>
                    <Input disabled value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.pjStorage) && isNotBlank(cpPlantSceneFromGet.pjStorage.name)? cpPlantSceneFromGet.pjStorage.name : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='物料'>
                    <Input disabled  value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.bill) && isNotBlank(cpPlantSceneFromGet.bill.name)? cpPlantSceneFromGet.bill.name : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='出库类型'>
                    <Input disabled  value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.stirageType) ?cpPlantSceneFromGet.stirageType: ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单价'>
                    <Input disabled  value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.price) ? getPrice(cpPlantSceneFromGet.price) : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='数量'>
                    <Input disabled  value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.number) ? cpPlantSceneFromGet.number : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='金额'>
                    <Input disabled  value={isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.money) ?getPrice(cpPlantSceneFromGet.money) : ''} />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                    {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpPlantSceneFromGet) && isNotBlank(cpPlantSceneFromGet.remarks) ? cpPlantSceneFromGet.remarks : '',     
					rules: [
					  {
						required:  false ,
						message: '请输入备注信息',
					  },
					],
				  })(
  <TextArea
    disabled
    style={{ minHeight: 32 }}
    
    rows={2}
  />
				  )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 , textAlign:'center' }}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPlantSceneFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPlantSceneFrom')[0].children.filter(item=>item.name=='修改')
.length>0&&
<Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpPlantSceneFromGet.id)}>撤销</Button>
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
      </PageHeaderWrapper>
    );
  }
}
export default CpPlantSceneFromForm;
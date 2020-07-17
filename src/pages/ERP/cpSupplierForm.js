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
import { isNotBlank, getFullUrl  ,getLocation} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpSupplierForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ cpSupplier, loading ,company}) => ({
  ...cpSupplier,
  ...company,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpSupplier/cpSupplier_Add'],
}))
@Form.create()
class CpSupplierForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    selectgsdata:[],
    orderflag:false,
    selectgsflag:false,
    location: getLocation()
  }
}

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const {location} =this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpSupplier/cpSupplier_Get',
        payload: {
          id: location.query.id,
        }
      });
    }

    if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier')[0].children.filter(item=>item.name=='修改')
    .length>0){
        this.setState({
            orderflag:false
        })
    }else{
      this.setState({
        orderflag:false
       })
    }

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
      type: 'cpSupplier/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { addfileList ,location } = this.state;
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

        value.orderStatus = 1

		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }

        dispatch({
          type:'cpSupplier/cpSupplier_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicmanagement/supplier/cp_supplier_list');
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch, form } = this.props;
    const { addfileList ,location } = this.state;
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

         value.orderStatus = 0

        dispatch({
          type:'cpSupplier/cpSupplier_Add',
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

  onCancelCancel = () => {
    router.push('/basicmanagement/supplier/cp_supplier_list');
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

  render() {
    const { fileList, previewVisible, previewImage  ,orderflag}= this.state;
    const {submitting1, submitting, cpSupplierGet } = this.props;
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
供应商管理
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='供应商类型'>
                  {getFieldDecorator('type', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.type) ? cpSupplierGet.type : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入供应商类型',
						max: 255,
					  },
					],
				  })(<Input  disabled />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='名称'>
                  {getFieldDecorator('name', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.name) ? cpSupplierGet.name : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入名称',
						
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='电话'>
                  {getFieldDecorator('phone', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.phone) ? cpSupplierGet.phone : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入电话',
						
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='传真'>
                  {getFieldDecorator('fax', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.fax) ? cpSupplierGet.fax : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入传真',
						
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='联系人'>
                  {getFieldDecorator('linkman', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.linkman) ? cpSupplierGet.linkman : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入联系人',
						
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='所属分公司'>
                  <Input disabled  value={isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.companyName) ? cpSupplierGet.companyName : ''} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='地址'>
                  {getFieldDecorator('address', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.address) ? cpSupplierGet.address : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入地址',
						
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='经营类型'>
                  {getFieldDecorator('runType', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.runType) ? cpSupplierGet.runType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入经营类型',
						
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='绑定集团'>
                  {getFieldDecorator('bindingGroup', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.bindingGroup) ? cpSupplierGet.bindingGroup : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入绑定集团',
						
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='状态'>
                  {getFieldDecorator('status', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.status) ? cpSupplierGet.status : '',     
					rules: [
					  {
						required:   false ,   
						message: '状态',
					  },
					],
				  })(<Select
  style={{ width: '100%' }}
            
  allowClear
  disabled={orderflag}
				  >
  <Option key={0}>正常</Option>  
  <Option key={1}>关闭</Option>  
</Select>
           )}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpSupplierGet) && isNotBlank(cpSupplierGet.remarks) ? cpSupplierGet.remarks : '',     
					rules: [
					  {
						required:  false ,
						message: '请输入备注信息',
					  },
					],
				  })(
  <TextArea
    disabled={orderflag}
    style={{ minHeight: 32 }}
    
    rows={2}
  />
				  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 ,textAlign: 'center'}}>
              {!orderflag&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier').length>0
        && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier')[0].children.filter(item=>item.name=='修改')
        .length>0&&
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
          </Form>
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default CpSupplierForm;
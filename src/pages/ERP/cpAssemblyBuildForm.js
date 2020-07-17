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
import { isNotBlank, getFullUrl ,getLocation} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpAssemblyBuildForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpAssemblyBuild, loading }) => ({
  ...cpAssemblyBuild,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpAssemblyBuild/cpAssemblyBuild_Add'],
}))
@Form.create()
class CpAssemblyBuildForm extends PureComponent {
	constructor(props) {
		super(props);
	this.state = {
    previewVisible: false,
    previewImage: {},
	addfileList: [],
	orderflag:false,
	location: getLocation()
  }
}

  componentDidMount() {
	const { dispatch } = this.props;
	const {location} = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAssemblyBuild/cpAssemblyBuild_Get',
        payload: {
          id: location.query.id,
        }
      });
	}
    if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild')[0].children.filter(item=>item.name=='修改')
    .length>0){
         this.setState({
            orderflag:false
         })
    }else{
      this.setState({
        orderflag:true
     })
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
      type: 'cpAssemblyBuild/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location} = this.state;
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
        dispatch({
          type:'cpAssemblyBuild/cpAssemblyBuild_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicManagement/basis/cp_assembly_build_list');
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location} = this.state;
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
        dispatch({
          type:'cpAssemblyBuild/cpAssemblyBuild_Add',
          payload: { ...value },
          callback: (res) => {
			router.push(`/basicmanagement/basis/cp_assembly_build_form?id=${res.data.id}`);
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicManagement/basis/cp_assembly_build_list');
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
    const { fileList, previewVisible, previewImage ,orderflag } = this.state;
    const { submitting1,submitting, cpAssemblyBuildGet  } = this.props;
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
总成建立
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='业务项目'>
                  {getFieldDecorator('project', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.project) ? cpAssemblyBuildGet.project : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入业务项目',
					  },
					],
				  })(<Select
  disabled={orderflag}
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
                  <Input disabled  value={isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.assemblyModel) ? cpAssemblyBuildGet.assemblyModel : ''} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='总成号'>
                  {getFieldDecorator('assemblyCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.assemblyCode) ? cpAssemblyBuildGet.assemblyCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成号',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='大号'>
                  {getFieldDecorator('maxCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.maxCode) ? cpAssemblyBuildGet.maxCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入大号',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='小号'>
                  {getFieldDecorator('minCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.minCode) ? cpAssemblyBuildGet.minCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入小号',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='总成分类'>
                  {getFieldDecorator('assemblyType', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.assemblyType) ? cpAssemblyBuildGet.assemblyType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成分类',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='类型编码'>
                  {getFieldDecorator('lxCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.lxCode) ? cpAssemblyBuildGet.lxCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入类型编码',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='分类编码'>
                  {getFieldDecorator('flCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.flCode) ? cpAssemblyBuildGet.flCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入分类编码',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='技术参数'>
                  {getFieldDecorator('technicalParameter', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.technicalParameter) ? cpAssemblyBuildGet.technicalParameter : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入技术参数',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='车型'>
                  {getFieldDecorator('vehicleModel', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.vehicleModel) ? cpAssemblyBuildGet.vehicleModel : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入车型',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='品牌'>
                  {getFieldDecorator('assemblyBrand', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.assemblyBrand) ? cpAssemblyBuildGet.assemblyBrand : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入品牌',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='年份'>
                  {getFieldDecorator('assemblyYear', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.assemblyYear) ? cpAssemblyBuildGet.assemblyYear : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入年份',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='品牌编码'>
                  {getFieldDecorator('brandCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.brandCode) ? cpAssemblyBuildGet.brandCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入品牌编码',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='一级编码型号'>
                  {getFieldDecorator('oneCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.oneCode) ? cpAssemblyBuildGet.oneCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入一级编码型号',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='绑定系列数量'>
                  {getFieldDecorator('bindingNumber', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.bindingNumber) ? cpAssemblyBuildGet.bindingNumber : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入绑定系列数量',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='原厂编码'>
                  {getFieldDecorator('originalCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.originalCode) ? cpAssemblyBuildGet.originalCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入原厂编码',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='再制造编码'>
                  {getFieldDecorator('makeCode', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.makeCode) ? cpAssemblyBuildGet.makeCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入再制造编码',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='提成类型'>
                  {getFieldDecorator('pushType', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.pushType) ? cpAssemblyBuildGet.pushType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入提成类型',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpAssemblyBuildGet) && isNotBlank(cpAssemblyBuildGet.remarks) ? cpAssemblyBuildGet.remarks : '',     
					rules: [
					  {
						required:  false ,
						message: '请输入备注信息',
					  },
					],
				  })(
  <TextArea
    style={{ minHeight: 32 }}
    
    rows={2}
  />
				  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild')[0].children.filter(item=>item.name=='修改')
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
export default CpAssemblyBuildForm;
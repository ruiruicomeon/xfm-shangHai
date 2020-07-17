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
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl ,getLocation} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpOneCodeForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpOneCode, loading }) => ({
  ...cpOneCode,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpOneCode/cpOneCode_Add'],
}))
@Form.create()
class CpOneCodeForm extends PureComponent {
  constructor(props) {
		super(props);
		this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    orderflag:false,
    location: getLocation(),
  }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch} = this.props;
    const {location} = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpOneCode/cpOneCode_Get',
        payload: {
          id: location.query.id,
        }
      });
    }
    if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOneCode').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOneCode')[0].children.filter(item=>item.name=='修改')
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
      type: 'cpOneCode/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
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
          type:'cpOneCode/cpOneCode_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicManagement/materials/cp_one_code_list');
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicManagement/materials/cp_one_code_list');
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
    const { fileList, previewVisible, previewImage,orderflag } = this.state;
    const {submitting1, submitting, cpOneCodeGet } = this.props;
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
一级编码
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='品牌'>
              {getFieldDecorator('brand', {
					initialValue: isNotBlank(cpOneCodeGet) && isNotBlank(cpOneCodeGet.brand) ? cpOneCodeGet.brand : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入品牌',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
            </FormItem>
            <FormItem {...formItemLayout} label='车型'>
              {getFieldDecorator('vehicleEmissions', {
					initialValue: isNotBlank(cpOneCodeGet) && isNotBlank(cpOneCodeGet.vehicleEmissions) ? cpOneCodeGet.vehicleEmissions : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入车型',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
            </FormItem>
            <FormItem {...formItemLayout} label='变速箱型号'>
              {getFieldDecorator('model', {
					initialValue: isNotBlank(cpOneCodeGet) && isNotBlank(cpOneCodeGet.model) ? cpOneCodeGet.model : '',     
					rules: [
					  {
						required:   true ,   
						message: '请输入变速箱型号',
					  },
					],
				  })(<Input  disabled={orderflag} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpOneCodeGet) && isNotBlank(cpOneCodeGet.remarks) ? cpOneCodeGet.remarks : '',     
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
            <FormItem {...formItemLayout} label='编号'>
              {getFieldDecorator('code', {
					initialValue: isNotBlank(cpOneCodeGet) && isNotBlank(cpOneCodeGet.code) ? cpOneCodeGet.code : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入编号',
						max: 255,
					  },
					],
				  })(<Input  disabled={orderflag} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {
            !orderflag&&
            <Button type="primary" htmlType="submit" loading={submitting1}>
					提交
            </Button>
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
export default CpOneCodeForm;
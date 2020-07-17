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
import { isNotBlank, getFullUrl , getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpOutboundForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpOutbound, loading }) => ({
  ...cpOutbound,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpOutboundForm extends PureComponent {
  constructor(props) {
		super(props);
		this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    location: getLocation(),
  }
}

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const {location} =this.state
     if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpOutbound/cpOutbound_Get',
        payload: {
          id: location.query.id,
        }
      });
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
      type: 'cpOutbound/clear',
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
          type:'cpOutbound/cpOutbound_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.goBack();
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.goBack();
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
    const { fileList, previewVisible, previewImage } = this.state;
    const { submitting, cpOutboundGet } = this.props;
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
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='订单编号'>
              {getFieldDecorator('orderCode', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.orderCode) ? cpOutboundGet.orderCode : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入订单编号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='物料编码'>
              {getFieldDecorator('billCode', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.billCode) ? cpOutboundGet.billCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入物料编码',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='原厂编码'>
              {getFieldDecorator('originalCode', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.originalCode) ? cpOutboundGet.originalCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入原厂编码',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='类型'>
              {getFieldDecorator('type', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.type) ? cpOutboundGet.type : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入类型',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='名称'>
              {getFieldDecorator('name', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.name) ? cpOutboundGet.name : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入名称',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='单位'>
              {getFieldDecorator('unit', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.unit) ? cpOutboundGet.unit : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入单位',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='型号'>
              {getFieldDecorator('model', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.model) ? cpOutboundGet.model : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入型号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='规格'>
              {getFieldDecorator('specification', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.specification) ? cpOutboundGet.specification : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入规格',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='配件厂商'>
              {getFieldDecorator('rCode', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.rCode) ? cpOutboundGet.rCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入配件厂商',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='报件数量'>
              {getFieldDecorator('quoteNumber', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.quoteNumber) ? cpOutboundGet.quoteNumber : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入报件数量',
						max: 11,
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='出库数量'>
              {getFieldDecorator('outNumber', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.outNumber) ? cpOutboundGet.outNumber : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入出库数量',
						max: 11,
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='未出库数量'>
              {getFieldDecorator('notOutNumber', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.notOutNumber) ? cpOutboundGet.notOutNumber : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入未出库数量',
						max: 11,
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='状态'>
              {getFieldDecorator('status', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.status) ? cpOutboundGet.status : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入状态',
						max: 1,
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpOutboundGet) && isNotBlank(cpOutboundGet.remarks) ? cpOutboundGet.remarks : '',     
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
					提交
              </Button>
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
export default CpOutboundForm;
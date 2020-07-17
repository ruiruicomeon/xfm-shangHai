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
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpPurchaseStockPendingForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ cpPurchaseStockPending, loading }) => ({
  ...cpPurchaseStockPending,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpPurchaseStockPendingForm extends PureComponent {

  state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch, location } = this.props;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpPurchaseStockPending/cpPurchaseStockPending_Get',
        payload: {
          id: location.query.id,
        }
      });
    }

     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'purchaseStatus',
		  },
		  callback: data => {
			this.setState({
			  purchaseStatus : data
          })
        }
    });
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
      type: 'cpPurchaseStockPending/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, location, form } = this.props;
    const { addfileList } = this.state;
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
          type:'cpPurchaseStockPending/cpPurchaseStockPending_Add',
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
    const { submitting, cpPurchaseStockPendingGet } = this.props;
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
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.orderCode) ? cpPurchaseStockPendingGet.orderCode : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入订单编号',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='单据状态'>
				  {getFieldDecorator('orderStatus', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.orderStatus) ? cpPurchaseStockPendingGet.orderStatus : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入单据状态',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='供应商'>
				  {getFieldDecorator('supplierId', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.supplierId) ? cpPurchaseStockPendingGet.supplierId : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入供应商',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='采购状态'>
				  {getFieldDecorator('purchaseStatus', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.purchaseStatus) ? cpPurchaseStockPendingGet.purchaseStatus : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入采购状态',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='采购要求'>
				  {getFieldDecorator('purchaseRequire', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.purchaseRequire) ? cpPurchaseStockPendingGet.purchaseRequire : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入采购要求',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='发票类型'>
				  {getFieldDecorator('makeNeed', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.makeNeed) ? cpPurchaseStockPendingGet.makeNeed : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入发票类型',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
				<FormItem {...formItemLayout} label="需求日期">
				  {getFieldDecorator('needDate', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.needDate) ? Moment(cpPurchaseStockPendingGet.needDate):null,
				  })(
					<DatePicker
					  
					  format="YYYY-MM-DD"
					  style={{ width: '100%' }}
					/>
				  )}
				</FormItem>
			   <FormItem {...formItemLayout} label='单价'>
				  {getFieldDecorator('price', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.price) ? cpPurchaseStockPendingGet.price : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入单价',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='数量'>
				  {getFieldDecorator('number', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.number) ? cpPurchaseStockPendingGet.number : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入数量',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='金额'>
				  {getFieldDecorator('money', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.money) ? cpPurchaseStockPendingGet.money : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入金额',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='入库数量'>
				  {getFieldDecorator('pendingNumber', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.pendingNumber) ? cpPurchaseStockPendingGet.pendingNumber : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入入库数量',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='待入库数量'>
				  {getFieldDecorator('stockPendingNumber', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.stockPendingNumber) ? cpPurchaseStockPendingGet.stockPendingNumber : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入待入库数量',
						
					  },
					],
				  })(<Input  />)}
				</FormItem>
				<FormItem {...formItemLayout} label="备注信息">
				  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.remarks) ? cpPurchaseStockPendingGet.remarks : '',     
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

export default CpPurchaseStockPendingForm;
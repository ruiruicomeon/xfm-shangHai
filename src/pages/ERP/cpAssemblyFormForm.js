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
import { isNotBlank, getFullUrl } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpAssemblyFormForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpAssemblyForm, loading }) => ({
  ...cpAssemblyForm,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpAssemblyFormForm extends PureComponent {
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
        type: 'cpAssemblyForm/cpAssemblyForm_Get',
        payload: {
          id: location.query.id,
        }
      });
    }
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'orderType',
		  },
		  callback: data => {
			this.setState({
			  orderType : data
          })
        }
    });
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
			type: 'business_dicth',
		  },
		  callback: data => {
			this.setState({
			  business_dicth : data
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
			type: 'settlement_type',
		  },
		  callback: data => {
			this.setState({
			  settlement_type : data
          })
        }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'maintenance_project',
		  },
		  callback: data => {
			this.setState({
			  maintenance_project : data
          })
        }
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'is_photograph',
		  },
		  callback: data => {
			this.setState({
			  is_photograph : data
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

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpAssemblyForm/clear',
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
          type: isNotBlank(location.query) && isNotBlank(location.query.id) ? 'cpAssemblyForm/cpAssemblyForm_Update' : 'cpAssemblyForm/cpAssemblyForm_Add',
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
    const { submitting, cpAssemblyFormGet } = this.props;
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
            <FormItem {...formItemLayout} label='意向单号'>
              {getFieldDecorator('intentionId', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.intentionId) ? cpAssemblyFormGet.intentionId : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入意向单号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='订单状态'>
              {getFieldDecorator('orderStatus', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.orderStatus) ? cpAssemblyFormGet.orderStatus : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入订单状态',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='订单分类'>
              {getFieldDecorator('orderType', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.orderType) ? cpAssemblyFormGet.orderType : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入订单分类',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='业务项目'>
              {getFieldDecorator('project', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.project) ? cpAssemblyFormGet.project : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入业务项目',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='业务渠道'>
              {getFieldDecorator('dicth', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.dicth) ? cpAssemblyFormGet.dicth : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入业务渠道',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='业务分类'>
              {getFieldDecorator('businessType', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.businessType) ? cpAssemblyFormGet.businessType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入业务分类',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='结算类型'>
              {getFieldDecorator('settlementType', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.settlementType) ? cpAssemblyFormGet.settlementType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入结算类型',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="入场时间">
              {getFieldDecorator('entranceDate', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.entranceDate) ? Moment(cpAssemblyFormGet.entranceDate):null,
				  })(
  <DatePicker
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
				  )}
            </FormItem>
            <FormItem {...formItemLayout} label='客户'>
              {getFieldDecorator('clientId', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.clientId) ? cpAssemblyFormGet.clientId : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入客户',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='进场类型'>
              {getFieldDecorator('assemblyEnterType', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyEnterType) ? cpAssemblyFormGet.assemblyEnterType : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入进场类型',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='总成品牌'>
              {getFieldDecorator('assemblyBrand', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyBrand) ? cpAssemblyFormGet.assemblyBrand : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成品牌',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='车型/排量'>
              {getFieldDecorator('assemblyVehicleEmissions', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyVehicleEmissions) ? cpAssemblyFormGet.assemblyVehicleEmissions : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入车型/排量',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='年份'>
              {getFieldDecorator('assemblyYear', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyYear) ? cpAssemblyFormGet.assemblyYear : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入年份',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='总成型号'>
              {getFieldDecorator('assemblyModel', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyModel) ? cpAssemblyFormGet.assemblyModel : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入总成型号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='钢印号'>
              {getFieldDecorator('assemblySteelSeal', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblySteelSeal) ? cpAssemblyFormGet.assemblySteelSeal : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入钢印号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='VIN码'>
              {getFieldDecorator('assemblyVin', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyVin) ? cpAssemblyFormGet.assemblyVin : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入VIN码',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='其他识别信息'>
              {getFieldDecorator('assemblyMessage', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyMessage) ? cpAssemblyFormGet.assemblyMessage : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入其他识别信息',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='故障代码'>
              {getFieldDecorator('assemblyFaultCode', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyFaultCode) ? cpAssemblyFormGet.assemblyFaultCode : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入故障代码',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='本次故障描述'>
              {getFieldDecorator('assemblyErrorDescription', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyErrorDescription) ? cpAssemblyFormGet.assemblyErrorDescription : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入本次故障描述',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='相片上传'>
              {getFieldDecorator('photo', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.photo) ? cpAssemblyFormGet.photo : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入相片上传',
						max: 1000,
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='维修项目'>
              {getFieldDecorator('maintenanceProject', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.maintenanceProject) ? cpAssemblyFormGet.maintenanceProject : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入维修项目',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='行程里程'>
              {getFieldDecorator('tripMileage', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.tripMileage) ? cpAssemblyFormGet.tripMileage : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入行程里程',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='车牌号'>
              {getFieldDecorator('plateNumber', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.plateNumber) ? cpAssemblyFormGet.plateNumber : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入车牌号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='是否拍照'>
              {getFieldDecorator('isPhotograph', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.isPhotograph) ? cpAssemblyFormGet.isPhotograph : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入是否拍照',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='发货地址'>
              {getFieldDecorator('shipAddress', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.shipAddress) ? cpAssemblyFormGet.shipAddress : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入发货地址',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='维修历史'>
              {getFieldDecorator('maintenanceHistory', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.maintenanceHistory) ? cpAssemblyFormGet.maintenanceHistory : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入维修历史',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='定损员'>
              {getFieldDecorator('partFee', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.partFee) ? cpAssemblyFormGet.partFee : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入定损员',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='事故单号'>
              {getFieldDecorator('accidentNumber', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.accidentNumber) ? cpAssemblyFormGet.accidentNumber : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入事故单号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='事故说明'>
              {getFieldDecorator('accidentExplain', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.accidentExplain) ? cpAssemblyFormGet.accidentExplain : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入事故说明',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.remarks) ? cpAssemblyFormGet.remarks : '',     
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
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
export default CpAssemblyFormForm;
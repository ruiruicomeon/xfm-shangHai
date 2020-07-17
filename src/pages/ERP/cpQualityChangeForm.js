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
  DatePicker
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl,getLocation} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpQualityChangeForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ cpQualityChange, loading }) => ({
  ...cpQualityChange,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpQualityChangeForm extends PureComponent {
 constructor(props) {
    super(props);
    this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    selectyear: 0,
			selectmonth: 0,
    location:getLocation()
  }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const {location } =this.state

    this.props.form.setFieldsValue({
      zbtime:0
    });

    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpQualityChange/cpQualityChange_Get',
        payload: {
          id: location.query.id,
        },
        callback:(res)=>{
        	if (isNotBlank(res.data.qualitytime)) {
						this.props.form.setFieldsValue({
							zbtime: res.data.qualitytime
						});
						this.setState({
							selectyear: res.data.qualitytime.split(',')[0],
							selectmonth: res.data.qualitytime.split(',')[1]
						})
					}
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


  // 关闭页面清除数据
  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpQualityChange/clear',
    });
  }

  onsave  = () => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location ,selectyear,selectmonth} = this.state;
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

        value.qualitytime = `${selectyear} , ${selectmonth}`
        value.qualityDate = moment(value.qualityDate).format("YYYY-MM-DD")
        value.orderStatus = 0

		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }

        dispatch({
          type:'cpQualityChange/cpQualityChange_Add',
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


  handleSubmit = e => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location ,selectyear,selectmonth} = this.state;
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

        value.qualitytime = `${selectyear} , ${selectmonth}`
        value.qualityDate = moment(value.qualityDate).format("YYYY-MM-DD")
        value.orderStatus = 1

		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }

        dispatch({
          type:'cpQualityChange/cpQualityChange_Add',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_quality_change_form?${res.data.id}`);
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/business/process/cp_quality_change_list');
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

	editYear = (val) => {
		if (isNotBlank(val)) {
			this.props.form.setFieldsValue({
				zbtime: isNotBlank(val) ? val : '',
			});
			this.setState({ selectyear: val })
		} else {
			this.props.form.setFieldsValue({
				zbtime: 0,
			});
			this.setState({ selectyear: 0 })
		}
	}

	editMonth = (val) => {
		if (isNotBlank(val)) {
			this.props.form.setFieldsValue({
				zbtime: isNotBlank(val) ? val : '',
			});
			this.setState({ selectmonth: val })
		} else {
			this.props.form.setFieldsValue({
				zbtime: 0,
			});
			this.setState({ selectmonth: 0 })
		}
	}

  render() {
    const { fileList, previewVisible, previewImage ,selectmonth,selectyear} = this.state;
    const { submitting, cpQualityChangeGet } = this.props;


    console.log(cpQualityChangeGet)

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

    const yeardata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
		]
		const monthdata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
			{
				key: 11,
				value: 11
			},
			{
				key: 12,
				value: 12
			},
		]

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
        <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
						质保变更单
      </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
			   <FormItem {...formItemLayout} label='订单编号'>
				  {getFieldDecorator('orderCode', {
					initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.orderCode) ? cpQualityChangeGet.orderCode : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   true ,   // 是否必填
						message: '请输入订单编号',
					  },
					],
				  })(<Input  />)}
				</FormItem>
				<FormItem {...formItemLayout} label='放行完成时间'>
				  {getFieldDecorator('qualityDate', {
          initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.qualityDate) ? moment(cpQualityChangeGet.qualityDate):null,
          rules: [
            {
              // required: !!((selthis == 1 && selthis1 == 1) || (selthis == 2 && selthis1 == 1) || (isNotBlank(selthis) && selthis != 1 && selthis != 2 && selthis1 == 1)
              // 	|| (isNotBlank(selthis) && selthis1 == 2) || (isNotBlank(selthis1) && (selthis1 != 2 || selthis1 != 1))),   
              required:true,
              message: '请选择放行完成时间',
            },
          ],
				  })(
					<DatePicker
					  
					  format="YYYY-MM-DD"
					  style={{ width: '100%' }}
					/>
				  )}
				</FormItem>

        {/* <Col lg={12} md={12} sm={24}> */}
              <FormItem {...formItemLayout} label='质保时间'>
                {getFieldDecorator('zbtime', {
											rules: [
												{
													// required: !!((selthis == 1 && selthis1 == 1) || (selthis == 2 && selthis1 == 1) || (isNotBlank(selthis) && selthis != 1 && selthis != 2 && selthis1 == 1)
													// 	|| (isNotBlank(selthis) && selthis1 == 2) || (isNotBlank(selthis1) && (selthis1 != 2 || selthis1 != 1))),   
													required:true,
													message: '请选择质保时间',
												},
											],
										})(
  <div>
    <Select
      allowClear
      style={{ width: '50%' }}
      value={`${this.state.selectyear} 年`}
      onChange={this.editYear}
    >
      {
														isNotBlank(yeardata) && yeardata.length > 0 && yeardata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
													}
    </Select>
    <Select
      allowClear
      style={{ width: '50%' }}
      value={`${this.state.selectmonth} 月`}
      onChange={this.editMonth}
    >
      {
														isNotBlank(monthdata) && monthdata.length > 0 && monthdata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
													}
    </Select>
  </div>
										)
										}
              </FormItem>
            {/* </Col> */}


			   {/* <FormItem {...formItemLayout} label='质保时间'>
				  {getFieldDecorator('qualitytime', {
					initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.qualitytime) ? cpQualityChangeGet.qualitytime : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入质保时间',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem> */}
			   {/* <FormItem {...formItemLayout} label='reserved1'>
				  {getFieldDecorator('reserved1', {
					initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.reserved1) ? cpQualityChangeGet.reserved1 : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入reserved1',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='reserved2'>
				  {getFieldDecorator('reserved2', {
					initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.reserved2) ? cpQualityChangeGet.reserved2 : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入reserved2',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem>
				<FormItem {...formItemLayout} label="reserved3">
				  {getFieldDecorator('reserved3', {
					initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.reserved3) ? moment(cpQualityChangeGet.reserved3):null,
				  })(
					<DatePicker
					  
					  format="YYYY-MM-DD"
					  style={{ width: '100%' }}
					/>
				  )}
				</FormItem>
				<FormItem {...formItemLayout} label="reserved4">
				  {getFieldDecorator('reserved4', {
					initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.reserved4) ? moment(cpQualityChangeGet.reserved4):null,
				  })(
					<DatePicker
					  
					  format="YYYY-MM-DD"
					  style={{ width: '100%' }}
					/>
				  )}
				</FormItem> */}
				<FormItem {...formItemLayout} label="备注">
				  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpQualityChangeGet) && isNotBlank(cpQualityChangeGet.remarks) ? cpQualityChangeGet.remarks : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:  false ,
						message: '请输入备注',
					  },
					],
				  })(
					<TextArea
					  style={{ minHeight: 32 }}
					  
					  rows={2}
					/>
				  )}
				</FormItem>
				<FormItem {...submitFormLayout} style={{ marginTop: 32 ,textAlign:'center'}}>
        <Button type="primary" onClick={this.onsave} loading={submitting}>
              保存
				  </Button>
				  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting}>
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

export default CpQualityChangeForm;
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
  Upload
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl,getLocation} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpCloseForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpClose, loading }) => ({
  ...cpClose,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpCloseForm extends PureComponent {
 constructor(props) {
    super(props);
    this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    location:getLocation()
  }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const {location } =this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpClose/cpClose_Get',
        payload: {
          id: location.query.id,
        },
        callback:(res)=>{
          if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
						let photoUrl = res.data.photo.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList: res.data.photo.split('|'),
							fileList: photoUrl
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

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpClose/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values }
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}

		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }
        dispatch({
          type:'cpClose/cpClose_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/warehouse/process/Cp_Close_list');
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/warehouse/process/Cp_Close_list');
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
    const {dispatch} = this.props
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
      dispatch({
				type: 'upload/upload_img',
				payload: {
					file,
					name: 'cpClose'
				},
				callback: (res) => {
					if (!isNotBlank(addfileList) || addfileList.length <= 0) {
						this.setState({
							addfileList: [res],
						});
					} else {
						this.setState({
							addfileList: [...addfileList, res],
						});
					}
				}
			})
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
    const { submitting, cpCloseGet } = this.props;
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
关闭表
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='订单编号'>
              {getFieldDecorator('orderCode', {
					initialValue: isNotBlank(cpCloseGet) && isNotBlank(cpCloseGet.orderCode) ? cpCloseGet.orderCode : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入订单编号',
					  },
					],
				  })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpCloseGet) && isNotBlank(cpCloseGet.remarks) ? cpCloseGet.remarks : '',     
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
              <FormItem {...formItemLayout} label="相片上传">
                {getFieldDecorator('photo', {
											initialValue: ''
										})(
  <Upload
    accept="image/*"
    onChange={this.handleUploadChange}
    onRemove={this.handleRemove}
    beforeUpload={this.handlebeforeUpload}
    fileList={fileList}
    listType="picture-card"
    onPreview={this.handlePreview}
  >
    {isNotBlank(fileList) && fileList.length >= 9  ? null : uploadButton}
  </Upload>
										)}
              </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClose').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClose')[0].children.filter(item=>item.name=='修改')
.length>0&&<span>
  <Button type="primary" htmlType="submit" loading={submitting}>
					提交
  </Button>
  <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
					返回
  </Button>
</span>
  }
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
export default CpCloseForm;
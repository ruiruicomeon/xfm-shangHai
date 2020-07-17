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
  Row,
  Col
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpStayFormForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpStayForm, loading }) => ({
  ...cpStayForm,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpStayFormForm extends PureComponent {
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
        type: 'cpStayForm/cpStayForm_Get',
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
          del_flag: data
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
      type: 'cpStayForm/clear',
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
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        dispatch({
          type: 'cpStayForm/cpStayForm_Add',
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
    const { submitting, cpStayFormGet } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log(cpStayFormGet)
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
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Card title="业务员信息" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='业务员'>
                  <Input
                    
                    disabled
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.user) ? cpStayFormGet.user.name : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='所属公司'>
                  <Input
                    
                    disabled
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.user) && isNotBlank(cpStayFormGet.user.office) ? cpBusinessOrderGet.user.office.name : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='所属区域'>
                  <Select
                    notFoundContent={null}
                    style={{ width: '100%' }}
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.user) && isNotBlank(cpStayFormGet.user.dictArea) ? cpStayFormGet.user.dictArea : '')}
                    
                    disabled
                  >
                    {
                      isNotBlank(this.state.area) && this.state.area.length > 0 && this.state.area.map(item =>
                        <Option value={item.value} key={item.value}>
                          {item.label}
                        </Option>
                      )
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="客户信息" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='客户'>
                  <Input
                    
                    disabled
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.client) ? cpStayFormGet.client.name : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='客户分类'>
                  <Select
                    style={{ width: '100%' }}
                    
                    disabled
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.client) ? cpStayFormGet.client.classify : '')}
                  >
                    {
                      isNotBlank(this.state.classify) && this.state.classify.length > 0 && this.state.classify.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='联系人'>
                  <Input
                    
                    disabled
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.client) ? cpStayFormGet.client.name : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='联系地址'>
                  <Input
                    
                    disabled
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.client) ? cpStayFormGet.client.address : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='移动电话'>
                  <Input
                    
                    disabled
                    value={(isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.client) ? cpStayFormGet.client.phone : '')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} title="订单信息">
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='意向单号'>
                  {getFieldDecorator('intentionid', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.intentionid) ? cpStayFormGet.intentionid : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入意向单号',
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='意向单号'>
                  {getFieldDecorator('intentionid', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.intentionid) ? cpStayFormGet.intentionid : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入意向单号',
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='订单状态'>
                  {getFieldDecorator('orderStatus', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.orderStatus) ? cpStayFormGet.orderStatus : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入订单状态',
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                  {getFieldDecorator('orderCode', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.orderCode) ? cpStayFormGet.orderCode : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入订单编号',
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='客户'>
                  {getFieldDecorator('clientId', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.clientId) ? cpStayFormGet.clientId : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入客户',
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='维修班组'>
                  {getFieldDecorator('maintenanceCrew', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.maintenanceCrew) ? cpStayFormGet.maintenanceCrew : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入维修班组',
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='总成登记id'>
                  {getFieldDecorator('assmblyBuildId', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.assmblyBuildId) ? cpStayFormGet.assmblyBuildId.id : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入总成登记id',
                        max: 255,
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='1zc待报件清单 2at待报件清单'>
                  {getFieldDecorator('type', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.type) ? cpStayFormGet.type : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入1zc待报件清单 2at待报件清单',
                        max: 1,
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='整车施工单id'>
                  {getFieldDecorator('zcId', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.zcId) ? cpStayFormGet.zcId : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入整车施工单id',
                      },
                    ],
                  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="备注信息">
                  {getFieldDecorator('remarks', {
                    initialValue: isNotBlank(cpStayFormGet) && isNotBlank(cpStayFormGet.remarks) ? cpStayFormGet.remarks : '',     
                    rules: [
                      {
                        required: false,
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
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
              返回
              </Button>
            </FormItem>
          </Card>
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpStayFormForm;
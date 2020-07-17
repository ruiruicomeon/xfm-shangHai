import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  message,
  Icon,
  Modal,
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpClientForm.less';
import { getStorage } from '@/utils/localStorageUtils'

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpClient, loading }) => ({
  ...cpClient,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpClient/cpClient_Add'],
  submitting2: loading.effects['cpClient/cpClient_Update'],
}))
@Form.create()
class CpClientForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      orderflag: false,
      location: getLocation(),
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpClient/cpClient_Get',
        payload: {
          id: location.query.id,
        }
      });
    }
    if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient')[0].children.filter(item=>item.name=='修改')
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
        type: 'classify',
      },
      callback: data => {
        this.setState({
          classify: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'client_level',
      },
      callback: data => {
        this.setState({
          client_level: data
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
          del_flag: data
        })
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpClient/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpClientGet } = this.props;
    const { addfileList, location } = this.state;
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
        value.user = {}
        value.user.id = isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) ? cpClientGet.user.id : getStorage('userid')
        dispatch({
          type: isNotBlank(location.query) && isNotBlank(location.query.id) ? 'cpClient/cpClient_Update' : 'cpClient/cpClient_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicManagement/basis/cp_client_list');
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch, form, cpClientGet } = this.props;
    const { addfileList, location } = this.state;
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
        value.user = {}
        value.user.id = isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) ? cpClientGet.user.id : getStorage('userid')
        dispatch({
          type: isNotBlank(location.query) && isNotBlank(location.query.id) ? 'cpClient/cpClient_Update' : 'cpClient/cpClient_Add',
          payload: { ...value },
          callback: (res) => {
            router.push(`/basicmanagement/basis/cp_client_form?id=${res.data.id}`)
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicManagement/basis/cp_client_list');
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
    const { fileList, previewVisible, previewImage, orderflag } = this.state;
    const { submitting2,submitting1,submitting, cpClientGet } = this.props;
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
客户管理
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户编码'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.code) ? cpClientGet.code : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='员工编号'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) && isNotBlank(cpClientGet.user.no) ? cpClientGet.user.no : getStorage('userno')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='员工姓名'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) && isNotBlank(cpClientGet.user.name) ? cpClientGet.user.name : getStorage('username')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='大区'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) && isNotBlank(cpClientGet.user.area.name) ? cpClientGet.user.area.name : getStorage('area')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='分公司'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) && isNotBlank(cpClientGet.user.company) ? cpClientGet.user.company.name : getStorage('companyname')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='建立时间'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) ? cpClientGet.user.createDate : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='最后一次更改时间'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.user) ? cpClientGet.user.finishDate : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户状态'>
                    <Input
                      disabled
                      value={isNotBlank(cpClientGet) && isNotBlank(cpClientGet.status) ? cpClientGet.status : '潜在用户'}
                      style={{'color':'#CC6600'}}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="客户资料" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    {getFieldDecorator('clientCpmpany', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.clientCpmpany) ? cpClientGet.clientCpmpany : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入客户公司',
                        max: 255,
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    {getFieldDecorator('classify', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.classify) ? cpClientGet.classify : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请选择客户分类',
                      },
                    ],
                  })(
                    <Select
                      disabled={orderflag}
                      allowClear
                      style={{ width: '100%' }}
                      
                    >
                      {
                        isNotBlank(this.state.classify) && this.state.classify.length > 0 && this.state.classify.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>
                  )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户级别'>
                    {getFieldDecorator('level', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.level) ? cpClientGet.level : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入客户级别',
                      },
                    ],
                  })(<Select
                    disabled={orderflag}
                    allowClear
                    style={{ width: '100%' }}
                    
                  >
                    {
                      isNotBlank(this.state.client_level) && this.state.client_level.length > 0 && this.state.client_level.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                    }
                  </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    {getFieldDecorator('name', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.name) ? cpClientGet.name : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入联系人',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    {getFieldDecorator('address', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.address) ? cpClientGet.address : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入联系地址',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='邮箱'>
                    {getFieldDecorator('email', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.email) ? cpClientGet.email : '',     
                    rules: [
                      {
                        required: true,   
                        message: '请输入邮箱',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    {getFieldDecorator('phone', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.phone) ? cpClientGet.phone : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入移动电话',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='电话'>
                    {getFieldDecorator('tel', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.tel) ? cpClientGet.tel : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入电话',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='传真'>
                    {getFieldDecorator('fax', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.fax) ? cpClientGet.fax : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入传真',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="开票资料" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='税号'>
                    {getFieldDecorator('dutyParagraph', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.dutyParagraph) ? cpClientGet.dutyParagraph : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入税号',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开户账号'>
                    {getFieldDecorator('openNumber', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.openNumber) ? cpClientGet.openNumber : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入开户账号',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开户银行'>
                    {getFieldDecorator('openBank', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.openBank) ? cpClientGet.openBank : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入开户银行',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开户地址'>
                    {getFieldDecorator('openAddress', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.openAddress) ? cpClientGet.openAddress : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入开户地址',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开户电话'>
                    {getFieldDecorator('openTel', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.openTel) ? cpClientGet.openTel : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入开户电话',
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='结账周期'>
                    {getFieldDecorator('period', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.period) ? cpClientGet.period : '',     
                    rules: [
                      {
                        required: false,   
                        message: '结账周期',
                      },
                    ],
                  })(<InputNumber  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='其他备注' className="allinputstyle">
                    {getFieldDecorator('otherRemarks', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.otherRemarks) ? cpClientGet.otherRemarks : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入其他备注',
                        max: 255,
                      },
                    ],
                  })(<TextArea  disabled={orderflag} rows={2} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                    initialValue: isNotBlank(cpClientGet) && isNotBlank(cpClientGet.remarks) ? cpClientGet.remarks : '',     
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
            </Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient')[0].children.filter(item=>item.name=='修改')
.length>0&&
<span>
  <Button type="primary" onClick={this.onsave} loading={submitting1||submitting2}>
               保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1||submitting2}>
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
export default CpClientForm;
import React, { PureComponent, Fragment } from 'react';
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
  Row, Col
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import styles from './CpBillMaterialForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateForm = Form.create()(props => {
  const { handleModalVisible, cpOneCodeList, selectflag, selectuser, dispatch, form, form: { getFieldDecorator } } = props;
  const columnsone = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectuser(record)}>
            选择
          </a>
        </Fragment>
      ),
    },
    {
      title: '编号',        
      dataIndex: 'code',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
    },
    {
      title: '品牌',        
      dataIndex: 'brand',   
      inputType: 'text',
      align: 'center',   
      width: 100,          
      editable: true,      
    },
    {
      title: '车型',        
      dataIndex: 'vehicleEmissions',   
      inputType: 'text',
      align: 'center',   
      width: 100,          
      editable: true,      
    },
    {
      title: '变速箱型号',        
      dataIndex: 'model',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      align: 'center',
      width: 150,
      sorter: true,
      render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
    },
    {
      title: '备注信息',        
      dataIndex: 'remarks',   
      inputType: 'text',
      align: 'center',   
      width: 150,          
      editable: true,      
    },
  ];
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
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpOneCode/cpOneCode_List',
      payload: {
        current: 1,
        pageSize: 10
      },
    });
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpOneCode/cpOneCode_List',
      payload: params,
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10
      };
      if (!isNotBlank(fieldsValue.name)) {
        values.name = ''
      }
      dispatch({
        type: 'cpOneCode/cpOneCode_List',
        payload: values,
      });
    });
  };
  return (
    <Modal
      title='一级编码'
      visible={selectflag}
      onCancel={() => handleModalVisible()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="编号">
              {getFieldDecorator('code')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="车型">
              {getFieldDecorator('model')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="品牌">
              {getFieldDecorator('brand')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="变形箱型号">
              {getFieldDecorator('vehicleEmissions')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpOneCodeList}
        columns={columnsone}
      />
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, cpTwoCodeList, selectkhflag, selectcustomer, dispatch, form, form: { getFieldDecorator } } = props;
  const columnstwo = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectcustomer(record)}>
            选择
          </a>
        </Fragment>
      ),
    },
    {
      title: '代码',        
      dataIndex: 'code',
      align: 'center',    
      inputType: 'text',   
      width: 150,          
      editable: true,      
    },
    {
      title: '名称',        
      dataIndex: 'name',
      align: 'center',   
      inputType: 'text',   
      width: 150,          
      editable: true,      
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      editable: false,
      inputType: 'dateTime',
      align: 'center',
      width: 150,
      sorter: true,
      render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
    },
    {
      title: '备注信息',        
      dataIndex: 'remarks',   
      inputType: 'text',
      align: 'center',    
      width: 150,          
      editable: true,      
    }
  ];
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
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpTwoCode/cpTwoCode_List',
      payload: {
        current: 1,
        pageSize: 10
      },
    });
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpTwoCode/cpTwoCode_List',
      payload: params,
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10
      };
      if (!isNotBlank(fieldsValue.name)) {
        values.name = ''
      }
      dispatch({
        type: 'cpTwoCode/cpTwoCode_List',
        payload: values,
      });
    });
  };
  return (
    <Modal
      title='二级编码'
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekh()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="代码">
              {getFieldDecorator('code')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpTwoCodeList}
        columns={columnstwo}
      />
    </Modal>
  );
});
@connect(({ cpBillMaterial, loading, cpOneCode, cpTwoCode }) => ({
  ...cpBillMaterial,
  ...cpOneCode,
  ...cpTwoCode,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class cpBillMaterialNew extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectflag: false,
      selectdata: {},
      orderflag: false,
      selectkhflag: false,
      selectkhdata: {},
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_Get',
        payload: {
          id: location.query.id,
        }
      });
      dispatch({
        type: 'sysarea/getFlatCode',
        payload: {
          id: isNotBlank(location.query.id) ? location.query.id : '',
          type: 'WL'
        },
        callback: (srcres) => {
          this.setState({
            srcimg: srcres
          })
        }
      })
    }
    if (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial').length > 0
      && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial')[0].children.filter(item => item.name == '修改')
        .length > 0) {
      this.setState({
        orderflag: false
      })
    } else {
      this.setState({
        orderflag: true
      })
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
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'start_status',
      },
      callback: data => {
        this.setState({
          startStatus: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'unit',
      },
      callback: data => {
        this.setState({
          unit: data
        })
      }
    });
    dispatch({
      type: 'cpOneCode/cpOneCode_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpTwoCode/cpTwoCode_List',
      payload: {
        pageSize: 10,
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpBillMaterial/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpBillMaterialGet } = this.props;
    const { addfileList, location, selectkhdata, selectdata } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.one = {}
        value.two = {}
        value.one.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
          (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.one) && isNotBlank(cpBillMaterialGet.one.id) ? cpBillMaterialGet.one.id : '')
        value.two.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id :
          (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.two) && isNotBlank(cpBillMaterialGet.two.id) ? cpBillMaterialGet.two.id : '')
        dispatch({
          type: 'cpBillMaterial/cpBillMaterial_Add',
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

  onsave = () => {
    const { dispatch, form, cpBillMaterialGet } = this.props;
    const { addfileList, location, selectkhdata, selectdata } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.one = {}
        value.two = {}
        value.one.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
          (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.one) && isNotBlank(cpBillMaterialGet.one.id) ? cpBillMaterialGet.one.id : '')
        value.two.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id :
          (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.two) && isNotBlank(cpBillMaterialGet.two.id) ? cpBillMaterialGet.two.id : '')
        dispatch({
          type: 'cpBillMaterial/cpBillMaterial_Add',
          payload: { ...value },
          callback: (res) => {
            router.push(`/basicManagement/materials/cp_bill_material_form?id=${res.data.id}`);
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

  onselect = () => {
    this.setState({
      selectflag: true
    })
  }

  onselectkh = () => {
    this.setState({
      selectkhflag: true
    })
  }

  handleModalVisible = flag => {
    this.setState({
      selectflag: !!flag
    });
  };

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  selectuser = (record) => {
    this.setState({
      selectdata: record,
      selectflag: false
    })
  }

  selectcustomer = (record) => {
    this.setState({
      selectkhdata: record,
      selectkhflag: false
    })
  }

  render() {
    const { fileList, previewVisible, previewImage, selectflag, selectdata, selectkhflag, selectkhdata, orderflag, srcimg } = this.state;
    const { submitting, cpBillMaterialGet, cpOneCodeList, cpTwoCodeList, dispatch } = this.props;
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
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      dispatch,
      cpOneCodeList
    }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      dispatch,
      cpTwoCodeList
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            物料编码
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='物料二维码'>
                  {isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.id) && <div>
                    <img
                      src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} 
                      style={{width:'100px'}}
                      alt=""
                    />
                  </div>}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='物料编码'>
                  <Input  disabled value={isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.billCode) ? cpBillMaterialGet.billCode : ''} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='一级编码'>
                  <Input disabled value={isNotBlank(selectdata) && isNotBlank(selectdata.code) ? selectdata.code : (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.oneCode) ? cpBillMaterialGet.oneCode : '')} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='一级编码型号'>
                  <Input
                    
                    disabled
                    value={isNotBlank(selectdata) && isNotBlank(selectdata.model) ? selectdata.model :
                      (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.oneCodeModel) ? cpBillMaterialGet.oneCodeModel : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='二级编码'>
                  <Input disabled value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.code) ? selectkhdata.code : (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.twoCode) ? cpBillMaterialGet.twoCode : '')} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='二级编码名称'>
                  <Input
                    disabled
                    
                    value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name :
                    (isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.twoCodeModel) ? cpBillMaterialGet.twoCodeModel : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label='名称'
                >
                  {getFieldDecorator('name', {
                    initialValue: isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.name) ? cpBillMaterialGet.name : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入名称',
                      },
                    ],
                  })(<Input  disabled />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='原厂编码'>
                  {getFieldDecorator('originalCode', {
                    initialValue: isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.originalCode) ? cpBillMaterialGet.originalCode : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入原厂编码',
                      },
                    ],
                  })(<Input  disabled />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='配件厂商'>
                  {getFieldDecorator('rCode', {
                    initialValue: isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.rCode) ? cpBillMaterialGet.rCode : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请输入配件厂商',
                      },
                    ],
                  })(<Input  disabled />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='单位'>
                  {getFieldDecorator('unit', {
                    initialValue: isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.unit) ? cpBillMaterialGet.unit : '',     
                    rules: [
                      {
                        required: false,   
                        message: '请选择单位',
                      },
                    ],
                  })(<Select
                    disabled
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {
                      isNotBlank(this.state.unit) && this.state.unit.length > 0 && this.state.unit.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                    }
                  </Select>)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                  {getFieldDecorator('remarks', {
                    initialValue: isNotBlank(cpBillMaterialGet) && isNotBlank(cpBillMaterialGet.remarks) ? cpBillMaterialGet.remarks : '',     
                    rules: [
                      {
                        required: false,
                        message: '请输入备注信息',
                      },
                    ],
                  })(
                    <TextArea
                      disabled
                      style={{ minHeight: 32 }}
                      
                      rows={2}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <CreateForm {...parentMethods} selectflag={selectflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default cpBillMaterialNew;
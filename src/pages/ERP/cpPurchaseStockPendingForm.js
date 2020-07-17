import React, { PureComponent, Fragment } from 'react';
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
  DatePicker,
  Col, Row, Popconfirm,
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpPurchaseStockPendingForm.less';
import StandardTable from '@/components/StandardTable';
import StandardEditTable from '@/components/StandardEditTable';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const CreateFormForm = Form.create()(props => {
  const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator },
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, showTable, purchaseStatus, purchaseType } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      form.resetFields();
      const values = { ...fieldsValue };
      values.price = setPrice(values.price)
      values.needDate = moment(values.needDate).format("YYYY-MM-DD")
      handleFormAdd(values);
    });
  };
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
  return (
    <Modal
      title="新增明细"
      visible={FormVisible}
      onOk={okHandle}
      width='80%'
      onCancel={() => handleFormVisible()}
    >
      <Row gutter={12}>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='物料编码'>
            <div>
              <Input  value={isNotBlank(modalRecord) && isNotBlank(modalRecord.billCode) ? modalRecord.billCode : ''} />
              <Button style={{ marginLeft: 8 }} onClick={() => showTable()}>选择</Button>
            </div>
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='原厂编码'>
            {getFieldDecorator('originalCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode : '',     
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
          <FormItem {...formItemLayout} label='名称'>
            {getFieldDecorator('name', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',     
              rules: [
                {
                  required: false,   
                  message: '名称',
                },
              ],
            })(<Input  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='二级编码名称'>
            {getFieldDecorator('twoCodeModel', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.twoCodeModel) ? modalRecord.twoCodeModel : '',     
              rules: [
                {
                  required: false,   
                  message: '二级编码名称',
                },
              ],
            })(<Input  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='一级编码型号'>
            {getFieldDecorator('assemblyVehicleEmissions', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCodeModel) ? modalRecord.oneCodeModel : '',     
              rules: [
                {
                  required: false,   
                  message: '一级编码型号',
                },
              ],
            })(<Input  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='配件厂商'>
            {getFieldDecorator('rCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.rCode) ? modalRecord.rCode : '',     
              rules: [
                {
                  required: false,   
                  message: '配件厂商',
                },
              ],
            })(<Input  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='单位'>
            {getFieldDecorator('unit', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.unit) ? modalRecord.unit : '',     
              rules: [
                {
                  required: false,   
                  message: '单位',
                },
              ],
            })(<Input  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='采购状态'>
            {getFieldDecorator('purchaseStatus', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.purchaseStatus) ? modalRecord.purchaseStatus : '',     
              rules: [
                {
                  required: false,   
                  message: '采购状态',
                },
              ],
            })(<Select
              allowClear
              style={{ width: '100%' }}
            >
              {
                isNotBlank(purchaseStatus) && purchaseStatus.length > 0 && purchaseStatus.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='采购要求'>
            {getFieldDecorator('purchaseRequire', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.purchaseRequire) ? modalRecord.purchaseRequire : '',     
              rules: [
                {
                  required: false,   
                  message: '采购要求',
                },
              ],
            })(<Input  />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='发票类型'>
            {getFieldDecorator('makeNeed', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.makeNeed) ? modalRecord.makeNeed : '',     
              rules: [
                {
                  required: false,   
                  message: '发票类型',
                },
              ],
            })(<Input  />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='需求日期'>
            {getFieldDecorator('needDate', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.needDate) ? modalRecord.needDate : '',     
              rules: [
                {
                  required: false,   
                  message: '需求日期',
                },
              ],
            })(<DatePicker
              
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='采购单价'>
            {getFieldDecorator('price', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.price) ? getPrice(modalRecord.price) : '',     
              rules: [
                {
                  required: false,   
                  message: '采购单价',
                },
              ],
            })(<Input  />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='采购数量'>
            {getFieldDecorator('number', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? modalRecord.number : '',     
              rules: [
                {
                  required: false,   
                  message: '采购数量',
                },
              ],
            })(<InputNumber style={{ width: '100%' }}  />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='订单编号'>
            {getFieldDecorator('orderCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.orderCode) ? modalRecord.orderCode : '',     
              rules: [
                {
                  required: false,   
                  message: '订单编号',
                },
              ],
            })(<Input style={{ width: '100%' }}  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='老单号'>
            {getFieldDecorator('agedCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.agedCode) ? modalRecord.agedCode : '',     
              rules: [
                {
                  required: false,   
                  message: '老单号',
                },
              ],
            })(<Input style={{ width: '100%' }}  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='备注信息'>
            {getFieldDecorator('remarks', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks : '',     
              rules: [
                {
                  required: false,   
                  message: '备注信息',
                },
              ],
            })(<Input  disabled />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
})
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator },
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows } = props;
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
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
      title: '物料编码',        
      dataIndex: 'billCode',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '一级编码',        
      dataIndex: 'oneCode',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '二级编码',        
      dataIndex: 'twoCode',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '一级编码型号',        
      dataIndex: 'oneCodeModel',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '二级编码名称',        
      dataIndex: 'twoCodeModel',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '名称',        
      dataIndex: 'name',   
      inputType: 'text',   
      width:200,          
      editable: true,      
    },
    {
      title: '原厂编码',        
      dataIndex: 'originalCode',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '配件厂商',        
      dataIndex: 'rCode',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '单位',        
      dataIndex: 'unit',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      width: 100,
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
      width: 100,          
      editable: true,      
    }
  ]
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
  return (
    <Modal
      title='物料选择'
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      width='80%'
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRows}
        data={cpBillMaterialList}
        columns={selectcolumns}
      />
    </Modal>
  );
});
const CreateFormgys = Form.create()(props => {
  const { handleModalVisiblegys, cpSupplierList, selectgysflag, selectgys } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectgys(record)}>
            选择
          </a>
        </Fragment>
      ),
    },
    {
      title: '主编号',        
      dataIndex: 'id',   
      inputType: 'text',   
      width: 100,          
      editable: false,      
    },
    {
      title: '供应商类型',        
      dataIndex: 'type',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '名称',        
      dataIndex: 'name',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '电话',        
      dataIndex: 'phone',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '传真',        
      dataIndex: 'fax',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '联系人',        
      dataIndex: 'linkman',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '所属分公司',        
      dataIndex: 'companyName',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '地址',        
      dataIndex: 'address',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '经营类型',        
      dataIndex: 'runType',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '绑定集团',        
      dataIndex: 'bindingGroup',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '创建者',        
      dataIndex: 'createBy.id',   
      inputType: 'text',   
      width: 100,          
      editable: false,      
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      editable: false,
      inputType: 'dateTime',
      width: 100,
      sorter: true,
      render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      width: 100,
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
      width: 100,          
      editable: true,      
    },
  ];
  return (
    <Modal
      title='选择供应商'
      visible={selectgysflag}
      onCancel={() => handleModalVisiblegys()}
      width='80%'
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={cpSupplierList}
        columns={columnskh}
      />
    </Modal>
  );
});
@connect(({ cpPurchaseStockPending, loading, cpSupplier, cpBillMaterial, cpPurchaseDetail }) => ({
  ...cpPurchaseStockPending,
  ...cpSupplier,
  ...cpBillMaterial,
  ...cpPurchaseDetail,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpPurchaseStockPendingForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectgysflag: false,
      selectgysdata: [],
      location: getLocation()
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const { location } = this.state
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
          purchaseStatus: data
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
          make_need: data
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
    dispatch({
      type: 'cpPurchaseDetail/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
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
        dispatch({
          type: 'cpPurchaseStockPending/cpPurchaseStockPending_Add',
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

  onselectgys = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpSupplier/cpSupplier_List',
      payload: {
        pageSize: 10,
        status: 0
      },
      callback: () => {
        this.setState({ selectgysflag: true })
      }
    })
  }

  selectgys = (record) => {
    this.setState({
      selectgysdata: record,
      selectgysflag: false
    })
  }

  handleModalVisiblegys = flag => {
    this.setState({
      selectgysflag: !!flag
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  showForm = () => {
    this.setState({
      FormVisible: true
    })
  }

  handleFormAdd = (values) => {
    const { dispatch } = this.props
    const { location, modalRecord } = this.state
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_Add',
      payload: {
        purchaseId: location.query.id,
        billId: modalRecord.id,
        ...values,
      },
      callback: () => {
        this.setState({
          FormVisible: false,
          modalRecord: []
        })
        dispatch({
          type: 'cpPurchaseFrom/cpPurchaseFrom_Get',
          payload: {
            id: location.query.id,
          }
        })
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            intentionId: location.query.id,
            pageSize: 10,
          }
        });
      }
    })
  }

  showTable = () => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
        pageSize: 10,
        tag:1
      }
    });
    this.setState({
      modalVisible: true
    });
  }

  selectuser = (res) => {
    const { dispatch } = this.props;
    const { selectedRows, location } = this.state;
    this.setState({
      modalVisible: false,
      modalRecord: res
    })
  }

  handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_Delete',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpPurchaseFrom/cpPurchaseFrom_Get',
          payload: {
            id: location.query.id,
          }
        })
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            intentionId: location.query.id,
            pageSize: 10,
          }
        });
      }
    });
  }

  render() {
    const { fileList, previewVisible, previewImage, selectgysflag, selectgysdata, modalRecord, modalVisible, selectedRows, FormVisible, orderflag, purchaseType, purchaseStatus } = this.state;
    const { submitting, cpPurchaseStockPendingGet, cpSupplierList, cpBillMaterialList, cpBillMaterialMiddleList, cpPurchaseDetailList } = this.props;
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
    const parentMethodsgys = {
      handleAddgys: this.handleAddgys,
      handleModalVisiblegys: this.handleModalVisiblegys,
      selectgys: this.selectgys,
      cpSupplierList,
      selectgysflag
    }
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      cpBillMaterialList,
      modalRecord,
      selectedRows,
      handleSelectRows: this.handleSelectRows,
    };
    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      selectForm: this.selectForm,
      showTable: this.showTable,
      modalRecord,
      FormVisible,
      purchaseType
      , purchaseStatus
    };
    const columns = [
      {
        title: '物料编码',        
        dataIndex: 'cpBillMaterial.billCode',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '一级编码',        
        dataIndex: 'cpBillMaterial.oneCode',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '二级编码',        
        dataIndex: 'cpBillMaterial.twoCode',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '一级编码型号',        
        dataIndex: 'cpBillMaterial.oneCodeModel',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '二级编码名称',        
        dataIndex: 'cpBillMaterial.twoCodeModel',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '名称',        
        dataIndex: 'cpBillMaterial.name',   
        inputType: 'text',   
        width: 200,          
        editable: true,      
      },
      {
        title: '原厂编码',        
        dataIndex: 'cpBillMaterial.originalCode',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '配件厂商',        
        dataIndex: 'cpBillMaterial.rCode',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '单位',        
        dataIndex: 'cpBillMaterial.unit',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '采购状态',        
        dataIndex: 'purchaseStatus',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '采购要求',        
        dataIndex: 'purchaseRequire',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '需求日期',
        dataIndex: 'needDate',
        editable: true,
        inputType: 'dateTime',
        width: 100,
        sorter: true,
        render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
      },
      {
        title: '单价',        
        dataIndex: 'price',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
        render: (text) => (getPrice(text))
      },
      {
        title: '数量',        
        dataIndex: 'number',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '金额',        
        dataIndex: 'money',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
        render: (text) => (getPrice(text))
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        editable: false,
        inputType: 'dateTime',
        width: 100,
        sorter: true,
        render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
      },
      {
        title: '更新时间',
        dataIndex: 'finishDate',
        editable: true,
        inputType: 'dateTime',
        width: 100,
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
        dataIndex: 'cpBillMaterial.remarks',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => {
          if (!orderflag) {
            return <Fragment>
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          }
          return ''
        },
      },
    ]
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='订单编号'>
              {getFieldDecorator('orderCode', {
                initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.orderCode) ? cpPurchaseStockPendingGet.orderCode : '',     
                rules: [
                  {
                    required: true,   
                    message: '请输入订单编号',
                    max: 255,
                  },
                ],
              })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label='单据状态'>
              <Input
                 
                value={isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.orderStatus) ? (
                cpPurchaseStockPendingGet.orderStatus === 0 || cpPurchaseStockPendingGet.orderStatus === '0' ? '未处理' :(
                cpPurchaseStockPendingGet.orderStatus === 1 || cpPurchaseStockPendingGet.orderStatus === '1' ? '已处理': 
                cpPurchaseStockPendingGet.orderStatus === 2 || cpPurchaseStockPendingGet.orderStatus === '2' ? '关闭': '')):''}
                style={cpPurchaseStockPendingGet.orderStatus === 0 || cpPurchaseStockPendingGet.orderStatus === '0' ? { color: '#f50' } :(
                              cpPurchaseStockPendingGet.orderStatus === 1 || cpPurchaseStockPendingGet.orderStatus === '1' ? { color: '#87d068' }:{color:'rgb(166, 156, 156)'}               
                              )}
              />
            </FormItem>
            <FormItem {...formItemLayout} label='供应商'>
              <Input
                
                value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.name) ? selectgysdata.name :
                (isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.cpSupplier) && isNotBlank(cpPurchaseStockPendingGet.cpSupplier.name) ? cpPurchaseStockPendingGet.cpSupplier.name : '')}
              />
              <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgys} loading={submitting}>选择</Button>
            </FormItem>
            <FormItem {...formItemLayout} label='采购状态'>
              {getFieldDecorator('purchaseStatus', {
                initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.purchaseStatus) ? cpPurchaseStockPendingGet.purchaseStatus : '',     
                rules: [
                  {
                    required: true,   
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
                    required: false,   
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
                    required: false,   
                    message: '请输入发票类型',
                  },
                ],
              })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="需求日期">
              {getFieldDecorator('needDate', {
                initialValue: isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.needDate) ? moment(cpPurchaseStockPendingGet.needDate) : null,
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
                    required: true,   
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
                    required: true,   
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
                    required: true,   
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
                    required: true,   
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
                    required: true,   
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
              </Button>
              <Button
                style={{ marginLeft: 8, marginBottom: '10px' }}
                onClick={() => this.showForm()}
                disabled={!(isNotBlank(cpPurchaseStockPendingGet) && isNotBlank(cpPurchaseStockPendingGet.id) && cpPurchaseStockPendingGet.orderStatus == 0)}
              >
                新增明细
              </Button>
            </FormItem>
          </Form>
        </Card>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <StandardEditTable
                scroll={{ x: 1400 }}
                data={cpPurchaseDetailList}
                bordered
                columns={columns}
              />
            </div>
          </Card>
        </div>
        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateFormgys {...parentMethodsgys} selectgysflag={selectgysflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpPurchaseStockPendingForm;
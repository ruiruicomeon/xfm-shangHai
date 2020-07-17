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
  Row,
  Col,
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, setPrice, getPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpQuitFromForm.less';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
Object.keys(obj)
  .map(key => obj[key])
  .join(',');
const CreateFormForm = Form.create()(props => {
  const {
    FormVisible,
    form,
    handleFormAdd,
    handleFormVisible,
    modalRecord,
    form: { getFieldDecorator },
    selctedRows,
    purchaseType,
    selectinkwdata,
    editdata,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      form.resetFields();
      const values = { ...fieldsValue };
      values.price = setPrice(values.price);
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
      title="修改明细"
      visible={FormVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleFormVisible()}
    >
      <Row gutter={12}>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="物料编码">
            <div>
              <Input
                
                disabled
                value={
                  isNotBlank(modalRecord) && isNotBlank(modalRecord.billCode)
                    ? modalRecord.billCode
                    : isNotBlank(editdata) &&
                      isNotBlank(editdata.cpBillMaterial) &&
                      isNotBlank(editdata.cpBillMaterial.billCode)
                    ? editdata.cpBillMaterial.billCode
                    : ''
                }
              />
            </div>
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="库位">
            {getFieldDecorator('kw', {
              initialValue:
                isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.name)
                  ? selectinkwdata.name
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.cpPjStorage) &&
                    isNotBlank(editdata.cpPjStorage.name)
                  ? editdata.cpPjStorage.name
                  : '', 
              rules: [
                {
                  required: true, 
                  message: '请输入原厂编码',
                },
              ],
            })(<Input  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="原厂编码">
            {getFieldDecorator('originalCode', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode)
                  ? modalRecord.originalCode
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.cpBillMaterial) &&
                    isNotBlank(editdata.cpBillMaterial.originalCode)
                  ? editdata.cpBillMaterial.originalCode
                  : '', 
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
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              message: '请输入原厂编码',
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.name)
                  ? modalRecord.name
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.cpBillMaterial) &&
                    isNotBlank(editdata.cpBillMaterial.name)
                  ? editdata.cpBillMaterial.name
                  : '', 
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
          <FormItem {...formItemLayout} label="二级编码名称">
            {getFieldDecorator('twoCodeModel', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.twoCodeModel)
                  ? modalRecord.twoCodeModel
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.cpBillMaterial) &&
                    isNotBlank(editdata.cpBillMaterial.two)&&isNotBlank(editdata.cpBillMaterial.two.name)
                  ? editdata.cpBillMaterial.two.name
                  : '', 
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
          <FormItem {...formItemLayout} label="一级编码型号">
            {getFieldDecorator('assemblyVehicleEmissions', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCodeModel)
                  ? modalRecord.oneCodeModel
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.cpBillMaterial) &&
                    isNotBlank(editdata.cpBillMaterial.one)&&isNotBlank(editdata.cpBillMaterial.one.model)
                  ? editdata.cpBillMaterial.one.model
                  : '', 
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
          <FormItem {...formItemLayout} label="配件厂商">
            {getFieldDecorator('rCode', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.rCode)
                  ? modalRecord.rCode
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.cpBillMaterial) &&
                    isNotBlank(editdata.cpBillMaterial.rCode)
                  ? editdata.cpBillMaterial.rCode
                  : '', 
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
          <FormItem {...formItemLayout} label="单位">
            {getFieldDecorator('unit', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.unit)
                  ? modalRecord.unit
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.cpBillMaterial) &&
                    isNotBlank(editdata.cpBillMaterial.unit)
                  ? editdata.cpBillMaterial.unit
                  : '', 
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
          <FormItem {...formItemLayout} label="退料数量">
            {getFieldDecorator('number', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.number)
                  ? modalRecord.number
                  : isNotBlank(editdata) && isNotBlank(editdata.number)
                  ? editdata.number
                  : '', 
              rules: [
                {
                  required: false, 
                  message: '退料数量',
                },
              ],
            })(<InputNumber style={{ width: '100%' }}  />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="库存单价">
            {getFieldDecorator('price', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.price)
              ? getPrice(modalRecord.price)
              : isNotBlank(editdata) &&
                isNotBlank(editdata.price)
              ? getPrice(editdata.price)
              : '', 
              rules: [
                {
                  required: false, 
                  message: '库存单价',
                },
              ],
            })(<InputNumber style={{ width: '100%' }}  disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="金额">
            <InputNumber
              style={{ width: '100%' }}
              
              disabled
              value={isNotBlank(modalRecord) && isNotBlank(modalRecord.money)
                ? getPrice(modalRecord.money)
                : isNotBlank(editdata) &&
                  isNotBlank(editdata.money)
                ? getPrice(editdata.money)
                : ''}
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="备注信息">
            {getFieldDecorator('remarks', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks)
                  ? modalRecord.remarks
                  : isNotBlank(editdata) && isNotBlank(editdata.remarks)
                  ? editdata.remarks
                  : '', 
              rules: [
                {
                  required: false, 
                  message: '备注信息',
                },
              ],
            })(<Input  />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});
@connect(({ cpQuitFrom, loading, cpPurchaseDetail }) => ({
  ...cpQuitFrom,
  ...cpPurchaseDetail,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpQuitFrom/cpQuitFrom_Add'],
  submitting2: loading.effects['cpupdata/cpQuitFrom_update'],
}))
@Form.create()
class CpQuitFromForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectedRows: [],
      selectkwflag: false,
      selectkwdata: [],
      selectinkwflag: false,
      selectinkwdata: [],
      editdata: {},
      orderflag: false,
      confirmflag :true,
      updataflag: true,
      updataname: '取消锁定',
      location: getLocation(),
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    const { dispatch } = this.props;
    const { location } = this.state;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpQuitFrom/cpQuitFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback:(res)=>{
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
          ||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpQuitFrom').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpQuitFrom')[0].children.filter(item=>item.name=='修改')
          .length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
          }

          if(isNotBlank(res.data)&&isNotBlank(res.data.pjEntrepot)&&isNotBlank(res.data.pjEntrepot.id)){
            this.setState({
              cpckid:res.data.pjEntrepot.id
            })
      }
      
          dispatch({
						type: 'sysarea/getFlatCode',
						payload:{
						id:location.query.id,
						type:'PJTL'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg:imgres.msg.split('|')[0]
						})
						}
						})
					  dispatch({
						type: 'sysarea/getFlatOrderdCode',
						payload:{
						id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
						type:'PJTL'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg1:imgres
						})
						}
						})
        }
      });
      dispatch({
        type: 'cpPurchaseDetail/cpPurchaseDetail_List',
        payload: {
          strageType: 2,
          purchaseId: location.query.id,
          pageSize: 10,
        },
      });
    }
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'stirage_type',
      },
      callback: data => {
        this.setState({
          stirageType: data,
        });
      },
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'del_flag',
      },
      callback: data => {
        this.setState({
          del_flag: data,
        });
      },
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpQuitFrom/clear',
    });
    dispatch({
      type: 'cpPurchaseDetail/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, cpQuitFromGet, updataflag } = this.state;
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
        if (isNotBlank(value) && isNotBlank(value.money)) {
          value.money = setPrice(value.money);
        }
        value.orderStatus = 1;
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        if (updataflag) {
          dispatch({
            type: 'cpQuitFrom/cpQuitFrom_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/warehouse/process/cp_quit_from_form?id=${location.query.id}`);
              // router.push('/warehouse/process/cp_quit_from_list');
            },
          });
        } else {
          dispatch({
            type: 'cpupdata/cpQuitFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/warehouse/process/cp_quit_from_form?id=${location.query.id}`);
              // router.push('/warehouse/process/cp_quit_from_list');
            },
          });
        }
      }
    });
  };

  onsave = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, cpQuitFromGet, updataflag } = this.state;
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
        if (isNotBlank(value) && isNotBlank(value.money)) {
          value.money = setPrice(value.money);
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        if (updataflag) {
          value.orderStatus = 0;
          dispatch({
            type: 'cpQuitFrom/cpQuitFrom_Add',
            payload: { ...value },
            callback: () => {
            },
          });
        } else {
          value.orderStatus = 1;
          dispatch({
            type: 'cpupdata/cpQuitFrom_update',
            payload: { ...value },
            callback: () => {},
          });
        }
      }
    });
  };

  onupdata = () => {
    const { location, updataflag } = this.state;
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定',
      });
    } else {
      router.push(`/warehouse/process/cp_quit_from_form?id=${location.query.id}`);
    }
  };

  onCancelCancel = () => {
    router.push('/warehouse/process/cp_quit_from_list');
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  editmx = data => {
    this.setState({
      FormVisible: true,
      editdata: data,
    });
  };

  handleFormAdd = values => {
    const { dispatch } = this.props;
    const { location, modalRecord, selectinkwdata, editdata } = this.state;
    const newdata = { ...values };
    if (isNotBlank(editdata) && isNotBlank(editdata.id)) {
      newdata.id = editdata.id;
    }
    dispatch({
      type: 'cpQuitFrom/update_quit_from_detail',
      payload: {
        'cpPjStorage.id':
          isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id)
            ? selectinkwdata.id
            : isNotBlank(editdata) &&
              isNotBlank(editdata.cpPjStorage) &&
              isNotBlank(editdata.cpPjStorage.id)
            ? editdata.cpPjStorage.id
            : '',
        purchaseId: location.query.id,
        billId:
          isNotBlank(modalRecord) && isNotBlank(modalRecord.id)
            ? modalRecord.id
            : isNotBlank(editdata) &&
              isNotBlank(editdata.cpBillMaterial) &&
              isNotBlank(editdata.cpBillMaterial.id) &&
              isNotBlank(editdata.cpBillMaterial.id)
            ? editdata.cpBillMaterial.id
            : '',
        ...newdata,
      },
      callback: () => {
        this.setState({
          FormVisible: false,
          modalRecord: [],
          selectinkwdata: {},
          editdata: {},
        });
        dispatch({
          type: 'cpQuitFrom/cpQuitFrom_Get',
          payload: {
            id: location.query.id,
          },
          callback: res => {
            if (res.data.orderStatus === 1 || res.data.orderStatus === '1') {
              this.setState({ orderflag: true });
            } else {
              this.setState({ orderflag: false });
            }
          },
        });
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            strageType: 2,
            purchaseId: location.query.id,
            pageSize: 10,
          },
        });
      },
    });
  };

  handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag,
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpPurchaseDetail/delete_Quit_From_Detail',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpQuitFrom/cpQuitFrom_Get',
          payload: {
            id: location.query.id,
          }
        })
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            strageType: 2,
            purchaseId: location.query.id,
            pageSize: 10,
          }
        });
      }
    });
  }

  onUndo=id=>{
		Modal.confirm({
			title: '撤销该退料单',
			content: '确定撤销该退料单吗',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.undoClick(id),
		});
  }

  undoClick=id=>{
    const { dispatch } = this.props
    const {confirmflag ,location}= this.state
		const that =this
        setTimeout(function(){
			that.setState({
			confirmflag:true
			})
		},1000)

		if(confirmflag){
		this.setState({
			confirmflag:false
		})
		dispatch({
			type: 'cpRevocation/cpQuitFrom_Revocation',
			payload: {
				id
			},
			callback: () => {
        router.push(`/warehouse/process/cp_quit_from_form?id=${location.query.id}`);
				// router.push('/warehouse/process/cp_quit_from_list');
			}
    })
  }
	}

  goprint = () => {
		const { location } = this.state	
		const w = window.open('about:blank')
		w.location.href = `/#/madeUp_MaterialReturn?id=${location.query.id}`
	}

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues , location } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    let sort = {};
    if(isNotBlank(sorter) && isNotBlank(sorter.field)){
      if(sorter.order === 'ascend'){
        sort = {
          'page.orderBy':`${sorter.field} asc`
        }
      }else if(sorter.order === 'descend'){
        sort = {
          'page.orderBy':`${sorter.field} desc`
        }
      }
    }
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
      strageType: 2,
      purchaseId: location.query.id,
    };
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: params,
    });
  };

  render() {
    const {
      fileList,
      previewVisible,
      previewImage,
      selectedRows,
      selectinkwdata,
      modalRecord,
      FormVisible,
      purchaseType,
      purchaseStatus,
      editdata,
      orderflag,
      updataflag,
      updataname,
      srcimg,srcimg1
    } = this.state;
    const {submitting2,submitting1, submitting, cpQuitFromGet, cpPurchaseDetailList } = this.props;
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
    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      selectForm: this.selectForm,
      selectinkwdata,
      modalRecord,
      FormVisible,
      purchaseType,
      editdata,
    };
    const columns = [
      {
        title: '修改',
        width: 100,
        align: 'center' ,
        render: (text, record) => {
          if (!orderflag) {
            return (
              <Fragment>
                <a onClick={() => this.editmx(record)}>修改</a>
              </Fragment>
            );
          }
        },
      },
      {
        title: '库位', 
        dataIndex: 'cpPjStorage.name', 
        inputType: 'text', 
        align: 'center' ,
        width: 150, 
        editable: true, 
      },
      {
        title: '物料编码', 
        dataIndex: 'cpBillMaterial.billCode', 
        inputType: 'text', 
        align: 'center' ,
        width: 100, 
        editable: true, 
      },
      {
        title: '一级编码', 
        dataIndex: 'cpBillMaterial.oneCode', 
        inputType: 'text', 
        align: 'center' ,
        width: 100, 
        editable: true, 
      },
      {
        title: '二级编码', 
        dataIndex: 'cpBillMaterial.twoCode', 
        inputType: 'text', 
        align: 'center' ,
        width: 100, 
        editable: true, 
      },
      {
        title: '一级编码型号', 
        dataIndex: 'cpBillMaterial.one.model', 
        inputType: 'text',
        align: 'center' , 
        width: 100, 
        editable: true, 
      },
      {
        title: '二级编码名称', 
        dataIndex: 'cpBillMaterial.two.name', 
        inputType: 'text',
        align: 'center' , 
        width: 100, 
        editable: true, 
      },
      {
        title: '名称', 
        dataIndex: 'cpBillMaterial.name', 
        inputType: 'text', 
        align: 'center' ,
        width: 200, 
        editable: true, 
      },
      {
        title: '原厂编码', 
        dataIndex: 'cpBillMaterial.originalCode', 
        inputType: 'text',
        align: 'center' , 
        width: 100, 
        editable: true, 
      },
      {
        title: '配件厂商', 
        dataIndex: 'cpBillMaterial.rCode', 
        inputType: 'text',
        align: 'center' , 
        width: 100, 
        editable: true, 
      },
      {
        title: '单位', 
        dataIndex: 'cpBillMaterial.unit', 
        inputType: 'text', 
        align: 'center' ,
        width: 100, 
        editable: true, 
      },
      {
        title: '需求日期',
        dataIndex: 'needDate',
        editable: true,
        align: 'center' ,
        inputType: 'dateTime',
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
        title: '单价', 
        dataIndex: 'price', 
        inputType: 'text',
        align: 'center' , 
        width: 100, 
        editable: true, 
        render: text => getPrice(text),
      },
      {
        title: '数量', 
        dataIndex: 'number', 
        inputType: 'text', 
        align: 'center' ,
        width: 100, 
        editable: true, 
      },
      {
        title: '金额', 
        dataIndex: 'money', 
        inputType: 'text',
        align: 'center' , 
        width: 100, 
        editable: true, 
        render: text => getPrice(text),
      },
      {
        title: '更新时间',
        dataIndex: 'finishDate',
        editable: true,
        align: 'center' ,
        inputType: 'dateTime',
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
        dataIndex: 'cpBillMaterial.remarks', 
        inputType: 'text', 
        align: 'center' ,
        width: 150, 
        editable: true, 
      },
      {
        title: '基础操作',
        width: 100,
        align: 'center' ,
        render: (text, record) => {
          if (!orderflag) {
            return (
              <Fragment>
                {isNotBlank(orderflag) && !orderflag && (
                  <Popconfirm
                    title="是否确认删除本行?"
                    onConfirm={() => this.handleDeleteClick(record.id)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                )}
              </Fragment>
            );
          }
          return '';
        },
      },
    ];
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
退料单
          </div>
          {isNotBlank(cpQuitFromGet)&&isNotBlank(cpQuitFromGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
            </span><img src={isNotBlank(srcimg)?getFullUrl(`/${srcimg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                    </div>}
          {isNotBlank(cpQuitFromGet)&&isNotBlank(cpQuitFromGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
            </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                           </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <FormItem {...formItemLayout} label='单据状态'>
                    <Input
                      disabled
                      
                       
                      value={isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.orderStatus) ? ((cpQuitFromGet.orderStatus === 0 || cpQuitFromGet.orderStatus === '0') ? '未处理' : '已处理') : ''}
                      style={cpQuitFromGet.orderStatus === 1 || cpQuitFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }}
                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    <Input
                      disabled
                      
                      value={isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.id)? cpQuitFromGet.id
                    : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单单号'>
                    {getFieldDecorator('orderCode', {
                initialValue:
                  isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.orderCode)
                    ? cpQuitFromGet.orderCode
                    : '', 
                rules: [
                  {
                    required: true, 
                    message: '请输入订单单号',
                    max: 255,
                  },
                ],
              })(<Input disabled  />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    <Input
                      disabled
                      
                      value={
                  isNotBlank(cpQuitFromGet) &&
                  isNotBlank(cpQuitFromGet.client) &&
                  isNotBlank(cpQuitFromGet.client.clientCpmpany)
                    ? cpQuitFromGet.client.clientCpmpany
                    : ''
                }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='配件仓库'>
                    <Input
                      disabled
                      
                      value={
                  isNotBlank(cpQuitFromGet) &&
                  isNotBlank(cpQuitFromGet.pjEntrepot) &&
                  isNotBlank(cpQuitFromGet.pjEntrepot.name)
                    ? cpQuitFromGet.pjEntrepot.name
                    : ''
                }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='出库类型'>
                    {getFieldDecorator('stirageType', {
                initialValue:
                  isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.stirageType)
                    ? cpQuitFromGet.stirageType
                    : '9fb7560b-5e34-4a88-9ba9-1e2a1f397176', 
                rules: [
                  {
                    required: true, 
                    message: '请输入出库类型',
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                  {isNotBlank(this.state.stirageType) &&
                    this.state.stirageType.length > 0 &&
                    this.state.stirageType.map(d => (
                      <Option key={d.id} value={d.value}>
                        {d.label}
                      </Option>
                    ))}
                </Select>
              )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='金额'>
                    <Input
                      
                      disabled
                      value={isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.money) ? getPrice(cpQuitFromGet.money) : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                initialValue:
                  isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.remarks)
                    ? cpQuitFromGet.remarks
                    : '', 
                rules: [
                  {
                    required: false,
                    message: '请输入备注信息',
                  },
                ],
              })(
                <TextArea
                  disabled={orderflag && updataflag}
                  style={{ minHeight: 32 }}
                  
                  rows={2}
                />
              )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 ,textAlign:'center'}}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
							打印
                </Button> 
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpQuitFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpQuitFrom')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
  }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpQuitFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpQuitFrom')[0].children.filter(item=>item.name=='修改')
.length>0&& <span>
  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting1||submitting2} disabled={orderflag&&updataflag}> 
                保存
  </Button>
  <Button
    style={{ marginLeft: 8 }}
    type="primary"
    htmlType="submit"
    loading={submitting1||submitting2} 
    disabled={orderflag && updataflag}
  >
                提交
  </Button>
  {orderflag&&
  <Button style={{ marginLeft: 8 }} loading={submitting1||submitting2} onClick={() => this.onUndo(cpQuitFromGet.id)}>撤销</Button>
  }
</span>
  }
                <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
                </Button>
              </FormItem>
            </Card>
          </Form>
        </Card>
        <Card bordered={false}>
          <StandardTable
            scroll={{ x: 1400 }}
            data={cpPurchaseDetailList}
            bordered
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpQuitFromForm;

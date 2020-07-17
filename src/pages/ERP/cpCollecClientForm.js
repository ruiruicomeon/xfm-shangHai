import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Popconfirm,
  message,
  Icon,Upload,
  Modal,
  Row,
  Col,
  InputNumber
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl ,getLocation,getPrice,setPrice} from '@/utils/utils';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import styles from './CpCollecClientForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const ImportFile = Form.create()(props => {
  const {
    modalImportVisible,
    handleImportVisible,
    UploadFileVisible,
    fileL,
    handleFileList,
  } = props;

  const Stoken = { token: getStorage('token') };

  const propsUpload = {
    name: 'file',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Beauty/beauty/cpCollecCode/import',
    
    beforeUpload(file) {
      const isimg = file.type.indexOf('image') < 0;
      if (!isimg) {
        message.error('请选择Execl文件上传');
      }
      const isLt10M = file.size / 1024 / 1024 <= 100;
      if (!isLt10M) {
        message.error('文件大小需为100M以内');
      }
      return isimg && isLt10M;
    },
    onChange(info) {
      const isimg = info.file.type.indexOf('image') < 0;
      const isLt10M = info.file.size / 1024 / 1024 <= 100;
      let fileList = info.fileList.slice(-1);

      fileList = fileList.filter(file => {
        if (file.response) {
          if (file.response.success === '1') {
            message.success(file.response.msg);
            UploadFileVisible();
          } else if (
            isNotBlank(file) &&
            isNotBlank(file.response) &&
            isNotBlank(file.response.msg)
          ) {
            message.error(file.response.msg);
          }
          return file.response.success === '1';
        }
        return true;
      });
      
      if (isimg && isLt10M) {
        handleFileList(fileList);
      }
    },
  };

  return (
    <Modal
      title="导入字典"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入字典
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord ,  form: { getFieldDecorator }} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = {...fieldsValue};
      values.money = setPrice(values.money)
      handleAdd(values);
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
      title="新增编码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label='名称'>
        {getFieldDecorator('name', {
					initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入名称',
						max: 255,
					  },
					],
				  })(<Input  />)}
      </FormItem>
      <FormItem {...formItemLayout} label='编码'>
        {getFieldDecorator('code', {
					initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.code) ? modalRecord.code : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入编码',
						max: 255,
					  },
					],
				  })(<Input  />)}
      </FormItem>
      <FormItem {...formItemLayout} label='金额'>
        {getFieldDecorator('money', {
					initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.money) ? getPrice(modalRecord.money) : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入金额',
					  },
					],
				  })(<Input  />)}
      </FormItem>
      <FormItem {...formItemLayout} label="备注信息">
        {getFieldDecorator('remarks', {
					initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks : '',     
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
    </Modal>
  );
});
@connect(({ cpCollecClient, loading ,cpCollecCode}) => ({
  ...cpCollecClient,
  ...cpCollecCode,
  loading: loading.models.cpCollecCode,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpCollecClient/cpCollecClient_Add'],
}))
@Form.create()
class CpCollecClientForm extends PureComponent {
  constructor(props) {
  	super(props);
		this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisible: false,
    modalRecord: {},
    orderflag:false,
    location: getLocation()
  }
}

  componentDidMount() {
    const { dispatch} = this.props;
    const {location} = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpCollecClient/cpCollecClient_Get',
        payload: {
          id: location.query.id,
        }
      });
      dispatch({
            type: 'cpCollecCode/cpCollecCode_List',
            payload: {
              'collecClient.id':location.query.id,
              pageSize: 10,
            }
          });
    }
    if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient')[0].children.filter(item=>item.name=='修改')
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
			type: 'del_flag',
		  },
		  callback: data => {
			this.setState({
			  del_flag : data
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
			  start_status : data
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
      type: 'cpCollecClient/clear',
    });
  }

  handleAdd = (value) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type:'cpCollecCode/cpCollecCode_Add',
      payload: {
         ...value ,
        'collecClient.id':location.query.id
      },
      callback: () => {
        this.setState({
          modalVisible: false
        }); 
        dispatch({
            type: 'cpCollecCode/cpCollecCode_List',
            payload: {
              pageSize: 10,
              'collecClient.id':location.query.id
            }
          });
      }
    })
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { addfileList ,location} = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        console.log(value)
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
          type:'cpCollecClient/cpCollecClient_Add',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicManagement/basis/cp_collec_client_list');
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch, form } = this.props;
    const { addfileList ,location} = this.state;
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
          type:'cpCollecClient/cpCollecClient_Add',
          payload: { ...value },
          callback: (res) => {
            router.push(`/basicManagement/basis/cp_collec_client_form?id=${res.data.id}`);
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicManagement/basis/cp_collec_client_list');
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

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues ,location } = this.state;
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
      'collecClient.id':location.query.id
    };
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const {location} = this.state
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
        current: 1,
        'collecClient.id':location.query.id
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  editAndDelete = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title: '删除数据',
      content: '确定删除已选择的数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.handleDeleteClick(),
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues ,location} = this.state;
    let ids = '';
    if (isNotBlank(id)) {
      ids = id;
    } else {
      if (selectedRows.length === 0) {
        message.error('未选择需要删除的数据');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    if (isNotBlank(ids)) {
      dispatch({
        type: 'cpCollecCode/cpCollecCode_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpCollecCode/cpCollecCode_List',
            payload: {
             pageSize: 10,
              ...formValues,
              'collecClient.id':location.query.id
            }
          });
        }
      });
    }
  };

   handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {location } = this.state
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      Object.keys(values).map((item) => {
        if( values[item] instanceof moment){
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpCollecCode/cpCollecCode_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          'collecClient.id':location.query.id
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues ,location } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    if (isNotBlank(value)) {
      Object.keys(value).map((item) => {
        if( value[item] instanceof moment){
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpCollecCode/cpCollecCode_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpCollecCode/cpCollecCode_List',
            payload: {
             pageSize: 10,
              ...formValues,
              'collecClient.id':location.query.id
            }
          });
        }
      });
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('code', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

   renderAdvancedForm() {
      const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('code', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="金额">
              {getFieldDecorator('money', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    showTable = flag => {
      const {location} = this.state;
      if(isNotBlank(location.query)&&isNotBlank(location.query.id)){
        this.setState({
        modalVisible: !!flag,
        modalRecord: {},
      });
      }else{
        message.error('请先提交，再添加记录')
      }
    };

    handleModalVisible = flag => {
      this.setState({
        modalVisible: !!flag,
        modalRecord: {},
      });
    };

    showidTable = (record) =>{
      this.setState({
        modalVisible: true,
        modalRecord:record,
      });
    }

    
  handleImportVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  
  // handleImportVisible = flag => {
  //   this.setState({
  //     modalImportVisible: !!flag,
  //     importFileList: [],
  //   });
  // };

  handleFileList = fileData => {
    this.setState({
      importFileList: fileData,
    });
  };

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  render() {
    const { fileList, previewVisible, previewImage ,expandForm ,selectedRows,modalVisible,modalRecord ,orderflag ,modalImportVisible, importFileList} = this.state;
    const {submitting1, submitting, cpCollecClientGet , loading, cpCollecCodeList } = this.props;
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

    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };


    const columns = [
      {
         title: '修改',
         width: 100,
         render: (text, record) => (
           <Fragment>
             <a onClick={() => this.showidTable(record)}>修改</a>
           </Fragment>
         ),
       },
      {
       title: '名称',        
       dataIndex: 'name',   
       inputType: 'text',   
       width: 100,          
       editable:  true  ,      
      },
      {
       title: '编码',        
       dataIndex: 'code',   
       inputType: 'text',   
       width: 100,          
       editable:  true  ,      
      },
      {
       title: '金额',        
       dataIndex: 'money',   
       inputType: 'text',   
       width: 100,          
       editable:  true  , 
       render:text=>(getPrice(text))    
      },
      {
       title: '备注信息',        
       dataIndex: 'remarks',   
       inputType: 'text',   
       width: 100,          
       editable:  true  ,      
      },
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient')[0].children.filter(item=>item.name=='修改')
          .length>0?
            <Fragment>
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          :''
        },
      },
     ];
     const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible:this.handleModalVisible,
      showTable: this.showTable,
      modalRecord
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
集采客户
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='名称'>
                  {getFieldDecorator('name', {
					initialValue: isNotBlank(cpCollecClientGet) && isNotBlank(cpCollecClientGet.name) ? cpCollecClientGet.name : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入名称',
						max: 255,
					  },
					],
				  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='返点'>
                  {getFieldDecorator('rebates', {
					initialValue: isNotBlank(cpCollecClientGet) && isNotBlank(cpCollecClientGet.rebates) ? cpCollecClientGet.rebates: '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入返点',
					  },
					],
          })(<InputNumber min={1}  style={{width:'100%'}}  
          disabled={orderflag}   formatter={value => `${value}%`}
          parser={value => value.replace('%', '')}/>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='状态'>
                  {getFieldDecorator('status', {
					initialValue: isNotBlank(cpCollecClientGet) && isNotBlank(cpCollecClientGet.status) ? cpCollecClientGet.status : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入状态',
						max: 255,
					  },
					],
				  })(<Select
  disabled={orderflag} 
  allowClear
  style={{ width: '100%' }}
  
				  >
  {
              isNotBlank(this.state.start_status) && this.state.start_status.length > 0 && this.state.start_status.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
            }
</Select>)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpCollecClientGet) && isNotBlank(cpCollecClientGet.remarks) ? cpCollecClientGet.remarks : '',     
					rules: [
					  {
						required:  false ,
						message: '请输入备注信息',
					  },
					],
				  })(
  <TextArea
    disabled={orderflag} 
    style={{ minHeight: 32 }}
    
    rows={2}
  />
				  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient')[0].children.filter(item=>item.name=='修改')
.length>0&&
<span>
  <Button type="primary" onClick={this.onsave} loading={submitting1}>
					   保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1}>
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
        <div className={styles.standardList}>
          <Card bordered={false}>

          {/* <div className={styles.tableListOperator}>
          <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
            导入
          </Button>
          </div>  */}

            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient')[0].children.filter(item=>item.name=='修改')
.length>0&&
<Button style={{marginBottom:'10px'}} icon="plus" type="primary" onClick={() => this.showTable(true)}>
                  新增记录
</Button>
  }
                {selectedRows.length > 0 &&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpCollecClient')[0].children.filter(item=>item.name=='修改')
.length>0&& (
<span>
  <Button icon="delete" onClick={(e) => this.editAndDelete(e)}> 批量删除</Button>
</span>
                )}
              </div>
              <StandardEditTable
                scroll={{ x: 700 }}
                selectedRows={selectedRows}
                loading={loading}
                data={cpCollecCodeList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>       

        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpCollecClientForm;
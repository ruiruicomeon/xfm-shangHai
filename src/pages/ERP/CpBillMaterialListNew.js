import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Upload, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { isNotBlank, getFullUrl ,getLocation } from '@/utils/utils';
import moment from 'moment';
import styles from './CpBillMaterialListNew.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const ImportFile = Form.create()(props => {
  const {
    modalImportVisible,
    handleImportVisible,
    UploadFileVisible,
    fileL,
    handleFileList,
    sortId,
  } = props;
  const Stoken = { token: getStorage('token') };
  const propsUpload = {
    name: 'list',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Beauty/beauty/cpBillMaterial/import',
    data: { parent: sortId},
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
      title="导入物料编码"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入物料编码
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});
const CreateFormMore = Form.create()(props => {
  const { modalVisibleMore, handleModalVisibleMore, form: { getFieldDecorator },
    cpBillMaterialList, selectmore, handleSelectRows1, selectedRows1, dispatch, form  ,location} = props;
  const selectcolumns = [
    {
      title: '物料编码',        
      dataIndex: 'billCode',   
      inputType: 'text',   
      width: 150,          
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
      width: 300,          
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
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      Object.keys(values).map((item) => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpBillMaterial/get_cpBill_caterialList2',
        payload: {
          pageSize: 100,
          ...values,
          parent1:location.query.id,
          current: 1,
          tag:1
        }
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpBillMaterial/get_cpBill_caterialList2',
      payload: {
        pageSize: 100,
        current: 1,
        parent1:location.query.id,
        tag:1
      }
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
      parent1: location.query.id,
      tag:1
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cpBillMaterial/get_cpBill_caterialList2',
      payload: params,
    });
  };

  return (
    <Modal
      title='物料选择'
      visible={modalVisibleMore}
      onOk={(e) => selectmore(e)}
      onCancel={() => handleModalVisibleMore()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="原厂编码">
              {getFieldDecorator('originalCode', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="配件厂商">
              {getFieldDecorator('rCode', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
                </Button>
              </div> 
            </div>
          </Col>
        </Row>
      </Form>
      {isNotBlank(selectedRows1)&& selectedRows1.length > 0 && (
        <span>
          <Button icon="user-add" onClick={(e) => selectmore(e)}>批量选择</Button>
        </span>
      )}
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        childrenColumnName='cpBillMaterialList'
        // pageSizeOptions={['10','100','500','1000']}
        selectedRows={selectedRows1}
        onSelectRow={handleSelectRows1}
        onChange = {handleStandardTableChange}
        data={cpBillMaterialList}
        columns={selectcolumns}
      />
    </Modal>
  );
});
@connect(({ cpBillMaterial, loading }) => ({
  ...cpBillMaterial,
  loading: loading.models.cpBillMaterial,
}))
@Form.create()
class CpBillMaterialListNew extends PureComponent {
  constructor(props) {
  super(props);
  this.state = {
    expandForm: false,
    selectedRows: [],
    selectedRows1: [],
    formValues: {},
    modalImportVisible: false,
    importFileList: [],
    wltitle:'',
    location: getLocation(),
  }
}

  componentDidMount() {
    const { dispatch } = this.props;
    const {location} = this.state
    dispatch({
      type: 'cpClient/get_CpType',
      payload:{
        id: isNotBlank(location)&&isNotBlank(location.query)&&isNotBlank(location.query.id)?location.query.id:''
      },
      callback:(res)=>{
        this.setState({
            wltitle:isNotBlank(res.data)&&isNotBlank(res.data.name)?res.data.name:''
        })
          dispatch({
      type: 'cpBillMaterial/get_cpBill_caterialList1',
      payload: {
        pageSize: 10,
        typeId:location.query.id,
        tag:1
      }
    });
      }
    })
  }

  componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpBillMaterial/clear',
		});
	}

  gotoUpdateForm = (id) => {
    router.push(`/basicManagement/materials/cp_bill_material_new?id=${id}`);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues ,location} = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    let sort = {};
    if (isNotBlank(sorter) && isNotBlank(sorter.field)) {
      if (sorter.order === 'ascend') {
        sort = {
          'page.orderBy': `${sorter.field} asc`
        }
      } else if (sorter.order === 'descend') {
        sort = {
          'page.orderBy': `${sorter.field} desc`
        }
      }
    }
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
      typeId:location.query.id,
      tag:1
    };
    dispatch({
      type:'cpBillMaterial/get_cpBill_caterialList1',
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
      type: 'cpBillMaterial/get_cpBill_caterialList1',
      payload: {
        pageSize : 10,
        current: 1,
        typeId:location.query.id,
        tag:1
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
        type: 'cpBillMaterial/delete_CpBillType',
        payload: {
          ids,
          typeId:location.query.id,
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpBillMaterial/get_cpBill_caterialList1',
            payload: {
              pageSize: 10,
              ...formValues,
              typeId:location.query.id,
              tag:1
            }
          });
        }
      });
    }
  };

  handleSelectRows = (rows) => {
    console.log(rows)
    this.setState({
      selectedRows: rows,
    });
  };

  handleSelectRows1 = rows => {
    this.setState({
      selectedRows1: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {location} = this.state
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      Object.keys(values).map((item) => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpBillMaterial/get_cpBill_caterialList1',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          typeId:location.query.id,
          tag:1
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    if (isNotBlank(value)) {
      Object.keys(value).map((item) => {
        if (value[item] instanceof moment) {
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpBillMaterial/cpBillMaterial_List',
            payload: {
              pageSize: 10,
              ...formValues,
              tag:1
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
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
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
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
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
            <FormItem label="一级编码">
              {getFieldDecorator('oneCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码">
              {getFieldDecorator('twoCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="原厂编码">
              {getFieldDecorator('originalCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="配件厂商">
              {getFieldDecorator('rCode', {
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

  handleImportVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  handleFileList = fileData => {
    this.setState({
      importFileList: fileData,
    });
  };

  handleUpldExportClick = type => {
    const userid = { id: getStorage('userid'), isTemplate: type };
    window.open(`/api/Beauty/sys/user/export?${stringify(userid)}`);
  };

  handleModalVisibleMore = flag => {
    this.setState({
      modalVisibleMore: !!flag
    });
  };

  showTable = () => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpBillMaterial/get_cpBill_caterialList2',
      payload: {
        pageSize: 100,
        // typeId :location.query.id,
         parent1:location.query.id,
         tag:1
      }
    });
    this.setState({
      modalVisibleMore: true
    });
  }

  selectmore = (res) => {
    const { dispatch } = this.props;
    const { selectedRows1, location } = this.state;
    this.setState({
      modalVisibleMore: false,
      modalRecord: res
    })
    let ids = '';
    if (selectedRows1.length === 1) {
      ids = selectedRows1[0];
    } else {
      if (selectedRows1.length === 0) {
        message.error('未选择物料列表');
        return;
      }
      ids = selectedRows1.map(row => row).join(',');
    }
    dispatch({
      type: 'cpBillMaterial/updateBacth',
      payload: {
        typeId:location.query.id,
        ids
      },
      callback: () => {
        this.setState({
          modalVisibleMore: false
        })
        dispatch({
          type: 'cpBillMaterial/get_cpBill_caterialList1',
          payload: {
            typeId:location.query.id,
            pageSize: 10,
            tag:1
          }
        });
      }
    })
  }

  showwlcode=(id)=>{
    const {dispatch} = this.props
    dispatch({
      type: 'sysarea/getFlatCode',
      payload: {
        id: isNotBlank(id) ? id : '',
        type: 'WL'
      },
      callback: (srcres) => {
          this.setState({
            srcimg:srcres.msg
          })
      }
    })
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handleImage = url => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }

  render() {
    const { selectedRows, importFileList, modalImportVisible, selectedRows1, modalVisibleMore ,srcimg ,wltitle ,previewImage,previewVisible ,location} = this.state;
    const { loading, cpBillMaterialList, dispatch, getcpBillmaterialList1, getcpBillmaterialList2 } = this.props;
    const parentMethodsMore = {
      handleAdd: this.handleAdd,
      handleModalVisibleMore: this.handleModalVisibleMore,
      selectmore: this.selectmore,
      cpBillMaterialList: getcpBillmaterialList2,
      selectedRows1,
      dispatch,
      location,
      handleSelectRows1: this.handleSelectRows1,
    }
    const columns = [
      {
        title: '物料二维码',
        dataIndex: 'photo',
        align: 'center',
        width: 200,
        render:(text)=>{
              return <img
                src={getFullUrl(`/${text}`)} 
                onClick={() => this.handleImage(getFullUrl(`/${text}`))}
                style={{width:'100px'}}
                alt=""
              />
        }
      },
      {
        title: '物料编码',        
        dataIndex: 'billCode',
        align: 'center',
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '一级编码',        
        dataIndex: 'oneCode',   
        inputType: 'text',   
        width: 100,
        align: 'center',      
        editable: true,      
      },
      {
        title: '二级编码',
        align: 'center',     
        dataIndex: 'twoCode',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '一级编码型号',
        align: 'center',       
        dataIndex: 'oneCodeModel',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '二级编码名称',
        align: 'center',      
        dataIndex: 'twoCodeModel',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '名称',
        align: 'center',      
        dataIndex: 'name',   
        inputType: 'text',   
        width: 200,          
        editable: true,      
      },
      {
        title: '原厂编码',        
        dataIndex: 'originalCode',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '配件厂商',        
        dataIndex: 'rCode',   
        inputType: 'text',
        align: 'center',   
        width: 100,          
        editable: true,      
      },
      {
        title: '单位',        
        dataIndex: 'unit',
        align: 'center',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      // {
      //   title: '状态',        
      //   dataIndex: 'status',
      //   align: 'center',  
      //   inputType: 'text',   
      //   width: 100,          
      //   editable: true,      
      // },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        align: 'center',
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
        align: 'center',
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
        align: 'center',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
    ];
    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
      sortId:location.query.id
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <div className={styles.tableListOperator}>
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'datum').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'datum')[0].children.filter(item => item.name == '修改')
                    .length > 0 &&
            <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
              导入编码
            </Button>
              }
          </div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'datum').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'datum')[0].children.filter(item => item.name == '修改')
                    .length > 0 &&
                    <Button icon="plus" type="primary" onClick={() => this.showTable()}>
                    新增
                    </Button>
                }
                {selectedRows.length > 0 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'datum').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'datum')[0].children.filter(item => item.name == '修改')
                    .length > 0 && (
                  <span>
                    <Button icon="delete" onClick={(e) => this.editAndDelete(e)}> 批量删除</Button>
                  </span>
                )}
                <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
                </Button>
                <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                  扫码物料({wltitle})
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: 700 }}
                selectedRowKeys='billTypeId'
                selectedRows={selectedRows}
                loading={loading}
                data={getcpBillmaterialList1}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                // pageSizeOptions={[10,100,500,1000]}
              />
            </div>
          </Card>
        </div>
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
        <CreateFormMore {...parentMethodsMore} modalVisibleMore={modalVisibleMore} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpBillMaterialListNew;
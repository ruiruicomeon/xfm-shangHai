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
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './cpZcInventoryFromForm.less';
import StandardTable from '@/components/StandardTable';
import { stringify } from 'qs';
import StandardEditTable from '@/components/StandardEditTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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
    previewVisible, previewImage,
  } = props;

  const Stoken = { token: getStorage('token') };

  const propsUpload = {
    name: 'list',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Beauty/beauty/cpPurchaseDetail/importAssemblyData',
    
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
      title="导入物料"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入物料
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});

const CreateFormgs = Form.create()(props => {
  const { handleModalVisiblegs, complist, selectgsflag, selectgs, dispatch, form, 
    form: { getFieldDecorator } ,that} = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectgs(record)}>
            选择
          </a>
        </Fragment>
      ),
    },
    {
      title: '分公司编号',
      dataIndex: 'code',
      align: 'center',
      width: 150,
    },
    {
      title: '分公司名称',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '公司图标',
      dataIndex: 'logo',
      align: 'center',
      width: 150,
      render: (text) => {
        if (isNotBlank(text)) {
          const images = text.split('|').map((item) => {
            if (isNotBlank(item)) {
              return <img
                key={item}
                onClick={() => this.handleImage(getFullUrl(item))}
                style={{ height: 50, width: 50, marginRight: 10 }}
                alt="example"
                src={getFullUrl(item)}
              />
            }
            return null;
          })
          return <div>{images}</div>
        }
        return '';
      },
    },
    {
      title: '所属大区',
      dataIndex: 'area.name',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'master',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人电话',
      dataIndex: 'zipCode',
      align: 'center',
      width: 150,
    },
    {
      title: '抬头中文',
      dataIndex: 'rise',
      align: 'center',
      width: 150,
    },
    {
      title: '电话1',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
    },
    {
      title: '抬头英文',
      dataIndex: 'enrise',
      align: 'center',
      width: 150,
    },
    {
      title: '电话2',
      dataIndex: 'twoPhone',
      align: 'center',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      width: 200,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      align: 'center',
      width: 150,
    },
    {
      title: '网址',
      dataIndex: 'website',
      align: 'center',
      width: 150,
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
    that.setState({
      gssearch:{}
    })
    dispatch({
      type: 'company/query_comp',
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
      ...that.state.gssearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'company/query_comp',
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

      that.setState({
        gssearch:values
      })

      dispatch({
        type: 'company/query_comp',
        payload: values,
      });
    });
  };

  const handleModalVisiblegsin = ()=>{
    form.resetFields();
    that.setState({
      gssearch:{}
    })
    handleModalVisiblegs()
  }

  return (
    <Modal
      title='选择所属公司'
      visible={selectgsflag}
      
      onCancel={() => handleModalVisiblegsin()}
      width='80%'
    >

      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="公司名称">
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
        data={complist}
        columns={columnskh}
      />
    </Modal>
  );
});

const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, cpPurchaseDetailModalList, selectkhflag, selectcustomer, location, handleSelectRows1, selectedRows1, handledel, dispatch, form, form: { getFieldDecorator } } = props;
  const columnskh = [
    {
      title: '物料编码',        
      dataIndex: 'cpBillMaterial.billCode',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
    },

    {
      title: '一级编码',        
      dataIndex: 'cpBillMaterial.oneCode',   
      inputType: 'text',
      align: 'center',  
      width: 100,          
      editable: true,      
    },

    {
      title: '二级编码',
      align: 'center',      
      dataIndex: 'cpBillMaterial.twoCode',   
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },

    {
      title: '一级编码型号',        
      dataIndex: 'cpBillMaterial.one.model',   
      inputType: 'text',
      align: 'center',  
      width: 100,          
      editable: true,      
    },

    {
      title: '二级编码名称',        
      dataIndex: 'cpBillMaterial.two.name',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
    },

    {
      title: '名称',        
      dataIndex: 'cpBillMaterial.name',   
      inputType: 'text',
      align: 'center',   
      width:300,          
      editable: true,      
    },

    {
      title: '原厂编码',        
      dataIndex: 'cpBillMaterial.originalCode',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
    },
    {
      title: '配件厂商',        
      dataIndex: 'cpBillMaterial.rCode',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
    },
    {
      title: '单位',        
      dataIndex: 'cpBillMaterial.unit',   
      inputType: 'text',
      align: 'center',   
      width: 100,          
      editable: true,      
    },
    {
      title: '库位',        
      dataIndex: 'cpPjStorage.name',   
      inputType: 'text',
      align: 'center',   
      width: 150,          
      editable: true,      
    },
    {
      title: '需求日期',
      dataIndex: 'needDate',
      align: 'center',
      editable: true,
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
      align: 'center',    
      width: 100,          
      editable: true,      
      render: (text) => (getPrice(text))
    },

    {
      title: '数量',        
      dataIndex: 'number',   
      inputType: 'text',
      align: 'center',   
      width: 100,          
      editable: true,      
    },

    {
      title: '金额',        
      dataIndex: 'money',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
      render: (text) => (getPrice(text))
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      align: 'center',
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
      title: '状态',        
      dataIndex: 'status',   
      inputType: 'text',
      align: 'center',    
      width: 100,          
      editable: true,      
      render: (text) => {
        if (isNotBlank(text) && text == 0) {
          return '未处理'
        }
        if (isNotBlank(text) && text == 1) {
          return '已处理'
        }
      }
    },
    {
      title: '备注信息',        
      dataIndex: 'cpBillMaterial.remarks',   
      inputType: 'text',
      align: 'center',   
      width: 150,          
      editable: true,      
    },
  ]

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
        type: 'cpPurchaseDetail/cpPurchaseDetail_modal_List',
        payload: {
          ...values,
          strageType: 1,
          
          purchaseId: location.query.id,
        },
      });
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

  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_modal_List',
      payload: {
        strageType: 1,
        
        purchaseId: location.query.id,
        current: 1,
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
      strageType: 1,
      
      purchaseId: location.query.id,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_modal_List',
      payload: params,
    });
  };
  return (
    <Modal
      title='选择退货列表'
      visible={selectkhflag}
      
      footer={null}
      onCancel={() => handleModalVisiblekh()}
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

      <Button icon="user-add" onClick={handledel} disabled={!(isNotBlank(selectedRows1) && selectedRows1.length > 0)}>批量退货</Button>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        selectedRows={selectedRows1}
        onSelectRow={handleSelectRows1}
        
        data={cpPurchaseDetailModalList}
        onChange={handleStandardTableChange}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormkw = Form.create()(props => {
  const { handleModalVisiblekw, cpPjEntrepotList, selectkwflag, selectkw, dispatch, form, form: { getFieldDecorator } } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectkw(record)}>
            选择
          </a>
        </Fragment>
      ),
    },
    {
      title: '仓库名',        
      dataIndex: 'name',
      align: 'center',    
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '所属公司',        
      dataIndex: 'office.name',
      align: 'center',    
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      align: 'center',
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
      dataIndex: 'remarks',
      align: 'center',    
      inputType: 'text',   
      width: 150,          
      editable: true,      
    },
  ];

  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpEntrepot/cpEntrepot_List',
      payload: {
        pageSize: 10,
        current: 1,
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
      type: 'cpEntrepot/cpEntrepot_List',
      payload: params,
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
        type: 'cpEntrepot/cpEntrepot_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  return (
    <Modal
      title='选择所属仓库'
      visible={selectkwflag}
      
      onCancel={() => handleModalVisiblekw()}
      width='80%'
    >

      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
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
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Form>
      </Row>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpPjEntrepotList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateForminkw = Form.create()(props => {
  const { handleModalVisibleinkw, cpckid, cpPjStorageList, selectinkwflag, selectinkw, dispatch, form, form: { getFieldDecorator } } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectinkw(record)}>
            选择
          </a>
        </Fragment>
      ),
    },
    {
      title: '配件仓库',
      align: 'center',      
      dataIndex: 'entrepotName',   
      inputType: 'text',   
      width: 150,          
      editable: true,      
    },

    {
      title: '库位',        
      dataIndex: 'name',
      align: 'center',   
      inputType: 'text',   
      width: 150,          
      editable: true,      
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      align: 'center',
      editable: true,
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
      dataIndex: 'remarks',
      align: 'center',   
      inputType: 'text',   
      width: 150,          
      editable: true,      
    },
  ];

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
        type: 'cpPjStorage/cpPjStorage_List',
        payload: {
          ...values,
          pjEntrepotId: cpckid,
          pageSize: 10,
          current: 1,
        },
      });
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

  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpPjStorage/cpPjStorage_List',
      payload: {
        pageSize: 10,
        pjEntrepotId: cpckid,
        current: 1,
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
      pjEntrepotId: cpckid
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cpPjStorage/cpPjStorage_List',
      payload: params,
    });
  };

  return (
    <Modal
      title='选择所属库位'
      visible={selectinkwflag}
      
      onCancel={() => handleModalVisibleinkw()}
      width='80%'
    >

      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('entrepotName', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="库位名">
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
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Form>
      </Row>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpPjStorageList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormForm = Form.create()(props => {
  const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator }, submitting1, changecode,
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, purchaseStatus, purchaseType, showTable, showKwtable, selectinkwdata, editdata, searchcode, billid } = props;

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
  const modelsearch = (e) => {
    changecode(e.target.value)
  }

  const handleFormVisiblehide = () => {
    form.resetFields();
    handleFormVisible()
  }

  return (
    <Modal
      title="新增明细"
      visible={FormVisible}
      onOk={okHandle}
      width='80%'
      onCancel={() => handleFormVisiblehide()}
    >
      <Row gutter={12}>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='物料编码'>
            <div>
              <Input
                
                value={isNotBlank(billid) ? billid : ''}
                onChange={modelsearch}
              />
              <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={searchcode}>查询</Button> <Button style={{ marginLeft: 8 }} onClick={() => showTable()}>选择</Button>
            </div>
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='库位'>
            {getFieldDecorator('kw', {
              initialValue: isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.name) ? selectinkwdata.name :
                (isNotBlank(editdata) && isNotBlank(editdata.cpPjStorage) && isNotBlank(editdata.cpPjStorage.name) ? editdata.cpPjStorage.name : ''),     
              rules: [
                {
                  required: true,   
                  message: '请选择库位',
                  
                },
              ],
            })
              (<Input  />)}
            <Button style={{ marginLeft: 8 }} onClick={() => showKwtable()}>选择</Button>
          </FormItem>
        </Col>
        
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='原厂编码'>
            {getFieldDecorator('originalCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.originalCode) ? editdata.cpBillMaterial.originalCode : ''),     
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
              message: '请输入原厂编码',
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.name) ? editdata.cpBillMaterial.name : ''),     
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.twoCodeModel) ? modalRecord.twoCodeModel :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.two) && isNotBlank(editdata.cpBillMaterial.two.name) ? editdata.cpBillMaterial.two.name : ''),     
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCodeModel) ? modalRecord.oneCodeModel :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.one) && isNotBlank(editdata.cpBillMaterial.one.model) ? editdata.cpBillMaterial.one.model : ''),     
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.rCode) ? modalRecord.rCode :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.rCode) ? editdata.cpBillMaterial.rCode : ''),     
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.unit) ? modalRecord.unit :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.unit) ? editdata.cpBillMaterial.unit : ''),     
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
          <FormItem {...formItemLayout} label='采购单价'>
            {getFieldDecorator('price', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.price) ? getPrice(modalRecord.price) :
                (isNotBlank(editdata) && isNotBlank(editdata.price) ? getPrice(editdata.price) : ''),     
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? modalRecord.number :
                (isNotBlank(editdata) && isNotBlank(editdata.number) ? editdata.number : ''),     
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
          <FormItem {...formItemLayout} label='采购金额'>
            <InputNumber
              style={{ width: '100%' }}
              value={isNotBlank(modalRecord) && isNotBlank(modalRecord.money) ? getPrice(modalRecord.money) :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.money) ? getPrice(editdata.cpBillMaterial.money) : '')}
              
              disabled
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='采购单价'>
            {getFieldDecorator('price', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.price) ? getPrice(modalRecord.price) :
                (isNotBlank(editdata) && isNotBlank(editdata.price) ? getPrice(editdata.price) : ''),     
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
            {getFieldDecorator('inventoryNumbers', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? modalRecord.number :
                (isNotBlank(editdata) && isNotBlank(editdata.number) ? editdata.number : ''),     
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
          <FormItem {...formItemLayout} label='采购金额'>
            <InputNumber
              style={{ width: '100%' }}
              value={isNotBlank(modalRecord) && isNotBlank(modalRecord.money) ? getPrice(modalRecord.money) :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.money) ? getPrice(editdata.cpBillMaterial.money) : '')}
              
              disabled
            />
          </FormItem>
        </Col>
        <Col lg={24} md={24} sm={24}>
          <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
            {getFieldDecorator('orderCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.orderCode) ? modalRecord.orderCode :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.orderCode) ? editdata.cpBillMaterial.orderCode : ''),     
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.agedCode) ? modalRecord.agedCode :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.agedCode) ? editdata.cpBillMaterial.agedCode : ''),     
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks :
                (isNotBlank(editdata) && isNotBlank(editdata.remarks) ? editdata.remarks : ''),     
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
})
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator },
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, dispatch, location } = props;

  const selectcolumns = [
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
      align: 'center',    
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },

    {
      title: '二级编码',        
      dataIndex: 'twoCode',
      align: 'center',    
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },

    {
      title: '一级编码型号',        
      dataIndex: 'oneCodeModel',
      align: 'center',    
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },

    {
      title: '二级编码名称',        
      dataIndex: 'twoCodeModel',
      align: 'center',    
      inputType: 'text',   
      width: 100,          
      editable: true,      
    },

    {
      title: '名称',        
      dataIndex: 'name',
      align: 'center',   
      inputType: 'text',   
      width: 300,          
      editable: true,      
    },

    {
      title: '原厂编码',        
      dataIndex: 'originalCode',   
      inputType: 'text',
      align: 'center',   
      width: 100,          
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
      align: 'center',   
      inputType: 'text',   
      width: 150,          
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
        type: 'cpBillMaterial/cpBillMaterial_List',
        payload: {
          purchaseId: location.query.id,
          pageSize: 10,
          ...values,
          current: 1,
        }
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
        pageSize: 10,
        current: 1,
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
      oddId: location.query.id,
      itemType: "1",
      status: '0'
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cpInventory/get_CpInventory_wllist',
      payload: params,
    });
  };

  return (
    <Modal
      title='物料选择'
      visible={modalVisible}
      
      onCancel={() => handleModalVisible()}
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
      
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        selectedRows={selectedRows}
        
        onChange={handleStandardTableChange}
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
@connect(({ cpInStorageFrom, loading, cpBillMaterial, cpPurchaseDetail, cpPjEntrepot, cpPjStorage, company, cpInventory, cpEntrepot }) => ({
  ...cpInStorageFrom,
  ...cpBillMaterial,
  ...cpPurchaseDetail,
  ...cpPjEntrepot,
  ...cpPjStorage,
  ...cpEntrepot,
  ...company,
  ...cpInventory,
  submitting1: loading.effects['cpBillMaterial/cpBillMaterial_search_List'],
  submitting: loading.effects['form/submitRegularForm'],
  submitting2: loading.effects['cpInventory/save_CpAssembly'],
}))
@Form.create()
class cpZcInventoryFromForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectkwflag: false,
      selectkwdata: [],
      selectinkwflag: false,
      selectinkwdata: [],
      selectedRows1: [],
      editdata: {},
      orderflag: false,
      updataflag: true,
      cpckid: '',
      confirmflag :true,
      updataname: '取消锁定',
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpInventory/get_pInventory',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.status === 1 || res.data.status === '1' || res.data.status === 2 || res.data.status === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'PDZC').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'PDZC')[0].children.filter(item => item.name == '修改')
                .length == 0)) {
            this.setState({ orderflag: true })
          } else {
            this.setState({ orderflag: false })
          }

          if (isNotBlank(res.data.stirageType)) {
            this.setState({
              seleval: res.data.stirageType
            })
          }

          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'PJRK'
            },
            callback: (imgres) => {
              this.setState({
                srcimg: imgres.msg.split('|')[0]
              })
            }
          })

          dispatch({
            type: 'sysarea/getFlatOrderdCode',
            payload: {
              id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
              type: 'PJRK'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
            }
          })
          this.props.form.setFieldsValue({
            entrepotName: isNotBlank(res) && isNotBlank(res.data) && isNotBlank(res.data.entrepotName) ? res.data.entrepotName : ''
          })
          dispatch({
            type: 'cpInventory/get_CpInventory_wllist',
            payload: {
              pageSize: 10,
              oddId: location.query.id,
              itemType: "1",
              status: '0'
            }
          });
        }
      });
    }

    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'purchase_type',
      },
      callback: data => {
        this.setState({
          purchaseType: data
        })
      }
    });

    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'stirageType',
      },
      callback: data => {
        this.setState({
          stirageType: data
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

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpInStorageFrom/clear',
    });
    dispatch({
      type: 'cpPurchaseDetail/clear',
    });
    dispatch({
      type: 'cpPjStorage/clear',
    });
    dispatch({
      type: 'cpInventory/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, CpInventoryGet, cpPurchaseDetailList } = this.props;
    const { addfileList, location, selectkwdata, updataflag, selectgsdata } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (isNotBlank(cpPurchaseDetailList) && isNotBlank(cpPurchaseDetailList.list) && cpPurchaseDetailList.list.length > 0 && cpPurchaseDetailList.list.some((item) => { return item.billtype == 0 })) {
          message.error('请重新选择库位')
        } else {
          const value = {};

          if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
            value.id = location.query.id;
            value.status = 1
            dispatch({
              type: 'cpInventory/save_CpAssembly',
              payload: { ...value },
              callback: (res) => {
                this.setState({
                  addfileList: [],
                  fileList: [],
                });
                if (isNotBlank(res) && isNotBlank(res.data) && isNotBlank(res.data.id)) {
                  router.push(`/warehouse/process/cp_assembly_inventory_form?id=${res.data.id}`);
                } else {
                  router.push('/warehouse/process/cp_assembly_inventory_list');
                }
              }
            })
          }
        }
      }
    });
  };

  onupdata = () => {
    const { location, updataflag } = this.state
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定'
      })
    } else {
      router.push(`/warehouse/process/cp_in_storage_from_form?id=${location.query.id}`);
    }
  }

  onsave = () => {
    const { dispatch, form, CpInventoryGet } = this.props;
    const { addfileList, location, selectkwdata, updataflag, selectgsdata } = this.state;
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
        value.entrepotId = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id : (isNotBlank(CpInventoryGet)
          && isNotBlank(CpInventoryGet.entrepotId) ? CpInventoryGet.entrepotId : '')
        value.officeId = isNotBlank(selectgsdata) && isNotBlank(selectgsdata.id) ? selectgsdata.id : (isNotBlank(CpInventoryGet)
          && isNotBlank(CpInventoryGet.officeId) ? CpInventoryGet.officeId : '')

        if (updataflag) {
          value.status = 0
          dispatch({
            type: 'cpInventory/post_CpAssembly',
            payload: { ...value },
            callback: (res) => {
              router.push(`/warehouse/process/cp_assembly_inventory_form?id=${res.data.id}`);
            }
          })
        } else {
          value.status = 1
          dispatch({
            type: 'cpupdata/cpInStorageFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
            }
          })
        }
      }
    })
  };

  onCancelCancel = () => {
    router.push('/warehouse/process/cp_assembly_inventory_list');
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

  handleSelectRows1 = rows => {
    this.setState({
      selectedRows1: rows,
    });
  };

  showForm = () => {
    this.setState({
      FormVisible: true
    })
  }

  handleFormAdd = (values) => {
    const { dispatch } = this.props
    const { location, modalRecord, selectinkwdata, editdata } = this.state

    const newdata = { ...values }
    if (isNotBlank(editdata) && isNotBlank(editdata.id)) {
      newdata.id = editdata.id
    }

    dispatch({
      type: 'cpInventory/post_CpAssembly_OperationItem',
      payload: {
        type: 1,
        'cpPjStorage.id': isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id) ? selectinkwdata.id :
          (isNotBlank(editdata) && isNotBlank(editdata.cpPjStorage) && isNotBlank(editdata.cpPjStorage.id) ? editdata.cpPjStorage.id : ''),
        purchaseId: location.query.id,
        billId: isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? modalRecord.id :
          (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.id) && isNotBlank(editdata.cpBillMaterial.id) ? editdata.cpBillMaterial.id : ''),
        ...newdata,
      },
      callback: () => {
        this.setState({
          FormVisible: false,
          modalRecord: [],
          selectinkwdata: {},
          editdata: {}
        })
        dispatch({
          type: 'cpInventory/get_pInventory',
          payload: {
            id: location.query.id,
          }
        });
        dispatch({
          type: 'cpInventory/get_CpInventory_wllist',
          payload: {
            purchaseId: location.query.id,
            pageSize: 10,
            itemType: "1",
            status: '0'
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

  showKwtable = () => {
    const { dispatch } = this.props
    const { cpckid } = this.state
    if (isNotBlank(cpckid)) {
      dispatch({
        type: 'cpPjStorage/cpPjStorage_List',
        payload: {
          pageSize: 10,
          pjEntrepotId: cpckid
        }
      });
      this.setState({
        selectinkwflag: true
      })
    } else {
      message.error('请先选择仓库')
    }

  }

  selectuser = (res) => {
    const { dispatch } = this.props;
    const { selectedRows, location } = this.state;

    this.setState({
      modalVisible: false,
      modalRecord: res,
      billid: res.billCode
    })
  }

  handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag,
      editdata: {},
      selectinkwdata: {},
      modalRecord: {},
      billid: '',
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
      type: 'cpInventory/delete_CpInventory_OperationItem',
      payload: {
        id,
        purchaseId: location.query.id
      },
      callback: (res) => {
        dispatch({
          type: 'cpInventory/get_pInventory',
          payload: {
            id: location.query.id,
          }
        });
        dispatch({
          type: 'cpInventory/get_CpInventory_wllist',
          payload: {
            
            oddId: location.query.id,
            pageSize: 10,
            itemType: "1",
            status: '0'
          }
        });
      }
    });
  }

  onselectkw = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'cpEntrepot/cpEntrepot_List',
      payload: {
        current: 1,
        pageSize: 10
      }
    })

    this.setState({
      selectkwflag: true
    })
  }

  selectkw = (record) => {
    
    const { dispatch, CpInventoryGet, form } = this.props
    const { location, selectkwdata } = this.state

    this.props.form.setFieldsValue({
      entrepotName: isNotBlank(record) && isNotBlank(record.name) ? record.name : ''
    })

    this.setState({
      selectkwdata: record,
      selectkwflag: false,
      cpckid: record.id
    })
    const value = form.getFieldsValue()
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      value.id = location.query.id;
    }

    value.cpPjEntrepot = {}
    value.cpPjEntrepot.Id = record.id

    value.status = -1
    dispatch({
      type: 'cpInStorageFrom/cpInStorageFrom_save_Add',
      payload: { ...value },
      callback: () => {
        dispatch({
          type: 'cpInventory/get_CpInventory_wllist',
          payload: {
            pageSize: 10,
            oddId: location.query.id,
            itemType: "1",
            status: '0'
          }
        });
      }
    })
  }

  handleModalVisiblekw = flag => {
    this.setState({
      selectkwflag: !!flag
    });
  };

  onselectinkw = () => {
    const { dispatch } = this.props;
    this.setState({
      selectinkwflag: true
    })
  }

  selectinkw = (record) => {
    
    const { dispatch } = this.props
    this.setState({
      selectinkwdata: record,
      selectinkwflag: false
    })
  }

  handleModalVisibleinkw = flag => {
    this.setState({
      selectinkwflag: !!flag
    });
  };

  handledel = () => {
    const { dispatch } = this.props;
    const { selectedRows1, location } = this.state;
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
      type: 'cpInStorageFrom/post_Cp_OutSales_From',
      payload: {
        ids,
        parent: location.query.id
      },
      callback: () => {
        this.setState({
          selectkhflag: false,
          selectedRows1: []
        })
        dispatch({
          type: 'cpInventory/get_pInventory',
          payload: {
            id: location.query.id,
          }
        });
        dispatch({
          type: 'cpInventory/get_CpInventory_wllist',
          payload: {
            
            oddId: location.query.id,
            pageSize: 10,
            itemType: "1",
            status: '0'
          }
        });
      }
    })
  }

  editmx = (data) => {
    this.setState({
      FormVisible: true,
      billid: isNotBlank(data.cpBillMaterial) && isNotBlank(data.cpBillMaterial.billCode) ? data.cpBillMaterial.billCode : '',
      editdata: data
    });
  }

  showTableTh = () => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_modal_List',
      payload: {
        strageType: 1,
        
        purchaseId: location.query.id,
        pageSize: 10,
      }
    })
    this.setState({
      selectkhflag: true
    })
  }

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  onUndo = id => {
    Modal.confirm({
      title: '撤销该总成盘点单',
      content: '确定撤销该总成盘点单吗',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(id),
    });
  }

  undoClick = id => {
    const { dispatch } = this.props;
    const { location , confirmflag} = this.state;
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
      type: 'cpRevocation/undo_CpAssembly',
      payload: {
        id
      },
      callback: () => {
        dispatch({
          type: 'cpInventory/get_pInventory',
          payload: {
            id: location.query.id,
          }
        });
        this.setState({ orderflag: false })
      }
    })
  }
  }

  searchcode = () => {
    const { dispatch } = this.props
    const { location, billid } = this.state
    if (isNotBlank(billid)) {
      this.setState({
        modalRecord: {},
        
      })
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_search_List',
        payload: {
          purchaseId: location.query.id,
          
          billCode: billid,
          pageSize: 10,
          tag:1
        },
        callback: (res) => {
          if (isNotBlank(res) && isNotBlank(res.list) && res.list.length > 0) {
            this.setState({
              modalRecord: res.list[0]
            })
          }
        }
      });
    } else {
      message.error('请输入物料编码')
    }
  }

  changecode = (id) => {
    this.setState({
      modalRecord: {},
      billid: id
    })
  }

  colorstyle = (e) => {
    this.setState({
      seleval: e
    })
  }

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/madeUp_PutStorage?id=${location.query.id}`
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, location } = this.state;

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
      // singelId: location.query.id,
      oddId: location.query.id,
      itemType: "1",
      status: '0'
    };
    dispatch({
      type : 'cpInventory/get_CpInventory_wllist',
      // type: 'cpBillMaterial/cpBillMaterial_middle_List',
      payload: params,
    });
  };

  selectgs = (record) => {
    
    this.setState({
      selectgsdata: record,
      selectgsflag: false
    })
  }

  handleModalVisiblegs = flag => {
    this.setState({
      selectgsflag: !!flag
    });
  };

  onselectgs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
    this.setState({
      selectgsflag: true
    })
  }

  handleUpldExportClick = (type) => {
    const { location } = this.state
    const userid = { id: isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id) ? location.query.id : '' };
    window.open(`/api/Beauty/beauty/cpPurchaseDetail/exportAssemblyData?${stringify(userid)}`);
  };

  handleImportVisible = flag => {
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

  UploadFileVisible = flag => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpInventory/get_CpInventory_wllist',
      payload: {
        pageSize: 10,
        oddId: location.query.id,
        itemType: "1",
        status: '0'
      }
    });
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  render() {
    const { fileList, previewVisible, previewImage, selectgysflag, selectgysdata, modalRecord, modalVisible, selectedRows, selectedRows1,
      FormVisible, orderflag, purchaseType, purchaseStatus, selectkwdata, selectkwflag, selectinkwflag, selectinkwdata, editdata, selectkhflag
      , location, updataflag, updataname, billid, cpckid, seleval, srcimg, srcimg1, selectgsflag, selectgsdata, importFileList, modalImportVisible } = this.state;
    const {submitting2, getCpInventorywllist, submitting, submitting1, complist, CpInventoryGet, cpSupplierList, cpBillMaterialList, cpBillMaterialMiddleList, cpPurchaseDetailList, cpPjEntrepotList, cpEntrepotList, cpPjStorageList, cpPurchaseDetailModalList, dispatch } = this.props;
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

      const that = this

    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,that
    };

    const parentMethodsgs = {
      handleModalVisiblegs: this.handleModalVisiblegs,
      
      selectgs: this.selectgs,
      complist,
      dispatch,
      that
      
    }

    const parentMethodsgys = {
      handleAddgys: this.handleAddgys,
      handleModalVisiblegys: this.handleModalVisiblegys,
      selectgys: this.selectgys,
      that,
      cpSupplierList,
      selectgysflag
      
    }

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      that,
      selectuser: this.selectuser,
      cpBillMaterialList,
      modalRecord,
      location,
      dispatch,
      selectedRows,
      handleSelectRows: this.handleSelectRows,
    };

    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      that,
      selectForm: this.selectForm,
      showTable: this.showTable,
      showKwtable: this.showKwtable,
      selectinkwdata,
      modalRecord,
      FormVisible,
      purchaseType
      , purchaseStatus
      , editdata,
      searchcode: this.searchcode,
      billid, cpckid,
      changecode: this.changecode,
      submitting1
    };

    const parentMethodskw = {
      handleModalVisiblekw: this.handleModalVisiblekw,
      that,
      selectkw: this.selectkw,
      dispatch,
      cpPjEntrepotList: cpEntrepotList
      
    }

    const parentMethodsinkw = {
      handleModalVisibleinkw: this.handleModalVisibleinkw,
      that,
      selectinkw: this.selectinkw,
      dispatch,
      cpPjStorageList,
      cpckid
      
    }

    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectedRows1,
      dispatch,
      location,
      
      cpPurchaseDetailModalList,
      handleSelectRows1: this.handleSelectRows1,
      selectcustomer: this.selectcustomer,
      handledel: this.handledel
    }

    const columns = [
      {
        title: '总成编码',        
        dataIndex: 'purchaseCode',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '总成型号',        
        dataIndex: 'assemblyModel',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '总成号',        
        dataIndex: 'assemblyCode',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '大号',        
        dataIndex: 'assemblyMaxCode',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '小号',        
        dataIndex: 'assemblyMinCode',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '车型',        
        dataIndex: 'vehicleModel',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '品牌',        
        dataIndex: 'assemblyBrand',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '技术参数',        
        dataIndex: 'technicalParameter',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '总成类型',        
        dataIndex: 'assemblyType',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '库位',        
        dataIndex: 'pjstoragename',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '金额',        
        dataIndex: 'inventoryUnitprice',   
        inputType: 'text',   
        width: 100,
        align: 'center',        
        editable: true,      
        render: (text) => (getPrice(text))
      },
      {
        title: '实盘数量',        
        dataIndex: 'actualNumbers',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '盘亏数量',        
        dataIndex: 'dishdeficientNumbers',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '盘盈数量',        
        dataIndex: 'surplusNumbers',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '盘亏金额',        
        dataIndex: 'dishdeficientPrice',   
        inputType: 'text',   
        width: 100,
        align: 'center',        
        editable: true,      
        render: (text) => (getPrice(text))
      },
      {
        title: '盘盈金额',        
        dataIndex: 'surplusPrice',   
        inputType: 'text',   
        width: 100,
        align: 'center',        
        editable: true,      
        render: (text) => (getPrice(text))
      },
    {
      title: '原总成金额',        
      dataIndex: 'formerInventoryPrice',   
      inputType: 'text',   
      width: 100,
      align: 'center',        
      editable: true,      
      render: (text) => (getPrice(text))
    },
    {
      title: '原总成单价',        
      dataIndex: 'formerInventoryUnitPrice',   
      inputType: 'text',   
      width: 100,
      align: 'center',        
      editable: true,      
      render: (text) => (getPrice(text))
    },
    {
      title: '原总成数量',        
      dataIndex: 'formerInventoryNumbers',   
      inputType: 'text',   
      width: 100,
      align: 'center',        
      editable: true,      
    },
      {
        title: '备注信息',        
        dataIndex: 'remarks',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => {
          if (!orderflag) {
            return (
              <Fragment>
                <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </Fragment>
            )
          }
          return ''
        },
      },
    ]

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>总成盘点单</div>
          {isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) ? getFullUrl(`/${srcimg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
            </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单据状态'>
                    {getFieldDecorator('status', {
                      initialValue: isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.status) ? ((CpInventoryGet.status === 0 || CpInventoryGet.status === '0') ? '未处理' : '已处理') : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入单据状态',
                          max: 255,
                        },
                      ],
                    })(<Input  style={isNotBlank(CpInventoryGet) && (CpInventoryGet.status === 1 || CpInventoryGet.status === '1') ? { color: '#87d068' } : { color: '#f50' }} disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    {getFieldDecorator('id', {
                      initialValue: isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.id) ? CpInventoryGet.id : '',     
                      rules: [
                        {
                          required: false,   
                          message: '单号',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='操作人'>
                    {getFieldDecorator('name', {
                      initialValue: isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.name) ? CpInventoryGet.name : getStorage('username'),     
                      rules: [
                        {
                          required: false,   
                          message: '操作人',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='盘点日期'>
                    {getFieldDecorator('createDate', {
                      initialValue: isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.createDate) ? CpInventoryGet.createDate : '',     
                      rules: [
                        {
                          required: false,   
                          message: '盘点日期',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属分公司'>
                    <Input disabled style={{ width: '50%' }}  value={isNotBlank(selectgsdata) && isNotBlank(selectgsdata.name) ? selectgsdata.name : (isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.officeName) ? CpInventoryGet.officeName : '')} />
                    <Button disabled={orderflag} type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgs} loading={submitting}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属仓库'>
                    {getFieldDecorator('entrepotName', {
                      rules: [
                        {
                          required: true,   
                          message: '所属仓库',
                          max: 255,
                        },
                      ],
                    })
                      (<Input style={{ width: '50%' }}  disabled />)}
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkw} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(CpInventoryGet) && isNotBlank(CpInventoryGet.remarks) ? CpInventoryGet.remarks : '',     
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
                        disabled={orderflag && updataflag}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
                
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'PDZC').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'PDZC')[0].children.filter(item => item.name == '修改')
                    .length > 0 && <span>
                      <Button type="primary" style={{ marginLeft: 8 }} loading={submitting2} onClick={this.onsave} disabled={orderflag && updataflag}>
                      保存
                      </Button>
                      {
                      isNotBlank(location.query.id) ?
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting2} disabled={!isNotBlank(getCpInventorywllist.list) || getCpInventorywllist.list.length <= 0 || (orderflag && updataflag)}>
                          提交
                        </Button>
                        : null}
                      {orderflag &&
                      <Button style={{ marginLeft: 8 }} loading={submitting2} onClick={() => this.onUndo(CpInventoryGet.id)}>撤销</Button>
                    }
                      {
                      isNotBlank(location.query.id) ?
                        <Button style={{ marginLeft: 8 }} icon="cloud-upload" onClick={() => this.handleImportVisible(true)} disabled={orderflag && updataflag}>
                          导入总成
                        </Button>
                        : null
                    }
                      {
                      isNotBlank(location.query.id) ?
                        <Button style={{ marginLeft: 8 }} icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
                          导出总成
                        </Button>
                        : null
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
            scroll={{ x: 2500 }}
            data={getCpInventorywllist}
            bordered
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>

        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
        <CreateFormgs {...parentMethodsgs} selectgsflag={selectgsflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateForminkw {...parentMethodsinkw} selectinkwflag={selectinkwflag} />
        <CreateFormkw {...parentMethodskw} selectkwflag={selectkwflag} />
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

export default cpZcInventoryFromForm;

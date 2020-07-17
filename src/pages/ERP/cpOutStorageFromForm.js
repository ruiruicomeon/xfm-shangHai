import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  InputNumber,
  message,
  Icon,
  Modal,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, setPrice, getPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpOutStorageFromForm.less';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
Object.keys(obj)
  .map(key => obj[key])
  .join(',');
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, cpClientList, selectkhflag, selectcustomer } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center' ,
      render: record => (
        <Fragment>
          <a onClick={() => selectcustomer(record)}>选择</a>
        </Fragment>
      ),
    },
    {
			title: '客户',        
			dataIndex: 'clientCpmpany',   
			inputType: 'text',
			align: 'center',    
			width: 240,          
			editable: true,      
		},
    {
      title: '客户编码', 
      dataIndex: 'code', 
      align: 'center' ,
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
    {
      title: '联系人', 
      dataIndex: 'name', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
    },
    {
      title: '客户分类', 
      dataIndex: 'classify',
      align: 'center' , 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
    {
      title: '客户级别', 
      dataIndex: 'level',
      align: 'center' , 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
    {
      title: '联系地址', 
      dataIndex: 'address',
      align: 'center' , 
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
    {
      title: '邮箱', 
      dataIndex: 'email', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
    },
    {
      title: '移动电话', 
      dataIndex: 'phone', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
    },
    {
      title: '电话', 
      dataIndex: 'tel',
      align: 'center' , 
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
    {
      title: '传真', 
      dataIndex: 'fax',
      align: 'center' , 
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
    {
      title: '税号', 
      dataIndex: 'dutyParagraph', 
      align: 'center' ,
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
    {
      title: '开户账号', 
      dataIndex: 'openNumber', 
      align: 'center' ,
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
    {
      title: '开户银行', 
      dataIndex: 'openBank',
      align: 'center' , 
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
    {
      title: '开户地址', 
      dataIndex: 'openAddress', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
    },
    {
      title: '开户电话', 
      dataIndex: 'openTel', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
    },
    {
      title: '创建者', 
      dataIndex: 'user.name', 
      inputType: 'text',
      align: 'center' , 
      width: 100, 
      editable: false, 
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
      dataIndex: 'remarks',
      align: 'center' , 
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
  ];
  return (
    <Modal
      title="选择客户"
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekh()}
      width="80%"
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={cpClientList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormtl = Form.create()(props => {
  const {
    handleModalVisibletl,
    cpPurchaseDetailModalList,
    selecttlflag,
    selectcustomer,
    handleSelectRows1,
    selectedRows1,
    handledel,dispatch,location,
    form ,form: { getFieldDecorator },submitting4,that
  } = props;
  const columnskh = [
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
      title: '库位', 
      dataIndex: 'cpPjStorage.name', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
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
      title: '状态', 
      dataIndex: 'status', 
      inputType: 'text',
      align: 'center' , 
      width: 100, 
      editable: true, 
      render: text => {
        if (isNotBlank(text) && text == 0) {
          return '未处理';
        }
        if (isNotBlank(text) && text == 1) {
          return '已处理';
        }
      },
    },
    {
      title: '备注信息', 
      dataIndex: 'cpBillMaterial.remarks', 
      inputType: 'text',
      align: 'center' , 
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
      if( values[item] instanceof moment){
        values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
      }
      return item;
      });
      that.setState({
        tlsearch:values
      })
      dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_modal_List',
      payload: {
        ...values,
        // strageType: 2,
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
    that.setState({
      tlsearch:{}
    })
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_modal_List',
      payload: {
        // strageType: 2,
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
        ...that.state.tlsearch,
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        // strageType: 2,
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

    const handleModalVisibletlin = ()=>{
      form.resetFields();
      that.setState({
         tlsearch:{}
      })
      handleModalVisibletl()
    }

  return (
    <Modal
      title="选择退料列表"
      visible={selecttlflag}
      // onOk={()=>handledel()}
      footer={null}
      onCancel={() => handleModalVisibletlin()}
      width="80%"
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
      <Button
        icon="user-add"
        loading={submitting4}
        onClick={handledel}
        disabled={!(isNotBlank(selectedRows1) && selectedRows1.length > 0)}
      >
        批量退料
      </Button>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        selectedRows={selectedRows1}
        onSelectRow={handleSelectRows1}
        onChange={handleStandardTableChange}
        data={cpPurchaseDetailModalList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormkw = Form.create()(props => {
  const {
    handleModalVisiblekw,
    cpPjEntrepotList,
    selectkwflag,
    selectkw,
    dispatch,
    form,
    form: { getFieldDecorator },that
  } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center' ,
      render: record => (
        <Fragment>
          <a onClick={() => selectkw(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '仓库名', 
      dataIndex: 'name', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
    },
    {
      title: '所属公司', 
      dataIndex: 'office.name', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      align: 'center' ,
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
      align: 'center' ,
      width: 150, 
      editable: true, 
    },
  ];
  const handleFormReset = () => {
    // form.resetFields();
    // that.setState({
    //   cksearch:{}
    // })
    dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
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
      ...that.state.cksearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
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
      Object.keys(values).map(item => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });

      that.setState({
        cksearch:values
      })

      dispatch({
        type: 'cpPjEntrepot/cpPjEntrepot_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

const handleModalVisiblekwin = ()=>{
  // form.resetFields();
  // that.setState({
  //     cksearch:{}
  // })
  handleModalVisiblekw()
}  


  return (
    <Modal
      title="选择所属仓库"
      visible={selectkwflag}
      onCancel={() => handleModalVisiblekwin()}
      width="80%"
    >
      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input  />)}
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
  const {
    handleModalVisibleinkw,
    cpPjStorageList,
    selectinkwflag,
    selectinkw,
    dispatch,
    form,cpckid,
    form: { getFieldDecorator },
    that
  } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center' ,
      render: record => (
        <Fragment>
          <a onClick={() => selectinkw(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '配件仓库', 
      dataIndex: 'pjEntrepotId',
      align: 'center' , 
      inputType: 'text', 
      width: 150, 
      editable: true, 
    },
    {
      title: '库位', 
      dataIndex: 'name', 
      inputType: 'text',
      align: 'center' , 
      width: 150, 
      editable: true, 
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
      dataIndex: 'remarks', 
      inputType: 'text', 
      align: 'center' ,
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
      Object.keys(values).map(item => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });

      that.setState({
        kwsearch:values
      })

      dispatch({
        type: 'cpPjStorage/cpPjStorage_List',
        payload: {
          ...values,
          id: cpckid,
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
    that.setState({
      kwsearch:{}
    })
    dispatch({
      type: 'cpPjStorage/cpPjStorage_List',
      payload: {
        pageSize: 10,
        id: cpckid,
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
      ...that.state.kwsearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
      ...filters,
      id: cpckid,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpPjStorage/cpPjStorage_List',
			payload: params,
		});
  };
  
   const handleModalVisibleinkwin = ()=>{
    form.resetFields();
    that.setState({
      kwsearch:{}
    })
    handleModalVisibleinkw()
   }

  return (
    <Modal
      title="选择所属库位"
      visible={selectinkwflag}
      onCancel={() => handleModalVisibleinkwin()}
      width="80%"
    >
      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('entrepotName', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="库位名">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input  />)}
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
  const {
    FormVisible,
    form,
    handleFormAdd,
    handleFormVisible,
    modalRecord,
    form: { getFieldDecorator },
    cpBillMaterialList,
    selectuser,
    handleSelectRows,
    selectedRows,
    purchaseStatus,
    purchaseType,
    showTable,
    showKwtable,
    selectinkwdata,
    editdata,
    searchcode,
    billid,
    changecode,
    submitting1
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
  const modelsearch =(e)=>{
    changecode(e.target.value)
  }
  const handleFormVisiblehide =()=>{
    form.resetFields();
    handleFormVisible()
  }
  return (
    <Modal
      title="新增明细"
      visible={FormVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleFormVisiblehide()}
    >
      <Row gutter={12}>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="物料编码">
            <div>
              <Input
                
                value={isNotBlank(billid) ? billid:''}
                onChange={modelsearch} 
                disabled
              />
              <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={searchcode}>查询</Button> 
              
              {/*<Button style={{ marginLeft: 8 }} onClick={() => showTable()}>
                选择
              </Button> */}
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
                  required: false, 
                  message: '请输入原厂编码',
                },
              ],
            })(<Input  />)}
            <Button style={{ marginLeft: 8 }} onClick={() => showKwtable()}>
              选择
            </Button>
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
                    isNotBlank(editdata.cpBillMaterial.two) &&
                    isNotBlank(editdata.cpBillMaterial.two.name)
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
                    isNotBlank(editdata.cpBillMaterial.one)&&
                    isNotBlank(editdata.cpBillMaterial.one.model)
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
          <FormItem {...formItemLayout} label="出库数量">
            {getFieldDecorator('number', {
              initialValue:
                isNotBlank(editdata) && isNotBlank(editdata.number)
                  ? editdata.number
                  : '', 
              rules: [
                {
                  required: false, 
                  message: '出库数量',
                },
              ],
            })(<InputNumber  style={{ width: '100%' }}  />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="金额">
            <InputNumber
              style={{ width: '100%' }}
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceMoney)&&isNotBlank(editdata) && isNotBlank(editdata.number)
                  ? getPrice(modalRecord.balanceMoney*editdata.number)
                  : isNotBlank(editdata) && isNotBlank(editdata.money)
                  ? getPrice(editdata.money)
                  : ''
              }
              
              disabled
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="库存单价">
            {getFieldDecorator('price', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceMoney)
                  ? getPrice(modalRecord.balanceMoney)
                  : isNotBlank(editdata) && isNotBlank(editdata.price)
                  ? getPrice(editdata.price)
                  : '', 
              rules: [
                {
                  required: false, 
                  message: '库存单价',
                },
              ],
            })(<InputNumber disabled style={{ width: '100%' }}  />)}
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
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    modalRecord,
    form: { getFieldDecorator },
    cpBillMaterialList,
    selectuser,
    handleSelectRows,
    selectedRows,
    dispatch,
    location,
  } = props;
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center' ,
      render: record => (
        <Fragment>
          <a onClick={() => selectuser(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '物料编码', 
      dataIndex: 'billCode', 
      align: 'center' ,
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
    {
      title: '一级编码', 
      dataIndex: 'oneCode',
      align: 'center' , 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
    {
      title: '二级编码', 
      dataIndex: 'twoCode', 
      inputType: 'text',
      align: 'center' , 
      width: 100, 
      editable: true, 
    },
    {
      title: '一级编码型号', 
      dataIndex: 'oneCodeModel', 
      inputType: 'text', 
      align: 'center' ,
      width: 100, 
      editable: true, 
    },
    {
      title: '二级编码名称', 
      dataIndex: 'twoCodeModel', 
      inputType: 'text', 
      align: 'center' ,
      width: 100, 
      editable: true, 
    },
    {
      title: '名称', 
      dataIndex: 'name', 
      inputType: 'text', 
      align: 'center' ,
      width: 200, 
      editable: true, 
    },
    {
      title: '原厂编码', 
      dataIndex: 'originalCode', 
      inputType: 'text',
      align: 'center' , 
      width: 100, 
      editable: true, 
    },
    {
      title: '配件厂商', 
      dataIndex: 'rCode', 
      inputType: 'text', 
      align: 'center' ,
      width: 100, 
      editable: true, 
    },
    {
      title: '单位', 
      dataIndex: 'unit', 
      inputType: 'text',
      align: 'center' , 
      width: 100, 
      editable: true, 
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
      dataIndex: 'remarks', 
      inputType: 'text',
      align: 'center' , 
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
      purchaseId: location.query.id,
      tag:1
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
		  type: 'cpBillMaterial/cpBillMaterial_List',
			payload: params,
		});
	};
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      Object.keys(values).map(item => {
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
          tag:1
        },
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
      },
    });
  };

  

  return (
    <Modal
      title="物料选择"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      width="80%"
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="原厂编码">
              {getFieldDecorator('originalCode', {
                initialValue: '',
              })(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="配件厂商">
              {getFieldDecorator('rCode', {
                initialValue: '',
              })(<Input  />)}
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
      width: 150,
      render: record => (
        <Fragment>
          <a onClick={() => selectgys(record)}>选择</a>
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
      title="选择供应商"
      visible={selectgysflag}
      onCancel={() => handleModalVisiblegys()}
      width="80%"
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
@connect(
  ({
    cpOutStorageFrom,
    loading,
    cpBillMaterial,
    cpPurchaseDetail,
    cpPjEntrepot,
    cpPjStorage,
    cpClient,
  }) => ({
    ...cpOutStorageFrom,
    ...cpBillMaterial,
    ...cpPurchaseDetail,
    ...cpPjEntrepot,
    ...cpPjStorage,
    ...cpClient,
    submitting1:loading.effects['cpBillMaterial/cpBillMaterial_search_List'],
    submitting: loading.effects['form/submitRegularForm'],
    submitting2:loading.effects['cpOutStorageFrom/cpOutStorageFrom_Add'],
    submitting3: loading.effects['cpupdata/cpOutStorageFrom_update'],
    submitting4: loading.effects['cpInStorageFrom/post_Cp_OutSales_From'],
  })
)
@Form.create()
class CpOutStorageFromForm extends PureComponent {
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
      selectkhflag: false,
      updataflag: true,
      confirmflag :true,
      cpckid:'',
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
        type: 'cpOutStorageFrom/cpOutStorageFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback:(res)=>{
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
          ||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom')[0].children.filter(item=>item.name=='修改')
          .length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
          }
          dispatch({
            type: 'sysarea/getFlatOrderdCode',
            payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'PJCK'
            },
            callback:(imgres)=>{
            this.setState({
            srcimg1:imgres
            })
            }
            })
            dispatch({
              type: 'sysarea/getFlatCode',
              payload:{
              id:location.query.id,
              type:'PJCK'
              },
              callback:(imgres)=>{
              this.setState({
              srcimg:imgres.msg.split('|')[0]
              })
              }
              })
          if (isNotBlank(res) && isNotBlank(res.data) && isNotBlank(res.data.pjEntrepot) && isNotBlank(res.data.pjEntrepot.id)) {
            this.setState({
                cpckid: res.data.pjEntrepot.id
            }) 
         }
          this.props.form.setFieldsValue({
            ck: isNotBlank(res.data.pjEntrepot) && isNotBlank(res.data.pjEntrepot.name)? res.data.pjEntrepot.name : '',
          });
          dispatch({
            type: 'cpPurchaseDetail/cpPurchaseDetail_List',
            payload: {
              pageSize: 10,
              purchaseId: location.query.id,
            },
          });
        },
      });
    }

    dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });

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
      type: 'cpOutStorageFrom/clear',
    });
    dispatch({
      type: 'cpPurchaseDetail/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpOutStorageFromGet } = this.props;
    const { addfileList, location, selectkwdata, selectkhdata, updataflag } = this.state;
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
        if (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) {
          value.client = {};
          value.client.id = selectkhdata.id;
        }
        value.pjEntrepot = {};
        value.pjEntrepot.id =
          isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id)
            ? selectkwdata.id
            : isNotBlank(cpOutStorageFromGet) &&
              isNotBlank(cpOutStorageFromGet.pjEntrepot) &&
              isNotBlank(cpOutStorageFromGet.pjEntrepot.id)
            ? cpOutStorageFromGet.pjEntrepot.id
            : '';
        value.orderStatus = 1;
        if (updataflag) {
          dispatch({
            type: 'cpOutStorageFrom/cpOutStorageFrom_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/warehouse/process/cp_out_storage_from_form?id=${location.query.id}`);
              // router.push('/warehouse/process/cp_out_storage_from_list');
            },
          });
        } else {
          dispatch({
            type: 'cpupdata/cpOutStorageFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              // router.push('/warehouse/process/cp_out_storage_from_list');
              router.push(`/warehouse/process/cp_out_storage_from_form?id=${location.query.id}`);
            },
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
      router.push(`/warehouse/process/cp_out_storage_from_form?id=${location.query.id}`);
    }
  };

  onsave = () => {
    const { dispatch, form, cpOutStorageFromGet } = this.props;
    const { addfileList, location, selectkwdata, selectkhdata, updataflag } = this.state;
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
        if (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) {
          value.client = {};
          value.client.id = selectkhdata.id;
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.pjEntrepot = {};
        value.pjEntrepot.id =
          isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id)
            ? selectkwdata.id
            : isNotBlank(cpOutStorageFromGet) &&
              isNotBlank(cpOutStorageFromGet.pjEntrepot) &&
              isNotBlank(cpOutStorageFromGet.pjEntrepot.id)
            ? cpOutStorageFromGet.pjEntrepot.id
            : '';
        if (updataflag) {
          value.orderStatus = 0;
          dispatch({
            type: 'cpOutStorageFrom/cpOutStorageFrom_Add',
            payload: { ...value },
            callback: res => {
              router.push(`/warehouse/process/cp_out_storage_from_form?id=${res.data.id}`);
            },
          });
        } else {
          value.orderStatus = 1;
          dispatch({
            type: 'cpupdata/cpOutStorageFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
            },
          });
        }
      }
    });
  };

  onCancelCancel = () => {
    router.push('/warehouse/process/cp_out_storage_from_list');
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

  handleSelectRows1 = rows => {
    this.setState({
      selectedRows1: rows,
    });
  };

  showForm = () => {
    this.setState({
      FormVisible: true,
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
      type: 'cpPurchaseDetail/update_out_from_detail',
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
          type: 'cpOutStorageFrom/cpOutStorageFrom_Get',
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
            purchaseId: location.query.id,
            pageSize: 10,
          },
        });
      },
    });
  };

  showTable = () => {
    const { dispatch } = this.props;
    const { location } = this.state;
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
        pageSize: 10,
        tag:1
      },
    });
    this.setState({
      modalVisible: true,
    });
  };

  showKwtable = () => {
    const { dispatch } = this.props;
    const {cpckid} = this.state
    if(isNotBlank(cpckid)){
    dispatch({
      type: 'cpPjStorage/cpPjStorage_List',
      payload: {
        pageSize: 10,
        pjEntrepotId: cpckid,
      },
    });
    this.setState({
      selectinkwflag: true,
    });
  }else{
     message.error('请先选择仓库')
  }
  };

  selectuser = res => {
    const { dispatch } = this.props;
    const { selectedRows, location } = this.state;
    this.setState({
      modalVisible: false,
      modalRecord: res,
      billid:res.billCode
    });
  };

  handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag,
      editdata: {},
      billid:'',
      selectinkwdata: {},
      modalRecord: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  handleDeleteClick = id => {
    const { dispatch } = this.props;
    const { location } = this.state;
    dispatch({
      type: 'cpInStorageFrom/cpInStorage_Delete',
      payload: {
        id,
        purchaseId:location.query.id
      },
      callback: res => {
        dispatch({
          type: 'cpOutStorageFrom/cpOutStorageFrom_Get',
          payload: {
            id: location.query.id,
          },
        });
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id,
            pageSize: 10,
          },
        });
      },
    });
  };

  onselectkw = () => {
    this.setState({
      selectkwflag: true,
    });
  };

  selectkw = record => {
    const { dispatch ,form} = this.props;
    const {selectkhdata ,location} = this.state 
    this.props.form.setFieldsValue({
      ck: isNotBlank(record) && isNotBlank(record.name)? record.name : '',
    });
    this.setState({
      selectkwdata: record,
      selectkwflag: false,
      cpckid:record.id
    });
    if(isNotBlank(location.query.id)){
    form.validateFieldsAndScroll((err,values) => {
      const value = {...values}
  if (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) {
    value.client = {};
    value.client.id = selectkhdata.id;
  }
  if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
    value.id = location.query.id;
  }
  value.pjEntrepot = {};
  value.pjEntrepot.id = record.id
    value.orderStatus = -1;
    dispatch({
      type: 'cpOutStorageFrom/cpOutStorageFrom_save_Add',
      payload: { ...value },
      callback: res => {
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            pageSize: 10,
            purchaseId: location.query.id,
          },
        });
      },
    });
    });
  }
  };

  handleModalVisiblekw = flag => {
    this.setState({
      selectkwflag: !!flag,
    });
  };

  onselectinkw = () => {
    const { dispatch } = this.props;
    this.setState({
      selectinkwflag: true,
    });
  };

  selectinkw = record => {
    const { dispatch ,form} = this.props;
    this.setState({
      selectinkwdata: record,
      selectinkwflag: false,
    })
  };

  handleModalVisibleinkw = flag => {
    this.setState({
      selectinkwflag: !!flag,
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
        parent: location.query.id,
      },
      callback: () => {
        this.setState({
          selecttlflag: false,
        });
        dispatch({
          type: 'cpInStorageFrom/cpInStorageFrom_Get',
          payload: {
            id: location.query.id,
          },
        });
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id,
            pageSize: 10,
          },
        });
      },
    });
  };

  editmx = data => {
    this.setState({
      FormVisible: true,
      billid: isNotBlank(data.cpBillMaterial)&&isNotBlank(data.cpBillMaterial.billCode)?data.cpBillMaterial.billCode:'',
      editdata: data,
    });
  };

  handletld = () => {
    const { dispatch } = this.props;
    const { location, selectedRows1 } = this.state;
    dispatch({
      type: 'cpOutStorageFrom/create_quit_form',
      payload: {
        id: location.query.id,
        ids: selectedRows1.join(','),
      },
      callback: () => {
        this.setState({
          selecttlflag: false,
        });
        router.push('/warehouse/process/cp_out_storage_from_list');
      },
    });
  };

  showTableTh = () => {
    const { dispatch } = this.props;
    const { location } = this.state;
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_modal_List',
      payload: {
        // strageType: 2,
        purchaseId: location.query.id,
        pageSize: 10,
      },
    });
    this.setState({
      selecttlflag: true,
    });
  };

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag,
    });
  };

  handleModalVisibletl = flag => {
    this.setState({
      selecttlflag: !!flag,
    });
  };

  onselectkh = () => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
      },
      callback: () => {
        that.setState({
          selectkhflag: true,
        });
      },
    });
  };

  onUndo=id=>{
		Modal.confirm({
			title: '撤销该出库单',
			content: '确定撤销该出库单吗',
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
			type: 'cpRevocation/cpOutStorageFrom_Revocation',
			payload: {
				id
			},
			callback: () => {
        router.push(`/warehouse/process/cp_out_storage_from_form?id=${location.query.id}`);
				// router.push('/warehouse/process/cp_out_storage_from_list');
			}
    })
  }
  }

  searchcode = ()=>{
		const {dispatch} = this.props
		const {location ,billid} = this.state
		if(isNotBlank(billid)){
		this.setState({
		  modalRecord:{},
		 })
		dispatch({
      // type: 'cpBillMaterial/cpBillMaterial_search_List',
      'type':'cpBillMaterial/get_cpBillMaterial_All',
		  payload: {
			// purchaseId: location.query.id,
			billCode:billid,
      pageSize: 10,
      tag:1
		  },
		  callback:(res)=>{
			   if(isNotBlank(res)&&isNotBlank(res.list)&&res.list.length>0){
				   this.setState({
					modalRecord:res.list[0]
				   })
			   }
		  }
		});
	  }else{
		  message.error('请输入物料编码')
	  }
	}

changecode =(id)=>{
  this.setState({
    modalRecord:{},
    billid:id
   })
  }

goprint = () => {
  const { location } = this.state	
  const w = window.open('about:blank')
  w.location.href = `/#/madeUp_OutStorage?id=${location.query.id}`
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
      modalRecord,
      modalVisible,
      selectedRows,
      selectedRows1,
      FormVisible,
      orderflag,
      purchaseType,
      purchaseStatus,
      selectkwdata,
      selectkwflag,
      selectinkwflag,
      selectinkwdata,
      editdata,
      selectkhflag,
      selecttlflag,
      selectkhdata,
      location,
      updataflag,
      updataname,
      billid,
      cpckid,
      srcimg,srcimg1
    } = this.state;
    const {
      submitting4,
      submitting2,
      submitting3,
      submitting,
      submitting1,
      cpOutStorageFromGet,
      cpBillMaterialList,
      cpBillMaterialMiddleList,
      cpPurchaseDetailList,
      cpPjEntrepotList,
      cpPjStorageList,
      cpPurchaseDetailModalList,
      cpClientList,
      dispatch,
    } = this.props;
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
        inputType: 'dateTime',
        align: 'center' ,
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
        title: '库位', 
        dataIndex: 'cpPjStorage.name', 
        inputType: 'text', 
        align: 'center' ,
        width: 150, 
        editable: true, 
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
                {isNotBlank(orderflag) && !orderflag &&(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom')[0].children.filter(item=>item.name=='删除').length> 0) && (
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

    const that = this

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      cpBillMaterialList,
      modalRecord,
      dispatch,
      location,
      selectedRows,
      handleSelectRows: this.handleSelectRows,
      that
    };
    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      selectForm: this.selectForm,
      showTable: this.showTable,
      showKwtable: this.showKwtable,
      selectinkwdata,
      modalRecord,
      FormVisible,
      purchaseType,
      purchaseStatus,
      editdata,
      billid,
      searchcode:this.searchcode,
      changecode:this.changecode,
        submitting1,
        cpckid,
        that
    };
    const parentMethodskw = {
      handleModalVisiblekw: this.handleModalVisiblekw,
      dispatch,
      selectkw: this.selectkw,
      cpPjEntrepotList,
      that
    };
    const parentMethodsinkw = {
      handleModalVisibleinkw: this.handleModalVisibleinkw,
      dispatch,
      selectinkw: this.selectinkw,
      cpPjStorageList,
      cpckid,
      that
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
    const parentMethodstl = {
      handleAddkh: this.handleAddkh,
      handleModalVisibletl: this.handleModalVisibletl,
      selectedRows1,
      dispatch,
      location,
      cpPurchaseDetailModalList,
      handleSelectRows1: this.handleSelectRows1,
      selectcustomer: this.selectcustomer,
      handledel: this.handletld,
      submitting4,
      that
    };
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      cpClientList,
      that
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
出库单
          </div>
          {isNotBlank(cpOutStorageFromGet)&&isNotBlank(cpOutStorageFromGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
            </span><img src={isNotBlank(srcimg)?getFullUrl(`/${srcimg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                                </div>}
          {isNotBlank(cpOutStorageFromGet)&&isNotBlank(cpOutStorageFromGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
            <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
            </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                                       </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单据状态'>
                    {getFieldDecorator('orderStatus', {
                initialValue:
                  isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.orderStatus)
                    ? cpOutStorageFromGet.orderStatus === 0 ||
                      cpOutStorageFromGet.orderStatus === '0'
                      ? '未处理'
                      : '已处理'
                    : '', 
                rules: [
                  {
                    required: false, 
                    message: '请输入单据状态',
                    max: 255,
                  },
                ],
              })(
                <Input
                  
                  disabled
                  style={
                    cpOutStorageFromGet.orderStatus === 1 || cpOutStorageFromGet.orderStatus === '1'
                      ? { color: '#87d068' }
                      : { color: '#f50' }
                  }
                />
              )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    <Input
                      disabled
                      value={isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.id)
                    ? cpOutStorageFromGet.id: ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单单号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                initialValue:
                  isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.orderCode)
                    ? cpOutStorageFromGet.orderCode
                    : '', 
                rules: [
                  {
                    required: false, 
                    message: '请输入订单单号',
                    max: 255,
                  },
                ],
              })(<Input  disabled />)}
                  </FormItem>
                </Col>
                {isNotBlank(cpOutStorageFromGet)&&isNotBlank(cpOutStorageFromGet.formType)&&(cpOutStorageFromGet.formType==5||cpOutStorageFromGet.formType==6)&&
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单分类'>
                    <Input disabled value='内部订单' />
                  </FormItem>
                </Col>
        }
                {isNotBlank(cpOutStorageFromGet)&&isNotBlank(cpOutStorageFromGet.formType)&&(cpOutStorageFromGet.formType==5||cpOutStorageFromGet.formType==6)&&
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    <Input
                      disabled
                      value={isNotBlank(cpOutStorageFromGet)&&isNotBlank(cpOutStorageFromGet.createBy)&&
                      isNotBlank(cpOutStorageFromGet.createBy.name)?cpOutStorageFromGet.createBy.name:''}
                    />
                  </FormItem>
                </Col>
        }  
                {!(isNotBlank(cpOutStorageFromGet)&&isNotBlank(cpOutStorageFromGet.formType)&&(cpOutStorageFromGet.formType==5||cpOutStorageFromGet.formType==6))&&
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    {getFieldDecorator('clientName', {
                initialValue:
                  isNotBlank(cpOutStorageFromGet) &&
                  isNotBlank(cpOutStorageFromGet.client) &&
                  isNotBlank(cpOutStorageFromGet.client.clientCpmpany)
                    ? cpOutStorageFromGet.client.clientCpmpany
                    : isNotBlank(cpOutStorageFromGet.clientName)
                    ? cpOutStorageFromGet.clientName
                    : '', 
                rules: [
                  {
                    required: false, 
                    message: '请输入客户',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
  }
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='配件仓库'>
                    {getFieldDecorator('ck', {
                rules: [
                  {
                    required: true, 
                    message: '所属仓库',
                    max: 255,
                  },
                ],
              })
                (<Input style={{width:'50%'}}  disabled />
                )}
                    <Button
                      disabled={orderflag}
                      type="primary"
                      style={{ marginLeft: '8px' }}
                      onClick={this.onselectkw}
                      loading={submitting}
                      disabled={orderflag}
                    >
                选择
                    </Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='出库类型'>
                    {getFieldDecorator('stirageType', {
                initialValue:
                  isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.stirageType)
                    ? cpOutStorageFromGet.stirageType
                    : '9fb7560b-5e34-4a88-9ba9-1e2a1f397176', 
                rules: [
                  {
                    required: false, 
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
                    <Input disabled value={isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.money) ? getPrice(cpOutStorageFromGet.money) : ''}  />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                initialValue:
                  isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.remarks)
                    ? cpOutStorageFromGet.remarks
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
              <FormItem {...submitFormLayout} style={{ marginTop: 32 , textAlign: 'center'}}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
							打印
                </Button>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
  }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutStorageFrom')[0].children.filter(item=>item.name=='修改')
.length>0&&<span>
  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} disabled={orderflag&&updataflag}>
                保存
  </Button>
  <Button
    style={{ marginLeft: 8 }}
    type="primary"
    htmlType="submit"
    loading={submitting2||submitting3}
    disabled={orderflag && updataflag}
  >
                提交
  </Button> {orderflag&&
  <Button style={{ marginLeft: 8 }} loading={submitting2||submitting3} onClick={() => this.onUndo(cpOutStorageFromGet.id)}>撤销</Button>
  }
  <Button style={{ marginLeft: 8 }} loading={submitting2||submitting3} onClick={(e) => this.showTableTh(e)} disabled={!orderflag}>
                生成退料单
  </Button>
  {/* <Button style={{ marginLeft: 8, marginBottom: '10px' }} onClick={() => this.showForm()} disabled={orderflag||(!isNotBlank(cpOutStorageFromGet.id))}>
                新增明细
  </Button> */}
</span>}
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
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormtl {...parentMethodstl} selecttlflag={selecttlflag} />
        <CreateForminkw {...parentMethodsinkw} selectinkwflag={selectinkwflag} />
        <CreateFormkw {...parentMethodskw} selectkwflag={selectkwflag} />
        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpOutStorageFromForm;

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
  Col, Row, Popconfirm,
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpInStorageFromForm.less';
import StandardTable from '@/components/StandardTable';
import StandardEditTable from '@/components/StandardEditTable';
import SearchTableList from '@/components/SearchTableList';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@Form.create()
class SearchFormgys extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAddgys } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearchAddgys(fieldsValue);
    });
  };

  handleSearchVisiblegysin = () => {
    const { form, handleSearchVisiblegys } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisiblegys(fieldsValue);
    });
  };

  render() {
    const {
      searchVisiblegys,
      form: { getFieldDecorator },
      handleSearchVisiblegys,
      CpSupplierSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisiblegys}
        onCancel={() => this.handleSearchVisiblegysin()}
        afterClose={() => this.handleSearchVisiblegysin()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={CpSupplierSearchList} />)}
        </div>
      </Modal>
    );
  }
}

const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, cpPurchaseDetailModalList, selectkhflag, selectcustomer, location, handleSelectRows1,
    selectedRows1, handledel, dispatch, form, form: { getFieldDecorator }, submitting4, that } = props;
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
      dataIndex: 'cpBillMaterial.oneCodeModel',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '二级编码名称',
      dataIndex: 'cpBillMaterial.twoCodeModel',
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
      width: 300,
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
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
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
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
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

      that.setState({
        tlsearch: values
      })

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
    that.setState({
      tlsearch: {}
    })
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
      ...that.state.tlsearch,
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

  const handleModalVisiblekhin = () => {
    form.resetFields();
    that.setState({
      tlsearch: {}
    })
    handleModalVisiblekh()
  }

  return (
    <Modal
      title='选择退货列表'
      visible={selectkhflag}
      footer={null}
      onCancel={() => handleModalVisiblekhin()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input />
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
      <Button icon="user-add" loading={submitting4} onClick={handledel} disabled={!(isNotBlank(selectedRows1) && selectedRows1.length > 0)}>批量退货</Button>
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
  const { handleModalVisiblekw, cpPjEntrepotList, selectkwflag, selectkw, dispatch, form
    , form: { getFieldDecorator }, that } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
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
    that.setState({
      cksearch: {}
    })
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
      Object.keys(values).map((item) => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });

      that.setState({
        cksearch: values
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

  const handleModalVisiblekwin = () => {
    // form.resetFields();
    // that.setState({
    //   cksearch: {}
    // })
    handleModalVisiblekw()
  }

  return (
    <Modal
      title='选择所属仓库'
      visible={selectkwflag}
      onCancel={() => handleModalVisiblekwin()}
      width='80%'
    >
      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input />
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
  const { handleModalVisibleinkw, cpckid, cpPjStorageList, selectinkwflag, selectinkw, dispatch
    , form, form: { getFieldDecorator }, that } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
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

      that.setState({
        kwsearch: values
      })

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
    that.setState({
      kwsearch: {}
    })
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
      ...that.state.kwsearch,
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

  const handleModalVisibleinkwin = () => {
    // form.resetFields();
    // that.setState({
    //   kwsearch: {}
    // })
    handleModalVisibleinkw()
  }

  return (
    <Modal
      title='选择所属库位'
      visible={selectinkwflag}
      onCancel={() => handleModalVisibleinkwin()}
      width='80%'
    >
      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('entrepotName', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="库位名">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input />
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
      if (!isNotBlank(values.kw)) {
        message.error('请选择库位!')
        return
      }
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
                isNotBlank(modalRecord) && isNotBlank(modalRecord.cpPjStorage) && isNotBlank(modalRecord.cpPjStorage.name) ? modalRecord.cpPjStorage.name :
                  (isNotBlank(editdata) && isNotBlank(editdata.cpPjStorage) && isNotBlank(editdata.cpPjStorage.name) ? editdata.cpPjStorage.name : ''),
              rules: [
                {
                  required: true,
                  message: '请选择库位',
                },
              ],
            })
              (<Input
                disabled
                value={isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.name) ? selectinkwdata.name :
                  isNotBlank(modalRecord) && isNotBlank(modalRecord.cpPjStorage) && isNotBlank(modalRecord.cpPjStorage.name) ? modalRecord.cpPjStorage.name :
                    (isNotBlank(editdata) && isNotBlank(editdata.cpPjStorage) && isNotBlank(editdata.cpPjStorage.name) ? editdata.cpPjStorage.name : '')}
              />)}
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
            })(<Input disabled />)}
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
            })(<Input disabled />)}
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
            })(<Input disabled />)}
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
            })(<Input disabled />)}
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
            })(<Input disabled />)}
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
            })(<Input disabled />)}
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
            })(<Input />)}
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
            })(<InputNumber style={{ width: '100%' }} />)}
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
            })(<Input style={{ width: '100%' }} disabled />)}
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
            })(<Input style={{ width: '100%' }} disabled />)}
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
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
})
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator },
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, dispatch, location, that } = props;
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
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

      that.setState({
        wlsearch: values,
        pageCurrent: 1,
        pagePageSize: 10
      })

      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_List',
        payload: {
          purchaseId: location.query.id,
          pageSize: 10,
          ...values,
          current: 1,
          tag: 1
        }
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      wlsearch: {},
      pageCurrent: 1,
      pagePageSize: 10
    })
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
        pageSize: 10,
        current: 1,
        tag: 1
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
      ...that.state.wlsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      purchaseId: location.query.id,
    };

    that.setState({
      pageCurrent: pagination.current,
      pagePageSize: pagination.pageSize
    })

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: params,
    });
  };

  const handleModalVisiblein = () => {
    // form.resetFields();
    // that.setState({
    //   wlsearch: {}
    // })
    handleModalVisible()
  }

  return (
    <Modal
      title='物料选择'
      visible={modalVisible}
      onCancel={() => handleModalVisiblein()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="原厂编码">
              {getFieldDecorator('originalCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="配件厂商">
              {getFieldDecorator('rCode', {
                initialValue: ''
              })(
                <Input />
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
  const { handleModalVisiblegys, cpSupplierList, selectgysflag, selectgys, dispatch, form,
    handleSearchChangegys, that } = props;
  const { getFieldDecorator } = form
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '供应商类型',
      dataIndex: 'type',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '联系人',
      dataIndex: 'linkman',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '所属分公司',
      dataIndex: 'companyName',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '经营类型',
      dataIndex: 'runType',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '绑定集团',
      dataIndex: 'bindingGroup',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '创建者',
      dataIndex: 'createBy.name',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      editable: false,
      inputType: 'dateTime',
      align: 'center',
      width: 150,
      sorter: true,
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
        return ''
      }
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      align: 'center',
      width: 150,
      sorter: true,
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
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
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      gyssearch: {}
    })
    dispatch({
      type: 'cpSupplier/cpSupplier_List',
      payload: {
        pageSize: 10,
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
        current: 1,
        status: 0
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
      ...that.state.gyssearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpSupplier/cpSupplier_List',
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
      Object.keys(values).map((item) => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });

      that.setState({
        gyssearch: values
      })

      dispatch({
        type: 'cpSupplier/cpSupplier_List',
        payload: {
          ...values,
          pageSize: 10,
          genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
          current: 1,
          status: 0
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

  const handleModalVisiblegysin = () => {
    form.resetFields();
    that.setState({
      gyssearch: {}
    })

    handleModalVisiblegys()
  }


  return (
    <Modal
      title='选择供应商'
      visible={selectgysflag}
      onCancel={() => handleModalVisiblegys()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input />
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
              <a style={{ marginLeft: 8 }} onClick={handleSearchChangegys}>
                过滤其他 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpSupplierList}
        columns={columnskh}
      />
    </Modal>
  );
});
@connect(({ cpInStorageFrom, loading, cpBillMaterial, cpPurchaseDetail, cpPjEntrepot, cpPjStorage, cpSupplier }) => ({
  ...cpInStorageFrom,
  ...cpBillMaterial,
  ...cpPurchaseDetail,
  ...cpPjEntrepot,
  ...cpPjStorage,
  ...cpSupplier,
  submitting1: loading.effects['cpBillMaterial/cpBillMaterial_search_List'],
  submitting: loading.effects['form/submitRegularForm'],
  submitting2: loading.effects['cpInStorageFrom/cpInStorageFrom_Add'],
  submitting3: loading.effects['cpupdata/cpInStorageFrom_update'],
  submitting4: loading.effects['cpInStorageFrom/post_Cp_OutSales_From'],
}))
@Form.create()
class CpInStorageFromForm extends PureComponent {
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
      confirmflag: true,
      cpckid: '',
      wlsearch: {},
      pageCurrent: 1,
      pagePageSize: 10,
      updataname: '取消锁定',
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpInStorageFrom/cpInStorageFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpInStorageFrom').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpInStorageFrom')[0].children.filter(item => item.name == '修改')
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
            ck: isNotBlank(res) && isNotBlank(res.data) && isNotBlank(res.data.cpPjEntrepot) && isNotBlank(res.data.cpPjEntrepot.name) ? res.data.cpPjEntrepot.name : ''
          })
          if (isNotBlank(res) && isNotBlank(res.data) && isNotBlank(res.data.cpPjEntrepot) && isNotBlank(res.data.cpPjEntrepot.id)) {
            this.setState({
              cpckid: res.data.cpPjEntrepot.id
            })
          }
          //    dispatch({
          //     type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          //     payload: {
          //       cid:res.data.cpPjEntrepot.id,
          //       pageSize: 10,
          //       purchaseId: location.query.id
          //     }
          //   });
          // }else{
          dispatch({
            type: 'cpPurchaseDetail/cpPurchaseDetail_List',
            payload: {
              pageSize: 10,
              purchaseId: location.query.id,
              'cpPjEntrepot.id': isNotBlank(res.data.cpPjEntrepot) && isNotBlank(res.data.cpPjEntrepot.id) ? res.data.cpPjEntrepot.id : ''
            }
          });
          // }
        }
      });
    } else {
      dispatch({
        type: 'cpPjEntrepot/cpPjEntrepot_List',
        payload: {
          current: 1,
          pageSize: 10
        },
        callback: (res) => {
          if (isNotBlank(res.list) && isNotBlank(res.list.length > 0)) {
            this.setState({
              selectkwdata: res.list[0],
              cpckid: res.list[0].id
            })
            this.props.form.setFieldsValue({
              ck: res.list[0].name
            })
          }
        }
      })
    }

    dispatch({
      type: 'cpSupplier/cpSupplier_List',
      payload: {
        pageSize: 10,
        status: 0
      }
    })
    dispatch({
      type: 'cpSupplier/CpSupplier_SearchList',
      payload: {
        pageSize: 10,
      }
    });

    dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
      payload: {
        current: 1,
        pageSize: 10
      }
    })

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
  }

  handleSubmit = e => {
    const { dispatch, form, cpInStorageFromGet, cpPurchaseDetailList } = this.props;
    const { addfileList, location, selectkwdata, selectgysdata, updataflag } = this.state;
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


        value.cpSupplier = {}
        value.cpSupplier.id = isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id) ? selectgysdata.id : isNotBlank(cpInStorageFromGet.cpSupplier) && isNotBlank(cpInStorageFromGet.cpSupplier.id) ? cpInStorageFromGet.cpSupplier.id : ''

        value.cpPjEntrepot = {}
        value.cpPjEntrepot.Id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id : (isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.cpPjEntrepot)
          && isNotBlank(cpInStorageFromGet.cpPjEntrepot.id) ? cpInStorageFromGet.cpPjEntrepot.id : '')
        value.orderStatus = 1
        if (updataflag) {
          dispatch({
            type: 'cpInStorageFrom/cpInStorageFrom_Add',
            payload: { ...value },
            callback: (res) => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              // router.push('/warehouse/process/cp_in_storage_from_list');
              router.push(`/warehouse/process/cp_in_storage_from_form?id=${res.data.id}`);
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpInStorageFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/warehouse/process/cp_in_storage_from_form?id=${location.query.id}`);
              // router.push('/warehouse/process/cp_in_storage_from_list');
            }
          })
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
    const { dispatch, form, cpInStorageFromGet } = this.props;
    const { addfileList, location, selectkwdata, selectgysdata, updataflag } = this.state;
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

        value.cpSupplier = {}
        value.cpSupplier.id = isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id) ? selectgysdata.id : isNotBlank(cpInStorageFromGet.cpSupplier) && isNotBlank(cpInStorageFromGet.cpSupplier.id) ? cpInStorageFromGet.cpSupplier.id : ''

        value.cpPjEntrepot = {}
        value.cpPjEntrepot.Id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id : (isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.cpPjEntrepot)
          && isNotBlank(cpInStorageFromGet.cpPjEntrepot.id) ? cpInStorageFromGet.cpPjEntrepot.id : '')
        if (updataflag) {
          value.orderStatus = 0
          dispatch({
            type: 'cpInStorageFrom/cpInStorageFrom_Add',
            payload: { ...value },
            callback: (res) => {
              router.push(`/warehouse/process/cp_in_storage_from_form?id=${res.data.id}`);
            }
          })
        } else {
          value.orderStatus = 1
          dispatch({
            type: 'cpupdata/cpInStorageFrom_update',
            payload: { ...value },
            callback: () => {
              router.push(`/warehouse/process/cp_in_storage_from_form?id=${location.query.id}`);
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
    router.push('/warehouse/process/cp_in_storage_from_list');
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

  // onselectgys = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'cpSupplier/cpSupplier_List',
  //     payload: {
  //       pageSize: 10,
  //       status: 0
  //     },
  //     callback: () => {
  //       this.setState({ selectgysflag: true })
  //     }
  //   })
  // }

  selectgys = (record) => {
    this.props.form.setFieldsValue({
      gys: record.name
    })
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
      isCreate: true,
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
      type: 'cpInStorageFrom/create_Purchase_Detail',
      payload: {
        type: 1,
        'cpPjStorage.id': isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id) ? selectinkwdata.id :
          isNotBlank(modalRecord) && isNotBlank(modalRecord.cpPjStorage) && isNotBlank(modalRecord.cpPjStorage.id) ? modalRecord.cpPjStorage.id :
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
          type: 'cpInStorageFrom/cpInStorageFrom_Get',
          payload: {
            id: location.query.id,
          }
        });
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id,
            pageSize: 10,
          }
        });
      }
    })
  }

  showTable = () => {
    const { dispatch } = this.props
    const { location, wlsearch, pageCurrent, pagePageSize } = this.state
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
        ...wlsearch,
        current: pageCurrent,
        pageSize: pagePageSize,
        tag: 1
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
      type: 'cpInStorageFrom/cpInStorage_Delete',
      payload: {
        id,
        purchaseId: location.query.id
      },
      callback: (res) => {
        dispatch({
          type: 'cpInStorageFrom/cpInStorageFrom_Get',
          payload: {
            id: location.query.id,
          }
        });
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id,
            pageSize: 10,
          }
        });
      }
    });
  }

  onselectkw = () => {
    const { dispatch } = this.props;
    this.setState({
      selectkwflag: true
    })
  }

  selectkw = (record) => {
    const { dispatch, cpInStorageFromGet, form } = this.props
    const { location, selectkwdata } = this.state
    this.props.form.setFieldsValue({
      ck: isNotBlank(record) && isNotBlank(record.name) ? record.name : ''
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
    value.orderStatus = -1
    dispatch({
      type: 'cpInStorageFrom/cpInStorageFrom_save_Add',
      payload: { ...value },
      callback: () => {
        setTimeout(() => {
          dispatch({
            type: 'cpPurchaseDetail/cpPurchaseDetail_List',
            payload: {
              cid: record.id,
              pageSize: 10,
              purchaseId: location.query.id
            }
          });
        }, 1000)
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
          type: 'cpInStorageFrom/cpInStorageFrom_Get',
          payload: {
            id: location.query.id,
          }
        });
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id,
            pageSize: 10,
          }
        });
      }
    })
  }

  editmx = (data) => {
    this.setState({
      isCreate: false,
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
      title: '撤销该配件入库单',
      content: '确定撤销该配件入库单吗',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(id),
    });
  }

  undoClick = id => {
    const { dispatch } = this.props
    const { confirmflag, location } = this.state
    const that = this
    setTimeout(function () {
      that.setState({
        confirmflag: true
      })
    }, 1000)

    if (confirmflag) {
      this.setState({
        confirmflag: false
      })
      dispatch({
        type: 'cpRevocation/cpInStorageFrom_Revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/warehouse/process/cp_in_storage_from_form?id=${location.query.id}`);
          // router.push('/warehouse/process/cp_in_storage_from_list');
        }
      })
    }
  }

  searchcode = () => {
    const { dispatch } = this.props
    const { location, billid, isCreate, cpckid } = this.state
    if (isNotBlank(billid)) {
      this.setState({
        modalRecord: {},
      })

      const newobj = {}
      if (isCreate) {
        newobj.pjEntrepotId = cpckid
      }

      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_search_List',
        payload: {
          purchaseId: location.query.id,
          billCode: billid,
          pageSize: 10,
          tag: 1,
          ...newobj
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

  // searchcode = ()=>{
  // 	const {dispatch} = this.props
  // 	const {location ,billid} = this.state
  // 	if(isNotBlank(billid)){
  // 	this.setState({
  // 	  modalRecord:{},
  // 	 })
  // 	dispatch({
  // 	  type: 'cpBillMaterial/cpBillMaterial_search_List',
  // 	  payload: {
  // 		purchaseId: location.query.id,
  // 		billCode:billid,
  //     pageSize: 10,
  //     tag:1
  // 	  },
  // 	  callback:(res)=>{
  // 		   if(isNotBlank(res)&&isNotBlank(res.list)&&res.list.length>0){
  // 			   this.setState({
  // 				modalRecord:res.list[0]
  // 			   })
  // 		   }
  // 	  }
  // 	});
  //   }else{
  // 	  message.error('请输入物料编码')
  //   }
  // }

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
      purchaseId: location.query.id,
    };
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: params,
    });
  };

  handleSearchChangegys = () => {
    this.setState({
      searchVisiblegys: true,
    });
  };

  handleSearchAddgys = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpSupplier/cpSupplier_List',
      payload: {
        ...this.state.gyssearch,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        status: 0
      },
    });
    this.setState({
      searchVisiblegys: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  onselectgys = () => {
    this.setState({ selectgysflag: true })
  }

  render() {
    const { fileList, previewVisible, previewImage, selectgysflag, selectgysdata, modalRecord, modalVisible, selectedRows, selectedRows1,
      FormVisible, orderflag, purchaseType, purchaseStatus, selectkwdata, selectkwflag, selectinkwflag, selectinkwdata, editdata, selectkhflag
      , location, updataflag, updataname, billid, cpckid, seleval, srcimg, srcimg1, searchVisiblegys } = this.state;
    const { submitting4, submitting3, submitting2, submitting, submitting1, cpInStorageFromGet, cpSupplierList, cpBillMaterialList,
      cpBillMaterialMiddleList, cpPurchaseDetailList, cpPjEntrepotList, cpPjStorageList, cpPurchaseDetailModalList, dispatch, CpSupplierSearchList } = this.props;
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

    // const parentMethodsgys = {
    //   handleAddgys: this.handleAddgys,
    //   handleModalVisiblegys: this.handleModalVisiblegys,
    //   selectgys: this.selectgys,
    //   cpSupplierList,
    //   selectgysflag,
    //   that
    // }
    const parentSearchMethodsgys = {
      handleSearchVisiblegys: this.handleSearchVisiblegys,
      handleSearchAddgys: this.handleSearchAddgys,
      CpSupplierSearchList,
      searchVisiblegys,
      that
    }

    const parentMethodsgys = {
      handleAddgys: this.handleAddgys,
      handleModalVisiblegys: this.handleModalVisiblegys,
      selectgys: this.selectgys,
      dispatch,
      handleSearchChangegys: this.handleSearchChangegys,
      cpSupplierList,
      selectgysflag,
      that
    }

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      cpBillMaterialList,
      modalRecord,
      location,
      dispatch,
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
      purchaseType
      , purchaseStatus
      , editdata,
      searchcode: this.searchcode,
      billid, cpckid,
      changecode: this.changecode,
      submitting1,
      that
    };
    const parentMethodskw = {
      handleModalVisiblekw: this.handleModalVisiblekw,
      selectkw: this.selectkw,
      dispatch,
      cpPjEntrepotList,
      that
    }
    const parentMethodsinkw = {
      handleModalVisibleinkw: this.handleModalVisibleinkw,
      selectinkw: this.selectinkw,
      dispatch,
      cpPjStorageList,
      cpckid,
      that
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
      handledel: this.handledel,
      submitting4,
      that
    }



    const columns = [
      {
        title: '修改',
        width: 100,
        align: 'center',
        render: (text, record) => {
          if (!orderflag) {
            return <Fragment>
              <a onClick={() => this.editmx(record)}>修改</a>
            </Fragment>
          }
        },
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
        dataIndex: 'cpBillMaterial.twoCode',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '一级编码型号',
        dataIndex: 'cpBillMaterial.one.model',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '二级编码名称',
        dataIndex: 'cpBillMaterial.two.name',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '名称',
        dataIndex: 'cpBillMaterial.name',
        inputType: 'text',
        align: 'center',
        width: 300,
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
        title: '需求日期',
        dataIndex: 'needDate',
        editable: true,
        inputType: 'dateTime',
        align: 'center',
        width: 150,
        sorter: true,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '单价',
        dataIndex: 'price',
        inputType: 'text',
        width: 100,
        align: 'center',
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
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        inputType: 'text',
        width: 100,
        align: 'center',
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
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>入库单</div>
          {isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) ? getFullUrl(`/${srcimg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
            </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单据状态'>
                    {getFieldDecorator('orderStatus', {
                      initialValue: isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.orderStatus) ? ((cpInStorageFromGet.orderStatus === 0 || cpInStorageFromGet.orderStatus === '0') ? '未处理' : '已处理') : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入单据状态',
                          max: 255,
                        },
                      ],
                    })(<Input style={cpInStorageFromGet.orderStatus === 1 || cpInStorageFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }} disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商名称'>
                    {getFieldDecorator('gys', {
                      initialValue: isNotBlank(selectgysdata) && isNotBlank(selectgysdata.name) ? selectgysdata.name : isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.cpSupplier) && isNotBlank(cpInStorageFromGet.cpSupplier.name) ? cpInStorageFromGet.cpSupplier.name : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择供应商',

                        },
                      ],
                    })(
                      <Input
                        style={{ width: '50%' }}
                        value={isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.cpSupplier) && isNotBlank(cpInStorageFromGet.cpSupplier.name) ? cpInStorageFromGet.cpSupplier.name : ''}
                        disabled
                      />
                    )}
                    <Button disabled={orderflag} type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgys} loading={submitting}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商编号'>
                    {getFieldDecorator('supplierId', {
                      initialValue: isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id) ? selectgysdata.id : isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.supplierId) ? cpInStorageFromGet.supplierId : '',
                      rules: [
                        {
                          required: false,
                          message: '供应商编号',
                        },
                      ],
                    })(<Input disabled value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id) ? selectgysdata.id : isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.supplierId) ? cpInStorageFromGet.supplierId : ''} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商单号'>
                    {getFieldDecorator('supplierCode', {
                      initialValue: isNotBlank(cpInStorageFromGet.supplierCode) ? cpInStorageFromGet.supplierCode : '',
                      rules: [
                        {
                          required: true,
                          message: '供应商单号',
                        },
                      ],
                    })(
                      <Input value={isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.supplierCode) ? cpInStorageFromGet.supplierCode : ''} disabled={orderflag} />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属仓库'>
                    {getFieldDecorator('ck', {
                      rules: [
                        {
                          required: true,
                          message: '所属仓库',
                          max: 255,
                        },
                      ],
                    })
                      (<Input style={{ width: '50%' }} disabled />
                      )}
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkw} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                {
                  isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.orderCode) && cpInStorageFromGet.orderCode != '3333' &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='订单单号'>
                      {getFieldDecorator('orderCode', {
                        initialValue: isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.orderCode) ? cpInStorageFromGet.orderCode : '',
                        rules: [
                          {
                            required: false,
                            message: '请输入订单单号',
                            max: 255,
                          },
                        ],
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                }
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购类型'>
                    {getFieldDecorator('purchaseType', {
                      initialValue: isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.purchaseType) ? cpInStorageFromGet.purchaseType : 'c25482f3-82bb-462e-a3b7-236f024b53a6',
                      rules: [
                        {
                          required: false,
                          message: '请输入采购类型',
                          max: 255,
                        },
                      ],
                    })(<Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled={orderflag && updataflag}
                    >
                      {
                        isNotBlank(this.state.purchaseType) && this.state.purchaseType.length > 0 && this.state.purchaseType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='入库类型'>
                    {getFieldDecorator('stirageType', {
                      initialValue: isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.stirageType) ? cpInStorageFromGet.stirageType :
                        (isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.y) && cpInStorageFromGet.y == 1 ? '32ec9882-2e80-4ffc-b27a-405ead2d8aba' : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入入库类型',
                        },
                      ],
                    })(<Select
                      allowClear
                      onChange={this.colorstyle}
                      style={seleval == '32ec9882-2e80-4ffc-b27a-405ead2d8aba' ? { color: '#87d068', width: '100%' } : ((seleval == 'ee52b259-32e8-41c1-97a2-72e3fa7a957d' || seleval == '41a3c711-b2bd-4774-acc6-f2a8db27505d') ? { color: 'rgb(204, 102, 0)', width: '100%' } : (seleval == 'fd7defa9-f6bb-47e1-8924-3b14ac370f9a' ? { color: '#1890FF', width: '100%' } : { width: '100%' }))}
                      disabled={orderflag && updataflag}
                    >
                      {
                        isNotBlank(this.state.stirageType) && this.state.stirageType.length > 0 && this.state.stirageType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开票需求'>
                    {getFieldDecorator('makeNeed', {
                      initialValue: isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.makeNeed) ? cpInStorageFromGet.makeNeed : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入开票需求',
                        },
                      ],
                    })(<Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled={orderflag && updataflag}
                    >
                      {
                        isNotBlank(this.state.make_need) && this.state.make_need.length > 0 && this.state.make_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='金额'>
                    <Input

                      disabled
                      value={isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.money) ? getPrice(cpInStorageFromGet.money) : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='含税金额'>
                    <Input

                      disabled
                      value={isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.money) ? getPrice(cpInStorageFromGet.money) : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='打印次数'>
                    <Input disabled value={isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.number) ? cpInStorageFromGet.number : ''} />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.remarks) ? cpInStorageFromGet.remarks : '',
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
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                  打印
                </Button>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpInStorageFrom').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpInStorageFrom')[0].children.filter(item => item.name == '二次修改')
                    .length > 0 &&
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                    {updataname}
                  </Button>
                }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpInStorageFrom').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpInStorageFrom')[0].children.filter(item => item.name == '修改')
                    .length > 0 && <span>
                    <Button type="primary" loading={submitting3 || submitting2} style={{ marginLeft: 8 }} onClick={this.onsave} disabled={orderflag && updataflag}>
                      保存
                    </Button>
                    <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting3 || submitting2} disabled={orderflag && updataflag}>
                      提交
                    </Button>
                    {orderflag &&
                      <Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpInStorageFromGet.id)}>撤销</Button>
                    }
                    <Button
                      style={{ marginLeft: 8, marginBottom: '10px' }}
                      onClick={() => this.showForm()}
                      disabled={!(isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.id) && cpInStorageFromGet.orderStatus == 0)}
                    >
                      新增明细
                    </Button>
                    <Button
                      icon="user-add"
                      style={{ marginLeft: 8 }}
                      onClick={this.showTableTh}
                      loading={submitting3 || submitting2}
                      disabled={!(isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.orderStatus) &&
                        cpInStorageFromGet.orderStatus == 1)}
                    >生成退货单
                    </Button>
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

        <SearchFormgys {...parentSearchMethodsgys} searchVisiblegys={searchVisiblegys} />
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
export default CpInStorageFromForm;

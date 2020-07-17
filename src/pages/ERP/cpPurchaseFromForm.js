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
  Col, Row, Popconfirm,
  DatePicker
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpPurchaseFromForm.less';
import moment from 'moment';
import { getStorage } from '@/utils/localStorageUtils';
import StandardTable from '@/components/StandardTable';
import SearchTableList from '@/components/SearchTableList';
import StandardEditTable from '@/components/StandardEditTable';

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
const CreateFormgs = Form.create()(props => {
  const { handleModalVisiblegs, complist, selectgsflag, selectgs, dispatch, form,
    form: { getFieldDecorator }, that } = props;
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
    // {
    //   title: '公司图标',
    //   dataIndex: 'logo',
    //   align: 'center' ,
    //   width: 150,
    //   render: (text) => {
    //     if (isNotBlank(text)) {
    //       const images = text.split('|').map((item) => {
    //         if (isNotBlank(item)) {
    //           return <img
    //             key={item}
    //             onClick={() => this.handleImage(getFullUrl(item))}
    //             style={{ height: 50, width: 50, marginRight: 10 }}
    //             alt="example"
    //             src={getFullUrl(item)}
    //           />
    //         }
    //         return null;
    //       })
    //       return <div>{images}</div>
    //     }
    //     return '';
    //   },
    // },
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
      gssearch: {}
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
        gssearch: values
      })

      dispatch({
        type: 'company/query_comp',
        payload: values,
      });
    });
  };

  const handleModalVisiblegsin = () => {
    // form.resetFields();
    // that.setState({
    //   gssearch: {}
    // })
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
              {getFieldDecorator('name')(<Input />)}
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
const CreateFormgys = Form.create()(props => {
  const { handleModalVisiblegys, cpSupplierList, selectgysflag, selectgys,
    dispatch, form, handleSearchChangegys, that } = props;
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
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: false,
    },
    {
      title: '供应商类型',
      dataIndex: 'type',
      align: 'center',
      inputType: 'text',
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
      inputType: 'text',
      align: 'center',
      width: 150,
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
        current: 1,
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
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
      status: 0,
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
    // form.resetFields();
    // that.setState({
    //   gyssearch: {}
    // })
    handleModalVisiblegys()
  }

  return (
    <Modal
      title='选择供应商'
      visible={selectgysflag}
      onCancel={() => handleModalVisiblegysin()}
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
const CreateFormForm = Form.create()(props => {
  const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator }, seleval, showxx, changecode, purchaserequire,
    cpBillMaterialList, submitting1, selectuser, handleSelectRows, selectedRows, showTable, make_need, purchaseStatus, purchaseType, wlshowdata, searchcode, billid } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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
  const modelsearch1 = (e) => {
    if (isNotBlank(e)) {
      changecode(e.target.value)
    }
  }
  const handleFormVisiblehide = () => {
    form.resetFields();
    handleFormVisible()
  }
  const showin = (e) => {
    showxx(e)
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
                onChange={modelsearch1}
              />
              <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={searchcode}>查询</Button> <Button style={{ marginLeft: 8 }} onClick={() => showTable()}>选择</Button>
            </div>
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='原厂编码'>
            {getFieldDecorator('originalCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.originalCode) ? wlshowdata.cpBillMaterial.originalCode : ''),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.name) ? wlshowdata.cpBillMaterial.name : ''),
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
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.two) && isNotBlank(wlshowdata.cpBillMaterial.two.name) ? wlshowdata.cpBillMaterial.two.name : ''),
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
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.one) && isNotBlank(wlshowdata.cpBillMaterial.one.model) ? wlshowdata.cpBillMaterial.one.model : ''),
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
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.rCode) ? wlshowdata.cpBillMaterial.rCode : ''),
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
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.unit) ? wlshowdata.cpBillMaterial.unit : ''),
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
          <FormItem {...formItemLayout} label='采购状态'>
            {getFieldDecorator('purchaseStatus', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.purchaseStatus) ? modalRecord.purchaseStatus :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.purchaseStatus) ? wlshowdata.purchaseStatus : ''),
              rules: [
                {
                  required: true,
                  message: '采购状态',
                },
              ],
            })(<Select
              allowClear
              onChange={showin}
              style={seleval == 'ae3cd9b2-dfa8-40e5-a29a-f56f81cfcc2f' ? { color: '#87d068', width: '100%' } : (seleval == '70c07f43-62c9-4dca-9630-f1765007ca98' ? { color: '#f50', width: '100%' } : (seleval == '7f264433-d89d-4ffd-b170-5c0164d38d14' ? { color: 'rgb(204, 102, 0)', width: '100%' } : { width: '100%' }))}
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.purchaseRequire) ? modalRecord.purchaseRequire :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.purchaseRequire) ? wlshowdata.purchaseRequire : ''),
              rules: [
                {
                  required: true,
                  message: '采购要求',
                },
              ],
            })(<Select
              allowClear
              style={{ width: '100%' }}
            >
              {
                isNotBlank(purchaserequire) && purchaserequire.length > 0 && purchaserequire.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='发票类型'>
            {getFieldDecorator('makeNeed', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.makeNeed) ? modalRecord.makeNeed :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.makeNeed) ? wlshowdata.makeNeed : ''),
              rules: [
                {
                  required: true,
                  message: '发票类型',
                },
              ],
            })(<Select
              allowClear
              style={{ width: '100%' }}
            >
              {
                isNotBlank(make_need) && make_need.length > 0 && make_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='需求日期'>
            {getFieldDecorator('needDate', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.needDate) ? modalRecord.needDate :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.needDate) ? moment(wlshowdata.needDate) : ''),
              rules: [
                {
                  required: true,
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.price) ? getPrice(modalRecord.price) :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.price) ? getPrice(wlshowdata.price) : ''),
              rules: [
                {
                  required: true,
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
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.number) ? wlshowdata.number : ''),
              rules: [
                {
                  required: true,
                  message: '采购数量',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='订单编号'>
            {getFieldDecorator('orderCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.orderCode) ? modalRecord.orderCode :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.orderCode) ? wlshowdata.orderCode : ''),
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
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.agedCode) ? wlshowdata.agedCode : ''),
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
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.remarks) ? wlshowdata.remarks : ''),
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
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '一级编码',
      dataIndex: 'oneCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '二级编码',
      dataIndex: 'twoCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '一级编码型号',
      dataIndex: 'oneCodeModel',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '二级编码名称',
      dataIndex: 'twoCodeModel',
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
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    }
  ]
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
      md: { span: 12 },
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
        pageCurrent:1,
        pagePageSize:10
      })

      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_List',
        payload: {
          purchaseId: location.query.id,
          pageSize: 10,
          ...values,
          current: 1,
          tag:1
        }
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      wlsearch: {},  pageCurrent:1,
      pagePageSize:10
    })
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
        pageSize: 10,
        tag:1
      }
    });
    ;
  }
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
      purchaseId: location.query.id,
      ...filters,
      tag:1
    };

    that.setState({
      pageCurrent:pagination.current,
      pagePageSize:pagination.pageSize
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
      footer={null}
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
        onChange={handleStandardTableChange}
        data={cpBillMaterialList}
        columns={selectcolumns}
      />
    </Modal>
  );
});
@connect(({ cpPurchaseFrom, loading, cpSupplier, company, cpBillMaterial, cpPurchaseDetail }) => ({
  ...cpPurchaseFrom,
  ...cpSupplier,
  ...company,
  ...cpBillMaterial,
  ...cpPurchaseDetail,
  submitting1: loading.effects['cpBillMaterial/cpBillMaterial_search_List'],
  submitting: loading.effects['form/submitRegularForm'],
  submitting2: loading.effects['cpPurchaseFrom/cpPurchaseFrom_Add'],
  submitting3: loading.effects['cpupdata/cpPurchaseFrom_update'],
}))
@Form.create()
class CpPurchaseFromForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectgysflag: false,
      selectgysdata: [],
      selectgsflag: false,
      selectgsdata: [],
      selectedRows: [],
      orderflag: false,
      intentionId: '',
      wlshowdata: {},
      FormVisible: false,
      updataflag: true,
      billid: '',
      procurementType: '',
      updataname: '取消锁定',
      gyssearch: {},
      gssearch: {},
      pageCurrent:1,
      pagePageSize:10,
      confirmflag: true,
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpPurchaseFrom/cpPurchaseFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0].children.filter(item => item.name == '修改')
                .length == 0)) {
            this.setState({ orderflag: true })
          } else {
            this.setState({ orderflag: false })
          }
          if (isNotBlank(res.data.procurementType)) {
            this.setState({
              purchasetype: res.data.procurementType
            })
          }

          if(isNotBlank(res.data.cpSupplier)&&isNotBlank(res.data.cpSupplier.name)){
             this.props.form.setFieldsValue({
                gys:res.data.cpSupplier.name
             })
          }
         

          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'PJCG'
            },
            callback: (imgres) => {
              this.setState({
                srcimg: imgres.msg.split('|')[0]
              })
            }
          })
          dispatch({
            type: 'cpPurchaseDetail/cpPurchaseDetail_List',
            payload: {
              intentionId: location.query.id,
              pageSize: 10,
              purchaseId: location.query.id
            }
          });
        }
      });
    }

    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
      }
    });

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
      type: 'dict/dict',
      callback: data => {
        const insuranceCompany = []
        const brand = []
        const approachType = []
        const collectCustomer = []
        const orderType = []
        const business_project = []
        const business_dicth = []
        const business_type = []
        const settlement_type = []
        const payment_methodd = []
        const old_need = []
        const make_need = []
        const quality_need = []
        const oils_need = []
        const guise_need = []
        const installation_guide = []
        const is_photograph = []
        const maintenance_project = []
        const del_flag = []
        const classify = []
        const client_level = []
        const purchaserequire = []
        const purchaseStatus = []
        const purchaseType = []
        const procurementType = []
        data.forEach((item) => {
          if (item.type == 'insurance_company') {
            insuranceCompany.push(item)
          }
          if (item.type == 'brand') {
            brand.push(item)
          }
          if (item.type == 'approach_type') {
            approachType.push(item)
          }
          if (item.type == 'collect_customer') {
            collectCustomer.push(item)
          }
          if (item.type == 'orderType') {
            orderType.push(item)
          }
          if (item.type == 'business_project') {
            business_project.push(item)
          }
          if (item.type == 'business_dicth') {
            business_dicth.push(item)
          }
          if (item.type == 'business_type') {
            business_type.push(item)
          }
          if (item.type == 'settlement_type') {
            settlement_type.push(item)
          }
          if (item.type == 'payment_methodd') {
            payment_methodd.push(item)
          }
          if (item.type == 'old_need') {
            old_need.push(item)
          }
          if (item.type == 'make_need') {
            make_need.push(item)
          }
          if (item.type == 'quality_need') {
            quality_need.push(item)
          }
          if (item.type == 'oils_need') {
            oils_need.push(item)
          }
          if (item.type == 'guise_need') {
            guise_need.push(item)
          }
          if (item.type == 'installation_guide') {
            installation_guide.push(item)
          }
          if (item.type == 'maintenance_project') {
            maintenance_project.push(item)
          }
          if (item.type == 'is_photograph') {
            is_photograph.push(item)
          }
          if (item.type == 'del_flag') {
            del_flag.push(item)
          }
          if (item.type == 'classify') {
            classify.push(item)
          }
          if (item.type == 'client_level') {
            client_level.push(item)
          }
          if (item.type == 'purchaseStatus') {
            purchaseStatus.push(item)
          }
          if (item.type == 'purchase_type') {
            purchaseType.push(item)
          }
          if (item.type == 'procurementType') {
            procurementType.push(item)
          }
          if (item.type == 'CGYQ') {
            purchaserequire.push(item)
          }
        })
        this.setState({
          insuranceCompany, procurementType,
          brand, approachType, collectCustomer,
          orderType, business_project, business_dicth
          , business_type, settlement_type, payment_methodd, old_need,
          make_need, quality_need, oils_need, guise_need, installation_guide
          , maintenance_project, is_photograph, del_flag, classify, client_level,
          purchaseStatus, purchaseType, purchaserequire
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpPurchaseFrom/clear',
    });
    dispatch({
      type: 'cpPurchaseDetail/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpPurchaseFromGet } = this.props;
    const { addfileList, location, selectgsdata, selectgysdata, updataflag } = this.state;
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
        value.supplierId = isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id) ? selectgysdata.id :
          (isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.supplierId) ? cpPurchaseFromGet.supplierId : '')
        value.cuttingApplyId = isNotBlank(selectgsdata) && isNotBlank(selectgsdata.id) ? selectgsdata.id :
          (isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.cuttingApplyId) ? cpPurchaseFromGet.cuttingApplyId : '')
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.y = 1
        value.orderStatus = 1
        if (updataflag) {
          dispatch({
            type: 'cpPurchaseFrom/cpPurchaseFrom_Add',
            payload: { ...value },
            callback: (res) => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/purchase/process/cp_purchase_from_form?id=${res.data.id}`);
              // router.push('/purchase/process/cp_purchase_from_list')
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpPurchaseFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/purchase/process/cp_purchase_from_form?id=${location.query.id}`);
              // router.push('/purchase/process/cp_purchase_from_list')
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
      router.push(`/purchase/process/cp_purchase_from_form?id=${location.query.id}`);
    }
  }

  onsave = () => {
    const { dispatch, form, cpPurchaseFromGet } = this.props;
    const { addfileList, location, selectgsdata, selectgysdata, updataflag } = this.state;
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
        value.supplierId = isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id) ? selectgysdata.id :
          (isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.supplierId) ? cpPurchaseFromGet.supplierId : '')
        value.cuttingApplyId = isNotBlank(selectgsdata) && isNotBlank(selectgsdata.id) ? selectgsdata.id :
          (isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.cuttingApplyId) ? cpPurchaseFromGet.cuttingApplyId : '')
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        if (updataflag) {
          value.orderStatus = 0
          dispatch({
            type: 'cpPurchaseFrom/cpPurchaseFrom_Add',
            payload: { ...value },
            callback: (res) => {
              router.push(`/purchase/process/cp_purchase_from_form?id=${res.data.id}&r=${Math.random()}`)
            }
          })
        } else {
          value.orderStatus = 1
          dispatch({
            type: 'cpupdata/cpPurchaseFrom_update',
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
    });
  }

  onCancelCancel = () => {
    router.push('/purchase/process/cp_purchase_from_list');
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
      this.setState({ selectgysflag: true })
  }

  selectgys = (record) => {

    this.props.form.setFieldsValue({
        gys:record.name
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

  onselectgs = () => {
    this.setState({
      selectgsflag: true
    })
  }

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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  showForm = (res) => {
    if (isNotBlank(res) && isNotBlank(res.id)) {
      this.setState({
        FormVisible: true,
        wlshowdata: res,
        billid: isNotBlank(res.cpBillMaterial.billCode) ? res.cpBillMaterial.billCode : ''
      })
    } else {
      this.setState({
        FormVisible: true
      })
    }
  }

  handleFormAdd = (values) => {
    const { dispatch } = this.props
    const { location, modalRecord, wlshowdata } = this.state
    const newdata = { ...values }
    if (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.id)) {
      newdata.id = wlshowdata.id
    }
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_Add',
      payload: {
        purchaseId: location.query.id,
        billId: isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? modalRecord.id :
          (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.id) && isNotBlank(wlshowdata.cpBillMaterial.id) ? wlshowdata.cpBillMaterial.id : ''),
        ...newdata,
      },
      callback: () => {
        this.setState({
          FormVisible: false,
          modalRecord: [],
          wlshowdata: {},
          billid: '',
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
            purchaseId: location.query.id
          }
        });
      }
    })
  }

  showTable = () => {
    const { dispatch } = this.props
    const { location ,wlsearch,pageCurrent,pagePageSize} = this.state
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
        ...wlsearch,
        current:pageCurrent,
        pageSize:pagePageSize,
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
      modalRecord: res,
      billid: res.billCode
    })
  }

  handleFormVisible = flag => {
    this.setState({
      modalRecord: {},
      billid: '',
      wlshowdata: {},
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
            purchaseId: location.query.id
          }
        });
      }
    });
  }

  onUndo = id => {
    Modal.confirm({
      title: '撤销该采购单',
      content: '确定撤销该采购单吗',
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
        type: 'cpRevocation/cpPurchaseFrom_Revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/purchase/process/cp_purchase_from_form?id=${location.query.id}`);
          // router.push('/purchase/process/cp_purchase_from_list');
        }
      })
    }
  }

  handleSearchVisiblegys = (fieldsValue) => {
    this.setState({
      searchVisiblegys: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
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

  showxx = (e) => {
    this.setState({
      seleval: e
    })
  }

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/Parts_PurchaseOrder?id=${location.query.id}`
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
      intentionId: location.query.id,
    };
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: params,
    });
  };

  onselecttype = (e) => {
    console.log(e)
    this.setState({
      purchasetype: e
    })
  }

  render() {
    const { fileList, previewVisible, previewImage, selectgysflag, selectgysdata, selectgsflag, selectgsdata, seleval,
      modalRecord, modalVisible, selectedRows, FormVisible, orderflag, purchaseType, purchaseStatus, wlshowdata, make_need,
      billid, searchVisiblegys, location, updataflag, updataname, srcimg, purchasetype, purchaserequire } = this.state;
    const { submitting2, submitting3, submitting, submitting1, cpPurchaseFromGet, cpSupplierList, complist, cpBillMaterialList, cpBillMaterialMiddleList, cpPurchaseDetailList, CpSupplierSearchList, dispatch } = this.props;
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

    const parentMethodsgys = {
      handleAddgys: this.handleAddgys,
      handleModalVisiblegys: this.handleModalVisiblegys,
      selectgys: this.selectgys,
      cpSupplierList,
      selectgysflag,
      handleSearchChangegys: this.handleSearchChangegys,
      dispatch,
      that
    }
    const parentMethodsgs = {
      handleModalVisiblegs: this.handleModalVisiblegs,
      selectgs: this.selectgs,
      complist,
      dispatch,
      that
    }
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      cpBillMaterialList,
      dispatch,
      location,
      modalRecord,
      selectedRows,
      handleSelectRows: this.handleSelectRows,
      that
    };
    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      selectForm: this.selectForm,
      showTable: this.showTable,
      modalRecord,
      FormVisible,
      purchaseType,
      purchaserequire
      , purchaseStatus,
      wlshowdata, make_need, billid,
      searchcode: this.searchcode,
      changecode: this.changecode,
      submitting1,
      seleval,
      showxx: this.showxx,
      that
    };
    const columns = [
      {
        title: '修改',
        width: 100,
        align: 'center',
        render: (text, record) => {
          if (!orderflag) {
            return <Fragment>
              <a onClick={() => this.showForm(record)}>修改</a>
            </Fragment>
          }
          return ''
        }
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
        title: '采购状态',
        dataIndex: 'purchaseStatus',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: (text) => {
          if (isNotBlank(text) && isNotBlank(that.state.purchaseStatus) && that.state.purchaseStatus.length > 0) {
          return that.state.purchaseStatus.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
            return item.label
            }
            return '';
          })
          }
          return ''
        },

        // render: (text) => {
        //   if (text == '计划采购') {
        //     return <span style={{ color: '#87d068' }}>{text}</span>
        //   }
        //   if (text == '紧急采购') {
        //     return <span style={{ color: '#f50' }}>{text}</span>
        //   }
        //   if (text == '常规采购') {
        //     return <span style={{ color: 'rgb(204, 102, 0)' }}>{text}</span>
        //   }
        // }
      },
      {
        title: '采购要求',
        dataIndex: 'purchaseRequire',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: (text) => {
          if (isNotBlank(text) && isNotBlank(that.state.purchaserequire) && that.state.purchaserequire.length > 0) {
          return that.state.purchaserequire.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
            return item.label
            }
            return '';
          })
          }
          return ''
        },
      },
      {
        title: '需求日期',
        dataIndex: 'needDate',
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
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '基础操作',
        width: 100,
        align: 'center',
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
    const parentSearchMethodsgys = {
      handleSearchVisiblegys: this.handleSearchVisiblegys,
      handleSearchAddgys: this.handleSearchAddgys,
      CpSupplierSearchList,
      searchVisiblegys
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            采购单
          </div>
          {isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) ? getFullUrl(`/${srcimg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单据状态'>
                    <Input

                      disabled
                      value={isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.orderStatus) ? (
                        cpPurchaseFromGet.orderStatus === 0 || cpPurchaseFromGet.orderStatus === '0' ? '未处理' : (
                          cpPurchaseFromGet.orderStatus === 1 || cpPurchaseFromGet.orderStatus === '1' ? '已处理' :
                            cpPurchaseFromGet.orderStatus === 2 || cpPurchaseFromGet.orderStatus === '2' ? '关闭' : '')) : ''}
                      style={cpPurchaseFromGet.orderStatus === 0 || cpPurchaseFromGet.orderStatus === '0' ? { color: '#f50' } : (
                        cpPurchaseFromGet.orderStatus === 1 || cpPurchaseFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
                      )}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    <Input value={isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.id) ? cpPurchaseFromGet.id : ''} disabled />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购人'>
                    {getFieldDecorator('cg', {
                      initialValue: isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.createBy) && isNotBlank(cpPurchaseFromGet.createBy.name) ? cpPurchaseFromGet.createBy.name : getStorage('username'),
                      rules: [
                        {
                          required: false,
                          message: '采购人',
                          max: 255,
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购日期'>
                    {getFieldDecorator('createDate', {
                      initialValue: isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.createDate) ? cpPurchaseFromGet.createDate : '',
                      rules: [
                        {
                          required: false,
                          message: '采购日期',
                          max: 255,
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购分类'>
                    {getFieldDecorator('procurementType', {
                      initialValue: isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.procurementType) ? cpPurchaseFromGet.procurementType : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入采购分类',
                          max: 255,
                        },
                      ],
                    })(<Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled={orderflag}
                      onChange={this.onselecttype}
                    >
                      {
                        isNotBlank(this.state.procurementType) && this.state.procurementType.length > 0 && this.state.procurementType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商'>
                    {getFieldDecorator('gys', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请选择供应商',
                        }
                      ]
                    })(<Input
                      style={{ width: '50%' }}
                      value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.name) ? selectgysdata.name :
                        (isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.cpSupplier) && isNotBlank(cpPurchaseFromGet.cpSupplier.name) ? cpPurchaseFromGet.cpSupplier.name : '')}
                      disabled
                    />)}
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgys} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商编号'>
                    <Input

                      value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id) ? selectgysdata.id :
                        (isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.cpSupplier) && isNotBlank(cpPurchaseFromGet.cpSupplier.id) ? cpPurchaseFromGet.cpSupplier.id : '')}
                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商单号'>
                    {getFieldDecorator('enquiryCode', {
                      initialValue: isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.enquiryCode) ? cpPurchaseFromGet.enquiryCode : '',
                      rules: [
                        {
                          required: !!(isNotBlank(purchasetype) && purchasetype == '4602e871-d91c-4b31-ae7a-c81205ed0fb3'),
                          message: '请输入供应商单号',
                        },
                      ],
                    })(
                      <Input
                        style={{ minHeight: 32 }}

                        disabled={orderflag && updataflag}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购类型'>
                    {getFieldDecorator('purchaseType', {
                      initialValue: isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.purchaseType) ? cpPurchaseFromGet.purchaseType : 'c25482f3-82bb-462e-a3b7-236f024b53a6',
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
                  <FormItem {...formItemLayout} label='总金额'>
                    <InputNumber
                      disabled
                      value={isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.totalMoney) ? getPrice(cpPurchaseFromGet.totalMoney) : ''}
                      style={{ width: '100%' }}
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                      precision={2}
                      min={0}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='打印次数'>
                    <Input disabled value={isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.printNumber) ? cpPurchaseFromGet.printNumber : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='代采申请公司'>
                    <Input
                      style={{ width: '50%' }}

                      value={isNotBlank(selectgsdata) && isNotBlank(selectgsdata.name) ? selectgsdata.name :
                        (isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.applyName) && isNotBlank(cpPurchaseFromGet.applyName) ? cpPurchaseFromGet.applyName : '')
                      }
                      disabled
                    />
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgs} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='物流方式' className="allinputstyle">
                    {getFieldDecorator('logistics', {
                      initialValue: isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.logistics) ? cpPurchaseFromGet.logistics : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入物流方式',
                          max: 255,
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} rows={2} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.remarks) ? cpPurchaseFromGet.remarks : '',
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
                {isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.id) &&
                  <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                    打印
                </Button>
                }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0].children.filter(item => item.name == '二次修改')
                    .length > 0 &&
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                    {updataname}
                  </Button>
                }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0].children.filter(item => item.name == '修改')
                    .length > 0 && <span>
                    <Button type="primary" style={{ marginLeft: 8 }} loading={submitting2 || submitting3} onClick={this.onsave} disabled={orderflag && updataflag}>
                      保存
  </Button>
                    <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting2 || submitting3} disabled={orderflag && updataflag}>
                      提交
  </Button>
                    {
                      orderflag &&
                      <Button style={{ marginLeft: 8 }} loading={submitting2 || submitting3} onClick={() => this.onUndo(cpPurchaseFromGet.id)}>
                        撤销
</Button>
                    }
                  </span>}
                <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                  返回
                </Button>
                <Button
                  style={{ marginLeft: 8, marginBottom: '10px' }}
                  onClick={() => this.showForm()}
                  disabled={!(isNotBlank(cpPurchaseFromGet) && isNotBlank(cpPurchaseFromGet.id) && cpPurchaseFromGet.orderStatus == 0)}
                >
                  新增明细
                </Button>
              </FormItem>
            </Card>
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
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        <SearchFormgys {...parentSearchMethodsgys} searchVisiblegys={searchVisiblegys} />
        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateFormgys {...parentMethodsgys} selectgysflag={selectgysflag} />
        <CreateFormgs {...parentMethodsgs} selectgsflag={selectgsflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpPurchaseFromForm;

/**
 * 总成采购单详情
 */
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
  Col,
  Row,
  Popconfirm,
  DatePicker,
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpZcPurchaseFromForm.less';
import moment from 'moment';
import { getStorage } from '@/utils/localStorageUtils';
import StandardTable from '@/components/StandardTable';
import StandardEditTable from '@/components/StandardEditTable';
import SearchTableList from '@/components/SearchTableList';

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
        onCancel={() => handleSearchVisiblegys(false)}
        afterClose={() => handleSearchVisiblegys()}
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

@Form.create()
class SearchFormzc extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAddzc } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearchAddzc(fieldsValue);
    });
  };
  handleSearchVisiblezcin = () => {
    const { form, handleSearchVisiblezc } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisiblezc(fieldsValue);
    });
  };

  render() {
    const {
      searchVisiblezc,
      form: { getFieldDecorator },
      handleSearchVisiblezc,
      cpAssemblyBuildSearchList,
    } = this.props;

    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisiblezc}
        onCancel={() => this.handleSearchVisiblezcin()}
        afterClose={() => this.handleSearchVisiblezcin()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={cpAssemblyBuildSearchList} />)}
        </div>
      </Modal>
    );
  }
}

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
    make_need,
    purchaserequire,
    seleval, showxx, changecode,
    searchcode, billid, submitting1
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = { ...fieldsValue };
      values.price = setPrice(values.price);
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

  const showin = (e) => {
    showxx(e)
  }
  const modelsearch = (e) => {
    changecode(e.target.value)
  }
  return (
    <Modal
      title="新增明细"
      visible={FormVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleFormVisible()}
    >

      <Row gutter={12}>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="总成型号">
            <div>
              <Input


                value={isNotBlank(billid) ? billid : ''}
                onChange={modelsearch}
              />
              <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={searchcode}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => showTable()}>
                选择
              </Button>
            </div>
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="业务项目">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.project)
                  ? modalRecord.project
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.project)
                    ? editdata.assemblyBuild.project
                    : ''
              }
            />
          </FormItem>
        </Col>

        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="总成号">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyCode)
                  ? modalRecord.assemblyCode
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.assemblyCode)
                    ? editdata.assemblyBuild.assemblyCode
                    : ''
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="大号">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.maxCode)
                  ? modalRecord.maxCode
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.maxCode)
                    ? editdata.assemblyBuild.maxCode
                    : ''
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="小号">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.minCode)
                  ? modalRecord.minCode
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.minCode)
                    ? editdata.assemblyBuild.minCode
                    : ''
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="总成分类">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyType)
                  ? modalRecord.assemblyType
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.assemblyType)
                    ? editdata.assemblyBuild.assemblyType
                    : ''
              }
            />
          </FormItem>
        </Col>

        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="车型">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.vehicleModel)
                  ? modalRecord.vehicleModel
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.vehicleModel)
                    ? editdata.assemblyBuild.vehicleModel
                    : ''
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="品牌">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyBrand)
                  ? modalRecord.assemblyBrand
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.assemblyBrand)
                    ? editdata.assemblyBuild.assemblyBrand
                    : ''
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="年份">
            <Input
              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.assemblyYear)
                  ? modalRecord.assemblyYear
                  : isNotBlank(editdata) &&
                    isNotBlank(editdata.assemblyBuild) &&
                    isNotBlank(editdata.assemblyBuild.assemblyYear)
                    ? editdata.assemblyBuild.assemblyYear
                    : ''
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="采购状态">
            {getFieldDecorator('purchaseStatus', {
              initialValue:
                isNotBlank(editdata) && isNotBlank(editdata.purchaseStatus)
                  ? editdata.purchaseStatus
                  : '',
              rules: [
                {
                  required: true,
                  message: '采购状态',

                },
              ],
            })(<Select
              allowClear
              style={{ width: '100%' }}
              style={seleval == 'ae3cd9b2-dfa8-40e5-a29a-f56f81cfcc2f' ? { color: '#87d068', width: '100%' } : (seleval == '70c07f43-62c9-4dca-9630-f1765007ca98' ? { color: '#f50', width: '100%' } : (seleval == '7f264433-d89d-4ffd-b170-5c0164d38d14' ? { color: 'rgb(204, 102, 0)', width: '100%' } : { width: '100%' }))}
            >
              {
                isNotBlank(purchaseStatus) && purchaseStatus.length > 0 && purchaseStatus.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="采购要求">
            {getFieldDecorator('purchaseRequire', {
              initialValue:
                isNotBlank(editdata) && isNotBlank(editdata.purchaseRequire)
                  ? editdata.purchaseRequire
                  : '',
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
          <FormItem {...formItemLayout} label="发票类型">
            {getFieldDecorator('makeNeed', {
              initialValue:
                isNotBlank(editdata) && isNotBlank(editdata.makeNeed)
                  ? editdata.makeNeed
                  : '',
              rules: [
                {
                  required: true,
                  message: '发票类型',

                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                {isNotBlank(make_need) &&
                  make_need.length > 0 &&
                  make_need.map(d => (
                    <Option key={d.id} value={d.value}>
                      {d.label}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="需求日期">
            {getFieldDecorator('needDate', {
              initialValue:
                isNotBlank(editdata) && isNotBlank(editdata.needDate)
                  ? moment(editdata.needDate)
                  : '',
              rules: [
                {
                  required: true,
                  message: '需求日期',

                },
              ],
            })(
              <DatePicker

                format="YYYY-MM-DD"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="采购数量">
            {getFieldDecorator('number', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.number)
                  ? modalRecord.number
                  : isNotBlank(editdata) && isNotBlank(editdata.number)
                    ? editdata.number
                    : '',
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
          <FormItem {...formItemLayout} label="采购金额">
            <InputNumber
              style={{ width: '100%' }}

              disabled
              value={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.money)
                  ? getPrice(modalRecord.money)
                  : isNotBlank(editdata) && isNotBlank(editdata.money)
                    ? getPrice(editdata.money)
                    : ''
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="采购单价">
            {getFieldDecorator('price', {
              initialValue:
                isNotBlank(modalRecord) && isNotBlank(modalRecord.price)
                  ? setPrice(modalRecord.price)
                  : isNotBlank(editdata) && isNotBlank(editdata.price)
                    ? getPrice(editdata.price)
                    : '',
              rules: [
                {
                  required: true,
                  message: '采购单价',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
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
            })(<Input />)}
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
    selectuser,
    handleSelectRows,
    selectedRows,
    cpAssemblyBuildList,
    dispatch,
    handleSearchChangezc,
    that
  } = props;

  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: record => (
        <Fragment>
          <a onClick={() => selectuser(record)}>选择</a>
        </Fragment>
      ),
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
      title: '业务项目',
      dataIndex: 'project',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '总成号',
      dataIndex: 'assemblyCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '大号',
      dataIndex: 'maxCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '小号',
      dataIndex: 'minCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '总成分类',
      dataIndex: 'assemblyType',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '类型编码',
      dataIndex: 'lxCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '分类编码',
      dataIndex: 'flCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '技术参数',
      dataIndex: 'technicalParameter',
      inputType: 'text',
      align: 'center',
      width: 100,
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
      width: 100,
      editable: true,
    },

    {
      title: '年份',
      dataIndex: 'assemblyYear',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '品牌编码',
      dataIndex: 'brandCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '一级编码型号',
      dataIndex: 'oneCode',
      align: 'center',
      inputType: 'text',
      width: 100,
      editable: true,
    },

    {
      title: '绑定系列数量',
      dataIndex: 'bindingNumber',
      inputType: 'text',
      align: 'center',
      width: 100,
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
      title: '再制造编码',
      dataIndex: 'makeCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },

    {
      title: '提成类型',
      dataIndex: 'pushType',
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
        zcsearch: values,
        pageCurrent: 1,
        pagePageSize: 10
      })

      dispatch({
        type: 'cpAssemblyBuild/cpAssemblyBuild_List',
        payload: {
          ...values,
          genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      zcsearch: {},
      pageCurrent: 1,
      pagePageSize: 10
    })
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        pageSize: 10,
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
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
      ...that.state.zcsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
      ...filters,
    };

    that.setState({
      pageCurrent: pagination.current,
      pagePageSize: pagination.pageSize
    })

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: params,
    });
  };

  const handleModalVisiblein = () => {
    // form.resetFields();
    // that.setState({
    //   zcsearch: {}
    // })
    handleModalVisible()
  }

  return (
    <Modal
      title="总成选择"
      visible={modalVisible}

      onCancel={() => handleModalVisiblein()}
      width="80%"
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="业务项目">
              {getFieldDecorator('project', {
                initialValue: '',
              })(<Select
                style={{ width: '100%' }}
                allowClear
              >
                {
                  isNotBlank(that.state.business_project) && that.state.business_project.length > 0 && that.state.business_project.map(d =>
                    <Option key={d.id} value={d.value}>{d.label}</Option>)
                }
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="总成型号">
              {getFieldDecorator('assemblyModel', {
                initialValue: '',
              })(<Input />)}
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
              <a style={{ marginLeft: 8 }} onClick={handleSearchChangezc}>
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
        data={cpAssemblyBuildList}
        columns={selectcolumns}
      />
    </Modal>
  );
});

const CreateFormgys = Form.create()(props => {
  const {
    handleModalVisiblegys,
    cpSupplierList,
    selectgysflag,
    selectgys,
    dispatch,
    form,
    handleSearchChangegys,
    that
  } = props;

  const { getFieldDecorator } = form;

  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      align: 'center',
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
      inputType: 'text',
      align: 'center',
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
      align: 'center',
      inputType: 'text',
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
        status: 0,
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
      Object.keys(values).map(item => {
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
          current: 1,
          status: 0,
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
      title="选择供应商"
      visible={selectgysflag}
      onCancel={() => handleModalVisiblegysin()}
      width="80%"
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input />)}
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

@connect(({ cpZcPurchaseFrom, loading, cpSupplier, cpAssemblyBuild, cpPurchaseDetail }) => ({
  ...cpZcPurchaseFrom,
  ...cpSupplier,
  ...cpAssemblyBuild,
  ...cpPurchaseDetail,
  submitting1: loading.effects['cpAssemblyBuild/get_cpBillMaterial_search_All'],
  submitting: loading.effects['form/submitRegularForm'],
  submitting2: loading.effects['cpZcPurchaseFrom/cpZcPurchaseFrom_Add'],
  submitting3: loading.effects['cpupdata/cpZcPurchaseFrom_update'],
}))
@Form.create()
class CpZcPurchaseFromForm extends PureComponent {
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
      billid: '',
      confirmflag: true,
      pageCurrent: 1,
      pagePageSize: 10,
      updataname: '取消锁定',
      location: getLocation(),
    };
  }

  componentDidMount() {
    const { dispatch, cpZcPurchaseFromGet } = this.props;
    const { location, selectgysdata } = this.state;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpZcPurchaseFrom/cpZcPurchaseFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0].children.filter(item => item.name == '修改')
                .length == 0)
          ) {
            this.setState({ orderflag: true })
          } else {
            this.setState({ orderflag: false })
          }

          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'ZCCG'
            },
            callback: (imgres) => {
              this.setState({
                srcimg: imgres.msg.split('|')[0]
              })
            }
          })
          if (isNotBlank(res.data.storageType)) {
            this.setState({
              rukuval: res.data.storageType
            })
          }

          this.props.form.setFieldsValue({
            supplierId:
              isNotBlank(res.data) &&
                isNotBlank(res.data.supplier) &&
                isNotBlank(res.data.supplier.name)
                ? res.data.supplier.name
                : '',
          });
        },
      });
      dispatch({
        type: 'cpPurchaseDetail/cpPurchaseDetail_List',
        payload: {
          purchaseId: location.query.id,
          pageSize: 10,
        },
      });
    }

    dispatch({
      type: 'cpSupplier/cpSupplier_List',
      payload: {
        pageSize: 10,
        status: 0,
      }
    });

    dispatch({
      type: 'cpSupplier/CpSupplier_SearchList',
      payload: {
        pageSize: 10,
      },
    });

    dispatch({
      type: 'dict/dict',
      callback: data => {
        const insuranceCompany = [];
        const brand = [];
        const approachType = [];
        const collectCustomer = [];
        const orderType = [];
        const business_project = [];
        const business_dicth = [];
        const business_type = [];

        const settlement_type = [];
        const payment_methodd = [];
        const old_need = [];
        const make_need = [];
        const quality_need = [];
        const oils_need = [];
        const guise_need = [];
        const installation_guide = [];

        const is_photograph = [];
        const maintenance_project = [];
        const del_flag = [];
        const classify = [];
        const client_level = [];
        const area = [];
        const stirageType = [];
        const purchaseStatus = [];
        const purchaseType = [];
        const storageType = [];
        const purchaserequire = []

        data.forEach(item => {
          if (item.type == 'insurance_company') {
            insuranceCompany.push(item);
          }
          if (item.type == 'brand') {
            brand.push(item);
          }
          if (item.type == 'approach_type') {
            approachType.push(item);
          }
          if (item.type == 'collect_customer') {
            collectCustomer.push(item);
          }
          if (item.type == 'orderType') {
            orderType.push(item);
          }
          if (item.type == 'business_project') {
            business_project.push(item);
          }
          if (item.type == 'business_dicth') {
            business_dicth.push(item);
          }
          if (item.type == 'business_type') {
            business_type.push(item);
          }

          if (item.type == 'settlement_type') {
            settlement_type.push(item);
          }
          if (item.type == 'payment_methodd') {
            payment_methodd.push(item);
          }
          if (item.type == 'old_need') {
            old_need.push(item);
          }
          if (item.type == 'make_need') {
            make_need.push(item);
          }
          if (item.type == 'quality_need') {
            quality_need.push(item);
          }

          if (item.type == 'oils_need') {
            oils_need.push(item);
          }
          if (item.type == 'guise_need') {
            guise_need.push(item);
          }
          if (item.type == 'installation_guide') {
            installation_guide.push(item);
          }
          if (item.type == 'maintenance_project') {
            maintenance_project.push(item);
          }
          if (item.type == 'is_photograph') {
            is_photograph.push(item);
          }

          if (item.type == 'del_flag') {
            del_flag.push(item);
          }
          if (item.type == 'classify') {
            classify.push(item);
          }
          if (item.type == 'client_level') {
            client_level.push(item);
          }

          if (item.type == 'area') {
            area.push(item);
          }

          if (item.type == 'stirageType') {
            stirageType.push(item);
          }

          if (item.type == 'purchaseStatus') {
            purchaseStatus.push(item);
          }

          if (item.type == 'purchaseType') {
            purchaseType.push(item);
          }

          if (item.type == 'CGYQ') {
            purchaserequire.push(item)
          }
        });
        this.setState({
          insuranceCompany,
          brand,
          approachType,
          collectCustomer,
          orderType,
          business_project,
          business_dicth,
          business_type,
          settlement_type,
          payment_methodd,
          old_need,
          make_need,
          quality_need,
          oils_need,
          guise_need,
          installation_guide,
          maintenance_project,
          is_photograph,
          del_flag,
          classify,
          client_level,
          stirageType,
          area,
          purchaseStatus,
          purchaseType,
          purchaserequire
        });
      },
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpZcPurchaseFrom/clear',
    });
    dispatch({
      type: 'cpPurchaseDetail/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpZcPurchaseFromGet } = this.props;
    const { addfileList, location, selectgysdata, updataflag } = this.state;
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

        value.user = {};
        value.user.id =
          isNotBlank(cpZcPurchaseFromGet) &&
            isNotBlank(cpZcPurchaseFromGet.user) &&
            isNotBlank(cpZcPurchaseFromGet.user.id)
            ? cpZcPurchaseFromGet.user.id
            : getStorage('userid');
        value.supplier = {};
        value.supplier.id =
          isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id)
            ? selectgysdata.id
            : isNotBlank(cpZcPurchaseFromGet) &&
              isNotBlank(cpZcPurchaseFromGet.supplier) &&
              isNotBlank(cpZcPurchaseFromGet.supplier.id)
              ? cpZcPurchaseFromGet.supplier.id
              : '';

        value.orderStatus = 1;
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        if (updataflag) {
          dispatch({
            type: 'cpZcPurchaseFrom/cpZcPurchaseFrom_Add',
            payload: { ...value },
            callback: (res) => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/purchase/process/cp_zc_purchase_from_form?id=${res.data.id}&r=${Math.random()}`);
              // router.push('/purchase/process/cp_zc_purchase_from_list');
            },
          });
        } else {
          dispatch({
            type: 'cpupdata/cpZcPurchaseFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/purchase/process/cp_zc_purchase_from_form?id=${location.query.id}`);
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
      router.push(`/purchase/process/cp_zc_purchase_from_form?id=${location.query.id}`);
    }
  };

  onsave = () => {
    const { dispatch, form, cpZcPurchaseFromGet } = this.props;
    const { addfileList, location, selectgysdata, updataflag } = this.state;
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

        value.user = {};
        value.user.id =
          isNotBlank(cpZcPurchaseFromGet) &&
            isNotBlank(cpZcPurchaseFromGet.user) &&
            isNotBlank(cpZcPurchaseFromGet.user.id)
            ? cpZcPurchaseFromGet.user.id
            : getStorage('userid');
        value.supplier = {};
        value.supplier.id =
          isNotBlank(selectgysdata) && isNotBlank(selectgysdata.id)
            ? selectgysdata.id
            : isNotBlank(cpZcPurchaseFromGet) &&
              isNotBlank(cpZcPurchaseFromGet.supplier) &&
              isNotBlank(cpZcPurchaseFromGet.supplier.id)
              ? cpZcPurchaseFromGet.supplier.id
              : '';
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }

        if (updataflag) {
          value.orderStatus = 0;

          dispatch({
            type: 'cpZcPurchaseFrom/cpZcPurchaseFrom_Add',
            payload: { ...value },
            callback: res => {
              router.push(`/purchase/process/cp_zc_purchase_from_form?id=${res.data.id}&r=${Math.random()}`);
            },
          });
        } else {
          value.orderStatus = 1;
          dispatch({
            type: 'cpupdata/cpZcPurchaseFrom_update',
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
    router.push('/purchase/process/cp_zc_purchase_from_list');
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

  selectgys = record => {
    const { cpZcPurchaseFromGet } = this.props;
    this.props.form.setFieldsValue({
      supplierId:
        isNotBlank(record) && isNotBlank(record.name)
          ? record.name
          : isNotBlank(cpZcPurchaseFromGet) &&
            isNotBlank(cpZcPurchaseFromGet.supplier) &&
            isNotBlank(cpZcPurchaseFromGet.supplier.name)
            ? cpZcPurchaseFromGet.supplier.name
            : '',
    });
    this.setState({
      selectgysdata: record,
      selectgysflag: false,
    });
  };

  handleModalVisiblegys = flag => {
    this.setState({
      selectgysflag: !!flag,
    });
  };

  onselectgys = () => {
    this.setState({ selectgysflag: true });
  };

  handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag,
      editdata: {},
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

  handleFormAdd = values => {
    const { dispatch } = this.props;
    const { location, modalRecord, selectinkwdata, editdata } = this.state;

    const newdata = { ...values };
    if (isNotBlank(editdata) && isNotBlank(editdata.id)) {
      newdata.id = editdata.id;
    }

    dispatch({
      type: 'cpZcPurchaseFrom/post_ZcCpPurchase_Detail',
      payload: {

        'assemblyBuild.id':
          isNotBlank(modalRecord) && isNotBlank(modalRecord.id)
            ? modalRecord.id
            : isNotBlank(editdata) &&
              isNotBlank(editdata.assemblyBuild) &&
              isNotBlank(editdata.assemblyBuild.id)
              ? editdata.assemblyBuild.id
              : '',
        purchaseId: location.query.id,
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
          type: 'cpZcPurchaseFrom/cpZcPurchaseFrom_Get',
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

  showForm = () => {
    this.setState({
      FormVisible: true,
    });
  };

  showTable = () => {
    const { dispatch } = this.props;
    const { location, pageCurrent, pagePageSize } = this.state;

    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        ...this.state.zcsearch,
        genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
        purchaseId: location.query.id,
        current: pageCurrent,
        pageSize: pagePageSize
      },
    });
    this.setState({
      modalVisible: true,
    });
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
    });
  };

  selectuser = res => {
    const { dispatch } = this.props;
    const { selectedRows, location } = this.state;

    this.setState({
      modalVisible: false,
      modalRecord: res,
      billid: res.assemblyModel
    });
  };

  handleDeleteClick = id => {
    const { dispatch } = this.props;
    const { location } = this.state;
    dispatch({
      type: 'cpZcPurchaseFrom/delete_Zc_CpPurchase_Detail',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'cpZcPurchaseFrom/cpZcPurchaseFrom_Get',
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
      editdata: data,
      billid: isNotBlank(data.assemblyBuild) && isNotBlank(data.assemblyBuild.assemblyModel) ? data.assemblyBuild.assemblyModel : ''
    });
  };

  onRevocation = record => {
    Modal.confirm({
      title: '撤销该总成采购单',
      content: '确定撤销该总成采购单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.onUndo(record),
    });
  };

  onUndo = id => {
    const { dispatch } = this.props;
    const { confirmflag, location } = this.state
    const that = this
    setTimeout(() => {
      that.setState({
        confirmflag: true
      })
    }, 1000)

    if (confirmflag) {
      this.setState({
        confirmflag: false
      })
      if (isNotBlank(id)) {
        dispatch({
          type: 'cpRevocation/cpZcPurchaseFrom_Revocation',
          payload: { id },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/purchase/process/cp_zc_purchase_from_form?id=${location.query.id}`);
            // router.push('/purchase/process/cp_zc_purchase_from_list');
          },
        });
      }
    }
  };

  handleSearchVisiblegys = () => {
    this.setState({
      searchVisiblegys: false,
    });
  };

  handleSearchChangegys = () => {
    this.setState({
      searchVisiblegys: true,
    });
  };

  handleSearchAddgys = fieldsValue => {
    const { dispatch } = this.props;

    dispatch({

      type: 'cpSupplier/cpSupplier_List',
      payload: {
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        status: 0,
      },
    });
    this.setState({
      searchVisiblegys: false,
    });
  };

  handleSearchVisiblezc = (fieldsValue) => {
    this.setState({
      searchVisiblezc: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChangezc = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
    });
    this.setState({
      searchVisiblezc: true,
    });
  };

  handleSearchAddzc = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {

        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      searchVisiblezc: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  goprint = () => {
    const { location } = this.state;
    const w = window.open('about:blank');
    w.location.href = `/#/Parts_ZC_PurchaseOrder?id=${location.query.id}`;
  };

  showxx = (e) => {
    this.setState({
      seleval: e
    })
  }

  colorstyle = (e) => {
    this.setState({
      seleval: e
    })
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

  changecode = (id) => {
    this.setState({
      modalRecord: {},
      billid: id
    })
  }

  searchcode = () => {
    const { dispatch } = this.props
    const { location, billid } = this.state
    if (isNotBlank(billid)) {
      this.setState({
        modalRecord: {},

      })
      dispatch({
        type: 'cpAssemblyBuild/get_cpAssemblyBuild_search_All',
        payload: {
          purchaseId: location.query.id,
          tag: 1,
          assemblyModel: billid,
          pageSize: 10,
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
      message.error('请输入总成型号')
    }
  }

  render() {
    const {
      fileList,
      previewVisible,
      previewImage,
      selectgysflag,
      selectgysdata,
      FormVisible,
      modalVisible,
      selectinkwdata,
      modalRecord,
      purchaseType,
      searchVisiblegys,
      purchaseStatus,
      searchVisiblezc,
      editdata,
      orderflag,
      make_need,
      purchaserequire,
      updataname,
      updataflag,
      seleval, rukuval, billid
      , srcimg
    } = this.state;
    const {
      submitting2, submitting3,
      submitting,
      submitting1,
      cpZcPurchaseFromGet,
      cpSupplierList,
      cpPurchaseDetailList,
      cpAssemblyBuildList,
      CpSupplierSearchList,
      cpAssemblyBuildSearchList,
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
      that,
      cpSupplierList,
      selectgysflag,
      dispatch,
      handleSearchChangegys: this.handleSearchChangegys,

    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      that,
      selectuser: this.selectuser,

      cpAssemblyBuildList,
      modalRecord,
      dispatch,
      handleSearchChangezc: this.handleSearchChangezc,
    };

    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      that,
      selectForm: this.selectForm,
      showTable: this.showTable,
      showKwtable: this.showKwtable,
      searchcode: this.searchcode,
      changecode: this.changecode,
      submitting1,
      billid,
      selectinkwdata,
      modalRecord,
      FormVisible,
      purchaseType,
      purchaserequire,
      purchaseStatus,
      editdata,
      make_need,
      showxx: this.showxx,
      seleval
    };

    const parentSearchMethodsgys = {
      handleSearchVisiblegys: this.handleSearchVisiblegys,
      handleSearchAddgys: this.handleSearchAddgys,
      CpSupplierSearchList,
      searchVisiblegys,
      that
    };

    const parentSearchMethodszc = {
      handleSearchVisiblezc: this.handleSearchVisiblezc,
      handleSearchAddzc: this.handleSearchAddzc,
      cpAssemblyBuildSearchList,
      that
    };

    const columns = [
      {
        title: '修改',
        width: 100,
        align: 'center',
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
        title: '总成型号',
        dataIndex: 'assemblyBuild.assemblyModel',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '业务项目',
        dataIndex: 'assemblyBuild.project',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '总成号',
        dataIndex: 'assemblyBuild.assemblyCode',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },

      {
        title: '大号',
        dataIndex: 'assemblyBuild.maxCode',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },

      {
        title: '小号',
        dataIndex: 'minCode',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },

      {
        title: '总成分类',
        dataIndex: 'assemblyBuild.assemblyType',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '车型',
        dataIndex: 'assemblyBuild.vehicleModel',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },

      {
        title: '品牌',
        dataIndex: 'assemblyBuild.assemblyBrand',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },

      {
        title: '年份',
        dataIndex: 'assemblyBuild.assemblyYear',
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
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      ,
      {
        title: '发票类型',
        dataIndex: 'makeNeed',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: (text) => {
          if (isNotBlank(text) && isNotBlank(that.state.make_need) && that.state.make_need.length > 0) {
            return that.state.make_need.map((item) => {
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
        title: '采购数量',
        dataIndex: 'number',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '采购单价',
        dataIndex: 'price',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: text => getPrice(text),
      },
      {
        title: '采购金额',
        dataIndex: 'money',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: text => getPrice(text),
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

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            总成采购单
          </div>
          {isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) ? getFullUrl(`/${srcimg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单据状态'>
                    {getFieldDecorator('orderStatus', {
                      initialValue:
                        isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.orderStatus)
                          ? cpZcPurchaseFromGet.orderStatus === 0 ||
                            cpZcPurchaseFromGet.orderStatus === '0'
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
                          cpZcPurchaseFromGet.orderStatus === 1 || cpZcPurchaseFromGet.orderStatus === '1'
                            ? { color: '#87d068' }
                            : { color: '#f50' }
                        }
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属分公司'>
                    <Input disabled value={isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.createBy) && isNotBlank(cpZcPurchaseFromGet.createBy.office) ? cpZcPurchaseFromGet.createBy.office.name : getStorage('companyname')} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购日期'>
                    <Input disabled value={isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.createDate) ? cpZcPurchaseFromGet.createDate : moment().format('YYYY-MM-DD HH:mm')} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='采购人'>
                    <Input disabled value={isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.createBy) ? cpZcPurchaseFromGet.createBy.name : getStorage('username')} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='供应商'>
                    {getFieldDecorator('supplierId', {
                      rules: [
                        {
                          required: true,
                          message: '请输入供应商',
                          max: 255,
                        },
                      ],
                    })(<Input style={{ width: '50%' }} disabled />)}
                    <Button type="primary" disabled={orderflag} style={{ marginLeft: '8px' }} onClick={this.onselectgys} loading={submitting}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input
                      disabled
                      value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.linkman) ? selectgysdata.linkman :
                        (isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.supplier) && isNotBlank(cpZcPurchaseFromGet.supplier.linkman) ? cpZcPurchaseFromGet.supplier.linkman : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='电话'>
                    <Input
                      disabled
                      value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.phone) ? selectgysdata.phone :
                        (isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.supplier) && isNotBlank(cpZcPurchaseFromGet.supplier.phone) ? cpZcPurchaseFromGet.supplier.phone : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='传真'>
                    <Input
                      disabled
                      value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.fax) ? selectgysdata.fax :
                        (isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.supplier) && isNotBlank(cpZcPurchaseFromGet.supplier.fax) ? cpZcPurchaseFromGet.supplier.fax : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='地址'>
                    <Input
                      disabled
                      value={isNotBlank(selectgysdata) && isNotBlank(selectgysdata.address) ? selectgysdata.address :
                        (isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.supplier) && isNotBlank(cpZcPurchaseFromGet.supplier.address) ? cpZcPurchaseFromGet.supplier.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='物流方式'>
                    {getFieldDecorator('logistics', {
                      initialValue:
                        isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.logistics)
                          ? cpZcPurchaseFromGet.logistics
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入物流方式',
                          max: 255,
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='入库类型'>
                    {getFieldDecorator('storageType', {
                      initialValue:
                        isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.storageType)
                          ? cpZcPurchaseFromGet.storageType
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入入库类型',
                          max: 255,
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        onChange={this.colorstyle}
                        style={rukuval == '32ec9882-2e80-4ffc-b27a-405ead2d8aba' ? { color: '#87d068', width: '100%' } : ((rukuval == 'ee52b259-32e8-41c1-97a2-72e3fa7a957d' || rukuval == '41a3c711-b2bd-4774-acc6-f2a8db27505d') ? { color: 'rgb(204, 102, 0)', width: '100%' } : (rukuval == 'fd7defa9-f6bb-47e1-8924-3b14ac370f9a' ? { color: '#1890FF', width: '100%' } : { width: '100%' }))}
                        disabled={orderflag}
                      >
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
                  <FormItem {...formItemLayout} label='总成类型'>
                    {getFieldDecorator('purchaseType', {
                      initialValue:
                        isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.purchaseType)
                          ? cpZcPurchaseFromGet.purchaseType
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入总成类型',
                          max: 255,
                        },
                      ],
                    })(
                      <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                        {isNotBlank(this.state.purchaseType) &&
                          this.state.purchaseType.length > 0 &&
                          this.state.purchaseType.map(d => (
                            <Option key={d.id} value={d.value}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总金额'>
                    <Input disabled value={isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.totalMoney) ? getPrice(cpZcPurchaseFromGet.totalMoney) : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='打印次数'>
                    <Input value={isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.printNumber)
                      ? cpZcPurchaseFromGet.printNumber
                      : ''} disabled />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue:
                        isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.remarks)
                          ? cpZcPurchaseFromGet.remarks
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

              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                  打印
                </Button>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0].children.filter(item => item.name == '二次修改')
                    .length > 0 &&
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                    {updataname}
                  </Button>}
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0].children.filter(item => item.name == '修改')
                    .length > 0 && <span>
                    <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting3 || submitting2} disabled={orderflag && updataflag}>
                      保存
  </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      htmlType="submit"
                      loading={submitting3 || submitting2}
                      disabled={orderflag && updataflag}
                    >
                      提交
  </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => this.showForm()} disabled={orderflag || (!isNotBlank(cpZcPurchaseFromGet.id))}>
                      新增明细
  </Button>
                    {
                      isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.orderStatus) && (cpZcPurchaseFromGet.orderStatus === 1 || cpZcPurchaseFromGet.orderStatus === '1') ?
                        <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpZcPurchaseFromGet.id)} loading={submitting3 || submitting2}>
                          撤销
  </Button> : null
                    }
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

        <SearchFormgys {...parentSearchMethodsgys} searchVisiblegys={searchVisiblegys} />
        <SearchFormzc {...parentSearchMethodszc} searchVisiblezc={searchVisiblezc} />

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

export default CpZcPurchaseFromForm;

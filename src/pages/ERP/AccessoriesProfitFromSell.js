// 配件销售明细利润表
import React, { PureComponent, Fragment } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import {
  Button,
  Input,
  InputNumber,
  Form,
  Card,
  Popconfirm,
  Icon,
  Row,
  Col,
  Select,
  DatePicker,
  Divider,
  Tag,
  Avatar,
  message,
  Modal,
} from 'antd';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { isNotBlank, getFullUrl, getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import moment from 'moment';
import styles from './CpCloseList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateFormpass = Form.create()(props => {
  const {
    modalVisiblepass,
    form,
    handleAddpass,
    handleModalVisiblepass,
    form: { getFieldDecorator },
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = { ...fieldsValue };
      handleAddpass(values);
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
      title="查询区间"
      visible={modalVisiblepass}
      onOk={okHandle}
      onCancel={() => handleModalVisiblepass()}
    >
      <FormItem {...formItemLayout} label="开始时间">
        {getFieldDecorator('startDate', {
          initialValue: moment().startOf('month'),
          rules: [
            {
              required: true,
              message: '请选择开始时间',
            },
          ],
        })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
      </FormItem>
      <FormItem {...formItemLayout} label="结束时间">
        {getFieldDecorator('endDate', {
          initialValue: moment().endOf('month'),
          rules: [
            {
              required: true,
              message: '请选择结束时间',
            },
          ],
        })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ cpstatistics, loading, syslevel }) => ({
  ...cpstatistics,
  ...syslevel,
  loading: loading.models.cpstatistics,
}))
@Form.create()
class FgsAnalyzeFromPurchase extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisiblepass: true,
    datavalue: {},
    mxdata: {},
    selectkhflag: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'syslevel/fetch2',
      payload: {
        type: 2,
        pageSize:100
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpstatistics/clear',
    });
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      levellist2,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物料名称">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户">
              {getFieldDecorator('searchName', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出库单号">
              {getFieldDecorator('outId', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="退料单号">
              {getFieldDecorator('quitId', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属分公司">
              {getFieldDecorator('officeId', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {isNotBlank(levellist2) &&
                    isNotBlank(levellist2.list) &&
                    levellist2.list.length > 0 &&
                    levellist2.list.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      levellist2,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: '',
              })(<Input />)}
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

  handleUpldExportClick = type => {
    const { startdate, enddate, formValues } = this.state;

    const newobj = { ...formValues };

    const params = {
      startDate: startdate,
      endDate: enddate,
      ...newobj,
      'user.id': getStorage('userid'),
    };
    window.open(
      `/api/Beauty/beauty/statisticsReport/exportAccessoriesSalesDetail?${stringify(params)}`
    );
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { startdate, enddate } = this.state;
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
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpstatistics/find_AccessoriesSalesDetail',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          startDate: startdate,
          endDate: enddate,
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues, startdate, enddate } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    if (isNotBlank(value)) {
      Object.keys(value).map(item => {
        if (value[item] instanceof moment) {
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpClose/cpClose_Update',
        payload: {
          id: key,
          ...value,
        },
        callback: () => {
          dispatch({
            type: 'cpstatistics/find_AccessoriesSalesDetail',
            payload: {
              pageSize: 10,
              ...formValues,
              startDate: startdate,
              endDate: enddate,
            },
          });
        },
      });
    }
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { startdate, enddate } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpstatistics/find_AccessoriesSalesDetail',
      payload: {
        pageSize: 10,
        current: 1,
        startDate: startdate,
        endDate: enddate,
      },
    });
  };

  handleAddpass = val => {
    const { dispatch } = this.props;
    const values = { ...val };
    values.startDate = moment(values.startDate).format('YYYY-MM-DD');
    values.endDate = moment(values.endDate).format('YYYY-MM-DD');
    this.setState({
      startdate: values.startDate,
      enddate: values.endDate,
    });

    this.setState({
      datavalue: values,
    });
    dispatch({
      type: 'cpstatistics/find_AccessoriesSalesDetail',
      payload: {
        pageSize: 10,
        current: 1,
        ...values,
      },
    });
    this.setState({
      modalVisiblepass: false,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, datavalue } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    let sort = {};
    if (isNotBlank(sorter) && isNotBlank(sorter.field)) {
      if (sorter.order === 'ascend') {
        sort = {
          'page.orderBy': `${sorter.field} asc`,
        };
      } else if (sorter.order === 'descend') {
        sort = {
          'page.orderBy': `${sorter.field} desc`,
        };
      }
    }

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
      ...datavalue,
    };
    dispatch({
      type: 'cpstatistics/find_AccessoriesSalesDetail',
      payload: params,
    });
  };

  render() {
    const { selectedRows, modalVisiblepass, selectkhflag } = this.state;
    const { loading, dispatch, findAccessoriesSalesDetaillist } = this.props;

    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '客户',
        dataIndex: 'cpClient.clientCpmpany',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'cpBillMaterial.billCode',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '物料名称',
        dataIndex: 'cpBillMaterial.name',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '销售数量',
        dataIndex: 'salesNumber',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '销售单价',
        dataIndex: 'salesPrice',
        inputType: 'text',
        width: 200,
        align: 'center',
        render: text => getPrice(text),
      },
      {
        title: '销售金额',
        dataIndex: 'salesMoney',
        inputType: 'text',
        width: 200,
        align: 'center',
        editable: true,
        render: text => getPrice(text),
      },
      {
        title: '出库单号',
        dataIndex: 'outStorageFrom.id',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '出库数量',
        dataIndex: 'outStorageFrom.number',
        inputType: 'text',
        width: 240,
        align: 'center',
      },
      {
        title: '出库单价',
        dataIndex: 'outStorageFrom.price',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: text => getPrice(text),
      },
      {
        title: '出库金额',
        dataIndex: 'outStorageFrom.money',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: text => getPrice(text),
      },
      {
        title: '退料单号',
        dataIndex: 'quitFrom.id',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '退料数量',
        dataIndex: 'quitFrom.number',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '退料单价',
        dataIndex: 'quitFrom.price',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: text => getPrice(text),
      },
      {
        title: '退料金额',
        dataIndex: 'quitFrom.money',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: text => getPrice(text),
      },
      {
        title: '毛利',
        dataIndex: 'maoriForehead',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: text => getPrice(text),
      },
      {
        title: '分公司',
        dataIndex: 'office.name',
        inputType: 'text',
        width: 150,
        align: 'center',
        editable: true,
      },
    ];

    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass,
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <div className={styles.tableListOperator}>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
              导出
            </Button>
          </div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
                  配件销售明细利润表
                </div>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={findAccessoriesSalesDetaillist}
                bordered
                columns={columns}
                // onSaveData={this.onSaveData}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
      </PageHeaderWrapper>
    );
  }
}
export default FgsAnalyzeFromPurchase;

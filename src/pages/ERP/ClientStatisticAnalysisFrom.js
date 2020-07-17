/**
 * 客户统计分析表
 */
import React, { PureComponent, Fragment, Suspense } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import {
  Button,
  Input,
  Form,
  Card,
  Icon,
  Row,
  Col,
  Select,
  DatePicker,
  message,
  Modal,
  Radio,
  Table,
  Tabs,
  Tag,
} from 'antd';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend } from 'bizcharts';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { isNotBlank, getPrice, deepClone, proccessObject } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import moment from 'moment';
import SearchTableList from '@/components/SearchTableList';
import styles from './CpCloseList.less';
import { Pie } from '@/components/Charts';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { MonthPicker, RangePicker } = DatePicker;
const { TabPane } = Tabs;

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
      <FormItem {...formItemLayout} label="开始月">
        {getFieldDecorator('sdate', {
          initialValue: moment().startOf('month'),
          rules: [
            {
              required: true,
              message: '请选择开始月',
            },
          ],
        })(
          <MonthPicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="请选择开始月" />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="结束月">
        {getFieldDecorator('edate', {
          initialValue: moment().endOf('month'),
          rules: [
            {
              required: true,
              message: '请选择结束月',
            },
          ],
        })(
          <MonthPicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="请选择结束月" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ cpstatistics, loading, sysusercom }) => ({
  ...cpstatistics,
  ...sysusercom,
  loading: loading.models.cpstatistics,
}))
@Form.create()
class ClientStatisticAnalysisFrom extends PureComponent {
  state = {
    expandForm: false,
    startTime: '',
    endDate: '',
    officeId: '',
    formValues: {},
    chartType: 'money',
    showMoney: true,
    showNumber: false,
    modalVisiblepass: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'sysusercom/get_UserOfficeList',
    });

    const nowdate = moment();

    this.setState({
      startTime: nowdate.startOf('month').format('YYYY-MM-DD'),
    });
    dispatch({
      type: 'cpstatistics/find_CustomerSalesNumber',
      payload: {
        pageSize: 10,
        current: 1,
        startTime: nowdate.startOf('month').format('YYYY-MM-DD'),

      },
    });
    dispatch({
      type: 'cpstatistics/get_CustomerSalsesGraphDate',
      payload: {
        sdate: nowdate.startOf('month').format('YYYY-MM-DD'),
        edate: nowdate.endOf('month').format('YYYY-MM-DD'),
      },
    });
  }

  clientLine = data => {
    if (isNotBlank(data)) {
      return data.map((item, i) => {
        let result = {};
        if (
          isNotBlank(item) &&
          isNotBlank(item.money) &&
          isNotBlank(item.moneyRatio) &&
          isNotBlank(item.month) &&
          isNotBlank(item.number) &&
          isNotBlank(item.numberRatio) &&
          isNotBlank(item.officeName) &&
          isNotBlank(item.typeName)
        ) {
          result = {
            money: Number(item.money),
            moneyRatio: item.moneyRatio,
            month: item.month,
            number: Number(item.number),
            numberRatio: item.numberRatio,
            officeName: item.officeName,
            typeName: item.typeName,
          };
        }
        return result;
      });
    }
    return [];
  };

  selectMonth = () => {
    this.setState({
      modalVisiblepass: true,
    });
  };

  handleAddpass = val => {
    const { dispatch } = this.props;
    const values = { ...val };
    values.sdate = moment(values.sdate).format('YYYY-MM-DD');
    values.edate = moment(values.edate).format('YYYY-MM-DD');
    dispatch({
      type: 'cpstatistics/get_CustomerSalsesGraphDate',
      payload: {
        ...values,
      },
    });
    this.setState({
      modalVisiblepass: false,
    });
  };

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

  handleUpldExportClick = type => {
    const { startTime, formValues } = this.state;
    let params = {};
    if (JSON.stringify(formValues) !== '{}') {
      params = {
        ...formValues,
        'user.id': getStorage('userid'),
      };
    } else {
      params = {
        startTime,
        'user.id': getStorage('userid'),
      };
    }
    window.open(`/api/Beauty/beauty/statisticsReport/exportCustomerSalesNumber?${stringify(params)}`)
  };


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, startTime } = this.state;

    const newformValues = { ...formValues };

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    let params = {};
    if (JSON.stringify(formValues) !== '{}') {
      params = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...newformValues,
        ...filters,
      };
    } else {
      params = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        startTime,
        ...filters,
      };
    }
    dispatch({
      type: 'cpstatistics/find_CustomerSalesNumber',
      payload: params,
    });
  }

  handleChangeChartType = e => {
    if (isNotBlank(e.target.value)) {
      this.setState({
        chartType: e.target.value,
      });
      if (e.target.value === 'money') {
        this.setState({
          showMoney: true,
          showNumber: false,
        });
      }
      if (e.target.value === 'number') {
        this.setState({
          showMoney: false,
          showNumber: true,
        });
      }
    }
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = { ...fieldsValue };

      Object.keys(values).map(item => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD');
        }
        return item;
      });

      values = proccessObject(values)

      this.setState({ formValues: values });

      dispatch({
        type: 'cpstatistics/find_CustomerSalesNumber',
        payload: {
          pageSize: 10,
          current: 1,
          ...values,
        },
      });
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({ formValues: {} });
    dispatch({
      type: 'cpstatistics/find_CustomerSalesNumber',
      payload: {
        pageSize: 10,
        current: 1,
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
      },
    });
  };

  renderSimpleForm = () => {
    const { form: { getFieldDecorator }, getUserOfficeList, } = this.props;
    const formItemLayout = {
      md: { span: 8 },
      sm: { span: 24 }
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col {...formItemLayout}>
            <FormItem label="客户编码">
              {getFieldDecorator('clientCode', {
                initialValue: '',
              })(<Input placeholder="请输入客户编码" />)}
            </FormItem>
          </Col>
          <Col {...formItemLayout}>
            <FormItem label="客户公司">
              {getFieldDecorator('clientCpmpany', {
                initialValue: '',
              })(
                <Input placeholder="请输入客户公司名称" />
              )}
            </FormItem>
          </Col>
          <Col {...formItemLayout}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeId', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {isNotBlank(getUserOfficeList) &&
                    getUserOfficeList.length > 0 &&
                    getUserOfficeList.map(item => (
                      <Option value={item.companyId} key={item.companyId}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...formItemLayout}>
            <FormItem label="选择月份">
              {getFieldDecorator('startTime', { initialValue: moment().startOf('month') })(
                <MonthPicker format="YYYY-MM-DD" picker="month" placeholder="请选择月份" />
              )}
            </FormItem>
          </Col>
          <Col {...formItemLayout}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm = () => {
    return this.renderSimpleForm();
  }

  render() {
    const { loading, findCustomerSalesNumberList, getCustomerSalsesGraphDate } = this.props;
    const { showMoney, showNumber, modalVisiblepass, chartType } = this.state
    const columns = [
      {
        title: '客户编码',
        dataIndex: 'client.code',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '客户名称',
        dataIndex: 'client.clientCpmpany',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '业务分类',
        dataIndex: 'businessType',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'number',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '数量占比',
        dataIndex: 'numberRatio',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '金额',
        dataIndex: 'money',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '金额占比',
        dataIndex: 'moneyRatio',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '所属公司',
        dataIndex: 'officeName',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
    ];

    const cols = {
      month: {
        range: [0.05, 0.95],
        alias: '时间',
      },
      money: {
        min: 0, // 定义数值范围的最小值
        alias: '金额',
      },
      number: {
        alias: '数量',
        min: 0, // 定义数值范围的最小值
      },
    };
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass,
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>

          <Card
            className={styles.offlineCard}
            title="客户统计"
            bodyStyle={{ padding: '0px 30px 0px 0px' }}
            style={{ minWidth: '100%' }}
            extra={
              <div className={styles.salesCardExtra}>
                <div className={styles.salesTypeRadio}>
                  <Button type="primary" onClick={this.selectMonth} style={{ marginRight: 20 }}>
                    选择月份区间
                  </Button>
                  <Radio.Group value={chartType} onChange={this.handleChangeChartType}>
                    <Radio.Button value="money">金额</Radio.Button>
                    <Radio.Button value="number">数量</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            }
          >
            {showMoney ? (
              <div>
                <Chart
                  padding="auto"
                  errorContent="出错了！"
                  animate
                  data={isNotBlank(getCustomerSalsesGraphDate) && isNotBlank(getCustomerSalsesGraphDate.cpOfferFormList) ? this.clientLine(getCustomerSalsesGraphDate.cpOfferFormList) : []}
                  scale={cols}
                  forceFit
                >
                  <Legend />
                  <Axis
                    name="money"
                    label={{
                      formatter: val => `${val / 10000}万元`,
                    }}
                  />
                  <Axis name="month" />

                  <Tooltip crosshairs={{ type: 'y', }} />
                  <Geom
                    type="line"
                    shape="smooth"
                    position="month*money"
                    size={2}
                    color="typeName"
                  />
                  <Geom
                    type="point"
                    position="month*money"
                    size={4}
                    shape="circle"
                    color="typeName"
                    style={{
                      stroke: '#fff',
                      lineWidth: 1,
                    }}
                  />
                </Chart>
              </div>
            ) : null}
            {showNumber ? (
              <div>
                <Chart
                  padding="auto"
                  data={
                    isNotBlank(getCustomerSalsesGraphDate) &&
                      isNotBlank(getCustomerSalsesGraphDate.cpOfferFormList)
                      ? this.clientLine(getCustomerSalsesGraphDate.cpOfferFormList)
                      : []
                  }
                  scale={cols}
                  forceFit
                >
                  <Legend />
                  <Axis name="month" />
                  <Axis name="number" />
                  <Tooltip
                    crosshairs={{
                      type: 'y',
                    }}
                  />
                  <Geom
                    type="line"
                    shape="smooth"
                    position="month*number"
                    size={2}
                    color="typeName"
                  />
                  <Geom
                    type="point"
                    position="month*number"
                    size={4}
                    shape="circle"
                    color="typeName"
                    style={{
                      stroke: '#fff',
                      lineWidth: 1,
                    }}
                  />
                </Chart>
              </div>
            ) : null}
          </Card>


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
                  客户统计分析表
                </div>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={{
                  list:
                    isNotBlank(findCustomerSalesNumberList) &&
                      isNotBlank(findCustomerSalesNumberList.list) &&
                      findCustomerSalesNumberList.list.length > 0
                      ? findCustomerSalesNumberList.list
                      : [],
                  pagination: {
                    total:
                      isNotBlank(findCustomerSalesNumberList) &&
                        isNotBlank(findCustomerSalesNumberList.pagination) &&
                        isNotBlank(findCustomerSalesNumberList.pagination.total)
                        ? findCustomerSalesNumberList.pagination.total
                        : 0,
                    current:
                      isNotBlank(findCustomerSalesNumberList) &&
                        isNotBlank(findCustomerSalesNumberList.pagination) &&
                        isNotBlank(findCustomerSalesNumberList.pagination.current)
                        ? findCustomerSalesNumberList.pagination.current
                        : 1,
                    pageSize:
                      isNotBlank(findCustomerSalesNumberList) &&
                        isNotBlank(findCustomerSalesNumberList.pagination) &&
                        isNotBlank(findCustomerSalesNumberList.pagination.pageSize)
                        ? findCustomerSalesNumberList.pagination.pageSize
                        : 10,
                  },
                }}
                bordered
                columns={columns}
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
export default ClientStatisticAnalysisFrom;

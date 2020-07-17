/**
 *  总成维修销售统计表
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
import { isNotBlank, getPrice, deepClone } from '@/utils/utils';
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
class ZcMaintainSellFrom extends PureComponent {
  state = {
    expandForm: false,
    startDate: '',
    endDate: '',
    officeId: '',
    formValues: {},
    chartType: 'money',
    showMoney: true,
    showNumber: false,
    modalVisiblepass: false
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'sysusercom/get_UserOfficeList',
    });

    const nowdate = moment();

    this.setState({
      startDate: nowdate.startOf('month').format('YYYY-MM-DD'),
      endDate: nowdate.endOf('month').format('YYYY-MM-DD'),
    });

    dispatch({
      type: 'cpstatistics/find_AssemblyWxAndXsStatistical',
      payload: {
        pageSize: 10,
        current: 1,
        startTime: nowdate.startOf('month').format('YYYY-MM-DD'),
        endTime: nowdate.endOf('month').format('YYYY-MM-DD'),
      },
    });

    dispatch({
      type: 'cpstatistics/get_AssemblyWxAndXsGraphDate',
      payload: {
        sdate: nowdate.startOf('month').format('YYYY-MM-DD'),
        edate: nowdate.endOf('month').format('YYYY-MM-DD'),
      },
    });
  }

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
      getUserOfficeList,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="总成型号">
              {getFieldDecorator('assemblyModel', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeName', {
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
          <Col md={8} sm={24}>
            <FormItem label="业务分类">
              {getFieldDecorator('businessType', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} allowClear>
                  <Option value="1">总成维修</Option>
                  <Option value="2">总成销售</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="业务项目">
              {getFieldDecorator('project', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} allowClear>
                  <Option value="b38f533e-9e41-4590-ab79-43d904012abd">发动机</Option>
                  <Option value="1">方向机</Option>
                  <Option value="2">变速箱</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
          </Col>
        </Row>
      </Form>
    );
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
      getUserOfficeList,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="总成型号">
              {getFieldDecorator('assemblyModel', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeName', {
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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { startDate, endDate, officeId } = this.state;
    form.validateFields((err, fieldsValue) => {
      const { businessType, project, officeName } = fieldsValue;
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (isNotBlank(businessType) || isNotBlank(project)) {
        values.ooType = 1;
      }
      Object.keys(values).map(item => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      this.setState({
        formValues: values,
      });
      if (isNotBlank(officeName)) {
        values.officeId = officeName;
      } else {
        values.officeId = officeId;
      }
      dispatch({
        type: 'cpstatistics/find_AssemblyWxAndXsStatistical',
        payload: {
          pageSize: 10,
          current: 1,
          startTime: startDate,
          endTime: endDate,
          ...values,
        },
      });
      delete values.officeName;
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { startDate, endDate, officeId } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpstatistics/find_AssemblyWxAndXsStatistical',
      payload: {
        pageSize: 10,
        current: 1,
        startTime: startDate,
        endTime: endDate,
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, startDate, endDate, officeId } = this.state;

    const newformValues = { ...formValues };
    newformValues.officeId = isNotBlank(officeId) ? officeId : '';

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    let sort = {};
    if (isNotBlank(sorter) && isNotBlank(sorter.field)) {
      if (sorter.order === 'ascend') {
        sort = { 'page.orderBy': `${sorter.field} asc`, };
      } else if (sorter.order === 'descend') {
        sort = { 'page.orderBy': `${sorter.field} desc`, };
      }
    }

    const params = {
      officeId,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...newformValues,
      ...filters,
      startTime: startDate,
      endTime: endDate,
    };
    if (
      isNotBlank(newformValues) &&
      (isNotBlank(newformValues.businessType) || isNotBlank(newformValues.project))
    ) {
      newformValues.ooType = 1;
    }
    dispatch({
      type: 'cpstatistics/find_AssemblyWxAndXsStatistical',
      payload: params,
    });
  }

  handleUpldExportClick = type => {
    const { startDate, endDate, formValues, officeId } = this.state;

    const params = {
      ...formValues,
      startTime: startDate,
      endTime: endDate,
      officeId,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      'user.id': getStorage('userid'),
    };
    window.open(
      `/api/Beauty/beauty/statisticsReport/exportAssemblyWxAndXsStatistical?${stringify(params)}`
    );
  };

  priceLine = data => {
    if (isNotBlank(data)) {
      return data.map((item, i) => {
        let result = {};
        if (
          isNotBlank(item) &&
          isNotBlank(item.month) &&
          isNotBlank(item.number) &&
          isNotBlank(item.money) &&
          isNotBlank(item.typeName) &&
          isNotBlank(item.company) &&
          isNotBlank(item.model)
        ) {
          result = {
            month: item.month,
            money: Number(item.money),
            number: Number(item.number),
            typeName: item.typeName,
            company: item.company,
            model: item.model,
            companyModel: `${item.company} - ${item.model}`,
          };
        }
        return result;
      });
    }
    return [];
  };

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

  selectMonth = () => {
    this.setState({
      modalVisiblepass: true,
    });
  };

  handleAddpass = val => {
    const { dispatch } = this.props;
    const { officeId } = this.state;
    const values = { ...val };
    values.sdate = moment(values.sdate).format('YYYY-MM-DD');
    values.edate = moment(values.edate).format('YYYY-MM-DD');
    dispatch({
      type: 'cpstatistics/get_AssemblyWxAndXsGraphDate',
      payload: {
        ...values,
        officeId,
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

  handleChangeCompanies = () => {
    const {
      form: { getFieldDecorator },
      getUserOfficeList,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearchAll} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
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
          <Col md={8} sm={24}>
            <Form.Item label="月份">
              {getFieldDecorator('month', { initialValue: '' })(
                <MonthPicker format="YYYY-MM" picker="month" placeholder="请选择月份" />
              )}
            </Form.Item>
          </Col>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormResetAll}>
                重置
              </Button>
            </div>
          </div>
        </Row>
      </Form>
    );
  }

  handleSearchAll = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { officeId, month } = fieldsValue;
      fieldsValue.officeName = '';
      let newMonth;
      if (err) return;
      if (isNotBlank(officeId)) {
        this.setState({
          officeId: officeId,
        });
      }
      if (isNotBlank(month)) {
        newMonth = month;
        this.setState({
          startDate: moment(month)
            .startOf('month')
            .format('YYYY-MM-DD'),
          endDate: moment(month)
            .endOf('month')
            .format('YYYY-MM-DD'),
        });
      }
      dispatch({
        type: 'cpstatistics/find_AssemblyWxAndXsStatistical',
        payload: {
          officeId,
          pageSize: 10,
          current: 1,
          startTime: moment(newMonth)
            .startOf('month')
            .format('YYYY-MM-DD'),
          endTime: moment(newMonth)
            .endOf('month')
            .format('YYYY-MM-DD'),
        },
      });
      dispatch({
        type: 'cpstatistics/get_AssemblyWxAndXsGraphDate',
        payload: {
          officeId,
          sdate: moment(newMonth)
            .startOf('month')
            .format('YYYY-MM-DD'),
          edate: moment(newMonth)
            .endOf('month')
            .format('YYYY-MM-DD'),
        },
      });
    });
  };

  handleFormResetAll = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      officeId: '',
      startDate: moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
    });
    dispatch({
      type: 'cpstatistics/find_AssemblyWxAndXsStatistical',
      payload: {
        pageSize: 10,
        current: 1,
        startTime: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        endTime: moment()
          .endOf('month')
          .format('YYYY-MM-DD'),
      },
    });
    dispatch({
      type: 'cpstatistics/get_AssemblyWxAndXsGraphDate',
      payload: {
        sdate: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        edate: moment()
          .endOf('month')
          .format('YYYY-MM-DD'),
      },
    });
  };

  render() {
    const {
      findAssemblyWxAndXsStatisticalList,
      loading,
      findAssemblyWxAndXsGraphDate,
    } = this.props;
    const { chartType, showMoney, showNumber, modalVisiblepass } = this.state;
    const columns = [
      // {
      //   title: '订单编号',
      //   dataIndex: 'orderCode',
      //   inputType: 'text',
      //   width: 200,
      //   align: 'center',
      // },
      {
        title: '业务项目',
        dataIndex: 'project',
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
        title: '总成型号',
        dataIndex: 'cpAssemblyBuild.assemblyModel',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '总成号',
        dataIndex: 'cpAssemblyBuild.assemblyCode',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '大号',
        dataIndex: 'cpAssemblyBuild.maxCode',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '小号',
        dataIndex: 'cpAssemblyBuild.minCode',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '总成分类',
        dataIndex: 'cpAssemblyBuild.assemblyType',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '车型/排量',
        dataIndex: 'cpAssemblyBuild.assemblyYear',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '品牌',
        dataIndex: 'cpAssemblyBuild.assemblyBrand',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '总成维修数量',
        dataIndex: 'wxNumber',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '总成维修数量占比',
        dataIndex: 'wxNumberRatio',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '总成维修金额',
        dataIndex: 'wxMoney',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '总成维修金额占比',
        dataIndex: 'wxMoneyRatio',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '维修占比数量',
        dataIndex: 'xsNumber',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '维修占比数量占比',
        dataIndex: 'xsNumberRatio',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '维修占比金额',
        dataIndex: 'xsMoney',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '维修占比金额占比',
        dataIndex: 'xsMoneyRatio',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '分公司',
        dataIndex: 'company',
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
        <Card bordered={false} bodyStyle={{ marginBottom: 10 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.handleChangeCompanies()}</div>
          </div>
        </Card>
        <Card>
          <div className={styles.salesCard}>
            <Tabs
              tabBarExtraContent={
                <div>
                  <Button type="primary" onClick={this.selectMonth}>
                    选择月份区间
                  </Button>
                </div>
              }
            >
              <TabPane tab="方向机" key="salesOne">
                <Card
                  className={styles.offlineCard}
                  title="方向机"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  loading={loading}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
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
                        // height={400}
                        padding="auto"
                        data={
                          isNotBlank(findAssemblyWxAndXsGraphDate) &&
                            isNotBlank(findAssemblyWxAndXsGraphDate.oneBusinessList)
                            ? this.priceLine(findAssemblyWxAndXsGraphDate.oneBusinessList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="money"
                          label={{
                            formatter: val => `${val / 10000}万元`,
                          }}
                        />
                        <Tooltip crosshairs={{ type: 'y', }} />
                        <Geom
                          type="line"
                          shape="smooth"
                          position="month*money"
                          size={2}
                          color="companyModel"
                        />
                        <Geom
                          type="point"
                          position="month*money"
                          size={4}
                          shape="circle"
                          color="companyModel"
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
                        // height={400}
                        padding="auto"
                        data={
                          isNotBlank(findAssemblyWxAndXsGraphDate) &&
                            isNotBlank(findAssemblyWxAndXsGraphDate.oneBusinessList)
                            ? this.priceLine(findAssemblyWxAndXsGraphDate.oneBusinessList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="number"
                        // label={{
                        //   formatter: val => `${val / 10000}万元`,
                        // }}
                        />
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
                          color="companyModel"
                        />
                        <Geom
                          type="point"
                          position="month*number"
                          size={4}
                          shape="circle"
                          color="companyModel"
                          style={{
                            stroke: '#fff',
                            lineWidth: 1,
                          }}
                        />
                      </Chart>
                    </div>
                  ) : null}
                </Card>
              </TabPane>
              <TabPane tab="变速箱" key="salesTwo">
                <Card
                  className={styles.offlineCard}
                  // bordered={false}
                  title="变速箱"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  // loading={loading}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
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
                        // height={400}
                        padding="auto"
                        data={
                          isNotBlank(findAssemblyWxAndXsGraphDate) &&
                            isNotBlank(findAssemblyWxAndXsGraphDate.twoBusinessList)
                            ? this.priceLine(findAssemblyWxAndXsGraphDate.twoBusinessList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="money"
                          label={{
                            formatter: val => `${val / 10000}万元`,
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: 'y',
                          }}
                        />
                        <Geom
                          type="line"
                          shape="smooth"
                          position="month*money"
                          size={2}
                          color="companyModel"
                        />
                        <Geom
                          type="point"
                          position="month*money"
                          size={4}
                          shape="circle"
                          color="companyModel"
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
                        // height={400}
                        padding="auto"
                        data={
                          isNotBlank(findAssemblyWxAndXsGraphDate) &&
                            isNotBlank(findAssemblyWxAndXsGraphDate.twoBusinessList)
                            ? this.priceLine(findAssemblyWxAndXsGraphDate.twoBusinessList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="number"
                        // label={{
                        //   formatter: val => `${val / 10000}万元`,
                        // }}
                        />
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
                          color="companyModel"
                        />
                        <Geom
                          type="point"
                          position="month*number"
                          size={4}
                          shape="circle"
                          color="companyModel"
                          style={{
                            stroke: '#fff',
                            lineWidth: 1,
                          }}
                        />
                      </Chart>
                    </div>
                  ) : null}
                </Card>
              </TabPane>
              <TabPane tab="发动机" key="salesThree">
                <Card
                  className={styles.offlineCard}
                  // bordered={false}
                  title="发动机"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  // loading={loading}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
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
                        // height={400}
                        padding="auto"
                        data={
                          isNotBlank(findAssemblyWxAndXsGraphDate) &&
                            isNotBlank(findAssemblyWxAndXsGraphDate.threeBusinessList)
                            ? this.priceLine(findAssemblyWxAndXsGraphDate.threeBusinessList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="money"
                          label={{
                            formatter: val => `${val / 10000}万元`,
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: 'y',
                          }}
                        />
                        <Geom
                          type="line"
                          shape="smooth"
                          position="month*money"
                          size={2}
                          color="companyModel"
                        />
                        <Geom
                          type="point"
                          position="month*money"
                          size={4}
                          shape="circle"
                          color="companyModel"
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
                        // height={400}
                        padding="auto"
                        data={
                          isNotBlank(findAssemblyWxAndXsGraphDate) &&
                            isNotBlank(findAssemblyWxAndXsGraphDate.threeBusinessList)
                            ? this.priceLine(findAssemblyWxAndXsGraphDate.threeBusinessList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="number"
                        // label={{
                        //   formatter: val => `${val / 10000}万元`,
                        // }}
                        />
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
                          color="companyModel"
                        />
                        <Geom
                          type="point"
                          position="month*number"
                          size={4}
                          shape="circle"
                          color="companyModel"
                          style={{
                            stroke: '#fff',
                            lineWidth: 1,
                          }}
                        />
                      </Chart>
                    </div>
                  ) : null}
                </Card>
              </TabPane>
            </Tabs>
          </div>
        </Card>
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
                  总成维修销售统计表
                </div>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={{
                  list:
                    isNotBlank(findAssemblyWxAndXsStatisticalList) &&
                      isNotBlank(findAssemblyWxAndXsStatisticalList.list) &&
                      findAssemblyWxAndXsStatisticalList.list.length > 0
                      ? findAssemblyWxAndXsStatisticalList.list
                      : [],
                  pagination: {
                    total:
                      isNotBlank(findAssemblyWxAndXsStatisticalList) &&
                        isNotBlank(findAssemblyWxAndXsStatisticalList.pagination) &&
                        isNotBlank(findAssemblyWxAndXsStatisticalList.pagination.total)
                        ? findAssemblyWxAndXsStatisticalList.pagination.total
                        : 0,
                    current:
                      isNotBlank(findAssemblyWxAndXsStatisticalList) &&
                        isNotBlank(findAssemblyWxAndXsStatisticalList.pagination) &&
                        isNotBlank(findAssemblyWxAndXsStatisticalList.pagination.current)
                        ? findAssemblyWxAndXsStatisticalList.pagination.current
                        : 1,
                    pageSize:
                      isNotBlank(findAssemblyWxAndXsStatisticalList) &&
                        isNotBlank(findAssemblyWxAndXsStatisticalList.pagination) &&
                        isNotBlank(findAssemblyWxAndXsStatisticalList.pagination.pageSize)
                        ? findAssemblyWxAndXsStatisticalList.pagination.pageSize
                        : 10,
                  },
                }}
                bordered
                columns={columns}
                // onSaveData={this.onSaveData}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default ZcMaintainSellFrom;



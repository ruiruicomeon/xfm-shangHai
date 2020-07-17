// 售后结案单成本统计
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
import DragTable from '../../components/StandardEditTable/dragTable'
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

@connect(({ cpstatistics, loading, cpPurchaseDetail, cpRevocation, syslevel, sysusercom }) => ({
  ...cpstatistics,
  ...cpPurchaseDetail,
  ...cpRevocation,
  ...syslevel,
  ...sysusercom,
  loading: loading.models.cpstatistics,
  submitting: loading.effects['cpstatistics/get_AfterSalesFigureDrawing'],
}))
@Form.create()
class AfterSaleOrderClosingCostFrom extends PureComponent {
  state = {
    startDate: '',
    endDate: '',
    officeId: '',
    expandForm: false,
    salesPieData: [],
    salesType: 'lastmonth',
    tabstitle: 'sales1',
    chartType: 'money',
    showMoney: true,
    showNumber: false,
    modalVisiblepass: false,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'sysusercom/get_UserOfficeList',
    });

    const nowdate = moment();
    dispatch({
      type: 'cpstatistics/find_AfterSalesCost',
      payload: {
        pageSize: 10,
        current: 1,
        startTime: nowdate.startOf('month').format('YYYY-MM-DD'),
        endTime: nowdate.endOf('month').format('YYYY-MM-DD'),
      },
    });

    dispatch({
      type: 'cpstatistics/get_AfterSalesFigureDrawing',
      payload: {
        pageSize: 10,
        switchType: 1,
        current: 1,
        startTime: nowdate.startOf('month').format('YYYY-MM-DD'),
        endTime: nowdate.endOf('month').format('YYYY-MM-DD'),
      },
      callback: res => {
        const newarr = [];
        if (isNotBlank(res.reportTwoList) && res.reportTwoList.length > 0) {
          res.reportTwoList.forEach((element, idx) => {
            if (idx != res.reportTwoList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.costMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        } else {
          this.setState({
            salesPieData: [],
          });
        }
      },
    });

    this.setState({
      startDate: nowdate.startOf('month').format('YYYY-MM-DD'),
      endDate: nowdate.endOf('month').format('YYYY-MM-DD'),
    });

    dispatch({
      type: 'cpstatistics/get_AfterGraphDate',
      payload: {
        sdate: nowdate.startOf('month').format('YYYY-MM-DD'),
        edate: nowdate.endOf('month').format('YYYY-MM-DD'),
      },
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'cpstatistics/clear',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, startDate, endDate, officeId } = this.state;

    const newformValues = { ...formValues }

    newformValues.officeId = isNotBlank(officeId) ? officeId : '';

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
      officeId,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...newformValues,
      ...filters,
      startTime: startDate,
      endTime: endDate,
    };
    dispatch({
      type: 'cpstatistics/find_AfterSalesCost',
      payload: params,
    });
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      getUserOfficeList,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="售后单号">
              {getFieldDecorator('orderCode', {
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
            <FormItem label="客户">
              {getFieldDecorator('clientName', {
                initialValue: '',
              })(<Input />)}
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
      getUserOfficeList,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="售后单号">
              {getFieldDecorator('orderCode', {
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
              {/* <a style={{ marginLeft: 8 }} onClick={this.handleSearchChange}>
                过滤其他 <Icon type="down" />
              </a> */}
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
      const { officeName, orderCode, clientName } = fieldsValue;
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      console.log(values);

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
        type: 'cpstatistics/find_AfterSalesCost',
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
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { startDate, endDate, officeId } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpstatistics/find_AfterSalesCost',
      payload: {
        officeId,
        pageSize: 10,
        current: 1,
        startTime: startDate,
        endTime: endDate,
      },
    });
  };

  handleChangeSalesType = e => {
    const { tabstitle } = this.state;
    const { getAfterSalesFigureDrawing } = this.props;
    this.setState({
      salesType: e.target.value,
    });
    if (isNotBlank(tabstitle) && tabstitle == 'sales1') {
      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {
        const newarr = [];
        if (
          isNotBlank(getAfterSalesFigureDrawing.reportTwoList) &&
          getAfterSalesFigureDrawing.reportTwoList.length > 0
        ) {
          getAfterSalesFigureDrawing.reportTwoList.forEach((element, idx) => {
            if (idx != getAfterSalesFigureDrawing.reportTwoList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.costMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        const newarr = [];
        if (
          isNotBlank(getAfterSalesFigureDrawing.reportTwoList) &&
          getAfterSalesFigureDrawing.reportTwoList.length > 0
        ) {
          getAfterSalesFigureDrawing.reportTwoList.forEach((element, idx) => {
            if (idx != getAfterSalesFigureDrawing.reportTwoList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.singularNumber) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      }
    } else if (isNotBlank(tabstitle) && tabstitle == 'sales2') {
      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {
        const newarr = [];
        if (
          isNotBlank(getAfterSalesFigureDrawing.reportThreeList) &&
          getAfterSalesFigureDrawing.reportThreeList.length > 0
        ) {
          getAfterSalesFigureDrawing.reportThreeList.forEach((element, idx) => {
            if (idx != getAfterSalesFigureDrawing.reportThreeList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.costMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        const newarr = [];
        if (
          isNotBlank(getAfterSalesFigureDrawing.reportThreeList) &&
          getAfterSalesFigureDrawing.reportThreeList.length > 0
        ) {
          getAfterSalesFigureDrawing.reportThreeList.forEach((element, idx) => {
            if (idx != getAfterSalesFigureDrawing.reportThreeList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.singularNumber) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      }
    } else if (isNotBlank(tabstitle) && tabstitle == 'sales3') {
      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {
        const newarr = [];
        if (
          isNotBlank(getAfterSalesFigureDrawing.reportFourList) &&
          getAfterSalesFigureDrawing.reportFourList.length > 0
        ) {
          getAfterSalesFigureDrawing.reportFourList.forEach((element, idx) => {
            if (idx != getAfterSalesFigureDrawing.reportFourList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.costMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        const newarr = [];
        if (
          isNotBlank(getAfterSalesFigureDrawing.reportFourList) &&
          getAfterSalesFigureDrawing.reportFourList.length > 0
        ) {
          getAfterSalesFigureDrawing.reportFourList.forEach((element, idx) => {
            if (idx != getAfterSalesFigureDrawing.reportFourList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.singularNumber) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      }
    }
  };

  tbasclick = e => {
    const { getAfterSalesFigureDrawing } = this.props;

    this.setState({
      tabstitle: e,
      salesType: 'lastmonth',
    });

    if (isNotBlank(e) && e == 'sales1') {
      const newarr = [];
      if (
        isNotBlank(getAfterSalesFigureDrawing.reportTwoList) &&
        getAfterSalesFigureDrawing.reportTwoList.length > 0
      ) {
        getAfterSalesFigureDrawing.reportTwoList.forEach((element, idx) => {
          if (idx != getAfterSalesFigureDrawing.reportTwoList.length - 1) {
            newarr.push({ x: element.typeName, y: Number(element.costMoney) });
          }
        });
        this.setState({
          salesPieData: newarr,
        });
      }
    } else if (isNotBlank(e) && e == 'sales2') {
      const newarr = [];
      if (
        isNotBlank(getAfterSalesFigureDrawing.reportThreeList) &&
        getAfterSalesFigureDrawing.reportThreeList.length > 0
      ) {
        getAfterSalesFigureDrawing.reportThreeList.forEach((element, idx) => {
          if (idx != getAfterSalesFigureDrawing.reportThreeList.length - 1) {
            newarr.push({ x: element.typeName, y: Number(element.costMoney) });
          }
        });
        this.setState({
          salesPieData: newarr,
        });
      }
    } else if (isNotBlank(e) && e == 'sales3') {
      const newarr = [];
      if (
        isNotBlank(getAfterSalesFigureDrawing.reportFourList) &&
        getAfterSalesFigureDrawing.reportFourList.length > 0
      ) {
        getAfterSalesFigureDrawing.reportFourList.forEach((element, idx) => {
          if (idx != getAfterSalesFigureDrawing.reportFourList.length - 1) {
            newarr.push({ x: element.typeName, y: Number(element.costMoney) });
          }
        });
        this.setState({
          salesPieData: newarr,
        });
      }
    }
  };

  priceLine = data => {
    if (isNotBlank(data)) {
      return data.map((item, i) => {
        let result = {};
        if (
          isNotBlank(item) &&
          isNotBlank(item.month) &&
          isNotBlank(item.number) &&
          isNotBlank(item.costMoney) &&
          isNotBlank(item.typeName)
        ) {
          result = {
            month: item.month,
            costMoney: Number(item.costMoney),
            number: Number(item.number),
            typeName: item.typeName,
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
    this.setState({
      sdate: values.sdate,
      edate: values.edate,
    });
    dispatch({
      type: 'cpstatistics/get_AfterGraphDate',
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

  handleChangeCompanies() {
    const {
      form: { getFieldDecorator },
      getUserOfficeList,
    } = this.props;
    const { aClassName, selMonthDate } = this.state;
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
      console.log(fieldsValue);

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
        type: 'cpstatistics/get_AfterSalesFigureDrawing',
        payload: {
          officeId,
          startTime: moment(newMonth)
            .startOf('month')
            .format('YYYY-MM-DD'),
          endTime: moment(newMonth)
            .endOf('month')
            .format('YYYY-MM-DD'),
          current: 1,
          pageSize: 10,
        },
        callback: res => {
          const newarr = [];
          if (isNotBlank(res.reportTwoList) && res.reportTwoList.length > 0) {
            res.reportTwoList.forEach((element, idx) => {
              if (idx != res.reportTwoList.length - 1) {
                newarr.push({ x: element.typeName, y: Number(element.costMoney) });
              }
            });
            this.setState({
              salesPieData: newarr,
            });
          } else {
            this.setState({
              salesPieData: [],
            });
          }
        },
      });
      dispatch({
        type: 'cpstatistics/find_AfterSalesCost',
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
        type: 'cpstatistics/get_AfterGraphDate',
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
      type: 'cpstatistics/get_AfterSalesFigureDrawing',
      payload: {
        startTime: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        endTime: moment()
          .endOf('month')
          .format('YYYY-MM-DD'),
        current: 1,
        pageSize: 10,
      },
      callback: res => {
        const newarr = [];
        if (isNotBlank(res.reportTwoList) && res.reportTwoList.length > 0) {
          res.reportTwoList.forEach((element, idx) => {
            if (idx != res.reportTwoList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.costMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        } else {
          this.setState({
            salesPieData: [],
          });
        }
      },
    });
    dispatch({
      type: 'cpstatistics/find_AfterSalesCost',
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
      type: 'cpstatistics/get_AfterGraphDate',
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

  handleUpldExportClick = type => {
    const { startDate, endDate, formValues } = this.state;

    const params = {
      ...formValues,
      startTime: startDate,
      endTime: endDate,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      'user.id': getStorage('userid'),
    };
    window.open(`/api/Beauty/beauty/statisticsReport/exportAfterSalesCost?${stringify(params)}`);
  };

  render() {
    const {
      findAfterSalesCostList,
      loading,
      submitting,
      getAfterSalesFigureDrawing,
      getAfterGraphDate,
    } = this.props;
    const {
      salesType,
      salesPieData,
      tabstitle,
      chartType,
      showMoney,
      showNumber,
      modalVisiblepass,
    } = this.state;
    const columns = [
      {
        title: '售后单号',
        dataIndex: 'orderCode',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '历史单号',
        dataIndex: 'historyCode',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '售后申请单号',
        dataIndex: 'applyCode',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '售后人员',
        dataIndex: 'afterUser.name',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '售后次数',
        dataIndex: 'entrustNumber',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '售后类型',
        dataIndex: 'entrustType',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '成本',
        dataIndex: 'costMoney',
        inputType: 'text',
        width: 200,
        align: 'center',
        render: text => getPrice(text),
      },
      {
        title: '售后地址',
        dataIndex: 'afterAddress',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '处理方式',
        dataIndex: 'processMode',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '售后安排',
        dataIndex: 'afterArrangement',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '业务员',
        dataIndex: 'user.name',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '客户',
        dataIndex: 'client.clientCpmpany',
        inputType: 'text',
        width: 200,
        align: 'center',
      },

      {
        title: '总成型号',
        dataIndex: 'assmblyBuild.assemblyModel',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '总成品牌',
        dataIndex: 'assmblyBuild.assemblyBrand',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '车型/排量',
        dataIndex: 'assmblyBuild.vehicleModel',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '年份',
        dataIndex: 'assmblyBuild.assmblyYear',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: 'VPN码',
        dataIndex: 'assemblyVin',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '所属公司',
        dataIndex: 'officeName',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
    ];

    const showtitle = () => {
      if (tabstitle == 'sales1') {
        return '项目分类';
      } else if (tabstitle == 'sales2') {
        return '业务渠道';
      } else if (tabstitle == 'sales3') {
        return '业务分类';
      }
    };

    const columnstj = [
      {
        title: showtitle(),
        dataIndex: 'typeName',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '成本',
        dataIndex: 'costMoney',
        inputType: 'text',
        width: 150,
        align: 'center',
        editable: true,
      },
      {
        title: '订单数',
        dataIndex: 'singularNumber',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
    ];

    const cols = {
      month: {
        range: [0.05, 0.95],
        alias: '时间',
      },
      costMoney: {
        min: 0, // 定义数值范围的最小值
        alias: '成本',
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
        <Card loading={submitting} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs onTabClick={this.tbasclick} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="项目分类统计" key="sales1">
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    <DragTable
                      scroll={{ x: 600 }}
                      loading={submitting}
                      style={{ marginTop: '10px' }}
                      dataSource={getAfterSalesFigureDrawing.reportTwoList}
                      pagination={false}
                      bordered
                      columns={columnstj}
                    />
                  </Col>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24} className="suspenseName">
                    <Suspense fallback={null}>
                      <Card
                        loading={submitting}
                        className={styles.salesCard}
                        bordered
                        title="项目分类统计"
                        bodyStyle={{ padding: 24 }}
                        extra={
                          <div className={styles.salesCardExtra}>
                            <div className={styles.salesTypeRadio}>
                              <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                <Radio.Button value="lastmonth">成本</Radio.Button>
                                <Radio.Button value="PlaceOrder">订单数</Radio.Button>
                              </Radio.Group>
                            </div>
                          </div>
                        }
                        style={{ marginTop: 24 }}
                      >
                        <Pie
                          className={styles.chartPie}
                          hasLegend
                          subTitle="总计"
                          total={() => (
                            <div>
                              {isNotBlank(salesType) &&
                                salesType === 'lastmonth' &&
                                isNotBlank(getAfterSalesFigureDrawing) &&
                                isNotBlank(getAfterSalesFigureDrawing.costMoney)
                                ? getAfterSalesFigureDrawing.costMoney
                                : isNotBlank(salesType) &&
                                  salesType === 'PlaceOrder' &&
                                  isNotBlank(getAfterSalesFigureDrawing) &&
                                  isNotBlank(getAfterSalesFigureDrawing.singularNumber)
                                  ? getAfterSalesFigureDrawing.singularNumber
                                  : '0'}
                            </div>
                          )}
                          data={salesPieData}
                          valueFormat={value => <div>{value}</div>}
                          height={270}
                          lineWidth={4}
                          style={{ padding: '8px 0' }}
                        />
                      </Card>
                    </Suspense>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="业务渠道统计" key="sales2">
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    <DragTable
                      scroll={{ x: 600 }}
                      loading={submitting}
                      style={{ marginTop: '10px' }}
                      dataSource={getAfterSalesFigureDrawing.reportThreeList}
                      pagination={false}
                      bordered
                      columns={columnstj}
                    />
                  </Col>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24} className="suspenseName">
                    <Suspense fallback={null}>
                      <Card
                        loading={submitting}
                        className={styles.salesCard}
                        bordered
                        title="业务渠道统计"
                        bodyStyle={{ padding: 24 }}
                        extra={
                          <div className={styles.salesCardExtra}>
                            <div className={styles.salesTypeRadio}>
                              <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                <Radio.Button value="lastmonth">成本</Radio.Button>
                                <Radio.Button value="PlaceOrder">订单数</Radio.Button>
                              </Radio.Group>
                            </div>
                          </div>
                        }
                        style={{ marginTop: 24 }}
                      >
                        <Pie
                          className={styles.chartPie}
                          hasLegend
                          subTitle="总计"
                          total={() => (
                            <div>
                              {isNotBlank(salesType) &&
                                salesType === 'lastmonth' &&
                                isNotBlank(getAfterSalesFigureDrawing) &&
                                isNotBlank(getAfterSalesFigureDrawing.costMoney)
                                ? getAfterSalesFigureDrawing.costMoney
                                : isNotBlank(salesType) &&
                                  salesType === 'PlaceOrder' &&
                                  isNotBlank(getAfterSalesFigureDrawing) &&
                                  isNotBlank(getAfterSalesFigureDrawing.singularNumber)
                                  ? getAfterSalesFigureDrawing.singularNumber
                                  : '0'}
                            </div>
                          )}
                          data={salesPieData}
                          valueFormat={value => <div>{value}</div>}
                          height={270}
                          lineWidth={4}
                          style={{ padding: '8px 0' }}
                        />
                      </Card>
                    </Suspense>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="业务分类统计" key="sales3">
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    <DragTable
                      scroll={{ x: 600 }}
                      loading={submitting}
                      style={{ marginTop: '10px' }}
                      dataSource={getAfterSalesFigureDrawing.reportFourList}
                      pagination={false}
                      bordered
                      columns={columnstj}
                    />
                  </Col>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24} className="suspenseName">
                    <Suspense fallback={null}>
                      <Card
                        loading={submitting}
                        className="salesCardfl"
                        bordered
                        title="业务分类统计"
                        bodyStyle={{ padding: 24 }}
                        extra={
                          <div className={styles.salesCardExtra}>
                            <div className={styles.salesTypeRadio}>
                              <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                <Radio.Button value="lastmonth">成本</Radio.Button>
                                <Radio.Button value="PlaceOrder">订单数</Radio.Button>
                              </Radio.Group>
                            </div>
                          </div>
                        }
                        style={{ marginTop: 24 }}
                      >
                        <Pie
                          className={styles.chartPie}
                          hasLegend
                          subTitle="总计"
                          total={() => (
                            <div>
                              {isNotBlank(salesType) &&
                                salesType === 'lastmonth' &&
                                isNotBlank(getAfterSalesFigureDrawing) &&
                                isNotBlank(getAfterSalesFigureDrawing.costMoney)
                                ? getAfterSalesFigureDrawing.costMoney
                                : isNotBlank(salesType) &&
                                  salesType === 'PlaceOrder' &&
                                  isNotBlank(getAfterSalesFigureDrawing) &&
                                  isNotBlank(getAfterSalesFigureDrawing.singularNumber)
                                  ? getAfterSalesFigureDrawing.singularNumber
                                  : '0'}
                            </div>
                          )}
                          data={salesPieData}
                          valueFormat={value => <div>{value}</div>}
                          height={270}
                          lineWidth={4}
                          style={{ padding: '8px 0' }}
                        />
                      </Card>
                    </Suspense>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
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
              <TabPane tab="项目分类统计" key="salesOne">
                <Card
                  className={styles.offlineCard}
                  // bordered={false}
                  title="项目分类统计"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  // loading={loading}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
                        <Radio.Group value={chartType} onChange={this.handleChangeChartType}>
                          <Radio.Button value="money">成本</Radio.Button>
                          <Radio.Button value="number">订单数</Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>
                  }
                >
                  {showMoney ? (
                    <div>
                      <Chart
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) && isNotBlank(getAfterGraphDate.projectList)
                            ? this.priceLine(getAfterGraphDate.projectList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="costMoney"
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
                          position="month*costMoney"
                          size={2}
                          color="typeName"
                        />
                        <Geom
                          type="point"
                          position="month*costMoney"
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
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) && isNotBlank(getAfterGraphDate.projectList)
                            ? this.priceLine(getAfterGraphDate.projectList)
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
              </TabPane>
              <TabPane tab="业务渠道统计" key="salesTwo">
                <Card
                  className={styles.offlineCard}
                  // bordered={false}
                  title="业务渠道统计"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  // loading={loading}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
                        <Radio.Group value={chartType} onChange={this.handleChangeChartType}>
                          <Radio.Button value="money">成本</Radio.Button>
                          <Radio.Button value="number">订单数</Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>
                  }
                >
                  {showMoney ? (
                    <div>
                      <Chart
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) && isNotBlank(getAfterGraphDate.dicthList)
                            ? this.priceLine(getAfterGraphDate.dicthList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="costMoney"
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
                          position="month*costMoney"
                          size={2}
                          color="typeName"
                        />
                        <Geom
                          type="point"
                          position="month*costMoney"
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
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) && isNotBlank(getAfterGraphDate.dicthList)
                            ? this.priceLine(getAfterGraphDate.dicthList)
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
              </TabPane>
              <TabPane tab="业务分类统计" key="salesThree">
                <Card
                  className={styles.offlineCard}
                  // bordered={false}
                  title="业务分类统计"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  // loading={loading}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
                        <Radio.Group value={chartType} onChange={this.handleChangeChartType}>
                          <Radio.Button value="money">成本</Radio.Button>
                          <Radio.Button value="number">订单数</Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>
                  }
                >
                  {showMoney ? (
                    <div>
                      <Chart
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) &&
                            isNotBlank(getAfterGraphDate.businessTypeList)
                            ? this.priceLine(getAfterGraphDate.businessTypeList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="costMoney"
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
                          position="month*costMoney"
                          size={2}
                          color="typeName"
                        />
                        <Geom
                          type="point"
                          position="month*costMoney"
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
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) &&
                            isNotBlank(getAfterGraphDate.businessTypeList)
                            ? this.priceLine(getAfterGraphDate.businessTypeList)
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
              </TabPane>
              <TabPane tab="总量" key="salesFour">
                <Card
                  className={styles.offlineCard}
                  // bordered={false}
                  title="总量"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  // loading={loading}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
                        <Radio.Group value={chartType} onChange={this.handleChangeChartType}>
                          <Radio.Button value="money">成本</Radio.Button>
                          <Radio.Button value="number">订单数</Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>
                  }
                >
                  {showMoney ? (
                    <div>
                      <Chart
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) && isNotBlank(getAfterGraphDate.sumList)
                            ? this.priceLine(getAfterGraphDate.sumList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis
                          name="costMoney"
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
                          position="month*costMoney"
                          size={2}
                          color="typeName"
                        />
                        <Geom
                          type="point"
                          position="month*costMoney"
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
                        height={400}
                        data={
                          isNotBlank(getAfterGraphDate) && isNotBlank(getAfterGraphDate.sumList)
                            ? this.priceLine(getAfterGraphDate.sumList)
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
                  售后结案单成本统计
                </div>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={{
                  list: isNotBlank(findAfterSalesCostList) && isNotBlank(findAfterSalesCostList.list) && findAfterSalesCostList.list.length > 0 ? findAfterSalesCostList.list : [],
                  pagination: {
                    total:
                      isNotBlank(findAfterSalesCostList) &&
                        isNotBlank(findAfterSalesCostList.pagination) &&
                        isNotBlank(findAfterSalesCostList.pagination.total)
                        ? findAfterSalesCostList.pagination.total
                        : 0,
                    current:
                      isNotBlank(findAfterSalesCostList) &&
                        isNotBlank(findAfterSalesCostList.pagination) &&
                        isNotBlank(findAfterSalesCostList.pagination.current)
                        ? findAfterSalesCostList.pagination.current
                        : 1,
                    pageSize:
                      isNotBlank(findAfterSalesCostList) &&
                        isNotBlank(findAfterSalesCostList.pagination) &&
                        isNotBlank(findAfterSalesCostList.pagination.pageSize)
                        ? findAfterSalesCostList.pagination.pageSize
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
        </div>
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
      </PageHeaderWrapper>
    );
  }
}
export default AfterSaleOrderClosingCostFrom;

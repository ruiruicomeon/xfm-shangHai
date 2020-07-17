/**
 * 总产值报表
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
import DragTable from '../../components/StandardEditTable/dragTable'
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

@Form.create()
class SearchForm extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearchAdd(fieldsValue);
    });
  };

  handleSearchVisiblein = () => {
    const { form, handleSearchVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisible(fieldsValue);
    });
  };

  render() {
    const {
      searchVisible,
      form: { getFieldDecorator },
      handleSearchVisible,
      getTotalStatementLine,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisible}
        onCancel={() => this.handleSearchVisiblein()}
        afterClose={() => this.handleSearchVisiblein()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={getTotalStatementLine} />)}
        </div>
      </Modal>
    );
  }
}

const CreateFormkh = Form.create()(props => {
  const {
    handleModalVisiblekh,
    handleSearchChangezc,
    getByBillList,
    selectkhflag,
    form,
    dispatch,
  } = props;
  const { getFieldDecorator } = form;
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

  const columnskh = [
    {
      title: '操作',
      dataIndex: 'type',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
      render: (text, res, index) => {
        if (isNotBlank(index) && index == 0) {
          return '期初';
        }
        if (isNotBlank(res) && isNotBlank(res.remarks) && res.remarks == '退货') {
          return '退货';
        }
        if (isNotBlank(res) && isNotBlank(res.remarks) && res.remarks == '退料') {
          return '退料';
        }
        if (
          isNotBlank(getByBillList) &&
          isNotBlank(getByBillList.length) &&
          getByBillList.length > 0 &&
          getByBillList.length - 1 == index
        ) {
          return '';
        }
        return <span>{text}</span>;
      },
    },
    {
      title: '操作数量',
      dataIndex: 'number',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
      render: (text, res, index) => {
        if (index == 0) {
          return <span>{res.startNumber}</span>;
        }
        if (index == getByBillList.list.length - 1) {
          return <span>合计：{res.number}</span>;
        }
        return <span>{text}</span>;
      },
    },
    {
      title: '日期',
      dataIndex: 'createDate',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '单号',
      dataIndex: 'purchaseId',
      inputType: 'text',
      align: 'center',
      width: 150,
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
      title: '操作单价',
      dataIndex: 'price',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
      render: (text, res, index) => {
        if (index == 0) {
          return <span>{getPrice(res.balancePrice)}</span>;
        }
        if (index == getByBillList.list.length - 1) {
          return <span>平均单价：{getPrice(res.price)}</span>;
        }
        return <span>{getPrice(text)}</span>;
      },
    },
    {
      title: '操作金额',
      dataIndex: 'money',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
      render: (text, res, index) => {
        if (index == 0) {
          return <span>{getPrice(res.startMoney)}</span>;
        }
        if (index == getByBillList.list.length - 1) {
          return <span>合计：{getPrice(res.money)}</span>;
        }
        return <span>{getPrice(text)}</span>;
      },
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
  return (
    <Modal
      title="库存明细表"
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekh()}
      width="80%"
      className="hiddentabletotal"
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        pagination={false}
        data={getByBillList}
        columns={columnskh}
      />
    </Modal>
  );
});
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
        {getFieldDecorator('Sdate', {
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
        {getFieldDecorator('Edate', {
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
  submitting: loading.effects['cpstatistics/find_TotalOutPutValue'],
}))
@Form.create()
class CpCloseList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisiblepass: false,
    datavalue: {},
    mxdata: {},
    tabstitle: 'sales1',
    selectkhflag: false,
    salesType: 'lastmonth',
    aClassName: 0,
    selMonthDate: '',
    salesPieData: [],
    mode: ['month', 'month'],
    value: [],
    Sdate: '',
    Edate: '',
    chartType: 'money',
    showMoney: true,
    showNumber: false,
    officeId: '', // 公司
    startdate: '',
    enddate: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'cpRevocation/get_TotalStatementLine',
    });

    dispatch({
      type: 'sysusercom/get_UserOfficeList',
    });

    const nowdate = moment();

    dispatch({
      type: 'cpstatistics/find_TotalOutPutValue',
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
              newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
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
      type: 'cpstatistics/find_TotalOutPutValue_two',
      payload: {
        pageSize: 10,
        switchType: 1,
        current: 1,
        startTime: nowdate.startOf('month').format('YYYY-MM-DD'),
        endTime: nowdate.endOf('month').format('YYYY-MM-DD'),
      },
    });

    this.setState({
      startdate: nowdate.startOf('month').format('YYYY-MM-DD'),
      enddate: nowdate.endOf('month').format('YYYY-MM-DD'),
    });

    dispatch({
      type: 'cpstatistics/get_CapacityNumberAndMoney',
      payload: {
        Sdate: nowdate.startOf('month').format('YYYY-MM-DD'),
        Edate: nowdate.endOf('month').format('YYYY-MM-DD'),
        // Sdate: '2020-04-01',
        // Edate: '2020-06-30',
      },
    });

    // dispatch({
    //   type: 'cpstatistics/find_TotalOutMoneyChange',
    //   payload: {
    //     pageSize: 10,
    //     current: 1,
    //     startTime: nowdate.startOf('month').format('YYYY-MM-DD'),
    //     endTime: nowdate.endOf('month').format('YYYY-MM-DD'),
    //   },
    // });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'cpstatistics/clear',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, datavalue, startdate, enddate, officeId } = this.state;

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
      ...formValues,
      ...filters,
      startTime: startdate,
      endTime: enddate,
      switchType: 1,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
    };
    dispatch({
      type: 'cpstatistics/find_TotalOutPutValue_two',
      payload: params,
    });
  };

  // handleOutMoneyStandardTableChange = (pagination, filtersArg, sorter) => {
  //   const { dispatch } = this.props;
  //   const { formValues, datavalue, startdate, enddate, officeId } = this.state;

  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});

  //   let sort = {};
  //   if (isNotBlank(sorter) && isNotBlank(sorter.field)) {
  //     if (sorter.order === 'ascend') {
  //       sort = {
  //         'page.orderBy': `${sorter.field} asc`,
  //       };
  //     } else if (sorter.order === 'descend') {
  //       sort = {
  //         'page.orderBy': `${sorter.field} desc`,
  //       };
  //     }
  //   }

  //   const params = {
  //     officeId,
  //     current: pagination.current,
  //     pageSize: pagination.pageSize,
  //     ...sort,
  //     ...formValues,
  //     ...filters,
  //     startTime: startdate,
  //     endTime: enddate,
  //     genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
  //   };
  //   dispatch({
  //     type: 'cpstatistics/find_TotalOutMoneyChange',
  //     payload: params,
  //   });
  // };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { startdate, enddate, officeId } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpstatistics/find_TotalOutPutValue_two',
      payload: {
        officeId,
        pageSize: 10,
        current: 1,
        switchType: 1,
        startTime: startdate,
        endTime: enddate,
        genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  editAndDelete = e => {
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

  handleDeleteClick = id => {
    const { dispatch } = this.props;
    const { selectedRows, formValues, startdate, enddate } = this.state;
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
        type: 'cpClose/cpClose_Delete',
        payload: {
          id: ids,
        },
        callback: () => {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'cpstatistics/find_TotalOutPutValue',
            payload: {
              pageSize: 10,
              ...formValues,
              switchType: 1,
              startDate: startdate,
              endDate: enddate,
            },
          });
        },
      });
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { startdate, enddate, officeId } = this.state;
    form.validateFields((err, fieldsValue) => {
      const { officeName } = fieldsValue;
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
      if (isNotBlank(officeName)) {
        values.officeId = officeName;
        this.setState({
          officeId: officeName,
        });
      } else {
        values.officeId = officeId;
      }
      delete values.officeName;
      dispatch({
        type: 'cpstatistics/find_TotalOutPutValue_two',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          switchType: 1,
          startTime: startdate,
          endTime: enddate,
          // officeId,
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
            type: 'cpstatistics/find_TotalOutPutValue',
            payload: {
              pageSize: 10,
              ...formValues,
              switchType: 1,
              startTime: startdate,
              endTime: enddate,
            },
          });
        },
      });
    }
  };

  handleSearchChange = () => {
    this.setState({
      searchVisible: true,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
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
            <FormItem label="客户">
              {getFieldDecorator('clientCpmpany', {
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
              <a style={{ marginLeft: 8 }} onClick={this.handleSearchChange}>
                过滤其他 <Icon type="down" />
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
      getUserOfficeList,
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
            <FormItem label="客户">
              {getFieldDecorator('clientCpmpany', {
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

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
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
    values.Sdate = moment(values.Sdate).format('YYYY-MM-DD');
    values.Edate = moment(values.Edate).format('YYYY-MM-DD');
    this.setState({
      Sdate: values.Sdate,
      Edate: values.Edate,
    });
    dispatch({
      type: 'cpstatistics/get_CapacityNumberAndMoney',
      payload: {
        ...values,
        officeId,
      },
    });
    this.setState({
      modalVisiblepass: false,
    });
  };

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag,
    });
  };

  showmx = res => {
    const { dispatch } = this.props;
    const { startdate, enddate } = this.state;
    dispatch({
      type: 'cpPurchaseDetail/getBy_Bill',
      payload: {
        pageSize: 500,
        current: 1,
        billtype: 1,
        billId: res.billId,
        startDate: startdate,
        endDate: enddate,
        'cpPjEntrepot.id':
          isNotBlank(res.cpPjEntrepot) && isNotBlank(res.cpPjEntrepot.id)
            ? res.cpPjEntrepot.id
            : '',
        'office.id': res.office.id,
      },
    });
    this.setState({
      mxdata: res,
      selectkhflag: true,
    });
  };

  handleUpldExportClick = type => {
    const { startdate, enddate, formValues, officeId } = this.state;
    const params = {
      ...formValues,
      officeId,
      startTime: startdate,
      endTime: enddate,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      'user.id': getStorage('userid'),
    };
    window.open(`/api/Beauty/beauty/statisticsReport/exportTotalOutputValue?${stringify(params)}`);
  };

  handleSearchAdd = fieldsValue => {
    const { dispatch } = this.props;
    const { startdate, enddate, officeId } = this.state;
    dispatch({
      type: 'cpstatistics/find_TotalOutPutValue_two',
      payload: {
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        switchType: 1,
        startTime: startdate,
        endTime: enddate,
        officeId,
      },
    });

    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn),
    });
  };

  handleSearchVisible = fieldsValue => {
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn),
    });
  };

  handleChangeSalesType = e => {
    const { tabstitle } = this.state;
    const { findTotalOutPutValueGet } = this.props;
    this.setState({
      salesType: e.target.value,
    });
    if (isNotBlank(tabstitle) && tabstitle == 'sales1') {
      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {
        const newarr = [];
        if (
          isNotBlank(findTotalOutPutValueGet.reportTwoList) &&
          findTotalOutPutValueGet.reportTwoList.length > 0
        ) {
          findTotalOutPutValueGet.reportTwoList.forEach((element, idx) => {
            if (idx != findTotalOutPutValueGet.reportTwoList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        const newarr = [];
        if (
          isNotBlank(findTotalOutPutValueGet.reportTwoList) &&
          findTotalOutPutValueGet.reportTwoList.length > 0
        ) {
          findTotalOutPutValueGet.reportTwoList.forEach((element, idx) => {
            if (idx != findTotalOutPutValueGet.reportTwoList.length - 1) {
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
          isNotBlank(findTotalOutPutValueGet.reportThreeList) &&
          findTotalOutPutValueGet.reportThreeList.length > 0
        ) {
          findTotalOutPutValueGet.reportThreeList.forEach((element, idx) => {
            if (idx != findTotalOutPutValueGet.reportThreeList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        const newarr = [];
        if (
          isNotBlank(findTotalOutPutValueGet.reportThreeList) &&
          findTotalOutPutValueGet.reportThreeList.length > 0
        ) {
          findTotalOutPutValueGet.reportThreeList.forEach((element, idx) => {
            if (idx != findTotalOutPutValueGet.reportThreeList.length - 1) {
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
          isNotBlank(findTotalOutPutValueGet.reportFourList) &&
          findTotalOutPutValueGet.reportFourList.length > 0
        ) {
          findTotalOutPutValueGet.reportFourList.forEach((element, idx) => {
            if (idx != findTotalOutPutValueGet.reportFourList.length - 1) {
              newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        }
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        const newarr = [];
        if (
          isNotBlank(findTotalOutPutValueGet.reportFourList) &&
          findTotalOutPutValueGet.reportFourList.length > 0
        ) {
          findTotalOutPutValueGet.reportFourList.forEach((element, idx) => {
            if (idx != findTotalOutPutValueGet.reportFourList.length - 1) {
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

  changeMonth = e => {
    const { dispatch } = this.props;
    this.setState({
      showtype: 2,
    });

    if (isNotBlank(e)) {
      this.setState({
        selMonthDate: moment(e).format('YYYY-MM'),
        nowdate: moment(e).format('YYYY-MM'),
        startdate: moment(e)
          .startOf('month')
          .format('YYYY-MM-DD'),
        enddate: moment(e)
          .endOf('month')
          .format('YYYY-MM-DD'),
        selDate: '',
      });
      dispatch({
        type: 'cpstatistics/find_TotalOutPutValue',
        payload: {
          switchType: 1,
          startTime: moment(e)
            .startOf('month')
            .format('YYYY-MM-DD'),
          endTime: moment(e)
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
                newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
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
        type: 'cpstatistics/find_TotalOutPutValue_two',
        payload: {
          switchType: 1,
          startTime: moment(e)
            .startOf('month')
            .format('YYYY-MM-DD'),
          endTime: moment(e)
            .endOf('month')
            .format('YYYY-MM-DD'),
          current: 1,
          pageSize: 10,
        },
      });

      if (moment(e).format('YYYY-MM') == moment().format('YYYY-MM')) {
        this.setState({
          aClassName: 2,
        });
      } else {
        this.setState({
          aClassName: 3,
        });
      }
    } else {
      this.setState({
        selMonthDate: '',
      });
    }
  };

  selectnowMonth = () => {
    const { dispatch } = this.props;
    const nowdate = moment().format('YYYY-MM');
    this.setState({
      aClassName: 2,
      showtype: 2,
      nowdate,
      selDate: '',
      startdate: moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      enddate: moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
      selMonthDate: '',
    });
    dispatch({
      type: 'cpstatistics/find_TotalOutPutValue',
      payload: {
        switchType: 1,
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
              newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
            }
          });
          this.setState({
            salesPieData: newarr,
          });
        } else {
          this.setState({
            salesPieData: newarr,
          });
        }
      },
    });

    dispatch({
      type: 'cpstatistics/find_TotalOutPutValue_two',
      payload: {
        switchType: 1,
        startTime: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        endTime: moment()
          .endOf('month')
          .format('YYYY-MM-DD'),
        current: 1,
        pageSize: 10,
      },
    });
  };

  tbasclick = e => {
    const { findTotalOutPutValueGet } = this.props;

    this.setState({
      tabstitle: e,
      salesType: 'lastmonth',
    });

    if (isNotBlank(e) && e == 'sales1') {
      const newarr = [];
      if (
        isNotBlank(findTotalOutPutValueGet.reportTwoList) &&
        findTotalOutPutValueGet.reportTwoList.length > 0
      ) {
        findTotalOutPutValueGet.reportTwoList.forEach((element, idx) => {
          if (idx != findTotalOutPutValueGet.reportTwoList.length - 1) {
            newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
          }
        });
        this.setState({
          salesPieData: newarr,
        });
      }
    } else if (isNotBlank(e) && e == 'sales2') {
      const newarr = [];
      if (
        isNotBlank(findTotalOutPutValueGet.reportThreeList) &&
        findTotalOutPutValueGet.reportThreeList.length > 0
      ) {
        findTotalOutPutValueGet.reportThreeList.forEach((element, idx) => {
          if (idx != findTotalOutPutValueGet.reportThreeList.length - 1) {
            newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
          }
        });
        this.setState({
          salesPieData: newarr,
        });
      }
    } else if (isNotBlank(e) && e == 'sales3') {
      const newarr = [];
      if (
        isNotBlank(findTotalOutPutValueGet.reportFourList) &&
        findTotalOutPutValueGet.reportFourList.length > 0
      ) {
        findTotalOutPutValueGet.reportFourList.forEach((element, idx) => {
          if (idx != findTotalOutPutValueGet.reportFourList.length - 1) {
            newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
          }
        });
        this.setState({
          salesPieData: newarr,
        });
      }
    }
  };

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };

  handleChange = value => {
    this.setState({
      value,
    });
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
          isNotBlank(item.typeName)
        ) {
          result = {
            month: item.month,
            money: Number(item.money),
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
            {/* <a
              className={aClassName == 2 ? styles.aClick : ''}
              style={{ color: 'rgba(0,0,0,.65)', margin: '0 10px' }}
              onClick={this.selectnowMonth}
            >
              本月
            </a>
            <MonthPicker
              onChange={this.changeMonth}
              value={isNotBlank(selMonthDate) ? moment(selMonthDate) : ''}
              format="YYYY-MM"
              picker="month"
              placeholder="请选择月份"
            /> */}
            <Form.Item label="月份">
              {/* <a
                className={aClassName == 2 ? styles.aClick : ''}
                style={{ color: 'rgba(0,0,0,.65)', margin: '0 10px' }}
                onClick={this.selectnowMonth}
              >
                本月
              </a> */}
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

  handleFormResetAll = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      officeId: '',
      startdate: moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      enddate: moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
    });

    dispatch({
      type: 'cpstatistics/find_TotalOutPutValue',
      payload: {
        switchType: 1,
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
              newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
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
      type: 'cpstatistics/find_TotalOutPutValue_two',
      payload: {
        pageSize: 10,
        switchType: 1,
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
      type: 'cpstatistics/get_CapacityNumberAndMoney',
      payload: {
        Sdate: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        Edate: moment()
          .endOf('month')
          .format('YYYY-MM-DD'),
      },
    });
  };

  handleSearchAll = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { Sdate, Edate } = this.state;
    form.validateFields((err, fieldsValue) => {
      const { officeId, month } = fieldsValue;
      let newMonth;
      if (err) return;
      // const values = {
      //   ...fieldsValue,
      // };
      // this.setState({
      //   formValues: values,
      // });
      if (isNotBlank(officeId)) {
        this.setState({
          officeId: officeId,
        });
      }
      if (isNotBlank(month)) {
        newMonth = month;
        this.setState({
          startdate: moment(month)
            .startOf('month')
            .format('YYYY-MM-DD'),
          enddate: moment(month)
            .endOf('month')
            .format('YYYY-MM-DD'),
        });
      }
      dispatch({
        type: 'cpstatistics/find_TotalOutPutValue',
        payload: {
          officeId,
          switchType: 1,
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
                newarr.push({ x: element.typeName, y: Number(element.totalMoney) });
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
        type: 'cpstatistics/find_TotalOutPutValue_two',
        payload: {
          officeId,
          pageSize: 10,
          switchType: 1,
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
        type: 'cpstatistics/get_CapacityNumberAndMoney',
        payload: {
          officeId,
          Sdate: moment(newMonth)
            .startOf('month')
            .format('YYYY-MM-DD'),
          Edate: moment(newMonth)
            .endOf('month')
            .format('YYYY-MM-DD'),
        },
      });
    });
  };

  render() {
    const {
      selectedRows,
      modalVisiblepass,
      selectkhflag,
      searchVisible,
      salesType,
      salesPieData,
      tabstitle,
      selMonthDate,
      aClassName,
      mode,
      value,
      chartType,
      showMoney,
      showNumber,
    } = this.state;
    const {
      submitting,
      loading,
      cppjstatisticsList,
      getByBillList,
      dispatch,
      findTotalOutPutValueGet,
      findtwoTotalOutPutValueGet,
      getTotalStatementLine,
      getUserOfficeList,
      findCapacityNumberAndMoneyGet,
      // findTotalOutMoneyChangeList,
    } = this.props;

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
        width: 240,
        align: 'center',
      },
      {
        title: '订单分类',
        dataIndex: 'orderType',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '业务项目',
        dataIndex: 'project',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '业务渠道',
        dataIndex: 'dicth',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '业务分类',
        dataIndex: 'businessType',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '结算类型',
        dataIndex: 'settlementType',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '保险公司',
        dataIndex: 'insuranceCompanyId',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '集采客户',
        dataIndex: 'cpCollecClient.name',
        inputType: 'text',
        width: 150,
        align: 'center',
        editable: true,
      },
      {
        title: '集采编码',
        dataIndex: 'cpCollecCode.name',
        inputType: 'text',
        width: 200,
        align: 'center',
        editable: true,
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '业务员',
        dataIndex: 'user.name',
        inputType: 'text',
        width: 150,
        align: 'center',
        editable: true,
      },
      {
        title: '进场类型',
        dataIndex: 'assemblyEnterType',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '总成品牌',
        dataIndex: 'cpAssemblyBuild.assemblyBrand',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '车型/排量',
        dataIndex: 'cpAssemblyBuild.assemblyVehicleEmissions',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '年份',
        dataIndex: 'cpAssemblyBuild.assemblyYear',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '总成型号',
        dataIndex: 'cpAssemblyBuild.assemblyModel',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '钢印号',
        dataIndex: 'assemblySteelSeal',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: 'VIN码',
        dataIndex: 'assemblyVin',
        inputType: 'text',
        width: 200,
        align: 'center',
        editable: true,
      },
      {
        title: '其他识别信息',
        dataIndex: 'assemblyMessage',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '故障代码',
        dataIndex: 'assemblyFaultCode',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '本次故障描述',
        dataIndex: 'assemblyErrorDescription',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '维修项目',
        dataIndex: 'maintenanceProject',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },

      {
        title: '车牌号',
        dataIndex: 'plateNumber',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '金额变更金额',
        dataIndex: 'moneyChange',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
        render: (text, res) => {
          if (isNotBlank(res.cpCollecCode) && isNotBlank(res.cpCollecCode.name)) {
            return getPrice(getPrice(text));
          }
          return getPrice(text);
        },
      },
      {
        title: '结算金额',
        dataIndex: 'totalMoney',
        inputType: 'text',
        width: 100,
        editable: true,
        align: 'center',
        render: (text, res) => {
          if (isNotBlank(res.cpCollecCode) && isNotBlank(res.cpCollecCode.name)) {
            return getPrice(getPrice(text));
          }
          return getPrice(text);
        },
      },
      {
        title: '时间',
        dataIndex: 'finishDate',
        editable: true,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '所属公司',
        dataIndex: 'officeName',
        editable: true,
        inputType: 'text',
        width: 200,
        sorter: true,
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

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
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
        title: '金额',
        dataIndex: 'totalMoney',
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

    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass,
    };

    const parentMethodskh = {
      getByBillList,

      dispatch,
      handleModalVisiblekh: this.handleModalVisiblekh,
    };

    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      getTotalStatementLine,
    };

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

    return (
      <PageHeaderWrapper>
        <Card bordered={false} bodyStyle={{ marginBottom: 10 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.handleChangeCompanies()}</div>
          </div>
        </Card>
        <Card loading={submitting} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs
              // tabBarExtraContent={
              //   <div
              //     style={{
              //       margin: '10px 25px 10px 0',
              //     }}
              //   >
              //     <a
              //       className={aClassName == 2 ? styles.aClick : ''}
              //       style={{ color: 'rgba(0,0,0,.65)', margin: '0 10px' }}
              //       onClick={this.selectnowMonth}
              //     >
              //       本月
              //     </a>
              //     <MonthPicker
              //       onChange={this.changeMonth}
              //       value={isNotBlank(selMonthDate) ? moment(selMonthDate) : ''}
              //       format="YYYY-MM"
              //       picker="month"
              //       placeholder="请选择月份"
              //     />
              //   </div>
              // }
              onTabClick={this.tbasclick}
              size="large"
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane tab="项目分类统计" key="sales1">
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    <DragTable
                      scroll={{ x: 600 }}
                      loading={submitting}
                      style={{ marginTop: '10px' }}
                      dataSource={findTotalOutPutValueGet.reportTwoList}
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
                                <Radio.Button value="lastmonth">金额</Radio.Button>
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
                                isNotBlank(findTotalOutPutValueGet) &&
                                isNotBlank(findTotalOutPutValueGet.totalMoney)
                                ? findTotalOutPutValueGet.totalMoney
                                : isNotBlank(salesType) &&
                                  salesType === 'PlaceOrder' &&
                                  isNotBlank(findTotalOutPutValueGet) &&
                                  isNotBlank(findTotalOutPutValueGet.sumSingularNumber)
                                  ? findTotalOutPutValueGet.sumSingularNumber
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
                      dataSource={findTotalOutPutValueGet.reportThreeList}
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
                                <Radio.Button value="lastmonth">金额</Radio.Button>
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
                                isNotBlank(findTotalOutPutValueGet) &&
                                isNotBlank(findTotalOutPutValueGet.totalMoney)
                                ? findTotalOutPutValueGet.totalMoney
                                : isNotBlank(salesType) &&
                                  salesType === 'PlaceOrder' &&
                                  isNotBlank(findTotalOutPutValueGet) &&
                                  isNotBlank(findTotalOutPutValueGet.sumSingularNumber)
                                  ? findTotalOutPutValueGet.sumSingularNumber
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
                      dataSource={findTotalOutPutValueGet.reportFourList}
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
                                <Radio.Button value="lastmonth">金额</Radio.Button>
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
                                isNotBlank(findTotalOutPutValueGet) &&
                                isNotBlank(findTotalOutPutValueGet.totalMoney)
                                ? findTotalOutPutValueGet.totalMoney
                                : isNotBlank(salesType) &&
                                  salesType === 'PlaceOrder' &&
                                  isNotBlank(findTotalOutPutValueGet) &&
                                  isNotBlank(findTotalOutPutValueGet.sumSingularNumber)
                                  ? findTotalOutPutValueGet.sumSingularNumber
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
                  title="项目分类统计"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
                        <Radio.Group value={chartType} onChange={this.handleChangeChartType}>
                          <Radio.Button value="money">金额</Radio.Button>
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
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.projectList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.projectList)
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
                        height={400}
                        data={
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.projectList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.projectList)
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
                          <Radio.Button value="money">金额</Radio.Button>
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
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.dicthList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.dicthList)
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
                        height={400}
                        data={
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.dicthList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.dicthList)
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
                          <Radio.Button value="money">金额</Radio.Button>
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
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.businessTypeList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.businessTypeList)
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
                        height={400}
                        data={
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.businessTypeList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.businessTypeList)
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
                  title="总量"
                  bodyStyle={{ padding: '0px 30px 0px 0px' }}
                  style={{ minWidth: '100%' }}
                  extra={
                    <div className={styles.salesCardExtra}>
                      <div className={styles.salesTypeRadio}>
                        <Radio.Group value={chartType} onChange={this.handleChangeChartType}>
                          <Radio.Button value="money">金额</Radio.Button>
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
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.sumList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.sumList)
                            : []
                        }
                        scale={cols}
                        forceFit
                      >
                        <Legend />
                        <Axis name="month" />
                        <Axis name="money" label={{ formatter: val => `${val / 10000}万元`, }} />
                        <Tooltip
                          crosshairs={{ type: 'y' }}
                        />
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
                        height={400}
                        data={
                          isNotBlank(findCapacityNumberAndMoneyGet) &&
                            isNotBlank(findCapacityNumberAndMoneyGet.sumList)
                            ? this.priceLine(findCapacityNumberAndMoneyGet.sumList)
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
                <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>总产值报表</div>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={{
                  list:
                    isNotBlank(findtwoTotalOutPutValueGet) &&
                      isNotBlank(findtwoTotalOutPutValueGet.list) &&
                      findtwoTotalOutPutValueGet.list.length > 0
                      ? findtwoTotalOutPutValueGet.list
                      : [],
                  pagination: {
                    total:
                      isNotBlank(findtwoTotalOutPutValueGet) &&
                        isNotBlank(findtwoTotalOutPutValueGet.pagination) &&
                        isNotBlank(findtwoTotalOutPutValueGet.pagination.total)
                        ? findtwoTotalOutPutValueGet.pagination.total
                        : 0,
                    current:
                      isNotBlank(findtwoTotalOutPutValueGet) &&
                        isNotBlank(findtwoTotalOutPutValueGet.pagination) &&
                        isNotBlank(findtwoTotalOutPutValueGet.pagination.current)
                        ? findtwoTotalOutPutValueGet.pagination.current
                        : 1,
                    pageSize:
                      isNotBlank(findtwoTotalOutPutValueGet) &&
                        isNotBlank(findtwoTotalOutPutValueGet.pagination) &&
                        isNotBlank(findtwoTotalOutPutValueGet.pagination.pageSize)
                        ? findtwoTotalOutPutValueGet.pagination.pageSize
                        : 10,
                  },
                }}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        {/* <div className={styles.standardList}>
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
                  金额变更后产值表
                </div>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={{
                  list:
                    isNotBlank(findTotalOutMoneyChangeList) &&
                    isNotBlank(findTotalOutMoneyChangeList.list) &&
                    findTotalOutMoneyChangeList.list.length > 0
                      ? findTotalOutMoneyChangeList.list
                      : [],
                  pagination: {
                    total:
                      isNotBlank(findTotalOutMoneyChangeList) &&
                      isNotBlank(findTotalOutMoneyChangeList.pagination) &&
                      isNotBlank(findTotalOutMoneyChangeList.pagination.total)
                        ? findTotalOutMoneyChangeList.pagination.total
                        : 0,
                    current:
                      isNotBlank(findTotalOutMoneyChangeList) &&
                      isNotBlank(findTotalOutMoneyChangeList.pagination) &&
                      isNotBlank(findTotalOutMoneyChangeList.pagination.current)
                        ? findTotalOutMoneyChangeList.pagination.current
                        : 1,
                    pageSize:
                      isNotBlank(findTotalOutMoneyChangeList) &&
                      isNotBlank(findTotalOutMoneyChangeList.pagination) &&
                      isNotBlank(findTotalOutMoneyChangeList.pagination.pageSize)
                        ? findTotalOutMoneyChangeList.pagination.pageSize
                        : 10,
                  },
                }}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onChange={this.handleOutMoneyStandardTableChange}
              />
            </div>
          </Card>
        </div> */}
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />

        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpCloseList;

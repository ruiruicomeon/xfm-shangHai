import React, { PureComponent, Fragment, Suspense } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
// import io from "socket.io-client"
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Tabs, Table, Tooltip,
  Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal, Dropdown, Menu, Radio
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import DragTable from '../../components/StandardEditTable/dragTable'
import { isNotBlank, getFullUrl, getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import moment from 'moment';
import numeral from 'numeral';
import styles from './MonthlyStatistics.less';
import PageLoading from '@/components/PageLoading';
import { Pie, ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Yuan from '@/utils/Yuan';

const IntroduceRow = React.lazy(() => import('../Dashboard/IntroduceRow'));
const TopSearch = React.lazy(() => import('../Dashboard/TopSearch'));
const ProportionSales = React.lazy(() => import('../Dashboard/ProportionSales'));

const { RangePicker } = DatePicker;
const { MonthPicker } = DatePicker

const { TabPane } = Tabs;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, handleSearchChangezc, getByBillList, selectkhflag, form, dispatch } = props;
  const { getFieldDecorator } = form
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
          return '期初'
        }
        if (isNotBlank(res) && isNotBlank(res.remarks) && res.remarks == '退货') {
          return '退货'
        }
        if (isNotBlank(res) && isNotBlank(res.remarks) && res.remarks == '退料') {
          return '退料'
        }
        if (isNotBlank(getByBillList) && isNotBlank(getByBillList.length) && getByBillList.length > 0 && getByBillList.length - 1 == index) {
          return ''
        }
        return <span>{text}</span>
      }
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
          return <span>{res.startNumber}</span>
        } if (index == getByBillList.list.length - 1) {
          return <span>合计：{res.number}</span>
        }
        return <span>{text}</span>
      }
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
          return <span>{getPrice(res.balancePrice)}</span>
        } if (index == getByBillList.list.length - 1) {
          return <span>平均单价：{getPrice(res.price)}</span>
        }
        return <span>{getPrice(text)}</span>
      }
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
          return <span>{getPrice(res.startMoney)}</span>
        } if (index == getByBillList.list.length - 1) {
          return <span>合计：{getPrice(res.money)}</span>
        }
        return <span>{getPrice(text)}</span>
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
  ];
  return (
    <Modal
      title='库存明细表'
      visible={selectkhflag}

      onCancel={() => handleModalVisiblekh()}
      width='80%'
      className='hiddentabletotal'
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
  const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass, form: { getFieldDecorator } } = props;
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
      title='查询区间'
      visible={modalVisiblepass}
      onOk={okHandle}
      onCancel={() => handleModalVisiblepass()}
    >
      <FormItem {...formItemLayout} label="开始时间">
        {getFieldDecorator('startTime', {
          initialValue: moment().startOf('month'),
          rules: [
            {
              required: true,
              message: '请选择开始时间',
            },
          ],
        })(
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="结束时间">
        {getFieldDecorator('endTime', {
          initialValue: moment().endOf('month'),
          rules: [
            {
              required: true,
              message: '请选择结束时间',
            },
          ],
        })(
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        )
        }
      </FormItem>
    </Modal>
  );
});


// const socket = io.connect('http://192.168.50.200:7679/')

@connect(({ cpstatistics, loading, cpPurchaseDetail, syslevel }) => ({
  ...cpstatistics,
  ...cpPurchaseDetail,
  ...syslevel,
  loading: loading.effects['cpstatistics/get_CountBusinessOrderNumber'],
  submitting: loading.effects['cpstatistics/find_StatisticsReportProgress'],
}))
@Form.create()

class CpCloseList extends PureComponent {

  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisiblepass: true,
    datavalue: {},
    mxdata: {},
    tabstitle: 'sales1',
    selectkhflag: false,
    salesType: 'lastmonth',
    aClassName: 0,
    showtype: 2,
    selDate: '',
    selMonthDate: '',
    salesPieData: [
      {
        x: '外部订单',
        y: '',
      },
      {
        x: '内部订单',
        y: '',
      },
      {
        x: '延保订单',
        y: '',
      },
    ]
  }

  componentDidMount() {
    const { dispatch } = this.props;

    this.setState({
      nowdate: moment().format('YYYY-MM')
    })


    // socket.on('connect', function () {
    //   alert("连接成功");
    //   socket.emit('aaaaaaaa','1');
    // });
    // socket.on('bbbbbbbbb',function(data) {
    //   alert('123123123')
    //   console.log(data);
    // });
    // socket.on('disconnect', function () {
    //   alert("连接断开");
    // });

    // const ws = new WebSocket("ws://192.168.50.200:9075/");
    // ws.onopen = function () {
    //   // 使用 send() 方法发送数据
    //     console.log('connet')
    // };

    // // 接收服务端数据时触发事件
    // ws.onmessage = function (msg) {
    //       console.log(123)
    // };

    // // 断开 web socket 连接成功触发事件
    // ws.onclose = function () {
    //   alert("连接已关闭...");
    // };


    dispatch({
      type: 'cpstatistics/get_CountBusinessOrderNumber',
      payload: {
        showType: 0,
        startTime: moment().format('YYYY-MM'),
      },
      callback: (res) => {
        this.setState({
          salesPieData: [
            {
              x: '外部订单',
              y: Number(res.reportOneList[0].undoneNumber),
            },
            {
              x: '内部订单',
              y: Number(res.reportOneList[1].undoneNumber),
            },
            {
              x: '延保订单',
              y: Number(res.reportOneList[2].undoneNumber),
            },
          ]
        })
      }
    });
    dispatch({
      type: 'cpstatistics/find_StatisticsReportProgress',
      payload: {
        showType: 0,
        startTime: moment().format('YYYY-MM'),
        pageSize: 10,
        current: 1
      },
    });

    dispatch({
      type: 'syslevel/fetch2',
      payload: {
        type: 2,
        pageSize: 100
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
    const { formValues, datavalue, showtype, nowdate } = this.state;

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
      ...datavalue,
      // switchType:2
    };

    if (isNotBlank(showtype) && showtype == 2) {
      params.startTime = nowdate
      params.showType = 0
    } else {
      params.endTime = nowdate
      params.showType = 1
    }

    // socket.emit('aaaaaaaa',{...params});


    dispatch({
      type: 'cpstatistics/find_StatisticsReportProgress',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { showtype, nowdate } = this.state
    form.resetFields();
    this.setState({
      formValues: {},
    });

    const values = {}


    if (isNotBlank(showtype) && showtype == 2) {
      values.startTime = nowdate
      values.showType = 0
    } else {
      values.endTime = nowdate
      values.showType = 1
    }

    dispatch({
      type: 'cpstatistics/find_StatisticsReportProgress',
      payload: {
        ...values,
        pageSize: 10,
        current: 1,
        // switchType: 2,
        // startTime: startdate,
        // endTime: enddate
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  editAndDelete = (e) => {
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

  handleDeleteClick = (id) => {
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
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpstatistics/find_StatisticsReportProgress',
            payload: {
              pageSize: 10,
              ...formValues,
              // switchType: 2,
              startTime: startdate,
              endTime: enddate
            }
          });
        }
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
    const { startdate, enddate, nowdate, showtype } = this.state;
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
      this.setState({
        formValues: values,
      });

      if (isNotBlank(showtype) && showtype == 2) {
        values.startTime = nowdate
        values.showType = 0
      } else {
        values.endTime = nowdate
        values.showType = 1
      }

      dispatch({
        type: 'cpstatistics/find_StatisticsReportProgress',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          // switchType: 2,
          // startTime: startdate,
          // endTime: enddate
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues, startdate, enddate } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    if (isNotBlank(value)) {
      Object.keys(value).map((item) => {
        if (value[item] instanceof moment) {
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpClose/cpClose_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpstatistics/find_StatisticsReportProgress',
            payload: {
              pageSize: 10,
              ...formValues,
              // switchType: 2,
              startTime: startdate,
              endTime: enddate
            }
          });
        }
      });
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      levellist2
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label='订单编号'>
              {getFieldDecorator('orderCode', {
                initialValue: ''
              })(
                <Input />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属分公司">
              {getFieldDecorator('officeId', {
                initialValue: '',
              })(
                <Select

                  style={{ width: '100%' }}
                  allowClear
                >
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
          {/* <Col md={8} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeName', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col> */}

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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      levellist2
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label='订单编号'>
              {getFieldDecorator('orderCode', {
                initialValue: ''
              })(
                <Input />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属分公司">
              {getFieldDecorator('officeId', {
                initialValue: '',
              })(
                <Select

                  style={{ width: '100%' }}
                  allowClear
                >
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
          <Col md={8} sm={24}>
            <FormItem label='客户'>
              {getFieldDecorator('clientCpmpany', {
                initialValue: ''
              })(
                <Input />

              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeName', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col> */}
          {/* <Col md={8} sm={24}>
            <FormItem label="总成型号">
              {getFieldDecorator('officeName', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col> */}
          {/* <Col md={8} sm={24}>
            <FormItem label="仓库">
              {getFieldDecorator('cpEntrepot.name', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col> */}
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

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const values = { ...val }
    values.startTime = moment(values.startTime).format("YYYY-MM-DD")
    values.endTime = moment(values.endTime).format("YYYY-MM-DD")
    this.setState({
      startdate: values.startTime,
      enddate: values.endTime
    })

    this.setState({
      datavalue: values
    })
    dispatch({
      type: 'cpstatistics/find_StatisticsReportProgress',
      payload: {
        pageSize: 10,
        // switchType:2,
        current: 1,
        ...values
      }
    });
    this.setState({
      modalVisiblepass: false,
    });
  }

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  showmx = (res) => {
    const { dispatch } = this.props
    const { startdate, enddate } = this.state
    dispatch({
      type: 'cpPurchaseDetail/getBy_Bill',
      payload: {
        pageSize: 500,
        current: 1,
        billtype: 1,
        billId: res.billId,
        startTime: startdate,
        endTime: enddate,
        'cpEntrepot.id': isNotBlank(res.cpEntrepot) && isNotBlank(res.cpEntrepot.id) ? res.cpEntrepot.id : '',
        'office.id': res.office.id
      }
    })
    this.setState({
      mxdata: res,
      selectkhflag: true
    })
  }

  handleUpldExportClick = type => {
    const { startdate, enddate, formValues } = this.state;

    const newobj = { ...formValues }
    const newkey = isNotBlank(newobj.cpClient) && isNotBlank(newobj.cpClient.clientCpmpany) ? newobj.cpClient.clientCpmpany : ''
    delete newobj.cpClient


    const params = {
      startTime: startdate,
      endTime: enddate,
      ...formValues,
      'cpClient.clientCpmpany': newkey,
      'user.id': getStorage('userid'),
    }
    window.open(`/api/Beauty/beauty/statisticsReport/exportGrossProfitMargin?${stringify(params)}`);
  };

  handleChangeSalesType = (e) => {
    const { tabstitle } = this.state
    const { getCountBusinessOrderNumberGet } = this.props
    this.setState({
      salesType: e.target.value,
    });
    if (isNotBlank(tabstitle) && tabstitle == 'sales1') {
      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {
        this.setState({
          salesPieData: [{ x: '外部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[0].undoneNumberTwo) },
          { x: '内部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[1].undoneNumberTwo) },
          { x: '延保订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[2].undoneNumberTwo) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        this.setState({
          salesPieData: [{ x: '外部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[0].singularNumber) },
          { x: '内部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[1].singularNumber) },
          { x: '延保订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[2].singularNumber) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'completeNumber') {
        this.setState({
          salesPieData: [{ x: '外部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[0].completeNnumber) },
          { x: '内部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[1].completeNnumber) },
          { x: '延保订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[2].completeNnumber) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'undoneNumber') {
        this.setState({
          salesPieData: [{ x: '外部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[0].undoneNumber) },
          { x: '内部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[1].undoneNumber) },
          { x: '延保订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[2].undoneNumber) }
          ]
        })
      }
    } else if (isNotBlank(tabstitle) && tabstitle == 'sales2') {

      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {
        this.setState({
          salesPieData: [{ x: '总成', y: Number(getCountBusinessOrderNumberGet.reportTwoList[0].undoneNumberTwo) },
          { x: '方向机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[1].undoneNumberTwo) },
          { x: '发动机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[2].undoneNumberTwo) },
          { x: '油品(养护)', y: Number(getCountBusinessOrderNumberGet.reportTwoList[3].undoneNumberTwo) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportTwoList[4].undoneNumberTwo) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportTwoList[5].undoneNumberTwo) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        this.setState({
          salesPieData: [{ x: '总成', y: Number(getCountBusinessOrderNumberGet.reportTwoList[0].singularNumber) },
          { x: '方向机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[1].singularNumber) },
          { x: '发动机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[2].singularNumber) },
          { x: '油品(养护)', y: Number(getCountBusinessOrderNumberGet.reportTwoList[3].singularNumber) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportTwoList[4].singularNumber) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportTwoList[5].singularNumber) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'completeNumber') {
        this.setState({
          salesPieData: [{ x: '总成', y: Number(getCountBusinessOrderNumberGet.reportTwoList[0].completeNnumber) },
          { x: '方向机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[1].completeNnumber) },
          { x: '发动机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[2].completeNnumber) },
          { x: '油品(养护)', y: Number(getCountBusinessOrderNumberGet.reportTwoList[3].completeNnumber) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportTwoList[4].completeNnumber) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportTwoList[5].completeNnumber) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'undoneNumber') {
        this.setState({
          salesPieData: [{ x: '总成', y: Number(getCountBusinessOrderNumberGet.reportTwoList[0].undoneNumber) },
          { x: '方向机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[1].undoneNumber) },
          { x: '发动机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[2].undoneNumber) },
          { x: '油品(养护)', y: Number(getCountBusinessOrderNumberGet.reportTwoList[3].undoneNumber) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportTwoList[4].undoneNumber) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportTwoList[5].undoneNumber) }
          ]
        })
      }

    } else if (isNotBlank(tabstitle) && tabstitle == 'sales3') {

      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {

        this.setState({
          salesPieData: [{ x: '保险', y: Number(getCountBusinessOrderNumberGet.reportThreeList[0].undoneNumberTwo) },
          { x: '集团', y: Number(getCountBusinessOrderNumberGet.reportThreeList[1].undoneNumberTwo) },
          { x: '4s店', y: Number(getCountBusinessOrderNumberGet.reportThreeList[2].undoneNumberTwo) },
          { x: '高修', y: Number(getCountBusinessOrderNumberGet.reportThreeList[3].undoneNumberTwo) },
          { x: '电商', y: Number(getCountBusinessOrderNumberGet.reportThreeList[4].undoneNumberTwo) },
          { x: '终端', y: Number(getCountBusinessOrderNumberGet.reportThreeList[5].undoneNumberTwo) },
          { x: '新孚美', y: Number(getCountBusinessOrderNumberGet.reportThreeList[6].undoneNumberTwo) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {

        this.setState({
          salesPieData: [{ x: '保险', y: Number(getCountBusinessOrderNumberGet.reportThreeList[0].singularNumber) },
          { x: '集团', y: Number(getCountBusinessOrderNumberGet.reportThreeList[1].singularNumber) },
          { x: '4s店', y: Number(getCountBusinessOrderNumberGet.reportThreeList[2].singularNumber) },
          { x: '高修', y: Number(getCountBusinessOrderNumberGet.reportThreeList[3].singularNumber) },
          { x: '电商', y: Number(getCountBusinessOrderNumberGet.reportThreeList[4].singularNumber) },
          { x: '终端', y: Number(getCountBusinessOrderNumberGet.reportThreeList[5].singularNumber) },
          { x: '新孚美', y: Number(getCountBusinessOrderNumberGet.reportThreeList[6].singularNumber) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'completeNumber') {

        this.setState({
          salesPieData: [{ x: '保险', y: Number(getCountBusinessOrderNumberGet.reportThreeList[0].completeNnumber) },
          { x: '集团', y: Number(getCountBusinessOrderNumberGet.reportThreeList[1].completeNnumber) },
          { x: '4s店', y: Number(getCountBusinessOrderNumberGet.reportThreeList[2].completeNnumber) },
          { x: '高修', y: Number(getCountBusinessOrderNumberGet.reportThreeList[3].completeNnumber) },
          { x: '电商', y: Number(getCountBusinessOrderNumberGet.reportThreeList[4].completeNnumber) },
          { x: '终端', y: Number(getCountBusinessOrderNumberGet.reportThreeList[5].completeNnumber) },
          { x: '新孚美', y: Number(getCountBusinessOrderNumberGet.reportThreeList[6].completeNnumber) }
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'undoneNumber') {

        this.setState({
          salesPieData: [{ x: '保险', y: Number(getCountBusinessOrderNumberGet.reportThreeList[0].undoneNumber) },
          { x: '集团', y: Number(getCountBusinessOrderNumberGet.reportThreeList[1].undoneNumber) },
          { x: '4s店', y: Number(getCountBusinessOrderNumberGet.reportThreeList[2].undoneNumber) },
          { x: '高修', y: Number(getCountBusinessOrderNumberGet.reportThreeList[3].undoneNumber) },
          { x: '电商', y: Number(getCountBusinessOrderNumberGet.reportThreeList[4].undoneNumber) },
          { x: '终端', y: Number(getCountBusinessOrderNumberGet.reportThreeList[5].undoneNumber) },
          { x: '新孚美', y: Number(getCountBusinessOrderNumberGet.reportThreeList[6].undoneNumber) }
          ]
        })
      }
    } else if (isNotBlank(tabstitle) && tabstitle == 'sales4') {


      if (isNotBlank(e.target.value) && e.target.value == 'lastmonth') {
        this.setState({
          salesPieData: [{ x: '孚美油', y: Number(getCountBusinessOrderNumberGet.reportFourList[0].undoneNumberTwo) },
          { x: '宝马油', y: Number(getCountBusinessOrderNumberGet.reportFourList[1].undoneNumberTwo) },
          { x: '嘉实多油', y: Number(getCountBusinessOrderNumberGet.reportFourList[2].undoneNumberTwo) },
          { x: '通用油', y: Number(getCountBusinessOrderNumberGet.reportFourList[3].undoneNumberTwo) },
          { x: 'BYD油', y: Number(getCountBusinessOrderNumberGet.reportFourList[4].undoneNumberTwo) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[5].undoneNumberTwo) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportFourList[6].undoneNumberTwo) },
          { x: '方向机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[7].undoneNumberTwo) },
          { x: '发动机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[8].undoneNumberTwo) },
          { x: '变速箱总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[9].undoneNumberTwo) },
          { x: '方向机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[11].undoneNumberTwo) },
          { x: '发动机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[12].undoneNumberTwo) },
          { x: '变速箱总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[13].undoneNumberTwo) },
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'PlaceOrder') {
        this.setState({
          salesPieData: [{ x: '孚美油', y: Number(getCountBusinessOrderNumberGet.reportFourList[0].singularNumber) },
          { x: '宝马油', y: Number(getCountBusinessOrderNumberGet.reportFourList[1].singularNumber) },
          { x: '嘉实多油', y: Number(getCountBusinessOrderNumberGet.reportFourList[2].singularNumber) },
          { x: '通用油', y: Number(getCountBusinessOrderNumberGet.reportFourList[3].singularNumber) },
          { x: 'BYD油', y: Number(getCountBusinessOrderNumberGet.reportFourList[4].singularNumber) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[5].singularNumber) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportFourList[6].singularNumber) },
          { x: '方向机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[7].singularNumber) },
          { x: '发动机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[8].singularNumber) },
          { x: '变速箱总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[9].singularNumber) },
          { x: '方向机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[11].singularNumber) },
          { x: '发动机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[12].singularNumber) },
          { x: '变速箱总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[13].singularNumber) },
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'completeNumber') {
        this.setState({
          salesPieData: [{ x: '孚美油', y: Number(getCountBusinessOrderNumberGet.reportFourList[0].completeNnumber) },
          { x: '宝马油', y: Number(getCountBusinessOrderNumberGet.reportFourList[1].completeNnumber) },
          { x: '嘉实多油', y: Number(getCountBusinessOrderNumberGet.reportFourList[2].completeNnumber) },
          { x: '通用油', y: Number(getCountBusinessOrderNumberGet.reportFourList[3].completeNnumber) },
          { x: 'BYD油', y: Number(getCountBusinessOrderNumberGet.reportFourList[4].completeNnumber) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[5].completeNnumber) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportFourList[6].completeNnumber) },
          { x: '方向机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[7].completeNnumber) },
          { x: '发动机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[8].completeNnumber) },
          { x: '变速箱总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[9].completeNnumber) },
          { x: '方向机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[11].completeNnumber) },
          { x: '发动机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[12].completeNnumber) },
          { x: '变速箱总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[13].completeNnumber) },
          ]
        })
      } else if (isNotBlank(e.target.value) && e.target.value == 'undoneNumber') {
        this.setState({
          salesPieData: [{ x: '孚美油', y: Number(getCountBusinessOrderNumberGet.reportFourList[0].undoneNumber) },
          { x: '宝马油', y: Number(getCountBusinessOrderNumberGet.reportFourList[1].undoneNumber) },
          { x: '嘉实多油', y: Number(getCountBusinessOrderNumberGet.reportFourList[2].undoneNumber) },
          { x: '通用油', y: Number(getCountBusinessOrderNumberGet.reportFourList[3].undoneNumber) },
          { x: 'BYD油', y: Number(getCountBusinessOrderNumberGet.reportFourList[4].undoneNumber) },
          { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[5].undoneNumber) },
          { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportFourList[6].undoneNumber) },
          { x: '方向机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[7].undoneNumber) },
          { x: '发动机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[8].undoneNumber) },
          { x: '变速箱总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[9].undoneNumber) },
          { x: '方向机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[11].undoneNumber) },
          { x: '发动机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[12].undoneNumber) },
          { x: '变速箱总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[13].undoneNumber) },
          ]
        })
      }

    }
  }

  handleRangePickerChange = () => {

  }

  changeDay = (e) => {
    const { dispatch } = this.props
    this.setState({
      showtype: 1,
    })

    if (isNotBlank(e)) {
      this.setState({
        selDate: moment(e).format('YYYY-MM-DD'),
        nowdate: moment(e).format('YYYY-MM-DD'),
        selMonthDate: ''
      })
      dispatch({
        type: 'cpstatistics/get_CountBusinessOrderNumber',
        payload: {
          showType: 1,
          endTime: moment(e).format('YYYY-MM-DD'),
        },
        callback: (res) => {
          this.setState({
            salesPieData: [
              {
                x: '外部订单',
                y: Number(res.reportOneList[0].undoneNumber),
              },
              {
                x: '内部订单',
                y: Number(res.reportOneList[1].undoneNumber),
              },
              {
                x: '延保订单',
                y: Number(res.reportOneList[2].undoneNumber),
              },
            ]
          })
        }
      })

      dispatch({
        type: 'cpstatistics/find_StatisticsReportProgress',
        payload: {
          showType: 1,
          endTime: moment(e).format('YYYY-MM-DD'),
          pageSize: 10,
          current: 1
        },
      });


      if (moment(e).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
        this.setState({
          aClassName: 1
        })
      } else {
        this.setState({
          aClassName: 3
        })
      }
    } else {
      this.setState({
        selDate: ''
      })
    }
  }

  changeMonth = (e) => {
    const { dispatch } = this.props
    this.setState({
      showtype: 2
    })

    if (isNotBlank(e)) {
      this.setState({
        selMonthDate: moment(e).format('YYYY-MM'),
        nowdate: moment(e).format('YYYY-MM'),
        selDate: ''
      })
      dispatch({
        type: 'cpstatistics/get_CountBusinessOrderNumber',
        payload: {
          showType: 0,
          startTime: moment(e).format('YYYY-MM'),
        }, callback: (res) => {
          this.setState({
            salesPieData: [
              {
                x: '外部订单',
                y: Number(res.reportOneList[0].undoneNumber),
              },
              {
                x: '内部订单',
                y: Number(res.reportOneList[1].undoneNumber),
              },
              {
                x: '延保订单',
                y: Number(res.reportOneList[2].undoneNumber),
              },
            ]
          })
        }
      })

      dispatch({
        type: 'cpstatistics/find_StatisticsReportProgress',
        payload: {
          showType: 0,
          startTime: moment(e).format('YYYY-MM'),
          pageSize: 10,
          current: 1
        },
      });

      if (moment(e).format('YYYY-MM') == moment().format('YYYY-MM')) {
        this.setState({
          aClassName: 2
        })
      } else {
        this.setState({
          aClassName: 3
        })
      }
    } else {
      this.setState({
        selMonthDate: ''
      })
    }
  }

  selectnow = () => {
    const { dispatch } = this.props
    const nowdate = moment().format('YYYY-MM-DD')
    this.setState({
      nowdate,
      selDate: '',
      selMonthDate: '',
      aClassName: 1,
      showtype: 1
    })
    dispatch({
      type: 'cpstatistics/get_CountBusinessOrderNumber',
      payload: {
        showType: 1,
        endTime: nowdate,
      }, callback: (res) => {
        this.setState({
          salesPieData: [
            {
              x: '外部订单',
              y: Number(res.reportOneList[0].undoneNumber),
            },
            {
              x: '内部订单',
              y: Number(res.reportOneList[1].undoneNumber),
            },
            {
              x: '延保订单',
              y: Number(res.reportOneList[2].undoneNumber),
            },
          ]
        })
      }
    })

    dispatch({
      type: 'cpstatistics/find_StatisticsReportProgress',
      payload: {
        showType: 1,
        endTime: nowdate,
        pageSize: 10,
        current: 1
      },
    });


  }

  selectnowMonth = () => {
    const { dispatch } = this.props
    const nowdate = moment().format('YYYY-MM')
    this.setState({
      aClassName: 2,
      showtype: 2,
      nowdate,
      selDate: '',
      selMonthDate: '',
    })
    dispatch({
      type: 'cpstatistics/get_CountBusinessOrderNumber',
      payload: {
        showType: 0,
        startTime: nowdate,
      }, callback: (res) => {
        this.setState({
          salesPieData: [
            {
              x: '外部订单',
              y: Number(res.reportOneList[0].undoneNumber),
            },
            {
              x: '内部订单',
              y: Number(res.reportOneList[1].undoneNumber),
            },
            {
              x: '延保订单',
              y: Number(res.reportOneList[2].undoneNumber),
            },
          ]
        })
      }
    })

    dispatch({
      type: 'cpstatistics/find_StatisticsReportProgress',
      payload: {
        showType: 0,
        startTime: nowdate,
        pageSize: 10,
        current: 1
      },
    });

  }

  tbasclick = (e) => {
    const { getCountBusinessOrderNumberGet } = this.props

    this.setState({
      tabstitle: e,
      salesType: 'lastmonth'
    })

    if (isNotBlank(e) && e == 'sales1') {
      this.setState({
        salesPieData: [{ x: '外部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[0].undoneNumberTwo) },
        { x: '内部订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[1].undoneNumberTwo) },
        { x: '延保订单', y: Number(getCountBusinessOrderNumberGet.reportOneList[2].undoneNumberTwo) }
        ]
      })
    } else if (isNotBlank(e) && e == 'sales2') {
      this.setState({
        salesPieData: [{ x: '总成', y: Number(getCountBusinessOrderNumberGet.reportTwoList[0].undoneNumberTwo) },
        { x: '方向机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[1].undoneNumberTwo) },
        { x: '发动机', y: Number(getCountBusinessOrderNumberGet.reportTwoList[2].undoneNumberTwo) },
        { x: '油品(养护)', y: Number(getCountBusinessOrderNumberGet.reportTwoList[3].undoneNumberTwo) },
        { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportTwoList[4].undoneNumberTwo) },
        { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportTwoList[5].undoneNumberTwo) }
        ]
      })
    } else if (isNotBlank(e) && e == 'sales3') {
      this.setState({
        salesPieData: [{ x: '保险', y: Number(getCountBusinessOrderNumberGet.reportThreeList[0].undoneNumberTwo) },
        { x: '集团', y: Number(getCountBusinessOrderNumberGet.reportThreeList[1].undoneNumberTwo) },
        { x: '4s店', y: Number(getCountBusinessOrderNumberGet.reportThreeList[2].undoneNumberTwo) },
        { x: '高修', y: Number(getCountBusinessOrderNumberGet.reportThreeList[3].undoneNumberTwo) },
        { x: '电商', y: Number(getCountBusinessOrderNumberGet.reportThreeList[4].undoneNumberTwo) },
        { x: '终端', y: Number(getCountBusinessOrderNumberGet.reportThreeList[5].undoneNumberTwo) },
        { x: '新孚美', y: Number(getCountBusinessOrderNumberGet.reportThreeList[6].undoneNumberTwo) }
        ]
      })
    } else if (isNotBlank(e) && e == 'sales4') {
      this.setState({
        salesPieData: [{ x: '孚美油', y: Number(getCountBusinessOrderNumberGet.reportFourList[0].undoneNumberTwo) },
        { x: '宝马油', y: Number(getCountBusinessOrderNumberGet.reportFourList[1].undoneNumberTwo) },
        { x: '嘉实多油', y: Number(getCountBusinessOrderNumberGet.reportFourList[2].undoneNumberTwo) },
        { x: '通用油', y: Number(getCountBusinessOrderNumberGet.reportFourList[3].undoneNumberTwo) },
        { x: 'BYD油', y: Number(getCountBusinessOrderNumberGet.reportFourList[4].undoneNumberTwo) },
        { x: '配件销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[5].undoneNumberTwo) },
        { x: '延保', y: Number(getCountBusinessOrderNumberGet.reportFourList[6].undoneNumberTwo) },
        { x: '方向机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[7].undoneNumberTwo) },
        { x: '发动机总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[8].undoneNumberTwo) },
        { x: '变速箱总成维修', y: Number(getCountBusinessOrderNumberGet.reportFourList[9].undoneNumberTwo) },
        { x: '方向机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[11].undoneNumberTwo) },
        { x: '发动机总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[12].undoneNumberTwo) },
        { x: '变速箱总成销售', y: Number(getCountBusinessOrderNumberGet.reportFourList[13].undoneNumberTwo) },
        ]
      })
    }
  }

  render() {
    const { selectedRows, modalVisiblepass, selectkhflag, salesType, aClassName, salesPieData, showtype, nowdate, tabstitle, selDate, selMonthDate } = this.state;
    const { loading, cppjstatisticsList, getByBillList, dispatch, findGrossProfitMarginlist, getCountBusinessOrderNumberGet
      , getCountBusinessOrderNumberDayGet, findStatisticsReportProgresslist, submitting } = this.props;
    const columns = [
      {
        title: '施工天数',
        dataIndex: 'constructionNumber',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: text => {
          if (isNotBlank(text)) {
            return `${text}天`
          }
          return ''
        }
      },
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        inputType: 'text',
        align: 'center',
        width: 200,
        editable: true,
      },
      {
        title: '客户名称',
        dataIndex: 'cpClient.clientCpmpany',
        inputType: 'text',
        align: 'center',
        width: 240,
        editable: true,
      },
      {
        title: '客户经理',
        dataIndex: 'cpClient.name',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
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
      // {
      //   title: '业务渠道',
      //   dataIndex: 'dicth',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      {
        title: '业务分类',
        dataIndex: 'businessType',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '业务委托单',
        dataIndex: 'businessOrder',
        inputType: 'text',
        width: 100,
        align: 'center',
        colSpan: 2,
        editable: true,
        render: text => {
          if (isNotBlank(text)) {
            return '业务委托单'
          }
          return ''
        }
      },
      {
        title: '',
        dataIndex: 'businessOrder.finishDate',
        inputType: 'text',
        width: 150,
        align: 'center',
        colSpan: 0,
        editable: true,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '整车施工',
        dataIndex: 'carloadConstruction.mCrewName',
        inputType: 'text',
        width: 150,
        align: 'center',
        colSpan: 2,
        editable: true,
      },
      {
        title: '',
        dataIndex: 'carloadConstruction.finishDate',
        inputType: 'text',
        width: 150,
        align: 'center',
        colSpan: 0,
        editable: true,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '总成施工',
        dataIndex: 'atWorkForm.mCrewName',
        inputType: 'text',
        width: 150,
        align: 'center',
        colSpan: 2,
        editable: true,
      },
      {
        title: '',
        dataIndex: 'atWorkForm.finishDate',
        inputType: 'text',
        width: 150,
        align: 'center',
        colSpan: 0,
        editable: true,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '放行单',
        dataIndex: 'dischargedForm',
        inputType: 'text',
        width: 100,
        align: 'center',
        colSpan: 2,
        editable: true,
        render: text => {
          if (isNotBlank(text)) {
            return '放行单'
          }
          return ''
        }
      },
      {
        title: '',
        dataIndex: 'dischargedForm.finishDate',
        inputType: 'text',
        width: 150,
        align: 'center',
        colSpan: 0,
        editable: true,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      // {
      //   title: '结算类型',
      //   dataIndex: 'settlementType',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '保险公司',
      //   dataIndex: 'insuranceCompanyId',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '采集客户',
      //   dataIndex: 'collectClientId.name',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '采集编码',
      //   dataIndex: 'collectCode',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '品牌',
      //   dataIndex: 'brand',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '业务员',
      //   dataIndex: 'user.name',
      //   inputType: 'text',
      //   width: 150,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '进场类型',
      //   dataIndex: 'assemblyEnterType',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '业务项目',
      //   dataIndex: 'project',
      //   inputType: 'text',
      //   align: 'center',
      //   width: 100,
      //   editable: true,
      // },
      // {
      //   title: '总成型号',
      //   dataIndex: 'cpAssemblyBuild.assemblyModel',
      //   inputType: 'text',
      //   align: 'center',
      //   width: 100,
      //   editable: true,
      // },
      // {
      //  title: '总成号',        
      //  dataIndex: 'cpAssemblyBuild.assemblyCode',   
      //  inputType: 'text',
      //  align: 'center' ,    
      //  width: 100,          
      //  editable:  true  ,      
      // },
      // {
      //  title: '大号',        
      //  dataIndex: 'cpAssemblyBuild.maxCode',   
      //  inputType: 'text', 
      //  align: 'center' ,   
      //  width: 150,          
      //  editable:  true  ,      
      // },
      // {
      //  title: '小号',        
      //  dataIndex: 'cpAssemblyBuild.minCode',   
      //  inputType: 'text',
      //  align: 'center' ,    
      //  width: 150,          
      //  editable:  true  ,      
      // },
      // {
      //  title: '总成分类',        
      //  dataIndex: 'cpAssemblyBuild.assemblyType',   
      //  inputType: 'text',   
      //  align: 'center' , 
      //  width: 100,          
      //  editable:  true  ,      
      // },
      // {
      //  title: '车型',        
      //  dataIndex: 'cpAssemblyBuild.vehicleModel',   
      //  inputType: 'text',
      //  align: 'center' ,    
      //  width: 100,          
      //  editable:  true  ,      
      // },
      // {
      //   title: '车牌号',
      //   dataIndex: 'plateNumber',
      //   inputType: 'text',
      //   align: 'center',
      //   width: 100,
      //   editable: true,
      // },
      // {
      //   title: '维修项目',
      //   dataIndex: 'maintenanceProject',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '进场类型',
      //   dataIndex: 'assemblyEnterType',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //   title: '本次故障描述',
      //   dataIndex: 'assemblyErrorDescription',
      //   inputType: 'text',
      //   width: 100,
      //   align: 'center',
      //   editable: true,
      // },
      // {
      //  title: '品牌',        
      //  dataIndex: 'cpAssemblyBuild.assemblyBrand',   
      //  inputType: 'text', 
      //  align: 'center' ,   
      //  width: 100,          
      //  editable:  true  ,      
      // },
      // {
      //  title: '年份',        
      //  dataIndex: 'cpAssemblyBuild.assemblyYear',   
      //  inputType: 'text', 
      //  align: 'center' ,   
      //  width: 100,          
      //  editable:  true  ,      
      // },
      // {
      //  title: '再制造编码',        
      //  dataIndex: 'assmblyBuild.makeCode',   
      //  inputType: 'text', 
      //  align: 'center' ,   
      //  width: 150,          
      //  editable:  true  ,      
      // },
      // {
      //  title: '创建者',        
      //  dataIndex: 'createBy.name',   
      //  inputType: 'text',
      //  align: 'center' ,    
      //  width: 100,          
      //  editable:  false ,      
      // },
      // {
      //   title: '产值归属月份',
      //   dataIndex: 'cpCostForm.finishDate',
      //   editable: true,
      //   inputType: 'dateTime',
      //   width: 150,
      //   sorter: true,
      //   align: 'center',
      //   render: val => <span>{isNotBlank(val)?moment(val).month()+1:''}</span>,
      // },
      // {
      //   title: '结算金额',
      //   dataIndex: 'totalMoney',
      //   inputType: 'text',
      //   align: 'center',
      //   width: 100,
      //   editable: true,
      //   render: (text, res) => {
      //     if (isNotBlank(res.collectCode)) {
      //       return getPrice(getPrice(text))
      //     }
      //     return getPrice(text)
      //   }
      // },
      // {
      //   title: '成本金额',
      //   dataIndex: 'costMoney',
      //   inputType: 'text',
      //   width: 100,
      //   editable: true,
      //   render: text => (getPrice(text))
      // },
      // {
      //   title: '毛利',
      //   dataIndex: 'maoriForehead',
      //   inputType: 'text',
      //   align: 'center',
      //   width: 100,
      //   editable: true,
      //   render: text => (getPrice(text))
      // },
      // {
      //   title: '毛利率',
      //   dataIndex: 'grossProfitMargin',
      //   inputType: 'text',
      //   align: 'center',
      //   width: 100,
      //   editable: true,
      //   //  render:text=>(getPrice(text))
      // },
      // {
      //   title: '日期',
      //   dataIndex: 'finishDate',
      //   editable: false,
      //   align: 'center',
      //   inputType: 'dateTime',
      //   width: 150,
      //   sorter: true,
      //   render: (val) => {
      //     if (isNotBlank(val)) {
      //       return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      //     }
      //     return ''
      //   }
      // },
      // {
      //  title: '备注信息',        
      //  dataIndex: 'remarks',   
      //  inputType: 'text', 
      //  align: 'center' ,   
      //  width: 150,          
      //  editable:  true  ,      
      // },
      {
        title: '所属公司',
        dataIndex: 'officeName',
        inputType: 'text',
        width: 200,
        align: 'center',
        editable: true,
      }
    ];

    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }

    const parentMethodskh = {
      getByBillList,

      dispatch,
      handleModalVisiblekh: this.handleModalVisiblekh,
    }

    // let salesPieData;
    // if (salesType === 'all') {
    //   salesPieData = salesTypeData;
    // } else {
    //   salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    // }

    let columnstj = []

    const showtitle = () => {
      if (tabstitle == 'sales1') {
        return '订单分类'
      } else if (tabstitle == 'sales2') {
        return '项目分类'
      } else if (tabstitle == 'sales3') {
        return '业务渠道'
      } else if (tabstitle == 'sales4') {
        return '业务分类'
      }
    }

    if (isNotBlank(showtype) && showtype == 2) {
      columnstj = [
        {
          title: showtitle(),
          dataIndex: 'typeName',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '上月未完成',
          dataIndex: 'undoneNumberTwo',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '下单数',
          dataIndex: 'singularNumber',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '完成数',
          dataIndex: 'completeNnumber',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '本月未完成',
          dataIndex: 'undoneNumber',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        }
      ]
    } else if (isNotBlank(showtype) && showtype == 1) {
      columnstj = [
        {
          title: showtitle(),
          dataIndex: 'typeName',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '昨日未完成',
          dataIndex: 'undoneNumberTwo',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '下单数',
          dataIndex: 'singularNumber',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '完成数',
          dataIndex: 'completeNnumber',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        },
        {
          title: '本日未完成',
          dataIndex: 'undoneNumber',
          inputType: 'text',
          width: 100,
          align: 'center',
          editable: true,
        }
      ]
    }

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    // const salesPieData = [
    //   {
    //     x: '外部订单',
    //     y: 4544,
    //   },
    //   {
    //     x: '内部订单',
    //     y: 3321,
    //   },
    //   {
    //     x: '延保订单',
    //     y: 3113,
    //   },
    // ];
    // antd-pro-components-charts-pie-index-chart



    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };


    const topColResponsiveProps1 = {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 3,
      style: { marginBottom: 24 },
    };

    return (
      <PageHeaderWrapper>

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
                毛利润报表
                </div> */}
            </div>
            <StandardEditTable
              scroll={{ x: 1000 }}
              data={{
                list: isNotBlank(findStatisticsReportProgresslist) && isNotBlank(findStatisticsReportProgresslist.list) && findStatisticsReportProgresslist.list.length > 0 ? findStatisticsReportProgresslist.list : [],
                pagination: {
                  total: isNotBlank(findStatisticsReportProgresslist) && isNotBlank(findStatisticsReportProgresslist.total) ? findStatisticsReportProgresslist.total : 0,
                  current: isNotBlank(findStatisticsReportProgresslist) && isNotBlank(findStatisticsReportProgresslist.current) ? findStatisticsReportProgresslist.current : 1,
                  pageSize: isNotBlank(findStatisticsReportProgresslist) && isNotBlank(findStatisticsReportProgresslist.pageSize) ? findStatisticsReportProgresslist.pageSize : 10
                }
              }}
              loading={submitting}
              // data={findStatisticsReportProgresslist}
              bordered
              columns={columns}
              onSaveData={this.onSaveData}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>


        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div style={{ textAlign: 'right', margin: '10px 25px 10px 0' }}>
            <a className={aClassName == 1 ? styles.aClick : ''} style={{ color: 'rgba(0,0,0,.65)', marginRight: '10px' }} onClick={this.selectnow}>今日</a>
            <DatePicker onChange={val => this.changeDay(val)} value={isNotBlank(selDate) ? moment(selDate) : ''} format="YYYY-MM-DD" />
            <a className={aClassName == 2 ? styles.aClick : ''} style={{ color: 'rgba(0,0,0,.65)', margin: '0 10px' }} onClick={this.selectnowMonth}>本月</a>
            <MonthPicker onChange={this.changeMonth} value={isNotBlank(selMonthDate) ? moment(selMonthDate) : ''} format="YYYY-MM" picker="month" placeholder='请选择月份' />
          </div>
          <Suspense fallback={<PageLoading />}>
            {/* <IntroduceRow loading={loading} visitData={[]} />
             */}
            <Row gutter={24} style={{ marginRight: '0', marginLeft: '0' }}>
              {/* <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title='总订单数'
                loading={loading}
                    total={() => <span>{getCountBusinessOrderNumberGet.totalOrderNumber}</span>}
                contentHeight={46}
              >

              </ChartCard>
            </Col> */}

              <Col {...topColResponsiveProps}>
                <ChartCard
                  bordered={false}
                  loading={loading}
                  // title={<FormattedMessage id="app.analysis.visits" defaultMessage="Visits" />}
                  title='下单数'
                  // action={
                  //   <Tooltip
                  //     title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
                  //   >
                  //     <Icon type="info-circle-o" />
                  //   </Tooltip>
                  // }
                  total={numeral(getCountBusinessOrderNumberGet.totalMonthNumber).format('0,0')}
                  // footer={
                  //   <Field
                  //     label={<FormattedMessage id="app.analysis.day-visits" defaultMessage="Daily Visits" />}
                  //     value={numeral(1234).format('0,0')}
                  //   />
                  // }
                  contentHeight={46}
                >
                  {/* <MiniArea color="#975FE4" data={visitData} /> */}
                </ChartCard>
              </Col>
              <Col {...topColResponsiveProps}>
                <ChartCard
                  bordered={false}
                  loading={loading}
                  // title={<FormattedMessage id="app.analysis.payments" defaultMessage="Payments" />}
                  title='完成数'
                  // action={
                  //   <Tooltip
                  //     title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
                  //   >
                  //     <Icon type="info-circle-o" />
                  //   </Tooltip>
                  // }
                  total={numeral(getCountBusinessOrderNumberGet.totalCompleteNumber).format('0,0')}
                  // footer={
                  //   <Field
                  //     label={
                  //       <FormattedMessage
                  //         id="app.analysis.conversion-rate"
                  //         defaultMessage="Conversion Rate"
                  //       />
                  //     }
                  //     value="60%"
                  //   />
                  // }
                  contentHeight={46}
                >
                  {/* <MiniBar data={visitData} /> */}
                </ChartCard>
              </Col>
              <Col {...topColResponsiveProps}>
                <ChartCard
                  loading={loading}
                  bordered={false}
                  title={isNotBlank(showtype) && showtype == 2 ? '本月未完成' : '今日未完成'}
                  total={getCountBusinessOrderNumberGet.totalUndoneNumber}
                  contentHeight={46}
                >
                  {/* <MiniProgress
                  percent={78}
                  strokeWidth={8}
                  target={80}
                  targetLabel={`${formatMessage({ id: 'component.miniProgress.tooltipDefault' }).concat(
                    ': '
                  )}80%`}
                  color="#13C2C2"
                /> */}
                </ChartCard>
              </Col>
              <Col {...topColResponsiveProps}>
                <ChartCard
                  loading={loading}
                  bordered={false}
                  title={isNotBlank(showtype) && showtype == 2 ? '上月未完成' : '昨日未完成'}
                  // title='上月未完成'
                  // action={
                  //   <Tooltip
                  //     title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
                  //   >
                  //     <Icon type="info-circle-o" />
                  //   </Tooltip>
                  // }
                  total={getCountBusinessOrderNumberGet.totalUndoneNumberTwo}
                  // footer={
                  //   <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  //     <Trend flag="up" style={{ marginRight: 16 }}>
                  //       <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
                  //       <span className={styles.trendText}>12%</span>
                  //     </Trend>
                  //     <Trend flag="down">
                  //       <FormattedMessage id="app.analysis.day" defaultMessage="Weekly Changes" />
                  //       <span className={styles.trendText}>11%</span>
                  //     </Trend>
                  //   </div>
                  // }
                  contentHeight={46}
                >
                  {/* <MiniProgress
                  percent={78}
                  strokeWidth={8}
                  target={80}
                  targetLabel={`${formatMessage({ id: 'component.miniProgress.tooltipDefault' }).concat(
                    ': '
                  )}80%`}
                  color="#13C2C2"
                /> */}
                </ChartCard>
              </Col>
            </Row>
          </Suspense>
        </Card>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs
              onTabClick={this.tbasclick}
              //  onChange={this.tbasclick}
              // tabBarExtraContent={
              //   <div className={styles.salesExtraWrap}>
              //     <div className={styles.salesExtra}>
              //       <a className={isActive('today')} onClick={() => selectDate('today')}>
              //         <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
              //       </a>
              //       <a className={isActive('week')} onClick={() => selectDate('week')}>
              //         <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
              //       </a>
              //       <a className={isActive('month')} onClick={() => selectDate('month')}>
              //         <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
              //       </a>
              //       <a className={isActive('year')} onClick={() => selectDate('year')}>
              //         <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
              //       </a>
              //     </div>
              //     <RangePicker
              //       value={rangePickerValue}
              //       onChange={handleRangePickerChange}
              //       style={{ width: 256 }}
              //     />
              //   </div>
              // }
              size="large"
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane
                // tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                onTabClick={() => this.tbasclick}
                tab='订单分类统计'
                key="sales1"
              >
                <div className={styles.twoColLayout}>
                  <Row gutter={24} type="flex">
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                      {/* <StandardEditTable
                      scroll={{ x: 600 }}
                      loading={loading}
                      data={findGrossProfitMarginlist}
                      bordered
                      columns={columnstj}
                      onChange={this.handleStandardTableChange}
                    /> */}
                      <DragTable
                        scroll={{ x: 600 }}
                        loading={loading}
                        style={{ marginTop: '10px' }}
                        // data={findGrossProfitMarginlist}
                        dataSource={getCountBusinessOrderNumberGet.reportOneList}
                        pagination={false}
                        bordered
                        columns={columnstj}
                      // onChange={this.handleStandardTableChange}
                      />
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className='suspenseName'>
                      <Suspense fallback={null} >
                        <Card
                          loading={loading}
                          className={styles.salesCard}
                          bordered
                          title='订单分类统计'
                          // title={
                          //   <FormattedMessage
                          //     id="app.analysis.the-proportion-of-sales"
                          //     defaultMessage="The Proportion of Sales"
                          //   />
                          // }
                          bodyStyle={{ padding: 24 }}
                          extra={
                            <div className={styles.salesCardExtra}>
                              {/* {dropdownGroup} */}
                              <div className={styles.salesTypeRadio}>
                                <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                  <Radio.Button value="lastmonth">
                                    {isNotBlank(showtype) && showtype == 2 ? '上月未完成' : '昨日未完成'}
                                    {/* <FormattedMessage id="app.analysis.channel.all" defaultMessage="ALL" /> */}
                                  </Radio.Button>
                                  <Radio.Button value="PlaceOrder">
                                    下单数
                                   {/* <FormattedMessage id="app.analysis.channel.online" defaultMessage="Online" /> */}
                                  </Radio.Button>
                                  <Radio.Button value="completeNumber">
                                    完成数
                                   {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                  </Radio.Button>
                                  <Radio.Button value="undoneNumber">
                                    {isNotBlank(showtype) && showtype == 2 ? '本月未完成' : '本日未完成'}
                                    {/* 本月未完成 */}
                                    {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                  </Radio.Button>
                                </Radio.Group>
                              </div>
                            </div>
                          }
                          style={{ marginTop: 24 }}
                        >
                          {/* <h4 style={{ marginTop: 10, marginBottom: 32 }}>
                          销售额
                          {/* <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" /> 
                        </h4>*/}
                          <Pie
                            hasLegend
                            // subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                            subTitle='总计'
                            // total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                            total={() => <div>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</div>}
                            data={salesPieData}
                            // valueFormat={value => <Yuan>{value}</Yuan>}
                            valueFormat={value => <div>{value}</div>}
                            height={270}
                            lineWidth={4}
                            style={{ padding: '8px 0' }}
                          />
                        </Card>
                      </Suspense>
                    </Col>
                  </Row>
                </div>
              </TabPane>
              <TabPane
                // tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                tab='项目分类统计'
                key="sales2"
              >
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    {/* <StandardEditTable
                      scroll={{ x: 600 }}
                      loading={loading}
                      data={findGrossProfitMarginlist}
                      bordered
                      columns={columnstj}
                      onChange={this.handleStandardTableChange}
                    /> */}
                    <DragTable
                      scroll={{ x: 600 }}
                      loading={loading}
                      style={{ marginTop: '10px' }}
                      // data={findGrossProfitMarginlist}
                      dataSource={getCountBusinessOrderNumberGet.reportTwoList}
                      pagination={false}
                      bordered
                      columns={columnstj}
                    // onChange={this.handleStandardTableChange}
                    />
                  </Col>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24} className='suspenseName'>
                    <Suspense fallback={null} >
                      <Card
                        loading={loading}
                        className={styles.salesCard}
                        bordered
                        title='项目分类统计'
                        // title={
                        //   <FormattedMessage
                        //     id="app.analysis.the-proportion-of-sales"
                        //     defaultMessage="The Proportion of Sales"
                        //   />
                        // }
                        bodyStyle={{ padding: 24 }}
                        extra={
                          <div className={styles.salesCardExtra}>
                            {/* {dropdownGroup} */}
                            <div className={styles.salesTypeRadio}>
                              <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                <Radio.Button value="lastmonth">
                                  {isNotBlank(showtype) && showtype == 2 ? '上月未完成' : '昨日未完成'}
                                  {/* <FormattedMessage id="app.analysis.channel.all" defaultMessage="ALL" /> */}
                                </Radio.Button>
                                <Radio.Button value="PlaceOrder">
                                  下单数
                {/* <FormattedMessage id="app.analysis.channel.online" defaultMessage="Online" /> */}
                                </Radio.Button>
                                <Radio.Button value="completeNumber">
                                  完成数
                {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                </Radio.Button>
                                <Radio.Button value="undoneNumber">
                                  {isNotBlank(showtype) && showtype == 2 ? '本月未完成' : '本日未完成'}
                                  {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                </Radio.Button>
                              </Radio.Group>
                            </div>
                          </div>
                        }
                        style={{ marginTop: 24 }}
                      >
                        {/* <h4 style={{ marginTop: 10, marginBottom: 32 }}>
                          <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
                        </h4> */}
                        <Pie
                          hasLegend
                          // subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                          subTitle='总计'
                          // total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                          total={() => <div>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</div>}
                          data={salesPieData}
                          // valueFormat={value => <Yuan>{value}</Yuan>}
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
              <TabPane
                // tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                tab='业务渠道统计'
                key="sales3"
              >
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    {/* <StandardEditTable
                      scroll={{ x: 600 }}
                      loading={loading}
                      data={findGrossProfitMarginlist}
                      bordered
                      columns={columnstj}
                      onChange={this.handleStandardTableChange}
                    /> */}
                    <DragTable
                      scroll={{ x: 600 }}
                      loading={loading}
                      style={{ marginTop: '10px' }}
                      // data={findGrossProfitMarginlist}
                      dataSource={getCountBusinessOrderNumberGet.reportThreeList}
                      pagination={false}
                      bordered
                      columns={columnstj}
                    // onChange={this.handleStandardTableChange}
                    />
                  </Col>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24} className='suspenseName'>
                    <Suspense fallback={null} >
                      <Card
                        loading={loading}
                        className={styles.salesCard}
                        bordered
                        title='业务渠道统计'
                        // title={
                        //   <FormattedMessage
                        //     id="app.analysis.the-proportion-of-sales"
                        //     defaultMessage="The Proportion of Sales"
                        //   />
                        // }
                        bodyStyle={{ padding: 24 }}
                        extra={
                          <div className={styles.salesCardExtra}>
                            {/* {dropdownGroup} */}
                            <div className={styles.salesTypeRadio}>
                              <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                <Radio.Button value="lastmonth">
                                  {isNotBlank(showtype) && showtype == 2 ? '上月未完成' : '昨日未完成'}
                                  {/* <FormattedMessage id="app.analysis.channel.all" defaultMessage="ALL" /> */}
                                </Radio.Button>
                                <Radio.Button value="PlaceOrder">
                                  下单数
                                 {/* <FormattedMessage id="app.analysis.channel.online" defaultMessage="Online" /> */}
                                </Radio.Button>
                                <Radio.Button value="completeNumber">
                                  完成数
                                 {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                </Radio.Button>
                                <Radio.Button value="undoneNumber">
                                  {isNotBlank(showtype) && showtype == 2 ? '本月未完成' : '本日未完成'}
                                  {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                </Radio.Button>
                              </Radio.Group>
                            </div>
                          </div>
                        }
                        style={{ marginTop: 24 }}
                      >
                        {/* <h4 style={{ marginTop: 10, marginBottom: 32 }}>
                          <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
                        </h4> */}
                        <Pie
                          hasLegend
                          // subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                          subTitle='总计'
                          // total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                          total={() => <div>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</div>}
                          data={salesPieData}
                          // valueFormat={value => <Yuan>{value}</Yuan>}
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
              <TabPane
                // tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                tab='业务分类统计'
                key="sales4"
              >
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    {/* <StandardEditTable
                      scroll={{ x: 600 }}
                      loading={loading}
                      data={findGrossProfitMarginlist}
                      bordered
                      columns={columnstj}
                      onChange={this.handleStandardTableChange}
                    /> */}
                    <DragTable
                      scroll={{ x: 600 }}
                      loading={loading}
                      style={{ marginTop: '10px' }}
                      // data={findGrossProfitMarginlist}
                      dataSource={getCountBusinessOrderNumberGet.reportFourList}
                      pagination={false}
                      bordered
                      columns={columnstj}
                    // onChange={this.handleStandardTableChange}
                    />
                  </Col>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24} className='suspenseName'>
                    <Suspense fallback={null}>
                      <Card
                        loading={loading}
                        className='salesCardfl'
                        bordered
                        title='业务分类统计'
                        // title={
                        //   <FormattedMessage
                        //     id="app.analysis.the-proportion-of-sales"
                        //     defaultMessage="The Proportion of Sales"
                        //   />
                        // }
                        bodyStyle={{ padding: 24 }}
                        extra={
                          <div className={styles.salesCardExtra}>
                            {/* {dropdownGroup} */}
                            <div className={styles.salesTypeRadio}>
                              <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                <Radio.Button value="lastmonth">
                                  {isNotBlank(showtype) && showtype == 2 ? '上月未完成' : '昨日未完成'}
                                  {/* <FormattedMessage id="app.analysis.channel.all" defaultMessage="ALL" /> */}
                                </Radio.Button>
                                <Radio.Button value="PlaceOrder">
                                  下单数
                                  {/* <FormattedMessage id="app.analysis.channel.online" defaultMessage="Online" /> */}
                                </Radio.Button>
                                <Radio.Button value="completeNumber">
                                  完成数
                                {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                </Radio.Button>
                                <Radio.Button value="undoneNumber">
                                  {isNotBlank(showtype) && showtype == 2 ? '本月未完成' : '本日未完成'}
                                  {/* <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" /> */}
                                </Radio.Button>
                              </Radio.Group>
                            </div>
                          </div>
                        }
                        style={{ marginTop: 24 }}
                      >
                        {/* <h4 style={{ marginTop: 10, marginBottom: 32 }}>
                          <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
                        </h4> */}
                        <Pie
                          hasLegend
                          // subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                          subTitle='总计'
                          // total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                          total={() => <div>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</div>}
                          data={salesPieData}
                          // valueFormat={value => <Yuan>{value}</Yuan>}
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

        {/* <div className={styles.twoColLayout}>
          <Row gutter={24} type="flex">
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  visitData2={[]}
                  selectDate={this.selectDate}
                  searchData={[]}
                  dropdownGroup={dropdownGroup}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={[]}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
        </div> */}
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
                毛利润报表
                </div>

              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
            
                loading={loading}
                data={findGrossProfitMarginlist}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} /> */}
      </PageHeaderWrapper>
    );
  }

}
export default CpCloseList;
/**
 * 配件出入库统计分析
 */
import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import {
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
} from 'antd';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, proccessObject , getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import moment from 'moment';
import styles from './CpCloseList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { MonthPicker } = DatePicker;

@connect(({ cpstatistics, loading, sysusercom }) => ({
  ...cpstatistics,
  ...sysusercom,
  loading: loading.effects['cpstatistics/find_AccessoriesInAndOutAnalyze'],
}))
@Form.create()
class AccessoriesInAndOutAnalyze extends PureComponent {
  state = {
    expandForm: false,
    startDate: '',
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'sysusercom/get_UserOfficeList',
    });
    const nowdate = moment();
    this.setState({  startDate: nowdate.startOf('month').format('YYYY-MM-DD') })
    dispatch({
      type: 'cpstatistics/find_AccessoriesInAndOutAnalyze',
      payload: {
        pageSize: 10,
        current: 1,
        startDate: nowdate.startOf('month').format('YYYY-MM-DD')
      },
    });
  }


  handleUpldExportClick = type => {
    const { startDate, formValues } = this.state;

    let params = {};
    if (JSON.stringify(formValues) !== '{}') {
      params = {
        ...formValues,
        'user.id': getStorage('userid'),
      };
    } else {
      params = {
        startDate,
        'user.id': getStorage('userid'),
      };
    }
    window.open(`/api/Beauty/beauty/statisticsReport/exportAccessoriesInAndOutAnalyze?${stringify(params)}`)
  };


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, startDate } = this.state;

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
        startDate,
        ...filters,
      };
    }

    dispatch({
      type: 'cpstatistics/find_AccessoriesInAndOutAnalyze',
      payload: params,
    });
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
    const { startDate } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {
        ...fieldsValue,
      };

      Object.keys(values).map(item => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD');
        }
        return item;
      });

      values = proccessObject(values)
      this.setState({ formValues: values });

      dispatch({
        type: 'cpstatistics/find_AccessoriesInAndOutAnalyze',
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
    const { startDate } = this.state;
    form.resetFields();
    this.setState({ formValues: {} });
    dispatch({
      type: 'cpstatistics/find_AccessoriesInAndOutAnalyze',
      payload: {
        pageSize: 10,
        current: 1,
        startDate,
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
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: '',
              })(<Input placeholder="请输入物料编码" />)}
            </FormItem>
          </Col>
          <Col {...formItemLayout}>
            <FormItem label="物料名称">
              {getFieldDecorator('searchName', {
                initialValue: '',
              })(
                <Input placeholder="请输入物料名称" />
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
              {getFieldDecorator('startDate', { initialValue: moment().startOf('month') })(
                <MonthPicker format="YYYY-MM" picker="month" placeholder="请选择月份" />
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
    const { loading, findAccessoriesInAndOutAnalyzeData } = this.props;
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'cpBillMaterial.billCode',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '物料名称',
        dataIndex: 'cpBillMaterial.name',
        inputType: 'text',
        width: 100,
        align: 'center',
      },
      {
        title: '本月',
        width: 100,
        children: [
          {
            title: '入库数量',
            dataIndex: 'inNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },

          {
            title: '入库金额',
            dataIndex: 'inMoney',
            inputType: 'text',
            width: 100,
            align: 'center',
            render:text=>{
              return getPrice(text)
            }
          },
          {
            title: '入库平均单价',
            dataIndex: 'avgInPrice',
            inputType: 'text',
            width: 100,
            align: 'center',
            render:text=>{
              return getPrice(text)
            }
          },
          {
            title: '出库数量',
            dataIndex: 'outNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
          {
            title: '出库金额',
            dataIndex: 'outMoney',
            inputType: 'text',
            width: 100,
            align: 'center',
            render:text=>{
              return getPrice(text)
            }
          },
          {
            title: '出库平均单价',
            dataIndex: 'avgOutPrice',
            inputType: 'text',
            width: 100,
            align: 'center',
            render:text=>{
              return getPrice(text)
            }
          },
        ]
      },

      {
        title: '连续三个月数据分析',
        width: 100,
        children: [
          {
            title: '入库数量',
            dataIndex: 'threeInNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
          {
            title: '出库数量',
            dataIndex: 'threeOutNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
          {
            title: '建议储备数量',
            dataIndex: 'threeReserveAmount',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
        ]
      },

      {
        title: '连续六个月数据分析',
        width: 100,
        children: [
          {
            title: '入库数量',
            dataIndex: 'sixInNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
          {
            title: '出库数量',
            dataIndex: 'sixOutNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
          {
            title: '建议储备数量',
            dataIndex: 'sixReserveAmount',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
        ]
      },

      {
        title: '连续一年数据分析',
        width: 100,
        children: [
          {
            title: '入库数量',
            dataIndex: 'yearInNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
          {
            title: '出库数量',
            dataIndex: 'yearOutNumber',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
          {
            title: '建议储备数量',
            dataIndex: 'yearReserveAmount',
            inputType: 'text',
            width: 100,
            align: 'center',
          },
        ]
      },
    ];
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
                  配件出入库统计分析
                </div>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={findAccessoriesInAndOutAnalyzeData}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default AccessoriesInAndOutAnalyze;

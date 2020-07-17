// 公司业务员产值占比
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
  Modal,
} from 'antd';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { isNotBlank, getFullUrl, getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import moment from 'moment';
import styles from './CpCloseList.less';

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ cpstatistics, loading, syslevel }) => ({
  ...cpstatistics,
  ...syslevel,
  loading: loading.models.cpstatistics,
}))
@Form.create()
class CompanySalesmanMakeUpFrom extends PureComponent {
  state = {
    expandFormOne: false,
    expandFormTwo: false,
    expandFormThree: false,
    expandFormFour: false,
    formValues: {},

    userNameOne: '',
    ooTypeOne: 1,
    officeIdOne: '',
    monthOne: moment().format('YYYY-MM'),

    userNameTwo: '',
    ooTypeTwo: 1,
    officeIdTwo: '',
    monthTwo: moment().format('YYYY-MM'),

    userNameThree: '',
    ooTypeThree: 1,
    officeIdThree: '',
    monthThree: moment().format('YYYY-MM'),

    userNameFour: '',
    ooTypeFour: 1,
    officeIdFour: '',
    monthFour: moment().format('YYYY-MM'),
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
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphOne',
      payload: {
        switchType: 1,
        ooType: 1,
        pageSize: 10,
        current: 1,
        startTime: moment().format('YYYY-MM'),
      },
    });
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphTwo',
      payload: {
        switchType: 2,
        ooType: 1,
        pageSize: 10,
        current: 1,
        startTime: moment().format('YYYY-MM'),
      },
    });
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphThree',
      payload: {
        switchType: 3,
        ooType: 1,
        pageSize: 10,
        current: 1,
        startTime: moment().format('YYYY-MM'),
      },
    });
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphFour',
      payload: {
        switchType: 4,
        ooType: 1,
        pageSize: 10,
        current: 1,
        startTime: moment().format('YYYY-MM'),
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpstatistics/clear',
    });
  }

  renderForm = type => {
    if (isNotBlank(type) && (type === '1' || type === 1)) {
      const { expandFormOne } = this.state;
      return expandFormOne ? this.renderAdvancedForm(type) : this.renderSimpleForm(type);
    }
    if (isNotBlank(type) && (type === '2' || type === 2)) {
      const { expandFormTwo } = this.state;
      return expandFormTwo ? this.renderAdvancedForm(type) : this.renderSimpleForm(type);
    }
    if (isNotBlank(type) && (type === '3' || type === 3)) {
      const { expandFormThree } = this.state;
      return expandFormThree ? this.renderAdvancedForm(type) : this.renderSimpleForm(type);
    }
    if (isNotBlank(type) && (type === '4' || type === 4)) {
      const { expandFormFour } = this.state;
      return expandFormFour ? this.renderAdvancedForm(type) : this.renderSimpleForm(type);
    }
  };

  renderAdvancedForm = type => {
    const {
      form: { getFieldDecorator },
      levellist2,
    } = this.props;
    return (
      <Form onSubmit={e => this.handleSearch(e, type)} layout="inline">
        {isNotBlank(type) && (type === '1' || type === 1) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameOne', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeOne', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">外部</Option>
                    <Option value="2">内部</Option>
                    <Option value="3">延保</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <Form.Item label="月份">
                {getFieldDecorator('monthOne', { initialValue: '' })(
                  <MonthPicker format="YYYY-MM" picker="month" placeholder="请选择月份" />
                )}
              </Form.Item>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="所属分公司">
                {getFieldDecorator('officeIdOne', {
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
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
        {isNotBlank(type) && (type === '2' || type === 2) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameTwo', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeTwo', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">方向机</Option>
                    <Option value="2">变速箱</Option>
                    <Option value="3">油品（养护）</Option>
                    <Option value="4">配件</Option>
                    <Option value="5">发动机</Option>
                    <Option value="6">延保</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <Form.Item label="月份">
                {getFieldDecorator('monthTwo', { initialValue: '' })(
                  <MonthPicker format="YYYY-MM" picker="month" placeholder="请选择月份" />
                )}
              </Form.Item>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="所属分公司">
                {getFieldDecorator('officeIdTwo', {
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
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
        {isNotBlank(type) && (type === '3' || type === 3) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameThree', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeThree', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">保险</Option>
                    <Option value="2">集团</Option>
                    <Option value="3">4S</Option>
                    <Option value="4">高修</Option>
                    <Option value="5">电商</Option>
                    <Option value="6">终端</Option>
                    <Option value="7">新孚美</Option>
                    <Option value="8">其他</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <Form.Item label="月份">
                {getFieldDecorator('monthThree', { initialValue: '' })(
                  <MonthPicker format="YYYY-MM" picker="month" placeholder="请选择月份" />
                )}
              </Form.Item>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="所属分公司">
                {getFieldDecorator('officeIdThree', {
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
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
        {isNotBlank(type) && (type === '4' || type === 4) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameFour', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeFour', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">方向机维修</Option>
                    <Option value="2">发动机维修</Option>
                    <Option value="3">变速箱维修</Option>
                    <Option value="4">方向机销售</Option>
                    <Option value="5">发动机销售</Option>
                    <Option value="6">变速箱销售</Option>
                    <Option value="7">孚美油</Option>
                    <Option value="8">宝马油</Option>
                    <Option value="9">嘉实多油</Option>
                    <Option value="10">通用油</Option>
                    <Option value="11">BYD油</Option>
                    <Option value="12">配件销售</Option>
                    <Option value="13">其他</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <Form.Item label="月份">
                {getFieldDecorator('monthFour', { initialValue: '' })(
                  <MonthPicker format="YYYY-MM" picker="month" placeholder="请选择月份" />
                )}
              </Form.Item>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="所属分公司">
                {getFieldDecorator('officeIdFour', {
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
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
      </Form>
    );
  };

  renderSimpleForm = type => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={e => this.handleSearch(e, type)} layout="inline">
        {isNotBlank(type) && (type === '1' || type === 1) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameOne', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeOne', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">外部</Option>
                    <Option value="2">内部</Option>
                    <Option value="3">延保</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
        {isNotBlank(type) && (type === '2' || type === 2) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameTwo', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeTwo', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">方向机</Option>
                    <Option value="2">变速箱</Option>
                    <Option value="3">油品（养护）</Option>
                    <Option value="4">配件</Option>
                    <Option value="5">发动机</Option>
                    <Option value="6">延保</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
        {isNotBlank(type) && (type === '3' || type === 3) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameThree', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeThree', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">保险</Option>
                    <Option value="2">集团</Option>
                    <Option value="3">4S</Option>
                    <Option value="4">高修</Option>
                    <Option value="5">电商</Option>
                    <Option value="6">终端</Option>
                    <Option value="7">新孚美</Option>
                    <Option value="8">其他</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
        {isNotBlank(type) && (type === '4' || type === 4) ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="业务员">
                {getFieldDecorator('userNameFour', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('ooTypeFour', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value="1">方向机维修</Option>
                    <Option value="2">发动机维修</Option>
                    <Option value="3">变速箱维修</Option>
                    <Option value="4">方向机销售</Option>
                    <Option value="5">发动机销售</Option>
                    <Option value="6">变速箱销售</Option>
                    <Option value="7">孚美油</Option>
                    <Option value="8">宝马油</Option>
                    <Option value="9">嘉实多油</Option>
                    <Option value="10">通用油</Option>
                    <Option value="11">BYD油</Option>
                    <Option value="12">配件销售</Option>
                    <Option value="13">其他</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(type)}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.toggleForm(type)}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
        ) : null}
      </Form>
    );
  };

  handleSearch = (e, type) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { expandFormOne, expandFormTwo, expandFormThree, expandFormFour } = this.state;
    form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      const {
        userNameOne,
        ooTypeOne,
        userNameTwo,
        ooTypeTwo,
        userNameThree,
        ooTypeThree,
        userNameFour,
        ooTypeFour,
      } = fieldsValue;

      let officeIdOne = '';
      let officeIdTwo = '';
      let officeIdThree = '';
      let officeIdFour = '';
      let monthOne = moment().format('YYYY-MM');
      let monthTwo = moment().format('YYYY-MM');
      let monthThree = moment().format('YYYY-MM');
      let monthFour = moment().format('YYYY-MM');
      if (expandFormOne || expandFormTwo || expandFormThree || expandFormFour) {
        officeIdOne = fieldsValue.officeIdOne;
        officeIdTwo = fieldsValue.officeIdTwo;
        officeIdThree = fieldsValue.officeIdThree;
        officeIdFour = fieldsValue.officeIdFour;
        monthOne = moment(fieldsValue.monthOne).format('YYYY-MM');
        monthTwo = moment(fieldsValue.monthTwo).format('YYYY-MM');
        monthThree = moment(fieldsValue.monthThree).format('YYYY-MM');
        monthFour = moment(fieldsValue.monthFour).format('YYYY-MM');
      }
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      if (isNotBlank(type) && (type === '1' || type === 1)) {
        this.setState({
          userNameOne: userNameOne,
          ooTypeOne: ooTypeOne,
          officeIdOne: officeIdOne,
          monthOne: monthOne,
        });
        dispatch({
          type: 'cpstatistics/find_SalesmanProductionValueGraphOne',
          payload: {
            userName: userNameOne,
            switchType: type,
            ooType: ooTypeOne,
            officeId: officeIdOne,
            startTime: monthOne,
            pageSize: 10,
            current: 1,
          },
        });
      }
      if (isNotBlank(type) && (type === '2' || type === 2)) {
        this.setState({
          userNameTwo: userNameTwo,
          ooTypeTwo: ooTypeTwo,
          officeIdTwo: officeIdTwo,
          monthTwo: monthTwo,
        });
        dispatch({
          type: 'cpstatistics/find_SalesmanProductionValueGraphTwo',
          payload: {
            userName: userNameTwo,
            switchType: type,
            ooType: ooTypeTwo,
            officeId: officeIdTwo,
            startTime: monthTwo,
            pageSize: 10,
            current: 1,
          },
        });
      }
      if (isNotBlank(type) && (type === '3' || type === 3)) {
        this.setState({
          userNameThree: userNameThree,
          ooTypeThree: ooTypeThree,
          officeIdThree: officeIdThree,
          monthThree: monthThree,
        });
        dispatch({
          type: 'cpstatistics/find_SalesmanProductionValueGraphThree',
          payload: {
            userName: userNameThree,
            switchType: type,
            ooType: ooTypeThree,
            officeId: officeIdThree,
            startTime: monthThree,
            pageSize: 10,
            current: 1,
          },
        });
      }
      if (isNotBlank(type) && (type === '4' || type === 4)) {
        this.setState({
          userNameFour: userNameFour,
          ooTypeFour: ooTypeFour,
          officeIdFour: officeIdFour,
          monthFour: monthFour,
        });
        dispatch({
          type: 'cpstatistics/find_SalesmanProductionValueGraphFour',
          payload: {
            userName: userNameFour,
            switchType: type,
            ooType: ooTypeFour,
            officeId: officeIdFour,
            startTime: monthFour,
            pageSize: 10,
            current: 1,
          },
        });
      }
    });
  };

  handleFormReset = type => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    if (isNotBlank(type) && (type === '1' || type === 1)) {
      this.setState({
        userNameOne: '',
        ooTypeOne: '',
        officeIdOne: '',
        monthOne: moment().format('YYYY-MM'),
      });
      dispatch({
        type: 'cpstatistics/find_SalesmanProductionValueGraphOne',
        payload: {
          switchType: type,
          ooType: 1,
          startTime: moment().format('YYYY-MM'),
          pageSize: 10,
          current: 1,
        },
      });
    }
    if (isNotBlank(type) && (type === '2' || type === 2)) {
      this.setState({
        userNameTwo: '',
        ooTypeTwo: '',
        officeIdTwo: '',
        monthTwo: moment().format('YYYY-MM'),
      });
      dispatch({
        type: 'cpstatistics/find_SalesmanProductionValueGraphTwo',
        payload: {
          switchType: type,
          ooType: 1,
          startTime: moment().format('YYYY-MM'),
          pageSize: 10,
          current: 1,
        },
      });
    }
    if (isNotBlank(type) && (type === '3' || type === 3)) {
      this.setState({
        userNameThree: '',
        ooTypeThree: '',
        officeIdThree: '',
        monthThree: moment().format('YYYY-MM'),
      });
      dispatch({
        type: 'cpstatistics/find_SalesmanProductionValueGraphThree',
        payload: {
          switchType: type,
          ooType: 1,
          startTime: moment().format('YYYY-MM'),
          pageSize: 10,
          current: 1,
        },
      });
    }
    if (isNotBlank(type) && (type === '4' || type === 4)) {
      this.setState({
        userNameFour: '',
        ooTypeFour: '',
        officeIdFour: '',
        monthFour: moment().format('YYYY-MM'),
      });
      dispatch({
        type: 'cpstatistics/find_SalesmanProductionValueGraphFour',
        payload: {
          switchType: type,
          ooType: 1,
          startTime: moment().format('YYYY-MM'),
          pageSize: 10,
          current: 1,
        },
      });
    }
  };

  toggleForm = type => {
    const { expandFormOne, expandFormTwo, expandFormThree, expandFormFour } = this.state;
    if (isNotBlank(type) && (type === '1' || type === 1)) {
      this.setState({
        expandFormOne: !expandFormOne,
      });
    }
    if (isNotBlank(type) && (type === '2' || type === 2)) {
      this.setState({
        expandFormTwo: !expandFormTwo,
      });
    }
    if (isNotBlank(type) && (type === '3' || type === 3)) {
      this.setState({
        expandFormThree: !expandFormThree,
      });
    }
    if (isNotBlank(type) && (type === '4' || type === 4)) {
      this.setState({
        expandFormFour: !expandFormFour,
      });
    }
  };

  handleStandardTableChangeOne = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, userNameOne, ooTypeOne, officeIdOne, monthOne } = this.state;

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
      ...filters,
    };
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphOne',
      payload: {
        ...params,
        userName: userNameOne,
        switchType: 1,
        ooType: ooTypeOne,
        officeId: officeIdOne,
        startTime: monthOne,
      },
    });
  };

  handleStandardTableChangeTwo = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, userNameTwo, ooTypeTwo, officeIdTwo, monthTwo } = this.state;

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
      ...filters,
    };
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphTwo',
      payload: {
        ...params,
        switchType: 2,
        userName: userNameTwo,
        ooType: ooTypeTwo,
        officeId: officeIdTwo,
        startTime: monthTwo,
      },
    });
  };

  handleStandardTableChangeThree = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, userNameThree, ooTypeThree, officeIdThree, monthThree } = this.state;

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
      ...filters,
    };
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphThree',
      payload: {
        ...params,
        switchType: 3,
        userName: userNameThree,
        ooType: ooTypeThree,
        officeId: officeIdThree,
        startTime: monthThree,
      },
    });
  };

  handleStandardTableChangeFour = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, userNameFour, ooTypeFour, officeIdFour, monthFour } = this.state;

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
      ...filters,
    };
    dispatch({
      type: 'cpstatistics/find_SalesmanProductionValueGraphFour',
      payload: {
        ...params,
        switchType: 4,
        userName: userNameFour,
        ooType: ooTypeFour,
        officeId: officeIdFour,
        startTime: monthFour,
      },
    });
  };

  handleUpldExportClick = type => {
    const {
      userNameOne,
      ooTypeOne,
      officeIdOne,
      monthOne,
      userNameTwo,
      ooTypeTwo,
      officeIdTwo,
      monthTwo,
      userNameThree,
      ooTypeThree,
      officeIdThree,
      monthThree,
      userNameFour,
      ooTypeFour,
      officeIdFour,
      monthFour,
    } = this.state;
    if (isNotBlank(type) && (type === 1 || type === '1')) {
      const params = {
        switchType: 1,
        userName: userNameOne,
        ooType: ooTypeOne,
        officeId: officeIdOne,
        startTime: monthOne,
        'user.id': getStorage('userid'),
      };
      window.open(
        `/api/Beauty/beauty/statisticsReport/exportSalesmanProductionValue?${stringify(params)}`
      );
    }
    if (isNotBlank(type) && (type === 2 || type === '2')) {
      const params = {
        switchType: 2,
        userName: userNameTwo,
        ooType: ooTypeTwo,
        officeId: officeIdTwo,
        startTime: monthTwo,
        'user.id': getStorage('userid'),
      };
      window.open(
        `/api/Beauty/beauty/statisticsReport/exportSalesmanProductionValue?${stringify(params)}`
      );
    }
    if (isNotBlank(type) && (type === 3 || type === '3')) {
      const params = {
        switchType: 3,
        userName: userNameThree,
        ooType: ooTypeThree,
        officeId: officeIdThree,
        startTime: monthThree,
        'user.id': getStorage('userid'),
      };
      window.open(
        `/api/Beauty/beauty/statisticsReport/exportSalesmanProductionValue?${stringify(params)}`
      );
    }
    if (isNotBlank(type) && (type === 4 || type === '4')) {
      const params = {
        switchType: 4,
        userName: userNameFour,
        ooType: ooTypeFour,
        officeId: officeIdFour,
        startTime: monthFour,
        'user.id': getStorage('userid'),
      };
      window.open(
        `/api/Beauty/beauty/statisticsReport/exportSalesmanProductionValue?${stringify(params)}`
      );
    }
  };

  render() {
    const {
      loading,
      dispatch,
      findSalesmanProductionValueGraphOne,
      findSalesmanProductionValueGraphTwo,
      findSalesmanProductionValueGraphThree,
      findSalesmanProductionValueGraphFour,
    } = this.props;
    const columns = [
      {
        title: '业务员',
        dataIndex: 'user.name',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '类别',
        dataIndex: 'typeName',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '金额',
        dataIndex: 'totalMoney',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '金额占比',
        dataIndex: 'moneyRatio',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'singularNumber',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '数量占比',
        dataIndex: 'numberRatio',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '分公司',
        dataIndex: 'officeName',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
      {
        title: '时间',
        dataIndex: 'finishDate',
        inputType: 'text',
        width: 200,
        align: 'center',
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
                  公司业务员产值占比表
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <div style={{ fontWeight: 550, fontSize: 20, textAlign: 'center' }}>
                  订单分类统计
                </div>
              </div>
              <div className={styles.tableListForm}>{this.renderForm(1)}</div>
              <div className={styles.tableListOperator}>
                <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(1)}>
                  导出
                </Button>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={findSalesmanProductionValueGraphOne}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChangeOne}
              />
            </div>
          </Card>
        </div>

        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <div style={{ fontWeight: 550, fontSize: 20, textAlign: 'center' }}>
                  项目分类统计
                </div>
              </div>
              <div className={styles.tableListForm}>{this.renderForm(2)}</div>
              <div className={styles.tableListOperator}>
                <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(2)}>
                  导出
                </Button>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={findSalesmanProductionValueGraphTwo}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChangeTwo}
              />
            </div>
          </Card>
        </div>

        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <div style={{ fontWeight: 550, fontSize: 20, textAlign: 'center' }}>
                  业务渠道统计
                </div>
              </div>
              <div className={styles.tableListForm}>{this.renderForm(3)}</div>
              <div className={styles.tableListOperator}>
                <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(3)}>
                  导出
                </Button>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={findSalesmanProductionValueGraphThree}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChangeThree}
              />
            </div>
          </Card>
        </div>

        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <div style={{ fontWeight: 550, fontSize: 20, textAlign: 'center' }}>
                  业务分类统计
                </div>
              </div>
              <div className={styles.tableListForm}>{this.renderForm(4)}</div>
              <div className={styles.tableListOperator}>
                <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(4)}>
                  导出
                </Button>
              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                loading={loading}
                data={findSalesmanProductionValueGraphFour}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChangeFour}
              />
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default CompanySalesmanMakeUpFrom;

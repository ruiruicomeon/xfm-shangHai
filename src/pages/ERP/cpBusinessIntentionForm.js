import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Col,
  Row,
  Form,
  Input,
  Select,
  Button,
  Card,
  Modal,
  DatePicker,
  message,
  Upload,
  Icon,
  InputNumber,
  Cascader,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './cpBusinessIntentionForm.less';
import StandardTable from '@/components/StandardTable';
import SearchTableList from '@/components/SearchTableList';
import { getStorage } from '@/utils/localStorageUtils';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
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
      khsearchVisible,
      form: { getFieldDecorator },
      handleSearchVisible,
      cpClientSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={khsearchVisible}
        onCancel={() => this.handleSearchVisiblein()}
        afterClose={() => this.handleSearchVisiblein()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={cpClientSearchList} />)}
        </div>
      </Modal>
    );
  }
}
const CreateForm = Form.create()(props => {
  const {
    handleModalVisible,
    userlist,
    selectflag,
    selectuser,
    levellist,
    levellist2,
    newdeptlist,
    form,
    dispatch,
    handleSearchChange,
    that,
  } = props;
  const { getFieldDecorator } = form;
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectuser(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: '编号',
      dataIndex: 'no',
      align: 'center',
      width: 150,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 150,
      align: 'center',
      render: text => {
        if (isNotBlank(text)) {
          if (text === 1 || text === '1') {
            return <span>男</span>;
          }
          if (text === 0 || text === '0') {
            return <span>女</span>;
          }
        }
        return '';
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
    },
    {
      title: '所属大区',
      dataIndex: 'area.name',
      align: 'center',
      width: 150,
    },
    {
      title: '所属分公司',
      dataIndex: 'companyName',
      align: 'center',
      width: 150,
    },
    {
      title: '所属部门',
      dataIndex: 'dept.name',
      align: 'center',
      width: 150,
    },
    {
      title: '所属区域',
      dataIndex: 'areaName',
      align: 'center',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 150,
      render: text => {
        if (isNotBlank(text)) {
          if (text === 0 || text === '0') {
            return <span>在职</span>;
          }
          if (text === 1 || text === '1') {
            return <span>离职</span>;
          }
        }
        return '';
      },
    },
  ];
  const handleSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10,
      };
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.no)) {
        values.no = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.name)) {
        values.name = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.companyName)) {
        values.companyName = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      }

      that.setState({
        ywysearch: values,
      });

      dispatch({
        type: 'sysuser/fetch',
        payload: values,
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
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      ywysearch: {},
    });
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10,
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
      ...that.state.ywysearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'sysuser/fetch',
      payload: params,
    });
  };
  const handleModalywy = () => {
    // form.resetFields();
    that.setState({
      ywysearch: {},
    });
    handleModalVisible();
  };
  return (
    <Modal
      title="选择业务员"
      visible={selectflag}
      className="modelsearch"
      onCancel={() => handleModalywy()}
      width="80%"
    >
      <div className={styles.tableList}>
        <Form onSubmit={handleSearch}>
          <Row gutter={12}>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="编号">
                {getFieldDecorator('no')(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="姓名">
                {getFieldDecorator('name')(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="性别">
                {getFieldDecorator('sex', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    <Option value={1} key={1}>
                      男
                    </Option>
                    <Option value={0} key={0}>
                      女
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="所属大区">
                {getFieldDecorator('area.id', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    {isNotBlank(levellist) &&
                      isNotBlank(levellist.list) &&
                      levellist.list.length > 0 &&
                      levellist.list.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="所属分公司">
                {getFieldDecorator('companyName', {
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
              <FormItem {...formItemLayout} label="所属部门">
                {getFieldDecorator('dept', {
                  initialValue: '',
                })(
                  <Cascader
                    options={newdeptlist}
                    allowClear
                    fieldNames={{ label: 'name', value: 'id' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <div style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        <StandardTable
          bordered
          scroll={{ x: 1050 }}
          data={userlist}
          columns={selectcolumns}
          onChange={handleStandardTableChange}
        />
      </div>
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const {
    handleModalVisiblekh,
    cpClientList,
    selectkhflag,
    selectcustomer,
    handleSearchChange,
    form,
    dispatch,
    that,
  } = props;
  const { getFieldDecorator } = form;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectcustomer(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '客户',
      dataIndex: 'clientCpmpany',
      inputType: 'text',
      align: 'center',
      width: 240,
      editable: true,
    },
    {
      title: '客户编码',
      dataIndex: 'code',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '联系人',
      dataIndex: 'name',
      inputType: 'text',
      width: 150,
      align: 'center',
      editable: true,
    },
    {
      title: '客户分类',
      dataIndex: 'classify',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '客户级别',
      dataIndex: 'level',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '移动电话',
      dataIndex: 'phone',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '电话',
      dataIndex: 'tel',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '税号',
      dataIndex: 'dutyParagraph',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '开户账号',
      dataIndex: 'openNumber',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '开户银行',
      dataIndex: 'openBank',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '开户地址',
      dataIndex: 'openAddress',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '开户电话',
      dataIndex: 'openTel',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '结账周期',
      dataIndex: 'period',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '创建者',
      dataIndex: 'user.name',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: false,
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      width: 100,
      align: 'center',
      sorter: true,
      render: val => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
        return '';
      },
    },
    {
      title: '备注信息',
      dataIndex: 'remarks',
      inputType: 'text',
      width: 100,
      align: 'center',
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
  const handleSearch = e => {
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
        khsearch: values,
      });

      dispatch({
        type: 'cpClient/cpClient_List',
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
      khsearch: {},
    });
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
        pageSize: 10,
        current: 1,
      },
    });
  };
  const handleModalkh = () => {
    form.resetFields();
    that.setState({
      khsearch: {},
    });
    handleModalVisiblekh();
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...that.state.khsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: params,
    });
  };

  const handleModalkhin = () => {
    // form.resetFields();
    that.setState({
      khsearch: {},
    });
    handleModalkh();
  };

  return (
    <Modal title="选择客户" visible={selectkhflag} onCancel={() => handleModalkhin()} width="80%">
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Form onSubmit={handleSearch}>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="客户">
                {getFieldDecorator('clientCpmpany', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="联系人">
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
                <a style={{ marginLeft: 8 }} onClick={handleSearchChange}>
                  过滤其他 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Form>
        </Row>
        <StandardTable
          bordered
          scroll={{ x: 1050 }}
          onChange={handleStandardTableChange}
          data={cpClientList}
          columns={columnskh}
        />
      </div>
    </Modal>
  );
});
const CreateFormjc = Form.create()(props => {
  const { handleModalVisiblejc, cpCollecClientList, selectjcflag, selectjc } = props;
  const columnsjc = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: record => (
        <Fragment>
          <a onClick={() => selectjc(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '返点',
      dataIndex: 'rebates',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '备注信息',
      dataIndex: 'remarks',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
  ];
  return (
    <Modal
      title="选择集采客户"
      visible={selectjcflag}
      onCancel={() => handleModalVisiblejc()}
      width="80%"
    >
      <StandardTable bordered scroll={{ x: 1050 }} data={cpCollecClientList} columns={columnsjc} />
    </Modal>
  );
});
const CreateFormcode = Form.create()(props => {
  const {
    handleModalVisiblecode,
    cpCollecCodeList,
    selectcodeflag,
    selectcode,
    selectjcdata,
    form: { getFieldDecorator },
    form,
    dispatch,
    that,
    collecCid
  } = props;
  const columnscode = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: record => (
        <Fragment>
          <a onClick={() => selectcode(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      inputType: 'text',
      width: 250,
      align: 'center',
      editable: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '金额',
      dataIndex: 'money',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
      render: text => getPrice(text),
    },
    {
      title: '备注信息',
      dataIndex: 'remarks',
      inputType: 'text',
      width: 100,
      align: 'center',
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

  const handleSearch = e => {
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
        bmsearch: values,
      });

      dispatch({
        type: 'cpCollecCode/cpCollecCode_List',
        payload: {
          pageSize: 10,
          'collecClient.id': isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(collecCid)?collecCid:'',
          ...values,
        },
      });

      //   dispatch({
      // 	type: 'cpBillMaterial/get_cpBill_caterialList2',
      // 	payload: {
      // 	  pageSize: 500,
      // 	  ...values,
      // 	  parent1:location.query.id,
      // 	  current: 1,
      // 	}
      //   });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      bmsearch: {},
    });
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
        'collecClient.id': isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(collecCid)?collecCid:'',
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
      ...that.state.bmsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      'collecClient.id': isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(collecCid)?collecCid:'',
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: params,
    });
  };

  const handleModalVisiblecodein = () => {
    // form.resetFields();
    that.setState({
      bmsearch: {},
    });
    handleModalVisiblecode();
  };

  return (
    <Modal
      title="选择集采编码"
      visible={selectcodeflag}
      onCancel={() => handleModalVisiblecodein()}
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
            <FormItem {...formItemLayout} label="编码">
              {getFieldDecorator('code', {
                initialValue: '',
              })(<Input />)}
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
        scroll={{ x: 700 }}
        data={cpCollecCodeList}
        columns={columnscode}
        onChange={handleStandardTableChange}
      />
    </Modal>
  );
});
@connect(
  ({
    cpBusinessIntention,
    loading,
    sysuser,
    cpClient,
    cpCollecClient,
    cpCollecCode,
    syslevel,
    sysdept,
  }) => ({
    ...cpBusinessIntention,
    ...sysuser,
    ...cpClient,
    ...cpCollecClient,
    ...cpCollecCode,
    ...syslevel,
    ...sysdept,
    newdeptlist: sysdept.deptlist.list,
    submitting: loading.effects['form/submitRegularForm'],
    submitting1: loading.effects['cpBusinessIntention/cpBusinessIntention_Add'],
    submitting2: loading.effects['cpupdata/cpBusinessIntention_updata'],
    submitting3: loading.effects['cpBusinessIntention/cpBusinessIntention_undo'],
  })
)
@Form.create()
class CpBusinessIntentionForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      fileList: [],
      orderflag: false,
      selectflag: false,
      selectdata: {},
      selectkhflag: false,
      selectjcflag: false,
      selectcodeflag: false,
      selectcodedata: {},
      selectjcdata: {},
      selectkhdata: {},
      sumbitflag: false,
      selectyear: 0,
      selectmonth: 0,
      insuranceCompany: [],
      updataflag: true,
      cphflag: true,
      selthis: '',
      selthis1: '',
      ywysearch: {},
      khsearch: {},
      updataname: '取消锁定',
      maxlen: false,
      minlen: false,
      cpzim: [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' },
        { name: 'F' },
        { name: 'G' },
        { name: 'H' },
        { name: 'J' },
        { name: 'K' },
        { name: 'L' },
        { name: 'M' },
        { name: 'N' },
        { name: 'P' },
        { name: 'Q' },
        { name: 'R' },
        { name: 'S' },
        { name: 'T' },
        { name: 'U' },
        { name: 'V' },
        { name: 'W' },
        { name: 'X' },
        { name: 'Y' },
        { name: 'Z' },
      ],
      incpzim: [],
      selinputcp: '',
      selwenz: '',
      selzim: '',
      dingdflag: 1,
      yanbaoflag: '',
      confirmflag: true,
      clearflag: false,
      clearflag1: false,
      collecCid:'',
      location: getLocation(),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location, cpzim } = this.state;

    this.props.form.setFieldsValue({
      zbtime: 0,
    });

    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpBusinessIntention/cpBusinessIntention_Get',
        payload: {
          id: location.query.id,
        },
        callback: res => {
          if (
            res.data.orderStatus === 1 ||
            res.data.orderStatus === '1' ||
            res.data.orderStatus === 2 ||
            res.data.orderStatus === '2' ||
            (isNotBlank(getStorage('menulist')) &&
              JSON.parse(getStorage('menulist')).filter(
                item => item.target == 'cpBusinessIntention'
              ).length > 0 &&
              JSON.parse(getStorage('menulist'))
                .filter(item => item.target == 'cpBusinessIntention')[0]
                .children.filter(item => item.name == '修改').length == 0)
          ) {
            this.setState({ orderflag: true });
          } else {
            this.setState({ orderflag: false });
          }
          if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
            let photoUrl = res.data.photo.split('|');
            photoUrl = photoUrl.map(item => {
              return {
                id: getFullUrl(item),
                uid: getFullUrl(item),
                url: getFullUrl(item),
                name: getFullUrl(item),
              };
            });
            this.setState({
              addfileList: res.data.photo.split('|'),
              fileList: photoUrl,
            });
          }
          if (isNotBlank(res.data.dicth)) {
            this.setState({
              selthis: res.data.dicth,
            });
          }
          if (isNotBlank(res.data.businessType)) {
            this.setState({
              selthis1: res.data.businessType,
            });
          }
          this.props.form.setFieldsValue({
            collectClientname:
              isNotBlank(res.data.collectClientId) && isNotBlank(res.data.collectClientId.name)
                ? res.data.collectClientId.name
                : '',
            collectCodename:
              isNotBlank(res.data) && isNotBlank(res.data.collectCode) ? res.data.collectCode : '',
            ywy:
              isNotBlank(res.data.user) && isNotBlank(res.data.user.name)
                ? res.data.user.name
                : getStorage('username'),
            kh:
              isNotBlank(res.data.client) && isNotBlank(res.data.client.clientCpmpany)
                ? res.data.client.clientCpmpany
                : '',
          });
          if (isNotBlank(res.data.assemblyEnterType) && res.data.assemblyEnterType == 1) {
            this.setState({
              enterType: '1',
            });
          }

          if (isNotBlank(res.data.orderType)) {
            this.setState({
              dingdflag: res.data.orderType,
            });
          }

          if (isNotBlank(res.data.project)) {
            this.setState({
              yanbaoflag: res.data.project,
            });
          }

          if (isNotBlank(res.data.qualityTime)) {
            this.props.form.setFieldsValue({
              zbtime: res.data.qualityTime,
            });
            this.setState({
              selectyear: res.data.qualityTime.split(',')[0],
              selectmonth: res.data.qualityTime.split(',')[1],
            });
          }
          if (isNotBlank(res.data.plateNumber)) {
            const newselwenz = res.data.plateNumber.slice(0, 1);
            this.setState({
              selwenz: res.data.plateNumber.slice(0, 1),
              selzim: res.data.plateNumber.slice(1, 2),
              selinputcp: res.data.plateNumber.slice(2),
            });
            if (
              isNotBlank(res.data.plateNumber.slice(0, 1)) &&
              isNotBlank(res.data.plateNumber.slice(1, 2)) &&
              isNotBlank(res.data.plateNumber.slice(2))
            ) {
              this.props.form.setFieldsValue({
                cphao: '1',
              });
            } else {
              this.props.form.setFieldsValue({
                cphao: '',
              });
            }

            if (isNotBlank(newselwenz)) {
              if (newselwenz == '京') {
                this.setState({
                  incpzim: [
                    { name: 'A' },
                    { name: 'B' },
                    { name: 'C' },
                    { name: 'D' },
                    { name: 'E' },
                    { name: 'F' },
                    { name: 'G' },
                    { name: 'H' },
                    { name: 'J' },
                    { name: 'K' },
                    { name: 'L' },
                    { name: 'M' },
                    { name: 'N' },
                    { name: 'O' },
                    { name: 'P' },
                    { name: 'Q' },
                    { name: 'R' },
                    { name: 'Y' },
                  ],
                });
              } else if (newselwenz == '藏' || newselwenz == '台') {
                this.setState({
                  incpzim: cpzim.slice(0, 7),
                });
              } else if (newselwenz == '川' || newselwenz == '粤') {
                this.setState({
                  incpzim: cpzim,
                });
              } else if (newselwenz == '鄂' || newselwenz == '皖' || newselwenz == '云') {
                this.setState({
                  incpzim: cpzim.slice(0, 17),
                });
              } else if (newselwenz == '甘'  || newselwenz == '辽') {
                this.setState({
                  incpzim: cpzim.slice(0, 14),
                });
              } else if (newselwenz == '贵' || newselwenz == '吉') {
                this.setState({
                  incpzim: cpzim.slice(0, 9),
                });
              } else if (newselwenz == '黑' || newselwenz == '桂' || newselwenz == '新') {
                this.setState({
                  incpzim: cpzim.slice(0, 16),
                });
              } else if (newselwenz == '冀') {
                this.setState({
                  incpzim: [
                    { name: 'A' },
                    { name: 'B' },
                    { name: 'C' },
                    { name: 'D' },
                    { name: 'E' },
                    { name: 'F' },
                    { name: 'G' },
                    { name: 'H' },
                    { name: 'J' },
                    { name: 'K' },
                    { name: 'L' },
                    { name: 'M' },
                    { name: 'N' },
                    { name: 'R' },
                    { name: 'T' },
                  ],
                });
              } else if (newselwenz == '晋' || newselwenz == '蒙' || newselwenz == '赣') {
                this.setState({
                  incpzim: cpzim.slice(0, 12),
                });
              } else if (newselwenz == '鲁') {
                this.setState({
                  incpzim: [
                    { name: 'A' },
                    { name: 'B' },
                    { name: 'C' },
                    { name: 'D' },
                    { name: 'E' },
                    { name: 'F' },
                    { name: 'G' },
                    { name: 'H' },
                    { name: 'J' },
                    { name: 'K' },
                    { name: 'L' },
                    { name: 'M' },
                    { name: 'N' },
                    { name: 'P' },
                    { name: 'Q' },
                    { name: 'R' },
                    { name: 'S' },
                    { name: 'T' },
                    { name: 'U' },
                    { name: 'V' },
                    { name: 'Y' },
                  ],
                });
              } else if (newselwenz == '陕') {
                this.setState({
                  incpzim: cpzim.slice(0, 20),
                });
              } else if (newselwenz == '闽') {
                this.setState({
                  incpzim: cpzim.slice(0, 10),
                });
              } else if (newselwenz == '宁' || newselwenz == '琼') {
                this.setState({
                  incpzim: cpzim.slice(0, 5),
                });
              } else if (newselwenz == '青' || newselwenz == '渝') {
                this.setState({
                  incpzim: cpzim.slice(0, 8),
                });
              } else if (newselwenz == '湘' || newselwenz == '豫') {
                this.setState({
                  incpzim: cpzim.slice(0, 18),
                });
              } else if (newselwenz == '苏') {
                this.setState({
                  incpzim: [
                    { name: 'A' },
                    { name: 'B' },
                    { name: 'C' },
                    { name: 'D' },
                    { name: 'E' },
                    { name: 'F' },
                    { name: 'G' },
                    { name: 'H' },
                    { name: 'J' },
                    { name: 'K' },
                    { name: 'L' },
                    { name: 'M' },
                    { name: 'N' },
                    { name: 'U' },
                  ],
                });
              } else if (newselwenz == '浙') {
                this.setState({
                  incpzim: cpzim.slice(0, 11),
                });
              } else if (newselwenz == '港' || newselwenz == '澳') {
                this.setState({
                  incpzim: cpzim.slice(0, 1),
                });
              } else if (newselwenz == '沪') {
                this.setState({
                  incpzim: [
                    { name: 'A' },
                    { name: 'B' },
                    { name: 'C' },
                    { name: 'D' },
                    { name: 'E' },
                    { name: 'F' },
                    { name: 'G' },
                    { name: 'H' },
                    { name: 'J' },
                    { name: 'K' },
                    { name: 'L' },
                    { name: 'M' },
                    { name: 'N' }
                    , { name: 'Q' },
                    { name: 'R' },
                    { name: 'Z' },
                  ],
                });
              } else if (newselwenz == '津') {
                this.setState({
                  incpzim: [
                    { name: 'A' },
                    { name: 'B' },
                    { name: 'C' },
                    { name: 'D' },
                    { name: 'E' },
                    { name: 'F' },
                    { name: 'G' },
                    { name: 'H' },
                    { name: 'I' },
                    { name: 'J' },
                    { name: 'K' },
                    { name: 'L' },
                    { name: 'M' },
                    { name: 'N' },
                    { name: 'O' },
                    { name: 'P' },
                    { name: 'Q' },
                    { name: 'R' },
                    { name: 'S' },
                    { name: 'T' },
                    { name: 'U' },
                    { name: 'V' },
                    { name: 'W' },
                    { name: 'X' },
                    { name: 'Y' },
                    { name: 'Z' },
                  ],
                });
              }
            } else {
              this.setState({
                incpzim: [],
              });
            }
          }
          if (isNotBlank(res.data.collectClientId) && isNotBlank(res.data.collectClientId.id)) {
            this.setState({
              collecCid:res.data.collectClientId.id
            })
            dispatch({
              type: 'cpCollecCode/cpCollecCode_List',
              payload: {
                pageSize: 10,
                'collecClient.id': res.data.collectClientId.id,
              },
            });
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'YWY',
            },
            callback: res => {
              this.setState({
                srcimg: res,
              });
            },
          });
        },
      });
    } else {
      this.props.form.setFieldsValue({
        ywy: getStorage('username'),
      });
    }

    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'syslevel/fetch',
      payload: {
        type: 1,
      },
    });
    dispatch({
      type: 'syslevel/fetch2',
      payload: {
        type: 2,
        pageSize: 100
      },
    });
    dispatch({
      type: 'syslevel/query_office',
    });
    dispatch({
      type: 'sysdept/query_dept',
    });

    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
        // genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      },
      // callback: () => {
      //   that.setState({
      //     selectkhflag: true,
      //   });
      // },
    });
    dispatch({
      type: 'cpClient/cpClient_SearchList',
    });

    dispatch({
      type: 'dict/dict',
      callback: data => {
        const logisticsNeed = [];
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
        data.forEach(item => {
          if (item.type == 'wy') {
            logisticsNeed.push(item);
          }
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
          logisticsNeed,
        });
      },
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpBusinessIntention/clear',
    });
    dispatch({
      type: 'cpCollecCode/clear',
    });

    this.setState({
      selectflag: false,
      selectkhflag: false,
      selectjcflag: false,
      selectcodeflag: false,
      selectdata: {},
      selectkhdata: {},
      selectjcdata: {},
      selectcodedata: {},
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpBusinessIntentionGet } = this.props;
    const {
      addfileList,
      selectkhdata,
      selectdata,
      previewVisible,
      location,
      selectjcdata,
      selectcodedata,
      selectyear,
      selectmonth,
      updataflag,
      selwenz,
      selzim,
      selinputcp,
      clearflag,
      clearflag1,
    } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          sumbitflag: true,
        });
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.photo = addfileList.join('|');
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.insuranceCompanyId = isNotBlank(value.insuranceCompanyId)
          ? value.insuranceCompanyId
          : '';
        value.collectClientId = {};
        if (clearflag) {
          value.collectClientId.id =
            isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id) ? selectjcdata.id : '';
        } else {
          value.collectClientId.id =
            isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)
              ? selectjcdata.id
              : isNotBlank(cpBusinessIntentionGet) &&
                isNotBlank(cpBusinessIntentionGet.collectClientId) &&
                isNotBlank(cpBusinessIntentionGet.collectClientId.id)
                ? cpBusinessIntentionGet.collectClientId.id
                : '';
        }
        if (clearflag1) {
          value.collectCodeid =
            isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? selectcodedata.id : '';
        } else {
          value.collectCodeid =
            isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)
              ? selectcodedata.id
              : isNotBlank(cpBusinessIntentionGet) &&
                isNotBlank(cpBusinessIntentionGet.collectCodeid)
                ? cpBusinessIntentionGet.collectCodeid
                : '';
        }
        value.qualityTime = `${selectyear} , ${selectmonth}`;
        value.intentionPrice = setPrice(value.intentionPrice);
        value.deliveryDate = moment(value.deliveryDate).format('YYYY-MM-DD');
        value.plateNumber =
          (isNotBlank(selwenz) ? selwenz : '') +
          (isNotBlank(selzim) ? selzim : '') +
          (isNotBlank(selinputcp) ? selinputcp : '');
        value.client = {};
        value.user = {};
        value.client.id =
          isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)
            ? selectkhdata.id
            : isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)
              ? cpBusinessIntentionGet.client.id
              : '';
        value.user.id =
          isNotBlank(selectdata) && isNotBlank(selectdata.id)
            ? selectdata.id
            : isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user)
              ? cpBusinessIntentionGet.user.id
              : getStorage('userid')
                ? getStorage('userid')
                : '';
        value.orderStatus = 1;
        if (updataflag) {
          dispatch({
            type: 'cpBusinessIntention/cpBusinessIntention_Add',
            payload: { ...value },
            callback: res => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_business_intention_form?id=${res.data.id}`);
              // router.push('/business/process/cp_business_intention_list');
            },
          });
        } else {
          dispatch({
            type: 'cpupdata/cpBusinessIntention_updata',
            payload: { ...value },
            callback: res => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_business_intention_form?id=${location.query.id}`);
              // router.push('/business/process/cp_business_intention_list');
            },
          });
        }
      }
    });
  };

  onsave = e => {
    const { dispatch, form, cpBusinessIntentionGet } = this.props;
    const {
      addfileList,
      selectkhdata,
      selectdata,
      location,
      selectjcdata,
      selectcodedata,
      selectyear,
      selectmonth,
      updataflag,
      selwenz,
      selzim,
      selinputcp,
      clearflag,
      clearflag1,
    } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.photo = addfileList.join('|');
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.insuranceCompanyId = isNotBlank(value.insuranceCompanyId)
          ? value.insuranceCompanyId
          : '';
        value.plateNumber =
          (isNotBlank(selwenz) ? selwenz : '') +
          (isNotBlank(selzim) ? selzim : '') +
          (isNotBlank(selinputcp) ? selinputcp : '');
        value.collectClientId = {};
        if (clearflag) {
          value.collectClientId.id =
            isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id) ? selectjcdata.id : '';
        } else {
          value.collectClientId.id =
            isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)
              ? selectjcdata.id
              : isNotBlank(cpBusinessIntentionGet) &&
                isNotBlank(cpBusinessIntentionGet.collectClientId) &&
                isNotBlank(cpBusinessIntentionGet.collectClientId.id)
                ? cpBusinessIntentionGet.collectClientId.id
                : '';
        }
        if (clearflag1) {
          value.collectCodeid =
            isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? selectcodedata.id : '';
        } else {
          value.collectCodeid =
            isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)
              ? selectcodedata.id
              : isNotBlank(cpBusinessIntentionGet) &&
                isNotBlank(cpBusinessIntentionGet.collectCodeid)
                ? cpBusinessIntentionGet.collectCodeid
                : '';
        }
        value.qualityTime = `${selectyear}, ${selectmonth}`;
        value.intentionPrice = setPrice(value.intentionPrice);
        value.deliveryDate = moment(value.deliveryDate).format('YYYY-MM-DD');
        value.client = {};
        value.user = {};
        value.client.id =
          isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)
            ? selectkhdata.id
            : isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)
              ? cpBusinessIntentionGet.client.id
              : '';
        value.user.id =
          isNotBlank(selectdata) && isNotBlank(selectdata.id)
            ? selectdata.id
            : isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user)
              ? cpBusinessIntentionGet.user.id
              : getStorage('userid');
        if (updataflag) {
          value.orderStatus = 0;
          dispatch({
            type: 'cpBusinessIntention/cpBusinessIntention_Add',
            payload: { ...value },
            callback: res => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_business_intention_form?id=${res.data.id}`);
            },
          });
        } else {
          value.orderStatus = 1;
          dispatch({
            type: 'cpupdata/cpBusinessIntention_updata',
            payload: { ...value },
            callback: res => {
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

  onupdata = () => {
    const { location, updataflag } = this.state;
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定',
      });
    } else {
      router.push(`/business/process/cp_business_intention_form?id=${location.query.id}`);
    }
  };

  onupdata111 = e => {
    const { dispatch, form, cpBusinessIntentionGet } = this.props;
    const {
      addfileList,
      selectkhdata,
      selectdata,
      previewVisible,
      location,
      selectjcdata,
      selectcodedata,
      selectyear,
      selectmonth,
    } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          sumbitflag: true,
        });
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.photo = addfileList.join('|');
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.insuranceCompanyId = isNotBlank(value.insuranceCompanyId)
          ? value.insuranceCompanyId
          : '';
        value.qualityTime = `${selectyear} , ${selectmonth}`;
        value.intentionPrice = setPrice(value.intentionPrice);
        value.deliveryDate = moment(value.deliveryDate).format('YYYY-MM-DD');
        value.client = {};
        value.user = {};
        value.client.id =
          isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)
            ? selectkhdata.id
            : isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)
              ? cpBusinessIntentionGet.client.id
              : '';
        value.user.id =
          isNotBlank(selectdata) && isNotBlank(selectdata.id)
            ? selectdata.id
            : isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user)
              ? cpBusinessIntentionGet.user.id
              : getStorage('userid')
                ? getStorage('userid')
                : '';
        value.orderStatus = 1;
        dispatch({
          type: 'cpupdata/cpBusinessIntention_updata',
          payload: { ...value },
          callback: res => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_business_intention_form?id=${res.data.id}`);
            // router.push('/business/process/cp_business_intention_list');
          },
        });
      }
    });
  };

  showClose = record => {
    Modal.confirm({
      title: '关闭该意向单',
      content: '确定关闭该意向单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.onClose(record),
    });
  };

  onClose = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpBusinessIntention/cpBusinessIntention_Add',
      payload: {
        id,
        orderStatus: 2,
      },
      callback: () => {
        this.setState({
          addfileList: [],
          fileList: [],
        });
        router.push('/business/process/cp_business_intention_list');
      },
    });
  };

  onCancelCancel = () => {
    router.push('/business/process/cp_business_intention_list');
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
    const { orderflag } = this.state;
    if (!orderflag) {
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
    }
  };

  handlebeforeUpload = file => {
    const { addfileList } = this.state;
    const { dispatch } = this.props;
    const isimg = file.type.indexOf('image') >= 0;
    if (!isimg) {
      message.error('请选择图片文件!');
    }
    const isLt10M = file.size / 1024 / 1024 <= 10;
    if (!isLt10M) {
      message.error('文件大小需为10M以内');
    }
    if (isimg && isLt10M) {
      dispatch({
        type: 'upload/upload_img',
        payload: {
          file,
          name: 'businessIntention',
        },
        callback: res => {
          if (!isNotBlank(addfileList) || addfileList.length <= 0) {
            this.setState({
              addfileList: [res],
            });
          } else {
            this.setState({
              addfileList: [...addfileList, res],
            });
          }
        },
      });
    }
    return isLt10M && isimg;
  };

  handleUploadChange = info => {
    if (isNotBlank(info.file) && isNotBlank(info.file.size)) {
      const isimg = info.file.type.indexOf('image') >= 0;
      const isLt10M = info.file.size / 1024 / 1024 <= 10;
      if (info.file.status === 'done') {
        if (isLt10M && isimg) {
          this.setState({ fileList: info.fileList });
        }
      } else {
        this.setState({ fileList: info.fileList });
      }
    }
  };

  onselect = () => {
    const { dispatch } = this.props;
    this.setState({
      selectflag: true,
    });
    // dispatch({
    //   type: 'sysuser/fetch',
    //   payload: {
    //     current: 1,
    //     pageSize: 10,
    //   },
    //   callback: () => {
    //     this.setState({
    //       selectflag: true,
    //     });
    //   },
    // });
    // dispatch({
    //   type: 'syslevel/fetch',
    //   payload: {
    //     type: 1,
    //   },
    // });
    // dispatch({
    //   type: 'syslevel/fetch2',
    //   payload: {
    //     type: 2,
    //     pageSize: 100
    //   },
    // });
    // dispatch({
    //   type: 'syslevel/query_office',
    // });
    // dispatch({
    //   type: 'sysdept/query_dept',
    // });
  };

  onselectjc = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpCollecClient/cpCollecClient_List',
      payload: {
        pageSize: 10,
        status: 1,
      },
      callback: () => {
        this.setState({
          selectjcflag: true,
        });
      },
    });
  };

  onselectkh = () => {
    const { dispatch } = this.props;
    const that = this;
    that.setState({
            selectkhflag: true,
          });
    // dispatch({
    //   type: 'cpClient/cpClient_List',
    //   payload: {
    //     pageSize: 10,
    //     genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
    //   },
    //   callback: () => {
    //     that.setState({
    //       selectkhflag: true,
    //     });
    //   },
    // });
    // dispatch({
    //   type: 'cpClient/cpClient_SearchList',
    // });
  };
  onselectcode = () => {
    const { dispatch, cpBusinessIntentionGet } = this.props;
    const { selectjcdata, clearflag } = this.state;
    const that = this;

    if (clearflag) {
      if (isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) {
        this.setState({
          selectcodeflag: true,
        });
      } else {
        message.error('请先选择集采客户!');
      }
    } else {
      if (
        (isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) ||
        (isNotBlank(cpBusinessIntentionGet) &&
          isNotBlank(cpBusinessIntentionGet.collectClientId) &&
          isNotBlank(cpBusinessIntentionGet.collectClientId.id))
      ) {
        this.setState({
          selectcodeflag: true,
        });
      } else {
        message.error('请先选择集采客户!');
      }
    }
  };

  handleModalVisible = flag => {
    this.setState({
      selectflag: !!flag,
    });
  };

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag,
    });
  };

  handleModalVisiblecode = flag => {
    this.setState({
      selectcodeflag: !!flag,
    });
  };

  handleModalVisiblejc = flag => {
    this.setState({
      selectjcflag: !!flag,
    });
  };

  selectuser = record => {
    this.props.form.setFieldsValue({
      ywy: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });
    this.setState({
      selectdata: record,
      selectflag: false,
    });
  };

  selectcustomer = record => {
    this.props.form.setFieldsValue({
      kh: isNotBlank(record) && isNotBlank(record.clientCpmpany) ? record.clientCpmpany : '',
    });
    this.setState({
      selectkhdata: record,
      selectkhflag: false,
    });
  };

  selectjc = record => {
    const { dispatch } = this.props;
    this.props.form.setFieldsValue({
      collectClientname: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });
    this.setState({
      selectjcdata: record,
      selectjcflag: false,
    });
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
        'collecClient.id': record.id,
      },
    });
  };

  selectcode = record => {
    this.props.form.setFieldsValue({
      collectCodename: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });
    this.setState({
      selectcodedata: record,
      selectcodeflag: false,
    });
  };

  onUndo = record => {
    const { submitting3 } = this.props;
    Modal.confirm({
      title: '撤销该意向单',
      content: '确定撤销该意向单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(record),
    });
  };

  undoClick = id => {
    const { dispatch, submitting3 } = this.props;
    const { confirmflag } = this.state;
    const that = this;
    setTimeout(function () {
      that.setState({
        confirmflag: true,
      });
    }, 1000);

    if (confirmflag) {
      this.setState({
        confirmflag: false,
      });
      dispatch({
        type: 'cpBusinessIntention/cpBusinessIntention_undo',
        payload: {
          id,
        },
        callback: () => {
          router.push(`/business/process/cp_business_intention_form?id=${id}`);
          // router.push('/business/process/cp_business_intention_list');
        },
      });
    }
  };

  goprint = () => {
    const { location } = this.state;
    const w = window.open('about:blank');
    w.location.href = `/#/businessintentionprint?id=${location.query.id}`;
  };

  editYear = val => {
    if (isNotBlank(val)) {
      this.props.form.setFieldsValue({
        zbtime: isNotBlank(val) ? val : '',
      });
      this.setState({ selectyear: val });
    } else {
      this.props.form.setFieldsValue({
        zbtime: 0,
      });
      this.setState({ selectyear: 0 });
    }
  };

  editMonth = val => {
    if (isNotBlank(val)) {
      this.props.form.setFieldsValue({
        zbtime: isNotBlank(val) ? val : '',
      });
      this.setState({ selectmonth: val });
    } else {
      this.props.form.setFieldsValue({
        zbtime: 0,
      });
      this.setState({ selectmonth: 0 });
    }
  };

  handleSearchVisible = fieldsValue => {
    this.setState({
      khsearchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn),
    });
  };

  handleSearchChange = () => {
    this.setState({
      khsearchVisible: true,
    });
  };

  handleSearchAdd = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        ...this.state.khsearch,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      khsearchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn),
    });
  };

  checkcph = e => {
    if (isNotBlank(e.target.value)) {
      const str = e.target.value.trim();
      const cphflag = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
        str
      );
      this.setState({
        cphflag,
      });
    } else {
      this.setState({
        cphflag: true,
      });
    }
  };

  selectthis = e => {
    console.log(e);
    this.setState({
      selthis: e,
    });
  };

  selectthis1 = e => {
    this.setState({
      selthis1: e,
    });
  };

  limitnumber = e => {
    if (isNotBlank(e.target.value)) {
      console.log(e.target.value.length);
      if (e.target.value.length < 16) {
        this.setState({
          minlen: true,
          maxlen: false,
        });
      } else if (e.target.value.length > 16) {
        this.setState({
          maxlen: true,
          minlen: false,
        });
      } else if (e.target.value.length == 16) {
        this.setState({
          maxlen: false,
          minlen: false,
        });
      }
    } else {
      this.setState({
        maxlen: false,
        minlen: false,
      });
    }
  };

  showinputcp = e => {
    const { selwenz, selzim, selinputcp } = this.state;
    if (isNotBlank(e.target.value)) {
      this.setState({
        selinputcp: e.target.value,
      });
    } else {
      this.setState({
        selinputcp: '',
      });
    }
    if (isNotBlank(e.target.value) && isNotBlank(selwenz) && isNotBlank(selzim)) {
      this.props.form.setFieldsValue({
        cphao: '1',
      });
    } else {
      this.props.form.setFieldsValue({
        cphao: '',
      });
    }
  };

  showcpzim = e => {
    const { selwenz, selzim, selinputcp } = this.state;
    console.log(e);
    if (isNotBlank(e)) {
      this.setState({
        selzim: e,
      });
    } else {
      this.setState({
        selzim: '',
      });
    }
    if (isNotBlank(selinputcp) && isNotBlank(selwenz) && isNotBlank(e)) {
      this.props.form.setFieldsValue({
        cphao: '1',
      });
    } else {
      this.props.form.setFieldsValue({
        cphao: '',
      });
    }
  };

  showcpwenz = e => {
    const { cpzim, selwenz, selzim, selinputcp } = this.state;
    console.log(e);
    if (isNotBlank(e)) {
      this.setState({
        selwenz: e,
      });
      if (e == '京') {
        this.setState({
          incpzim: [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'E' },
            { name: 'F' },
            { name: 'G' },
            { name: 'H' },
            { name: 'J' },
            { name: 'K' },
            { name: 'L' },
            { name: 'M' },
            { name: 'N' },
            { name: 'O' },
            { name: 'P' },
            { name: 'Q' },
            { name: 'R' },
            { name: 'Y' },
          ],
        });
      } else if (e == '藏' || e == '台') {
        this.setState({
          incpzim: cpzim.slice(0, 7),
        });
      } else if (e == '川' || e == '粤') {
        this.setState({
          incpzim: cpzim,
        });
      } else if (e == '鄂' || e == '皖' || e == '云') {
        this.setState({
          incpzim: cpzim.slice(0, 17),
        });
      } else if (e == '甘'  || e == '辽') {
        this.setState({
          incpzim: cpzim.slice(0, 14),
        });
      } else if (e == '贵' || e == '吉') {
        this.setState({
          incpzim: cpzim.slice(0, 9),
        });
      } else if (e == '黑' || e == '桂' || e == '新') {
        this.setState({
          incpzim: cpzim.slice(0, 16),
        });
      } else if (e == '冀') {
        this.setState({
          incpzim: [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'E' },
            { name: 'F' },
            { name: 'G' },
            { name: 'H' },
            { name: 'J' },
            { name: 'K' },
            { name: 'L' },
            { name: 'M' },
            { name: 'N' },
            { name: 'R' },
            { name: 'T' },
          ],
        });
      } else if (e == '晋' || e == '蒙' || e == '赣') {
        this.setState({
          incpzim: cpzim.slice(0, 12),
        });
      } else if (e == '鲁') {
        this.setState({
          incpzim: [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'E' },
            { name: 'F' },
            { name: 'G' },
            { name: 'H' },
            { name: 'J' },
            { name: 'K' },
            { name: 'L' },
            { name: 'M' },
            { name: 'N' },
            { name: 'P' },
            { name: 'Q' },
            { name: 'R' },
            { name: 'S' },
            { name: 'T' },
            { name: 'U' },
            { name: 'V' },
            { name: 'Y' },
          ],
        });
      } else if (e == '陕') {
        this.setState({
          incpzim: cpzim.slice(0, 20),
        });
      } else if (e == '闽') {
        this.setState({
          incpzim: cpzim.slice(0, 10),
        });
      } else if (e == '宁' || e == '琼') {
        this.setState({
          incpzim: cpzim.slice(0, 5),
        });
      } else if (e == '青' || e == '渝') {
        this.setState({
          incpzim: cpzim.slice(0, 8),
        });
      } else if (e == '湘' || e == '豫') {
        this.setState({
          incpzim: cpzim.slice(0, 18),
        });
      } else if (e == '苏') {
        this.setState({
          incpzim: [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'E' },
            { name: 'F' },
            { name: 'G' },
            { name: 'H' },
            { name: 'J' },
            { name: 'K' },
            { name: 'L' },
            { name: 'M' },
            { name: 'N' },
            { name: 'U' },
          ],
        });
      } else if (e == '浙') {
        this.setState({
          incpzim: cpzim.slice(0, 11),
        });
      } else if (e == '港' || e == '澳') {
        this.setState({
          incpzim: cpzim.slice(0, 1),
        });
      } else if (e == '沪') {
        this.setState({
          incpzim: [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'E' },
            { name: 'F' },
            { name: 'G' },
            { name: 'H' },
            { name: 'J' },
            { name: 'K' },
            { name: 'L' },
            { name: 'M' },
            { name: 'N' },
            { name: 'Q' },
            { name: 'R' },
            { name: 'R' },
            { name: 'Z' },
          ],
        });
      } else if (e == '津') {
        this.setState({
          incpzim: [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'E' },
            { name: 'F' },
            { name: 'G' },
            { name: 'H' },
            { name: 'I' },
            { name: 'J' },
            { name: 'K' },
            { name: 'L' },
            { name: 'M' },
            { name: 'N' },
            { name: 'O' },
            { name: 'P' },
            { name: 'Q' },
            { name: 'R' },
            { name: 'S' },
            { name: 'T' },
            { name: 'U' },
            { name: 'V' },
            { name: 'W' },
            { name: 'X' },
            { name: 'Y' },
            { name: 'Z' },
          ],
        });
      }
    } else {
      this.setState({
        incpzim: [],
        selwenz: '',
      });
    }
    if (isNotBlank(selinputcp) && isNotBlank(e) && isNotBlank(selzim)) {
      this.props.form.setFieldsValue({
        cphao: '1',
      });
    } else {
      this.props.form.setFieldsValue({
        cphao: '',
      });
    }
  };

  seldingd = e => {
    this.setState({
      dingdflag: e,
    });
    this.props.form.setFieldsValue({
      project: '',
      businessType: '',
    });
  };

  onselEnterType = e => {
    console.log(e);
    this.setState({
      enterType: e,
    });
  };

  selectyanbao = e => {
    this.setState({
      yanbaoflag: e,
    });
    this.props.form.setFieldsValue({
      businessType: '',
    });
  };

  clearthis = () => {
    this.setState({
      selectjcdata: {},
      selectcodedata: {},
      clearflag: true,
      clearflag1: true,
    });
    this.props.form.setFieldsValue({
      collectClientname: '',
      collectCodename: '',
    });
  };

  clearthiscode = () => {
    this.setState({
      selectcodedata: {},
      clearflag1: true,
    });
    this.props.form.setFieldsValue({
      collectCodename: '',
    });
  };

  render() {
    const {
      orderflag,
      selectflag,
      selectdata,
      selectkhflag,
      selectkhdata,
      fileList,
      previewImage,
      previewVisible,
      selectjcflag,
      selectjcdata,
      selectcodeflag,
      selectcodedata,
      sumbitflag,
      khsearchVisible,
      updataflag,
      updataname,
      cphflag,
      selthis,
      selthis1,
      srcimg,
      maxlen,
      minlen,
      cpzim,
      incpzim,
      selwenz,
      selzim,
      selinputcp,
      dingdflag,
      enterType,
      yanbaoflag,
      collecCid
    } = this.state;
    const {
      submitting2,
      submitting1,
      submitting,
      cpBusinessIntentionGet,
      userlist,
      cpClientList,
      cpCollecClientList,
      cpCollecCodeList,
      levellist,
      levellist2,
      newdeptlist,
      dispatch,
      cpClientSearchList,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const cphdata = [
      { id: 1, name: '京' },
      { id: 2, name: '津' },
      { id: 3, name: '沪' },
      { id: 4, name: '渝' },
      { id: 5, name: '冀' },
      { id: 6, name: '豫' },
      { id: 7, name: '云' },
      { id: 8, name: '辽' },
      { id: 9, name: '黑' },
      { id: 10, name: '湘' },
      { id: 11, name: '皖' },
      { id: 12, name: '鲁' },
      { id: 13, name: '新' },
      { id: 14, name: '苏' },
      { id: 15, name: '浙' },
      { id: 16, name: '赣' },
      { id: 17, name: '鄂' },
      { id: 18, name: '桂' },
      { id: 19, name: '甘' },
      { id: 20, name: '晋' },
      { id: 21, name: '蒙' },
      { id: 22, name: '陕' },
      { id: 23, name: '吉' },
      { id: 24, name: '闽' },
      { id: 25, name: '贵' },
      { id: 26, name: '粤' },
      { id: 27, name: '青' },
      { id: 28, name: '藏' },
      { id: 29, name: '川' },
      { id: 30, name: '宁' },
      { id: 31, name: '琼' },
      { id: 32, name: '港' },
      { id: 33, name: '澳' },
      { id: 33, name: '台' },
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const yeardata = [
      {
        key: 0,
        value: 0,
      },
      {
        key: 1,
        value: 1,
      },
      {
        key: 2,
        value: 2,
      },
      {
        key: 3,
        value: 3,
      },
      {
        key: 4,
        value: 4,
      },
      {
        key: 5,
        value: 5,
      },
      {
        key: 6,
        value: 6,
      },
      {
        key: 7,
        value: 7,
      },
      {
        key: 8,
        value: 8,
      },
      {
        key: 9,
        value: 9,
      },
      {
        key: 10,
        value: 10,
      },
    ];
    const monthdata = [
      {
        key: 0,
        value: 0,
      },
      {
        key: 1,
        value: 1,
      },
      {
        key: 2,
        value: 2,
      },
      {
        key: 3,
        value: 3,
      },
      {
        key: 4,
        value: 4,
      },
      {
        key: 5,
        value: 5,
      },
      {
        key: 6,
        value: 6,
      },
      {
        key: 7,
        value: 7,
      },
      {
        key: 8,
        value: 8,
      },
      {
        key: 9,
        value: 9,
      },
      {
        key: 10,
        value: 10,
      },
      {
        key: 11,
        value: 11,
      },
      {
        key: 12,
        value: 12,
      },
    ];
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );

    const that = this;

    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpClientSearchList,
      khsearchVisible,
      that,
    };
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      handleSearch: this.handleSearch,
      handleFormReset: this.handleFormReset,
      userlist,
      levellist,
      levellist2,
      newdeptlist,
      dispatch,
      handleSearchChange: this.handleSearchChange,
      that,
    };
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      cpClientList,
      handleSearchChange: this.handleSearchChange,
      dispatch,
      that,
    };
    const parentMethodsjc = {
      handleAddjc: this.handleAddjc,
      handleModalVisiblejc: this.handleModalVisiblejc,
      selectjc: this.selectjc,
      cpCollecClientList,
      that,
    };
    const parentMethodscode = {
      handleAddcode: this.handleAddcode,
      handleModalVisiblecode: this.handleModalVisiblecode,
      selectcode: this.selectcode,
      cpCollecCodeList,
      selectjcdata,
      dispatch,
      that,
      collecCid
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ position: 'relative' }}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>意向单</div>
          {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.id) && (
            <img
              src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''}
              style={{
                width: '80px',
                height: '80px',
                display: 'inline-block',
                position: 'absolute',
                right: '150px',
                top: '25px',
                zIndex: '1',
              }}
              alt=""
            />
          )}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="订单状态">
                    <Input
                      disabled
                      value={
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.orderStatus)
                          ? cpBusinessIntentionGet.orderStatus === 0 ||
                            cpBusinessIntentionGet.orderStatus === '0'
                            ? '未处理'
                            : cpBusinessIntentionGet.orderStatus === 1 ||
                              cpBusinessIntentionGet.orderStatus === '1'
                              ? '已处理'
                              : cpBusinessIntentionGet.orderStatus === 2 ||
                                cpBusinessIntentionGet.orderStatus === '2'
                                ? '关闭'
                                : ''
                          : ''
                      }
                      style={
                        cpBusinessIntentionGet.orderStatus === 0 ||
                          cpBusinessIntentionGet.orderStatus === '0'
                          ? { color: '#f50' }
                          : cpBusinessIntentionGet.orderStatus === 1 ||
                            cpBusinessIntentionGet.orderStatus === '1'
                            ? { color: '#87d068' }
                            : { color: 'rgb(166, 156, 156)' }
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="意向单号">
                    <Input
                      disabled
                      value={
                        isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.id)
                          ? cpBusinessIntentionGet.id
                          : ''
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="订单分类">
                    {getFieldDecorator('orderType', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.orderType)
                          ? cpBusinessIntentionGet.orderType
                          : '1',
                      rules: [
                        {
                          required: true,
                          message: '请选择订单分类',
                        },
                      ],
                    })(
                      <Select
                        disabled={orderflag}
                        style={{ width: '100%' }}
                        showSearch
                        allowClear
                        onChange={this.seldingd}
                      >
                        {isNotBlank(this.state.orderType) &&
                          this.state.orderType.length > 0 &&
                          this.state.orderType.map(d => (
                            <Option key={d.id} value={d.value}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="业务项目">
                    {getFieldDecorator('project', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.project)
                          ? cpBusinessIntentionGet.project
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择业务项目',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={orderflag}
                        allowClear
                        onChange={this.selectyanbao}
                      >
                        {isNotBlank(this.state.business_project) &&
                          this.state.business_project.length > 0 &&
                          this.state.business_project.map(d => (
                            <Option
                              key={d.id}
                              value={d.value}
                              style={
                                isNotBlank(dingdflag) &&
                                  (dingdflag == 1 || dingdflag == 2) &&
                                  d.value == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce'
                                  ? { display: 'none' }
                                  : { display: 'block' }
                              }
                            >
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="业务渠道">
                    {getFieldDecorator('dicth', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.dicth)
                          ? cpBusinessIntentionGet.dicth
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择业务渠道',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={orderflag}
                        allowClear
                        onChange={this.selectthis}
                      >
                        {isNotBlank(this.state.business_dicth) &&
                          this.state.business_dicth.length > 0 &&
                          this.state.business_dicth.map(d => (
                            <Option key={d.id} value={d.value}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="业务分类">
                    {getFieldDecorator('businessType', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.businessType)
                          ? cpBusinessIntentionGet.businessType
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择业务分类',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={orderflag}
                        allowClear
                        onChange={this.selectthis1}
                      >
                        {isNotBlank(this.state.business_type) &&
                          this.state.business_type.length > 0 &&
                          this.state.business_type.map(d => (
                            <Option
                              key={d.id}
                              value={d.value}
                              style={
                                (isNotBlank(yanbaoflag) &&
                                  (yanbaoflag == 1 ||
                                    yanbaoflag == 'b38f533e-9e41-4590-ab79-43d904012abd' ||
                                    yanbaoflag == 2) &&
                                  (d.value == 1 || d.value == 2)) ||
                                  (isNotBlank(yanbaoflag) &&
                                    yanbaoflag == 3 &&
                                    (d.value == '2974cf91-1496-4417-98a4-7e035c810a93' ||
                                      d.value == 'a2880f76-b804-4058-adcf-da60d7d49de4' ||
                                      d.value == 3 ||
                                      d.value == 4 ||
                                      d.value == 5)) ||
                                  (isNotBlank(yanbaoflag) && yanbaoflag == 4 && d.value == '6') ||
                                  (isNotBlank(yanbaoflag) &&
                                    yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce' &&
                                    d.value == 'a1cf86b2-a6cb-4b46-821b-87fe0e0c15f7')
                                  ? { display: 'block' }
                                  : { display: 'none' }
                              }
                            >
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="结算类型">
                    {getFieldDecorator('settlementType', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.settlementType)
                          ? cpBusinessIntentionGet.settlementType
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择结算类型',
                        },
                      ],
                    })(
                      <Select style={{ width: '100%' }} disabled={orderflag} allowClear>
                        {isNotBlank(this.state.settlement_type) &&
                          this.state.settlement_type.length > 0 &&
                          this.state.settlement_type.map(d => (
                            <Option key={d.id} value={d.value}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                {!(isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce') && (
                  <span>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="委外单号">
                        {getFieldDecorator('outCode', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.outCode)
                              ? cpBusinessIntentionGet.outCode
                              : '',
                          rules: [
                            {
                              required: dingdflag == 2,
                              message: '请输入委外单号',
                            },
                          ],
                        })(<Input disabled={orderflag} />)}
                      </FormItem>
                    </Col>
                    {!(
                      isNotBlank(selthis) &&
                      selthis != 1 &&
                      isNotBlank(selthis1) &&
                      selthis1 != 1
                    ) && (
                        <Col lg={12} md={12} sm={24}>
                          <FormItem {...formItemLayout} label="保险公司">
                            {getFieldDecorator('insuranceCompanyId', {
                              initialValue:
                                isNotBlank(cpBusinessIntentionGet) &&
                                  isNotBlank(cpBusinessIntentionGet.insuranceCompanyId)
                                  ? cpBusinessIntentionGet.insuranceCompanyId
                                  : '',
                              rules: [
                                {
                                  required: selthis == 1,
                                  message: '请选择保险公司',
                                },
                              ],
                            })(
                              <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.props.children.indexOf(input) >= 0
                                }
                                style={{ width: '100%' }}
                                disabled={orderflag}
                                allowClear
                              >
                                {isNotBlank(this.state.insuranceCompany) &&
                                  this.state.insuranceCompany.length > 0 &&
                                  this.state.insuranceCompany.map(d => (
                                    <Option key={d.id} value={d.value}>
                                      {d.label}
                                    </Option>
                                  ))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      )}
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="品牌">
                        {getFieldDecorator('brand', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.brand)
                              ? cpBusinessIntentionGet.brand
                              : '',
                          rules: [
                            {
                              required: false,
                              message: '请选择品牌',
                            },
                          ],
                        })(
                          <Select style={{ width: '100%' }} disabled={orderflag} allowClear>
                            {isNotBlank(this.state.brand) &&
                              this.state.brand.length > 0 &&
                              this.state.brand.map(d => (
                                <Option key={d.id} value={d.value}>
                                  {d.label}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    {!(
                      isNotBlank(selthis) &&
                      selthis != 2 &&
                      isNotBlank(selthis1) &&
                      selthis1 != 1
                    ) && (
                        <Col lg={12} md={12} sm={24}>
                          <FormItem {...formItemLayout} label="集采客户">
                            {getFieldDecorator('collectClientname', {
                              rules: [
                                {
                                  required: selthis == 2,
                                  message: '请选择集采客户',
                                },
                              ],
                            })(<Input style={{ width: '50%' }} disabled />)}
                            <span>
                              {/* <CloseOutlined style={{ margin: '0 6px' }}  /> */}
                              <Icon type="close" onClick={this.clearthis} style={{ margin: '0 6px' }} />
                              <Button
                                type="primary"
                                style={{ marginLeft: '8px' }}
                                onClick={this.onselectjc}
                                loading={submitting}
                                disabled={orderflag}
                              >
                                选择
                            </Button>
                            </span>
                          </FormItem>
                        </Col>
                      )}
                    {!(
                      isNotBlank(selthis) &&
                      selthis != 2 &&
                      isNotBlank(selthis1) &&
                      selthis1 != 1
                    ) && (
                        <Col lg={12} md={12} sm={24}>
                          <FormItem {...formItemLayout} label="集采编码">
                            {getFieldDecorator('collectCodename', {
                              rules: [
                                {
                                  required:
                                    selthis == 2 &&
                                    isNotBlank(cpCollecCodeList) &&
                                    isNotBlank(cpCollecCodeList.list) &&
                                    cpCollecCodeList.list.length > 0,
                                  message: '请选择集采编码',
                                },
                              ],
                            })(<Input style={{ width: '50%' }} disabled />)}
                            <span>
                              {/* <CloseOutlined style={{ margin: '0 6px' }} onClick={this.clearthiscode} /> */}
                              <Icon type="close" onClick={this.clearthiscode} style={{ margin: '0 6px' }} />
                              <Button
                                type="primary"
                                style={{ marginLeft: '8px' }}
                                onClick={this.onselectcode}
                                loading={submitting}
                                disabled={orderflag || !isNotBlank(selectcodedata)}
                              >
                                选择
                            </Button>
                            </span>
                          </FormItem>
                        </Col>
                      )}
                  </span>
                )}
              </Row>
            </Card>
            <Card title="业务员信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="业务员">
                    {getFieldDecorator('ywy', {
                      rules: [
                        {
                          required: true,
                          message: '请选择业务员',
                        },
                      ],
                    })(<Input style={{ width: '50%' }} disabled />)}
                    <Button
                      type="primary"
                      style={{ marginLeft: '8px' }}
                      onClick={this.onselect}
                      loading={submitting}
                      disabled={orderflag}
                    >
                      选择
                    </Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="编号">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectdata) && isNotBlank(selectdata.no)
                          ? selectdata.no
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.user)
                            ? cpBusinessIntentionGet.user.no
                            : getStorage('userno')
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系方式">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectdata) && isNotBlank(selectdata.phone)
                          ? selectdata.no
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.user)
                            ? cpBusinessIntentionGet.user.phone
                            : getStorage('phone')
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="所属大区">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectdata) && isNotBlank(selectdata.area)
                          ? selectdata.area.name
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.user) &&
                            isNotBlank(cpBusinessIntentionGet.user.area)
                            ? cpBusinessIntentionGet.user.area.name
                            : getStorage('companyname')
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="所属公司">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectdata) && isNotBlank(selectdata.companyName)
                          ? selectdata.companyName
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.user) &&
                            isNotBlank(cpBusinessIntentionGet.user.office)
                            ? cpBusinessIntentionGet.user.office.name
                            : getStorage('companyname')
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="所属区域">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectdata) && isNotBlank(selectdata.areaName)
                          ? selectdata.areaName
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.user) &&
                            isNotBlank(cpBusinessIntentionGet.user.areaName)
                            ? cpBusinessIntentionGet.user.areaName
                            : getStorage('areaname')
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="所属部门">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectdata) && isNotBlank(selectdata.dept)
                          ? selectdata.dept.name
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.user) &&
                            isNotBlank(cpBusinessIntentionGet.user.dept)
                            ? cpBusinessIntentionGet.user.dept.name
                            : getStorage('deptname')
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="客户信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  {/* className="allinputstyle" */}
                  <FormItem {...formItemLayout} label="客户" className="allinputstyle">
                    {getFieldDecorator('kh', {
                      rules: [
                        {
                          required: true,
                          message: '请选择客户',
                        },
                      ],
                    })(<Input style={{ width: '50%' }} disabled />)}
                    <Button
                      type="primary"
                      style={{ marginLeft: '8px' }}
                      onClick={this.onselectkh}
                      loading={submitting}
                      disabled={orderflag}
                    >
                      选择
                    </Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name)
                          ? selectkhdata.name
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.client) &&
                            isNotBlank(cpBusinessIntentionGet.client.name)
                            ? cpBusinessIntentionGet.client.name
                            : ''
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="客户分类">
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled
                      value={
                        isNotBlank(selectkhdata) && isNotBlank(selectkhdata.classify)
                          ? selectkhdata.classify
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.client) &&
                            isNotBlank(cpBusinessIntentionGet.client.classify)
                            ? cpBusinessIntentionGet.client.classify
                            : ''
                      }
                    >
                      {isNotBlank(this.state.classify) &&
                        this.state.classify.length > 0 &&
                        this.state.classify.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="客户编号">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectkhdata) && isNotBlank(selectkhdata.code)
                          ? selectkhdata.code
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.client)
                            ? cpBusinessIntentionGet.client.code
                            : ''
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系地址">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectkhdata) && isNotBlank(selectkhdata.address)
                          ? selectkhdata.address
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.client)
                            ? cpBusinessIntentionGet.client.address
                            : ''
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="移动电话">
                    <Input
                      disabled
                      value={
                        isNotBlank(selectkhdata) && isNotBlank(selectkhdata.phone)
                          ? selectkhdata.phone
                          : isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.client)
                            ? cpBusinessIntentionGet.client.phone
                            : ''
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>

            {!(
              (isNotBlank(selthis1) && (selthis1 != 1 && selthis1 != 2 && selthis1 != 6)) ||
              (isNotBlank(yanbaoflag) && yanbaoflag == '3')
            ) && (
                <Card title="总成信息" className={styles.card} bordered={false}>
                  <Row gutter={16}>
                    {!(
                      isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce'
                    ) && (
                        <span>
                          {!(isNotBlank(selthis1) && selthis1 == 2) && (
                            <Col lg={12} md={12} sm={24}>
                              <FormItem {...formItemLayout} label="进场类型">
                                {getFieldDecorator('assemblyEnterType', {
                                  initialValue:
                                    isNotBlank(cpBusinessIntentionGet) &&
                                      isNotBlank(cpBusinessIntentionGet.assemblyEnterType)
                                      ? cpBusinessIntentionGet.assemblyEnterType
                                      : '',
                                  rules: [
                                    {
                                      required: !!(
                                        (selthis == 2 && selthis1 == 1) ||
                                        (isNotBlank(selthis) &&
                                          selthis != 1 &&
                                          selthis != 2 &&
                                          selthis1 == 1)
                                      ),
                                      message: '请输入进场类型',
                                    },
                                  ],
                                })(
                                  <Select
                                    allowClear
                                    disabled={orderflag}
                                    style={{ width: '100%' }}
                                    onChange={this.onselEnterType}
                                  >
                                    {isNotBlank(this.state.approachType) &&
                                      this.state.approachType.length > 0 &&
                                      this.state.approachType.map(d => (
                                        <Option key={d.id} value={d.value}>
                                          {d.label}
                                        </Option>
                                      ))}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          )}
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="总成品牌">
                              {getFieldDecorator('assemblyBrand', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblyBrand)
                                    ? cpBusinessIntentionGet.assemblyBrand
                                    : '',
                                rules: [
                                  {
                                    required: !!(
                                      isNotBlank(selthis) &&
                                      selthis != 1 &&
                                      selthis != 2 &&
                                      selthis1 == 1
                                    ),
                                    message: '请输入总成品牌',
                                  },
                                ],
                              })(<Input disabled={orderflag} />)}
                            </FormItem>
                          </Col>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="车型/排量">
                              {getFieldDecorator('assemblyVehicleEmissions', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblyVehicleEmissions)
                                    ? cpBusinessIntentionGet.assemblyVehicleEmissions
                                    : '',
                                rules: [
                                  {
                                    required: !!(
                                      (selthis == 2 && selthis1 == 1) ||
                                      (isNotBlank(selthis) &&
                                        selthis != 1 &&
                                        selthis != 2 &&
                                        selthis1 == 1)
                                    ),
                                    message: '请输入车型/排量',
                                  },
                                ],
                              })(<Input disabled={orderflag} />)}
                            </FormItem>
                          </Col>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="年份">
                              {getFieldDecorator('assemblyYear', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblyYear)
                                    ? cpBusinessIntentionGet.assemblyYear
                                    : '',
                                rules: [
                                  {
                                    required: false,
                                    message: '请输入年份',
                                  },
                                ],
                              })(<Input disabled={orderflag} />)}
                            </FormItem>
                          </Col>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="总成型号">
                              {getFieldDecorator('assemblyModel', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblyModel)
                                    ? cpBusinessIntentionGet.assemblyModel
                                    : '',
                                rules: [
                                  {
                                    required: !(isNotBlank(selthis1) && selthis1 == 6),
                                    message: '请输入总成型号',
                                  },
                                ],
                              })(<Input disabled={orderflag} />)}
                            </FormItem>
                          </Col>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="钢印号">
                              {getFieldDecorator('assemblySteelSeal', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblySteelSeal)
                                    ? cpBusinessIntentionGet.assemblySteelSeal
                                    : '',
                                rules: [
                                  {
                                    required: false,
                                    message: '请输入钢印号',
                                  },
                                ],
                              })(<Input disabled={orderflag && updataflag} />)}
                            </FormItem>
                          </Col>
                        </span>
                      )}
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="VIN码">
                        {getFieldDecorator('assemblyVin', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.assemblyVin)
                              ? cpBusinessIntentionGet.assemblyVin
                              : '',
                          rules: [
                            {
                              required: !!(
                                isNotBlank(selthis) &&
                                selthis != 1 &&
                                selthis != 2 &&
                                selthis1 == 1
                              ),
                              message: '请输入17位的VIN码',
                              max: 17,
                              min: 17,
                            },
                          ],
                        })(
                          <Input
                            placeholder="请输入17位VIN码"
                            disabled={orderflag && updataflag}
                            onChange={e => this.limitnumber(e)}
                          />
                        )}
                      </FormItem>
                    </Col>
                    {!(
                      isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce'
                    ) && (
                        <span>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="其他识别信息">
                              {getFieldDecorator('assemblyMessage', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblyMessage)
                                    ? cpBusinessIntentionGet.assemblyMessage
                                    : '',
                                rules: [
                                  {
                                    required: false,
                                    message: '请输入其他识别信息',
                                  },
                                ],
                              })(<Input disabled={orderflag && updataflag} />)}
                            </FormItem>
                          </Col>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="故障代码">
                              {getFieldDecorator('assemblyFaultCode', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblyFaultCode)
                                    ? cpBusinessIntentionGet.assemblyFaultCode
                                    : '',
                                rules: [
                                  {
                                    required: false,
                                    message: '请输入故障代码',
                                  },
                                ],
                              })(<Input disabled={orderflag && updataflag} />)}
                            </FormItem>
                          </Col>
                          <Col lg={24} md={24} sm={24}>
                            <FormItem
                              {...formItemLayout}
                              label="本次故障描述"
                              className="allinputstyle"
                            >
                              {getFieldDecorator('assemblyErrorDescription', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.assemblyErrorDescription)
                                    ? cpBusinessIntentionGet.assemblyErrorDescription
                                    : '',
                                rules: [
                                  {
                                    required: !!(
                                      isNotBlank(selthis) &&
                                      selthis != 1 &&
                                      selthis != 2 &&
                                      selthis1 == 1
                                    ),
                                    message: '请输入本次故障描述',
                                  },
                                ],
                              })(<TextArea disabled={orderflag && updataflag} />)}
                            </FormItem>
                          </Col>
                        </span>
                      )}
                    <Col lg={24} md={24} sm={24}>
                      <FormItem {...formItemLayout} label="照片上传" className="allimgstyle">
                        <Upload
                          disabled={orderflag && updataflag}
                          accept="image/*"
                          onChange={this.handleUploadChange}
                          onRemove={this.handleRemove}
                          beforeUpload={this.handlebeforeUpload}
                          fileList={fileList}
                          listType="picture-card"
                          onPreview={this.handlePreview}
                        >
                          {(isNotBlank(fileList) && fileList.length >= 9) || (orderflag && updataflag)
                            ? null
                            : uploadButton}
                        </Upload>
                      </FormItem>
                    </Col>
                  </Row>
                </Card>
              )}
            {!(
              (isNotBlank(selthis) && isNotBlank(selthis1) && selthis1 == 2) ||
              (isNotBlank(selthis1) && selthis1 == 1) ||
              (isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce')
            ) && (
                <Card title="配件信息" className={styles.card} bordered={false}>
                  <Row gutter={16}>
                    <Col lg={24} md={24} sm={24}>
                      <FormItem {...formItemLayout} label="销售明细" className="allinputstyle">
                        {getFieldDecorator('salesParticular', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.salesParticular)
                              ? cpBusinessIntentionGet.salesParticular
                              : '',
                          rules: [
                            {
                              required: !!(isNotBlank(selthis1) && selthis1 != 1),
                              message: '请输入销售明细',
                            },
                          ],
                        })(<TextArea disabled={orderflag && updataflag} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Card>
              )}
            <Card title="一级信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="意向单价">
                    {getFieldDecorator('intentionPrice', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.intentionPrice)
                          ? getPrice(cpBusinessIntentionGet.intentionPrice)
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入意向单价',
                        },
                      ],
                    })(
                      <InputNumber
                        disabled={orderflag}
                        style={{ width: '100%' }}
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        precision={2}
                        max={100000000}
                        min={0}
                      />
                    )}
                  </FormItem>
                </Col>
                {!(
                  isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce'
                ) && (
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="交货时间">
                        {getFieldDecorator('deliveryDate', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.deliveryDate)
                              ? moment(cpBusinessIntentionGet.deliveryDate)
                              : null,
                          rules: [
                            {
                              required: true,
                              message: '请选择交货时间',
                            },
                          ],
                        })(
                          <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: '100%' }}
                            disabled={orderflag}
                          />
                        )}
                      </FormItem>
                    </Col>
                  )}
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="付款方式">
                    {getFieldDecorator('paymentMethod', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.paymentMethod)
                          ? cpBusinessIntentionGet.paymentMethod
                          : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择付款方式',
                        },
                      ],
                    })(
                      <Select
                        disabled={orderflag && updataflag}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        {isNotBlank(this.state.payment_methodd) &&
                          this.state.payment_methodd.length > 0 &&
                          this.state.payment_methodd.map(d => (
                            <Option key={d.id} value={d.value}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                {!(
                  (isNotBlank(selthis1) && selthis1 != 2 && selthis1 != 1) ||
                  (isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce')
                ) && (
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="旧件需求">
                        {getFieldDecorator('oldNeed', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.oldNeed)
                              ? cpBusinessIntentionGet.oldNeed
                              : '',
                          rules: [
                            {
                              required: !!(
                                (selthis == 2 && selthis1 == 1) ||
                                (isNotBlank(selthis) &&
                                  selthis != 1 &&
                                  selthis != 2 &&
                                  selthis1 == 1) ||
                                (isNotBlank(selthis) && selthis1 == 2)
                              ),
                              message: '请选择旧件需求',
                            },
                          ],
                        })(
                          <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                            {isNotBlank(this.state.old_need) &&
                              this.state.old_need.length > 0 &&
                              this.state.old_need.map(d => (
                                <Option key={d.id} value={d.value}>
                                  {d.label}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  )}
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="开票需求">
                    {getFieldDecorator('makeNeed', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.makeNeed)
                          ? cpBusinessIntentionGet.makeNeed
                          : '',
                      rules: [
                        {
                          required: !!(
                            (selthis == 1 && selthis1 == 1) ||
                            (selthis == 2 && selthis1 == 1) ||
                            (isNotBlank(selthis) &&
                              selthis != 1 &&
                              selthis != 2 &&
                              selthis1 == 1) ||
                            (isNotBlank(selthis) && selthis1 == 2) ||
                            (isNotBlank(selthis1) && (selthis1 != 2 || selthis1 != 1))
                          ),
                          message: '请输入开票需求',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        disabled={orderflag && updataflag}
                      >
                        {isNotBlank(this.state.make_need) &&
                          this.state.make_need.length > 0 &&
                          this.state.make_need.map(d => (
                            <Option key={d.id} value={d.value}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="质保时间">
                    {getFieldDecorator('zbtime', {
                      rules: [
                        {
                          // required: !!((selthis == 1 && selthis1 == 1) || (selthis == 2 && selthis1 == 1) || (isNotBlank(selthis) && selthis != 1 && selthis != 2 && selthis1 == 1)
                          // 	|| (isNotBlank(selthis) && selthis1 == 2) || (isNotBlank(selthis1) && (selthis1 != 2 || selthis1 != 1))),
                          required: true,
                          message: '请选择质保时间',
                        },
                      ],
                    })(
                      <div>
                        <Select
                          allowClear
                          style={{ width: '50%' }}
                          disabled={orderflag}
                          value={`${this.state.selectyear} 年`}
                          onChange={this.editYear}
                        >
                          {isNotBlank(yeardata) &&
                            yeardata.length > 0 &&
                            yeardata.map(d => (
                              <Option key={d.key} value={d.key}>
                                {d.value}
                              </Option>
                            ))}
                        </Select>
                        <Select
                          allowClear
                          style={{ width: '50%' }}
                          disabled={orderflag}
                          value={`${this.state.selectmonth} 月`}
                          onChange={this.editMonth}
                        >
                          {isNotBlank(monthdata) &&
                            monthdata.length > 0 &&
                            monthdata.map(d => (
                              <Option key={d.key} value={d.key}>
                                {d.value}
                              </Option>
                            ))}
                        </Select>
                      </div>
                    )}
                  </FormItem>
                </Col>
                {!(
                  isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce'
                ) && (
                    <span>
                      <Col lg={12} md={12} sm={24}>
                        <FormItem {...formItemLayout} label="质量要求">
                          {getFieldDecorator('qualityNeed', {
                            initialValue:
                              isNotBlank(cpBusinessIntentionGet) &&
                                isNotBlank(cpBusinessIntentionGet.qualityNeed)
                                ? cpBusinessIntentionGet.qualityNeed
                                : '',
                            rules: [
                              {
                                required: true,
                                message: '请选择质量要求',
                              },
                            ],
                          })(
                            <Select
                              allowClear
                              style={{ width: '100%' }}
                              disabled={orderflag && updataflag}
                            >
                              {isNotBlank(this.state.quality_need) &&
                                this.state.quality_need.length > 0 &&
                                this.state.quality_need.map(d => (
                                  <Option key={d.id} value={d.value}>
                                    {d.label}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      {!(isNotBlank(selthis1) && selthis1 != 2 && selthis1 != 1) && (
                        <span>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="油品要求">
                              {getFieldDecorator('oilsNeed', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.oilsNeed)
                                    ? cpBusinessIntentionGet.oilsNeed
                                    : '',
                                rules: [
                                  {
                                    required: !!(
                                      (selthis == 1 && selthis1 == 1) ||
                                      (selthis == 2 && selthis1 == 1) ||
                                      (isNotBlank(selthis) &&
                                        selthis != 1 &&
                                        selthis != 2 &&
                                        selthis1 == 1) ||
                                      (isNotBlank(selthis) && selthis1 == 2)
                                    ),
                                    message: '请选择油品要求',
                                  },
                                ],
                              })(
                                <Select
                                  allowClear
                                  style={{ width: '100%' }}
                                  disabled={orderflag && updataflag}
                                >
                                  {isNotBlank(this.state.oils_need) &&
                                    this.state.oils_need.length > 0 &&
                                    this.state.oils_need.map(d => (
                                      <Option key={d.id} value={d.value}>
                                        {d.label}
                                      </Option>
                                    ))}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="外观要求">
                              {getFieldDecorator('guiseNeed', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.guiseNeed)
                                    ? cpBusinessIntentionGet.guiseNeed
                                    : '',
                                rules: [
                                  {
                                    required: !!(
                                      (selthis == 2 && selthis1 == 1) ||
                                      (isNotBlank(selthis) &&
                                        selthis != 1 &&
                                        selthis != 2 &&
                                        selthis1 == 1) ||
                                      (isNotBlank(selthis) && selthis1 == 2)
                                    ),
                                    message: '请选择外观要求',
                                  },
                                ],
                              })(
                                <Select
                                  allowClear
                                  style={{ width: '100%' }}
                                  disabled={orderflag && updataflag}
                                >
                                  {isNotBlank(this.state.guise_need) &&
                                    this.state.guise_need.length > 0 &&
                                    this.state.guise_need.map(d => (
                                      <Option key={d.id} value={d.value}>
                                        {d.label}
                                      </Option>
                                    ))}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={12} md={12} sm={24}>
                            <FormItem {...formItemLayout} label="安装指导">
                              {getFieldDecorator('installationGuide', {
                                initialValue:
                                  isNotBlank(cpBusinessIntentionGet) &&
                                    isNotBlank(cpBusinessIntentionGet.installationGuide)
                                    ? cpBusinessIntentionGet.installationGuide
                                    : '',
                                rules: [
                                  {
                                    required: !!(
                                      (selthis == 2 && selthis1 == 1) ||
                                      (isNotBlank(selthis) &&
                                        selthis != 1 &&
                                        selthis != 2 &&
                                        selthis1 == 1) ||
                                      (isNotBlank(selthis) && selthis1 == 2)
                                    ),
                                    message: '请选择安装指导',
                                  },
                                ],
                              })(
                                <Select
                                  allowClear
                                  style={{ width: '100%' }}
                                  disabled={orderflag && updataflag}
                                >
                                  {isNotBlank(this.state.installation_guide) &&
                                    this.state.installation_guide.length > 0 &&
                                    this.state.installation_guide.map(d => (
                                      <Option key={d.id} value={d.value}>
                                        {d.label}
                                      </Option>
                                    ))}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </span>
                      )}
                      <Col lg={12} md={12} sm={24}>
                        <FormItem {...formItemLayout} label="物流要求">
                          {getFieldDecorator('logisticsNeed', {
                            initialValue:
                              isNotBlank(cpBusinessIntentionGet) &&
                                isNotBlank(cpBusinessIntentionGet.logisticsNeed)
                                ? cpBusinessIntentionGet.logisticsNeed
                                : '',
                            rules: [
                              {
                                required: true,
                                message: '请输入物流要求',
                              },
                            ],
                          })(
                            <Select
                              allowClear
                              style={{ width: '100%' }}
                              disabled={orderflag && updataflag}
                            >
                              {isNotBlank(this.state.logisticsNeed) &&
                                this.state.logisticsNeed.length > 0 &&
                                this.state.logisticsNeed.map(d => (
                                  <Option key={d.id} value={d.value}>
                                    {d.label}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </span>
                  )}
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="其他约定事项" className="allinputstyle">
                    {getFieldDecorator('otherBuiness', {
                      initialValue:
                        isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.otherBuiness)
                          ? cpBusinessIntentionGet.otherBuiness
                          : '',
                      rules: [
                        {
                          required: !!(
                            isNotBlank(yanbaoflag) &&
                            yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce'
                          ),
                          message: '请输入其他约定事项',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>

                {isNotBlank(yanbaoflag) && yanbaoflag == '3' && (
                  <Col lg={24} md={24} sm={24}>
                    <FormItem {...formItemLayout} label="照片上传" className="allimgstyle">
                      <Upload
                        disabled={orderflag && updataflag}
                        accept="image/*"
                        onChange={this.handleUploadChange}
                        onRemove={this.handleRemove}
                        beforeUpload={this.handlebeforeUpload}
                        fileList={fileList}
                        listType="picture-card"
                        onPreview={this.handlePreview}
                      >
                        {(isNotBlank(fileList) && fileList.length >= 9) || (orderflag && updataflag)
                          ? null
                          : uploadButton}
                      </Upload>
                    </FormItem>
                  </Col>
                )}

                {isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce' && (
                  <span>
                    <Col lg={24} md={24} sm={24}>
                      <FormItem {...formItemLayout} label="车牌号" className="allinputstyle">
                        {getFieldDecorator('cphao', {
                          initialValue: '',
                          rules: [
                            {
                              required: false,
                              message: '请输入车牌号',
                            },
                          ],
                        })(
                          <span>
                            <Select
                              allowClear
                              disabled={orderflag && updataflag}
                              onChange={this.showcpwenz}
                              style={{ width: '30%' }}
                              value={selwenz}
                            >
                              {isNotBlank(cphdata) &&
                                cphdata.length > 0 &&
                                cphdata.map(d => (
                                  <Option key={d.id} value={d.name}>
                                    {d.name}
                                  </Option>
                                ))}
                            </Select>
                            <Select
                              allowClear
                              disabled={orderflag && updataflag}
                              onChange={this.showcpzim}
                              style={{ width: '30%' }}
                              value={selzim}
                            >
                              {isNotBlank(incpzim) &&
                                incpzim.length > 0 &&
                                incpzim.map(d => (
                                  <Option key={d.name} value={d.name}>
                                    {d.name}
                                  </Option>
                                ))}
                            </Select>
                            <Input
                              placeholder="请输入5位车牌号"
                              onChange={this.showinputcp}
                              disabled={orderflag && updataflag}
                              style={{ width: '40%' }}
                              value={selinputcp}
                            />
                          </span>
                        )}
                      </FormItem>
                    </Col>
                    {isNotBlank(yanbaoflag) &&
                      yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce' &&
                      isNotBlank(selthis1) &&
                      selthis1 == 'a1cf86b2-a6cb-4b46-821b-87fe0e0c15f7' && (
                        <Col lg={24} md={24} sm={24}>
                          <FormItem {...formItemLayout} label="照片上传" className="allimgstyle">
                            <Upload
                              disabled={orderflag && updataflag}
                              accept="image/*"
                              onChange={this.handleUploadChange}
                              onRemove={this.handleRemove}
                              beforeUpload={this.handlebeforeUpload}
                              fileList={fileList || []}
                              listType="picture-card"
                              onPreview={this.handlePreview}
                            >
                              {(isNotBlank(fileList) && fileList.length >= 9) ||
                                (orderflag && updataflag)
                                ? null
                                : uploadButton}
                            </Upload>
                          </FormItem>
                        </Col>
                      )}
                    <Col lg={24} md={24} sm={24}>
                      <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                        {getFieldDecorator('remarks', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.remarks)
                              ? cpBusinessIntentionGet.remarks
                              : '',
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
                  </span>
                )}
              </Row>
            </Card>

            {!(isNotBlank(yanbaoflag) && yanbaoflag == '3f47010a-0c00-48a2-9a39-eabc17ecc7ce') && (
              <Card title="其他信息" className={styles.card} bordered={false}>
                <Row gutter={16}>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label="维修项目">
                      {getFieldDecorator('maintenanceProject', {
                        initialValue:
                          isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.maintenanceProject)
                            ? cpBusinessIntentionGet.maintenanceProject
                            : '',
                        rules: [
                          {
                            required: !!(
                              (selthis == 1 && selthis1 == 1) ||
                              (selthis == 2 && selthis1 == 1) ||
                              (isNotBlank(selthis) &&
                                selthis != 1 &&
                                selthis != 2 &&
                                selthis1 == 1) ||
                              (isNotBlank(selthis) && selthis1 == 2) ||
                              (isNotBlank(selthis1) && (selthis1 != 2 || selthis1 != 1))
                            ),
                            message: '请选择维修项目',
                          },
                        ],
                      })(
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          disabled={orderflag}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children.indexOf(input) >= 0
                          }
                        >
                          {isNotBlank(this.state.maintenance_project) &&
                            this.state.maintenance_project.length > 0 &&
                            this.state.maintenance_project.map(d => (
                              <Option key={d.id} value={d.value}>
                                {d.label}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  {((isNotBlank(selthis) &&
                    selthis != 1 &&
                    selthis != 2 &&
                    isNotBlank(selthis1) &&
                    selthis1 == 1) ||
                    (isNotBlank(selthis1) && selthis1 == 1) ||
                    !isNotBlank(selthis1)) && (
                      <Col lg={12} md={12} sm={24}>
                        <FormItem {...formItemLayout} label="行程里程">
                          {getFieldDecorator('tripMileage', {
                            initialValue:
                              isNotBlank(cpBusinessIntentionGet) &&
                                isNotBlank(cpBusinessIntentionGet.tripMileage)
                                ? cpBusinessIntentionGet.tripMileage
                                : '',
                            rules: [
                              {
                                required: !!(
                                  isNotBlank(selthis) &&
                                  selthis != 1 &&
                                  selthis != 2 &&
                                  selthis1 == 1
                                ),
                                message: '请输入行程里程',
                              },
                            ],
                          })(<Input disabled={orderflag && updataflag} style={{ width: '100%' }} />)}
                        </FormItem>
                      </Col>
                    )}

                  {((isNotBlank(selthis) &&
                    selthis != 1 &&
                    selthis != 2 &&
                    isNotBlank(selthis1) &&
                    selthis1 == 1) ||
                    (isNotBlank(selthis1) && (selthis1 == 1 || selthis1 == 2 || selthis1 == 6)) ||
                    !isNotBlank(selthis1) ||
                    (isNotBlank(yanbaoflag) && yanbaoflag == '1')) && (
                      <Col lg={24} md={24} sm={24}>
                        <FormItem {...formItemLayout} label="车牌号" className="allinputstyle">
                          {getFieldDecorator('cphao', {
                            initialValue: '',
                            rules: [
                              {
                                required: !!(isNotBlank(enterType) && enterType == 1),
                                message: '请输入车牌号',
                              },
                            ],
                          })(
                            <span>
                              <Select
                                allowClear
                                disabled={orderflag && updataflag}
                                onChange={this.showcpwenz}
                                style={{ width: '30%' }}
                                value={selwenz}
                              >
                                {isNotBlank(cphdata) &&
                                  cphdata.length > 0 &&
                                  cphdata.map(d => (
                                    <Option key={d.id} value={d.name}>
                                      {d.name}
                                    </Option>
                                  ))}
                              </Select>
                              <Select
                                allowClear
                                disabled={orderflag && updataflag}
                                onChange={this.showcpzim}
                                style={{ width: '30%' }}
                                value={selzim}
                              >
                                {isNotBlank(incpzim) &&
                                  incpzim.length > 0 &&
                                  incpzim.map(d => (
                                    <Option key={d.name} value={d.name}>
                                      {d.name}
                                    </Option>
                                  ))}
                              </Select>
                              <Input
                                placeholder="请输入5位车牌号"
                                onChange={this.showinputcp}
                                disabled={orderflag && updataflag}
                                style={{ width: '40%' }}
                                value={selinputcp}
                              />
                            </span>
                          )}
                        </FormItem>
                      </Col>
                    )}

                  {((isNotBlank(selthis) &&
                    selthis != 1 &&
                    selthis != 2 &&
                    isNotBlank(selthis1) &&
                    selthis1 == 1) ||
                    (isNotBlank(selthis1) && selthis1 == 1) ||
                    !isNotBlank(selthis1)) && (
                      <span>
                        <Col lg={12} md={12} sm={24}>
                          <FormItem {...formItemLayout} label="是否拍照">
                            {getFieldDecorator('isPhotograph', {
                              initialValue:
                                isNotBlank(cpBusinessIntentionGet) &&
                                  isNotBlank(cpBusinessIntentionGet.isPhotograph)
                                  ? cpBusinessIntentionGet.isPhotograph
                                  : '4',
                              rules: [
                                {
                                  required: !!(
                                    (selthis == 2 && selthis1 == 1) ||
                                    (isNotBlank(selthis) &&
                                      selthis != 1 &&
                                      selthis != 2 &&
                                      selthis1 == 1)
                                  ),
                                  message: '请选择是否拍照',
                                },
                              ],
                            })(
                              <Select
                                allowClear
                                style={{ width: '100%' }}
                                disabled={orderflag && updataflag}
                              >
                                {isNotBlank(this.state.is_photograph) &&
                                  this.state.is_photograph.length > 0 &&
                                  this.state.is_photograph.map(d => (
                                    <Option key={d.id} value={d.value}>
                                      {d.label}
                                    </Option>
                                  ))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </span>
                    )}
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label="定损员">
                      {getFieldDecorator('partFee', {
                        initialValue:
                          isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.partFee)
                            ? cpBusinessIntentionGet.partFee
                            : '',
                        rules: [
                          {
                            required: false,
                            message: '请输入定损员',
                          },
                        ],
                      })(<Input disabled={orderflag && updataflag} />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label="事故单号">
                      {getFieldDecorator('accidentNumber', {
                        initialValue:
                          isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.accidentNumber)
                            ? cpBusinessIntentionGet.accidentNumber
                            : '',
                        rules: [
                          {
                            required: false,
                            message: '请输入事故单号',
                          },
                        ],
                      })(<Input disabled={orderflag && updataflag} />)}
                    </FormItem>
                  </Col>

                  <Col lg={24} md={24} sm={24}>
                    <FormItem {...formItemLayout} label="发货地址" className="allinputstyle">
                      {getFieldDecorator('shipAddress', {
                        initialValue:
                          isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.shipAddress)
                            ? cpBusinessIntentionGet.shipAddress
                            : '',
                        rules: [
                          {
                            required: !!(
                              (selthis == 1 && selthis1 == 1) ||
                              (selthis == 2 && selthis1 == 1) ||
                              (isNotBlank(selthis) &&
                                selthis != 1 &&
                                selthis != 2 &&
                                selthis1 == 1) ||
                              (isNotBlank(selthis) && selthis1 == 2) ||
                              (isNotBlank(selthis1) && (selthis1 != 2 || selthis1 != 1))
                            ),
                            message: '请输入发货地址',
                          },
                        ],
                      })(<TextArea disabled={orderflag && updataflag} />)}
                    </FormItem>
                  </Col>
                  {!(isNotBlank(selthis1) && (selthis1 != 2 && selthis1 != 1)) && (
                    <Col lg={24} md={24} sm={24}>
                      <FormItem {...formItemLayout} label="维修历史" className="allinputstyle">
                        {getFieldDecorator('maintenanceHistory', {
                          initialValue:
                            isNotBlank(cpBusinessIntentionGet) &&
                              isNotBlank(cpBusinessIntentionGet.maintenanceHistory)
                              ? cpBusinessIntentionGet.maintenanceHistory
                              : '',
                          rules: [
                            {
                              required: true,
                              message: '请输入维修历史',
                            },
                          ],
                        })(<TextArea disabled={orderflag && updataflag} />)}
                      </FormItem>
                    </Col>
                  )}
                  {!(
                    (isNotBlank(selthis) && isNotBlank(selthis1) && selthis1 == 2) ||
                    (isNotBlank(selthis1) && (selthis1 != 2 && selthis1 != 1))
                  ) && (
                      <Col lg={24} md={24} sm={24}>
                        <FormItem {...formItemLayout} label="事故说明" className="allinputstyle">
                          {getFieldDecorator('accidentExplain', {
                            initialValue:
                              isNotBlank(cpBusinessIntentionGet) &&
                                isNotBlank(cpBusinessIntentionGet.accidentExplain)
                                ? cpBusinessIntentionGet.accidentExplain
                                : '',
                            rules: [
                              {
                                required: !!(selthis == 1 && selthis1 == 1),
                                message: '请输入事故说明',
                              },
                            ],
                          })(<TextArea disabled={orderflag && updataflag} />)}
                        </FormItem>
                      </Col>
                    )}
                  <Col lg={24} md={24} sm={24}>
                    <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                      {getFieldDecorator('remarks', {
                        initialValue:
                          isNotBlank(cpBusinessIntentionGet) &&
                            isNotBlank(cpBusinessIntentionGet.remarks)
                            ? cpBusinessIntentionGet.remarks
                            : '',
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
              </Card>
            )}
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.id) && (
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                  打印
                </Button>
              )}
              {isNotBlank(getStorage('menulist')) &&
                JSON.parse(getStorage('menulist')).filter(
                  item => item.target == 'cpBusinessIntention'
                ).length > 0 &&
                JSON.parse(getStorage('menulist'))
                  .filter(item => item.target == 'cpBusinessIntention')[0]
                  .children.filter(item => item.name == '二次修改').length > 0 && (
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    onClick={this.onupdata}
                    disabled={!orderflag}
                  >
                    {updataname}
                  </Button>
                )}
              {isNotBlank(getStorage('menulist')) &&
                JSON.parse(getStorage('menulist')).filter(
                  item => item.target == 'cpBusinessIntention'
                ).length > 0 &&
                JSON.parse(getStorage('menulist'))
                  .filter(item => item.target == 'cpBusinessIntention')[0]
                  .children.filter(item => item.name == '修改').length > 0 && (
                  <span>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={this.onsave}
                      loading={submitting || submitting1}
                      disabled={orderflag && updataflag}
                    >
                      保存
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      htmlType="submit"
                      loading={submitting1 || submitting2}
                      disabled={orderflag && updataflag}
                    >
                      提交
                    </Button>
                    {(cpBusinessIntentionGet.orderStatus === 1 ||
                      cpBusinessIntentionGet.orderStatus === '1') && (
                        <Button
                          style={{ marginLeft: 8 }}
                          onClick={() => this.onUndo(cpBusinessIntentionGet.id)}
                        >
                          撤销
                        </Button>
                      )}
                  </span>
                )}
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
        <SearchForm {...parentSearchMethods} khsearchVisible={khsearchVisible} />
        <CreateForm {...parentMethods} selectflag={selectflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormjc {...parentMethodsjc} selectjcflag={selectjcflag} />
        <CreateFormcode {...parentMethodscode} selectcodeflag={selectcodeflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpBusinessIntentionForm;

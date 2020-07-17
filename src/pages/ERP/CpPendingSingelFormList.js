import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import { parse, stringify } from 'qs';
import styles from './CpPendingSingelFormList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
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
      searchVisible,
      form: { getFieldDecorator },
      handleSearchVisible,
      cpPendingSingelSearchList,
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
          })(<SearchTableList searchList={cpPendingSingelSearchList} />)}
        </div>
      </Modal>
    );
  }
}
@connect(({ cpPendingSingelForm, loading }) => ({
  ...cpPendingSingelForm,
  loading: loading.models.cpPendingSingelForm,
}))
@Form.create()
class CpPendingSingelFormList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
      formValues: {},
      location: getLocation(),
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    dispatch({
      type: 'cpPendingSingelForm/cpPendingSingelForm_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpPendingSingelForm/cpPendingSingel_SearchList',
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'quote_type',
      },
      callback: data => {
        this.setState({
          quote_type: data
        })
      }
    });
  }

  gotoForm = () => {
    router.push(`/business/process/cp_pending_singel_form_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/business/process/cp_pending_singel_form_form?id=${id}`);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
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
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      ...filters,
    };
    dispatch({
      type: 'cpPendingSingelForm/cpPendingSingelForm_List',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpPendingSingelForm/cpPendingSingelForm_List',
      payload: {
        pageSize: 10,
        genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
        current: 1,
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
    const { selectedRows, formValues } = this.state;
    dispatch({
      type: 'cpPendingSingelForm/cpPendingSingelForm_Delete',
      payload: {
        id
      },
      callback: () => {
        this.setState({
          selectedRows: []
        })
        dispatch({
          type: 'cpPendingSingelForm/cpPendingSingelForm_List',
          payload: {
            pageSize: 10,
            genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
            ...formValues,
          }
        });
      }
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
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

      if (!isNotBlank(values.orderStatus)) {
        values.orderStatus = ''
      }

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpPendingSingelForm/cpPendingSingelForm_List',
        payload: {
          ...values,
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues } = this.state;
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
        type: 'cpPendingSingelForm/cpPendingSingelForm_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpPendingSingelForm/cpPendingSingelForm_List',
            payload: {
              pageSize: 10,
              ...formValues,
            }
          });
        }
      });
    }
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="意向单号">
              {getFieldDecorator('intentionId', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', {
								initialValue: ''
							})(
  <Select  style={{ width: '100%' }} allowClear>
    <Option key={0} value={0}>未处理</Option>
    <Option key={1} value={1}>已处理</Option>
    <Option key={2} value={2}>关闭</Option>
  </Select>
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
              <a style={{ marginLeft: 8 }} onClick={this.handleSearchChange}>
                过滤其他 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('id', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="意向单号">
              {getFieldDecorator('intentionId', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="维修班组">
              {getFieldDecorator('maintenanceCrew.name', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报件类型">
              {getFieldDecorator('quoteType', {
                initialValue: ''
              })(
                <Select
                  style={{ width: '100%' }}

                >
                  <Option key='1' value='1'>总成报件</Option>
                  <Option key='2' value='2'>整车报件</Option>
                  <Option key='3' value='3'>售后报件</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="完成时间">
              {getFieldDecorator('accomplishDate', {
                initialValue: ''
              })(
                <DatePicker style={{ width: '100%' }} />
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

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleFieldChange = (value) => {
    this.setState({
      array: value || []
    })
  }

  handleSearchVisible = (fieldsValue) => {
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChange = () => {
    this.setState({
      searchVisible: true,
    });
  };

  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    console.log(fieldsValue.genTableColumn)
    dispatch({
      type: 'cpPendingSingelForm/cpPendingSingelForm_List',
      payload: {
        ...this.state.formValues,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
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
      dispatch({
        type: 'cpPendingSingelForm/cpPendingSingelForm_List',
        payload: {
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  handleUpldExportClick = type => {
    const { formValues } = this.state;

    const newobj = {...formValues}
    const newkey =  isNotBlank(newobj.maintenanceCrew)&&isNotBlank(newobj.maintenanceCrew.name)?newobj.maintenanceCrew.name:''
    delete newobj.maintenanceCrew

    const params = {
      ...newobj,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      'maintenanceCrew.name':newkey,
      'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : ''
    }
    window.open(`/api/Beauty/beauty/cpPendingSingelForm/export?${stringify(params)}`);
  };

  handleUpldExportClickAll = type => {
    const { formValues } = this.state;

    const newobj = {...formValues}
    const newkey =  isNotBlank(newobj.maintenanceCrew)&&isNotBlank(newobj.maintenanceCrew.name)?newobj.maintenanceCrew.name:''
    delete newobj.maintenanceCrew

    const params = {
      ...newobj,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : '',
      'maintenanceCrew.name':newkey,
      isTemplate: 1
    }
    window.open(`/api/Beauty/beauty/cpPendingSingelForm/export?${stringify(params)}`);
  };

  render() {
    const { selectedRows, searchVisible, array } = this.state;
    const { loading, PendingSingelFormList, cpPendingSingelSearchList } = this.props;
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpPendingSingelSearchList,
    }

    console.log(PendingSingelFormList)

    const shstatus = (apps) => {
      if (apps === '0' || apps === 0) {
        return '待审核'
      }
      if (apps === '1' || apps === 1 || apps === '2' || apps === 2) {
        return '已审核'
      }
    }
    const field = [
      {
        title: '单号',
        dataIndex: 'id',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '意向单号',
        dataIndex: 'intentionId',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
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
        title: '客户',
        dataIndex: 'client.clientCpmpany',
        align: 'center',
        inputType: 'text',
        width: 240,
        editable: true,
        render: (text, record) => {
          if (isNotBlank(record) && isNotBlank(record.type) && (record.type == 4)) {
            return isNotBlank(record.user) && isNotBlank(record.user.name) ? record.user.name : ''
          }
          return isNotBlank(record.client) && isNotBlank(record.client.clientCpmpany) ? record.client.clientCpmpany : ''
        }
      },
      {
        title: '报件类型',
        dataIndex: 'quoteType',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
        render: (text, record) => {
          if (isNotBlank(record) && isNotBlank(record.type) && (record.type == 7 || record.type == 10)) {
            return '售后报件'
          }
          if (isNotBlank(record) && isNotBlank(record.type) && (record.type == 4)) {
            return '内部报件'
          }
          if (isNotBlank(record) && isNotBlank(record.type) && (record.type == 5)) {
            return '配件销售'
          }
          return record.quoteType
        }
      },
      {
        title: '分类',
        align: 'center',
        dataIndex: 'type',
        inputType: 'text',
        width: 100,
        editable: true,
        render: (text) => {
          if (text == 2) {
            return '总成类型'
          } if (text == 1) {
            return '整车类型'
          } if (text == 4) {
            return '内部订单'
          } if (text == 3 || text == 5) {
            return '总成销售'
          }
          if (text == 7 || text == 10) {
            return '售后类型'
          }
          return ''
        }
      },
      {
        title: '维修班组',
        dataIndex: 'maintenanceCrew.name',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '审批进度',
        dataIndex: 'approvals',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
        render: (text) => {
          if (isNotBlank(text)) {
            if (text === 0 || text === '0') {
              return <span style={{ color: "#f50" }}>待分配</span>
            }
            if (text === 1 || text === '1') {
              return <span style={{ color: "#f50" }}>待审核</span>
            }
            if (text === 2 || text === '2') {
              return <span style={{ color: "#f50" }}>待分配</span>
            }
            if (text === 3 || text === '3') {
              return <span style={{ color: "rgb(53, 149, 13)" }}>通过</span>
            }
            if (text === 4 || text === '4') {
              return <span style={{ color: "#f50" }}>驳回</span>
            }
          }
          return '';
        },
      },
      {
        title: '审批人1',
        dataIndex: 'oneUser.name',
        inputType: 'text',
        align: 'center',
        width: 200,
        editable: true,
        render: (text, res) => {
          if (!isNotBlank(text)) {
            return ''
          }
          return `${text} (${isNotBlank(res.oneUser) && isNotBlank(res.oneUser.status) && isNotBlank(res.oneUser.id) ? shstatus(res.oneUser.status) : '待审核'})`
        }
      },
      {
        title: '审批反馈1',
        dataIndex: 'oneUser.remarks',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: (text) => {
          return <span style={{ color: '#1890FF' }}>{text}</span>
        }
      },
      {
        title: '审批人2',
        dataIndex: 'twoUser.name',
        inputType: 'text',
        align: 'center',
        width: 200,
        editable: true,
        render: (text, res) => {
          if (!isNotBlank(text)) {
            return ''
          }
          return `${text} (${isNotBlank(res.twoUser) && isNotBlank(res.twoUser.status) && isNotBlank(res.twoUser.id) ? shstatus(res.twoUser.status) : '待审核'})`
        }
      },
      {
        title: '审批反馈2',
        dataIndex: 'twoUser.remarks',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: (text) => {
          return <span style={{ color: '#1890FF' }}>{text}</span>
        }
      },
      {
        title: '审批人3',
        dataIndex: 'threeUser.name',
        inputType: 'text',
        align: 'center',
        width: 200,
        editable: true,
        render: (text, res) => {
          if (!isNotBlank(text)) {
            return ''
          }
          return `${text} (${isNotBlank(res.threeUser) && isNotBlank(res.threeUser.status) && isNotBlank(res.threeUser.id) ? shstatus(res.threeUser.status) : '待审核'})`
        }
      },
      {
        title: '审批反馈3',
        dataIndex: 'threeUser.remarks',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: (text) => {
          return <span style={{ color: '#1890FF' }}>{text}</span>
        }
      },
      {
        title: '审批人4',
        dataIndex: 'fourUser.name',
        inputType: 'text',
        align: 'center',
        width: 200,
        editable: true,
        render: (text, res) => {
          if (!isNotBlank(text)) {
            return ''
          }
          return `${text} (${isNotBlank(res.fourUser) && isNotBlank(res.fourUser.status) && isNotBlank(res.fourUser.id) ? shstatus(res.fourUser.status) : '待审核'})`
        }
      },
      {
        title: '审批反馈4',
        dataIndex: 'fourUser.remarks',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: (text) => {
          return <span style={{ color: '#1890FF' }}>{text}</span>
        }
      },
      {
        title: '审批人5',
        dataIndex: 'fiveUser.name',
        inputType: 'text',
        align: 'center',
        width: 200,
        editable: true,
        render: (text, res) => {
          if (!isNotBlank(text)) {
            return ''
          }
          return `${text} (${isNotBlank(res.fiveUser) && isNotBlank(res.fiveUser.status) && isNotBlank(res.fiveUser.id) ? shstatus(res.fiveUser.status) : '待审核'})`
        }
      },
      {
        title: '审批反馈5',
        dataIndex: 'fiveUser.remarks',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
        render: (text) => {
          return <span style={{ color: '#1890FF' }}>{text}</span>
        }
      },
      // {
      // 	title: '单号',        
      //   dataIndex: 'odd',
      //   align: 'center' ,    
      // 	inputType: 'text',   
      // 	width: 100,          
      // 	editable:  true  ,      
      // },
      {
        title: '完成时间',
        align: 'center',
        dataIndex: 'accomplishDate',
        editable: true,
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
        title: '故障描述',
        align: 'center',
        dataIndex: 'errorDescription',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '车型/排量',
        align: 'center',
        dataIndex: 'cpAssemblyBuild.vehicleModel',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '总成型号',
        align: 'center',
        dataIndex: 'cpAssemblyBuild.assemblyModel',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '车牌号',
        align: 'center',
        dataIndex: 'plateNumber',
        inputType: 'text',
        width: 100,
        editable: true,
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
        align: 'center',
        editable: true,
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
        title: '所属公司',
        dataIndex: 'createBy.office.name',
        inputType: 'text',
        width: 200,
        align: 'center',
        editable: true,
      }
    ];
    let fieldArray = [];
    if (isNotBlank(array) && array.length > 0) {
      fieldArray = array.map((item) => {
        if (isNotBlank(item) && isNotBlank(field[item])) {
          return field[item]
        }
        return null;
      })
    } else {
      fieldArray = field;
    }
    const columns = [
      {
        title: '详情',
        width: 100,
        align: 'center',
        fixed: 'left',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
          </Fragment>
        ),
      },
      ...fieldArray,
      {
        title: '基础操作',
        width: 100,
        align: 'center',
        render: (text, record) => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '删除')
              .length > 0 ? (
              <Fragment>
                {isNotBlank(record) && isNotBlank(record.approvals) && (record.approvals != 3) ?
                  <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                    <a>删除</a>
                  </Popconfirm>
                  : ''
                }
              </Fragment>
            ) : ''
        },
      },
    ];
    return (
      <PageHeaderWrapper
        title="动态列表展示,默认展示全部."
        content={
          <Select
            mode="multiple"
            style={{ width: '100%', minWidth: 200 }}

            onChange={this.handleFieldChange}
          >
            {
              isNotBlank(field) && field.length > 0 && field.map((item, index) => (
                <Option key={item.dataIndex} value={index}>{item.title}</Option>
              ))
            }
          </Select>
        }
      >
        <div className='liststyle'>
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
            导出
          </Button>
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClickAll()}>
            导出所有
          </Button>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>待处理报件单</div>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                loading={loading}
                data={PendingSingelFormList}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChange}
                onRow={record => {
                  return {
                    onClick: () => {
                      this.setState({
                        rowId: record.id,
                      })
                    },
                  };
                }}
                rowClassName={(record, index) => {
                  if (record.id === this.state.rowId) {
                    return 'selectRow'
                  }
                  if (record.approvals == '3') {
                    return 'greenstyle'
                  }
                  if (record.approvals == '0' || record.approvals == '1' || record.approvals == '2' || record.approvals == '4') {
                    return 'redstyle'
                  }
                  if (record.orderStatus == '2' || record.orderStatus == '已关闭') {
                    return 'graystyle'
                  }
                }
                }
              />
            </div>
          </Card>
        </div>
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpPendingSingelFormList;
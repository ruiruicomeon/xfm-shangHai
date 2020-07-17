import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, message, Modal, Radio
} from 'antd';
import router from 'umi/router';
import { parse, stringify } from 'qs';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getPrice } from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import styles from './CpBusinessIntentionList.less';
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
      CpBusinessIntentionSearchList,
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
          })(<SearchTableList searchList={CpBusinessIntentionSearchList} />)}
        </div>
      </Modal>
    );
  }
}
@connect(({ cpBusinessIntention, loading }) => ({
  ...cpBusinessIntention,
  loading: loading.models.cpBusinessIntention,
}))
@Form.create()
class CpBusinessIntentionList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    visible: false,
    array: [],
    searchVisible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpBusinessIntention/CpBusinessIntention_SearchList',
    });
    dispatch({
      type: 'cpBusinessIntention/cpBusinessIntention_List',
      payload: {
        pageSize: 10,
      }
    });
  }

  gotoForm = () => {
    router.push(`/business/process/cp_business_intention_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/business/process/cp_business_intention_form?id=${id}`);
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
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'cpBusinessIntention/cpBusinessIntention_List',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    // if(this.state.historyfilter){}

    dispatch({
      type: 'cpBusinessIntention/cpBusinessIntention_List',
      payload: {
        genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
        pageSize: 10,
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
        type: 'cpBusinessIntention/cpBusinessIntention_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpBusinessIntention/cpBusinessIntention_List',
            payload: {
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
              pageSize: 10,
              ...formValues,
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
    dispatch({
      type: 'cpBusinessIntention/cpBusinessIntention_List',
      payload: {
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        ...this.state.formValues,
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
      if (!isNotBlank(values.orderStatus)) {
        values.orderStatus = ''
      }
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
        type: 'cpBusinessIntention/cpBusinessIntention_List',
        payload: {
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      visible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props
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
        type: 'cpBusinessIntention/cpBusinessIntention_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpBusinessIntention/cpBusinessIntention_List',
            payload: {
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
            <FormItem label='单号'>
              {getFieldDecorator('sid', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', {
                initialValue: ''
              })(
                <Select style={{ width: '100%' }} allowClear>
                  <Option key={0} value={0}>未处理</Option>
                  <Option key={1} value={1}>已处理</Option>
                  <Option key={2} value={2}>关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button htmlType="submit" type='primary'>
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
            <FormItem label='单号'>
              {getFieldDecorator('sid', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', {
                initialValue: ''
              })(
                <Select style={{ width: '100%' }} allowClear>
                  <Option key={0} value={0}>未处理</Option>
                  <Option key={1} value={1}>已处理</Option>
                  <Option key={2} value={2}>关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='车牌号'>
              {getFieldDecorator('plateNumber', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户">
              {getFieldDecorator('client.clientCpmpany', {
                initialValue: ''
              })(
                <Input />
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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleFieldChange = (value) => {
    this.setState({
      array: value || []
    })
  }

  setClassName = (record, index) => {
    return (record.orderStatus === '未处理' ? styles.red : styles.green)
  }


  handleUpldExportClick = type => {
    const { formValues } = this.state;

    const newobj = { ...formValues }
    const newkey = isNotBlank(newobj.client) && isNotBlank(newobj.client.clientCpmpany) ? newobj.client.clientCpmpany : ''
    delete newobj.client

    const params = {
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      ...newobj,
      'client.clientCpmpany': newkey,
      'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : ''
    }
    window.open(`/api/Beauty/beauty/cpBusinessIntention/export?${stringify(params)}`);
  };

  render() {
    const { selectedRows, visible, array, searchVisible } = this.state;
    const { loading, cpBusinessIntentionList, CpBusinessIntentionSearchList } = this.props;
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      CpBusinessIntentionSearchList,
    }
    const field = [
      {
        title: '单号',
        dataIndex: 'id',
        inputType: 'text',
        width: 150,
        align: 'center',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        inputType: 'text',
        width: 100,
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
        title: '采集客户',
        dataIndex: 'collectClientId.name',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '采集编码',
        dataIndex: 'collectCode',
        inputType: 'text',
        width: 100,
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
        title: '客户',
        dataIndex: 'client.clientCpmpany',
        inputType: 'text',
        width: 240,
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
        dataIndex: 'assemblyBrand',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '车型/排量',
        dataIndex: 'assemblyVehicleEmissions',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '年份',
        dataIndex: 'assemblyYear',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '总成型号',
        dataIndex: 'assemblyModel',
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
        title: '销售明细',
        dataIndex: 'salesParticular',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '意向单价',
        dataIndex: 'intentionPrice',
        inputType: 'text',
        width: 100,
        editable: true,
        align: 'center',
        render: text => (getPrice(text))
      },
      {
        title: '交货时间',
        dataIndex: 'deliveryDate',
        editable: true,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
        align: 'center',
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '付款方式',
        dataIndex: 'paymentMethod',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '旧件需求',
        dataIndex: 'oldNeed',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '开票需求',
        dataIndex: 'makeNeed',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '质保项时间',
        dataIndex: 'qualityTime',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
        render: (text) => {
          if (isNotBlank(text)) {
            return `${text.split(',')[0]}年${text.split(',')[1]}个月`
          }
          return ''
        }
      },
      {
        title: '质量要求',
        dataIndex: 'qualityNeed',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '油品要求',
        dataIndex: 'oilsNeed',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '外观要求',
        dataIndex: 'guiseNeed',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '安装指导',
        dataIndex: 'installationGuide',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '物流要求',
        dataIndex: 'logisticsNeed',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '其他约定事项',
        dataIndex: 'otherBuiness',
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
        title: '行程里程',
        dataIndex: 'tripMileage',
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
        title: '是否拍照',
        dataIndex: 'isPhotograph',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '发货地址',
        dataIndex: 'shipAddress',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '维修历史',
        dataIndex: 'maintenanceHistory',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '定损员',
        dataIndex: 'partFee',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '事故单号',
        dataIndex: 'accidentNumber',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '事故说明',
        dataIndex: 'accidentExplain',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '更新时间',
        dataIndex: 'finishDate',
        editable: true,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
        align: 'center',
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '备注信息',
        dataIndex: 'remarks',
        inputType: 'text',
        width: 150,
        align: 'center',
        editable: true,
      },
      {
        title: '所属公司',
        dataIndex: 'createBy.office.name',
        inputType: 'text',
        width: 200,
        align: 'center',
        editable: true,
      },
    ]
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
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessIntention').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessIntention')[0].children.filter(item => item.name == '删除').length > 0 ?
            <Fragment>
              {(record.orderStatus === 0 || record.orderStatus === '0' || record.orderStatus === '未处理') ?
                <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                  <a>删除</a>
                </Popconfirm>
                : ''
              }
            </Fragment> :
            ''
        }
      }
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      visible
    };
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
          <div className={styles.tableListOperator}>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
              导出所有
            </Button>
          </div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
                {
                  isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessIntention').length > 0
                    && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessIntention')[0].children.filter(item => item.name == '修改').length > 0 ?
                    <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                      新建
                    </Button>
                    :
                    <Button icon="plus" type="primary" style={{ visibility: 'hidden' }}>
                      新建
                    </Button>
                }
                <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                  意向单
            </span>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                loading={loading}
                data={cpBusinessIntentionList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
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
                  if (record.orderStatus == '1' || record.orderStatus == '已处理') {
                    return 'greenstyle'
                  }
                  if (record.orderStatus == '0' || record.orderStatus == '未处理') {
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
export default CpBusinessIntentionList;
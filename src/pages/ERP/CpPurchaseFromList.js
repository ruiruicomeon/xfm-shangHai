/**
 * 采购单
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, getPrice } from '@/utils/utils';
import moment from 'moment';
import styles from './CpPurchaseFromList.less';
import SearchTableList from '@/components/SearchTableList';
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
      CpPurchaseFromSearchList,
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
          })(<SearchTableList searchList={CpPurchaseFromSearchList} />)}
        </div>
      </Modal>
    );
  }
}
@connect(({ cpPurchaseFrom, loading, cpRevocation }) => ({
  ...cpPurchaseFrom,
  ...cpRevocation,
  loading: loading.models.cpPurchaseFrom,
}))
@Form.create()
class CpPurchaseFromList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpPurchaseFrom/cpPurchaseFrom_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpRevocation/CpPurchaseFrom_SearchList',
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'purchase_type',
      },
      callback: data => {
        this.setState({
          purchaseType: data
        })
      }
    });
  }

  gotoForm = () => {
    router.push(`/purchase/process/cp_purchase_from_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/purchase/process/cp_purchase_from_form?id=${id}`);
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
      ...filters,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
    };
    dispatch({
      type: 'cpPurchaseFrom/cpPurchaseFrom_List',
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
      type: 'cpPurchaseFrom/cpPurchaseFrom_List',
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
        type: 'cpPurchaseFrom/cpPurchaseFrom_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpPurchaseFrom/cpPurchaseFrom_List',
            payload: {
              pageSize: 10,
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
        type: 'cpPurchaseFrom/cpPurchaseFrom_List',
        payload: {
          ...values,
          pageSize: 10,
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
        type: 'cpPurchaseFrom/cpPurchaseFrom_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpPurchaseFrom/cpPurchaseFrom_List',
            payload: {
              pageSize: 10,
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
              ...formValues,
            }
          });
        }
      });
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
              <a style={{ marginLeft: 8 }} onClick={this.handleSearchChange}>
                过滤其他<Icon type="down" />
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
            <FormItem label="采购类型">
              {getFieldDecorator('purchaseType', {
                initialValue: ''
              })(
                <Select
                  allowClear
                  style={{ width: '100%' }}
                >
                  {
                    isNotBlank(this.state.purchaseType) && this.state.purchaseType.length > 0 && this.state.purchaseType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                  }
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
      type: 'cpPurchaseFrom/cpPurchaseFrom_List',
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

  handleFieldChange = (value) => {
    this.setState({
      array: value || []
    })
  }

  render() {
    const { selectedRows, array, searchVisible } = this.state;
    const { loading, cpPurchaseFromList, CpPurchaseFromSearchList } = this.props;
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      CpPurchaseFromSearchList,
    }
    const field = [
      {
        title: '单号',
        dataIndex: 'id',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: false,
      },
      {
        title: '单据状态',
        dataIndex: 'orderStatus',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '采购分类',
        dataIndex: 'procurementType',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '供应商',
        dataIndex: 'cpSupplier.name',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '供应商编号',
        dataIndex: 'cpSupplier.id',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '供应商单号',
        dataIndex: 'enquiryCode',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '物流方式',
        dataIndex: 'logistics',
        inputType: 'text',
        align: 'center',
        width: 200,
        editable: true,
      },
      {
        title: '采购类型',
        dataIndex: 'purchaseType',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '总金额',
        dataIndex: 'totalMoney',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: (text) => {
          if (isNotBlank(text)) {
            return getPrice(text)
          }
          return ''
        }
      },
      {
        title: '打印次数',
        dataIndex: 'printNumber',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '代采申请公司',
        dataIndex: 'applyName',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '创建者',
        dataIndex: 'createBy.name',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: false,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        align: 'center',
        editable: false,
        inputType: 'dateTime',
        width: 100,
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
          return ((record.orderStatus === 0 || record.orderStatus === '0' || record.orderStatus === '未处理') && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
            (item => item.target == 'cpZcPurchaseFrom').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0]
              .children.filter(item => item.name == '删除').length > 0) ?
            <Fragment>
              {isNotBlank(record) && isNotBlank(record.orderStatus === '未处理') &&
                <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              }
            </Fragment>
            : ''
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
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
                  (item => item.target == 'cpZcPurchaseFrom').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpZcPurchaseFrom')[0]
                    .children.filter(item => item.name == '删除').length > 0 ?
                  <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                    新建
             </Button>
                  :
                  <Button icon="plus" type="primary" style={{ visibility: 'hidden' }}>
                    新建
             </Button>
                }
                <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                  采购单
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                loading={loading}
                data={cpPurchaseFromList}
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
export default CpPurchaseFromList;
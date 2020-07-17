import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Row, Col, Select, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, setPrice, getPrice } from '@/utils/utils';
import moment from 'moment';
import { parse, stringify } from 'qs';
import styles from './CpOutStorageFromList.less';
import { getStorage } from '@/utils/localStorageUtils';
import SearchTableList from '@/components/SearchTableList';

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
      CpOutStorageFromSearchList,
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
          })(<SearchTableList searchList={CpOutStorageFromSearchList} />)}
        </div>
      </Modal>
    );
  }
}
@connect(({ cpOutStorageFrom, loading, cpRevocation }) => ({
  ...cpOutStorageFrom,
  ...cpRevocation,
  loading: loading.models.cpOutStorageFrom,
}))
@Form.create()
class CpOutStorageFromList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch , location} = this.props;
    if (isNotBlank(location.state)&&isNotBlank(location.state.id)) {
      dispatch({
        type: 'cpOutStorageFrom/cpOutStorageFrom_List',
        payload: {
          pageSize: 10,
          id:location.state.id
        }
      });
    } else {
      dispatch({
        type: 'cpOutStorageFrom/cpOutStorageFrom_List',
        payload: {
          pageSize: 10,
        }
      });
    }

    dispatch({
      type: 'cpRevocation/CpOutStorageFrom_SearchList',
    });
  }

  gotoForm = () => {
    router.push(`/warehouse/process/cp_out_storage_from_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/warehouse/process/cp_out_storage_from_form?id=${id}`);
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
      type: 'cpOutStorageFrom/cpOutStorageFrom_List',
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
      type: 'cpOutStorageFrom/cpOutStorageFrom_List',
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
        type: 'cpOutStorageFrom/cpOutStorageFrom_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpOutStorageFrom/cpOutStorageFrom_List',
            payload: {
              pageSize: 10,
              ...formValues,
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpOutStorageFrom/cpOutStorageFrom_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
        type: 'cpOutStorageFrom/cpOutStorageFrom_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpOutStorageFrom/cpOutStorageFrom_List',
            payload: {
              pageSize: 10,
              ...formValues,
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单单号">
              {getFieldDecorator('orderCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="配件仓库">
              {getFieldDecorator('pjEntrepotId', {
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
      type: 'cpOutStorageFrom/cpOutStorageFrom_List',
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

  handleUpldExportClick = type => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : ''
    }
    window.open(`/api/Beauty/beauty/cpOutStorageFrom/export?${stringify(params)}`);
  };

  handleUpldExportClickAll = type => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : '',
      isTemplate: 1
    }
    window.open(`/api/Beauty/beauty/cpOutStorageFrom/export?${stringify(params)}`);
  };


  render() {
    const { selectedRows, array, searchVisible } = this.state;
    const { loading, cpOutStorageFromList, CpOutStorageFromSearchList } = this.props;
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      CpOutStorageFromSearchList,
    }
    const field = [
      {
        title: '单号',
        dataIndex: 'id',
        align: 'center',
        inputType: 'text',
        width: 150,
        editable: false,
      },
      {
        title: '分类',
        align: 'center',
        dataIndex: 'formType',
        inputType: 'text',
        width: 100,
        editable: true,
        render: (text) => {
          if (text == 1) {
            return '整车维修'
          }
          if (text == 2) {
            return '总成维修'
          } if (text == 3) {
            return '配件销售'
          } if (text == 4) {
            return '配件调拨'
          } if (text == 8) {
            return '总成销售'
          }
          if (text == 6) {
            return '内部订单'
          }
          if (text == 7 || text == 10) {
            return '售后订单'
          }
          return ''
        }
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
        inputType: 'text',
        align: 'center',
        width: 240,
        editable: true,
        render: (text, record) => {
          if (isNotBlank(record) && isNotBlank(record.formType) && (record.formType == 5 || record.formType == 6)) {
            return isNotBlank(record.createBy) && isNotBlank(record.createBy.name) ? record.createBy.name : ''
          }
          return isNotBlank(record.client) && isNotBlank(record.client.clientCpmpany) ? record.client.clientCpmpany : ''

        }
      },
      {
        title: '配件仓库',
        dataIndex: 'pjEntrepot.name',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '出库类型',
        dataIndex: 'stirageType',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '金额',
        dataIndex: 'money',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
        render: text => (getPrice(text))
      },
      {
        title: '创建者',
        dataIndex: 'createBy.name',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: false,
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
        editable: true,
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
        title: '备注信息',
        dataIndex: 'remarks',
        align: 'center',
        inputType: 'text',
        width: 150,
        editable: true,
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
            (item => item.target == 'cpOutStorageFrom').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOutStorageFrom')[0]
              .children.filter(item => item.name == '删除').length > 0) ?
            <Fragment>
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                <a>删除</a>
              </Popconfirm>
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
          <div className={styles.tableListOperator}>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
              导出
            </Button>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClickAll()}>
              导出所有
            </Button>
          </div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
                {/* {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
                  (item => item.target == 'cpOutStorageFrom').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOutStorageFrom')[0]
                    .children.filter(item => item.name == '修改').length > 0 ?
                      <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                    新建
                      </Button>
                  : <Button icon="plus" type="primary" style={{ visibility: 'hidden' }}>
                    新建
                  </Button>
                } */}
                <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center', marginBottom: '16px' }}>
                  出库单
              </div>
                {/* <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                  出库单
                </span> */}
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 800 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={cpOutStorageFromList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                // onSelectRow={this.handleSelectRows}
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
export default CpOutStorageFromList;
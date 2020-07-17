import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  message,
  Icon,
  Upload,
  Modal,
  TreeSelect,
  Table,
  DatePicker,
  Row, Col, Popconfirm, Cascader
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { parse, stringify } from 'qs';
import { isNotBlank, getFullUrl, getLocation, setPrice, getPrice, deepClone } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getStorage } from '@/utils/localStorageUtils';
import styles from './CpStartInvoiceForm.less';
import SearchTableList from '@/components/SearchTableList';
import StandardTable from '@/components/StandardTable';
import StandardEditTable from '@/components/StandardEditTable';
import DragTable from '../../components/StandardEditTable/dragTable'

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@Form.create()
class SearchFormmore extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAddmore } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearchAddmore(fieldsValue);
    });
  };

  handleSearchVisiblemorein = () => {
    const { form, handleSearchVisiblemore } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisiblemore(fieldsValue);
    });
  };

  render() {
    const {
      searchVisiblemore,
      form: { getFieldDecorator },
      handleSearchVisiblemore,
      cpOfferSearchList
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisiblemore}
        onCancel={() => this.handleSearchVisiblemorein()}
        afterClose={() => this.handleSearchVisiblemorein()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={cpOfferSearchList} />)}
        </div>
      </Modal>
    );
  }
}
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
      searchVisiblecode,
      form: { getFieldDecorator },
      handleSearchVisible,
      cpOfferSearchList
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisiblecode}
        onCancel={() => this.handleSearchVisiblein()}
        afterClose={() => this.handleSearchVisiblein()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={cpOfferSearchList} />)}
        </div>
      </Modal>
    );
  }
}


@Form.create()
class SearchFormkh extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAddkh } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearchAddkh(fieldsValue);
    });
  };

  handleSearchVisiblekhin = () => {
    const { form, handleSearchVisiblekh } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisiblekh(fieldsValue);
    });
  };

  render() {
    const {
      searchVisiblekh,
      form: { getFieldDecorator },
      handleSearchVisible,
      cpClientSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisiblekh}
        onCancel={() => this.handleSearchVisiblekhin()}
        afterClose={() => this.handleSearchVisiblekhin()}
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




const CreateFormpass = Form.create()(props => {
  const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = { ...fieldsValue };
      handleAddpass(values);
    });
  };
  return (
    <Modal
      title='审批'
      visible={modalVisiblepass}
      onOk={okHandle}
      onCancel={() => handleModalVisiblepass()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核理由">
        {form.getFieldDecorator('remarks1', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '请输入审核理由',
            },
          ],
        })(<Input />)}
      </FormItem>
    </Modal>
  );
});
const CreateFormshr = Form.create()(props => {
  const { handleModalVisibleshr, modeluserList, selectshrflag, selectshr, selectedRows,
    handleSelectRows, levellist, levellist2, newdeptlist, dispatch, form, that } = props;
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
  const columnsshr = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectshr(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '编号',
      align: 'center',
      dataIndex: 'no',
      width: 150,
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'sex',
      width: 100,
      render: (text) => {
        if (isNotBlank(text)) {
          if (text === 1 || text === '1') {
            return <span>男</span>
          }
          if (text === 0 || text === '0') {
            return <span>女</span>
          }
        }
        return '';
      }
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '所属大区',
      align: 'center',
      dataIndex: 'area.name',
      width: 150,
    },
    {
      title: '所属分公司',
      align: 'center',
      dataIndex: 'companyName',
      width: 150,
    },
    {
      title: '所属部门',
      align: 'center',
      dataIndex: 'dept.name',
      width: 150,
    },
    {
      title: '所属区域',
      align: 'center',
      dataIndex: 'areaName',
      width: 150,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      width: 100,
      render: (text) => {
        if (isNotBlank(text)) {
          if (text === 0 || text === '0') {
            return <span>在职</span>
          }
          if (text === 1 || text === '1') {
            return <span>离职</span>
          }
        }
        return '';
      },
    },
  ];
  const handleSearch = (e) => {
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
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.company)) {
        values.company = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      }

      that.setState({
        shrsearch: values
      })

      dispatch({
        type: 'sysuser/modeluser_List',
        payload: {
          'role.id': '7ea08c3333154a90accd7ae0a19b180a',
          'office.id': getStorage('companyId'),
          ...values
        }
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      shrsearch: {}
    })
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': '7ea08c3333154a90accd7ae0a19b180a',
        'office.id': getStorage('companyId')
      }
    });
  }
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...that.state.shrsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      'role.id': '7ea08c3333154a90accd7ae0a19b180a',
      'office.id': getStorage('companyId')
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: params,
    });
  };


  const handleModalVisibleshrin = () => {
    form.resetFields();
    that.setState({
      shrsearch: {}
    })
    handleModalVisibleshr()
  }

  return (
    <Modal
      title='选择审核人'
      visible={selectshrflag}
      onCancel={() => handleModalVisibleshrin()}
      width='80%'
    >
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
        onChange={handleStandardTableChange}
        data={modeluserList}
        columns={columnsshr}
      />
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
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectjc(record)}>
            选择
    </a>
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
    }
  ];
  return (
    <Modal
      title='选择集采客户'
      visible={selectjcflag}
      onCancel={() => handleModalVisiblejc()}
      width='80%'
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={cpCollecClientList}
        columns={columnsjc}
      />
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, cpClientList, selectkhflag, selectcustomer, handleSearchChange,
    form, dispatch, that } = props;
  const { getFieldDecorator } = form
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectcustomer(record)}>
            选择
    </a>
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
      width: 100,
      align: 'center',
      editable: true,
    }
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
  const handleSearch = (e) => {
    e.preventDefault();
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

      that.setState({
        khsearch: values
      })

      dispatch({
        type: 'cpClient/cpClient_List',
        payload: {
          ...values,
          genTableColumn: isNotBlank(that.state.historyfilter2) ? that.state.historyfilter2 : [],
          pageSize: 10,
          current: 1,
          isTemplate: 1
        },
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      khsearch: {}
    })
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
        genTableColumn: isNotBlank(that.state.historyfilter2) ? that.state.historyfilter2 : [],
        current: 1,
        isTemplate: 1
      },
    });
  };
  const handleModalkh = () => {
    form.resetFields();
    handleModalVisiblekh()
  }
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
      genTableColumn: isNotBlank(that.state.historyfilter2) ? that.state.historyfilter2 : [],
      isTemplate: 1
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
    form.resetFields();
    that.setState({
      khsearch: {}
    })
    handleModalkh()
  }

  return (
    <Modal
      title='选择客户'
      visible={selectkhflag}
      onCancel={() => handleModalkhin()}
      width='80%'
    >
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Form onSubmit={handleSearch}>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="客户">
                {getFieldDecorator('clientCpmpany', {
                  initialValue: ''
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="联系人">
                {getFieldDecorator('name', {
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
const CreateFormhb = Form.create()(props => {
  const { selecthbflag, form, handleAddhb, handleModalVisiblehb, form: { getFieldDecorator }, selhbdata } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      form.resetFields();
      const values = { ...fieldsValue };
      values.money = setPrice(values.money)
      handleAddhb(values);
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
      title="开票订单详细"
      visible={selecthbflag}
      onOk={okHandle}
      width='80%'
      onCancel={() => handleModalVisiblehb()}
    >
      <Row gutter={12}>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='订单编号'>
            {getFieldDecorator('orderCode', {
              initialValue: isNotBlank(selhbdata) && isNotBlank(selhbdata.orderCode) ? selhbdata.orderCode : ''
              ,
              rules: [
                {
                  required: false,
                  message: '订单编号',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="业务发生日期">
            {getFieldDecorator('startDate', {
              initialValue: isNotBlank(selhbdata) && isNotBlank(selhbdata.workingDate) ? selhbdata.workingDate : ''
            })(
              <Input disabled />
            )}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="拟定回款日期">
            {getFieldDecorator('endDate', {
              initialValue: isNotBlank(selhbdata) && isNotBlank(selhbdata.returnedDate) ? selhbdata.returnedDate : ''
            })(
              <Input disabled />
            )}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='应收金额'>
            {getFieldDecorator('receivableMoney', {
              initialValue: isNotBlank(selhbdata) && isNotBlank(selhbdata.totalMoney) ? getPrice(selhbdata.totalMoney) : '',
              rules: [
                {
                  required: false,
                  message: '请输入应收金额',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='开票金额'>
            {getFieldDecorator('invoiceMoney', {
              initialValue: isNotBlank(selhbdata) && isNotBlank(selhbdata.totalMoney) ? getPrice(selhbdata.totalMoney) : '',
              rules: [
                {
                  required: false,
                  message: '请输入应收金额',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label="备注信息">
            {getFieldDecorator('remarks', {
              initialValue: isNotBlank(selhbdata) && isNotBlank(selhbdata.remarks) ? selhbdata.remarks : '',
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
              />
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});
const CreateFormcf = Form.create()(props => {
  const { selectcfflag, form, handleAddcf, handleModalVisiblecf, form: { getFieldDecorator }, onselecthis, selcfdata, selecthisdata, cfflag } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      form.resetFields();
      const values = { ...fieldsValue };
      values.invoiceMoney = setPrice(values.invoiceMoney)
      values.sendDate = moment(values.sendDate).format("YYYY-MM-DD")
      handleAddcf(values);
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

  const handleModalVisiblecfout = () => {
    form.resetFields();
    handleModalVisiblecf()
  }


  return (
    isNotBlank(cfflag) && cfflag ?
      <Modal
        title="拆分开票明细"
        visible={selectcfflag}
        onOk={okHandle}
        footer={null}
        width='80%'
        onCancel={() => handleModalVisiblecfout()}
      >
        <Row gutter={16}>
          <Card title="开票资料内容" bordered={false}>
            <Col lg={24} md={24} sm={24}>
              <div style={{ textAlign: 'center' }}><span>选择历史开票信息</span><Button
                type="primary"
                style={{ marginLeft: '8px' }}
                onClick={onselecthis}
              >选择
                                                                    </Button>
              </div>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户名称'>
                {getFieldDecorator('clientName', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.clientName) ? selecthisdata.clientName :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.clientName) ? selcfdata.clientName : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入客户名称',
                    },
                  ],
                })(<Input value={isNotBlank(selcfdata) && isNotBlank(selcfdata.clientName) ? selcfdata.clientName : ''} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='地址'>
                {getFieldDecorator('address', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.address) ? selecthisdata.address :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.address) ? selcfdata.address : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入地址',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='电话'>
                {getFieldDecorator('tel', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.tel) ? selecthisdata.tel :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.tel) ? selcfdata.tel : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入电话',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='税号'>
                {getFieldDecorator('duty', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.duty) ? selecthisdata.duty :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.duty) ? selcfdata.duty : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入税号',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='开户行'>
                {getFieldDecorator('openingBank', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.openingBank) ? selecthisdata.openingBank :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.openingBank) ? selcfdata.openingBank : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入开户行',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='账号'>
                {getFieldDecorator('account', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.account) ? selecthisdata.account :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.account) ? selcfdata.account : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入账号',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
          </Card>
          <Card title="税票邮递资料" bordered={false}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户名称'>
                {getFieldDecorator('clientName1', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.clientName1) ? selecthisdata.clientName1 :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.clientName1) ? selcfdata.clientName1 : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入客户名称',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='地址'>
                {getFieldDecorator('address1', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.address1) ? selecthisdata.address1 :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.address1) ? selcfdata.address1 : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入地址',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系人'>
                {getFieldDecorator('likeMan', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.likeMan) ? selecthisdata.likeMan :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.likeMan) ? selcfdata.likeMan : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入联系人',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='手机'>
                {getFieldDecorator('phone', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.phone) ? selecthisdata.phone :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.phone) ? selcfdata.phone : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入手机',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='电话'>
                {getFieldDecorator('tel1', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.tel1) ? selecthisdata.tel1 :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.tel1) ? selcfdata.tel1 : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入电话',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='邮编'>
                {getFieldDecorator('postcode', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.postcode) ? selecthisdata.postcode :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.postcode) ? selcfdata.postcode : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入邮编',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='快递公司'>
                {getFieldDecorator('company', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.company) ? selecthisdata.company :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.company) ? selcfdata.company : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入快递公司',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="寄出日期">
                {getFieldDecorator('sendDate', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.sendDate) ? moment(selecthisdata.sendDate) :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.sendDate) ? moment(selcfdata.sendDate) : null,
                })(
                  <DatePicker

                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
          </Card>
          <Col lg={12} md={12} sm={24}>
            <FormItem {...formItemLayout} label="开票金额">
              {getFieldDecorator('invoiceMoney', {
                initialValue: isNotBlank(selcfdata) && isNotBlank(selcfdata.invoiceMoney) ? getPrice(selcfdata.invoiceMoney) : '',
                rules: [
                  {
                    required: false,
                    message: '请输入开票金额',
                  },
                ],
              })(
                <InputNumber />
              )}
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
                initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.remarks) ? selecthisdata.remarks :
                  isNotBlank(selcfdata) && isNotBlank(selcfdata.remarks) ? selcfdata.remarks : '',
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
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
      : <Modal
        title="拆分开票明细"
        visible={selectcfflag}
        onOk={okHandle}
        width='80%'
        onCancel={() => handleModalVisiblecfout()}
      >
        <Row gutter={16}>
          <Card title="开票资料内容" bordered={false}>
            <Col lg={24} md={24} sm={24}>
              <div style={{ textAlign: 'center' }}><span>选择历史开票信息</span><Button
                type="primary"
                style={{ marginLeft: '8px' }}
                onClick={onselecthis}
              >选择
																  </Button>
              </div>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户名称'>
                {getFieldDecorator('clientName', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.clientName) ? selecthisdata.clientName :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.clientName) ? selcfdata.clientName : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入客户名称',
                    },
                  ],
                })(<Input value={isNotBlank(selcfdata) && isNotBlank(selcfdata.clientName) ? selcfdata.clientName : ''} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='地址'>
                {getFieldDecorator('address', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.address) ? selecthisdata.address :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.address) ? selcfdata.address : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入地址',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='电话'>
                {getFieldDecorator('tel', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.tel) ? selecthisdata.tel :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.tel) ? selcfdata.tel : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入电话',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='税号'>
                {getFieldDecorator('duty', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.duty) ? selecthisdata.duty :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.duty) ? selcfdata.duty : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入税号',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='开户行'>
                {getFieldDecorator('openingBank', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.openingBank) ? selecthisdata.openingBank :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.openingBank) ? selcfdata.openingBank : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入开户行',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='账号'>
                {getFieldDecorator('account', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.account) ? selecthisdata.account :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.account) ? selcfdata.account : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入账号',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
          </Card>
          <Card title="税票邮递资料" bordered={false}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户名称'>
                {getFieldDecorator('clientName1', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.clientName1) ? selecthisdata.clientName1 :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.clientName1) ? selcfdata.clientName1 : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入客户名称',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='地址'>
                {getFieldDecorator('address1', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.address1) ? selecthisdata.address1 :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.address1) ? selcfdata.address1 : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入地址',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系人'>
                {getFieldDecorator('likeMan', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.likeMan) ? selecthisdata.likeMan :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.likeMan) ? selcfdata.likeMan : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入联系人',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='手机'>
                {getFieldDecorator('phone', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.phone) ? selecthisdata.phone :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.phone) ? selcfdata.phone : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入手机',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='电话'>
                {getFieldDecorator('tel1', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.tel1) ? selecthisdata.tel1 :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.tel1) ? selcfdata.tel1 : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入电话',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='邮编'>
                {getFieldDecorator('postcode', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.postcode) ? selecthisdata.postcode :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.postcode) ? selcfdata.postcode : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入邮编',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='快递公司'>
                {getFieldDecorator('company', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.company) ? selecthisdata.company :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.company) ? selcfdata.company : '',
                  rules: [
                    {
                      required: false,
                      message: '请输入快递公司',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="寄出日期">
                {getFieldDecorator('sendDate', {
                  initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.sendDate) ? moment(selecthisdata.sendDate) :
                    isNotBlank(selcfdata) && isNotBlank(selcfdata.sendDate) ? moment(selcfdata.sendDate) : null,
                })(
                  <DatePicker

                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
          </Card>
          <Col lg={12} md={12} sm={24}>
            <FormItem {...formItemLayout} label="开票金额">
              {getFieldDecorator('invoiceMoney', {
                initialValue: isNotBlank(selcfdata) && isNotBlank(selcfdata.invoiceMoney) ? getPrice(selcfdata.invoiceMoney) : '',
                rules: [
                  {
                    required: false,
                    message: '请输入开票金额',
                  },
                ],
              })(
                <InputNumber />
              )}
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
                initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.remarks) ? selecthisdata.remarks :
                  isNotBlank(selcfdata) && isNotBlank(selcfdata.remarks) ? selcfdata.remarks : '',
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
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
  );
});
const CreateFormcodemore = Form.create()(props => {
  const { handleModalVisiblecodemore, selectCompleteList, selectmoreflag, handleSelectRows, selectedRows, handleAddcodemore,
    form: { getFieldDecorator }, valuetype, form, dispatch, handleSearchChangemore, selflag, clientcollectId, maintenance_project, that } = props;
  const columnskh = [
    {
      title: '单号',
      align: 'center',
      dataIndex: 'id',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '客户',
      align: 'center',
      dataIndex: 'client.clientCpmpany',
      inputType: 'text',
      width: 240,
      editable: true,
    },
    {
      title: '订单编号',
      align: 'center',
      dataIndex: 'orderCode',
      inputType: 'text',
      width: 200,
      editable: true,
    },
    {
      title: '订单分类',
      dataIndex: 'orderType',
      inputType: 'select',
      inputinfo: that.state.orderType,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.orderType) && that.state.orderType.length > 0) {
          return that.state.orderType.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务项目',
      dataIndex: 'project',
      inputType: 'select',
      inputinfo: that.state.business_project,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.business_project) && that.state.business_project.length > 0) {
          return that.state.business_project.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务渠道',
      dataIndex: 'dicth',
      inputType: 'select',
      inputinfo: that.state.business_dicth,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.business_dicth) && that.state.business_dicth.length > 0) {
          return that.state.business_dicth.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务分类',
      dataIndex: 'businessType',
      inputType: 'select',
      inputinfo: that.state.business_type,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.business_type) && that.state.business_type.length > 0) {
          return that.state.business_type.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '结算类型',
      dataIndex: 'settlementType',
      inputType: 'select',
      inputinfo: that.state.settlement_type,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.settlement_type) && that.state.settlement_type.length > 0) {
          return that.state.settlement_type.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '保险公司',
      dataIndex: 'insuranceCompanyId',
      inputType: 'select',
      inputinfo: that.state.insuranceCompany,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.insuranceCompany) && that.state.insuranceCompany.length > 0) {
          return that.state.insuranceCompany.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '集采客户',
      dataIndex: 'collectClientId.name',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '集采编码',
      dataIndex: 'collectCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      inputType: 'select',
      inputinfo: that.state.brand,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.brand) && that.state.brand.length > 0) {
          return that.state.brand.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务员',
      align: 'center',
      dataIndex: 'user.name',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '进场类型',
      dataIndex: 'assemblyEnterType',
      inputType: 'select',
      inputinfo: that.state.approachType,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.approachType) && that.state.approachType.length > 0) {
          return that.state.approachType.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
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
      title: '委托项目',
      align: 'center',
      inputinfo: maintenance_project,
      dataIndex: 'entrustProject',
      inputType: 'select',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(maintenance_project) && maintenance_project.length > 0) {
          return maintenance_project.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '注意事项',
      align: 'center',
      dataIndex: 'noticeMatter',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '无质量担保项目',
      align: 'center',
      dataIndex: 'noQualityProject',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '质量担保项目',
      align: 'center',
      dataIndex: 'qualityProject',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '结算方式约定',
      align: 'center',
      dataIndex: 'settlementAgreement',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '旧件返回时间',
      align: 'center',
      dataIndex: 'oldTime',
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
      title: '报价类型',
      align: 'center',
      dataIndex: 'offerType',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '结算日期',
      align: 'center',
      dataIndex: 'workingDate',
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
      title: '其他约定事项',
      align: 'center',
      dataIndex: 'otherMatter',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '默认回款时间',
      align: 'center',
      dataIndex: 'returnedDate',
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
      title: '质保时间',
      align: 'center',
      dataIndex: 'qualityDate',
      editable: true,
      inputType: 'dateTime',
      width: 100,
      sorter: true,
      render: (text) => {
        if (isNotBlank(text)) {
          return `${text.split(',')[0]}年${text.split(',')[1]}个月`
        }
        return ''
      }
    },
    {
      title: '金额合计（￥）',
      align: 'center',
      dataIndex: 'totalMoney',
      inputType: 'text',
      width: 100,
      editable: true,
      render: (text, res) => {
        if (isNotBlank(res.collectCode)) {
          return getPrice(getPrice(text))
        }
        return getPrice(text)
      }
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'finishDate',
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
      title: '备注信息',
      align: 'center',
      dataIndex: 'remarks',
      inputType: 'text',
      width: 150,
      editable: true,
    }
  ]
  const renderSimpleForm = () => {
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={8} sm={24}>
				<FormItem label="意向单号">
				  {getFieldDecorator('intentionId', {
										initialValue: ''
									})(
		  <Input  />
									)}
				</FormItem>
			  </Col> */}
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
            <FormItem label="客户">
              {getFieldDecorator('client.clientCpmpany', {
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
        </Row>
        <div style={{ overflow: 'hidden', margin: '10px 0' }}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
              查询
				  </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              重置
				  </Button>
            {/* <a style={{ marginLeft: 8 }} onClick={toggleForm}>
						展开 <Icon type="down" />
					  </a> */}
            <a style={{ marginLeft: 8 }} onClick={handleSearchChangemore}>
              过滤其他 <Icon type="down" />
            </a>
          </span>
        </div>
        {/* </Row> */}
      </Form>
    );
  }
  const handleSearch = e => {
    e.preventDefault();
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

      that.setState(
        {
          moresearch: values
        }
      )

      if (isNotBlank(selflag) && selflag == 'kh') {
        dispatch({
          type: 'cpAfterApplicationFrom/select_complete_List',
          payload: {
            ...values,
            current: 1,
            pageSize: 500,
            type: 2,
            status: 1,
            isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
            genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
            'client.id': clientcollectId,
            isOperation: 0,
          },
        });
      } else if (isNotBlank(selflag) && selflag == 'jc') {
        dispatch({
          type: 'cpAfterApplicationFrom/select_complete_List',
          payload: {
            ...values,
            current: 1,
            pageSize: 500,
            status: 1,
            type: 2,
            isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
            genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
            'collectClientId.id': clientcollectId
          },
        })
      }
    });
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    if (isNotBlank(selflag) && selflag == 'kh') {
      const params = {
        ...that.state.moresearch,
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        type: 2,
        isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
        'client.id': clientcollectId
      };
    } else if (isNotBlank(selflag) && selflag == 'jc') {
      const params = {
        ...that.state.moresearch,
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        type: 2,
        isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
        'collectClientId.id': clientcollectId,
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
        isTemplate: 1,
        status: 1,
      };
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: params,
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      moresearch: {}
    })
    if (isNotBlank(selflag) && selflag == 'kh') {
      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          current: 1,
          pageSize: 500,
          type: 2,
          status: 1,
          isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
          genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
          'client.id': clientcollectId,
          isOperation: 0
        },
      });
    } else if (isNotBlank(selflag) && selflag == 'jc') {
      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          current: 1,
          pageSize: 500,
          type: 2,
          status: 1,
          isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
          genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
          'collectClientId.id': clientcollectId
        },
      })
    }
  };

  const handleModalVisiblecodemorein = () => {
    form.resetFields();
    that.setState({
      moresearch: {}
    })
    handleModalVisiblecodemore()
  }

  return (
    <Modal
      title='选择合并结算单'
      visible={selectmoreflag}
      onOk={handleAddcodemore}
      onCancel={() => handleModalVisiblecodemore()}
      width='80%'
    >
      <div>{renderSimpleForm()}</div>
      <StandardTable
        bordered
        scroll={{ x: 3600 }}
        selectedRows={selectedRows}
        //   onSelectRow={rows => this.setState({ selectedRows: rows })}
        onSelectRow={handleSelectRows}
        //   rowSelection={
        // 				{
        // 					getCheckboxProps: record => {
        // 						return record.id 
        // 					}
        // 					// ({
        // 					// 	defaultChecked: selectedRows,
        // 					// })
        // 				}
        // 			}
        onChange={handleStandardTableChange}
        data={selectCompleteList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormcode = Form.create()(props => {
  const { handleModalVisiblecode, selectCompleteList, selectcodeflag, selectcode,
    form: { getFieldDecorator }, valuetype, dispatch, handleSearchChangecode, form, maintenance_project, that } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectcode(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '单号',
      align: 'center',
      dataIndex: 'id',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '订单编号',
      align: 'center',
      dataIndex: 'orderCode',
      inputType: 'text',
      width: 200,
      editable: true,
    },
    {
      title: '客户',
      align: 'center',
      dataIndex: 'client.clientCpmpany',
      inputType: 'text',
      width: 240,
      editable: true,
    },
    {
      title: '订单分类',
      dataIndex: 'orderType',
      inputType: 'select',
      inputinfo: that.state.orderType,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.orderType) && that.state.orderType.length > 0) {
          return that.state.orderType.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务项目',
      dataIndex: 'project',
      inputType: 'select',
      inputinfo: that.state.business_project,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.business_project) && that.state.business_project.length > 0) {
          return that.state.business_project.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务渠道',
      dataIndex: 'dicth',
      inputType: 'select',
      inputinfo: that.state.business_dicth,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.business_dicth) && that.state.business_dicth.length > 0) {
          return that.state.business_dicth.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务分类',
      dataIndex: 'businessType',
      inputType: 'select',
      inputinfo: that.state.business_type,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.business_type) && that.state.business_type.length > 0) {
          return that.state.business_type.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '结算类型',
      dataIndex: 'settlementType',
      inputType: 'select',
      inputinfo: that.state.settlement_type,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.settlement_type) && that.state.settlement_type.length > 0) {
          return that.state.settlement_type.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '保险公司',
      dataIndex: 'insuranceCompanyId',
      inputType: 'select',
      inputinfo: that.state.insuranceCompany,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.insuranceCompany) && that.state.insuranceCompany.length > 0) {
          return that.state.insuranceCompany.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '集采客户',
      dataIndex: 'collectClientId.name',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '集采编码',
      dataIndex: 'collectCode',
      inputType: 'text',
      align: 'center',
      width: 240,
      editable: true,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      inputType: 'select',
      inputinfo: that.state.brand,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.brand) && that.state.brand.length > 0) {
          return that.state.brand.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '业务员',
      align: 'center',
      dataIndex: 'user.name',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '集采客户',
      align: 'center',
      dataIndex: 'collectClientId.name',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '集采编码',
      align: 'center',
      dataIndex: 'collectCode',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '进场类型',
      dataIndex: 'assemblyEnterType',
      inputType: 'select',
      inputinfo: that.state.approachType,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.approachType) && that.state.approachType.length > 0) {
          return that.state.approachType.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
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
      title: '委托项目',
      align: 'center',
      inputinfo: maintenance_project,
      dataIndex: 'entrustProject',
      inputType: 'select',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(maintenance_project) && maintenance_project.length > 0) {
          return maintenance_project.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '注意事项',
      align: 'center',
      dataIndex: 'noticeMatter',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '无质量担保项目',
      align: 'center',
      dataIndex: 'noQualityProject',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '质量担保项目',
      align: 'center',
      dataIndex: 'qualityProject',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '结算方式约定',
      align: 'center',
      dataIndex: 'settlementAgreement',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '旧件返回时间',
      align: 'center',
      dataIndex: 'oldTime',
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
      title: '报价类型',
      align: 'center',
      dataIndex: 'offerType',
      inputinfo: maintenance_project,
      inputType: 'select',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.offerType) && that.state.offerType.length > 0) {
          return that.state.offerType.map((item) => {
            if (isNotBlank(item) && isNotBlank(item.value) && text == item.value) {
              return item.label
            }
            return '';
          })
        }
        return ''
      },
    },
    {
      title: '结算日期',
      align: 'center',
      dataIndex: 'workingDate',
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
      title: '其他约定事项',
      align: 'center',
      dataIndex: 'otherMatter',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '默认回款时间',
      align: 'center',
      dataIndex: 'returnedDate',
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
      title: '质保时间',
      align: 'center',
      dataIndex: 'qualityDate',
      editable: true,
      inputType: 'dateTime',
      width: 100,
      sorter: true,
      render: (text) => {
        if (isNotBlank(text)) {
          return `${text.split(',')[0]}年${text.split(',')[1]}个月`
        }
        return ''
      }
    },
    {
      title: '金额合计（￥）',
      align: 'center',
      dataIndex: 'money',
      inputType: 'text',
      width: 100,
      editable: true,
      render: (text, res) => {
        if (isNotBlank(res.collectCode)) {
          return getPrice(getPrice(text))
        }
        return getPrice(text)
      }
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'finishDate',
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
      title: '备注信息',
      align: 'center',
      dataIndex: 'remarks',
      inputType: 'text',
      width: 150,
      editable: true,
    }
  ]
  const renderSimpleForm = () => {
    return (
      <Form onSubmit={handleSearch} layout="inline">
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
            <FormItem label="客户">
              {getFieldDecorator('client.clientCpmpany', {
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
        </Row>
        <div style={{ overflow: 'hidden', margin: '10px 0' }}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
              查询
          </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              重置
          </Button>
            <a style={{ marginLeft: 8 }} onClick={handleSearchChangecode}>
              过滤其他 <Icon type="down" />
            </a>
          </span>
        </div>
      </Form>
    );
  }
  const handleSearch = e => {
    e.preventDefault();
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

      if (isNotBlank(valuetype) && valuetype == 1) {
        values.project = 3
      } else {
        delete values.project
      }
      if (isNotBlank(valuetype) && (valuetype == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b')) {
        values.makeType = 2
      } else if (isNotBlank(valuetype) && (valuetype == '2')) {
        values.makeType = 1
      }

      that.setState({
        jsdsearch: values
      })

      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          type: 2,
          status: 1,
          isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
          genTableColumn: isNotBlank(that.state.historyfilter1) ? that.state.historyfilter1 : [],
          jsStatus: 1
        },
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      jsdsearch: {}
    })

    const newobj = {}
    if (isNotBlank(valuetype) && valuetype == 1) {
      newobj.project = 3
    }
    if (isNotBlank(valuetype) && (valuetype == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b')) {
      newobj.makeType = 2
    } else if (isNotBlank(valuetype) && (valuetype == '2')) {
      newobj.makeType = 1
    }


    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        ...newobj,
        pageSize: 10,
        current: 1,
        status: 1,
        type: 2,
        isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
        genTableColumn: isNotBlank(that.state.historyfilter1) ? that.state.historyfilter1 : [],
        jsStatus: 1
      },
    });
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const newobj = {}
    if (isNotBlank(valuetype) && valuetype == 1) {
      newobj.project = 3
    }

    if (isNotBlank(valuetype) && (valuetype == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b')) {
      newobj.makeType = 2
    } else if (isNotBlank(valuetype) && (valuetype == '2')) {
      newobj.makeType = 1
    }

    const params = {
      ...newobj,
      ...that.state.jsdsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      type: 2,
      isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
      genTableColumn: isNotBlank(that.state.historyfilter1) ? that.state.historyfilter1 : [],
      jsStatus: 1,
      status: 1,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: params,
    });
  };

  const handleModalVisiblecodein = () => {
    form.resetFields();
    that.setState({
      jsdsearch: {}
    })
    handleModalVisiblecode()
  }

  return (
    <Modal
      title='选择结算单'
      visible={selectcodeflag}
      onCancel={() => handleModalVisiblecode()}
      width='80%'
    >
      <div>{renderSimpleForm()}</div>
      <StandardTable
        bordered
        scroll={{ x: 3600 }}
        onChange={handleStandardTableChange}
        data={selectCompleteList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormhis = Form.create()(props => {
  const { handleModalVisiblehis, cpStartInvoiceNotPageList, otherclientid, selecthisflag, selecthis } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selecthis(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '单号',
      dataIndex: 'id',
      inputType: 'text',
      width: 100,
      editable: false,
    },
    {
      title: '客户名称',
      dataIndex: 'clientName',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '电话',
      dataIndex: 'tel',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '税号',
      dataIndex: 'duty',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '开户行',
      dataIndex: 'openingBank',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '账号',
      dataIndex: 'account',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      editable: false,
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
      inputType: 'text',
      width: 150,
      editable: true,
    },
  ]
  return (
    <Modal
      title='选择历史开票记录'
      visible={selecthisflag}
      onCancel={() => handleModalVisiblehis()}
      width='80%'
    >
      <StandardTable
        bordered
        scroll={{ x: 1300 }}
        data={cpStartInvoiceNotPageList}
        columns={columnskh}
      />
    </Modal>
  );
});
@connect(({ cpStartInvoice, loading, cpOfferForm, cpClient, cpCollecClient, syslevel, sysdept, sysuser, cpAfterApplicationFrom }) => ({
  ...cpStartInvoice,
  ...cpOfferForm,
  ...cpClient,
  ...cpCollecClient,
  ...syslevel,
  ...sysdept,
  ...sysuser,
  ...cpAfterApplicationFrom,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpStartInvoice/post_CpStartInvoice'],
  submitting2: loading.effects['cpStartInvoice/cpStartInvoice_Add'],
}))
@Form.create()
class CpStartInvoiceForm extends PureComponent {
  index = 0

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selcfdata: {},
      selhbdata: {},
      selectedRows: [],
      showdata: [],
      indexstatus: '',
      confirmflag: true,
      confirmflag1: true,
      newarr: [],
      otherclientid: '',
      sptitle: '税票(按单)申请单',
      valuetype: 'bba6ce87-cf73-41dc-ba91-5d8c595e437b',
      clientcollectId: '',
      historytype: '',
      shrsearch: {},
      khsearch: {},
      jsdsearch: {},
      cfflag: false,
      location: getLocation(),
      khType: '',
      newindex: []

    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpStartInvoice/cpStartInvoice_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
              .length > 0)) {
            this.setState({ orderflag: false })
          } else {
            this.setState({ orderflag: true })
          }
          const allUser = []
          if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
            allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 }, isNotBlank(res.data.fourUser) ? res.data.fourUser : { id: 4 }, isNotBlank(res.data.fiveUser) ? res.data.fiveUser : { id: 5 })
          } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
            allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 }, isNotBlank(res.data.fourUser) ? res.data.fourUser : { id: 4 })
          } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
            allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 })
          } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
            allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 })
          } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
            allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 })
          }
          if (allUser.length == 0) {
            this.setState({
              showdata: [],
              modalVisiblepass: false
            })
          } else {
            this.setState({
              showdata: allUser,
              modalVisiblepass: false
            })
          }


          if (isNotBlank(res.data.client) && isNotBlank(res.data.client.id) && isNotBlank(res.data.type) && res.data.type == '6edc254f-5390-4efc-824d-a3b9e4017af0') {

            this.setState({
              clientcollectId: res.data.client.id,
              khType: 'kh'
            })


            dispatch({
              type: 'cpAfterApplicationFrom/select_complete_List',
              payload: {
                pageSize: 500,
                type: 2,
                status: 1,
                isInvoice: 0,
                'client.id': res.data.client.id,
                isTemplate: 1
              },
              // callback: (clientres) => {
              // 	this.setState({
              // 		selectedRows: isNotBlank(clientres.list) && clientres.list.length > 0 ? clientres.list.map((item) => {
              // 			return item.id
              // 		}) : [],
              // 	})
              // }
            });
          }

          if (isNotBlank(res.data.receivableMoney)) {
            this.setState({
              inreceivablemoney: res.data.receivableMoney
            })
          }

          if (isNotBlank(res.data.collectClientId) && isNotBlank(res.data.collectClientId.id) && isNotBlank(res.data.type) && res.data.type == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
            this.setState({
              clientcollectId: res.data.collectClientId.id,
              khType: 'jc'
            })

            dispatch({
              type: 'cpAfterApplicationFrom/select_complete_List',
              payload: {
                pageSize: 500,
                type: 2,
                status: 1,
                isInvoice: 0,
                'collectClientId.id': res.data.collectClientId.id
              },
              // callback: (clientres) => {
              // 	this.setState({
              // 		selectedRows: isNotBlank(clientres.list) && clientres.list.length > 0 ? clientres.list.map((item) => {
              // 			return item.id
              // 		}) : []
              // 	})
              // }
            });
          }


          if (isNotBlank(res.data.client) && isNotBlank(res.data.client.id)) {
            this.setState({
              otherclientid: res.data.client.id
            })
          }



          let copytype = []
          if (isNotBlank(res.data.type) && res.data.type == 2) {
            copytype.remarks = 1
          }

          dispatch({
            type: 'cpStartInvoice/cpInvoiceDetail_List',
            payload: {
              invoiceId: location.query.id,
              ...copytype
            },
            callback: (resin) => {
              let newres = resin
              newres.forEach((item, idx) => {
                if (!isNotBlank(item.duty)) {
                  newres[idx].duty = item.orderCode
                }
                if (!isNotBlank(item.invoiceMoney)) {
                  newres[idx].receivableMoney = item.money
                }
                if (!isNotBlank(item.invoiceMoney)) {
                  newres[idx].invoiceMoney = item.money
                }
              })

              this.setState({
                newarr: newres,
                newindex: newres.map(element => {
                  return element.account
                })
              })
            }
          })
          if (isNotBlank(res.data.type)) {
            this.setState({
              valuetype: res.data.type
            })
            if (res.data.type == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b') {
              this.setState({
                sptitle: '税票(按单)申请单'
              })
            } else if (res.data.type == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
              this.setState({
                sptitle: '税票(合并)申请单'
              })
            } else if (res.data.type == '2') {
              this.setState({
                sptitle: '税票(拆分)申请单'
              })
            } else if (res.data.type == '1') {
              this.setState({
                sptitle: '税票(分批)申请单'
              })
            }
          }
        }
      });
    } else {
      this.setState({
        showdata: []
      })
    }
    dispatch({
      type: 'dict/dict',
      callback: data => {
        const insuranceCompany = []
        const brand = []
        const approachType = []
        const collectCustomer = []
        const orderType = []
        const business_project = []
        const business_dicth = []
        const business_type = []
        const settlement_type = []
        const payment_methodd = []
        const old_need = []
        const make_need = []
        const quality_need = []
        const oils_need = []
        const guise_need = []
        const installation_guide = []
        const is_photograph = []
        const maintenance_project = []
        const del_flag = []
        const classify = []
        const client_level = []
        const area = []
        const commissionMatter = []
        const offerType = []
        data.forEach((item) => {
          if (item.type == 'insurance_company') {
            insuranceCompany.push(item)
          }
          if (item.type == 'brand') {
            brand.push(item)
          }
          if (item.type == 'approach_type') {
            approachType.push(item)
          }
          if (item.type == 'collect_customer') {
            collectCustomer.push(item)
          }
          if (item.type == 'orderType') {
            orderType.push(item)
          }
          if (item.type == 'business_project') {
            business_project.push(item)
          }
          if (item.type == 'business_dicth') {
            business_dicth.push(item)
          }
          if (item.type == 'business_type') {
            business_type.push(item)
          }
          if (item.type == 'settlement_type') {
            settlement_type.push(item)
          }
          if (item.type == 'payment_methodd') {
            payment_methodd.push(item)
          }
          if (item.type == 'old_need') {
            old_need.push(item)
          }
          if (item.type == 'make_need') {
            make_need.push(item)
          }
          if (item.type == 'quality_need') {
            quality_need.push(item)
          }
          if (item.type == 'oils_need') {
            oils_need.push(item)
          }
          if (item.type == 'guise_need') {
            guise_need.push(item)
          }
          if (item.type == 'installation_guide') {
            installation_guide.push(item)
          }
          if (item.type == 'maintenance_project') {
            maintenance_project.push(item)
          }
          if (item.type == 'is_photograph') {
            is_photograph.push(item)
          }
          if (item.type == 'del_flag') {
            del_flag.push(item)
          }
          if (item.type == 'classify') {
            classify.push(item)
          }
          if (item.type == 'client_level') {
            client_level.push(item)
          }
          if (item.type == 'area') {
            area.push(item)
          }
          if (item.type == 'commissionMatter') {
            commissionMatter.push(item)
          }

          if (item.type == 'offerType') {
            offerType.push(item)
          }

        })
        this.setState({
          insuranceCompany,
          brand, approachType, collectCustomer,
          orderType, business_project, business_dicth
          , business_type, settlement_type, payment_methodd, old_need,
          make_need, quality_need, oils_need, guise_need, installation_guide
          , maintenance_project, is_photograph, del_flag, classify, client_level, commissionMatter,
          area, offerType
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.setState({
      selectedRows: []
    })
    dispatch({
      type: 'cpStartInvoice/clear',
    });
    dispatch({
      type: 'cpOfferForm/clear',
    });
  }

  // 	componentWillReceiveProps(nextProps){
  // 		const that = this
  // 		if(nextProps.location.search!=this.props.location.search){
  // 		  this.setState({
  // 			location:nextProps.location
  // 		  })
  // 		  setTimeout(function(){
  // 			that.changeQrCode()
  // 		  },100) 
  // 		}
  // 	}

  // changeQrCode=()=>{
  // 		const { dispatch } = this.props
  // 		const  { location } = this.state

  // 		this.props.form.resetFields()
  // 		const that = this
  // 		setTimeout(function(){
  // 			if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
  // 				dispatch({
  // 					type: 'cpStartInvoice/cpStartInvoice_Get',
  // 					payload: {
  // 						id: location.query.id,
  // 					},
  // 					callback: (res) => {
  // 						if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2'|| res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
  // 						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
  // 						  .length > 0)) {
  // 							that.setState({ orderflag: false })
  // 					  } else {
  // 						that.setState({ orderflag: true })
  // 					  }
  // 						const allUser = []
  // 						if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
  // 						  allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
  // 						} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
  // 						  allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
  // 						} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
  // 						  allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
  // 						} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
  // 						  allUser.push(res.data.oneUser, res.data.twoUser)
  // 						} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
  // 						  allUser.push(res.data.oneUser)
  // 						}
  // 						if(allUser.length==0){
  // 							that.setState({
  // 								showdata: [],
  // 								modalVisiblepass: false
  // 							  })
  // 						}else{
  // 							that.setState({
  // 							showdata: allUser,
  // 							modalVisiblepass: false
  // 							})
  // 						}
  // 						if (isNotBlank(res.data.client) && isNotBlank(res.data.client.id) && isNotBlank(res.data.type) && res.data.type == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
  // 							that.setState({
  // 								clientcollectId: res.data.client.id
  // 							})
  // 							dispatch({
  // 								type: 'cpAfterApplicationFrom/select_complete_List',
  // 								payload: {
  // 									pageSize: 500,
  // 									type: 2,
  // 									status: 1,
  // 									isInvoice: 0,
  // 									'client.id': res.data.client.id,
  // 									isTemplate :1
  // 								},
  // 								// callback: (clientres) => {
  // 								// 	this.setState({
  // 								// 		selectedRows: isNotBlank(clientres.list) && clientres.list.length > 0 ? clientres.list.map((item) => {
  // 								// 			return item.id
  // 								// 		}) : [],
  // 								// 	})
  // 								// }
  // 							});
  // 						}

  // 						if(isNotBlank(res.data.receivableMoney)){
  // 							that.setState({
  // 								inreceivablemoney:res.data.receivableMoney
  // 							})
  // 						}

  // 						if (isNotBlank(res.data.collectClientId) && isNotBlank(res.data.collectClientId.id) && isNotBlank(res.data.type) && res.data.type == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
  // 							that.setState({
  // 								clientcollectId: res.data.collectClientId.id
  // 							})
  // 							dispatch({
  // 								type: 'cpAfterApplicationFrom/select_complete_List',
  // 								payload: {
  // 									pageSize: 500,
  // 									type: 2,
  // 									status: 1,
  // 									isInvoice: 0,
  // 									'collectClientId.id': res.data.collectClientId.id
  // 								},
  // 								// callback: (clientres) => {
  // 								// 	this.setState({
  // 								// 		selectedRows: isNotBlank(clientres.list) && clientres.list.length > 0 ? clientres.list.map((item) => {
  // 								// 			return item.id
  // 								// 		}) : []
  // 								// 	})
  // 								// }
  // 							});
  // 						}


  // 						if (isNotBlank(res.data.client) && isNotBlank(res.data.client.id)) {
  // 							that.setState({
  // 											otherclientid:res.data.client.id
  // 										})
  // 						}



  // 						let copytype = []
  // 						if(isNotBlank(res.data.type)&&res.data.type==2){
  // 							copytype.remarks = 1
  // 						}

  // 						dispatch({
  // 							type: 'cpStartInvoice/cpInvoiceDetail_List',
  // 							payload: {
  // 								invoiceId: location.query.id,
  // 								...copytype
  // 							},
  // 							callback:(res)=>{
  // 									let newres = res
  // 									newres.forEach((item,idx)=>{
  // 									if(!isNotBlank(item.duty)){
  // 										newres[idx].duty = item.orderCode
  // 									}
  // 									if(!isNotBlank(item.invoiceMoney)){
  // 										newres[idx].receivableMoney = item.money
  // 									}
  // 									if(!isNotBlank(item.invoiceMoney)){
  // 										newres[idx].invoiceMoney = item.money
  // 									}
  // 								})
  // 								that.setState({
  // 									 newarr:newres
  // 								 })
  // 							}
  // 						})
  // 						if (isNotBlank(res.data.type)) {
  // 							that.setState({
  // 								valuetype: res.data.type
  // 							})
  // 							if (res.data.type == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b') {
  // 								that.setState({
  // 									sptitle: '税票(按单)申请单'
  // 								})
  // 							} else if (res.data.type == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
  // 								that.setState({
  // 									sptitle: '税票(合并)申请单'
  // 								})
  // 							} else if (res.data.type == '2') {
  // 								that.setState({
  // 									sptitle: '税票(拆分)申请单'
  // 								})
  // 							} else if (res.data.type == '1') {
  // 								that.setState({
  // 									sptitle: '税票(分批)申请单'
  // 								})
  // 							}
  // 						}
  // 					}
  // 				});
  // 			}
  // 		},300)
  // 	}


  handleSubmit = e => {
    const { dispatch, form, cpStartInvoiceGet } = this.props;
    const { addfileList, location, newarr, valuetype, selectjcdata, selectkhdata, selectcodedata, selectedRows, showdata } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          let photo = [];
          let list = [];
          for (let i = 0; i < addfileList.length; i += 1) {
            if (isNotBlank(addfileList[i].id)) {
              photo = [...photo, addfileList[i].url];
            } else {
              list = [...list, addfileList[i]];
            }
          }
          if (isNotBlank(photo) && photo.length > 0) {
            value.photo = photo.map(row => row).join('|');
          } else {
            value.photo = '';
          }
          value.file = list;
        } else {
          value.photo = '';
        }
        if (isNotBlank(value.sendDate)) {
          value.sendDate = moment(value.sendDate).format("YYYY-MM-DD")
        }
        if (!(isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.approvals))) {
          value.approvals = 0
        }
        if (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) {
          value.client = {}
          value.client.id = isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id) ? selectcodedata.client.id : ''
        }
        if (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) {
          value.newClientId = selectkhdata.id
          // value.newClientId.id = selectkhdata.id
        }
        // else if(isNotBlank(cpStartInvoiceGet)&&isNotBlank(cpStartInvoiceGet.client)&&isNotBlank(cpStartInvoiceGet.client.id)&& (!isNotBlank(selectjcdata) ||!isNotBlank(selectjcdata.id)){

        // }
        if (isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) {
          value.newCollectClientId = selectjcdata.id
          // value.newCollectClientId.id = selectjcdata.id
        }
        value.sendDate = moment(value.sendDate).format("YYYY-MM-DD")
        value.orderStatus = 1
        value.invoiceMoney = setPrice(value.invoiceMoney)
        value.receivableMoney = setPrice(value.receivableMoney)
        value.type = valuetype
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')


        value.parent = ''
        if (isNotBlank(newarr) && newarr.length > 0 && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
          value.parent = newarr.map(row => row.account).join(',');
        }
        if ((isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) || (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.parent)) && (valuetype != '6edc254f-5390-4efc-824d-a3b9e4017af0')) {
          value.parent = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? selectcodedata.id : isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.parent) ? cpStartInvoiceGet.parent : ''
        }

        // if (isNotBlank(newarr) && newarr.length > 0) {
        // 	value.parent = newarr.map(row => row.account).join(',');
        // } else {
        // 	value.parent = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? selectcodedata.id : isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.parent) ? cpStartInvoiceGet.parent : ''
        // }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        dispatch({
          type: 'cpStartInvoice/post_CpStartInvoice',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_start_invoice_form?id=${res.data.id}`);
            // router.push('/business/process/cp_start_invoice_list');
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch, form, cpStartInvoiceGet } = this.props;
    const { addfileList, location, newarr, valuetype, selectcodedata, selectjcdata, selectkhdata, selectedRows, showdata } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          let photo = [];
          let list = [];
          for (let i = 0; i < addfileList.length; i += 1) {
            if (isNotBlank(addfileList[i].id)) {
              photo = [...photo, addfileList[i].url];
            } else {
              list = [...list, addfileList[i]];
            }
          }
          if (isNotBlank(photo) && photo.length > 0) {
            value.photo = photo.map(row => row).join('|');
          } else {
            value.photo = '';
          }
          value.file = list;
        } else {
          value.photo = '';
        }
        if (!(isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.approvals))) {
          value.approvals = 0
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        if (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) {
          value.client = {}
          value.client.id = isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id) ? selectcodedata.client.id : ''
        }
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        if (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) {
          value.newClientId = selectkhdata.id
          // value.newClientId.id = selectkhdata.id
        }
        if (isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) {
          value.newCollectClientId = selectjcdata.id
          // value.newCollectClientId.id = selectjcdata.id
        }
        value.sendDate = moment(value.sendDate).format("YYYY-MM-DD")
        value.orderStatus = 0
        value.invoiceMoney = setPrice(value.invoiceMoney)
        value.receivableMoney = setPrice(value.receivableMoney)
        value.type = valuetype
        value.parent = ''
        if (isNotBlank(newarr) && newarr.length > 0 && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
          value.parent = newarr.map(row => row.account).join(',');
        }
        if ((isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) || (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.parent)) && (valuetype != '6edc254f-5390-4efc-824d-a3b9e4017af0')) {
          value.parent = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? selectcodedata.id : isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.parent) ? cpStartInvoiceGet.parent : ''
        }

        dispatch({
          type: 'cpStartInvoice/cpStartInvoice_Add',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_start_invoice_form?id=${res.data.id}`);
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/business/process/cp_start_invoice_list');
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
  };

  handlebeforeUpload = file => {
    const { addfileList } = this.state;
    const isimg = file.type.indexOf('image') >= 0;
    if (!isimg) {
      message.error('请选择图片文件!');
    }
    const isLt10M = file.size / 1024 / 1024 <= 10;
    if (!isLt10M) {
      message.error('文件大小需为10M以内');
    }
    if (isimg && isLt10M) {
      if (!isNotBlank(addfileList) || addfileList.length <= 0) {
        this.setState({
          addfileList: [file],
        });
      } else {
        this.setState({
          addfileList: [...addfileList, file],
        });
      }
    }
    return isLt10M && isimg;
  };

  handleUploadChange = info => {
    const isimg = info.file.type.indexOf('image') >= 0;
    const isLt10M = info.file.size / 1024 / 1024 <= 10;
    if (info.file.status === 'done') {
      if (isLt10M && isimg) {
        this.setState({ fileList: info.fileList });
      }
    } else {
      this.setState({ fileList: info.fileList });
    }
  };

  onselectsh = () => {
    const { dispatch, cpStartInvoiceGet } = this.props
    const { valuetype, location } = this.state

    let newarr = {}
    if (isNotBlank(valuetype) && valuetype == 1) {
      newarr.project = 3

    }
    if (isNotBlank(valuetype) && (valuetype == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b')) {
      newarr.makeType = 2
    } else if (isNotBlank(valuetype) && (valuetype == '2')) {
      newarr.makeType = 1
    }

    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        ...newarr,
        pageSize: 10,
        type: 2,
        status: 1,
        isInvoice: isNotBlank(valuetype) && valuetype == 1 ? '' : 0,
        genTableColumn: isNotBlank(this.state.historyfilter1) ? this.state.historyfilter1 : [],
        jsStatus: 1
      }
    });
    this.setState({ selectcodeflag: true });
  }

  selectcode = (record) => {
    const { dispatch, cpStartInvoiceGet } = this.props
    const { valuetype, location } = this.state

    const val = []
    if (((isNotBlank(valuetype) && valuetype == 1) || (isNotBlank(cpStartInvoiceGet) && cpStartInvoiceGet.type == 1)) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
      val.remarks = location.query.id
    }

    dispatch({
      type: 'cpStartInvoice/select_Offfrom',
      payload: {
        parent: record.id,
        type: valuetype,
        ...val
      },
      callback: (res) => {
        this.setState({
          inreceivablemoney: isNotBlank(res) ? res.split(',')[0] : 0,
          ordermoney: isNotBlank(res) ? res.split(',')[1] : 0,
        })

        this.props.form.setFieldsValue({
          receivableMoney: isNotBlank(res) ? getPrice(res.split(',')[0]) : 0,
          invoiceMoney: isNotBlank(res) ? getPrice(res.split(',')[1]) : 0,
          clientid1: isNotBlank(record) && isNotBlank(record.client) && isNotBlank(record.client.clientCpmpany) ? record.client.clientCpmpany : '',
          startDate: isNotBlank(record) && isNotBlank(record.workingDate) ? record.workingDate : '',
          returnedDate: isNotBlank(record) && isNotBlank(record.returnedDate) ? record.returnedDate : '',
        })

      }
    });

    this.props.form.setFieldsValue({
      project: isNotBlank(record.project) ? record.project : '',
      orderCode: isNotBlank(record.orderCode) ? record.orderCode : '',
    })

    this.setState({
      selectcodedata: record,
      selectcodeflag: false,
      otherclientid: isNotBlank(record.client) && isNotBlank(record.client.id) ? record.client.id : ''
    })
  }

  handleModalVisiblecode = flag => {
    this.setState({
      selectcodeflag: !!flag
    });
  };

  handleModalVisiblecodemore = flag => {
    this.setState({
      selectmoreflag: !!flag
    });
  };

  onselecthis = (type) => {
    const { dispatch } = this.props
    const { otherclientid } = this.state

    this.setState({
      historytype: type
    })

    if (isNotBlank(otherclientid)) {
      if (isNotBlank(type) && type == 1) {
        dispatch({
          type: 'cpStartInvoice/get_CpStartInvoiceListCpcliect',
          payload: {
            pageSize: 10,
            'client.id': otherclientid
          }
        });
      } else {
        dispatch({
          type: 'cpStartInvoice/get_CpInvoiceDetailListNoPage',
          payload: {
            pageSize: 10,
            'client.id': otherclientid
          }
        });
      }
      this.setState({ selecthisflag: true });
    } else {
      message.error('请先选择客户!')
    }

    // dispatch({
    // 	type: 'cpStartInvoice/cpStartInvoice_List',
    // 	payload: {
    // 		pageSize: 10,
    // 	}
    // });
  }

  selecthis = (record) => {
    this.props.form.setFieldsValue({
      clientName: record.clientName,
      address: record.address,
      tel: record.tel,
      duty: record.duty,
      openingBank: record.openingBank,
      account: record.account
    })
    this.setState({
      selecthisdata: record,
      selecthisflag: false
    })
  }

  handleModalVisiblehis = flag => {
    this.setState({
      selecthisflag: !!flag
    });
  };

  ontypeChange = e => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpStartInvoice/clear',
    });
    dispatch({
      type: 'cpOfferForm/clear',
    });
    this.setState({
      selectjcdata: {},
      selectkhdata: {},
      selectcodedata: {},
      selectedRows: [],
      inreceivablemoney: '',
      ordermoney: '',
      newarr: []
    })
    if (isNotBlank(e.target.value)) {
      if (e.target.value == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b') {
        this.setState({
          sptitle: '税票(按单)申请单'
        })
      } else if (e.target.value == '6edc254f-5390-4efc-824d-a3b9e4017af0') {
        this.setState({
          sptitle: '税票(合并)申请单'
        })
      } else if (e.target.value == '2') {
        this.setState({
          sptitle: '税票(拆分)申请单'
        })
      } else if (e.target.value == '1') {
        this.setState({
          sptitle: '税票(分批)申请单'
        })
      }
    }
    this.setState({
      valuetype: e.target.value,
    });
  };

  addcfmx = () => {
    this.setState({
      selectcfflag: true,
      cfflag: false
    })
  }

  addhbmx = () => {
    this.setState({
      selecthbflag: true
    })
  }

  handleModalVisiblehb = () => {
    this.setState({
      selecthbflag: false
    })
  }

  handleModalVisiblecf = () => {
    this.setState({
      selectcfflag: false,
      selcfdata: {}
    })
  }

  handleAddcf = (values) => {
    const { dispatch, cpStartInvoiceGet } = this.props
    const { location, selectcodedata, selcfdata, valuetype } = this.state
    const vals = { ...values }
    if (isNotBlank(selcfdata) && isNotBlank(selcfdata.id)) {
      vals.id = selcfdata.id
    }
    dispatch({
      type: 'cpStartInvoice/postCF_Detail',
      payload: {
        ...vals,
        parent: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? selectcodedata.id : (
          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.parent) ? cpStartInvoiceGet.parent : ''),
        invoiceId: location.query.id
      },
      callback: () => {
        this.setState({
          selectcfflag: false,
          selcfdata: {}
        })
        dispatch({
          type: 'cpStartInvoice/cpStartInvoice_Get',
          payload: {
            id: location.query.id,
          }
        })

        let copyarr = []
        if (isNotBlank(valuetype) && valuetype == 2) {
          copyarr.remarks = 1
        }

        dispatch({
          type: 'cpStartInvoice/cpInvoiceDetail_List',
          payload: {
            invoiceId: location.query.id,
            ...copyarr
          }
        })
      }
    })
  }

  editcfmx = (res, flag) => {
    this.setState({
      selectcfflag: true,
      selcfdata: res,
      cfflag: flag
    })
  }

  edithbmx = (res) => {
    this.setState({
      selecthbflag: true,
      selhbdata: res
    })
  }

  handleDeleteClickcf = (id) => {
    const { dispatch } = this.props
    const { location, valuetype } = this.state
    dispatch({
      type: 'cpStartInvoice/cpInvoiceDetail_Delete',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpStartInvoice/cpStartInvoice_Get',
          payload: {
            id: location.query.id,
          }
        })


        let copyarr = []
        if (isNotBlank(valuetype) && valuetype == 2) {
          copyarr.remarks = 1
        }

        dispatch({
          type: 'cpStartInvoice/cpInvoiceDetail_List',
          payload: {
            invoiceId: location.query.id,
            ...copyarr,
          }
        })
      }
    })
  }

  handleDeleteClickhb = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpStartInvoice/cpInvoiceDetail_Delete',
      payload: {
        id
      },
      callback: (res) => {
        this.setState({
          allmoney: ''
        })
        dispatch({
          type: 'cpStartInvoice/cpStartInvoice_Get',
          payload: {
            id: location.query.id,
          }
        })
        dispatch({
          type: 'cpStartInvoice/cpInvoiceDetail_List',
          payload: {
            invoiceId: location.query.id,
          }
        })
      }
    });
  }

  accSub = (arg1, arg2) => {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }

  handleDeleteClickhb1 = (id, money, account) => {
    const { newarr, inreceivablemoney, selectedRows, location } = this.state
    const { dispatch, cpInvoiceDetailList } = this.props


    let delflag = false
    if (isNotBlank(cpInvoiceDetailList) && cpInvoiceDetailList.length > 0) {
      delflag = cpInvoiceDetailList.some(item => {
        return item.id == id
      })
    }

    if (delflag) {
      let copyarrin = [...newarr]
      newarr.forEach((item, idx) => {
        if (item.id == id) {
          copyarrin.splice(idx, 1)
        }
      })
      dispatch({
        type: 'cpStartInvoice/cpInvoiceDetail_Delete',
        payload: {
          id
        },
        callback: (res) => {
          this.setState({
            allmoney: ''
          })
          this.setState({
            inreceivablemoney: Number(inreceivablemoney) - Number(money)
            // selectedRows:selectedRows.filter(item=>{
            // 	return item != id
            // })
          })

          this.props.form.setFieldsValue({
            receivableMoney: getPrice(Number(inreceivablemoney) - Number(money)),
            invoiceMoney: getPrice(Number(inreceivablemoney) - Number(money)),
          })

          this.setState({
            newarr: copyarrin
          })
          dispatch({
            type: 'cpStartInvoice/cpInvoiceDetail_List',
            payload: {
              invoiceId: location.query.id,
            },
            callback: (res) => {
              // this.setState({
              // 	newarr:res
              // })
            }
          })
        }
      });
      // let copyarr = [...newarr]
      // newarr.forEach((item,idx)=>{
      // 	if(item.id==id){
      // 		copyarr.splice(idx,1)
      // 	}
      // })
      // this.setState({
      // 	newarr:copyarr,
      // 	inreceivablemoney:inreceivablemoney-money,
      // 	selectedRows:selectedRows.filter(item=>{
      // 		return item != id
      // 	})
      // })
    } else {

      let copyarr = [...newarr]
      newarr.forEach((item, idx) => {
        if (item.account == account) {
          copyarr.splice(idx, 1)
        }
      })

      console.log(inreceivablemoney, money)
      const newinreceivablemoney = this.accSub(inreceivablemoney, money)

      this.props.form.setFieldsValue({
        receivableMoney: getPrice(newinreceivablemoney),
        invoiceMoney: getPrice(newinreceivablemoney),
      })


      this.setState({
        newarr: copyarr,
        inreceivablemoney: newinreceivablemoney,
        // selectedRows:selectedRows.filter(item=>{
        // 	return item != id
        // })
      })
    }

  }

  onshowdd = () => {
    const { selectkhdata, location } = this.state
    const { cpStartInvoiceGet, dispatch, valuetype } = this.props
    if ((isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) || (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.id))) {
      this.setState({
        selectmoreflag: true,
        selflag: 'kh'
      })

      let newarr = {}

      if (isNotBlank(valuetype) && (valuetype == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b')) {
        newarr.makeType = 2
      } else if (isNotBlank(valuetype) && (valuetype == '2')) {
        newarr.makeType = 1
      }

      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          // genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          current: 1,
          pageSize: 500,
          ...newarr,
          type: 2,
          isInvoice: 0,
          status: 1,
          'client.id': isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id : cpStartInvoiceGet.client.id,
          isOperation: 0
        },
      });
    }
    //  else if (!isNotBlank(location.query.id)) {
    // 	message.error('请先保存订单')
    // }
    else {
      message.error('请先选择客户')
    }
  }

  handleAddcodemore = () => {
    const { dispatch, selectCompleteList, cpInvoiceDetailList } = this.props
    const { selectedRows, location, selflag, valuetype, newarr, newindex, khType } = this.state
    let ids = '';


    const vals = []
    if (isNotBlank(selflag) && selflag == 'kh') {
      vals.isOperation = 0
    }

    if (selectedRows.length === 0) {
      message.error('未选择合并的订单');
      return;
    }

    ids = selectedRows.map(row => row).join(',');
    // if(isNotBlank(location.query)&&!isNotBlank(location.query.id)){
    // let newarrcopy = [...newarr]

    let newarrcopy = [...newarr]
    // let newindex =[]
    if (isNotBlank(cpInvoiceDetailList) && cpInvoiceDetailList.length > 0 && newarr.length == 0) {
      newarrcopy = cpInvoiceDetailList
    }
    // if(isNotBlank(newarrcopy)&&newarrcopy.length>0){
    //  newindex = newarrcopy.map(element => {
    // 	return element.id
    // });
    // }


    const copyselectedRows = [...newindex, ...selectedRows]
    const newselectedRows = [...new Set(copyselectedRows)]


    dispatch({
      type: 'cpStartInvoice/select_Offfrom',
      payload: {
        parent: newselectedRows.map(row => row).join(','),
        type: valuetype
      },
      callback: (res) => {
        this.setState({
          inreceivablemoney: isNotBlank(res) ? res.split(',')[0] : 0,
          selectmoreflag: false
        })

        this.props.form.setFieldsValue({
          receivableMoney: isNotBlank(res) ? getPrice(res.split(',')[0]) : 0,
          invoiceMoney: isNotBlank(res) ? getPrice(res.split(',')[0]) : 0,
        })
      }
    });

    let newarrcopy1 = []

    selectCompleteList.list.forEach(item => {
      newselectedRows.forEach(element => {
        if (item.id == element) {
          newarrcopy1.push(item)
        }
      });
    })

    newarrcopy1 = [...newarrcopy, ...newarrcopy1]
    let lastnewarr = deepClone(newarrcopy1)

    if (khType == 'jc') {
      lastnewarr.forEach((item, idx) => {
        if (!isNotBlank(item.duty)) {
          lastnewarr[idx].duty = item.orderCode
        }
        if (!isNotBlank(item.invoiceMoney)) {
          if (isNotBlank(item.collectCode)) {
            lastnewarr[idx].receivableMoney = parseInt(getPrice(item.money))
          } else {
            lastnewarr[idx].receivableMoney = item.money
          }
        }
        if (!isNotBlank(item.invoiceMoney)) {
          if (isNotBlank(item.collectCode)) {
            lastnewarr[idx].invoiceMoney = parseInt(getPrice(item.money))
          } else {
            lastnewarr[idx].invoiceMoney = item.money
          }
        }
        if (!isNotBlank(item.account)) {
          lastnewarr[idx].account = item.id
          delete lastnewarr[idx].id
        }
      })
    } else {
      lastnewarr.forEach((item, idx) => {
        if (!isNotBlank(item.duty)) {
          lastnewarr[idx].duty = item.orderCode
        }
        if (!isNotBlank(item.invoiceMoney)) {
          lastnewarr[idx].receivableMoney = item.money
        }
        if (!isNotBlank(item.invoiceMoney)) {
          lastnewarr[idx].invoiceMoney = item.money
        }
        if (!isNotBlank(item.account)) {
          lastnewarr[idx].account = item.id
          delete lastnewarr[idx].id
        }
      })
    }

    let hash = {};

    lastnewarr = lastnewarr.reduce(function (item, next) {
      hash[next.duty] ? '' : hash[next.duty] = true && item.push(next);
      return item;
    }, []);


    this.setState({
      newarr: lastnewarr
    })
    // }
    // }else{
    // 	dispatch({
    // 		type: 'cpStartInvoice/select_Offfrom',
    // 		payload: {
    // 			parent: ids,
    // 			type:valuetype
    // 		},
    // 		callback: (res) => {
    // 			this.setState({
    // 				inreceivablemoney: isNotBlank(res) ? res.split(',')[0] : 0,
    // 				selectmoreflag: false
    // 			})
    // 		}
    // 	});
    // }
    // dispatch({
    // 	type: 'cpStartInvoice/cpInvoiceDetail_Add',
    // 	payload: {
    // 		parent: ids,
    // 		invoiceId: location.query.id,
    // 		...vals
    // 	},
    // 	callback: () => {
    // 		this.setState({
    // 			selectmoreflag: false
    // 		})
    // 		dispatch({
    // 			type: 'cpStartInvoice/cpStartInvoice_Get',
    // 			payload: {
    // 				id: location.query.id,
    // 			}
    // 		})
    // 		dispatch({
    // 			type: 'cpStartInvoice/cpInvoiceDetail_List',
    // 			payload: {
    // 				invoiceId: location.query.id,
    // 			}
    // 		})
    // 	}
    // })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  onshowjcdd = () => {
    const { selectjcdata, location } = this.state
    const { cpStartInvoiceGet, dispatch, valuetype } = this.props
    if ((isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) || (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.collectClientId) && isNotBlank(cpStartInvoiceGet.collectClientId.id))) {
      this.setState({
        selectmoreflag: true,
        selflag: 'jc'
      })

      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          // genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
          current: 1,
          pageSize: 500,
          type: 2,
          isInvoice: 0,
          status: 1,
          'collectClientId.id': isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id) ? selectjcdata.id : cpStartInvoiceGet.collectClientId.id
        },
      });

      // } else if (!isNotBlank(location.query.id)) {
      // 	message.error('请先保存订单')
    } else {
      message.error('请先选择集采客户')
    }
  }

  onselectjc = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpCollecClient/cpCollecClient_List',
      payload: {
        pageSize: 10,
        status: 1
      },
      callback: () => {
        this.setState({
          selectjcflag: true
        })
      }
    });
  }

  onselectkh = () => {
    const { dispatch } = this.props
    const that = this
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        ...this.state.khsearch,
        pageSize: 10,
        genTableColumn: isNotBlank(this.state.historyfilter2) ? this.state.historyfilter2 : [],
        isTemplate: 1
      },
      callback: () => {
        that.setState({
          selectkhflag: true
        })
      }
    });
    dispatch({
      type: 'cpClient/cpClient_SearchList'
    })
  }

  onselectshr = (key, idx) => {
    const { dispatch } = this.props
    const that = this
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': '7ea08c3333154a90accd7ae0a19b180a',
        'office.id': getStorage('companyId')
      }
    });
    that.setState({
      idxnumber: idx,
      indexflag: key,
      selectshrflag: true
    })
  }

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  handleModalVisiblejc = flag => {
    this.setState({
      selectjcflag: !!flag
    })
  };

  selectcustomer = (record) => {
    const { dispatch, cpStartInvoiceGet } = this.props
    const { selectkhdata, valuetype } = this.state
    const that = this
    this.props.form.setFieldsValue({
      kh: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
      clientid: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });
    // this.setState({
    // 	clientcollectId: isNotBlank(record.id) ? record.id : '',
    // 	newarr:[]
    // })
    this.setState({
      khType: 'kh'
    })



    if (isNotBlank(record.id) && isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) {
      if (record.id == selectkhdata.id) {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
        })
      } else {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
          newarr: [],
          newindex: [],
          selectedRows: []
        })
        this.props.form.setFieldsValue({
          receivableMoney: '',
          invoiceMoney: ''
        })
      }
    } else if (isNotBlank(record.id) && (!isNotBlank(selectkhdata) || (isNotBlank(selectkhdata) && !isNotBlank(selectkhdata.id))) && isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.id)) {
      if (record.id == cpStartInvoiceGet.client.id) {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
        })
      } else {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
          newarr: [],
          newindex: [],
          selectedRows: []
        })
        this.props.form.setFieldsValue({
          receivableMoney: '',
          invoiceMoney: ''
        })
      }
    } else {
      this.setState({
        clientcollectId: isNotBlank(record.id) ? record.id : '',
        otherclientid: isNotBlank(record.id) ? record.id : '',
        newarr: [],
        newindex: [],
        selectedRows: []
      })
      this.props.form.setFieldsValue({
        receivableMoney: '',
        invoiceMoney: ''
      })
    }



    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        pageSize: 500,
        type: 2,
        status: 1,
        isInvoice: 0,
        'client.id': record.id,
        isOperation: 0
      },
      // callback: (res) => {
      // 	let inarr = []
      // 	if (isNotBlank(res.list) && res.list.length > 0) {
      // 		inarr = res.list.map((item) => {
      // 			return item.id
      // 		})
      // 	} 

      // 	that.setState({
      // 		selectedRows: isNotBlank(res.list)&&res.list.length>0?res.list.map((item)=>{
      // 			return item.id
      // 		}):[],
      // 		newarr:isNotBlank(res.list)&&res.list.length>0?res.list.map((item)=>{
      // 			return item.id
      // 		}):[],
      // 	  });

      // 	if(isNotBlank(inarr)&&inarr.length>0){
      // 	dispatch({
      // 		type: 'cpStartInvoice/select_Offfrom',
      // 		payload: {
      // 			parent: isNotBlank(inarr.join(',')) ? inarr.join(',') : ''
      // 		},
      // 		callback: (resin) => {
      // 			that.setState({
      // 				inreceivablemoney: isNotBlank(resin) ? resin.split(',')[0] : 0
      // 			})
      // 			that.props.form.setFieldsValue({
      // 				receivableMoney : getPrice(resin.split(',')[0]),
      // 				invoiceMoney : getPrice(resin.split(',')[0]),
      // 			})
      // 		}
      // 	});
      // 	}
      // 	else{
      // 		that.setState({
      // 			inreceivablemoney: 0
      // 		})
      // 	}
      // }
    });
    that.setState({
      selectkhdata: record,
      selectjcdata: [],
      selectkhflag: false
    })
  }

  selectjc = (record) => {
    const { dispatch, cpStartInvoiceGet, selectjcdata } = this.props
    const { valuetype } = this.state

    this.props.form.setFieldsValue({
      collectClientname: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
      clientid: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });

    this.setState({
      khType: 'jc'
    })

    if (isNotBlank(record.id) && isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) {
      if (record.id == selectjcdata.id) {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
        })
      } else {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
          newarr: [],
          newindex: [],
          selectedRows: []
        })
        this.props.form.setFieldsValue({
          receivableMoney: '',
          invoiceMoney: ''
        })
      }
    } else if (isNotBlank(record.id) && (!isNotBlank(selectjcdata) || (isNotBlank(selectjcdata) && !isNotBlank(selectjcdata.id))) && isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.collectClientId) && isNotBlank(cpStartInvoiceGet.collectClientId.id)) {
      if (record.id == cpStartInvoiceGet.collectClientId.id) {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
        })
      } else {
        this.setState({
          clientcollectId: isNotBlank(record.id) ? record.id : '',
          otherclientid: isNotBlank(record.id) ? record.id : '',
          newarr: [],
          newindex: [],
          selectedRows: []
        })
        this.props.form.setFieldsValue({
          receivableMoney: '',
          invoiceMoney: ''
        })
      }
    } else {
      this.setState({
        clientcollectId: isNotBlank(record.id) ? record.id : '',
        otherclientid: isNotBlank(record.id) ? record.id : '',
        newarr: [],
        newindex: [],
        selectedRows: []
      })
      this.props.form.setFieldsValue({
        receivableMoney: '',
        invoiceMoney: ''
      })
    }


    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        pageSize: 500,
        type: 2,
        status: 1,
        isInvoice: 0,
        'collectClientId.id': record.id
      },
      // callback: (res) => {
      // 	const inarr = []
      // 	if (isNotBlank(res.list) && res.list.length > 0) {
      // 		const inarr = res.list.map((item) => {
      // 			return item.id
      // 		})
      // 	} 
      // 	this.setState({
      // 		selectedRows: isNotBlank(res.list)&&res.list.length>0?res.list.map((item)=>{
      // 			return item.id
      // 		}):[],
      // 		newarr:isNotBlank(res.list)&&res.list.length>0?res.list.map((item)=>{
      // 			return item.id
      // 		}):[],
      // 	  });
      // 	  if(isNotBlank(inarr)&&inarr.length>0){
      // 	dispatch({
      // 		type: 'cpStartInvoice/select_Offfrom',
      // 		payload: {
      // 			parent: isNotBlank(inarr.join(',')) ? inarr.join(',') : '',
      // 			type:valuetype
      // 		},
      // 		callback: (resin) => {
      // 			this.setState({
      // 				inreceivablemoney: isNotBlank(resin) ? resin.split(',')[0] : 0
      // 			})
      // 			that.props.form.setFieldsValue({
      // 				receivableMoney : getPrice(resin.split(',')[0]),
      // 				invoiceMoney : getPrice(resin.split(',')[0]),
      // 			})
      // 		}
      // 	});
      // }else{
      // 	this.setState({
      // 		inreceivablemoney: 0
      // 	})
      // }
      // }
    });
    this.setState({
      selectjcdata: record,
      selectkhdata: [],
      selectjcflag: false,
    })
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
        id: record.id
      }
    });
  }


  handleSearchVisiblekh = (fieldsValue) => {
    this.setState({
      searchVisiblekh: false,
      historyfilter2: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChangekh = () => {
    const { dispatch } = this.props
    // dispatch({
    // 	type: 'cpOfferForm/CpOffer_SearchList',
    // });
    this.setState({
      searchVisiblekh: true,
    });
  };

  handleSearchAddkh = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        isTemplate: 1
      },
    });
    this.setState({
      searchVisiblekh: false,
      historyfilter2: JSON.stringify(fieldsValue.genTableColumn)
    });
  }


  handleSearchChange = () => {
    this.setState({
      searchVisiblekh: true,
    });
  };


  handleSearchVisible = (fieldsValue) => {
    this.setState({
      searchVisiblecode: false,
      historyfilter1: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChangecode = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpOfferForm/CpOffer_SearchList',
    });
    this.setState({
      searchVisiblecode: true,
    });
  };

  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    const { valuetype } = this.state

    const newobj = {}
    if (isNotBlank(valuetype) && valuetype == 1) {
      newobj.project = 3
    }
    if (isNotBlank(valuetype) && (valuetype == 'bba6ce87-cf73-41dc-ba91-5d8c595e437b')) {
      newobj.makeType = 2
    } else if (isNotBlank(valuetype) && (valuetype == '2')) {
      newobj.makeType = 1
    }

    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        ...this.state.jsdsearch,
        ...newobj,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        status: 1,
        type: 2
      },
    });
    this.setState({
      searchVisiblecode: false,
      historyfilter1: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  handleSearchVisiblemore = (fieldsValue) => {
    this.setState({
      searchVisiblemore: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChangemore = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpOfferForm/CpOffer_SearchList',
    });
    this.setState({
      searchVisiblemore: true,
    });
  };

  handleSearchAddmore = (fieldsValue) => {
    const { dispatch } = this.props;
    const { selflag, clientcollectId, valuetype } = this.state
    if (isNotBlank(selflag) && selflag == 'kh') {
      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          ...this.state.moresearch,
          genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
          current: 1,
          pageSize: 500,
          type: 2,
          isInvoice: 0,
          status: 1,
          'client.id': clientcollectId,
          isOperation: 0
        },
      });
    } else if (isNotBlank(selflag) && selflag == 'jc') {
      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
          current: 1,
          pageSize: 500,
          status: 1,
          type: 2,
          isInvoice: 0,
          'collectClientId.id': clientcollectId
        },
      })
    }
    this.setState({
      searchVisiblemore: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

  handleModalVisibleshr = flag => {
    this.setState({
      selectshrflag: !!flag
    });
  };

  handleSelectRowsshr = rows => {
    this.setState({
      selectedRowsshr: rows,
    });
  };

  selectshr = (record) => {
    const { dispatch } = this.props;
    const { indexflag, showdata } = this.state;
    let newselectcodedata = []
    if (showdata.length === 0) {
      newselectcodedata = []
    } else {
      newselectcodedata = showdata.map(item => ({ ...item }));
    }
    let newindex = ''
    record.status = 0
    showdata.forEach((i, index) => {
      if (i.id === indexflag) {
        newindex = index
      }
    })
    newselectcodedata.splice(newindex, 1, record)
    this.setState({ showdata: newselectcodedata, selectshrflag: false })

    // const { dispatch } = this.props;
    // const { indexflag, showdata ,idxnumber} = this.state;
    // let newselectcodedata = []
    // if (showdata.length === 0) {
    // 	newselectcodedata = []
    // } else {
    // 	newselectcodedata = showdata.map(item => ({ ...item }));
    // }
    // // let newindex = ''
    // record.status = 0
    // // showdata.forEach((i, index) => {
    // // 	if (i.id === indexflag) {
    // // 		newindex = index
    // // 	}
    // // })
    // newselectcodedata.splice(idxnumber, 1, record)
    // this.setState({ showdata: newselectcodedata, selectshrflag: false })
  }

  newMember = () => {
    const { showdata } = this.state;
    let newData = []
    if (showdata.length === 0) {
      newData = []
    } else {
      newData = showdata.map(item => ({ ...item }));
    }
    newData.push({
      id: this.index,
    });
    this.index += 1;
    this.setState({ showdata: newData });
  };

  showsp = (i) => {
    this.setState({
      indexstatus: i,
      modalVisiblepass: true
    })
  }

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const { location, indexstatus } = this.state
    dispatch({
      type: 'cpStartInvoice/cpInvoiceDetail_isPass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpStartInvoice/cpStartInvoice_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
                .length > 0)) {
              this.setState({ orderflag: false })
            } else {
              this.setState({ orderflag: true })
            }
            const allUser = []
            if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
              allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 }, isNotBlank(res.data.fourUser) ? res.data.fourUser : { id: 4 }, isNotBlank(res.data.fiveUser) ? res.data.fiveUser : { id: 5 })
            } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
              allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 }, isNotBlank(res.data.fourUser) ? res.data.fourUser : { id: 4 })
            } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
              allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 })
            } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
              allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 })
            } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
              allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 })
            }
            if (allUser.length == 0) {
              this.setState({
                showdata: [],
                modalVisiblepass: false
              })
            } else {
              this.setState({
                showdata: allUser,
                modalVisiblepass: false
              })
            }
            if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
              let photoUrl = res.data.photo.split('|')
              photoUrl = photoUrl.map((item) => {
                return {
                  id: getFullUrl(item),
                  uid: getFullUrl(item),
                  url: getFullUrl(item),
                  name: getFullUrl(item)
                }
              })
              this.setState({
                addfileList: res.data.photo.split('|'),
                fileList: photoUrl
              })
            }
          }
        });
      }
    })
  }

  repost = () => {
    const { dispatch } = this.props
    const { location, confirmflag1 } = this.state
    const that = this
    setTimeout(function () {
      that.setState({
        confirmflag1: true
      })
    }, 1000)

    if (confirmflag1) {
      this.setState({
        confirmflag1: false
      })
      dispatch({
        type: 'cpStartInvoice/cpInvoiceDetail_resubmit',
        payload: {
          id: location.query.id
        },
        callback: () => {
          dispatch({
            type: 'cpStartInvoice/cpStartInvoice_Get',
            payload: {
              id: location.query.id,
            },
            callback: (res) => {
              if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
                  .length > 0)) {
                this.setState({ orderflag: false })
              } else {
                this.setState({ orderflag: true })
              }
              const allUser = []
              if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
                allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 }, isNotBlank(res.data.fourUser) ? res.data.fourUser : { id: 4 }, isNotBlank(res.data.fiveUser) ? res.data.fiveUser : { id: 5 })
              } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
                allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 }, isNotBlank(res.data.fourUser) ? res.data.fourUser : { id: 4 })
              } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
                allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 }, isNotBlank(res.data.threeUser) ? res.data.threeUser : { id: 3 })
              } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
                allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 }, isNotBlank(res.data.twoUser) ? res.data.twoUser : { id: 2 })
              } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
                allUser.push(isNotBlank(res.data.oneUser) ? res.data.oneUser : { id: 1 })
              }
              if (allUser.length == 0) {
                this.setState({
                  showdata: [],
                  modalVisiblepass: false
                })
              } else {
                this.setState({
                  showdata: allUser,
                  modalVisiblepass: false
                })
              }
              if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
                let photoUrl = res.data.photo.split('|')
                photoUrl = photoUrl.map((item) => {
                  return {
                    id: getFullUrl(item),
                    uid: getFullUrl(item),
                    url: getFullUrl(item),
                    name: getFullUrl(item)
                  }
                })
                this.setState({
                  addfileList: res.data.photo.split('|'),
                  fileList: photoUrl
                })
              }
              this.setState({
                intentionId: location.query.id
              })
              dispatch({
                type: 'cpBillMaterial/get_cpBillMaterial_All',
                payload: {
                  intentionId: location.query.id,
                  pageSize: 10,
                  tag:1
                }
              });
              // dispatch({
              //   type: 'cpBillMaterial/cpBillMaterial_middle_List',
              //   payload: {
              // 	singelId: location.query.id,
              // 	isTemplate:1
              //   },
              //   callback: (res) => {
              // 	let newarr = []
              // 	if (isNotBlank(res.list) && res.list.length > 0) {
              // 	  newarr = [...res.list]
              // 	}
              // 	this.setState({
              // 	  dataSource: newarr
              // 	})
              //   }
              // })
            }
          });
        }
      })
    }
  }

  onUndorepost = (record) => {
    Modal.confirm({
      title: '重新提交该的税票申请单',
      content: '确定重新提交该税票申请单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.repost(record),
    });
  }

  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该的税票申请单',
      content: '确定撤销该税票申请单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(record),
    });
  }

  undoClick = (id) => {
    const { dispatch } = this.props
    const { confirmflag, location } = this.state
    const that = this
    setTimeout(function () {
      that.setState({
        confirmflag: true
      })
    }, 1000)

    if (confirmflag) {
      this.setState({
        confirmflag: false
      })
      dispatch({
        type: 'cpRevocation/cpInvoiceDetail_revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/business/process/cp_start_invoice_form?id=${location.query.id}`);
          // router.push('/business/process/cp_start_invoice_list');
        }
      })
    }
  }

  remove(key) {
    const { showdata } = this.state;
    const { onChange } = this.props;

    const newData = showdata.filter(item => item.id !== key);
    this.setState({ showdata: newData });
  }

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/StartInvoicePrint?id=${location.query.id}`
  }

  handleUpldExportClick = (type) => {
    const { location } = this.state
    const userid = {
      id: isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id) ? location.query.id : '',
      'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : ''
    };
    window.open(`/api/Beauty/beauty/cpInvoiceDetail/exportMerge?${stringify(userid)}`);
  };

  render() {
    const { fileList, previewVisible, previewImage, selectcodeflag, selectcodedata, selecthisflag, selecthisdata,
      selectcfflag, valuetype, selcfdata, selhbdata, selecthbflag, selectjcflag, selectjcdata, selectkhdata, selectkhflag, orderflag, sptitle, selectshrflag, selectedRowsshr,
      selectmoreflag, selectedRows, allmoney, searchVisiblecode, searchVisiblemore, selflag, clientcollectId, inreceivablemoney, khType
      , maintenance_project, modalVisiblepass, showdata, ordermoney, newarr, location, otherclientid, historytype, searchVisiblekh, cfflag } = this.state;
    const { submitting1, submitting2, submitting, cpStartInvoiceGet, selectCompleteList, cpStartInvoiceNotPageList, getCpStartInvoiceListCpcliect, cpOfferSearchList, cpOfferFormList,
      cpStartInvoiceList, cpClientList, cpCollecClientList, dispatch, cpInvoiceDetailList, cpClientSearchList, levellist, levellist2, newdeptlist, modeluserList } = this.props;
    const that = this
    const {
      form: { getFieldDecorator },
    } = this.props;


    console.log(inreceivablemoney)

    const columnssh = [
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record, idx) => {
          if ((isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
              .length > 0 && (JSON.stringify(cpStartInvoiceGet) == "{}" ||
                (cpStartInvoiceGet.approvals === 0 || cpStartInvoiceGet.approvals === '0')) ||
            (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.createBy) && (cpStartInvoiceGet.approvals === 2 || cpStartInvoiceGet.approvals === '2')) ||
            (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.createBy) && (cpStartInvoiceGet.approvals === 4 || cpStartInvoiceGet.approvals === '4'))
          ) && 'id') {
            return (
              <span>
                <a onClick={e => this.onselectshr(record.id, idx)}>选择</a>
              </span>
            );
          }
          return ''
        }
      },
      {
        title: '审核人姓名',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (text) => {
          if (isNotBlank(cpStartInvoiceGet) && (cpStartInvoiceGet.approvals !== 0 || cpStartInvoiceGet.approvals !== '0')) {
            return (<span>{shstatus(text)}</span>)
          }
          return ''
        }
      },
      {
        title: '审核结果',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 250,
      },
      {
        title: '删除',
        key: 'action',
        width: 100,
        render: (text, record, idx) => {
          if ((isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
              .length > 0 && (JSON.stringify(cpStartInvoiceGet) == "{}" ||
                (cpStartInvoiceGet.approvals === 0 || cpStartInvoiceGet.approvals === '0')) ||
            (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.createBy) && (cpStartInvoiceGet.approvals === 2 || cpStartInvoiceGet.approvals === '2')) ||
            (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.createBy) && (cpStartInvoiceGet.approvals === 4 || cpStartInvoiceGet.approvals === '4'))
          )) {
            return (
              <span>
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id, idx)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return ''
        }
      },
    ];



    const parentSearchMethodskh = {
      handleSearchVisiblekh: this.handleSearchVisiblekh,
      handleSearchAddkh: this.handleSearchAddkh,
      cpClientSearchList,
    }

    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpOfferSearchList,
    }
    const parentSearchMethodsmore = {
      handleSearchVisiblemore: this.handleSearchVisiblemore,
      handleSearchAddmore: this.handleSearchAddmore,
      cpOfferSearchList,
    }
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
    const columnscf = [
      {
        title: '修改',
        width: 100,
        render: (text, record) => {
          if (orderflag) {
            return <Fragment>
              <a onClick={() => this.editcfmx(record, true)}>详情</a>
            </Fragment>
          }
          return <Fragment>
            <a onClick={() => this.editcfmx(record, false)}>修改</a>
          </Fragment>
        },
      },
      {
        title: '开票申请单',
        dataIndex: 'invoiceId',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '客户名称',
        dataIndex: 'clientName',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '地址',
        dataIndex: 'address',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '电话',
        dataIndex: 'tel',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '税号',
        dataIndex: 'duty',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '开户行',
        dataIndex: 'openingBank',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '账号',
        dataIndex: 'account',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '客户名称',
        dataIndex: 'clientName1',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '地址',
        dataIndex: 'address1',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '联系人',
        dataIndex: 'likeMan',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '手机',
        dataIndex: 'phone',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '电话',
        dataIndex: 'tel1',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '邮编',
        dataIndex: 'postcode',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '快递公司',
        dataIndex: 'company',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '寄出日期',
        dataIndex: 'sendDate',
        editable: true,
        inputType: 'dateTime',
        width: 100,
        sorter: true,
      },
      {
        title: '开票金额',
        dataIndex: 'invoiceMoney',
        inputType: 'text',
        width: 100,
        editable: true,
        render: text => (getPrice(text))
      },
      {
        title: '更新时间',
        dataIndex: 'finishDate',
        editable: true,
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
        title: '备注信息',
        dataIndex: 'remarks',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => {
          if (!orderflag) {
            return <Fragment>
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClickcf(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          }
          return ''
        },
      },
    ]
    const shstatus = (apps) => {
      if (apps === '0' || apps === 0) {
        return '待审核'
      }
      if (apps === '1' || apps === 1) {
        return '通过'
      }
      if (apps === '2' || apps === 2) {
        return '驳回'
      }
    }
    const columnshb = [
      {
        title: '订单编号',
        dataIndex: 'duty',
        inputType: 'text',
        width: 200,
        editable: true,
      },
      {
        title: '业务发生时间',
        dataIndex: 'startDate',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '拟定回款时间',
        dataIndex: 'endDate',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '应收金额',
        dataIndex: 'receivableMoney',
        inputType: 'text',
        width: 100,
        editable: true,
        render: text => (getPrice(text))
      },
      {
        title: '开票金额',
        dataIndex: 'invoiceMoney',
        inputType: 'text',
        width: 100,
        editable: true,
        render: text => (getPrice(text))
      },
      {
        title: '备注信息',
        dataIndex: 'remarks',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => {
          if (!orderflag) {
            return <Fragment>
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClickhb(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          }
          return ''
        },
      },
    ]


    const columnshb1 = [
      {
        title: '订单编号',
        dataIndex: 'duty',
        inputType: 'text',
        width: 200,
        editable: true,
      },
      {
        title: '业务发生时间',
        dataIndex: 'createDate',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      // {
      // 	title: '拟定回款时间',        
      // 	dataIndex: 'endDate',   
      // 	inputType: 'text',   
      // 	width: 150,          
      // 	editable: true,      
      // },
      {
        title: '应收金额',
        dataIndex: 'invoiceMoney',
        inputType: 'text',
        width: 100,
        editable: true,
        render: text => {
          // if(khType=='jc'){
          // 	return getPrice(getPrice(text))
          // }
          return getPrice(text)
        }
      },
      {
        title: '开票金额',
        dataIndex: 'invoiceMoney',
        inputType: 'text',
        width: 100,
        editable: true,
        render: text => {
          // if(khType=='jc'){
          // 	return getPrice(getPrice(text))
          // }
          return getPrice(text)
        }
      },
      {
        title: '备注信息',
        dataIndex: 'remarks',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => {
          if (!orderflag) {
            return <Fragment>
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClickhb1(record.id, record.invoiceMoney, record.account)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          }
          return ''
        },
      },
    ]

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );


    const parentMethodsshr = {
      handleAddkh: this.handleAddkh,
      handleModalVisibleshr: this.handleModalVisibleshr,
      handleSelectRows: this.handleSelectRowsshr,
      selectedRows: selectedRowsshr,
      selectshr: this.selectshr,
      dispatch,
      levellist, levellist2, newdeptlist,
      modeluserList,
      that
    }
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }
    const parentMethodshb = {
      handleAddhb: this.handleAddhb,
      handleModalVisiblehb: this.handleModalVisiblehb,
      selhbdata
    }
    const parentMethodscf = {
      handleAddcf: this.handleAddcf,
      handleModalVisiblecf: this.handleModalVisiblecf,
      onselecthis: this.onselecthis,
      selcfdata,
      selecthisdata,
      cfflag
    }
    const parentMethodsmore = {
      handleAddcodemore: this.handleAddcodemore,
      handleModalVisiblecodemore: this.handleModalVisiblecodemore,
      that,
      maintenance_project,
      selectedRows,
      dispatch,
      handleSelectRows: this.handleSelectRows,
      selectcodemore: this.selectcodemore,
      selectCompleteList,
      handleSearchChangemore: this.handleSearchChangemore,
      selflag,
      valuetype,
      clientcollectId
    }
    const parentMethodscode = {
      handleAddcode: this.handleAddcode,
      handleModalVisiblecode: this.handleModalVisiblecode,
      that,
      valuetype,
      maintenance_project,
      selectcode: this.selectcode,
      selectCompleteList,
      handleSearchChangecode: this.handleSearchChangecode,
      dispatch
    }
    const parentMethodshis = {
      handleModalVisiblehis: this.handleModalVisiblehis,
      selecthis: this.selecthis,
      otherclientid,
      cpStartInvoiceNotPageList: isNotBlank(historytype) && historytype == 1 ? getCpStartInvoiceListCpcliect : cpStartInvoiceNotPageList,
      that
    }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      cpClientList,
      handleSearchChange: this.handleSearchChange,
      dispatch,
      that
    }
    const parentMethodsjc = {
      handleAddjc: this.handleAddjc,
      handleModalVisiblejc: this.handleModalVisiblejc,
      selectjc: this.selectjc,
      cpCollecClientList,
      that
    }
    const appData = (apps) => {
      if (apps === 0 || apps === '0') {
        return '待分配'
      }
      if (apps === 1 || apps === '1') {
        return '待审核'
      }
      if (apps === 2 || apps === '2') {
        return '重新提交'
      }
      if (apps === 3 || apps === '3') {
        return '通过'
      }
      if (apps === 4 || apps === '4') {
        return '驳回'
      }
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            {sptitle}
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="开票类型" className={styles.card} bordered={false}>
              <Col lg={24} md={24} sm={24} style={{ textAlign: 'center' }}>
                <Radio.Group onChange={this.ontypeChange} value={this.state.valuetype} disabled={orderflag}>
                  <Radio value="bba6ce87-cf73-41dc-ba91-5d8c595e437b">按单开票</Radio>
                  <Radio value="6edc254f-5390-4efc-824d-a3b9e4017af0">合并开票</Radio>
                  <Radio value="2">拆分开票</Radio>
                  <Radio value="1">分批开票</Radio>
                </Radio.Group>
              </Col>
            </Card>
            <Card title="基础信息" className={styles.card} bordered={false}>
              {(isNotBlank(valuetype) && valuetype != '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
                <Col lg={24} md={24} sm={24}>
                  <div style={{ textAlign: 'center' }}><span>选择需税票申请的结算单</span><Button
                    type="primary"
                    style={{ marginLeft: '8px' }}
                    onClick={this.onselectsh}
                    loading={submitting}
                    disabled={orderflag}
                  >选择
                                                                         </Button>
                  </div>
                </Col>
              }
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='审批进度'>
                  <Input

                    value={isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.approvals) ?
                      appData(cpStartInvoiceGet.approvals) : ''}
                    disabled
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='单号'>
                  <Input disabled value={isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.id) ? cpStartInvoiceGet.id : ''} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='开票方'>
                  {getFieldDecorator('drawer', {
                    initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.drawer) ? cpStartInvoiceGet.drawer : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入开票方',
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='业务项目'>
                  {getFieldDecorator('project', {
                    initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.project) ? selectcodedata.project : isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.project) ? cpStartInvoiceGet.project : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入业务项目',
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled
                    >
                      {
                        isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>

                  )}
                </FormItem>
              </Col>
              {(isNotBlank(valuetype) && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='客户' className='allinputstyle'>
                    {getFieldDecorator('clientid', {
                      initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.clientCpmpany) ? selectkhdata.clientCpmpany :
                        isNotBlank(selectjcdata) && isNotBlank(selectjcdata.clientCpmpany) ? selectjcdata.clientCpmpany :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.clientCpmpany) ? cpStartInvoiceGet.client.clientCpmpany :
                            isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.collectClientId) && isNotBlank(cpStartInvoiceGet.collectClientId.name) ? cpStartInvoiceGet.collectClientId.name : ''
                      ,
                      rules: [
                        {
                          required: true,
                          message: '请输入客户',
                        },
                      ],
                    })(<Input

                      style={(isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) || (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.id)) ? { color: '#f50', width: '50%' } :
                        (isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) || (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.collectClientId) && isNotBlank(cpStartInvoiceGet.collectClientId.id)) ? { color: '#87d068', width: '50%' } : { width: '50%' }}
                      disabled
                    />)}
                    <Button disabled={orderflag} style={{ marginLeft: '8px', color: '#f50' }} onClick={this.onselectkh}>选择</Button>
                    <Button disabled={orderflag} style={{ marginLeft: '8px', color: '#87d068' }} onClick={this.onselectjc}>选择集采客户</Button>
                  </FormItem>
                </Col>
              }
              {!(isNotBlank(valuetype) && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    {getFieldDecorator('clientid1', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.clientCpmpany) ? selectcodedata.client.clientCpmpany :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.clientCpmpany) ? cpStartInvoiceGet.client.clientCpmpany : ''
                      ,
                      rules: [
                        {
                          required: true,
                          message: '请输入客户',
                        },
                      ],
                    })(
                      <Input disabled value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.clientCpmpany) ? selectcodedata.client.clientCpmpany :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.clientCpmpany) ? cpStartInvoiceGet.client.clientCpmpany : ''} />
                    )}
                  </FormItem>
                </Col>
              }
              {!(isNotBlank(valuetype) && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
                <span>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='订单编号'>
                      {getFieldDecorator('orderCode', {
                        initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.orderCode) ? selectcodedata.orderCode :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.orderCode) ? cpStartInvoiceGet.orderCode : ''
                        ,
                        rules: [
                          {
                            required: false,
                            message: '订单编号',
                          },
                        ],
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label="业务发生日期">
                      {getFieldDecorator('startDate', {
                        initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.workingDate) ? selectcodedata.workingDate :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.startDate) ? cpStartInvoiceGet.startDate : '',
                      })(
                        <Input disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label="拟定回款日期">
                      {getFieldDecorator('endDate', {
                        initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.returnedDate) ? selectcodedata.returnedDate :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.startDate) ? cpStartInvoiceGet.startDate : '',
                      })(
                        <Input disabled />
                      )}
                    </FormItem>
                  </Col>
                </span>
              }

              {!isNotBlank(valuetype) || (isNotBlank(valuetype) && valuetype != 1) &&
                <span>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='应收金额'>
                      {getFieldDecorator('receivableMoney', {
                        initialValue: isNotBlank(inreceivablemoney) ? getPrice(inreceivablemoney) :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.receivableMoney) ? getPrice(cpStartInvoiceGet.receivableMoney) : '',
                        rules: [
                          {
                            required: false,
                            message: '请输入应收金额',
                          },
                        ],
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='开票金额'>
                      {getFieldDecorator('invoiceMoney', {
                        initialValue: isNotBlank(inreceivablemoney) ? getPrice(inreceivablemoney) :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.invoiceMoney) ? getPrice(cpStartInvoiceGet.invoiceMoney) : '',
                        rules: [
                          {
                            required: false,
                            message: '请输入开票金额',
                          },
                        ],
                      })(<InputNumber style={{ width: '100%' }} disabled />)}
                    </FormItem>
                  </Col>
                </span>
              }

              {(isNotBlank(valuetype) && valuetype == 1) &&
                <span>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='应收金额'>
                      {getFieldDecorator('receivableMoney', {
                        initialValue: isNotBlank(inreceivablemoney) ? getPrice(inreceivablemoney) :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.receivableMoney) ? getPrice(cpStartInvoiceGet.receivableMoney) : '',
                        rules: [
                          {
                            required: false,
                            message: '请输入应收金额',
                          },
                        ],
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='开票金额'>
                      {getFieldDecorator('invoiceMoney', {
                        initialValue: isNotBlank(ordermoney) ? getPrice(ordermoney) :
                          isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.invoiceMoney) ? getPrice(cpStartInvoiceGet.invoiceMoney) : '',
                        rules: [
                          {
                            required: false,
                            message: '请输入开票金额',
                          },
                        ],
                      })(<InputNumber style={{ width: '100%' }} disabled={orderflag} />)}
                    </FormItem>
                  </Col>
                </span>
              }



              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='开票方式'>
                  {getFieldDecorator('makeNeed', {
                    initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.makeNeed) ? cpStartInvoiceGet.makeNeed : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入开票方式',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={{ width: '100%' }}

                    disabled={orderflag}
                  >
                    {
                      isNotBlank(this.state.make_need) && this.state.make_need.length > 0 && this.state.make_need.map(d =>
                        <Option style={isNotBlank(d.value) && d.value == '7cc2cd2e-ab8d-4ba2-8fde-7ca5c6fd23c0' ? { display: 'none' } : {}} key={d.id} value={d.value}>{d.label}</Option>
                      )
                    }
                  </Select>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='开票内容'>
                  {getFieldDecorator('makeRemarks', {
                    initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.makeRemarks) ? cpStartInvoiceGet.makeRemarks : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入开票内容',
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='申请人'>
                  {getFieldDecorator('applyUser', {
                    initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.applyUser) ? cpStartInvoiceGet.applyUser : getStorage('username'),
                    rules: [
                      {
                        required: false,
                        message: '申请人',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='代办事项'>
                  {getFieldDecorator('commissionMatter', {
                    initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.commissionMatter) ? cpStartInvoiceGet.commissionMatter : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入代办事项',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={{ width: '100%' }}

                    disabled={orderflag}
                  >
                    {
                      isNotBlank(this.state.commissionMatter) && this.state.commissionMatter.length > 0 && this.state.commissionMatter.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                    }
                  </Select>)}
                </FormItem>
              </Col>
              {isNotBlank(valuetype) && valuetype == 2 &&
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开票状态'>
                    {getFieldDecorator('invoiceStatus', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.invoiceStatus) ? cpStartInvoiceGet.invoiceStatus : '未开票',
                      rules: [
                        {
                          required: false,
                          message: '请输入开票状态',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
              }
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                  {getFieldDecorator('remarks', {
                    initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.remarks) ? cpStartInvoiceGet.remarks : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入备注信息',
                      },
                    ],
                  })(
                    <TextArea
                      disabled={orderflag}
                      style={{ minHeight: 32 }}

                      rows={2}
                    />
                  )}
                </FormItem>
              </Col>
              {(isNotBlank(valuetype) && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
                <Col lg={24} md={24} sm={24} style={{ textAlign: 'center' }}>
                  <Button disabled={orderflag} style={{ marginLeft: '8px', color: '#f50' }} onClick={this.onshowdd}>选择合并订单</Button>
                  <Button disabled={orderflag} style={{ marginLeft: '8px', color: '#87d068' }} onClick={this.onshowjcdd}>选择合并集采订单</Button>
                </Col>
              }
            </Card>
            {!(isNotBlank(valuetype) && valuetype == '2') &&
              <Card title="开票资料内容" className={styles.card} bordered={false}>
                <Col lg={24} md={24} sm={24}>
                  <div style={{ textAlign: 'center' }}><span>选择历史开票信息</span><Button
                    type="primary"
                    style={{ marginLeft: '8px' }}
                    onClick={() => this.onselecthis(1)}
                    loading={submitting}
                    disabled={orderflag}
                  >选择
                                                                      </Button>
                  </div>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户名称'>
                    {getFieldDecorator('clientName', {
                      initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.clientName) ? selecthisdata.clientName :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.clientName) ? cpStartInvoiceGet.clientName : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入客户名称',
                        },
                      ],
                    })(<Input
                      disabled={orderflag}

                      value={isNotBlank(selecthisdata) && isNotBlank(selecthisdata.clientName) ? selecthisdata.clientName :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.clientName) ? cpStartInvoiceGet.clientName : ''}
                    />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='地址'>
                    {getFieldDecorator('address', {
                      initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.address) ? selecthisdata.address :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.address) ? cpStartInvoiceGet.address : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入地址',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='电话'>
                    {getFieldDecorator('tel', {
                      initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.tel) ? selecthisdata.tel :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.tel) ? cpStartInvoiceGet.tel : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入电话',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='税号'>
                    {getFieldDecorator('duty', {
                      initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.duty) ? selecthisdata.duty :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.duty) ? cpStartInvoiceGet.duty : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入税号',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开户行'>
                    {getFieldDecorator('openingBank', {
                      initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.openingBank) ? selecthisdata.openingBank :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.openingBank) ? cpStartInvoiceGet.openingBank : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入开户行',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='账号'>
                    {getFieldDecorator('account', {
                      initialValue: isNotBlank(selecthisdata) && isNotBlank(selecthisdata.account) ? selecthisdata.account :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.account) ? cpStartInvoiceGet.account : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入账号',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
              </Card>
            }
            {!(isNotBlank(valuetype) && valuetype == '2') &&
              <Card title="税票邮递资料" className={styles.card} bordered={false}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户名称'>
                    {getFieldDecorator('clientName1', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.clientName1) ? cpStartInvoiceGet.clientName1 : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入客户名称',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='地址'>
                    {getFieldDecorator('address1', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.address1) ? cpStartInvoiceGet.address1 : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入地址',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    {getFieldDecorator('likeMan', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.likeMan) ? cpStartInvoiceGet.likeMan : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入联系人',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='手机'>
                    {getFieldDecorator('phone', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.phone) ? cpStartInvoiceGet.phone : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入手机',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='电话'>
                    {getFieldDecorator('tel1', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.tel1) ? cpStartInvoiceGet.tel1 : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入电话',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='邮编'>
                    {getFieldDecorator('postcode', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.postcode) ? cpStartInvoiceGet.postcode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入邮编',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='快递公司'>
                    {getFieldDecorator('company', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.company) ? cpStartInvoiceGet.company : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入快递公司',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开票状态'>
                    {getFieldDecorator('invoiceStatus', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.invoiceStatus) ? cpStartInvoiceGet.invoiceStatus : '未开票',
                      rules: [
                        {
                          required: false,
                          message: '请输入开票状态',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="寄出日期">
                    {getFieldDecorator('sendDate', {
                      initialValue: isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.sendDate) ? moment(cpStartInvoiceGet.sendDate) : null,
                    })(
                      <DatePicker
                        disabled={orderflag}

                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Card>
            }
            <Card title="审核人管理" bordered={false}>
              {getFieldDecorator('members', {
                initialValue: '',
              })(
                <Table
                  columns={columnssh}
                  dataSource={showdata}
                  pagination={false}
                />
              )}
              {isNotBlank(showdata) && showdata.length < 5 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  onClick={this.newMember}
                  icon="plus"
                  disabled={!((JSON.stringify(cpStartInvoiceGet) == "{}") || (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.approvals) &&
                    (cpStartInvoiceGet.approvals === 0 || cpStartInvoiceGet.approvals === '0')) ||
                    (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.createBy) && (cpStartInvoiceGet.approvals === 2 || cpStartInvoiceGet.approvals === '2')) ||
                    (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.createBy) && (cpStartInvoiceGet.approvals === 4 || cpStartInvoiceGet.approvals === '4'))
                  )}
                >
                  新增审核人
</Button>
              }
              {isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.isOperation) && (cpStartInvoiceGet.isOperation === 1 || cpStartInvoiceGet.isOperation === '1') &&
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <Button type="primary" onClick={() => this.showsp(3)}>
                    审核通过
            </Button>
                  <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => this.showsp(2)}>
                    审核驳回
            </Button>
                </div>
              }
            </Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.id) &&
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                  打印
          </Button>}
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpStartInvoice')[0].children.filter(item => item.name == '修改')
                  .length > 0 && <span>
                  <Button loading={submitting1 || submitting2} type="primary" onClick={this.onsave} disabled={orderflag}>
                    保存
  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    htmlType="submit"
                    loading={submitting1 || submitting2}
                    disabled={orderflag}
                  >
                    提交
  </Button>
                  {(isNotBlank(valuetype) && valuetype == '2') &&
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={this.addcfmx}
                      loading={submitting1 || submitting2}
                      disabled={orderflag || !isNotBlank(cpStartInvoiceGet.id)}
                    >
                      新增明细
  </Button>
                  }
                  {isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.approvals) &&
                    (cpStartInvoiceGet.approvals === 1 || cpStartInvoiceGet.approvals === '1') && isNotBlank(cpStartInvoiceGet.createBy) &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1 || submitting2} onClick={() => this.onUndorepost()}>
                      重新提交
                      </Button>
                  }
                  {
                    orderflag && cpStartInvoiceGet.approvals === '3' &&
                    <Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpStartInvoiceGet.id)}>
                      撤销
                      </Button>
                  }
                  {(isNotBlank(valuetype) && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
                    <Button style={{ marginLeft: 8 }} icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
                      导出
                        </Button>
                  }
                </span>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
          </Button>
            </FormItem>
          </Form>
        </Card>

        {(isNotBlank(valuetype) && valuetype == '2') &&
          <div className={styles.standardList}>
            <Card bordered={false} title='拆分税票明细'>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator} />
                <StandardEditTable
                  scroll={{ x: 1800 }}
                  data={{ list: cpInvoiceDetailList, pagination: { total: isNotBlank(cpInvoiceDetailList) && cpInvoiceDetailList.length > 0 ? cpInvoiceDetailList.length : 0 } }}
                  bordered
                  columns={columnscf}
                />
              </div>
            </Card>
          </div>
        }

        {(isNotBlank(valuetype) && valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
          <div className={styles.standardList}>
            <Card bordered={false} title='合并订单明细'>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator} />
                <StandardEditTable
                  scroll={{ x: 800 }}
                  data={{ list: newarr, pagination: { total: isNotBlank(newarr) && newarr.length ? newarr.length : 0 } }}
                  bordered
                  columns={columnshb1}
                />
              </div>
            </Card>
          </div>
        }


        {/* {(isNotBlank(valuetype) &&isNotBlank(location.query) && isNotBlank(location.query.id)&& valuetype == '6edc254f-5390-4efc-824d-a3b9e4017af0') &&
    <div className={styles.standardList}>
      <Card bordered={false} title='合并订单明细'>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator} />
          <StandardEditTable
            scroll={{ x: 800 }}
            data={cpInvoiceDetailList}
            bordered
            columns={columnshb}
          />
        </div>
      </Card>
    </div>
		} */}
        <SearchFormkh {...parentSearchMethodskh} searchVisiblekh={searchVisiblekh} />

        <SearchFormmore {...parentSearchMethodsmore} searchVisiblemore={searchVisiblemore} />
        <SearchForm {...parentSearchMethods} searchVisiblecode={searchVisiblecode} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateFormshr {...parentMethodsshr} selectshrflag={selectshrflag} />
        <CreateFormcodemore {...parentMethodsmore} selectmoreflag={selectmoreflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormjc {...parentMethodsjc} selectjcflag={selectjcflag} />
        <CreateFormhb {...parentMethodshb} selecthbflag={selecthbflag} />
        <CreateFormcf {...parentMethodscf} selectcfflag={selectcfflag} />
        <CreateFormcode {...parentMethodscode} selectcodeflag={selectcodeflag} />
        <CreateFormhis {...parentMethodshis} selecthisflag={selecthisflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpStartInvoiceForm;
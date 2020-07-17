import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  InputNumber,
  message,
  Icon,
  Modal,
  DatePicker,
  Row, Col,
  Table, Popconfirm, Cascader
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, setPrice, getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragTable from '../../components/StandardEditTable/dragTable'
import styles from './CpMoneyChangeForm.less';
import SearchTableList from '@/components/SearchTableList';
import stylessp from './style.less';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;
const { Option } = Select;
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
      searchVisible,
      form: { getFieldDecorator },
      handleSearchVisible,
      cpBusinessOrderSearchList,
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
          })(<SearchTableList searchList={cpBusinessOrderSearchList} />)}
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
        {form.getFieldDecorator('remarks', {
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
const CreateFormcode = Form.create()(props => {
  const { handleModalVisiblecode, selectCompleteList, selectcodeflag, selectcode, dispatch, form, form: { getFieldDecorator }, handleSearchChangeout, that } = props;
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
      dataIndex: 'user.name',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '进场类型',
      dataIndex: 'assemblyEnterType',
      inputType: 'text',
      align: 'center',
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
      title: '车型/排量',
      dataIndex: 'assemblyVehicleEmissions',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '年份',
      dataIndex: 'assemblyYear',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '总成型号',
      dataIndex: 'assemblyModel',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '钢印号',
      dataIndex: 'assemblySteelSeal',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: 'VIN码',
      dataIndex: 'assemblyVin',
      inputType: 'text',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '其他识别信息',
      dataIndex: 'assemblyMessage',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '故障代码',
      dataIndex: 'assemblyFaultCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '本次故障描述',
      dataIndex: 'assemblyErrorDescription',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '销售明细',
      dataIndex: 'salesParticular',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '应收金额',
      dataIndex: 'totalMoney',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
      render: (text, res) => {
        if (isNotBlank(res.collectCode)) {
          return getPrice(getPrice(text))
        }
        return getPrice(text)
      }
    },
    {
      title: '意向单价',
      dataIndex: 'intentionPrice',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
      render: text => (getPrice(text))
    },
    {
      title: '交货时间',
      dataIndex: 'deliveryDate',
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
      title: '付款方式',
      dataIndex: 'paymentMethod',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '旧件需求',
      dataIndex: 'oldNeed',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '开票需求',
      dataIndex: 'makeNeed',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '质保项时间',
      dataIndex: 'qualityTime',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '质量要求',
      dataIndex: 'qualityNeed',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '油品要求',
      dataIndex: 'oilsNeed',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '外观要求',
      dataIndex: 'guiseNeed',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '安装指导',
      dataIndex: 'installationGuide',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '物流要求',
      dataIndex: 'logisticsNeed',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '其他约定事项',
      dataIndex: 'otherBuiness',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '维修项目',
      dataIndex: 'maintenanceProject',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '行程里程',
      dataIndex: 'tripMileage',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '是否拍照',
      dataIndex: 'isPhotograph',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '发货地址',
      dataIndex: 'shipAddress',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '维修历史',
      dataIndex: 'maintenanceHistory',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '定损员',
      dataIndex: 'partFee',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '事故单号',
      dataIndex: 'accidentNumber',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '事故说明',
      dataIndex: 'accidentExplain',
      inputType: 'text',
      align: 'center',
      width: 150,
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
      editable: true,
      inputType: 'dateTime',
      align: 'center',
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
      align: 'center',
      width: 150,
      editable: true,
    }]
  const handleFormResetout = () => {
    form.resetFields();
    that.setState({
      wtdsearch: {}
    })
    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
        jsStatus: 1
      }
    });
  }
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    // const { formValues, location } = this.state;
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
      ...that.state.wtdsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
      ...sort,
      // ...formValues,
      ...filters,
      jsStatus: 1
    };
    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: params,
    });
  };
  const handleSearchout = e => {
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
        wtdsearch: values
      })
      dispatch({
        type: 'cpAfterApplicationFrom/select_complete_List',
        payload: {
          ...values,
          genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
          pageSize: 10,
          current: 1,
          jsStatus: 1
        }
      });
    });
  };


  const handleModalVisiblecodein = () => {
    // form.resetFields();
    // that.setState({
    //   wtdsearch: {}
    // })
    handleModalVisiblecode()
  }

  const renderSimpleForm = () => {
    return (
      <Form onSubmit={handleSearchout} layout="inline">
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
            <Button style={{ marginLeft: 8 }} onClick={handleFormResetout}>
              重置
          </Button>
            {/* <a style={{ marginLeft: 8 }} onClick={toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            <a style={{ marginLeft: 8 }} onClick={handleSearchChangeout}>
              过滤其他 <Icon type="down" />
            </a>
          </span>
        </div>
        {/* </Row> */}
      </Form>
    );
  }

  return (
    <Modal
      title='选择委托单'
      visible={selectcodeflag}
      onCancel={() => handleModalVisiblecodein()}
      width='80%'
    >
      <div className={styles.tableListForm}>{renderSimpleForm()}</div>
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
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, modeluserList, selectkhflag, selectcustomer, selectedRows, handleSelectRows, levellist, levellist2, newdeptlist, form, dispatch, that } = props;
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
      title: '编号',
      dataIndex: 'no',
      align: 'center',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
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
        current: 1,
        pageSize: 10,
      };
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.no)) {
        values.no = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.name)) {
        values.name = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.office.id)) {
        values.office.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      } else {
        values.dept = values.dept[values.dept.length - 1];
      }

      that.setState({
        shrsearch: values
      })

      dispatch({
        type: 'sysuser/modeluser_List',
        payload: {
          'role.id': 6,
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
        'role.id': 6,
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
      'role.id': 6,
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

  const handleModalVisiblekhin = () => {
    // form.resetFields();
    // that.setState({
    //   shrsearch: {}
    // })
    handleModalVisiblekh()
  }


  return (
    <Modal
      title='选择审核人'
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekhin()}
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
              {getFieldDecorator('office.id', {
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
        columns={columnskh}
      />
    </Modal>
  );
});
@connect(({ cpMoneyChange, loading, cpAfterApplicationFrom, sysuser, syslevel, sysdept, cpBusinessOrder }) => ({
  ...cpMoneyChange,
  ...cpAfterApplicationFrom,
  ...sysuser,
  ...syslevel,
  ...sysdept,
  ...cpBusinessOrder,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpMoneyChange/cpMoneyChange_submit'],
  submitting2: loading.effects['cpMoneyChange/cpMoneyChange_save'],
}))
@Form.create()
class CpMoneyChangeForm extends PureComponent {
  index = 0

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectcodeflag: false,
      selectcodedata: [],
      indexstatus: 0,
      modalVisiblepass: false,
      showdata: [],
      orderflag: false,
      biliNumber: '',
      thischangeMoney: '',
      confirmflag: true,
      confirmflag1: true,
      searchVisible: false,
      shrsearch: {},
      wtdsearch: {},
      location: getLocation()
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpMoneyChange/cpMoneyChange_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange')[0].children.filter(item => item.name == '修改')
              .length > 0)) {
            this.setState({ orderflag: false })
          } else {
            this.setState({ orderflag: true })
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'JEBD'
            },
            callback: (imgres) => {
              this.setState({
                srcimg: imgres
              })
            }
          })
          dispatch({
            type: 'sysarea/getFlatOrderdCode',
            payload: {
              id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
              type: 'JEBD'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
            }
          })
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
          const allUser = []
          if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
            allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
          } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
            allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
          } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
            allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
          } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
            allUser.push(res.data.oneUser, res.data.twoUser)
          } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
            allUser.push(res.data.oneUser)
          }

          if (allUser.length == 0) {
            this.setState({
              showdata: [{ id: 1 }, { id: 2 }]
            })
          } else if (allUser.length == 1) {
            allUser.push({ id: 2 })
            this.setState({
              showdata: allUser
            })
          } else {
            this.setState({
              showdata: allUser
            })
          }

          if (isNotBlank(res.data.applyMoney) && res.data.applyMoney == 0) {
            this.setState({
              biliNumber: -1,
              appmoney: 0,
              changeNumber: -Number(getPrice(res.data.receivable))
            })
          }

          this.setState({
            changeNumber: isNotBlank(res.data.isGroup) && res.data.isGroup == 1 ? getPrice(getPrice(Number(res.data.applyMoney)) - getPrice(Number(res.data.receivable))) : getPrice(Number(res.data.applyMoney)) - getPrice(Number(res.data.receivable))
          })

        }
      });
    } else {
      this.setState(
        {
          showdata: [{ id: 1 }, { id: 2 }]
        })
    }

    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        jsStatus: 1,
      }
    });

    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': 6,
        'office.id': getStorage('companyId')
      }
    })
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
      type: 'sysdept/query_dept'
    });

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
        const apply_type = []
        const area = []
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
          if (item.type == 'apply_type') {
            apply_type.push(item)
          }
          if (item.type == 'area') {
            area.push(item)
          }
        })
        this.setState({
          insuranceCompany,
          brand, approachType, collectCustomer,
          orderType, business_project, business_dicth
          , business_type, settlement_type, payment_methodd, old_need,
          make_need, quality_need, oils_need, guise_need, installation_guide
          , maintenance_project, is_photograph, del_flag, classify, client_level, apply_type
          , area
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpMoneyChange/clear',
    });
    this.setState({
      selectcodedata: {}
    })
  }

  handleSubmit = e => {
    const { dispatch, form, cpMoneyChangeGet } = this.props;
    const { addfileList, location, showdata, selectcodedata } = this.state;
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
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        // value.changeMoney = setPrice(value.changeMoney)
        // value.receivable = setPrice(value.receivable)
        // value.applyMoney = setPrice(value.applyMoney)

        if ((!isNotBlank(selectcodedata) || (isNotBlank(selectcodedata) && !isNotBlank(selectcodedata.collectCode))) && isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1) {
          value.applyMoney = setPrice(setPrice(value.applyMoney))
          value.changeMoney = setPrice(setPrice(value.changeMoney))
          value.receivable = setPrice(setPrice(value.receivable))
        }
        else if (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.collectCode)) {
          value.applyMoney = setPrice(setPrice(value.applyMoney))
          value.changeMoney = setPrice(setPrice(value.changeMoney))
          value.receivable = setPrice(setPrice(value.receivable))
        } else {
          value.applyMoney = setPrice(value.applyMoney)
          value.changeMoney = setPrice(value.changeMoney)
          value.receivable = setPrice(value.receivable)
        }

        value.cpAssemblyBuild = {}
        value.cpAssemblyBuild.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id) ? selectcodedata.cab.id :
          (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.cpAssemblyBuild) && isNotBlank(cpMoneyChangeGet.cpAssemblyBuild.id) ? cpMoneyChangeGet.cpAssemblyBuild.id : '')

        value.orderDate = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.createDate)) ? selectcodedata.createDate :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderDate)) ? cpMoneyChangeGet.orderDate : '')
        value.parent = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) ? selectcodedata.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.parent)) ? cpMoneyChangeGet.parent : '')
        value.user = {}
        value.client = {}
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client)) ? cpMoneyChangeGet.client.id : '')
        value.user.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user)) ? cpMoneyChangeGet.user.id : (getStorage('userid') ? getStorage('userid') : ''))
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        value.totalNumber = newshowdata.length
        const idarr = []
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        value.orderStatus = 1
        value.type = 0
        dispatch({
          type: 'cpMoneyChange/cpMoneyChange_submit',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_money_change_form?id=${res.data.id}`);
            // router.push('/business/process/cp_money_change_list');
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch, form, cpMoneyChangeGet } = this.props;
    const { addfileList, location, showdata, selectcodedata } = this.state;
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
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        // value.changeMoney = setPrice(value.changeMoney)
        // value.receivable = setPrice(value.receivable)

        if ((!isNotBlank(selectcodedata) || (isNotBlank(selectcodedata) && !isNotBlank(selectcodedata.collectCode))) && isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1) {
          value.applyMoney = setPrice(setPrice(value.applyMoney))
          value.changeMoney = setPrice(setPrice(value.changeMoney))
          value.receivable = setPrice(setPrice(value.receivable))
        }
        else if (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.collectCode)) {
          value.applyMoney = setPrice(setPrice(value.applyMoney))
          value.changeMoney = setPrice(setPrice(value.changeMoney))
          value.receivable = setPrice(setPrice(value.receivable))
        } else {
          value.applyMoney = setPrice(value.applyMoney)
          value.changeMoney = setPrice(value.changeMoney)
          value.receivable = setPrice(value.receivable)
        }

        value.cpAssemblyBuild = {}
        value.cpAssemblyBuild.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id) ? selectcodedata.cab.id :
          (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.cpAssemblyBuild) && isNotBlank(cpMoneyChangeGet.cpAssemblyBuild.id) ? cpMoneyChangeGet.cpAssemblyBuild.id : '')

        value.orderDate = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.createDate)) ? selectcodedata.createDate :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderDate)) ? cpMoneyChangeGet.orderDate : '')
        value.parent = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) ? selectcodedata.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.parent)) ? cpMoneyChangeGet.parent : '')
        value.user = {}
        value.client = {}
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client)) ? cpMoneyChangeGet.client.id : '')
        value.user.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user)) ? cpMoneyChangeGet.user.id : (getStorage('userid') ? getStorage('userid') : ''))
        value.type = 0
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        value.totalNumber = newshowdata.length
        const idarr = []
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        value.orderStatus = 0
        dispatch({
          type: 'cpMoneyChange/cpMoneyChange_save',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              biliNumber: ''
            })
            router.push(`/business/process/cp_money_change_form?id=${res.data.id}`);
          }
        })
      }
    });
  }

  onCancelCancel = () => {
    router.push('/business/process/cp_money_change_list');
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
    this.setState({ selectcodeflag: true });
  }

  selectcode = (record) => {
    const { form, cpMoneyChangeGet, dispatch } = this.props
    form.resetFields();
    const that = this
    dispatch({
      type: 'cpMoneyChange/get_cpOfferForm_Chane',
      payload: {
        id: record.id
      },
      callback: (resdata) => {
        this.setState({
          thischangeMoney: resdata
        })

        if (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.id)) {
          if (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1) {
            this.setState({
              biliNumber: (getPrice(getPrice(Number(cpMoneyChangeGet.applyMoney))) / getPrice(Number(resdata))).toFixed(4) - 1,
              changeNumber: getPrice(getPrice(Number(cpMoneyChangeGet.applyMoney))) - (getPrice(Number(resdata))),
              selectcodedata: record,
              selectcodeflag: false,
            })
          } else {
            this.setState({
              biliNumber: (getPrice(Number(cpMoneyChangeGet.applyMoney)) / getPrice(Number(resdata))).toFixed(4) - 1,
              changeNumber: getPrice(Number(cpMoneyChangeGet.applyMoney)) - (getPrice(Number(resdata))),
              selectcodedata: record,
              selectcodeflag: false,
            })
          }
        } else {
          this.setState({
            selectcodedata: record,
            selectcodeflag: false,
            biliNumber: '',
            changeNumber: ''
          })
        }


        setTimeout(function () {
          that.props.form.setFieldsValue({
            moneyProportion: isNotBlank(that.state.biliNumber) ? (Number(that.state.biliNumber) >= 0 ? `+${(Number(that.state.biliNumber) * 100).toFixed(2)}%` : `${(Number(that.state.biliNumber) * 100).toFixed(2)}%`) : '',
            // moneyProportion: isNotBlank(that.state.biliNumber) ? `${(Number(that.state.biliNumber) * 100).toFixed(2)}%` : '',
            changeMoney: isNotBlank(that.state.appmoney) ? that.state.appmoney : ''
          })
        }, 300)


      }
    });
  }

  handleModalVisiblecode = flag => {
    this.setState({
      selectcodeflag: !!flag
    });
  };

  showsp = (i) => {
    this.setState({
      indexstatus: i,
      modalVisiblepass: true
    })
  }

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const { location, indexstatus } = this.state
    dispatch({
      type: 'cpMoneyChange/cp_Money_Change_isPass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpMoneyChange/cpMoneyChange_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if (res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') {
              this.setState({ orderflag: false })
            } else {
              this.setState({ orderflag: true })
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
            const allUser = []
            if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
            } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
            } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
            } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser)
            } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
              allUser.push(res.data.oneUser)
            }
            this.setState({
              showdata: allUser,
              modalVisiblepass: false
            })

            this.setState({
              changeNumber: isNotBlank(res.data.isGroup) && res.data.isGroup == 1 ? getPrice(getPrice(Number(res.data.applyMoney)) - getPrice(Number(res.data.receivable))) : getPrice(Number(res.data.applyMoney)) - getPrice(Number(res.data.receivable))
            })
          }
        });
      }
    })
  }

  onselectkh = (key) => {
        this.setState({
          indexflag: key,
          selectkhflag: true
        })
  }

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  selectcustomer = (record) => {
    const { dispatch } = this.props;
    const { indexflag, showdata } = this.state;
    let newselectkhdata = []
    if (showdata.length === 0) {
      newselectkhdata = []
    } else {
      newselectkhdata = showdata.map(item => ({ ...item }));
    }
    let newindex = ''
    record.status = 0
    showdata.forEach((i, index) => {
      if (i.id === indexflag) {
        newindex = index
      }
    })
    newselectkhdata.splice(newindex, 1, record)
    this.setState({ showdata: newselectkhdata, selectkhflag: false })
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

  remove(key) {
    const { showdata } = this.state;
    const { onChange } = this.props;
    const newData = showdata.filter(item => item.id !== key);
    this.setState({ showdata: newData });
  }

  onUndoRevocation = (record) => {
    Modal.confirm({
      title: '撤销该金额变更申请单',
      content: '确定撤销该金额变更申请单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClickRevocation(record),
    });
  }

  undoClickRevocation = (id) => {
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
        type: 'cpRevocation/cpMoneyChange_Revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/business/process/cp_money_change_form?id=${location.query.id}`);
          // router.push('/business/process/cp_money_change_list');
        }
      })
    }
  }


  onUndo = (record) => {
    Modal.confirm({
      title: '重新提交该金额变更申请单',
      content: '确定重新提交该金额变更申请单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(record),
    });
  }

  undoClick = (id) => {
    const { dispatch } = this.props
    const { confirmflag1 } = this.state
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
        type: 'cpMoneyChange/cpMoneyChange_resubmit',
        payload: {
          id
        },
        callback: () => {
          dispatch({
            type: 'cpMoneyChange/cpMoneyChange_Get',
            payload: {
              id
            },
            callback: (res) => {
              if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange')[0].children.filter(item => item.name == '修改')
                  .length > 0)) {
                this.setState({ orderflag: false })
              } else {
                this.setState({ orderflag: true })
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
              const allUser = []
              if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
                allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
              } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
                allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
              } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
                allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
              } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
                allUser.push(res.data.oneUser, res.data.twoUser)
              } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
                allUser.push(res.data.oneUser)
              }
              this.setState({
                showdata: allUser
              })

              this.setState({
                changeNumber: isNotBlank(res.data.isGroup) && res.data.isGroup == 1 ? getPrice(getPrice(Number(res.data.applyMoney)) - getPrice(Number(res.data.receivable))) : getPrice(Number(res.data.applyMoney)) - getPrice(Number(res.data.receivable))
              })
            }
          });
        }
      })
    }
  }

  showmoney = (e) => {
    const { selectcodedata, thischangeMoney } = this.state
    const { cpMoneyChangeGet } = this.props
    const that = this


    if (isNotBlank(e) && e == 0) {
      this.setState({
        biliNumber: -1,
        appmoney: e,
        changeNumber: isNotBlank(thischangeMoney) ? -Number(getPrice(thischangeMoney)) : (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1 ? -getPrice(Number(cpMoneyChangeGet.receivable)) : -Number(cpMoneyChangeGet.receivable))
      })
    }
    else if ((isNotBlank(thischangeMoney) && thischangeMoney == 0) || (isNotBlank(cpMoneyChangeGet.receivable) && cpMoneyChangeGet.receivable == 0)) {
      this.setState({
        biliNumber: 0,
        appmoney: e,
        changeNumber: Number(e) - Number(getPrice(thischangeMoney))
      })
    }
    else if (isNotBlank(selectcodedata) && isNotBlank(thischangeMoney) && thischangeMoney != 0 && isNotBlank(e) && e != 0) {
      this.setState({
        biliNumber: (e / getPrice(thischangeMoney)).toFixed(4) - 1,
        appmoney: e,
        changeNumber: Number(e) - Number(getPrice(thischangeMoney))
      })
    } else if (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.receivable) && cpMoneyChangeGet.receivable != 0 && isNotBlank(e) && e != 0) {
      if (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1) {
        this.setState({
          biliNumber: (e / getPrice(getPrice(cpMoneyChangeGet.receivable))).toFixed(4) - 1,
          appmoney: e,
          changeNumber: Number(e) - Number(getPrice(getPrice(cpMoneyChangeGet.receivable)))
        })
      } else {
        this.setState({
          biliNumber: (e / getPrice(cpMoneyChangeGet.receivable)).toFixed(4) - 1,
          appmoney: e,
          changeNumber: Number(e) - Number(getPrice(cpMoneyChangeGet.receivable))
        })
      }

    }
    else {
      this.setState({
        biliNumber: '',
        appmoney: ''
      })
    }
    setTimeout(function () {
      that.props.form.setFieldsValue({
        moneyProportion: isNotBlank(that.state.biliNumber) ? (Number(that.state.biliNumber) >= 0 ? `+${(Number(that.state.biliNumber) * 100).toFixed(2)}%` : `${(Number(that.state.biliNumber) * 100).toFixed(2)}%`) : '',
        changeMoney: isNotBlank(that.state.appmoney) ? that.state.appmoney : ''
      })
    }, 300)

  }

  handleSearchVisible = (fieldsValue) => {
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChangeout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpBusinessOrder/cpBusinessOrder_SearchList',
      payload: {
        type: 1
      }
    });
    this.setState({
      searchVisible: true,
    });
  };

  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        ...this.state.wtdsearch,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        jsStatus: 1
      }
    });
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/cpMoneyChangeprint?id=${location.query.id}`
  }

  render() {
    const { fileList, previewVisible, previewImage, selectcodeflag, selectcodedata, modalVisiblepass, showdata, orderflag
      , selectkhflag, selectedRows, srcimg, srcimg1, biliNumber, appmoney, changeNumber, searchVisible, thischangeMoney } = this.state;
    const { submitting1, submitting2, submitting, cpMoneyChangeGet, cpBusinessOrderSearchList, selectCompleteList, modeluserList, dispatch, levellist, levellist2, newdeptlist } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const onstyle = (val) => {
      if (isNotBlank(val) && val < 0) {
        return { color: '#f5222d' }
      }
      if (isNotBlank(val) && val >= 0) {
        return { color: '#52c41a' }
      }
      return {}
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
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
    const columnssh = [
      {
        title: '操作',
        key: 'action',
        dataIndex: 'id',
        width: 100,
        render: (text, record) => {
          if ((isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
            (item => item.target == 'cpMoneyChange').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange')[0]
              .children.filter(item => item.name == '修改').length > 0 && (JSON.stringify(cpMoneyChangeGet) == "{}" || (
                (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
                (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
                (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4'))
            ))) {
            return (
              <span>
                <a onClick={e => this.onselectkh(record.id)}>选择</a>
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
          if (isNotBlank(cpMoneyChangeGet) && (cpMoneyChangeGet.approvals !== 0 || cpMoneyChangeGet.approvals !== '0')) {
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
      // 			{
      // 				title: '删除',
      // 				key: 'action',
      // 				width: 100,
      // 				render: (text, record) => {
      // 					if (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
      // 						(item => item.target == 'cpMoneyChange').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange')[0]
      // 							.children.filter(item => item.name == '修改').length > 0 && (JSON.stringify(cpMoneyChangeGet) == "{}" || (
      // 								(cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
      // 								(isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
      // 								(isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4'))
      // 						)) {
      // 						return (
      //   <span>
      //     <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
      //       <a>删除</a>
      //     </Popconfirm>
      //   </span>
      // 						);
      // 					}
      // 					return ''
      // 				}
      // 			},
    ];
    const that = this
    const parentMethodscode = {
      handleAddcode: this.handleAddcode,
      handleModalVisiblecode: this.handleModalVisiblecode,
      selectcode: this.selectcode,
      selectCompleteList,
      dispatch,
      handleSearchChangeout: this.handleSearchChangeout,
      that
    }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      handleSelectRows: this.handleSelectRows,
      selectedRows,
      selectcustomer: this.selectcustomer,
      levellist, levellist2, newdeptlist, dispatch,
      modeluserList,
      that
    }
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpBusinessOrderSearchList,
      that
    }
    const appData = (apps) => {
      if (apps == 0) {
        return '待分配'
      }
      if (apps == 1) {
        return '待审核'
      }
      if (apps == 2) {
        return '重新提交'
      }
      if (apps == 3) {
        return '通过'
      }
      if (apps == 4) {
        return '驳回'
      }
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            金额变更申请单
      </div>
          {isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '60px', height: '60px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '60px', height: '60px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <div style={{ textAlign: 'center' }}><span>选择需金额变更申请的委托单</span><Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectsh} loading={submitting} disabled={orderflag}>选择</Button></div>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='审批进度'>
                    <Input disabled value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) ? appData(cpMoneyChangeGet.approvals) : ''} disabled />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.orderCode) ? selectcodedata.orderCode :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderCode) ? cpMoneyChangeGet.orderCode : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入订单编号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请类别'>
                    {getFieldDecorator('applyType', {
                      initialValue: isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.applyType) ? cpMoneyChangeGet.applyType : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入申请类别',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={orderflag}
                        allowClear
                      >
                        {
                          isNotBlank(this.state.apply_type) && this.state.apply_type.length > 0 && this.state.apply_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="订单日期">
                    {getFieldDecorator('orderDate', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.orderDate) ? selectcodedata.orderDate :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderDate) ? moment(cpMoneyChangeGet.orderDate) : null),
                    })(
                      <DatePicker
                        disabled

                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务项目'>
                    {getFieldDecorator('project', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.project) ? selectcodedata.project :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.project) ? cpMoneyChangeGet.project : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入业务项目',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled
                        allowClear
                      >
                        {
                          isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务分类'>
                    {getFieldDecorator('businessType', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.businessType) ? selectcodedata.businessType :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.businessType) ? cpMoneyChangeGet.businessType : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入业务分类',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled
                        allowClear
                      >
                        {
                          isNotBlank(this.state.business_type) && this.state.business_type.length > 0 && this.state.business_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='应收金额'>
                    {getFieldDecorator('receivable', {
                      initialValue: isNotBlank(thischangeMoney) ? getPrice(thischangeMoney) :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.receivable) ? (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1 ? getPrice(getPrice(cpMoneyChangeGet.receivable)) : getPrice(cpMoneyChangeGet.receivable)) : ''),
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
                  <FormItem {...formItemLayout} label='结算金额'>
                    <Input

                      disabled
                      value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.receivable) ? (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1 ? getPrice(getPrice(cpMoneyChangeGet.receivable)) : getPrice(cpMoneyChangeGet.receivable)) : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='成本金额'>
                    <Input

                      disabled
                      value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.costTotalMoney) ? getPrice(cpMoneyChangeGet.costTotalMoney) : ''}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="业务员信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务员'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.name) ? selectcodedata.user.name :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user) ? cpMoneyChangeGet.user.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.no) ? selectcodedata.user.no :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user) ? cpMoneyChangeGet.user.no : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.office) && isNotBlank(selectcodedata.user.office.name) ? selectcodedata.user.office.name :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user) && isNotBlank(cpMoneyChangeGet.user.office) ? cpMoneyChangeGet.user.office.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Select
                      allowClear
                      notFoundContent={null}
                      style={{ width: '100%' }}
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.dictArea) ? selectcodedata.user.dictArea :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user) && isNotBlank(cpMoneyChangeGet.user.dictArea) ? cpMoneyChangeGet.user.dictArea : '')}

                      disabled
                    >
                      {
                        isNotBlank(this.state.area) && this.state.area.length > 0 && this.state.area.map(item =>
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        )
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属部门'>
                    <Input
                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.dept) ? selectcodedata.user.dept.name :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user) && isNotBlank(cpMoneyChangeGet.user.dept) ? cpMoneyChangeGet.user.dept.name : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="客户信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    <Input

                      disabled
                      value={(isNotBlank(selectcodedata) && isNotBlank(selectcodedata.userOffice) && isNotBlank(selectcodedata.userOffice.name) ? selectcodedata.userOffice.name :
                        isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) && isNotBlank(cpMoneyChangeGet.client.clientCpmpany) ? cpMoneyChangeGet.client.clientCpmpany : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input
                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.name) ? selectcodedata.client.name :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) ? cpMoneyChangeGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.classify) ? selectcodedata.client.classify :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) ? cpMoneyChangeGet.client.classify : '')}
                    >
                      {
                        isNotBlank(this.state.classify) && this.state.classify.length > 0 && this.state.classify.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户编号'>
                    <Input
                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.code) ? selectcodedata.client.code :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) ? cpMoneyChangeGet.client.code : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.address) ? selectcodedata.client.address :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) ? cpMoneyChangeGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.phone) ? selectcodedata.client.phone :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) ? cpMoneyChangeGet.client.phone : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="变更信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请金额'>
                    {getFieldDecorator('applyMoney', {
                      initialValue: isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.applyMoney) ? (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1 ? getPrice(getPrice(cpMoneyChangeGet.applyMoney)) : getPrice(cpMoneyChangeGet.applyMoney)) : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入申请金额',
                        },
                      ],
                    })(
                      <InputNumber
                        style={{ width: '100%' }}

                        disabled={orderflag}
                        value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.applyMoney) ? (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1 ? getPrice(getPrice(cpMoneyChangeGet.applyMoney)) : getPrice(cpMoneyChangeGet.applyMoney)) : ''}
                        onChange={this.showmoney}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  {/* isNotBlank(biliNumber) ? `${(Number(biliNumber) * 100).toFixed(2)}%` */}
                  <FormItem {...formItemLayout} label='金额变更比例'>
                    {getFieldDecorator('moneyProportion', {
                      initialValue: isNotBlank(biliNumber) ? (Number(biliNumber) >= 0 ? `+${(Number(biliNumber) * 100).toFixed(2)}%` : `${(Number(biliNumber) * 100).toFixed(2)}%`) :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.moneyProportion) ? cpMoneyChangeGet.moneyProportion : ''),
                      rules: [
                        {
                          required: false,
                          message: '金额变更比例',
                        },
                      ],
                    })(<Input

                      disabled
                      value={isNotBlank(biliNumber) ? (Number(biliNumber) >= 0 ? `+${(Number(biliNumber) * 100).toFixed(2)}%` : `${(Number(biliNumber) * 100).toFixed(2)}%`) :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.moneyProportion) ? cpMoneyChangeGet.moneyProportion : '')}
                      style={onstyle(isNotBlank(biliNumber) ? Number(biliNumber) : ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.moneyProportion) ? parseFloat(cpMoneyChangeGet.moneyProportion) : 0)))}
                    />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='变更后金额'>
                    {getFieldDecorator('changeMoney', {
                      initialValue: isNotBlank(appmoney) ? appmoney : (
                        isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.changeMoney) ? (isNotBlank(cpMoneyChangeGet.isGroup) && cpMoneyChangeGet.isGroup == 1 ? getPrice(getPrice(cpMoneyChangeGet.changeMoney)) : getPrice(cpMoneyChangeGet.changeMoney)) : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入变更后金额',
                        },
                      ],
                    })(
                      <Input

                        disabled
                        value={isNotBlank(appmoney) ? appmoney : (
                          isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.changeMoney) ? getPrice(cpMoneyChangeGet.changeMoney) : '')}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='差额'>
                    <Input disabled value={isNotBlank(changeNumber) ? changeNumber : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请人'>
                    <Input value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && isNotBlank(cpMoneyChangeGet.createBy.name) ? cpMoneyChangeGet.createBy.name : ''} disabled />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请日期'>
                    {getFieldDecorator('createDate', {
                      initialValue: isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createDate) ? (cpMoneyChangeGet.createDate) : '',
                      rules: [
                        {
                          required: false,
                          message: '申请日期',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="申请理由" className="allinputstyle">
                    {getFieldDecorator('applyReason', {
                      initialValue: isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.applyReason) ? cpMoneyChangeGet.applyReason : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入申请理由',
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
              </Row>
            </Card>
            <Card title="审核人管理" bordered={false}>
              {getFieldDecorator('members', {
                initialValue: '',
              })(
                <Table
                  columns={columnssh}
                  dataSource={showdata}
                  pagination={false}
                  rowClassName={record => (stylessp.editable ? stylessp.editable : '')}
                />
              )}
              {/* {isNotBlank(showdata) && showdata.length < 5 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
								(item => item.target == 'cpMoneyChange').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange')[0]
									.children.filter(item => item.name == '修改').length > 0 &&
								<Button
  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
  type="dashed"
  onClick={this.newMember}
  icon="plus"
  disabled={!((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
										(cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
										(isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
										(isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4')))
									)}
								>
									新增审核人
						  </Button>
							} */}
              {isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.isOperation) && (cpMoneyChangeGet.isOperation === 1 || cpMoneyChangeGet.isOperation === '1') &&
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
              {isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.id) &&
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                  打印
          </Button>}
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange')[0].children.filter(item => item.name == '修改')
                  .length > 0 && <span>
                  <Button
                    type="primary"
                    onClick={this.onsave}
                    loading={submitting1 || submitting2}
                    disabled={!((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
                      (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4')))
                    )}
                  >
                    保存
  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8, marginRight: 8 }}
                    htmlType="submit"
                    loading={submitting1 || submitting2}
                    disabled={!((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
                      (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4')))
                    )}
                  >
                    提交
  </Button>
                  {
                    (cpMoneyChangeGet.approvals === 1 || cpMoneyChangeGet.approvals === '1') &&
                    <Button loading={submitting1 || submitting2} style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpMoneyChangeGet.id)}>
                      重新提交
</Button>
                  }
                  {
                    orderflag && cpMoneyChangeGet.approvals === '3' &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1 || submitting2} onClick={() => this.onUndoRevocation(cpMoneyChangeGet.id)}>
                      撤销
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
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateFormcode {...parentMethodscode} selectcodeflag={selectcodeflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpMoneyChangeForm;
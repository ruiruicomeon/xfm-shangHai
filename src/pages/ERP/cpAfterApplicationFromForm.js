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
  Upload,
  Modal,
  DatePicker,
  Popconfirm,
  Table,
  Row,
  Col,
  Cascader
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragTable from '../../components/StandardEditTable/dragTable'
import { getStorage } from '@/utils/localStorageUtils';
import styles from './CpAfterApplicationFromForm.less';
import SearchTableList from '@/components/SearchTableList';
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


const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblecode, selectCompleteList, selectcodeflag, selectcode, that, dispatch, form, form: { getFieldDecorator }, handleSearchChangeout } = props;
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
      title: '车牌号',
      dataIndex: 'plateNumber',
      inputType: 'text',
      align: 'center',
      width: 100,
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
      title: '客户',
      dataIndex: 'client.clientCpmpany',
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
      title: '总成品牌',
      dataIndex: 'assemblyBrand',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
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
      dataIndex: 'cab',
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
      width: 150,
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
      title: '意向单价',
      dataIndex: 'intentionPrice',
      inputType: 'text',
      align: 'center',
      width: 100,
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
      dataIndex: 'qualityDate',
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
      dataIndex: 'entrustProject',
      inputType: 'select',
      inputinfo: that.state.maintenance_project,
      align: 'center',
      width: 100,
      editable: true,
      render: (text) => {
        if (isNotBlank(text) && isNotBlank(that.state.maintenance_project) && that.state.maintenance_project.length > 0) {
          return that.state.maintenance_project.map((item) => {
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
      title: '行程里程',
      dataIndex: 'tripMileage',
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
        isTemplate: 1
      }
    });
  }
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
          genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
          ...values,
          pageSize: 10,
          current: 1,
          isTemplate: 1
        }
      });
    });
  };


  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...that.state.wtdsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
      ...filters,
      isTemplate: 1
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: params,
    });
  };


  const renderSimpleForm = () => {
    return (
      <Form onSubmit={handleSearchout} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="车牌号">
              {getFieldDecorator('plateNumber', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
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
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
          </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormResetout}>
                重置
          </Button>
              <a style={{ marginLeft: 8 }} onClick={handleSearchChangeout}>
                过滤其他 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  const handleModalVisiblecodein = () => {
    // form.resetFields();
    // that.setState({
    //   wtdsearch: {}
    // })
    handleModalVisiblecode()
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
        data={selectCompleteList}
        columns={columnskh}
        onChange={handleStandardTableChange}
      />
    </Modal>
  );
});


const CreateFormyh = Form.create()(props => {
  const { handleModalVisibleyh, selectCompleteList, selectyhflag, selectyh, that, dispatch, form, form: { getFieldDecorator } } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectyh(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '订单编号',
      dataIndex: 'orderCode',
      align: 'center',
      inputType: 'text',
      width: 200,
      editable: false,
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '行程里程',
      dataIndex: 'tripMileage',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '质保时间',
      dataIndex: 'qualityTime',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '质保开始时间',
      dataIndex: 'permitDate',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
  ]
  const handleFormResetout = () => {
    form.resetFields();
    that.setState({
      yhearch: {}
    })
    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_List',
      payload: {
        type: 2,
      }
    });
  }
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
        yhearch: values
      })

      dispatch({
        type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          type: 2,
          // isTemplate:1
        }
      });
    });
  };


  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...that.state.yhearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      type: 2,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_List',
      payload: params,
    });
  };


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
            <FormItem label="车牌号">
              {getFieldDecorator('plateNumber', {
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
              <Button style={{ marginLeft: 8 }} onClick={handleFormResetout}>
                重置
          </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  const handleModalVisibleyhin = () => {
    // form.resetFields();
    // that.setState({
    //   yhearch: {}
    // })
    handleModalVisibleyh()
  }

  return (
    <Modal
      title='选择养护售后'
      visible={selectyhflag}
      onCancel={() => handleModalVisibleyhin()}
      width='80%'
    >
      <div className={styles.tableListForm}>{renderSimpleForm()}</div>
      <StandardTable
        bordered
        scroll={{ x: 1500 }}
        data={selectCompleteList}
        columns={columnskh}
        onChange={handleStandardTableChange}
      />
    </Modal>
  );
});



const CreateFormhistory = Form.create()(props => {
  const { handleModalVisiblehistory, selectCompleteList, selecthistoryflag, selecthistory, that, dispatch, form, form: { getFieldDecorator }, handleSearchChangeout } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selecthistory(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '订单编号',
      dataIndex: 'orderCode',
      align: 'center',
      inputType: 'text',
      width: 200,
      editable: false,
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '客户',
      dataIndex: 'client.clientCpmpany',
      align: 'center',
      inputType: 'text',
      width: 240,
      editable: false,
    },
    {
      title: '行程里程',
      dataIndex: 'tripMileage',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '质保时间',
      dataIndex: 'qualityTime',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '质保开始时间',
      dataIndex: 'permitDate',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: false,
    },
  ]
  const handleFormResetout = () => {
    form.resetFields();
    that.setState({
      historysearch: {}
    })
    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
    });
  }
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
        historysearch: values
      })

      dispatch({
        type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          isTemplate: 1
        }
      });
    });
  };


  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...that.state.historysearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
      payload: params,
    });
  };


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
            <FormItem label="车牌号">
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
        <div style={{ overflow: 'hidden', margin: '10px 0' }}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
              查询
          </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormResetout}>
              重置
          </Button>
          </span>
        </div>
      </Form>
    );
  }

  const handleModalVisiblehistoryin = () => {
    // form.resetFields();
    // that.setState({
    //   historysearch: {}
    // })
    handleModalVisiblehistory()
  }

  return (
    <Modal
      title='选择售后历史单'
      visible={selecthistoryflag}
      onCancel={() => handleModalVisiblehistoryin()}
      width='80%'
    >
      <div className={styles.tableListForm}>{renderSimpleForm()}</div>
      <StandardTable
        bordered
        scroll={{ x: 1500 }}
        data={selectCompleteList}
        columns={columnskh}
        onChange={handleStandardTableChange}
      />
    </Modal>
  );
});



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
  const { handleModalVisibleshr, modeluserList, selectshrflag, selectshr, selectedRows, handleSelectRows,
    levellist, levellist2, newdeptlist, dispatch, form, that } = props;
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
          'role.id': '3e2944ee76fa422ba3b5569b31434481',
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
        'role.id': '3e2944ee76fa422ba3b5569b31434481',
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
      'role.id': '3e2944ee76fa422ba3b5569b31434481',
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
    // form.resetFields();
    // that.setState({
    //   shrsearch: {}
    // })
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
@connect(({ cpAfterApplicationFrom, loading, sysuser, syslevel, sysdept, cpBusinessOrder }) => ({
  ...cpAfterApplicationFrom,
  ...sysuser,
  ...syslevel,
  ...sysdept,
  ...cpBusinessOrder,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpAfterApplicationFrom/cpAfterApplicationFrom_Add'],
  submitting2: loading.effects['cpupdata/cpAfterApplicationFrom_update'],
}))
@Form.create()
class CpAfterApplicationFromForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectcodedata: [],
      selectcodeflag: false,
      orderflag: false,
      selectyear: 0,
      selectmonth: 0,
      indexflag: 0,
      selectshrflag: false,
      showdata: [],
      zhibflag: false,
      confirmflag: true,
      confirmflag1: true,
      updataflag: true,
      alldata: '',
      copyVal: {},
      showtype: '',
      isHistory: '',
      updataname: '取消锁定',
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
              .length > 0)) {
            this.setState({ orderflag: false })
          } else {
            this.setState({ orderflag: true })
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'SHSQ'
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
              type: 'SHSQ'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
            }
          })

          if (isNotBlank(res.data) && isNotBlank(res.data.permitDate) && isNotBlank(res.data.qualityTime)) {
            const datediff = moment(moment(new Date().getTime())).diff(moment(new Date(res.data.permitDate).getTime()), 'months')
            const yeardiff = Number(res.data.qualityTime.split(',')[0])
            const monthdiff = Number(res.data.qualityTime.split(',')[1])

            console.log(datediff, yeardiff, monthdiff)

            const allmonth = yeardiff * 12 + monthdiff - datediff
            this.setState({
              alldata: `${Math.floor((yeardiff * 12 + monthdiff - datediff) / 12)}年${((yeardiff * 12 + monthdiff - datediff) % 12)}月`
            })
          }


          if (isNotBlank(res.data) && isNotBlank(res.data.errorDescription)) {
            let photoUrl = res.data.errorDescription.split('|')
            photoUrl = photoUrl.map((item) => {
              return {
                id: getFullUrl(item),
                uid: getFullUrl(item),
                url: getFullUrl(item),
                name: getFullUrl(item)
              }
            })
            this.setState({
              addfileList: res.data.errorDescription.split('|'),
              fileList: photoUrl
            })
          }

          if (isNotBlank(res.data) && isNotBlank(res.data.oldPhoto)) {
            let photoUrl1 = res.data.oldPhoto.split('|')
            photoUrl1 = photoUrl1.map((item) => {
              return {
                id: getFullUrl(item),
                uid: getFullUrl(item),
                url: getFullUrl(item),
                name: getFullUrl(item)
              }
            })
            this.setState({
              addfileList1: res.data.oldPhoto.split('|'),
              fileList1: photoUrl1
            })
          }

          if (isNotBlank(res.data) && isNotBlank(res.data.type) && res.data.type == 3) {
            this.setState({
              showtype: 3
            })
          }

          if (isNotBlank(res.data.qualityTime)) {
            this.props.form.setFieldsValue({
              zbtime: res.data.qualityTime
            });
            this.setState({
              selectyear: res.data.qualityTime.split(',')[0],
              selectmonth: res.data.qualityTime.split(',')[1]
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
          })
          // if(allUser.length===0){
          // 	if(res.data.qualityTime.split(',')[0]<=0 && res.data.qualityTime.split(',')[1]<=0){
          // 		this.setState({showdata:[{id:1 , id:2}]})
          // 	}else{
          // 		this.setState({showdata:[{id:1}] })
          // 	}
          // }else{
          // 	this.setState({
          // 	showdata: allUser
          // })
          // }
        }
      });
    }

    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
    });

    dispatch({
      type: 'cpAfterApplicationFrom/select_complete_List',
      payload: {
        isTemplate: 1
      }
    });

    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_List',
      payload: {
        type: 2,
      }
    });

    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': '3e2944ee76fa422ba3b5569b31434481',
        'office.id': getStorage('companyId')
      }
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
          , maintenance_project, is_photograph, del_flag, classify, client_level,
          area
        })
      }
    })
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'insurance_company',
      },
      callback: data => {
        this.setState({
          insuranceCompany: data
        })
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpAfterApplicationFrom/clear',
    });
  }

  //   componentDidUpdate(prevProps, prevState) {
  // 	  const {cpAfterApplicationFromGet} = this.props 
  // 	  const {selectcodedata} = this.state
  // 	//   console.log(selectcodedata)
  // 	// 	console.log(prevProps,prevState) 
  // 	prevState.selectcodedata = selectcodedata
  // 	this.forceUpdate()
  //   }

  handleSubmit = e => {
    const { dispatch, form, cpAfterApplicationFromGet } = this.props;
    const { addfileList, location, selectyear, selectmonth, selectcodedata, selecthistorydata,
      showdata, updataflag, addfileList1, isHistory, showtype } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.errorDescription = addfileList.join('|')
        } else {
          value.errorDescription = '';
        }

        if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
          value.oldPhoto = addfileList1.join('|')
        } else {
          value.oldPhoto = '';
        }

        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }


        if (isNotBlank(isHistory) && isHistory == 1) {
          value.isTemplate = 1
        } else if (!isNotBlank(isHistory) && isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.isTemplate) && cpAfterApplicationFromGet.isTemplate == 1) {
          value.isTemplate = 1
        }


        value.collectClient = {}
        value.collectClient.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.collectClientId) && isNotBlank(selectcodedata.collectClientId.id) ? selectcodedata.collectClientId.id : '') :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.collectClient) && isNotBlank(selectcodedata.collectClient.id) ? selectcodedata.collectClient.id : '') :
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectClient) && isNotBlank(cpAfterApplicationFromGet.collectClient.id) ? cpAfterApplicationFromGet.collectClient.id : '')

        value.collectCode = {}
        value.collectCode.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.collectCodeid) ? selectcodedata.collectCodeid : '') :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.collectCode) && isNotBlank(selectcodedata.collectCode.id) ? selectcodedata.collectCode.id : '') :
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectCode) && isNotBlank(cpAfterApplicationFromGet.collectCode.id) ? cpAfterApplicationFromGet.collectCode.id : '')

        // value.collectClient = {}
        // value.collectClient.id = isNotBlank(selectcodedata)&&isNotBlank(selectcodedata.collectClientId)&&isNotBlank(selectcodedata.collectClientId.id)?selectcodedata.collectClientId.id:
        // (isNotBlank(cpAfterApplicationFromGet)&&isNotBlank(cpAfterApplicationFromGet.collectClient)&&isNotBlank(cpAfterApplicationFromGet.collectClient.id)?cpAfterApplicationFromGet.collectClient.id:'')

        // value.collectCode = {}
        // value.collectCode.id = isNotBlank(selectcodedata)&&isNotBlank(selectcodedata.collectCodeid)?selectcodedata.collectCodeid:
        // (isNotBlank(cpAfterApplicationFromGet)&&isNotBlank(cpAfterApplicationFromGet.collectCode)&&isNotBlank(cpAfterApplicationFromGet.collectCode.id)?cpAfterApplicationFromGet.collectCode.id:'')


        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        value.parent = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) ? selectcodedata.id :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.parent) ? selecthistorydata.parent :
            ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.parent)) ? cpAfterApplicationFromGet.parent : '')
        value.approvals = isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) ? cpAfterApplicationFromGet.approvals : 0
        value.permitDate = moment(value.permitDate).format("YYYY-MM-DD")
        value.qualityTime = `${selectyear},${selectmonth}`
        // value.client = {}
        // value.user = {}
        // value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client)&& isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id : ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client)) ? cpAfterApplicationFromGet.client.id : '')
        // value.user.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
        // 		((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user)) ? cpAfterApplicationFromGet.user.id : (getStorage('userid') ? getStorage('userid') : ''))



        if (isNotBlank(showtype) && showtype == 3) {
          value.type = 3
        }


        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id :
          (isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.client)) ? selecthistorydata.client.id :
            ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client)) ? cpAfterApplicationFromGet.client.id : '')

        value.user.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.user) && isNotBlank(selecthistorydata.user.id) ? selecthistorydata.user.id :
            ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user)) ? cpAfterApplicationFromGet.user.id : '')

        value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
        value.orderStatus = 4
        value.intentionPrice = setPrice(value.intentionPrice)

        value.assmblyBuild = {}
        value.assmblyBuild.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id) ? selectcodedata.cab.id :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.assmblyBuild) && isNotBlank(selecthistorydata.assmblyBuild.id) ? selecthistorydata.assmblyBuild.id :
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild.id) ? cpAfterApplicationFromGet.assmblyBuild.id : '')

        // value.assmblyBuild = {}
        // value.assmblyBuild.id = isNotBlank(selectcodedata)&&isNotBlank(selectcodedata.cab)&&isNotBlank(selectcodedata.cab.id)?selectcodedata.cab.id:
        // (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild)&& isNotBlank(cpAfterApplicationFromGet.assmblyBuild.id)?cpAfterApplicationFromGet.assmblyBuild.id:'')
        if (updataflag) {
          dispatch({
            type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Add',
            payload: { ...value },
            callback: (res) => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/accessories/process/cp_after_application_from_form?id=${res.data.id}`);
              // router.push('/accessories/process/cp_after_application_from_list');
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpAfterApplicationFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/accessories/process/cp_after_application_from_form?id=${location.query.id}`);
              // router.push('/accessories/process/cp_after_application_from_list');
            }
          })
        }
      }
    });
  };

  onsave = () => {
    const { dispatch, form, cpAfterApplicationFromGet } = this.props;
    const { addfileList, addfileList1, location, selectyear, selectmonth, selectcodedata
      , selecthistorydata, showdata, updataflag, isHistory, showtype } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };

        this.setState({
          copyVal: values
        })


        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.errorDescription = addfileList.join('|')
        } else {
          value.errorDescription = '';
        }

        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.errorDescription = addfileList.join('|')
        } else {
          value.errorDescription = '';
        }

        if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
          value.oldPhoto = addfileList1.join('|')
        } else {
          value.oldPhoto = '';
        }

        if (isNotBlank(isHistory) && isHistory == 1) {
          value.isTemplate = 1
        } else if (!isNotBlank(isHistory) && isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.isTemplate) && cpAfterApplicationFromGet.isTemplate == 1) {
          value.isTemplate = 1
        }


        if (isNotBlank(showtype) && showtype == 3) {
          value.type = 3
        }


        value.collectClient = {}
        value.collectClient.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.collectClientId) && isNotBlank(selectcodedata.collectClientId.id) ? selectcodedata.collectClientId.id : '') :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.collectClient) && isNotBlank(selectcodedata.collectClient.id) ? selectcodedata.collectClient.id : '') :
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectClient) && isNotBlank(cpAfterApplicationFromGet.collectClient.id) ? cpAfterApplicationFromGet.collectClient.id : '')

        value.collectCode = {}
        value.collectCode.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.collectCodeid) ? selectcodedata.collectCodeid : '') :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.collectCode) && isNotBlank(selectcodedata.collectCode.id) ? selectcodedata.collectCode.id : '') :
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectCode) && isNotBlank(cpAfterApplicationFromGet.collectCode.id) ? cpAfterApplicationFromGet.collectCode.id : '')


        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        value.parent = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) ? selectcodedata.id :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.parent) ? selecthistorydata.parent :
            ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.parent)) ? cpAfterApplicationFromGet.parent : '')
        value.approvals = 0
        value.permitDate = moment(value.permitDate).format("YYYY-MM-DD")
        value.qualityTime = `${selectyear},${selectmonth}`
        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id :
          (isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.client)) ? selecthistorydata.client.id :
            ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client)) ? cpAfterApplicationFromGet.client.id : '')

        value.user.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.user) && isNotBlank(selecthistorydata.user.id) ? selecthistorydata.user.id :
            ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user)) ? cpAfterApplicationFromGet.user.id : '')
        value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
        value.intentionPrice = setPrice(value.intentionPrice)
        value.assmblyBuild = {}
        value.assmblyBuild.id = isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id) ? selectcodedata.cab.id :
          isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.assmblyBuild) && isNotBlank(selecthistorydata.assmblyBuild.id) ? selecthistorydata.assmblyBuild.id :
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild.id) ? cpAfterApplicationFromGet.assmblyBuild.id : '')
        if (updataflag) {
          value.orderStatus = 4
          dispatch({
            type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_save',
            payload: { ...value },
            callback: (res) => {
              router.push(`/accessories/process/cp_after_application_from_form?id=${res.data.id}`);
            }
          })
        } else {
          value.orderStatus = 4
          dispatch({
            type: 'cpupdata/cpAfterApplicationFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
            }
          })
        }
      }
    });
  }

  onupdata = () => {
    const { location, updataflag } = this.state
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定'
      })
    } else {
      router.push(`/accessories/process/cp_after_application_from_form?id=${location.query.id}`);
    }
  }

  onCancelCancel = () => {
    router.push('/accessories/process/cp_after_application_from_list');
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };



  handlePreview1 = file => {
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
    const { dispatch } = this.props
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
      dispatch({
        type: 'upload/upload_img',
        payload: {
          file,
          name: 'cpAfterEntrust'
        },
        callback: (res) => {
          if (!isNotBlank(addfileList) || addfileList.length <= 0) {
            this.setState({
              addfileList: [res],
            });
          } else {
            this.setState({
              addfileList: [...addfileList, res],
            });
          }
        }
      })
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

  onselectyh = () => {
    this.setState({ selectyhflag: true });
  }


  onselectsh = () => {
    this.setState({ selectcodeflag: true });
  }


  onselecthistory = () => {
    this.setState({ selecthistoryflag: true });
  }



  handleModalVisiblecode = flag => {
    this.setState({
      selectcodeflag: !!flag
    });
  };

  handleModalVisiblehistory = flag => {
    this.setState({
      selecthistoryflag: !!flag
    });
  };

  handleModalVisibleyh = flag => {
    this.setState({
      selectyhflag: !!flag
    });
  };

  selectyh = (record) => {

    const { showdata, copyVal } = this.state
    this.setState({
      selectyear: '',
      selectmonth: '',
      alldata: '',
      fileList1: '',
      showtype: 3,
      addfileList1: '',
      selectcodedata: {},
      isHistory: 1
    })

    this.props.form.setFieldsValue({
      orderCode: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.orderCode) ? record.orderCode : '',
      orderType: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.orderType) ? record.orderType : '',
      project: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.project) ? record.project : '',
      dicth: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.dicth) ? record.dicth : '',
      businessType: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.businessType) ? record.businessType : '',
      y: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.settlementType) ? record.settlementType : '',
      insuranceCompanyId: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.insuranceCompanyId) ? record.insuranceCompanyId : '',
      brand: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.brand) ? record.brand : '',
      permitDate: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.permitDate) ? moment(record.permitDate) : '',
      technicalParameters: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.technicalParameters) ? record.technicalParameters : '',
      assemblySteelSeal: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.assemblySteelSeal) ? record.assemblySteelSeal : '',
      assemblyMessage: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.assemblyMessage) ? record.assemblyMessage : '',
      maintenanceProject: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.maintenanceProject) ? record.maintenanceProject : '',
      tripMileage: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.tripMileage) ? record.tripMileage : '',
      plateNumber: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.plateNumber) ? record.plateNumber : '',
      maintenanceHistory: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.maintenanceHistory) ? record.maintenanceHistory : '',
      x: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.x) ? record.x : '',
    })

    if (isNotBlank(record.qualityTime)) {
      this.props.form.setFieldsValue({
        zbtime: record.qualityTime,
      });
      this.setState({
        selectyear: record.qualityTime.split(',')[0],
        selectmonth: record.qualityTime.split(',')[1]
      })

      if (isNotBlank(record.permitDate) && isNotBlank(record.qualityTime)) {
        const datediff = moment(moment(new Date().getTime())).diff(moment(new Date(record.permitDate).getTime()), 'months')
        const yeardiff = Number(record.qualityTime.split(',')[0])
        const monthdiff = Number(record.qualityTime.split(',')[1])
        const allmonth = yeardiff * 12 + monthdiff - datediff

        this.setState({
          alldata: `${Math.floor((yeardiff * 12 + monthdiff - datediff) / 12)}年${((yeardiff * 12 + monthdiff - datediff) % 12)}月`
        })
      }
    }


    this.setState({
      selecthistorydata: record,
      selectyhflag: false
    })

  }


  selecthistory = (record) => {
    const { showdata, copyVal } = this.state
    this.setState({
      selectyear: '',
      selectmonth: '',
      alldata: '',
      fileList1: '',
      showtype: '',
      addfileList1: '',
      selecthistorydata: {},
      isHistory: 2
    })

    this.props.form.setFieldsValue({
      orderCode: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.orderCode) ? record.orderCode : '',
      orderType: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.orderType) ? record.orderType : '',
      project: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.project) ? record.project : '',
      dicth: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.dicth) ? record.dicth : '',
      businessType: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.businessType) ? record.businessType : '',
      y: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.settlementType) ? record.settlementType : '',
      insuranceCompanyId: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.insuranceCompanyId) ? record.insuranceCompanyId : '',
      brand: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.brand) ? record.brand : '',
      permitDate: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.permitDate) ? moment(record.permitDate) : '',
      technicalParameters: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.technicalParameters) ? record.technicalParameters : '',
      assemblySteelSeal: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.assemblySteelSeal) ? record.assemblySteelSeal : '',
      assemblyMessage: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.assemblyMessage) ? record.assemblyMessage : '',
      maintenanceProject: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.maintenanceProject) ? record.maintenanceProject : '',
      tripMileage: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.tripMileage) ? record.tripMileage : '',
      plateNumber: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.plateNumber) ? record.plateNumber : '',
      maintenanceHistory: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.maintenanceHistory) ? record.maintenanceHistory : '',
      x: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.x) ? record.x : '',
    })


    if (isNotBlank(record.qualityTime)) {
      this.props.form.setFieldsValue({
        zbtime: record.qualityTime,
      });
      this.setState({
        selectyear: record.qualityTime.split(',')[0],
        selectmonth: record.qualityTime.split(',')[1]
      })

      if (isNotBlank(record.permitDate) && isNotBlank(record.qualityTime)) {
        const datediff = moment(moment(new Date().getTime())).diff(moment(new Date(record.permitDate).getTime()), 'months')
        const yeardiff = Number(record.qualityTime.split(',')[0])
        const monthdiff = Number(record.qualityTime.split(',')[1])
        const allmonth = yeardiff * 12 + monthdiff - datediff

        this.setState({
          alldata: `${Math.floor((yeardiff * 12 + monthdiff - datediff) / 12)}年${((yeardiff * 12 + monthdiff - datediff) % 12)}月`
        })
      }
    }

    if (isNotBlank(record.photo)) {
      let photoUrl1 = record.photo.split('|')
      photoUrl1 = photoUrl1.map((item) => {
        return {
          id: getFullUrl(item),
          uid: getFullUrl(item),
          url: getFullUrl(item),
          name: getFullUrl(item)
        }
      })
      this.setState({
        addfileList1: record.photo.split('|'),
        fileList1: photoUrl1
      })
    }

    this.setState({
      selecthistorydata: record,
      selecthistoryflag: false
    })

    this.setState({
      selecthistorydata: record,
      selecthistoryflag: false
    })

  }



  selectcode = (res) => {
    const { dispatch } = this.props
    const { showdata, copyVal } = this.state
    this.setState({
      selectyear: '',
      selectmonth: '',
      alldata: '',
      fileList1: '',
      showtype: '',
      addfileList1: '',
      selecthistorydata: {},
      isHistory: 2
    })


    dispatch({
      type: 'cpAfterApplicationFrom/ApplicationFro_getCpOfferForm',
      payload: {
        id: res.id
      }, callback: (record) => {
        this.setState({
          selectcodedata: record,
        })
        this.props.form.setFieldsValue({
          orderCode: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.orderCode) ? record.orderCode : '',
          orderType: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.orderType) ? record.orderType : '',
          project: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.project) ? record.project : '',
          dicth: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.dicth) ? record.dicth : '',
          businessType: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.businessType) ? record.businessType : '',
          y: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.settlementType) ? record.settlementType : '',
          insuranceCompanyId: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.insuranceCompanyId) ? record.insuranceCompanyId : '',
          brand: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.brand) ? record.brand : '',
          permitDate: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.completeDate) ? moment(record.completeDate) : '',
          technicalParameters: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.technicalParameters) ? record.technicalParameters : '',
          assemblySteelSeal: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.assemblySteelSeal) ? record.assemblySteelSeal : '',
          assemblyMessage: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.assemblyMessage) ? record.assemblyMessage : '',
          maintenanceProject: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.entrustProject) ? record.entrustProject : '',
          tripMileage: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.tripMileage) ? record.tripMileage : '',
          plateNumber: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.plateNumber) ? record.plateNumber : '',
          maintenanceHistory: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.maintenanceHistory) ? record.maintenanceHistory : '',
          x: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.qualityProject) ? record.qualityProject : '',
          assemblyVin: isNotBlank(record) && isNotBlank(record.id) && isNotBlank(record.vin) ? record.vin : '',
        })


        if (isNotBlank(record.qualityDate)) {
          this.props.form.setFieldsValue({
            zbtime: record.qualityDate,
          });
          this.setState({
            selectyear: record.qualityDate.split(',')[0],
            selectmonth: record.qualityDate.split(',')[1]
          })

          if (isNotBlank(record.finishDate) && isNotBlank(record.qualityDate)) {
            const datediff = moment(moment(new Date().getTime())).diff(moment(new Date(record.finishDate).getTime()), 'months')
            const yeardiff = Number(record.qualityDate.split(',')[0])
            const monthdiff = Number(record.qualityDate.split(',')[1])
            const allmonth = yeardiff * 12 + monthdiff - datediff

            console.log(datediff, yeardiff, monthdiff)

            this.setState({
              alldata: `${Math.floor((yeardiff * 12 + monthdiff - datediff) / 12)}年${((yeardiff * 12 + monthdiff - datediff) % 12)}月`
            })
          }
        }

        if (isNotBlank(record.photo)) {
          let photoUrl1 = record.photo.split('|')
          photoUrl1 = photoUrl1.map((item) => {
            return {
              id: getFullUrl(item),
              uid: getFullUrl(item),
              url: getFullUrl(item),
              name: getFullUrl(item)
            }
          })
          this.setState({
            addfileList1: record.photo.split('|'),
            fileList1: photoUrl1
          })
        }

      }
    });

    this.setState({
      selectcodeflag: false
    })





    // this.props.form.setFieldsValue({
    // 	orderCode:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.orderCode)? record.orderCode:'',
    // 	orderType:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.orderType)? record.orderType:'',
    // 	project:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.project)? record.project:'',
    // 	dicth:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.dicth)? record.dicth:'',
    // 	businessType:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.businessType)? record.businessType:'',
    // 	y:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.settlementType)? record.settlementType:'',
    // 	insuranceCompanyId:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.insuranceCompanyId)? record.insuranceCompanyId:'',
    // 	brand:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.brand)? record.brand:'',
    // 	permitDate:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.completeDate)? moment(record.completeDate):'',
    // 	technicalParameters:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.technicalParameters)? record.technicalParameters:'',
    // 	assemblySteelSeal:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.assemblySteelSeal)? record.assemblySteelSeal:'',
    // 	assemblyMessage:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.assemblyMessage)? record.assemblyMessage:'',
    // 	maintenanceProject:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.entrustProject)? record.entrustProject:'',
    // 	tripMileage:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.tripMileage)? record.tripMileage:'',
    // 	plateNumber :isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.plateNumber )? record.plateNumber :'',
    // 	maintenanceHistory:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.maintenanceHistory)? record.maintenanceHistory:'',
    // 	x:isNotBlank(record)&&isNotBlank(record.id)&&isNotBlank(record.qualityProject)? record.qualityProject:'',
    // })


    // if(isNotBlank(record.qualityDate)){
    // 	this.props.form.setFieldsValue({
    // 		zbtime: record.qualityDate,
    // 	});
    // 		this.setState({
    // 			selectyear:record.qualityDate.split(',')[0],
    // 			selectmonth:record.qualityDate.split(',')[1]
    // 		})

    // 		if(isNotBlank(record.finishDate)&&isNotBlank(record.qualityDate)){
    // 			const datediff =  moment(moment(new Date().getTime())).diff(moment(new Date(record.finishDate).getTime()), 'months')
    // 		    const yeardiff = Number(record.qualityDate.split(',')[0])
    // 			const monthdiff = Number(record.qualityDate.split(',')[1])
    // 			const allmonth =  yeardiff*12+monthdiff-datediff

    // 			console.log(datediff,yeardiff,monthdiff)

    // 		     	this.setState({
    // 					alldata:`${Math.floor((yeardiff*12+monthdiff-datediff)/12)}年${((yeardiff*12+monthdiff-datediff)%12)}月`
    // 				 })
    // 		}	
    // }

    // if(isNotBlank(record.photo)){
    // 		let photoUrl1 = record.photo.split('|')
    // 		photoUrl1 = photoUrl1.map((item) => {
    // 			return {
    // 				id: getFullUrl(item),
    // 				uid: getFullUrl(item),
    // 				url: getFullUrl(item),
    // 				name: getFullUrl(item)
    // 			}
    // 		})
    // 		this.setState({
    // 			addfileList1:record.photo.split('|'),
    // 			fileList1: photoUrl1
    // 		})
    // }
  }

  editYear = (val) => {
    const { showdata, selectyear, selectmonth } = this.state
    if (isNotBlank(val)) {
      this.props.form.setFieldsValue({
        zbtime: isNotBlank(val) ? val : '',
      });
      this.setState({ selectyear: val })
    } else {
      this.props.form.setFieldsValue({
        zbtime: '',
      });
      this.setState({ selectyear: 0 })
    }
    // if((!isNotBlank(val)||val<=0)&&(!isNotBlank(selectmonth)||selectmonth<=0)){
    // 	if(showdata.length===0){
    // 		this.setState({showdata:[{id:1},{id:2}]})	
    // 	}else if(showdata.length===1){
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.push({id:2})
    // 		this.setState({showdata:newData})	
    // 	}else if(showdata.length>2){
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		 newData.splice(0,2)
    // 		this.setState({showdata:newData})	
    // 	}
    // }else if(showdata.length==0){
    // 		this.setState({showdata:[{id:1}]})	
    // 	} else if(showdata.length>1){
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.splice(0,1)
    // 		this.setState({showdata:newData})	
    // 	}
  }

  editMonth = (val) => {
    const { showdata, selectyear, selectmonth } = this.state
    if (isNotBlank(val)) {
      this.props.form.setFieldsValue({
        zbtime: isNotBlank(val) ? val : '',
      });
      this.setState({ selectmonth: val })
    } else {
      this.props.form.setFieldsValue({
        zbtime: '',
      });
      this.setState({ selectmonth: 0 })
    }

    // if((!isNotBlank(selectyear)||selectyear<=0)&&(!isNotBlank(val)||val<=0)){
    // 	if(showdata.length===0){
    // 		this.setState({showdata:[{id:1},{id:2}]})	
    // 	}else if(showdata.length===1){
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.push({id:2})
    // 		this.setState({showdata:newData})	
    // 	}else if(showdata.length>2){
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.splice(0,2)
    // 	}
    // }else if(showdata.length==0){
    // 		this.setState({showdata:[{id:1}]})	
    // 	} else if(showdata.length>1){
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.splice(0,1)
    // 		this.setState({
    // 			showdata:newData
    // 		})
    // 	}
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  selectshr = (record) => {
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
    this.setState({ showdata: newselectkhdata, selectshrflag: false })
  }

  // selectshr = (record) => {
  // 	const { dispatch } = this.props;
  // 	const { indexflag, showdata } = this.state;
  // 	let newselectcodedata = []
  // 	if (showdata.length === 0) {
  // 		newselectcodedata = []
  // 	} else {
  // 		newselectcodedata = showdata.map(item => ({ ...item }));
  // 	}
  // 	let newindex = ''
  // 	record.status = 0
  // 	showdata.forEach((i, index) => {
  // 		if (i.id === indexflag) {
  // 			newindex = index
  // 		}
  // 	})
  // 	newselectcodedata.splice(newindex, 1, record)
  // 	this.setState({ showdata: newselectcodedata, selectshrflag: false })
  // }

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const { location, indexstatus } = this.state
    dispatch({
      type: 'cpAfterApplicationFrom/cpAfter_Application_ispass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
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


            if (isNotBlank(res.data) && isNotBlank(res.data.type) && res.data.type == 3) {
              this.setState({
                showtype: 3
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
          }
        });
      }
    })
  }

  showsp = (i) => {
    this.setState({
      indexstatus: i,
      modalVisiblepass: true
    })
  }

  onselectkh = (key) => {
    this.setState({
      indexflag: key,
      selectshrflag: true
    })
  }

  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该售后申请单',
      content: '确定撤销该售后申请单吗？',
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
        type: 'cpAfterApplicationFrom/cpAfterApplication_Revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/accessories/process/cp_after_application_from_form?id=${location.query.id}`);
          // router.push('/accessories/process/cp_after_application_from_list');
        }
      })
    }
  }

  onUndoresubmit = (record) => {
    Modal.confirm({
      title: '重新提交该售后申请单',
      content: '确定重新提交该售后申请单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.repost(record),
    });
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
        type: 'cpAfterApplicationFrom/cpAfterApplication_Resubmit',
        payload: {
          id: location.query.id
        },
        callback: () => {
          dispatch({
            type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Get',
            payload: {
              id: location.query.id,
            },
            callback: (res) => {
              if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
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


              if (isNotBlank(res.data) && isNotBlank(res.data.type) && res.data.type == 3) {
                this.setState({
                  showtype: 3
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
            }
          });
        }
      })
    }
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
        isTemplate: 1
      }
    });
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
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

  render() {
    const { fileList, previewVisible, previewImage, modalVisiblepass, selectcodeflag, selectcodedata, selecthistorydata, showdata, orderflag,
      selectedRows, selectshrflag, zhibflag, updataname, updataflag, srcimg, srcimg1, searchVisible
      , selecthistoryflag, fileList1, alldata, selectyhflag } = this.state;
    const { submitting1, submitting2, submitting, cpAfterApplicationFromGet, selectCompleteList, modeluserList, dispatch,
      levellist, levellist2, newdeptlist, cpBusinessOrderSearchList, cpAfterApplicationFromList, cpAfterApplicationFromHistory } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const yeardata = [
      {
        key: 0,
        value: 0
      },
      {
        key: 1,
        value: 1
      },
      {
        key: 2,
        value: 2
      },
      {
        key: 3,
        value: 3
      },
      {
        key: 4,
        value: 4
      },
      {
        key: 5,
        value: 5
      },
      {
        key: 6,
        value: 6
      },
      {
        key: 7,
        value: 7
      },
      {
        key: 8,
        value: 8
      },
      {
        key: 9,
        value: 9
      },
      {
        key: 10,
        value: 10
      },
    ]
    const monthdata = [
      {
        key: 0,
        value: 0
      },
      {
        key: 1,
        value: 1
      },
      {
        key: 2,
        value: 2
      },
      {
        key: 3,
        value: 3
      },
      {
        key: 4,
        value: 4
      },
      {
        key: 5,
        value: 5
      },
      {
        key: 6,
        value: 6
      },
      {
        key: 7,
        value: 7
      },
      {
        key: 8,
        value: 8
      },
      {
        key: 9,
        value: 9
      },
      {
        key: 10,
        value: 10
      },
      {
        key: 11,
        value: 11
      },
      {
        key: 12,
        value: 12
      },
    ]
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
        width: 100,
        render: (text, record) => {
          if ((!isNotBlank(cpAfterApplicationFromGet) || !isNotBlank(cpAfterApplicationFromGet.approvals)) || ((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) &&
            (cpAfterApplicationFromGet.approvals === 0 || cpAfterApplicationFromGet.approvals === '0' || cpAfterApplicationFromGet.approvals === 2 || cpAfterApplicationFromGet.approvals === '2' ||
              cpAfterApplicationFromGet.approvals === 4 || cpAfterApplicationFromGet.approvals === '4')))) {
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
          if (isNotBlank(cpAfterApplicationFromGet) && (cpAfterApplicationFromGet.approvals !== 0 || cpAfterApplicationFromGet.approvals !== '0')) {
            return (<span>{shstatus(text)}</span>)
          }
          return ''
        }
      },
      {
        title: '审核结果',
        dataIndex: 'remarks1',
        key: 'remarks1',
        width: 250,
      },
      {
        title: '删除',
        key: 'action',
        width: 100,
        render: (text, record) => {
          if (((isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (cpAfterApplicationFromGet.approvals === 0 || cpAfterApplicationFromGet.approvals === '0')) ||
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 2 || cpAfterApplicationFromGet.approvals === '2')) ||
            (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 4 || cpAfterApplicationFromGet.approvals === '4'))
          )) {
            return (
              <span>
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return ''
        }
      },
    ];
    const appData = (apps) => {
      if (apps === 0 || apps === '0') {
        return '待分配'
      }
      if (apps === 1 || apps === '1') {
        return '待审核'
      }
      if (apps === 2 || apps === '2') {
        return '撤销'
      }
      if (apps === 3 || apps === '3') {
        return '通过'
      }
      if (apps === 4 || apps === '4') {
        return '驳回'
      }
    }

    const that = this

    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpBusinessOrderSearchList,
      that
    }
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }

    const parentMethodsyh = {
      handleModalVisibleyh: this.handleModalVisibleyh,
      selectyh: this.selectyh,
      selectCompleteList: cpAfterApplicationFromList,
      dispatch,
      that,
      // handleSearchChangeyh:this.handleSearchChangeyh
    }


    const parentMethodshistory = {
      handleModalVisiblehistory: this.handleModalVisiblehistory,
      selecthistory: this.selecthistory,
      selectCompleteList: cpAfterApplicationFromHistory,
      dispatch,
      that,
      handleSearchChangeout: this.handleSearchChangeout
    }

    const parentMethodscode = {
      handleAddcode: this.handleAddcode,
      handleModalVisiblecode: this.handleModalVisiblecode,
      selectcode: this.selectcode,
      selectCompleteList,
      dispatch,
      that,
      handleSearchChangeout: this.handleSearchChangeout
    }
    const parentMethodsshr = {
      handleAddkh: this.handleAddkh,
      handleModalVisibleshr: this.handleModalVisibleshr,
      handleSelectRows: this.handleSelectRows,
      selectedRows,
      selectshr: this.selectshr,
      dispatch,
      levellist, levellist2, newdeptlist,
      modeluserList,
      that
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>售后申请单</div>
          {isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
            </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <div style={{ textAlign: 'center' }}><span>选择需售后申请的委托单</span><Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectsh} loading={submitting} disabled={orderflag}>选择</Button></div>
                  <div style={{ textAlign: 'center', margin: '10px 0' }}><span>选择需售后申请的售后历史单</span><Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselecthistory} loading={submitting} disabled={orderflag}>选择</Button></div>
                  <div style={{ textAlign: 'center', margin: '10px 0' }}><span>选择养护售后</span><Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectyh} loading={submitting} disabled={orderflag}>选择</Button></div>
                </Col>
                {/* <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='意向单号'>
                    {getFieldDecorator('intentionId', {
										initialValue: isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.intentionId) ? cpAfterApplicationFromGet.intentionId : '',     
										rules: [
											{
												required: false,   
												message: '请输入意向单号',
											},
										],
									})(<Input  disabled />)}
                  </FormItem>
                </Col> */}
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    {getFieldDecorator('id', {
                      initialValue: (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.id) ? cpAfterApplicationFromGet.id : ''),
                      rules: [
                        {
                          required: false,
                          message: '单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24} >
                  <FormItem {...formItemLayout} label='售后编号' className="allinputstyle">
                    {getFieldDecorator('historyCode', {
                      initialValue: (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.historyCode) ? cpAfterApplicationFromGet.historyCode : ''),
                      rules: [
                        {
                          required: false,
                          message: '售后编号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='历史单号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.orderCode) ? selectcodedata.orderCode : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.orderCode) ? selecthistorydata.orderCode : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.orderCode) ? cpAfterApplicationFromGet.orderCode : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入历史单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后次数'>
                    {getFieldDecorator('entrustNumber', {
                      initialValue: isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.entrustNumber) ? cpAfterApplicationFromGet.entrustNumber : '',
                      rules: [
                        {
                          required: false,
                          message: '售后次数',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='审批进度'>
                    <Input

                      value={isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) ?
                        appData(cpAfterApplicationFromGet.approvals) : ''}
                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单分类'>
                    {getFieldDecorator('orderType', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.orderType) ? selectcodedata.orderType : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.orderType) ? selecthistorydata.orderType : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.orderType) ? cpAfterApplicationFromGet.orderType : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择订单分类',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled
                      >
                        {
                          isNotBlank(this.state.orderType) && this.state.orderType.length > 0 && this.state.orderType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务项目'>
                    {getFieldDecorator('project', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.project) ? selectcodedata.project : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.project) ? selecthistorydata.project : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.project) ? cpAfterApplicationFromGet.project : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择业务项目',
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
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务渠道'>
                    {getFieldDecorator('dicth', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.dicth) ? selectcodedata.dicth : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.dicth) ? selecthistorydata.dicth : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.dicth) ? cpAfterApplicationFromGet.dicth : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择业务渠道',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled
                      >
                        {
                          isNotBlank(this.state.business_dicth) && this.state.business_dicth.length > 0 && this.state.business_dicth.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务分类'>
                    {getFieldDecorator('businessType', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.businessType) ? selectcodedata.businessType : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.businessType) ? selecthistorydata.businessType : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.businessType) ? cpAfterApplicationFromGet.businessType : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择业务分类',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled
                      >
                        {
                          isNotBlank(this.state.business_type) && this.state.business_type.length > 0 && this.state.business_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='结算类型'>
                    {getFieldDecorator('y', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.settlementType) ? selectcodedata.settlementType : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.y) ? selecthistorydata.y : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.y) ? cpAfterApplicationFromGet.y : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择结算类型',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled
                      >
                        {
                          isNotBlank(this.state.settlement_type) && this.state.settlement_type.length > 0 && this.state.settlement_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='保险公司'>
                    {getFieldDecorator('insuranceCompanyId', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.insuranceCompanyId) ? selectcodedata.insuranceCompanyId : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.insuranceCompanyId) ? selecthistorydata.insuranceCompanyId : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.insuranceCompanyId) ? cpAfterApplicationFromGet.insuranceCompanyId : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择保险公司',
                        },
                      ],
                    })(<Select
                      style={{ width: '100%' }}
                      disabled
                      allowClear
                    >
                      {
                        isNotBlank(this.state.insuranceCompany) && this.state.insuranceCompany.length > 0 && this.state.insuranceCompany.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='集采客户'>
                    {/* {getFieldDecorator('ctClientId', {
										initialValue: isNotBlank(selectcodedata)&&isNotBlank(selectcodedata.collectClientId)&&isNotBlank(selectcodedata.collectClientId.name) ? selectcodedata.collectClientId.name:
										(isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectClient)&& isNotBlank(cpAfterApplicationFromGet.collectClient.name) ? cpAfterApplicationFromGet.collectClient.name : ''),     
										rules: [
											{
												required: false,   
												message: '请输入集采客户',
											},
										],
									})( */}
                    <Input disabled value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.collectClientId) && isNotBlank(selectcodedata.collectClientId.name) ? selectcodedata.collectClientId.name : '') :
                      isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.collectClient) && isNotBlank(selecthistorydata.collectClient.name) ? selecthistorydata.collectClient.name : '') :
                        (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectClient) && isNotBlank(cpAfterApplicationFromGet.collectClient.name) ? cpAfterApplicationFromGet.collectClient.name : '')} />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='集采编码'>
                    {/* {getFieldDecorator('ctCode', {
										initialValue: isNotBlank(selectcodedata)&&isNotBlank(selectcodedata.collectCode)? selectcodedata.collectCode:
										(isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectCode) && isNotBlank(cpAfterApplicationFromGet.collectCode.name) ? cpAfterApplicationFromGet.collectCode.name : ''),     
										rules: [
											{
												required: false,   
												message: '请输入集采编码',
											},
										],
									})( */}
                    <Input disabled value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.collectCode) ? selectcodedata.collectCode : '') :
                      isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.collectCode) && isNotBlank(selecthistorydata.collectCode.name) ? selecthistorydata.collectCode.name : '') :
                        (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.collectCode) && isNotBlank(cpAfterApplicationFromGet.collectCode.name) ? cpAfterApplicationFromGet.collectCode.name : '')} />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='品牌'>
                    {getFieldDecorator('brand', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.brand) ? selectcodedata.brand : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.brand) ? selecthistorydata.brand : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.brand) ? cpAfterApplicationFromGet.brand : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入品牌',
                        },
                      ],
                    })(<Select
                      style={{ width: '100%' }}
                      disabled
                      allowClear
                    >
                      {
                        isNotBlank(this.state.brand) && this.state.brand.length > 0 && this.state.brand.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="放行单完成时间">
                    {getFieldDecorator('permitDate', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.completeDate) ? moment(selectcodedata.completeDate) : null) :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.permitDate) ? moment(selecthistorydata.permitDate) : null) :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.permitDate) ? moment(cpAfterApplicationFromGet.permitDate) : null),
                      rules: [
                        {
                          required: false,
                          message: '放行单完成时间',
                        },
                      ],
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
                  <FormItem {...formItemLayout} label='质保剩余日期'>
                    <Input disabled value={alldata} />
                  </FormItem>
                </Col>

                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='质保范围'>
                    {getFieldDecorator('x', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.qualityProject) ? selectcodedata.qualityProject : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.x) ? selecthistorydata.x : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.x) ? cpAfterApplicationFromGet.x : ''),
                      rules: [
                        {
                          required: false,
                          message: '质保范围',
                        },
                      ],
                    })(
                      <Input disabled value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.qualityProject) ? selectcodedata.qualityProject : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.x) ? selecthistorydata.x : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.x) ? cpAfterApplicationFromGet.x : '')} />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='图片' className="allimgstyle">
                    <Upload
                      disabled
                      //   disabled={orderflag&&updataflag}
                      disabled
                      accept="image/*"
                      //   beforeUpload={this.handlebeforeUpload}
                      fileList={fileList1}
                      listType="picture-card"
                      onPreview={this.handlePreview1}
                    >
                      {/* {(isNotBlank(fileList1) && fileList1.length >= 4) || (orderflag) ? null : uploadButton} */}
                    </Upload>
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
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.name) ? selectcodedata.user.name : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.user) && isNotBlank(selecthistorydata.user.name) ? selecthistorydata.user.name : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user) ? cpAfterApplicationFromGet.user.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.no) ? selectcodedata.user.no : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.user) && isNotBlank(selecthistorydata.user.no) ? selecthistorydata.user.no : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user) && isNotBlank(cpAfterApplicationFromGet.user.no) ? cpAfterApplicationFromGet.user.no : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.office) && isNotBlank(selectcodedata.user.office.name) ? selectcodedata.user.office.name : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.user) && isNotBlank(selecthistorydata.user.office) && isNotBlank(selecthistorydata.user.office.name) ? selecthistorydata.user.office.name : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user) && isNotBlank(cpAfterApplicationFromGet.user.office) && isNotBlank(cpAfterApplicationFromGet.user.office.name) ? cpAfterApplicationFromGet.user.office.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Select
                      allowClear
                      notFoundContent={null}
                      style={{ width: '100%' }}
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.dictArea) && isNotBlank(selectcodedata.user.dictArea.name) ? selectcodedata.user.dictArea.name : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.user) && isNotBlank(selecthistorydata.user.dictArea) && isNotBlank(selecthistorydata.user.dictArea.name) ? selecthistorydata.user.dictArea.name : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user) && isNotBlank(cpAfterApplicationFromGet.user.dictArea) && isNotBlank(cpAfterApplicationFromGet.user.dictArea.name) ? cpAfterApplicationFromGet.user.dictArea.name : '')}

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
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.dept) && isNotBlank(selectcodedata.user.dept.name) ? selectcodedata.user.dept.name : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.user) && isNotBlank(selecthistorydata.user.dept) && isNotBlank(selecthistorydata.user.dept.name) ? selecthistorydata.user.dept.name : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.user) && isNotBlank(cpAfterApplicationFromGet.user.dept) && isNotBlank(cpAfterApplicationFromGet.user.dept.name) ? cpAfterApplicationFromGet.user.dept.name : '')}
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
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.userOffice) && isNotBlank(selectcodedata.userOffice.name) ? selectcodedata.userOffice.name : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.client) && isNotBlank(selecthistorydata.client.clientCpmpany) ? selecthistorydata.client.clientCpmpany : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client) && isNotBlank(cpAfterApplicationFromGet.client.clientCpmpany) ? cpAfterApplicationFromGet.client.clientCpmpany : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input
                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.name) ? selectcodedata.client.name : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.client) && isNotBlank(selecthistorydata.client.name) ? selecthistorydata.client.name : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client) && isNotBlank(cpAfterApplicationFromGet.client.name) ? cpAfterApplicationFromGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.classify) ? selectcodedata.client.classify : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.client) && isNotBlank(selecthistorydata.client.classify) ? selecthistorydata.client.classify : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client) && isNotBlank(cpAfterApplicationFromGet.client.classify) ? cpAfterApplicationFromGet.client.classify : '')}
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
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.code) ? selectcodedata.client.code : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.client) && isNotBlank(selecthistorydata.client.code) ? selecthistorydata.client.code : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client) && isNotBlank(cpAfterApplicationFromGet.client.code) ? cpAfterApplicationFromGet.client.code : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.name) ? selectcodedata.client.name : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.client) && isNotBlank(selecthistorydata.client.name) ? selecthistorydata.client.name : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client) && isNotBlank(cpAfterApplicationFromGet.client.name) ? cpAfterApplicationFromGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.address) ? selectcodedata.client.address : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.client) && isNotBlank(selecthistorydata.client.address) ? selecthistorydata.client.address : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client) && isNotBlank(cpAfterApplicationFromGet.client.address) ? cpAfterApplicationFromGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.phone) ? selectcodedata.client.phone : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.client) && isNotBlank(selecthistorydata.client.phone) ? selecthistorydata.client.phone : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.client) && isNotBlank(cpAfterApplicationFromGet.client.phone) ? cpAfterApplicationFromGet.client.phone : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="故障反馈" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='质保时间'>
                    {getFieldDecorator('zbtime', {
                      rules: [
                        {
                          required: false,
                          message: '请选择质保时间',
                        },
                      ],
                    })(
                      <span>
                        <Select
                          allowClear
                          style={{ width: '50%' }}
                          disabled
                          value={`${this.state.selectyear} 年`}
                          onChange={this.editYear}
                        >
                          {
                            isNotBlank(yeardata) && yeardata.length > 0 && yeardata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
                          }
                        </Select>
                        <Select
                          allowClear
                          style={{ width: '50%' }}
                          disabled
                          value={`${this.state.selectmonth} 月`}
                          onChange={this.editMonth}
                        >
                          {
                            isNotBlank(monthdata) && monthdata.length > 0 && monthdata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
                          }
                        </Select>
                      </span>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    {getFieldDecorator('linkman', {
                      initialValue:
                        (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.linkman) ? cpAfterApplicationFromGet.linkman : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入联系人',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='电话'>
                    {getFieldDecorator('phone', {
                      initialValue:
                        (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.phone) ? cpAfterApplicationFromGet.phone : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入电话',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='是否收费'>
                    {getFieldDecorator('ischarge', {
                      initialValue:
                        (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.ischarge) ? cpAfterApplicationFromGet.ischarge : '0'),
                      rules: [
                        {
                          required: true,
                          message: '请输入是否收费',
                        },
                      ],
                    })(
                      <Select
                        disabled={orderflag && updataflag}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        <Option key="1" value="1">是</Option>
                        <Option key="0" value="0">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='售后地址' className="allinputstyle">
                    {getFieldDecorator('afterAddress', {
                      initialValue: isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.afterAddress) ? cpAfterApplicationFromGet.afterAddress : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后地址',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='本次故障描述' className="allinputstyle">
                    {getFieldDecorator('z', {
                      initialValue: isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.z) ? cpAfterApplicationFromGet.z : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入本次故障描述',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='故障描述图片' className="allimgstyle">
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
                      {(isNotBlank(fileList) && fileList.length >= 4) || (orderflag) ? null : uploadButton}
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="总成信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成型号'>
                    {/* {getFieldDecorator('cabname', {
									initialValue:isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id)? (isNotBlank(selectcodedata.cab.assemblyModel)?selectcodedata.cab.assemblyModel:'' )
									: (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) &&isNotBlank(cpAfterApplicationFromGet.assmblyBuild.assemblyModel) ? cpAfterApplicationFromGet.assmblyBuild.assemblyModel:''),
									rules: [
										{
											required: false,   
										},
									]
								})( */}
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.assemblyModel) ? selectcodedata.cab.assemblyModel : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.assmblyBuild) && isNotBlank(selecthistorydata.assmblyBuild.assemblyModel) ? selecthistorydata.assmblyBuild.assemblyModel : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild.assemblyModel) ? cpAfterApplicationFromGet.assmblyBuild.assemblyModel : '')}
                    />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成品牌'>
                    {/* {getFieldDecorator('assemblyBrandname', {
									initialValue:isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id)? (isNotBlank(selectcodedata.cab.assemblyBrand)?selectcodedata.cab.assemblyBrand:'' )
									: (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) &&isNotBlank(cpAfterApplicationFromGet.assmblyBuild.assemblyBrand) ? cpAfterApplicationFromGet.assmblyBuild.assemblyBrand:''),
									rules: [
										{
											required: false,   
										},
									]
								})( */}
                    <Input
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.assemblyBrand) ? selectcodedata.cab.assemblyBrand : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.assmblyBuild) && isNotBlank(selecthistorydata.assmblyBuild.assemblyBrand) ? selecthistorydata.assmblyBuild.assemblyBrand : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild.assemblyBrand) ? cpAfterApplicationFromGet.assmblyBuild.assemblyBrand : '')}

                      disabled
                    />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车型/排量'>
                    {/* {getFieldDecorator('assemblyVehicleEmissionsname', {
									initialValue:isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id)? (isNotBlank(selectcodedata.cab.vehicleModel)?selectcodedata.cab.vehicleModel:'' )
									: (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) &&isNotBlank(cpAfterApplicationFromGet.assmblyBuild.vehicleModel) ? cpAfterApplicationFromGet.assmblyBuild.vehicleModel:''),
									rules: [
										{
											required: false,   
										},
									]
								})( */}
                    <Input
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.vehicleModel) ? selectcodedata.cab.vehicleModel : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.assmblyBuild) && isNotBlank(selecthistorydata.assmblyBuild.vehicleModel) ? selecthistorydata.assmblyBuild.vehicleModel : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild.vehicleModel) ? cpAfterApplicationFromGet.assmblyBuild.vehicleModel : '')}

                      disabled
                    />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='年份'>
                    {/* {getFieldDecorator('assemblyYearname', {
									initialValue:isNotBlank(selectcodedata) && isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.id)? (isNotBlank(selectcodedata.cab.assemblyYear)?selectcodedata.cab.assemblyYear:'' )
									: (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) &&isNotBlank(cpAfterApplicationFromGet.assmblyBuild.assemblyYear) ? cpAfterApplicationFromGet.assmblyBuild.assemblyYear:''),
									rules: [
										{
											required: false,   
										},
									]
								})( */}
                    <Input
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.cab) && isNotBlank(selectcodedata.cab.assemblyYear) ? selectcodedata.cab.assemblyYear : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.assmblyBuild) && isNotBlank(selecthistorydata.assmblyBuild.assemblyYear) ? selecthistorydata.assmblyBuild.assemblyYear : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild) && isNotBlank(cpAfterApplicationFromGet.assmblyBuild.assemblyYear) ? cpAfterApplicationFromGet.assmblyBuild.assemblyYear : '')}

                      disabled
                    />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='技术参数'>
                    {getFieldDecorator('technicalParameters', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.technicalParameters) ? selectcodedata.technicalParameters : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.technicalParameters) ? selecthistorydata.technicalParameters : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.technicalParameters) ? cpAfterApplicationFromGet.technicalParameters : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入技术参数',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='钢印号'>
                    {getFieldDecorator('assemblySteelSeal', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.assemblySteelSeal) ? selectcodedata.assemblySteelSeal : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.assemblySteelSeal) ? selecthistorydata.assemblySteelSeal : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assemblySteelSeal) ? cpAfterApplicationFromGet.assemblySteelSeal : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入钢印号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='VIN码'>
                    {getFieldDecorator('assemblyVin', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.vin) ? selectcodedata.vin : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.assemblyVin) ? selecthistorydata.assemblyVin : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assemblyVin) ? cpAfterApplicationFromGet.assemblyVin : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入VIN码',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='其他识别信息'>
                    {getFieldDecorator('assemblyMessage', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.assemblyMessage) ? selectcodedata.assemblyMessage : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.assemblyMessage) ? selecthistorydata.assemblyMessage : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.assemblyMessage) ? cpAfterApplicationFromGet.assemblyMessage : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入其他识别信息',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='维修项目'>
                    {getFieldDecorator('maintenanceProject', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.entrustProject) ? selectcodedata.entrustProject : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.maintenanceProject) ? selecthistorydata.maintenanceProject : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.maintenanceProject) ? cpAfterApplicationFromGet.maintenanceProject : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入维修项目',
                        },
                      ],
                    })(
                      <Select disabled allowClear style={{ width: '100%' }}>
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
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='行程里程'>
                    {getFieldDecorator('tripMileage', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.tripMileage) ? selectcodedata.tripMileage : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.tripMileage) ? selecthistorydata.tripMileage : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.tripMileage) ? cpAfterApplicationFromGet.tripMileage : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入行程里程',
                        },
                      ],
                    })(<InputNumber disabled={updataflag} precision={2} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车牌号'>
                    {getFieldDecorator('plateNumber', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.plateNumber) ? selectcodedata.plateNumber : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.plateNumber) ? selecthistorydata.plateNumber : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.plateNumber) ? cpAfterApplicationFromGet.plateNumber : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入车牌号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='维修历史' className="allinputstyle">
                    {getFieldDecorator('maintenanceHistory', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id) ? (isNotBlank(selectcodedata.maintenanceHistory) ? selectcodedata.maintenanceHistory : '') :
                        isNotBlank(selecthistorydata) && isNotBlank(selecthistorydata.id) ? (isNotBlank(selecthistorydata.maintenanceHistory) ? selecthistorydata.maintenanceHistory : '') :
                          (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.maintenanceHistory) ? cpAfterApplicationFromGet.maintenanceHistory : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入维修历史',
                        },
                      ],
                    })(<TextArea disabled={updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.remarks) ? cpAfterApplicationFromGet.remarks : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入备注信息',
                        },
                      ],
                    })(
                      <TextArea
                        disabled={orderflag && updataflag}
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
                />
              )}

              {isNotBlank(showdata) && showdata.length < 5 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  onClick={this.newMember}
                  icon="plus"
                  disabled={!((JSON.stringify(cpAfterApplicationFromGet) == "{}") || (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) &&
                    (cpAfterApplicationFromGet.approvals === 0 || cpAfterApplicationFromGet.approvals === '0')) ||
                    (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 2 || cpAfterApplicationFromGet.approvals === '2')) ||
                    (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 4 || cpAfterApplicationFromGet.approvals === '4'))
                  )}
                >
                  新增审核人
</Button>
              }


              {isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.isOperation) && (cpAfterApplicationFromGet.isOperation === 1 || cpAfterApplicationFromGet.isOperation === '1') &&
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
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '二次修改')
                  .length > 0 &&
                <Button style={{ marginLeft: 8 }} loading={submitting2 || submitting1} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                  {updataname}
                </Button>
              }
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
                  .length > 0 && <span>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    onClick={this.onsave}
                    loading={submitting2 || submitting1}
                    disabled={(!((!isNotBlank(cpAfterApplicationFromGet) || !isNotBlank(cpAfterApplicationFromGet.approvals)) || (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) &&
                      (cpAfterApplicationFromGet.approvals === 0 || cpAfterApplicationFromGet.approvals === '0')) ||
                      (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 2 || cpAfterApplicationFromGet.approvals === '2')) ||
                      (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 4 || cpAfterApplicationFromGet.approvals === '4'))))}
                  >
                    保存
  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: '8px', marginLeft: '8px' }}
                    loading={submitting2 || submitting1}
                    disabled={(!((!isNotBlank(cpAfterApplicationFromGet) || !isNotBlank(cpAfterApplicationFromGet.approvals)) || (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) &&
                      (cpAfterApplicationFromGet.approvals === 0 || cpAfterApplicationFromGet.approvals === '0')) ||
                      (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 2 || cpAfterApplicationFromGet.approvals === '2')) ||
                      (isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.createBy) && (cpAfterApplicationFromGet.approvals === 4 || cpAfterApplicationFromGet.approvals === '4'))
                    )) && updataflag}
                  >
                    提交
  </Button>
                  {isNotBlank(cpAfterApplicationFromGet) && isNotBlank(cpAfterApplicationFromGet.approvals) &&
                    (cpAfterApplicationFromGet.approvals === 1 || cpAfterApplicationFromGet.approvals === '1') && isNotBlank(cpAfterApplicationFromGet.createBy) &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1 || submitting2} onClick={() => this.onUndoresubmit()}>
                      重新提交
                      </Button>
                  }
                  {
                    orderflag && cpAfterApplicationFromGet.approvals === '3' &&
                    <Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpAfterApplicationFromGet.id)} loading={submitting2 || submitting1}>
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



        <CreateFormyh {...parentMethodsyh} selectyhflag={selectyhflag} />
        <CreateFormhistory {...parentMethodshistory} selecthistoryflag={selecthistoryflag} />
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
        <CreateFormkh {...parentMethodscode} selectcodeflag={selectcodeflag} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateFormshr {...parentMethodsshr} selectshrflag={selectshrflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpAfterApplicationFromForm;
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
  DatePicker,
  Row, Col,
  Tag, Table, Divider, Popconfirm, Cascader
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

  render() {
    const {
      searchVisible,
      form: { getFieldDecorator },
      handleSearchVisible,
      CpAccessoriesSalesSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisible}
        onCancel={() => handleSearchVisible(false)}
        afterClose={() => handleSearchVisible()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={CpAccessoriesSalesSearchList} />)}
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
  const { handleModalVisiblecode, getCpAccessoriesSaleslist, selectcodeflag, selectcode, dispatch, form, form: { getFieldDecorator }, handleSearchChangeout } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: record => (
        <Fragment>
          <a onClick={() => selectcode(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '意向单号',
      dataIndex: 'intentionId',
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
      width: 150,
      editable: true,
    },
    {
      title: '订单分类',
      dataIndex: 'orderType',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '业务项目',
      dataIndex: 'project',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '业务渠道',
      dataIndex: 'dicth',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '业务分类',
      dataIndex: 'businessType',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '结算类型',
      dataIndex: 'settlementType',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '保险公司',
      dataIndex: 'insuranceCompanyId',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '采集客户',
      dataIndex: 'collectClientId.id',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '采集编码',
      dataIndex: 'collectCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '业务员',
      dataIndex: 'user.name',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '客户',
      dataIndex: 'client.name',
      inputType: 'text',
      align: 'center',
      width: 100,
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
      width: 150,
      editable: true,
    },
    {
      title: '故障代码',
      dataIndex: 'assemblyFaultCode',
      inputType: 'text',
      align: 'center',
      width: 150,
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
      width: 100,
      align: 'center',
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
      width: 100,
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
    dispatch({
      type: 'cpMoneyChange/get_CpAccessories_SalesFormAll'
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
      dispatch({
        type: 'cpMoneyChange/get_CpAccessories_SalesFormAll',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        }
      });
    });
  };
  const renderSimpleForm = () => {
    return (
      <Form onSubmit={handleSearchout} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
  return (
    <Modal
      title='选择委托单'
      visible={selectcodeflag}
      onCancel={() => handleModalVisiblecode()}
      width='80%'
    >
      <div className={styles.tableListForm}>{renderSimpleForm()}</div>
      <StandardTable
        bordered
        scroll={{ x: 3600 }}
        data={getCpAccessoriesSaleslist}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, modeluserList, selectkhflag, selectcustomer, selectedRows, handleSelectRows, levellist, levellist2, newdeptlist, form, dispatch } = props;
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
      width: 100,
      align: 'center',
      render: (text) => {
        if (isNotBlank(text)) {
          if (text === 0 || text === '0') {
            return <span>男</span>
          }
          if (text === 1 || text === '1') {
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
      dispatch({
        type: 'sysuser/modeluser_List',
        payload: {
          'role.id': 3,
          'office.id': getStorage('companyId'),
          ...values
        }
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': 3,
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
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      'role.id': 3,
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
  return (
    <Modal
      title='选择审核人'
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekh()}
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
                  <Option value={0} key={0}>
                    男
    </Option>
                  <Option value={1} key={1}>
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
@connect(({ cpMoneyChange, loading, cpAfterApplicationFrom, sysuser, syslevel, sysdept, cpAccessoriesSalesForm }) => ({
  ...cpMoneyChange,
  ...cpAfterApplicationFrom,
  ...sysuser,
  ...syslevel,
  ...sysdept,
  ...cpAccessoriesSalesForm,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
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
      biliNumber: '',
      orderflag: false,
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
              .length == 0)) {
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
          this.setState({
            showdata: allUser
          })
        }
      });
    }
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': 3,
        'office.id': getStorage('companyId')
      }
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

  componentWillUpdate() {
    console.log('componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
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
        value.changeMoney = setPrice(value.changeMoney)
        value.receivable = setPrice(value.receivable)
        value.applyMoney = setPrice(value.applyMoney)
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
        value.type = 1
        dispatch({
          type: 'cpMoneyChange/cpMoneyChange_submit',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_pz_money_change_form?id=${location.query.id}`);
            // router.goBack();
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
        value.changeMoney = setPrice(value.changeMoney)
        value.receivable = setPrice(value.receivable)
        value.applyMoney = setPrice(value.applyMoney)
        value.orderDate = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.createDate)) ? selectcodedata.createDate :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderDate)) ? cpMoneyChangeGet.orderDate : '')
        value.parent = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) ? selectcodedata.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.parent)) ? cpMoneyChangeGet.parent : '')
        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client)) ? cpMoneyChangeGet.client.id : '')
        value.user.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
          ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user)) ? cpMoneyChangeGet.user.id : (getStorage('userid') ? getStorage('userid') : ''))
        value.type = 1
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
            router.push(`/business/process/cp_pz_money_change_form?id=${res.data.id}`);
          }
        })
      }
    });
  }

  onCancelCancel = () => {
    router.push('/business/process/cp_quality_change_list');
    // router.goBack();
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
    const { dispatch } = this.props
    dispatch({
      type: 'cpMoneyChange/get_CpAccessories_SalesFormAll'
    });
    this.setState({ selectcodeflag: true });
  }

  selectcode = (record) => {
    const { form, cpMoneyChangeGet } = this.props
    form.resetFields();
    if (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.id)) {
      this.setState({
        biliNumber: (getPrice(record.money) / getPrice(cpMoneyChangeGet.applyMoney)).toFixed(2),
        changeNumber: getPrice(cpMoneyChangeGet.applyMoney) - Number(getPrice(record.money)),
        selectcodedata: record,
        selectcodeflag: false,
      })
    } else {
      this.setState({
        selectcodedata: record,
        selectcodeflag: false,
        biliNumber: '',
        changeNumber: ''
      })
    }
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
            if (res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2') {
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
          }
        });
      }
    })
  }

  onselectkh = (key) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': 3,
        'office.id': getStorage('companyId')
      },
      callback: () => {
        this.setState({
          indexflag: key,
          selectkhflag: true
        })
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

  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该配件金额变更申请单',
      content: '确定撤销该配件金额变更申请单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(record),
    });
  }

  undoClick = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpRevocation/cpAccessoriesSalesForm_Revocation',
      payload: {
        id
      },
      callback: () => {
        router.goBack();
      }
    })
  }

  showmoney = (e) => {
    const { selectcodedata } = this.state
    const { cpMoneyChangeGet } = this.props
    if (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.money) && selectcodedata.money != 0 && isNotBlank(e) && e != 0) {
      this.setState({
        biliNumber: (getPrice(selectcodedata.money) / e).toFixed(2),
        appmoney: e,
        changeNumber: Number(e) - Number(getPrice(selectcodedata.money))
      })
    } else if (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.receivable) && cpMoneyChangeGet.receivable != 0 && isNotBlank(e) && e != 0) {
      this.setState({
        biliNumber: (getPrice(cpMoneyChangeGet.receivable) / e).toFixed(2),
        appmoney: e,
        changeNumber: Number(e) - Number(getPrice(cpMoneyChangeGet.receivable))
      })
    }
    else {
      this.setState({
        biliNumber: '',
        appmoney: ''
      })
    }
  }

  handleSearchVisible = () => {
    this.setState({
      searchVisible: false,
    });
  };

  handleSearchChangeout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpAccessoriesSalesForm/cpAssemblyBuild_SearchList',
      payload: {
        pageSize: 10,
      }
    });
    this.setState({
      searchVisible: true,
    });
  };

  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpMoneyChange/get_CpAccessories_SalesFormAll',
      payload: {
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      }
    });
    this.setState({
      searchVisible: false,
    });
  }

  render() {
    const { fileList, previewVisible, previewImage, selectcodeflag, selectcodedata, modalVisiblepass, showdata, orderflag, selectkhflag,
      selectedRows, srcimg, srcimg1, biliNumber, appmoney, changeNumber, searchVisible } = this.state;
    const { submitting, cpMoneyChangeGet, getCpAccessoriesSaleslist, modeluserList, levellist, levellist2, newdeptlist, dispatch, CpAccessoriesSalesSearchList } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
          if ((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
            (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
            (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
            (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4'))
          )) {
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
      {
        title: '删除',
        key: 'action',
        width: 100,
        render: (text, record) => {
          if ((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
            (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
            (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
            (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4'))
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
    const parentMethodscode = {
      handleAddcode: this.handleAddcode,
      handleModalVisiblecode: this.handleModalVisiblecode,
      selectcode: this.selectcode,
      getCpAccessoriesSaleslist,
      handleSearchChangeout: this.handleSearchChangeout,
      dispatch,
    }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      handleSelectRows: this.handleSelectRows,
      selectedRows,
      selectcustomer: this.selectcustomer,
      levellist, levellist2, newdeptlist, dispatch,
      modeluserList
    }
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      CpAccessoriesSalesSearchList,
    }
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }
    const appData = (apps) => {
      if (apps === 0 || apps === '0') {
        return '待分配'
      }
      if (apps === 1 || apps === '1') {
        return '待审核'
      }
      if (apps === 2 || apps === '2') {
        return '驳回'
      }
      if (apps === 3 || apps === '3') {
        return '通过'
      }
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            配件金额变更申请单
      </div>
          {isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <div style={{ textAlign: 'center' }}><span>选择需金额变更申请的配件销售单</span><Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectsh} loading={submitting} disabled={orderflag}>选择</Button></div>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单状态'>
                    <Input disabled value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderStatus) ? ((cpMoneyChangeGet.orderStatus === 0 || cpMoneyChangeGet.orderStatus === '0') ? '未处理' : '已处理') : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='审批进度'>
                    <Input disabled value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) ? appData(cpMoneyChangeGet.approvals) : ''} />
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
                          required: false,
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
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.money) ? getPrice(selectcodedata.money) :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.receivable) ? getPrice(cpMoneyChangeGet.receivable) : ''),
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
                      value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.settleMoney) ? getPrice(cpMoneyChangeGet.settleMoney) : ''}
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
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input

                      disabled
                      value={isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.name) ? selectcodedata.client.name :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) ? cpMoneyChangeGet.client.name : '')}
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
                      initialValue: isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.applyMoney) ? getPrice(cpMoneyChangeGet.applyMoney) : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入申请金额',
                        },
                      ],
                    })(<InputNumber style={{ width: '100%' }} disabled={orderflag} onChange={this.showmoney} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='金额变更比例'>
                    {getFieldDecorator('moneyProportion', {
                      initialValue: isNotBlank(biliNumber) ? biliNumber :
                        (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.moneyProportion) ? cpMoneyChangeGet.moneyProportion : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入金额变更比例',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='变更后金额'>
                    {getFieldDecorator('changeMoney', {
                      initialValue: isNotBlank(changeNumber) ? changeNumber : (
                        isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.changeMoney) ? getPrice(cpMoneyChangeGet.changeMoney) : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入变更后金额',
                        },
                      ],
                    })(
                      <Input

                        disabled
                        value={isNotBlank(changeNumber) ? changeNumber : (
                          isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.changeMoney) ? getPrice(cpMoneyChangeGet.changeMoney) : '')}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请人'>
                    <Input value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && isNotBlank(cpMoneyChangeGet.createBy.name) ? cpMoneyChangeGet.createBy.name : ''} disabled />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请日期'>
                    <Input value={isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createDate) ? moment(cpMoneyChangeGet.createDate) : ''} disabled />
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
                <DragTable
                  columns={columnssh}
                  dataSource={showdata}
                  pagination={false}
                  rowClassName={record => (stylessp.editable ? stylessp.editable : '')}
                />
              )}
              {isNotBlank(showdata) && showdata.length < 5 &&
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  onClick={this.newMember}
                  icon="plus"
                  disabled={!((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
                    (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
                    (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2')) ||
                    (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4') && cpMoneyChangeGet.createBy.id === getStorage('userid')))
                  )}
                >
                  新增审核人
                 </Button>
              }
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
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChange')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <span>
                  <Button
                    type="primary"
                    onClick={this.onsave}
                    loading={submitting}
                    disabled={!((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
                      (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2') && cpMoneyChangeGet.createBy.id === getStorage('userid')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4') && cpMoneyChangeGet.createBy.id === getStorage('userid')))
                    )}
                  >
                    保存
  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8, marginRight: 8 }}
                    htmlType="submit"
                    loading={submitting}
                    disabled={!((JSON.stringify(cpMoneyChangeGet) == "{}") || ((isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.approvals) &&
                      (cpMoneyChangeGet.approvals === 0 || cpMoneyChangeGet.approvals === '0')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 2 || cpMoneyChangeGet.approvals === '2') && cpMoneyChangeGet.createBy.id === getStorage('userid')) ||
                      (isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && (cpMoneyChangeGet.approvals === 4 || cpMoneyChangeGet.approvals === '4') && cpMoneyChangeGet.createBy.id === getStorage('userid')))
                    )}
                  >
                    提交
  </Button>
                  {
                    (cpMoneyChangeGet.orderStatus === 1 || cpMoneyChangeGet.orderStatus === '1') &&
                    <Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpMoneyChangeGet.id)}>
                      撤销
</Button>
                  }
                </span>}
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
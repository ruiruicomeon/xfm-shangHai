import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
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
import stylessp from './style.less';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
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
const CreateFormcode = Form.create()(props => {
  const { handleModalVisiblecode, selectCompleteList, selectcodeflag, selectcode } = props;
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
      width: 150,
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
      align: 'center',
      dataIndex: 'assemblyVehicleEmissions',
      inputType: 'text',
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
      align: 'center',
      dataIndex: 'salesParticular',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '意向单价',
      align: 'center',
      dataIndex: 'intentionPrice',
      inputType: 'text',
      width: 100,
      editable: true,
      render: text => (getPrice(text))
    },
    {
      title: '交货时间',
      align: 'center',
      dataIndex: 'deliveryDate',
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
      width: 150,
      editable: true,
    },
    {
      title: '安装指导',
      dataIndex: 'installationGuide',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '物流要求',
      dataIndex: 'logisticsNeed',
      inputType: 'text',
      align: 'center',
      width: 150,
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
      dataIndex: 'remarks',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    }]
  return (
    <Modal
      title='选择委托单'
      visible={selectcodeflag}
      onCancel={() => handleModalVisiblecode()}
      width='80%'
    >
      <StandardTable
        bordered
        scroll={{ x: 2800 }}
        data={selectCompleteList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, modeluserList, selectkhflag, selectcustomer, selectedRows, handleSelectRows,
    levellist, levellist2, newdeptlist, form, dispatch, that } = props;
  const { getFieldDecorator } = form
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
          'role.id': '6',
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
        'role.id': '6',
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
      'role.id': '6',
      'office.id': getStorage('companyId'),
      ...filters,
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
    form.resetFields();
    that.setState({
      shrsearch: {}
    })
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
@connect(({ cpMoneyChange, loading, cpAfterApplicationFrom, sysuser, cpMoneyChangeAudit, syslevel, sysdept }) => ({
  ...cpMoneyChange,
  ...cpAfterApplicationFrom,
  ...sysuser,
  ...cpMoneyChangeAudit,
  ...syslevel,
  ...sysdept,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpMoneyChangeAudit/cpMoneyChangeAudit_submit'],
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
      showdata: [{ id: 1 }],
      orderflag: false,
      confirmflag: true,
      confirmflag1: true,
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 3 || res.data.approvals === '3') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit')[0].children.filter(item => item.name == '修改')
              .length > 0)
          ) {
            this.setState({ orderflag: false })
          } else {
            this.setState({ orderflag: true })
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'JESH'
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
              type: 'JESH'
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
          if (isNotBlank(res.data) && isNotBlank(res.data.auditUser) && isNotBlank(res.data.auditUser.id)) {
            allUser.push(res.data.auditUser)
          }
          if (allUser.length === 0) {
            this.setState({
              showdata: [{ id: 1 }]
            })
          } else {
            this.setState({
              showdata: allUser
            })
          }
        }
      });
    }
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'apply_type',
      },
      callback: data => {
        this.setState({
          apply_type: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'business_project',
      },
      callback: data => {
        this.setState({
          business_project: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'business_type',
      },
      callback: data => {
        this.setState({
          business_type: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'del_flag',
      },
      callback: data => {
        this.setState({
          del_flag: data
        })
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpMoneyChangeAudit/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpMoneyChangeAuditGet } = this.props;
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
        value.receivable = setPrice(value.receivable)
        value.applyMoney = setPrice(value.applyMoney)
        value.orderDate = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.createDate)) ? selectcodedata.createDate :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.orderDate)) ? cpMoneyChangeAuditGet.orderDate : '')
        value.parent = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) ? selectcodedata.id :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.parent)) ? cpMoneyChangeAuditGet.parent : '')
        value.user = {}
        value.client = {}
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client)) ? cpMoneyChangeAuditGet.client.id : '')
        value.user.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.user)) ? cpMoneyChangeAuditGet.user.id : (getStorage('userid') ? getStorage('userid') : ''))
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        value.totalNumber = newshowdata.length
        const idarr = []
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.auditUser = idarr.join(',')
        value.orderStatus = 1
        value.type = 0
        dispatch({
          type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_submit',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/review/process/cp_money_change_audit_form?id=${location.query.id}`);
            // router.push('/review/process/cp_money_change_audit_list');
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch, form, cpMoneyChangeAuditGet } = this.props;
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
        value.orderDate = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.createDate)) ? selectcodedata.createDate :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.orderDate)) ? cpMoneyChangeAuditGet.orderDate : '')
        value.parent = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)) ? selectcodedata.id :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.parent)) ? cpMoneyChangeAuditGet.parent : '')
        value.client = {}
        value.client = {}
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.client) && isNotBlank(selectcodedata.client.id)) ? selectcodedata.client.id :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client)) ? cpMoneyChangeAuditGet.client.id : '')
        value.client.id = (isNotBlank(selectcodedata) && isNotBlank(selectcodedata.user) && isNotBlank(selectcodedata.user.id)) ? selectcodedata.user.id :
          ((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.user)) ? cpMoneyChangeAuditGet.user.id : (getStorage('userid') ? getStorage('userid') : ''))
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        value.totalNumber = newshowdata.length
        const idarr = []
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.auditUser = idarr.join(',')
        value.orderStatus = 0
        dispatch({
          type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_save',
          payload: { ...value },
          callback: (res) => {
            router.push(`/review/process/cp_money_change_audit_form?id=${res.data.id}`);
          }
        })
      }
    });
  }

  onCancelCancel = () => {
    router.push('/review/process/cp_money_change_audit_list');
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
      type: 'cpAfterApplicationFrom/select_complete_List'
    });
    this.setState({ selectcodeflag: true });
  }

  selectcode = (record) => {
    this.setState({
      selectcodedata: record,
      selectcodeflag: false
    })
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
      type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_isPass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        this.setState({
          modalVisiblepass: false
        })
        dispatch({
          type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if (res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 3 || res.data.approvals === '3') {
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
            if (isNotBlank(res.data) && isNotBlank(res.data.auditUser) && isNotBlank(res.data.auditUser.id)) {
              allUser.push(res.data.auditUser)
            }
            if (allUser.length === 0) {
              this.setState({
                showdata: [{ id: 1 }]
              })
            } else {
              this.setState({
                showdata: allUser
              })
            }
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
        'role.id': '6',
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


  onUndoresubmit = () => {
    Modal.confirm({
      title: '重新提交该金额变更审核单',
      content: '确定重新提交该金额变更审核单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.repost(),
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
        type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_resubmit',
        payload: {
          id: location.query.id
        },
        callback: () => {
          dispatch({
            type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_Get',
            payload: {
              id: location.query.id,
            },
            callback: (res) => {
              if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 3 || res.data.approvals === '3') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit')[0].children.filter(item => item.name == '修改')
                  .length > 0)
              ) {
                this.setState({ orderflag: false })
              } else {
                this.setState({ orderflag: true })
              }
              dispatch({
                type: 'sysarea/getFlatCode',
                payload: {
                  id: location.query.id,
                  type: 'JESH'
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
                  type: 'JESH'
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
              if (isNotBlank(res.data) && isNotBlank(res.data.auditUser) && isNotBlank(res.data.auditUser.id)) {
                allUser.push(res.data.auditUser)
              }
              if (allUser.length === 0) {
                this.setState({
                  showdata: [{ id: 1 }]
                })
              } else {
                this.setState({
                  showdata: allUser
                })
              }
            }
          });
        }
      })
    }
  }



  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该金额变更审核单',
      content: '确定撤销该金额变更审核单吗？',
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
        type: 'cpRevocation/cpMoneyChangeAudit_Revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/review/process/cp_money_change_audit_form?id=${location.query.id}`);
          // router.push('/review/process/cp_money_change_audit_list');
        }
      })
    }
  }

  render() {
    const { fileList, previewVisible, previewImage, selectcodeflag, selectcodedata, modalVisiblepass, showdata, orderflag, selectkhflag,
      selectedRows, srcimg, srcimg1 } = this.state;
    const { submitting1, submitting, cpMoneyChangeAuditGet, selectCompleteList, modeluserList, levellist, levellist2, newdeptlist, dispatch, } = this.props;
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
    const shapp = (apps) => {
      if (apps === '1' || apps === 1) {
        return '待审核'
      }
      if (apps === '2' || apps === 2) {
        return '通过'
      }
      if (apps === '3' || apps === 3) {
        return '驳回'
      }
    }
    const columnssh = [
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => {
          if (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
            (item => item.target == 'cpMoneyChangeAudit').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit')[0]
              .children.filter(item => item.name == '修改').length > 0 && (JSON.stringify(cpMoneyChangeAuditGet) == "{}") || ((
                (cpMoneyChangeAuditGet.approvals === 0 || cpMoneyChangeAuditGet.approvals === '0')) ||
                (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.createBy) && (cpMoneyChangeAuditGet.approvals === 3 || cpMoneyChangeAuditGet.approvals === '3'))
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
          if (isNotBlank(cpMoneyChangeAuditGet) && (cpMoneyChangeAuditGet.approvals !== 0 || cpMoneyChangeAuditGet.approvals !== '0')) {
            return shapp(cpMoneyChangeAuditGet.approvals)
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
          if (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
            (item => item.target == 'cpMoneyChangeAudit').length > 0 && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit')[0]
              .children.filter(item => item.name == '修改').length > 0 && (JSON.stringify(cpMoneyChangeAuditGet) == "{}") || ((
                (cpMoneyChangeAuditGet.approvals === 0 || cpMoneyChangeAuditGet.approvals === '0')) ||
                (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.createBy) && (cpMoneyChangeAuditGet.approvals === 3 || cpMoneyChangeAuditGet.approvals === '3'))
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

    const that = this

    const parentMethodscode = {
      handleAddcode: this.handleAddcode,
      handleModalVisiblecode: this.handleModalVisiblecode,
      selectcode: this.selectcode,
      selectCompleteList,
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
    const appData = (apps) => {
      if (apps === 0 || apps === '0') {
        return '待分配'
      }
      if (apps === 1 || apps === '1') {
        return '待审核'
      }
      if (apps === 2 || apps === '2') {
        return '通过'
      }
      if (apps === 3 || apps === '3') {
        return '驳回'
      }
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            金额变更审核单
      </div>
          {isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '60px', height: '60px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '60px', height: '60px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='审批进度'>
                    <Input disabled value={isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.approvals) ? appData(cpMoneyChangeAuditGet.approvals) : ''} />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.orderCode) ? cpMoneyChangeAuditGet.orderCode : '',
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
                      initialValue: isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.applyType) ? cpMoneyChangeAuditGet.applyType : '',
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
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.orderDate) ? moment(cpMoneyChangeAuditGet.orderDate) : null),
                    })(
                      <DatePicker

                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务项目'>
                    {getFieldDecorator('project', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.project) ? selectcodedata.project :
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.project) ? cpMoneyChangeAuditGet.project : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入业务项目',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务分类'>
                    {getFieldDecorator('businessType', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.businessType) ? selectcodedata.businessType :
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.businessType) ? cpMoneyChangeAuditGet.businessType : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入业务分类',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='应收金额'>
                    {getFieldDecorator('receivable', {
                      initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.money) ? getPrice(selectcodedata.money) :
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.receivable) ? getPrice(cpMoneyChangeAuditGet.receivable) : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入应收金额',
                        },
                      ],
                    })(<Input disabled />)}
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
                      value={(isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.user) ? cpMoneyChangeAuditGet.user.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={(isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.user) ? cpMoneyChangeAuditGet.user.no : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input

                      disabled
                      value={(isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.user) && isNotBlank(cpMoneyChangeAuditGet.user.office) ? cpMoneyChangeAuditGet.user.office.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Select
                      allowClear
                      notFoundContent={null}
                      style={{ width: '100%' }}
                      value={(isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.user) && isNotBlank(cpMoneyChangeAuditGet.user.dictArea) ? cpMoneyChangeAuditGet.user.dictArea : '')}

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
                      value={(isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.user) && isNotBlank(cpMoneyChangeAuditGet.user.dept) ? cpMoneyChangeAuditGet.user.dept.name : '')}
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
                      value={
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client) ? cpMoneyChangeAuditGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}

                      disabled
                      value={
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client) ? cpMoneyChangeAuditGet.client.classify : '')}
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
                      value={
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client) ? cpMoneyChangeAuditGet.client.code : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input

                      disabled
                      value={(isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client) ? cpMoneyChangeAuditGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input

                      disabled
                      value={
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client) ? cpMoneyChangeAuditGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input

                      disabled
                      value={
                        (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.client) ? cpMoneyChangeAuditGet.client.phone : '')}
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
                      initialValue: isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.applyMoney) ? getPrice(cpMoneyChangeAuditGet.applyMoney) : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入申请金额',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='金额变更比例'>
                    {getFieldDecorator('moneyProportion', {
                      initialValue: isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.moneyProportion) ? cpMoneyChangeAuditGet.moneyProportion : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入金额变更比例',
                        },
                      ],
                    })(<Input

                      disabled
                      style={onstyle((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.moneyProportion) ? parseFloat(cpMoneyChangeAuditGet.moneyProportion) : 0))}
                    />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='变更后金额'>
                    {getFieldDecorator('changeMoney', {
                      initialValue: isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.changeMoney) ? getPrice(cpMoneyChangeAuditGet.changeMoney) : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入变更后金额',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请人'>
                    <Input value={isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.createBy) && isNotBlank(cpMoneyChangeAuditGet.createBy.name) ? cpMoneyChangeAuditGet.createBy.name : ''} disabled />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请日期'>
                    <Input value={isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.createDate) ? moment(cpMoneyChangeAuditGet.createDate) : ''} disabled />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="申请理由" className="allinputstyle">
                    {getFieldDecorator('applyReason', {
                      initialValue: isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.applyReason) ? cpMoneyChangeAuditGet.applyReason : '',
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
              {isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.auditUser) && isNotBlank(cpMoneyChangeAuditGet.auditUser.id) && (cpMoneyChangeAuditGet.auditUser.id === getStorage('userid')) && cpMoneyChangeAuditGet.approvals == 1 &&
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <Button type="primary" onClick={() => this.showsp(2)}>
                    审核通过
            </Button>
                  <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => this.showsp(3)}>
                    审核驳回
            </Button>
                </div>
              }
            </Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpMoneyChangeAudit')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <span>
                  <Button
                    type="primary"
                    onClick={this.onsave}
                    loading={submitting1}
                    disabled={!((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.approvals) &&
                      (cpMoneyChangeAuditGet.approvals === 0 || cpMoneyChangeAuditGet.approvals === '0')) ||
                      (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.createBy) && (cpMoneyChangeAuditGet.approvals === 3 || cpMoneyChangeAuditGet.approvals === '3')))
                    }
                  >
                    保存
  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8, marginRight: 8 }}
                    htmlType="submit"
                    loading={submitting1}
                    disabled={!((isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.approvals) &&
                      (cpMoneyChangeAuditGet.approvals === 0 || cpMoneyChangeAuditGet.approvals === '0')) ||
                      (isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.createBy) && (cpMoneyChangeAuditGet.approvals === 3 || cpMoneyChangeAuditGet.approvals === '3')))
                    }
                  >
                    提交
  </Button>
                  {isNotBlank(cpMoneyChangeAuditGet) && isNotBlank(cpMoneyChangeAuditGet.approvals) &&
                    (cpMoneyChangeAuditGet.approvals === 1 || cpMoneyChangeAuditGet.approvals === '1') && isNotBlank(cpMoneyChangeAuditGet.createBy) &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={() => this.onUndoresubmit()}>
                      重新提交
                      </Button>
                  }
                  {
                    (cpMoneyChangeAuditGet.orderStatus === 1 || cpMoneyChangeAuditGet.orderStatus === '1') &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={() => this.onUndo(cpMoneyChangeAuditGet.id)}>
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
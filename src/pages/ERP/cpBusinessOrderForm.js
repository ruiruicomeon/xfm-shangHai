import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  message,
  Icon,
  Upload,
  Modal,
  DatePicker
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import SearchTableList from '@/components/SearchTableList';
import styles from './CpBusinessOrderForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@Form.create()
class SearchFormzc extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAddzc } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearchAddzc(fieldsValue);
    });
  };

  handleSearchVisiblezcin = () => {
    const { form, handleSearchVisiblezc } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisiblezc(fieldsValue);
    });
  };

  render() {
    const {
      searchVisiblezc,
      form: { getFieldDecorator },
      handleSearchVisiblezc,
      cpAssemblyBuildSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisiblezc}
        onCancel={() => this.handleSearchVisiblezcin()}
        afterClose={() => this.handleSearchVisiblezcin()}
        onOk={() => this.okHandle()}
      >
        <div>
          {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={cpAssemblyBuildSearchList} />)}
        </div>
      </Modal>
    );
  }
}
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = {};
      handleAdd(values);
    });
  };
  return (
    <Modal
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remarks', {
          initialValue: '',
        })(<TextArea rows={3} />)}
      </FormItem>
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, handleSearchChangezc, cpAssemblyBuildList, selectkhflag, selectcustomer, form, dispatch, that } = props;
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
      title: '总成型号',
      dataIndex: 'assemblyModel',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '总成品牌',
      dataIndex: 'assemblyBrand',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '车型',
      dataIndex: 'vehicleModel',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '年份',
      dataIndex: 'assemblyYear',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '备注信息',
      dataIndex: 'remarks',
      inputType: 'text',
      width: 100,
      editable: true,
    }
  ];
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
        zcsearch: values
      })

      dispatch({
        type: 'cpAssemblyBuild/cpAssemblyBuild_List',
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
      zcsearch: {}
    })
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        pageSize: 10,
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
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
      ...that.state.zcsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: params,
    });
  };

  const handleModalVisiblekhin = () => {
    // form.resetFields();
    that.setState({
      zcsearch: {}
    })
    handleModalVisiblekh()
  }

  return (
    <Modal
      title='选择总成'
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekhin()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="总成型号">
              {getFieldDecorator('assemblyModel', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="总成品牌">
              {getFieldDecorator('assemblyBrand', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="车型">
              {getFieldDecorator('vehicleModel', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} style={{ textAlign: 'center', marginBottom: '10px' }}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
            </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
              <a style={{ marginLeft: 8 }} onClick={handleSearchChangezc}>
                过滤其他 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpAssemblyBuildList}
        columns={columnskh}
      />
    </Modal>
  );
});
@connect(({ cpBusinessOrder, loading, upload, cpAssemblyForm, cpAssemblyBuild }) => ({
  ...cpBusinessOrder,
  ...upload,
  ...cpAssemblyForm,
  ...cpAssemblyBuild,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpBusinessOrder/cpBusinessOrder_Add'],
  submitting2: loading.effects['cpupdata/cpAssemblyForm_update']
}))
@Form.create()
class CpBusinessOrderForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      fileList: [],
      orderflag: false,
      selectkhflag: false,
      sumbitflag: false,
      selectkhdata: {},
      selectyear: 0,
      selectmonth: 0,
      updataflag: true,
      cpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
      { name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
      { name: 'Y' }, { name: 'Z' }],
      incpzim: [],
      updataname: '取消锁定',
      confirmflag: true,
      isOrderType: '',
      isAssemblyEnterType: '',
      location: getLocation(),
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const { location, cpzim } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpBusinessOrder/cpBusinessOrder_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessOrder').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessOrder')[0].children.filter(item => item.name == '修改')
                .length == 0)) {
            this.setState({ orderflag: true })
          } else {
            this.setState({ orderflag: false })
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
          if (isNotBlank(res.data.qualityTime)) {
            this.props.form.setFieldsValue({
              zbtime: res.data.qualityTime
            });
            this.setState({
              selectyear: res.data.qualityTime.split(',')[0],
              selectmonth: res.data.qualityTime.split(',')[1]
            })
          }

          if (isNotBlank(res.data.orderType)) {
            this.setState({
              isOrderType: res.data.orderType
            })
          }

          if (isNotBlank(res.data.assemblyEnterType)) {
            this.setState({
              isAssemblyEnterType: res.data.assemblyEnterType
            })
          }


          if (isNotBlank(res.data.plateNumber)) {
            const newselwenz = res.data.plateNumber.slice(0, 1)
            this.setState({
              selwenz: res.data.plateNumber.slice(0, 1),
              selzim: res.data.plateNumber.slice(1, 2),
              selinputcp: res.data.plateNumber.slice(2),
            })
            if (isNotBlank(newselwenz)) {
              if (newselwenz == '京') {
                this.setState({
                  incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
                  { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'O' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'Y' }]
                })
              }
              else if (newselwenz == '藏' || newselwenz == '台') {
                this.setState({
                  incpzim: cpzim.slice(0, 7)
                })
              } else if (newselwenz == '川' || newselwenz == '粤') {
                this.setState({
                  incpzim: cpzim
                })
              } else if (newselwenz == '鄂' || newselwenz == '皖' || newselwenz == '云') {
                this.setState({
                  incpzim: cpzim.slice(0, 17)
                })
              } else if (newselwenz == '甘' || newselwenz == '辽') {
                this.setState({
                  incpzim: cpzim.slice(0, 14)
                })
              } else if (newselwenz == '贵' || newselwenz == '吉') {
                this.setState({
                  incpzim: cpzim.slice(0, 9)
                })
              } else if (newselwenz == '黑' || newselwenz == '桂' || newselwenz == '新') {
                this.setState({
                  incpzim: cpzim.slice(0, 16)
                })
              }
              else if (newselwenz == '冀') {
                this.setState({
                  incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
                  { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'R' }, { name: 'T' }
                  ]
                })
              } else if (newselwenz == '晋' || newselwenz == '蒙' || newselwenz == '赣') {
                this.setState({
                  incpzim: cpzim.slice(0, 12)
                })
              } else if (newselwenz == '鲁') {
                this.setState({
                  incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
                  { name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'Y' }]
                })
              } else if (newselwenz == '陕') {
                this.setState({
                  incpzim: cpzim.slice(0, 20)
                })
              } else if (newselwenz == '闽') {
                this.setState({
                  incpzim: cpzim.slice(0, 10)
                })
              } else if (newselwenz == '宁' || newselwenz == '琼') {
                this.setState({
                  incpzim: cpzim.slice(0, 5)
                })
              } else if (newselwenz == '青' || newselwenz == '渝') {
                this.setState({
                  incpzim: cpzim.slice(0, 8)
                })
              } else if (newselwenz == '湘' || newselwenz == '豫') {
                this.setState({
                  incpzim: cpzim.slice(0, 18)
                })
              }
              else if (newselwenz == '苏') {
                this.setState({
                  incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
                  { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'U' }
                  ]
                })
              } else if (newselwenz == '浙') {
                this.setState({
                  incpzim: cpzim.slice(0, 11)
                })
              } else if (newselwenz == '港' || newselwenz == '澳') {
                this.setState({
                  incpzim: cpzim.slice(0, 1)
                })
              } else if (newselwenz == '沪') {
                this.setState({
                  incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
                  { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'Q' }, { name: 'R' }, { name: 'Z' }
                  ]
                })
              } else if (newselwenz == '津') {
                this.setState({
                  incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'I' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
                  { name: 'M' }, { name: 'N' }, { name: 'O' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
                  { name: 'Y' }, { name: 'Z' }]
                })
              }
            } else {
              this.setState({
                incpzim: []
              })
            }
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'YWW'
            },
            callback: (res) => {
              this.setState({
                srcimg: res
              })
            }
          })
          dispatch({
            type: 'sysarea/getFlatOrderdCode',
            payload: {
              id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
              type: 'YWW'
            },
            callback: (res) => {
              this.setState({
                srcimg1: res
              })
            }
          })
        }
      });
    }

    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        pageSize: 10,
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
        const area = []
        const logisticsNeed = []
        data.forEach((item) => {
          if (item.type == 'wy') {
            logisticsNeed.push(item)
          }
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
          area, logisticsNeed
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpBusinessOrder/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpBusinessOrderGet } = this.props;
    const { addfileList, location, selectyear, selectmonth, selectkhdata, updataflag, selwenz, selzim, selinputcp } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        this.setState({
          sumbitflag: true
        })
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.photo = addfileList.join('|')
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.collectCodeid = isNotBlank(cpBusinessOrderGet.collectCodeid) ? cpBusinessOrderGet.collectCodeid : ''
        value.plateNumber = (isNotBlank(selwenz) ? selwenz : '') + (isNotBlank(selzim) ? selzim : '') + (isNotBlank(selinputcp) ? selinputcp : '')
        value.collectClientId = {}
        value.collectClientId.id = isNotBlank(cpBusinessOrderGet.collectClientId) && isNotBlank(cpBusinessOrderGet.collectClientId.id) ? cpBusinessOrderGet.collectClientId.id : ''
        value.qualityTime = `${selectyear} , ${selectmonth}`
        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)) ? cpBusinessOrderGet.client.id : ''
        value.user.id = (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user)) ? cpBusinessOrderGet.user.id : ''
        value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
        value.orderStatus = 1
        value.intentionPrice = setPrice(value.intentionPrice)
        value.cpAssemblyBuild = {}
        value.cpAssemblyBuild.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id :
          (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? cpBusinessOrderGet.cpAssemblyBuild.id : '')
        if (updataflag) {
          dispatch({
            type: 'cpBusinessOrder/cpBusinessOrder_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_business_order_form?id=${location.query.id}`);
              // router.push('/business/process/cp_business_order_list');
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpAssemblyForm_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_business_order_form?id=${location.query.id}`);
              // router.push('/business/process/cp_business_order_list');
            }
          })
        }
      }
    });
  };

  onRevocation = (record) => {
    Modal.confirm({
      title: '撤销该业务委托单',
      content: '确定撤销该业务委托单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.onUndo(record),
    });
  }

  onUndo = (id) => {
    const { dispatch, cpBusinessOrderGet } = this.props;
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
      if (isNotBlank(id)) {
        dispatch({
          type: 'cpBusinessOrder/cpBusinessOrder_Revocation',
          payload: { id: cpBusinessOrderGet.id },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_business_order_form?id=${location.query.id}`);
            // router.push('/business/process/cp_business_order_list');
          }
        })
      }
    }
  }

  onsave = (e) => {
    const { dispatch, form, cpBusinessOrderGet } = this.props;
    const { addfileList, location, selectyear, selectmonth, selectkhdata, updataflag, selwenz, selzim, selinputcp } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.photo = addfileList.join('|')
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.collectCodeid = isNotBlank(cpBusinessOrderGet.collectCodeid) ? cpBusinessOrderGet.collectCodeid : ''
        value.collectClientId = {}
        value.collectClientId.id = isNotBlank(cpBusinessOrderGet.collectClientId) && isNotBlank(cpBusinessOrderGet.collectClientId.id) ? cpBusinessOrderGet.collectClientId.id : ''
        value.plateNumber = (isNotBlank(selwenz) ? selwenz : '') + (isNotBlank(selzim) ? selzim : '') + (isNotBlank(selinputcp) ? selinputcp : '')
        value.qualityTime = `${selectyear} , ${selectmonth}`
        value.client = {}
        value.user = {}
        value.client.id = isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) ? cpBusinessOrderGet.client.id : ''
        value.user.id = isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) ? cpBusinessOrderGet.user.id : ''
        value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
        value.intentionPrice = setPrice(value.intentionPrice)
        value.cpAssemblyBuild = {}
        value.cpAssemblyBuild.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id :
          (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? cpBusinessOrderGet.cpAssemblyBuild.id : '')
        if (updataflag) {
          value.orderStatus = 0
          dispatch({
            type: 'cpBusinessOrder/cpBusinessOrder_Add',
            payload: { ...value },
          })
        } else {
          dispatch({
            type: 'cpupdata/cpAssemblyForm_update',
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

  onCancelCancel = () => {
    router.push('/business/process/cp_business_order_list');
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
    const { dispatch } = this.props
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
          name: 'businessIntention'
        },
        callback: (res) => {
          console.log(666)
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

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  onselectkh = () => {
    const { dispatch } = this.props
    this.setState({
      selectkhflag: true
    })
  }

  selectcustomer = (record) => {
    this.setState({
      selectkhdata: record,
      selectkhflag: false
    })
  }

  oneditsm = () => {
    this.setState({
      modalVisible: true
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
  };

  editYear = (val) => {
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
  }

  editMonth = (val) => {
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
  }

  handleSearchVisiblezc = (fieldsValue) => {
    this.setState({
      searchVisiblezc: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  handleSearchChangezc = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
    });
    this.setState({
      searchVisiblezc: true,
    });
  }

  handleSearchAddzc = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        ...this.state.zcsearch,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      }
    })
    this.setState({
      searchVisiblezc: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
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
      router.push(`/business/process/cp_business_order_form?id=${location.query.id}`);
    }
  }

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/TaskBusinessDelegate?id=${location.query.id}`
  }

  showinputcp = (e) => {
    const { selwenz, selzim } = this.state
    if (isNotBlank(e.target.value)) {
      this.setState({
        selinputcp: e.target.value
      })
    } else {
      this.setState({
        selinputcp: ''
      })
    }
  }

  showcpzim = (e) => {
    if (isNotBlank(e)) {
      this.setState({
        selzim: e
      })
    } else {
      this.setState({
        selzim: ''
      })
    }
  }

  showcpwenz = (e) => {
    const { cpzim } = this.state
    if (isNotBlank(e)) {
      this.setState({
        selwenz: e
      })
      if (e == '京') {
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
          { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'O' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'Y' }]
        })
      }
      else if (e == '藏' || e == '台') {
        this.setState({
          incpzim: cpzim.slice(0, 7)
        })
      } else if (e == '川' || e == '粤') {
        this.setState({
          incpzim: cpzim
        })
      } else if (e == '鄂' || e == '皖' || e == '云') {
        this.setState({
          incpzim: cpzim.slice(0, 17)
        })
      } else if (e == '甘' || e == '辽') {
        this.setState({
          incpzim: cpzim.slice(0, 14)
        })
      } else if (e == '贵' || e == '吉') {
        this.setState({
          incpzim: cpzim.slice(0, 9)
        })
      } else if (e == '黑' || e == '桂'  || e == '新') {
        this.setState({
          incpzim: cpzim.slice(0, 16)
        })
      }
      else if (e == '冀') {
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
          { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'R' }, { name: 'T' }
          ]
        })
      } else if (e == '晋' || e == '蒙' || e == '赣') {
        this.setState({
          incpzim: cpzim.slice(0, 12)
        })
      } else if (e == '鲁') {
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
          { name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'Y' }]
        })
      } else if (e == '陕') {
        this.setState({
          incpzim: cpzim.slice(0, 20)
        })
      } else if (e == '闽') {
        this.setState({
          incpzim: cpzim.slice(0, 10)
        })
      } else if (e == '宁' || e == '琼') {
        this.setState({
          incpzim: cpzim.slice(0, 5)
        })
      } else if (e == '青' || e == '渝') {
        this.setState({
          incpzim: cpzim.slice(0, 8)
        })
      } else if (e == '湘' || e == '豫') {
        this.setState({
          incpzim: cpzim.slice(0, 18)
        })
      }
      else if (e == '苏') {
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
          { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'U' }
          ]
        })
      } else if (e == '浙') {
        this.setState({
          incpzim: cpzim.slice(0, 11)
        })
      } else if (e == '港' || e == '澳') {
        this.setState({
          incpzim: cpzim.slice(0, 1)
        })
      } else if (e == '沪') {
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' },
          { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'Q' }, { name: 'R' }, { name: 'Z' }
          ]
        })
      } else if (e == '津') {
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'I' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
          { name: 'M' }, { name: 'N' }, { name: 'O' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
          { name: 'Y' }, { name: 'Z' }]
        })
      }
    } else {
      this.setState({
        incpzim: []
      })
    }
  }

  render() {
    const { fileList, previewVisible, previewImage, orderflag, selectkhflag, selectkhdata, modalVisible, sumbitflag,
      searchVisiblezc, updataflag, updataname, srcimg, srcimg1, selwenz, selinputcp, selzim, incpzim, isOrderType, isAssemblyEnterType } = this.state;
    const { submitting2, submitting1, submitting, cpBusinessOrderGet, cpAssemblyBuildList, cpAssemblyBuildSearchList, dispatch } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const cphdata = [{ id: 1, name: '京' }, { id: 2, name: '津' }, { id: 3, name: '沪' }, { id: 4, name: '渝' }, { id: 5, name: '冀' },
    { id: 6, name: '豫' }, { id: 7, name: '云' }, { id: 8, name: '辽' }, { id: 9, name: '黑' }, { id: 10, name: '湘' }, { id: 11, name: '皖' },
    { id: 12, name: '鲁' }, { id: 13, name: '新' }, { id: 14, name: '苏' }, { id: 15, name: '浙' }, { id: 16, name: '赣' }, { id: 17, name: '鄂' }, { id: 18, name: '桂' },
    { id: 19, name: '甘' }, { id: 20, name: '晋' }, { id: 21, name: '蒙' }, { id: 22, name: '陕' }, { id: 23, name: '吉' }, { id: 24, name: '闽' }, { id: 25, name: '贵' },
    { id: 26, name: '粤' }, { id: 27, name: '青' }, { id: 28, name: '藏' }, { id: 29, name: '川' }, { id: 30, name: '宁' }, { id: 31, name: '琼' }, { id: 32, name: '港' },
    { id: 33, name: '澳' }, { id: 33, name: '台' }]
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

    const that = this

    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      cpAssemblyBuildList,
      dispatch,
      handleSearchChangezc: this.handleSearchChangezc,
      that
    }
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      that
    };
    const parentSearchMethodszc = {
      handleSearchVisiblezc: this.handleSearchVisiblezc,
      handleSearchAddzc: this.handleSearchAddzc,
      cpAssemblyBuildSearchList,
      that
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ position: 'relative' }}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            业务委托单
      </div>
          {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单状态'>
                    <Input
                      disabled
                      value={isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderStatus) ? (
                        cpBusinessOrderGet.orderStatus === 0 || cpBusinessOrderGet.orderStatus === '0' ? '未处理' : (
                          cpBusinessOrderGet.orderStatus === 1 || cpBusinessOrderGet.orderStatus === '1' ? '已处理' :
                            cpBusinessOrderGet.orderStatus === 2 || cpBusinessOrderGet.orderStatus === '2' ? '关闭' : '')) : ''}
                      style={cpBusinessOrderGet.orderStatus === 0 || cpBusinessOrderGet.orderStatus === '0' ? { color: '#f50' } : (
                        cpBusinessOrderGet.orderStatus === 1 || cpBusinessOrderGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
                      )}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='意向单号'>
                    {getFieldDecorator('intentionId', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.intentionId) ? cpBusinessOrderGet.intentionId : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入意向单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderCode) ? cpBusinessOrderGet.orderCode : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入订单编号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单分类'>
                    {getFieldDecorator('orderType', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderType) ? cpBusinessOrderGet.orderType : '',
                      rules: [
                        {
                          required: true,
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
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.project) ? cpBusinessOrderGet.project : '',
                      rules: [
                        {
                          required: true,
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
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.dicth) ? cpBusinessOrderGet.dicth : '',
                      rules: [
                        {
                          required: true,
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
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.businessType) ? cpBusinessOrderGet.businessType : '',
                      rules: [
                        {
                          required: true,
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
                    {getFieldDecorator('settlementType', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.settlementType) ? cpBusinessOrderGet.settlementType : '',
                      rules: [
                        {
                          required: true,
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
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.insuranceCompanyId) ? cpBusinessOrderGet.insuranceCompanyId : '',
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
                    {getFieldDecorator('collectClientId', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.collectClientId) && isNotBlank(cpBusinessOrderGet.collectClientId.name) ? cpBusinessOrderGet.collectClientId.name : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入集采客户',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='集采编码'>
                    {getFieldDecorator('collectCode', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.collectCode) ? cpBusinessOrderGet.collectCode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入集采编码',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='品牌'>
                    {getFieldDecorator('brand', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.brand) ? cpBusinessOrderGet.brand : '',
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
              </Row>
            </Card>
            <Card title="业务员信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务员'>
                    <Input

                      disabled
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) ? cpBusinessOrderGet.user.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) ? cpBusinessOrderGet.user.no : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input

                      disabled
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.office) ? cpBusinessOrderGet.user.office.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Select
                      allowClear
                      notFoundContent={null}
                      style={{ width: '100%' }}
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.dictArea) ? cpBusinessOrderGet.user.dictArea : '')}

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
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.dept) ? cpBusinessOrderGet.user.dept.name : '')}
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
                      value={isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) && isNotBlank(cpBusinessOrderGet.client.clientCpmpany) ? cpBusinessOrderGet.client.clientCpmpany : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input disabled value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) ? cpBusinessOrderGet.client.name : '')} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}

                      disabled
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) ? cpBusinessOrderGet.client.classify : '')}
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
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) ? cpBusinessOrderGet.client.code : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input

                      disabled
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) ? cpBusinessOrderGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input

                      disabled
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) ? cpBusinessOrderGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input

                      disabled
                      value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) ? cpBusinessOrderGet.client.phone : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="总成信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成型号'>
                    {getFieldDecorator('assemblyModel', {
                      initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyModel) ? selectkhdata.assemblyModel : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyModel) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyModel : '') :
                        isNotBlank(cpBusinessOrderGet.assemblyModel) ? cpBusinessOrderGet.assemblyModel : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        style={{ width: '50%' }}
                        value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyModel) ? selectkhdata.assemblyModel : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyModel) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyModel : '') :
                          isNotBlank(cpBusinessOrderGet.assemblyModel) ? cpBusinessOrderGet.assemblyModel : '')}

                        disabled
                      />
                    )}
                    <Button type="primary" style={{ marginLeft: '8px' }} disabled={orderflag} onClick={this.onselectkh} loading={submitting}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成号'>
                    {getFieldDecorator('assemblyCode', {
                      initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyCode) ? selectkhdata.assemblyBassemblyCoderand
                        : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ?
                          (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyCode) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyCode : '') :
                          isNotBlank(cpBusinessOrderGet.assemblyCode) ? cpBusinessOrderGet.assemblyCode : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyCode) ? selectkhdata.assemblyCode
                          : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ?
                            (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyCode) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyCode : '') :
                            isNotBlank(cpBusinessOrderGet.assemblyCode) ? cpBusinessOrderGet.assemblyCode : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成品牌'>
                    {getFieldDecorator('assemblyBrand', {
                      initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyBrand) ? selectkhdata.assemblyBrand
                        : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ?
                          (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand : '') :
                          isNotBlank(cpBusinessOrderGet.assemblyBrand) ? cpBusinessOrderGet.assemblyBrand : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyBrand) ? selectkhdata.assemblyBrand
                          : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ?
                            (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand : '') :
                            isNotBlank(cpBusinessOrderGet.assemblyBrand) ? cpBusinessOrderGet.assemblyBrand : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车型/排量'>
                    {getFieldDecorator('assemblyVehicleEmissions', {
                      initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? isNotBlank(selectkhdata.assemblyVehicleEmissions) ? selectkhdata.assemblyVehicleEmissions : ''
                        : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ?
                          (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.vehicleModel) ? cpBusinessOrderGet.cpAssemblyBuild.vehicleModel : '') :
                          isNotBlank(cpBusinessOrderGet.assemblyVehicleEmissions) ? cpBusinessOrderGet.assemblyVehicleEmissions : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? isNotBlank(selectkhdata.assemblyVehicleEmissions) ? selectkhdata.assemblyVehicleEmissions : ''
                          : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ?
                            (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.vehicleModel) ? cpBusinessOrderGet.cpAssemblyBuild.vehicleModel : '') :
                            isNotBlank(cpBusinessOrderGet.assemblyVehicleEmissions) ? cpBusinessOrderGet.assemblyVehicleEmissions : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='年份'>
                    {getFieldDecorator('assemblyYear', {
                      initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyYear) ? selectkhdata.assemblyYear
                        : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyYear) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyYear : '') :
                          isNotBlank(cpBusinessOrderGet.assemblyYear) ? cpBusinessOrderGet.assemblyYear : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.assemblyYear) ? selectkhdata.assemblyYear
                          : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? (isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyYear) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyYear : '') :
                            isNotBlank(cpBusinessOrderGet.assemblyYear) ? cpBusinessOrderGet.assemblyYear : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='进场类型'>
                    {getFieldDecorator('assemblyEnterType', {
                      initialValue: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyEnterType) ? cpBusinessOrderGet.assemblyEnterType : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入进场类型',
                        },
                      ],
                    })(<Select
                      allowClear
                      disabled
                      style={{ width: '100%' }}
                    >
                      {
                        isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='钢印号'>
                    {getFieldDecorator('assemblySteelSeal', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblySteelSeal) ? cpBusinessOrderGet.assemblySteelSeal : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入钢印号',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='VIN码'>
                    {getFieldDecorator('assemblyVin', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyVin) ? cpBusinessOrderGet.assemblyVin : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入17位的VIN码',
                          max: 17,
                          min: 17
                        },
                      ],
                    })(<Input placeholder='请输入17位VIN码' disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='其他识别信息'>
                    {getFieldDecorator('assemblyMessage', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyMessage) ? cpBusinessOrderGet.assemblyMessage : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入其他识别信息',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='故障代码'>
                    {getFieldDecorator('assemblyFaultCode', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyFaultCode) ? cpBusinessOrderGet.assemblyFaultCode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入故障代码',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='本次故障描述' className="allinputstyle">
                    {getFieldDecorator('assemblyErrorDescription', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyErrorDescription) ? cpBusinessOrderGet.assemblyErrorDescription : '',
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
                  <FormItem {...formItemLayout} label="相片上传" className="allimgstyle">
                    {getFieldDecorator('photo', {
                      initialValue: ''
                    })(
                      <Upload
                        accept="image/*"
                        onChange={this.handleUploadChange}
                        onRemove={this.handleRemove}
                        beforeUpload={this.handlebeforeUpload}
                        fileList={fileList}
                        listType="picture-card"
                        onPreview={this.handlePreview}
                        disabled={orderflag}
                      >
                        {isNotBlank(fileList) && fileList.length >= 9 || (orderflag) ? null : uploadButton}
                      </Upload>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="配件信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='销售明细' className="allinputstyle">
                    {getFieldDecorator('salesParticular', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.salesParticular) ? cpBusinessOrderGet.salesParticular : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入销售明细',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="一级信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='意向单价'>
                    {getFieldDecorator('intentionPrice', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.intentionPrice) ? getPrice(cpBusinessOrderGet.intentionPrice) : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入意向单价',
                        },
                      ],
                    })(<InputNumber
                      disabled={orderflag}
                      style={{ width: '100%' }}
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                      precision={2}
                      max={100000000}
                      min={0}
                    />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="交货时间">
                    {getFieldDecorator('deliveryDate', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.deliveryDate) ? moment(cpBusinessOrderGet.deliveryDate) : null,
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
                    )
                    }
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='付款方式'>
                    {getFieldDecorator('paymentMethod', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.paymentMethod) ? cpBusinessOrderGet.paymentMethod : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择付款方式',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        disabled={orderflag && updataflag}
                      >
                        {
                          isNotBlank(this.state.payment_methodd) && this.state.payment_methodd.length > 0 && this.state.payment_methodd.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='旧件需求'>
                    {getFieldDecorator('oldNeed', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.oldNeed) ? cpBusinessOrderGet.oldNeed : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择旧件需求',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled={orderflag && updataflag}
                      >
                        {
                          isNotBlank(this.state.old_need) && this.state.old_need.length > 0 && this.state.old_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开票需求'>
                    {getFieldDecorator('makeNeed', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.makeNeed) ? cpBusinessOrderGet.makeNeed : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入开票需求',
                        },
                      ],
                    })(<Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled={orderflag && updataflag}
                    >
                      {
                        isNotBlank(this.state.make_need) && this.state.make_need.length > 0 && this.state.make_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='质保时间'>
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
                      <span>
                        <Select
                          allowClear
                          style={{ width: '50%' }}
                          disabled={orderflag}
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
                          disabled={orderflag}
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
                  <FormItem {...formItemLayout} label='质量要求'>
                    {getFieldDecorator('qualityNeed', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.qualityNeed) ? cpBusinessOrderGet.qualityNeed : '',
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
                        {
                          isNotBlank(this.state.quality_need) && this.state.quality_need.length > 0 && this.state.quality_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='油品要求'>
                    {getFieldDecorator('oilsNeed', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.oilsNeed) ? cpBusinessOrderGet.oilsNeed : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择油品要求',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled={orderflag && updataflag}
                      >
                        {
                          isNotBlank(this.state.oils_need) && this.state.oils_need.length > 0 && this.state.oils_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='外观要求'>
                    {getFieldDecorator('guiseNeed', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.guiseNeed) ? cpBusinessOrderGet.guiseNeed : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择外观要求',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled={orderflag && updataflag}
                      >
                        {
                          isNotBlank(this.state.guise_need) && this.state.guise_need.length > 0 && this.state.guise_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='安装指导'>
                    {getFieldDecorator('installationGuide', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.installationGuide) ? cpBusinessOrderGet.installationGuide : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择安装指导',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled={orderflag && updataflag}
                      >
                        {
                          isNotBlank(this.state.installation_guide) && this.state.installation_guide.length > 0 && this.state.installation_guide.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='物流要求'>
                    {getFieldDecorator('logisticsNeed', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.logisticsNeed) ? cpBusinessOrderGet.logisticsNeed : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入物流要求',
                        },
                      ],
                    })(<Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled={orderflag && updataflag}
                    >
                      {
                        isNotBlank(this.state.logisticsNeed) && this.state.logisticsNeed.length > 0 && this.state.logisticsNeed.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='其他约定事项' className="allinputstyle">
                    {getFieldDecorator('otherBuiness', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.otherBuiness) ? cpBusinessOrderGet.otherBuiness : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入其他约定事项',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="其他信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.businessType) && isNotBlank(cpBusinessOrderGet.assemblyEnterType) &&
                  cpBusinessOrderGet.businessType == 1 && cpBusinessOrderGet.assemblyEnterType == 1 &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='继续施工'>
                      {getFieldDecorator('isGo', {
                        initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.isGo) ? cpBusinessOrderGet.isGo : '1',
                        rules: [
                          {
                            required: true,
                            message: '请选择继续施工',
                          },
                        ],
                      })(
                        <Select
                          allowClear
                          style={{ width: '100%' }}

                          disabled={orderflag}
                        >
                          <Option key='否' value='0'>否</Option>
                          <Option key='是' value='1'>是</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                }
                {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.type) && cpBusinessOrderGet.type == 3 &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='附件'>
                      {getFieldDecorator('isAccessory', {
                        initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.isAccessory) ? cpBusinessOrderGet.isAccessory : '1',
                        rules: [
                          {
                            required: true,
                            message: '请选择附件',
                          },
                        ],
                      })(
                        <Select
                          allowClear
                          style={{ width: '100%' }}

                          disabled={orderflag}
                        >
                          <Option key='否' value='1'>否</Option>
                          <Option key='是' value='0'>是</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                }
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='维修项目'>
                    {getFieldDecorator('maintenanceProject', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.maintenanceProject) ? cpBusinessOrderGet.maintenanceProject : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择维修项目',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled={orderflag}
                      >
                        {
                          isNotBlank(this.state.maintenance_project) && this.state.maintenance_project.length > 0 && this.state.maintenance_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='行程里程'>
                    {getFieldDecorator('tripMileage', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.tripMileage) ? cpBusinessOrderGet.tripMileage : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入行程里程',
                        },
                      ],
                    })(<InputNumber disabled={orderflag && updataflag} precision={2} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='车牌号' className="allinputstyle">
                    <Select
                      allowClear
                      disabled={orderflag && updataflag}
                      onChange={this.showcpwenz}
                      style={{ width: '30%' }}
                      value={selwenz}
                    >
                      {
                        isNotBlank(cphdata) && cphdata.length > 0 && cphdata.map(d => <Option key={d.id} value={d.name}>{d.name}</Option>)
                      }
                    </Select>
                    <Select
                      allowClear
                      disabled={orderflag && updataflag}
                      onChange={this.showcpzim}
                      style={{ width: '30%' }}
                      value={selzim}
                    >
                      {
                        isNotBlank(incpzim) && incpzim.length > 0 && incpzim.map(d => <Option key={d.name} value={d.name}>{d.name}</Option>)
                      }
                    </Select>
                    <Input
                      placeholder='请输入5位车牌号'
                      onChange={this.showinputcp}
                      disabled={orderflag && updataflag}
                      style={{ width: '40%' }}
                      value={selinputcp}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='是否拍照'>
                    {getFieldDecorator('isPhotograph', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.isPhotograph) ? cpBusinessOrderGet.isPhotograph : '4',
                      rules: [
                        {
                          required: false,
                          message: '请选择是否拍照',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}

                        disabled={orderflag && updataflag}
                      >
                        {
                          isNotBlank(this.state.is_photograph) && this.state.is_photograph.length > 0 && this.state.is_photograph.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='定损员'>
                    {getFieldDecorator('partFee', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.partFee) ? cpBusinessOrderGet.partFee : '',
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
                  <FormItem {...formItemLayout} label='事故单号'>
                    {getFieldDecorator('accidentNumber', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.accidentNumber) ? cpBusinessOrderGet.accidentNumber : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入事故单号',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='发货地址' className="allinputstyle">
                    {getFieldDecorator('shipAddress', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.shipAddress) ? cpBusinessOrderGet.shipAddress : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入发货地址',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='维修历史' className="allinputstyle">
                    {getFieldDecorator('maintenanceHistory', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.maintenanceHistory) ? cpBusinessOrderGet.maintenanceHistory : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入维修历史',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='事故说明' className="allinputstyle">
                    {getFieldDecorator('accidentExplain', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.accidentExplain) ? cpBusinessOrderGet.accidentExplain : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入事故说明',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.remarks) ? cpBusinessOrderGet.remarks : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入备注信息',
                        },
                      ],
                    })(
                      <TextArea disabled={orderflag && updataflag} style={{ minHeight: 32 }} rows={2} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                打印
          </Button>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessOrder').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessOrder')[0].children.filter(item => item.name == '二次修改')
                  .length > 0 &&
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                  {updataname}
                </Button>
              }
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessOrder').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBusinessOrder')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <span>
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
                    保存
  </Button>
                  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1 || submitting2} disabled={updataflag && orderflag}>
                    提交
  </Button>
                  {
                    isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderStatus) && (cpBusinessOrderGet.orderStatus === 1 || cpBusinessOrderGet.orderStatus === '1') ?
                      <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpBusinessOrderGet.id)} loading={submitting1 || submitting2}>
                        撤销
  </Button> : null
                  }
                </span>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
          </Button>
            </FormItem>
          </Form>
        </Card>
        <SearchFormzc {...parentSearchMethodszc} searchVisiblezc={searchVisiblezc} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpBusinessOrderForm;
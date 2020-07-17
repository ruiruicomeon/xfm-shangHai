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
  Row,
  Col,
  DatePicker,
  Table,
  Modal,
  TreeSelect,
  Cascader, Divider, Popconfirm
} from 'antd';
import router from 'umi/router';
import Moment from 'moment';
import { isNotBlank, getLocation, getFullUrl, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ReleaseOrderForm.less';
import StandardTable from '@/components/StandardTable';
import DragTable from '../../components/StandardEditTable/dragTable'
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
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

const CreateFormkh = Form.create()(props => {
  const { form, dispatch, handleModalVisiblekh, modeluserList, selectkhflag, selectcustomer, handleSelectRows, levellist, levellist2, newdeptlist, that } = props;

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

  const handleSearch = e => {
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
          'role.id': 3,
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
      ...that.state.shrsearch,
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
@connect(({ releaseOrder, loading, sysuser, sysdept, syslevel }) => {

  return {
    ...releaseOrder,
    ...sysuser,
    ...syslevel,
    ...sysdept,
    newdeptlist: sysdept.deptlist.list,
    submitting: loading.effects['form/submitRegularForm'],
    submitting1: loading.effects['releaseOrder/releaseOrder_Update'],
    submitting2: loading.effects['cpupdata/cpDischargedForm_updata'],
  }

})
@Form.create()
class ReleaseOrderForm extends PureComponent {
  index = 0

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      location: getLocation(),
      orderflag: false,
      updataflag: true,
      modalVisibleMore: false,
      modalVisiblepass: false,
      indexstatus: '',
      updataname: '取消锁定',
      confirmflag: true,
      confirmflag1: true,
      isNotUpdata: false,
      shrsearch: {}
    }
  }

  componentDidMount() {
    const { location } = this.state;
    const { dispatch } = this.props;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'releaseOrder/releaseOrder_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
              .length > 0)) {
            this.setState({ orderflag: false })
          } else {
            this.setState({ orderflag: true })
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'FXD'
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
              type: 'FXD'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
            }
          })
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

    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': 3,
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
      payload: {
        type: 'del_flag',
      },
      callback: data => {
        this.setState({
          del_flag: data
        })
      }
    });

    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'wy',
      },
      callback: data => {
        this.setState({
          logisticsNeed: data
        })
      }
    });

    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'approach_type',
      },
      callback: data => {
        this.setState({
          approachType: data
        })
      }
    });

  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'releaseOrder/clear',
    });
  }

  handleSubmit = () => {
    const { dispatch, form } = this.props;
    const { location, addfileList, updataflag, showdata } = this.state;
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
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')

        value.freight = setPrice(value.freight)
        if (updataflag) {
          dispatch({
            type: 'releaseOrder/releaseOrder_Update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
                isNotUpdata: true
              });
              // router.push('/business/process/release_order_list');
              router.push(`/business/process/release_order_form?id=${location.query.id}`);
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpDischargedForm_updata',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              // router.push('/business/process/release_order_list');
              router.push(`/business/process/release_order_form?id=${location.query.id}`);
            }
          })
        }
      }
    });
  };

  onupdata = () => {
    const { location, updataflag } = this.state
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定'
      })
    } else {
      router.push(`/business/process/release_order_form?id=${location.query.id}`);
    }

  }

  onsave = e => {
    const { location, addfileList, updataflag, showdata } = this.state;
    const { dispatch, form } = this.props;

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

        value.freight = setPrice(value.freight)
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')

        if (updataflag) {

          dispatch({
            type: 'releaseOrder/cpDischargedForm_save',
            payload: { ...value },
            callback: () => {
              dispatch({
                type: 'releaseOrder/releaseOrder_Get',
                payload: {
                  id: location.query.id,
                },
                callback: (res) => {
                  if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
                    && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
                      .length > 0)) {
                    this.setState({ orderflag: false })
                  } else {
                    this.setState({ orderflag: true })
                  }
                }
              });
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpDischargedForm_updata',
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
  };

  onCancelCancel = () => {
    router.push('/business/process/release_order_list');
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

  onUndo = id => {
    Modal.confirm({
      title: '撤销该放行单',
      content: '确定撤销放行单吗',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(id),
    });
  }

  undoClick = id => {
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
        type: 'cpRevocation/cpDischargedForm_Revocation',
        payload: {
          id
        },
        callback: () => {
          // router.push('/business/process/release_order_list');
          router.push(`/business/process/release_order_form?id=${location.query.id}`);
        }
      })
    }
  }

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/Task_ReleasePermit?id=${location.query.id}`
  }

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const { location, indexstatus } = this.state
    dispatch({
      type: 'releaseOrder/cpDischargedForm_ispass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'releaseOrder/releaseOrder_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
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
      selectkhflag: true
    })
  }

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
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

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

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

  turnappData = (apps) => {
    if (apps === '待分配') {
      return 0
    }
    if (apps === '待审核') {
      return 1
    }
    if (apps === '撤销') {
      return 2
    }
    if (apps === '通过') {
      return 3
    }
    if (apps === '驳回') {
      return 4
    }
  }

  onUndoRepost = () => {
    Modal.confirm({
      title: '重新提交该放行单',
      content: '确定重新提交放行单吗',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.repost(),
    });
  }

  onisTrue = () => {
    Modal.confirm({
      title: '此单无成本是否放行',
      content: '确定放行该放行单吗',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.handleSubmit(),
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
        type: 'releaseOrder/cpDischargedFormre_submit',
        payload: {
          id: location.query.id
        },
        callback: () => {
          dispatch({
            type: 'releaseOrder/releaseOrder_Get',
            payload: {
              id: location.query.id,
            },
            callback: (res) => {
              if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
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
                showdata: allUser,
                modalVisiblepass: false
              })

              this.setState({
                intentionId: location.query.id
              })
            }
          });
        }

      })
    }
  }

  render() {
    const { fileList, previewVisible, previewImage, orderflag, isNotUpdata, updataname, updataflag, modalVisiblepass, selectkhflag, showdata, srcimg, srcimg1 } = this.state;
    const { submitting1, submitting2, submitting, releaseOrderGet, dispatch, levellist, levellist2, newdeptlist, modeluserList } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formtype = (apps) => {
      if (apps === 1 || apps === '1') {
        return '整车维修订单'
      }
      if (apps === 2 || apps === '2') {
        return '总成维修订单'
      }
      if (apps === 3 || apps === '3') {
        return '配件销售订单'
      }
      if (apps === 5 || apps === '5' || apps === 8 || apps === '8') {
        return '总成销售'
      }
      if (apps === 6 || apps === '6' || apps === 4 || apps === '4') {
        return '内部订单'
      }
      if (apps === 7 || apps === '7') {
        return '售后订单'
      }
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
      that,
      handleSelectRows: this.handleSelectRows,
      selectcustomer: this.selectcustomer,
      dispatch,
      levellist, levellist2, newdeptlist,
      modeluserList

    }

    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }
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
          if (((isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.approvals) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (releaseOrderGet.approvals === 0 || releaseOrderGet.approvals === '0')) ||
            (isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.createBy) && (releaseOrderGet.approvals === 2 || releaseOrderGet.approvals === '2')) ||
            (isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.createBy) && (releaseOrderGet.approvals === 4 || releaseOrderGet.approvals === '4'))
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
          if (isNotBlank(releaseOrderGet) && (releaseOrderGet.approvals !== 0 || releaseOrderGet.approvals !== '0')) {
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
          if (((isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.approvals) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (releaseOrderGet.approvals === 0 || releaseOrderGet.approvals === '0')) ||
            (isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.createBy) && (releaseOrderGet.approvals === 2 || releaseOrderGet.approvals === '2')) ||
            (isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.createBy) && (releaseOrderGet.approvals === 4 || releaseOrderGet.approvals === '4'))
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
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            放行单
      </div>

          {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}

          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>

                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.orderCode) ? releaseOrderGet.orderCode : '',
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
                  <FormItem {...formItemLayout} label='审批进度'>

                    <Input

                      value={isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.approvals) ?
                        appData(releaseOrderGet.approvals) : ''}
                      disabled
                    />

                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单分类'>

                    <Input value={isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.formType) ? formtype(releaseOrderGet.formType) : ''} disabled />

                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='整车完成时间'>
                    <Input
                      disabled
                      value={isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.zhcCompletedDate) ? releaseOrderGet.zhcCompletedDate : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总车完成时间'>
                    <Input
                      disabled
                      value={isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.zocCompletedDate) ? releaseOrderGet.zocCompletedDate : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='配件完成时间'>
                    {getFieldDecorator('pjCompletedDate', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.pjCompletedDate) ? releaseOrderGet.pjCompletedDate : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='结算完成时间'>
                    {getFieldDecorator('jsCompletedDate', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.jsCompletedDate) ? releaseOrderGet.jsCompletedDate : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入结算完成时间',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="业务信息" className={styles.card} bordered={false}>
              <Row gutter={12}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务员'>
                    <Input
                      disabled
                      value={(isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.user) ? releaseOrderGet.user.name : '')}
                    />
                  </FormItem>
                </Col>

                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input
                      disabled
                      value={isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.user) && isNotBlank(releaseOrderGet.user.office) ? releaseOrderGet.user.office.name : ''}
                    />
                  </FormItem>
                </Col>

              </Row>
            </Card>

            <Card title="客户信息" className={styles.card} bordered={false}>
              <Row gutter={12}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户'>
                    <Input

                      disabled
                      value={isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.client) && isNotBlank(releaseOrderGet.client.clientCpmpany) ? releaseOrderGet.client.clientCpmpany : ''}
                    />

                  </FormItem>
                </Col>

                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input disabled value={(isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.client) ? releaseOrderGet.client.name : '')} />
                  </FormItem>
                </Col>

                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled
                      value={(isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.client) ? releaseOrderGet.client.classify : '')}
                    >
                      {
                        isNotBlank(this.state.classify) && this.state.classify.length > 0 && this.state.classify.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input
                      disabled
                      value={(isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.client) ? releaseOrderGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input
                      disabled
                      value={(isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.client) ? releaseOrderGet.client.phone : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="总成信息" className={styles.card} bordered={false}>
              <Row gutter={12}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='进场类型'>
                    {getFieldDecorator('assemblyEnterType', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.assemblyEnterType) ? releaseOrderGet.assemblyEnterType : '',
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
                  <FormItem {...formItemLayout} label='品牌'>
                    {getFieldDecorator('assemblyBrand', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.cpAssemblyBuild) && isNotBlank(releaseOrderGet.cpAssemblyBuild.id) ? isNotBlank(releaseOrderGet.cpAssemblyBuild.assemblyBrand) ? releaseOrderGet.cpAssemblyBuild.assemblyBrand : ''
                        : isNotBlank(releaseOrderGet.assemblyBrand) ? releaseOrderGet.assemblyBrand : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入品牌',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车型/排量'>
                    {getFieldDecorator('assemblyVehicleEmissions', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.cpAssemblyBuild) && isNotBlank(releaseOrderGet.cpAssemblyBuild.id) ? isNotBlank(releaseOrderGet.cpAssemblyBuild.vehicleModel) ? releaseOrderGet.cpAssemblyBuild.vehicleModel : ''
                        : isNotBlank(releaseOrderGet.assemblyVehicleEmissions) ? releaseOrderGet.assemblyVehicleEmissions : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入车型/排量',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='年份'>
                    {getFieldDecorator('assemblyYear', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.cpAssemblyBuild) && isNotBlank(releaseOrderGet.cpAssemblyBuild.id) ? isNotBlank(releaseOrderGet.cpAssemblyBuild.assemblyYear) ? releaseOrderGet.cpAssemblyBuild.assemblyYear : ''
                        : isNotBlank(releaseOrderGet.assemblyYear) ? releaseOrderGet.assemblyYear : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入年份',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成型号'>
                    {getFieldDecorator('assemblyModel', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.cpAssemblyBuild) && isNotBlank(releaseOrderGet.cpAssemblyBuild.id) ? isNotBlank(releaseOrderGet.cpAssemblyBuild.assemblyModel) ? releaseOrderGet.cpAssemblyBuild.assemblyModel : ''
                        : isNotBlank(releaseOrderGet.assemblyModel) ? releaseOrderGet.assemblyModel : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='钢印号'>
                    {getFieldDecorator('assemblySteelSeal', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.assemblySteelSeal) ? releaseOrderGet.assemblySteelSeal : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='VIN码'>
                    {getFieldDecorator('assemblyVin', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.assemblyVin) ? releaseOrderGet.assemblyVin : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='其他识别信息'>
                    {getFieldDecorator('assemblyMessage', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.assemblyMessage) ? releaseOrderGet.assemblyMessage : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='故障代码'>
                    {getFieldDecorator('assemblyFaultCode', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.assemblyFaultCode) ? releaseOrderGet.assemblyFaultCode : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='本次故障描述'>
                    {getFieldDecorator('assemblyErrorDescription', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.assemblyErrorDescription) ? releaseOrderGet.assemblyErrorDescription : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled={updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="制造编码">
                    {getFieldDecorator('makeCode', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.cpAssemblyBuild) && isNotBlank(releaseOrderGet.cpAssemblyBuild.makeCode) ? releaseOrderGet.cpAssemblyBuild.makeCode : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="运输信息" className={styles.card} bordered={false}>
              <Row gutter={12}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='物流要求'>
                    {getFieldDecorator('logistics', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.logistics) ? releaseOrderGet.logistics : '',
                      rules: [
                        {
                          required: false,
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
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="物流单号">
                    {getFieldDecorator('logisticsCode', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.logisticsCode) ? releaseOrderGet.logisticsCode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入物流单号',

                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="物流公司">
                    {getFieldDecorator('logisticsOffice', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.logisticsOffice) ? releaseOrderGet.logisticsOffice : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入物流公司',

                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="发货人">
                    {getFieldDecorator('shipper', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.shipper) ? releaseOrderGet.shipper : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入发货人',

                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="发货地址">
                    {getFieldDecorator('shipAddress', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.shipAddress) ? releaseOrderGet.shipAddress : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入发货地址',

                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="运费">
                    {getFieldDecorator('freight', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.freight) ? getPrice(releaseOrderGet.freight) : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入运费',

                        },
                      ],
                    })(<InputNumber disabled={orderflag && updataflag} precision={2} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="件数">
                    {getFieldDecorator('number', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.number) ? releaseOrderGet.number : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入件数',

                        },
                      ],
                    })(<InputNumber style={{ width: '100%' }} disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="备注" className={styles.card} bordered={false}>
              <Row gutter={12}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='更新时间'>
                    {getFieldDecorator('finishDate', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.finishDate) ? releaseOrderGet.finishDate : '',
                      rules: [
                        {
                          required: false,
                          message: '',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.remarks) ? releaseOrderGet.remarks : '',
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

                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

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
                {isNotBlank(showdata) && showdata.length < 5 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
                    .length > 0 &&
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    onClick={this.newMember}
                    icon="plus"
                    disabled={!((isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.approvals) &&
                      (releaseOrderGet.approvals === 0 || releaseOrderGet.approvals === '0')) ||
                      (isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.createBy) && (releaseOrderGet.approvals === 2 || releaseOrderGet.approvals === '2')) ||
                      (isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.createBy) && (releaseOrderGet.approvals === 4 || releaseOrderGet.approvals === '4'))
                    )}
                  >
                    新增审核人
</Button>
                }

                {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.isOperation) && (releaseOrderGet.isOperation === 1 || releaseOrderGet.isOperation === '1') &&
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

                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                  打印
            </Button>

                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '二次修改')
                    .length > 0 &&
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                    {updataname}
                  </Button>
                }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '修改')
                    .length > 0 && <span>
                    <Button
                      type="primary"
                      loading={submitting2 || submitting1}
                      style={{ marginLeft: 8 }}
                      disabled={orderflag && updataflag}
                      onClick={(e) => this.onsave()}
                    >
                      保存
  </Button>
                    {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.cpOutboundList) && releaseOrderGet.cpOutboundList.length > 0 ?
                      <Button
                        type="primary"
                        // htmlType="submit"
                        loading={submitting2 || submitting1}
                        style={{ marginLeft: 8 }}
                        disabled={(orderflag && updataflag)}
                        onClick={(e) => this.handleSubmit(e)}
                      >
                        提交
  </Button>
                      : <Button
                        type="primary"
                        loading={submitting2 || submitting1}
                        style={{ marginLeft: 8 }}
                        disabled={(orderflag && updataflag)}
                        onClick={() => this.onisTrue()}
                      >
                        提交
</Button>
                    }
                    {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.approvals) &&
                      (releaseOrderGet.approvals === 1 || releaseOrderGet.approvals === '1') && isNotBlank(releaseOrderGet.createBy) &&
                      <Button style={{ marginLeft: 8 }} loading={submitting2 || submitting1} onClick={() => this.onUndoRepost()}>
                        重新提交
</Button>
                    }

                    {orderflag &&
                      <Button style={{ marginLeft: 8 }} loading={submitting2 || submitting1} onClick={() => this.onUndo(releaseOrderGet.id)}>撤销</Button>
                    }
                  </span>
                }
                <Button style={{ marginLeft: 8, marginRight: 8 }} onClick={() => this.onCancelCancel()}>
                  返回
            </Button>
              </FormItem>
            </Card>
          </Form>

        </Card>

        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ReleaseOrderForm;
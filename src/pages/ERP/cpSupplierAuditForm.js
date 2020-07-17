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
  Row, Col
  , Cascader,
  Divider,
  Popconfirm
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpSupplierAuditForm.less';
import StandardTable from '@/components/StandardTable';
import DragTable from '../../components/StandardEditTable/dragTable'
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateFormkh = Form.create()(props => {
  const { form, dispatch, handleModalVisiblekh, modeluserList, selectkhflag, selectcustomer,
    selectedRows, handleSelectRows, levellist, levellist2, newdeptlist, that } = props;
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
          'role.id': '8a73e4913e8e4c89840a1256e18c40ba',
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
        'role.id': '8a73e4913e8e4c89840a1256e18c40ba',
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
      'role.id': '8a73e4913e8e4c89840a1256e18c40ba',
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
const CreateFormgs = Form.create()(props => {
  const { handleModalVisiblegs, complist, selectgsflag, selectgs, dispatch, form,
    form: { getFieldDecorator }, that } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectgs(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '分公司编号',
      dataIndex: 'code',
      align: 'center',
      width: 150,
    },
    {
      title: '分公司名称',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '公司图标',
      dataIndex: 'logo',
      align: 'center',
      width: 150,
      render: (text) => {
        if (isNotBlank(text)) {
          const images = text.split('|').map((item) => {
            if (isNotBlank(item)) {
              return <img
                key={item}
                onClick={() => this.handleImage(getFullUrl(item))}
                style={{ height: 50, width: 50, marginRight: 10 }}
                alt="example"
                src={getFullUrl(item)}
              />
            }
            return null;
          })
          return <div>{images}</div>
        }
        return '';
      },
    },
    {
      title: '所属大区',
      dataIndex: 'area.name',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'master',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人电话',
      dataIndex: 'zipCode',
      align: 'center',
      width: 150,
    },
    {
      title: '抬头中文',
      dataIndex: 'rise',
      align: 'center',
      width: 150,
    },
    {
      title: '电话1',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
    },
    {
      title: '抬头英文',
      dataIndex: 'enrise',
      align: 'center',
      width: 150,
    },
    {
      title: '电话2',
      dataIndex: 'twoPhone',
      align: 'center',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      width: 200,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      align: 'center',
      width: 150,
    },
    {
      title: '网址',
      dataIndex: 'website',
      align: 'center',
      width: 150,
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
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      gssearch: {}
    })
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
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
      ...that.state.gssearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'company/query_comp',
      payload: params,
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10
      };
      if (!isNotBlank(fieldsValue.name)) {
        values.name = ''
      }

      that.setState({
        gssearch: values
      })

      dispatch({
        type: 'company/query_comp',
        payload: values,
      });
    });
  };

  const handleModalVisiblegsin = () => {
    form.resetFields();
    that.setState({
      gssearch: {}
    })
    handleModalVisiblegs()
  }

  return (
    <Modal
      title='选择所属公司'
      visible={selectgsflag}
      onCancel={() => handleModalVisiblegsin()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="公司名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
              </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
              </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={complist}
        columns={columnskh}
      />
    </Modal>
  );
});
@connect(({ cpSupplierAudit, loading, company, sysuser, syslevel, sysdept }) => ({
  ...cpSupplierAudit,
  ...company,
  ...sysuser,
  ...syslevel,
  ...sysdept,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpSupplierAudit/cpSupplierAudit_Add'],
}))
@Form.create()
class CpSupplierAuditForm extends PureComponent {
  index = 0

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectgsdata: [],
      selectgsflag: false,
      indexstatus: 0,
      orderflag: false,
      showdata: [],
      dataSource: [],
      FormVisible: false,
      modalVisibleMore: false,
      modalVisiblepass: false,
      location: getLocation()
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpSupplierAudit/cpSupplierAudit_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit')[0].children.filter(item => item.name == '修改')
              .length > 0)) {
            this.setState({ orderflag: false })
          } else {
            this.setState({ orderflag: true })
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
      type: 'cpSupplierAudit/clear',
    });
  }

  onsave = () => {
    const { dispatch, form, cpSupplierAuditGet } = this.props;
    const { addfileList, location, selectgsdata, showdata } = this.state;
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
          value.status = 0
        }
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        if (!(isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals))) {
          value.approvals = 0
        }
        value.companyId = isNotBlank(selectgsdata) && isNotBlank(selectgsdata.id) ? selectgsdata.id :
          (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.companyId) ? cpSupplierAuditGet.companyId : getStorage('companyId'))
        dispatch({
          type: 'cpSupplierAudit/cpSupplierAudit_save',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/basicmanagement/supplier/cp_supplier_audit_form?id=${isNotBlank(res.data) && isNotBlank(res.data.id) ? res.data.id : ''}`)
          }
        })
      }
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpSupplierAuditGet } = this.props;
    const { addfileList, location, selectgsdata, showdata } = this.state;
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
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        if (!(isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals))) {
          value.approvals = 0
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.companyId = isNotBlank(selectgsdata) && isNotBlank(selectgsdata.id) ? selectgsdata.id :
          (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.companyId) ? cpSupplierAuditGet.companyId : getStorage('companyId'))
        dispatch({
          type: 'cpSupplierAudit/cpSupplierAudit_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicmanagement/supplier/cp_supplier_audit_list');
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicmanagement/supplier/cp_supplier_audit_list');
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

  onselectgs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
    this.setState({
      selectgsflag: true
    })
  }

  selectgs = (record) => {
    this.setState({
      selectgsdata: record,
      selectgsflag: false
    })
  }

  handleModalVisiblegs = flag => {
    this.setState({
      selectgsflag: !!flag
    });
  };

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const { location, indexstatus } = this.state
    dispatch({
      type: 'cpSupplierAudit/cpSupplierAudit_pass',
      payload: {
        id: location.query.id,
        status: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpSupplierAudit/cpSupplierAudit_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            this.setState({
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
    if (apps === '重新提交') {
      return 2
    }
    if (apps === '通过') {
      return 3
    }
    if (apps === '驳回') {
      return 4
    }
  }

  onselectkh = (key) => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': '8a73e4913e8e4c89840a1256e18c40ba',
        'office.id': getStorage('companyId')
      }
    });
    this.setState({
      indexflag: key,
      selectkhflag: true
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

  repost = () => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpSupplierAudit/cpSupplierAudit_resubmit',
      payload: {
        id: location.query.id
      },
      callback: () => {
        dispatch({
          type: 'cpSupplierAudit/cpSupplierAudit_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit')[0].children.filter(item => item.name == '修改')
                .length > 0)) {
              this.setState({ orderflag: false })
            } else {
              this.setState({ orderflag: true })
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
    });
  }

  render() {
    const { fileList, previewVisible, previewImage, selectgsdata, selectgsflag, modalVisiblepass, orderflag, selectedRows, showdata, selectkhflag, orderfalg } = this.state;
    const { submitting1, submitting, cpSupplierAuditGet, complist, modeluserList, dispatch, levellist, levellist2, newdeptlist } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

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

    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      handleSelectRows: this.handleSelectRows,
      selectedRows,
      selectcustomer: this.selectcustomer,
      dispatch,
      levellist, levellist2, newdeptlist,
      modeluserList,
      that
    }

    const parentMethodsgs = {
      handleModalVisiblegs: this.handleModalVisiblegs,
      selectgs: this.selectgs,
      complist,
      dispatch,
      that
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
          if ((JSON.stringify(cpSupplierAuditGet) == "{}") || ((isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (cpSupplierAuditGet.approvals === 0 || cpSupplierAuditGet.approvals === '0')) ||
            (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 2 || cpSupplierAuditGet.approvals === '2')) ||
            (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 4 || cpSupplierAuditGet.approvals === '4'))
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
          if (isNotBlank(cpSupplierAuditGet) && (cpSupplierAuditGet.approvals !== 0 || cpSupplierAuditGet.approvals !== '0')) {
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
          if ((JSON.stringify(cpSupplierAuditGet) == "{}") || ((isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (cpSupplierAuditGet.approvals === 0 || cpSupplierAuditGet.approvals === '0')) ||
            (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 2 || cpSupplierAuditGet.approvals === '2')) ||
            (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 4 || cpSupplierAuditGet.approvals === '4'))
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
            供应商审核
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='供应商类型'>
                  {getFieldDecorator('type', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.type) ? cpSupplierAuditGet.type : '普通供应商',
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                  })(
                    <Input disabled value={isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.type) ? cpSupplierAuditGet.type : '普通供应商'} />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='审批进度'>
                  <Input

                    value={isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals) ?
                      appData(cpSupplierAuditGet.approvals) : ''}
                    disabled
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='名称'>
                  {getFieldDecorator('name', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.name) ? cpSupplierAuditGet.name : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入名称',
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='电话'>
                  {getFieldDecorator('phone', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.phone) ? cpSupplierAuditGet.phone : '',
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
                <FormItem {...formItemLayout} label='传真'>
                  {getFieldDecorator('fax', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.fax) ? cpSupplierAuditGet.fax : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入传真',
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='联系人'>
                  {getFieldDecorator('linkman', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.linkman) ? cpSupplierAuditGet.linkman : '',
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
                <FormItem {...formItemLayout} label='所属分公司'>
                  <Input
                    style={{ width: '50%' }}
                    disabled

                    value={isNotBlank(selectgsdata) && isNotBlank(selectgsdata.name) ? selectgsdata.name :
                      (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.companyName) ? cpSupplierAuditGet.companyName : getStorage('companyname'))}
                  />
                  <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgs} loading={submitting} disabled={orderflag}>选择</Button>
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='地址'>
                  {getFieldDecorator('address', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.address) ? cpSupplierAuditGet.address : '',
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
                <FormItem {...formItemLayout} label='经营类型'>
                  {getFieldDecorator('runType', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.runType) ? cpSupplierAuditGet.runType : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入经营类型',
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                  {getFieldDecorator('remarks', {
                    initialValue: isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.remarks) ? cpSupplierAuditGet.remarks : '',
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
              {isNotBlank(showdata) && showdata.length < 5 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpSupplierAudit')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  onClick={this.newMember}
                  icon="plus"
                  disabled={!((JSON.stringify(cpSupplierAuditGet) == "{}") || ((isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals) &&
                    (cpSupplierAuditGet.approvals === 0 || cpSupplierAuditGet.approvals === '0')) ||
                    (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 2 || cpSupplierAuditGet.approvals === '2')) ||
                    (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 4 || cpSupplierAuditGet.approvals === '4')))
                  )}
                >
                  新增审核人
         </Button>
              }
              {isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.isOperation) && (cpSupplierAuditGet.isOperation === 1 || cpSupplierAuditGet.isOperation === '1') &&
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
            {((JSON.stringify(cpSupplierAuditGet) == "{}") || (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy))) &&
              <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
                <Button
                  style={{ marginLeft: 8 }}
                  loading={submitting1}
                  type="primary"
                  onClick={this.onsave}
                  disabled={!((JSON.stringify(cpSupplierAuditGet) == "{}") || ((isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals) &&
                    (cpSupplierAuditGet.approvals === 0 || cpSupplierAuditGet.approvals === '0')) ||
                    (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 2 || cpSupplierAuditGet.approvals === '2')) ||
                    (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 4 || cpSupplierAuditGet.approvals === '4')))
                  )}
                >
                  保存
              </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  htmlType="submit"
                  loading={submitting1}
                  disabled={!((JSON.stringify(cpSupplierAuditGet) == "{}") || ((isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals) &&
                    (cpSupplierAuditGet.approvals === 0 || cpSupplierAuditGet.approvals === '0')) ||
                    (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 2 || cpSupplierAuditGet.approvals === '2')) ||
                    (isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.createBy) && (cpSupplierAuditGet.approvals === 4 || cpSupplierAuditGet.approvals === '4')))
                  )}
                >
                  提交
              </Button>
                {isNotBlank(cpSupplierAuditGet) && isNotBlank(cpSupplierAuditGet.approvals) &&
                  (cpSupplierAuditGet.approvals === 1 || cpSupplierAuditGet.approvals === '1') && isNotBlank(cpSupplierAuditGet.createBy) &&
                  <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={() => this.repost()}>
                    重新提交
</Button>
                }
                <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                  返回
              </Button>
              </FormItem>
            }
          </Form>
        </Card>
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateFormgs {...parentMethodsgs} selectgsflag={selectgsflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpSupplierAuditForm;
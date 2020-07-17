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
  Upload,
  Modal,
  Row,
  Cascader,
  Col,
  DatePicker
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpAfterEntrustFromForm.less';
import StandardTable from '@/components/StandardTable';
import SearchTableList from '@/components/SearchTableList';
import { getStorage } from '@/utils/localStorageUtils';

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
      khsearchVisible,
      form: { getFieldDecorator },
      handleSearchVisible,
      cpClientSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={khsearchVisible}
        onCancel={() => this.handleSearchVisiblein()}
        afterClose={() => this.handleSearchVisiblein()}
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
    // {
    //   title: '公司图标',
    //   dataIndex: 'logo',
    //   align: 'center' ,
    //   width: 150,
    //   render: (text) => {
    //     if (isNotBlank(text)) {
    //       const images = text.split('|').map((item) => {
    //         if (isNotBlank(item)) {
    //           return <img
    //             key={item}
    //             onClick={() => this.handleImage(getFullUrl(item))}
    //             style={{ height: 50, width: 50, marginRight: 10 }}
    //             alt="example"
    //             src={getFullUrl(item)}
    //           />
    //         }
    //         return null;
    //       })
    //       return <div>{images}</div>
    //     }
    //     return '';
    //   },
    // },
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


const CreateForm = Form.create()(props => {
  const { handleModalVisible, userlist, selectflag, selectuser, levellist, levellist2, newdeptlist, form, dispatch, that, selecti } = props;
  const { getFieldDecorator } = form
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectuser(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '编号',
      align: 'center',
      dataIndex: 'no',
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
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.companyName)) {
        values.companyName = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      }

      that.setState({
        rysearch: values
      })

      if (selecti == 1) {
        dispatch({
          type: 'sysuser/fetch',
          payload: {
            // genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
            ...values
          },
        });
      } else if (selecti == 2) {
        dispatch({
          type: 'sysuser/fetch',
          payload: {
            // genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
            ...values,
            'role.id': 'a0349f4d5f6a429a80c276bc3f55d4cd'
          },
        });
      }
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      rysearch: {}
    })
    if (selecti == 1) {
      dispatch({
        type: 'sysuser/fetch',
        payload: {
          // genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
          current: 1,
          pageSize: 10
        }
      });
    } else if (selecti == 2) {
      dispatch({
        type: 'sysuser/fetch',
        payload: {
          // genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
          current: 1,
          pageSize: 10,
          'role.id': 'a0349f4d5f6a429a80c276bc3f55d4cd'
        }
      });
    }
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...that.state.rysearch,
      // genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    if (selecti == 1) {
      dispatch({
        type: 'sysuser/fetch',
        payload: params,
      });
    } else if (selecti == 2) {
      dispatch({
        type: 'sysuser/fetch',
        payload: {
          ...params,
          'role.id': 'a0349f4d5f6a429a80c276bc3f55d4cd'
        },
      });
    }


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
  const renderSimpleForm = () => {
    return (
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="所属分公司">
              {getFieldDecorator('companyName', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} allowClear>
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

                  style={{ width: '100%' }}
                  allowClear
                  fieldNames={{ label: 'name', value: 'id' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div>
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
    );
  };

  const handleModalVisiblein = () => {
    form.resetFields();
    that.setState({
      rysearch: {}
    })
    handleModalVisible()
  }

  return (
    <Modal
      title='选择人员'
      visible={selectflag}
      onCancel={() => handleModalVisiblein()}
      width='80%'
    >
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{renderSimpleForm()}</div>
        <StandardTable
          bordered
          scroll={{ x: 1050 }}
          data={userlist}
          columns={selectcolumns}
          onChange={handleStandardTableChange}
        />
      </div>
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
      align: 'center',
      dataIndex: 'code',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '联系人',
      align: 'center',
      dataIndex: 'name',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '客户分类',
      align: 'center',
      dataIndex: 'classify',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '客户级别',
      align: 'center',
      dataIndex: 'level',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '联系地址',
      align: 'center',
      dataIndex: 'address',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '邮箱',
      align: 'center',
      dataIndex: 'email',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '移动电话',
      align: 'center',
      dataIndex: 'phone',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '电话',
      dataIndex: 'tel',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '税号',
      dataIndex: 'dutyParagraph',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '开户账号',
      dataIndex: 'openNumber',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '开户银行',
      dataIndex: 'openBank',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '开户地址',
      dataIndex: 'openAddress',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '开户电话',
      dataIndex: 'openTel',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '创建者',
      dataIndex: 'user.name',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: false,
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
          pageSize: 10,
          current: 1,
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
      ...that.state.khsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: params,
    });
  };
  const handleModalkh = () => {
    form.resetFields();
    that.setState({
      khsearch: {}
    })
    handleModalVisiblekh()
  }
  return (
    <Modal
      title='选择客户'
      visible={selectkhflag}
      onCancel={() => handleModalkh()}
      width='80%'
    >
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
        {form.getFieldDecorator('reslut', {
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
@connect(({ cpAfterEntrustFrom, loading, sysuser, cpClient, sysdept, syslevel ,company}) => ({
  ...cpAfterEntrustFrom,
  ...sysuser,
  ...cpClient,
  ...syslevel,
  ...sysdept,
  ...company,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpAfterEntrustFrom/cpAfterEntrustFrom_Add'],
  submitting2: loading.effects['cpupdata/cpAfterEntrustFrom_update'],
}))
@Form.create()
class CpAfterEntrustFromForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectyear: 0,
      selectmonth: 0,
      indexflag: 0,
      selecti: 1,
      orderflag: false,
      selectkhdata: [],
      selectywydata: [],
      selectkhflag: false,
      orderType: [],
      showflag: false,
      indexstatus: 0,
      planflag: false,
      confirmflag: true,
      updataflag: true,
      selectgsflag: false,
      selectgsdata: [],
      wyString:'',
      updataname: '取消锁定',
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAfterEntrustFrom/cpAfterEntrustFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (
            res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterEntrustFrom').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterEntrustFrom')[0].children.filter(item => item.name == '修改')
                .length == 0)) {
            this.setState({ orderflag: true })
          } else {
            this.setState({ orderflag: false })
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'SHWT'
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
              type: 'SHWT'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
            }
          })

          if (isNotBlank(res.data) && isNotBlank(res.data.outsourcingType)) {
                this.setState({
                    wyString :res.data.outsourcingType
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
          if (isNotBlank(res.data.qualityTime)) {
            this.setState({
              selectyear: res.data.qualityTime.split(',')[0],
              selectmonth: res.data.qualityTime.split(',')[1]
            })
          }
        }
      })
    } else {
      this.setState({ orderflag: false, planflag: false, showflag: true })
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
        const afterType = []
        const area = []
        const outsourcingType = []
        data.forEach((item) => {
          if (item.type == 'afterType') {
            afterType.push(item)
          }
          if (item.type == 'outsourcingType') {
            outsourcingType.push(item)
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
          area ,afterType ,outsourcingType
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
      type: 'cpAfterEntrustFrom/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpAfterEntrustFromGet } = this.props;
    const { addfileList, location, selectyear, selectmonth, selectkhdata, selectdata, selectywydata, updataflag ,selectgsdata } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.errorDescription = addfileList.join('|')
        } else {
          value.errorDescription = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }


        value.collectClient = {}
        value.collectClient.id = (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectClient) && isNotBlank(cpAfterEntrustFromGet.collectClient.id) ? cpAfterEntrustFromGet.collectClient.id : '')

        value.collectCode = {}
        value.collectCode.id = (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectCode) && isNotBlank(cpAfterEntrustFromGet.collectCode.id) ? cpAfterEntrustFromGet.collectCode.id : '')

        value.cuttingApplyId = isNotBlank(selectgsdata) && isNotBlank(selectgsdata.id) ? selectgsdata.id :
        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.cuttingApplyId) ? cpAfterEntrustFromGet.cuttingApplyId : '')

        value.planNumber = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
          (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planNumber) ? cpAfterEntrustFromGet.planNumber : '')
        value.qualityTime = `${selectyear}, ${selectmonth}`
        value.planStartDate = moment(value.planStartDate).format("YYYY-MM-DD")
        value.planEndDate = moment(value.planEndDate).format("YYYY-MM-DD")
        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client)) ? cpAfterEntrustFromGet.client.id : '')
        value.user.id = (isNotBlank(selectywydata) && isNotBlank(selectywydata.id)) ? selectywydata.id : ((isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user)) ? cpAfterEntrustFromGet.user.id : getStorage('userid'))
        value.submit = 1
        value.orderStatus = 1
        if (updataflag) {
          dispatch({
            type: 'cpAfterEntrustFrom/cpAfterEntrustFrom_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/accessories/process/cp_after_entrust_from_form?id=${location.query.id}`);
              // router.push('/accessories/process/cp_after_entrust_from_list');
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpAfterEntrustFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/accessories/process/cp_after_entrust_from_form?id=${location.query.id}`);
              // router.push('/accessories/process/cp_after_entrust_from_list');
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
      router.push(`/accessories/process/cp_after_entrust_from_form?id=${location.query.id}`);
    }
  }

  onsave = e => {
    const { dispatch, form, cpAfterEntrustFromGet } = this.props;
    const { addfileList, location, selectyear, selectmonth, selectkhdata, selectdata, selectywydata, selectgsdata, updataflag } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.errorDescription = addfileList.join('|')
        } else {
          value.errorDescription = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }

        value.collectClient = {}
        value.collectClient.id = (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectClient) && isNotBlank(cpAfterEntrustFromGet.collectClient.id) ? cpAfterEntrustFromGet.collectClient.id : '')

        value.collectCode = {}
        value.collectCode.id = (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectCode) && isNotBlank(cpAfterEntrustFromGet.collectCode.id) ? cpAfterEntrustFromGet.collectCode.id : '')

        value.cuttingApplyId = isNotBlank(selectgsdata) && isNotBlank(selectgsdata.id) ? selectgsdata.id :
        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.cuttingApplyId) ? cpAfterEntrustFromGet.cuttingApplyId : '')

        value.planNumber = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
          (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planNumber) ? cpAfterEntrustFromGet.planNumber : '')
        value.qualityTime = `${selectyear}, ${selectmonth}`
        value.planStartDate = moment(value.planStartDate).format("YYYY-MM-DD")
        value.planEndDate = moment(value.planEndDate).format("YYYY-MM-DD")
        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client)) ? cpAfterEntrustFromGet.client.id : '')
        value.user.id = (isNotBlank(selectywydata) && isNotBlank(selectywydata.id)) ? selectywydata.id : ((isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user)) ? cpAfterEntrustFromGet.user.id : getStorage('userid'))
        if (updataflag) {
          value.submit = 0
          value.orderStatus = 0
          dispatch({
            type: 'cpAfterEntrustFrom/cpAfterEntrustFrom_Add',
            payload: { ...value },
            callback: (res) => {
              router.push(`/accessories/process/cp_after_entrust_from_form?id=${res.data.id}`);
            }
          })
        } else {
          value.orderStatus = 1
          value.submit = 1
          dispatch({
            type: 'cpupdata/cpAfterEntrustFrom_update',
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
    router.push('/accessories/process/cp_after_entrust_from_list');
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

  handleModalVisible = flag => {
    this.setState({
      selectflag: !!flag
    });
  };

  selectuser = (record) => {
    const { selecti } = this.state
    if (selecti === 1 || selecti === '1') {
      this.setState({
        selectywydata: record,
        selectflag: false
      })
    } else if (selecti === 2 || selecti === '2') {
      this.props.form.setFieldsValue({
        planNumberName: isNotBlank(record.name) ? record.name : ''
      })
      this.setState({
        selectdata: record,
        selectflag: false
      })
    }
  }

  onselect = (i) => {
    const { dispatch } = this.props
    this.setState({ selecti: i })
    if (i == 1) {
      dispatch({
        type: 'sysuser/fetch',
        payload: {
          current: 1,
          // genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
          pageSize: 10
        },
        callback: () => {
          this.setState({
            selectflag: true
          })
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
          pageSize:100
        },
      });
      dispatch({
        type: 'syslevel/query_office',
      });
      dispatch({
        type: 'sysdept/query_dept'
      });
    } else if (i == 2) {
      dispatch({
        type: 'sysuser/fetch',
        payload: {
          current: 1,
          // genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[], 
          pageSize: 10,
          'role.id': 'a0349f4d5f6a429a80c276bc3f55d4cd'
        },
        callback: () => {
          this.setState({
            selectflag: true
          })
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
          pageSize:100
        },
      });
      dispatch({
        type: 'syslevel/query_office',
      });
      dispatch({
        type: 'sysdept/query_dept'
      });
    }
  }

  editYear = (val) => {
    if (isNotBlank(val)) {
      this.setState({ selectyear: val })
    } else {
      this.setState({ selectyear: 0 })
    }
  }

  editMonth = (val) => {
    if (isNotBlank(val)) {
      this.setState({ selectmonth: val })
    } else {
      this.setState({ selectmonth: 0 })
    }
  }

  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该售后委托单',
      content: '确定撤销该售后委托单吗？',
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
        type: 'cpAfterEntrustFrom/cpAfterEntrust_Revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/accessories/process/cp_after_entrust_from_form?id=${location.query.id}`);
          // router.push('/accessories/process/cp_after_entrust_from_list');
        }
      })
    }
  }

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  selectcustomer = (record) => {
    this.setState({
      selectkhdata: record,
      selectkhflag: false
    })
  }

  onselectkh = () => {
    const { dispatch } = this.props
    const that = this
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
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
      type: 'cpAfterEntrustFrom/cpAfter_Entrust_isPass',
      payload: {
        id: location.query.id,
        orderStatus: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpAfterEntrustFrom/cpAfterEntrustFrom_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            this.setState({
              modalVisiblepass: false
            })
            if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 4 || res.data.orderStatus === '4') {
              this.setState({ orderflag: true, planflag: true, showflag: true })
            } else if (res.data.orderStatus === 0 || res.data.orderStatus === '0') {
              this.setState({ orderflag: false, planflag: false, showflag: true })
            } else if (res.data.orderStatus === 2 || res.data.orderStatus === '2' || res.data.orderStatus === 3 || res.data.orderStatus === '3') {
              this.setState({ orderflag: true, planflag: true, showflag: true })
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
            if (isNotBlank(res.data.qualityTime)) {
              this.setState({
                selectyear: res.data.qualityTime.split(',')[0],
                selectmonth: res.data.qualityTime.split(',')[1]
              })
            }
            if (res.data.planNumber == getStorage('userid')) {
              if (res.data.orderStatus === 2 || res.data.orderStatus === '2' || res.data.orderStatus === 3 || res.data.orderStatus === '3') {
                this.setState({ orderflag: true, showflag: true, planflag: true })
              } else if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 4 || res.data.orderStatus === '4') {
                this.setState({ orderflag: true, showflag: false, planflag: true })
              }
            }
          }
        })
      }
    })
  }

  handleSearchVisible = (fieldsValue) => {
    this.setState({
      khsearchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChange = () => {
    this.setState({
      khsearchVisible: true,
    });
  };

  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        ...that.state.khsearch,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      khsearchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/aftersale_EntrustOrder?id=${location.query.id}`
  }

  handlePreview1 = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
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
    this.props.form.setFieldsValue({
      wyOffice:record.name
    })
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

  selectwy = (e)=>{
    if(isNotBlank(e)){
       this.setState({
      wyString:e
     })
    }else{
      this.setState({
        wyString:''
       })
    }

  }

  render() {
    const { fileList, previewVisible, previewImage, selectflag, orderflag, selectdata, selectkhflag, selectkhdata, selectywydata, showflag,
      modalVisiblepass, planflag, khsearchVisible, updataflag, updataname, srcimg, srcimg1, fileList1, selecti ,selectgsflag ,selectgsdata} = this.state;
    const { submitting1, submitting2, submitting, cpAfterEntrustFromGet, userlist,
      levellist, levellist2, newdeptlist, dispatch, cpClientList, cpClientSearchList ,complist } = this.props;
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const that = this

    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpClientSearchList,
      khsearchVisible,
      that
    }

    const parentMethodsgs = {
      handleModalVisiblegs: this.handleModalVisiblegs,
      selectgs: this.selectgs,
      complist,
      dispatch,
      that
    }

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      handleSearch: this.handleSearch,
      handleFormReset: this.handleFormReset,
      userlist, selecti,
      levellist, levellist2, newdeptlist, dispatch, that
    }
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass,
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    const appData = (apps) => {
      if (apps === 0 || apps === '0') {
        return '待分配0'
      }
      if (apps === 1 || apps === '1') {
        return '待审核1'
      }
      if (apps === 2 || apps === '2') {
        return '待分配2'
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
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
              售后委托单
        </div>
            {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
              <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
                单号
          </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
            </div>}
            {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
              <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
                编号
          </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
            </div>}
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    <Input disabled value={(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.id) ? cpAfterEntrustFromGet.id : '')} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单状态'>
                    <Input
                      disabled
                      value={isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.orderStatus) ? (
                        cpAfterEntrustFromGet.orderStatus === 0 || cpAfterEntrustFromGet.orderStatus === '0' ? '未处理' : (
                          cpAfterEntrustFromGet.orderStatus === 1 || cpAfterEntrustFromGet.orderStatus === '1' ? '已处理' :
                            cpAfterEntrustFromGet.orderStatus === 2 || cpAfterEntrustFromGet.orderStatus === '2' ? '关闭' : '')) : ''}
                      style={cpAfterEntrustFromGet.orderStatus === 0 || cpAfterEntrustFromGet.orderStatus === '0' ? { color: '#f50' } : (
                        cpAfterEntrustFromGet.orderStatus === 1 || cpAfterEntrustFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
                      )}
                    />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='售后编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.orderCode) ? cpAfterEntrustFromGet.orderCode : ''),
                      rules: [
                        {
                          required: false,
                          message: '售后编号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后次数'>
                    {getFieldDecorator('entrustNumber', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.entrustNumber) ? cpAfterEntrustFromGet.entrustNumber : '',
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
                  <FormItem {...formItemLayout} label='订单分类'>
                    {getFieldDecorator('orderType', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.orderType) ? cpAfterEntrustFromGet.orderType : ''),
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
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.project) ? cpAfterEntrustFromGet.project : ''),
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
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.dicth) ? cpAfterEntrustFromGet.dicth : ''),
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
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.businessType) ? cpAfterEntrustFromGet.businessType : ''),
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
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.y) ? cpAfterEntrustFromGet.y : ''),
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
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.insuranceCompanyId) ? cpAfterEntrustFromGet.insuranceCompanyId : ''),
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
										(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectClient)&& isNotBlank(cpAfterEntrustFromGet.collectClient.name) ? cpAfterEntrustFromGet.collectClient.name : ''),     
										rules: [
											{
												required: false,   
												message: '请输入集采客户',
											},
										],
									})( */}
                    <Input disabled value={
                      (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectClient) && isNotBlank(cpAfterEntrustFromGet.collectClient.name) ? cpAfterEntrustFromGet.collectClient.name : '')} />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='集采编码'>
                    {/* {getFieldDecorator('ctCode', {
										initialValue: isNotBlank(selectcodedata)&&isNotBlank(selectcodedata.collectCode)? selectcodedata.collectCode:
										(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectCode) && isNotBlank(cpAfterEntrustFromGet.collectCode.name) ? cpAfterEntrustFromGet.collectCode.name : ''),     
										rules: [
											{
												required: false,   
												message: '请输入集采编码',
											},
										],
									})( */}
                    <Input disabled value={(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.collectCode) && isNotBlank(cpAfterEntrustFromGet.collectCode.name) ? cpAfterEntrustFromGet.collectCode.name : '')} />
                    {/* )} */}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='品牌'>
                    {getFieldDecorator('brand', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.brand) ? cpAfterEntrustFromGet.brand : ''),
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
                  <FormItem {...formItemLayout} label='质保范围'>
                    {getFieldDecorator('x', {
                      initialValue: (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.x) ? cpAfterEntrustFromGet.x : ''),
                      rules: [
                        {
                          required: false,
                          message: '质保范围',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
          
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后类型'>
                    {getFieldDecorator('afterType', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.afterType) ? cpAfterEntrustFromGet.afterType : '1'),
                      rules: [
                        {
                          required: false,
                          message: '请选择售后类型',
                        },
                      ],
                    })(<Select
                      style={{ width: '100%' }}
                      disabled={orderflag}
                      allowClear
                    >
                      {
                        isNotBlank(this.state.afterType) && this.state.afterType.length > 0 && this.state.afterType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='委外类型'>
                    {getFieldDecorator('outsourcingType', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.outsourcingType) ? cpAfterEntrustFromGet.outsourcingType : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择委外类型',
                        },
                      ],
                    })(<Select
                      style={{ width: '100%' }}
                     disabled={orderflag}
                      onChange={this.selectwy}
                      allowClear
                    >
                      {
                        isNotBlank(this.state.outsourcingType) && this.state.outsourcingType.length > 0 && this.state.outsourcingType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='委外分公司'>
                  {getFieldDecorator('wyOffice', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.applyName) ? cpAfterEntrustFromGet.applyName : ''),
                      rules: [
                        {
                          required: this.state.wyString=="2"?true:false,
                          message: '请选择委外分公司',
                        },
                      ],
                    })(
                    <Input
                      style={{ width: '50%' }}
                      value={isNotBlank(selectgsdata) && isNotBlank(selectgsdata.name) ? selectgsdata.name :
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.applyName) ? cpAfterEntrustFromGet.applyName : '')
                      }
                      disabled
                    />
                    )}
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectgs} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='图片' className="allimgstyle">
                    <Upload
                      disabled
                      //   disabled={orderflag&&updataflag}
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
                      style={{ width: '50%' }}
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.name) ?
                        selectywydata.name : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user) ? cpAfterEntrustFromGet.user.name : getStorage('username'))}
                    />
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => this.onselect(1)} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.no) ?
                        selectywydata.no : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user) ? cpAfterEntrustFromGet.user.no : getStorage('userno'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.companyName) ? selectywydata.companyName
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user) && isNotBlank(cpAfterEntrustFromGet.user.office) ? cpAfterEntrustFromGet.user.office.name : getStorage('companyname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.areaName) ? selectywydata.areaName
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user) && isNotBlank(cpAfterEntrustFromGet.user.areaName) ? cpAfterEntrustFromGet.user.areaName : getStorage('areaname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属部门'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.dept) ?
                        selectywydata.dept.name : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user) && isNotBlank(cpAfterEntrustFromGet.user.dept) ? cpAfterEntrustFromGet.user.dept.name : getStorage('deptname'))}
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
                      style={{ width: '50%' }}
                      disabled
                      value={(isNotBlank(selectkhdata) && isNotBlank(selectkhdata.userOffice) && isNotBlank(selectkhdata.userOffice.name) ? selectkhdata.userOffice.name :
                        isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client) && isNotBlank(cpAfterEntrustFromGet.client.clientCpmpany) ? cpAfterEntrustFromGet.client.clientCpmpany : '')}
                    />
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client) ? cpAfterEntrustFromGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.classify) ? selectkhdata.classify
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client) && isNotBlank(cpAfterEntrustFromGet.client.classify) ? cpAfterEntrustFromGet.client.classify : '')}
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
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.code) ? selectkhdata.code
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client) ? cpAfterEntrustFromGet.client.code : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client) ? cpAfterEntrustFromGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.address) ? selectkhdata.address
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client) ? cpAfterEntrustFromGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.phone) ? selectkhdata.phone
                        : (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client) ? cpAfterEntrustFromGet.client.phone : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="故障反馈" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='质保时间'>
                    <Select
                      disabled
                      allowClear
                      style={{ width: '50%' }}
                      value={`${this.state.selectyear} 年`}
                      onChange={this.editYear}
                    >
                      {
                        isNotBlank(yeardata) && yeardata.length > 0 && yeardata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
                      }
                    </Select>
                    <Select
                      disabled
                      allowClear
                      style={{ width: '50%' }}
                      value={`${this.state.selectmonth} 月`}
                      onChange={this.editMonth}
                    >
                      {
                        isNotBlank(monthdata) && monthdata.length > 0 && monthdata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    {getFieldDecorator('linkman', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.linkman) ? cpAfterEntrustFromGet.linkman : ''),
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
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.phone) ? cpAfterEntrustFromGet.phone : ''),
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
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.ischarge) ? cpAfterEntrustFromGet.ischarge : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入是否收费',
                        },
                      ],
                    })(
                      <Select
                        disabled={orderflag && updataflag}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        <Option key={'1'} value={'1'}>是</Option>
                        <Option key={'0'} value={'0'}>否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='售后地址' className="allinputstyle">
                    {getFieldDecorator('afterAddress', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.afterAddress) ? cpAfterEntrustFromGet.afterAddress : '',
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
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.z) ? cpAfterEntrustFromGet.z : '',
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
                      {(isNotBlank(fileList) && fileList.length >= 4) || (orderflag && updataflag) ? null : uploadButton}
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="总成信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成型号'>
                    {getFieldDecorator('cabname', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyModel) ? cpAfterEntrustFromGet.assmblyBuild.assemblyModel : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成号'>
                    {getFieldDecorator('assemblyCode', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyCode) ? cpAfterEntrustFromGet.assmblyBuild.assemblyCode : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成品牌'>
                    {getFieldDecorator('assemblyBrandname', {
                      initialValue: (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyBrand) ? cpAfterEntrustFromGet.assmblyBuild.assemblyBrand : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyBrand) ? cpAfterEntrustFromGet.assmblyBuild.assemblyBrand : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车型/排量'>
                    {getFieldDecorator('assemblyVehicleEmissionsname', {
                      initialValue: (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.vehicleModel) ? cpAfterEntrustFromGet.assmblyBuild.vehicleModel : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.vehicleModel) ? cpAfterEntrustFromGet.assmblyBuild.vehicleModel : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='年份'>
                    {getFieldDecorator('assemblyYearname', {
                      initialValue: (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyYear) ? cpAfterEntrustFromGet.assmblyBuild.assemblyYear : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyYear) ? cpAfterEntrustFromGet.assmblyBuild.assemblyYear : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='技术参数'>
                    {getFieldDecorator('technicalParameters', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.technicalParameters) ? cpAfterEntrustFromGet.technicalParameters : '',
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
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assemblySteelSeal) ? cpAfterEntrustFromGet.assemblySteelSeal : '',
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
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assemblyVin) ? cpAfterEntrustFromGet.assemblyVin : '',
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
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assemblyMessage) ? cpAfterEntrustFromGet.assemblyMessage : '',
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
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.maintenanceProject) ? cpAfterEntrustFromGet.maintenanceProject : ''),
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
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.tripMileage) ? cpAfterEntrustFromGet.tripMileage : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入行程里程',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车牌号'>
                    {getFieldDecorator('plateNumber', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.plateNumber) ? cpAfterEntrustFromGet.plateNumber : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入车牌号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='历史单号'>
                    {getFieldDecorator('historyCode', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.historyCode) ? cpAfterEntrustFromGet.historyCode : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入历史单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='维修历史' className="allinputstyle">
                    {getFieldDecorator('maintenanceHistory', {
                      initialValue:
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.maintenanceHistory) ? cpAfterEntrustFromGet.maintenanceHistory : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入维修历史',
                        },
                      ],
                    })(<TextArea disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.remarks) ? cpAfterEntrustFromGet.remarks : '',
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
            </Card>
            <Card title="售后方案" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="计划开始日期">
                    {getFieldDecorator('planStartDate', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planStartDate) ? moment(cpAfterEntrustFromGet.planStartDate) : null,
                    })(
                      <DatePicker
                        disabled={orderflag && updataflag}

                        format="YYYY-MM-DD"
                        disabled={orderflag}
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="计划结束日期">
                    {getFieldDecorator('planEndDate', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planEndDate) ? moment(cpAfterEntrustFromGet.planEndDate) : null,
                    })(
                      <DatePicker

                        format="YYYY-MM-DD"
                        disabled={orderflag && updataflag}
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='派发人'>
                    {getFieldDecorator('planNumberName', {
                      initialValue: isNotBlank(selectdata) && isNotBlank(selectdata.name) ? selectdata.name :
                        (isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planNumberName) ? cpAfterEntrustFromGet.planNumberName : ''),
                      rules: [
                        {
                          required: true,
                          message: '请选择派发人',
                        },
                      ],
                    })(<Input disabled style={{ width: '50%' }} />)}
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => this.onselect(2)} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='处理方式' className="allinputstyle">
                    {getFieldDecorator('processMode', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.processMode) ? cpAfterEntrustFromGet.processMode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入处理方式',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='售后安排' className="allinputstyle">
                    {getFieldDecorator('afterArrangement', {
                      initialValue: isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.afterArrangement) ? cpAfterEntrustFromGet.afterArrangement : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后安排',
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                打印
          </Button>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterEntrustFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterEntrustFrom')[0].children.filter(item => item.name == '二次修改')
                  .length > 0 &&
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                  {updataname}
                </Button>
              }
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterEntrustFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterEntrustFrom')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <span>
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
                    保存
  </Button>
                  <Button type="primary" style={{ marginRight: '8px', marginLeft: '8px' }} htmlType="submit" loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
                    提交
  </Button>
                  {
                    (cpAfterEntrustFromGet.orderStatus === 1 || cpAfterEntrustFromGet.orderStatus === '1') &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1 || submitting2} onClick={() => this.onUndo(cpAfterEntrustFromGet.id)}>
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

        <CreateFormgs {...parentMethodsgs} selectgsflag={selectgsflag} />
        <SearchForm {...parentSearchMethods} khsearchVisible={khsearchVisible} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateForm {...parentMethods} selectflag={selectflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpAfterEntrustFromForm;

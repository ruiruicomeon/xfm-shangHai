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
  Table,
  Row,
  Cascader,
  Popconfirm,
  Col,
  DatePicker
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragTable from '../../components/StandardEditTable/dragTable'
import styles from './cpAfterHistoryFromForm.less';
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
const CreateFormzc = Form.create()(props => {
  const { handleModalVisiblezc, selectzcflag, selectzc, cpAssemblyBuildList, form, handleSearchChangezc, dispatch } = props;
  const { getFieldDecorator } = form
  const columnzcs = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectzc(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '业务项目',
      dataIndex: 'project',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '总成型号',
      dataIndex: 'assemblyModel',
      inputType: 'text',
      width: 150,
      align: 'center',
      editable: true,
    },
    {
      title: '总成号',
      dataIndex: 'assemblyCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '大号',
      dataIndex: 'maxCode',
      inputType: 'text',
      width: 150,
      align: 'center',
      editable: true,
    },
    {
      title: '小号',
      dataIndex: 'minCode',
      inputType: 'text',
      width: 150,
      align: 'center',
      editable: true,
    },
    {
      title: '总成分类',
      dataIndex: 'assemblyType',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true
    },
    {
      title: '类型编码',
      dataIndex: 'lxCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '分类编码',
      dataIndex: 'flCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '技术参数',
      dataIndex: 'technicalParameter',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '车型',
      dataIndex: 'vehicleModel',
      inputType: 'text',
      width: 150,
      align: 'center',
      editable: true,
    },
    {
      title: '品牌',
      dataIndex: 'assemblyBrand',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '年份',
      dataIndex: 'assemblyYear',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '品牌编码',
      dataIndex: 'brandCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true
    },
    {
      title: '一级编码型号',
      dataIndex: 'oneCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true
    },
    {
      title: '绑定系列数量',
      dataIndex: 'bindingNumber',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true
    },
    {
      title: '原厂编码',
      dataIndex: 'originalCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '再制造编码',
      dataIndex: 'makeCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true
    },
    {
      title: '提成类型',
      dataIndex: 'pushType',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      width: 150,
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
      width: 150,
      align: 'center',
      editable: true,
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
      };
      Object.keys(values).map((item) => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpAssemblyBuild/cpAssemblyBuild_List',
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
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
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
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: params,
    });
  };
  return (
    <Modal
      title='选择总成'
      visible={selectzcflag}
      onCancel={() => handleModalVisiblezc()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="业务项目">
              {getFieldDecorator('project', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
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
        scroll={{ x: 2300 }}
        onChange={handleStandardTableChange}
        data={cpAssemblyBuildList}
        columns={columnzcs}
      />
    </Modal>
  );
});
const CreateFormshr = Form.create()(props => {
  const { handleModalVisibleshr, modeluserList, selectshrflag, selectshr, selectedRows, handleSelectRows, levellist, levellist2, newdeptlist, dispatch, form } = props;
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
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.companyName)) {
        values.companyName = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
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
      visible={selectshrflag}
      onCancel={() => handleModalVisibleshr()}
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
@Form.create()

class SearchFormzc extends PureComponent {
  okHandle = () => {
    const { form, handleSearchAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearchAddzc(fieldsValue);
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
        onCancel={() => handleSearchVisiblezc(false)}
        afterClose={() => handleSearchVisiblezc()}
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
        onCancel={() => handleSearchVisible(false)}
        afterClose={() => handleSearchVisible()}
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
const CreateForm = Form.create()(props => {
  const { handleModalVisible, userlist, selectflag, selectuser, levellist, levellist2, newdeptlist, form, dispatch } = props;
  const { getFieldDecorator } = form
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
  };
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
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'sysuser/fetch',
      payload: params,
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
  return (
    <Modal
      title='选择业务员'
      visible={selectflag}
      onCancel={() => handleModalVisible()}
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
  const { handleModalVisiblekh, cpClientList, selectkhflag, selectcustomer, handleSearchChange, form, dispatch } = props;
  const { getFieldDecorator } = form
  const columnskh = [
    {
      title: '操作',
      width: 100,
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
@connect(({ cpAfterApplicationFrom, loading, sysuser, cpClient, sysdept, syslevel, cpAssemblyBuild }) => ({
  ...cpAfterApplicationFrom,
  ...sysuser,
  ...cpClient,
  ...syslevel,
  ...sysdept,
  ...cpAssemblyBuild,
  newdeptlist: sysdept.deptlist.list,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpAfterApplicationFrom/add_CpAfterApplicationFromHistory'],
  submitting2: loading.effects['cpupdata/cpAfterApplicationFrom_update'],
}))
@Form.create()
class cpAfterHistoryFromForm extends PureComponent {
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
      selectzcflag: false,
      selectshrflag: false,
      showdata: [],
      showflag: false,
      indexstatus: 0,
      planflag: false,
      updataflag: true,
      confirmflag: true,
      confirmflag1: true,
      cpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
      { name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
      { name: 'Y' }, { name: 'Z' }],
      incpzim: [],
      updataname: '取消锁定',
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location, cpzim } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        // type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Get',
        type: 'cpAfterApplicationFrom/get_CpAfterApplicationFromHistory',
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
              } else if (newselwenz == '甘'  || newselwenz == '辽') {
                this.setState({
                  incpzim: cpzim.slice(0, 14)
                })
              }  else if (newselwenz == '贵' || newselwenz == '吉') {
                this.setState({
                  incpzim: cpzim.slice(0, 9)
                })
              } else if (newselwenz == '黑' || newselwenz == '桂'|| newselwenz == '新') {
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
          // if (allUser.length === 0) {
          // 	if(isNotBlank(res.data)&&isNotBlank(res.data.qualityTime)){
          // 	if (res.data.qualityTime.split(',')[0] <= 0 && res.data.qualityTime.split(',')[1] <= 0) {
          // 		this.setState({ showdata: [{ id: 1, id: 2 }] })
          // 	} else {
          // 		this.setState({ showdata: [{ id: 1 }] })
          // 	}
          // 	} else {
          // 		this.setState({ showdata: [] })
          // 	}
          // } else {
          // 	this.setState({
          // 		showdata: allUser
          // 	})
          // }
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
      type: 'cpAfterApplicationFrom/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, CpAfterApplicationFromHistoryGet } = this.props;
    const { addfileList, addfileList1, location, selectyear, selectmonth, selectkhdata, selectdata, selectywydata, updataflag, showdata, selectzcdata,
      selwenz, selzim, selinputcp } = this.state;
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
          value.oldPhoto = addfileList.join('|')
        } else {
          value.oldPhoto = '';
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
        value.type = 1
        value.ids = idarr.join(',')
        value.plateNumber = (isNotBlank(selwenz) ? selwenz : '') + (isNotBlank(selzim) ? selzim : '') + (isNotBlank(selinputcp) ? selinputcp : '')
        value.permitDate = moment(value.permitDate).format("YYYY-MM-DD")
        value.planNumber = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
          (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.planNumber) ? CpAfterApplicationFromHistoryGet.planNumber : '')
        value.qualityTime = `${selectyear}, ${selectmonth}`
        value.approvals = isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.approvals) ? CpAfterApplicationFromHistoryGet.approvals : 0
        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client)) ? CpAfterApplicationFromHistoryGet.client.id : '')
        value.user.id = (isNotBlank(selectywydata) && isNotBlank(selectywydata.id)) ? selectywydata.id : ((isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.user)) ? CpAfterApplicationFromHistoryGet.user.id : getStorage('userid'))
        value.submit = 1
        value.orderStatus = 3
        value.assmblyBuild = {}
        value.assmblyBuild.id = isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? selectzcdata.id
          : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.id) ? CpAfterApplicationFromHistoryGet.assmblyBuild.id : '')
        if (updataflag) {
          dispatch({
            // type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Add',
            type: 'cpAfterApplicationFrom/add_CpAfterApplicationFromHistory',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push('/accessories/process/cp_after_history_from_list');
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
              router.push('/accessories/process/cp_after_history_from_list');
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
      router.push(`/accessories/process/cp_after_history_from_form?id=${location.query.id}`);
    }
  }

  onsave = e => {
    const { dispatch, form, CpAfterApplicationFromHistoryGet } = this.props;
    const { addfileList, addfileList1, location, selectyear, selectmonth, selectkhdata, selectdata, selectywydata, updataflag, showdata, selectzcdata
      , selwenz, selzim, selinputcp } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.errorDescription = addfileList.join('|')
        } else {
          value.errorDescription = '';
        }

        if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
          value.oldPhoto = addfileList.join('|')
        } else {
          value.oldPhoto = '';
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
        value.type = 1
        value.plateNumber = (isNotBlank(selwenz) ? selwenz : '') + (isNotBlank(selzim) ? selzim : '') + (isNotBlank(selinputcp) ? selinputcp : '')
        value.ids = idarr.join(',')
        value.approvals = isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.approvals) ? CpAfterApplicationFromHistoryGet.approvals : 0
        value.permitDate = moment(value.permitDate).format("YYYY-MM-DD")
        value.planNumber = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
          (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.planNumber) ? CpAfterApplicationFromHistoryGet.planNumber : '')
        value.qualityTime = `${selectyear}, ${selectmonth}`
        value.client = {}
        value.user = {}
        value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client)) ? CpAfterApplicationFromHistoryGet.client.id : '')
        value.user.id = (isNotBlank(selectywydata) && isNotBlank(selectywydata.id)) ? selectywydata.id : ((isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.user)) ? CpAfterApplicationFromHistoryGet.user.id : getStorage('userid'))
        value.assmblyBuild = {}
        value.assmblyBuild.id = isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? selectzcdata.id
          : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.id) ? CpAfterApplicationFromHistoryGet.assmblyBuild.id : '')
        if (updataflag) {
          value.submit = 0
          value.orderStatus = 3
          dispatch({
            // type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_save',
            type: 'cpAfterApplicationFrom/save_CpAfterApplicationFromHistory',
            payload: { ...value },
            callback: (res) => {
              router.push(`/accessories/process/cp_after_history_from_form?id=${res.data.id}`);
            }
          })
        } else {
          value.orderStatus = 3
          value.submit = 1
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
  };

  onCancelCancel = () => {
    router.push('/accessories/process/cp_after_history_from_list');
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


  handleCancel1 = () => this.setState({ previewVisible: false });

  handlePreview1 = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleImage1 = url => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  };

  handleRemove1 = file => {
    this.setState(({ fileList1, addfileList1 }) => {
      const index = fileList1.indexOf(file);
      const newFileList = fileList1.slice();
      newFileList.splice(index, 1);
      const newaddfileList = addfileList1.slice();
      newaddfileList.splice(index, 1);
      return {
        fileList1: newFileList,
        addfileList1: newaddfileList,
      };
    });
  };

  handlebeforeUpload1 = file => {
    const { dispatch } = this.props
    const { addfileList1 } = this.state;
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
          if (!isNotBlank(addfileList1) || addfileList1.length <= 0) {
            this.setState({
              addfileList1: [res],
            });
          } else {
            this.setState({
              addfileList1: [...addfileList1, res],
            });
          }
        }
      })
    }
    return isLt10M && isimg;
  };

  handleUploadChange1 = info => {
    const isimg = info.file.type.indexOf('image') >= 0;
    const isLt10M = info.file.size / 1024 / 1024 <= 10;
    if (info.file.status === 'done') {
      if (isLt10M && isimg) {
        this.setState({ fileList1: info.fileList });
      }
    } else {
      this.setState({ fileList1: info.fileList });
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
      this.setState({
        selectdata: record,
        selectflag: false
      })
    }
  }

  onselect = (i) => {
    const { dispatch } = this.props
    this.setState({ selecti: i })
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
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
      },
    });
    dispatch({
      type: 'syslevel/query_office',
    });
    dispatch({
      type: 'sysdept/query_dept'
    });
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
    // if ((!isNotBlank(val) || val <= 0) && (!isNotBlank(selectmonth) || selectmonth <= 0)) {
    // 	if (showdata.length === 0) {
    // 		this.setState({ showdata: [{ id: 1 }, { id: 2 }] })
    // 	} else if (showdata.length === 1) {
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.push({ id: 2 })
    // 		this.setState({ showdata: newData })
    // 	} else if (showdata.length > 2) {
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.splice(0, 2)
    // 		this.setState({ showdata: newData })
    // 	}
    // } else if (showdata.length == 0) {
    // 		this.setState({ showdata: [{ id: 1 }] })
    // 	} else if (showdata.length > 1) {
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.splice(0, 1)
    // 		this.setState({ showdata: newData })
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
    // if ((!isNotBlank(selectyear) || selectyear <= 0) && (!isNotBlank(val) || val <= 0)) {
    // 	if (showdata.length === 0) {
    // 		this.setState({ showdata: [{ id: 1 }, { id: 2 }] })
    // 	} else if (showdata.length === 1) {
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.push({ id: 2 })
    // 		this.setState({ showdata: newData })
    // 	} else if (showdata.length > 2) {
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.splice(0, 2)
    // 	}
    // } else if (showdata.length == 0) {
    // 		this.setState({ showdata: [{ id: 1 }] })
    // 	} else if (showdata.length > 1) {
    // 		const newData = showdata.map(item => ({ ...item }));
    // 		newData.splice(0, 1)
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
  // 	let newselectkhdata = []
  // 	if (showdata.length === 0) {
  // 		newselectkhdata = []
  // 	} else {
  // 		newselectkhdata = showdata.map(item => ({ ...item }));
  // 	}
  // 	let newindex = ''
  // 	record.status = 0
  // 	showdata.forEach((i, index) => {
  // 		if (i.id === indexflag) {
  // 			newindex = index
  // 		}
  // 	})
  // 	newselectkhdata.splice(newindex, 1, record)
  // 	this.setState({ showdata: newselectkhdata, selectshrflag: false })
  // }

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const { location, indexstatus } = this.state
    dispatch({
      type: 'cpAfterApplicationFrom/CpAfter_ApplicationFromHistory_isPass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpAfterApplicationFrom/get_CpAfterApplicationFromHistory',
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
            if (allUser.length === 0) {
              if (res.data.qualityTime.split(',')[0] <= 0 && res.data.qualityTime.split(',')[1] <= 0) {
                this.setState({ showdata: [{ id: 1, id: 2 }] })
              } else {
                this.setState({ showdata: [{ id: 1 }] })
              }
            } else {
              this.setState({
                showdata: allUser
              })
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

  onselectshr = (key) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': 3,
        'office.id': getStorage('companyId')
      }
    });
    this.setState({
      indexflag: key,
      selectshrflag: true
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
      },
    });
    dispatch({
      type: 'syslevel/query_office',
    });
    dispatch({
      type: 'sysdept/query_dept'
    });
  }

  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该售后历史单',
      content: '确定撤销该售后历史单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(record),
    });
  }

  undoClick = (id) => {
    const { dispatch } = this.props
    const { confirmflag } = this.state
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
        type: 'cpAfterApplicationFrom/CpAfter_ApplicationFromHistory_Revocation',
        payload: {
          id
        },
        callback: () => {
          router.push('/accessories/process/cp_after_history_from_list');
        }
      })
    }
  }

  onUndoresubmit = (record) => {
    Modal.confirm({
      title: '重新提交该售后历史单',
      content: '确定重新提交该售后历史单吗？',
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
        type: 'cpAfterApplicationFrom/CpAfter_ApplicationFromHistory_Resubmit',
        payload: {
          id: location.query.id
        },
        callback: () => {
          dispatch({
            type: 'cpAfterApplicationFrom/get_CpAfterApplicationFromHistory',
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
              if (allUser.length === 0) {
                if (res.data.qualityTime.split(',')[0] <= 0 && res.data.qualityTime.split(',')[1] <= 0) {
                  this.setState({ showdata: [{ id: 1, id: 2 }] })
                } else {
                  this.setState({ showdata: [{ id: 1 }] })
                }
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
      type: 'cpAfterApplicationFrom/CpAfter_ApplicationFromHistory_isPass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpAfterApplicationFrom/get_CpAfterApplicationFromHistory',
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
            if (allUser.length === 0) {
              if (res.data.qualityTime.split(',')[0] <= 0 && res.data.qualityTime.split(',')[1] <= 0) {
                this.setState({ showdata: [{ id: 1, id: 2 }] })
              } else {
                this.setState({ showdata: [{ id: 1 }] })
              }
            } else {
              this.setState({
                showdata: allUser
              })
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

  handleSearchVisible = () => {
    this.setState({
      khsearchVisible: false,
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
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      khsearchVisible: false,
    });
  }

  handleModalVisiblezc = flag => {
    this.setState({
      selectzcflag: !!flag
    });
  };

  selectzc = (record) => {
    this.props.form.setFieldsValue({
      xh: isNotBlank(record) && isNotBlank(record.assemblyModel) ? record.assemblyModel : '',
    });
    this.setState({
      selectzcdata: record,
      selectzcflag: false
    })
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

  onselectzc = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        pageSize: 10,
      }, callback: () => {
        this.setState({
          selectzcflag: true
        })
      }
    });
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
      } else if (e == '甘'  || e == '辽') {
        this.setState({
          incpzim: cpzim.slice(0, 14)
        })
      } else if (e == '贵' || e == '吉') {
        this.setState({
          incpzim: cpzim.slice(0, 9)
        })
      } else if (e == '黑' || e == '桂' || e == '新') {
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

  handleSearchVisiblezc = () => {
    this.setState({
      searchVisiblezc: false,
    });
  };

  handleSearchAddzc = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      searchVisiblezc: false,
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
    const { fileList, fileList1, previewVisible, previewImage, selectflag, orderflag, selectdata, selectkhflag, selectkhdata, selectywydata, showflag,
      modalVisiblepass, planflag, khsearchVisible, updataflag, updataname, selectshrflag, selectedRows, showdata, selectzcflag, selectzcdata,
      incpzim, selzim, selwenz, selinputcp, searchVisiblezc } = this.state;
    const { submitting1, submitting2, submitting, CpAfterApplicationFromHistoryGet, userlist,
      levellist, levellist2, newdeptlist, dispatch, cpClientList, cpClientSearchList, modeluserList, cpAssemblyBuildList, cpAssemblyBuildSearchList } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    console.log(CpAfterApplicationFromHistoryGet)

    const cphdata = [{ id: 1, name: '京' }, { id: 2, name: '津' }, { id: 3, name: '沪' }, { id: 4, name: '渝' }, { id: 5, name: '冀' },
    { id: 6, name: '豫' }, { id: 7, name: '云' }, { id: 8, name: '辽' }, { id: 9, name: '黑' }, { id: 10, name: '湘' }, { id: 11, name: '皖' },
    { id: 12, name: '鲁' }, { id: 13, name: '新' }, { id: 14, name: '苏' }, { id: 15, name: '浙' }, { id: 16, name: '赣' }, { id: 17, name: '鄂' }, { id: 18, name: '桂' },
    { id: 19, name: '甘' }, { id: 20, name: '晋' }, { id: 21, name: '蒙' }, { id: 22, name: '陕' }, { id: 23, name: '吉' }, { id: 24, name: '闽' }, { id: 25, name: '贵' },
    { id: 26, name: '粤' }, { id: 27, name: '青' }, { id: 28, name: '藏' }, { id: 29, name: '川' }, { id: 30, name: '宁' }, { id: 31, name: '琼' }, { id: 32, name: '港' },
    { id: 33, name: '澳' }, { id: 33, name: '台' }]
    const parentMethodszc = {
      handleAddzc: this.handleAddzc,
      handleModalVisiblezc: this.handleModalVisiblezc,
      selectzc: this.selectzc,
      cpAssemblyBuildList,
      dispatch,
      handleSearchChangezc: this.handleSearchChangezc
    }
    const parentMethodsshr = {
      handleAddkh: this.handleAddkh,
      handleModalVisibleshr: this.handleModalVisibleshr,
      handleSelectRows: this.handleSelectRows,
      selectedRows,
      selectshr: this.selectshr,
      dispatch,
      levellist, levellist2, newdeptlist,
      modeluserList
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
    const columnssh = [
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => {
          if ((!isNotBlank(CpAfterApplicationFromHistoryGet) || !isNotBlank(CpAfterApplicationFromHistoryGet.approvals)) || ((isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.approvals) &&
            (CpAfterApplicationFromHistoryGet.approvals === 0 || CpAfterApplicationFromHistoryGet.approvals === '0' || CpAfterApplicationFromHistoryGet.approvals === 4 || CpAfterApplicationFromHistoryGet.approvals === '4')))) {
            return (
              <span>
                <a onClick={e => this.onselectshr(record.id)}>选择</a>
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
          if (isNotBlank(CpAfterApplicationFromHistoryGet) && (CpAfterApplicationFromHistoryGet.approvals !== 0 || CpAfterApplicationFromHistoryGet.approvals !== '0')) {
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
          if (((isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (CpAfterApplicationFromHistoryGet.approvals === 0 || CpAfterApplicationFromHistoryGet.approvals === '0')) ||
            (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.createBy) && (CpAfterApplicationFromHistoryGet.approvals === 2 || CpAfterApplicationFromHistoryGet.approvals === '2')) ||
            (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.createBy) && (CpAfterApplicationFromHistoryGet.approvals === 4 || CpAfterApplicationFromHistoryGet.approvals === '4'))
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
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

    const parentSearchMethodszc = {
      handleSearchVisiblezc: this.handleSearchVisiblezc,
      handleSearchAddzc: this.handleSearchAddzc,
      cpAssemblyBuildSearchList,
    }


    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpClientSearchList,
      khsearchVisible
    }
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      handleSearch: this.handleSearch,
      handleFormReset: this.handleFormReset,
      userlist,
      levellist, levellist2, newdeptlist, dispatch
    }
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      cpClientList,
      handleSearchChange: this.handleSearchChange,
      dispatch
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    const appData = (apps) => {
      if (apps === 0 || apps === '0') {
        return '待分配'
      }
      if (apps === 1 || apps === '1') {
        return '待审核'
      }
      if (apps === 2 || apps === '2') {
        return '待分配'
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
              售后历史单
        </div>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='售后编号' className="allimgstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.orderCode) ? CpAfterApplicationFromHistoryGet.orderCode : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入售后编号',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='审批进度'>
                    <Input

                      value={isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.approvals) ?
                        appData(CpAfterApplicationFromHistoryGet.approvals) : ''}
                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单分类'>
                    {getFieldDecorator('orderType', {
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.orderType) ? CpAfterApplicationFromHistoryGet.orderType : ''),
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

                        disabled={orderflag}
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
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.project) ? CpAfterApplicationFromHistoryGet.project : ''),
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

                        disabled={orderflag}
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
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.dicth) ? CpAfterApplicationFromHistoryGet.dicth : ''),
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

                        disabled={orderflag}
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
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.businessType) ? CpAfterApplicationFromHistoryGet.businessType : ''),
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

                        disabled={orderflag}
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
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.settlementType) ? CpAfterApplicationFromHistoryGet.settlementType : ''),
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

                        disabled={orderflag}
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
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.insuranceCompanyId) ? CpAfterApplicationFromHistoryGet.insuranceCompanyId : ''),
                      rules: [
                        {
                          required: false,
                          message: '请选择保险公司',
                        },
                      ],
                    })(<Select
                      style={{ width: '100%' }}
                      disabled={orderflag}
                      allowClear
                    >
                      {
                        isNotBlank(this.state.insuranceCompany) && this.state.insuranceCompany.length > 0 && this.state.insuranceCompany.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='品牌'>
                    {getFieldDecorator('brand', {
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.brand) ? CpAfterApplicationFromHistoryGet.brand : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入品牌',
                        },
                      ],
                    })(<Select
                      style={{ width: '100%' }}
                      disabled={orderflag}
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
                      initialValue: isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.permitDate) ? moment(CpAfterApplicationFromHistoryGet.permitDate) : null,
                      rules: [
                        {
                          required: true,
                          message: '请选择放行单完成时间',
                        },
                      ],
                    })(
                      <DatePicker
                        disabled={orderflag}

                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='质保范围'>
                    {getFieldDecorator('x', {
                      initialValue: (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.x) ? CpAfterApplicationFromHistoryGet.x : ''),
                      rules: [
                        {
                          required: false,
                          message: '质保范围',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="图片" className="allimgstyle">
                    <Upload
                      disabled={orderflag && updataflag}
                      accept="image/*"
                      onChange={this.handleUploadChange1}
                      onRemove={this.handleRemove1}
                      beforeUpload={this.handlebeforeUpload1}
                      fileList={fileList1}
                      listType="picture-card"
                      onPreview={this.handlePreview1}
                    >
                      {(isNotBlank(fileList1) && fileList1.length >= 9) || (orderflag && updataflag) ? null : uploadButton}
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
                        selectywydata.name : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.user) ? CpAfterApplicationFromHistoryGet.user.name : getStorage('username'))}
                    />
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => this.onselect(1)} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.no) ?
                        selectywydata.no : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.user) ? CpAfterApplicationFromHistoryGet.user.no : getStorage('userno'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.companyName) ? selectywydata.companyName
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.user) && isNotBlank(CpAfterApplicationFromHistoryGet.user.office) ? CpAfterApplicationFromHistoryGet.user.office.name : getStorage('companyname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.areaName) ? selectywydata.areaName
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.areaName) ? CpAfterApplicationFromHistoryGet.areaName : getStorage('areaname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属部门'>
                    <Input
                      disabled
                      value={isNotBlank(selectywydata) && isNotBlank(selectywydata.dept) ?
                        selectywydata.dept.name : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.user) && isNotBlank(CpAfterApplicationFromHistoryGet.user.dept) ? CpAfterApplicationFromHistoryGet.user.dept.name : getStorage('deptname'))}
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
                        isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client) && isNotBlank(CpAfterApplicationFromHistoryGet.client.clientCpmpany) ? CpAfterApplicationFromHistoryGet.client.clientCpmpany : '')}
                    />
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client) ? CpAfterApplicationFromHistoryGet.client.name : '')}
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
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client) && isNotBlank(CpAfterApplicationFromHistoryGet.client.classify) ? CpAfterApplicationFromHistoryGet.client.classify : '')}
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
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client) ? CpAfterApplicationFromHistoryGet.client.code : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client) ? CpAfterApplicationFromHistoryGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.address) ? selectkhdata.address
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client) ? CpAfterApplicationFromHistoryGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input
                      disabled
                      value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.phone) ? selectkhdata.phone
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.client) ? CpAfterApplicationFromHistoryGet.client.phone : '')}
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
                          required: true,
                          message: '请选择质保时间',
                        },
                      ],
                    })(
                      <span>
                        <Select
                          disabled={orderflag}
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
                          disabled={orderflag}
                          allowClear
                          style={{ width: '50%' }}
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
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.linkman) ? CpAfterApplicationFromHistoryGet.linkman : ''),
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
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.phone) ? CpAfterApplicationFromHistoryGet.phone : ''),
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
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.ischarge) ? CpAfterApplicationFromHistoryGet.ischarge : ''),
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
                  <FormItem {...formItemLayout} label='售后地址' className="allimgstyle">
                    {getFieldDecorator('afterAddress', {
                      initialValue: isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.afterAddress) ? CpAfterApplicationFromHistoryGet.afterAddress : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后地址',
                          max: 500,
                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='本次故障描述' className="allimgstyle">
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
                      initialValue: isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? (isNotBlank(selectzcdata.assemblyModel) ? selectzcdata.assemblyModel : '')
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyModel) ? CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyModel : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        style={{ width: '50%' }}

                        disabled
                      />
                    )}
                    <Button type="primary" style={{ marginLeft: '8px' }} disabled={orderflag} onClick={this.onselectzc} loading={submitting}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成品牌'>
                    {getFieldDecorator('assemblyBrandname', {
                      initialValue: isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? (isNotBlank(selectzcdata.assemblyBrand) ? selectzcdata.assemblyBrand : '')
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyBrand) ? CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyBrand : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? (isNotBlank(selectzcdata.assemblyBrand) ? selectzcdata.assemblyBrand : '')
                          : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyBrand) ? CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyBrand : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车型/排量'>
                    {getFieldDecorator('assemblyVehicleEmissionsname', {
                      initialValue: isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? (isNotBlank(selectzcdata.vehicleModel) ? selectzcdata.vehicleModel : '')
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.vehicleModel) ? CpAfterApplicationFromHistoryGet.assmblyBuild.vehicleModel : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? (isNotBlank(selectzcdata.vehicleModel) ? selectzcdata.vehicleModel : '')
                          : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.vehicleModel) ? CpAfterApplicationFromHistoryGet.assmblyBuild.vehicleModel : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='年份'>
                    {getFieldDecorator('assemblyYearname', {
                      initialValue: isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? (isNotBlank(selectzcdata.assemblyYear) ? selectzcdata.assemblyYear : '')
                        : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyYear) ? CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyYear : ''),
                      rules: [
                        {
                          required: false,
                        },
                      ]
                    })(
                      <Input
                        value={isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id) ? (isNotBlank(selectzcdata.assemblyYear) ? selectzcdata.assemblyYear : '')
                          : (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild) && isNotBlank(CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyYear) ? CpAfterApplicationFromHistoryGet.assmblyBuild.assemblyYear : '')}

                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='技术参数'>
                    {getFieldDecorator('technicalParameters', {
                      initialValue: isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.technicalParameters) ? CpAfterApplicationFromHistoryGet.technicalParameters : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入技术参数',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='钢印号'>
                    {getFieldDecorator('assemblySteelSeal', {
                      initialValue: isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assemblySteelSeal) ? CpAfterApplicationFromHistoryGet.assemblySteelSeal : '',
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
                      initialValue: isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assemblyVin) ? CpAfterApplicationFromHistoryGet.assemblyVin : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入17位的VIN码',
                          max: 17,
                          min: 17
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='其他识别信息'>
                    {getFieldDecorator('assemblyMessage', {
                      initialValue: isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.assemblyMessage) ? CpAfterApplicationFromHistoryGet.assemblyMessage : '',
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
                  <FormItem {...formItemLayout} label='维修项目'>
                    {getFieldDecorator('maintenanceProject', {
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.maintenanceProject) ? CpAfterApplicationFromHistoryGet.maintenanceProject : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入维修项目',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='行程里程'>
                    {getFieldDecorator('tripMileage', {
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.tripMileage) ? CpAfterApplicationFromHistoryGet.tripMileage : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入行程里程',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车牌号'>
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

                      onChange={this.showinputcp}
                      disabled={orderflag && updataflag}
                      style={{ width: '40%' }}
                      value={selinputcp}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='历史单号'>
                    {getFieldDecorator('historyCode', {
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.historyCode) ? CpAfterApplicationFromHistoryGet.historyCode : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入历史单号',
                        },
                      ],
                    })(<Input disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='维修历史' className="allimgstyle">
                    {getFieldDecorator('maintenanceHistory', {
                      initialValue:
                        (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.maintenanceHistory) ? CpAfterApplicationFromHistoryGet.maintenanceHistory : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入维修历史',
                        },
                      ],
                    })(<TextArea disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.remarks) ? CpAfterApplicationFromHistoryGet.remarks : '',
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
                  disabled={!((JSON.stringify(CpAfterApplicationFromHistoryGet) == "{}") || (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.approvals) &&
                    (CpAfterApplicationFromHistoryGet.approvals === 0 || CpAfterApplicationFromHistoryGet.approvals === '0')) ||
                    (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.createBy) && (CpAfterApplicationFromHistoryGet.approvals === 2 || CpAfterApplicationFromHistoryGet.approvals === '2')) ||
                    (isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.createBy) && (CpAfterApplicationFromHistoryGet.approvals === 4 || CpAfterApplicationFromHistoryGet.approvals === '4'))
                  )}
                >
                  新增审核人
</Button>
              }

              {isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.isOperation) && (CpAfterApplicationFromHistoryGet.isOperation === 1 || CpAfterApplicationFromHistoryGet.isOperation === '1') &&
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
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                  {updataname}
                </Button>
              }
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterApplicationFrom')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <span>
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
                    保存
  </Button>
                  <Button type="primary" style={{ marginRight: '8px', marginLeft: '8px' }} htmlType="submit" loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
                    提交
  </Button>
                  {isNotBlank(CpAfterApplicationFromHistoryGet) && isNotBlank(CpAfterApplicationFromHistoryGet.approvals) &&
                    (CpAfterApplicationFromHistoryGet.approvals === 1 || CpAfterApplicationFromHistoryGet.approvals === '1') && isNotBlank(CpAfterApplicationFromHistoryGet.createBy) &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1 || submitting2} onClick={() => this.onUndoresubmit()}>
                      重新提交
                      </Button>
                  }
                  {
                    CpAfterApplicationFromHistoryGet.approvals === '3' &&
                    <Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(CpAfterApplicationFromHistoryGet.id)} loading={submitting1 || submitting2}>
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

        <SearchFormzc {...parentSearchMethodszc} searchVisiblezc={searchVisiblezc} />
        <CreateFormshr {...parentMethodsshr} selectshrflag={selectshrflag} />
        <SearchForm {...parentSearchMethods} khsearchVisible={khsearchVisible} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateForm {...parentMethods} selectflag={selectflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormzc {...parentMethodszc} selectzcflag={selectzcflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default cpAfterHistoryFromForm;

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
  Upload,
  Icon,
  Select,
  Cascader,
  Popconfirm
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import { stringify } from 'qs';
import styles from './SysUserList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const ImportFile = Form.create()(props => {
  const {
    modalImportVisible,
    handleImportVisible,
    UploadFileVisible,
    fileL,
    handleFileList,
  } = props;

  const Stoken = { token: getStorage('token') };

  const propsUpload = {
    name: 'file',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Beauty/sys/user/import',
    
    beforeUpload(file) {
      const isimg = file.type.indexOf('image') < 0;
      if (!isimg) {
        message.error('请选择Execl文件上传');
      }
      const isLt10M = file.size / 1024 / 1024 <= 100;
      if (!isLt10M) {
        message.error('文件大小需为100M以内');
      }
      return isimg && isLt10M;
    },
    onChange(info) {
      const isimg = info.file.type.indexOf('image') < 0;
      const isLt10M = info.file.size / 1024 / 1024 <= 100;
      let fileList = info.fileList.slice(-1);

      fileList = fileList.filter(file => {
        if (file.response) {
          if (file.response.success === '1') {
            message.success(file.response.msg);
            UploadFileVisible();
          } else if (
            isNotBlank(file) &&
            isNotBlank(file.response) &&
            isNotBlank(file.response.msg)
          ) {
            message.error(file.response.msg);
          }
          return file.response.success === '1';
        }
        return true;
      });
      
      if (isimg && isLt10M) {
        handleFileList(fileList);
      }
    },
  };

  return (
    <Modal
      title="导入用户表格"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入用户信息
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ loading, sysuser, syslevel, sysrole, sysdept, sysusercom }) => ({
  ...sysuser,
  ...sysrole,
  ...syslevel,
  ...sysdept,
  ...sysusercom,
  newdeptlist: sysdept.deptlist.list,
  loading: loading.models.sysuser,
}))
@Form.create()
class SysUserList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalImportVisible: false,
    importFileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize:10,
      },
    });
    dispatch({
      type: 'syslevel/fetch',
      payload: {
        type: 1,
        pageSize:100,
      },
    });
    dispatch({
      type: 'syslevel/fetch2',
      payload: {
        type: 2,
        pageSize:100,
      },
    });
    dispatch({
      type: 'syslevel/query_office'
    });
dispatch({
      type: 'sysdept/query_dept'
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    console.log(params)

    dispatch({
      type: 'sysuser/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysuser/fetch',
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    let ids = '';
    
    if (isNotBlank(id)) {
      ids = id;
    } 
    if (isNotBlank(ids)) {
      dispatch({
        type: 'sysuser/del_SysUser',
        payload: {
          id: ids
        },
        callback: () => {
          dispatch({
            type: 'sysuser/fetch',
                  });
          }
      });
    }
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,  
      };

      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.no)) {
        values.no = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.name)) {
        values.name = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.companyName)) {
        values.companyName= '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm = () => {
    const { levellist, levellist2, newdeptlist, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('no')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属大区">
              {getFieldDecorator('area.id', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }}  allowClear>
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
            <FormItem label="所属分公司">
              {getFieldDecorator('companyName', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }}  allowClear>
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
            <FormItem label="所属部门">
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
          <div>
            <span style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </div>
        </Row>
      </Form>
    );
  };

  renderForm = () => {
    return this.renderSimpleForm();
  };

  handleImportVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  handleFileList = fileData => {
    this.setState({
      importFileList: fileData,
    });
  };

  handleUpldExportClick = type => {
    const userid = { id: getStorage('userid'), isTemplate: type };
    window.open(`/api/Beauty/sys/user/export?${stringify(userid)}`);
  };

  handleModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)) {
      router.push(`/system/sys_user_form?id=${record.id}`);
    }
  };

  render() {
    const { userlist, loading } = this.props;
    const { selectedRows, importFileList, modalImportVisible } = this.state;

    const columns = [
      {
        title: '操作',
        width: 100,
        align: 'center' ,
        fixed: 'left', 
        render: record => {
         return <Fragment>
            <Link to={`/system/sys_user_form?id=${record.id}`}>详情</Link>
          </Fragment>
        },
      },
      {
        title: '编号',
        dataIndex: 'no',
        width: 150,
        render: (text, record) => <a onClick={() => this.handleModalChange(record)}>{text}</a>,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: 150,
        render: text => {
          if (isNotBlank(text)) {
            if (text === 0 || text === '0') {
              return <span>女</span>;
            }
            if (text === 1 || text === '1') {
              return <span>男</span>;
            }
          }
          return '';
        },
      },
      {
        title: '电话',
        dataIndex: 'phone',
        width: 150,
      },
      {
        title: '所属大区',
        dataIndex: 'area.name',
        width: 150,
      },
      {
        title: '所属分公司',
        dataIndex: 'companyName',
        width: 150,
      },
      {
        title: '所属部门',
        dataIndex: 'dept.name',
        width: 150,
      },
      {
        title: '所属区域',
        dataIndex: 'areaName',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        render: text => {
          if (isNotBlank(text)) {
            if (text === 0 || text === '0') {
              return <span>在职</span>;
            }
            if (text === 1 || text === '1') {
              return <span>离职</span>;
            }
          }
          return '';
        },
      },
      {
        title: '删除',
        width: 100,
        render: record => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='user').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='user')[0].children.filter(item=>item.name=='修改')
          .length>0?
          <Fragment>
          <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
          :''
        },
      },
    ];

    const onValidateForm = () => {
      router.push(`/system/sys_user_form`);
    };

    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.tableListOperator}>
          <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
            导入用户
          </Button>
          
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(0)}>
            导出模板
          </Button>
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(1)}>
            导出数据
          </Button>
        </div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} style={{'position':'relative'}}>
              {
                isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='user').length>0
                && JSON.parse(getStorage('menulist')).filter(item=>item.target=='user')[0].children.filter(item=>item.name=='修改')
                .length>0?
              <Button icon="plus" type="primary" onClick={onValidateForm}>
                新建
              </Button>:
              <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
              新建
            </Button>
              }
              <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
用户管理</span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 1050 }}
              
              loading={loading}
              data={userlist}
              columns={columns}
              
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default SysUserList;

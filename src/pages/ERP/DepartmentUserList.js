import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import { Row, Col, Card, Form, Input, Modal, TreeSelect, Icon, Button, Divider, message, Upload } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './DepartmentUserList.less';
import { isNotBlank } from '@/utils/utils';
import { stringify } from 'qs';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let values = {};
      if (isNotBlank(modalRecord) && isNotBlank(modalRecord.id)) {
        if (modalRecord.parentId) {
          values = { ...fieldsValue, id: modalRecord.id, parent: modalRecord.parentId };
        } else {
          values = { ...fieldsValue, id: modalRecord.id };
        }
      } else if (modalRecord.parentId) {
        values = { ...fieldsValue, parent: modalRecord.parentId }
      } else {
        values = { ...fieldsValue }
      }
      handleAdd(values);
    });
  };

  return (
    <Modal
      title={isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改部门信息' : '新建部门'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门编号">
        {form.getFieldDecorator('code', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.code) ? modalRecord.code : '',
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门名称">
        {form.getFieldDecorator('name', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',
          rules: [{ required: true, message: '请输入部门名称' }],
        })(<Input  />)}
      </FormItem>
      
    </Modal>
  );
});

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
    action: '/api/Beauty/sys/dept/import',
    
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
              <Icon type="upload" /> 上传导入部门信息
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ sysoffice, loading, sysdept }) => ({
  sysoffice,
  ...sysdept,
  
  loading: loading.models.sysoffice,
}))
@Form.create()
class DepartmentUserList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    modalVisible: false,
    formValues: {},
    modalRecord: {},
    modalImportVisible: false,
    importFileList: []
  };

  componentDidMount() {
    const { dispatch } = this.props;
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

    dispatch({
      type: 'sysdept/query_dept',
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
      type: 'sysdept/query_dept',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'sysdept/del_dept',
      payload: {
        
        ids: selectedRows.join(',')
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'sysdept/query_dept',
        });
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props
    dispatch({
      type: 'sysdept/add_dept',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'sysdept/query_dept'
        });
        this.setState({
          modalVisible: false,
        });
      }
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysdept/query_dept',
        payload: values,
      });
    });
  };

  handleModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)) {
      this.setState({
        modalRecord: record,
        modalVisible: true,
      });
    }
  };

  lowerModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)) {
      this.setState({
        modalRecord: { parentId: record.id, area: record.area },
        modalVisible: true,
      });
    }
  };

  renderSimpleForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm = () => {
    const { areaList, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="归属区域">
              {getFieldDecorator('area')(
                <TreeSelect
                  style={{ width: '100%' }}
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={areaList.list}
                  treeNodeFilterProp="label"
                  
                  treeDefaultExpandAll
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="部门负责人">
              {getFieldDecorator('master')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="部门电话">
              {getFieldDecorator('phone')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm = () => {
    const { expandForm } = this.state
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleImportVisible = flag => {
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

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  handleUpldExportClick = () => {
    const userid = { id: getStorage('userid') };
    window.open(`/api/Beauty/sys/dept/export?${stringify(userid)}`);
  };

  render() {
    const { loading, deptlist } = this.props;
    const { selectedRows, modalVisible, modalRecord, importFileList, modalImportVisible } = this.state;

    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        width: 200,
        render: (text, record) => {
            return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dept').length>0
            && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dept')[0].children.filter(item=>item.name=='修改')
            .length>0?
              <a onClick={() => this.handleModalChange(record)}>{text}</a>
            :text
        },
      },
      {
        title: '部门编号',
        dataIndex: 'code',
        width: 150,
      },
      {
        title: '操作',
        width: 150,
        render: record => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dept').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dept')[0].children.filter(item=>item.name=='修改')
          .length>0?
            <Fragment>
              <a onClick={() => this.handleModalChange(record)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.lowerModalChange(record)}>添加下级</a>
            </Fragment>
          :''
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalRecord
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
            导入
          </Button>
          
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(0)}>
            导出
          </Button>
        </div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            
            <div className={styles.tableListOperator} style={{'position':'relative'}}>

              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'dept').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'dept')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                  </Button>
              }
              {selectedRows.length > 0 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'dept').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'dept')[0].children.filter(item => item.name == '修改')
                  .length > 0 && (
                  <span>
                  
                    <Button onClick={() => this.removeClick()}>删除</Button>
                  
                  </span>
              )}
              <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
              </Button>
              <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
部门管理
              </span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 550 }}
              selectedRows={selectedRows}
              loading={loading}
              defaultExpandAllRows
              data={{list:isNotBlank(deptlist)&&isNotBlank(deptlist.list)&&deptlist.list.length>0?deptlist.list:[],pagination:{total:isNotBlank(deptlist)&&isNotBlank(deptlist.list)&&deptlist.list.length>0?deptlist.list.length:0}}}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default DepartmentUserList;

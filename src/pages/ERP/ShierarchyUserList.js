import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Upload, Icon, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import styles from './ShierarchyUserList.less';
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
        values = { ...fieldsValue, id: modalRecord.id, parent: 1 };
      } else {
        values = { ...fieldsValue, parent: 1 };
      }

      handleAdd(values);
    });
  };

  return (
    <Modal
      title={isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改大区信息' : '新建大区'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="大区名称">
        {form.getFieldDecorator('name', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',
          rules: [{ required: true, message: '请输入大区名称' }],
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="大区编号">
        {form.getFieldDecorator('code', {
          initialValue:
            isNotBlank(modalRecord) && isNotBlank(modalRecord.code) ? modalRecord.code : '',
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
    action: '/api/Beauty/sys/area/import',
    
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
      title="导入大区表格"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入大区信息
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ sysuser, loading, syslevel }) => ({
  
  ...syslevel,
  ...sysuser,
  
  loading: loading.models.sysuser,
}))
@Form.create()
class ShierarchyUserList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisible: false,
    modalRecord: {},
    modalImportVisible: false,
    importFileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });

    dispatch({
      type: 'syslevel/fetch',
      payload: {
        type: 1,
        current: 1,
        pageSize: 10,
      },
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
      type: 'sysuser/fetch',
      payload: params,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'syslevel/add_office',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'syslevel/fetch',
          payload: {
            type: 1,
            current: 1,
            pageSize: 10,
          },
        });
        that.setState({
          modalVisible: false,
        });
      },
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
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'syslevel/del_office',
      payload: {
        ids: selectedRows.join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'syslevel/fetch',
          payload: {
            type: 1,
            current: 1,
            pageSize: 10,
          },
        });
      },
    });
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登录名">
              {getFieldDecorator('loginName')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          <div>
            <span style={{ float: 'right', marginBottom: 24 }}>
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  editoffice = record => {
    this.setState({
      modalVisible: true,
      modalRecord: record,
    });
  };

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
    window.open(`/api/Beauty/sys/area/export?${stringify(userid)}`);
  };

  render() {
    const { levellist, loading } = this.props;
    const {
      selectedRows,
      modalVisible,
      modalRecord,
      importFileList,
      modalImportVisible,
    } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 150,
      },
      {
        title: '大区名称',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '操作',
        width: 150,
        render: record => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area')[0].children.filter(item=>item.name=='修改')
          .length>0?
            <Fragment>
              <a
                onClick={() => {
                this.editoffice(record);
              }}
              >
              修改
              </a>
            
            </Fragment>
          :''
        }
        ,
      },
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalRecord,
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
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area')[0].children.filter(item=>item.name=='修改')
          .length>0?
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
            </Button>
              :<Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
              </Button>
            }
              {selectedRows.length > 0 &&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area')[0].children.filter(item=>item.name=='修改')
          .length>0&& (
          <span>
                  
            <Button onClick={() => this.removeClick()}>删除</Button>
                  
          </span>
              )}
              <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
              </Button>
              <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
大区管理
              </span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 550 }}
              selectedRows={selectedRows}
              loading={loading}
              defaultExpandAllRows
              data={levellist}
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
export default ShierarchyUserList;

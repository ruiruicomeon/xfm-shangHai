/**
 * 公司管理
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Row, Col, Card, Form, Input, Modal, Select, Button, Upload, message, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import styles from './CompanyUserList.less';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import { stringify } from 'qs';
import { getStorage } from '@/utils/localStorageUtils';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, store, } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let values = {};
      if (isNotBlank(modalRecord) && isNotBlank(modalRecord.id)) {
        values = { ...fieldsValue, id: modalRecord.id };
      } else {
        values = { ...fieldsValue };
      }
      handleAdd(values);
    });
  };
  const isModalRecord = (val) => {
    if (isNotBlank(val) && isNotBlank(val.sort)) {
      return val.sort;
    } if (isNotBlank(store)) {
      return store;
    }
    return "";
  }
  const isSuperviseLevel = (val) => {
    if (isNotBlank(val) && isNotBlank(val.superviseLevel)) {
      return 'Ⅰ';
    } if (modalRecord.superviseLevel === 'Ⅲ' ||
      modalRecord.superviseLevel === '高' ||
      modalRecord.superviseLevel >= 3) {
      return 'Ⅲ';
    } if (modalRecord.superviseLevel === 'Ⅱ' ||
      modalRecord.superviseLevel === '中' ||
      modalRecord.superviseLevel === 2) {
      return 'Ⅱ';
    } if (modalRecord.superviseLevel === 'Ⅰ' ||
      modalRecord.superviseLevel === '低' ||
      modalRecord.superviseLevel <= 1) {
      return 'Ⅰ';
    }
    return 'Ⅲ';
  }
  return (
    <Modal
      title={
        isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改标准名' : '新建标准名'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类别名称">
        {form.getFieldDecorator('name', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',
          rules: [{ required: true, message: '请输入标准名名称' }],
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('sort', {
          initialValue:
            isModalRecord(modalRecord),
          rules: [{ required: true, message: '请输入序号' }],
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称">
        {form.getFieldDecorator('genre', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.genre) ? modalRecord.genre : '',
          rules: [{ required: true, message: '请输入分类名称' }],
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类编号">
        {form.getFieldDecorator('genreCode', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.genreCode) ? modalRecord.genreCode : '',
          rules: [{ required: true, message: '请输入分类编号' }],
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="管理级别">
        {form.getFieldDecorator('superviseLevel', {
          initialValue:
            isSuperviseLevel(modalRecord),
          rules: [{ required: true, message: '请选择管理级别' }],
        })(
          <Select style={{ width: '100%' }}>
            <Option value="Ⅰ">Ⅰ</Option>
            <Option value="Ⅱ">Ⅱ</Option>
            <Option value="Ⅲ">Ⅲ</Option>
          </Select>
        )}
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
    previewVisible, previewImage,
  } = props;
  const Stoken = { token: getStorage('token') };
  const propsUpload = {
    name: 'file',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Beauty/sys/office/import',
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
      title="导入公司表格"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入公司信息
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});
@connect(({ equistdname, loading, company }) => ({
  equistdname,
  ...company,
  loading: loading.models.equistdname,
}))
@Form.create()
class CompanyUserList extends PureComponent {
  state = {
    expandForm: false,
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    modalRecord: {},
    store: null,
    modalImportVisible: false,
    importFileList: []
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'company/clear',
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
      type: 'company/query_comp',
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
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
      },
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
      type: 'company/del_comp',
      payload: {
        ids: selectedRows.join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'company/query_comp',
          payload: {
            current: 1,
            pageSize: 10
          }
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
    const { complist } = this.props;
    let visibleStore = 1;
    if (isNotBlank(flag) && flag === true && isNotBlank(complist) && isNotBlank(complist.list)) {
      visibleStore = complist.list.length + 1;
    }
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
      store: visibleStore,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props
    dispatch({
      type: 'equistdname/add',
      payload: fields,
    });
    this.setState({
      modalVisible: false,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
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
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'company/query_comp',
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
      let visibleStore = 1;
      if (isNotBlank(record) && isNotBlank(record.children) && record.children.length > 0) {
        visibleStore = record.children.length + 1;
      }
      let recordCode = null;
      if (isNotBlank(record) && isNotBlank(record.genreCode)) {
        if (visibleStore < 10) {
          recordCode = `${record.genreCode}-0${visibleStore}`;
        } else {
          recordCode = `${record.genreCode}-${visibleStore}`;
        }
      }
      this.setState({
        modalRecord: { parentId: record.id, genreCode: recordCode },
        modalVisible: true,
        store: visibleStore,
      });
    }
  };

  renderSimpleForm = () => {
    const { form } = this.props
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="公司名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <div style={{ overflow: 'hidden' }}>
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
  }

  renderForm = () => {
    return this.renderSimpleForm();
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

  handleUpldExportClick = (type) => {
    const userid = { id: getStorage('userid'), isTemplate: type };
    window.open(`/api/Beauty/sys/office/export?${stringify(userid)}`);
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleImage = url => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  };

  render() {
    const { complist, loading, dispatch, detailcom } = this.props;
    const { selectedRows, modalVisible, store, modalRecord, importFileList, modalImportVisible, previewVisible, previewImage } = this.state;
    const columns = [
      {
        title: '操作',
        width: 100,
        align: 'center',
        render: record => {
          return <Fragment>
            <Link
              to={`/basic/company_form?id=${record.id}`}
            >
              详情
            </Link>
          </Fragment>
        },
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
      },
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalRecord,
      store,
      detailcom
    };
    const onValidateForm = () => {
      dispatch(routerRedux.push('/basic/company_form'));
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
            导出模板
          </Button>
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(1)}>
            导出数据
          </Button>
        </div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
              {
                isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'office').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'office')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <Button icon="plus" type="primary" onClick={onValidateForm}>
                  新建
              </Button>
              }
              {selectedRows.length > 0 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'office').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'office')[0].children.filter(item => item.name == '修改')
                  .length > 0 && (
                  <span>
                    <Button onClick={() => this.removeClick()}>删除</Button>
                  </span>
                )}
              <Button icon="plus" type="primary" style={{ visibility: 'hidden' }}>
                新建
              </Button>
              <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                公司管理
              </span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 1400 }}
              selectedRows={selectedRows}
              defaultExpandAllRows
              loading={loading}
              data={complist}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CompanyUserList;

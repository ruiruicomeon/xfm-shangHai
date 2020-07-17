import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Upload, Row, Col, Select, message, Modal ,DatePicker
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import moment from 'moment';
import { parse, stringify } from 'qs';
import styles from './CpBillMaterialList.less';
import { getStorage } from '@/utils/localStorageUtils';

const { RangePicker } = DatePicker;
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
    name: 'list',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Beauty/beauty/cpBillMaterial/import',
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
      title="导入物料编码"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入物料编码
                </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});
@connect(({ cpBillMaterial, loading }) => ({
  ...cpBillMaterial,
  loading: loading.models.cpBillMaterial,
}))
@Form.create()
class CpBillMaterialList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalImportVisible: false,
    importFileList: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        pageSize: 10,
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
    dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'start_status',
		  },
		  callback: data => {
			this.setState({
			  startStatus : data
          })
        }
    });

  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpBillMaterial/clear',
    });
  }

  gotoForm = () => {
    router.push(`/basicManagement/materials/cp_bill_material_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/basicManagement/materials/cp_bill_material_form?id=${id}`);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    let sort = {};
    if (isNotBlank(sorter) && isNotBlank(sorter.field)) {
      if (sorter.order === 'ascend') {
        sort = {
          'page.orderBy': `${sorter.field} asc`
        }
      } else if (sorter.order === 'descend') {
        sort = {
          'page.orderBy': `${sorter.field} desc`
        }
      }
    }
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
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
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        pageSize: 10,
        current: 1,
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  editAndDelete = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title: '删除数据',
      content: '确定删除已选择的数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.handleDeleteClick(),
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    let ids = '';
    if (isNotBlank(id)) {
      ids = id;
    } else {
      if (selectedRows.length === 0) {
        message.error('未选择需要删除的数据');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    if (isNotBlank(ids)) {
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpBillMaterial/cpBillMaterial_List',
            payload: {
              pageSize: 10,
              ...formValues,
            }
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
      Object.keys(values).map((item) => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });

      if(isNotBlank(values.createDate)&&values.createDate.length>0){
        values.startTime = moment(values.createDate[0]).format('YYYY-MM-DD HH:mm:ss')
       values.endTime = moment(values.createDate[1]).format('YYYY-MM-DD HH:mm:ss')
         delete values.createDate
      }

      if(isNotBlank(values.upDate)&&values.upDate.length>0){
        values.startDate = moment(values.upDate[0]).format('YYYY-MM-DD HH:mm:ss')
       values.endDate = moment(values.upDate[1]).format('YYYY-MM-DD HH:mm:ss')
         delete values.upDate
      }
      
    
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    if (isNotBlank(value)) {
      Object.keys(value).map((item) => {
        if (value[item] instanceof moment) {
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpBillMaterial/cpBillMaterial_List',
            payload: {
              pageSize: 10,
              ...formValues,
            }
          });
        }
      });
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码">
              {getFieldDecorator('oneCode', {
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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="原厂编码">
              {getFieldDecorator('originalCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="配件厂商">
              {getFieldDecorator('rCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} style={{height: '56.5px'}}>
            <FormItem label="启用状态">
              {getFieldDecorator('tag', {
                initialValue: ''
              })(
                <Select
                  allowClear
                  style={{ width: '100%'}}
                >
                  {
                    isNotBlank(this.state.startStatus) && this.state.startStatus.length > 0 && this.state.startStatus.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col> 
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createDate', {
                initialValue: ''
              })(
                <RangePicker  style={{ width: '100%' }} showTime />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="更新时间">
              {getFieldDecorator('upDate', {
                initialValue: ''
              })(
                <RangePicker  style={{ width: '100%' }} showTime />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

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
    const { formValues } = this.state
    const userid = { ...formValues, isTemplate: type };
    window.open(`/api/Beauty/beauty/cpBillMaterial/export?${stringify(userid)}`);
  };

  render() {
    const { selectedRows, importFileList, modalImportVisible } = this.state;
    const { loading, cpBillMaterialList } = this.props;
    const columns = [
      {
        title: '详情',
        align: 'center',
        width: 100,
        fixed: 'left',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
          </Fragment>
        ),
      },
      {
        title: '物料编码',
        dataIndex: 'billCode',
        align: 'center',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '一级编码',
        dataIndex: 'oneCode',
        inputType: 'text',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '二级编码',
        align: 'center',
        dataIndex: 'twoCode',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '一级编码型号',
        align: 'center',
        dataIndex: 'oneCodeModel',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '二级编码名称',
        align: 'center',
        dataIndex: 'twoCodeModel',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '名称',
        align: 'center',
        dataIndex: 'name',
        inputType: 'text',
        width: 200,
        editable: true,
      },
      {
        title: '原厂编码',
        dataIndex: 'originalCode',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '配件厂商',
        dataIndex: 'rCode',
        inputType: 'text',
        align: 'center',
        width: 100,
        editable: true,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        align: 'center',
        editable: false,
        inputType: 'dateTime',
        width: 100,
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
        dataIndex: 'updateDate',
        align: 'center',
        editable: true,
        inputType: 'dateTime',
        width: 100,
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
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '基础操作',
        width: 100,
        align: 'center',
        render: (text, record) => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial')[0].children.filter(item => item.name == '删除')
              .length > 0 ?
            <Fragment>
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
            : ''
        },
      },
    ];
    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <div className={styles.tableListOperator}>
            <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
              导入编码
            </Button>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(1)}>
              导出模板
            </Button>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(0)}>
              导出数据
            </Button>
          </div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial')[0].children.filter(item => item.name == '修改')
                    .length > 0 ?
                  <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                    新建
  </Button>
                  : <Button icon="plus" type="primary" style={{ visibility: 'hidden' }}>
                    新建
                </Button>
                }
                <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                  物料编码
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: 700 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={cpBillMaterialList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                // onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpBillMaterialList;
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Modal, TreeSelect, Icon, Button , message, Upload, Switch, Popconfirm } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './DepartmentUserList.less';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import { stringify } from 'qs';
import { getStorage } from '@/utils/localStorageUtils';

const { TextArea } = Input;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, addfileList, fileList, handleUploadChange, handlebeforeUpload, handleRemove, handleImage, handleCancel, handlePreview } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = { ...fieldsValue };
      if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
        values.path = addfileList.join('|')
      } else {
        values.path = '';
      }
      if (modalRecord.id) {
        values.id = modalRecord.id
      } else {
      }
      handleAdd(values);
    });
  };
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传照片</div>
    </div>
  );
  return (
    <Modal
      title={isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改公告' : '新建公告'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('description', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.description) ? modalRecord.description : '',
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('remarks', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks : '',
          rules: [{ required: true, message: '请输入内容' }],
        })(<TextArea
          style={{ minHeight: 32 }}
          rows={2}
        />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="照片上传">
        <Upload
          accept="image/*"
          onChange={handleUploadChange}
          onRemove={handleRemove}
          beforeUpload={handlebeforeUpload}
          fileList={fileList}
          listType="picture-card"
          onPreview={handlePreview}
        >
          {(isNotBlank(fileList) && fileList.length >= 9) ? null : uploadButton}
        </Upload>
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
    importFileList: [],
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    fileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysdept/getSysDocList'
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({
      type: 'sysdept/clear'
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
      type: 'sysdept/add_announcement',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'sysdept/getSysDocList'
        });
        this.setState({
          modalVisible: false,
          fileList: [],
          addfileList: []
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
    if (isNotBlank(record.path)) {
      let photoUrl = record.path.split('|')
      photoUrl = photoUrl.map((item) => {
        return {
          id: getFullUrl(item),
          uid: getFullUrl(item),
          url: getFullUrl(item),
          name: getFullUrl(item)
        }
      })
      this.setState({
        addfileList: record.path.split('|'),
        fileList: photoUrl
      })
    }
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
    const { orderflag } = this.state
    if (!orderflag) {
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
    }
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
    if (isNotBlank(info.file) && isNotBlank(info.file.size)) {
      const isimg = info.file.type.indexOf('image') >= 0;
      const isLt10M = info.file.size / 1024 / 1024 <= 10;
      if (info.file.status === 'done') {
        if (isLt10M && isimg) {
          this.setState({ fileList: info.fileList });
        }
      } else {
        this.setState({ fileList: info.fileList });
      }
    }
  };

  editAndSwitch = (checked, record) => {
    Modal.confirm({
      title: `修改启用状态`,
      content: `确定状态修改为${checked ? '开启' : '关闭'}状态吗？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.checkSwitch(checked, record),
    });
  }

  checkSwitch = (checked, record) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sysdept/update_sysDoc',
      payload: {
        id: record.id,
        type: checked ? 1 : 2
      },
      callback: () => {
        dispatch({
          type: 'sysdept/getSysDocList'
        });
      }
    })
  }

  editAndDelete = (e, id) => {
    e.stopPropagation();
    Modal.confirm({
      title: '删除数据',
      content: '确定删除已选择的数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.handleDeleteClick(id),
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
        type: 'sysdept/delete_sysDoc',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'sysdept/getSysDocList',
            payload: {
              pageSize: 10,
              ...formValues,
            }
          });
        }
      });
    }
  };

  render() {
    const { loading, deptlist, getsysdoclist } = this.props;
    const { selectedRows, modalVisible, modalRecord, importFileList, modalImportVisible, fileList, addfileList, previewVisible, previewImage } = this.state;
    const columns = [
      {
        title: '修改',
        align: 'center',
        dataIndex: 'name',
        width: 100,
        render: (text, record) => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'doc').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'doc')[0].children.filter(item => item.name == '修改')
              .length > 0 ?
                <a onClick={() => this.handleModalChange(record)}>修改</a>
            : ''
        },
      },
      {
        title: '标题',
        align: 'center',
        dataIndex: 'description',
        width: 200,
      },
      {
        title: '开启状态',
        align: 'center',
        dataIndex: 'type',
        width: 100,
        render: (text, record) => {
          return <Switch
            onChange={(checked) => this.editAndSwitch(checked, record)}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={text == 1 || text == '开启' || !isNotBlank(text)}
          />
        }
      },
      {
        title: '时间',
        dataIndex: 'createDate',
        width: 150,
      },
      {
        title: '发布人',
        align: 'center',
        dataIndex: 'createBy.name',
        width: 150,
      },
      {
        title: '内容',
        dataIndex: 'remarks',
        width: 200,
      },
      {
        title: '图片',
        dataIndex: 'path',
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
        title: '基础操作',
        width: 100,
        align: 'center',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        }
      }
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalRecord,
      handleUploadChange: this.handleUploadChange,
      handlebeforeUpload: this.handlebeforeUpload,
      handleRemove: this.handleRemove,
      handleImage: this.handleImage,
      handleCancel: this.handleCancel,
      handlePreview: this.handlePreview,
      fileList,
      addfileList
    };
    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.tableListOperator} />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'doc').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'doc')[0].children.filter(item => item.name == '修改')
                  .length > 0 ?
                    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                    </Button> :
                    <Button icon="plus" type="primary" style={{ visibility: 'hidden' }}>
                  新建
                    </Button>
              }
              <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                公告管理
              </span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 950 }}
              loading={loading}
              defaultExpandAllRows
              data={getsysdoclist}
              columns={columns}
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
export default DepartmentUserList;

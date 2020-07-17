import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Upload,Icon,InputNumber} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import styles from './DictionaryList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;

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
        action: '/api/Beauty/sys/dict/import',
        
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
          title="导入字典"
          visible={modalImportVisible}
          destroyOnClose
          footer={null}
          onCancel={() => handleImportVisible()}
        >
          <Row>
            <Col span={6} offset={4}>
              <Upload {...propsUpload}>
                <Button>
                  <Icon type="upload" /> 上传导入字典
                </Button>
              </Upload>
            </Col>
          </Row>
        </Modal>
      );
    });


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord } = props;
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

  return (
    <Modal
      title={isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改字典' : '新增字典'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签名">
        {form.getFieldDecorator('label', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.label) ? modalRecord.label : '',
          rules: [{ required: true, message: '请输入标签名' }],
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('type', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.type) ? modalRecord.type : '',
          rules: [{ required: true, message: '请输入类型' }],
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('description', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.description) ? modalRecord.description : '',
          rules: [{ required: true, message: '请输入描述' }],
        })(<Input  />)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('sort', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.sort) ? modalRecord.sort : '',
        })(<InputNumber  style={{width:'100%'}} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码规则">
        {form.getFieldDecorator('remarks', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks : '',
        })(<Input  />)}
      </FormItem>
    </Modal>
  );
});
@connect(({ loading, dictionaryL
  
}) => ({
  ...dictionaryL,
  
  loading: loading.models.sysuser,
}))
@Form.create()
class DictionaryList extends PureComponent {

  constructor(props) {
    super(props);
    if (props.location.data != null && typeof props.location.data !== 'undefined') {
      this.setState({
        data: props.location.data
      })
    }
  }

  state = {
    data: {},
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisible: false,
    modalRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'dictionaryL/fetch',
      payload: {
        current: 1,
        pageSize: 10
      }
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
      type: 'dictionaryL/fetch',
      payload: params,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props
    const that = this
    dispatch({
      type: 'dictionaryL/add_dict',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'dictionaryL/fetch',
          payload: {
            current: 1,
            pageSize: 10
          }
        })
        that.setState({
          modalVisible: false,
        });
      }
    });

  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dictionaryL/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'dictionaryL/del_dict',
      payload: {
        ids: selectedRows.join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'dictionaryL/fetch',
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

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        
      };
      if (!isNotBlank(fieldsValue.type)) {
        values.type = ''
      }
      if (!isNotBlank(fieldsValue.label)) {
        values.label = ''
      }
      if (!isNotBlank(fieldsValue.description)) {
        values.description = ''
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dictionaryL/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm = () => {
    const { form} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标签名">
              {getFieldDecorator('label')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="描述">
              {getFieldDecorator('description')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ marginBottom: 24 }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm = () => {
    return this.renderSimpleForm();
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  editdict = record => {
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

  
  // handleImportVisible = flag => {
  //   this.setState({
  //     modalImportVisible: !!flag,
  //     importFileList: [],
  //   });
  // };

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


  render() {
    const { loading, listdict } = this.props;
    const { selectedRows, modalVisible, modalRecord ,modalImportVisible, importFileList} = this.state;
    console.log(listdict)

    const columns = [
      {
        title: '标签名',
        dataIndex: 'label',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 150,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 150,
      },
      {
        title: '数据值',
        dataIndex: 'value',
        width: 200,
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 100,
      },
      {
        title: '编码规则',
        dataIndex: 'remarks',
        width: 150,
      },
      {
        title: '操作',
        width: 150,
        render: record => {
          return  isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dict').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dict')[0].children.filter(item=>item.name=='修改')
          .length>0?
            <Fragment>
              <a
                onClick={() => { this.editdict(record) }}
              >
              修改
              </a>
            
            </Fragment>
          :''
        },
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
         {/* <div className={styles.tableListOperator}>
          <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
            导入
          </Button>
          </div> */}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} style={{'position':'relative'}}>
              {
              isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dict').length>0
                && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dict')[0].children.filter(item=>item.name=='修改')
                .length>0&&
                <span>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
                  </Button>
                  {selectedRows.length > 0 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dict').length>0
                && JSON.parse(getStorage('menulist')).filter(item=>item.target=='dict')[0].children.filter(item=>item.name=='修改')
                .length>0&& (
                <span>
                  
                  <Button onClick={() => this.removeClick()}>删除</Button>
                  
                </span>
              )}
                </span>
              }
              <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
              </Button>
              <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
字典管理
              </span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 1050 }}
              selectedRows={selectedRows}
              loading={loading}
              defaultExpandAllRows
              data={listdict}
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
export default DictionaryList;

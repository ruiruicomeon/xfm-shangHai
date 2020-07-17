import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Row, Col,Upload, message, Select, Modal ,
} from 'antd';
import router from 'umi/router';
import { parse, stringify } from 'qs';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import moment from 'moment';
import SearchTableList from '@/components/SearchTableList';
import styles from './CpClientList.less';
import { getStorage } from '@/utils/localStorageUtils';

const { Option } = Select;
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
        action: '/api/Beauty/beauty/cpClient/import',
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
          title="导入客户"
          visible={modalImportVisible}
          destroyOnClose
          footer={null}
          onCancel={() => handleImportVisible()}
        >
          <Row>
            <Col span={6} offset={4}>
              <Upload {...propsUpload}>
                <Button>
                  <Icon type="upload" /> 上传导入客户
                </Button>
              </Upload>
            </Col>
          </Row>
        </Modal>
      );
    });
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
      searchVisible,
      form: { getFieldDecorator },
      handleSearchVisible,
      cpClientSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisible}
        onCancel={() =>  this.handleSearchVisiblein()}
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
@connect(({ cpClient, loading }) => ({
  ...cpClient,
  loading: loading.models.cpClient,
}))
@Form.create()
class CpClientList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    array: [],
    searchVisible: false,
    modalImportVisible: false,
    importFileList: [],
    // historyfilterin:''
   }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpClient/cpClient_SearchList',
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'classify',
      },
      callback: data => {
        this.setState({
          classify: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'client_level',
      },
      callback: data => {
        this.setState({
          client_level: data
        })
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
  }

  gotoForm = () => {
    router.push(`/basicmanagement/basis/cp_client_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/basicmanagement/basis/cp_client_form?id=${id}`);
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
      genTableColumn:isNotBlank(this.state.historyfilterin)?this.state.historyfilterin:[],
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'cpClient/cpClient_List',
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
      type: 'cpClient/cpClient_List',
      payload: {
        genTableColumn:isNotBlank(this.state.historyfilterin)?this.state.historyfilterin:[],
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
        type: 'cpClient/cpClient_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpClient/cpClient_List',
            payload: {
              genTableColumn:isNotBlank(this.state.historyfilterin)?this.state.historyfilterin:[],
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
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'cpClient/cpClient_List',
        payload: {
          genTableColumn:isNotBlank(this.state.historyfilterin)?this.state.historyfilterin:[], 
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
        type: 'cpClient/cpClient_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpClient/cpClient_List',
            payload: {
              pageSize: 10,
              ...formValues,
            }
          });
        }
      });
    }
  }

  handleFieldChange = (value) => {
    this.setState({
      array: value || []
    })
  }

  handleSearchVisible = (fieldsValue) => {
    this.setState({
      searchVisible: false,
      historyfilterin:JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChange = () => {
    this.setState({
      searchVisible: true,
    });
  };

  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;

    this.setState({
      historyfilterin:JSON.stringify(fieldsValue.genTableColumn)
    })
  

    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        ...this.state.formValues,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      searchVisible: false,
    });
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="客户">
              {getFieldDecorator('clientCpmpany', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input  />
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
              <a style={{ marginLeft: 8 }} onClick={this.handleSearchChange}>
                过滤其他 <Icon type="down" />
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
            <FormItem label="客户">
              {getFieldDecorator('clientCpmpany', {
                initialValue: ''
              })(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input  />
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
    const {formValues } = this.state

    const userid = { ...formValues, genTableColumn:isNotBlank(this.state.historyfilterin)?this.state.historyfilterin:[] ,'user.id':getStorage('userid'), isTemplate: type };
    window.open(`/api/Beauty/beauty/cpClient/export?${stringify(userid)}`);
  };

  render() {
    const { selectedRows, array, searchVisible ,importFileList, modalImportVisible} = this.state;
    const { loading, cpClientList, cpClientSearchList } = this.props;
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpClientSearchList,
    }
    const field = [
      {
        title: '客户编码',        
        dataIndex: 'code',
        align: 'center' ,   
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '客户',  
        align: 'center' ,      
        dataIndex: 'clientCpmpany',   
        inputType: 'text',   
        width: 240,          
        editable: true,      
      },
      {
        title: '联系人',  
        align: 'center' ,      
        dataIndex: 'name',   
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '客户分类',   
        align: 'center' ,     
        dataIndex: 'classify',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '客户级别',        
        dataIndex: 'level',
        align: 'center' ,   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '联系地址',        
        dataIndex: 'address', 
        align: 'center' ,  
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '邮箱',        
        dataIndex: 'email',
        align: 'center' ,   
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '移动电话',        
        dataIndex: 'phone', 
        align: 'center' ,  
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '电话',        
        dataIndex: 'tel',
        align: 'center' ,   
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '传真',        
        dataIndex: 'fax',
        align: 'center' ,   
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '税号',        
        dataIndex: 'dutyParagraph',
        align: 'center' ,  
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '开户账号',        
        dataIndex: 'openNumber',
        align: 'center' ,   
        inputType: 'text',   
        editable: true,      
        width: 150,          
      },
      {
        title: '开户银行',        
        dataIndex: 'openBank', 
        align: 'center' ,  
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '开户地址',        
        dataIndex: 'openAddress', 
        align: 'center' ,  
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '开户电话',        
        dataIndex: 'openTel', 
        align: 'center' ,  
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
      {
        title: '结账周期',        
        dataIndex: 'period', 
        align: 'center' , 
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '创建者',        
        dataIndex: 'user.name',   
        inputType: 'text', 
        align: 'center' ,  
        width: 150,          
        editable: false,      
      },
      {
        title: '更新时间',
        dataIndex: 'updateDate',
        editable: true,
        inputType: 'dateTime',
        align: 'center' ,
        width: 150,
        sorter: true,
        render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
      },
      {
        title: '备注信息',        
        dataIndex: 'remarks',   
        inputType: 'text', 
        align: 'center' ,  
        width: 100,          
        editable: true,      
      },
    ];
    let fieldArray = [];
    if (isNotBlank(array) && array.length > 0) {
      fieldArray = array.map((item) => {
        if (isNotBlank(item) && isNotBlank(field[item])) {
          return field[item]
        }
        return null;
      })
    } else {
      fieldArray = field;
    }
    const columns = [
      {
        title: '详情',
        width: 100,
        align: 'center' ,
        fixed: 'left', 
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
          </Fragment>
        ),
      },
      ...fieldArray,
      {
        title: '基础操作',
        width: 100,
        align: 'center' ,
        render: (text, record) => {
         return   isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient')[0].children.filter(item=>item.name=='修改')
.length>0?
  <Fragment>
    <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
      <a>删除</a>
    </Popconfirm>
  </Fragment>
          :''
        },
      }
    ];
    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };
    return (
      <PageHeaderWrapper
        title="动态列表展示,默认展示全部."
        content={
          <Select
            mode="multiple"
            style={{ width: '100%', minWidth: 200 }}
            
            onChange={this.handleFieldChange}
          >
            {
              isNotBlank(field) && field.length > 0 && field.map((item, index) => (
                <Option key={item.dataIndex} value={index}>{item.title}</Option>
              ))
            }
          </Select>
        }
      >
        <div className={styles.standardList}>
          <div className={styles.tableListOperator}>
            <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
            导入客户
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
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpClient')[0].children.filter(item=>item.name=='修改')
.length>0?
  <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
  </Button>
                :
  <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                                新建
  </Button>
          }
                <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
客户管理
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 800 }}
                loading={loading}
                data={cpClientList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpClientList;
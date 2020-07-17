import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Row, Upload,Col, Select, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import moment from 'moment';
import styles from './CpAssemblyBuildList.less';
import { parse, stringify } from 'qs';
import SearchTableList from '@/components/SearchTableList';
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
        name: 'list',
        accept: '.xls,.xlsx,.xlsm',
        fileList: fileL,
        headers: Stoken,
        action: '/api/Beauty/beauty/cpAssemblyBuild/import',
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
          title="导入总成建立"
          visible={modalImportVisible}
          destroyOnClose
          footer={null}
          onCancel={() => handleImportVisible()}
        >
          <Row>
            <Col span={6} offset={4}>
              <Upload {...propsUpload}>
                <Button>
                  <Icon type="upload" /> 上传导入总成建立
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
      cpAssemblyBuildSearchList,
    } = this.props;
    return (
      <Modal
        width={860}
        title="多字段动态过滤"
        visible={searchVisible}
        onCancel={() => this.handleSearchVisiblein()}
        afterClose={() => this.handleSearchVisiblein()}
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
@connect(({ cpAssemblyBuild, loading }) => ({
  ...cpAssemblyBuild,
  loading: loading.models.cpAssemblyBuild,
}))
@Form.create()
class CpAssemblyBuildList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    searchVisible:false,
    modalImportVisible: false,
    importFileList: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
    });
     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'business_project',
		  },
		  callback: data => {
			this.setState({
			  business_project : data
          })
        }
    });
  }

  gotoForm = () => {
    router.push(`/basicmanagement/basis/cp_assembly_build_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/basicmanagement/basis/cp_assembly_build_form?id=${id}`);
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
    if(isNotBlank(sorter) && isNotBlank(sorter.field)){
      if(sorter.order === 'ascend'){
        sort = {
          'page.orderBy':`${sorter.field} asc`
        }
      }else if(sorter.order === 'descend'){
        sort = {
          'page.orderBy':`${sorter.field} desc`
        }
      }
    }
    const params = {
      genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
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
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
        type: 'cpAssemblyBuild/cpAssemblyBuild_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpAssemblyBuild/cpAssemblyBuild_List',
            payload: {
              genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
        if( values[item] instanceof moment){
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpAssemblyBuild/cpAssemblyBuild_List',
        payload: {
          genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
        if( value[item] instanceof moment){
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpAssemblyBuild/cpAssemblyBuild_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpAssemblyBuild/cpAssemblyBuild_List',
            payload: {
              genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
            <FormItem label="业务项目">
              {getFieldDecorator('project', {
						initialValue: ''
					  })(
  <Select
    allowClear
    style={{ width: '100%' }}
    
  >
    {
													isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="总成型号">
              {getFieldDecorator('assemblyModel', {
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
            <FormItem label="业务项目">
              {getFieldDecorator('project', {
						initialValue: ''
					  })(
  <Select
    allowClear
    style={{ width: '100%' }}
    
  >
    {
                isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
              }
  </Select>
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="总成型号">
              {getFieldDecorator('assemblyModel', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="总成号">
              {getFieldDecorator('assemblyCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="大号">
              {getFieldDecorator('maxCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="小号">
              {getFieldDecorator('minCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="总成分类">
              {getFieldDecorator('assemblyType', {
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

  handleSearchVisible = (fieldsValue) => {
    this.setState({
      searchVisible: false,
      historyfilter:JSON.stringify(fieldsValue.genTableColumn)
    });
  };

  handleSearchChange = () => {
    this.setState({
      searchVisible: true,
    });
  };

  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        ...this.state.formValues,
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      searchVisible: false,
      historyfilter:JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  handleFieldChange = (value) => {
    this.setState({
      array: value || []
    })
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
    // const userid = { id: getStorage('userid'), isTemplate: type };
    const {formValues} = this.state

    const params = {
			genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
			...formValues,
      'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):'',
      isTemplate: type
		}
    window.open(`/api/Beauty/beauty/cpAssemblyBuild/export?${stringify(params)}`);
  };

  render() {
    const { selectedRows ,array,searchVisible ,importFileList, modalImportVisible} = this.state;
    const { loading, cpAssemblyBuildList ,cpAssemblyBuildSearchList} = this.props;
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpAssemblyBuildSearchList,
    }
    const field = [
    {
      title: '业务项目', 
      align: 'center' ,        
      dataIndex: 'project',    
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '总成型号',   
      align: 'center' ,    
			dataIndex: 'assemblyModel',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		},
 		{
      title: '总成号',    
      align: 'center' ,     
			dataIndex: 'assemblyCode',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		},
 		{
      title: '大号', 
      align: 'center' ,        
			dataIndex: 'maxCode',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		},
 		{
      title: '小号',  
      align: 'center' ,       
			dataIndex: 'minCode',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		},
 		{
      title: '总成分类',  
      align: 'center' ,       
			dataIndex: 'assemblyType',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '类型编码', 
      align: 'center' ,        
			dataIndex: 'lxCode',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '分类编码',
      align: 'center' ,         
			dataIndex: 'flCode',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '技术参数', 
      align: 'center' ,        
			dataIndex: 'technicalParameter',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '车型',    
      align: 'center' ,     
			dataIndex: 'vehicleModel',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		},
 		{
      title: '品牌',  
      align: 'center' ,       
			dataIndex: 'assemblyBrand',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '年份',        
      dataIndex: 'assemblyYear', 
      align: 'center' ,   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '品牌编码',        
      dataIndex: 'brandCode', 
      align: 'center' ,   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '一级编码型号',        
      dataIndex: 'oneCode',
      align: 'center' ,    
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '绑定系列数量', 
      align: 'center' ,        
			dataIndex: 'bindingNumber',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '原厂编码',   
      align: 'center' ,      
			dataIndex: 'originalCode',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '再制造编码', 
      align: 'center' ,        
			dataIndex: 'makeCode',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		},
 		{
      title: '提成类型',  
      align: 'center' ,       
			dataIndex: 'pushType',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
	  {
        title: '更新时间',
        align: 'center' , 
        dataIndex: 'updateDate',
        editable:   true  ,
        inputType: 'dateTime',
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
      align: 'center' ,        
			dataIndex: 'remarks',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		}]
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
        return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild').length>0
        && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild')[0].children.filter(item=>item.name=='删除')
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
            导入总成
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
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAssemblyBuild')[0].children.filter(item=>item.name=='修改')
.length>0?
  <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
  </Button>
                :<Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
                </Button>
  }
                <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
总成建立
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: 2300 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={cpAssemblyBuildList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                // onSelectRow={this.handleSelectRows}
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
export default CpAssemblyBuildList;
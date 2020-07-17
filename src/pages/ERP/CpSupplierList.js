import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card,Upload, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal,Switch
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import styles from './CpSupplierList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


    const ImportFile1 = Form.create()(props => {
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
        action: '/api/Beauty/beauty/cpSupplier/import',
        
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
          title="导入供应商表格"
          visible={modalImportVisible}
          destroyOnClose
          footer={null}
          onCancel={() => handleImportVisible()}
        >
          <Row>
            <Col span={6} offset={4}>
              <Upload {...propsUpload}>
                <Button>
                  <Icon type="upload" /> 上传供应商信息
                </Button>
              </Upload>
            </Col>
          </Row>
        </Modal>
      );
    });


@Form.create()
class SearchFormgys extends PureComponent {

	okHandle = () => {
		const { form, handleSearchAddgys } = this.props;
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			handleSearchAddgys(fieldsValue);
		});
  };
  
  handleSearchVisiblein = () => {
    const { form, handleSearchVisiblegys } = this.props;
    form.validateFields((err, fieldsValue) => {
      handleSearchVisiblegys(fieldsValue);
    });
  };


	render() {
		const {
			searchVisiblegys,
			form: { getFieldDecorator },
			handleSearchVisiblegys,
			CpSupplierSearchList,
			
    } = this.props;
    
		return (
  <Modal
    width={860}
    title="多字段动态过滤"
    visible={searchVisiblegys}
    onCancel={() => this.handleSearchVisiblein()}
    afterClose={() =>  this.handleSearchVisiblein()}
    onOk={() => this.okHandle()}
  >
    <div>
      {getFieldDecorator('genTableColumn', {
						initialValue: [],
					})(<SearchTableList searchList={CpSupplierSearchList} />)}
    </div>
  </Modal>
		);
	}
}
@connect(({ cpSupplier, loading }) => ({
  ...cpSupplier,
  loading: loading.models.cpSupplier,
}))
@Form.create()

class CpSupplierList extends PureComponent {

  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    array: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpSupplier/cpSupplier_List',
      payload: {
        pageSize: 10,
      }
    });

    dispatch({
      type: 'cpSupplier/CpSupplier_SearchList',
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
			  del_flag : data
          })
        }
    });

  }

  gotoForm = () => {
    router.push(`/basicmanagement/supplier/cp_supplier_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/basicmanagement/supplier/cp_supplier_form?id=${id}`);
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
      type: 'cpSupplier/cpSupplier_List',
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
      type: 'cpSupplier/cpSupplier_List',
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
        type: 'cpSupplier/cpSupplier_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpSupplier/cpSupplier_List',
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
        type: 'cpSupplier/cpSupplier_List',
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
        type: 'cpSupplier/cpSupplier_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpSupplier/cpSupplier_List',
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
            <FormItem label="名称">
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
              <a style={{ marginLeft: 8 }} onClick={this.handleSearchChangegys}>
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
            <FormItem label="名称">
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

  editAndSwitch = (checked, record) => {
    if (isNotBlank(record) && isNotBlank(record.id)&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier')[0].children.filter(item=>item.name=='修改')
    .length>0) {
      Modal.confirm({
        title: `修改启用状态`,
        content: `确定状态修改为${checked ? '已启用' : '未启用'}状态吗？`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => this.checkSwitch(checked, record),
      });
    }
  }

  checkSwitch =(checked, record) =>{
    const {dispatch} = this.props

    dispatch({
    type:'cpSupplier/cpSupplier_Add',
    payload: {
      id:record.id,
      status:checked ? 0 : 1 
    },
    callback: () => {
      dispatch({
        type: 'cpSupplier/cpSupplier_List',
        payload: {
          ...this.state.formValues,
          genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],     
          pageSize: 10,
        }
      });
    }
  })
  }

	handleSearchVisiblegys = (fieldsValue) => {
		this.setState({
      searchVisiblegys: false,
      historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	};

	handleSearchChangegys = () => {
		this.setState({
			searchVisiblegys: true,
		});
	};

	handleSearchAddgys = (fieldsValue) => {
		const { dispatch } = this.props;
		
		dispatch({
			
			type: 'cpSupplier/cpSupplier_List',
			payload: {
        ...this.state.formValues,
				genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
				pageSize: 10,
				current: 1,
			},
		});
		this.setState({
      searchVisiblegys: false,
      historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

	handleFieldChange = (value) => {
		this.setState({
			array: value || []
		})
  }
  
  // handleImportVisible = flag => {
  //   this.setState({
  //     modalImportVisible: !!flag,
  //     importFileList: [],
  //   });
  // };

  // handleVisible =()=>{
  //   this.setState({
  //     modalImportVisible:true,
  //   })
  // }


  // handleFileList = fileData => {
  //   this.setState({
  //     importFileList: fileData,
  //   });
  // };

  // UploadFileVisible = flag => {
  //   this.setState({
  //     modalImportVisible: !!flag,
  //     importFileList: [],
  //   });
  // };

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

  render() {
    const { selectedRows  ,array, searchVisiblegys,modalImportVisible ,importFileList} = this.state;
    const { loading, cpSupplierList ,CpSupplierSearchList} = this.props;
    const field = [
    {
      title: '启用状态',
      align: 'center' ,
      dataIndex: 'status',
      width: 150,
      render: (text, record) => {
        if (isNotBlank(text)) {
          return <Switch 
          disabled={!(isNotBlank(record) && isNotBlank(record.id)&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier')[0].children.filter(item=>item.name=='修改')
          .length>0)}
            onChange={(checked) => this.editAndSwitch(checked, record)} 
            checkedChildren="已开启"
            unCheckedChildren="未开启"
            checked={text === 0 || text === '0'}
          />
        }
        return <a>无归还状态</a>
        }
      },
   {
    title: '供应商编号',        
    dataIndex: 'id', 
    align: 'center' ,  
    inputType: 'text',   
    width: 150,          
    editable:  false ,      
   },

   {
    title: '供应商类型',
    align: 'center' ,        
    dataIndex: 'type',   
    inputType: 'text',   
    width: 100,          
    editable:  true  ,      
   },

   {
    title: '名称', 
    align: 'center' ,       
    dataIndex: 'name',   
    inputType: 'text',   
    width: 150,          
    editable:  true  ,      
   },

   {
    title: '电话',  
    align: 'center' ,      
    dataIndex: 'phone',   
    inputType: 'text',   
    width: 150,          
    editable:  true  ,      
   },

   {
    title: '传真',        
    dataIndex: 'fax',
    align: 'center' ,   
    inputType: 'text',   
    width: 150,          
    editable:  true  ,      
   },

   {
    title: '联系人',  
    align: 'center' ,      
    dataIndex: 'linkman',   
    inputType: 'text',   
    width: 100,          
    editable:  true  ,      
   },

   {
    title: '联系人电话',  
    align: 'center' ,      
    dataIndex: 'remarks',   
    inputType: 'text',   
    width: 150,          
    editable:  true  ,      
   },

   {
    title: '所属分公司',   
    align: 'center' ,     
    dataIndex: 'companyName',   
    inputType: 'text',   
    width: 150,          
    editable:  true  ,      
   },

   {
    title: '地址', 
    align: 'center' ,       
    dataIndex: 'address',   
    inputType: 'text',   
    width: 150,          
    editable:  true  ,      
   },

   {
    title: '经营类型',  
    align: 'center' ,      
    dataIndex: 'runType',   
    inputType: 'text',   
    width: 100,          
    editable:  true  ,      
   },

   {
    title: '绑定集团', 
    align: 'center' ,       
    dataIndex: 'bindingGroup',   
    inputType: 'text',   
    width: 100,          
    editable:  true  ,      
   },
   {
    title: '创建者', 
    align: 'center' ,      
    dataIndex: 'createBy.name',   
    inputType: 'text',   
    width: 100,          
    editable:  false ,      
   },

  {
      title: '创建时间',
      dataIndex: 'createDate',
      align: 'center' ,
      editable:   false ,
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
  //  {
  //   title: '备注信息',  
  //   align: 'center' ,      
  //   dataIndex: 'remarks',   
  //   inputType: 'text',   
  //   width: 150,          
  //   editable:  true  ,      
  //  },
  ]

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
      align: 'center' ,
      width: 100,
      render: (text, record) => {
        return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier').length>0
        && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSupplier')[0].children.filter(item=>item.name=='删除')
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
    const parentSearchMethodsgys = {
			handleSearchVisiblegys: this.handleSearchVisiblegys,
			handleSearchAddgys: this.handleSearchAddgys,
      CpSupplierSearchList,
      searchVisiblegys
    }
    
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
        <div className={styles.tableListOperator}>
        <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
            导入
          </Button>
          </div>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              
              <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>供应商管理</div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={cpSupplierList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                // onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>

        <ImportFile1 {...parentImportMethods} modalImportVisible={modalImportVisible} />
        <SearchFormgys {...parentSearchMethodsgys} searchVisiblegys={searchVisiblegys} />
      </PageHeaderWrapper>
    );
  }

}
export default CpSupplierList;
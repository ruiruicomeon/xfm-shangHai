import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Form, Card, Popconfirm, Icon, Row, Col, Select, message, Modal,Upload
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import moment from 'moment';
import styles from './CpAfterHistoryFromList.less';
import SearchTableList from '@/components/SearchTableList';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
    @Form.create()
    class SearchForm extends PureComponent {
      okHandle = () => {
        const { form, handleSearchAdd } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          handleSearchAdd(fieldsValue);
        });
      };

      render() {
        const {
          searchVisible,
          form: { getFieldDecorator },
          handleSearchVisible,
          CpAfterApplicationSearchList,
        } = this.props;
        return (
          <Modal
            width={860}
            title="多字段动态过滤"
            visible={searchVisible}
            onCancel={() => handleSearchVisible(false)}
            afterClose={() => handleSearchVisible()}
            onOk={() => this.okHandle()}
          >
            <div>
              {getFieldDecorator('genTableColumn', {
                initialValue: [],
              })(<SearchTableList searchList={CpAfterApplicationSearchList} />)}
            </div>
          </Modal>
        );
      }
    }
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
      name: 'list',
      accept: '.xls,.xlsx,.xlsm',
      fileList: fileL,
      headers: Stoken,
      action: '/api/Beauty/beauty/cpAfterApplicationFromHistory/ImportAll',
      data:{'user.id':getStorage('userid')},
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
        title="导入售后历史"
        visible={modalImportVisible}
        destroyOnClose
        footer={null}
        onCancel={() => handleImportVisible()}
      >
        <Row>
          <Col span={6} offset={4}>
            <Upload {...propsUpload}>
              <Button>
                <Icon type="upload" /> 上传导入售后历史
              </Button>
            </Upload>
          </Col>
        </Row>
      </Modal>
    );
  });
@connect(({ cpAfterApplicationFrom, loading }) => ({
  ...cpAfterApplicationFrom,
  loading: loading.models.cpAfterApplicationFrom,
}))
@Form.create()
class cpAfterApplicationFromHistory extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
      payload: {
        pageSize: 10,
        type:1,
        isTemplate:1
      }
    });
    dispatch({
			type: 'cpAfterApplicationFrom/CpAfterApplication_SearchList',
		});
  }

  gotoForm = () => {
    router.push(`/accessories/process/cp_after_history_from_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/accessories/process/cp_after_history_from_form?id=${id}`);
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
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
      type:1,
      isTemplate:1
    };
    dispatch({
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
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
      type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
      payload: {
        pageSize: 10,
        current: 1,
        type:1,
        isTemplate:1
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
        type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
            payload: {
             pageSize: 10,
              ...formValues,
              type:1,
              isTemplate:1
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
        type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          type:1,
          isTemplate:1
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
        type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
            payload: {
             pageSize: 10,
              ...formValues,
              type:1,
              isTemplate:1
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
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车牌号">
              {getFieldDecorator('plateNumber', {
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
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
              {/* <a style={{ marginLeft: 8 }} onClick={this.handleSearchChange}>
								过滤其他 <Icon type="down" />
              </a> */}
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
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
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

  handleFieldChange = (value) => {
		this.setState({
			array: value || []
		})
  }

	handleSearchVisible = () => {
		this.setState({
			searchVisible: false,
		});
	};

	handleSearchChange = () => {
		this.setState({
			searchVisible: true,
		});
	};

	handleSearchAdd = (fieldsValue) => {
		const { dispatch } = this.props;
		console.log(fieldsValue.genTableColumn)
		dispatch({
			type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
			payload: {
				genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
				pageSize: 10,
        current: 1,
        type:1,
        isTemplate:1
			},
		});
		this.setState({
			searchVisible: false,
		});
	}

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
        type: 'cpAfterApplicationFrom/cpAfterApplicationFrom_History',
				payload: {
					...values,
					pageSize: 10,
          current: 1,
          type:1,
          isTemplate:1
				},
			});
		});
	};

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

  handleUpldExportClick = type => {
    window.open(`/api/Beauty/beauty/cpAfterApplicationFromHistory/export`);
  };

  render() {
    const { selectedRows ,searchVisible ,array ,modalImportVisible ,importFileList} = this.state;
    const { loading, cpAfterApplicationFromHistory ,CpAfterApplicationSearchList} = this.props;
    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };
    const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			CpAfterApplicationSearchList,
		}
    const shstatus = (apps) => {
			if (apps === '0' || apps === 0) {
				return '待审核'
			}
			if (apps === '1' || apps === 1||apps === '2' || apps === 2) {
				return '已审核'
			}
		}
    const field = [
      {
        title: '订单编号',        
        dataIndex: 'orderCode',   
        inputType: 'text', 
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
       },
      //  {
      //   title: '订单状态',        
      //   dataIndex: 'approvals',   
      //   inputType: 'text',   
      //   width: 100,  
      //   align: 'center' ,        
      //   editable:  true  ,      
      //   render: (text) => {
      //     if (isNotBlank(text)) {
      //       if (text === 3 || text === '3') {
      //         return <span>已处理</span>
      //       }
      //       if (text === 0 || text === '0'||text === 1 || text === '1'||text === 2 || text === '2'||text === 4 || text === '4') {
      //         return <span>未处理</span>
      //       }
      //     }
      //   },
      //  },
      //  {
      //   title: '审批进度',        
      //   dataIndex: 'approvals',   
      //   inputType: 'text',   
      //   width: 100,  
      //   align: 'center' ,        
      //   editable:  true  ,      
      //   render: (text) => {
      //     if (isNotBlank(text)) {
      //       if (text === 0 || text === '0') {
      //         return <span style={{color:"#f50"}}>待分配</span>
      //       }
      //       if (text === 1 || text === '1') {
      //         return <span style={{color:"#f50"}}>待审核</span>
      //       }
      //       if (text === 2 || text === '2') {
      //         return <span style={{color:"#f50"}}>待分配</span>
      //       }
      //       if (text === 3 || text === '3') {
      //         return <span style={{color:"rgb(53, 149, 13)"}}>通过</span>
      //       }
      //       if (text === 4 || text === '4') {
      //         return <span style={{color:"#f50"}}>驳回</span>
      //       }
      //     }
      //     return '';
      //   },
      //  },
      //  {
      //   title: '审批人1',        
      //   dataIndex: 'oneUser.name',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 200,          
      //   editable:  true  ,      
      //   render:(text,res)=>{
      //     if(!isNotBlank(text)){
      //       return ''
      //     }
      //       return `${text} (${isNotBlank(res.oneUser)&&isNotBlank(res.oneUser.status)&&isNotBlank(res.oneUser.id)?shstatus(res.oneUser.status):'待审核'})`
      //   }
      // },
      //  {
      //   title: '审批反馈1',        
      //   dataIndex: 'oneUser.remarks',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 150,          
      //   editable:  true  ,      
      //   render:(text)=>{
      //     return  <span style={{color:'#1890FF'}}>{text}</span>
      //   }
      // },
      // {
      //   title: '审批人2',        
      //   dataIndex: 'twoUser.name',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 200,          
      //   editable:  true  ,      
      //   render:(text,res)=>{
      //     if(!isNotBlank(text)){
      //       return ''
      //     }
      //     return `${text} (${isNotBlank(res.twoUser)&&isNotBlank(res.twoUser.status)&&isNotBlank(res.twoUser.id)?shstatus(res.twoUser.status):'待审核'})`
      //   }
      // },
      //  {
      //   title: '审批反馈2',        
      //   dataIndex: 'twoUser.remarks',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 150,          
      //   editable:  true  ,      
      //   render:(text)=>{
      //     return  <span style={{color:'#1890FF'}}>{text}</span>
      //   }
      // },
      // {
      //   title: '审批人3',        
      //   dataIndex: 'threeUser.name',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 200,          
      //   editable:  true  ,      
      //   render:(text,res)=>{
      //     if(!isNotBlank(text)){
      //       return ''
      //     }
      //     return `${text} (${isNotBlank(res.threeUser)&&isNotBlank(res.threeUser.status)&&isNotBlank(res.threeUser.id)?shstatus(res.threeUser.status):'待审核'})`
      //   }
      // },
      //  {
      //   title: '审批反馈3',        
      //   dataIndex: 'threeUser.remarks',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 150,          
      //   editable:  true  ,      
      //   render:(text)=>{
      //     return  <span style={{color:'#1890FF'}}>{text}</span>
      //   }
      // },
      // {
      //   title: '审批人4',        
      //   dataIndex: 'fourUser.name',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 200,          
      //   editable:  true  ,      
      //   render:(text,res)=>{
      //     if(!isNotBlank(text)){
      //       return ''
      //     }
      //     return `${text} (${isNotBlank(res.fourUser)&&isNotBlank(res.fourUser.status)&&isNotBlank(res.fourUser.id)?shstatus(res.fourUser.status):'待审核'})`
      //   }
      // },
      //  {
      //   title: '审批反馈4',        
      //   dataIndex: 'fourUser.remarks',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 150,          
      //   editable:  true  ,      
      //   render:(text)=>{
      //     return  <span style={{color:'#1890FF'}}>{text}</span>
      //   }
      // },
      // {
      //   title: '审批人5',        
      //   dataIndex: 'fiveUser.name',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 200,          
      //   editable:  true  ,      
      //   render:(text,res)=>{
      //     if(!isNotBlank(text)){
      //       return ''
      //     }
      //     return `${text} (${isNotBlank(res.fiveUser)&&isNotBlank(res.fiveUser.status)&&isNotBlank(res.fiveUser.id)?shstatus(res.fiveUser.status):'待审核'})`
      //   }
      // },
      //  {
      //   title: '审批反馈5',        
      //   dataIndex: 'fiveUser.remarks',   
      //   inputType: 'text',  
      //   align: 'center' ,  
      //   width: 150,          
      //   editable:  true  ,      
      //   render:(text)=>{
      //     return  <span style={{color:'#1890FF'}}>{text}</span>
      //   }
      // },
 		// {
		// 	title: '订单分类',        
		// 	dataIndex: 'orderType',   
    //   inputType: 'text', 
    //   align: 'center' ,  
		// 	width: 100,          
		// 	editable:  true  ,      
 		// },
     {
			title: '客户',        
			dataIndex: 'client.clientCpmpany',   
      inputType: 'text', 
      align: 'center' ,  
			width: 200,          
			editable:  true  ,      
     },
     {
			title: '联系人',        
			dataIndex: 'client.name',   
      inputType: 'text', 
      align: 'center' ,  
			width: 150,          
			editable:  true  ,      
     },
     {
			title: '总成型号',        
			dataIndex: 'assmblyBuild.assemblyModel',   
      inputType: 'text', 
      align: 'center' ,  
			width: 150,          
			editable:  true  ,      
     },
     {
			title: '总成品牌',        
			dataIndex: 'assmblyBuild.assemblyBrand',   
      inputType: 'text', 
      align: 'center' ,  
			width: 100,          
			editable:  true  ,      
     },
     {
			title: '车型/排量',        
			dataIndex: 'assmblyBuild.vehicleModel',   
      inputType: 'text', 
      align: 'center' ,  
			width: 150,          
			editable:  true  ,      
     },
     {
			title: '车型/排量',        
			dataIndex: 'assmblyBuild.assemblyYear',   
      inputType: 'text', 
      align: 'center' ,  
			width: 150,          
			editable:  true  ,      
     },
     {
			title: '车牌号',        
			dataIndex: 'plateNumber',   
      inputType: 'text', 
      align: 'center' ,  
			width: 150,          
			editable:  true  ,      
     },
     {
			title: 'VIN码',        
			dataIndex: 'assemblyVin',   
      inputType: 'text', 
      align: 'center' ,  
			width: 200,          
			editable:  true  ,      
     },

    //  {
		// 	title: '联系人',        
		// 	dataIndex: 'linkman',   
    //   inputType: 'text', 
    //   align: 'center' ,  
		// 	width: 150,          
		// 	editable:  true  ,      
    //  },
    //  {
		// 	title: '电话',        
		// 	dataIndex: 'phone',   
    //   inputType: 'text', 
    //   align: 'center' ,  
		// 	width: 150,          
		// 	editable:  true  ,      
    //  },
    //  {
		// 	title: '意向单内容',        
		// 	dataIndex: 'uname',   
    //   inputType: 'text', 
    //   align: 'center' ,  
		// 	width: 200,          
		// 	editable:  true  ,      
    //  },
    //  {
		// 	title: 'VIN码',        
		// 	dataIndex: 'assemblyVin',   
    //   inputType: 'text', 
    //   align: 'center' ,  
		// 	width: 150,          
		// 	editable:  true  ,      
    //  },
 		// {
		// 	title: '业务渠道',        
		// 	dataIndex: 'dicth',   
    //   inputType: 'text',
    //   align: 'center' ,   
		// 	width: 100,          
		// 	editable:  true  ,      
 		// },
 		// {
		// 	title: '业务分类',        
		// 	dataIndex: 'businessType',   
    //   inputType: 'text',
    //   align: 'center' ,   
		// 	width: 100,          
		// 	editable:  true  ,      
 		// },
 		// {
		// 	title: '品牌',        
		// 	dataIndex: 'brand',   
    //   inputType: 'text',
    //   align: 'center' ,   
		// 	width: 100,          
		// 	editable:  true  ,      
 		// },
 		// {
		// 	title: '业务员',        
		// 	dataIndex: 'user.name',   
    //   inputType: 'text', 
    //   align: 'center' ,  
		// 	width: 100,          
		// 	editable:  true  ,      
 		// },
 		// {
		// 	title: '客户',        
		// 	dataIndex: 'client.clientCpmpany',   
    //   inputType: 'text', 
    //   align: 'center' ,  
		// 	width: 240,          
		// 	editable:  true  ,      
 		// },
	//   {
  //       title: '质保时间',
  //       dataIndex: 'qualityTime',
  //       editable:   true  ,
  //       align: 'center' ,
  //       inputType: 'dateTime',
  //       width: 100,
  //       sorter: true,
	// render:(text)=>{
  //   if(isNotBlank(text)){
  //     return `${text.split(',')[0]}年${text.split(',')[1]}个月`
  //   }
  //   return ''
  // }
  //     },
 	// 	{
	// 		title: '联系人',        
	// 		dataIndex: 'linkman',   
  //     inputType: 'text',
  //     align: 'center' ,   
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '电话',        
	// 		dataIndex: 'phone',   
  //     inputType: 'text', 
  //     align: 'center' ,  
	// 		width: 150,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '是否收费',        
	// 		dataIndex: 'ischarge',   
  //     inputType: 'text',  
  //     align: 'center' , 
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '售后地址',        
	// 		dataIndex: 'afterAddress',   
  //     inputType: 'text',
  //     align: 'center' ,   
	// 		width: 150,          
	// 		editable:  true  ,      
 	// 	},
  //    {
  //     title: '总成型号',        
  //     dataIndex: 'assmblyBuild.assemblyModel',   
  //     inputType: 'text', 
  //     align: 'center' ,   
  //     width: 150,          
  //     editable: true,      
  //   },
  //    {
  //     title: '总成品牌',        
  //     dataIndex: 'assmblyBuild.assemblyBrand',   
  //     inputType: 'text',
  //     align: 'center' ,    
  //     width: 100,          
  //     editable: true,      
  //   },
  //   {
  //     title: '车型/排量',        
  //     dataIndex: 'assmblyBuild.vehicleModel',   
  //     inputType: 'text', 
  //     align: 'center' ,   
  //     width: 100,          
  //     editable: true,      
  //   },
  //   {
  //     title: '年份',        
  //     dataIndex: 'assmblyBuild.assemblyYear',   
  //     inputType: 'text', 
  //     align: 'center' ,   
  //     width: 100,          
  //     editable: true,      
  //   },
 	// 	{
  //     title: '技术参数',  
  //     align: 'center' ,      
	// 		dataIndex: 'technicalParameters',   
	// 		inputType: 'text',   
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
  //     title: '钢印号',  
  //     align: 'center' ,      
	// 		dataIndex: 'assemblySteelSeal',   
	// 		inputType: 'text',   
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
  //     title: 'VIN码',  
  //     align: 'center' ,      
	// 		dataIndex: 'assemblyVin',   
	// 		inputType: 'text',   
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
  //     title: '其他识别信息',   
  //     align: 'center' ,     
	// 		dataIndex: 'assemblyMessage',   
	// 		inputType: 'text',   
	// 		width: 150,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '维修项目',        
	// 		dataIndex: 'maintenanceProject',   
  //     inputType: 'text', 
  //     align: 'center' ,  
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '行程里程',        
	// 		dataIndex: 'tripMileage',   
  //     inputType: 'text',
  //     align: 'center' ,   
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '车牌号',        
	// 		dataIndex: 'plateNumber',   
  //     inputType: 'text',
  //     align: 'center' ,   
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '维修历史',        
	// 		dataIndex: 'maintenanceHistory',   
  //     inputType: 'text',
  //     align: 'center' ,   
	// 		width: 150,          
	// 		editable:  true  ,      
 	// 	},
 	// 	{
	// 		title: '历史单号',        
	// 		dataIndex: 'historyCode',   
  //     inputType: 'text',
  //     align: 'center' ,   
	// 		width: 100,          
	// 		editable:  true  ,      
 	// 	},
	//   {
  //       title: '更新时间',
  //       dataIndex: 'finishDate',
  //       editable:   true  ,
  //       align: 'center' ,
  //       inputType: 'dateTime',
  //       width: 150,
  //       sorter: true,
  //       render: (val)=>{
					// if(isNotBlank(val)){
				// 	 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
				// 	}
				// 	return ''
				// }
  //     },
 		// {
		// 	title: '备注信息',        
		// 	dataIndex: 'remarks',   
    //   inputType: 'text',
    //   align: 'center' ,   
		// 	width: 150,          
		// 	editable:  true  ,      
 		// }
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
      // {
      //    title: '详情',
      //    width: 100,
      //    align: 'center' ,
      //    render: (text, record) => (
      //      <Fragment>
      //        <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
      //      </Fragment>
      //    ),
      //  },
      ...fieldArray,
    //   {
    //    title: '基础操作',
    //    width: 100,
    //    align: 'center' ,
    //    render: (text, record) => {
    //      return ((record.approvals === 0 || record.approvals === '0'||record.approvals === 4 || record.approvals === '4')&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
    //      (item=>item.target=='cpAfterApplicationFrom').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAfterApplicationFrom')[0]
    //      .children.filter(item=>item.name=='删除').length>0) ?
    //        <Fragment>
    //          <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
    //            <a>删除</a>
    //          </Popconfirm>
    //        </Fragment>:''
    //    },
    //  }
     ];
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
          <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
            导入
          </Button>
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(0)}>
            导出模板
          </Button>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} >
                {/* {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
         (item=>item.target=='cpAfterApplicationFrom').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAfterApplicationFrom')[0]
         .children.filter(item=>item.name=='修改').length>0?
           <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
           </Button>
                :<Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
                </Button>
                } */}
               <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>售后历史单</div>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                loading={loading}
                data={cpAfterApplicationFromHistory}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onChange={this.handleStandardTableChange}
                 onRow={record => {
                  return {
                    onClick:()=> {
                    this.setState({
                      rowId: record.id,
                      })
                    },
                  };
                  }}
                rowClassName={(record, index) => 
									{
                    if(record.id === this.state.rowId){
                      return  'selectRow'
                   }
										if(record.approvals == '3'){
											  return 'greenstyle'
										}
										if(record.approvals == '0'||record.approvals == '1'||record.approvals == '2'||record.approvals == '4'){
											return 'redstyle'
										   }
									   if(record.orderStatus == '2'||record.orderStatus=='已关闭'){
											return 'graystyle'
										   }
										}
									}
              />
            </div>
          </Card>
        </div>
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default cpAfterApplicationFromHistory;
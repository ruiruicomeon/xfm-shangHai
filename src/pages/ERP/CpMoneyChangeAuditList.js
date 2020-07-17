import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input,  Form, Card, Popconfirm, Icon, Row, Col, Select,  message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl ,getPrice } from '@/utils/utils';
import moment from 'moment';
import styles from './CpMoneyChangeAuditList.less';
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
        CpMoneyChangeAuditSearchList,
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
          })(<SearchTableList searchList={CpMoneyChangeAuditSearchList} />)}
            </div>
          </Modal>
        );
      }
      }
@connect(({ cpMoneyChangeAudit, loading ,cpRevocation}) => ({
  ...cpMoneyChangeAudit,
  ...cpRevocation,
  loading: loading.models.cpMoneyChangeAudit,
}))
@Form.create()
class CpMoneyChangeAuditList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpRevocation/CpMoneyChangeAudit_SearchList',
    });
  }

  gotoForm = () => {
    router.push(`/review/process/cp_money_change_audit_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/review/process/cp_money_change_audit_form?id=${id}`);
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
      genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
    };
    dispatch({
      type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_List',
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
      type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_List',
      payload: {
        pageSize: 10,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
        type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_List',
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
        type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_List',
        payload: {
          ...values,
          pageSize: 10,
          genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
        type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_List',
            payload: {
             pageSize: 10,
             genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
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
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
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
      type: 'cpMoneyChangeAudit/cpMoneyChangeAudit_List',
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

  render() {
    const { selectedRows ,array,searchVisible} = this.state;
    const { loading, cpMoneyChangeAuditList ,CpMoneyChangeAuditSearchList} = this.props;
    const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			CpMoneyChangeAuditSearchList,
      }
      const shstatus = (apps) => {
        if(apps ==='0'|| apps===1){
           return '待分配'
        }
        if (apps === '1' || apps === 1) {
          return '待审核'
        }
        if (apps === '2' || apps === 2) {
          return '通过'
        }
        if (apps === '3' || apps === 3) {
          return '驳回'
        }
      }
    const field = [
      // {
      //   title: '订单状态',        
      //   dataIndex: 'approvals',   
      //   inputType: 'text', 
      //   align: 'center' ,   
      //   width: 100,          
      //   editable:  true  ,      
      //   render: (text) => {
      //     if (isNotBlank(text)) {
      //       if (text === 2 || text === '2') {
      //         return <span>已处理</span>
      //       }
      //       if (text === 0 || text === '0'||text === 1 || text === '1'||text === 3 || text === '3'||text === 4 || text === '4') {
      //         return <span>未处理</span>
      //       }
      //     }
      //   },
      //  },
 		{
      title: '订单编号',  
      align: 'center' ,       
			dataIndex: 'orderCode',   
			inputType: 'text',   
			width: 200,          
      editable:  true  ,      
 		},
     {
			title: '审批进度',        
			dataIndex: 'approvals',   
			inputType: 'text',   
      width: 100,  
      align: 'center' ,        
      editable:  true  ,      
      render: (text) => {
        if (isNotBlank(text)) {
          if (text === 0 || text === '0') {
            return <span style={{color:"#f50"}}>待分配</span>
          }
          if (text === 1 || text === '1') {
            return <span style={{color:"#f50"}}>待审核</span>
          }
          if (text === 2 || text === '2') {
            return <span style={{color:"rgb(53, 149, 13)"}}>通过</span>
          }
          if (text === 3 || text === '3') {
            return <span style={{color:"#f50"}}>驳回</span>
          }
        }
        return '';
      },
 		},
     {
			title: '审批人1',        
			dataIndex: 'auditUser.name',   
      inputType: 'text',  
      align: 'center' ,  
			width: 200,          
      editable:  true  ,      
      render:(text,res)=>{
        if(!isNotBlank(text)){
          return ''
        }
          return `${text} (${isNotBlank(res.approvals)?shstatus(res.approvals):'待审核'})`
      }
    },
     {
			title: '审批反馈1',        
			dataIndex: 'auditUser.remarks',   
      inputType: 'text',  
      align: 'center' ,  
			width: 150,          
      editable:  true  ,      
      render:(text)=>{
        return  <span style={{color:'#1890FF'}}>{text}</span>
      }
    },
 		{
      title: '申请类别',    
      align: 'center' ,     
			dataIndex: 'applyType',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '客户',  
      align: 'center' ,       
			dataIndex: 'client.clientCpmpany',   
			inputType: 'text',   
			width: 240,          
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
        title: '订单日期',
        dataIndex: 'orderDate',
        align: 'center' , 
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
			title: '业务项目',        
			dataIndex: 'project',   
      inputType: 'text',  
      align: 'center' ,  
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '业务分类',        
			dataIndex: 'businessType',   
      inputType: 'text',
      align: 'center' ,    
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '业务员',        
			dataIndex: 'user.name',   
      inputType: 'text',
      align: 'center' ,    
			width: 150,          
			editable:  true  ,      
 		},
 		{
			title: '应收金额',        
			dataIndex: 'receivable',   
      inputType: 'text',
      align: 'center' ,    
			width: 100,          
      editable:  true  ,      
      render:text=>(getPrice(text))
     },
 		{
			title: '申请金额',        
			dataIndex: 'applyMoney',   
      inputType: 'text',
      align: 'center' ,    
			width: 100,          
      editable:  true  ,      
      render:text=>(getPrice(text))
 		},
 		{
			title: '金额变更比例',        
			dataIndex: 'moneyProportion',   
      inputType: 'text',
      align: 'center' ,    
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '变更后金额',        
			dataIndex: 'changeMoney',   
      inputType: 'text', 
      align: 'center' ,   
			width: 100,          
      editable:  true  ,      
      render:text=>(getPrice(text))
 		},
 		{
			title: '成本金额',        
			dataIndex: 'costMoney',   
      inputType: 'text',
      align: 'center' ,    
			width: 100,          
      editable:  true  ,    
      render:(text,res)=>{
          if(isNotBlank(res.approvals)&&res.approvals!=0){
              return getPrice(text)
          }
          return ''
      }
      // render:text=>(getPrice(text))
 		},
	  {
        title: '审核日期',
        dataIndex: 'auditDate',
        editable:   true  ,
        align: 'center' , 
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
			title: '创建者',        
			dataIndex: 'createBy.name',   
      inputType: 'text', 
      align: 'center' ,   
			width: 100,          
			editable:  false ,      
 		},
	  {
        title: '创建时间',
        dataIndex: 'createDate',
        editable:   false ,
        align: 'center' , 
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
        dataIndex: 'finishDate',
        editable:   true  ,
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
			width: 150,          
			editable:  true  ,      
 		}, 
     {
       title: '所属公司',        
       dataIndex: 'createBy.office.name',   
       inputType: 'text',   
       width: 200,
       align: 'center',        
       editable: true,      
     } 
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
           ...fieldArray
           , {
           title: '基础操作',
           width: 100,
           align: 'center' , 
           render: (text, record) => {
            return ((record.orderStatus === 0 || record.orderStatus === '0'||record.orderStatus === '未处理')&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
            (item=>item.target=='cpMoneyChangeAudit').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpMoneyChangeAudit')[0]
            .children.filter(item=>item.name=='删除').length>0) ?
              <Fragment>
                <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </Fragment>:''
           },
         },
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
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>金额变更审核单</div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={cpMoneyChangeAuditList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                // onSelectRow={this.handleSelectRows}
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
										if(record.approvals == '2'){
											  return 'greenstyle'
										}
										if(record.approvals == '0'||record.approvals == '1'||record.approvals == '3'){
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
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpMoneyChangeAuditList;
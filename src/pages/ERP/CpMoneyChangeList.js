import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input,  Form, Card, Popconfirm, Icon, Row, Col, Select, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl ,getPrice } from '@/utils/utils';
import moment from 'moment';
import { parse, stringify } from 'qs';
import styles from './CpMoneyChangeList.less';
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
        CpMoneyChangeSearchList,
        } = this.props;
        return (
          <Modal
            width={860}
            title="多字段动态过滤"
            visible={searchVisible}
            onCancel={() =>  this.handleSearchVisiblein()}
            afterClose={() =>  this.handleSearchVisiblein()}
            onOk={() => this.okHandle()}
          >
            <div>
              {getFieldDecorator('genTableColumn', {
            initialValue: [],
          })(<SearchTableList searchList={CpMoneyChangeSearchList} />)}
            </div>
          </Modal>
        );
      }
      }
@connect(({ cpMoneyChange, loading ,cpRevocation }) => ({
  ...cpMoneyChange,
  ...cpRevocation,
  loading: loading.models.cpMoneyChange,
}))
@Form.create()
class CpMoneyChangeList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpMoneyChange/cpMoneyChange_List',
      payload: {
        pageSize: 10,
        type : 0
      }
    });
    dispatch({
      type: 'cpRevocation/CpMoneyChange_SearchList',
    });
  }

  gotoForm = () => {
    router.push(`/business/process/cp_money_change_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/business/process/cp_money_change_form?id=${id}`);
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
      type : 0,
      genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
    };
    dispatch({
      type: 'cpMoneyChange/cpMoneyChange_List',
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
      type: 'cpMoneyChange/cpMoneyChange_List',
      payload: {
        pageSize: 10,
        current: 1,
        type : 0,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
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
        type: 'cpMoneyChange/cpMoneyChange_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpMoneyChange/cpMoneyChange_List',
            payload: {
             pageSize: 10,
              ...formValues,
              type : 0,
              genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
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
        type: 'cpMoneyChange/cpMoneyChange_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
          type : 0
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
        type: 'cpMoneyChange/cpMoneyChange_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpMoneyChange/cpMoneyChange_List',
            payload: {
             pageSize: 10,
              ...formValues,
              type : 0
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
      type: 'cpMoneyChange/cpMoneyChange_List',
        payload: {
          ...this.state.formValues,
          genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
        type:0
        },
      });
      this.setState({
        searchVisible: false,
      });
      }

      handleFieldChange = (value) => {
        this.setState({
          array: value || []
        })
        }

        
      handleUpldExportClick = type => {
				const {  formValues } = this.state;
				const params = { 
          ...formValues,
          type : 0,
					genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
					'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):''
				}
				window.open(`/api/Beauty/beauty/cpMoneyChange/export?${stringify(params)}`);
        };

  render() {
    const { selectedRows ,array,searchVisible } = this.state;
    const { loading, cpMoneyChangeList ,CpMoneyChangeSearchList} = this.props;
    const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			CpMoneyChangeSearchList,
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
      // {
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
       {
        title: '订单编号',        
        dataIndex: 'orderCode',   
        inputType: 'text', 
        align: 'center' ,   
        width: 200,          
        editable:  true  ,      
       },
       {
        title: '客户',        
        dataIndex: 'client.clientCpmpany',   
        inputType: 'text', 
        align: 'center' ,   
        width: 240,          
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
              return <span style={{color:"#f50"}}>重新提交</span>
            }
            if (text === 3 || text === '3') {
              return <span style={{color:"rgb(53, 149, 13)"}}>通过</span>
            }
            if (text === 4 || text === '4') {
              return <span style={{color:"#f50"}}>驳回</span>
            }
          }
          return '';
        },
       },
       {
        title: '审批人1',        
        dataIndex: 'oneUser.name',   
        inputType: 'text',  
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
        render:(text,res)=>{
          if(!isNotBlank(text)){
            return ''
          }
            return `${text} (${isNotBlank(res.oneUser)&&isNotBlank(res.oneUser.status)&&isNotBlank(res.oneUser.id)?shstatus(res.oneUser.status):'待审核'})`
        }
      },
       {
        title: '审批反馈1',        
        dataIndex: 'oneUser.remarks',   
        inputType: 'text',  
        align: 'center' ,  
        width: 150,          
        editable:  true  ,      
        render:(text)=>{
          return  <span style={{color:'#1890FF'}}>{text}</span>
        }
      },
      {
        title: '审批人2',        
        dataIndex: 'twoUser.name',   
        inputType: 'text',  
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
        render:(text,res)=>{
          if(!isNotBlank(text)){
            return ''
          }
          return `${text} (${isNotBlank(res.twoUser)&&isNotBlank(res.twoUser.status)&&isNotBlank(res.twoUser.id)?shstatus(res.twoUser.status):'待审核'})`
        }
      },
       {
        title: '审批反馈2',        
        dataIndex: 'twoUser.remarks',   
        inputType: 'text',  
        align: 'center' ,  
        width: 150,          
        editable:  true  ,      
        render:(text)=>{
          return  <span style={{color:'#1890FF'}}>{text}</span>
        }
      },
      {
        title: '审批人3',        
        dataIndex: 'threeUser.name',   
        inputType: 'text',  
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
        render:(text,res)=>{
          if(!isNotBlank(text)){
            return ''
          }
          return `${text} (${isNotBlank(res.threeUser)&&isNotBlank(res.threeUser.status)&&isNotBlank(res.threeUser.id)?shstatus(res.threeUser.status):'待审核'})`
        }
      },
       {
        title: '审批反馈3',        
        dataIndex: 'threeUser.remarks',   
        inputType: 'text',  
        align: 'center' ,  
        width: 150,          
        editable:  true  ,      
        render:(text)=>{
          return  <span style={{color:'#1890FF'}}>{text}</span>
        }
      },
      {
        title: '审批人4',        
        dataIndex: 'fourUser.name',   
        inputType: 'text',  
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
        render:(text,res)=>{
          if(!isNotBlank(text)){
            return ''
          }
          return `${text} (${isNotBlank(res.fourUser)&&isNotBlank(res.fourUser.status)&&isNotBlank(res.fourUser.id)?shstatus(res.fourUser.status):'待审核'})`
        }
      },
       {
        title: '审批反馈4',        
        dataIndex: 'fourUser.remarks',   
        inputType: 'text',  
        align: 'center' ,  
        width: 150,          
        editable:  true  ,      
        render:(text)=>{
          return  <span style={{color:'#1890FF'}}>{text}</span>
        }
      },
      {
        title: '审批人5',        
        dataIndex: 'fiveUser.name',   
        inputType: 'text',  
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
        render:(text,res)=>{
          if(!isNotBlank(text)){
            return ''
          }
          return `${text} (${isNotBlank(res.fiveUser)&&isNotBlank(res.fiveUser.status)&&isNotBlank(res.fiveUser.id)?shstatus(res.fiveUser.status):'待审核'})`
        }
      },
       {
        title: '审批反馈5',        
        dataIndex: 'fiveUser.remarks',   
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
        dataIndex: 'applyType',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable:  true  ,      
       },
       {
        title: '总成型号',        
        dataIndex: 'assemblyModel',   
        inputType: 'text', 
        align: 'center' ,   
        width: 150,          
        editable:  true  ,      
       },
      {
          title: '订单日期',
          dataIndex: 'orderDate',
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
        render: (text,res) => {
          if(isNotBlank(res.isGroup)&&res.isGroup==1){
            return getPrice(getPrice(text))
          }
          return getPrice(text)
        }
       },
       {
        title: '申请金额',        
        dataIndex: 'applyMoney',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable:  true  ,      
        render: (text,res) => {
          if(isNotBlank(res.isGroup)&&res.isGroup==1){
            return getPrice(getPrice(text))
          }
          return getPrice(text)
        }
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
        render: (text,res) => {
          if(isNotBlank(res.isGroup)&&res.isGroup==1){
            return getPrice(getPrice(text))
          }
          return getPrice(text)
        }
       },
       {
        title: '成本金额',        
        dataIndex: 'costTotalMoney',   
        inputType: 'text', 
        align: 'center' ,   
        width: 100,          
        editable:  true  ,      
        render:text=>(getPrice(text))
       },
      {
          title: '审核日期',
          dataIndex: 'auditDate',
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
       ...fieldArray,
        {
         title: '基础操作',
         width: 100,
         align: 'center' ,
         render: (text, record) => {
           return ((record.approvals === 0 || record.approvals === '0'||record.approvals === 2 || record.approvals === '2'||record.approvals === 4 || record.approvals === '4')&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
           (item=>item.target=='cpMoneyChange').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpMoneyChange')[0]
           .children.filter(item=>item.name=='删除').length>0) ?
             <Fragment>
               <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                 <a>删除</a>
               </Popconfirm>
             </Fragment>
           :''
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
        <div className={styles.tableListOperator}>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
            导出
            </Button>
   			 </div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} style={{'position':'relative'}}>
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
           (item=>item.target=='cpMoneyChange').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpMoneyChange')[0]
           .children.filter(item=>item.name=='修改').length>0?
             <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
             </Button>
                :
             <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                                新建
             </Button>
  }
                <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
金额变更申请单
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                loading={loading}
                data={cpMoneyChangeList}
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
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpMoneyChangeList;
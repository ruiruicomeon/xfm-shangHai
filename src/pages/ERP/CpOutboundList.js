import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input,  Form, Card, Popconfirm, Icon, Switch, Row, Col, Select,  message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, getPrice } from '@/utils/utils';
import moment from 'moment';
import styles from './CpOutboundList.less';
import SearchTableList from '@/components/SearchTableList';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
    const CreateFormpass = Form.create()(props => {
      const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass ,form: { getFieldDecorator } ,pjnumber } = props;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          const values = {...fieldsValue};
          handleAddpass(values);
        });
      };
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
        };
      return (
        <Modal
          title='出库数量'
          visible={modalVisiblepass}
          onOk={okHandle}
          onCancel={() => handleModalVisiblepass()}
        >
          <FormItem {...formItemLayout} label="出库数量">
            {getFieldDecorator('quoteNumber', {
										initialValue:pjnumber,
										rules: [
											{
												required: true,   
												message: '请输入出库数量',
											},
										],
									})(<Input />)
									}
          </FormItem>
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
      CpOutboundearchList,
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
          })(<SearchTableList searchList={CpOutboundearchList} />)}
        </div>
      </Modal>
    );
  }
}
@connect(({ cpOutbound, loading, cpRevocation }) => ({
  ...cpOutbound,
  ...cpRevocation,
  loading: loading.models.cpOutbound,
}))
@Form.create()
class CpOutboundList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    pjnumber:0 ,
    pagedata:{},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpOutbound/cpOutbound_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpRevocation/CpOutbound_SearchList',
    });
  }

  gotoForm = () => {
    router.push(`/warehouse/process/cp_outbound_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/warehouse/process/cp_outbound_form?id=${id}`);
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
      genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
    };

    this.setState({
       pagedata:params
    })

    dispatch({
      type: 'cpOutbound/cpOutbound_List',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pagedata:{}
    });
    dispatch({
      type: 'cpOutbound/cpOutbound_List',
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
      title: '批量删除',
      content: '确定批量删除已选择的数据吗？',
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
        message.error('未选择需要操作的数据');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    if (isNotBlank(ids)) {
     dispatch({
      type: 'cpOutbound/cpOutbound_Delete',
      payload: {
        id: ids,
      },
      callback: () => {
        this.setState({
          selectedRows: []
        })
        dispatch({
          type: 'cpOutbound/cpOutbound_List',
          payload: {
            // pageSize: 10,
            ...this.state.formValues,
            ...this.state.pagedata,
            genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
          }
        });
      }
    });
   }
  };

  chukuClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    let ids = '';
    if (isNotBlank(id)) {
      ids = id;
    } else {
      if (selectedRows.length === 0) {
        message.error('未选择需要操作的数据');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    if (isNotBlank(id)) {
    dispatch({
      type: 'cpOutbound/cpOutbound_Add',
      payload: {
        id,
      },
      callback: () => {
        this.setState({
          selectedRows: []
        })
        dispatch({
          type: 'cpOutbound/cpOutbound_List',
          payload: {
            pageSize: 10,
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
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      this.setState({
        formValues: values,
        pagedata:{}
      });
      dispatch({
        type: 'cpOutbound/cpOutbound_List',
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
        if (value[item] instanceof moment) {
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpOutbound/cpOutbound_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpOutbound/cpOutbound_List',
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
            <FormItem label="单号">
              {getFieldDecorator('id', {
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
      type: 'cpOutbound/cpOutbound_List',
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

  shownumber=(res)=>{
    this.setState({
        pjnumber:isNotBlank(res.notOutNumber)?res.notOutNumber:0,
        rukuid:isNotBlank(res.id)?res.id:'',
        modalVisiblepass:true
    })
}

handleModalVisiblepass = flag => {
  this.setState({
    modalVisiblepass: !!flag,
  });
};

handleAddpass =(val)=>{
const {dispatch} = this.props
const {rukuid} = this.state
const values = {...val}
dispatch({
  type: 'cpOutbound/cpOutbound_Add',
  payload:{
    id:rukuid,
    ...values,
  },
  callback:()=>{
    dispatch({
      type: 'cpOutbound/cpOutbound_List',
      payload: {
        // pageSize: 10,
        ...this.state.formValues,
        ...this.state.pagedata,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
      }
    });
  }
})
this.setState({
modalVisiblepass: false,
}); 
}

editAndSwitch = (checked, record) => {
  if (isNotBlank(record) && isNotBlank(record.id)&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutbound').length>0
  && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutbound')[0].children.filter(item=>item.name=='修改')
  .length>0) {
    Modal.confirm({
      title: `修改启用状态`,
      content: `确定状态修改为${checked ? '开启' : '关闭'}状态吗？`,
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
  type:'cpOutbound/cpOutbound_Update',
  payload: {
    id:record.id,
    orderStatus: checked ? 1 : 2
  },
  callback: () => {
    dispatch({
      type: 'cpOutbound/cpOutbound_List',
      payload: {
        ...this.state.formValues,
        ...this.state.pagedata,
        genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
      }
    });
  }
})
}

  render() {
    const { selectedRows, array, searchVisible ,modalVisiblepass ,rukuid ,pjnumber} = this.state;
    const { loading, cpOutboundList, CpOutboundearchList } = this.props;
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      CpOutboundearchList,
    }
    const parentMethodspass = {
			handleAddpass: this.handleAddpass,
			handleModalVisiblepass :this.handleModalVisiblepass,
      modalVisiblepass,
      pjnumber
		}
    const field = [
      {
        title: '单号',        
        dataIndex: 'id', 
        align: 'center' ,   
        inputType: 'text',   
        width: 200,          
        editable: false,      
      },
      {
        title: '分类', 
        align: 'center' , 
        dataIndex: 'formType', 
        inputType: 'text', 
        width: 150, 
        editable: true, 
        render:(text)=>{
          if(text==1){
             return '整车维修'
          }
          if(text==2){
             return '总成维修'
            }
            if(text==3){
                  return '配件销售'
            }
            if(text==4){
                return '总成翻新'
            }
             if(text==8){
                    return '总成销售'
                   }
           if(text==6){
                    return '内部订单'
                   }
                   if(text==7){
                    return '售后流程'
                   }
                   if(text==5){
                    return '配件调拨'
                   }
                return ''
              }
       },
      {
        title: '启用状态',
        align: 'center' ,
        dataIndex: 'orderStatus',
        width: 150,
        render: (text, record) => {
          if (isNotBlank(text)) {
            return <Switch 
              disabled={!(isNotBlank(record) && isNotBlank(record.id)&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutbound').length>0
            && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutbound')[0].children.filter(item=>item.name=='修改')
            .length>0)}
              onChange={(checked) => this.editAndSwitch(checked, record)} 
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={text == 1 || text == 0 ||text == '未处理' ||text =='已处理'}
            />
          }
          return <a>无归还状态</a>
          }
        },
      {
        title: '订单编号',        
        dataIndex: 'orderCode',   
        inputType: 'text', 
        align: 'center' ,   
        width: 200,          
        editable: false,      
      },
      {
        title: '客户',        
        dataIndex: 'client.clientCpmpany',
        align: 'center' ,    
        inputType: 'text',   
        width: 240,          
        editable:  true  ,  
        render:(text,record)=>{
          if(isNotBlank(record)&&isNotBlank(record.formType)&&(record.formType==4||record.formType==6)){
               return isNotBlank(record.createBy)&&isNotBlank(record.createBy.office)&&isNotBlank(record.createBy.office.name)?record.createBy.office.name:''
          }
            return isNotBlank(record.client)&&isNotBlank(record.client.clientCpmpany)?record.client.clientCpmpany:''
          
      }
      },
      {
        title: '物料编码',        
        dataIndex: 'cpBillMaterial.billCode',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable: false,      
      },
      {
        title: '一级编码',        
        dataIndex: 'cpBillMaterial.oneCode',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable: false,      
      },
      {
        title: '二级编码',        
        dataIndex: 'cpBillMaterial.twoCode',   
        inputType: 'text', 
        align: 'center' ,   
        width: 100,          
        editable: false,      
      },
      {
        title: '一级编码型号',        
        dataIndex: 'cpBillMaterial.one.model',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable: false,      
      },
      {
        title: '二级编码名称',        
        dataIndex: 'cpBillMaterial.two.name',   
        inputType: 'text',  
        align: 'center' ,  
        width: 100,          
        editable: false,      
      },
      {
        title: '名称',        
        dataIndex: 'cpBillMaterial.name',   
        inputType: 'text', 
        align: 'center' ,   
        width: 300,          
        editable: false,      
      },
      {
        title: '原厂编码',        
        dataIndex: 'cpBillMaterial.originalCode',   
        inputType: 'text', 
        align: 'center' ,   
        width: 100,          
        editable: false,      
      },
      {
        title: '配件厂商',        
        dataIndex: 'cpBillMaterial.rCode',   
        inputType: 'text', 
        align: 'center' ,   
        width: 100,          
        editable: false,      
      },
      {
        title: '单位',        
        dataIndex: 'cpBillMaterial.unit',   
        inputType: 'text', 
        align: 'center' ,   
        width: 100,          
        editable: false,      
      },
      {
        title: '出库数量',        
        dataIndex: 'outNumber',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable: true,  
      },
      {
        title: '未出库数量',        
        dataIndex: 'notOutNumber',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable: true,  
      },
      {
        title: '报件数量',        
        dataIndex: 'quoteNumber',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable: true,      
      },
      {
        title: '库存数量',        
        dataIndex: 'repertoryNumber',   
        inputType: 'text',
        align: 'center' ,    
        width: 100,          
        editable: true,      
      },
      {
        title: '出库单价',
        dataIndex: 'repertoryPrice',
        inputType: 'text',
        align: 'center' , 
        width: 100,
        editable: false,
        render: text => (getPrice(text))
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        editable: false,
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
        dataIndex: 'updateDate',
        editable: false,
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
        title: '备注信息',        
        dataIndex: 'cpBillMaterial.remarks',   
        inputType: 'text', 
        align: 'center' ,   
        width: 150,          
        editable: false,      
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
        title: '操作',
        width: 100,
        align: 'center' , 
        fixed: 'left',
        render: (text, record) => {
          return (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOutbound').length > 0&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOutbound')[0].children.filter(item => item.name == '修改').length > 0 ?
            <Fragment>
              {isNotBlank(record) && isNotBlank(record.status) && record.status == 0 && (record.orderStatus!=='已关闭')&&
                <a onClick={()=>this.shownumber(record)}>出库</a>
               }
            </Fragment>
            : '')
        },
      },
      ...fieldArray,
      {
        title: '基础操作',
        width: 100,
        align: 'center' , 
        render: (text, record) => {
          return (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
          (item=>item.target=='cpOutbound').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOutbound')[0]
          .children.filter(item=>item.name=='删除').length>0) ?
            <Fragment>
              { isNotBlank(record.notOutNumber)&&isNotBlank(record.quoteNumber)&&record.quoteNumber==record.notOutNumber&&
              <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                <a>删除</a>
              </Popconfirm>
            }
            </Fragment>
          :''
        },
      }
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
              <div className={styles.tableListOperator}>
                <div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>待出库清单</div>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={cpOutboundList}
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
                  if (record.orderStatus == '1' || record.orderStatus == '已处理') {
                    return 'redstyle'
                  }
                  if (record.orderStatus == '0' || record.orderStatus == '未处理') {
                    return 'redstyle'
                  }
                  if (record.orderStatus == '2' || record.orderStatus == '已关闭') {
                    return 'graystyle'
                  }
                }
                }
              />
            </div>
          </Card>
        </div>
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CpOutboundList;
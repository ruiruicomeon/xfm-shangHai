import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input , Form, Card , Icon, Row, Col, Select, DatePicker,  message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl ,getPrice} from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import { stringify } from 'qs';
import moment from 'moment';
import styles from './CpCloseList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
    const CreateFormkh = Form.create()(props => {
      const { handleModalVisiblekh,handleSearchChangezc, getzcByBilllist, selectkhflag ,form ,dispatch} = props;
      const { getFieldDecorator } = form
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
      const columnskh = [
        {
          title: '操作',        
          dataIndex: 'type',   
          inputType: 'text',   
          width: 100,          
          editable: true,      
          render:(text,res,index)=>{
              if(index == 0){
                    return '期初数'
              }
                 return <span>{text}</span>
          }
        },
        {
          title: '日期',        
          dataIndex: 'createDate',   
          inputType: 'text',   
          width: 150,          
          editable: true,      
        },
        {
          title: '单号',        
          dataIndex: 'purchaseId',   
          inputType: 'text',   
          width: 100,          
          editable: true,      
        },
        {
          title: '库位',        
          dataIndex: 'cpPjStorage.name',   
          inputType: 'text',   
          width: 100,          
          editable: true,      
        },
        {
          title: '操作数量',        
          dataIndex: 'number',   
          inputType: 'text',   
          width: 150,          
          editable: true,      
          render:(text,res,index)=>{
            if(index==0){
                return <span>{res.startNumber}</span>
            }if(index == getzcByBilllist.list.length-1){
              return <span>合计：{res.number}</span>
            }
            return <span>{text}</span>
          }
        },
        {
          title: '操作单价',        
          dataIndex: 'price',   
          inputType: 'text',   
          width: 150,          
          editable: true,      
          render:(text,res,index)=>{
            if(index==0){
                return <span>{getPrice(res.balancePrice)}</span>
            }if(index == getzcByBilllist.list.length-1){
              return <span>平均单价：{getPrice(res.price)}</span>
            }
            return <span>{getPrice(text)}</span>
          }
        },
        {
          title: '操作金额',        
          dataIndex: 'money',   
          inputType: 'text',   
          width: 150,          
          editable: true,      
          render:(text,res,index)=>{
            if(index==0){
                return <span>{getPrice(res.startMoney)}</span>
            }if(index == getzcByBilllist.list.length-1){
              return <span>合计：{getPrice(res.money)}</span>
            }
            return <span>{getPrice(text)}</span>
          }
        },
        {
          title: '备注信息',        
          dataIndex: 'remarks',   
          inputType: 'text',   
          width: 100,          
          editable: true,      
        }
      ];
      return (
        <Modal
          title='库存明细表'
          visible={selectkhflag}
          onCancel={() => handleModalVisiblekh()}
          width='80%'
        >
          <StandardTable
            bordered
            scroll={{ x: 1050 }}
            data={getzcByBilllist}
            columns={columnskh}
          />
        </Modal>
      );
    });
    const CreateFormpass = Form.create()(props => {
      const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass ,form: { getFieldDecorator } } = props;
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
          title='查询区间'
          visible={modalVisiblepass}
          onOk={okHandle}
          onCancel={() => handleModalVisiblepass()}
        >
               <FormItem {...formItemLayout} label="开始时间">
        {getFieldDecorator('startDate', {
          initialValue: moment().subtract(30, "days"),
          rules: [
            {
              required: true,
              message: '请选择开始时间',
            },
          ],
        })(
          <DatePicker
            
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="结束时间">
        {getFieldDecorator('endDate', {
          initialValue: moment(),
          rules: [
            {
              required: true,
              message: '请选择结束时间',
            },
          ],
        })(
          <DatePicker
            
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        )
        }
      </FormItem>
        </Modal>
      );
    });
@connect(({ cpstatistics, loading ,cpPurchaseDetail}) => ({
  ...cpstatistics,
  ...cpPurchaseDetail,
  loading: loading.models.cpstatistics,
}))
@Form.create()
class CpCloseList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisiblepass:true,
    datavalue:{}
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'cpstatistics/get_zc_plant',
    //   payload: {
    //     pageSize: 10,
    //   }
    // });
  }

  componentWillUnmount() {
		const { dispatch, form } = this.props;
		dispatch({
			type: 'cpstatistics/clear',
		});
	}

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues ,datavalue} = this.state;
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
      ...datavalue
    };
    dispatch({
      type: 'cpstatistics/get_zc_plant',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const {startdate,enddate } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpstatistics/get_zc_plant',
      payload: {
        pageSize: 10,
        current: 1,
        startDate:startdate,
         endDate:enddate,
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
    const { selectedRows, formValues ,startdate ,enddate  } = this.state;
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
        type: 'cpClose/cpClose_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpstatistics/get_zc_plant',
            payload: {
             pageSize: 10,
              ...formValues,
              endDate :enddate  ,
              startDate: startdate,
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
    const {startdate,enddate } = this.state;
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
        type: 'cpstatistics/get_zc_plant',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          startDate:startdate,
          endDate:enddate,
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues ,startdate ,enddate} = this.state;
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
        type: 'cpClose/cpClose_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpstatistics/get_zc_plant',
            payload: {
             pageSize: 10,
              ...formValues,
              endDate :enddate  ,
              startDate: startdate,
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
            <FormItem label="总成型号">
              {getFieldDecorator('assemblyBuild.assemblyModel', {
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
            <FormItem label="状态">
              {getFieldDecorator('status', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建者">
              {getFieldDecorator('createBy.id', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createDate', {
						initialValue: ''
					  })(
  <DatePicker style={{ width: '100%' }}  />
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

  handleModalVisiblepass = flag => {
		this.setState({
			modalVisiblepass: !!flag,
		});
	};

  handleAddpass =(val)=>{
    const {dispatch} = this.props
    const values = {...val}
    values.startDate = moment(values.startDate).format("YYYY-MM-DD")
    values.endDate = moment(values.endDate).format("YYYY-MM-DD")
    this.setState({
      startdate:values.startDate,
      enddate:values.endDate,
      datavalue:values
    })
    dispatch({
      type: 'cpstatistics/get_zc_plant',
      payload: {
        pageSize: 10,
        ...values
      }
    });
    this.setState({
			modalVisiblepass: false,
		}); 
  }

  handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
  };

  showmx=(res)=>{ 
    const {dispatch} = this.props
    const { startdate,enddate} = this.state


    
    dispatch({
      type:'cpPurchaseDetail/get_zcBy_Bill',
      payload:{
            'assemblyBuild.id':isNotBlank(res.assemblyBuild)&&isNotBlank(res.assemblyBuild.id)?res.assemblyBuild.id:'',
            startDate:startdate,
            endDate:enddate,
            'cpEntrepot.id':isNotBlank(res.cpEntrepot)&&isNotBlank(res.cpEntrepot.id)? res.cpEntrepot.id:'',
            'office.id': isNotBlank(res.office)&&isNotBlank(res.office.id)?res.office.id:''
      }
    })
      this.setState({
         mxdata:res,
         selectkhflag:true
      })
}



handleUpldExportClick = type => {
  const { formValues ,enddate ,startdate} = this.state;

  const newobj = {...formValues}
  const newkey =  isNotBlank(newobj.assemblyBuild)&&isNotBlank(newobj.assemblyBuild.assemblyModel)?newobj.assemblyBuild.assemblyModel:''
  delete newobj.assemblyBuild

  const params = {
    endDate :enddate  ,
    startDate: startdate,
    ...newobj,
    'assemblyBuild.assemblyModel':newkey,
    'user.id':getStorage('userid'),
  }
  window.open(`/api/Beauty/beauty/cpPurchaseDetail/zcplantExport?${stringify(params)}`);
};


  render() {
    const { selectedRows ,modalVisiblepass ,selectkhflag} = this.state;
    const { loading, zcplantlist ,getzcByBilllist,dispatch} = this.props;
    const columns = [
       {
        title: '操作分类',        
        dataIndex: 'remarks',   
        inputType: 'text', 
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
       },
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
        dataIndex: 'cpClient.clientCpmpany',   
        inputType: 'text', 
        align: 'center' ,  
        width: 240,          
        editable:  true  ,      
       },
       {
        title: '单号',        
        dataIndex: 'purchaseId',   
        inputType: 'text',
        align: 'center' ,   
        width: 150,          
        editable:  true  ,      
       },
       {
        title: '总成编码',        
        dataIndex: 'purchaseCode',   
        inputType: 'text', 
        align: 'center' ,  
        width: 200,          
        editable:  true  ,      
       },
       {
        title: '总成型号',        
        dataIndex: 'assemblyBuild.assemblyModel',   
        inputType: 'text',
        align: 'center' ,   
        width: 150,          
        editable:  true  ,      
       },
       {
        title: '大号',        
        dataIndex: 'assemblyBuild.maxCode',   
        inputType: 'text', 
        align: 'center' ,  
        width: 150,          
        editable:  true  ,      
       },
       {
        title: '小号',        
        dataIndex: 'assemblyBuild.minCode',   
        inputType: 'text', 
        align: 'center' ,  
        width: 150,          
        editable:  true  ,      
       },
       {
        title: '车型',        
        dataIndex: 'assemblyBuild.vehicleModel',   
        inputType: 'text', 
        align: 'center' ,  
        width: 150,          
        editable:  true  ,      
       },
       {
        title: '品牌',        
        dataIndex: 'assemblyBuild.assemblyBrand',   
        inputType: 'text', 
        align: 'center' ,  
        width: 100,          
        editable:  true  ,      
       },
       {
        title: '年份',        
        dataIndex: 'assemblyBuild.assemblyYear',   
        inputType: 'text',
        align: 'center' ,   
        width: 100,          
        editable:  true  ,      
       },
       {
        title: '原厂编码',        
        dataIndex: 'assemblyBuild.originalCode',   
        inputType: 'text', 
        align: 'center' ,  
        width: 100,          
        editable:  true  ,      
       },
       {
        title: '再制造编码',        
        dataIndex: 'assemblyBuild.makeCode',   
        inputType: 'text', 
        align: 'center' ,  
        width: 100,          
        editable:  true  ,      
       },
   {
    title: '单价',        
    dataIndex: 'price',   
    inputType: 'text',   
    width: 100,          
    editable:  true  ,      
    render:text=>(getPrice(text))
   },
   {
    title: '数量',        
    dataIndex: 'number',   
    inputType: 'text',   
    width: 100,          
    editable:  true  ,      
   },
 {
  title: '金额',        
  dataIndex: 'storeMoney',   
  inputType: 'text',   
  width: 100,          
  editable:  true  ,      
  render:text=>(getPrice(text))
 },
 {
  title: '订单日期',        
  dataIndex: 'finishDate',   
  inputType: 'text',   
  width: 150,          
  editable:  true  ,      
 },{
  title: '所属公司',        
  dataIndex: 'createBy.office.name',   
  inputType: 'text',
  align: 'center',   
  width: 150,          
  editable: true,      
}
    ];
    const parentMethodskh = {
      getzcByBilllist,
      dispatch,
			handleModalVisiblekh: this.handleModalVisiblekh,
		}
    const parentMethodspass = {
			handleAddpass: this.handleAddpass,
			handleModalVisiblepass :this.handleModalVisiblepass,
			modalVisiblepass
		}
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <div className={styles.tableListOperator}>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
            导出
            </Button>
          </div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>总成车间报表</div>
              </div>
              <StandardEditTable
                scroll={{ x: 2600 }}
                loading={loading}
                data={zcplantlist}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
      </PageHeaderWrapper>
    );
  }
}
export default CpCloseList;
import React, { PureComponent, Fragment } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { isNotBlank, getFullUrl, getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import moment from 'moment';
import styles from './CpCloseList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, handleSearchChangezc, getByBillList, selectkhflag, form, dispatch } = props;
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
      align: 'center',  
      width: 100,          
      editable: true,      
      render: (text, res, index) => {
        if (isNotBlank(index) && index == 0) {
          return '期初'
        }
        if(isNotBlank(res)&&isNotBlank(res.remarks)&&res.remarks=='退货'){
          return '退货'
       }
       if(isNotBlank(res)&&isNotBlank(res.remarks)&&res.remarks=='退料'){
         return '退料'
      }
        if (isNotBlank(getByBillList) && isNotBlank(getByBillList.length) && getByBillList.length > 0 && getByBillList.length - 1 == index) {
          return ''
        }
        return <span>{text}</span>
      }
    },
    {
      title: '操作数量',        
      dataIndex: 'number',   
      inputType: 'text',
      align: 'center',  
      width: 150,          
      editable: true,      
      render: (text, res, index) => {

        if (index == 0) {
          return <span>{res.startNumber}</span>
        } if (index == getByBillList.list.length - 1) {
          return <span>合计：{res.number}</span>
        }
        return <span>{text}</span>
      }
    },
    {
      title: '日期',        
      dataIndex: 'createDate',   
      inputType: 'text',
      align: 'center',  
      width: 150,          
      editable: true,      
    },
    {
      title: '单号',        
      dataIndex: 'purchaseId',   
      inputType: 'text',
      align: 'center',   
      width: 150,          
      editable: true,      
    },
    {
      title: '库位',        
      dataIndex: 'cpPjStorage.name',   
      inputType: 'text',
      align: 'center',  
      width: 150,          
      editable: true,      
    },
    {
      title: '操作单价',        
      dataIndex: 'price',   
      inputType: 'text',
      align: 'center',  
      width: 150,          
      editable: true,      
      render: (text, res, index) => {
        if (index == 0) {
          return <span>{getPrice(res.balancePrice)}</span>
        } if (index == getByBillList.list.length - 1) {
          return <span>平均单价：{getPrice(res.price)}</span>
        }
        return <span>{getPrice(text)}</span>
      }
    },
    {
      title: '操作金额',        
      dataIndex: 'money',   
      inputType: 'text',
      align: 'center',   
      width: 150,          
      editable: true,      
      render: (text, res, index) => {
        if (index == 0) {
          return <span>{getPrice(res.startMoney)}</span>
        } if (index == getByBillList.list.length - 1) {
          return <span>合计：{getPrice(res.money)}</span>
        }
        return <span>{getPrice(text)}</span>
      }
    },
    {
      title: '备注信息',        
      dataIndex: 'remarks',   
      inputType: 'text',
      align: 'center',   
      width: 150,          
      editable: true,      
    }
  ];
  return (
    <Modal
      title='库存明细表'
      visible={selectkhflag}
      
      onCancel={() => handleModalVisiblekh()}
      width='80%'
      className='hiddentabletotal'
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        pagination={false}
        data={getByBillList}
        
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormpass = Form.create()(props => {
  const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass, form: { getFieldDecorator } } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = { ...fieldsValue };
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
          initialValue:moment().startOf('month'),
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
          initialValue:moment().endOf('month'),
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

@connect(({ cpstatistics, loading, cpPurchaseDetail ,syslevel }) => ({
  ...cpstatistics,
  ...cpPurchaseDetail,
  ...syslevel,
  loading: loading.models.cpstatistics,
}))
@Form.create()

class CpCloseList extends PureComponent {

  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisiblepass: true,
    datavalue: {},
    mxdata: {},
    selectkhflag: false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'syslevel/fetch2',
      payload: {
        type: 2,
        pageSize:100
      },
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'cpstatistics/clear',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, datavalue } = this.state;

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
      ...datavalue,
      // switchType:2
    };
    dispatch({
      type: 'cpstatistics/find_ZCOutSalesFromDetail',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { startdate, enddate } = this.state
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpstatistics/find_ZCOutSalesFromDetail',
      payload: {
        pageSize: 10,
        current: 1,
        // switchType: 2,
        startDate: startdate,
        endDate: enddate
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
    const { selectedRows, formValues, startdate, enddate } = this.state;
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
            type: 'cpstatistics/find_ZCOutSalesFromDetail',
            payload: {
              pageSize: 10,
              ...formValues,
              // switchType: 2,
              startDate: startdate,
              endDate: enddate
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
    const { startdate, enddate } = this.state;
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
        type: 'cpstatistics/find_ZCOutSalesFromDetail',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          // switchType: 2,
          startDate: startdate,
          endDate : enddate
        },
      });
    });
  };

  onSaveData = (key, row) => {
    const { formValues, startdate, enddate } = this.state;
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
        type: 'cpClose/cpClose_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpstatistics/find_ZCOutSalesFromDetail',
            payload: {
              pageSize: 10,
              ...formValues,
              // switchType: 2,
              startDate: startdate,
              endDate : enddate
            }
          });
        }
      });
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      levellist2
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {/* <Col md={8} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col> */}
          {/* <Col md={8} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeName', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
           */}
           <Col md={8} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('purchaseId', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
               <Col md={8} sm={24}>
          <FormItem  label="订单编号">
            {getFieldDecorator('orderCode', {
								initialValue: '',
							})( <Input  />)
}
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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      levellist2
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('purchaseId', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
               <Col md={8} sm={24}>
          <FormItem  label="订单编号">
            {getFieldDecorator('orderCode', {
								initialValue: '',
							})( <Input  />)
}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
            <FormItem label="总成编码">
              {getFieldDecorator('purchaseCode', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
          <FormItem  label="所属分公司">
            {getFieldDecorator('officeId', {
								initialValue: '',
							})(
  <Select
      
    style={{ width: '100%' }}
    allowClear
  >
    {isNotBlank(levellist2) &&
										isNotBlank(levellist2.list) &&
										levellist2.list.length > 0 &&
										levellist2.list.map(item => (
  <Option value={item.id} key={item.id}>
    {item.name}
  </Option>
										))}
  </Select>
							)}
          </FormItem>
        </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="仓库">
              {getFieldDecorator('cpPjEntrepot.name', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col> */}
          {/* <Col md={8} sm={24}>
            <FormItem label="仓库">
              {getFieldDecorator('cpPjEntrepot.name', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col> */}
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

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const values = { ...val }
    values.startDate = moment(values.startDate).format("YYYY-MM-DD")
    values.endDate = moment(values.endDate).format("YYYY-MM-DD")
    this.setState({
      startdate: values.startDate,
      enddate: values.endDate
    })

    this.setState({
      datavalue: values
    })
    dispatch({
      type: 'cpstatistics/find_ZCOutSalesFromDetail',
      payload: {
        pageSize: 10,
        // switchType:2,
        current:1,
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

  showmx = (res) => {
    const { dispatch } = this.props
    const { startdate, enddate } = this.state
    dispatch({
      type: 'cpPurchaseDetail/getBy_Bill',
      payload: {
        pageSize: 500,
        current: 1,
        billtype: 1,
        billId: res.billId,
        startDate: startdate,
        endDate: enddate,
        'cpPjEntrepot.id': isNotBlank(res.cpPjEntrepot) && isNotBlank(res.cpPjEntrepot.id) ? res.cpPjEntrepot.id : '',
        'office.id': res.office.id
      }
    })
    this.setState({
      mxdata: res,
      selectkhflag: true
    })
  }

  handleUpldExportClick = type => {
    const { startdate, enddate ,formValues } = this.state;

    const newobj = {...formValues}
    // const newkey =  isNotBlank(newobj.cpPjEntrepot)&&isNotBlank(newobj.cpPjEntrepot.name)?newobj.cpPjEntrepot.name:''
    // delete newobj.cpPjEntrepot

    const params = {
      startDate: startdate,
      endDate: enddate,
      ...newobj,
      // 'cpPjEntrepot.name':newkey,
      'user.id':getStorage('userid'),
    }
    window.open(`/api/Beauty/beauty/statisticsReport/exportZCOutSalesFromDetail?${stringify(params)}`);
  };

  render() {
    const { selectedRows, modalVisiblepass, selectkhflag } = this.state;
    const { loading, cppjstatisticsList, getByBillList, dispatch ,findZCOutSalesFromDetaillist} = this.props;
    const columns = [
      {
				title: '单号',         
				dataIndex: 'purchaseId',    
				inputType: 'text',  
				width: 150,
				align: 'center',            
				editable: true,       
      },
      {
				title: '订单编号',         
				dataIndex: 'productSales.oldCode',    
				inputType: 'text',  
				width: 200,
				align: 'center',            
				editable: true,       
      },
      {
        title: '供应商',         
				dataIndex: 'cpSupplier.name',    
				inputType: 'text',  
				width: 200,
				align: 'center',            
				editable: true,    
      },
      {
        title: '总成编码',        
				dataIndex: 'purchaseCode',   
				inputType: 'text',   
				width: 200,
				align: 'center', 
      },
      {
				title: '总成型号',        
				dataIndex: 'assemblyBuild.assemblyModel',   
				inputType: 'text',   
				width: 150,
				align: 'center',        
			},
			{
				title: '业务项目',         
				dataIndex: 'assemblyBuild.project',    
				inputType: 'text',  
				width: 240,
				align: 'center',          
			},
      {
        title: '仓库',        
        dataIndex: 'cpEntrepot.name',   
        inputType: 'text',
        align: 'center',  
        width: 150,          
        editable: true,      
      },
      {
        title: '库位',        
        dataIndex: 'cpStorage.name',   
        inputType: 'text',
        align: 'center',  
        width: 150,          
        editable: true,      
      },
      // {
      //   title: '入库类型',        
      //   dataIndex: 'product.type',   
      //   inputType: 'text',
      //   align: 'center',  
      //   width: 100,          
      //   editable: true,      
      // },
      {
        title: '发票类型',        
        dataIndex: 'productSales.makeNeed',   
        inputType: 'text',
        align: 'center',  
        width: 100,          
        editable: true,      
      },
      // {
      //   title: '库位',        
      //   dataIndex: 'cpPjStorage.name',   
      //   inputType: 'text',
      //   align: 'center',  
      //   width: 150,          
      //   editable: true,      
      // },
      {
        title: '数量',        
        dataIndex: 'number',   
        inputType: 'text',
        align: 'center',  
        width: 150,          
        editable: true,  
      },
      {
        title: '单价',        
        dataIndex: 'price',   
        inputType: 'text',
        align: 'center',  
        width: 150,          
        editable: true,   
        render:text=>(getPrice(text))
      },
      {
        title: '金额',        
        dataIndex: 'money',   
        inputType: 'text',
        align: 'center',  
        width: 150,          
        editable: true,   
        render:text=>(getPrice(text))
      },
      {
        title: '更新时间',
        dataIndex: 'finishDate',
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
        title: '所属公司',        
        dataIndex: 'office.name',   
        inputType: 'text',
        align: 'center',  
        width: 150,          
        editable: true,      
      },
    ];

    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }

    const parentMethodskh = {
      getByBillList,
      
      dispatch,
      handleModalVisiblekh: this.handleModalVisiblekh,
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
                <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
                  总成退货报表
                </div>

              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                
                loading={loading}
                data={findZCOutSalesFromDetaillist}
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
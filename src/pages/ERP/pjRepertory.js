import React, { PureComponent, Fragment } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import Link from 'umi/link';
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
import SearchTableList from '@/components/SearchTableList';


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
      getStatisticsDetailLine,
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
          })(<SearchTableList searchList={getStatisticsDetailLine} />)}
        </div>
      </Modal>
    );
  }
}

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, handleSearchChangezc, getByBillList, selectkhflag, form, dispatch ,that} = props;
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
      dataIndex: 'finishDate',   
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
      render:(text,res)=>{
           if(isNotBlank(res.remarks)&&res.remarks=='退货'){
           return <Link onClick={()=>{that.setState({selectkhflag:false})}} to={{pathname:'/warehouse/process/cp_out_sales_from_list',state:{id:text}}}>{text}</Link>
           }
           if(isNotBlank(res.remarks)&&res.remarks=='退料'){
            return <Link onClick={()=>{that.setState({selectkhflag:false})}} to={{pathname:'/warehouse/process/cp_quit_from_list',state:{id:text}}}>{text}</Link>
            }
            if(isNotBlank(res.type)&&res.type=='入库'){
              return <Link onClick={()=>{that.setState({selectkhflag:false})}} to={{pathname:'/warehouse/process/cp_in_storage_from_list',state:{id:text}}}>{text}</Link>
            }    
            if(isNotBlank(res.type)&&res.type=='出库'){
              return <Link onClick={()=>{that.setState({selectkhflag:false})}} to={{pathname:'/warehouse/process/cp_out_storage_from_list',state:{id:text}}}>{text}</Link>
            } 
            return ''
      }  
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

@connect(({ cpstatistics, loading, cpPurchaseDetail ,syslevel ,cpRevocation}) => ({
  ...cpstatistics,
  ...cpPurchaseDetail,
  ...syslevel,
  ...cpRevocation,
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
    selectkhflag: false,
    historyfilter:'[]'
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

    dispatch({
      type: 'cpRevocation/get_StatisticsDetailLine',
    });

  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'cpstatistics/clear',
    });
    this.setState({
      selectkhflag:false
    })
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

    let genTableColumn = this.deelcopy(JSON.parse(this.state.historyfilter))

    genTableColumn =  genTableColumn.filter(item=>{return item.jdbcType !='ts'})

   const genTableColumn1 = []

   JSON.parse(this.state.historyfilter).forEach((element,index) => {
         if(element.jdbcType=='ts'){
           genTableColumn1.push(element)
         }
   });


    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize-1,
      // limit: pagination.pageSize - 1,
      ...sort,
      ...formValues,
      ...filters,
      ...datavalue,
      genTableColumn: JSON.stringify(genTableColumn),
        genTableColumn1:JSON.stringify(genTableColumn1),
      billtype: 1,
    };
    dispatch({
      type: 'cpstatistics/cppjstatistics_List',
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

    let genTableColumn = this.deelcopy(JSON.parse(this.state.historyfilter))

    genTableColumn =  genTableColumn.filter(item=>{return item.jdbcType !='ts'})

   const genTableColumn1 = []

   JSON.parse(this.state.historyfilter).forEach((element,index) => {
         if(element.jdbcType=='ts'){
           genTableColumn1.push(element)
         }
   });

    dispatch({
      type: 'cpstatistics/cppjstatistics_List',
      payload: {
        pageSize: 10,
        current: 1,
        billtype: 1,
        genTableColumn: JSON.stringify(genTableColumn),
        genTableColumn1:JSON.stringify(genTableColumn1),
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
            type: 'cpstatistics/cppjstatistics_List',
            payload: {
              pageSize: 10,
              ...formValues,
              billtype: 1,
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

      let genTableColumn = this.deelcopy(JSON.parse(this.state.historyfilter))

      genTableColumn =  genTableColumn.filter(item=>{return item.jdbcType !='ts'})
 
     const genTableColumn1 = []
 
     JSON.parse(this.state.historyfilter).forEach((element,index) => {
           if(element.jdbcType=='ts'){
             genTableColumn1.push(element)
           }
     });

      dispatch({
        type: 'cpstatistics/cppjstatistics_List',
        payload: {
          ...values,
          genTableColumn: JSON.stringify(genTableColumn),
          genTableColumn1:JSON.stringify(genTableColumn1),
          pageSize: 10,
          current: 1,
          billtype: 1,
          startDate: startdate,
          endDate: enddate
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
            type: 'cpstatistics/cppjstatistics_List',
            payload: {
              pageSize: 10,
              ...formValues,
              billtype: 1,
              startDate: startdate,
              endDate: enddate
            }
          });
        }
      });
    }
  }

  handleSearchChange = () => {
		this.setState({
			searchVisible: true,
		});
	};

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      levellist2
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="仓库">
              {getFieldDecorator('cpPjEntrepot.name', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeId', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }}  allowClear>
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
      levellist2
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="仓库">
              {getFieldDecorator('cpPjEntrepot.name', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('officeId', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }}  allowClear>
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
          <Col md={8} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('cpBillMaterial.billCode', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
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
          <Col md={8} sm={24}>
            <FormItem label="原厂编码">
              {getFieldDecorator('originalCode', {
                initialValue: ''
              })(
                <Input  />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="配件厂商">
              {getFieldDecorator('rCode', {
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
      type: 'cpstatistics/cppjstatistics_List',
      payload: {
        pageSize: 10,
        billtype: 1,
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
    const newkey = isNotBlank(newobj.cpPjEntrepot)&&isNotBlank(newobj.cpPjEntrepot.name)?newobj.cpPjEntrepot.name:''
    const newcb =  isNotBlank(newobj.cpBillMaterial)&&isNotBlank(newobj.cpBillMaterial.billCode)? newobj.cpBillMaterial.billCode:''
    delete newobj.cpBillMaterial
    delete newobj.cpPjEntrepot

    let genTableColumn = this.deelcopy(JSON.parse(this.state.historyfilter))

    genTableColumn =  genTableColumn.filter(item=>{return item.jdbcType !='ts'})

   const genTableColumn1 = []

   JSON.parse(this.state.historyfilter).forEach((element,index) => {
         if(element.jdbcType=='ts'){
           genTableColumn1.push(element)
         }
   });


    const params = {
      startDate: startdate,
      endDate: enddate,
      ...newobj,
      'cpPjEntrepot.name':newkey,
      genTableColumn: JSON.stringify(genTableColumn),
      genTableColumn1:JSON.stringify(genTableColumn1),
      'user.id':getStorage('userid'),
    }
    window.open(`/api/Beauty/beauty/cpPurchaseDetail/exporStatistics?${stringify(params)}`);
  };

  handleSearchVisible = (fieldsValue) => {
		this.setState({
			searchVisible: false,
			historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
  };


  deelcopy = (obj) => {
    var newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    }
    for(var i in obj){
       newobj[i] = typeof obj[i] === 'object' ? this.deelcopy(obj[i]) : obj[i];
    }
    return newobj
}
  
  handleSearchAdd = (fieldsValue) => {
    const { dispatch } = this.props;
      const {startdate,enddate} = this.state

    // console.log(fieldsValue.genTableColumn.constructor)
     let genTableColumn = this.deelcopy(fieldsValue.genTableColumn)

    genTableColumn = genTableColumn.filter(item=>{
          return item.jdbcType !='ts'
        }
      )


    const genTableColumn1 = []

    fieldsValue.genTableColumn.forEach((element,index) => {
          if(element.jdbcType=='ts'){
            genTableColumn1.push(element)
          }
    });


    dispatch({
      type: 'cpstatistics/cppjstatistics_List',
      payload: {
        genTableColumn: JSON.stringify(genTableColumn),
        genTableColumn1:JSON.stringify(genTableColumn1),
        pageSize: 10,
        current: 1,
        billtype: 1,
        startDate: startdate,
        endDate: enddate
      },
    });

		this.setState({
			searchVisible: false,
			historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

  render() {
    const { selectedRows, modalVisiblepass, selectkhflag ,searchVisible } = this.state;
    const { loading, cppjstatisticsList, getByBillList, dispatch ,getStatisticsDetailLine } = this.props;
    const columns = [
      {
        title: '物料编码(可追溯)',        
        dataIndex: 'cpBillMaterial.billCode',
        align: 'center',
        
        inputType: 'text',   
        width: 150,          
        editable: true,      
        render: (text, record) => {
          return <a onClick={() => this.showmx(record)}>{text}</a>
        }
      },

      {
        title: '一级编码',        
        dataIndex: 'cpBillMaterial.one.code',   
        inputType: 'text',
        align: 'center',   
        width: 100,          
        editable: true,      
      },
      {
        title: '一级编码型号',
        align: 'center',      
        dataIndex: 'cpBillMaterial.one.model',   
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },

      {
        title: '二级编码',
        align: 'center',     
        dataIndex: 'cpBillMaterial.two.code',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '二级编码名称',
        align: 'center',      
        dataIndex: 'cpBillMaterial.two.name',   
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },

      {
        title: '名称',
        align: 'center',      
        dataIndex: 'cpBillMaterial.name',   
        inputType: 'text',   
        width: 300,          
        editable: true,      
      },

      {
        title: '原厂编码',        
        dataIndex: 'cpBillMaterial.originalCode',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },

      {
        title: '配件厂商',        
        dataIndex: 'cpBillMaterial.rCode',   
        inputType: 'text',
        align: 'center',   
        width: 100,          
        editable: true,      
      },

      {
        title: '期初数量',        
        dataIndex: 'startNumber',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '入库数量',        
        dataIndex: 'inNumber',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '出库数量',        
        dataIndex: 'outNumber',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '单位',        
        dataIndex: 'unit',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '结存数量',        
        dataIndex: 'balanceNumber',   
        inputType: 'text',   
        width: 150,          
        editable: true,
        render:(text,res,idx)=>{
           if(idx == cppjstatisticsList.list.length-1){
             return `合计数量:${text}`
           }
           return text
        }      
      },
      {
        title: '期初金额',        
        dataIndex: 'startMoney',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
        render: text => (getPrice(text))
      },
      {
        title: '入库金额',        
        dataIndex: 'inMoney',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
        render: text => (getPrice(text))
      },
      {
        title: '出库金额',        
        dataIndex: 'outMoney',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
        render: text => (getPrice(text))
      },
      {
        title: '结存金额',        
        dataIndex: 'balanceMoney',   
        inputType: 'text',   
        width: 200,          
        editable: true,    
        render:(text,res,idx)=>{
          if(idx == cppjstatisticsList.list.length-1){
            return `合计金额:${getPrice(text)}`
          }
          return getPrice(text)
       }   
      },
      {
        title: '结存单价',        
        dataIndex: 'balancePrice',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
        render: text => (getPrice(text))
      },
      {
        title: '开始日期',        
        dataIndex: 'startDate',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '结束日期',        
        dataIndex: 'endDate',   
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '仓库',        
        dataIndex: 'cpPjEntrepot.name',   
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
        title: '所属公司',        
        dataIndex: 'office.name',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
    ];

    const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			getStatisticsDetailLine,
		}

    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass
    }

    const that = this

    const parentMethodskh = {
      getByBillList,
      dispatch,
      handleModalVisiblekh: this.handleModalVisiblekh,
      that
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
                  配件库存报表
                </div>

              </div>
              <StandardEditTable
                scroll={{ x: 1000 }}
                // dataSource={cppjstatisticsList.list}
                // pagination={paginationDefault} 
                loading={loading}
                data={{list:cppjstatisticsList.list,pagination:{total:cppjstatisticsList.pagination.total,pageSize:cppjstatisticsList.pagination.pageSize+1,
                  current:cppjstatisticsList.pagination.current, pageSizeOptions:['11','51','101']}}}
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

        <SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
      </PageHeaderWrapper>
    );
  }

}
export default CpCloseList;
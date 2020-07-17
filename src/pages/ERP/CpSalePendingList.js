/**
 * 待销售订单
 */
import React, { PureComponent, Fragment, useState } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, Switch, DatePicker, Radio, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, getPrice, setPrice } from '@/utils/utils';
import moment from 'moment';
import styles from './CpSalePendingList.less';
import { getStorage } from '@/utils/localStorageUtils';
import SearchTableList from '@/components/SearchTableList';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateFormpass = Form.create()(props => {
  const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass, form: { getFieldDecorator }, neiparent, ruknumber } = props;
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
      title='销售数量'
      visible={modalVisiblepass}
      onOk={okHandle}
      onCancel={() => handleModalVisiblepass()}
    >
      <FormItem {...formItemLayout} label="销售数量">
        {getFieldDecorator('qutoNumber', {
          initialValue: ruknumber,
          rules: [
            {
              required: true,
              message: '请输入销售数量',
            },
          ],
        })(<Input />)
        }
      </FormItem>
      {/* {isNotBlank(neiparent)&&neiparent==-1&&
          <FormItem {...formItemLayout} label="是否入库所有">
            {getFieldDecorator('isOll', {
										initialValue:0,
										rules: [
											{
												required: true,   
												message: '是否入库所有',
											},
										],
									})( <Radio.Group name="radiogroup" defaultValue={0}>
  <Radio value={1}>是</Radio>
  <Radio value={0}>否</Radio>
</Radio.Group>)
									}
          </FormItem>
           } */}
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
      StayMarketFromLine,
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
          })(<SearchTableList searchList={StayMarketFromLine} />)}
        </div>
      </Modal>
    );
  }
}
@connect(({ cpPurchaseStockPending, loading, cpRevocation }) => ({
  ...cpPurchaseStockPending,
  ...cpRevocation,
  loading: loading.models.cpPurchaseStockPending,
}))
@Form.create()
class getStayMarketFromList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    array: [],
    tpageSize: 10,
    tcurrent: 1
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpPurchaseStockPending/get_StayMarketFromList',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpRevocation/getStayMarketFrom_Line',
    });
  }

  gotoForm = () => {
    router.push(`/warehouse/process/cp_purchase_stock_pending_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/warehouse/process/cp_purchase_stock_pending_form?id=${id}`);
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

    this.setState({
      tpageSize: pagination.pageSize,
      tcurrent: pagination.current
    })

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
      genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
    };
    dispatch({
      type: 'cpPurchaseStockPending/get_StayMarketFromList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      tpageSize: 10,
      tcurrent: 1
    });

    dispatch({
      type: 'cpPurchaseStockPending/get_StayMarketFromList',
      payload: {
        pageSize: 10,
        current: 1,
        genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
      title: '批量销售',
      content: '确定销售已选择的数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.handleDeleteClick(),
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues, tpageSize, tcurrent } = this.state;
    let ids = '';
    if (isNotBlank(id)) {
      ids = id;
    } else {
      if (selectedRows.length === 0) {
        message.error('未选择需要销售的数据');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    if (isNotBlank(ids)) {
      dispatch({
        type: 'cpPurchaseStockPending/post_BatchStayMarketFrom',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpPurchaseStockPending/get_StayMarketFromList',
            payload: {
              pageSize: tpageSize,
              current: tcurrent,
              ...formValues,
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
        tpageSize: 10,
        tcurrent: 1
      });
      dispatch({
        type: 'cpPurchaseStockPending/get_StayMarketFromList',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
        type: 'cpPurchaseStockPending/cpPurchaseStockPending_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          dispatch({
            type: 'cpPurchaseStockPending/get_StayMarketFromList',
            payload: {
              pageSize: 10,
              ...formValues,
              genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
            }
          });
        }
      });
    }
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="调拨公司">
              {getFieldDecorator('office.name', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调拨单号">
              {getFieldDecorator('allotId', {
                initialValue: ''
              })(
                <Input />
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

  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="调拨公司">
              {getFieldDecorator('office.name', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调拨单号">
              {getFieldDecorator('allotId', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物料">
              {getFieldDecorator('cpBillMaterial.billCode', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode', {
						initialValue: ''
					  })(
  <Input  />
					  )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="采购状态">
              {getFieldDecorator('purchaseStatus', {
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

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  addwarehouse = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpPurchaseStockPending/post_CpPurchaseStockPending',
      payload: {
        id
      },
      callback: () => {
        dispatch({
          type: 'cpPurchaseStockPending/cpPurchaseStockPending_List',
          payload: {
            pageSize: 10,
            genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          }
        });
      }
    })
  }

  handleSearchVisible = (fieldsValue) => {
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
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
      type: 'cpPurchaseStockPending/get_StayMarketFromList',
      payload: {
        genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
        pageSize: 10,
        current: 1,
      },
    });
    this.setState({
      searchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  handleFieldChange = (value) => {
    this.setState({
      array: value || []
    })
  }

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

  handleAddpass = (val) => {
    const { dispatch } = this.props
    const { rukuid, neiparent, tpageSize, tcurrent, formValues } = this.state
    const values = { ...val }
    // if(values.isOll==1){
    //   values.pendingNumber = 0
    // }
    // if(neiparent==-1){
    dispatch({
      type: 'cpPurchaseStockPending/post_StayMarketFrom',
      payload: {
        id: rukuid,
        ...values,
      },
      callback: () => {
        dispatch({
          type: 'cpPurchaseStockPending/get_StayMarketFromList',
          payload: {
            pageSize: tpageSize,
            current: tcurrent,
            ...formValues,
            genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          }
        });
      }
    })
    // }else{
    // dispatch({
    //     type:'cpPurchaseStockPending/post_CpPurchaseStockPending',
    //     payload:{
    //       id:rukuid,
    //       ...values,
    //     },
    //     callback:()=>{
    //       dispatch({
    //         type: 'cpPurchaseStockPending/cpPurchaseStockPending_List',
    //         payload: {
    //           pageSize: 10,
    //           genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],
    //         }
    //       });
    //     }
    // })
    // }
    this.setState({
      modalVisiblepass: false,
    });
  }

  shownumber = (id, record) => {
    this.setState({
      rukuid: id,
      ruknumber: isNotBlank(record.stockpendingnumber) ? record.stockpendingnumber : '',
      neiparent: isNotBlank(record) && isNotBlank(record.parent) ? record.parent : '',
      modalVisiblepass: true
    })
  }

  editAndSwitch = (checked, record) => {
    if (isNotBlank(record) && isNotBlank(record.id) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF').length > 0
      && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF')[0].children.filter(item => item.name == '修改')
        .length > 0) {
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

  checkSwitch = (checked, record) => {
    const { dispatch } = this.props
    const { tpageSize, tcurrent } = this.state
    dispatch({
      type: 'cpPurchaseStockPending/update_StayMarketFrom',
      payload: {
        id: record.id,
        orderStatus: checked ? 1 : 2
      },
      callback: () => {
        dispatch({
          type: 'cpPurchaseStockPending/get_StayMarketFromList',
          payload: {
            pageSize: tpageSize,
            current: tcurrent,
            genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
          }
        });
      }
    })
  }

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'cpPurchaseStockPending/post_BatchStayMarketFrom',
      payload: {
        ids: selectedRows.join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'cpPurchaseStockPending/get_StayMarketFromList',
          payload: {
            current: 1,
            pageSize: 10,
          },
        });
      },
    });
  };

  render() {
    const { selectedRows, array, searchVisible, modalVisiblepass, neiparent, ruknumber } = this.state;
    const { loading, getStayMarketFromList, StayMarketFromLine } = this.props;
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass,
      neiparent,
      ruknumber
    }
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      StayMarketFromLine,
    }
    const field = [
      {
        title: '调拨单号',
        dataIndex: 'allotId',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '启用状态',
        align: 'center',
        dataIndex: 'orderStatus',
        width: 150,
        render: (text, record) => {
          if (isNotBlank(text)) {
            return <Switch
              disabled={!(isNotBlank(record) && isNotBlank(record.id) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF')[0].children.filter(item => item.name == '修改')
                  .length > 0)}
              onChange={(checked) => this.editAndSwitch(checked, record)}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={text == 1 || text == 0 || text == '未处理' || text == '已处理'}
            />
          }
          return <a>无归还状态</a>
        }
      },
      {
        title: '调拨公司',
        dataIndex: 'office.name',
        inputType: 'text',
        align: 'center',
        width: 150,
        editable: true,
      },
      {
        title: '物料编码',
        dataIndex: 'cpBillMaterial.billCode',
        align: 'center',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '物料名称',
        dataIndex: 'cpBillMaterial.name',
        align: 'center',
        inputType: 'text',
        width: 150,
        editable: true,
      },
      {
        title: '调拨数量',
        dataIndex: 'numbers',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '销售数量',
        dataIndex: 'pendingnumber',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      {
        title: '待销售数量',
        dataIndex: 'stockpendingnumber',
        align: 'center',
        inputType: 'text',
        width: 100,
        editable: true,
      },
      // {
      //     title: '需求日期',
      //     dataIndex: 'needDate',
      //     align: 'center' , 
      //     editable:   true  ,
      //     inputType: 'dateTime',
      //     width: 150,
      //     sorter: true,
      //     render: (val)=>{
      // 	if(isNotBlank(val)){
      // 	 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      // 	}
      // 	return ''
      // }
      //   },
      // {
      // 	title: '单价',        
      //   dataIndex: 'price',
      //   align: 'center' ,    
      // 	inputType: 'text',   
      // 	width: 100,          
      //   editable:  true  ,      
      //   render:(text)=>{
      //     if(isNotBlank(text)){
      //       return  getPrice(text)
      //     }
      //     return ''
      //   }
      // },
      // {
      //   title: '数量',  
      //   align: 'center' ,       
      // 	dataIndex: 'number',   
      // 	inputType: 'text',   
      // 	width: 100,          
      // 	editable:  true  ,      
      // },
      // {
      //   title: '金额', 
      //   align: 'center' ,        
      // 	dataIndex: 'money',   
      // 	inputType: 'text',   
      // 	width: 100,          
      //   editable:  true  ,      
      //   render:(text)=>{
      //     if(isNotBlank(text)){
      //       return  getPrice(text)
      //     }
      //     return ''
      //   }
      // },
      // {
      //   title: '入库数量', 
      //   align: 'center' ,        
      // 	dataIndex: 'pendingNumber',   
      // 	inputType: 'text',   
      // 	width: 100,          
      // 	editable:  true  ,      
      // },
      // {
      //   title: '待入库数量',   
      //   align: 'center' ,      
      // 	dataIndex: 'stockPendingNumber',   
      // 	inputType: 'text',   
      // 	width: 100,          
      // 	editable:  true  ,      
      // },
      {
        title: '创建时间',
        align: 'center',
        dataIndex: 'createDate',
        editable: false,
        inputType: 'dateTime',
        width: 150,
        sorter: true,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
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
        title: '基础操作',
        width: 100,
        align: 'center',
        fixed: 'left',
        render: (text, record) => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF')[0].children.filter(item => item.name == '修改')
              .length > 0 ?
            <Fragment>
              {
                isNotBlank(record) && record.orderStatus != 2 && record.orderStatus != '已关闭' &&
                <a onClick={() => this.shownumber(record.id, record)}>销售</a>
              }
            </Fragment>
            : ''
        },
      },
      ...fieldArray,
      //  {
      //    title: '基础操作',
      //    width: 100,
      //    align: 'center' , 
      //    render: (text, record) => {
      //     return ((record.orderStatus === 0 || record.orderStatus === '0'||record.orderStatus === '未处理')&&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter
      //     (item=>item.target=='cpPurchaseStockPending').length>0&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPurchaseStockPending')[0]
      //     .children.filter(item=>item.name=='删除').length>0) ?
      //       <Fragment>
      //         <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
      //           <a>删除</a>
      //         </Popconfirm>
      //       </Fragment>
      //      :''
      //    },
      //  },
    ];

    //  const [selectionType, setSelectionType] = useState('checkbox');

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.handleSelectRows(selectedRowKeys)
      },
      getCheckboxProps: record => ({
        disabled: record.orderStatus == '2' || record.orderStatus == '已关闭'
      }),
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
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div style={{ 'position': 'relative' }}>
                {selectedRows.length > 0 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'SMF')[0].children.filter(item => item.name == '修改')
                    .length > 0 && (
                    <span>
                      <Button onClick={(e) => this.editAndDelete(e)}>批量销售</Button>
                    </span>
                  )}
                <Button icon="plus" type="primary" style={{ visibility: 'hidden', marginBottom: '6px' }}>
                  新建
                </Button>
                <span style={{ marginBottom: '6px', fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                  待销售清单
                </span>
              </div>
              <StandardEditTable
                scroll={{ x: (fieldArray.length * 100) + 500 }}
                loading={loading}
                data={getStayMarketFromList}
                bordered
                rowSelection={{
                  ...rowSelection,
                }}
                columns={columns}
                onSaveData={this.onSaveData}
                selectedRows={selectedRows}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                onRow={record => {
                  return {
                    onClick: () => {
                      this.setState({
                        rowId: record.id,
                      })
                    },
                  };
                }}
                rowClassName={(record, index) => {
                  if (record.id === this.state.rowId) {
                    return 'selectRow'
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
export default getStayMarketFromList;
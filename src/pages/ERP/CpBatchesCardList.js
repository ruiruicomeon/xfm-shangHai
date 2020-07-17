import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import moment from 'moment';
import { parse, stringify } from 'qs';
import styles from './CpBatchesCardList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ cpBatchesCard, loading }) => ({
  ...cpBatchesCard,
  loading: loading.models.cpBatchesCard,
}))
@Form.create()

class CpBatchesCardList extends PureComponent {

  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpBatchesCard/cpBatchesCard_List',
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
    router.push(`/accessories/process/cp_batches_card_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/accessories/process/cp_batches_card_form?id=${id}`);
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
    };
    dispatch({
      type: 'cpBatchesCard/cpBatchesCard_List',
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
      type: 'cpBatchesCard/cpBatchesCard_List',
      payload: {
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
    // 删除单个
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
        type: 'cpBatchesCard/cpBatchesCard_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          // 成功之后需要刷新列表数据
          // 并且添加当前搜索字段  页数归0
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpBatchesCard/cpBatchesCard_List',
            payload: {
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

  // 搜索
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
        type: 'cpBatchesCard/cpBatchesCard_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  // 点击保存返回的id与修改的数据
  onSaveData = (key, row) => {
    const { formValues } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    // 时间需要进行moment处理  转为string 否则后台不识别
    // 如有多选数据  当前获取到的数据则为一个数组 需要转换成','拼接字符串


    if (isNotBlank(value)) {
      Object.keys(value).map((item) => {
        if( value[item] instanceof moment){
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpBatchesCard/cpBatchesCard_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          // 成功之后需要刷新列表数据
          // 并且添加当前搜索字段  页数归0
          dispatch({
            type: 'cpBatchesCard/cpBatchesCard_List',
            payload: {
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
					<FormItem label="单号">
					  {getFieldDecorator('id', {
						initialValue: ''
					  })(
								<Input  />

					  )}
					</FormItem>
          		</Col>
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
					<FormItem label="订单编号">
					  {getFieldDecorator('orderCode', {
						initialValue: ''
					  })(
								<Input  />

					  )}
					</FormItem>
          		</Col>
              <Col md={8} sm={24}>
					<FormItem label="客户">
					  {getFieldDecorator('client.clientCpmpany', {
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

  handleUpldExportClick = type => {
    const {  formValues } = this.state;
    const params = { 
      ...formValues,
      genTableColumn:isNotBlank(this.state.historyfilter)?this.state.historyfilter:[],  
      'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):''
    }
    window.open(`/api/Beauty/beauty/cpBatchesCard/export?${stringify(params)}`);
    };

    
   exportTemplate = type => {
    const {  formValues } = this.state;
    const params = { 
      'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):''
    }
    window.open(`/api/Beauty/beauty/cpBatchesCard/exportTemplate?${stringify(params)}`);
    };

  render() {
    const { selectedRows } = this.state;
    const { loading, cpBatchesCardList } = this.props;

    // 可编辑列表 需要固定操作参数   【编辑，保存，取消】
    const columns = [
     {
        title: '操作',
        width: 100,
        align:'center',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
          </Fragment>
        ),
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        editable:   true  ,
        inputType: 'text',
        align:'center',
        width: 100,
        sorter: true,
      },
	  {
        title: '单号',
        dataIndex: 'id',
        align:'center',
        editable:   true  ,
        inputType: 'text',
        width: 150,
        sorter: true,
      },
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        align:'center',
        editable:   true  ,
        inputType: 'text',
        width: 200,
        sorter: true,
      },
      {
        title: '客户',
        dataIndex: 'client.clientCpmpany',
        align:'center',
        editable:   true  ,
        inputType: 'text',
        width: 240,
        sorter: true,
      },
			{
				title: '所属公司',        
				dataIndex: 'createBy.office.name',   
				inputType: 'text',   
				width: 200,
				align: 'center',        
				editable: true,      
			},
      {
        title: '基础操作',
        width: 100,
        align:'center',
        render: (text, record) => {
           return (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='CBC').length>0
					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='CBC')[0].children.filter(item=>item.name=='修改')
					.length>0&&isNotBlank(record.orderStatus)&&(record.orderStatus=='0'||record.orderStatus=='未处理'))?
          <Fragment>
            <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
          :''
        },
      },
 		// {
		// 	title: 'remarks',        // 必填显示
		// 	dataIndex: 'remarks',   // 必填 参数名
		// 	inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
		// 	width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
		// 	editable:  true  ,      // 选填  是否可编辑
 		// },
    ];

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
        <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
            导出
            </Button>
            <Button icon="cloud-download" onClick={() => this.exportTemplate()}>
            导出模板
            </Button>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div style={{textAlign:'center',fontWeight:550,fontSize:28,marginBottom:'16px'}}>质保清单</div>
              {/* <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Button icon="delete" onClick={(e) => this.editAndDelete(e)}> 批量删除</Button>
                  </span>
                )}
              </div> */}
              <StandardEditTable
                scroll={{ x: 550 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={cpBatchesCardList}
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
										return 'greenstyle'
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
      </PageHeaderWrapper>
    );
  }

}
export default CpBatchesCardList;
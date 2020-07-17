import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Select,
	Button,
	Card,
	Row,
	Col,
	InputNumber,
	message,
	Icon,
	Modal,
	Popconfirm
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';
import SearchTableList from '@/components/SearchTableList';
import styles from './CpBusinessOrderForm.less';
import StandardEditTable from '@/components/StandardEditTable';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
Object.keys(obj)
	.map(key => obj[key])
	.join(',');
@Form.create()
class SearchFormzc extends PureComponent {
	okHandle = () => {
		const { form, handleSearchAddzc } = this.props;
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			handleSearchAddzc(fieldsValue);
		});
	};

	handleSearchVisiblein = () => {
		const { form, handleSearchVisiblezc } = this.props;
		form.validateFields((err, fieldsValue) => {
			handleSearchVisiblezc(fieldsValue);
		});
	  };

	render() {
		const {
			searchVisiblezc,
			form: { getFieldDecorator },
			handleSearchVisiblezc,
			cpAssemblyBuildSearchList,
		} = this.props;
		return (
  <Modal
    width={860}
    title="多字段动态过滤"
    visible={searchVisiblezc}
    onCancel={() => this.handleSearchVisiblein()}
    afterClose={() => this.handleSearchVisiblein()}
    onOk={() => this.okHandle()}
  >
    <div>
      {getFieldDecorator('genTableColumn', {
						initialValue: [],
					})(<SearchTableList searchList={cpAssemblyBuildSearchList} />)}
    </div>
  </Modal>
		);
	}
}
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
			khsearchVisible,
			form: { getFieldDecorator },
			handleSearchVisible,
			cpClientSearchList,
		} = this.props;
		return (
  <Modal
    width={860}
    title="多字段动态过滤"
    visible={khsearchVisible}
    onCancel={() => handleSearchVisible(false)}
    afterClose={() => handleSearchVisible()}
    onOk={() => this.okHandle()}
  >
    <div>
      {getFieldDecorator('genTableColumn', {
						initialValue: [],
					})(<SearchTableList searchList={cpClientSearchList} />)}
    </div>
  </Modal>
		);
	}
}		
const CreateFormkhin = Form.create()(props => {
	const { handleModalVisiblekhin, cpClientList, selectkhinflag, selectcustomerin ,handleSearchChange,form, dispatch} = props;
	const { getFieldDecorator } = form
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center' ,
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectcustomerin(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '客户',        
			dataIndex: 'clientCpmpany',   
			inputType: 'text',
			align: 'center',    
			width: 240,          
			editable: true,      
		},
		{
			title: '客户编码',        
			dataIndex: 'code',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '客户',        
			dataIndex: 'name',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '客户分类',        
			dataIndex: 'classify',   
			inputType: 'text',
			align: 'center' ,   
			width: 100,          
			editable: true,      
		},
		{
			title: '客户级别',        
			dataIndex: 'level',   
			inputType: 'text', 
			align: 'center' ,  
			width: 100,          
			editable: true,      
		},
		{
			title: '联系地址',        
			dataIndex: 'address',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '邮箱',        
			dataIndex: 'email',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '移动电话',        
			dataIndex: 'phone',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '电话',        
			dataIndex: 'tel',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '传真',        
			dataIndex: 'fax',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '税号',        
			dataIndex: 'dutyParagraph',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '开户账号',        
			dataIndex: 'openNumber',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '开户银行',        
			dataIndex: 'openBank',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '开户地址',        
			dataIndex: 'openAddress',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '开户电话',        
			dataIndex: 'openTel',   
			inputType: 'text',
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '创建者',        
			dataIndex: 'user.name',   
			inputType: 'text', 
			align: 'center' ,  
			width: 100,          
			editable: false,      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
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
			dataIndex: 'remarks',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		}
	];
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
	const handleSearch = (e) => {
		e.preventDefault();
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
		  dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
			  ...values,
			  pageSize: 10,
			  current: 1,
			},
		  });
		});
	  };
	 const  handleFormReset = () => {
		form.resetFields();
		dispatch({
		  type: 'cpClient/cpClient_List',
		  payload: {
			pageSize: 10,
			current: 1,
		  },
		});
	  };
	  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});
		const params = {
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: params,
		});
	};
	  const handleModalkh =()=>{
		form.resetFields();
		handleModalVisiblekhin()
	  }
	return (
  <Modal
    title='选择客户'
    visible={selectkhinflag}
    onCancel={() => handleModalkh()}
    width='80%'
		>
    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Form onSubmit={handleSearch}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="客户">
            {getFieldDecorator('clientCpmpany', {
                initialValue: ''
              })(
                <Input  />
              )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="联系人">
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
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={handleSearchChange}>
                过滤其他 <Icon type="down" />
            </a>
          </span>
        </Col>
      </Form>
    </Row>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpClientList}
      columns={columnskh}
    />
  </Modal>
	);
});
const CreateFormForm = Form.create()(props => {
	const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator },changecode,
	  cpBillMaterialList, selectuser, handleSelectRows, selectedRows, showTable ,searchcode ,billid,submitting1 ,wlshowdata} = props;
	const okHandle = () => {
	  form.validateFields((err, fieldsValue) => {
		form.resetFields();
		const values = { ...fieldsValue };
		values.repertoryPrice = setPrice(values.repertoryPrice)
		handleFormAdd(values);
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
	 const modelsearch =(e)=>{
	  changecode(e.target.value)
	 }
   const handleFormVisiblehide =()=>{
	form.resetFields();
	handleFormVisible()
   }
	return (
  <Modal
    title="新增明细"
    visible={FormVisible}
    onOk={okHandle}
    width='80%'
    onCancel={() => handleFormVisiblehide()}
  >
    <Row gutter={12}>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='物料编码'>
          <Input  value={isNotBlank(billid) ? billid:''} onChange={modelsearch} />
          <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={searchcode}>查询</Button> 
          <Button style={{ marginLeft: 8 }} onClick={() => showTable()}>选择</Button>
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='数量'>
          {getFieldDecorator('number', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? getPrice(modalRecord.number) :((isNotBlank(wlshowdata)  && isNotBlank(wlshowdata.number) ? wlshowdata.number : 1)),     
				rules: [
				  {
					required: false,   
					message: '请输入数量'
				  },
				],
			  })(<InputNumber
  style={{ width: '100%' }}
  precision={0}
  min={1}
  
			  />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='原厂编码'>
          {getFieldDecorator('originalCode', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode : (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.originalCode) ? wlshowdata.cpBillMaterial.originalCode : ''),     
				rules: [
				  {
					required: false,   
					message: '请输入原厂编码',
				  },
				],
			  })(<Input  disabled />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='名称'>
          {getFieldDecorator('name', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.name) ? wlshowdata.cpBillMaterial.name : ''),     
				rules: [
				  {
					required: false,   
					message: '名称',
				  },
				],
			  })(<Input  disabled />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='二级编码名称'>
          {getFieldDecorator('twoCodeModel', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.twoCodeModel) ? modalRecord.twoCodeModel : (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.two) && isNotBlank(wlshowdata.cpBillMaterial.two.name) ? wlshowdata.cpBillMaterial.two.name : ''),     
				rules: [
				  {
					required: false,   
					message: '二级编码名称',
				  },
				],
			  })(<Input  disabled />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='一级编码型号'>
          {getFieldDecorator('assemblyVehicleEmissions', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCodeModel) ? modalRecord.oneCodeModel : (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.one)&& isNotBlank(wlshowdata.cpBillMaterial.one.model) ? wlshowdata.cpBillMaterial.one.model : ''),     
				rules: [
				  {
					required: false,   
					message: '一级编码型号',
				  },
				],
			  })(<Input  disabled />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='配件厂商'>
          {getFieldDecorator('rCode', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.rCode) ? modalRecord.rCode : (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.rCode) ? wlshowdata.cpBillMaterial.rCode : ''),     
				rules: [
				  {
					required: false,   
					message: '配件厂商',
				  },
				],
			  })(<Input  disabled />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='库存数量'>
          {getFieldDecorator('repertoryNumber', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceNumber) ? modalRecord.balanceNumber : (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.balanceNumber) ? wlshowdata.cpBillMaterial.balanceNumber : ''),     
				rules: [
				  {
					required: false,   
					message: '库存数量',
				  },
				],
			  })(<InputNumber style={{ width: '100%' }}  disabled />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='库存单价'>   
          {getFieldDecorator('repertoryPrice', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceMoney) ? getPrice(modalRecord.balanceMoney) :(isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.balancePrice) ? wlshowdata.cpBillMaterial.balancePrice: 0),     
				rules: [
				  {
					required: false,   
					message: '库存单价',
				  },
				],
			  })(<InputNumber style={{ width: '100%' }}  disabled />)}
        </FormItem>
      </Col>
      <Col lg={12} md={12} sm={24}>
        <FormItem {...formItemLayout} label='备注信息'>
          {getFieldDecorator('remarks', {
				initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks : '',     
				rules: [
				  {
					required: false,   
					message: '备注信息',
				  },
				],
			  })(<Input  />)}
        </FormItem>
      </Col>
    </Row>
  </Modal>
	);
  })
const CreateForm = Form.create()(props => {
	const { modalVisible, form, handleAdd, handleModalVisible } = props;
	const okHandle = () => {
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			form.resetFields();
			const values = {};
			handleAdd(values);
		});
	};
	return (
  <Modal
    visible={modalVisible}
    onOk={okHandle}
    onCancel={() => handleModalVisible()}
		>
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
      {form.getFieldDecorator('remarks', {
					initialValue: '',
				})(<TextArea rows={3}  />)}
    </FormItem>
  </Modal>
	);
});
const CreateFormkh = Form.create()(props => {
	const { handleModalVisiblekh, cpAssemblyBuildList, selectkhflag, selectcustomer 
		,handleSearchChangezc,form ,dispatch,that} = props;
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
			width: 100,
			align: 'center' ,
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectcustomer(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '总成型号',        
			dataIndex: 'assemblyModel',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '进场类型',        
			dataIndex: 'assemblyEnterType',   
			inputType: 'text',
			align: 'center' ,   
			width: 100,          
			editable: true,      
		},
		{
			title: '总成品牌',        
			dataIndex: 'assemblyBrand',   
			inputType: 'text', 
			align: 'center' ,  
			width: 100,          
			editable: true,      
		},
		{
			title: '车型/排量',        
			dataIndex: 'vehicleModel',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
		{
			title: '年份',        
			dataIndex: 'assemblyYear',   
			inputType: 'text',  
			align: 'center' , 
			width: 100,          
			editable: true,      
		},
		{
			title: '备注信息',        
			dataIndex: 'remarks',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		}
	];
	const handleSearch = (e) => {
		e.preventDefault();
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
		  that.setState({
			zcsearch : values
		  })
		  dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: {
			  ...values,
			  genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
			  pageSize: 10,
			  current: 1,
			},
		  });
		});
	  };
	const handleFormReset = () => {
				form.resetFields();
				that.setState({
					zcsearch:{}
				})
				dispatch({
				  type: 'cpAssemblyBuild/cpAssemblyBuild_List',
				  payload: {
					pageSize: 10,
					genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
					current: 1,
				  },
				});
			  };
			  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
				const filters = Object.keys(filtersArg).reduce((obj, key) => {
					const newObj = { ...obj };
					newObj[key] = getValue(filtersArg[key]);
					return newObj;
				}, {});
				const params = {
					...that.state.zcsearch,
					current: pagination.current,
					pageSize: pagination.pageSize,
					genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
					...filters,
				};
				if (sorter.field) {
					params.sorter = `${sorter.field}_${sorter.order}`;
				}
				dispatch({
					type: 'cpAssemblyBuild/cpAssemblyBuild_List',
					payload: params,
				});
			};

		const handleModalVisiblekhin=()=>{
			// form.resetFields();
			// that.setState({
			// 	zcsearch:{}
			// })
			handleModalVisiblekh()
			}

	return (
  <Modal
    title='选择总成'
    visible={selectkhflag}
    onCancel={() => handleModalVisiblekhin()}
    width='80%'
		>
    <Form onSubmit={handleSearch}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="业务项目">
            {getFieldDecorator('project', {
						initialValue: ''
					  })(
  <Input  />
					  )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="总成型号">
            {getFieldDecorator('assemblyModel', {
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
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={handleSearchChangezc}>
                过滤其他 <Icon type="down" />
            </a>
          </span>
        </Col>
      </Row>
    </Form>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpAssemblyBuildList}
      columns={columnskh}
    />
  </Modal>
	);
});
const CreateFormMore = Form.create()(props => {
	const { modalVisibleMore, form, handleAdd, handleModalVisibleMore, modalRecord, form: { getFieldDecorator },
	  cpBillMaterialList, selectmore, handleSelectRows, selectedRows ,that , location ,dispatch} = props;
	const selectcolumns = [
	  {
		title: '操作',
		width: 100,
		fixed: 'left',
		render: record => {
			return  <Fragment>
  <a onClick={() => selectmore(record)}>
			  选择
  </a>
</Fragment>
		}
		,
	  },
	  {
	    title: '物料编码',        
	    dataIndex: 'billCode',   
	    inputType: 'text',   
	    width: 100,          
	    editable: true,      
	  },
	  {
		title: '一级编码',        
		dataIndex: 'oneCode',   
		inputType: 'text',   
		width: 100,          
		editable: true,      
	  },
	  {
		title: '二级编码',        
		dataIndex: 'twoCode',   
		inputType: 'text',   
		width: 100,          
		editable: true,      
	  },
	  {
		title: '一级编码型号',        
		dataIndex: 'one.model',   
		inputType: 'text',   
		width: 100,          
		editable: true,      
	  },
	  {
		title: '二级编码名称',        
		dataIndex: 'two.name',   
		inputType: 'text',   
		width: 100,          
		editable: true,      
	  },
	  {
		title: '名称',        
		dataIndex: 'name',   
		inputType: 'text',   
		width: 300,          
		editable: true,      
	  },
	  {
		title: '原厂编码',        
		dataIndex: 'originalCode',   
		inputType: 'text',   
		width: 100,          
		editable: true,      
	  },
	  {
		title: '配件厂商',        
		dataIndex: 'rCode',   
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
		title: '更新时间',
		dataIndex: 'finishDate',
		editable: true,
		inputType: 'dateTime',
		width: 100,
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
		width: 100,          
		editable: true,      
	  }
	]
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

	const handleSearch = (e) => { e.preventDefault();
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

		  that.setState({
        wlsearch:values,
        pageCurrent:1,
        pagePageSize:10
		  })
	
		  dispatch({
			type: 'cpBillMaterial/get_cpBillMaterial_All',
			payload: {
				intentionId: location.query.id,
				pageSize: 10,
				...values,
        current: 1,
        tag:1
			}
		});
		});
	  };
	  const handleFormReset = () => {
		form.resetFields();
		that.setState({
      wlsearch:{},
      pageCurrent:1,
      pagePageSize:10
		})
		dispatch({
			type: 'cpBillMaterial/get_cpBillMaterial_All',
			payload: {
				intentionId: location.query.id,
				pageSize: 10,
        current: 1,
        tag:1
			}
		});
    };
	const handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});

		const params = {
			...that.state.wlsearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
      tag:1,
			intentionId: location.query.id,
			...filters,
    };
    
    that.setState({
      pageCurrent:pagination.current,
      pagePageSize:pagination.pageSize
   })

		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}

		dispatch({
			type: 'cpBillMaterial/get_cpBillMaterial_All',
			payload: params,
		});
	};
	
	return (
  <Modal
    title='物料选择'
    visible={modalVisibleMore}
    onOk={(e) => selectmore(e)}
    onCancel={() => handleModalVisibleMore()}
    width='80%'
  >
	<Form onSubmit={handleSearch}>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="物料编码">
							{getFieldDecorator('billCode', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="一级编码">
							{getFieldDecorator('oneCode', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="二级编码">
							{getFieldDecorator('twoCode', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="一级编码型号">
							{getFieldDecorator('oneCodeModel', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="二级编码名称">
							{getFieldDecorator('twoCodeModel', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="名称">
							{getFieldDecorator('name', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="原厂编码">
							{getFieldDecorator('originalCode', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="配件厂商">
							{getFieldDecorator('rCode', {
								initialValue: ''
							})(
								<Input  />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<div style={{ overflow: 'hidden' }}>
							<div style={{ marginBottom: 24 }}>
								<Button type="primary" htmlType="submit">
									查询
              </Button>
								<Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
									重置
              </Button>
							</div>
						</div>
					</Col>
				</Row>
			</Form>

    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      childrenColumnName='cpBillMaterialList'
      selectedRows={selectedRows}
      onSelectRow={handleSelectRows}
	  data={cpBillMaterialList}
	  onChange={handleStandardTableChange}
      columns={selectcolumns}
    />
  </Modal>
	);
  });
@connect(({ cpBillMaterial,cpBusinessOrder,cpinterior, loading, upload, cpAssemblyForm ,cpClient ,cpAssemblyBuild,syslevel,sysdept}) => ({
	...cpBusinessOrder,
	...upload,
	...cpClient,
	...cpBillMaterial,
	...cpAssemblyForm,
	...cpAssemblyBuild,
	...syslevel,
	...sysdept,
	...cpinterior,
	newdeptlist: sysdept.deptlist.list,
	submitting1: loading.effects['cpBillMaterial/get_cpAssemblyBuild_search_All'],
	submitting: loading.effects['form/submitRegularForm'],
	submitting2: loading.effects['cpinterior/createCpBusinessOrder_Add'],
	submitting3: loading.effects['cpupdata/cpBusinessOrder_update'],
}))
@Form.create()
class CpBusinessOrderForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			fileList: [],
			orderflag: false,
			selectkhflag: false,
			sumbitflag:false,
			selectkhindata: {},
			inselectkhdata:{},
			updataflag:true,
			updataname:'取消锁定',
			selthis:'',
			billid:'',
			FormVisible: false,
			mxnumflag:false,
      confirmflag :true,
      pageCurrent:1,
      pagePageSize:10,
			location: getLocation(),
		}
	}

	componentDidMount() {
		console.log('componentDidMount')
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpinterior/cpBusinessOrder_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (
						res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
						||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder').length>0
						&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder')[0].children.filter(item=>item.name=='修改')
						.length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
					if (isNotBlank(res.data) && isNotBlank(res.data.orderType)) {
						 this.setState({
							 selthis:res.data.orderType
						 })
					}
					dispatch({
						type: 'sysarea/getFlatCode',
						payload:{
						id:location.query.id,
						type:'YWW'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg:imgres
						})
						}
						})
					dispatch({
						type: 'sysarea/getFlatOrderdCode',
						payload:{
						id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
						type:'YWW'
						},
						callback:(imgres)=>{
						this.setState({
						srcimg1:imgres
						})
						}
						})
					if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
						let photoUrl = res.data.photo.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList: res.data.photo.split('|'),
							fileList: photoUrl
						})
					}
				}
			});
			dispatch({
				type: 'cpBillMaterial/get_cpBillMaterial_All',
				payload: {
				  intentionId: location.query.id,
          pageSize: 10,
          tag:1
				}
			  });
			  dispatch({
				type: 'cpBillMaterial/cpBillMaterial_middle_List',
				payload: {
				  singelId: location.query.id,
				},
				callback:(res)=>{
				  let newarr = []
				  if(isNotBlank(res.list)&&res.list.length>0){
					  this.setState({
						mxnumflag:true
					  })
					  newarr = [...res.list]
				  }
				   this.setState({dataSource:newarr
				  })
				}
			  })
    }
    
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: {
			  pageSize: 10,
			}
		  });

		dispatch({
			type: 'dict/dict',
			callback: data => {
				const insuranceCompany =[]
				const brand=[]
				const approachType =[]
				const collectCustomer=[]
				const orderType =[]
				const business_project=[]
				const business_dicth =[]
				const business_type=[]
				const settlement_type =[]
				const payment_methodd=[]
				const old_need =[]
				const make_need=[]
				const quality_need =[]
				const oils_need=[]
				const guise_need =[]
				const installation_guide=[]
				const is_photograph =[]
				const maintenance_project =[]
				const del_flag=[]
				const classify =[]
				const client_level=[]
				const area = []
				const interior_type =[]
				const logisticsNeed = []
					data.forEach((item)=>{
						if (item.type == 'wy') {
							logisticsNeed.push(item)
						}
						if(item.type == 'insurance_company'){
							insuranceCompany.push(item)
						}
						if(item.type == 'brand'){
							brand.push(item)
						}
						if(item.type == 'approach_type'){
							approachType.push(item)
						}
						if(item.type == 'collect_customer'){
							collectCustomer.push(item)
						}
						if(item.type == 'orderType'){
							orderType.push(item)
						}
						if(item.type == 'business_project'){
							business_project.push(item)
						}
						if(item.type == 'business_dicth'){
							business_dicth.push(item)
						}
						if(item.type == 'business_type'){
							business_type.push(item)
						}
						if(item.type == 'settlement_type'){
							settlement_type.push(item)
						}
						if(item.type == 'payment_methodd'){
							payment_methodd.push(item)
						}
						if(item.type == 'old_need'){
							old_need.push(item)
						}
						if(item.type == 'make_need'){
							make_need.push(item)
						}
						if(item.type == 'quality_need'){
							quality_need.push(item)
						}
						if(item.type == 'oils_need'){
							oils_need.push(item)
						}
						if(item.type == 'guise_need'){
							guise_need.push(item)
						}
						if(item.type == 'installation_guide'){
							installation_guide.push(item)
						}
						if(item.type == 'maintenance_project'){
							maintenance_project.push(item)
						}
						if(item.type == 'is_photograph'){
							is_photograph.push(item)
						}
						if(item.type == 'del_flag'){
							del_flag.push(item)
						}
						if(item.type == 'classify'){
							classify.push(item)
						}
						if(item.type == 'client_level'){
							client_level.push(item)
						}
						if(item.type == 'area'){
							area.push(item)
						}
						if(item.type == 'interiorType'){
							interior_type.push(item)
						}
					})
					this.setState({
						insuranceCompany,
						brand,approachType,collectCustomer,
						orderType,business_project,business_dicth
						,business_type,settlement_type,payment_methodd,old_need,
						make_need,quality_need,oils_need,guise_need,installation_guide
						,maintenance_project,is_photograph,del_flag,classify,client_level,
						area ,interior_type,logisticsNeed
					})
			}
		  })
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpinterior/clear',
		});
		dispatch({
			type: 'cpBillMaterial/clear',
		  })
	}

	handleSubmit = e => {
		const { dispatch, form, cpBusinessOrderGet } = this.props;
		const { addfileList, location ,inselectkhdata ,selectkhindata ,updataflag} = this.state;
		e.preventDefault();
		form.validateFieldsAndScroll((err, values) => {
	      if (!err) {
			const value = { ...values };
			this.setState({
				sumbitflag:true
			})
			if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
				value.photo = addfileList.join('|')
			} else {
				value.photo = '';
			}
			if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
				value.id = location.query.id;
			}
			value.cpAssemblyBuild ={}
			value.cpAssemblyBuild.id = isNotBlank(selectkhindata)&&isNotBlank(selectkhindata.id)?selectkhindata.id:
			(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? cpBusinessOrderGet.cpAssemblyBuild.id : '')
			value.client = {}
			value.user = {}
			value.client.id = isNotBlank(inselectkhdata)&&isNotBlank(inselectkhdata.id)?inselectkhdata.id:
			(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) && isNotBlank(cpBusinessOrderGet.client.id) ? cpBusinessOrderGet.client.id : '')
			value.user.id = (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user)) ? cpBusinessOrderGet.user.id : getStorage('userid')
			value.orderStatus = 1
			if(updataflag){
			dispatch({
				type: 'cpinterior/createCpBusinessOrder_Add',
				payload: { ...value },
				callback: (res) => {
					this.setState({
						addfileList: [],
						fileList: [],
					});

					router.push(`/business/process/cp_internal_order_form?id=${res.data.id}`);
					// router.push('/business/process/cp_internal_order_list');
				}
			})
		}else{
			dispatch({
				type: 'cpupdata/cpBusinessOrder_update',
				payload: { ...value },
				callback: () => {
					this.setState({
						addfileList: [],
						fileList: [],
					});
					// router.push('/business/process/cp_internal_order_list');
					router.push(`/business/process/cp_internal_order_form?id=${location.query.id}`);
				}
			})
		}
		}
		});
	};

	onRevocation = (record) => {
		Modal.confirm({
			title: '撤销该配件内部订单',
			content: '确定撤销该配件内部订单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.onUndo(record),
		});
	}

	onUndo = (id) => {
		const { dispatch, cpBusinessOrderGet } = this.props;
		const {confirmflag,location}= this.state
		const that =this
        setTimeout(function(){
			that.setState({
			confirmflag:true
			})
		},1000)

		if(confirmflag){
		this.setState({
			confirmflag:false
		})
		if (isNotBlank(id)) {
			dispatch({
				type: 'cpinterior/cpBusinessOrder_Revocation',
				payload: { id: cpBusinessOrderGet.id },
				callback: () => {
					this.setState({
						addfileList: [],
						fileList: [],
					});
					router.push(`/business/process/cp_internal_order_form?id=${location.query.id}`);
					// router.push('/business/process/cp_internal_order_list');
				}
			})
		}
	}
	}

	onupdata = ()=>{
		const {location ,updataflag } = this.state
		if(updataflag){
				this.setState({
			updataflag:false,
			updataname:'锁定'
			})
		}else{
			router.push(`/business/process/cp_internal_order_form?id=${location.query.id}`);
		}
	}

	onsave = (e) => {
		const { dispatch, form, cpBusinessOrderGet } = this.props;
		const { addfileList, location ,inselectkhdata ,selectkhindata ,updataflag} = this.state;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}

				value.cpAssemblyBuild ={}
				value.cpAssemblyBuild.id = isNotBlank(selectkhindata)&&isNotBlank(selectkhindata.id)?selectkhindata.id:
				(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.id) ? cpBusinessOrderGet.cpAssemblyBuild.id : '')
			   value.client = {}
				value.user = {}
				value.client.id = isNotBlank(inselectkhdata)&&isNotBlank(inselectkhdata.id)?inselectkhdata.id:
			(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client) && isNotBlank(cpBusinessOrderGet.client.id) ? cpBusinessOrderGet.client.id : '')
				value.user.id = isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) ? cpBusinessOrderGet.user.id : getStorage('userid')
				if(updataflag){
				value.orderStatus = 0
				dispatch({
					type: 'cpinterior/createCpBusinessOrder_Add',
					payload: { ...value },
					callback: (res) => {
					this.setState({
						addfileList: [],
						fileList: [],
					});
					router.push(`/business/process/cp_internal_order_form?id=${res.data.id}`);
					}
				})
			}else{
				value.orderStatus = 1
				dispatch({
					type: 'cpupdata/cpBusinessOrder_update',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
					}
				})
			}
			}
		});
	}

	onCancelCancel = () => {
		router.push('/business/process/cp_internal_order_list');
	};

	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = file => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	};

	handleImage = url => {
		this.setState({
			previewImage: url,
			previewVisible: true,
		});
	};

	handleRemove = file => {
		this.setState(({ fileList, addfileList }) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			const newaddfileList = addfileList.slice();
			newaddfileList.splice(index, 1);
			return {
				fileList: newFileList,
				addfileList: newaddfileList,
			};
		});
	};

	handlebeforeUpload = file => {
		const { addfileList } = this.state;
		const { dispatch } = this.props
		const isimg = file.type.indexOf('image') >= 0;
		if (!isimg) {
			message.error('请选择图片文件!');
		}
		const isLt10M = file.size / 1024 / 1024 <= 10;
		if (!isLt10M) {
			message.error('文件大小需为10M以内');
		}
		if (isimg && isLt10M) {
			dispatch({
				type: 'upload/upload_img',
				payload: {
					file,
					name: 'businessIntention'
				},
				callback: (res) => {
					console.log(666)
					if (!isNotBlank(addfileList) || addfileList.length <= 0) {
						this.setState({
							addfileList: [res],
						});
					} else {
						this.setState({
							addfileList: [...addfileList, res],
						});
					}
				}
			})
		}
		return isLt10M && isimg;
	};

	handleUploadChange = info => {
		const isimg = info.file.type.indexOf('image') >= 0;
		const isLt10M = info.file.size / 1024 / 1024 <= 10;
		if (info.file.status === 'done') {
			if (isLt10M && isimg) {
				this.setState({ fileList: info.fileList });
			}
		} else {
			this.setState({ fileList: info.fileList });
		}
	};

	handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
	};

	onselectkh = () => {
		this.setState({
			selectkhflag: true
		})
	}

	selectcustomer = (record) => {
		this.setState({
			selectkhindata: record,
			selectkhflag: false
		})
	}

	oneditsm = () => {
		this.setState({
			modalVisible: true
		})
	}

	handleModalVisible = flag => {
		this.setState({
			modalVisible: !!flag,
		});
	};

	handleAdd = fields => {
		const { dispatch } = this.props;
	};

	handleModalVisiblekhin=()=>{
		this.setState({
			selectkhinflag: false,
		});
	}

	selectcustomerin = (record) => {
		this.setState({
			inselectkhdata: record,
			selectkhinflag: false
		})
	}

	onselectinkh = () => {
		const { dispatch } = this.props
		const that = this
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
				pageSize: 10,
			},
			callback: () => {
				that.setState({
					selectkhinflag: true
				})
			}
		});
		dispatch({
			type: 'cpClient/cpClient_SearchList'
		})
	}

	handleSearchVisible = () => {
		this.setState({
			khsearchVisible: false,
		});
	};

	handleSearchChange = () => {
		this.setState({
			khsearchVisible: true,
		});
	};

	handleSearchAdd = (fieldsValue) => {
		const { dispatch } = this.props;
		dispatch({
		     type: 'cpClient/cpClient_List',
			payload: {
				genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
				pageSize: 10,
				current: 1,
			},
		});
		this.setState({
			khsearchVisible: false,
		});
	}

	handleSearchVisiblezc = (fieldsValue) => {
		this.setState({
		  searchVisiblezc: false,
		  historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

	handleSearchChangezc = () => {
		const {dispatch} = this.props
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
		  });
	this.setState({
	 searchVisiblezc: true,
		});
	}

	handleSearchAddzc = (fieldsValue) => {
	const { dispatch } = this.props;
	dispatch({
		  type: 'cpAssemblyBuild/cpAssemblyBuild_List',
		  payload: {
			...this.state.zcsearch,
			genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
			pageSize: 10,
		    current: 1,
				 }
				})
			this.setState({
		  searchVisiblezc: false,
		  historyfilter:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

	selectthis=(e)=>{
		console.log(e)
		this.setState({
			selthis:e
		})
	}

	showTable = () => {
		const {dispatch} = this.props 
		const {location,wlsearch,pageCurrent,pagePageSize} = this.state
		dispatch({
		  type: 'cpBillMaterial/get_cpBillMaterial_All',
		  payload: {
			intentionId: location.query.id,
      ...wlsearch,
      current:pageCurrent,
      pageSize:pagePageSize,
      tag:1
		  }
		});
		this.setState({
			modalVisibleMore: true
		});
	  }

	  handleDeleteClick = (id) => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
		  type: 'cpinterior/interior_del_CpBillSingel',
		  payload: {
			id
		  },
		  callback: (res) => {
			this.setState({
				mxnumflag:false
			})
			dispatch({
			  type: 'cpinterior/cpBusinessOrder_Get',
			  payload: {
				id: location.query.id,
			  }
			})
			dispatch({
				type: 'cpBillMaterial/get_cpBillMaterial_All',
				payload: {
				  intentionId: location.query.id,
          pageSize: 10,
          tag:1
				}
			  });
			dispatch({
			  type: 'cpBillMaterial/cpBillMaterial_middle_List',
			  payload: {
				pageSize: 10,
				singelId: location.query.id
			  },
			  callback:(res)=>{
				let newarr = []
				if(isNotBlank(res.list)&&res.list.length>0){
				  newarr = [...res.list]
				}
			   this.setState({dataSource:newarr
			  })
			}
			});
		  }
		});
	  }

	  handleSelectRows = rows => {
		  this.setState({
				selectedRows: rows,
			  });
	  };

	  showForm = () => {
		this.setState({
		  FormVisible: true
		})
	  }

	  showMore = () => {
		this.setState({
		  modalVisibleMore: true
		})
	  }

	  handleFormAdd = (values) => {
		const { dispatch } = this.props
		const { location, modalRecord ,wlshowdata } = this.state
		this.setState({
			mxnumflag:true
		})
		const newdata = { ...values }
		if (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.id)) {
			newdata.id = wlshowdata.id
		}else{
			newdata.isTemplate = 1
		}
		dispatch({
		  type: 'cpBillMaterial/cpBillMaterial_middle_Add',
		  payload: {
			singelId: location.query.id,
			ids: isNotBlank(modalRecord)&&isNotBlank(modalRecord.id)?modalRecord.id:
			(isNotBlank(wlshowdata)&& isNotBlank(wlshowdata.id)&&isNotBlank(wlshowdata.cpBillMaterial)&&isNotBlank(wlshowdata.cpBillMaterial.id)?wlshowdata.cpBillMaterial.id:''),
			...newdata,
		  }
		  ,
		  callback: () => {
			this.setState({
			  FormVisible: false,
			  modalRecord:{},
			  billid:'',
			  wlshowdata:{}
			})
			dispatch({
			  type: 'cpinterior/cpBusinessOrder_Get',
			  payload: {
				id: location.query.id,
			  }
			})
			dispatch({
			  type: 'cpBillMaterial/get_cpBillMaterial_All',
			  payload: {
				intentionId: location.query.id,
        pageSize: 10,
        tag:1
			  }
			});
			dispatch({
			  type: 'cpBillMaterial/cpBillMaterial_middle_List',
			  payload: {
				singelId: location.query.id
			  },
			  callback:(res)=>{
				let newarr = []
				if(isNotBlank(res.list)&&res.list.length>0){
				  newarr = [...res.list]
				}
			   this.setState({dataSource:newarr
			  })
			}
			})
		  }
		})
	  }

	  searchcode = ()=>{
		const {dispatch} = this.props
		const {location ,billid} = this.state
		if(isNotBlank(billid)){
		this.setState({
		  modalRecord:{},
		 })
		dispatch({
		  type: 'cpBillMaterial/get_cpBillMaterial_search_All',
		  payload: {
			purchaseId: location.query.id,
			billCode:billid,
      pageSize: 10,
      tag:1
		  },
		  callback:(res)=>{
			   if(isNotBlank(res)&&isNotBlank(res.list)&&res.list.length>0){
				   this.setState({
					modalRecord:res.list[0]
				   })
			   }
		  }
		});
	  }else{
		  message.error('请输入物料编码')
	  }
	}

	selectmore = (res) => {
		const { dispatch } = this.props;
		const {  location } = this.state;
		this.setState({
		  modalVisibleMore:false,
		  modalRecord:res,
		  billid:res.billCode
		})
	  }

	  handleModalVisibleMore = flag => {
		this.setState({
		  modalVisibleMore: !!flag
		});
	  };

	    handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag,
	  modalRecord:{},
	  wlshowdata:{},
      billid:''
    });
  };

  changecode =(id)=>{
	this.setState({
	  modalRecord:{},
	  billid:id
	 })
  }

  editmx = (data) => {
	this.setState({
		FormVisible: true,
		wlshowdata: data,
		billid: isNotBlank(data.cpBillMaterial) && isNotBlank(data.cpBillMaterial.billCode) ? data.cpBillMaterial.billCode : ''
	});
}

	render() {
		const { fileList, previewVisible, previewImage, orderflag, selectkhflag, selectkhindata, modalVisible ,location,
			 sumbitflag , selectkhinflag ,inselectkhdata ,khsearchVisible ,searchVisiblezc ,updataflag,updataname ,selthis ,billid,FormVisible
			  ,modalRecord ,modalVisibleMore ,wlshowdata,mxnumflag,srcimg,srcimg1} = this.state;
		const { submitting2,submitting3, getcpBillMaterialAll ,submitting1,submitting, cpBusinessOrderGet, cpAssemblyBuildList ,cpClientList  ,cpAssemblyBuildSearchList , dispatch ,cpClientSearchList ,cpBillMaterialMiddleList} = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;
		console.log(this.state.area)
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
		const submitFormLayout = {
			wrapperCol: {
				xs: { span: 24, offset: 0 },
				sm: { span: 10, offset: 7 },
			},
		};
		const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传照片</div>
  </div>
		);
			const that = this

		const parentMethodsMore = {
			handleAdd: this.handleAdd,
			handleModalVisibleMore: this.handleModalVisibleMore,
			selectmore: this.selectmore,
			cpBillMaterialList:getcpBillMaterialAll,
			modalRecord,
			dispatch,
			location,
			that
		  }
	    const parentMethodForms = {
			handleFormAdd: this.handleFormAdd,
			handleFormVisible: this.handleFormVisible,
			searchcode:this.searchcode,
			changecode:this.changecode,
			submitting1,
			selectForm: this.selectForm,
			showTable: this.showTable,
			modalRecord,
			FormVisible,
			wlshowdata,
			billid,
			that
		  };
		const parentMethodskh = {
			handleAddkh: this.handleAddkh,
			handleModalVisiblekh: this.handleModalVisiblekh,
			selectcustomer: this.selectcustomer,
			cpAssemblyBuildList,
			handleSearchChangezc:this.handleSearchChangezc,
			dispatch,
			that
		}
		const parentMethods = {
			handleAdd: this.handleAdd,
			handleModalVisible: this.handleModalVisible,
			that
		};
		const parentMethodskhin = {
			handleAddkhin: this.handleAddkhin,
			handleModalVisiblekhin: this.handleModalVisiblekhin,
			selectcustomerin : this.selectcustomerin,
			cpClientList,
			dispatch,
			handleSearchChange:this.handleSearchChange,
			inselectkhdata,
			that
		}
		const parentSearchMethods = {
			handleSearchVisible:this.handleSearchVisible,
			handleSearchAdd:this.handleSearchAdd,
			cpClientSearchList,
			khsearchVisible,
			that
		}
		const parentSearchMethodszc = {
			handleSearchVisiblezc: this.handleSearchVisiblezc,
			handleSearchAddzc: this.handleSearchAddzc,
			cpAssemblyBuildSearchList,
			that
		  }
		  const columnswl = [
			{
				title: '修改',
				width: 100,
				render: (text, record) => {
					if (isNotBlank(record.id)&&!orderflag) {
						return <Fragment>
  <a onClick={() => this.editmx(record)}>修改</a>
</Fragment>
					}
				},
			},
			{
			  title: '物料编码',        
			  dataIndex: 'cpBillMaterial.billCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '一级编码',        
			  dataIndex: 'cpBillMaterial.oneCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '二级编码',        
			  dataIndex: 'cpBillMaterial.twoCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '一级编码型号',        
			  dataIndex: 'cpBillMaterial.one.model',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '二级编码名称',        
			  dataIndex: 'cpBillMaterial.two.name',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '名称',        
			  dataIndex: 'cpBillMaterial.name',   
			  inputType: 'text',   
			  width: 300,          
			  editable: true,      
			},
			{
			  title: '原厂编码',        
			  dataIndex: 'cpBillMaterial.originalCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '配件厂商',        
			  dataIndex: 'cpBillMaterial.rCode',   
			  inputType: 'text',   
			  width: 100,          
			  editable: true,      
			},
			{
			  title: '需求数量',        
			  dataIndex: 'number',   
			  inputType: 'text',   
			  width: 150,          
			  editable: true, 
			  render:(text,res)=>{
							  if(isNotBlank(res.id)){
								  return text
							  }
							  return `总数量:${text}`
						  }   
			      
			},
			{
			  title: '创建时间',
			  dataIndex: 'createDate',
			  editable: false,
			  inputType: 'dateTime',
			  width: 100,
			  sorter: true,
			  render: val =>{
				if(isNotBlank(val)){
				 return moment(val).format('YYYY-MM-DD HH:mm:ss')
				}
				return ''
				},
			},
			{
			  title: '创建时间',
			  dataIndex: 'createDate',
			  editable: false,
			  inputType: 'dateTime',
			  width: 100,
			  sorter: true,
			  render: val =>{
				if(isNotBlank(val)){
				 return moment(val).format('YYYY-MM-DD HH:mm:ss')
				}
				return ''
				},
			},
			{
			  title: '更新时间',
			  dataIndex: 'finishDate',
			  editable: true,
			  inputType: 'dateTime',
			  width: 100,
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
			  width: 100,          
			  editable: true,      
			},
			{
				title: '基础操作',
				width: 100,
				render: (text, record) => {
					if (isNotBlank(record.id)&&!orderflag) {
						return <Fragment>
  <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
    <a>删除</a>
  </Popconfirm>
</Fragment>
					}
					return ''
				},
			},
		  ]
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
内部订单
      </div>
      {isNotBlank(cpBusinessOrderGet)&&isNotBlank(cpBusinessOrderGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
        </span><img src={isNotBlank(srcimg)&&isNotBlank(srcimg.msg)?getFullUrl(`/${srcimg.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                          </div>}
      {isNotBlank(cpBusinessOrderGet)&&isNotBlank(cpBusinessOrderGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
        </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                                 </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单状态'>
                {getFieldDecorator('orderStatus', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderStatus) ? ((cpBusinessOrderGet.orderStatus === 0 || cpBusinessOrderGet.orderStatus === '0') ? '未处理' : '已处理') : '',     
										rules: [
											{
												required: false,   
												message: '请输入订单状态',
											},
										],
									})(<Input disabled style={cpBusinessOrderGet.orderStatus === 1 || cpBusinessOrderGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }} />)}
              </FormItem>
            </Col>
			{!(isNotBlank(cpBusinessOrderGet)&&isNotBlank(cpBusinessOrderGet.intentionId)&&cpBusinessOrderGet.intentionId=='0000')&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='意向单号'>
                {getFieldDecorator('intentionId', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.intentionId) ? cpBusinessOrderGet.intentionId : '',     
										rules: [
											{
												required: false,   
												message: '请输入意向单号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
			}
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                {getFieldDecorator('orderCode', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderCode) ? cpBusinessOrderGet.orderCode : '',     
										rules: [
											{
												required: false,   
												message: '请输入订单编号',
											},
										],
									})(<Input disabled  />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='内部分类'>
                {getFieldDecorator('orderType', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderType) ? cpBusinessOrderGet.orderType : '',    
										rules: [
											{
												required: false,
												message: '请选择内部分类',
											},
										],
									})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled={orderflag}
    onChange={this.selectthis}
  >
    {
												isNotBlank(this.state.interior_type) && this.state.interior_type.length > 0 && this.state.interior_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="下单人信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务员'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) ? cpBusinessOrderGet.user.name : getStorage('username'))}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属公司'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.office) ? cpBusinessOrderGet.user.office.name : getStorage('companyname'))}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属区域'>
                <Select
                  allowClear
                  notFoundContent={null}
                  style={{ width: '100%' }}
                  value={(isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.dictArea) ? cpBusinessOrderGet.user.dictArea :  getStorage('area'))}
                  
                  disabled
                >
                  {
											isNotBlank(this.state.area) && this.state.area.length > 0 && this.state.area.map(item =>
  <Option value={item.value} key={item.value}>
    {item.label}
  </Option>
											)
										}
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Card>
        {!(isNotBlank(selthis)&&selthis=='6869522f-e51e-4ff9-b3bc-bea88634ccbb')&&
        <Card title="总成信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成型号'>
                <Input 
                  style={{width:'50%'}}
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblyModel) ? selectkhindata.assemblyModel : (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyModel) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyModel : '')}
                  
                  disabled
                />
                <Button type="primary" style={{marginLeft:'8px'}} disabled={orderflag} onClick={this.onselectkh} loading={submitting}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成品牌'>
                <Input
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblyBrand) ? selectkhindata.assemblyBrand
											: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand : '')}
                  
                  disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型/排量'>
                <Input
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.vehicleModel) ? selectkhindata.vehicleModel
											: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.vehicleModel) ? cpBusinessOrderGet.cpAssemblyBuild.vehicleModel : '')}
                  
                  disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                <Input
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblyYear) ? selectkhindata.assemblyYear
										: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyYear) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyYear : '')}
                  
                  disabled
                />
              </FormItem>
            </Col>
            {!(isNotBlank(selthis)&&selthis=='370dca10-db9b-42e1-a666-10e1833930a3')&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='进场类型'>
                <Select
                value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblyEnterType) ? selectkhindata.assemblyEnterType
											: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyEnterType) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyYear : '')}
                allowClear
                disabled
                style={{ width: '100%' }}
              >
                {
											isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
										}
              </Select>
              </FormItem>
            </Col>
	}
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='钢印号'>
                <Input
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblySteelSeal) ? selectkhindata.assemblySteelSeal
										: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblySteelSeal) ? cpBusinessOrderGet.cpAssemblyBuild.assemblySteelSeal : '')}
                  
                  disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='VIN码'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblyVin) ? selectkhindata.assemblyVin
										: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyVin) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyVin : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
                <Select
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.project) ? selectkhindata.project
						: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.project) ? cpBusinessOrderGet.cpAssemblyBuild.project : '')}
                  allowClear
                  disabled
                  style={{ width: '100%' }}
                  
                >
                  {
						isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
					}
                </Select>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>	
              <FormItem {...formItemLayout} label='大号'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.maxCode) ? selectkhindata.maxCode
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.maxCode) ? cpBusinessOrderGet.cpAssemblyBuild.maxCode : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='小号'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.minCode) ? selectkhindata.minCode
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.minCode) ? cpBusinessOrderGet.cpAssemblyBuild.minCode : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>	
              <FormItem {...formItemLayout} label='总成分类'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblyType) ? selectkhindata.assemblyType
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyType) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyType : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>	
              <FormItem {...formItemLayout} label='类型编码'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.lxCode) ? selectkhindata.lxCode
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.lxCode) ? cpBusinessOrderGet.cpAssemblyBuild.lxCode : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>	
              <FormItem {...formItemLayout} label='分类编码'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.flCode) ? selectkhindata.flCode
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.flCode) ? cpBusinessOrderGet.cpAssemblyBuild.flCode : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>	
              <FormItem {...formItemLayout} label='技术参数'>
                <Input
                   
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.technicalParameter) ? selectkhindata.technicalParameter
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.technicalParameter) ? cpBusinessOrderGet.cpAssemblyBuild.technicalParameter : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型'>
                <Input
                  disabled
                  
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.vehicleModel) ? selectkhindata.vehicleModel
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.vehicleModel) ? cpBusinessOrderGet.cpAssemblyBuild.vehicleModel : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.assemblyBrand) ? selectkhindata.assemblyBrand
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand) ? cpBusinessOrderGet.cpAssemblyBuild.assemblyBrand : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌编码'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.brandCode) ? selectkhindata.brandCode
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.brandCode) ? cpBusinessOrderGet.cpAssemblyBuild.brandCode : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='原厂编码'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.originalCode) ? selectkhindata.originalCode
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.originalCode) ? cpBusinessOrderGet.cpAssemblyBuild.originalCode : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='再制造编码'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhindata) && isNotBlank(selectkhindata.makeCode) ? selectkhindata.makeCode
					: (isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) && isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.makeCode) ? cpBusinessOrderGet.cpAssemblyBuild.makeCode : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
					}
        <Card title="其他信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            {isNotBlank(selthis)&&(selthis=='370dca10-db9b-42e1-a666-10e1833930a3'||selthis=='73db0e10-a7ad-45a0-9445-74ec96821a6b')&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='数量'>
                {getFieldDecorator('number', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.number) ? cpBusinessOrderGet.number : 1,    
										rules: [
											{
												required: false,
												message: '请输入数量',
											},
										],
									})(
  <InputNumber disabled={orderflag} />	
									)}
              </FormItem>
            </Col>
							}
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='是否拍照'>
                {getFieldDecorator('isPhotograph', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.isPhotograph) ? cpBusinessOrderGet.isPhotograph : '4',    
										rules: [
											{
												required: false,
												message: '请选择是否拍照',
											},
										],
									})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled={orderflag&&updataflag}
  >
    {
												isNotBlank(this.state.is_photograph) && this.state.is_photograph.length > 0 && this.state.is_photograph.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='维修历史' className="allinputstyle">
                {getFieldDecorator('maintenanceHistory', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.maintenanceHistory) ? cpBusinessOrderGet.maintenanceHistory : '',     
										rules: [
											{
												required: true,   
												message: '请输入维修历史',
											},
										],
									})(<TextArea  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
										initialValue: isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.remarks) ? cpBusinessOrderGet.remarks : '',     
										rules: [
											{
												required: false,
												message: '请输入备注信息',
											},
										],
									})(
  <TextArea disabled={orderflag&&updataflag} style={{ minHeight: 32 }} rows={2} />
									)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
						}
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpInternalOrder')[0].children.filter(item=>item.name=='修改')
.length>0&&<span>
  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} loading={submitting2||submitting3} disabled={sumbitflag||(orderflag&&updataflag)}>
							保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting2||submitting3} disabled={sumbitflag||(orderflag&&updataflag)||(selthis!='370dca10-db9b-42e1-a666-10e1833930a3'&&!isNotBlank(cpBusinessOrderGet.id))}>
							提交
  </Button>
  {isNotBlank(selthis)&&(selthis=='6869522f-e51e-4ff9-b3bc-bea88634ccbb'||selthis=='73db0e10-a7ad-45a0-9445-74ec96821a6b')&&
  <Button
    style={{ marginLeft: 8 }}
    type="primary"
    onClick={() => this.showForm()} 
    disabled={orderflag||mxnumflag||!isNotBlank(cpBusinessOrderGet.id)}
		>
                  新增明细
  </Button>
			}
  {
							isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderStatus) && (cpBusinessOrderGet.orderStatus === 1 || cpBusinessOrderGet.orderStatus === '1') ?
  <Button style={{ marginLeft: 8 }} loading={submitting2||submitting3} onClick={() => this.onRevocation(cpBusinessOrderGet.id)}>
									撤销
  </Button> : null
						}
</span>}
          <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
							返回
          </Button>
        </FormItem>
      </Form>
    </Card> 
    {isNotBlank(selthis)&&(selthis=='6869522f-e51e-4ff9-b3bc-bea88634ccbb'||selthis=='73db0e10-a7ad-45a0-9445-74ec96821a6b')&&
    <div className={styles.standardList}>
      <Card bordered={false} title='物料明细'>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator} />
          <StandardEditTable
            scroll={{ x: 1800 }}
            data={cpBillMaterialMiddleList}
            bordered
            columns={columnswl}
          />
        </div>
      </Card>
    </div>
	}
    <CreateFormMore {...parentMethodsMore} modalVisibleMore={modalVisibleMore} />
    <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
    <SearchFormzc {...parentSearchMethodszc} searchVisiblezc={searchVisiblezc} />
    <SearchForm {...parentSearchMethods} khsearchVisible={khsearchVisible} />   
    <CreateForm {...parentMethods} modalVisible={modalVisible} />
    <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
    <CreateFormkhin {...parentMethodskhin} selectkhinflag={selectkhinflag} />
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  </PageHeaderWrapper>
		);
	}
}
export default CpBusinessOrderForm;
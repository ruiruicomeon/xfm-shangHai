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
	message,
	Icon,
	Upload,
	Modal,
	DatePicker
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpAssemblyFormForm.less';
import SearchTableList from '@/components/SearchTableList';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

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

	handleSearchVisiblezcin = () => {
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
    onCancel={() => this.handleSearchVisiblezcin()}
    afterClose={() => this.handleSearchVisiblezcin()}
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

	handleSearchVisiblein = () => {
		const { form, handleSearchVisible } = this.props;
		form.validateFields((err, fieldsValue) => {
		  handleSearchVisible(fieldsValue);
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
    onCancel={() => this.handleSearchVisiblein()}
    afterClose={() => this.handleSearchVisiblein()}
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
const CreateFormkh = Form.create()(props => {
	const { handleModalVisiblekh, cpClientList, selectkhflag, selectcustomer, handleSearchChange, form, dispatch, that } = props;
	const { getFieldDecorator } = form
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center',
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
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '联系人',        
			dataIndex: 'name',   
			inputType: 'text',   
			width: 150,
			align: 'center',      
			editable: true,      
		},
		{
			title: '客户分类',        
			dataIndex: 'classify',   
			inputType: 'text',   
			width: 100,
			align: 'center',     
			editable: true,      
		},
		{
			title: '客户级别',        
			dataIndex: 'level',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '联系地址',        
			dataIndex: 'address',   
			inputType: 'text',   
			width: 100,
			align: 'center',     
			editable: true,      
		},
		{
			title: '邮箱',        
			dataIndex: 'email',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '移动电话',        
			dataIndex: 'phone',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '电话',        
			dataIndex: 'tel',   
			inputType: 'text',   
			width: 100,
			align: 'center',         
			editable: true,      
		},
		{
			title: '传真',        
			dataIndex: 'fax',   
			inputType: 'text',   
			width: 100,
			align: 'center',         
			editable: true,      
		},
		{
			title: '税号',        
			dataIndex: 'dutyParagraph',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true,      
		},
		{
			title: '开户账号',        
			dataIndex: 'openNumber',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '开户银行',        
			dataIndex: 'openBank',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '开户地址',        
			dataIndex: 'openAddress',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '开户电话',        
			dataIndex: 'openTel',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '创建者',        
			dataIndex: 'user.name',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: false,      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
			inputType: 'dateTime',
			width: 100,
			align: 'center',
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
			align: 'center',       
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
			that.setState({
				formValues: values,
			});
			dispatch({
				type: 'cpClient/cpClient_List',
				payload: {
					...values,
					pageSize: 10,
					genTableColumn:isNotBlank(that.state.historyfilter1)?that.state.historyfilter1:[], 
					current: 1,
				},
			});
		});
	};
	const handleFormReset = () => {
		form.resetFields();
		that.setState({
			formValues: {},
		});
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
				pageSize: 10,
				genTableColumn:isNotBlank(that.state.historyfilter1)?that.state.historyfilter1:[], 
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
			...that.state.formValues,
			...filters,
			genTableColumn:isNotBlank(that.state.historyfilter1)?that.state.historyfilter1:[], 
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: params,
		});
	};
	const handleModalkh = () => {
		// form.resetFields();
		handleModalVisiblekh()
	}
	return (
  <Modal
    title='选择客户'
    visible={selectkhflag}
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
const CreateFormzc = Form.create()(props => {
	const { handleModalVisiblezc, selectzcflag, selectzc, cpAssemblyBuildList, form, handleSearchChangezc, dispatch, that ,copyfieldsVal} = props;
	const { getFieldDecorator } = form
	const columnzcs = [
		{
			title: '操作',
			width: 100,
			align: 'center',
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectzc(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '业务项目',        
			dataIndex: 'project',   
			inputType: 'text',   
			width: 100,
			align: 'center',         
			editable: true,      
		},
		{
			title: '总成型号',        
			dataIndex: 'assemblyModel',   
			inputType: 'text',   
			width: 150,
			align: 'center',       
			editable: true,      
		},
		{
			title: '总成号',        
			dataIndex: 'assemblyCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '大号',        
			dataIndex: 'maxCode',   
			inputType: 'text',   
			width: 150,
			align: 'center',       
			editable: true,      
		},
		{
			title: '小号',        
			dataIndex: 'minCode',   
			inputType: 'text',   
			width: 150,
			align: 'center',        
			editable: true,      
		},
		{
			title: '总成分类',        
			dataIndex: 'assemblyType',   
			inputType: 'text',   
			width: 100,
			align: 'center',     
			editable: true     
		},
		{
			title: '类型编码',        
			dataIndex: 'lxCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',          
			editable: true,      
		},
		{
			title: '分类编码',        
			dataIndex: 'flCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '技术参数',        
			dataIndex: 'technicalParameter',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '车型',        
			dataIndex: 'vehicleModel',   
			inputType: 'text',   
			width: 150,
			align: 'center',         
			editable: true,      
		},
		{
			title: '品牌',        
			dataIndex: 'assemblyBrand',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '年份',        
			dataIndex: 'assemblyYear',   
			inputType: 'text',   
			width: 100,
			align: 'center',        
			editable: true,      
		},
		{
			title: '品牌编码',        
			dataIndex: 'brandCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '一级编码型号',        
			dataIndex: 'oneCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '绑定系列数量',        
			dataIndex: 'bindingNumber',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '原厂编码',        
			dataIndex: 'originalCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',       
			editable: true,      
		},
		{
			title: '再制造编码',        
			dataIndex: 'makeCode',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '提成类型',        
			dataIndex: 'pushType',   
			inputType: 'text',   
			width: 100,
			align: 'center',      
			editable: true      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
			inputType: 'dateTime',
			width: 150,
			align: 'center',
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
			align: 'center',         
			editable: true,      
		},
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
			that.setState({
				formValueszc: values
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
			formValueszc: {}
		})
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: {
				pageSize: 10,
				current: 1,
				genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
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
			...that.state.formValueszc,
			...filters,
			genTableColumn:isNotBlank(that.state.historyfilter)?that.state.historyfilter:[], 
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: params,
		});
	};

	const handleModalVisiblezcin = ()=>{
		form.resetFields();
		that.setState({
			formValueszc: {}
		})
		handleModalVisiblezc()
	}

	return (
  <Modal
    title='选择总成'
    visible={selectzcflag}
    onCancel={() => handleModalVisiblezcin()}
    width='80%'
		>
    <Form onSubmit={handleSearch}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
          <FormItem {...formItemLayout} label="车型">
            {getFieldDecorator('vehicleModel', {
								initialValue: ''
							})(
  <Input  />
							)}
          </FormItem>
        </Col>
		<Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="品牌">
            {getFieldDecorator('assemblyBrand', {
								initialValue: ''
							})(
  			<Input  />
							)}
          </FormItem>
        </Col>
        <Col md={8} sm={24} style={{textAlign:'center'}}>
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
      scroll={{ x: 2500 }}
      onChange={handleStandardTableChange}
      data={cpAssemblyBuildList}
      columns={columnzcs}
    />
  </Modal>
	);
});
@connect(({ cpAssemblyForm, loading, cpClient, cpAssemblyBuild }) => ({
	...cpAssemblyForm,
	...cpClient,
	...cpAssemblyBuild,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpAssemblyForm/cpAssemblyForm_Add'],
	submitting2: loading.effects['cpupdata/cpAssemblyForm_update']
}))
@Form.create()
class CpAssemblyFormForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			fileList: [],
			selectkhflag: false,
			selectzcflag: false,
			orderflag: false,
			sumbitflag: false,
			updataflag: true,
			cpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
			{ name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
			{ name: 'Y' }, { name: 'Z' }],
			incpzim: [],
			selinputcp: '',
			selwenz: '',
			selzim: '',
			copyfieldsVal:'',
			khsearch:{},
			zcsearch:{},
			formValueszc:{},
			confirmflag :true,
			updataname: '取消锁定',
			location: getLocation(),
		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const { location, cpzim } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpAssemblyForm/cpAssemblyForm_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
						|| (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAssemblyForm').length > 0
							&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAssemblyForm')[0].children.filter(item => item.name == '修改')
								.length == 0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
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
					if (isNotBlank(res.data.plateNumber)) {
						const newselwenz = res.data.plateNumber.slice(0, 1)
						this.setState({
							selwenz: res.data.plateNumber.slice(0, 1),
							selzim: res.data.plateNumber.slice(1, 2),
							selinputcp: res.data.plateNumber.slice(2),
						})
						if(isNotBlank(newselwenz)){
						if (newselwenz == '京' ) {
							this.setState({
								incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' },{ name: 'E' }, { name: 'F' }, { name: 'G' },
								{ name: 'H' },{ name: 'J' }, { name: 'K' },{name: 'L' },{ name: 'M' },{ name: 'N' },{ name: 'O' },{ name: 'P' },{ name: 'Q' },{ name: 'R' }, { name: 'Y' }]
							})
						}else if (newselwenz == '藏' || newselwenz == '台') {
								this.setState({
									incpzim: cpzim.slice(0, 7)
								})
							} else if (newselwenz == '川' || newselwenz == '粤') {
								this.setState({
									incpzim: cpzim
								})
							} else if (newselwenz == '鄂' || newselwenz == '皖' || newselwenz == '云') {
								this.setState({
									incpzim: cpzim.slice(0, 17)
								})
							} else if (newselwenz == '甘' || newselwenz == '辽') {
								this.setState({
									incpzim: cpzim.slice(0, 14)
								})
							} else if (newselwenz == '贵' || newselwenz == '吉') {
								this.setState({
									incpzim: cpzim.slice(0, 9)
								})
							} else if (newselwenz == '黑' || newselwenz == '桂'|| newselwenz == '新') {
								this.setState({
									incpzim: cpzim.slice(0, 16)
								})
							}
							else if (newselwenz == '冀') {
								this.setState({
									incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
									{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'R' },{ name: 'T' }
								]
								})
							} else if (newselwenz == '晋' || newselwenz == '蒙' || newselwenz == '赣') {
								this.setState({
									incpzim: cpzim.slice(0, 12)
								})
							} else if(newselwenz == '鲁'){
								this.setState({
									incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
									{ name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'Y' }]
								})
							} else if (newselwenz == '陕') {
								this.setState({
									incpzim: cpzim.slice(0, 20)
								})
							} else if (newselwenz == '闽') {
								this.setState({
									incpzim: cpzim.slice(0, 10)
								})
							} else if (newselwenz == '宁' || newselwenz == '琼') {
								this.setState({
									incpzim: cpzim.slice(0, 5)
								})
							} else if (newselwenz == '青' || newselwenz == '渝') {
								this.setState({
									incpzim: cpzim.slice(0, 8)
								})
							} else if (newselwenz == '湘' || newselwenz == '豫') {
								this.setState({
									incpzim: cpzim.slice(0, 18)
								})
							}
							else if (newselwenz == '苏') {
								this.setState({
									incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
					{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'U' }
				]
								})
							} else if (newselwenz == '浙') {
								this.setState({
									incpzim: cpzim.slice(0, 11)
								})
							} else if (newselwenz == '港' || newselwenz == '澳') {
								this.setState({
									incpzim: cpzim.slice(0, 1)
								})
							} else if (newselwenz == '沪') {
								this.setState({
									incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
									{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'Q' },{ name: 'R' },{ name: 'Z' }
								]
								})
							} else if (newselwenz == '津') {
								this.setState({
									incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' },{name: 'I' } ,{ name: 'J' }, { name: 'K' }, { name: 'L' },
									{ name: 'M' }, { name: 'N' }, {name: 'O'  }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
									{ name: 'Y' }, { name: 'Z' }]
								})
							}
						} else {
							this.setState({
								incpzim: []
							})
						}
					}

					this.props.form.setFieldsValue({
						xh: isNotBlank(res.data) && isNotBlank(res.data.cpAssemblyBuild) && isNotBlank(res.data.cpAssemblyBuild.assemblyModel) ? res.data.cpAssemblyBuild.assemblyModel : '',
					});
					dispatch({
						type: 'sysarea/getFlatCode',
						payload: {
							id: location.query.id,
							type: 'ZCD'
						},
						callback: (res) => {
							this.setState({
								srcimg: res
							})
						}
					})
				}
			});
    }
    
    dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
				pageSize: 10,
			}
		})
		dispatch({
			type: 'cpClient/cpClient_SearchList'
    })
    
    dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: {
				pageSize: 10,
			}
		});

		dispatch({
			type: 'dict/dict',
			callback: data => {
				const insuranceCompany = []
				const brand = []
				const approachType = []
				const collectCustomer = []
				const orderType = []
				const business_project = []
				const business_dicth = []
				const business_type = []
				const settlement_type = []
				const payment_methodd = []
				const old_need = []
				const make_need = []
				const quality_need = []
				const oils_need = []
				const guise_need = []
				const installation_guide = []
				const is_photograph = []
				const maintenance_project = []
				const del_flag = []
				const classify = []
				const client_level = []
				const area = []
				data.forEach((item) => {
					if (item.type == 'insurance_company') {
						insuranceCompany.push(item)
					}
					if (item.type == 'brand') {
						brand.push(item)
					}
					if (item.type == 'approach_type') {
						approachType.push(item)
					}
					if (item.type == 'collect_customer') {
						collectCustomer.push(item)
					}
					if (item.type == 'orderType') {
						orderType.push(item)
					}
					if (item.type == 'business_project') {
						business_project.push(item)
					}
					if (item.type == 'business_dicth') {
						business_dicth.push(item)
					}
					if (item.type == 'business_type') {
						business_type.push(item)
					}
					if (item.type == 'settlement_type') {
						settlement_type.push(item)
					}
					if (item.type == 'payment_methodd') {
						payment_methodd.push(item)
					}
					if (item.type == 'old_need') {
						old_need.push(item)
					}
					if (item.type == 'make_need') {
						make_need.push(item)
					}
					if (item.type == 'quality_need') {
						quality_need.push(item)
					}
					if (item.type == 'oils_need') {
						oils_need.push(item)
					}
					if (item.type == 'guise_need') {
						guise_need.push(item)
					}
					if (item.type == 'installation_guide') {
						installation_guide.push(item)
					}
					if (item.type == 'maintenance_project') {
						maintenance_project.push(item)
					}
					if (item.type == 'is_photograph') {
						is_photograph.push(item)
					}
					if (item.type == 'del_flag') {
						del_flag.push(item)
					}
					if (item.type == 'classify') {
						classify.push(item)
					}
					if (item.type == 'client_level') {
						client_level.push(item)
					}
					if (item.type == 'area') {
						area.push(item)
					}
				})
				this.setState({
					insuranceCompany,
					brand, approachType, collectCustomer,
					orderType, business_project, business_dicth
					, business_type, settlement_type, payment_methodd, old_need,
					make_need, quality_need, oils_need, guise_need, installation_guide
					, maintenance_project, is_photograph, del_flag, classify, client_level
					, area
				})
			}
		})
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpAssemblyForm/clear',
		});
	}

	handleSubmit = e => {
		const { dispatch, form, cpAssemblyFormGet } = this.props;
		const { addfileList, selectkhdata, location, selectzcdata, updataflag, selwenz, selzim, selinputcp } = this.state;
		e.preventDefault();
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({
					sumbitflag: true
				})
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.plateNumber = (isNotBlank(selwenz) ? selwenz : '') + (isNotBlank(selzim) ? selzim : '') + (isNotBlank(selinputcp) ? selinputcp : '')
				value.entranceDate = moment(value.entranceDate).format("YYYY-MM-DD HH:MM")
				value.client = {}
				value.user = {}
				value.cpAssemblyBuild = {}
				value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client)) ? cpAssemblyFormGet.client.id : '')
				value.user.id = isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.user) ? cpAssemblyFormGet.user.id : ''
				value.cpAssemblyBuild.id = (isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id)) ? selectzcdata.id : ((isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild)) ? cpAssemblyFormGet.cpAssemblyBuild.id : '')
				value.orderStatus = 1
				if (updataflag) {
					dispatch({
						type: 'cpAssemblyForm/cpAssemblyForm_Add',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
							});
							router.push(`/business/process/cp_assembly_form_form?id=${location.query.id}`);
							// router.push('/business/process/cp_assembly_form_list');
						}
					})
				} else {
					dispatch({
						type: 'cpupdata/cpAssemblyForm_update',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
							});
							router.push(`/business/process/cp_assembly_form_form?id=${location.query.id}`);
							// router.push('/business/process/cp_assembly_form_list');
						}
					})
				}
			}
		});
	};

	onsave = (e) => {
		const { dispatch, form, cpAssemblyFormGet } = this.props;
		const { addfileList, selectkhdata, selectzcdata, location, updataflag, selwenz, selzim, selinputcp } = this.state;
		e.preventDefault();
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
				value.plateNumber = (isNotBlank(selwenz) ? selwenz : '') + (isNotBlank(selzim) ? selzim : '') + (isNotBlank(selinputcp) ? selinputcp : '')
				value.client = {}
				value.user = {}
				value.cpAssemblyBuild = {}
				value.entranceDate = moment(value.entranceDate).format("YYYY-MM-DD HH:mm")
				value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client)) ? cpAssemblyFormGet.client.id : '')
				value.user.id = isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.user) ? cpAssemblyFormGet.user.id : ''
				value.cpAssemblyBuild.id = (isNotBlank(selectzcdata) && isNotBlank(selectzcdata.id)) ? selectzcdata.id : ((isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild)) ? cpAssemblyFormGet.cpAssemblyBuild.id : '')
				if (updataflag) {
					value.orderStatus = 0
					dispatch({
						type: 'cpAssemblyForm/cpAssemblyForm_Add',
						payload: { ...value },
						callback: () => {
						}
					})
				} else {
					value.orderStatus = 1
					dispatch({
						type: 'cpupdata/cpAssemblyForm_update',
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

	onupdata = () => {
		const { location, updataflag } = this.state
		if (updataflag) {
			this.setState({
				updataflag: false,
				updataname: '锁定'
			})
		} else {
			router.push(`/business/process/cp_assembly_form_form?id=${location.query.id}`);
		}
	}

	onCancelCancel = () => {
		router.push('/business/process/cp_assembly_form_list');
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
					name: 'cpAssemblyFormForm'
				},
				callback: (res) => {
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
		if (isNotBlank(info.file) && isNotBlank(info.file.size)) {
			const isimg = info.file.type.indexOf('image') >= 0;
			const isLt10M = info.file.size / 1024 / 1024 <= 10;
			if (info.file.status === 'done') {
				if (isLt10M && isimg) {
					this.setState({ fileList: info.fileList });
				}
			} else {
				this.setState({ fileList: info.fileList });
			}
		}
	};

	onselectkh = () => {
    this.setState({
      selectkhflag: true
    })
	}

	handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
	};

	selectcustomer = (record) => {
		this.setState({
			selectkhdata: record,
			selectkhflag: false
		})
	}

	onselectzc = () => {
    this.setState({
      selectzcflag: true
    })
	}

	handleModalVisiblezc = flag => {
		this.setState({
			selectzcflag: !!flag
		});
	};

	selectzc = (record) => {
		this.props.form.setFieldsValue({
			xh: isNotBlank(record) && isNotBlank(record.assemblyModel) ? record.assemblyModel : '',
		});
		this.setState({
			selectzcdata: record,
			selectzcflag: false
		})
	}

	onUndo = (record) => {
		Modal.confirm({
			title: '撤销该总成登记单',
			content: '确定撤销该总成登记单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.undoClick(record),
		});
	}

	undoClick = (id) => {
		const { dispatch } = this.props
		const {confirmflag  , location}= this.state
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
		dispatch({
			type: 'cpAssemblyForm/cpassemblyzc_undo',
			payload: {
				id
			},
			callback: () => {
				router.push(`/business/process/cp_assembly_form_form?id=${location.query.id}`);
				// router.push('/business/process/cp_assembly_form_list');
			}
		})
		}
	}

	handleSearchVisible = (fieldsValue) => {
		this.setState({
			khsearchVisible: false,
			historyfilter1:JSON.stringify(fieldsValue.genTableColumn)
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
				...this.state.formValues,
				genTableColumn: JSON.stringify(fieldsValue.genTableColumn),
				pageSize: 10,
				current: 1,
			},
		});
		this.setState({
			khsearchVisible: false,
			historyfilter1:JSON.stringify(fieldsValue.genTableColumn)
		});
	}

	handleSearchVisiblezc = (fieldsValue) => {
		this.setState({
			searchVisiblezc: false,
			historyfilter:JSON.stringify(fieldsValue.genTableColumn) 
		});
	}

	handleSearchChangezc = () => {
		const { dispatch } = this.props
		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_SearchList',
		});
		this.setState({
			searchVisiblezc: true,
		});
	}

	handleSearchAddzc = (fieldsValue) => {
		const { dispatch } = this.props;

		this.setState({
			copyfieldsVal:JSON.stringify(fieldsValue.genTableColumn)
		})


		dispatch({
			type: 'cpAssemblyBuild/cpAssemblyBuild_List',
			payload: {
				...this.state.formValueszc,
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

	showinputcp = (e) => {
		const { selwenz, selzim } = this.state
		if (isNotBlank(e.target.value)) {
			this.setState({
				selinputcp: e.target.value
			})
		} else {
			this.setState({
				selinputcp: ''
			})
		}
	}

	showcpzim = (e) => {
		if (isNotBlank(e)) {
			this.setState({
				selzim: e
			})
		} else {
			this.setState({
				selzim: ''
			})
		}
	}

	showcpwenz = (e) => {
		const { cpzim } = this.state
		if (isNotBlank(e)) {
			this.setState({
				selwenz: e
			})
			if (e== '京' ) {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' },{ name: 'E' }, { name: 'F' }, { name: 'G' },
					{ name: 'H' },{ name: 'J' }, { name: 'K' },{name: 'L' },{ name: 'M' },{ name: 'N' },{ name: 'O' },{ name: 'P' },{ name: 'Q' },{ name: 'R' }, { name: 'Y' }]
				})
			}
			else if (  e == '藏' || e == '台') {
				this.setState({
					incpzim: cpzim.slice(0, 7)
				})
			} else if (e == '川' || e == '粤') {
				this.setState({
					incpzim: cpzim
				})
			} else if (e == '鄂' || e == '皖' || e == '云') {
				this.setState({
					incpzim: cpzim.slice(0, 17)
				})
			} else if (e == '甘'  || e == '辽') {
				this.setState({
					incpzim: cpzim.slice(0, 14)
				})
			} else if (e == '贵' || e == '吉') {
				this.setState({
					incpzim: cpzim.slice(0, 9)
				})
			} else if (e == '黑' || e == '桂'|| e == '新') {
				this.setState({
					incpzim: cpzim.slice(0, 16)
				})
			}
			else if (e == '冀') {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
									{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'R' },{ name: 'T' }
								]
				})
			} else if (e == '晋' || e == '蒙' || e == '赣') {
				this.setState({
					incpzim: cpzim.slice(0, 12)
				})
			} else if(e == '鲁'){
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
					{ name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'Y' }]
				})
			} else if (e == '陕') {
				this.setState({
					incpzim: cpzim.slice(0, 20)
				})
			} else if (e == '闽') {
				this.setState({
					incpzim: cpzim.slice(0, 10)
				})
			} else if (e == '宁' || e == '琼') {
				this.setState({
					incpzim: cpzim.slice(0, 5)
				})
			} else if (e == '青' || e == '渝') {
				this.setState({
					incpzim: cpzim.slice(0, 8)
				})
			} else if (e == '湘' || e == '豫') {
				this.setState({
					incpzim: cpzim.slice(0, 18)
				})
			}
			else if (e == '苏') {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
					{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'U' }
				]
				})
			} else if (e == '浙') {
				this.setState({
					incpzim: cpzim.slice(0, 11)
				})
			} else if (e == '港' || e == '澳') {
				this.setState({
					incpzim: cpzim.slice(0, 1)
				})
			} else if (e == '沪') {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
					{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'Q' },{ name: 'R' },{ name: 'Z' }
				]
				})
			} else if (e == '津') {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' },{name: 'I' } ,{ name: 'J' }, { name: 'K' }, { name: 'L' },
					{ name: 'M' }, { name: 'N' }, {name: 'O'  }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
					{ name: 'Y' }, { name: 'Z' }]
				})
			}
		} else {
			this.setState({
				incpzim: []
			})
		}
	}

	render() {
		const { fileList, previewVisible, previewImage, selectkhflag, selectkhdata, orderflag, selectzcflag, selectzcdata,
			sumbitflag, khsearchVisible, searchVisiblezc, updataflag, updataname, cpzim, incpzim, selwenz, selzim, selinputcp, srcimg ,copyfieldsVal} = this.state;
		const { submitting1, submitting2, submitting, cpAssemblyFormGet, cpClientList, cpAssemblyBuildList, dispatch, cpClientSearchList, cpAssemblyBuildSearchList } = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;
		const cphdata = [{ id: 1, name: '京' }, { id: 2, name: '津' }, { id: 3, name: '沪' }, { id: 4, name: '渝' }, { id: 5, name: '冀' },
		{ id: 6, name: '豫' }, { id: 7, name: '云' }, { id: 8, name: '辽' }, { id: 9, name: '黑' }, { id: 10, name: '湘' }, { id: 11, name: '皖' },
		{ id: 12, name: '鲁' }, { id: 13, name: '新' }, { id: 14, name: '苏' }, { id: 15, name: '浙' }, { id: 16, name: '赣' }, { id: 17, name: '鄂' }, { id: 18, name: '桂' },
		{ id: 19, name: '甘' }, { id: 20, name: '晋' }, { id: 21, name: '蒙' }, { id: 22, name: '陕' }, { id: 23, name: '吉' }, { id: 24, name: '闽' }, { id: 25, name: '贵' },
		{ id: 26, name: '粤' }, { id: 27, name: '青' }, { id: 28, name: '藏' }, { id: 29, name: '川' }, { id: 30, name: '宁' }, { id: 31, name: '琼' }, { id: 32, name: '港' },
		{ id: 33, name: '澳' }, { id: 33, name: '台' }]
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
		const parentMethodskh = {
			handleAddkh: this.handleAddkh,
			handleModalVisiblekh: this.handleModalVisiblekh,
			selectcustomer: this.selectcustomer,
			cpClientList,
			handleSearchChange: this.handleSearchChange,
			dispatch,
			that
		}
		const parentMethodszc = {
			handleAddzc: this.handleAddzc,
			handleModalVisiblezc: this.handleModalVisiblezc,
			selectzc: this.selectzc,
			cpAssemblyBuildList,
			dispatch,
			handleSearchChangezc: this.handleSearchChangezc,
			that,
			copyfieldsVal
		}
		const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
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
		return (
  <PageHeaderWrapper>
    <Card bordered={false} style={{ position: 'relative' }}>
      <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
						总成登记单
      </div>
      {isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.id) && <div style={{ position: 'absolute', right: '150px', top: '25px', zIndex: '1' }}>
        <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
							单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', }} alt="" />
                                                                            </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='意向单号'>
                {getFieldDecorator('intentionId', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.intentionId) ? cpAssemblyFormGet.intentionId : '',     
											rules: [
												{
													required: true,   
													message: '请输入意向单号',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单状态'>
                <Input
                  disabled
                  value={isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.orderStatus) ? (
												cpAssemblyFormGet.orderStatus === 0 || cpAssemblyFormGet.orderStatus === '0' ? '未处理' : (
													cpAssemblyFormGet.orderStatus === 1 || cpAssemblyFormGet.orderStatus === '1' ? '已处理' :
														cpAssemblyFormGet.orderStatus === 2 || cpAssemblyFormGet.orderStatus === '2' ? '关闭' : '')) : ''}
                  style={cpAssemblyFormGet.orderStatus === 0 || cpAssemblyFormGet.orderStatus === '0' ? { color: '#f50' } : (
												cpAssemblyFormGet.orderStatus === 1 || cpAssemblyFormGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
											)}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单分类'>
                {getFieldDecorator('orderType', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.orderType) ? cpAssemblyFormGet.orderType : '',    
											rules: [
												{
													required: true,
													message: '请选择订单分类',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.orderType) && this.state.orderType.length > 0 && this.state.orderType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
                {getFieldDecorator('project', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.project) ? cpAssemblyFormGet.project : '',    
											rules: [
												{
													required: true,
													message: '请选择业务项目',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务渠道'>
                {getFieldDecorator('dicth', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.dicth) ? cpAssemblyFormGet.dicth : '',    
											rules: [
												{
													required: true,
													message: '请选择业务渠道',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.business_dicth) && this.state.business_dicth.length > 0 && this.state.business_dicth.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务分类'>
                {getFieldDecorator('businessType', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.businessType) ? cpAssemblyFormGet.businessType : '',    
											rules: [
												{
													required: true,
													message: '请选择业务分类',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.business_type) && this.state.business_type.length > 0 && this.state.business_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='结算类型'>
                {getFieldDecorator('settlementType', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.settlementType) ? cpAssemblyFormGet.settlementType : '',    
											rules: [
												{
													required: true,
													message: '请选择结算类型',
												},
											],
										})(
  <Select
    allowClear
    style={{ width: '100%' }}
    
    disabled
  >
    {
													isNotBlank(this.state.settlement_type) && this.state.settlement_type.length > 0 && this.state.settlement_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="入场时间">
                {getFieldDecorator('entranceDate', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.entranceDate) ? moment(cpAssemblyFormGet.entranceDate) : null,
											rules: [
												{
													required: true,
													message: '请选择入场时间',
												},
											],
										})(
  <DatePicker
    disabled={orderflag}
    showTime={{ format: 'HH:mm' }}
    
    format="YYYY-MM-DD HH:mm"
    style={{ width: '100%' }}
  />
										)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="业务员信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务员'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.user) ? cpAssemblyFormGet.user.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='编号'>
                <Input
                  disabled
                  value={(isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.user) ? cpAssemblyFormGet.user.no : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属公司'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.user) && isNotBlank(cpAssemblyFormGet.user.office) ? cpAssemblyFormGet.user.office.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属区域'>
                <Select
                  allowClear
                  notFoundContent={null}
                  style={{ width: '100%' }}
                  value={(isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.user) && isNotBlank(cpAssemblyFormGet.user.dictArea) ? cpAssemblyFormGet.user.dictArea : '')}
                  
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
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属部门'>
                <Input
                  disabled
                  value={(isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.user) && isNotBlank(cpAssemblyFormGet.user.dept) ? cpAssemblyFormGet.user.dept.name : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="客户信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                <Input
                  style={{ width: '50%' }}
                  
                  disabled
				  value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.clientCpmpany) ? selectkhdata.clientCpmpany
					: (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client) && isNotBlank(cpAssemblyFormGet.client.clientCpmpany) ? cpAssemblyFormGet.client.clientCpmpany : '')}
                />
                <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting} disabled={orderflag}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="联系人">
                <Input
				  disabled
				  value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name
					: (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client) ? cpAssemblyFormGet.client.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户分类'>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  
                  disabled
                  value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.classify) ? selectkhdata.classify
												: (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client) ? cpAssemblyFormGet.client.classify : '')}
                >
                  {
												isNotBlank(this.state.classify) && this.state.classify.length > 0 && this.state.classify.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
                </Select>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户编号'>
                <Input
                  disabled
                  value={(isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client) ? cpAssemblyFormGet.client.code : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系地址'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.address) ? selectkhdata.address
												: (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client) ? cpAssemblyFormGet.client.address : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='移动电话'>
                <Input
                  
                  disabled
                  value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.phone) ? selectkhdata.phone
												: (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.client) ? cpAssemblyFormGet.client.phone : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="意向产品信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='进场类型'>
                {getFieldDecorator('assemblyEnterType', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyEnterType) ? cpAssemblyFormGet.assemblyEnterType : '',     
											rules: [
												{
													required: false,   
													message: '请输入进场类型',
												},
											],
										})(<Select
  allowClear
  disabled
  style={{ width: '100%' }}
										>
  {
												isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成品牌'>
                {getFieldDecorator('assemblyBrand', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyBrand) ? cpAssemblyFormGet.assemblyBrand : '',     
											rules: [
												{
													required: false,   
													message: '请输入总成品牌',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型/排量'>
                {getFieldDecorator('assemblyVehicleEmissions', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyVehicleEmissions) ? cpAssemblyFormGet.assemblyVehicleEmissions : '',     
											rules: [
												{
													required: false,   
													message: '请输入车型/排量',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                {getFieldDecorator('assemblyYear', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyYear) ? cpAssemblyFormGet.assemblyYear : '',     
											rules: [
												{
													required: false,   
													message: '请输入年份',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成型号'>
                {getFieldDecorator('assemblyModel', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyModel) ? cpAssemblyFormGet.assemblyModel : '',     
											rules: [
												{
													required: false,   
													message: '请输入总成型号',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='钢印号'>
                {getFieldDecorator('assemblySteelSeal', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblySteelSeal) ? cpAssemblyFormGet.assemblySteelSeal : '',     
											rules: [
												{
													required: false,   
													message: '请输入钢印号',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="产品信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='总成型号' className="allinputstyle">
                {getFieldDecorator('xh', {
											rules: [
												{
													required: true,   
													message: '请选择总成型号',
												},
											],
										})(
  <Input
    style={{ width: '50%' }}
    disabled
  />
										)}
                <Button style={{ marginLeft: '8px' }} disabled={orderflag} type="primary" onClick={this.onselectzc} loading={submitting}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                <Input disabled value={isNotBlank(selectzcdata) && isNotBlank(selectzcdata.assemblyYear) ? selectzcdata.assemblyYear : (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild.assemblyYear) ? cpAssemblyFormGet.cpAssemblyBuild.assemblyYear : '')} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成品牌'>
                <Input disabled  value={isNotBlank(selectzcdata) && isNotBlank(selectzcdata.assemblyBrand) ? selectzcdata.assemblyBrand : (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild.assemblyBrand) ? cpAssemblyFormGet.cpAssemblyBuild.assemblyBrand : '')} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型/排量'>
                <Input disabled  value={isNotBlank(selectzcdata) && isNotBlank(selectzcdata.vehicleModel) ? selectzcdata.vehicleModel : (isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild) && isNotBlank(cpAssemblyFormGet.cpAssemblyBuild.vehicleModel) ? cpAssemblyFormGet.cpAssemblyBuild.vehicleModel : '')} />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='VIN码'>
                {getFieldDecorator('assemblyVin', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyVin) ? cpAssemblyFormGet.assemblyVin : '',     
											rules: [
												{
													required: false
												},
											],
										})(<Input disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='其他识别信息'>
                {getFieldDecorator('assemblyMessage', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyMessage) ? cpAssemblyFormGet.assemblyMessage : '',     
											rules: [
												{
													required: false,   
													message: '请输入其他识别信息',
												},
											],
										})(<Input disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='故障代码'>
                {getFieldDecorator('assemblyFaultCode', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyFaultCode) ? cpAssemblyFormGet.assemblyFaultCode : '',     
											rules: [
												{
													required: false,   
													message: '请输入故障代码',
												},
											],
										})(<Input disabled />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='本次故障描述' className="allinputstyle">
                {getFieldDecorator('assemblyErrorDescription', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.assemblyErrorDescription) ? cpAssemblyFormGet.assemblyErrorDescription : '',     
											rules: [
												{
													required: false,   
													message: '请输入本次故障描述',
												},
											],
										})(<TextArea disabled />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="相片上传" className="allimgstyle">
                {getFieldDecorator('photo', {
											initialValue: ''
										})(
  <Upload
    disabled={orderflag}
    accept="image/*"
    onChange={this.handleUploadChange}
    onRemove={this.handleRemove}
    beforeUpload={this.handlebeforeUpload}
    fileList={fileList}
    listType="picture-card"
    onPreview={this.handlePreview}
  >
    {isNotBlank(fileList) && fileList.length >= 9 || (orderflag) ? null : uploadButton}
  </Upload>
										)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="其他信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='维修项目'>
                {getFieldDecorator('maintenanceProject', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.maintenanceProject) ? cpAssemblyFormGet.maintenanceProject : '',     
											rules: [
												{
													required: false,   
													message: '请输入维修项目',
												},
											],
										})(<Select
  allowClear
  style={{ width: '100%' }}
  disabled={orderflag}
										>
  {
												isNotBlank(this.state.maintenance_project) && this.state.maintenance_project.length > 0 && this.state.maintenance_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='行程里程'>
                {getFieldDecorator('tripMileage', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.tripMileage) ? cpAssemblyFormGet.tripMileage : '',     
											rules: [
												{
													required: true,   
													message: '请输入行程里程',
												},
											],
										})(<Input  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='车牌号' className="allinputstyle">
                <Select
                  allowClear
                  disabled={orderflag && updataflag}
                  onChange={this.showcpwenz}
                  style={{ width: '30%' }}
                  value={selwenz}
                >
                  {
												isNotBlank(cphdata) && cphdata.length > 0 && cphdata.map(d => <Option key={d.id} value={d.name}>{d.name}</Option>)
											}
                </Select>
                <Select
                  allowClear
                  disabled={orderflag && updataflag}
                  onChange={this.showcpzim}
                  style={{ width: '30%' }}
                  value={selzim}
                >
                  {
												isNotBlank(incpzim) && incpzim.length > 0 && incpzim.map(d => <Option key={d.name} value={d.name}>{d.name}</Option>)
											}
                </Select>
                <Input
            placeholder='请输入5位车牌号'      
onChange={this.showinputcp}
disabled={orderflag && updataflag}
style={{ width: '40%' }}
                  value={selinputcp}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='是否拍照'>
                {getFieldDecorator('isPhotograph', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.isPhotograph) ? cpAssemblyFormGet.isPhotograph : '4',    
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
    disabled={orderflag && updataflag}
  >
    {
													isNotBlank(this.state.is_photograph) && this.state.is_photograph.length > 0 && this.state.is_photograph.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
  </Select>
										)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='定损员'>
                {getFieldDecorator('partFee', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.partFee) ? cpAssemblyFormGet.partFee : '',     
											rules: [
												{
													required: false,   
													message: '请输入定损员',
												},
											],
										})(<Input  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='事故单号'>
                {getFieldDecorator('accidentNumber', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.accidentNumber) ? cpAssemblyFormGet.accidentNumber : '',     
											rules: [
												{
													required: false,   
													message: '请输入事故单号',
												},
											],
										})(<Input  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='发货地址' className="allinputstyle">
                {getFieldDecorator('shipAddress', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.shipAddress) ? cpAssemblyFormGet.shipAddress : '',     
											rules: [
												{
													required: true,   
													message: '请输入发货地址',
												},
											],
										})(<TextArea  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='维修历史' className="allinputstyle">
                {getFieldDecorator('maintenanceHistory', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.maintenanceHistory) ? cpAssemblyFormGet.maintenanceHistory : '',     
											rules: [
												{
													required: true,   
													message: '请输入维修历史',
												},
											],
										})(<TextArea  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='事故说明' className="allinputstyle">
                {getFieldDecorator('accidentExplain', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.accidentExplain) ? cpAssemblyFormGet.accidentExplain : '',     
											rules: [
												{
													required: false,   
													message: '请输入事故说明',
												},
											],
										})(<TextArea  disabled={orderflag && updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
											initialValue: isNotBlank(cpAssemblyFormGet) && isNotBlank(cpAssemblyFormGet.remarks) ? cpAssemblyFormGet.remarks : '',     
											rules: [
												{
													required: false,
													message: '请输入备注信息',
												},
											],
										})(
  <TextArea
    style={{ minHeight: 32 }}
    
    rows={2}
    disabled={orderflag && updataflag}
  />
										)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAssemblyForm').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAssemblyForm')[0].children.filter(item => item.name == '二次修改')
									.length > 0 &&
								<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
								</Button>
							}
          {
								isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAssemblyForm').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAssemblyForm')[0].children.filter(item => item.name == '修改')
									.length > 0 &&
								<span>
  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting} disabled={orderflag && updataflag}>
										保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
										提交
  </Button>
  {
										(cpAssemblyFormGet.orderStatus === 1 || cpAssemblyFormGet.orderStatus === '1') &&
										<Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpAssemblyFormGet.id)}>
											撤销
</Button>
									}
								</span>
							}
          <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
								返回
          </Button>
        </FormItem>
      </Form>
    </Card>
    <SearchFormzc {...parentSearchMethodszc} searchVisiblezc={searchVisiblezc} />
    <SearchForm {...parentSearchMethods} khsearchVisible={khsearchVisible} />
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
    <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
    <CreateFormzc {...parentMethodszc} selectzcflag={selectzcflag} />
  </PageHeaderWrapper>
		);
	}
}
export default CpAssemblyFormForm;
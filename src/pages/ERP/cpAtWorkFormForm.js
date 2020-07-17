import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Select,
	Button,
	Card,
	message,
	Icon,
	Upload,
	Modal,
	DatePicker,
	Row,
	Col,Cascader
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpAtWorkFormForm.less';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateForm = Form.create()(props => {
	const { handleModalVisible, userlist, selectflag, selectuser, levellist, levellist2, newdeptlist, form, dispatch ,that} = props;
	const { getFieldDecorator } = form
	const selectcolumns = [
		{
			title: '操作',
			width: 100,
			align: 'center' ,
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectuser(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '编号',
			dataIndex: 'no',
			align: 'center' ,
			width: 150,
		},
		{
			title: '姓名',
			dataIndex: 'name',
			align: 'center' ,
			width: 150,
		},
		{
			title: '性别',
			dataIndex: 'sex',
			width: 100,
			render: (text) => {
				if (isNotBlank(text)) {
					if (text === 1 || text === '1') {
						return <span>男</span>
					}
					if (text === 0 || text === '0') {
						return <span>女</span>
					}
				}
				return '';
			}
		},
		{
			title: '电话',
			dataIndex: 'phone',
			align: 'center' ,
			width: 150,
		},
		{
			title: '所属大区',
			dataIndex: 'area.name',
			align: 'center' ,
			width: 150,
		},
		{
			title: '所属分公司',
			dataIndex: 'companyName',
			align: 'center' ,
			width: 150,
		},
		{
			title: '所属部门',
			dataIndex: 'dept.name',
			align: 'center' ,
			width: 150,
		},
		{
			title: '所属区域',
			dataIndex: 'areaName',
			align: 'center' ,
			width: 150,
		},
		{
			title: '状态',
			dataIndex: 'status',
			align: 'center' ,
			width: 100,
			render: (text) => {
				if (isNotBlank(text)) {
					if (text === 0 || text === '0') {
						return <span>在职</span>
					}
					if (text === 1 || text === '1') {
						return <span>离职</span>
					}
				}
				return '';
			},
		},
	];
	const handleSearch = e => {
		e.preventDefault();
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			const values = {
				...fieldsValue,
				current: 1,
				pageSize: 10,
			};
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.no)) {
				values.no = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.name)) {
				values.name = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.office.id)) {
				values.office.id = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
				values.area.id = '';
			}
			if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
				values.dept = '';
			} else {
				values.dept = values.dept[values.dept.length - 1];
			}

			that.setState({
				wxbzsearch:values
			})

			dispatch({
				type: 'sysuser/fetch',
				payload: {
					'role.id':'5bbc759608a9442b9b3a4b0e64476881',
					...values
				},
			});
		});
	};
	const handleFormReset = () => {
		form.resetFields();
		that.setState({
			wxbzsearch:{}
		})
		dispatch({
			type: 'sysuser/fetch',
			payload: {
				current: 1,
				pageSize: 10,
				'role.id':'5bbc759608a9442b9b3a4b0e64476881'
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
			...that.state.wxbzsearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
			'role.id':'5bbc759608a9442b9b3a4b0e64476881'
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'sysuser/fetch',
			payload: params,
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
	const renderSimpleForm = () => {
		return (
  <Form onSubmit={handleSearch}>
    <Row gutter={12}>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="编号">
          {getFieldDecorator('no')(<Input  />)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('name')(<Input  />)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="性别">
          {getFieldDecorator('sex', {
								initialValue: '',
							})(
  <Select style={{ width:'100%'}}  allowClear>
    <Option value={1} key={1}>
												 男
    </Option>
    <Option value={0} key={0}>
												女
    </Option>
  </Select>
							)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="所属大区">
          {getFieldDecorator('area.id', {
								initialValue: '',
							})(
  <Select style={{ width: '100%' }}  allowClear>
    {isNotBlank(levellist) &&
										isNotBlank(levellist.list) &&
										levellist.list.length > 0 &&
										levellist.list.map(item => (
  <Option value={item.id} key={item.id}>
    {item.name}
  </Option>
										))}
  </Select>
							)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="所属分公司">
          {getFieldDecorator('office.id', {
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
      <Col md={8} sm={24}>
        <FormItem {...formItemLayout} label="所属部门">
          {getFieldDecorator('dept', {
								initialValue: '',
							})(
  <Cascader
    options={newdeptlist}
    allowClear
    fieldNames={{ label: 'name', value: 'id' }}
  />
							)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" htmlType="submit">
								查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
								重置
          </Button>
        </div>
      </Col>
    </Row>
  </Form>
		);
	};

	const handleModalVisiblein =()=>{
		// form.resetFields();
		that.setState({
			wxbzsearch:{}
		})
			handleModalVisible()
	}
	


	return (
  <Modal
    title='选择维修班组'
    visible={selectflag}
    onCancel={() => handleModalVisiblein()}
    width='80%'
		>
    <div className={styles.tableList}>
      <div className={styles.tableListForm}>{renderSimpleForm()}</div>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={userlist}
        columns={selectcolumns}
        onChange={handleStandardTableChange}
      />
    </div>
  </Modal>
	);
});
@connect(({ cpAtWorkForm, loading ,syslevel,sysdept,sysuser}) => ({
	...cpAtWorkForm,
	...syslevel,
	...sysdept,
	...sysuser,
	newdeptlist: sysdept.deptlist.list,
	submitting: loading.effects['form/submitRegularForm'],
	submitting1: loading.effects['cpAtWorkForm/cpAtWorkForm_Add'],
	submitting2: loading.effects['cpupdata/cpAtWorkForm_update'],
}))
@Form.create()
class CpAtWorkFormForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			fileList: [],
			orderflag: false,
			sumbitflag:false,
			selectyear:0,
			selectmonth:0,
			selectdata:[],
			selectflag:false,
			updataflag:true,
			typeflag:true,
			cpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
			{ name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
			{ name: 'Y' }, { name: 'Z' }],
			incpzim: [],
			updataname:'取消锁定',
			confirmflag :true,
			location: getLocation()
		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const { location ,cpzim} = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpAtWorkForm/cpAtWorkForm_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (
						res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
						||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm').length>0
						&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm')[0].children.filter(item=>item.name=='修改')
						.length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
					}
					if(isNotBlank(res.data.maintenanceCrew)&&isNotBlank(res.data.maintenanceCrew.id)){
						this.props.form.setFieldsValue({
							wxbz:isNotBlank(res.data.maintenanceCrew.name)?res.data.maintenanceCrew.name:''
					})
					}
					if(isNotBlank(res.data.orderType)&& (res.data.orderType=='370dca10-db9b-42e1-a666-10e1833930a3'||res.data.orderType=='73db0e10-a7ad-45a0-9445-74ec96821a6b')&&!(res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2')){
							this.setState({
								typeflag:false
							})
					}else{
						this.setState({
							typeflag:true
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
						}
						else if ( newselwenz == '藏' || newselwenz == '台') {
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
							} else if (newselwenz == '甘'  || newselwenz == '辽') {
								this.setState({
									incpzim: cpzim.slice(0, 14)
								})
							} else if (newselwenz == '贵' || newselwenz == '吉') {
								this.setState({
									incpzim: cpzim.slice(0, 9)
								})
							} else if (newselwenz == '黑' || newselwenz == '桂' || newselwenz == '新') {
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
									{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' }, { name: 'Q' },{ name: 'R' },{ name: 'Z' }
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
					if (isNotBlank(res.data) && isNotBlank(res.data.photo2)) {
						let photoUrl = res.data.photo2.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList1: res.data.photo2.split('|'),
							fileList1: photoUrl
						})
					}
					if(isNotBlank(res.data.qualityTime)){
						this.setState({
							selectyear:res.data.qualityTime.split(',')[0],
							selectmonth:res.data.qualityTime.split(',')[1]
						})
					}
					dispatch({
						type: 'sysarea/getFlatCode',
						payload:{
						id:location.query.id,
						type:'0'
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
							type:'ATSGD'
						},
						callback:(imgres)=>{
							this.setState({
							srcimg1:imgres
							})
						}
					})
				}
			});
    }
    

    dispatch({
			type: 'sysuser/fetch',
			payload: {
				current: 1,
				pageSize: 10,
				'role.id':'5bbc759608a9442b9b3a4b0e64476881'
			}
		});
		dispatch({
			type: 'syslevel/fetch',
			payload: {
				type: 1,
			},
		});
		dispatch({
			type: 'syslevel/fetch2',
			payload: {
        type: 2,
        pageSize:100
			},
		});
		dispatch({
			type: 'syslevel/query_office',
		});
		dispatch({
			type: 'sysdept/query_dept'
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
				const interior_type = []
				const logisticsNeed = []
					data.forEach((item)=>{
						if (item.type == 'wy') {
							logisticsNeed.push(item)
						}
						if(item.type == 'interiorType'){
							interior_type.push(item)
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
					})
					this.setState({
						insuranceCompany,
						brand,approachType,collectCustomer,
						orderType,business_project,business_dicth
						,business_type,settlement_type,payment_methodd,old_need,
						make_need,quality_need,oils_need,guise_need,installation_guide
						,maintenance_project,is_photograph,del_flag,classify,client_level,
						area,interior_type ,logisticsNeed
					})
			}
		  })
	}

	componentWillUpdate() {
		console.log('componentWillUpdate')
	}

	componentDidUpdate() {
		console.log('componentDidUpdate')
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpAtWorkForm/clear',
		});
	}

	handleSubmit = e => {
		const { dispatch, form ,cpAtWorkFormGet} = this.props;
		const { addfileList, location ,selectyear,selectmonth ,selectdata,addfileList1 ,updataflag ,selwenz, selzim, selinputcp} = this.state;
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
				if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
					value.photo2 = addfileList1.join('|')
				} else {
					value.photo2 = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
				value.maintenanceCrew ={}
				value.maintenanceCrew.id = isNotBlank(selectdata)&&isNotBlank(selectdata.id)?selectdata.id
				:(isNotBlank(cpAtWorkFormGet)&&isNotBlank(cpAtWorkFormGet.maintenanceCrew)&&isNotBlank(cpAtWorkFormGet.maintenanceCrew.id)?cpAtWorkFormGet.maintenanceCrew.id:'')
				value.qualityTime =`${selectyear} , ${selectmonth}`
				value.orderStatus = 1
				value.plateNumber =  (isNotBlank(selwenz)?selwenz:'')+(isNotBlank(selzim)?selzim:'')+(isNotBlank(selinputcp)?selinputcp:'')
				if(updataflag){
				dispatch({
					type: 'cpAtWorkForm/cpAtWorkForm_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/business/process/cp_at_work_form_Form?id=${location.query.id}`);
						// router.push('/business/process/cp_at_work_form_list');
					}
				})
			}else{
				dispatch({
					type: 'cpupdata/cpAtWorkForm_update',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push(`/business/process/cp_at_work_form_Form?id=${location.query.id}`);
						// router.push('/business/process/cp_at_work_form_list');
					}
				})
			}
			}
		});
	};

	onupdata = ()=>{
		const {location ,updataflag } = this.state
		if(updataflag){
				this.setState({
			updataflag:false,
			updataname:'锁定'
			})
		}else{
			router.push(`/business/process/cp_at_work_form_Form?id=${location.query.id}`);
		}
	}

	onsave = () => {
		const { dispatch, form ,cpAtWorkFormGet} = this.props;
		const { addfileList, location ,selectyear,selectmonth ,selectdata,addfileList1,updataflag,selwenz, selzim, selinputcp} = this.state;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}
				if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
					value.photo2 = addfileList1.join('|')
				} else {
					value.photo2 = '';
				}
				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.plateNumber =  (isNotBlank(selwenz)?selwenz:'')+(isNotBlank(selzim)?selzim:'')+(isNotBlank(selinputcp)?selinputcp:'')
				value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
				value.maintenanceCrew ={}
				value.maintenanceCrew.id = isNotBlank(selectdata)&&isNotBlank(selectdata.id)?selectdata.id
				:(isNotBlank(cpAtWorkFormGet)&&isNotBlank(cpAtWorkFormGet.maintenanceCrew)&&isNotBlank(cpAtWorkFormGet.maintenanceCrew.id)?cpAtWorkFormGet.maintenanceCrew.id:'')
				value.qualityTime =`${selectyear} , ${selectmonth}`
				if(updataflag){
					value.orderStatus = 0
					dispatch({
					type: 'cpAtWorkForm/cpAtWorkForm_Add',
					payload: { ...value },
					callback: () => {
					}
				})
				}else{
					value.orderStatus = 1
					dispatch({
						type: 'cpupdata/cpAtWorkForm_update',
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
	};

	onCancelCancel = () => {
		router.push('/business/process/cp_at_work_form_list');
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
		const {dispatch} = this.props
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
					name: 'cpCarloadConstructionFormForm'
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
		 let isimg =false
		 let isLt10M = false
		if(isNotBlank(info.file)&&isNotBlank(info.file.type)&&isNotBlank(info.file.size)){
		 isimg = info.file.type.indexOf('image') >= 0;
		 isLt10M = info.file.size / 1024 / 1024 <= 10;
		}
		if (info.file.status === 'done') {
			if (isLt10M && isimg) {
				this.setState({ fileList: info.fileList });
			}
		} else {
			this.setState({ fileList: info.fileList });
		}
	};

	onUndo = (record) => { 
		Modal.confirm({
			title: '撤销该总成施工单',
			content: '确定撤销该总成施工单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.undoClick(record),
		});
	}

	undoClick = (id) => {
		const { dispatch } = this.props
		const {confirmflag ,location}= this.state
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
			type: 'cpAtWorkForm/cpAtWorkForm_Revocation',
			payload: {
				id
			},
			callback: () => {
				router.push(`/business/process/cp_at_work_form_Form?id=${location.query.id}`);
				// router.push('/business/process/cp_at_work_form_list');
			}
		})
	}
	}

	onselect = () => {
    this.setState({
      selectflag: true
    })
	}

	selectuser = (record) => {
		this.props.form.setFieldsValue({
			wxbz:record.name
		})
		this.setState({
			selectdata: record,
			selectflag: false
		})
	}

	handleModalVisible = flag => {
		this.setState({
			selectflag: !!flag
		});
	};

	handleCancel1 = () => this.setState({ previewVisible1: false });

	handlePreview1 = file => {
		this.setState({
			previewImage1: file.url || file.thumbUrl,
			previewVisible1: true,
		});
	};

	handleImage1 = url => {
		this.setState({
			previewImage1: url,
			previewVisible1: true,
		});
	};

	handleRemove1 = file => {
		this.setState(({ fileList1, addfileList1 }) => {
			const index = fileList1.indexOf(file);
			const newFileList = fileList1.slice();
			newFileList.splice(index, 1);
			const newaddfileList = addfileList1.slice();
			newaddfileList.splice(index, 1);
			return {
				fileList1: newFileList,
				addfileList1: newaddfileList,
			};
		});
	};

	handlebeforeUpload1 = file => {
		const { addfileList1 } = this.state;
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
					name: 'cpCarloadConstructionFormForm'
				},
				callback: (res) => {
					if (!isNotBlank(addfileList1) || addfileList1.length <= 0) {
						this.setState({
							addfileList1: [res],
						});
					} else {
						this.setState({
							addfileList1: [...addfileList1, res],
						});
					}
				}
			})
		}
		return isLt10M && isimg;
	};

	handleUploadChange1 = info => {
		let isimg =false
		let isLt10M = false
	   if(isNotBlank(info.file)&&isNotBlank(info.file.type)&&isNotBlank(info.file.size)){
		isimg = info.file.type.indexOf('image') >= 0;
		isLt10M = info.file.size / 1024 / 1024 <= 10;
	   }
		if (info.file.status === 'done') {
			if (isLt10M && isimg) {
				this.setState({ fileList1: info.fileList });
			}
		} else {
			this.setState({ fileList1: info.fileList });
		}
	};

	goprint = () => {
		const { location } = this.state	
		const w = window.open('about:blank')
		w.location.href = `/#/Task_At_Construction?id=${location.query.id}`
	}

	changeimg = ()=>{
		const {dispatch} = this.props
		const {location} = this.state
		dispatch({
			type: 'sysarea/getFlatCode',
			payload:{
			id:location.query.id,
			type:'0'
			},
			callback:(imgres)=>{
			this.setState({
			srcimg:imgres
			})
			}
			})
	}

	changeimg1 = ()=>{
		const {dispatch} = this.props
		const {location} = this.state
		dispatch({
			type: 'sysarea/getFlatCode',
			payload:{
			id:location.query.id,
			type:'ZCDBJ'
			},
			callback:(imgres)=>{
			this.setState({
			srcimg:imgres
			})
			}
			})
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
			if (e == '京' ) {
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
			} else if (e == '黑' || e == '桂' || e == '新') {
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
		const { fileList, previewVisible, previewImage,fileList1, previewVisible1, previewImage1, incpzim,selzim,selwenz,selinputcp,
			orderflag ,updataflag,sumbitflag ,selectdata,selectflag ,updataname,srcimg1,srcimg,typeflag} = this.state;
		const {submitting1,submitting2, submitting, cpAtWorkFormGet ,userlist,
			levellist, levellist2, newdeptlist, dispatch} = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;
		const cphdata = [{ id: 1, name: '京' }, { id: 2, name: '津' }, { id: 3, name: '沪' }, { id: 4, name: '渝' }, { id: 5, name: '冀' },
		{ id: 6, name: '豫' }, { id: 7, name: '云' }, { id: 8, name: '辽' }, { id: 9, name: '黑' }, { id: 10, name: '湘' }, { id: 11, name: '皖' },
		{ id: 12, name: '鲁' }, { id: 13, name: '新' }, { id: 14, name: '苏' }, { id: 15, name: '浙' }, { id: 16, name: '赣' }, { id: 17, name: '鄂' }, { id: 18, name: '桂' },
		{ id: 19, name: '甘' }, { id: 20, name: '晋' }, { id: 21, name: '蒙' }, { id: 22, name: '陕' }, { id: 23, name: '吉' }, { id: 24, name: '闽' }, { id: 25, name: '贵' },
		{ id: 26, name: '粤' }, { id: 27, name: '青' }, { id: 28, name: '藏' }, { id: 29, name: '川' }, { id: 30, name: '宁' }, { id: 31, name: '琼' }, { id: 32, name: '港' },
		{ id: 33, name: '澳' }, { id: 33, name: '台' }]
	
		const that = this

		const parentMethods = {
			handleAdd: this.handleAdd,
			handleModalVisible: this.handleModalVisible,
			selectuser: this.selectuser,
			handleSearch: this.handleSearch,
			handleFormReset: this.handleFormReset,
			userlist,
			levellist, levellist2, newdeptlist, dispatch,
			that
		}
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
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>		
      <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
总成施工单
      </div>
      {isNotBlank(cpAtWorkFormGet)&&isNotBlank(cpAtWorkFormGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
        </span><img src={isNotBlank(srcimg)&&isNotBlank(srcimg.msg)?getFullUrl(`/${srcimg.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                    </div>}
      {isNotBlank(cpAtWorkFormGet)&&isNotBlank(cpAtWorkFormGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
        </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                           </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" bordered={false}>
          <Row gutter={16}>
		  <Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='单号'>
										<Input   disabled value={isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.id) ? cpAtWorkFormGet.id : ''} />
									</FormItem>
								</Col>
			  {!(isNotBlank(cpAtWorkFormGet)&& isNotBlank(cpAtWorkFormGet.intentionId)&&cpAtWorkFormGet.intentionId=='0000')&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='意向单号'>
                {getFieldDecorator('intentionId', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.intentionId) ? cpAtWorkFormGet.intentionId : '',     
										rules: [
											{
												required: false,   
												message: '请意向单号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
	}
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单状态'>
                <Input
                  
disabled 
                  value={isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.orderStatus) ? (
								cpAtWorkFormGet.orderStatus === 0 || cpAtWorkFormGet.orderStatus === '0' ? '未处理' :(
								cpAtWorkFormGet.orderStatus === 1 || cpAtWorkFormGet.orderStatus === '1' ? '已处理': 
								cpAtWorkFormGet.orderStatus === 2 || cpAtWorkFormGet.orderStatus === '2' ? '关闭': '')):''}
                  style={cpAtWorkFormGet.orderStatus === 0 || cpAtWorkFormGet.orderStatus === '0' ? { color: '#f50' } :(
															cpAtWorkFormGet.orderStatus === 1 || cpAtWorkFormGet.orderStatus === '1' ? { color: '#87d068' }:{color:'rgb(166, 156, 156)'}               
															)}
                />
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                {getFieldDecorator('orderCode', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.orderCode) ? cpAtWorkFormGet.orderCode : '',     
										rules: [
											{
												required: false,   
												message: '请输入订单编号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            { isNotBlank(cpAtWorkFormGet.orderType)&&(cpAtWorkFormGet.orderType!='370dca10-db9b-42e1-a666-10e1833930a3'&&cpAtWorkFormGet.orderType!='73db0e10-a7ad-45a0-9445-74ec96821a6b')&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单分类'>
                {getFieldDecorator('orderType', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.orderType) ? cpAtWorkFormGet.orderType : '',    
										rules: [
											{
												required: false,
												message: '请选择订单分类',
											},
										],
									})(
  <Select
    style={{ width: '100%' }}
    
    disabled
  >
    {
												isNotBlank(cpAtWorkFormGet.type)&&cpAtWorkFormGet.type==4?isNotBlank(this.state.interior_type) && this.state.interior_type.length > 0 && this.state.interior_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>):isNotBlank(this.state.orderType) && this.state.orderType.length > 0 && this.state.orderType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
							}
            { isNotBlank(cpAtWorkFormGet.orderType)&&(cpAtWorkFormGet.orderType=='370dca10-db9b-42e1-a666-10e1833930a3'||cpAtWorkFormGet.orderType=='73db0e10-a7ad-45a0-9445-74ec96821a6b')&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='订单分类'>
                <Input
                  disabled
                  value='再制造'
                />			
              </FormItem>
            </Col>
							}
            { isNotBlank(cpAtWorkFormGet.orderType)&&cpAtWorkFormGet.orderType!='370dca10-db9b-42e1-a666-10e1833930a3'&&cpAtWorkFormGet.orderType!='73db0e10-a7ad-45a0-9445-74ec96821a6b'&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
                {getFieldDecorator('project', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.project) ? cpAtWorkFormGet.project : '',    
										rules: [
											{
												required: false,
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
								}
            { isNotBlank(cpAtWorkFormGet.orderType)&&(cpAtWorkFormGet.orderType=='370dca10-db9b-42e1-a666-10e1833930a3'||cpAtWorkFormGet.orderType=='73db0e10-a7ad-45a0-9445-74ec96821a6b')&&
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务项目'>
                <Input
                  disabled
                  value='总成翻新'
                />			
              </FormItem>
            </Col>
							}
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务渠道'>
                {getFieldDecorator('dicth', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.dicth) ? cpAtWorkFormGet.dicth : '',    
										rules: [
											{
												required: false,
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
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.businessType) ? cpAtWorkFormGet.businessType : '',    
										rules: [
											{
												required: false,
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
              <FormItem {...formItemLayout} label='品牌'>
                {getFieldDecorator('brand', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.brand) ? cpAtWorkFormGet.brand : '',     
										rules: [
											{
												required: false,   
												message: '请输入品牌',
											},
										],
									})(<Select
  style={{ width: '100%' }}
  disabled
  allowClear
									>
  {
										isNotBlank(this.state.brand) && this.state.brand.length > 0 && this.state.brand.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
										}
</Select>)}
              </FormItem>
            </Col>

			<Col lg={12} md={12} sm={24}>
  <FormItem {...formItemLayout} label='保险公司'>
  <Select
	showSearch
	optionFilterProp='children'
	value={isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.insuranceCompanyId) ? cpAtWorkFormGet.insuranceCompanyId : ''}
	filterOption={(input, option) =>
		option.props.children.indexOf(input) >= 0
	  }
    style={{ width: '100%' }}
    disabled
    allowClear
  >
    {
														isNotBlank(this.state.insuranceCompany) && this.state.insuranceCompany.length > 0 && this.state.insuranceCompany.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
													}
  </Select>
  </FormItem>
									</Col>

			{/* <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='保险公司'>
				<Input 
                  disabled
                  allowClear
                  value={isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.insuranceCompanyId) ? cpAtWorkFormGet.insuranceCompanyId : ''}/>
              </FormItem>
            </Col> */}
          </Row>
        </Card>
        <Card title="业务员信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='业务员'>
                <Input
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) ? cpAtWorkFormGet.user.name :'')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='编号'>
                <Input
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) ? cpAtWorkFormGet.user.no : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系方式'>
                <Input
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) ? cpAtWorkFormGet.user.phone :'')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属公司'>
                <Input
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) && isNotBlank(cpAtWorkFormGet.user.office) ? cpAtWorkFormGet.user.office.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属区域'>
                <Select
                  allowClear
                  notFoundContent={null}
                  style={{ width: '100%' }}
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) && isNotBlank(cpAtWorkFormGet.user.dictArea) ? cpAtWorkFormGet.user.dictArea : '')}
                  
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
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) && isNotBlank(cpAtWorkFormGet.user.dept)? cpAtWorkFormGet.user.dept.name : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
        {typeflag&&
        <Card title="客户信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client) && isNotBlank(cpAtWorkFormGet.client.clientCpmpany) ? cpAtWorkFormGet.client.clientCpmpany : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户分类'>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client) ? cpAtWorkFormGet.client.classify : '')}
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
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client) ? cpAtWorkFormGet.client.code : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系人'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client) ? cpAtWorkFormGet.client.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系地址'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client) ? cpAtWorkFormGet.client.address : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='移动电话'>
                <Input
                  
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client) ? cpAtWorkFormGet.client.phone : '')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
					}
        {!typeflag&&
        <Card title="客户信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='客户'>
                <Input
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) ? cpAtWorkFormGet.user.name :'')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='所属公司'>
                <Input
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) && isNotBlank(cpAtWorkFormGet.user.office) ? cpAtWorkFormGet.user.office.name : '')}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='联系方式'>
                <Input
                  disabled
                  value={(isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user) ? cpAtWorkFormGet.user.phone :'')}
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
					}
        <Card title="总成信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='进场类型'>
                {getFieldDecorator('assemblyEnterType', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyEnterType) ? cpAtWorkFormGet.assemblyEnterType : '',     
										rules: [
											{
												required: false,   
												message: '请输入进场类型',
											},
										],
									})(
  <Select
    allowClear
    disabled
    value={isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyEnterType) ? cpAtWorkFormGet.assemblyEnterType : ''}
    style={{ width: '100%' }}
  >
    {
											isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
										}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='品牌'>
                {getFieldDecorator('assemblyBrand', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild)  && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.assemblyBrand) ? cpAtWorkFormGet.cpAssemblyBuild.assemblyBrand : '',     
										rules: [
											{
												required: false,   
												message: '请输入品牌',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='车型/排量'>
                {getFieldDecorator('assemblyVehicleEmissions', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild)  && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.vehicleModel)  ? cpAtWorkFormGet.cpAssemblyBuild.vehicleModel : '',     
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
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild)  && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.assemblyYear) ? cpAtWorkFormGet.cpAssemblyBuild.assemblyYear : '',     
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
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild)  && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.assemblyModel) ? cpAtWorkFormGet.cpAssemblyBuild.assemblyModel : '',     
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
              <FormItem {...formItemLayout} label='总成号'>
                {getFieldDecorator('assemblyCode', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild)  && isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.assemblyCode) ? cpAtWorkFormGet.cpAssemblyBuild.assemblyCode : '',     
										rules: [
											{
												required: false,   
												message: '请输入总成号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='钢印号'>
                {getFieldDecorator('assemblySteelSeal', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblySteelSeal) ? cpAtWorkFormGet.assemblySteelSeal : '',     
										rules: [
											{
												required: false,   
												message: '请输入钢印号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='VIN码'>
                {getFieldDecorator('assemblyVin', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyVin) ? cpAtWorkFormGet.assemblyVin : '',     
										rules: [
											{
												required: false,   
												message: '请输入VIN码',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='其他识别信息'>
                {getFieldDecorator('assemblyMessage', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyMessage) ? cpAtWorkFormGet.assemblyMessage : '',     
										rules: [
											{
												required: false,   
												message: '请输入其他识别信息',
											},
										],
									})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='故障代码'>
                {getFieldDecorator('assemblyFaultCode', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyFaultCode) ? cpAtWorkFormGet.assemblyFaultCode : '',     
										rules: [
											{
												required: false,   
												message: '请输入故障代码',
											},
										],
									})(<Input  disabled={updataflag}  />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='本次故障描述' className="allinputstyle">
                {getFieldDecorator('assemblyErrorDescription', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyErrorDescription) ? cpAtWorkFormGet.assemblyErrorDescription : '',     
										rules: [
											{
												required: false,   
												message: '请输入本次故障描述',
											},
										],
									})(<TextArea  disabled={updataflag} />)}
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
    {isNotBlank(fileList) && fileList.length >= 9||(orderflag) ? null : uploadButton}
  </Upload>
									)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="一级信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="交货时间">
                {getFieldDecorator('deliveryDate', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.deliveryDate) ? moment(cpAtWorkFormGet.deliveryDate) : null,
										rules: [
											{
												required:  !typeflag,
												message: '请选择交货时间',
											}
										]
									})(
  <DatePicker
    disabled={updataflag&&typeflag} 
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
									)}
              </FormItem>
            </Col><Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='质保时间'>
                <Select
                  allowClear
                  style={{ width: '50%' }}
                  disabled
                  value={`${this.state.selectyear} 年`}
                />
                <Select
                  allowClear
                  style={{ width: '50%' }}
                  disabled
                  value={`${this.state.selectmonth} 月`}
                />
              </FormItem>
                  </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='旧件需求'>
                {getFieldDecorator('oldNeed', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.oldNeed) ? cpAtWorkFormGet.oldNeed : '',    
										rules: [
											{
												required: false,
												message: '请选择旧件需求',
											},
										],
									})(
  <Select
    disabled={updataflag&&typeflag}
    allowClear
    style={{ width: '100%' }}
  >
    {
												isNotBlank(this.state.old_need) && this.state.old_need.length > 0 && this.state.old_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='质量要求'>
                {getFieldDecorator('qualityNeed', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.qualityNeed) ? cpAtWorkFormGet.qualityNeed : '',    
										rules: [
											{
												required: !typeflag,
												message: '请选择质量要求',
											},
										],
									})(
  <Select
    disabled={updataflag&&typeflag}
    allowClear
    style={{ width: '100%' }}
  >
    {
												isNotBlank(this.state.quality_need) && this.state.quality_need.length > 0 && this.state.quality_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='油品要求'>
                {getFieldDecorator('oilsNeed', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.oilsNeed) ? cpAtWorkFormGet.oilsNeed : '',    
										rules: [
											{
												required: false,
												message: '请选择油品要求',
											},
										],
									})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag&&typeflag}
  >
    {
												isNotBlank(this.state.oils_need) && this.state.oils_need.length > 0 && this.state.oils_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='外观要求'>
                {getFieldDecorator('guiseNeed', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.guiseNeed) ? cpAtWorkFormGet.guiseNeed : '',    
										rules: [
											{
												required: !typeflag,
												message: '请选择外观要求',
											},
										],
									})(
  <Select
    disabled={updataflag&&typeflag}
    allowClear
    style={{ width: '100%' }}
  >
    {
												isNotBlank(this.state.guise_need) && this.state.guise_need.length > 0 && this.state.guise_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='安装指导'>
                {getFieldDecorator('installationGuide', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.installationGuide) ? cpAtWorkFormGet.installationGuide : '',    
										rules: [
											{
												required: false,
												message: '请选择安装指导',
											},
										],
									})(
  <Select
    allowClear
    style={{ width: '100%' }}
    disabled={updataflag&&typeflag}
  >
    {
												isNotBlank(this.state.installation_guide) && this.state.installation_guide.length > 0 && this.state.installation_guide.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='物流要求'>
                {getFieldDecorator('logisticsNeed', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.logisticsNeed) ? cpAtWorkFormGet.logisticsNeed : '',     
										rules: [
											{
												required: false,   
												message: '请输入物流要求',
											},
										],
									})(<Select
  allowClear
  style={{ width: '100%' }}
  disabled={updataflag&&typeflag}
									>
  {
											isNotBlank(this.state.logisticsNeed) && this.state.logisticsNeed.length > 0 && this.state.logisticsNeed.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
										}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='其他约定事项' className="allinputstyle">
                {getFieldDecorator('otherBuiness', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.otherBuiness) ? cpAtWorkFormGet.otherBuiness : '',     
										rules: [
											{
												required: false,   
												message: '请输入其他约定事项',
											},
										],
									})(<TextArea disabled={orderflag&&updataflag&&typeflag}  />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="其他信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='维修项目'>
                {getFieldDecorator('maintenanceProject', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.maintenanceProject) ? cpAtWorkFormGet.maintenanceProject : '',    
										rules: [
											{
												required: false,
												message: '请选择维修项目',
											},
										],
									})(
  <Select
    disabled={updataflag&&typeflag}
    allowClear
    style={{ width: '100%' }}
  >
    {
												isNotBlank(this.state.maintenance_project) && this.state.maintenance_project.length > 0 && this.state.maintenance_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='行程里程'>
                {getFieldDecorator('tripMileage', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.tripMileage) ? cpAtWorkFormGet.tripMileage : '',     
										rules: [
											{
												required: false,   
												message: '请输入行程里程',
											},
										],
									})(<Input disabled={updataflag&&typeflag}  />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='车牌号' className="allinputstyle">
                <Select
                  allowClear
                  disabled={typeflag && updataflag}
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
                  disabled={typeflag && updataflag}
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
disabled={typeflag && updataflag}
style={{ width: '40%' }}
                  value={selinputcp}
                />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='是否拍照'>
                {getFieldDecorator('isPhotograph', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.isPhotograph) ? cpAtWorkFormGet.isPhotograph : '4',    
										rules: [
											{
												required: false,
												message: '请选择是否拍照',
											},
										],
									})(
  <Select
    disabled={updataflag&&typeflag}
    allowClear
    style={{ width: '100%' }}
  >
    {
												isNotBlank(this.state.is_photograph) && this.state.is_photograph.length > 0 && this.state.is_photograph.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
  </Select>
									)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='发货地址' className="allinputstyle">
                {getFieldDecorator('shipAddress', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.shipAddress) ? cpAtWorkFormGet.shipAddress : '',     
										rules: [
											{
												required: false,   
												message: '请输入发货地址',
											},
										],
									})(<TextArea disabled={orderflag&&updataflag}   />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label='维修历史' className="allinputstyle">
                {getFieldDecorator('maintenanceHistory', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.maintenanceHistory) ? cpAtWorkFormGet.maintenanceHistory : '',     
										rules: [
											{
												required: false,   
												message: '请输入维修历史',
											},
										],
									})(<TextArea disabled={orderflag&&updataflag}  />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="其他信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='整车检测结果'>
                {getFieldDecorator('carloadTestingResult', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.carloadTestingResult) ? cpAtWorkFormGet.carloadTestingResult : '',     
										rules: [
											{
												required: false,   
												message: '请输入整车检测结果',
											},
										],
									})(<Input disabled={orderflag&&updataflag}  />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='整车故障编码'>
                {getFieldDecorator('carloadFaultCode', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.carloadFaultCode) ? cpAtWorkFormGet.carloadFaultCode : '',     
										rules: [
											{
												required: false,   
												message: '请输入整车故障编码',
											},
										],
									})(<Input  disabled={orderflag&&updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='检测人'>
                {getFieldDecorator('testingUser', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.testingUser) ? cpAtWorkFormGet.testingUser : '',     
										rules: [
											{
												required: false,   
												message: '请输入检测人',
											},
										],
									})(<Input  disabled={orderflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='维修班组'>
                {getFieldDecorator('wxbz', {
										initialValue:'',     
										rules: [
											{
												required: true,   
												message: '请选择维修班组',
											},
										],
									})(
  <Input
    style={{ width: '50%' }}
    disabled
    value={isNotBlank(selectdata) && isNotBlank(selectdata.name) ?
											selectdata.name : (isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.maintenanceCrew) ? cpAtWorkFormGet.maintenanceCrew.name : '')}
  />
									)}
                <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselect} loading={submitting} disabled={orderflag}>选择</Button>
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="相片上传" className="allimgstyle">
                {getFieldDecorator('photo2', {
										initialValue: ''
									})(
  <Upload
    accept="image/*"
    onChange={this.handleUploadChange1}
    onRemove={this.handleRemove1}
    beforeUpload={this.handlebeforeUpload1}
    fileList={fileList1}
    listType="picture-card"
    onPreview={this.handlePreview1}
  >
    {isNotBlank(fileList1) && fileList1.length >= 9 ? null : uploadButton}
  </Upload>
									)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
										initialValue: isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.remarks) ? cpAtWorkFormGet.remarks : '',     
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
    disabled={orderflag&&updataflag}
  />
									)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
							打印
          </Button>				
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm')[0].children.filter(item=>item.name=='二次修改')
.length>0&&
					<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
  {updataname}
</Button>
						}
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpAtWorkForm')[0].children.filter(item=>item.name=='修改')
.length>0&&
						<span>
  <Button type="primary" loading={submitting2||submitting1} style={{ marginLeft: 8 , marginRight:8}} onClick={() => this.onsave()} disabled={orderflag&&updataflag}>
							保存
  </Button>
  <Button type="primary" htmlType="submit" loading={submitting2||submitting1} disabled={orderflag&&updataflag}>
							提交
  </Button>
  {
							orderflag &&
							<Button loading={submitting2||submitting1} style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpAtWorkFormGet.id)}>
								撤销
							</Button>
						}
						</span>
	}
          <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
							取消
          </Button>
        </FormItem>
      </Form>
    </Card>
    <CreateForm {...parentMethods} selectflag={selectflag} />
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
    <Modal visible={previewVisible1} footer={null} onCancel={this.handleCancel1}>
      <img alt="example" style={{ width: '100%' }} src={previewImage1} />
    </Modal>
  </PageHeaderWrapper>
		);
	}
}
export default CpAtWorkFormForm;														

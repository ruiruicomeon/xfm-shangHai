import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
	Button, Input, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, message, Modal, Tag
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, deepClone, getPrice } from '@/utils/utils';
import { parse, stringify } from 'qs';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import styles from './ReleaseOrderList.less';
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
			releaseOrderSearchList,
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
					})(<SearchTableList searchList={releaseOrderSearchList} />)}
				</div>
			</Modal>
		);
	}
}
@connect(({ releaseOrder, loading }) => ({
	...releaseOrder,
	loading: loading.models.releaseOrder,
}))
@Form.create()
class ReleaseOrderList extends PureComponent {

	state = {
		expandForm: false,
		selectedRows: [],
		formValues: {},
		array: [],
		searchVisible: false
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'releaseOrder/releaseOrder_List',
			payload: {
				pageSize: 10,
			}
		});

		dispatch({
			type: 'releaseOrder/releaseOrder_SearchList',
		});
	}

	gotoUpdateForm = (id) => {
		router.push(`/business/process/release_order_form?id=${id}`);
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
			genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
		};
		dispatch({
			type: 'releaseOrder/releaseOrder_List',
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
			type: 'releaseOrder/releaseOrder_List',
			payload: {
				genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
				type: 'releaseOrder/releaseOrder_Delete',
				payload: {
					id: ids
				},
				callback: () => {
					this.setState({
						selectedRows: []
					})
					dispatch({
						type: 'releaseOrder/releaseOrder_List',
						payload: {
							genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
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
			});
			dispatch({
				type: 'releaseOrder/releaseOrder_List',
				payload: {
					...values,
					genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
					pageSize: 10,
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
				type: 'releaseOrder/releaseOrder_Update',
				payload: {
					id: key,
					...value
				},
				callback: () => {
					dispatch({
						type: 'releaseOrder/releaseOrder_List',
						payload: {
							genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
							pageSize: 10,
							...formValues,
						}
					});
				}
			});
		}
	}

	handleFieldChange = (value) => {
		this.setState({
			array: value || []
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
			type: 'releaseOrder/releaseOrder_List',
			payload: {
				...this.state.formValues,
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
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="单号">
							{getFieldDecorator('id', {
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
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="整车完成时间">
							{getFieldDecorator('zhcCompletedDate', {
								initialValue: ''
							})(
								<DatePicker style={{ width: '100%' }} />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="总车完成时间">
							{getFieldDecorator('zocCompletedDate', {
								initialValue: ''
							})(
								<DatePicker style={{ width: '100%' }} />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="配件完成时间">
							{getFieldDecorator('pjCompletedDate', {
								initialValue: ''
							})(
								<DatePicker style={{ width: '100%' }} />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="结算完成时间">
							{getFieldDecorator('jsCompletedDate', {
								initialValue: ''
							})(
								<DatePicker style={{ width: '100%' }} />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="进场类型">
							{getFieldDecorator('assemblyEnterType', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="品牌">
							{getFieldDecorator('assemblyBrand', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="车型/排量">
							{getFieldDecorator('assemblyVehicleEmissions', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="年份">
							{getFieldDecorator('assemblyYear', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="总成型号">
							{getFieldDecorator('assemblyModel', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="钢印号">
							{getFieldDecorator('assemblySteelSeal', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="VIN码">
							{getFieldDecorator('assemblyVin', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="其他识别信息">
							{getFieldDecorator('assemblyMessage', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="故障代码">
							{getFieldDecorator('assemblyFaultCode', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="本次故障描述">
							{getFieldDecorator('assemblyErrorDescription', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="制造编码">
							{getFieldDecorator('makeCode', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="物流要求">
							{getFieldDecorator('logistics', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="物流单号">
							{getFieldDecorator('logisticsCode', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="物流公司">
							{getFieldDecorator('logisticsOffice', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="发货人">
							{getFieldDecorator('shipper', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="发货地址">
							{getFieldDecorator('shipAddress', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="运费">
							{getFieldDecorator('freight', {
								initialValue: ''
							})(
								<Input />

							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="件数">
							{getFieldDecorator('number', {
								initialValue: ''
							})(
								<Input />

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


	handleUpldExportClick = type => {
		const { formValues } = this.state;
		const params = {
			genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
			...formValues,
			'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : ''
		}
		window.open(`/api/Beauty/beauty/cpDischargedForm/export?${stringify(params)}`);
	};

	renderForm() {
		const { expandForm } = this.state;
		return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
	}

	render() {
		const { array, searchVisible } = this.state;
		const { loading, releaseOrderList, releaseOrderSearchList } = this.props;
		const parentSearchMethods = {
			handleSearchVisible: this.handleSearchVisible,
			handleSearchAdd: this.handleSearchAdd,
			releaseOrderSearchList,
		}

		const shstatus = (apps) => {
			if (apps === '0' || apps === 0) {
				return '待审核'
			}
			if (apps === '1' || apps === 1 || apps === '2' || apps === 2) {
				return '已审核'
			}
		}

		const formtype = (apps) => {
			if (apps === 1 || apps === '1') {
				return '整车维修订单'
			}
			if (apps === 2 || apps === '2') {
				return '总成维修订单'
			}
			if (apps === 3 || apps === '3') {
				return '配件销售订单'
			}
			if (apps === 5 || apps === '5' || apps === 8 || apps === '8') {
				return '总成销售'
			}
			if (apps === 6 || apps === '6' || apps === 4 || apps === '4') {
				return '内部订单'
			}
			if (apps === 7 || apps === '7') {
				return '售后订单'
			}
		}
		const field = [
			// {
			// 	title: '订单状态',        
			// 	dataIndex: 'approvals', 
			// 	align: 'center' ,   
			// 	inputType: 'text',   
			// 	width: 100,          
			// 	editable: true,      
			// 	render: (text) => {
			// 		if (isNotBlank(text)) {
			// 		  if (text === 3 || text === '3') {
			// 			return <span>已处理</span>
			// 		  }
			// 		  if (text === 0 || text === '0'||text === 1 || text === '1'||text === 2 || text === '2'||text === 4 || text === '4') {
			// 			return <span>未处理</span>
			// 		  }
			// 		}
			// 	  },
			// },
			{
				title: '单号',
				align: 'center',
				dataIndex: 'id',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '订单编号',
				align: 'center',
				dataIndex: 'orderCode',
				inputType: 'text',
				width: 200,
				editable: true,
			},
			{
				title: '审批进度',
				dataIndex: 'approvals',
				inputType: 'text',
				width: 100,
				align: 'center',
				editable: true,
				render: (text) => {
					if (isNotBlank(text)) {
						if (text === 0 || text === '0') {
							return <span style={{ color: "#f50" }}>待分配</span>
						}
						if (text === 1 || text === '1') {
							return <span style={{ color: "#f50" }}>待审核</span>
						}
						if (text === 2 || text === '2') {
							return <span style={{ color: "#f50" }}>待分配</span>
						}
						if (text === 3 || text === '3') {
							return <span style={{ color: "rgb(53, 149, 13)" }}>通过</span>
						}
						if (text === 4 || text === '4') {
							return <span style={{ color: "#f50" }}>驳回</span>
						}
					}
					return '';
				},
			},
			{
				title: '审批人1',
				dataIndex: 'oneUser.name',
				inputType: 'text',
				align: 'center',
				width: 200,
				editable: true,
				render: (text, res) => {
					if (!isNotBlank(text)) {
						return ''
					}
					return `${text} (${isNotBlank(res.oneUser) && isNotBlank(res.oneUser.status) && isNotBlank(res.oneUser.id) ? shstatus(res.oneUser.status) : '待审核'})`
				}
			},
			{
				title: '审批反馈1',
				dataIndex: 'oneUser.remarks',
				inputType: 'text',
				align: 'center',
				width: 150,
				editable: true,
				render: (text) => {
					return <span style={{ color: '#1890FF' }}>{text}</span>
				}
			},
			{
				title: '审批人2',
				dataIndex: 'twoUser.name',
				inputType: 'text',
				align: 'center',
				width: 200,
				editable: true,
				render: (text, res) => {
					if (!isNotBlank(text)) {
						return ''
					}
					return `${text} (${isNotBlank(res.twoUser) && isNotBlank(res.twoUser.status) && isNotBlank(res.twoUser.id) ? shstatus(res.twoUser.status) : '待审核'})`
				}
			},
			{
				title: '审批反馈2',
				dataIndex: 'twoUser.remarks',
				inputType: 'text',
				align: 'center',
				width: 150,
				editable: true,
				render: (text) => {
					return <span style={{ color: '#1890FF' }}>{text}</span>
				}
			},
			{
				title: '审批人3',
				dataIndex: 'threeUser.name',
				inputType: 'text',
				align: 'center',
				width: 200,
				editable: true,
				render: (text, res) => {
					if (!isNotBlank(text)) {
						return ''
					}
					return `${text} (${isNotBlank(res.threeUser) && isNotBlank(res.threeUser.status) && isNotBlank(res.threeUser.id) ? shstatus(res.threeUser.status) : '待审核'})`
				}
			},
			{
				title: '审批反馈3',
				dataIndex: 'threeUser.remarks',
				inputType: 'text',
				align: 'center',
				width: 150,
				editable: true,
				render: (text) => {
					return <span style={{ color: '#1890FF' }}>{text}</span>
				}
			},
			{
				title: '审批人4',
				dataIndex: 'fourUser.name',
				inputType: 'text',
				align: 'center',
				width: 200,
				editable: true,
				render: (text, res) => {
					if (!isNotBlank(text)) {
						return ''
					}
					return `${text} (${isNotBlank(res.fourUser) && isNotBlank(res.fourUser.status) && isNotBlank(res.fourUser.id) ? shstatus(res.fourUser.status) : '待审核'})`
				}
			},
			{
				title: '审批反馈4',
				dataIndex: 'fourUser.remarks',
				inputType: 'text',
				align: 'center',
				width: 150,
				editable: true,
				render: (text) => {
					return <span style={{ color: '#1890FF' }}>{text}</span>
				}
			},
			{
				title: '审批人5',
				dataIndex: 'fiveUser.name',
				inputType: 'text',
				align: 'center',
				width: 200,
				editable: true,
				render: (text, res) => {
					if (!isNotBlank(text)) {
						return ''
					}
					return `${text} (${isNotBlank(res.fiveUser) && isNotBlank(res.fiveUser.status) && isNotBlank(res.fiveUser.id) ? shstatus(res.fiveUser.status) : '待审核'})`
				}
			},
			{
				title: '审批反馈5',
				dataIndex: 'fiveUser.remarks',
				inputType: 'text',
				align: 'center',
				width: 150,
				editable: true,
				render: (text) => {
					return <span style={{ color: '#1890FF' }}>{text}</span>
				}
			},
			{
				title: '订单分类',
				dataIndex: 'formType',
				inputType: 'text',
				align: 'center',
				width: 150,
				editable: true,
				render: (text) => {
					if (isNotBlank(text)) {
						return formtype(text)
					}
					return ''
				}
			},
			{
				title: '整车完成时间',
				align: 'center',
				dataIndex: 'zhcCompletedDate',
				editable: true,
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
				title: '总车完成时间',
				align: 'center',
				dataIndex: 'zocCompletedDate',
				editable: true,
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
				title: '配件完成时间',
				align: 'center',
				dataIndex: 'pjCompletedDate',
				editable: true,
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
				title: '结算完成时间',
				align: 'center',
				dataIndex: 'jsCompletedDate',
				editable: true,
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
				title: '分公司',
				align: 'center',
				dataIndex: 'user.office.name',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '业务员',
				align: 'center',
				dataIndex: 'user.name',
				inputType: 'text',
				width: 150,
				editable: true,
			},
			{
				title: '区域',
				align: 'center',
				dataIndex: 'user.areaName',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '客户',
				align: 'center',
				dataIndex: 'client.clientCpmpany',
				inputType: 'text',
				width: 240,
				editable: true,
			},
			{
				title: '进场类型',
				align: 'center',
				dataIndex: 'assemblyEnterType',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '品牌',
				align: 'center',
				dataIndex: 'assemblyBrand',
				inputType: 'text',
				width: 100,
				editable: true,
				render: (text, res) => {
					if (isNotBlank(res.cpAssemblyBuild) && isNotBlank(res.cpAssemblyBuild.id)) {
						return isNotBlank(res.cpAssemblyBuild.assemblyBrand) ? res.cpAssemblyBuild.assemblyBrand : ''
					}
					return text
				}
			},
			{
				title: '车型/排量',
				align: 'center',
				dataIndex: 'assemblyVehicleEmissions',
				inputType: 'text',
				width: 100,
				editable: true,
				render: (text, res) => {
					if (isNotBlank(res.cpAssemblyBuild) && isNotBlank(res.cpAssemblyBuild.id)) {
						return isNotBlank(res.cpAssemblyBuild.vehicleModel) ? res.cpAssemblyBuild.vehicleModel : ''
					}
					return text
				}
			},
			{
				title: '年份',
				align: 'center',
				dataIndex: 'assemblyYear',
				inputType: 'text',
				width: 100,
				editable: true,
				render: (text, res) => {
					if (isNotBlank(res.cpAssemblyBuild) && isNotBlank(res.cpAssemblyBuild.id)) {
						return isNotBlank(res.cpAssemblyBuild.assemblyYear) ? res.cpAssemblyBuild.assemblyYear : ''
					}
					return text
				}
			},
			{
				title: '总成型号',
				align: 'center',
				dataIndex: 'assemblyModel',
				inputType: 'text',
				width: 100,
				editable: true,
				render: (text, res) => {
					if (isNotBlank(res.cpAssemblyBuild) && isNotBlank(res.cpAssemblyBuild.id)) {
						return isNotBlank(res.cpAssemblyBuild.assemblyModel) ? res.cpAssemblyBuild.assemblyModel : ''
					}
					return text
				}
			},
			{
				title: '钢印号',
				align: 'center',
				dataIndex: 'assemblySteelSeal',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: 'VIN码',
				align: 'center',
				dataIndex: 'assemblyVin',
				inputType: 'text',
				width: 200,
				editable: true,
			},
			{
				title: '其他识别信息',
				align: 'center',
				dataIndex: 'assemblyMessage',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '故障代码',
				align: 'center',
				dataIndex: 'assemblyFaultCode',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '本次故障描述',
				align: 'center',
				dataIndex: 'assemblyErrorDescription',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '制造编码',
				align: 'center',
				dataIndex: 'makeCode',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '物流要求',
				align: 'center',
				dataIndex: 'logistics',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '物流单号',
				align: 'center',
				dataIndex: 'logisticsCode',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '物流公司',
				align: 'center',
				dataIndex: 'logisticsOffice',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '发货人',
				align: 'center',
				dataIndex: 'shipper',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '发货地址',
				align: 'center',
				dataIndex: 'shipAddress',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '运费',
				align: 'center',
				dataIndex: 'freight',
				inputType: 'text',
				width: 100,
				editable: true,
				render: (text) => {
					return getPrice(text)
				}
			},
			{
				title: '件数',
				align: 'center',
				dataIndex: 'number',
				inputType: 'text',
				width: 100,
				editable: true,
			},
			{
				title: '更新时间',
				align: 'center',
				dataIndex: 'finishDate',
				editable: true,
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
				title: '备注信息',
				align: 'center',
				dataIndex: 'remarks',
				inputType: 'text',
				width: 150,
				editable: true,
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
			const newfield = deepClone(field)
			fieldArray = newfield;
		}

		const columns = [
			{
				title: '详情',
				width: 100,
				align: 'center',
				fixed: 'left',
				render: (text, record) => (
					<a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
				),
			},
			...fieldArray,
			{
				title: '基础操作',
				width: 100,
				align: 'center',
				render: (text, record) => {
					return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm').length > 0
						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpDischargedForm')[0].children.filter(item => item.name == '删除')
							.length > 0 ? (
							<Fragment>
								{isNotBlank(record) && isNotBlank(record.approvals) && (record.approvals == 0 || record.approvals == 2 || record.approvals == 4) ?
									<Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
										<a>删除</a>
									</Popconfirm>
									: ''
								}
							</Fragment>
						) : ''
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
				<div className='liststyle'>
					<div className={styles.tableListOperator}>
						<Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}>
							导出
            </Button>
					</div>
					<Card bordered={false}>
						<div className={styles.tableList}>
							<div className={styles.tableListForm}>{this.renderForm()}</div>
							<div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>放行单</div>
							<StandardEditTable
								scroll={{ x: (fieldArray.length * 100) + 500 }}

								loading={loading}
								data={releaseOrderList}
								bordered
								columns={columns}
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
									if (record.approvals == '3') {
										return 'greenstyle'
									}
									if (record.approvals == '0' || record.approvals == '1' || record.approvals == '2' || record.approvals == '4') {
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
				<SearchForm {...parentSearchMethods} searchVisible={searchVisible} />
			</PageHeaderWrapper>
		);
	}

}
export default ReleaseOrderList;
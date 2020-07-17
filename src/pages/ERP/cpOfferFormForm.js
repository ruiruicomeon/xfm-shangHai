import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Select,
	Button,
	Card,
	InputNumber,
	message,
	Icon,
	Upload,
	Row,
	Col,
	Modal,
	Table,
	Popconfirm,
	DatePicker,
	Cascader
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, setPrice, getPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragTable from '../../components/StandardEditTable/dragTable'
import moment from 'moment';
import styles from './CpOfferFormForm.less';
import StandardTable from '@/components/StandardTable';
import StandardEditTable from '@/components/StandardEditTable';
import stylessp from './style.less';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
	Object.keys(obj)
		.map(key => obj[key])
		.join(',');
const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
	state = {
		editing: false,
	};

	toggleEdit = () => {
		const editing = !this.state.editing;
		this.setState({ editing }, (editing) => {
			if (editing) {
				this.input.focus();
			}
		});
	};

	save = e => {
		const { record, handleSave } = this.props;
		this.form.validateFields((error, values) => {
			if (error && error[e.currentTarget.id]) {
				return;
			}
			this.toggleEdit();
			handleSave({ ...record, ...values });
		});
	};

	renderCell = form => {
		this.form = form;
		const { children, dataIndex, record, title } = this.props;
		const { editing } = this.state;
		return editing ? (
			<Form.Item style={{ margin: 0 }}>
				{form.getFieldDecorator(dataIndex, {
					rules: [
						{
							required: true,
							message: `${title} is required.`,
						},
					],
					initialValue: record[dataIndex],
				})(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
			</Form.Item>
		) : (
				<div
					className="editable-cell-value-wrap"
					style={{ paddingRight: 24 }}
					onClick={this.toggleEdit}
				>
					{children}
				</div>
			);
	};

	render() {
		const {
			editable,
			dataIndex,
			title,
			record,
			index,
			handleSave,
			children,
			...restProps
		} = this.props;
		return (
			<td {...restProps}>
				{editable ? (
					<EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
				) : (
						children
					)}
			</td>
		);
	}
}


const CreateFormForm = Form.create()(props => {
	const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator }, changecode,
		cpBillMaterialList, selectuser, handleSelectRows, selectedRows, showTable, searchcode, billid, submitting1 } = props;
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
	const modelsearch = (e) => {
		changecode(e.target.value)
	}
	const handleFormVisiblehide = () => {
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
						<Input value={isNotBlank(billid) ? billid : ''} onChange={modelsearch} />
						<Button style={{ marginLeft: 8 }} loading={submitting1} onClick={searchcode}>查询</Button>
						<Button style={{ marginLeft: 8 }} onClick={() => showTable()}>选择</Button>
					</FormItem>
				</Col>
				<Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='数量'>
						{getFieldDecorator('number', {
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? getPrice(modalRecord.number) : 1,
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
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode : '',
							rules: [
								{
									required: false,
									message: '请输入原厂编码',
								},
							],
						})(<Input disabled />)}
					</FormItem>
				</Col>
				<Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='名称'>
						{getFieldDecorator('name', {
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name : '',
							rules: [
								{
									required: false,
									message: '名称',
								},
							],
						})(<Input disabled />)}
					</FormItem>
				</Col>
				<Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='二级编码名称'>
						{getFieldDecorator('twoCodeModel', {
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.two) && isNotBlank(modalRecord.two.name) ? modalRecord.two.name : '',
							rules: [
								{
									required: false,
									message: '二级编码名称',
								},
							],
						})(<Input disabled />)}
					</FormItem>
				</Col>
				<Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='一级编码型号'>
						{getFieldDecorator('assemblyVehicleEmissions', {
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.one) && isNotBlank(modalRecord.one.model) ? modalRecord.one.model : '',
							rules: [
								{
									required: false,
									message: '一级编码型号',
								},
							],
						})(<Input disabled />)}
					</FormItem>
				</Col>
				<Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='配件厂商'>
						{getFieldDecorator('rCode', {
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.rCode) ? modalRecord.rCode : '',
							rules: [
								{
									required: false,
									message: '配件厂商',
								},
							],
						})(<Input disabled />)}
					</FormItem>
				</Col>
				<Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='库存数量'>
						{getFieldDecorator('repertoryNumber', {
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceNumber) ? modalRecord.balanceNumber : '',
							rules: [
								{
									required: false,
									message: '库存数量',
								},
							],
						})(<InputNumber style={{ width: '100%' }} disabled />)}
					</FormItem>
				</Col>
				<Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='库存单价'>
						{getFieldDecorator('repertoryPrice', {
							initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceMoney) ? getPrice(modalRecord.balanceMoney) : 0,
							rules: [
								{
									required: false,
									message: '库存单价',
								},
							],
						})(<InputNumber style={{ width: '100%' }} disabled />)}
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
						})(<Input />)}
					</FormItem>
				</Col>
			</Row>
		</Modal>
	);
})
const CreateForm = Form.create()(props => {
	const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator },
		cpBillMaterialList, selectuser, handleSelectRows, selectedRows, dispatch, location } = props;
	const selectcolumns = [
		{
			title: '操作',
			width: 100,
			fixed: 'left',
			render: record => {
				return <Fragment>
					<a onClick={() => selectuser(record)}>
						选择
  </a>
				</Fragment>
			},
		},
		{
			title: '物料编码',
			dataIndex: 'billCode',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '一级编码',
			dataIndex: 'oneCode',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '二级编码',
			dataIndex: 'twoCode',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '一级编码型号',
			dataIndex: 'oneCodeModel',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '二级编码名称',
			dataIndex: 'twoCodeModel',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '名称',
			dataIndex: 'name',
			inputType: 'text',
			width: 300,
			editable: false,
		},
		{
			title: '原厂编码',
			dataIndex: 'originalCode',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '配件厂商',
			dataIndex: 'rCode',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '单位',
			dataIndex: 'unit',
			inputType: 'text',
			width: 100,
			editable: false,
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: false,
			inputType: 'dateTime',
			width: 100,
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
			dataIndex: 'remarks',
			inputType: 'text',
			width: 100,
			editable: false,
		}
	]
	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 12 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 18 },
			md: { span: 12 },
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
			current: pagination.current,
			pageSize: pagination.pageSize,
      ...filters,
      tag:1,
			intentionId: location.query.id,
		};
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
			visible={modalVisible}
			onCancel={() => handleModalVisible()}
			width='80%'
		>
			<Form onSubmit={handleSearch}>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="物料编码">
							{getFieldDecorator('billCode', {
								initialValue: ''
							})(
								<Input />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="一级编码">
							{getFieldDecorator('oneCode', {
								initialValue: ''
							})(
								<Input />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="二级编码">
							{getFieldDecorator('twoCode', {
								initialValue: ''
							})(
								<Input />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="一级编码型号">
							{getFieldDecorator('oneCodeModel', {
								initialValue: ''
							})(
								<Input />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="二级编码名称">
							{getFieldDecorator('twoCodeModel', {
								initialValue: ''
							})(
								<Input />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="名称">
							{getFieldDecorator('name', {
								initialValue: ''
							})(
								<Input />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="原厂编码">
							{getFieldDecorator('originalCode', {
								initialValue: ''
							})(
								<Input />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="配件厂商">
							{getFieldDecorator('rCode', {
								initialValue: ''
							})(
								<Input />
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
				scroll={{ x: 1500 }}
				onChange={handleStandardTableChange}
				data={cpBillMaterialList}
				columns={selectcolumns}
			/>
		</Modal>
	);
});
const CreateFormfirst = Form.create()(props => {
	const { modalVisiblefirst, form, handleAddfirst, handleModalVisiblefirst, modalRecordfirst, form: { getFieldDecorator } } = props;
	const okHandle = () => {
		form.validateFields((err, fieldsValue) => {
			form.resetFields();
			const values = { ...fieldsValue };
			values.price = setPrice(values.price)
			if (isNotBlank(modalRecordfirst) && isNotBlank(modalRecordfirst.id)) {
				values.id = modalRecordfirst.id
			}
			handleAddfirst(values);
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
			title="新增明细"
			visible={modalVisiblefirst}
			onOk={okHandle}
			onCancel={() => handleModalVisiblefirst()}
		>
			<FormItem {...formItemLayout} label='名称'>
				{getFieldDecorator('name', {
					initialValue: isNotBlank(modalRecordfirst) && isNotBlank(modalRecordfirst.name) ? modalRecordfirst.name : '',
					rules: [
						{
							required: false,
							message: '请输入名称',
							max: 255,
						},
					],
				})(<Input />)}
			</FormItem>
			<FormItem {...formItemLayout} label='数量'>
				{getFieldDecorator('number', {
					initialValue: isNotBlank(modalRecordfirst) && isNotBlank(modalRecordfirst.number) ? (modalRecordfirst.number) : '',
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
			<FormItem {...formItemLayout} label='单价'>
				{getFieldDecorator('price', {
					initialValue: isNotBlank(modalRecordfirst) && isNotBlank(modalRecordfirst.price) ? getPrice(modalRecordfirst.price) : '',
					rules: [
						{
							required: false,
							message: '请输入单价',
						},
					],
				})(<InputNumber
					style={{ width: '100%' }}
					formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={value => value.replace(/￥\s?|(,*)/g, '')}
					precision={2}

				/>)}
			</FormItem>
		</Modal>
	);
});
const CreateFormkh = Form.create()(props => {
	const { form, dispatch, handleModalVisiblekh, modeluserList, selectkhflag, that,
		selectcustomer, selectedRows, handleSelectRows, levellist, levellist2, newdeptlist, } = props;
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
			title: '编号',
			dataIndex: 'no',
			align: 'center',
			width: 150,
		},
		{
			title: '姓名',
			dataIndex: 'name',
			align: 'center',
			width: 150,
		},
		{
			title: '性别',
			dataIndex: 'sex',
			align: 'center',
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
			align: 'center',
			width: 150,
		},
		{
			title: '所属大区',
			dataIndex: 'area.name',
			align: 'center',
			width: 150,
		},
		{
			title: '所属分公司',
			dataIndex: 'companyName',
			align: 'center',
			width: 150,
		},
		{
			title: '所属部门',
			dataIndex: 'dept.name',
			align: 'center',
			width: 150,
		},
		{
			title: '所属区域',
			dataIndex: 'areaName',
			align: 'center',
			width: 150,
		},
		{
			title: '状态',
			dataIndex: 'status',
			align: 'center',
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
				shrsearch: values
			})

			dispatch({
				type: 'sysuser/modeluser_List',
				payload: {
					'role.id': (getStorage('roles').split(',').some(item => { return item == '报价单审核' }) || getStorage('roles').split(',').some(item => { return item == '前台管理' })) ? '7,8' : '7',
					'office.id': getStorage('companyId'),
					...values
				}
			});
		});
	};
	const handleFormReset = () => {
		form.resetFields();
		that.setState({
			shrsearch: {}
		})
		dispatch({
			type: 'sysuser/modeluser_List',
			payload: {
				'role.id': (getStorage('roles').split(',').some(item => { return item == '报价单审核' }) || getStorage('roles').split(',').some(item => { return item == '前台管理' })) ? '7,8' : '7',
				'office.id': getStorage('companyId')
			}
		});
	}
	const handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});
		const params = {
			...that.state.shrsearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
			'role.id': (getStorage('roles').split(',').some(item => { return item == '报价单审核' }) || getStorage('roles').split(',').some(item => { return item == '前台管理' })) ? '7,8' : '7',
			'office.id': getStorage('companyId')
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'sysuser/modeluser_List',
			payload: params,
		});
	};

	const handleModalVisiblekhin = () => {
		// form.resetFields();
		that.setState({
			shrsearch: {}
		})
		handleModalVisiblekh()
	}

	return (
		<Modal
			title='选择审核人'
			visible={selectkhflag}
			onCancel={() => handleModalVisiblekhin()}
			width='80%'
		>
			<Form onSubmit={handleSearch}>
				<Row gutter={12}>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="编号">
							{getFieldDecorator('no')(<Input />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="姓名">
							{getFieldDecorator('name')(<Input />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem {...formItemLayout} label="性别">
							{getFieldDecorator('sex', {
								initialValue: '',
							})(
								<Select style={{ width: '100%' }} allowClear>
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
								<Select style={{ width: '100%' }} allowClear>
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
			<StandardTable
				bordered
				scroll={{ x: 1050 }}
				onChange={handleStandardTableChange}
				data={modeluserList}
				columns={columnskh}
			/>
		</Modal>
	);
});
const CreateFormpass = Form.create()(props => {
	const { modalVisiblepass, form, handleAddpass, handleModalVisiblepass } = props;
	const okHandle = () => {
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			form.resetFields();
			const values = { ...fieldsValue };
			handleAddpass(values);
		});
	};
	return (
		<Modal
			title='审批'
			visible={modalVisiblepass}
			onOk={okHandle}
			onCancel={() => handleModalVisiblepass()}
		>
			<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核理由">
				{form.getFieldDecorator('remarks1', {
					initialValue: '',
					rules: [
						{
							required: true,
							message: '请输入审核理由',
						},
					],
				})(<Input />)}
			</FormItem>
		</Modal>
	);
});
@connect(({ cpOfferForm, loading, cpClient, sysuser, syslevel, sysdept, cpBillMaterial }) => ({
	...cpOfferForm,
	...cpClient,
	...sysuser,
	...syslevel,
	...sysdept,
	...cpBillMaterial,
	newdeptlist: sysdept.deptlist.list,
	submitting1: loading.effects['cpBillMaterial/get_cpAssemblyBuild_search_All'],
	submitting: loading.effects['form/submitRegularForm'],
	submitting2: loading.effects['cpOfferForm/cpOfferForm_Add'],
	submitting3: loading.effects['cpupdata/cpOfferForm_update'],
}))
@Form.create()
class CpOfferFormForm extends PureComponent {
	index = 0

	cacheOriginData = {};

	constructor(props) {
		super(props);

		this.columnsTopwl = [
			{
				title: '名称',
				dataIndex: 'name',
				inputType: 'text',
				width: 150,
				align: 'center',
				editable: false,
			},
			{
				title: '数量',
				dataIndex: 'number',
				inputType: 'text',
				width: 100,
				align: 'center',
				editable: true,
			},
			{
				title: '单价',
				dataIndex: 'price',
				inputType: 'text',
				width: 100,
				align: 'center',
				editable: false,
				render: (text) => {
					if (isNotBlank(text)) {
						return <span>{getPrice(text)}</span>
					}
				}
			},
			{
				title: '总金额',
				dataIndex: 'totaoPrice',
				inputType: 'text',
				width: 100,
				align: 'center',
				editable: false,
				render: (text) => {
					if (isNotBlank(text)) {
						return <span>{getPrice(text)}</span>
					}
				}
			},
		]

		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			fileList: [],
			modalVisible: false,
			modalRecord: {},
			modalRecordfirst: {},
			selectkhdata: [],
			selectshdata1: {},
			selectshdata2: {},
			selectshdata3: {},
			selectshdata4: {},
			selectshdata5: {},
			modalVisiblepass: false,
			indexstatus: '',
			indexflag: 0,
			selectedRows: [],
			showdata: [],
			orderflag: false,
			selectkhflag: false,
			totalmoney: '',
			selectyear: 0,
			selectmonth: 0,
			shrsearch: {},
			updataflag: true,
			updataname: '取消锁定',
			confirmflag: true,
			confirmflag1: true,
			location: getLocation()
		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const { location } = this.state

		this.props.form.setFieldsValue({
			zbtime: 0
		});

		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpOfferForm/cpOfferForm_Get',
				payload: {
					id: location.query.id,
				},
				callback: (res) => {
					if (isNotBlank(res.data.qualityDate)) {
						this.props.form.setFieldsValue({
							zbtime: res.data.qualityDate
						});
						this.setState({
							selectyear: res.data.qualityDate.split(',')[0],
							selectmonth: res.data.qualityDate.split(',')[1]
						})
					}
					if (isNotBlank(res.data.orderCode)) {
						dispatch({
							type: 'cpBillMaterial/cpBillMaterial_middle_List',
							payload: {
								singelId: location.query.id,
								isTemplate: 1,
								pageSize: 100
							},
							callback: (resdata) => {
								let newarr = []
								if (isNotBlank(resdata.list) && resdata.list.length > 0) {
									newarr = [...resdata.list]
								}
								this.setState({
									dataSource: newarr
								})
							}
						});
					}
					if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && ((isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
							.length > 0))
					) {
						this.setState({ orderflag: false })
					} else {
						this.setState({ orderflag: true })
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
					dispatch({
						type: 'sysarea/getFlatCode',
						payload: {
							id: location.query.id,
							type: 'BJ'
						},
						callback: (imgres) => {
							this.setState({
								srcimg: imgres
							})
						}
					})
					dispatch({
						type: 'sysarea/getFlatOrderdCode',
						payload: {
							id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
							type: 'BJ'
						},
						callback: (imgres) => {
							this.setState({
								srcimg1: imgres
							})
						}
					})


					const allUser = []
					if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
						allUser.push(res.data.oneUser, res.data.twoUser)
					} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
						allUser.push(res.data.oneUser)
					}
					this.setState({
						showdata: allUser
					})
				}
      });
      
      dispatch({
        type: 'sysuser/modeluser_List',
        payload: {
          'role.id': (getStorage('roles').split(',').some(item => { return item == '报价单审核' }) || getStorage('roles').split(',').some(item => { return item == '前台管理' })) ? '7,8' : '7',
          'office.id': getStorage('companyId')
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
					const offerType = []
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
						if (item.type == 'offerType') {
							offerType.push(item)
						}
					})
					this.setState({
						insuranceCompany,
						brand, approachType, collectCustomer,
						orderType, business_project, business_dicth
						, business_type, settlement_type, payment_methodd, old_need,
						make_need, quality_need, oils_need, guise_need, installation_guide
						, maintenance_project, is_photograph, del_flag, classify, client_level,
						area, offerType
					})
				}
			})
			dispatch({
				type: 'cpOfferForm/cpOffer_Detail_List',
				payload: {
					pageSize: 50,
					cpOfferId: location.query.id
				},
				callback: (res) => {
					let newarr = []
					if (isNotBlank(res.list) && res.list.length > 0) {
						newarr = [...res.list]
					}
					this.setState({
						dataSourcetop: newarr
					})
				}
			});
		}
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
				pageSize: 10,
			}
		});
	}

	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		this.setState({
			selectkhdata: ''
		})
		dispatch({
			type: 'cpOfferForm/clear',
		});
		dispatch({
			type: 'cpBillMaterial/clear',
		})
	}

	handleSubmit = () => {
		const { dispatch, form } = this.props;
		const { addfileList, location, selectkhdata, cpOfferFormGet, selectyear, selectmonth, showdata, updataflag } = this.state;
		// e.preventDefault();
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
				const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
				value.totalNumber = newshowdata.length
				const idarr = []
				newshowdata.forEach(item => {
					idarr.push(item.id)
				})
				value.qualityDate = `${selectyear} , ${selectmonth}`
				value.oldTime = moment(values.oldTime).format("YYYY-MM-DD")
				value.workingDate = moment(values.workingDate).format("YYYY-MM-DD")
				value.returnedDate = moment(values.returnedDate).format("YYYY-MM-DD")
				value.ids = idarr.join(',')
				value.approvals = this.turnappData(value.approvals)
				value.orderStatus = 1
				if (updataflag) {
					dispatch({
						type: 'cpOfferForm/cpOfferForm_Add',
						payload: { ...value },
						callback: (res) => {
							// router.push('/business/process/cp_offer_form_list');
							router.push(`/business/process/cp_offer_form_form?id=${location.query.id}`);
							this.setState({
								addfileList: [],
								fileList: [],
								totalmoney: res.data
							});
						}
					})
				} else {
					dispatch({
						type: 'cpupdata/cpOfferForm_update',
						payload: { ...value },
						callback: () => {
							this.setState({
								addfileList: [],
								fileList: [],
							});
							// router.push('/business/process/cp_offer_form_list');
							router.push(`/business/process/cp_offer_form_form?id=${location.query.id}`);
						}
					})
				}
			}
		});
	};

	onupdata = () => {
		const { location, updataflag } = this.state
		if (updataflag) {
			this.setState({
				updataflag: false,
				updataname: '锁定'
			})
		} else {
			router.push(`/business/process/cp_offer_form_form?id=${location.query.id}`);
		}
	}

	onsave = e => {
		const { dispatch, form } = this.props;
		const { addfileList, location, selectkhdata, cpOfferFormGet, selectyear, selectmonth, showdata, updataflag } = this.state;
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
				value.qualityDate = `${selectyear} , ${selectmonth}`
				value.oldTime = moment(values.oldTime).format("YYYY-MM-DD")
				value.workingDate = moment(values.workingDate).format("YYYY-MM-DD")
				value.returnedDate = moment(values.returnedDate).format("YYYY-MM-DD")
				const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
				const idarr = []
				value.totalNumber = newshowdata.length
				newshowdata.forEach(item => {
					idarr.push(item.id)
				})
				value.ids = idarr.join(',')
				value.approvals = this.turnappData(value.approvals)
				if (updataflag) {
					value.orderStatus = 0
					dispatch({
						type: 'cpOfferForm/cpOffer_save_Add',
						payload: { ...value },
						callback: () => {
							dispatch({
								type: 'cpOfferForm/cpOfferForm_Get',
								payload: {
									id: location.query.id,
								},
								callback: (res) => {
									if (res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') {
										this.setState({ orderflag: false })
									} else {
										this.setState({ orderflag: true })
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
									const allUser = []
									if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
										allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
									} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
										allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
									} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
										allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
									} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
										allUser.push(res.data.oneUser, res.data.twoUser)
									} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
										allUser.push(res.data.oneUser)
									}
									this.setState({
										showdata: allUser
									})
								}
							});
						}
					})
				} else {
					value.orderStatus = 1
					dispatch({
						type: 'cpupdata/cpOfferForm_update',
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
		router.push('/business/process/cp_offer_form_list');
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
		const isimg = file.type.indexOf('image') >= 0;
		if (!isimg) {
			message.error('请选择图片文件!');
		}
		const isLt10M = file.size / 1024 / 1024 <= 10;
		if (!isLt10M) {
			message.error('文件大小需为10M以内');
		}
		if (isimg && isLt10M) {
			if (!isNotBlank(addfileList) || addfileList.length <= 0) {
				this.setState({
					addfileList: [file],
				});
			} else {
				this.setState({
					addfileList: [...addfileList, file],
				});
			}
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

	handleModalVisiblefirst = flag => {
		this.setState({
			modalVisiblefirst: !!flag,
			modalRecordfirst: {},
		});
	};

	handleModalVisiblepass = flag => {
		this.setState({
			modalVisiblepass: !!flag,
		});
	};

	handleAddfirst = (value) => {
		const { dispatch } = this.props
		const { location, modalVisiblefirst } = this.state
		const vals = { ...value }
		dispatch({
			type: 'cpOfferForm/cpOffer_Detail_Add',
			payload: {
				...vals,
				cpOfferId: location.query.id
			},
			callback: (res) => {
				this.setState({
					modalVisiblefirst: false,
					totalmoney: getPrice(res.data)
				});
				dispatch({
					type: 'cpOfferForm/cpOffer_Detail_List',
					payload: {
						pageSize: 50,
						cpOfferId: location.query.id
					},
					callback: (res) => {
						let newarr = []
						if (isNotBlank(res.list) && res.list.length > 0) {
							newarr = [...res.list]
						}
						this.setState({
							dataSourcetop: newarr,
							modalRecordfirst: {},
							modalVisiblefirst: false
						})
					}
				});
			}
		})
	};

	showTable = flag => {
		this.setState({
			modalVisiblefirst: true
		});
	};

	onselectkh = (key) => {
    this.setState({
      indexflag: key,
      selectkhflag: true
    })
	}

	handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
	};

	selectcustomer = (record) => {
		const { dispatch } = this.props;
		const { indexflag, showdata } = this.state;
		let newselectkhdata = []
		if (showdata.length === 0) {
			newselectkhdata = []
		} else {
			newselectkhdata = showdata.map(item => ({ ...item }));
		}
		let newindex = ''
		record.status = 0
		showdata.forEach((i, index) => {
			if (i.id === indexflag) {
				newindex = index
			}
		})
		newselectkhdata.splice(newindex, 1, record)
		this.setState({ showdata: newselectkhdata, selectkhflag: false })
	}

	handleDeleteClick = (id) => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'cpOfferForm/cpOffer_Detail_Delete',
			payload: {
				id
			},
			callback: (res) => {
				dispatch({
					type: 'cpOfferForm/cpOffer_Detail_List',
					payload: {
						pageSize: 50,
						cpOfferId: location.query.id
					},
					callback: (res) => {
						let newarr = []
						if (isNotBlank(res.list) && res.list.length > 0) {
							newarr = [...res.list]
						}
						this.setState({
							dataSourcetop: newarr
						})
					}
				});
				this.setState({
					totalmoney: getPrice(res.data)
				})
			}
		});
	}

	handleDeleteClickwl = (id) => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'cpPendingSingelForm/cpPendingSingel_del',
			payload: {
				id
			},
			callback: (res) => {
				dispatch({
					type: 'cpOfferForm/cpOfferForm_Get',
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
						pageSize: 50,
						singelId: location.query.id,
						isTemplate: 1
					},
					callback: (resin) => {
						let newarr = []
						if (isNotBlank(resin.list) && resin.list.length > 0) {
							newarr = [...resin.list]
						}
						this.setState({
							dataSource: newarr
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

	onUndo = (record) => {
		Modal.confirm({
			title: '撤销该报价单',
			content: '确定撤销该报价单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.undoClick(record),
		});
	}

	undoClick = (id) => {
		const { dispatch } = this.props
		const { confirmflag, location } = this.state
		const that = this
		setTimeout(function () {
			that.setState({
				confirmflag: true
			})
		}, 1000)

		if (confirmflag) {
			this.setState({
				confirmflag: false
			})
			dispatch({
				type: 'cpOfferForm/jscpOfferForm_revocation',
				payload: {
					id
				},
				callback: () => {
					// router.push('/business/process/cp_offer_form_list');
					router.push(`/business/process/cp_offer_form_form?id=${location.query.id}`);
				}
			})
		}
	}

	getRowByKey(key, newData) {
		const { showdata } = this.state;
		return (newData || showdata).filter(item => item.key === key)[0];
	}

	cancel(e, key) {
		this.clickedCancel = true;
		e.preventDefault();
		const { showdata } = this.state;
		const newData = showdata.map(item => ({ ...item }));
		const target = this.getRowByKey(key, newData);
		if (this.cacheOriginData[key]) {
			Object.assign(target, this.cacheOriginData[key]);
			delete this.cacheOriginData[key];
		}
		target.editable = false;
		this.setState({ showdata: newData });
		this.clickedCancel = false;
	}

	newMember = () => {
		const { showdata } = this.state;
		let newData = []
		if (showdata.length === 0) {
			newData = []
		} else {
			newData = showdata.map(item => ({ ...item }));
		}
		newData.push({
			id: this.index,
		});
		this.index += 1;
		this.setState({ showdata: newData });
	};

	remove(key) {
		const { showdata } = this.state;
		const { onChange } = this.props;
		const newData = showdata.filter(item => item.id !== key);
		this.setState({ showdata: newData });
	}

	turnappData = (apps) => {
		if (apps === '待分配') {
			return 0
		}
		if (apps === '待审核') {
			return 1
		}
		if (apps === '重新提交') {
			return 2
		}
		if (apps === '通过') {
			return 3
		}
		if (apps === '驳回') {
			return 4
		}
	}

	handleAddpass = (val) => {
		const { dispatch } = this.props
		const { location, indexstatus } = this.state
		dispatch({
			type: 'cpOfferForm/cpOffer_settlement_Add',
			payload: {
				id: location.query.id,
				approvals: indexstatus,
				...val
			},
			callback: () => {
				dispatch({
					type: 'cpOfferForm/cpOfferForm_Get',
					payload: {
						id: location.query.id,
					},
					callback: (res) => {
						if (res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') {
							this.setState({ orderflag: false })
						} else {
							this.setState({ orderflag: true })
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
						const allUser = []
						if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
							allUser.push(res.data.oneUser, res.data.twoUser)
						} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
							allUser.push(res.data.oneUser)
						}
						this.setState({
							showdata: allUser,
							modalVisiblepass: false
						})
					}
				});
			}
		})
	}

	showsp = (i) => {
		this.setState({
			indexstatus: i,
			modalVisiblepass: true
		})
	}

	repostSumbit = (record) => {
		Modal.confirm({
			title: '重新提交该报价单',
			content: '重新提交该报价单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.repost(record),
		});
	}


	repost = () => {
		const { dispatch } = this.props
		const { location, confirmflag1 } = this.state
		const that = this
		setTimeout(function () {
			that.setState({
				confirmflag1: true
			})
		}, 1000)

		if (confirmflag1) {
			this.setState({
				confirmflag1: false
			})
			dispatch({
				type: 'cpOfferForm/cpOffer_respost',
				payload: {
					id: location.query.id
				},
				callback: () => {
					dispatch({
						type: 'cpOfferForm/cpOfferForm_Get',
						payload: {
							id: location.query.id,
						},
						callback: (res) => {
							if (res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') {
								this.setState({ orderflag: false })
							} else {
								this.setState({ orderflag: true })
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
							const allUser = []
							if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
								allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser, res.data.fiveUser)
							} else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
								allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser)
							} else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
								allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser)
							} else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
								allUser.push(res.data.oneUser, res.data.twoUser)
							} else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
								allUser.push(res.data.oneUser)
							}
							this.setState({
								showdata: allUser
							})
						}
					});
				}
			})
		}
	}

	goprint = () => {
		const { location } = this.state
		const w = window.open('about:blank')
		w.location.href = `/#/Task_PriceSheet?id=${location.query.id}`
	}

	editYear = (val) => {
		if (isNotBlank(val)) {
			this.props.form.setFieldsValue({
				zbtime: isNotBlank(val) ? val : '',
			});
			this.setState({ selectyear: val })
		} else {
			this.props.form.setFieldsValue({
				zbtime: 0,
			});
			this.setState({ selectyear: 0 })
		}
	}

	editMonth = (val) => {
		if (isNotBlank(val)) {
			this.props.form.setFieldsValue({
				zbtime: isNotBlank(val) ? val : '',
			});
			this.setState({ selectmonth: val })
		} else {
			this.props.form.setFieldsValue({
				zbtime: 0,
			});
			this.setState({ selectmonth: 0 })
		}
	}

	handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const { dispatch } = this.props;
		const { formValues, location } = this.state;
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
			//   pageSize: pagination.pageSize,
			...sort,
			...formValues,
			...filters,
			cpOfferId: location.query.id
		};
		dispatch({
			type: 'cpOfferForm/cpOffer_Detail_List',
			payload: params,
			callback: (res) => {
				let newarr = []
				if (isNotBlank(res.list) && res.list.length > 0) {
					newarr = [...res.list]
				}
				this.setState({
					dataSourcetop: newarr
				})
			}
		});
	};

	handleStandardTableChange1 = (pagination, filtersArg, sorter) => {
		const { dispatch, cpOfferFormGet } = this.props;
		const { formValues, location } = this.state;
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
			singelId: isNotBlank(location.query) && isNotBlank(location.query.id) ? location.query.id : '',
			isTemplate: 0
		};
		dispatch({
			type: 'cpBillMaterial/cpBillMaterial_middle_List',
			payload: params,
		});
	};

	selectuser = (res) => {
		const { dispatch } = this.props;
		const { selectedRows, location } = this.state;
		this.setState({
			modalVisible: false,
			modalRecord: res,
			billid: res.billCode
		})
	}

	handleModalVisiblekh = () => {
		this.setState({
			modalVisible: !!flag
		});
	}

	handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
	};

	searchcode = () => {
		const { dispatch } = this.props
		const { location, billid } = this.state
		if (isNotBlank(billid)) {
			this.setState({
				modalRecord: {},
			})
			dispatch({
				type: 'cpBillMaterial/get_cpBillMaterial_search_All',
				payload: {
					singelId: location.query.id,
					billCode: billid,
          pageSize: 10,
          tag:1
				},
				callback: (res) => {
					if (isNotBlank(res) && isNotBlank(res.list) && res.list.length > 0) {
						this.setState({
							modalRecord: res.list[0]
						})
					}
				}
			});
		} else {
			message.error('请输入物料编码')
		}
	}

	changecode = (id) => {
		this.setState({
			modalRecord: {},
			billid: id
		})
	}

	showTablewl = () => {
		const { dispatch } = this.props
		const { location } = this.state
		dispatch({
			type: 'cpBillMaterial/get_cpBillMaterial_All',
			payload: {
				intentionId: location.query.id,
        pageSize: 10,
        tag:1
			}
		});
		this.setState({
			modalVisible: true
		});
	}

	handleFormAdd = (values) => {
		const { dispatch, cpOfferFormGet } = this.props
		const { location, modalRecord } = this.state
		let cpeid = ''
		let cpsid = ''
		if (isNotBlank(modalRecord) && isNotBlank(modalRecord.cpPjEntrepot) && isNotBlank(modalRecord.cpPjEntrepot.id)) {
			cpeid = modalRecord.cpPjEntrepot.id
		}
		if (isNotBlank(modalRecord) && isNotBlank(modalRecord.cpPjStorage) && isNotBlank(modalRecord.cpPjStorage.id)) {
			cpsid = modalRecord.cpPjStorage.id
		}
		dispatch({
			type: 'cpOfferForm/update_CpBill_Singel',
			payload: {
				singelId: isNotBlank(location.query) && isNotBlank(location.query.id) ? location.query.id : '',
				billId: modalRecord.id,
				'cpPjEntrepot.id': cpeid,
				'cpPjStorage.id': cpsid,
				...values,
			}
			,
			callback: () => {
				this.setState({
					FormVisible: false,
					modalRecord: {}
				})
				dispatch({
					type: 'cpOfferForm/cpOfferForm_Get',
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
						singelId: location.query.id,
						isTemplate: 1,
						pageSize: 50
					},
					callback: (res) => {
						let newarr = []
						if (isNotBlank(res.list) && res.list.length > 0) {
							newarr = [...res.list]
						}
						this.setState({
							dataSource: newarr
						})
					}
				})
			}
		})
	}

	handleFormVisible = flag => {
		this.setState({
			FormVisible: !!flag,
			modalRecord: {},
			billid: ''
		});
	};

	showFormwlmx = () => {
		this.setState({
			FormVisible: true
		})
	}

	isEditing = record => {
		const { editingKey } = this.state;
		if (isNotBlank(record) && isNotBlank(editingKey)) {
			return (record.key || record.id) === editingKey;
		}
		return false;
	};

	cancel = () => {
		this.setState({ editingKey: '' });
	};

	save = (form, key) => {
		const { onSaveData } = this.props;
		form.validateFields((error, row) => {
			if (error) {
				return;
			}
			if (onSaveData) {
				onSaveData(key, row);
			}
			this.setState({ editingKey: '' });
		});
	};

	edit = key => {
		this.setState({ editingKey: key });
	};

	initTotalList = (columns) => {
		const totalList = [];
		columns.forEach(column => {
			if (column.needTotal) {
				totalList.push({ ...column, total: 0 });
			}
		});
		return totalList;
	}

	changeTable = (value) => {
		console.log(value)
	}

	handleSaveTop = row => {
		const { cpBillMaterialMiddleList, dispatch, cpOfferFormGet } = this.props
		const { location } = this.state
		const newData = [...cpBillMaterialMiddleList.list];
		const index = newData.findIndex(item => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});

		dispatch({
			type: 'cpOfferForm/cpOffer_Detail_Add',
			payload: {
				id: row.id,
				number: row.number,
				price: setPrice(row.price)
				// ...value,
				// cpOfferId: location.query.id
			},
			callback: (res) => {
				this.setState({
					modalVisiblefirst: false,
					totalmoney: getPrice(res.data)
				});
				dispatch({
					type: 'cpOfferForm/cpOffer_Detail_List',
					payload: {
						pageSize: 50,
						cpOfferId: location.query.id
					},
					callback: (res) => {
						let newarr = []
						if (isNotBlank(res.list) && res.list.length > 0) {
							newarr = [...res.list]
						}
						this.setState({
							dataSourcetop: newarr
						})
					}
				});
			}
		})


	};

	handleSave = row => {
		const { cpOfferDetailList, dispatch, cpOfferFormGet } = this.props
		const { location } = this.state
		const newData = [...cpOfferDetailList.list];
		const index = newData.findIndex(item => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});

		dispatch({
			type: 'cpOfferForm/cpOffer_Detail_Add',
			payload: {
				id: row.id,
				number: row.number,
				// price: setPrice(row.price)
			},
			callback: (res) => {
				this.setState({
					modalVisiblefirst: false,
					totalmoney: getPrice(res.data)
				});
				dispatch({
					type: 'cpOfferForm/cpOffer_Detail_List',
					payload: {
						pageSize: 50,
						cpOfferId: location.query.id
					},
					callback: (res) => {
						let newarr = []
						if (isNotBlank(res.list) && res.list.length > 0) {
							newarr = [...res.list]
						}
						this.setState({
							dataSourcetop: newarr
						})
					}
				});
			}
		})


		// dispatch({
		// 	type: 'cpOfferForm/update_CpBill_Singel',
		//   payload: {
		// 	id: row.id,
		// 	number: row.number
		//   },
		//   callback: () => {
		// 	dispatch({
		// 		type: 'cpBillMaterial/cpBillMaterial_middle_List',
		// 		payload: {
		// 		  singelId: location.query.id,
		// 		  isTemplate: 0
		// 		},
		// 	  callback: (res) => {
		// 		let newarr = []
		// 		if (isNotBlank(res.list) && res.list.length > 0) {
		// 		  newarr = [...res.list]
		// 		}
		// 		this.setState({
		// 		  dataSource: newarr
		// 		})
		// 	  }
		// 	})
		//   }
		// })

		// dispatch({
		// 	type: 'cpOfferForm/update_CpBill_Singel',
		//   payload: {
		// 	id: row.id,
		// 	number: row.number
		//   },
		//   callback: () => {
		// 	dispatch({
		// 		type: 'cpBillMaterial/cpBillMaterial_middle_List',
		// 		payload: {
		// 		  singelId: location.query.id,
		// 		  isTemplate: 0
		// 		},
		// 	  callback: (res) => {
		// 		let newarr = []
		// 		if (isNotBlank(res.list) && res.list.length > 0) {
		// 		  newarr = [...res.list]
		// 		}
		// 		this.setState({
		// 		  dataSource: newarr
		// 		})
		// 	  }
		// 	})
		//   }
		// })
	};

	handleModalVisible = () => {
		this.setState({
			modalVisible: false
		})
	}

	showtopMX = (res) => {
		this.setState({
			modalRecordfirst: res,
			modalVisiblefirst: true
		})
	}

	render() {
		const { fileList, previewVisible, previewImage, modalVisible, selectkhflag, selectkhdata, orderflag, totalmoney, selectedRows, showdata, modalVisiblepass
			, updataflag, updataname, selectmonth, selectyear, srcimg, srcimg1, modalRecordfirst, modalRecord, location, FormVisible, modalVisiblefirst,
			billid, dataSource, dataSourcetop } = this.state;
		const { submitting3, submitting2, submitting, submitting1, getcpBillMaterialAll, cpOfferFormGet, cpOfferDetailList, cpClientList, modeluserList, dispatch, levellist, levellist2, newdeptlist, zhCpBillSingelList } = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;
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


		const columnswlin = [
			{
				title: '报件单号',
				dataIndex: 'remarks',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '物料编码',
				dataIndex: 'cpBillMaterial.billCode',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '一级编码',
				dataIndex: 'cpBillMaterial.oneCode',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '二级编码',
				dataIndex: 'cpBillMaterial.twoCode',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '一级编码型号',
				dataIndex: 'cpBillMaterial.one.model',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '二级编码名称',
				dataIndex: 'cpBillMaterial.two.name',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '名称',
				dataIndex: 'cpBillMaterial.name',
				inputType: 'text',
				width: 200,
				editable: false,
			},
			{
				title: '原厂编码',
				dataIndex: 'cpBillMaterial.originalCode',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '配件厂商',
				dataIndex: 'cpBillMaterial.rCode',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '单位',
				dataIndex: 'cpBillMaterial.unit',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '需求数量',
				dataIndex: 'number',
				inputType: 'text',
				width: 150,
				editable: true,
				render: (text, res) => {
					if (isNotBlank(res.id)) {
						return text
					}
					return `总数量:${text}`
				}
			},
			{
				title: '库存数量',
				dataIndex: 'repertoryNumber',
				inputType: 'text',
				width: 100,
				editable: false,
			},
			{
				title: '库存单价',
				dataIndex: 'repertoryPrice',
				inputType: 'text',
				width: 150,
				editable: false,
				render: (text, res) => {
					if (isNotBlank(res.id)) {
						return getPrice(text)
					}
					return `总金额:${getPrice(text)}`
				}
				//   render: (text) => { return getPrice(text) }
			},
			{
				title: '创建时间',
				dataIndex: 'createDate',
				editable: false,
				inputType: 'dateTime',
				width: 100,
				sorter: true,
				render: val => {
					if (isNotBlank(val)) {
						return moment(val).format('YYYY-MM-DD HH:mm:ss')
					}
					return ''
				},
			},
			{
				title: '更新时间',
				dataIndex: 'finishDate',
				editable: false,
				inputType: 'dateTime',
				width: 100,
				sorter: true,
				render: val => {
					if (isNotBlank(val)) {
						return moment(val).format('YYYY-MM-DD HH:mm:ss')
					}
					return ''
				}
			},
			{
				title: '备注信息',
				dataIndex: 'cpBillMaterial.remarks',
				inputType: 'text',
				width: 100,
				editable: false,
			},
		]




		// 		const columns = [
		// 			{
		// 				title: '基础操作',
		// 				width: 100,
		// 				render: (text, record) => {
		// 					if(((isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOfferForm').length>0
		// 					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOfferForm')[0].children.filter(item=>item.name=='修改')
		// 					.length>0&&
		// 					(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0'))||
		// 					(isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.createBy)&&(cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')  )||
		// 					(isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.createBy)&&(cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4')  )
		// 					)){
		// 				    return  <Fragment>
		//   {/* <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}> */}
		//     				<a onClick={this.showtopMX(record)}>撤销</a>
		//   {/* </Popconfirm> */}
		// </Fragment>
		// 					}
		// 					return ''
		// 				},
		// 			},
		// 			{
		// 				title: '名称',        
		// 				dataIndex: 'name',   
		// 				inputType: 'text',   
		// 				width: 100,          
		// 				editable: true,      
		// 			},
		// 			{
		// 				title: '数量',        
		// 				dataIndex: 'number',   
		// 				inputType: 'text',   
		// 				width: 100,          
		// 				editable: true,      
		// 			},
		// 			{
		// 				title: '单价',        
		// 				dataIndex: 'price',   
		// 				inputType: 'text',   
		// 				width: 100,          
		// 				editable: true,      
		// 				render: (text) => {
		// 					if (isNotBlank(text)) {
		// 						return <span>{getPrice(text)}</span>
		// 					}
		// 				}
		// 			},
		// 			{
		// 				title: '总金额',        
		// 				dataIndex: 'totaoPrice',   
		// 				inputType: 'text',   
		// 				width: 100,          
		// 				editable: true,      
		// 				render: (text) => {
		// 					if (isNotBlank(text)) {
		// 						return <span>{getPrice(text)}</span>
		// 					}
		// 				}
		// 			},
		// 			{
		// 				title: '基础操作',
		// 				width: 100,
		// 				render: (text, record) => {
		// 					if(((isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOfferForm').length>0
		// 					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpOfferForm')[0].children.filter(item=>item.name=='修改')
		// 					.length>0&&
		// 					(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0'))||
		// 					(isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.createBy)&&(cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')  )||
		// 					(isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.createBy)&&(cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4')  )
		// 					)){
		// 				    return  <Fragment>
		//   <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
		//     <a>删除</a>
		//   </Popconfirm>
		// </Fragment>
		// 					}
		// 					return ''
		// 				},
		// 			},
		// 		];
		const shstatus = (apps) => {
			if (apps === '0' || apps === 0) {
				return '待审核'
			}
			if (apps === '1' || apps === 1) {
				return '通过'
			}
			if (apps === '2' || apps === 2) {
				return '驳回'
			}
		}
		const columnssh = [
			{
				title: '操作',
				key: 'action',
				width: 100,
				render: (text, record) => {
					if (((isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
							.length > 0 &&
						(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0')) ||
						(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')) ||
						(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4'))
					)) {
						return (
							<span>
								<a onClick={e => this.onselectkh(record.id)}>选择</a>
							</span>
						);
					}
					return ''
				}
			},
			{
				title: '审核人姓名',
				dataIndex: 'name',
				key: 'name',
				width: 150,
			},
			{
				title: '审核状态',
				dataIndex: 'status',
				key: 'status',
				width: 100,
				render: (text) => {
					if (isNotBlank(cpOfferFormGet) && (cpOfferFormGet.approvals !== 0 || cpOfferFormGet.approvals !== '0')) {
						return (<span>{shstatus(text)}</span>)
					}
					return ''
				}
			},
			{
				title: '审核结果',
				dataIndex: 'remarks',
				key: 'remarks',
				width: 250,
			},
			{
				title: '删除',
				key: 'action',
				width: 100,
				render: (text, record) => {
					if (((isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
							.length > 0 &&
						(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0')) ||
						(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')) ||
						(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4'))
					)) {
						return (
							<span>
								<Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
									<a>删除</a>
								</Popconfirm>
							</span>
						);
					}
					return ''
				}
			},
		];
		const yeardata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
		]
		const monthdata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
			{
				key: 11,
				value: 11
			},
			{
				key: 12,
				value: 12
			},
		]

		const that = this

		const parentMethodForms = {
			handleFormAdd: this.handleFormAdd,
			handleFormVisible: this.handleFormVisible,
			searchcode: this.searchcode,
			changecode: this.changecode,
			submitting1,
			selectForm: this.selectForm,
			showTable: this.showTablewl,
			modalRecord,
			FormVisible,
			billid,
			that
		};
		const parentMethods = {
			handleAdd: this.handleAdd,
			handleModalVisible: this.handleModalVisible,
			selectuser: this.selectuser,
			cpBillMaterialList: getcpBillMaterialAll,
			modalRecord,
			dispatch,
			location,
			that
		};
		const parentMethodsfirst = {
			handleAddfirst: this.handleAddfirst,
			handleModalVisiblefirst: this.handleModalVisiblefirst,
			modalRecordfirst,
			that
		}
		const parentMethodskh = {
			handleAddkh: this.handleAddkh,
			handleModalVisiblekh: this.handleModalVisiblekh,
			handleSelectRows: this.handleSelectRows,
			selectedRows,
			selectcustomer: this.selectcustomer,
			dispatch,
			levellist, levellist2, newdeptlist,
			modeluserList,
			that
		}
		const parentMethodspass = {
			handleAddpass: this.handleAddpass,
			handleModalVisiblepass: this.handleModalVisiblepass,
			modalVisiblepass,
			that
		}
		const appData = (apps) => {
			if (apps === 0 || apps === '0') {
				return '待分配'
			}
			if (apps === 1 || apps === '1') {
				return '待审核'
			}
			if (apps === 2 || apps === '2') {
				return '重新提交'
			}
			if (apps === 3 || apps === '3') {
				return '通过'
			}
			if (apps === 4 || apps === '4') {
				return '驳回'
			}
		}
		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell,
			},
		};
		const columnscopy = this.columnsTopwl.map(col => {
			if (!col.editable || cpOfferFormGet.approvals == 1 || cpOfferFormGet.approvals == 3) {
				return col
			}
			return {
				...col,
				onCell: record => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					handleSave: this.handleSave,
				}),
			};
		});
		const columnswl = [
			{
				title: '修改',
				width: 100,
				align: 'center',
				render: (text, record) => {
					if (((isNotBlank(this.props.cpOfferFormGet) && isNotBlank(this.props.cpOfferFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
							.length > 0 &&
						(this.props.cpOfferFormGet.approvals === 0 || this.props.cpOfferFormGet.approvals === '0')) ||
						(isNotBlank(this.props.cpOfferFormGet) && isNotBlank(this.props.cpOfferFormGet.createBy) && (this.props.cpOfferFormGet.approvals === 2 || this.props.cpOfferFormGet.approvals === '2')) ||
						(isNotBlank(this.props.cpOfferFormGet) && isNotBlank(this.props.cpOfferFormGet.createBy) && (this.props.cpOfferFormGet.approvals === 4 || this.props.cpOfferFormGet.approvals === '4'))
					)) {
						return <Fragment>
							<a onClick={() => this.showtopMX(record)}>修改</a>
						</Fragment>
					}
					return ''
				},
			},
			...columnscopy,
			{
				title: '基础操作',
				width: 100,
				align: 'center',
				render: (text, record) => {
					if (((isNotBlank(this.props.cpOfferFormGet) && isNotBlank(this.props.cpOfferFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
						&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
							.length > 0 &&
						(this.props.cpOfferFormGet.approvals === 0 || this.props.cpOfferFormGet.approvals === '0')) ||
						(isNotBlank(this.props.cpOfferFormGet) && isNotBlank(this.props.cpOfferFormGet.createBy) && (this.props.cpOfferFormGet.approvals === 2 || this.props.cpOfferFormGet.approvals === '2')) ||
						(isNotBlank(this.props.cpOfferFormGet) && isNotBlank(this.props.cpOfferFormGet.createBy) && (this.props.cpOfferFormGet.approvals === 4 || this.props.cpOfferFormGet.approvals === '4'))
					)) {
						return <Fragment>
							<Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
								<a>删除</a>
							</Popconfirm>
						</Fragment>
					}
					return ''
				},
			}
		]
		const onstyle = (val) => {
			if (isNotBlank(val) && val < 0.3) {
				return { color: '#52c41a' }
			}
			if (isNotBlank(val) && val >= 0.3 && val <= 0.5) {
				return { color: '#faad14' }
			}
			if (isNotBlank(val) && val > 0.5) {
				return { color: '#f5222d' }
			}
			return {}
		}
		return (
			<PageHeaderWrapper>
				<Card bordered={false}>
					<div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
						报价单
      </div>
					{isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
						<span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
							单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
					</div>}
					{isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
						<span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
							编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
					</div>}
					<Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
						<Card title="基本信息" bordered={false}>
							<Row gutter={16}>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='单号'>
										{getFieldDecorator('id', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.id) ? cpOfferFormGet.id : '',
											rules: [
												{
													required: false,
													message: '请输入单号',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='审批进度'>
										{getFieldDecorator('approvals', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) ?
												appData(cpOfferFormGet.approvals) : '',
											rules: [
												{
													required: false,
													message: '请输入审批进度',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={24} md={24} sm={24}>
									<FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
										{getFieldDecorator('orderCode', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.orderCode) ? cpOfferFormGet.orderCode : '',
											rules: [
												{
													required: false,
													message: '请输入订单编号',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='订单分类'>
										{getFieldDecorator('orderType', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.orderType) ? cpOfferFormGet.orderType : '',
											rules: [
												{
													required: false,
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
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.project) ? cpOfferFormGet.project : '',
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
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='业务渠道'>
										{getFieldDecorator('dicth', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.dicth) ? cpOfferFormGet.dicth : '',
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
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.businessType) ? cpOfferFormGet.businessType : '',
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
									<FormItem {...formItemLayout} label='结算类型'>
										{getFieldDecorator('settlementType', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.settlementType) ? cpOfferFormGet.settlementType : '',
											rules: [
												{
													required: false,
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
									<FormItem {...formItemLayout} label='保险公司'>
										{getFieldDecorator('insuranceCompanyId', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.insuranceCompanyId) ? cpOfferFormGet.insuranceCompanyId : '',
											rules: [
												{
													required: false,
													message: '请输入保险公司',
												},
											],
										})(<Select
											disabled
											style={{ width: '100%' }}
											allowClear
										>
											{
												isNotBlank(this.state.insuranceCompany) && this.state.insuranceCompany.length > 0 && this.state.insuranceCompany.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='品牌'>
										{getFieldDecorator('brand', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.brand) ? cpOfferFormGet.brand : '',
											rules: [
												{
													required: false,
													message: '请输入品牌',
												},
											],
										})(<Select
											disabled
											style={{ width: '100%' }}
											allowClear
										>
											{
												isNotBlank(this.state.brand) && this.state.brand.length > 0 && this.state.brand.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='集采客户'>
										{getFieldDecorator('ct', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.collectClientId) && isNotBlank(cpOfferFormGet.collectClientId.name) ? cpOfferFormGet.collectClientId.name : '',
											rules: [
												{
													required: false,
													message: '请输入集采客户',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='集采编码'>
										{getFieldDecorator('ccode', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.collectCode) ? cpOfferFormGet.collectCode : '',
											rules: [
												{
													required: false,
													message: '请输入集采编码',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='故障描述' className="allinputstyle">
                    <TextArea  disabled value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.errorDescription) ? cpOfferFormGet.errorDescription : ''} />
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
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) ? cpOfferFormGet.user.name : '')}
										/>
									</FormItem>

								</Col>

								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='编号'>
										<Input
											disabled
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) ? cpOfferFormGet.user.no : '')}
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='所属公司'>
										<Input

											disabled
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) && isNotBlank(cpOfferFormGet.user.office) ? cpOfferFormGet.user.office.name : '')}
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='所属区域'>
										<Select
											allowClear

											notFoundContent={null}
											style={{ width: '100%' }}
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) && isNotBlank(cpOfferFormGet.user.dictArea) ? cpOfferFormGet.user.dictArea : '')}

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


						<Card title="客户信息" className={styles.card} bordered={false}>
							<Row gutter={16}>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='客户'>
										<Input

											disabled
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) && isNotBlank(cpOfferFormGet.client.clientCpmpany) ? cpOfferFormGet.client.clientCpmpany : '')}
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='客户分类'>
										<Select
											allowClear
											style={{ width: '100%' }}

											disabled
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.classify : '')}
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
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.code : '')}
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='联系人'>
										<Input

											disabled
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.name : '')}
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='联系地址'>
										<Input

											disabled
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.address : '')}
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='移动电话'>
										<Input

											disabled
											value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.phone : '')}
										/>
									</FormItem>
								</Col>
							</Row>
						</Card>
						<Card title="总成信息" bordered={false}>
							<Row gutter={16}>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='进场类型'>
										{getFieldDecorator('assemblyEnterType', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.assemblyEnterType) ? cpOfferFormGet.assemblyEnterType : '',
											rules: [
												{
													required: false,
													message: '请输入进场类型',
												},
											],
										})(<Select
											disabled
											allowClear
											style={{ width: '100%' }}
										>
											{
												isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='品牌'>
										{getFieldDecorator('assemblyBrand', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id) ? isNotBlank(cpOfferFormGet.cab.assemblyBrand) ? cpOfferFormGet.cab.assemblyBrand : ''
												: isNotBlank(cpOfferFormGet.assemblyBrand) ? cpOfferFormGet.assemblyBrand : '',
											rules: [
												{
													required: false,
													message: '请输入品牌',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='车型/排量'>
										{getFieldDecorator('assemblyVehicleEmissions', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id) ? isNotBlank(cpOfferFormGet.cab.vehicleModel) ? cpOfferFormGet.cab.vehicleModel : ''
												: isNotBlank(cpOfferFormGet.assemblyVehicleEmissions) ? cpOfferFormGet.assemblyVehicleEmissions : '',
											rules: [
												{
													required: false,
													message: '请输入车型/排量',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='年份'>
										{getFieldDecorator('assemblyYear', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id) ? isNotBlank(cpOfferFormGet.cab.assemblyYear) ? cpOfferFormGet.cab.assemblyYear : ''
												: isNotBlank(cpOfferFormGet.assemblyYear) ? cpOfferFormGet.assemblyYear : '',
											rules: [
												{
													required: false,
													message: '请输入年份',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='总成型号'>
										{getFieldDecorator('assemblyModel', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id) ? isNotBlank(cpOfferFormGet.cab.assemblyModel) ? cpOfferFormGet.cab.assemblyModel : ''
												: isNotBlank(cpOfferFormGet.assemblyModel) ? cpOfferFormGet.assemblyModel : '',
											rules: [
												{
													required: false,
													message: '请输入总成型号',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
                <Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='总成号'>
										{getFieldDecorator('assemblyCode', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id) ? isNotBlank(cpOfferFormGet.cab.assemblyCode) ? cpOfferFormGet.cab.assemblyCode : ''
												: isNotBlank(cpOfferFormGet.assemblyCode) ? cpOfferFormGet.assemblyCode : '',
											rules: [
												{
													required: false,
													message: '请输入总成号',
												},
											],
										})(<Input disabled />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='车牌号'>
										<Input value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.plateNumber) ? cpOfferFormGet.plateNumber : ''} disabled />
									</FormItem>
								</Col>
								<Col lg={24} md={24} sm={24}>
									<FormItem {...formItemLayout} label="相片显示" className="allimgstyle">
										{getFieldDecorator('photo', {
											initialValue: ''
										})(
											<Upload
												accept="image/*"
												onChange={this.handleUploadChange}
												onRemove={this.handleRemove}
												beforeUpload={this.handlebeforeUpload}
												fileList={fileList}
												listType="picture-card"
												onPreview={this.handlePreview}
											/>
										)}
									</FormItem>
								</Col>
							</Row>
						</Card>
						<Card title="报价信息" bordered={false}>
							<Row gutter={16}>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='委托项目'>
										{getFieldDecorator('entrustProject', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.entrustProject) ? cpOfferFormGet.entrustProject : (isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.maintenanceProject) ? cpOfferFormGet.maintenanceProject : ''),
											rules: [
												{
													required: false,
													message: '请输入委托项目',
												},
											],
										})(
											<Select
												allowClear
												style={{ width: '100%' }}

												disabled={orderflag}
											>
												{
													isNotBlank(this.state.maintenance_project) && this.state.maintenance_project.length > 0 && this.state.maintenance_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
												}
											</Select>
										)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='注意事项'>
										{getFieldDecorator('noticeMatter', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.noticeMatter) ? cpOfferFormGet.noticeMatter : '',
											rules: [
												{
													required: false,
													message: '请输入注意事项',
												},
											],
										})(<Input disabled={orderflag && updataflag} />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='无质量担保项目'>
										{getFieldDecorator('noQualityProject', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.noQualityProject) ? cpOfferFormGet.noQualityProject : '',
											rules: [
												{
													required: false,
													message: '请输入无质量担保项目',
												},
											],
										})(<Input disabled={orderflag && updataflag} />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='质量担保项目'>
										{getFieldDecorator('qualityProject', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.qualityProject) ? cpOfferFormGet.qualityProject : '',
											rules: [
												{
													required: false,
													message: '请输入质量担保项目',
												},
											],
										})(<Input disabled={orderflag && updataflag} />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='结算方式约定'>
										{getFieldDecorator('settlementAgreement', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.settlementAgreement) ? cpOfferFormGet.settlementAgreement : '',
											rules: [
												{
													required: false,
													message: '请输入结算方式约定',
												},
											],
										})(<Input disabled={orderflag && updataflag} />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label="旧件返回时间">
										{getFieldDecorator('oldTime', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.oldTime) ? moment(cpOfferFormGet.oldTime) : null,
										})(
											<DatePicker
												disabled={orderflag && updataflag}

												format="YYYY-MM-DD"
												style={{ width: '100%' }}
											/>
										)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='报价类型'>
										{getFieldDecorator('offerType', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.offerType) ? cpOfferFormGet.offerType : '',
											rules: [
												{
													required: true,
													message: '请输入报价类型',
												},
											],
										})(<Select
											allowClear
											style={{ width: '100%' }}

											disabled={orderflag && updataflag}
										>
											{
												isNotBlank(this.state.offerType) && this.state.offerType.length > 0 && this.state.offerType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label="结算日期">
										{getFieldDecorator('workingDate', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.workingDate) ? moment(cpOfferFormGet.workingDate) : null,
											rules: [
												{
													required: true,
													message: '请选择结算日期',
												},
											],
										})(
											<DatePicker

												format="YYYY-MM-DD"
												style={{ width: '100%' }}
												disabled={orderflag && updataflag}
											/>
										)}
									</FormItem>
								</Col>
								<Col lg={24} md={24} sm={24}>
									<FormItem {...formItemLayout} label='其他约定事项' className="allinputstyle">
										{getFieldDecorator('otherMatter', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.otherMatter) ? cpOfferFormGet.otherMatter : '',
											rules: [
												{
													required: false,
													message: '请输入其他约定事项',
												},
											],
										})(<Input disabled={orderflag && updataflag} />)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label="默认回款时间">
										{getFieldDecorator('returnedDate', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.returnedDate) ? moment(cpOfferFormGet.returnedDate) : moment(moment().add(1,'months').format('YYYY-MM-DD')) ,
											rules: [
												{
													required: false,
													message: '请选择默认回款时间',
												},
											],
										})(
											<DatePicker
												disabled={orderflag && updataflag}

												format="YYYY-MM-DD"
												style={{ width: '100%' }}
											/>
										)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label="质保时间">
										{getFieldDecorator('zbtime', {
											rules: [
												{

													required: false,
													message: '请选择质保时间',
												},
											],
										})(
											<span>
												<Select
													allowClear
													style={{ width: '50%' }}
													disabled={orderflag}
													value={`${this.state.selectyear} 年`}
													onChange={this.editYear}
												>
													{
														isNotBlank(yeardata) && yeardata.length > 0 && yeardata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
													}
												</Select>
												<Select
													allowClear
													style={{ width: '50%' }}
													disabled={orderflag}
													value={`${this.state.selectmonth} 月`}
													onChange={this.editMonth}
												>
													{
														isNotBlank(monthdata) && monthdata.length > 0 && monthdata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
													}
												</Select>
											</span>
										)}
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='金额合计'>
										<Input

											value={isNotBlank(totalmoney) ? totalmoney : (isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.totalMoney) ? (isNotBlank(cpOfferFormGet.collectCode) ? getPrice(getPrice(cpOfferFormGet.totalMoney)) : getPrice(cpOfferFormGet.totalMoney)) : '')}
											disabled
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='意向单价'>
										<Input
											value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.intentionPrice) ? getPrice(cpOfferFormGet.intentionPrice) : ''}
											disabled
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='成本比'>
										<Input
											value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.b1) ? `${(Number(cpOfferFormGet.b1) * 100).toFixed(2)}%` : ''}
											style={onstyle(cpOfferFormGet.b1)}
											disabled
										/>
									</FormItem>
								</Col>
								<Col lg={12} md={12} sm={24}>
									<FormItem {...formItemLayout} label='意向价格比'>
										<Input
											value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.b2) ? `${(Number(cpOfferFormGet.b2) * 100).toFixed(2)}%` : ''}
											style={onstyle(cpOfferFormGet.b2)}
											disabled
										/>
									</FormItem>
								</Col>
								<Col lg={24} md={24} sm={24}>
									<FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
										{getFieldDecorator('remarks', {
											initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.remarks) ? cpOfferFormGet.remarks : '',
											rules: [
												{
													required: false,
													message: '请输入备注信息',
												},
											],
										})(
											<TextArea
												disabled={orderflag && updataflag}
												style={{ minHeight: 32 }}

												rows={2}
											/>
										)}
									</FormItem>
								</Col>
							</Row>
						</Card>
						<Card title="审核人管理" bordered={false}>
							{getFieldDecorator('members', {
								initialValue: '',
							})(
								<Table
									columns={columnssh}
									dataSource={showdata}
									pagination={false}
									rowClassName={record => (stylessp.editable ? stylessp.editable : '')}
								/>
							)}
							{isNotBlank(showdata) && showdata.length < 5 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
									.length > 0 &&
								<Button
									style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
									type="dashed"
									onClick={this.newMember}
									icon="plus"
									disabled={!((isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) &&
										(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0')) ||
										(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')) ||
										(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4'))
									)}
								>
									新增审核人
          </Button>
							}
							{isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.isOperation) && (cpOfferFormGet.isOperation === 1 || cpOfferFormGet.isOperation === '1') &&
								<div style={{ textAlign: 'center', marginTop: '15px' }}>
									<Button type="primary" onClick={() => this.showsp(3)}>
										审核通过
            </Button>
									<Button type="primary" style={{ marginLeft: '8px' }} onClick={() => this.showsp(2)}>
										审核驳回
            </Button>
								</div>
							}
						</Card>
						<FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
							<Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
								打印
          </Button>
							{isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '二次修改')
									.length > 0 &&
								<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
									{updataname}
								</Button>
							}
							{isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
									.length > 0 &&
								<span>
									<Button
										style={{ marginLeft: 8 }}
										type="primary"
										onClick={this.onsave}
										loading={submitting3 || submitting2}
										disabled={(!((isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) &&
											(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0')) ||
											(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')) ||
											(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4'))
										)) && updataflag}
									>
										保存
  </Button>
									<Button
										style={{ marginLeft: 8 }}
										type="primary"
										htmlType="submit"
										loading={submitting3 || submitting2}
										disabled={(!((isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) &&
											(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0')) ||
											(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')) ||
											(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4'))
										)) && updataflag}
									>
										提交
  </Button>
									{/* <Button
    style={{ marginLeft: 8 }}
    type="primary"
    onClick={() => this.showFormwlmx()}
    disabled={(!((isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) &&
                    (cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0')) ||
                    (isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2') ) ||
                    (isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4') )
                  )) && updataflag}
  >
                  新增物料明细
  </Button> */}
									{isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) &&
										(cpOfferFormGet.approvals === 1 || cpOfferFormGet.approvals === '1') && isNotBlank(cpOfferFormGet.createBy) &&
										<Button style={{ marginLeft: 8 }} loading={submitting3 || submitting2} onClick={() => this.repostSumbit()}>
											重新提交
</Button>
									}
									{
										orderflag && cpOfferFormGet.approvals === '3' &&
										<Button style={{ marginLeft: 8 }} loading={submitting3 || submitting2} onClick={() => this.onUndo(cpOfferFormGet.id)}>
											撤销
                      </Button>
									}
								</span>}
							<Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
								返回
          </Button>
						</FormItem>
					</Form>
				</Card>
				<div className={styles.standardList}>
					<Card bordered={false}>
						<div className={styles.tableList}>
							<div className={styles.tableListOperator}>
								{isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm').length > 0
									&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpOfferForm')[0].children.filter(item => item.name == '修改')
										.length > 0 &&
									<Button
										style={{ marginBottom: '10px' }}
										icon="plus"
										type="primary"
										onClick={() => this.showTable(true)}
										disabled={!((isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.approvals) &&
											(cpOfferFormGet.approvals === 0 || cpOfferFormGet.approvals === '0')) ||
											(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 2 || cpOfferFormGet.approvals === '2')) ||
											(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createBy) && (cpOfferFormGet.approvals === 4 || cpOfferFormGet.approvals === '4'))
										)}
									>
										新增明细
          </Button>
								}
							</div>
							<DragTable
								scroll={{ x: 700 }}
								components={components}
								rowClassName={() => 'editable-row'}
                bordered
                cpOfferFormGet={cpOfferFormGet}
                dataSource={dataSourcetop}
								columns={columnswl}
								// data={cpOfferDetailList}
								// bordered
								// columns={columns}
								// onSaveData={this.onSaveData}
								// onSelectRow={this.handleSelectRows}
								onChange={this.handleStandardTableChange}
							/>
						</div>
					</Card>
				</div>
				<div className={styles.standardList}>
					<Card bordered={false} title='物料明细'>
						<div className={styles.tableList}>
							<div className={styles.tableListOperator} />
							<DragTable
								scroll={{ x: 1400 }}
								// components={components}
                // rowClassName={() => 'editable-row'}
                cpOfferFormGet={cpOfferFormGet}
								bordered
								dataSource={dataSource}
								columns={columnswlin}
								onChange={this.handleStandardTableChange1}
							/>
						</div>
					</Card>
				</div>
				<CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
				<CreateForm {...parentMethods} modalVisible={modalVisible} />
				<CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
				<CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
				<CreateFormfirst {...parentMethodsfirst} modalVisiblefirst={modalVisiblefirst} />
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</PageHeaderWrapper>
		);
	}
}
export default CpOfferFormForm;
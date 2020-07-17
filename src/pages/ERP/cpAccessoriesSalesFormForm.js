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
  Modal,
  Row, Col,
  Popconfirm, Cascader
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpAccessoriesSalesFormForm.less';
import SearchTableList from '@/components/SearchTableList';
import StandardEditTable from '@/components/StandardEditTable';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();
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
const CreateFormkw = Form.create()(props => {
  const { handleModalVisiblekw, cpPjEntrepotList, selectkwflag, selectkw, dispatch, form,
    form: { getFieldDecorator }, changecode, that } = props;
  const columnskh = [
    {
      title: '操作',
      width: 150,
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectkw(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '仓库名',
      dataIndex: 'name',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '所属公司',
      dataIndex: 'office.name',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '更新时间',
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
      dataIndex: 'remarks',
      inputType: 'text',
      width: 100,
      editable: true,
    },
  ];
  const handleFormReset = () => {
    form.resetFields();

    that.state({
      cksearch: {}
    })

    dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
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
      ...that.state.cksearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
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

      that.setState({ cksearch: values })

      dispatch({
        type: 'cpPjEntrepot/cpPjEntrepot_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  const handleModalVisiblekwin = () => {
    form.resetFields();
    that.setState({
      cksearch: {}
    })
    handleModalVisiblekw()
  }


  return (
    <Modal
      title='选择所属仓库'
      visible={selectkwflag}
      onCancel={() => handleModalVisiblekwin()}
      width='80%'
    >
      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('name', {
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
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
            </span>
          </Col>
        </Form>
      </Row>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpPjEntrepotList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateForminkw = Form.create()(props => {
  const { handleModalVisibleinkw, cpPjStorageList, selectinkwflag, selectinkw, dispatch, form, form: { getFieldDecorator }, ckid } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectinkw(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '配件仓库',
      dataIndex: 'entrepotName',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '库位',
      dataIndex: 'name',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      align: 'center',
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
      dataIndex: 'remarks',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
  ];
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
        type: 'cpPjStorage/cpPjStorage_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          pjEntrepotId: isNotBlank(ckid) ? ckid : ''
        },
      });
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
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'cpPjStorage/cpPjStorage_List',
      payload: {
        pageSize: 10,
        current: 1,
        pjEntrepotId: isNotBlank(ckid) ? ckid : ''
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
      pjEntrepotId: isNotBlank(ckid) ? ckid : ''
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpPjStorage/cpPjStorage_List',
      payload: params,
    });
  };
  return (
    <Modal
      title='选择所属库位'
      visible={selectinkwflag}
      onCancel={() => handleModalVisibleinkw()}
      width='80%'
    >
      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('entrepotName', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="库位名">
              {getFieldDecorator('name', {
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
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
            </span>
          </Col>
        </Form>
      </Row>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpPjStorageList}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormForm = Form.create()(props => {
  const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator }, billid, searchcode,
    getcpBillMaterialAll, selectuser, handleSelectRows, selectedRows, showTable, submitting1, changecode, purchaseStatus, purchaseType, wlshowdata, selectinkwdata, showKwtable } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = { ...fieldsValue };
      values.repertoryPrice = setPrice(values.repertoryPrice)
      values.price = setPrice(values.price)
      values.needDate = moment(values.needDate).format("YYYY-MM-DD")
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
    if (isNotBlank(e)) {
      changecode(e.target.value)
    }
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
            <div>
              <Input

                value={isNotBlank(billid) ? billid : ''}
                onChange={modelsearch}
              />
              <Button style={{ marginLeft: 8 }} loading={submitting1} onClick={searchcode}>查询</Button>  <Button style={{ marginLeft: 8 }} onClick={() => showTable()}>选择</Button>
            </div>
          </FormItem>
        </Col>
        {/* <Col lg={12} md={12} sm={24}>
					<FormItem {...formItemLayout} label='库位'>
						{getFieldDecorator('kw', {
							initialValue: isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.name) ? selectinkwdata.name :
								(isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpPjStorage) && isNotBlank(wlshowdata.cpPjStorage.name) ? wlshowdata.cpPjStorage.name : ''),
							rules: [
								{
									required: false,
									message: '请选择库位',
								},
							],
						})
							(<Input
								
								disabled
								value={isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.name) ? selectinkwdata.name :
									(isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpPjStorage) && isNotBlank(wlshowdata.cpPjStorage.name) ? wlshowdata.cpPjStorage.name : '')}
							/>)}
						<Button style={{ marginLeft: 8 }} onClick={() => showKwtable()}>选择</Button>
					</FormItem>
				</Col> */}
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='原厂编码'>
            {getFieldDecorator('originalCode', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.originalCode) ? wlshowdata.cpBillMaterial.originalCode : ''),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.name) ? wlshowdata.cpBillMaterial.name : ''),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.twoCodeModel) ? modalRecord.twoCodeModel :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.two) && isNotBlank(wlshowdata.cpBillMaterial.two.name) ? wlshowdata.cpBillMaterial.two.name : ''),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCodeModel) ? modalRecord.oneCodeModel :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.one) && isNotBlank(wlshowdata.cpBillMaterial.one.model) ? wlshowdata.cpBillMaterial.one.model : ''),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.rCode) ? modalRecord.rCode :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.rCode) ? wlshowdata.cpBillMaterial.rCode : ''),
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
          <FormItem {...formItemLayout} label='单位'>
            {getFieldDecorator('unit', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.unit) ? modalRecord.unit :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.unit) ? wlshowdata.cpBillMaterial.unit : ''),
              rules: [
                {
                  required: false,
                  message: '单位',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='库存数量'>
            {getFieldDecorator('repertoryNumber', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceNumber) ? modalRecord.balanceNumber :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.balanceNumber) ? wlshowdata.balanceNumber : ''),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceMoney) ? getPrice(modalRecord.balanceMoney) :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.balancePrice) ? getPrice(wlshowdata.balancePrice) : 0),
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
          <FormItem {...formItemLayout} label='销售单价'>
            {getFieldDecorator('price', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.price) ? getPrice(modalRecord.price) :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.price) ? getPrice(wlshowdata.price) : ''),
              rules: [
                {
                  required: false,
                  message: '销售单价',
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='销售数量'>
            {getFieldDecorator('number', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? modalRecord.number :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.number) ? wlshowdata.number : ''),
              rules: [
                {
                  required: false,
                  message: '销售数量',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='备注信息'>
            {getFieldDecorator('remarks', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks :
                (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.remarks) ? wlshowdata.remarks : ''),
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
    getcpBillMaterialAll, selectuser, handleSelectRows, selectedRows, handleSearchChange, dispatch, location, that } = props;
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      title: '物料编码',
      dataIndex: 'billCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '一级编码',
      dataIndex: 'oneCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '二级编码',
      dataIndex: 'twoCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '一级编码型号',
      dataIndex: 'one.model',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '二级编码名称',
      dataIndex: 'two.name',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      inputType: 'text',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '原厂编码',
      dataIndex: 'originalCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '配件厂商',
      dataIndex: 'rCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      align: 'center',
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
      dataIndex: 'remarks',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
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

      that.setState({
        wlsearch: values,
        pageCurrent:1,
        pagePageSize:10
      })

      dispatch({
        type: 'cpBillMaterial/get_cpBillMaterial_All',
        payload: {
          // intentionId: location.query.id,
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
      wlsearch: {},
      pageCurrent:1,
      pagePageSize:10
    })
    dispatch({
      type: 'cpBillMaterial/get_cpBillMaterial_All',
      payload: {
        // intentionId: location.query.id,
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
      ...filters,
      tag:1
      // intentionId: location.query.id,
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

  const handleModalVisiblein = () => {
    // form.resetFields();
    // that.setState({
    //   wlsearch: {}
    // })
    handleModalVisible()
  }

  return (
    <Modal
      title='物料选择'
      visible={modalVisible}
      footer={null}
      onCancel={() => handleModalVisiblein()}
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
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={getcpBillMaterialAll}
        columns={selectcolumns}
      />
    </Modal>
  );
});
// const CreateFormkh = Form.create()(props => {
// 	const { handleModalVisiblekh, cpClientList, selectkhflag, selectcustomer, handleSearchChange, form: { getFieldDecorator }, form, dispatch, that } = props;
// 	const columnskh = [
// 		{
// 			title: '操作',
// 			width: 100,
// 			align: 'center',
// 			fixed: 'left',
// 			render: record => (
// 				<Fragment>
// 					<a onClick={() => selectcustomer(record)}>
// 						选择
//     </a>
// 				</Fragment>
// 			),
// 		},
// 		{
// 			title: '客户',
// 			dataIndex: 'clientCpmpany',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 240,
// 			editable: true,
// 		},
// 		{
// 			title: '客户编码',
// 			dataIndex: 'code',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 100,
// 			editable: true,
// 		},
// 		{
// 			title: '联系人',
// 			dataIndex: 'name',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '客户分类',
// 			dataIndex: 'classify',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 100,
// 			editable: true,
// 		},
// 		{
// 			title: '客户级别',
// 			dataIndex: 'level',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 100,
// 			editable: true,
// 		},
// 		{
// 			title: '联系地址',
// 			dataIndex: 'address',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '邮箱',
// 			dataIndex: 'email',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '移动电话',
// 			dataIndex: 'phone',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '电话',
// 			dataIndex: 'tel',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '传真',
// 			dataIndex: 'fax',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '税号',
// 			dataIndex: 'dutyParagraph',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '开户账号',
// 			dataIndex: 'openNumber',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '开户银行',
// 			dataIndex: 'openBank',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '开户地址',
// 			dataIndex: 'openAddress',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '开户电话',
// 			dataIndex: 'openTel',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		},
// 		{
// 			title: '创建者',
// 			dataIndex: 'user.name',
// 			inputType: 'text',
// 			align: 'center',
// 			align: 'center',
// 			width: 100,
// 			editable: false,
// 		},
// 		{
// 			title: '更新时间',
// 			dataIndex: 'finishDate',
// 			editable: true,
// 			align: 'center',
// 			inputType: 'dateTime',
// 			width: 150,
// 			sorter: true,
// 			render: (val)=>{
// 					if(isNotBlank(val)){
// 					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
// 					}
// 					return ''
// 				}
// 		},
// 		{
// 			title: '备注信息',
// 			dataIndex: 'remarks',
// 			inputType: 'text',
// 			align: 'center',
// 			width: 150,
// 			editable: true,
// 		}
// 	];
// 	const handleFormReset = () => {
// 		form.resetFields();
// 		that.setState({
// 			khsearch: {}
// 		})
// 		dispatch({
// 			type: 'cpClient/cpClient_List',
// 			payload: {
// 				genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
// 				pageSize: 10,
// 				current: 1,
// 			},
// 		});
// 	};
// 	const handleStandardTableChange = (pagination, filtersArg, sorter) => {
// 		const filters = Object.keys(filtersArg).reduce((obj, key) => {
// 			const newObj = { ...obj };
// 			newObj[key] = getValue(filtersArg[key]);
// 			return newObj;
// 		}, {});
// 		const params = {
// 			...that.state.khsearch,
// 			current: pagination.current,
// 			genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
// 			pageSize: pagination.pageSize,
// 			...filters,
// 		};
// 		if (sorter.field) {
// 			params.sorter = `${sorter.field}_${sorter.order}`;
// 		}
// 		dispatch({
// 			type: 'cpClient/cpClient_List',
// 			payload: params,
// 		});
// 	};
// 	const handleModalkh = () => {
// 		form.resetFields();
// 		handleModalVisiblekh()
// 	}
// 	const formItemLayout = {
// 		labelCol: {
// 			xs: { span: 24 },
// 			sm: { span: 7 },
// 		},
// 		wrapperCol: {
// 			xs: { span: 24 },
// 			sm: { span: 12 },
// 			md: { span: 10 },
// 		},
// 	};
// 	const handleSearch = (e) => {
// 		e.preventDefault();
// 		form.validateFields((err, fieldsValue) => {
// 			if (err) return;
// 			const values = {
// 				...fieldsValue,
// 			};
// 			Object.keys(values).map((item) => {
// 				if (values[item] instanceof moment) {
// 					values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
// 				}
// 				return item;
// 			});


// 			that.setState({
// 				khsearch: values
// 			})

// 			dispatch({
// 				type: 'cpClient/cpClient_List',
// 				payload: {
// 					...values,
// 					genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
// 					pageSize: 10,
// 					current: 1,
// 				},
// 			});
// 		});
// 	};

// 	const handleModalVisiblekhin = () => {
// 		form.resetFields();
// 		that.setState({
// 			khsearch: {}
// 		})
// 		handleModalVisiblekh()
// 	}


// 	return (
// 		<Modal
// 			title='选择客户'
// 			visible={selectkhflag}
// 			onCancel={() => handleModalVisiblekh()}
// 			width='80%'
// 		>
// 			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
// 				<Form onSubmit={handleSearch}>
// 					<Col md={8} sm={24}>
// 						<FormItem {...formItemLayout} label="客户">
// 							{getFieldDecorator('clientCpmpany', {
// 								initialValue: ''
// 							})(
// 								<Input  />
// 							)}
// 						</FormItem>
// 					</Col>
// 					<Col md={8} sm={24}>
// 						<FormItem {...formItemLayout} label="联系人">
// 							{getFieldDecorator('name', {
// 								initialValue: ''
// 							})(
// 								<Input  />
// 							)}
// 						</FormItem>
// 					</Col>
// 					<Col md={8} sm={24}>
// 						<span className={styles.submitButtons}>
// 							<Button type="primary" htmlType="submit">
// 								查询
//             </Button>
// 							<Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
// 								重置
//             </Button>
// 							<a style={{ marginLeft: 8 }} onClick={handleSearchChange}>
// 								过滤其他 <Icon type="down" />
// 							</a>
// 						</span>
// 					</Col>
// 				</Form>
// 			</Row>
// 			<StandardTable
// 				bordered
// 				scroll={{ x: 1050 }}
// 				onChange={handleStandardTableChange}
// 				data={cpClientList}
// 				columns={columnskh}
// 			/>
// 		</Modal>
// 	);
// });
const CreateFormzc = Form.create()(props => {
  const { handleModalVisiblezc, cpAssemblyBuildList, selectzcflag, selectcustomer1 } = props;
  const columnszc = [
    {
      title: '总成型号',
      dataIndex: 'assemblyModel',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '业务项目',
      dataIndex: 'project',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '总成号',
      dataIndex: 'assemblyCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '大号',
      dataIndex: 'maxCode',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '小号',
      dataIndex: 'minCode',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '总成分类',
      dataIndex: 'assemblyType',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '类型编码',
      dataIndex: 'lxCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '分类编码',
      dataIndex: 'flCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '技术参数',
      dataIndex: 'technicalParameter',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '车型',
      dataIndex: 'vehicleModel',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '品牌',
      dataIndex: 'assemblyBrand',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '年份',
      dataIndex: 'assemblyYear',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '品牌编码',
      dataIndex: 'brandCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '一级编码型号',
      dataIndex: 'oneCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '绑定系列数量',
      dataIndex: 'bindingNumber',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '原厂编码',
      dataIndex: 'originalCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '再制造编码',
      dataIndex: 'makeCode',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '提成类型',
      dataIndex: 'pushType',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      align: 'center',
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
      dataIndex: 'remarks',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    }
  ];
  return (
    <Modal
      title='选择总成信息'
      visible={selectzcflag}
      onCancel={() => handleModalVisiblezc()}
      width='80%'
    >
      <StandardTable
        bordered
        scroll={{ x: 2300 }}
        data={cpAssemblyBuildList}
        columns={columnszc}
      />
    </Modal>
  );
});

const CreateFormywy = Form.create()(props => {
  const {
    handleModalVisibleywy,
    userlist,
    selectflag,
    selectuserywy,
    levellist,
    levellist2,
    newdeptlist,
    form,
    dispatch,
    handleSearchChange,
    that,
  } = props;
  const { getFieldDecorator } = form;
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectuserywy(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: '编号',
      dataIndex: 'no',
      align: 'center',
      width: 150,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 150,
      align: 'center',
      render: text => {
        if (isNotBlank(text)) {
          if (text === 1 || text === '1') {
            return <span>男</span>;
          }
          if (text === 0 || text === '0') {
            return <span>女</span>;
          }
        }
        return '';
      },
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
      width: 150,
      render: text => {
        if (isNotBlank(text)) {
          if (text === 0 || text === '0') {
            return <span>在职</span>;
          }
          if (text === 1 || text === '1') {
            return <span>离职</span>;
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
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.companyName)) {
        values.companyName = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      }

      that.setState({
        ywysearch: values,
      });

      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
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
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      ywysearch: {},
    });
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10,
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
      ...that.state.ywysearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'sysuser/fetch',
      payload: params,
    });
  };
  const handleModalywy = () => {
    // form.resetFields();
    // that.setState({
    //   ywysearch: {},
    // });
    handleModalVisibleywy();
  };
  return (
    <Modal
      title="选择业务员"
      visible={selectflag}
      className="modelsearch"
      onCancel={() => handleModalywy()}
      width="80%"
    >
      <div className={styles.tableList}>
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
                {getFieldDecorator('companyName', {
                  initialValue: '',
                })(
                  <Select style={{ width: '100%' }} allowClear>
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
          data={userlist}
          columns={selectcolumns}
          onChange={handleStandardTableChange}
        />
      </div>
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const {
    handleModalVisiblekh,
    cpClientList,
    selectkhflag,
    selectcustomer,
    handleSearchChange,
    form,
    dispatch,
    that,
  } = props;
  const { getFieldDecorator } = form;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectcustomer(record)}>选择</a>
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
      title: '结账周期',
      dataIndex: 'period',
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
      render: val => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
        return '';
      },
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
  const handleSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      Object.keys(values).map(item => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });

      that.setState({
        khsearch: values,
      });

      dispatch({
        type: 'cpClient/cpClient_List',
        payload: {
          ...values,
          genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
          pageSize: 10,
          current: 1,
        },
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      khsearch: {},
    });
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
        pageSize: 10,
        current: 1,
      },
    });
  };
  const handleModalkh = () => {
    form.resetFields();
    that.setState({
      khsearch: {},
    });
    handleModalVisiblekh();
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      ...that.state.khsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      genTableColumn: isNotBlank(that.state.historyfilter) ? that.state.historyfilter : [],
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpClient/cpClient_List',
      payload: params,
    });
  };

  const handleModalkhin = () => {
    // form.resetFields();
    // that.setState({
    //   khsearch: {},
    // });
    handleModalkh();
  };

  return (
    <Modal title="选择客户" visible={selectkhflag} onCancel={() => handleModalkhin()} width="80%">
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Form onSubmit={handleSearch}>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="客户">
                {getFieldDecorator('clientCpmpany', {
                  initialValue: '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout} label="联系人">
                {getFieldDecorator('name', {
                  initialValue: '',
                })(<Input />)}
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
      </div>
    </Modal>
  );
});

const CreateFormjc = Form.create()(props => {
  const { handleModalVisiblejc, cpCollecClientList, selectjcflag, selectjc } = props;
  const columnsjc = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: record => (
        <Fragment>
          <a onClick={() => selectjc(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '返点',
      dataIndex: 'rebates',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
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
  return (
    <Modal
      title="选择集采客户"
      visible={selectjcflag}
      onCancel={() => handleModalVisiblejc()}
      width="80%"
    >
      <StandardTable bordered scroll={{ x: 1050 }} data={cpCollecClientList} columns={columnsjc} />
    </Modal>
  );
});
const CreateFormcode = Form.create()(props => {
  const {
    handleModalVisiblecode,
    cpCollecCodeList,
    selectcodeflag,
    selectcode,
    selectjcdata,
    form: { getFieldDecorator },
    form,
    dispatch,
    that,
    collecCid
  } = props;
  const columnscode = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: record => (
        <Fragment>
          <a onClick={() => selectcode(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      inputType: 'text',
      width: 250,
      align: 'center',
      editable: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '金额',
      dataIndex: 'money',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
      render: text => getPrice(text),
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

  const handleSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      Object.keys(values).map(item => {
        if (values[item] instanceof moment) {
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });

      that.setState({
        bmsearch: values,
      });

      dispatch({
        type: 'cpCollecCode/cpCollecCode_List',
        payload: {
          pageSize: 10,
          'collecClient.id': isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(collecCid)?collecCid:'',
          ...values,
        },
      });

      //   dispatch({
      // 	type: 'cpBillMaterial/get_cpBill_caterialList2',
      // 	payload: {
      // 	  pageSize: 500,
      // 	  ...values,
      // 	  parent1:location.query.id,
      // 	  current: 1,
      // 	}
      //   });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      bmsearch: {},
    });
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
        'collecClient.id': isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(collecCid)?collecCid:'',
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
      ...that.state.bmsearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      'collecClient.id': isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(collecCid)?collecCid:'',
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: params,
    });
  };

  const handleModalVisiblecodein = () => {
    // form.resetFields();
    // that.setState({
    //   bmsearch: {},
    // });
    handleModalVisiblecode();
  };

  return (
    <Modal
      title="选择集采编码"
      visible={selectcodeflag}
      onCancel={() => handleModalVisiblecodein()}
      width="80%"
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="编码">
              {getFieldDecorator('code', {
                initialValue: '',
              })(<Input />)}
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
        scroll={{ x: 700 }}
        data={cpCollecCodeList}
        columns={columnscode}
        onChange={handleStandardTableChange}
      />
    </Modal>
  );
});


@connect(({ cpAccessoriesSalesForm, loading, cpClient, cpAssemblyForm, cpAssemblyBuild, cpBillMaterial, cpPurchaseDetail,
  cpPjEntrepot, cpPjStorage, syslevel, sysdept, sysuser, cpCollecCode, cpCollecClient }) => ({
    ...cpAccessoriesSalesForm,
    ...cpClient,
    ...cpAssemblyForm,
    ...cpAssemblyBuild,
    ...cpBillMaterial,
    ...cpPurchaseDetail,
    ...cpPjEntrepot,
    ...cpPjStorage,
    ...syslevel,
    ...sysdept,
    ...sysuser,
    ...cpCollecCode,
    ...cpCollecClient,
    newdeptlist: sysdept.deptlist.list,
    submitting1: loading.effects['cpBillMaterial/cpBillMaterial_search_List'],
    submitting: loading.effects['form/submitRegularForm'],
    submitting2: loading.effects['cpAccessoriesSalesForm/cpAccessoriesSalesForm_Add']
  }))
@Form.create()
class CpAccessoriesSalesFormForm extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
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
      // {
      // 	title: '库位',
      // 	dataIndex: 'cpPjStorage.name',
      // 	inputType: 'text',
      // 	width: 100,
      // 	editable: false,
      // },
      {
        title: '需求日期',
        dataIndex: 'needDate',
        editable: true,
        inputType: 'dateTime',
        width: 100,
        sorter: false,
        render: (val) => {
          if (isNotBlank(val)) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
          return ''
        }
      },
      {
        title: '库存单价',
        dataIndex: 'balancePrice',
        inputType: 'text',
        width: 100,
        editable: false,
        render: (text) => (getPrice(text))
      },
      {
        title: '库存数量',
        dataIndex: 'balanceNumber',
        inputType: 'text',
        width: 100,
        editable: false,
      },
      {
        title: '单价',
        dataIndex: 'price',
        inputType: 'text',
        width: 100,
        editable: false,
        render: (text) => (getPrice(text))
      },
      {
        title: '数量',
        dataIndex: 'number',
        inputType: 'text',
        width: 100,
        editable: false,
      },
      {
        title: '金额',
        dataIndex: 'money',
        inputType: 'text',
        width: 100,
        editable: false,
        render: (text) => (getPrice(text))
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
        width: 150,
        editable: false,
      },
    ]
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectkhflag: false,
      selectkhdata: [],
      sumbitflag: false,
      selectzcflag: false,
      selectzcdata: false,
      orderflag: false,
      typeflag: '',
      selectyear: 0,
      selectmonth: 0,
      wlshowdata: {},
      ckid: '',
      FormVisible: false,
      confirmflag: true,
      newflag: true,
      pageCurrent:1,
      pagePageSize:10,
      location: getLocation(),
      collecCid:'',
      selthis1: ''
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAccessoriesSalesForm/cpAccessoriesSalesForm_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesSalesForm').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesSalesForm')[0].children.filter(item => item.name == '修改')
                .length == 0)) {
            this.setState({ orderflag: true, newflag: true })
          } else {
            this.setState({
              orderflag: false,
            })
            if (isNotBlank(res.data.isNewOrder)) {
              this.setState({
                newflag: false,
              })
            }
          }


          this.props.form.setFieldsValue({
            collectClientname:
              isNotBlank(res.data.collectClient) && isNotBlank(res.data.collectClient.name)
                ? res.data.collectClient.name
                : '',
            collectCodename:
              isNotBlank(res.data) && isNotBlank(res.data.collectCode) ? res.data.collectCode : '',
          })

          if (isNotBlank(res.data) && isNotBlank(res.data.user) && isNotBlank(res.data.user.name)) {
            this.props.form.setFieldsValue({
              ywy:
                isNotBlank(res.data.user) && isNotBlank(res.data.user.name)
                  ? res.data.user.name
                  : getStorage('username'),
            });
          }

          if (isNotBlank(res.data.dicth)) {
            this.setState({
              selthis: res.data.dicth,
            });
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
          if (isNotBlank(res.data) && isNotBlank(res.data.type)) {
            this.setState({
              typeflag: res.data.type
            })
          }

          if (isNotBlank(res.data.collectClient) && isNotBlank(res.data.collectClient.id)) {
            this.setState({
              collecCid:res.data.collectClient.id
            })
            dispatch({
              type: 'cpCollecCode/cpCollecCode_List',
              payload: {
                pageSize: 10,
                'collecClient.id': res.data.collectClient.id,
              },
            });
          }

          dispatch({
              type: 'sysarea/getFlatCode',
              payload: {
                id: location.query.id,
                type: 'PJXD'
              },
              callback: (imgres) => {
                this.setState({
                  srcimg: imgres.msg.split('|')[0]
                })
              }
            })

          // if (isNotBlank(res.data) && isNotBlank(res.data.type) && res.data.type == 5) {
          //   dispatch({
          //     type: 'sysarea/getFlatCode',
          //     payload: {
          //       id: location.query.id,
          //       type: 'PJSM'
          //     },
          //     callback: (imgres) => {
          //       this.setState({
          //         srcimg: imgres.msg.split('|')[0]
          //       })
          //     }
          //   })
          // } else {
          //   dispatch({
          //     type: 'sysarea/getFlatCode',
          //     payload: {
          //       id: location.query.id,
          //       type: 'PJXD'
          //     },
          //     callback: (imgres) => {
          //       this.setState({
          //         srcimg: imgres.msg.split('|')[0]
          //       })
          //     }
          //   })
          // }
          dispatch({
            type: 'sysarea/getFlatOrderdCode',
            payload: {
              id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
              type: 'PJXD'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
            }
          })
          this.props.form.setFieldsValue({
            ck: isNotBlank(res.data.cpPjEntrepot) && isNotBlank(res.data.cpPjEntrepot.name) ? res.data.cpPjEntrepot.name : ''
          });
          if (isNotBlank(res.data.cpPjEntrepot) && isNotBlank(res.data.cpPjEntrepot.id)) {
            this.setState({
              ckid: res.data.cpPjEntrepot.id
            })
          }
          if (isNotBlank(res.data.qualityTime)) {
            this.setState({
              selectyear: res.data.qualityTime.split(',')[0],
              selectmonth: res.data.qualityTime.split(',')[1]
            })
          }
        }
      });
      dispatch({
        type: 'cpPurchaseDetail/cpPurchaseDetail_List',
        payload: {
          // intentionId: location.query.id,
          pageSize: 10,
          purchaseId: location.query.id
        }
      });
    } else {
      dispatch({
        type: 'cpPjEntrepot/cpPjEntrepot_List',
        payload: {
          current: 1,
          pageSize: 10
        },
        callback:(res)=>{
          if(isNotBlank(res.list)&&isNotBlank(res.list.length>0)){
             this.setState({
              selectkwdata:res.list[0]
             })
             this.props.form.setFieldsValue({
                ck:res.list[0].name
             })
          }
        }
      })
      this.props.form.setFieldsValue({
        ywy: getStorage('username'),
      });
      this.setState({
        newflag: false,
      })
    }

    dispatch({
      type: 'cpClient/cpClient_List',
      payload: {
        pageSize: 10,
        genTableColumn: isNotBlank(this.state.historyfilter) ? this.state.historyfilter : [],
      }
    });
    dispatch({
      type: 'cpClient/cpClient_SearchList'
    })

    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10,
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
        pageSize: 100
      },
    });
    dispatch({
      type: 'syslevel/query_office',
    });
    dispatch({
      type: 'sysdept/query_dept',
    });

    dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
      payload: {
        current: 1,
        pageSize: 10
      }
    })

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
          , maintenance_project, is_photograph, del_flag, classify, client_level,
          area
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpAccessoriesSalesForm/clear',
    });
    dispatch({
      type: 'cpPurchaseDetail/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpAccessoriesSalesFormGet } = this.props;
    const { addfileList, location, selectkhdata, selectzcdata, selectdata, selectjcdata, selectcodedata, selectkwdata, selectyear, selectmonth } = this.state;
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


        value.collectClient = {};
        value.collectClient.id =
          isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)
            ? selectjcdata.id
            : isNotBlank(cpAccessoriesSalesFormGet) &&
              isNotBlank(cpAccessoriesSalesFormGet.collectClient) &&
              isNotBlank(cpAccessoriesSalesFormGet.collectClient.id)
              ? cpAccessoriesSalesFormGet.collectClient.id
              : '';

        value.collectCodeid =
          isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)
            ? selectcodedata.id
            : isNotBlank(cpAccessoriesSalesFormGet) &&
              isNotBlank(cpAccessoriesSalesFormGet.collectCodeid)
              ? cpAccessoriesSalesFormGet.collectCodeid
              : ''

        if (!isNotBlank(cpAccessoriesSalesFormGet) || (isNotBlank(cpAccessoriesSalesFormGet) && !isNotBlank(cpAccessoriesSalesFormGet.isNewOrder))) {
          value.isNewOrder = 1
          value.user = {}
          value.user.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
            isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.user) && isNotBlank(cpAccessoriesSalesFormGet.user.id) ? cpAccessoriesSalesFormGet.user.id : getStorage('userid')
        }

        value.qualityTime = `${selectyear} , ${selectmonth}`
        // value.intentionPrice = setPrice(value.intentionPrice)
        value.plateNumber = isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.plateNumber) ? cpAccessoriesSalesFormGet.plateNumber : ''
        value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")

        value.client = {}
        value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client)) ? cpAccessoriesSalesFormGet.client.id : '')
        value.cpPjEntrepot = {}
        value.cpPjEntrepot.id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id :
          (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.cpPjEntrepot) && isNotBlank(cpAccessoriesSalesFormGet.cpPjEntrepot.id) ? cpAccessoriesSalesFormGet.cpPjEntrepot.id : '')
        value.orderStatus = 1
        dispatch({
          type: 'cpAccessoriesSalesForm/cpAccessoriesSalesForm_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_accessories_sales_form_form?id=${location.query.id}`)
            // router.push('/business/process/cp_accessories_sales_form_list')
          }
        })
      }
    });
  };

  onsave = e => {
    const { dispatch, form, cpAccessoriesSalesFormGet } = this.props;
    const { addfileList, location, selectkhdata, selectzcdata, selectjcdata, selectcodedata, selectdata, selectkwdata, selectyear, selectmonth } = this.state;
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

        value.collectClient = {};
        value.collectClient.id =
          isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)
            ? selectjcdata.id
            : isNotBlank(cpAccessoriesSalesFormGet) &&
              isNotBlank(cpAccessoriesSalesFormGet.collectClient) &&
              isNotBlank(cpAccessoriesSalesFormGet.collectClient.id)
              ? cpAccessoriesSalesFormGet.collectClient.id
              : '';

        value.collectCodeid =
          isNotBlank(selectcodedata) && isNotBlank(selectcodedata.id)
            ? selectcodedata.id
            : isNotBlank(cpAccessoriesSalesFormGet) &&
              isNotBlank(cpAccessoriesSalesFormGet.collectCodeid)
              ? cpAccessoriesSalesFormGet.collectCodeid
              : ''


        if (!isNotBlank(cpAccessoriesSalesFormGet) || (isNotBlank(cpAccessoriesSalesFormGet) && !isNotBlank(cpAccessoriesSalesFormGet.isNewOrder))) {
          value.isNewOrder = 1
          value.user = {}
          value.user.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
            isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.user) && isNotBlank(cpAccessoriesSalesFormGet.user.id) ? cpAccessoriesSalesFormGet.user.id : getStorage('userid')
        }

        value.qualityTime = `${selectyear} , ${selectmonth}`
        // value.intentionPrice = setPrice(value.intentionPrice)
        value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
        value.client = {}
        value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client)) ? cpAccessoriesSalesFormGet.client.id : '')
        value.cpPjEntrepot = {}
        value.cpPjEntrepot.id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id :
          (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.cpPjEntrepot) && isNotBlank(cpAccessoriesSalesFormGet.cpPjEntrepot.id) ? cpAccessoriesSalesFormGet.cpPjEntrepot.id : '')
        value.orderStatus = 0
        dispatch({
          type: 'cpAccessoriesSalesForm/cpAccessoriesSalesForm_Add',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_accessories_sales_form_form?id=${res.data.id}`)
            // router.push('/business/process/cp_accessories_sales_form_list')
          }
        })
      }
    });
  };

  onselectzc = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpAssemblyBuild/cpAssemblyBuild_List',
      payload: {
        pageSize: 10,
      }
    });
    this.setState({
      selectzcflag: true
    })
  }

  onCancelCancel = () => {
    router.push('/business/process/cp_accessories_sales_form_list')
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
    const { dispatch } = this.props
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
      dispatch({
        type: 'upload/upload_img',
        payload: {
          file,
          name: 'cpAccessoriesSales'
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

  selectcustomer1 = (record) => {
    this.setState({
      selectzcdata: record,
      selectzcflag: true
    })
  }

  selectcustomer = (record) => {
    this.setState({
      selectkhdata: record,
      selectkhflag: false
    })
  }

  handleModalVisiblezc = flag => {
    this.setState({
      selectzcflag: !!flag
    });
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

  onRevocation = (record) => {
    Modal.confirm({
      title: '撤销该配件销售订单',
      content: '确定撤销该配件销售订单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.onUndo(record),
    });
  }

  onUndo = (id) => {
    const { dispatch } = this.props;
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
      if (isNotBlank(id)) {
        dispatch({
          type: 'cpAccessoriesSalesForm/CpAccessoriesSalesForm_undo',
          payload: { id },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/business/process/cp_accessories_sales_form_form?id=${location.query.id}`)
            // router.push('/business/process/cp_accessories_sales_form_list')
          }
        })
      }
    }
  }

  editYear = (val) => {
    if (isNotBlank(val)) {
      this.setState({ selectyear: val })
    } else {
      this.setState({ selectyear: 0 })
    }
  }

  editMonth = (val) => {
    if (isNotBlank(val)) {
      this.setState({ selectmonth: val })
    } else {
      this.setState({ selectmonth: 0 })
    }
  }

  showForm = (res) => {
    const { ckid } = this.state
    this.setState({
      selectinkwdata: {}
    })
    if (isNotBlank(ckid)) {
      if (isNotBlank(res) && isNotBlank(res.id)) {
        this.setState({
          FormVisible: true,
          wlshowdata: res
        })
      } else {
        this.setState({
          FormVisible: true
        })
      }
    } else {
      message.error('请先选择仓库')
    }
  }

  handleFormAdd = (values) => {
    const { dispatch } = this.props
    const { location, modalRecord, wlshowdata, selectinkwdata, editdata } = this.state
    const newdata = { ...values }
    if (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.id)) {
      newdata.id = wlshowdata.id
    }
    dispatch({
      type: 'cpAccessoriesSalesForm/update_AccessoriSales',
      payload: {
        purchaseId: location.query.id,
        'cpPjStorage.id': isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id) ? selectinkwdata.id :
          (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpPjStorage) && isNotBlank(wlshowdata.cpPjStorage.id) ? wlshowdata.cpPjStorage.id : ''),
        billId: isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? modalRecord.id :
          (isNotBlank(wlshowdata) && isNotBlank(wlshowdata.cpBillMaterial) && isNotBlank(wlshowdata.cpBillMaterial.id) && isNotBlank(wlshowdata.cpBillMaterial.id) ? wlshowdata.cpBillMaterial.id : ''),
        ...newdata,
      },
      callback: () => {
        this.setState({
          FormVisible: false,
          modalRecord: [],
          wlshowdata: {},
          selectinkwdata: {},
          billid: ''
        })
        dispatch({
          type: 'cpAccessoriesSalesForm/cpAccessoriesSalesForm_Get',
          payload: {
            id: location.query.id,
          }
        })
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            // intentionId: location.query.id,
            pageSize: 10,
            purchaseId: location.query.id
          }
        });
      }
    })
  }

  handleDeleteClick = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpAccessoriesSalesForm/delete_AccesssoriesSales',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpAccessoriesSalesForm/cpAccessoriesSalesForm_Get',
          payload: {
            id: location.query.id,
          }
        });
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id,
            pageSize: 10,
          }
        });
      }
    });
  }

  showKwtable = () => {
    const { dispatch } = this.props
    const { ckid } = this.state
    dispatch({
      type: 'cpPjStorage/cpPjStorage_List',
      payload: {
        pageSize: 10,
        pjEntrepotId: isNotBlank(ckid) ? ckid : ''
      }
    });
    this.setState({
      selectinkwflag: true
    });
  }

  showTable = () => {
    const { dispatch } = this.props
    const { location ,wlsearch ,pageCurrent ,pagePageSize} = this.state
    dispatch({
      type: 'cpBillMaterial/get_cpBillMaterial_All',
      // type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        // intentionId: location.query.id,
        ...wlsearch,
        current:pageCurrent,
        pageSize:pagePageSize,
        tag:1
      }
    });
    this.setState({
      modalVisible: true
    });
  }

  selectuser = (res) => {
    const { dispatch } = this.props;
    const { selectedRows, location, ckid } = this.state;
    this.setState({
      modalVisible: false,
      modalRecord: res,
      billid: res.billCode
    })
    dispatch({
      type: 'cpPurchaseDetail/select_Detail',
      payload: {
        billId: res.id,
        'cpPjEntrepot.id': isNotBlank(ckid) ? ckid : ''
      },
      callback: (res) => {
        this.setState({
          selectinkwdata: res
        })
      }
    })
  }

  handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag,
      modalRecord: {},
      billid: '',
      wlshowdata: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  onselectkw = () => {
    this.setState({
      selectkwflag: true
    })
  }

  selectkw = (record) => {
    const { selectkhdata, selectyear, selectmonth, location } = this.state
    const { dispatch, cpAccessoriesSalesFormGet, form } = this.props
    this.props.form.setFieldsValue({
      ck: isNotBlank(record) && isNotBlank(record.name) ? record.name : ''
    });
    this.setState({
      selectkwdata: record,
      selectkwflag: false,
      ckid: record.id
    })
    const value = form.getFieldsValue()
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      value.id = location.query.id;
    }
    if (value.qualityTime) {
      value.qualityTime = `${selectyear} , ${selectmonth}`
    }
    if (value.intentionPrice) {
      value.intentionPrice = setPrice(value.intentionPrice)
    }
    if (value.deliveryDate) {
      value.deliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD")
    }
    value.client = {}
    value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client)) ? cpAccessoriesSalesFormGet.client.id : '')
    value.cpPjEntrepot = {}
    value.cpPjEntrepot.id = record.id
    value.orderStatus = -1
    dispatch({
      type: 'cpAccessoriesSalesForm/cpAccessoriesSalesForm_save_Add',
      payload: { ...value },
      callback: () => {
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            // intentionId: location.query.id,
            pageSize: 10,
            purchaseId: location.query.id
          }
        });
      }
    })
  }

  handleModalVisiblekw = flag => {
    this.setState({
      selectkwflag: !!flag
    });
  };

  onselectinkw = () => {
    const { dispatch } = this.props;
    this.setState({
      selectinkwflag: true
    })
  }

  selectinkw = (record) => {
    const { dispatch } = this.props
    this.setState({
      selectinkwdata: record,
      selectinkwflag: false
    })
  }

  handleModalVisibleinkw = flag => {
    this.setState({
      selectinkwflag: !!flag
    });
  };

  editmx = (data) => {
    this.setState({
      FormVisible: true,
      wlshowdata: data,
      billid: isNotBlank(data.cpBillMaterial) && isNotBlank(data.cpBillMaterial.billCode) ? data.cpBillMaterial.billCode : ''
    });
  }

  handleSearchVisible = (fieldsValue) => {
    this.setState({
      khsearchVisible: false,
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
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
      historyfilter: JSON.stringify(fieldsValue.genTableColumn)
    });
  }

  searchcode = () => {
    const { dispatch } = this.props
    const { location, billid, ckid, wlshowdata } = this.state
    if (isNotBlank(billid)) {
      this.setState({
        modalRecord: {},
      })

      // if(isNotBlank(wlshowdata)&&isNotBlank(wlshowdata.id)){
      dispatch({
        type: 'cpBillMaterial/get_cpBillMaterial_search_All',
        payload: {
          // singelId: location.query.id,
          billCode: billid,
          pageSize: 10,
          tag:1
        },
        callback: (res) => {
          if (isNotBlank(res) && isNotBlank(res.list) && res.list.length > 0) {
            dispatch({
              type: 'cpPurchaseDetail/select_Detail',
              payload: {
                billId: res.list[0].id,
                'cpPjEntrepot.id': isNotBlank(ckid) ? ckid : ''
              },
              callback: (res) => {
                this.setState({
                  selectinkwdata: res
                })
              }
            })
            this.setState({
              modalRecord: res.list[0]
            })
          }
        }
      });
      // }else{
      // 	dispatch({
      // 		type: 'cpBillMaterial/cpBillMaterial_search_List',
      // 		payload: {
      // 			purchaseId: location.query.id,
      // 			billCode: billid,
      // 			pageSize: 10,
      // 		},
      // 		callback: (res) => {
      // 			if (isNotBlank(res) && isNotBlank(res.list) && res.list.length > 0) {
      // 				dispatch({
      // 					type: 'cpPurchaseDetail/select_Detail',
      // 					payload: {
      // 						billId: res.list[0].id,
      // 						'cpPjEntrepot.id': isNotBlank(ckid) ? ckid : ''
      // 					},
      // 					callback: (res) => {
      // 						this.setState({
      // 							selectinkwdata: res
      // 						})
      // 					}
      // 				})
      // 				this.setState({
      // 					modalRecord: res.list[0]
      // 				})
      // 			}
      // 		}
      // 	});
      // }
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
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
      purchaseId: location.query.id,
      // intentionId: location.query.id,
    };
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: params,
    });
  };

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

  handleSave = row => {
    const { cpBillMaterialMiddleList, dispatch } = this.props
    const { location } = this.state
    const newData = [...cpBillMaterialMiddleList.list];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    dispatch({
      type: 'cpAccessoriesSalesForm/update_AccessoriSales',
      payload: {
        id: row.id,
        number: row.number
      },
      callback: () => {
        this.setState({
          FormVisible: false,
          modalRecord: [],
          wlshowdata: {},
          selectinkwdata: {}
        })
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            // intentionId: location.query.id,
            pageSize: 10,
            purchaseId: location.query.id
          }
        });
        dispatch({
          type: 'cpAccessoriesSalesForm/cpAccessoriesSalesForm_Get',
          payload: {
            id: location.query.id,
          }
        });
      }
    })
  };

  goprint = () => {
    const { location } = this.state
    const w = window.open('about:blank')
    w.location.href = `/#/AccessoriesSalesprint?id=${location.query.id}`
  }

  handleModalVisibleywy = flag => {
    this.setState({
      selectflag: !!flag,
    });
  };

  selectuserywy = record => {
    this.props.form.setFieldsValue({
      ywy: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });
    this.setState({
      selectdata: record,
      selectflag: false,
    });
  };

  onselect = () => {
    this.setState({
      selectflag: true,
    });
  };

  onselectcode = () => {
    const { dispatch, cpAccessoriesSalesFormGet } = this.props;
    const { selectjcdata, clearflag } = this.state;
    const that = this;

    if (clearflag) {
      if (isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) {
        this.setState({
          selectcodeflag: true,
        });
      } else {
        message.error('请先选择集采客户!');
      }
    } else {
      if (
        (isNotBlank(selectjcdata) && isNotBlank(selectjcdata.id)) ||
        (isNotBlank(cpAccessoriesSalesFormGet) &&
          isNotBlank(cpAccessoriesSalesFormGet.collectClient) &&
          isNotBlank(cpAccessoriesSalesFormGet.collectClient.id))
      ) {
        this.setState({
          selectcodeflag: true,
        });
      } else {
        message.error('请先选择集采客户!');
      }
    }
  };

  onselectjc = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpCollecClient/cpCollecClient_List',
      payload: {
        pageSize: 10,
        status: 1,
      },
      callback: () => {
        this.setState({
          selectjcflag: true,
        });
      },
    });
  };

  handleModalVisiblecode = flag => {
    this.setState({
      selectcodeflag: !!flag,
    });
  };

  handleModalVisiblejc = flag => {
    this.setState({
      selectjcflag: !!flag,
    });
  };

  selectjc = record => {
    const { dispatch } = this.props;
    this.props.form.setFieldsValue({
      collectClientname: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });
    this.setState({
      selectjcdata: record,
      selectjcflag: false,
    });
    dispatch({
      type: 'cpCollecCode/cpCollecCode_List',
      payload: {
        pageSize: 10,
        'collecClient.id': record.id,
      },
    });
  };

  selectcode = record => {
    this.props.form.setFieldsValue({
      collectCodename: isNotBlank(record) && isNotBlank(record.name) ? record.name : '',
    });
    this.setState({
      selectcodedata: record,
      selectcodeflag: false,
    });
  };

  selectthis = e => {
    this.setState({
      selthis: e,
    });
  };

  clearthis = () => {
    this.setState({
      selectjcdata: {},
      selectcodedata: {},
      clearflag: true,
      clearflag1: true,
    });
    this.props.form.setFieldsValue({
      collectClientname: '',
      collectCodename: '',
    });
  };

  clearthiscode = () => {
    this.setState({
      selectcodedata: {},
      clearflag1: true,
    });
    this.props.form.setFieldsValue({
      collectCodename: '',
    });
  };

  render() {
    const { fileList, previewVisible, previewImage, selectkhflag, selectkhdata, selectzcflag, selectzcdata, sumbitflag, orderflag, typeflag, modalRecord, modalVisible, selectedRows, FormVisible, purchaseType, billid
      , purchaseStatus, wlshowdata, selectkwdata, selectkwflag, selectinkwflag, selectinkwdata, editdata, khsearchVisible, location, ckid, srcimg, srcimg1, selectflag, selectdata, newflag
      , selectcodeflag, selectjcflag, selectjcdata, selectcodedata, selthis ,collecCid} = this.state;
    const { submitting2, submitting, submitting1, cpAccessoriesSalesFormGet, cpAssemblyFormList, cpClientList, cpAssemblyBuildList, getcpBillMaterialAll, cpBillMaterialMiddleList,
      cpPurchaseDetailList, cpPjEntrepotList, cpPjStorageList, dispatch, cpClientSearchList, userlist, levellist, levellist2, newdeptlist, cpCollecClientList, cpCollecCodeList } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columnscopy = this.columns.map(col => {
      if (!col.editable || cpAccessoriesSalesFormGet.orderStatus == 1 || cpAccessoriesSalesFormGet.orderStatus == 2) {
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
    const columns = [
      {
        title: '操作',
        width: 100,
        align: 'center',
        render: (record) => {
          if (!orderflag) {
            return <Fragment>
              <a onClick={() => this.editmx(record)}>
                修改
    </a>
            </Fragment>
          }
          return ''
        },
      },
      ...columnscopy,
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => {
          if (!orderflag) {
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );

    const that = this

    const parentMethodszc = {
      handleModalVisiblezc: this.handleModalVisiblezc,
      selectcustomer1: this.selectcustomer1,
      cpAssemblyBuildList,
      that
    }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      cpClientList,
      handleSearchChange: this.handleSearchChange,
      dispatch,
      that
    }
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      getcpBillMaterialAll,
      dispatch,
      location,
      modalRecord,
      selectedRows,
      handleSelectRows: this.handleSelectRows,
      that
    };
    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      selectForm: this.selectForm,
      showTable: this.showTable,
      showKwtable: this.showKwtable,
      selectinkwdata,
      modalRecord,
      FormVisible,
      purchaseType
      , purchaseStatus,
      wlshowdata,
      editdata,
      billid,
      searchcode: this.searchcode,
      changecode: this.changecode,
      submitting1,
      that
    };
    const parentMethodskw = {
      handleModalVisiblekw: this.handleModalVisiblekw,
      dispatch,
      selectkw: this.selectkw,
      cpPjEntrepotList,
      that
    }
    const parentMethodsinkw = {
      handleModalVisibleinkw: this.handleModalVisibleinkw,
      selectinkw: this.selectinkw,
      cpPjStorageList,
      ckid,
      dispatch,
      that
    }
    const parentSearchMethods = {
      handleSearchVisible: this.handleSearchVisible,
      handleSearchAdd: this.handleSearchAdd,
      cpClientSearchList,
      khsearchVisible,
      that
    }

    const parentMethodsywy = {
      // handleAdd: this.handleAdd,
      handleModalVisibleywy: this.handleModalVisibleywy,
      selectuserywy: this.selectuserywy,
      // handleSearch: this.handleSearch,
      // handleFormReset: this.handleFormReset,
      userlist,
      levellist,
      levellist2,
      newdeptlist,
      dispatch,
      // handleSearchChange: this.handleSearchChange,
      that,
    };

    const parentMethodsjc = {
      handleAddjc: this.handleAddjc,
      handleModalVisiblejc: this.handleModalVisiblejc,
      selectjc: this.selectjc,
      cpCollecClientList,
      that,
    };
    const parentMethodscode = {
      handleAddcode: this.handleAddcode,
      handleModalVisiblecode: this.handleModalVisiblecode,
      selectcode: this.selectcode,
      cpCollecCodeList,
      selectjcdata,
      dispatch,
      that,
      collecCid
    };


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            配件销售单
      </div>
          {isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
        </span><img src={isNotBlank(srcimg) ? getFullUrl(`/${srcimg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单状态'>
                    <Input
                      disabled
                      value={isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.orderStatus) ? (
                        cpAccessoriesSalesFormGet.orderStatus === 0 || cpAccessoriesSalesFormGet.orderStatus === '0' ? '未处理' : (
                          cpAccessoriesSalesFormGet.orderStatus === 1 || cpAccessoriesSalesFormGet.orderStatus === '1' ? '已处理' :
                            cpAccessoriesSalesFormGet.orderStatus === 2 || cpAccessoriesSalesFormGet.orderStatus === '2' ? '关闭' : '')) : ''}
                      style={cpAccessoriesSalesFormGet.orderStatus === 0 || cpAccessoriesSalesFormGet.orderStatus === '0' ? { color: '#f50' } : (
                        cpAccessoriesSalesFormGet.orderStatus === 1 || cpAccessoriesSalesFormGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
                      )}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    <Input
                      disabled
                      value={isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.id) ? cpAccessoriesSalesFormGet.id : ''}
                    />
                  </FormItem>
                </Col>
                {isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.type) && cpAccessoriesSalesFormGet.type == 5 ?
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='调拨单号'>
                      <Input
                        disabled
                        value={isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.allotCode) ? cpAccessoriesSalesFormGet.allotCode : ''}
                      />
                    </FormItem>
                  </Col>
                  :
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='意向单号'>
                      <Input
                        disabled
                        value={isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.intentionId) ? cpAccessoriesSalesFormGet.intentionId : ''}
                      />
                    </FormItem>
                  </Col>
                }
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='开票需求'>
                    {getFieldDecorator('makeNeed', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.makeNeed) ? cpAccessoriesSalesFormGet.makeNeed : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择开票需求',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        disabled={newflag}
                      >
                        {
                          isNotBlank(this.state.make_need) && this.state.make_need.length > 0 && this.state.make_need.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    <Input
                      disabled
                      value={isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.orderCode) ? cpAccessoriesSalesFormGet.orderCode : ''}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单分类'>
                    {getFieldDecorator('orderType', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.orderType) ? cpAccessoriesSalesFormGet.orderType : '',
                      rules: [
                        {
                          required:!isNotBlank(cpAccessoriesSalesFormGet.id)||(isNotBlank(cpAccessoriesSalesFormGet)&&isNotBlank(cpAccessoriesSalesFormGet.isNewOrder))?true:false ,
                          message: '请选择订单分类',
                        },
                      ],
                    })(
                      <Select
                        disabled={newflag}
                        style={{ width: '100%' }}
                        showSearch
                        allowClear
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
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.project) ? cpAccessoriesSalesFormGet.project : '',
                      rules: [
                        {
                          required:!isNotBlank(cpAccessoriesSalesFormGet.id)||(isNotBlank(cpAccessoriesSalesFormGet)&&isNotBlank(cpAccessoriesSalesFormGet.isNewOrder))?true:false ,
                          message: '请选择业务项目',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={newflag}
                        allowClear
                      >
                        {
                          isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => 
                          <Option key={d.id} value={d.value} style={d.value=="3"||d.value=="4"?{display:'block'}:{display:'none'}}>{d.label}</Option>
                          )
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务渠道'>
                    {getFieldDecorator('dicth', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.dicth) ? cpAccessoriesSalesFormGet.dicth : '',
                      rules: [
                        {
                          required:!isNotBlank(cpAccessoriesSalesFormGet.id)||(isNotBlank(cpAccessoriesSalesFormGet)&&isNotBlank(cpAccessoriesSalesFormGet.isNewOrder))?true:false ,
                          message: '请选择业务渠道',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={newflag}
                        allowClear
                        onChange={this.selectthis}
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
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.businessType) ? cpAccessoriesSalesFormGet.businessType : '',
                      rules: [
                        {
                          required:!isNotBlank(cpAccessoriesSalesFormGet.id)||(isNotBlank(cpAccessoriesSalesFormGet)&&isNotBlank(cpAccessoriesSalesFormGet.isNewOrder))?true:false ,
                          message: '请选择业务分类',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={newflag}
                        allowClear
                        onChange={this.selectthis1}
                      >
                        {
                          isNotBlank(this.state.business_type) && this.state.business_type.length > 0 && this.state.business_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='维修项目'>
                    {getFieldDecorator('maintenancePROJECT', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.maintenancePROJECT) ? cpAccessoriesSalesFormGet.maintenancePROJECT : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择维修项目',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        disabled={newflag}
                        showSearch
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          option.props.children.indexOf(input) >= 0
                        }
                      >
                        {
                          isNotBlank(this.state.maintenance_project) && this.state.maintenance_project.length > 0 && this.state.maintenance_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                    {/* <Input  value={isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.maintenanceProject) ? cpAccessoriesSalesFormGet.maintenanceProject : ''} disabled /> */}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='其他约定事项' className="allinputstyle">
                    {getFieldDecorator('otherBuiness', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.otherBuiness) ? cpAccessoriesSalesFormGet.otherBuiness : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入其他约定事项',
                        },
                      ],
                    })(
                      <TextArea disabled={newflag} />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='发货地址' className="allinputstyle">
                    {getFieldDecorator('shipAddress', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.shipAddress) ? cpAccessoriesSalesFormGet.shipAddress : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入其他约定事项',
                        },
                      ],
                    })(
                      <TextArea disabled={newflag} />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='销售明细' className="allinputstyle">
                    {getFieldDecorator('salesParticular', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.salesParticular) ? cpAccessoriesSalesFormGet.salesParticular : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入销售明细',
                        },
                      ],
                    })(<TextArea disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="集采客户">
                    {getFieldDecorator('collectClientname', {
                      rules: [
                        {
                          required: selthis == 2,
                          message: '请选择集采客户',
                        },
                      ],
                    })(<Input style={{ width: '50%' }} disabled />)}
                    <span>
                      {/* <CloseOutlined style={{ margin: '0 6px' }} onClick={this.clearthis} /> */}
                      <Icon type="close" onClick={this.clearthis} style={{ margin: '0 6px' }} />
                      <Button
                        type="primary"
                        style={{ marginLeft: '8px' }}
                        onClick={this.onselectjc}
                        loading={submitting}
                        disabled={newflag}
                      >
                        选择
                            </Button>
                    </span>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="集采编码">
                    {getFieldDecorator('collectCodename', {
                      rules: [
                        {
                          required:
                            selthis == 2 &&
                            isNotBlank(cpCollecCodeList) &&
                            isNotBlank(cpCollecCodeList.list) &&
                            cpCollecCodeList.list.length > 0,
                          message: '请选择集采编码',
                        },
                      ],
                    })(<Input style={{ width: '50%' }} disabled />)}
                    <span>
                      {/* <CloseOutlined
                        style={{ margin: '0 6px' }}
                        onClick={this.clearthiscode}
                      /> */}
                      <Icon type="close" onClick={this.clearthiscode} style={{ margin: '0 6px' }} />
                      <Button
                        type="primary"
                        style={{ marginLeft: '8px' }}
                        onClick={this.onselectcode}
                        loading={submitting}
                        disabled={newflag}
                      >
                        选择
                            </Button>
                    </span>
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="业务员信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务员'>
                    {getFieldDecorator('ywy', {
                      rules: [
                        {
                          required: true,
                          message: '请选择业务员',
                        },
                      ],
                    })(
                      <Input
                        style={{ width: '50%' }}
                        disabled
                        value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.user) ? cpAccessoriesSalesFormGet.user.name : getStorage('username'))}
                      />)}
                    <Button
                      type="primary"
                      style={{ marginLeft: '8px' }}
                      onClick={this.onselect}
                      loading={submitting}
                      disabled={newflag}
                    >
                      选择
                    </Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.user) ? cpAccessoriesSalesFormGet.user.no : getStorage('userno'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input

                      disabled
                      value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.user) && isNotBlank(cpAccessoriesSalesFormGet.user.office) ? cpAccessoriesSalesFormGet.user.office.name : getStorage('companyname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Select
                      allowClear
                      notFoundContent={null}
                      style={{ width: '100%' }}
                      value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.user) && isNotBlank(cpAccessoriesSalesFormGet.user.dictArea) ? cpAccessoriesSalesFormGet.user.dictArea : getStorage('areaname'))}

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
                      value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.user) && isNotBlank(cpAccessoriesSalesFormGet.user.dept) ? cpAccessoriesSalesFormGet.user.dept.name : getStorage('deptname'))}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="客户信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                {(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.type) && cpAccessoriesSalesFormGet.type == 5)
                  || (!isNotBlank(cpAccessoriesSalesFormGet.id) || (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.isNewOrder)))
                  ?
                  <span>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='客户'>
                        <Input
                          style={{ width: '50%' }}
                          disabled
                          value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.clientCpmpany) ? selectkhdata.clientCpmpany
                            : (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.clientCpmpany : '')}
                        />
                        <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting} disabled={orderflag}>选择</Button>
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="联系人">
                        <Input
                          disabled
                          value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name
                            : (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) && isNotBlank(cpAccessoriesSalesFormGet.client.name) ? cpAccessoriesSalesFormGet.client.name : '')}
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
                            : (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) && isNotBlank(cpAccessoriesSalesFormGet.client.classify) ? cpAccessoriesSalesFormGet.client.classify : '')}
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
                          value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.code) ? selectkhdata.code
                            : (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.code : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='联系地址'>
                        <Input
                          disabled
                          value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.address) ? selectkhdata.address
                            : (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.address : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='移动电话'>
                        <Input
                          disabled
                          value={isNotBlank(selectkhdata) && isNotBlank(selectkhdata.phone) ? selectkhdata.phone
                            : (isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.phone : '')}
                        />
                      </FormItem>
                    </Col>
                  </span>
                  :
                  <span>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='客户'>
                        <Input
                          style={{ width: '100%' }}
                          disabled
                          value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.clientCpmpany : '')}
                        />
                        {/* <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting} disabled={orderflag}>选择</Button> */}
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="联系人">
                        <Input
                          disabled
                          value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) && isNotBlank(cpAccessoriesSalesFormGet.client.name) ? cpAccessoriesSalesFormGet.client.name : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='客户分类'>
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          disabled
                          value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) && isNotBlank(cpAccessoriesSalesFormGet.client.classify) ? cpAccessoriesSalesFormGet.client.classify : '')}
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
                          value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.code : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='联系地址'>
                        <Input
                          disabled
                          value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.address : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='移动电话'>
                        <Input
                          disabled
                          value={(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.client) ? cpAccessoriesSalesFormGet.client.phone : '')}
                        />
                      </FormItem>
                    </Col>
                  </span>}
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属仓库'>
                    {getFieldDecorator('ck', {
                      rules: [
                        {
                          required: true,
                          message: '所属仓库',
                        },
                      ],
                    })
                      (<Input style={{ width: '50%' }} disabled />
                      )}
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkw} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='金额'>
                    <Input disabled value={isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.totalMoney) ? getPrice(cpAccessoriesSalesFormGet.totalMoney) : ''} />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.remarks) ? cpAccessoriesSalesFormGet.remarks : '',
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
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.id) &&
                <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                  打印
          </Button>}
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesSalesForm').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesSalesForm')[0].children.filter(item => item.name == '修改')
                  .length > 0 && <span>
                  <Button type="primary" onClick={this.onsave} loading={submitting2} disabled={orderflag}>
                    保存
  </Button>
                  <Button style={{ marginLeft: '8px', marginRight: '8px' }} loading={submitting2} type="primary" htmlType="submit" disabled={orderflag}>
                    提交
  </Button>
                  {
                    isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.orderStatus) && (cpAccessoriesSalesFormGet.orderStatus === 1 || cpAccessoriesSalesFormGet.orderStatus === '1') ?
                      <Button style={{ marginLeft: 8 }} loading={submitting2} onClick={() => this.onRevocation(cpAccessoriesSalesFormGet.id)} loading={submitting}>
                        撤销
  </Button> : null
                  }
                </span>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
          </Button>
              <Button
                style={{ marginLeft: 8, marginBottom: '10px' }}
                onClick={() => this.showForm()}
                disabled={!(isNotBlank(cpAccessoriesSalesFormGet) && isNotBlank(cpAccessoriesSalesFormGet.id) && cpAccessoriesSalesFormGet.orderStatus == 0)}
              >
                新增明细
          </Button>
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false}>
          <StandardTable
            scroll={{ x: 1400 }}
            data={cpPurchaseDetailList}
            bordered
            components={components}
            rowClassName={() => 'editable-row'}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        <CreateFormywy {...parentMethodsywy} selectflag={selectflag} />
        <SearchForm {...parentSearchMethods} khsearchVisible={khsearchVisible} />
        <CreateForminkw {...parentMethodsinkw} selectinkwflag={selectinkwflag} />
        <CreateFormkw {...parentMethodskw} selectkwflag={selectkwflag} />
        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateFormjc {...parentMethodsjc} selectjcflag={selectjcflag} />
        <CreateFormcode {...parentMethodscode} selectcodeflag={selectcodeflag} />
        <CreateFormzc {...parentMethodszc} selectzcflag={selectzcflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
      </PageHeaderWrapper>
    );
  }
}
export default CpAccessoriesSalesFormForm;
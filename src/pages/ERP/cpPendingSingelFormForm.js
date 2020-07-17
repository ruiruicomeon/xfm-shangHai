import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  message,
  Icon,
  Upload,
  Modal,
  TreeSelect,
  DatePicker,
  Popconfirm,
  Row,
  Col,
  Divider,
  Table,
  Cascader
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import DragTable from '../../components/StandardEditTable/dragTable'
import StandardEditTable from '@/components/StandardEditTable';
import styles from './CpPendingSingelFormForm.less';
import { getStorage } from '@/utils/localStorageUtils';

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

const CreateFormpassMust = Form.create()(props => {
  const { modalVisiblepassMust, handleModalVisiblepassMust, showgoto, getMustCpTypelist } = props;
  return (
    <Modal
      title='物料类别'
      visible={modalVisiblepassMust}

      onCancel={() => handleModalVisiblepassMust()}
    >
      {isNotBlank(getMustCpTypelist) && isNotBlank(getMustCpTypelist.list) && getMustCpTypelist.list.length > 0 && getMustCpTypelist.list.map((item) => {
        return <div style={{ textAlign: 'center' }}><Button type="primary" style={{ width: '50%', fontSize: '18px', height: '48px', textAlign: 'center', marginTop: '12px', marginBottom: '12px' }} onClick={() => { showgoto(item.id, item.name) }}>{item.name}</Button></div>
      })
      }
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

const CreateFormkh = Form.create()(props => {
  const { form, dispatch, handleModalVisiblekh, modeluserList, selectkhflag, selectcustomer,
    selectedRows, handleSelectRows, levellist, levellist2, newdeptlist, that } = props;

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
          'role.id': 5,
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
        'role.id': 5,
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
      'role.id': 5,
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
const CreateFormForm = Form.create()(props => {
  const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator }, changecode,
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, showTable, searchcode, billid, submitting1, editdata } = props;
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? getPrice(modalRecord.number) :
                (isNotBlank(editdata) && isNotBlank(editdata.number) ? editdata.number : 1),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode :
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.originalCode) ? editdata.cpBillMaterial.originalCode : ''),
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
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.name) ? editdata.cpBillMaterial.name : ''),
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
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.two) && isNotBlank(editdata.cpBillMaterial.two.name) ? editdata.cpBillMaterial.two.name : ''),
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
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.one) && isNotBlank(editdata.cpBillMaterial.one.model) ? editdata.cpBillMaterial.one.model : ''),
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
                (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.rCode) ? editdata.cpBillMaterial.rCode : ''),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.balanceNumber) ? modalRecord.balanceNumber :
                (isNotBlank(editdata) && isNotBlank(editdata.repertoryNumber) ? editdata.repertoryNumber : ''),
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
                (isNotBlank(editdata) && isNotBlank(editdata.repertoryPrice) ? getPrice(editdata.repertoryPrice) : 0),
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
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks :
                (isNotBlank(editdata) && isNotBlank(editdata.remarks) ? editdata.remarks : ''),
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
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, dispatch, location, that } = props;

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
      title: '库存单价',
      dataIndex: 'balancePrice',
      inputType: 'text',
      width: 100,
      editable: false,
      render: text => (getPrice(text))
    },
    {
      title: '库存数量',
      dataIndex: 'balanceNumber',
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

      that.setState({
        wlsearch: values,
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
      wlsearch: {},
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
      ...filters,
      tag:1,
      intentionId: location.query.id,
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
        scroll={{ x: 1500 }}

        onChange={handleStandardTableChange}
        data={cpBillMaterialList}
        columns={selectcolumns}
      />
    </Modal>
  );
});
const CreateFormMore = Form.create()(props => {
  const { modalVisibleMore, form, handleAdd, handleModalVisibleMore, modalRecord, form: { getFieldDecorator },
    cpBillMaterialList, selectmore, handleSelectRows, selectedRows, titlename } = props;

  const selectcolumns = [
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
      dataIndex: 'oneCodeModel',
      inputType: 'text',
      width: 100,
      editable: true,
    },

    {
      title: '二级编码名称',
      dataIndex: 'twoCodeModel',
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

  return (
    <Modal
      title={`物料选择(${titlename})`}
      visible={modalVisibleMore}
      onOk={(e) => selectmore(e)}
      onCancel={() => handleModalVisibleMore()}
      width='80%'
    >

      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        childrenColumnName='cpBillMaterialList'
        data={cpBillMaterialList}
        columns={selectcolumns}
      />
    </Modal>
  );
});
@connect(({ cpPendingSingelForm, loading, cpBillMaterial, sysuser, syslevel, sysdept, cpClient }) => ({
  ...cpPendingSingelForm,
  ...cpBillMaterial,
  loading: loading.models.cpBillMaterial,
  ...sysuser,
  ...syslevel,
  ...sysdept,
  ...cpClient,
  newdeptlist: sysdept.deptlist.list,
  submitting1: loading.effects['cpBillMaterial/get_cpAssemblyBuild_search_All'],
  submitting: loading.effects['form/submitRegularForm'],
  submitting2: loading.effects['cpPendingSingelForm/cpPendingSingelForm_Add'],
  submitting3: loading.effects['cpupdata/cpPendingSingelForm_update'],
}))
@Form.create()
class CpPendingSingelFormForm extends PureComponent {
  index = 0

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        inputType: 'text',
        width: 100,
        editable: false,
        render: (tex, res, idx) => {
          if (isNotBlank(res.id)) {
            return idx + 1
          }
          return ''
        }
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
        width: 300,
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
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        editable: false,
        inputType: 'dateTime',
        width: 150,
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
        width: 150,
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
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      fileList: [],
      selectedRows: [],
      orderflag: false,
      intentionId: '',
      editingKey: '',
      showdata: [],
      dataSource: [],
      FormVisible: false,
      modalVisibleMore: false,
      modalVisiblepass: false,
      indexstatus: '',
      updataflag: true,
      confirmflag: true,
      confirmflag1: true,
      wlid: '',
      editdata: {},
      billid: '',
      shrsearch: {},
      wlsearch: {},
      pageCurrent:1,
      pagePageSize:10,
      updataname: '取消锁定',
      location: getLocation(),
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpPendingSingelForm/cpPendingSingelForm_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改')
              .length > 0)) {
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

          this.setState({
            intentionId: location.query.id
          })
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'DCL'
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
              type: 'DCL'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
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

          dispatch({
            type: 'dict/dict',
            payload: {
              type: 'area',
            },
            callback: data => {
              this.setState({
                area: data
              })
            }
          });

          dispatch({
            type: 'dict/dict',
            payload: {
              type: 'classify',
            },
            callback: data => {
              this.setState({
                classify: data
              })
            }
          });
        }
      });
    }

    dispatch({
      type: 'sysuser/modeluser_List',
      payload: {
        'role.id': 5,
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
        pageSize: 100
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
      payload: {
        type: 'approach_type',
      },
      callback: data => {
        this.setState({
          approachType: data
        })
      }
    });

    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'quote_type',
      },
      callback: data => {
        this.setState({
          quote_type: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'del_flag',
      },
      callback: data => {
        this.setState({
          del_flag: data
        })
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpPendingSingelForm/clear',
    });

    dispatch({
      type: 'cpBillMaterial/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, updataflag, showdata } = this.state;
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
        const newshowdata = showdata.filter(item => { return isNotBlank(item.name) })
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        value.accomplishDate = moment(value.accomplishDate).format("YYYY-MM-DD")
        value.orderStatus = 1
        if (updataflag) {
          dispatch({
            type: 'cpPendingSingelForm/cpPendingSingelForm_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_pending_singel_form_form?id=${location.query.id}`);
              // router.push('/business/process/cp_pending_singel_form_list');
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpPendingSingelForm_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_pending_singel_form_form?id=${location.query.id}`);
              // router.push('/business/process/cp_pending_singel_form_list');
            }
          })
        }
      }
    });
  };

  onsave = (e) => {
    const { dispatch, form } = this.props;
    const { addfileList, location, updataflag, showdata } = this.state;

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
        const idarr = []
        value.totalNumber = newshowdata.length
        newshowdata.forEach(item => {
          idarr.push(item.id)
        })
        value.ids = idarr.join(',')
        value.accomplishDate = moment(value.accomplishDate).format("YYYY-MM-DD")
        if (updataflag) {
          value.orderStatus = 0
          dispatch({
            type: 'cpPendingSingelForm/cpPendingSingelForm_Save1',
            payload: { ...value },
          })
        } else {
          value.orderStatus = 1
          dispatch({
            type: 'cpupdata/cpPendingSingelForm_update',
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
    router.push('/business/process/cp_pending_singel_form_list');
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleModalVisibleMore = flag => {
    this.setState({
      modalVisibleMore: !!flag
    });
  };

  handleFormVisible = flag => {
    this.setState({
      FormVisible: !!flag,
      modalRecord: {},
      billid: '',
      editable: {}
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

  onupdata = () => {
    const { location, updataflag } = this.state
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定'
      })
    } else {
      router.push(`/business/process/cp_pending_singel_form_form?id=${location.query.id}`);
    }

  }

  selectmore = (res) => {
    const { dispatch, getCpBillMaterialListNo1 } = this.props
    const { selectedRows, location, } = this.state;

    this.setState({
      modalVisible: false,
      modalRecord: res
    })
    if (isNotBlank(getCpBillMaterialListNo1) && isNotBlank(getCpBillMaterialListNo1.list) && getCpBillMaterialListNo1.list.length > 0) {
      const ids = getCpBillMaterialListNo1.list.map(row => row.id).join(',');

      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_middle_Add',
        payload: {
          singelId: location.query.id,
          ids
        },
        callback: () => {
          this.setState({
            modalVisibleMore: false,
            modalVisiblepassMust: false
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
              isTemplate: 1
            },
            callback: (res) => {
              const newarr = [...res.list]
              this.setState({
                dataSource: newarr
              })
            }
          })
        }
      })
    } else {
      message.error('该类别没有物料');
      this.setState({
        modalVisibleMore: false,
      })
    }

  }

  showTable = () => {
    const { dispatch } = this.props
    const { location ,pageCurrent,pagePageSize,wlsearch} = this.state
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
      modalVisible: true
    });
  }

  handleDeleteClick = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpPendingSingelForm/cpPendingSingel_del',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpPendingSingelForm/cpPendingSingelForm_Get',
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
    const { location, modalRecord, editdata } = this.state

    const vals = { ...values }

    if (isNotBlank(editdata) && isNotBlank(editdata.id)) {
      vals.id = editdata.id
    } else {
      vals.isTemplate = 1
    }

    let cpeid = ''
    let cpsid = ''
    if (isNotBlank(modalRecord) && isNotBlank(modalRecord.cpPjEntrepot) && isNotBlank(modalRecord.cpPjEntrepot.id)) {
      cpeid = modalRecord.cpPjEntrepot.id
    }
    if (isNotBlank(modalRecord) && isNotBlank(modalRecord.cpPjStorage) && isNotBlank(modalRecord.cpPjStorage.id)) {
      cpsid = modalRecord.cpPjStorage.id
    }

    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_middle_Add',
      payload: {
        singelId: location.query.id,
        ids: isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? modalRecord.id : (isNotBlank(editdata) && isNotBlank(editdata.billId) ? editdata.billId : ''),
        'cpPjEntrepot.id': cpeid,
        'cpPjStorage.id': cpsid,
        ...vals,
      }
      ,
      callback: () => {
        this.setState({
          FormVisible: false,
          modalRecord: {},
          editdata: {},
          billid: ''
        })
        dispatch({
          type: 'cpPendingSingelForm/cpPendingSingelForm_Get',
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
            isTemplate: 1
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
      type: 'cpPendingSingelForm/cpBillSingel_Save',
      payload: {
        id: row.id,
        number: row.number
      },
      callback: () => {

        dispatch({
          type: 'cpBillMaterial/cpBillMaterial_middle_List',
          payload: {
            singelId: location.query.id,
            isTemplate: 1

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
  };

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
    if (apps === '撤销') {
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
      type: 'cpPendingSingelForm/cpPendingSingelForm_isPass',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val
      },
      callback: () => {
        dispatch({
          type: 'cpPendingSingelForm/cpPendingSingelForm_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改')
                .length > 0)) {
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

  onselectkh = (key) => {
    this.setState({
      indexflag: key,
      selectkhflag: true
    })
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

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

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

  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该的待处理报件单',
      content: '确定撤销该待处理报件单吗？',
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
        type: 'cpRevocation/cpPendingSingelForm_revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/business/process/cp_pending_singel_form_form?id=${location.query.id}`);
          // router.push('/business/process/cp_pending_singel_form_list');

        }
      })
    }
  }

  onUndoresubmit = () => {
    Modal.confirm({
      title: '重新提交该的待处理报件单',
      content: '确定重新提交该待处理报件单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.repost(),
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
        type: 'cpPendingSingelForm/cpPendingSingelForm_respost',
        payload: {
          id: location.query.id
        },
        callback: () => {
          dispatch({
            type: 'cpPendingSingelForm/cpPendingSingelForm_Get',
            payload: {
              id: location.query.id,
            },
            callback: (res) => {
              if ((res.data.approvals === 0 || res.data.approvals === '0' || res.data.approvals === 2 || res.data.approvals === '2' || res.data.approvals === 4 || res.data.approvals === '4') && (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改')
                  .length > 0)) {
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

              this.setState({
                intentionId: location.query.id
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
                  isTemplate: 1

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
          });
        }

      })
    }
  }

  searchcode = () => {
    const { dispatch } = this.props
    const { location, billid, wlshowdata } = this.state
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
            this.setState({
              modalRecord: res.list[0]
            })
          }
        }
      });


      // }else{
      //   dispatch({
      // 		type: 'cpBillMaterial/cpBillMaterial_search_List',
      // 		payload: {
      // 			purchaseId: location.query.id,
      // 			billCode: billid,
      // 			pageSize: 10,
      //     }, 
      //     callback: (res) => {
      //       if (isNotBlank(res) && isNotBlank(res.list) && res.list.length > 0) {
      //         this.setState({
      //           modalRecord: res.list[0]
      //         })
      //       }
      //     }
      //   })


      // dispatch({
      // 	type: 'cpBillMaterial/cpBillMaterial_search_List',
      // 	payload: {
      // 		purchaseId: location.query.id,
      // 		billCode: billid,
      // 		pageSize: 10,
      // 	},
      // 	callback: (res) => {
      // 		if (isNotBlank(res) && isNotBlank(res.list) && res.list.length > 0) {
      // 			dispatch({
      // 				type: 'cpPurchaseDetail/select_Detail',
      // 				payload: {
      // 					billId: res.list[0].id,
      // 					'cpPjEntrepot.id': isNotBlank(ckid) ? ckid : ''
      // 				},
      // 				callback: (res) => {
      // 					this.setState({
      // 						selectinkwdata: res
      // 					})
      // 				}
      // 			})
      // 			this.setState({
      // 				modalRecord: res.list[0]
      // 			})
      // 		}
      // 	}
      // });
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
      singelId: location.query.id,
      isTemplate: 1
    };
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_middle_List',
      payload: params,
      callback: (res) => {
        let newarr = []
        if (isNotBlank(res.list) && res.list.length > 0) {
          newarr = [...res.list]
        }
        this.setState({
          dataSource: newarr
        })
      }
    });
  };

  showMustlb = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpClient/get_Must_CpTypeList',
      payload: {
        type: 2
      }
    })
    this.setState({
      modalVisiblepassMust: true
    })
  }

  handleModalVisiblepassMust = () => {
    this.setState({
      modalVisiblepassMust: false
    })
  }

  showgoto = (id, name) => {
    const { dispatch } = this.props
    dispatch({
      type: 'cpClient/get_CpBillMaterial_ListNo1',
      payload: {
        pageSize: 100,
        mustParent: id,
      },
      callback: () => {
        this.setState({
          modalVisibleMore: true,
          titlename: name
        })
      }
    });

  }

  edithtis = (res) => {
    this.setState({
      billid: isNotBlank(res.cpBillMaterial) && isNotBlank(res.cpBillMaterial.billCode) ? res.cpBillMaterial.billCode : '',
      editdata: res,
      FormVisible: true
    })
  }

  render() {
    const { fileList, previewVisible, previewImage, orderflag, modalRecord, modalVisible, selectedRows, FormVisible, modalVisibleMore, editingKey, dataSource, location
      , updataflag, updataname, showdata, modalVisiblepass, selectkhflag, billid, srcimg, srcimg1, modalVisiblepassMust, titlename, editdata } = this.state;
    const { submitting3, submitting2, submitting, submitting1, cpPendingSingelFormGet, getcpBillMaterialAll, cpBillMaterialList, cpBillMaterialMiddleList, loading, form, dispatch, levellist, levellist2, newdeptlist,
      modeluserList, getMustCpTypelist, getCpBillMaterialListNo1 } = this.props;
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
      if (!col.editable || cpPendingSingelFormGet.approvals == 1 || cpPendingSingelFormGet.approvals == 3) {
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
        render: (text, record) => {
          if (isNotBlank(record.id) && isNotBlank(this.props.cpPendingSingelFormGet) && (this.props.cpPendingSingelFormGet.approvals == 0 || this.props.cpPendingSingelFormGet.approvals == 1 || this.props.cpPendingSingelFormGet.approvals == 2 || this.props.cpPendingSingelFormGet.approvals == 4)) {
            return <Fragment>
              <a onClick={() => this.edithtis(record)}>修改</a>
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
          if (isNotBlank(record.id) && isNotBlank(this.props.cpPendingSingelFormGet) && (this.props.cpPendingSingelFormGet.approvals == 0 || this.props.cpPendingSingelFormGet.approvals == 1 || this.props.cpPendingSingelFormGet.approvals == 2 || this.props.cpPendingSingelFormGet.approvals == 4)) {
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

    const that = this

    const parentMethodspassMust = {
      modalVisiblepassMust,
      handleModalVisiblepassMust: this.handleModalVisiblepassMust,
      getMustCpTypelist,
      showgoto: this.showgoto,
      that
    }

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,

      selectuser: this.selectuser,
      cpBillMaterialList: getcpBillMaterialAll,
      modalRecord,
      dispatch,
      location,
      selectedRows,
      handleSelectRows: this.handleSelectRows,
      that
    };

    const parentMethodsMore = {
      handleAdd: this.handleAdd,
      handleModalVisibleMore: this.handleModalVisibleMore,

      selectmore: this.selectmore,
      cpBillMaterialList: getCpBillMaterialListNo1,
      modalRecord,
      titlename,
      selectedRows,
      dispatch,
      handleSelectRows: this.handleSelectRows,
      that
    }

    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,

      searchcode: this.searchcode,
      changecode: this.changecode,
      submitting1,
      selectForm: this.selectForm,
      showTable: this.showTable,
      modalRecord,
      FormVisible,
      billid,
      editdata,
      that
    };
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
          if (((isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (cpPendingSingelFormGet.approvals === 0 || cpPendingSingelFormGet.approvals === '0')) ||
            (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 2 || cpPendingSingelFormGet.approvals === '2')) ||
            (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 4 || cpPendingSingelFormGet.approvals === '4'))
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
          if (isNotBlank(cpPendingSingelFormGet) && (cpPendingSingelFormGet.approvals !== 0 || cpPendingSingelFormGet.approvals !== '0')) {
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
          if (((isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
            && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改')
              .length > 0 &&
            (cpPendingSingelFormGet.approvals === 0 || cpPendingSingelFormGet.approvals === '0')) ||
            (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 2 || cpPendingSingelFormGet.approvals === '2')) ||
            (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 4 || cpPendingSingelFormGet.approvals === '4'))
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

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>待处理报件单</div>
          {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '60px', height: '60px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
            </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '60px', height: '60px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>

            <Card bordered={false} title="订单信息">
              <Row gutter={12}>
                {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.intentionId) && cpPendingSingelFormGet.intentionId != '0000' &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='意向单号'>
                      <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.intentionId) ? cpPendingSingelFormGet.intentionId : ''} />
                    </FormItem>
                  </Col>
                }
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='单号'>
                    {getFieldDecorator('odd', {
                      initialValue: isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.odd) ? cpPendingSingelFormGet.odd : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入单号',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='审批进度'>

                    <Input

                      value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) ?
                        appData(cpPendingSingelFormGet.approvals) : ''}
                      disabled
                    />

                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.orderCode) ? cpPendingSingelFormGet.orderCode : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入订单编号',

                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>

                {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.type) && (cpPendingSingelFormGet.type == 7 || cpPendingSingelFormGet.type == 10) &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='报件类型'>
                      <Input disabled value='售后报件' />
                    </FormItem>
                  </Col>
                }

                {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.type) && (cpPendingSingelFormGet.type == 4) &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='报件类型'>
                      <Input disabled value='内部报件单' />
                    </FormItem>
                  </Col>
                }
                {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.type) && (cpPendingSingelFormGet.type == 3 || cpPendingSingelFormGet.type == 5) &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='报件类型'>
                      <Input disabled value='配件销售' />
                    </FormItem>
                  </Col>
                }

                {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.type) && (cpPendingSingelFormGet.type == 1 || cpPendingSingelFormGet.type == 2) &&
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='报件类型'>
                      {getFieldDecorator('quoteType', {
                        initialValue: isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.quoteType) ? cpPendingSingelFormGet.quoteType : '',
                        rules: [
                          {
                            required: true,
                            message: '请输入报件类型',

                          },
                        ],
                      })(
                        <Select
                          allowClear
                          disabled={orderflag}
                          style={{ width: '100%' }}

                        >
                          {
                            isNotBlank(this.state.quote_type) && this.state.quote_type.length > 0 && this.state.quote_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                }
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="完成时间">
                    {/* {getFieldDecorator('accomplishDate', {
                      initialValue: isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.accomplishDate) ? moment(cpPendingSingelFormGet.accomplishDate) : null,
                    })(
                      <DatePicker
                        
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                        disabled={orderflag && updataflag}
                      />
                    )} */}
                    <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.accomplishDate) ? cpPendingSingelFormGet.accomplishDate : null} />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='故障描述' className="allinputstyle">
                    {getFieldDecorator('errorDescription', {
                      initialValue: isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.errorDescription) ? cpPendingSingelFormGet.errorDescription : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入故障描述',

                        },
                      ],
                    })(<TextArea disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.remarks) ? cpPendingSingelFormGet.remarks : '',
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

              <Card title="业务员信息" className={styles.card} bordered={false}>
                <Row gutter={16}>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='业务员'>
                      <Input

                        disabled
                        value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) ? cpPendingSingelFormGet.user.name : '')}
                      />
                    </FormItem>

                  </Col>

                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='编号'>
                      <Input
                        disabled
                        value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) ? cpPendingSingelFormGet.user.no : '')}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='所属公司'>
                      <Input

                        disabled
                        value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) && isNotBlank(cpPendingSingelFormGet.user.office) ? cpPendingSingelFormGet.user.office.name : '')}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='所属区域'>
                      <Select
                        allowClear

                        notFoundContent={null}
                        style={{ width: '100%' }}
                        value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) && isNotBlank(cpPendingSingelFormGet.user.dictArea) ? cpPendingSingelFormGet.user.dictArea : '')}

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
                        value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) && isNotBlank(cpPendingSingelFormGet.user.dept) ? cpPendingSingelFormGet.user.dept.name : '')}
                      />
                    </FormItem>

                  </Col>
                </Row>
              </Card>
              {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.type) && (cpPendingSingelFormGet.type == 4) &&
                <Card title="客户信息" className={styles.card} bordered={false}>
                  <Row gutter={16}>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='客户'>
                        <Input
                          style={{ width: '100%' }}
                          disabled
                          value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) ? cpPendingSingelFormGet.user.name : ''}
                        />

                      </FormItem>
                    </Col>

                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='所属公司'>
                        <Input
                          disabled
                          value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) && isNotBlank(cpPendingSingelFormGet.user.office) ? cpPendingSingelFormGet.user.office.name : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='所属区域'>
                        <Input
                          disabled
                          value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.areaName) ? cpPendingSingelFormGet.areaName : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='电话'>
                        <Input
                          disabled
                          value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.user) && isNotBlank(cpPendingSingelFormGet.user.phone) ? cpPendingSingelFormGet.user.phone : '')}
                        />
                      </FormItem>
                    </Col>

                  </Row>
                </Card>
              }

              {!(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.type) && (cpPendingSingelFormGet.type == 4)) &&
                <Card title="客户信息" className={styles.card} bordered={false}>
                  <Row gutter={16}>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='客户'>
                        <Input

                          disabled
                          value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.client) && isNotBlank(cpPendingSingelFormGet.client.clientCpmpany) ? cpPendingSingelFormGet.client.clientCpmpany : ''}
                        />

                      </FormItem>
                    </Col>

                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label="联系人">
                        <Input disabled value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.client) ? cpPendingSingelFormGet.client.name : '')} />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='客户分类'>
                        <Select
                          allowClear
                          style={{ width: '100%' }}

                          disabled
                          value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.client) ? cpPendingSingelFormGet.client.classify : '')}
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
                          value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.client) ? cpPendingSingelFormGet.client.code : '')}
                        />
                      </FormItem>
                    </Col>

                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='联系地址'>
                        <Input

                          disabled
                          value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.client) ? cpPendingSingelFormGet.client.address : '')}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='移动电话'>
                        <Input

                          disabled
                          value={(isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.client) ? cpPendingSingelFormGet.client.phone : '')}
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
                        initialValue: isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.assemblyEnterType) ? cpPendingSingelFormGet.assemblyEnterType : '',
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
                    <FormItem {...formItemLayout} label='品牌'>
                      <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.cpAssemblyBuild) ? cpPendingSingelFormGet.cpAssemblyBuild.assemblyBrand : ''} />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='车型/排量'>
                      <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.cpAssemblyBuild) ? cpPendingSingelFormGet.cpAssemblyBuild.vehicleModel : ''} />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='年份'>
                      <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.cpAssemblyBuild) ? cpPendingSingelFormGet.cpAssemblyBuild.assemblyYear : ''} />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='总成型号'>
                      <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.cpAssemblyBuild) ? cpPendingSingelFormGet.cpAssemblyBuild.assemblyModel : ''} />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='维修班组'>
                      <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.maintenanceCrew) && isNotBlank(cpPendingSingelFormGet.maintenanceCrew.name) ? cpPendingSingelFormGet.maintenanceCrew.name : ''} />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='车牌号'>
                      <Input disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.plateNumber) ? cpPendingSingelFormGet.plateNumber : ''} />
                    </FormItem>
                  </Col>
                  {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.type) && (cpPendingSingelFormGet.type == 7 || cpPendingSingelFormGet.type == 10) &&
                    <Col lg={12} md={12} sm={24}>
                      <FormItem {...formItemLayout} label='报件内容'>
                        <TextArea disabled value={isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.quoteDescription) ? cpPendingSingelFormGet.quoteDescription : ''} />
                      </FormItem>
                    </Col>
                  }
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
              <Card title="审核人管理" bordered={false}>
                {getFieldDecorator('members', {
                  initialValue: '',
                })(

                  <Table
                    columns={columnssh}
                    dataSource={showdata}
                    pagination={false}

                  />
                )}
                {isNotBlank(showdata) && showdata.length < 5 && isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改').length > 0 &&
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    onClick={this.newMember}
                    icon="plus"
                    disabled={!((isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) &&
                      (cpPendingSingelFormGet.approvals === 0 || cpPendingSingelFormGet.approvals === '0')) ||
                      (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 2 || cpPendingSingelFormGet.approvals === '2')) ||
                      (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 4 || cpPendingSingelFormGet.approvals === '4'))
                    )}
                  >
                    新增审核人
                  </Button>
                }

                {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.isOperation) && (cpPendingSingelFormGet.isOperation === 1 || cpPendingSingelFormGet.isOperation === '1') &&
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

                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '二次修改')
                    .length > 0 &&
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                    {updataname}
                  </Button>
                }
                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改')
                    .length > 0 &&
                  <span>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={this.onsave}
                      loading={submitting3 || submitting2}
                      disabled={(!((isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) &&
                        (cpPendingSingelFormGet.approvals === 0 || cpPendingSingelFormGet.approvals === '0')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 2 || cpPendingSingelFormGet.approvals === '2')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 4 || cpPendingSingelFormGet.approvals === '4'))
                      )) && updataflag}
                    >
                      保存
                      </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      htmlType="submit"
                      loading={submitting3 || submitting2}
                      disabled={(!((isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) &&
                        (cpPendingSingelFormGet.approvals === 0 || cpPendingSingelFormGet.approvals === '0')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 2 || cpPendingSingelFormGet.approvals === '2')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 4 || cpPendingSingelFormGet.approvals === '4'))
                      )) && updataflag}
                    >
                      提交
                      </Button>
                    {isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) &&
                      (cpPendingSingelFormGet.approvals === 1 || cpPendingSingelFormGet.approvals === '1') && isNotBlank(cpPendingSingelFormGet.createBy) &&
                      <Button style={{ marginLeft: 8 }} loading={submitting3 || submitting2} onClick={() => this.onUndoresubmit()}>
                        重新提交
                      </Button>
                    }
                    {
                      orderflag && cpPendingSingelFormGet.approvals === '3' &&
                      <Button style={{ marginLeft: 8 }} loading={submitting3 || submitting2} onClick={() => this.onUndo(cpPendingSingelFormGet.id)}>
                        撤销
                      </Button>
                    }
                  </span>
                }
                <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                  返回
                </Button>

                {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPendingSingelForm')[0].children.filter(item => item.name == '修改')
                    .length > 0 &&
                  <span>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={() => this.showForm()}
                      disabled={(!((isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) &&
                        (cpPendingSingelFormGet.approvals === 0 || cpPendingSingelFormGet.approvals === '0')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 1 || cpPendingSingelFormGet.approvals === '1')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 2 || cpPendingSingelFormGet.approvals === '2')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 4 || cpPendingSingelFormGet.approvals === '4'))
                      )) && updataflag}
                    >

                      新增明细
                      </Button>
                    <Button
                      type="primary"
                      style={{ marginLeft: 8 }}
                      onClick={() => this.showMustlb()}
                      disabled={(!((isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.approvals) &&
                        (cpPendingSingelFormGet.approvals === 0 || cpPendingSingelFormGet.approvals === '0')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 1 || cpPendingSingelFormGet.approvals === '1')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 2 || cpPendingSingelFormGet.approvals === '2')) ||
                        (isNotBlank(cpPendingSingelFormGet) && isNotBlank(cpPendingSingelFormGet.createBy) && (cpPendingSingelFormGet.approvals === 4 || cpPendingSingelFormGet.approvals === '4'))
                      )) && updataflag}
                    >

                      批量新增
                      </Button>
                  </span>
                }
              </FormItem>
            </Card>
          </Form>

          <div className={styles.standardList}>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <DragTable
                  scroll={{ x: 1400 }}
                  components={components}
                  rowClassName={() => 'editable-row'}
                  bordered
                  dataSource={dataSource}
                  pagination={cpBillMaterialMiddleList.pagination}
                  columns={columns}
                  cpPendingSingelFormGet={cpPendingSingelFormGet}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </div>
        </Card>

        <CreateFormpassMust {...parentMethodspassMust} modalVisiblepassMust={modalVisiblepassMust} />
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />

        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateFormMore {...parentMethodsMore} modalVisibleMore={modalVisibleMore} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default CpPendingSingelFormForm;
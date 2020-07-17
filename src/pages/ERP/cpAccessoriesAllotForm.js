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
  DatePicker,
  Table, Popconfirm
} from 'antd';
import DragTable from '../../components/StandardEditTable/dragTable'
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './cpAccessoriesAllotForm.less';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
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
const CreateFormMore = Form.create()(props => {
  const { modalVisibleMore, form, handleAdd, handleModalVisibleMore, modalRecord, form: { getFieldDecorator },
    cpBillMaterialList, selectmore, handleSelectRows, selectedRows, that, location, dispatch } = props;
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      fixed: 'left',
      render: record => {
        return <Fragment>
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
      align: 'center',
      editable: false,
    },
    {
      title: '一级编码',
      dataIndex: 'oneCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '二级编码',
      dataIndex: 'twoCode',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '一级编码型号',
      dataIndex: 'oneCodeModel',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '二级编码名称',
      dataIndex: 'twoCodeModel',
      inputType: 'text',
      width: 100,
      align: 'center',
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      inputType: 'text',
      align: 'center',
      width: 300,
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
      intentionId: location.query.id,
      tag:1
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
    handleModalVisibleMore()
  }

  return (
    <Modal
      title='物料选择'
      visible={modalVisibleMore}
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
const CreateFormForm = Form.create()(props => {
  const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator }, changecode,
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, showTable, searchcode, billid,
    submitting1, editdata } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      form.resetFields();
      const values = { ...fieldsValue };
      // values.price = 0
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
          <FormItem {...formItemLayout} label='调拨数量'>
            {getFieldDecorator('number', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? modalRecord.number :
                (isNotBlank(editdata) && isNotBlank(editdata.number) ? editdata.number
                  : 1),
              rules: [
                {
                  required: false,
                  message: '请输入调拨数量'
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
                isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.originalCode) ? editdata.cpBillMaterial.originalCode :
                  '',
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
                isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.name) ? editdata.cpBillMaterial.name :
                  '',
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
                isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.two) && isNotBlank(editdata.cpBillMaterial.two.name) ? editdata.cpBillMaterial.two.name :
                  '',
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
            {getFieldDecorator('oneCodeModel', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCodeModel) ? modalRecord.oneCodeModel :
                isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.one) && isNotBlank(editdata.cpBillMaterial.one.model) ? editdata.cpBillMaterial.one.model :
                  '',
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
                isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.rCode) ? editdata.cpBillMaterial.rCode :
                  '',
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
          <FormItem {...formItemLayout} label='备注信息'>
            {getFieldDecorator('remarks', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks) ? modalRecord.remarks :
                isNotBlank(editdata) && isNotBlank(editdata.remarks) ? editdata.remarks :
                  '',
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
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, complist, selectkhflag, selectcustomer, dispatch, form,
    form: { getFieldDecorator }, that } = props;
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
      title: '分公司编号',
      dataIndex: 'code',
      align: 'center',
      width: 150,
    },
    {
      title: '分公司名称',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    // {
    //   title: '公司图标',
    //   dataIndex: 'logo',
    //   align: 'center',
    //   width: 150,
    //   render: (text) => {
    //     if (isNotBlank(text)) {
    //       const images = text.split('|').map((item) => {
    //         if (isNotBlank(item)) {
    //           return <img
    //             key={item}
    //             onClick={() => this.handleImage(getFullUrl(item))}
    //             style={{ height: 50, width: 50, marginRight: 10 }}
    //             alt="example"
    //             src={getFullUrl(item)}
    //           />
    //         }
    //         return null;
    //       })
    //       return <div>{images}</div>
    //     }
    //     return '';
    //   },
    // },
    {
      title: '所属大区',
      dataIndex: 'area.name',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'master',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人电话',
      dataIndex: 'zipCode',
      align: 'center',
      width: 150,
    },
    {
      title: '抬头中文',
      dataIndex: 'rise',
      align: 'center',
      width: 150,
    },
    {
      title: '电话1',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
    },
    {
      title: '抬头英文',
      dataIndex: 'enrise',
      align: 'center',
      width: 150,
    },
    {
      title: '电话2',
      dataIndex: 'twoPhone',
      align: 'center',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      width: 200,
    },
    {
      title: '传真',
      align: 'center',
      dataIndex: 'fax',
      width: 150,
    },
    {
      title: '网址',
      dataIndex: 'website',
      align: 'center',
      width: 150,
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
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      fgssearch: {}
    })
    dispatch({
      type: 'company/pj_list_all',
      payload: {
        current: 1,
        pageSize: 10
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
      ...that.state.fgssearch,
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'company/pj_list_all',
      payload: params,
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10
      };
      if (!isNotBlank(fieldsValue.name)) {
        values.name = ''
      }

      that.setState({
        fgssearch: values
      })

      dispatch({
        type: 'company/pj_list_all',
        payload: values,
      });
    });
  };

  const handleModalVisiblekhin = () => {
    // form.resetFields();
    // that.setState({
    //   fgssearch: {}
    // })
    handleModalVisiblekh()
  }

  return (
    <Modal
      title='选择出库分公司'
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekhin()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="公司名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={complist}
        columns={columnskh}
      />
    </Modal>
  );
});
const CreateFormxs = Form.create()(props => {
  const { handleModalVisiblexs, complist, selectxsflag, selectxs, dispatch, form, form: { getFieldDecorator } } = props;
  const columnsxs = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectxs(record)}>
            选择
          </a>
        </Fragment>
      ),
    },
    {
      title: '分公司编号',
      dataIndex: 'code',
      align: 'center',
      width: 150,
    },
    {
      title: '分公司名称',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '公司图标',
      dataIndex: 'logo',
      align: 'center',
      width: 150,
      render: (text) => {
        if (isNotBlank(text)) {
          const images = text.split('|').map((item) => {
            if (isNotBlank(item)) {
              return <img
                key={item}
                onClick={() => this.handleImage(getFullUrl(item))}
                style={{ height: 50, width: 50, marginRight: 10 }}
                alt="example"
                src={getFullUrl(item)}
              />
            }
            return null;
          })
          return <div>{images}</div>
        }
        return '';
      },
    },
    {
      title: '所属大区',
      dataIndex: 'area.name',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'master',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人电话',
      align: 'center',
      dataIndex: 'zipCode',
      width: 150,
    },
    {
      title: '抬头中文',
      align: 'center',
      dataIndex: 'rise',
      width: 150,
    },
    {
      title: '电话1',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
    },
    {
      title: '抬头英文',
      dataIndex: 'enrise',
      align: 'center',
      width: 150,
    },
    {
      title: '电话2',
      dataIndex: 'twoPhone',
      align: 'center',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      width: 200,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      align: 'center',
      width: 150,
    },
    {
      title: '网址',
      dataIndex: 'website',
      align: 'center',
      width: 150,
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
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
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
      type: 'company/query_comp',
      payload: params,
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10
      };
      if (!isNotBlank(fieldsValue.name)) {
        values.name = ''
      }
      dispatch({
        type: 'company/query_comp',
        payload: values,
      });
    });
  };
  return (
    <Modal
      title='选择销售人'
      visible={selectxsflag}
      onCancel={() => handleModalVisiblexs()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="公司名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={complist}
        columns={columnsxs}
      />
    </Modal>
  );
});
@connect(({ cpAccessoriesAllot, loading, company, cpBillMaterial, cpPurchaseDetail }) => ({
  ...cpAccessoriesAllot,
  ...company,
  ...cpBillMaterial,
  ...cpPurchaseDetail,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpBillMaterial/get_cpAssemblyBuild_search_All'],
  submitting3: loading.effects['cpAccessoriesAllot/cpAccessoriesAllot_Add'],
  submitting2: loading.effects['cpupdata/cpAccessoriesAllot_update'],
}))
@Form.create()
class CpAccessoriesAllotForm extends PureComponent {
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
        title: '调拨数量',
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
        },
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
      selectkhdata: [],
      selectxsdata: [],
      selectxsflag: false,
      selectkhflag: false,
      orderflag: false,
      updataflag: true,
      editingKey: '',
      showdata: [],
      dataSource: [],
      FormVisible: false,
      modalVisibleMore: false,
      billid: '',
      confirmflag: true,
      updataname: '取消锁定',
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAccessoriesAllot/cpAccessoriesAllot_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1') {
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
          dispatch({
            type: 'cpPurchaseDetail/cpPurchaseDetail_List',
            payload: {
              pageSize: 10,
              purchaseId: location.query.id
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
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'PJDB'
            },
            callback: (imgres) => {
              this.setState({
                srcimg: imgres
              })
            }
          })
        }
      });
    }

    dispatch({
      type: 'company/pj_list_all',
      payload: {
        current: 1,
        pageSize: 10
      }
    });

    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'PJstatus',
      },
      callback: data => {
        this.setState({
          PJstatus: data
        })
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpAccessoriesAllot/clear',
    });
  }

  componentWillReceiveProps(nextProps) {
    const that = this
    if (nextProps.location.search != this.props.location.search) {
      this.setState({
        location: nextProps.location
      })
      setTimeout(() => {
        that.changeQrCode()
      }, 100)
    }
  }

  changeQrCode = () => {
    const { dispatch } = this.props
    const { location } = this.state

    const that = this
    this.props.form.resetFields()
    setTimeout(() => {
      if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
        dispatch({
          type: 'cpAccessoriesAllot/cpAccessoriesAllot_Get',
          payload: {
            id: location.query.id,
          },
          callback: (res) => {
            if (res.data.orderStatus === 1 || res.data.orderStatus === '1') {
              that.setState({ orderflag: true })
            } else {
              that.setState({ orderflag: false })
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
              that.setState({
                addfileList: res.data.photo.split('|'),
                fileList: photoUrl
              })
            }
            dispatch({
              type: 'cpPurchaseDetail/cpPurchaseDetail_List',
              payload: {
                pageSize: 5,
                purchaseId: location.query.id
              },
              callback: (resin) => {
                let newarr = []
                if (isNotBlank(resin.list) && resin.list.length > 0) {
                  newarr = [...resin.list]
                }
                that.setState({
                  dataSource: newarr
                })
              }
            });
            dispatch({
              type: 'sysarea/getFlatCode',
              payload: {
                id: location.query.id,
                type: 'PJDB'
              },
              callback: (imgres) => {
                that.setState({
                  srcimg: imgres
                })
              }
            })
          }
        });
      }
    }, 300)
  }

  handleSubmit = e => {
    const { dispatch, form, cpAccessoriesAllotGet } = this.props;
    const { addfileList, location, selectxsdata, selectkhdata, updataflag } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          let photo = [];
          let list = [];
          for (let i = 0; i < addfileList.length; i += 1) {
            if (isNotBlank(addfileList[i].id)) {
              photo = [...photo, addfileList[i].url];
            } else {
              list = [...list, addfileList[i]];
            }
          }
          if (isNotBlank(photo) && photo.length > 0) {
            value.photo = photo.map(row => row).join('|');
          } else {
            value.photo = '';
          }
          value.file = list;
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.needDate = moment(value.needDate).format("YYYY-MM-DD")
        if (isNotBlank(value) && isNotBlank(value.clientName)) {
          value.office = {}
          value.office.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id : (isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.office) && isNotBlank(cpAccessoriesAllotGet.office.id) ? cpAccessoriesAllotGet.office.id : '')
          delete value.clientName
        }
        value.user = {}
        value.user.id = isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.user) && isNotBlank(cpAccessoriesAllotGet.user.id) ? cpAccessoriesAllotGet.user.id : getStorage('userid')
        value.orderStatus = 1
        if (updataflag) {
          dispatch({
            type: 'cpAccessoriesAllot/cpAccessoriesAllot_Add',
            payload: { ...value },
            callback: (res) => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/warehouse/process/cp_accessories_allot_form?id=${res.data.id}`);
              // router.push('/warehouse/process/cp_accessories_allot_list');
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpAccessoriesAllot_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/warehouse/process/cp_accessories_allot_form?id=${location.query.id}`);
              // router.push('/warehouse/process/cp_accessories_allot_list');
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
      router.push(`/warehouse/process/cp_accessories_allot_form?id=${location.query.id}`);
    }
  }

  onsave = () => {
    const { dispatch, form, cpAccessoriesAllotGet } = this.props;
    const { addfileList, location, selectxsdata, selectkhdata, updataflag } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          let photo = [];
          let list = [];
          for (let i = 0; i < addfileList.length; i += 1) {
            if (isNotBlank(addfileList[i].id)) {
              photo = [...photo, addfileList[i].url];
            } else {
              list = [...list, addfileList[i]];
            }
          }
          if (isNotBlank(photo) && photo.length > 0) {
            value.photo = photo.map(row => row).join('|');
          } else {
            value.photo = '';
          }
          value.file = list;
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.needDate = moment(value.needDate).format("YYYY-MM-DD")
        if (isNotBlank(value) && isNotBlank(value.clientName)) {
          value.office = {}
          value.office.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id : (isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.office) && isNotBlank(cpAccessoriesAllotGet.office.id) ? cpAccessoriesAllotGet.office.id : '')
          delete value.clientName
        }
        value.user = {}
        value.user.id = isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.user) && isNotBlank(cpAccessoriesAllotGet.user.id) ? cpAccessoriesAllotGet.user.id : getStorage('userid')
        if (updataflag) {
          value.orderStatus = 0
          dispatch({
            type: 'cpAccessoriesAllot/cpAccessoriesAllot_Add',
            payload: { ...value },
            callback: (res) => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/warehouse/process/cp_accessories_allot_form?id=${res.data.id}`);
            }
          })
        } else {
          value.orderStatus = 1
          dispatch({
            type: 'cpupdata/cpAccessoriesAllot_update',
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
    router.push('/warehouse/process/cp_accessories_allot_list')
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

  handleModalVisiblexs = flag => {
    this.setState({
      selectxsflag: !!flag
    });
  };

  selectxs = (record) => {
    this.setState({
      selectxsdata: record,
      selectxsflag: false
    })
  }

  onselectkh = () => {
    this.setState({
      selectkhflag: true
    })
  }

  onselectxs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
    this.setState({
      selectxsflag: true
    })
  }

  onRevocation = (record) => {
    Modal.confirm({
      title: '撤销该配件调拨单',
      content: '确定撤销该配件调拨单吗？',
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
    setTimeout(() => {
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
          type: 'cpRevocation/cpAccessoriesAllot_Revocation',
          payload: { id },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/warehouse/process/cp_accessories_allot_form?id=${location.query.id}`);
            // router.push('/warehouse/process/cp_accessories_allot_list')
          }
        })
      }
    }
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
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

  handleFormAdd = (values) => {
    const { dispatch } = this.props
    const { location, modalRecord, editdata, billid } = this.state


    const newobj = {}
    if (isNotBlank(editdata) && isNotBlank(editdata.id)) {
      newobj.id = editdata.id
    }

    dispatch({
      type: 'cpPurchaseDetail/update_PJ_FromDetail',
      payload: {
        ...newobj,
        purchaseId: location.query.id,
        billId: isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? modalRecord.id : isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.id) ? editdata.cpBillMaterial.id : '',
        ...values,
        version: 0
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
          type: 'cpAccessoriesAllot/cpAccessoriesAllot_Get',
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
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id
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
      billid: '',
      editdata: {}
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
          purchaseId: location.query.id,
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

  showTable = () => {
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
      modalVisibleMore: true
    });
  }

  showmx = () => {
    this.setState({
      FormVisible: true
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
    };

    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: params,
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

    // dispatch({
    //   type: 'cpBillMaterial/cpBillMaterial_middle_List',
    //   payload: params,
    // });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpPurchaseDetail/cpAccessories_delete',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpAccessoriesAllot/cpAccessoriesAllot_Get',
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
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            pageSize: 10,
            purchaseId: location.query.id
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
      type: 'cpPurchaseDetail/update_PJ_FromDetail',
      payload: {
        purchaseId: location.query.id,
        id: row.id,
        number: row.number,
        version: 0,
        price: 0
      },
      callback: () => {
        dispatch({
          type: 'cpPurchaseDetail/cpPurchaseDetail_List',
          payload: {
            purchaseId: location.query.id
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

  changecode = (id) => {
    this.setState({
      modalRecord: {},
      billid: id
    })
  }

  handleModalVisibleMore = flag => {
    this.setState({
      modalVisibleMore: !!flag
    });
  };

  selectmore = (res) => {
    const { dispatch } = this.props;
    const { selectedRows, location } = this.state;
    this.setState({
      modalVisibleMore: false,
      modalRecord: res,
      billid: res.billCode
    })
  }

  edithtis = (res) => {
    this.setState({
      billid: isNotBlank(res.cpBillMaterial) && isNotBlank(res.cpBillMaterial.billCode) ? res.cpBillMaterial.billCode : '',
      editdata: res,
      FormVisible: true
    })
  }

  render() {
    const { previewVisible, previewImage, selectkhflag, selectxsflag, selectkhdata, selectxsdata, orderflag, updataflag, updataname, modalRecord
      , FormVisible, modalVisible, billid, modalVisibleMore, dataSource, srcimg, srcimg1, editdata, location } = this.state;
    const { submitting3, submitting2, submitting, cpAccessoriesAllotGet, complist, dispatch, pjalllist, submitting1, getcpBillMaterialAll, cpPurchaseDetailList } = this.props;
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
      if (!col.editable || cpAccessoriesAllotGet.orderStatus == 1 || cpAccessoriesAllotGet.orderStatus == 2) {
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
        title: '修改',
        width: 100,
        render: (text, record) => {
          if (isNotBlank(record.id) && isNotBlank(this.props.cpAccessoriesAllotGet) && (this.props.cpAccessoriesAllotGet.orderStatus == 0)) {
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
          if (isNotBlank(record.id) && this.props.cpAccessoriesAllotGet.orderStatus == 0) {
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

    const that = this

    const parentMethodsMore = {
      handleAdd: this.handleAdd,
      handleModalVisibleMore: this.handleModalVisibleMore,
      selectmore: this.selectmore,
      cpBillMaterialList: getcpBillMaterialAll,
      modalRecord,
      dispatch,
      that,
      location
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
      editdata
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
    const parentMethodskh = {
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      complist: pjalllist,
      dispatch,
      that

    }
    const parentMethodsxs = {
      handleModalVisiblexs: this.handleModalVisiblexs,
      selectxs: this.selectxs,
      complist,
      dispatch,
      that
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            配件调拨单
          </div>
          {isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单状态'>
                    {getFieldDecorator('orderStatus', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.orderStatus) ? ((cpAccessoriesAllotGet.orderStatus === 0 || cpAccessoriesAllotGet.orderStatus === '0') ? '未处理' : '已处理') : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入订单状态',
                        },
                      ],
                    })(<Input disabled style={cpAccessoriesAllotGet.orderStatus === 1 || cpAccessoriesAllotGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请单号'>
                    {getFieldDecorator('id', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.id) ? cpAccessoriesAllotGet.id : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入申请单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                {/* <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总金额'>
                    {getFieldDecorator('totalMoney', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.totalMoney) ? cpAccessoriesAllotGet.totalMoney : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入总金额',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col> */}
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='出库分公司'>
                    {getFieldDecorator('clientName', {
                      initialValue: isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name) ? selectkhdata.name :
                        (isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.office) && isNotBlank(cpAccessoriesAllotGet.office.name) ? cpAccessoriesAllotGet.office.name : ''),
                      rules: [
                        {
                          required: true,
                          message: '请选择出库分公司',
                          max: 255,
                        },
                      ],
                    })(<Input disabled style={{ width: '50%' }} />)}
                    <Button disabled={orderflag} type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请分公司'>
                    <Input disabled value={isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.user) && isNotBlank(cpAccessoriesAllotGet.user.office) ? cpAccessoriesAllotGet.user.office.name : getStorage('companyname')} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请人'>
                    <Input disabled value={(isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.user) ? cpAccessoriesAllotGet.user.name : getStorage('username'))} />
                  </FormItem>
                </Col>
                {/* <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='申请时间'>
                    </FormItem>
                </Col> */}
                {/* <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='打印次数'>
                    {getFieldDecorator('number', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.number) ? cpAccessoriesAllotGet.number : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入打印次数',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col> */}
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='报件单号'>
                    {getFieldDecorator('quoteCode', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.quoteCode) ? cpAccessoriesAllotGet.quoteCode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入报件单号',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="需求日期">
                    {getFieldDecorator('needDate', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.needDate) ? moment(cpAccessoriesAllotGet.needDate) : null,
                      rules: [
                        {
                          required: true,
                          message: '请选择需求日期',
                        },
                      ],
                    })(
                      <DatePicker
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                        disabled={orderflag && updataflag}
                      />
                    )
                    }
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='调拨状态'>
                    {getFieldDecorator('status', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.status) ? cpAccessoriesAllotGet.status : '',
                      rules: [
                        {
                          required: false,
                          message: '请选择调拨状态',
                        },
                      ],
                    })(<Select
                      allowClear
                      disabled={orderflag && updataflag}
                      style={{ width: '100%' }}

                    >
                      {
                        isNotBlank(this.state.PJstatus) && this.state.PJstatus.length > 0 && this.state.PJstatus.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="调拨事由" className="allinputstyle">
                    {getFieldDecorator('cause', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.cause) ? cpAccessoriesAllotGet.cause : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入调拨事由',
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
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.remarks) ? cpAccessoriesAllotGet.remarks : '',
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesAllot').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesAllot')[0].children.filter(item => item.name == '二次修改')
                  .length > 0 &&
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                  {updataname}
                </Button>
              }
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesAllot').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesAllot')[0].children.filter(item => item.name == '修改')
                  .length > 0 && <span>
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting3 || submitting2} disabled={orderflag && updataflag}>
                    保存
                    </Button>
                  <Button type="primary" style={{ marginLeft: '8px', marginRight: '8px' }} htmlType="submit" loading={submitting3 || submitting2} disabled={orderflag && updataflag}>
                    提交
                    </Button>
                  <Button disabled={orderflag || (!isNotBlank(cpAccessoriesAllotGet.id))} onClick={this.showmx}>
                    新增明细
                    </Button>
                  {
                    isNotBlank(cpAccessoriesAllotGet) && isNotBlank(cpAccessoriesAllotGet.orderStatus) && (cpAccessoriesAllotGet.orderStatus === 1 || cpAccessoriesAllotGet.orderStatus === '1') ?
                      <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpAccessoriesAllotGet.id)} loading={submitting3 || submitting2}>
                        撤销
                      </Button> : null
                  }
                </span>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
              </Button>
            </FormItem>
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
                  pagination={cpPurchaseDetailList.pagination}
                  columns={columns}
                  cpAccessoriesAllotGet={cpAccessoriesAllotGet}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </div>
        </Card>
        <CreateFormMore {...parentMethodsMore} modalVisibleMore={modalVisibleMore} />
        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormxs {...parentMethodsxs} selectxsflag={selectxsflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpAccessoriesAllotForm;
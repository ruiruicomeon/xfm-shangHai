import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Upload, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import moment from 'moment';
import styles from './CpSupplierList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
let timer = null

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const ImportFile = Form.create()(props => {
  const {
    modalImportVisible,
    handleImportVisible,
    UploadFileVisible,
    fileL,
    handleFileList,
  } = props;

  const Stoken = { token: getStorage('token') };

  const propsUpload = {
    name: 'list',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Beauty/beauty/cpBillMaterial/import',
    // data: { source: getStorage('userId'), sourceName: getStorage('userName') ,tag:9999},
    beforeUpload(file) {
      const isimg = file.type.indexOf('image') < 0;
      if (!isimg) {
        message.error('请选择Execl文件上传');
      }
      const isLt10M = file.size / 1024 / 1024 <= 100;
      if (!isLt10M) {
        message.error('文件大小需为100M以内');
      }
      return isimg && isLt10M;
    },
    onChange(info) {
      const isimg = info.file.type.indexOf('image') < 0;
      const isLt10M = info.file.size / 1024 / 1024 <= 100;
      let fileList = info.fileList.slice(-1);

      fileList = fileList.filter(file => {
        if (file.response) {
          if (file.response.success === '1') {
            message.success(file.response.msg);
            UploadFileVisible();
          } else if (
            isNotBlank(file) &&
            isNotBlank(file.response) &&
            isNotBlank(file.response.msg)
          ) {
            message.error(file.response.msg);
          }
          return file.response.success === '1';
        }
        return true;
      });
      // UploadPhotosVisible();
      if (isimg && isLt10M) {
        handleFileList(fileList);
      }
    },
  };

  return (
    <Modal
      title="导入物料编码"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入物料编码
                </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});

const CreateFormMore = Form.create()(props => {
  const { modalVisibleMore, handleModalVisibleMore, form: { getFieldDecorator },
    cpBillMaterialList, selectmore, handleSelectRows1, selectedRows1, dispatch, form, location } = props;

  const selectcolumns = [
    // {
    //   title: '操作',
    //   width: 150,
    //   render: record => {
    //     if(!isNotBlank(record.status)){
    //       return  <Fragment>
    //       <a onClick={() => selectmore(record)}>
    //         选择
    //        </a>
    //     </Fragment>
    //     }
    //   }
    //   ,
    // },
    // {
    //   title: '仓库',        // 必填显示
    //   dataIndex: 'cpPjEntrepot.name',   // 必填 参数名
    //   inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
    //   width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
    //   editable: false,      // 选填  是否可编辑
    // },
    {
      title: '物料编码',        // 必填显示
      dataIndex: 'billCode',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },

    {
      title: '一级编码',        // 必填显示
      dataIndex: 'oneCode',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },

    {
      title: '二级编码',        // 必填显示
      dataIndex: 'twoCode',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },

    {
      title: '一级编码型号',        // 必填显示
      dataIndex: 'oneCodeModel',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },

    {
      title: '二级编码名称',        // 必填显示
      dataIndex: 'twoCodeModel',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },

    {
      title: '名称',        // 必填显示
      dataIndex: 'name',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 300,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },

    {
      title: '原厂编码',        // 必填显示
      dataIndex: 'originalCode',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },

    {
      title: '配件厂商',        // 必填显示
      dataIndex: 'rCode',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
    },
    // {
    //   title: '需求数量',        // 必填显示
    //   dataIndex: 'number',   // 必填 参数名
    //   inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
    //   width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
    //   editable: true,      // 选填  是否可编辑
    // },
    {
      title: '单位',        // 必填显示
      dataIndex: 'unit',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
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
      title: '备注信息',        // 必填显示
      dataIndex: 'remarks',   // 必填 参数名
      inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      editable: true,      // 选填  是否可编辑
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

      dispatch({
        type: 'cpBillMaterial/get_cpBill_caterialList2',
        payload: {
          pageSize: 10,
          ...values,
          parent1: location.query.id,
          current: 1,
          tag:1
        }
      });

      // dispatch({
      //   type: 'cpBillMaterial/cpBillMaterial_List',
      //   payload: {
      //     ...values,
      //     pageSize: 10,
      //     current: 1,
      //   },
      // });
    });
  };


  const handleFormReset = () => {
    form.resetFields();

    dispatch({
      type: 'cpBillMaterial/get_cpBill_caterialList2',
      payload: {
        pageSize: 10,
        current: 1,
        parent1: location.query.id,
        tag:1
      }
    });
    // dispatch({
    //   type: 'cpBillMaterial/cpBillMaterial_List',
    //   payload: {
    //     pageSize: 10,
    //     current: 1,
    //   },
    // });
  };

  // const handleStandardTableChange = (pagination, filtersArg, sorter) => {
  //   // const { formValues } = this.state;

  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});

  //   const params = {
  //     current: pagination.current,
  //     pageSize: pagination.pageSize,
  //     //   ...formValues,
  //     ...filters,
  //     sort: 1,
  //   };
  //   if (sorter.field) {
  //     params.sorter = `${sorter.field}_${sorter.order}`;
  //   }

  //   dispatch({
  //     type: 'cpBillMaterial/get_cpBill_caterialList2',
  //     payload: params,
  //   });
  // };

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
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem  {...formItemLayout} label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem  {...formItemLayout} label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem  {...formItemLayout} label="原厂编码">
              {getFieldDecorator('originalCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="配件厂商">
              {getFieldDecorator('rCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

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


      {isNotBlank(selectedRows1) && selectedRows1.length > 0 && (
        <span>
          <Button icon="user-add" onClick={(e) => selectmore(e)}>批量选择</Button>
        </span>
      )}
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        childrenColumnName='cpBillMaterialList'
        selectedRows={selectedRows1}
        //   loading={loading}
        onSelectRow={handleSelectRows1}
        data={cpBillMaterialList}
        columns={selectcolumns}
      />
    </Modal>
  );
});

@connect(({ cpBillMaterial, loading ,cpClient}) => ({
  ...cpBillMaterial,
  ...cpClient,
  loading: loading.models.cpBillMaterial,
}))
@Form.create()

class CpBillMaterialListNew extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
      selectedRows1: [],
      formValues: {},
      modalImportVisible: false,
      importFileList: [],
      wltitle: '',
      // location: getLocation(),
    }
  }

  componentDidMount() {
    const { dispatch,location } = this.props;
    // const { location } = this.state
    // dispatch({
    //   type: 'cpClient/get_CpType',
    //   payload:{
    //     id: isNotBlank(location)&&isNotBlank(location.query)&&isNotBlank(location.query.id)?location.query.id:''
    //   },
    // callback:(res)=>{
    //   this.setState({
    //       wltitle:isNotBlank(res.data)&&isNotBlank(res.data.name)?res.data.name:''
    //   })
    dispatch({
      type: 'cpClient/get_cpBillMaterialList_no',
      payload: {
        pageSize: 10,
        // isTemplate:1,
        typeId: isNotBlank(location.query)&&isNotBlank(location.query.id)?location.query.id:'',
      }
    });

    document.onmousemove = document.onkeydown = function () {
      var tick = 0
      clearInterval(timer)
      timer = null
      timer = setInterval(function () {
        tick++;
        console.log(tick)
        if (tick > 50) {
          clearInterval(timer)
          document.onmousemove = document.onkeydown = null
          setTimeout(function () {
            router.push('/information_inquiry_Out')
          }, 1000)

        }
      }, 1000);
    }

    //   }
    // })
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    clearInterval(timer)
    timer = null
    document.onmousemove = document.onkeydown = null
    form.resetFields();
    dispatch({
      type: 'cpClient/clear',
    });
  }

  // gotoForm = () => {
  //   router.push(`/basicManagement/materials/cp_bill_material_new`);
  // }

  gotoUpdateForm = (id) => {
    router.push(`/basicManagement/materials/cp_bill_material_new?id=${id}`);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch ,location} = this.props;
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
      typeId:isNotBlank(location.query.id)?location.query.id:'',
      ...sort,
      ...formValues,
      ...filters,
      // isTemplate:1,
    };
    dispatch({
      type: 'cpClient/get_cpBillMaterialList_no',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch ,location } = this.props;
    // const { location } = this.state
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpClient/get_cpBillMaterialList_no',
      payload: {
        pageSize: 10,
        current: 1,
        // isTemplate:1,
        typeId: location.query.id,
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
    const { dispatch ,location} = this.props;
    const { selectedRows, formValues  } = this.state;
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
        type: 'cpBillMaterial/updateBacth',
        payload: {
          ids,
          parent: ''
        },
        callback: () => {
          // 成功之后需要刷新列表数据
          // 并且添加当前搜索字段  页数归0
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'cpClient/get_cpBillMaterialList_no',
            payload: {
              pageSize: 10,
              ...formValues,
              // isTemplate:1,
              typeId: location.query.id,
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


  handleSelectRows1 = rows => {
    this.setState({
      selectedRows1: rows,
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form ,location} = this.props;
    // const { location } = this.state
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
        type: 'cpClient/get_cpBillMaterialList_no',
        // type: 'cpBillMaterial/cpBillMaterial_List',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          // isTemplate:1,
          typeId: location.query.id,
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
        if (value[item] instanceof moment) {
          value[item] = value[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          // 成功之后需要刷新列表数据
          // 并且添加当前搜索字段  页数归0
          dispatch({
            type: 'cpBillMaterial/cpBillMaterial_List',
            payload: {
              pageSize: 10,
              ...formValues,
              tag:1
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
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

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

  ongoback = ()=>{
    router.goBack();
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('billCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码">
              {getFieldDecorator('oneCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码">
              {getFieldDecorator('twoCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="一级编码型号">
              {getFieldDecorator('oneCodeModel', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二级编码名称">
              {getFieldDecorator('twoCodeModel', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="原厂编码">
              {getFieldDecorator('originalCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="配件厂商">
              {getFieldDecorator('rCode', {
                initialValue: ''
              })(
                <Input placeholder="请输入" />

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

  handleImportVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  handleFileList = fileData => {
    this.setState({
      importFileList: fileData,
    });
  };

  handleUpldExportClick = type => {
    const userid = { id: getStorage('userid'), isTemplate: type };
    window.open(`/api/Beauty/sys/user/export?${stringify(userid)}`);
  };

  handleModalVisibleMore = flag => {
    this.setState({
      modalVisibleMore: !!flag
    });
  };

  showTable = () => {
    const { dispatch ,location} = this.props
    // const { location } = this.state
    dispatch({
      type: 'cpBillMaterial/get_cpBill_caterialList2',
      payload: {
        pageSize: 10,
        parent1: location.query.id,
        tag:1
      }
    });
    this.setState({
      modalVisibleMore: true
    });
  }

  selectmore = (res) => {
    // const { dispatch } = this.props
    // const { intentionId, location } = this.state
    const { dispatch ,location } = this.props;
    const { selectedRows1  } = this.state;

    this.setState({
      modalVisibleMore: false,
      modalRecord: res
    })

    let ids = '';
    if (selectedRows1.length === 1) {
      ids = selectedRows1[0];
    } else {
      if (selectedRows1.length === 0) {
        message.error('未选择物料列表');
        return;
      }
      ids = selectedRows1.map(row => row).join(',');

    }

    dispatch({
      type: 'cpBillMaterial/updateBacth',
      payload: {
        parent: location.query.id,
        ids
      },
      callback: () => {
        this.setState({
          modalVisibleMore: false
        })
        // dispatch({
        //   type: 'cpBillMaterial/cpBillMaterial_List',
        //   payload: {
        //     intentionId: location.query.id,
        //     pageSize: 10,
        //   }
        // });
        dispatch({
          type: 'cpBillMaterial/get_cpBill_caterialList1',
          payload: {
            parent: location.query.id,
            pageSize: 10,
            tag:1
          }
        });

      }
    })
  }

  showwlcode = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sysarea/getFlatCode',
      payload: {
        id: isNotBlank(id) ? id : '',
        type: 'WL'
      },
      callback: (srcres) => {
        this.setState({
          srcimg: srcres.msg
        })
      }
    })
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handleImage = url => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }

  render() {
    const { selectedRows, importFileList, modalImportVisible, selectedRows1, modalVisibleMore, srcimg, wltitle, previewImage, previewVisible } = this.state;
    const { loading, getCpBillMaterialNoList, dispatch, getcpBillmaterialList1, getcpBillmaterialList2 ,location} = this.props;

    const parentMethodsMore = {
      handleAdd: this.handleAdd,
      handleModalVisibleMore: this.handleModalVisibleMore,
      // showTable: this.showTable,
      selectmore: this.selectmore,
      cpBillMaterialList: getcpBillmaterialList2,
      selectedRows1,
      dispatch,
      location,
      handleSelectRows1: this.handleSelectRows1,
    }

    // 可编辑列表 需要固定操作参数   【编辑，保存，取消】
    const columns = [
      {
        title: '物料二维码',
        dataIndex: 'photo',
        align: 'center',
        width: 200,
        render:(text)=>{
              return <img src={getFullUrl('/'+text)} 
              onClick={() => this.handleImage(getFullUrl('/'+text))}
                    style={{width:'100px'}} alt="" />
        }
      },
      {
        title: '物料编码',        // 必填显示
        dataIndex: 'billCode',
        align: 'center',
        // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 150,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      {
        title: '一级编码',        // 必填显示
        dataIndex: 'oneCode',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,
        align: 'center',      // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      {
        title: '二级编码',
        align: 'center',     // 必填显示
        dataIndex: 'twoCode',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      {
        title: '一级编码型号',
        align: 'center',       // 必填显示
        dataIndex: 'oneCodeModel',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      {
        title: '二级编码名称',
        align: 'center',      // 必填显示
        dataIndex: 'twoCodeModel',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      {
        title: '名称',
        align: 'center',      // 必填显示
        dataIndex: 'name',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 200,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      {
        title: '原厂编码',        // 必填显示
        dataIndex: 'originalCode',   // 必填 参数名
        inputType: 'text',
        align: 'center',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 150,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      {
        title: '配件厂商',        // 必填显示
        dataIndex: 'rCode',   // 必填 参数名
        inputType: 'text',
        align: 'center',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },
      {
        title: '单位',        // 必填显示
        dataIndex: 'unit',
        align: 'center',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },

      // {
      //   title: '状态',        // 必填显示
      //   dataIndex: 'status',
      //   align: 'center',  // 必填 参数名
      //   inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
      //   width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
      //   editable: true,      // 选填  是否可编辑
      // },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        align: 'center',
        editable: false,
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
        title: '更新时间',
        dataIndex: 'finishDate',
        align: 'center',
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
        title: '备注信息',        // 必填显示
        dataIndex: 'remarks',
        align: 'center',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },
      //  {
      //   title: '基础操作',
      //   width: 100,
      //   align: 'center' ,
      //   render: (text, record) => {
      //     return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpBillMaterial').length>0
      //     && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpBillMaterial')[0].children.filter(item=>item.name=='删除')
      //     .length>0?
      //     <Fragment>
      //       <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
      //         <a>删除</a>
      //       </Popconfirm>
      //     </Fragment>
      //     :''
      //   },
      // },
    ];

    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };

    return (
      // <PageHeaderWrapper>
      // <div className={styles.standardList} >
        <div className={styles.standardList}>
          {/* <div className={styles.tableListOperator}>
            <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
              导入编码
          </Button>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(0)}>
              导出模板
          </Button>
            <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(1)}>
              导出数据
          </Button>
          </div> */}
          <Card bordered={false}>
            <div className={styles.tableList}>
              {/* <div className={styles.tableListOperator} > */}
              <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
          <Button  onClick={() => this.ongoback()}>
											返回
            					</Button>
          <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
								扫码物料</span>
                </div>
                  {/* </div>
                <div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>扫码物料({isNotBlank(location.query)&&isNotBlank(location.query.name)?location.query.name:''})</div>
              </div> */}
              {/* {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial').length > 0
                  && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpBillMaterial')[0].children.filter(item => item.name == '修改')
                    .length > 0 &&
                  <Button icon="plus" type="primary" onClick={() => this.showTable()}>
                    新增
                </Button>
                }
                {selectedRows.length > 0 && (
                  <span>
                    <Button icon="delete" onClick={(e) => this.editAndDelete(e)}> 批量删除</Button>
                  </span>
                )}
                <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
              </Button> */}
               <div className={styles.tableListForm}>{this.renderForm()}</div>
              <StandardEditTable
                scroll={{ x: 700 }}
                // selectedRows={selectedRows}
                loading={loading}
                data={getCpBillMaterialNoList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                // onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
        <CreateFormMore {...parentMethodsMore} modalVisibleMore={modalVisibleMore} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        </div>
      // </PageHeaderWrapper>
    );
  }

}
export default CpBillMaterialListNew;
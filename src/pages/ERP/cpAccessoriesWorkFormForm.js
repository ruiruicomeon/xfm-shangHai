import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  message,
  Icon,
  Modal,
  DatePicker,
  Row, Col,
  Cascader
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import StandardEditTable from '@/components/StandardEditTable';
import styles from './CpAccessoriesWorkFormForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateFormwx = Form.create()(props => {
  const { handleModalVisiblewx, userlist, selectflag, selectuserwx, levellist, levellist2, newdeptlist, form, dispatch ,that } = props;
  const { getFieldDecorator } = form
  const selectcolumns = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectuserwx(record)}>
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
        sgsearch:values
      })

      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
    });
  };
  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      sgsearch:{}
    })

    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10
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
      ...that.state.sgsearch,
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
                <Select style={{ width: '100%' }}  allowClear>
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


  const handleModalVisiblewxin =()=>{
    // form.resetFields();
    // that.setState({
    //   sgsearch:{}
    // })
    handleModalVisiblewx()
  }

  return (
    <Modal
      title='选择施工班组'
      visible={selectflag}
      onCancel={() => handleModalVisiblewxin()}
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

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator },
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, dispatch, location } = props;
  const selectcolumns = [
    {
      title: '物料编码',        
      dataIndex: 'billCode',   
      inputType: 'text',
      align: 'center',  
      width: 150,          
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
      title: '创建时间',
      dataIndex: 'createDate',
      editable: false,
      align: 'center',
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
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      align: 'center',
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
      align: 'center',  
      width: 150,          
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
      dispatch({
        type: 'cpBillMaterial/cpBillMaterial_List',
        payload: {
          purchaseId: location.query.id,
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
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: {
        purchaseId: location.query.id,
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
      purchaseId: location.query.id,
      ...filters,
      tag:1
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
      payload: params,
    });
  };
  return (
    <Modal
      title='物料选择'
      visible={modalVisible}
      onOk={(e) => selectuser(e)}
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
        selectedRows={selectedRows}
        onChange={handleStandardTableChange}
        onSelectRow={handleSelectRows}
        data={cpBillMaterialList}
        columns={selectcolumns}
      />
    </Modal>
  );
});
@connect(({ cpAccessoriesWorkForm, loading, cpBillMaterial, syslevel, sysdept, sysuser }) => ({
  ...cpAccessoriesWorkForm,
  ...cpBillMaterial,
  ...syslevel,
  ...sysdept,
  ...sysuser,
  newdeptlist: sysdept.deptlist.list,
  loading: loading.models.cpBillMaterial,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpAccessoriesWorkForm/cpAccessoriesWorkForm_Add'],
  submitting2: loading.effects['cpupdata/cpBusinessOrder_update'],
}))
@Form.create()
class CpAccessoriesWorkFormForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectedRows: [],
      confirmflag :true,
      orderflag: false,
      updataflag: true,
      updataname: '取消锁定',
      location: getLocation(),
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAccessoriesWorkForm/cpAccessoriesWorkForm_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'
            || (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesWorkForm').length > 0
              && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesWorkForm')[0].children.filter(item => item.name == '修改')
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
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'PJSG'
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
              type: 'PJSG'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
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
        pageSize: 10
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
      payload: {
        type: 'interiorType',
      },
      callback: data => {
        this.setState({
          interior_type: data
        })
      }
    });
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_List',
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
      type: 'cpAccessoriesWorkForm/clear',
    });
    dispatch({
      type: 'cpBillMaterial/clear',
    });

  }

  handleSubmit = e => {
    const { dispatch, form, cpAccessoriesWorkFormGet, cpBillMaterialMiddleList } = this.props;
    const { addfileList, location, updataflag, selectdata } = this.state;
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
        value.user = {}
        if (!isNotBlank(value.needDate)) {
          value.needDate = ''
        } else {
          value.needDate = moment(value.needDate).format("YYYY-MM-DD HH:mm")
        }
        if (isNotBlank(cpBillMaterialMiddleList) && isNotBlank(cpBillMaterialMiddleList.list) && cpBillMaterialMiddleList.list.length > 0 && isNotBlank(cpBillMaterialMiddleList.list[0].number)) {
          value.renovationNumber = cpBillMaterialMiddleList.list[0].number
        }
        value.constructionTeam = {}
        value.constructionTeam.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id : isNotBlank(cpAccessoriesWorkFormGet) &&
          isNotBlank(cpAccessoriesWorkFormGet.constructionTeam) && isNotBlank(cpAccessoriesWorkFormGet.constructionTeam.id) ? cpAccessoriesWorkFormGet.constructionTeam.id : ''
        value.user = {}
        value.user.id = isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) && isNotBlank(cpAccessoriesWorkFormGet.user.id) ? cpAccessoriesWorkFormGet.user.id : getStorage('userid')
        value.orderStatus = 1
        if (updataflag) {
          dispatch({
            type: 'cpAccessoriesWorkForm/cpAccessoriesWorkForm_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_accessories_work_form_form?id=${location.query.id}`);
              // router.push('/business/process/cp_accessories_work_form_list')
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpAccessoriesWorkForm_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/business/process/cp_accessories_work_form_form?id=${location.query.id}`);
              // router.push('/business/process/cp_accessories_work_form_list')
            }
          })
        }
      }
    });
  };

  onsave = e => {
    const { dispatch, form, cpAccessoriesWorkFormGet, cpBillMaterialMiddleList } = this.props;
    const { addfileList, location, updataflag, selectdata } = this.state;
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
        if (isNotBlank(cpBillMaterialMiddleList) && isNotBlank(cpBillMaterialMiddleList.list) && cpBillMaterialMiddleList.list.length > 0 && isNotBlank(cpBillMaterialMiddleList.list[0].number)) {
          value.renovationNumber = cpBillMaterialMiddleList.list[0].number
        }
        value.constructionTeam = {}
        value.constructionTeam.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id : isNotBlank(cpAccessoriesWorkFormGet) &&
          isNotBlank(cpAccessoriesWorkFormGet.constructionTeam) && isNotBlank(cpAccessoriesWorkFormGet.constructionTeam.id) ? cpAccessoriesWorkFormGet.constructionTeam.id : ''
        value.user = {}
        value.user.id = isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) && isNotBlank(cpAccessoriesWorkFormGet.user.id) ? cpAccessoriesWorkFormGet.user.id : getStorage('userid')
        value.needDate = moment(value.needDate).format("YYYY-MM-DD HH:mm")
        if (updataflag) {
          value.orderStatus = 0
          dispatch({
            type: 'cpAccessoriesWorkForm/cpAccessoriesWorkForm_Add',
            payload: { ...value },
            callback: () => {
            }
          })
        } else {
          value.orderStatus = 1
          dispatch({
            type: 'cpupdata/cpAccessoriesWorkForm_update',
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

  onupdata = () => {
    const { location, updataflag } = this.state
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定'
      })
    } else {
      router.push(`/business/process/cp_accessories_work_form_form?id=${location.query.id}`);
    }
  }

  onCancelCancel = () => {
    router.push('/business/process/cp_accessories_work_form_list')
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

  showTable = () => {
    this.setState({
      modalVisible: true
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  selectuser = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, location } = this.state;
    let ids = '';
    if (selectedRows.length === 1) {
      ids = selectedRows[0];
    } else {
      if (selectedRows.length === 0) {
        message.error('未选择物流列表');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_middle_Add',
      payload: {
        singelId: location.query.id,
        ids
      },
      callback: () => {
        this.setState({
          modalVisible: false
        })
        dispatch({
          type: 'cpBillMaterial/cpBillMaterial_List',
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
          }
        })
      }
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_middle_Delete',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpBillMaterial/cpBillMaterial_List',
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
          }
        });
      }
    });
  }

  onRevocation = (record) => {
    Modal.confirm({
      title: '撤销该配件施工单',
      content: '确定撤销该配件施工单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.onUndo(record),
    });
  }

  onUndo = (id) => {
    const { dispatch, cpAccessoriesWorkFormGet } = this.props;
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
    if (isNotBlank(id)) {
      dispatch({
        type: 'cpAccessoriesWorkForm/CpAccessoriesWork_Revocation',
        payload: { id: cpAccessoriesWorkFormGet.id },
        callback: () => {
          this.setState({
            addfileList: [],
            fileList: [],
          });
          router.push(`/business/process/cp_accessories_work_form_form?id=${location.query.id}`);
          // router.push('/business/process/cp_accessories_work_form_list')
        }
      })
    }
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
      pageSize: pagination.pageSize,
      ...sort,
      ...formValues,
      ...filters,
      singelId: location.query.id,
    };
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_middle_List',
      payload: params,
    });
  };

  onselect = () => {
        this.setState({
          selectflag: true
        })
  }

  selectuserwx = (record) => {
    this.setState({
      selectdata: record,
      selectflag: false
    })
  }

  handleModalVisiblewx = flag => {
    this.setState({
      selectflag: !!flag
    });
  };

  render() {
    const { fileList, previewVisible, previewImage, orderflag, modalRecord, modalVisible, selectedRows, location, updataname, updataflag, selectdata, selectflag, srcimg, srcimg1 } = this.state;
    const { submitting1, submitting2, submitting, cpAccessoriesWorkFormGet, cpBillMaterialList, cpBillMaterialMiddleList, loading, dispatch, userlist,
      levellist, levellist2, newdeptlist } = this.props;

      const that = this

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
    const columns = [
      {
        title: '物料编码',        
        dataIndex: 'cpBillMaterial.billCode',   
        inputType: 'text',
        align: 'center', 
        width: 150,          
        editable: true,      
      },
      {
        title: '一级编码',        
        dataIndex: 'cpBillMaterial.oneCode',   
        inputType: 'text',
        align: 'center',  
        width: 100,          
        editable: true,      
      },
      {
        title: '二级编码',        
        dataIndex: 'cpBillMaterial.twoCode',   
        inputType: 'text',
        align: 'center',  
        width: 100,          
        editable: true,      
      },
      {
        title: '一级编码型号',        
        dataIndex: 'cpBillMaterial.oneCodeModel',   
        inputType: 'text',
        align: 'center',  
        width: 100,          
        editable: true,      
      },
      {
        title: '二级编码名称',        
        dataIndex: 'cpBillMaterial.twoCodeModel',   
        inputType: 'text',
        align: 'center',   
        width: 100,          
        editable: true,      
      },
      {
        title: '名称',        
        dataIndex: 'cpBillMaterial.name',   
        inputType: 'text',
        align: 'center',  
        width: 300,          
        editable: true,      
      },
      {
        title: '原厂编码',        
        dataIndex: 'cpBillMaterial.originalCode',   
        inputType: 'text',
        align: 'center',   
        width: 100,          
        editable: true,      
      },
      {
        title: '配件厂商',        
        dataIndex: 'cpBillMaterial.rCode',   
        inputType: 'text',
        align: 'center',  
        width: 100,          
        editable: true,      
      },
      {
        title: '翻新数量',        
        dataIndex: 'number',   
        inputType: 'text',
        align: 'center', 
        width: 100,          
        editable: true,      
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        editable: false,
        align: 'center',
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
        title: '更新时间',
        dataIndex: 'finishDate',
        editable: true,
        align: 'center',
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
        dataIndex: 'cpBillMaterial.remarks',   
        inputType: 'text',
        align: 'center',   
        width: 150,          
        editable: true,      
      },
    ]
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      cpBillMaterialList,
      dispatch,
      location,
      modalRecord,
      selectedRows,
      handleSelectRows: this.handleSelectRows,
    };
    const parentMethodswx = {
      handleModalVisiblewx: this.handleModalVisiblewx,
      selectuserwx: this.selectuserwx,
      handleSearch: this.handleSearch,
      handleFormResetwx: this.handleFormResetwx,
      userlist,
      levellist, levellist2, newdeptlist, dispatch,
      that
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            配件施工单
          </div>
          {isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
            </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
            </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单状态'>
                    <Input
                      disabled
                      value={isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.orderStatus) ? (
                        cpAccessoriesWorkFormGet.orderStatus === 0 || cpAccessoriesWorkFormGet.orderStatus === '0' ? '未处理' : (
                          cpAccessoriesWorkFormGet.orderStatus === 1 || cpAccessoriesWorkFormGet.orderStatus === '1' ? '已处理' :
                            cpAccessoriesWorkFormGet.orderStatus === 2 || cpAccessoriesWorkFormGet.orderStatus === '2' ? '关闭' : '')) : ''}
                      style={cpAccessoriesWorkFormGet.orderStatus === 0 || cpAccessoriesWorkFormGet.orderStatus === '0' ? { color: '#f50' } : (
                        cpAccessoriesWorkFormGet.orderStatus === 1 || cpAccessoriesWorkFormGet.orderStatus === '1' ? { color: '#87d068' } : { color: 'rgb(166, 156, 156)' }
                      )}
                    />
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='订单编号' className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.orderCode) ? cpAccessoriesWorkFormGet.orderCode : '',     
                      rules: [
                        {
                          required: true,   
                          message: '请输入订单编号',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单分类'>
                    {getFieldDecorator('orderType', {
                      initialValue: isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.orderType) ? cpAccessoriesWorkFormGet.orderType : '',     
                      rules: [
                        {
                          required: true,   
                          message: '请输入订单分类',
                        },
                      ],
                    })(<Select
                      allowClear
                      disabled
                      style={{ width: '100%' }}
                      
                    >
                      {
                        isNotBlank(this.state.interior_type) && this.state.interior_type.length > 0 && this.state.interior_type.map(d => <Option key={d.id} value={d.value}>{d.label}内部订单</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="下单人信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='员工'>
                    <Input
                      style={{ width: '100%' }}
                      disabled
                      value={isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) ? cpAccessoriesWorkFormGet.user.name : getStorage('username')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) && isNotBlank(cpAccessoriesWorkFormGet.user.office) ? cpAccessoriesWorkFormGet.user.office.name : getStorage('companyname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) && isNotBlank(cpAccessoriesWorkFormGet.user.areaName) ? cpAccessoriesWorkFormGet.user.areaName : getStorage('areaname'))}
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
                      style={{ width: '100%' }}
                      disabled
                      value={isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) ? cpAccessoriesWorkFormGet.user.name : getStorage('username')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) && isNotBlank(cpAccessoriesWorkFormGet.user.office) ? cpAccessoriesWorkFormGet.user.office.name : getStorage('companyname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAccessoriesWorkFormGet)&& isNotBlank(cpAccessoriesWorkFormGet.user) && isNotBlank(cpAccessoriesWorkFormGet.user.areaName) ? cpAccessoriesWorkFormGet.user.areaName : getStorage('areaname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='电话'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.user) && isNotBlank(cpAccessoriesWorkFormGet.user.phone) ? cpAccessoriesWorkFormGet.user.phone : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="施工内容" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='配件型号'>
                    {getFieldDecorator('model', {
                      initialValue: isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.model) ? cpAccessoriesWorkFormGet.model : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入配件型号',
                        },
                      ],
                    })(<Input  disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="需求时间">
                    {getFieldDecorator('needDate', {
                      initialValue: isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.needDate) ? moment(cpAccessoriesWorkFormGet.needDate) : null,
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
                  <FormItem {...formItemLayout} label='施工班组'>
                    <Input
                      style={{ width: '50%' }}
                      disabled
                      value={isNotBlank(selectdata) && isNotBlank(selectdata.name) ?
                        selectdata.name : (isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.constructionTeam) ? cpAccessoriesWorkFormGet.constructionTeam.name : '')}
                    />
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselect} loading={submitting} disabled={orderflag}>选择</Button>
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='翻新要求' className="allinputstyle">
                    {getFieldDecorator('renovationNeed', {
                      initialValue: isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.renovationNeed) ? cpAccessoriesWorkFormGet.renovationNeed : '',     
                      rules: [
                        {
                          required: false,   
                          message: '请输入翻新要求',
                        },
                      ],
                    })(<TextArea  disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.remarks) ? cpAccessoriesWorkFormGet.remarks : '',     
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
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesWorkForm').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesWorkForm')[0].children.filter(item => item.name == '二次修改')
                  .length > 0 &&
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                    {updataname}
                  </Button>
              }
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesWorkForm').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAccessoriesWorkForm')[0].children.filter(item => item.name == '修改')
                  .length > 0 && <span>
                    <Button style={{ marginLeft: '8px' }} type="primary" onClick={this.onsave} loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
                    保存
                    </Button>
                    <Button style={{ marginRight: '8px', marginLeft: '8px' }} type="primary" htmlType="submit" loading={submitting1 || submitting2} disabled={orderflag && updataflag}>
                    提交
                    </Button>
                    {
                    isNotBlank(cpAccessoriesWorkFormGet) && isNotBlank(cpAccessoriesWorkFormGet.orderStatus) && (cpAccessoriesWorkFormGet.orderStatus === 1 || cpAccessoriesWorkFormGet.orderStatus === '1') ?
                      <Button style={{ marginLeft: 8 }} onClick={() => this.onRevocation(cpAccessoriesWorkFormGet.id)} loading={submitting1 || submitting2}>
                        撤销
                      </Button> : null
                  }
                  </span>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
        <CreateFormwx {...parentMethodswx} selectflag={selectflag} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpAccessoriesWorkFormForm;
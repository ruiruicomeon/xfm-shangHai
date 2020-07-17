import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal, Switch
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './CpSupplierList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateFormdel = Form.create()(props => {
  const { modalVisibledel, getMustCpTypelist, selectedRows, okdelHandle, handleModalVisibledel, handleSelectRows } = props;
  const columnskh = [

    {
      title: '分类名',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    }
  ];

  return (
    <Modal
      title='选择删除分类'
      visible={modalVisibledel}
      onOk={okdelHandle}
      onCancel={() => handleModalVisibledel()}
      width='80%'
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        selectedRows={selectedRows}
        
        onSelectRow={handleSelectRows}
        
        data={getMustCpTypelist}
        columns={columnskh}
      />
    </Modal>
  );
});

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, levellist2 } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let values = {};
      if (isNotBlank(modalRecord) && isNotBlank(modalRecord.id)) {
        values = { ...fieldsValue, id: modalRecord.id };
      } else {
        values = { ...fieldsValue };
      }

      handleAdd(values);
    });
  };

  return (
    <Modal
      title={isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改分类' : '新增分类'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名字">
        {form.getFieldDecorator('name', {
          initialValue: '',
          rules: [{ required: true, message: '请输入分类名字' }],
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属分公司">
        {form.getFieldDecorator('x.id', {
          initialValue: getStorage('companyId'),
          rules: [{ required: true, message: '请选择所属分公司' }],
        })(
          <Select style={{ width: '100%' }}  allowClear>
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
    </Modal>
  );
});
@connect(({ cpSupplier, loading, cpClient, syslevel }) => ({
  ...cpSupplier,
  ...cpClient,
  ...syslevel,
  loading: loading.models.cpClient,
}))
@Form.create()

class quickQuery extends PureComponent {

  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    array: [],
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'cpClient/get_Must_CpTypeList',
      payload: {
        type: 2
      }
    })

    dispatch({
      type: 'syslevel/fetch2',
      payload: {
        type: 2,
        pageSize:100
      },
    });
  }

  ongoto = (id, name) => {
    router.push(`/cp_must_bill_material_list?id=${id}&name=${name}`);
  }

  handleAdd = fields => {
    const { dispatch } = this.props
    const that = this
    dispatch({
      type: 'cpClient/post_must_CpType',
      payload: {
        ...fields,
      },
      callback: () => {
        dispatch({
          type: 'cpClient/get_Must_CpTypeList',
          payload: {
            current: 1,
            pageSize: 10,
            type: 2
          }
        })
        that.setState({
          modalVisible: false,
        });
      }
    });

  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  delClick = (flag) => {
    this.setState({
      modalVisibledel: !!flag,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisibledel = () => {
    this.setState({
      modalVisibledel: false
    })
  }

  okdelHandle = () => {
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    let ids = '';
    
    if (selectedRows.length === 0) {
      message.error('未选择需要删除的数据');
      return;
    }
    ids = selectedRows.map(row => row).join(',');
    if (isNotBlank(ids)) {
      dispatch({
        type: 'cpClient/delete_CpType',
        payload: {
          id: ids
        },
        callback: () => {
          this.setState({
            selectedRows: [],
            modalVisibledel: false
          })
          dispatch({
            type: 'cpClient/get_Must_CpTypeList',
            payload: {
              pageSize: 10,
              type: 2
            }
          });
        }
      });
    }
  }

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
        type: 'cpClient/get_Must_CpTypeList',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          type: 2
        },
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cpClient/get_Must_CpTypeList',
      payload: {
        pageSize: 10,
        current: 1,
        type: 2
      },
    });
  };

  render() {

    const { getMustCpTypelist, levellist2, form: { getFieldDecorator }, loading } = this.props
    const { modalRecord, modalVisible, modalVisibledel, selectedRows } = this.state
    const columns = [
      {
        title: '详情',
        width: 100,
        align: 'center',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.ongoto(record.id, record.name)}>详情</a>
          </Fragment>
        ),
      },
      {
        title: '名称',        
        dataIndex: 'name',
        align: 'center',  
        inputType: 'text',   
        width: 100,          
        editable: true,      
      },
      {
        title: '所属公司',        
        dataIndex: 'x.name',
        align: 'center',  
        inputType: 'text',   
        width: 150,          
        editable: true,      
      },
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
    ]

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalRecord,
      levellist2
    };

    const parentMethodsdel = {
      handleAdddel: this.handleAdddel,
      handleModalVisibledel: this.handleModalVisibledel,
      getMustCpTypelist,
      okdelHandle: this.okdelHandle,
      selectedRows,
      handleSelectRows: this.handleSelectRows
    };
    return (
      <div className={styles.standardList} style={{marginTop: '60px'}}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>BOM</div>
            {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='mutest').length>0
			 && JSON.parse(getStorage('menulist')).filter(item=>item.target=='mutest')[0].children.filter(item=>item.name=='修改')
       .length>0&&
            <span>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
            <Button icon="delete" style={{ marginLeft: 16 }} type="danger" onClick={() => this.delClick(true)}>
              删除
            </Button>
             </span>
          }
            <div className={styles.tableListForm} style={{ marginTop: 8 }}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem label="分类名">
                      {getFieldDecorator('name', {
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
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                          重置
                        </Button>

                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>

            <StandardEditTable
              scroll={{ x: 700 }}
              
              loading={loading}
              data={getMustCpTypelist}
              bordered
              columns={columns}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateFormdel {...parentMethodsdel} modalVisibledel={modalVisibledel} />
      </div>
    );
  }

}
export default quickQuery;
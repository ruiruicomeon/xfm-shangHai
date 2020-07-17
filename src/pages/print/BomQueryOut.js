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

let timer = null
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateFormdel = Form.create()(props => {
  const { modalVisibledel, getCpTypeNoList, selectedRows, okdelHandle, handleModalVisibledel, handleSelectRows } = props;


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
        //   loading={loading}
        onSelectRow={handleSelectRows}
        // onChange={handleStandardTableChange}
        data={getCpTypeNoList}
        columns={columnskh}
      />
    </Modal>
  );
});

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord } = props;
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
        })(<Input placeholder="请输入分类名字" />)}
      </FormItem>
    </Modal>
  );
});


@connect(({ cpSupplier, loading, cpClient }) => ({
  ...cpSupplier,
  ...cpClient,
  loading: loading.models.cpSupplier,
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
      type: 'cpClient/get_cpTypeList_no',
      payload:{
        type:1
      }
    })

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

  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    clearInterval(timer)
    timer = null
    document.onmousemove = document.onkeydown = null
    dispatch({
      type: 'cpClient/clear',
    });
  }



  ongoto = (id,name) => {
    router.push(`/cp_billMaterialList_new_out?id=${id}&name=${name}`);
  }


  handleAdd = fields => {
    const { dispatch } = this.props
    const that = this
    dispatch({
      type: 'cpClient/post_cpType',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'cpClient/get_CpType_List',
          payload: {
            current: 1,
            pageSize: 10
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
    // 删除单个
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
          // 成功之后需要刷新列表数据
          // 并且添加当前搜索字段  页数归0
          this.setState({
            selectedRows: [],
            modalVisibledel: false
          })
          dispatch({
            type: 'cpClient/get_CpType_List',
            payload: {
              pageSize: 10,
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
        if( values[item] instanceof moment){
          values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
        }
        return item;
      });
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cpClient/get_cpTypeList_no',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
          type:1
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
      type: 'cpClient/get_cpTypeList_no',
      payload: {
        pageSize: 10,
        current: 1,
        type:1
      },
    });
  };

  ongoback = ()=>{
    router.goBack();
  }

  render() {

    const { getCpTypeNoList ,form: { getFieldDecorator },loading} = this.props
    const { modalRecord, modalVisible, modalVisibledel, selectedRows } = this.state

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalRecord,
    };

    const parentMethodsdel = {
      handleAdddel: this.handleAdddel,
      handleModalVisibledel: this.handleModalVisibledel,
      getCpTypeNoList,
      okdelHandle: this.okdelHandle,
      selectedRows,
      handleSelectRows: this.handleSelectRows
    };

    
    const  columns = [
      {
        title: '详情',
        width: 100,
        align: 'center' ,
        render: (text, record) => (
          <Fragment>
          <a onClick={() => this.ongoto(record.id,record.name)}>详情</a>
          </Fragment>
        ),
        },
      {
        title: '名称',        // 必填显示
        dataIndex: 'name',
        align: 'center',  // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
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

    // 可编辑列表 需要固定操作参数   【编辑，保存，取消】


    return (
      <div className={styles.standardList} >
        <Card bordered={false}>
          <div className={styles.tableList} >
          <div className={styles.tableListOperator} style={{ 'position': 'relative' }}>
          <Button  onClick={() => this.ongoback()}>
											返回
            					</Button>
          <span style={{ fontWeight: 550, fontSize: 28, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
									BOM</span>
                  </div>
            {/* <div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>BOM</div> */}
            {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
											新建
            </Button>
            <Button style={{marginLeft:16}} type="danger" onClick={() => this.delClick(true)}>
											删除
            </Button> */}
              {/* {isNotBlank(getCpTypeNoList) && isNotBlank(getCpTypeNoList.list) && getCpTypeNoList.list.length > 0 && getCpTypeNoList.list.map((item) => {
                return <div><Button type="primary" style={{ width: '40%', fontSize: '18px', height: '48px', textAlign: 'center', marginBottom: '12px' }} onClick={() => { this.ongoto(item) }}>{item.name}</Button></div>
              })
              } */}
               <div className={styles.tableListForm} style={{marginTop:8}}>
              <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
					<FormItem label="分类名">
					  {getFieldDecorator('name', {
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
                // selectedRows={selectedRows}
                loading={loading}
                data={getCpTypeNoList}
                bordered
                columns={columns}
    
                // onSelectRow={this.handleSelectRows}
                // onChange={this.handleStandardTableChange}
              />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateFormdel {...parentMethodsdel} modalVisibledel={modalVisibledel} />
      </div>


      // <SearchFormgys {...parentSearchMethodsgys} searchVisiblegys={searchVisiblegys} />
      //   </PageHeaderWrapper>
    );
  }

}
export default quickQuery;
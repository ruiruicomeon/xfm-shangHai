import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';

import { Row, Col, Card, Form, Input, Modal, TreeSelect, Select, Button ,Divider} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SysArea.less';
import { stringify } from 'qs';
import { isNotBlank } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, list, modalRecord, dictsrr } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let values = {};
      if (isNotBlank(modalRecord) && isNotBlank(modalRecord.id)
      ) {
        values = { ...fieldsValue, id: modalRecord.id };
      } else {
        values = { ...fieldsValue };
      }

      handleAdd(values);
    });
  };

  const isModalRecord = (val) => {
    if (isNotBlank(val) && isNotBlank(val.type)) {
      return val.type;
    } if (isNotBlank(dictsrr) && dictsrr.length > 0 && isNotBlank(dictsrr[0]) && isNotBlank(dictsrr[0].value)) {
      return dictsrr[0].value;
    }
    return "";
  }

  return (
    <Modal
      title={
        isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改区域信息' : '新建区域'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域名称">
        {form.getFieldDecorator('label', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.label) ? modalRecord.label : '',
          rules: [{ required: true, message: '请输入区域名称' }],
        })(<Input  />)}
      </FormItem>
      
    </Modal>
  );
});
@connect(({ sysarea, loading, syslevel ,dictionaryL }) => ({
  sysarea,
  ...syslevel,
  ...dictionaryL,
  dicts: sysarea.dicts,
  loading: loading.models.sysarea,
}))
@Form.create()
class SysArea extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    modalVisible: false,
    formValues: {},
    modalRecord: {},
    modalImportVisible: false,
    importFileList: []
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysarea/fetch',
    });

    dispatch({
      type: 'sysarea/dicts',
      payload: { type: 'sys_area_type' },
    });

    dispatch({
      type: 'syslevel/query_office',
    });

    dispatch({
      type: 'dictionaryL/fetch',
      payload: {
        type: 'area',
        current:1,
        pageSize:10
      },
      callback: data => {
        this.setState({
          arealist: data
        })
      }
    });

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dictionaryL/fetch',
      payload: {
        ...params,
        type: 'area',
      },
      callback: data => {
        this.setState({
          arealist: data
        })
      }
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysarea/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'sysarea/remove',
      payload: {
        ids: selectedRows.map(row => row).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'dictionaryL/fetch',
          payload: {
            type: 'area',
            current:1,
            pageSize:10
          },
          callback: data => {
            this.setState({
              arealist: data
            })
          }
        });
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props

    dispatch({
      type: 'sysarea/save_area',
      payload: fields,
      callback:()=>{
        dispatch({
          type: 'dictionaryL/fetch',
          payload: {
            type: 'area',
            current:1,
            pageSize:10
          },
          callback: data => {
            this.setState({
              arealist: data
            })
          }
        });
      }
    });

    this.setState({
      modalVisible: false,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;



      const values = {
        ...fieldsValue,
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      if(!isNotBlank(values.label)){
          values.label = ''
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dictionaryL/fetch',
        payload: {
          ...values,
          type: 'area',
          current:1,
          pageSize:10
        },
        callback: data => {
          this.setState({
            arealist: data
          })
        }
      });
  });
}

  handleModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)
    ) {
      this.setState({
        modalRecord: record,
        modalVisible: true,
      });
    }
  };

  lowerModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)
    ) {
      this.setState({
        modalRecord: { parentId: record.id, area: record.area },
        modalVisible: true,
      });
    }
  };

  renderSimpleForm=()=>{
    const { form } = this.props
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="区域名称">
              {getFieldDecorator('label')(<Input  />)}
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm = ()=>{
    return this.renderSimpleForm();
  }

  handleImportVisible = flag => {
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

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  handleUpldExportClick = () => {
    const userid = { id: getStorage('userid') };
    window.open(`/api/Beauty/sys/area/export?${stringify(userid)}`);
  };

  render() {
    const { sysarea: { data }, loading, dicts, queryofflist } = this.props;
    const { modalVisible, modalRecord ,importFileList ,modalImportVisible ,arealist ,selectedRows} = this.state;

    console.log(arealist)
    const columns = [
      {
        title: '区域名称',
        dataIndex: 'label',
        align: 'center' , 
        width: 250,
        
      },
      {
        title: '操作',
        width: 150,
        align: 'center' , 
        render: record => {
          return isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area')[0].children.filter(item=>item.name=='修改')
          .length>0? 
          <Fragment>
            <a onClick={() => this.handleModalChange(record)}>修改</a>
          </Fragment>
          :''
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      dictsrr: dicts,
      list: data.list,
      modalRecord
    };

    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} style={{'position':'relative'}}>
              {
              isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area').length>0
                && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area')[0].children.filter(item=>item.name=='修改')
                .length>0&&
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              }
              {selectedRows.length > 0 &&isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area').length>0
                && JSON.parse(getStorage('menulist')).filter(item=>item.target=='area')[0].children.filter(item=>item.name=='修改')
                .length>0&& (
                <span>
                  
                      <Button onClick={() => this.removeClick()}>批量删除</Button>
                  
                </span>
              )}
              <Button icon="plus" type="primary" style={{visibility:'hidden'}}>
                新建
              </Button>
                <span style={{fontWeight:550,fontSize:28,position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
区域管理</span>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 400 }}
              selectedRows={selectedRows}
              loading={loading}
              defaultExpandAllRows
              data={arealist}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default SysArea;

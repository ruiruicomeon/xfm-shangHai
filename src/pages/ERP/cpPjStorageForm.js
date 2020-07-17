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
  Upload,
  Modal,
  Row, Col
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpPjStorageForm.less';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateFormkw = Form.create()(props => {
  const { handleModalVisiblekw, cpPjEntrepotList, selectkwflag, selectkw, dispatch, form, form: { getFieldDecorator } } = props;
  const columnskh = [
    {
      title: '操作',
      width: 100,
      align: 'center',
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
      align: 'center',
      dataIndex: 'name',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '所属分公司',
      dataIndex: 'office.name',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '库存总金额',
      dataIndex: 'totalMoney',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '自采百分比',
      dataIndex: 'since',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: '创建者',
      dataIndex: 'createBy.name',
      inputType: 'text',
      align: 'center',
      width: 100,
      editable: false,
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
      dataIndex: 'remarks',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: true,
    },
  ];
  const handleFormReset = () => {
    form.resetFields();
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
  return (
    <Modal
      title='选择所属仓库'
      visible={selectkwflag}
      onCancel={() => handleModalVisiblekw()}
      width='80%'
    >
      <Row>
        <Form onSubmit={handleSearch}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="仓库名">
              {getFieldDecorator('name', {
                initialValue: ''
              })(
                <Input  />
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
@connect(({ cpPjStorage, loading, cpPjEntrepot }) => ({
  ...cpPjStorage,
  ...cpPjEntrepot,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpPjStorage/cpPjStorage_Add'],
}))
@Form.create()
class CpPjStorageForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      previewVisible1: false,
      previewImage1: {},
      addfileList1: [],
      orderflag: false,
      location: getLocation()
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpPjStorage/cpPjStorage_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (isNotBlank(res.data) && isNotBlank(res.data.img)) {
            let photoUrl = res.data.img.split('|')
            photoUrl = photoUrl.map((item) => {
              return {
                id: getFullUrl(item),
                uid: getFullUrl(item),
                url: getFullUrl(item),
                name: getFullUrl(item)
              }
            })
            this.setState({
              addfileList: res.data.img.split('|'),
              fileList: photoUrl
            })
          }
          if (isNotBlank(res.data) && isNotBlank(res.data.img1)) {
            let photoUrl = res.data.img1.split('|')
            photoUrl = photoUrl.map((item) => {
              return {
                id: getFullUrl(item),
                uid: getFullUrl(item),
                url: getFullUrl(item),
                name: getFullUrl(item)
              }
            })
            this.setState({
              addfileList1: res.data.img1.split('|'),
              fileList1: photoUrl
            })
          }
        }
      });
      dispatch({
        type: 'sysarea/getFlatCode',
        payload: {
          id: isNotBlank(location.query.id) ? location.query.id : '',
          type: 'PJKW'
        },
        callback: (srcres) => {
          this.setState({
            srcimg: srcres
          })
        }
      })
    }
    if (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPjStorage').length > 0
      && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpPjStorage')[0].children.filter(item => item.name == '修改')
        .length > 0) {
      this.setState({
        orderflag: false
      })
    } else {
      this.setState({
        orderflag: false
      })
    }
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
      type: 'cpPjStorage/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, cpPjEntrepotList } = this.props;
    const { addfileList, addfileList1, location, selectkwdata } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.img = addfileList.join('|')
        } else {
          value.img = '';
        }
        if (isNotBlank(addfileList1) && isNotBlank(addfileList1.length > 0)) {
          value.img1 = addfileList1.join('|')
        } else {
          value.img1 = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.pjEntrepotId = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id :
          (isNotBlank(cpPjEntrepotList) && isNotBlank(cpPjEntrepotList.pjEntrepotId) ? cpPjEntrepotList.pjEntrepotId : '')
        value.orderStatus = 1
        dispatch({
          type: 'cpPjStorage/cpPjStorage_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicManagement/warehouse/pj_warehouse/cp_pj_storage_list');
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicManagement/warehouse/pj_warehouse/cp_pj_storage_list');
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

  onselectkw = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cpPjEntrepot/cpPjEntrepot_List',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
    this.setState({
      selectkwflag: true
    })
  }

  selectkw = (record) => {
    this.setState({
      selectkwdata: record,
      selectkwflag: false
    })
  }

  handleModalVisiblekw = flag => {
    this.setState({
      selectkwflag: !!flag
    });
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
    const { dispatch } = this.props
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
          name: 'cpPjStorageForm'
        },
        callback: (res) => {
          console.log(666)
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

  handleCancel1 = () => this.setState({ previewVisible1: false });

  handlePreview1 = file => {
    this.setState({
      previewImage1: file.url || file.thumbUrl,
      previewVisible1: true,
    });
  };

  handleImage1 = url => {
    this.setState({
      previewImage1: url,
      previewVisible1: true,
    });
  };

  handleRemove1 = file => {
    this.setState(({ fileList1, addfileList1 }) => {
      const index = fileList1.indexOf(file);
      const newFileList = fileList1.slice();
      newFileList.splice(index, 1);
      const newaddfileList = addfileList1.slice();
      newaddfileList.splice(index, 1);
      return {
        fileList1: newFileList,
        addfileList1: newaddfileList,
      };
    });
  };

  handlebeforeUpload1 = file => {
    const { addfileList1 } = this.state;
    const { dispatch } = this.props
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
          name: 'businessIntention'
        },
        callback: (res) => {
          console.log(666)
          if (!isNotBlank(addfileList1) || addfileList1.length <= 0) {
            this.setState({
              addfileList1: [res],
            });
          } else {
            this.setState({
              addfileList1: [...addfileList1, res],
            });
          }
        }
      })
    }
    return isLt10M && isimg;
  };

  handleUploadChange1 = info => {
    const isimg = info.file.type.indexOf('image') >= 0;
    const isLt10M = info.file.size / 1024 / 1024 <= 10;
    if (info.file.status === 'done') {
      if (isLt10M && isimg) {
        this.setState({ fileList1: info.fileList });
      }
    } else {
      this.setState({ fileList1: info.fileList });
    }
  };

  render() {
    const { fileList, fileList1, previewVisible, previewImage, previewVisible1, previewImage1, selectkwdata, selectkwflag, orderflag, srcimg } = this.state;
    const { submitting1, submitting, cpPjStorageGet, cpPjEntrepotList, dispatch } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const parentMethodskw = {
      handleModalVisiblekw: this.handleModalVisiblekw,
      selectkw: this.selectkw,
      cpPjEntrepotList,
      dispatch
    }
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
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='库位二维码'>
              {isNotBlank(cpPjStorageGet) && isNotBlank(cpPjStorageGet.id) && <div>
                <img
                  src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''}
                  style={{ width: '100px' }}
                  alt=""
                />
              </div>}
            </FormItem>
            <FormItem {...formItemLayout} label='所属仓库'>
              <Input
                disabled
                
                value={isNotBlank(selectkwdata) && isNotBlank(selectkwdata.name) ? selectkwdata.name :
                (isNotBlank(cpPjStorageGet) && isNotBlank(cpPjStorageGet.pjEntrepotId) ? cpPjStorageGet.pjEntrepotId : '')}
              />
              <Button disabled={orderflag} type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkw} loading={submitting}>选择</Button>
            </FormItem>
            <FormItem {...formItemLayout} label='库位'>
              {getFieldDecorator('name', {
                initialValue: isNotBlank(cpPjStorageGet) && isNotBlank(cpPjStorageGet.name) ? cpPjStorageGet.name : '',
                rules: [
                  {
                    required: true,
                    message: '请输入库位',
                    max: 255,
                  },
                ],
              })(<Input  disabled={orderflag} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="货架图">
              {getFieldDecorator('img', {
                initialValue: ''
              })(
                <Upload
                  disabled={orderflag}
                  accept="image/*"
                  onChange={this.handleUploadChange}
                  onRemove={this.handleRemove}
                  beforeUpload={this.handlebeforeUpload}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={this.handlePreview}
                >
                  {(isNotBlank(fileList) && fileList.length >= 1) || orderflag ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="库位图">
              {getFieldDecorator('img1', {
                initialValue: ''
              })(
                <Upload
                  disabled={orderflag}
                  accept="image/*"
                  onChange={this.handleUploadChange1}
                  onRemove={this.handleRemove1}
                  beforeUpload={this.handlebeforeUpload1}
                  fileList={fileList1}
                  listType="picture-card"
                  onPreview={this.handlePreview1}
                >
                  {(isNotBlank(fileList1) && fileList1.length >= 1) || orderflag ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
                initialValue: isNotBlank(cpPjStorageGet) && isNotBlank(cpPjStorageGet.remarks) ? cpPjStorageGet.remarks : '',
                rules: [
                  {
                    required: false,
                    message: '请输入备注信息',
                  },
                ],
              })(
                <TextArea
                  disabled={orderflag}
                  style={{ minHeight: 32 }}
                  
                  rows={2}
                />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {!orderflag &&
                <Button type="primary" htmlType="submit" loading={submitting1}>
                  提交
                </Button>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
              返回
              </Button>
            </FormItem>
          </Form>
        </Card>
        <CreateFormkw {...parentMethodskw} selectkwflag={selectkwflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Modal visible={previewVisible1} footer={null} onCancel={this.handleCancel1}>
          <img alt="example" style={{ width: '100%' }} src={previewImage1} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpPjStorageForm;
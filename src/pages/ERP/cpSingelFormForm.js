import React, { PureComponent, Popconfirm } from 'react';
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
  Row,
  Table,
  Col,
  Divider,
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getStorage } from '@/utils/localStorageUtils';
import StandardTable from '@/components/StandardTable';
import DragTable from '../../components/StandardEditTable/dragTable'
import Moment from 'moment';
import styles from './cpSingelFormForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
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
      title="审批"
      visible={modalVisiblepass}
      onOk={okHandle}
      onCancel={() => handleModalVisiblepass()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核理由">
        {form.getFieldDecorator('remarks', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '请输入审核理由',
            },
          ],
        })(<Input  />)}
      </FormItem>
    </Modal>
  );
});
const CreateFormkh = Form.create()(props => {
  const {
    handleModalVisiblekh,
    userlist,
    selectkhflag,
    selectcustomer,
    selectedRows,
    handleSelectRows,
  } = props;
  const columnskh = [
    {
      title: '操作',
      width: 150,
      render: record => (
        <Fragment>
          <a onClick={() => selectcustomer(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 150,
      render: text => {
        if (isNotBlank(text)) {
          if (text === 0 || text === '0') {
            return <span>男</span>;
          }
          if (text === 1 || text === '1') {
            return <span>女</span>;
          }
        }
        return '';
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '所属大区',
      dataIndex: 'area.name',
      width: 150,
    },
    {
      title: '所属分公司',
      dataIndex: 'companyName',
      width: 150,
    },
    {
      title: '所属部门',
      dataIndex: 'dept.name',
      width: 150,
    },
    {
      title: '所属区域',
      dataIndex: 'areaName',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
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
  return (
    <Modal
      title="选择审核人"
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekh()}
      width="80%"
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={userlist}
        columns={columnskh}
      />
    </Modal>
  );
});
@connect(({ cpSingelForm, sysuser, loading, cpOfferForm, cpBillMaterial }) => ({
  ...cpSingelForm,
  ...cpOfferForm,
  ...sysuser,
  ...cpBillMaterial,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpSingelFormForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      fileList: [],
      orderflag: false,
      selectedRows: [],
      selectkhflag: false,
      indexstatus: '',
      indexflag: 0,
      modalVisiblepass: false,
      showdata: [],
      updataflag: true,
      updataname: '取消锁定',
      location: getLocation(),
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    const { dispatch } = this.props;
    const { location } = this.state;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpSingelForm/cpSingelForm_Get',
        payload: {
          id: location.query.id,
        },
        callback: res => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1') {
            this.setState({ orderflag: true });
          } else {
            this.setState({ orderflag: false });
          }
          if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
            let photoUrl = res.data.photo.split('|');
            photoUrl = photoUrl.map(item => {
              return {
                id: getFullUrl(item),
                uid: getFullUrl(item),
                url: getFullUrl(item),
                name: getFullUrl(item),
              };
            });
            this.setState({
              addfileList: res.data.photo.split('|'),
              fileList: photoUrl,
            });
          }
          const allUser = [];
          if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
            allUser.push(
              res.data.oneUser,
              res.data.twoUser,
              res.data.threeUser,
              res.data.fourUser,
              res.data.fiveUser
            );
          } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
            allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser, res.data.fourUser);
          } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
            allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser);
          } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
            allUser.push(res.data.oneUser, res.data.twoUser);
          } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
            allUser.push(res.data.oneUser);
          }
          this.setState({
            showdata: allUser,
          });
        },
      });
    }
    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_middle_List',
      payload: {
        pageSize: 10,
        singelId: location.query.id,
      },
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'del_flag',
      },
      callback: data => {
        this.setState({
          del_flag: data,
        });
      },
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'quote_type',
      },
      callback: data => {
        this.setState({
          quote_type: data,
        });
      },
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'classify',
      },
      callback: data => {
        this.setState({
          classify: data,
        });
      },
    });
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        'role.id': 3,
        'office.id': getStorage('companyId'),
      },
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpSingelForm/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, showdata, updataflag } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.photo = addfileList.join('|');
        } else {
          value.photo = '';
        }
        value.orderStatus = 1;
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        const newshowdata = showdata.filter(item => {
          return isNotBlank(item.name);
        });
        value.totalNumber = newshowdata.length;
        const idarr = [];
        newshowdata.forEach(item => {
          idarr.push(item.id);
        });
        value.ids = idarr.join(',');
        value.approvals = this.turnappData(value.approvals);
        if (updataflag) {
          dispatch({
            type: 'cpSingelForm/cpSingelForm_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.goBack();
            },
          });
        } else {
          dispatch({
            type: 'cpupdata/cpSingelForm_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push('/business/process/cp_singel_form_list');
            },
          });
        }
      }
    });
  };

  onupdata = () => {
    const { location, updataflag } = this.state;
    if (updataflag) {
      this.setState({
        updataflag: false,
        updataname: '锁定',
      });
    } else {
      router.push(`/business/process/cp_business_intention_form?id=${location.query.id}`);
    }
  };

  onsave = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, showdata, updataflag } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.photo = addfileList.join('|');
        } else {
          value.photo = '';
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        const newshowdata = showdata.filter(item => {
          return isNotBlank(item.name);
        });
        value.totalNumber = newshowdata.length;
        const idarr = [];
        newshowdata.forEach(item => {
          idarr.push(item.id);
        });
        value.ids = idarr.join(',');
        value.approvals = this.turnappData(value.approvals);
        if (updataflag) {
          value.orderStatus = 0;
          dispatch({
            type: 'cpSingelForm/cpSingelForm_Add',
            payload: { ...value },
            callback: () => {
              dispatch({
                type: 'cpSingelForm/cpSingelForm_Get',
                payload: {
                  id: location.query.id,
                },
                callback: res => {
                  if (
                    res.data.approvals === 0 ||
                    res.data.approvals === '0' ||
                    res.data.approvals === 2 ||
                    res.data.approvals === '2'
                  ) {
                    this.setState({ orderflag: true });
                  } else {
                    this.setState({ orderflag: false });
                  }
                  if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
                    let photoUrl = res.data.photo.split('|');
                    photoUrl = photoUrl.map(item => {
                      return {
                        id: getFullUrl(item),
                        uid: getFullUrl(item),
                        url: getFullUrl(item),
                        name: getFullUrl(item),
                      };
                    });
                    this.setState({
                      addfileList: res.data.photo.split('|'),
                      fileList: photoUrl,
                    });
                  }
                  const allUser = [];
                  if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
                    allUser.push(
                      res.data.oneUser,
                      res.data.twoUser,
                      res.data.threeUser,
                      res.data.fourUser,
                      res.data.fiveUser
                    );
                  } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
                    allUser.push(
                      res.data.oneUser,
                      res.data.twoUser,
                      res.data.threeUser,
                      res.data.fourUser
                    );
                  } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
                    allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser);
                  } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
                    allUser.push(res.data.oneUser, res.data.twoUser);
                  } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
                    allUser.push(res.data.oneUser);
                  }
                  this.setState({
                    showdata: allUser,
                  });
                },
              });
            },
          });
        } else {
          value.orderStatus = 1;
          dispatch({
            type: 'cpupdata/cpSingelForm_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
            },
          });
        }
      }
    });
  };

  onCancelCancel = () => {
    router.goBack();
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

  showsp = i => {
    this.setState({
      indexstatus: i,
      modalVisiblepass: true,
    });
  };

  newMember = () => {
    const { showdata } = this.state;
    let newData = [];
    if (showdata.length === 0) {
      newData = [];
    } else {
      newData = showdata.map(item => ({ ...item }));
    }
    newData.push({
      id: this.index,
    });
    this.index += 1;
    this.setState({ showdata: newData });
  };

  handleModalVisiblepass = flag => {
    this.setState({
      modalVisiblepass: !!flag,
    });
  };

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  selectcustomer = record => {
    const { dispatch } = this.props;
    const { indexflag, showdata } = this.state;
    let newselectkhdata = [];
    if (showdata.length === 0) {
      newselectkhdata = [];
    } else {
      newselectkhdata = showdata.map(item => ({ ...item }));
    }
    let newindex = '';
    record.status = 0;
    showdata.forEach((i, index) => {
      if (i.id === indexflag) {
        newindex = index;
      }
    });
    newselectkhdata.splice(newindex, 1, record);
    this.setState({ showdata: newselectkhdata, selectkhflag: false });
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

  remove(key) {
    const { showdata } = this.state;
    const { onChange } = this.props;
    const newData = showdata.filter(item => item.id !== key);
    this.setState({ showdata: newData });
  }

  handleAddpass = val => {
    const { dispatch } = this.props;
    const { location, indexstatus } = this.state;
    dispatch({
      type: 'cpSingelForm/cpSingelForm_Add',
      payload: {
        id: location.query.id,
        approvals: indexstatus,
        ...val,
      },
      callback: () => {
        dispatch({
          type: 'cpSingelForm/cpSingelForm_Get',
          payload: {
            id: location.query.id,
          },
          callback: res => {
            if (
              res.data.approvals === 0 ||
              res.data.approvals === '0' ||
              res.data.approvals === 2 ||
              res.data.approvals === '2'
            ) {
              this.setState({ orderflag: false });
            } else {
              this.setState({ orderflag: true });
            }
            if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
              let photoUrl = res.data.photo.split('|');
              photoUrl = photoUrl.map(item => {
                return {
                  id: getFullUrl(item),
                  uid: getFullUrl(item),
                  url: getFullUrl(item),
                  name: getFullUrl(item),
                };
              });
              this.setState({
                addfileList: res.data.photo.split('|'),
                fileList: photoUrl,
              });
            }
            const allUser = [];
            if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
              allUser.push(
                res.data.oneUser,
                res.data.twoUser,
                res.data.threeUser,
                res.data.fourUser,
                res.data.fiveUser
              );
            } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
              allUser.push(
                res.data.oneUser,
                res.data.twoUser,
                res.data.threeUser,
                res.data.fourUser
              );
            } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser);
            } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser);
            } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
              allUser.push(res.data.oneUser);
            }
            this.setState({
              showdata: allUser,
              modalVisiblepass: false,
            });
          },
        });
      },
    });
  };

  repost = () => {
    const { dispatch } = this.props;
    const { location } = this.state;
    dispatch({
      type: 'cpOfferForm/cpOffer_respost',
      payload: {
        id: location.query.id,
      },
      callback: () => {
        dispatch({
          type: 'cpSingelForm/cpSingelForm_Add',
          payload: {
            id: location.query.id,
          },
          callback: res => {
            if (
              res.data.approvals === 0 ||
              res.data.approvals === '0' ||
              res.data.approvals === 2 ||
              res.data.approvals === '2'
            ) {
              this.setState({ orderflag: true });
            } else {
              this.setState({ orderflag: false });
            }
            if (isNotBlank(res.data) && isNotBlank(res.data.photo)) {
              let photoUrl = res.data.photo.split('|');
              photoUrl = photoUrl.map(item => {
                return {
                  id: getFullUrl(item),
                  uid: getFullUrl(item),
                  url: getFullUrl(item),
                  name: getFullUrl(item),
                };
              });
              this.setState({
                addfileList: res.data.photo.split('|'),
                fileList: photoUrl,
              });
            }
            const allUser = [];
            if (isNotBlank(res.data) && isNotBlank(res.data.fiveUser)) {
              allUser.push(
                res.data.oneUser,
                res.data.twoUser,
                res.data.threeUser,
                res.data.fourUser,
                res.data.fiveUser
              );
            } else if (isNotBlank(res.data) && isNotBlank(res.data.fourUser)) {
              allUser.push(
                res.data.oneUser,
                res.data.twoUser,
                res.data.threeUser,
                res.data.fourUser
              );
            } else if (isNotBlank(res.data) && isNotBlank(res.data.threeUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser, res.data.threeUser);
            } else if (isNotBlank(res.data) && isNotBlank(res.data.twoUser)) {
              allUser.push(res.data.oneUser, res.data.twoUser);
            } else if (isNotBlank(res.data) && isNotBlank(res.data.oneUser)) {
              allUser.push(res.data.oneUser);
            }
            this.setState({
              showdata: allUser,
            });
          },
        });
      },
    });
  };

  turnappData = apps => {
    if (apps === '待分配') {
      return 0;
    }
    if (apps === '待审核') {
      return 1;
    }
    if (apps === '撤销') {
      return 2;
    }
    if (apps === '通过') {
      return 3;
    }
    if (apps === '驳回') {
      return 4;
    }
  };

  goprint = () => {
    const { location } = this.state;
    const w = window.open('about:blank');
    w.location.href = `/#/jobmanage_ToQuote?id=${location.query.id}`;
  };

  render() {
    const {
      fileList,
      previewVisible,
      previewImage,
      orderflag,
      modalVisiblepass,
      selectedRows,
      showdata,
      selectkhflag,
      updataflag,
      updataname,
    } = this.state;
    const { submitting, cpSingelFormGet, userlist, cpBillMaterialMiddleList } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const shstatus = apps => {
      if (apps === '0' || apps === 0) {
        return '待审核';
      }
      if (apps === '1' || apps === 1) {
        return '通过';
      }
      if (apps === '2' || apps === 2) {
        return '驳回';
      }
    };
    const columnssh = [
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (
            (isNotBlank(cpSingelFormGet) &&
              isNotBlank(cpSingelFormGet.approvals) &&
              (cpSingelFormGet.approvals === 0 || cpSingelFormGet.approvals === '0')) ||
            (isNotBlank(cpSingelFormGet) &&
              isNotBlank(cpSingelFormGet.createBy) &&
              (cpSingelFormGet.approvals === 2 || cpSingelFormGet.approvals === '2') &&
              cpSingelFormGet.createBy.id === getStorage('userid')) ||
            (isNotBlank(cpSingelFormGet) &&
              isNotBlank(cpSingelFormGet.createBy) &&
              (cpSingelFormGet.approvals === 4 || cpSingelFormGet.approvals === '4') &&
              cpSingelFormGet.createBy.id === getStorage('userid'))
          ) {
            return (
              <span>
                <a onClick={e => this.onselectkh(record.id)}>选择</a>
              </span>
            );
          }
          return '';
        },
      },
      {
        title: '审核人姓名',
        dataIndex: 'name',
        key: 'name',
        width: '25%',
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        width: '25%',
        render: text => {
          if (
            isNotBlank(cpSingelFormGet) &&
            (cpSingelFormGet.approvals !== 0 || cpSingelFormGet.approvals !== '0')
          ) {
            return <span>{shstatus(text)}</span>;
          }
          return '';
        },
      },
      {
        title: '审核结果',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '25%',
      },
      {
        title: '删除',
        key: 'action',
        render: (text, record) => {
          if (
            (isNotBlank(cpSingelFormGet) &&
              isNotBlank(cpSingelFormGet.approvals) &&
              (cpSingelFormGet.approvals === 0 || cpSingelFormGet.approvals === '0')) ||
            (isNotBlank(cpSingelFormGet) &&
              isNotBlank(cpSingelFormGet.createBy) &&
              (cpSingelFormGet.approvals === 2 || cpSingelFormGet.approvals === '2') &&
              cpSingelFormGet.createBy.id === getStorage('userid')) ||
            (isNotBlank(cpSingelFormGet) &&
              isNotBlank(cpSingelFormGet.createBy) &&
              (cpSingelFormGet.approvals === 4 || cpSingelFormGet.approvals === '4') &&
              cpSingelFormGet.createBy.id === getStorage('userid'))
          ) {
            return (
              <span>
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return '';
        },
      },
    ];
    const columns = [
      {
        title: '物料编码', 
        dataIndex: 'cpBillMaterial.billCode', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '一级编码', 
        dataIndex: 'cpBillMaterial.oneCode', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '二级编码', 
        dataIndex: 'cpBillMaterial.twoCode', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '一级编码型号', 
        dataIndex: 'cpBillMaterial.oneCodeModel', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '二级编码名称', 
        dataIndex: 'cpBillMaterial.twoCodeModel', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '名称', 
        dataIndex: 'cpBillMaterial.name', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '原厂编码', 
        dataIndex: 'cpBillMaterial.originalCode', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '配件厂商', 
        dataIndex: 'cpBillMaterial.rCode', 
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
        title: '需求数量', 
        dataIndex: 'number', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '库存数量', 
        dataIndex: '', 
        inputType: 'text', 
        width: 100, 
        editable: true, 
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
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
        title: '创建时间',
        dataIndex: 'createDate',
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
        title: '备注信息', 
        dataIndex: 'cpBillMaterial.remarks', 
        inputType: 'text', 
        width: 100, 
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
    const parentMethodspass = {
      handleAddpass: this.handleAddpass,
      handleModalVisiblepass: this.handleModalVisiblepass,
      modalVisiblepass,
    };
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      handleSelectRows: this.handleSelectRows,
      selectedRows,
      selectcustomer: this.selectcustomer,
      userlist,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card bordered={false} title="订单信息">
              <Row gutter={12}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="单号">
                    {getFieldDecorator('intentionId', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.id)
                          ? cpSingelFormGet.id
                          : '', 
                      rules: [
                        {
                          required: true, 
                          message: '请输入单号',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="订单状态">
                    <Input
                      
                      disabled
                      value={
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.orderStatus)
                          ? cpSingelFormGet.orderStatus === 0 || cpSingelFormGet.orderStatus === '0'
                            ? '未处理'
                            : cpSingelFormGet.orderStatus === 1 ||
                              cpSingelFormGet.orderStatus === '1'
                            ? '已处理'
                            : cpSingelFormGet.orderStatus === 2 ||
                              cpSingelFormGet.orderStatus === '2'
                            ? '关闭'
                            : ''
                          : ''
                      }
                      style={
                        cpSingelFormGet.orderStatus === 0 || cpSingelFormGet.orderStatus === '0'
                          ? { color: '#f50' }
                          : cpSingelFormGet.orderStatus === 1 || cpSingelFormGet.orderStatus === '1'
                          ? { color: '#87d068' }
                          : { color: 'rgb(166, 156, 156)' }
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="报件类型">
                    {getFieldDecorator('quoteType', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.quoteType)
                          ? cpSingelFormGet.quoteType
                          : '', 
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
                        {isNotBlank(this.state.quote_type) &&
                          this.state.quote_type.length > 0 &&
                          this.state.quote_type.map(d => (
                            <Option key={d.id} value={d.value}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="订单编号" className="allinputstyle">
                    {getFieldDecorator('orderCode', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.orderCode)
                          ? cpSingelFormGet.orderCode
                          : '', 
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
                  <FormItem {...formItemLayout} label="产品代码">
                    {getFieldDecorator('productCode', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.productCode)
                          ? cpSingelFormGet.productCode
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入产品代码',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="配件解析">
                    {getFieldDecorator('accessoriesParsing', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) &&
                        isNotBlank(cpSingelFormGet.accessoriesParsing)
                          ? cpSingelFormGet.accessoriesParsing
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入配件解析',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="配件特殊修改">
                    {getFieldDecorator('accessoriesSpecial', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) &&
                        isNotBlank(cpSingelFormGet.accessoriesSpecial)
                          ? cpSingelFormGet.accessoriesSpecial
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入配件特殊修改',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="新增物料需求">
                    {getFieldDecorator('materialDemand', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.materialDemand)
                          ? cpSingelFormGet.materialDemand
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入新增物料需求',
                          max: 255,
                        },
                      ],
                    })(<Input  disabled={orderflag} />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.remarks)
                          ? cpSingelFormGet.remarks
                          : '', 
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
                </Col>
              </Row>
            </Card>
            <Card title="客户信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="客户">
                    <Input
                      
                      disabled
                      value={
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) && isNotBlank(cpSingelFormGet.client.clientCpmpany)
                          ? cpSingelFormGet.client.clientCpmpany
                          : ''
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="客户分类">
                    <Select
                      style={{ width: '100%' }}
                      
                      disabled
                      value={
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client)
                          ? cpSingelFormGet.client.classify
                          : ''
                      }
                    >
                      {isNotBlank(this.state.classify) &&
                        this.state.classify.length > 0 &&
                        this.state.classify.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系人">
                    <Input
                      
                      disabled
                      value={
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client)
                          ? cpSingelFormGet.client.name
                          : ''
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="联系地址">
                    <Input
                      
                      disabled
                      value={
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client)
                          ? cpSingelFormGet.client.address
                          : ''
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="移动电话">
                    <Input
                      
                      disabled
                      value={
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client)
                          ? cpSingelFormGet.client.phone
                          : ''
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="总成信息" bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="进场类型">
                    {getFieldDecorator('assemblyEnterType', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyEnterType)
                          ? cpSingelFormGet.assemblyEnterType
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入进场类型',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="品牌">
                    {getFieldDecorator('assemblyBrand', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyBrand)
                          ? cpSingelFormGet.assemblyBrand
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入品牌',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="车型/排量">
                    {getFieldDecorator('assemblyVehicleEmissions', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) &&
                        isNotBlank(cpSingelFormGet.assemblyVehicleEmissions)
                          ? cpSingelFormGet.assemblyVehicleEmissions
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入车型/排量',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="年份">
                    {getFieldDecorator('assemblyYear', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyYear)
                          ? cpSingelFormGet.assemblyYear
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入年份',
                        },
                      ],
                    })(<Input  disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="总成型号">
                    {getFieldDecorator('assemblyModel', {
                      initialValue:
                        isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.assemblyModel)
                          ? cpSingelFormGet.assemblyModel
                          : '', 
                      rules: [
                        {
                          required: false, 
                          message: '请输入总成型号',
                        },
                      ],
                    })(<Input  disabled />)}
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
              {isNotBlank(showdata) && showdata.length < 5 && (
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  onClick={this.newMember}
                  icon="plus"
                  disabled={
                    !(
                      (isNotBlank(cpSingelFormGet) &&
                        isNotBlank(cpSingelFormGet.approvals) &&
                        (cpSingelFormGet.approvals === 0 || cpSingelFormGet.approvals === '0')) ||
                      (isNotBlank(cpSingelFormGet) &&
                        isNotBlank(cpSingelFormGet.createBy) &&
                        (cpSingelFormGet.approvals === 2 || cpSingelFormGet.approvals === '2') &&
                        cpSingelFormGet.createBy.id === getStorage('userid')) ||
                      (isNotBlank(cpSingelFormGet) &&
                        isNotBlank(cpSingelFormGet.createBy) &&
                        (cpSingelFormGet.approvals === 4 || cpSingelFormGet.approvals === '4') &&
                        cpSingelFormGet.createBy.id === getStorage('userid'))
                    )
                  }
                >
                  新增审核人
                </Button>
              )}
              <div className={styles.standardList}>
                <Card bordered={false} title="物料明细">
                  <div className={styles.tableList}>
                    <div className={styles.tableListOperator} />
                    <StandardEditTable
                      scroll={{ x: 1800 }}
                      data={cpBillMaterialMiddleList}
                      bordered
                      columns={columns}
                    />
                  </div>
                </Card>
              </div>
              {isNotBlank(cpSingelFormGet) &&
                isNotBlank(cpSingelFormGet.isOperation) &&
                (cpSingelFormGet.isOperation === 1 || cpSingelFormGet.isOperation === '1') && (
                  <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <Button type="primary" onClick={() => this.showsp(3)}>
                      审核通过
                    </Button>
                    <Button
                      type="primary"
                      style={{ marginLeft: '8px' }}
                      onClick={() => this.showsp(2)}
                    >
                      审核驳回
                    </Button>
                  </div>
                )
              }
            </Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
                打印
              </Button>
              <Button
                type="primary"
                onClick={this.onsave}
                loading={submitting}
                disabled={
                  !(
                    (isNotBlank(cpSingelFormGet) &&
                      isNotBlank(cpSingelFormGet.approvals) &&
                      (cpSingelFormGet.approvals === 0 || cpSingelFormGet.approvals === '0')) ||
                    (isNotBlank(cpSingelFormGet) &&
                      isNotBlank(cpSingelFormGet.createBy) &&
                      (cpSingelFormGet.approvals === 2 || cpSingelFormGet.approvals === '2') &&
                      cpSingelFormGet.createBy.id === getStorage('userid')) ||
                    (isNotBlank(cpSingelFormGet) &&
                      isNotBlank(cpSingelFormGet.createBy) &&
                      (cpSingelFormGet.approvals === 4 || cpSingelFormGet.approvals === '4') &&
                      cpSingelFormGet.createBy.id === getStorage('userid'))
                  ) && updataflag
                }
              >
                保存
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={
                  !(
                    (isNotBlank(cpSingelFormGet) &&
                      isNotBlank(cpSingelFormGet.approvals) &&
                      (cpSingelFormGet.approvals === 0 || cpSingelFormGet.approvals === '0')) ||
                    (isNotBlank(cpSingelFormGet) &&
                      isNotBlank(cpSingelFormGet.createBy) &&
                      (cpSingelFormGet.approvals === 2 || cpSingelFormGet.approvals === '2') &&
                      cpSingelFormGet.createBy.id === getStorage('userid')) ||
                    (isNotBlank(cpSingelFormGet) &&
                      isNotBlank(cpSingelFormGet.createBy) &&
                      (cpSingelFormGet.approvals === 4 || cpSingelFormGet.approvals === '4') &&
                      cpSingelFormGet.createBy.id === getStorage('userid'))
                  )
                }
              >
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
               返回
              </Button>
              {isNotBlank(cpSingelFormGet) &&
                isNotBlank(cpSingelFormGet.approvals) &&
                (cpSingelFormGet.approvals === 1 || cpSingelFormGet.approvals === '1') &&
                isNotBlank(cpSingelFormGet.createBy) &&
                cpSingelFormGet.createBy.id === getStorage('userid') && (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.repost()}>
                    撤回
                  </Button>
                )}
            </FormItem>
          </Form>
        </Card>
        <CreateFormpass {...parentMethodspass} modalVisiblepass={modalVisiblepass} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpSingelFormForm;

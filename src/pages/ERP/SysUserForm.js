/* eslint-disable consistent-return */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, message, Card, Cascader, Collapse, Radio, Table, Popconfirm, Row, Col } from 'antd';
import router from 'umi/router';
import { isNotBlank, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import DragTable from '../../components/StandardEditTable/dragTable'
import { getStorage } from '@/utils/localStorageUtils';
import { SoftKey3W } from '@/utils/Syunew3'

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading, sysuser, syslevel, sysrole, sysdept, sysusercom, dictionaryL, company }) => ({
  ...sysuser,
  ...sysrole,
  ...syslevel,
  ...sysdept,
  ...sysusercom,
  ...dictionaryL,
  ...company,
  newusercomlist: sysusercom.usercomlist.list,
  newdeptlist: sysdept.deptlist.list,
  newqueryofflist: syslevel.queryofflist.list,
  formData: sysrole.formData.role,
  officeList: sysrole.formData.officeList,
  menuList: sysrole.formData.menuList,
  submitting: loading.effects['sysuser/add'],
  submitting1: loading.effects['company/add_comp']
}))
@Form.create()

class SysUserForm extends React.Component {
  constructor(props) {
    // let bConnect = 0
    // let digitArray = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')
    super(props);
    this.state = {
      location: getLocation(),
      selectlist1: [],
      newselectlist: [],
      selectedRows: [],
      orderflag: false,
      getvalue: '',
      bConnect: 0,
      digitArray: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    };
  }

  componentDidMount() {
    const { dispatch, form } = this.props;
    const { location } = this.state;

    if (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'user').length > 0
      && JSON.parse(getStorage('menulist')).filter(item => item.target == 'user')[0].children.filter(item => item.name == '修改')
        .length > 0) {
      this.setState({
        orderflag: false
      })
    } else {
      this.setState({
        orderflag: true
      })
    }
    form.resetFields();
    if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'sysuser/getuser_detail',
        payload: { id: location.query.id },
        callback: (res) => {
          dispatch({
            type: 'sysusercom/fetch',
            payload: {
              current: 1,
              pageSize: 50,
              'user.id': location.query.id,
              'createBy.id': res.id,
              state: 1,
            },
            callback: response => {
              this.setState({ selectlist1: response.data.list });
            },
          });
          dispatch({
            type: 'company/query_comp',
            payload: {
              current: 1,
              pageSize: 10,
              'createBy.id': res.id,
            }
          });
        }
      });

      dispatch({
        type: 'sysuser/form_data',
        payload: { id: location.query.id },
      });

      dispatch({
        type: 'sysdept/query_dept',
      });

    }

    dispatch({
      type: 'sysdept/query_dept'
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
        state: 1,
        pageSize:100
      },
    });

    dispatch({
      type: 'sysrole/fetch',
    });

    dispatch({
      type: 'syslevel/query_office',
    });
    dispatch({
      type: 'dictionaryL/fetch',
      payload: {
        type: 'area',
        pageSize: 1000
      },
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'sysuser/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { location, newselectlist } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let value = { ...values };
        if (isNotBlank(location.query.id)) {
          value = { ...values, id: location.query.id };
        }
        const newl1 = isNotBlank(newselectlist) ? newselectlist : [];
        if (!isNotBlank(value.newPassword)) {
          delete value.Password;
          delete value.newPassword;
        }
        value.dictArea = value.area;
        value.office = values.office[values.office.length - 1];
        value.company = {}
        value.company.id = value.office
        value.dept = values.dept[values.dept.length - 1];
        value.roleList = value.roleList.join(',');
        value.userOffices =
          isNotBlank(newselectlist) && newselectlist.length > 0
            ? newselectlist.length > 1
              ? newselectlist.join(',')
              : newselectlist[0]
            : '';

        const id1 = [];
        newl1.map(item => {
          return id1.push(item.id);
        });
        value.userOffices =
          isNotBlank(id1) && id1.length > 0 ? (id1.length > 1 ? id1.join(',') : id1[0]) : '';
        dispatch({
          type: 'sysuser/add_user',
          payload: value,
          callback: () => {
            this.setState(() => {
              form.resetFields();
              return {
                fileList: [],
                addfileList: [],
                photo: '',
              };
            });
            router.push('/system/user_list');
          },
        });

      }
    });
  };

  onsave = () => {
    const { dispatch, form } = this.props;
    const { location, newselectlist } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let value = { ...values };
        if (isNotBlank(location.query.id)) {
          value = { ...values, id: location.query.id };
        }
        const newl1 = isNotBlank(newselectlist) ? newselectlist : [];
        if (!isNotBlank(value.newPassword)) {
          delete value.Password;
          delete value.newPassword;
        }
        value.dictArea = value.area;
        value.office = values.office[values.office.length - 1];
        value.dept = values.dept[values.dept.length - 1];
        value.roleList = value.roleList.join(',');
        value.company = {}
        value.company.id = value.office
        value.userOffices =
          isNotBlank(newselectlist) && newselectlist.length > 0
            ? newselectlist.length > 1
              ? newselectlist.join(',')
              : newselectlist[0]
            : '';

        const id1 = [];
        newl1.map(item => {
          return id1.push(item.id);
        });
        value.userOffices =
          isNotBlank(id1) && id1.length > 0 ? (id1.length > 1 ? id1.join(',') : id1[0]) : '';
        dispatch({
          type: 'sysuser/add_user',
          payload: value,
          callback: (res) => {
            router.push(`/system/sys_user_form?id=${res.data.id}`);
          },
        });

      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('输入的两次密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (isNotBlank(value) && isNotBlank(confirmDirty)) {
      form.validateFields(['confirmNewPassword'], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const { confirmDirty } = this.state;
    const { value } = e.target;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  handleModalChange1 = record => {
    const { selectlist1, newselectlist, selectedRows, location } = this.state;
    const { usercomlist, dispatch, userdetail } = this.props;
    dispatch({
      type: 'sysusercom/add_usercompany',
      payload: {
        user: userdetail.id,
        companyId: isNotBlank(selectedRows) && selectedRows.length > 0 ? selectedRows.map(row => row).join(',') : ''
      },
      callback: () => {
        dispatch({
          type: 'sysuser/getuser_detail',
          payload: { id: location.query.id },
          callback: (res) => {
            dispatch({
              type: 'sysusercom/fetch',
              payload: {
                current: 1,
                pageSize: 50,
                'user.id': location.query.id,
                'createBy.id': res.id,
                state: 1,
              },
              callback: response => {
                this.setState({ selectlist1: response.data.list });
              },
            });
            dispatch({
              type: 'company/query_comp',
              payload: {
                current: 1,
                pageSize: 10,
                'createBy.id': res.id,
              }
            });
            this.setState({
              selectedRows: []
            })
          }
        });
      }
    })
  };

  delChange1 = record => {
    const { dispatch } = this.props;
    const { selectlist1, newselectlist, location } = this.state;
    let newlist1 = selectlist1;
    let newlist2 = newselectlist;
    if (isNotBlank(record.companyId)) {
      dispatch({
        type: 'sysusercom/del_usercompany',
        payload: {
          ids: record.id,
        },
        callback: () => {
          dispatch({
            type: 'sysusercom/fetch',
            payload: {
              current: 1,
              pageSize: 50,
              'user.id': location.query.id,
              'createBy.id': location.query.id,
              state: 1,
            },
            callback: response => {
              this.setState({ selectlist1: response.data.list })

            },
          });

          dispatch({
            type: 'company/query_comp',
            payload: {
              current: 1,
              pageSize: 10,
              'createBy.id': location.query.id,
            }
          });
        },
      });
      newlist1 = newlist1.filter(item => {
        return item.companyId !== record.id;
      });
      newlist2 = newlist2.filter(item => {
        return item.companyId !== record.id;
      });
    } else {
      newlist1 = newlist1.filter(item => {
        return item.id !== record.id;
      });
      newlist2 = newlist2.filter(item => {
        return item.id !== record.id;
      });
      message.success('删除成功');
    }
    this.setState({
      selectlist1: newlist1,
      newselectlist: newlist2,
    });
  };

  handleSelectRows = rows => {
    console.log(rows)
    this.setState({
      selectedRows: rows,
    });
  };

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
      type: 'company/query_comp',
      payload: {
        ...params,
        'createBy.id': getStorage('userid'),
      }
    });
  };

  loginClick = () => {
    const { bConnect } = this.state
    // 判断是否安装了服务程序，如果没有安装提示用户安装
    const that = this
    if (bConnect == 0) {
      window.alert('未能连接服务程序，请确定服务程序是否安装。'); return false
    }
    let DevicePath; let ID_1; let ID_2
    try {
      // 由于是使用事件消息的方式与服务程序进行通讯，
      // 好处是不用安装插件，不分系统及版本，控件也不会被拦截，同时安装服务程序后，可以立即使用，不用重启浏览器
      // 不好的地方，就是但写代码会复杂一些
      const s_simnew1 = new SoftKey3W() // 创建UK类

      s_simnew1.Socket_UK.onopen = function () {
        s_simnew1.ResetOrder()// 这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
      }

      // 写代码时一定要注意，每调用我们的一个UKEY函数，就会生产一个计数，即增加一个序号，较好的逻辑是一个序号的消息处理中，只调用我们一个UKEY的函数
      s_simnew1.Socket_UK.onmessage = function got_packet(Msg) {
        const UK_Data = JSON.parse(Msg.data)
        if (UK_Data.type != 'Process') return// 如果不是流程处理消息，则跳过
        switch (UK_Data.order) {
          case 0:
            {
              s_simnew1.FindPort(0)// 发送命令取UK的路径
            }
            break//! !!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
          case 1:
            {
              if (UK_Data.LastError != 0) { window.alert('未发现加密锁，请插入加密锁'); s_simnew1.Socket_UK.close(); return false }
              DevicePath = UK_Data.return_value// 获得返回的UK的路径
              s_simnew1.GetID_1(DevicePath) // 发送命令取ID_1
            }
            break
          case 2:
            {
              if (UK_Data.LastError != 0) { window.alert(`返回ID号错误，错误码为：${UK_Data.LastError.toString()}`); s_simnew1.Socket_UK.close(); return false }
              ID_1 = UK_Data.return_value// 获得返回的UK的ID_1
              s_simnew1.GetID_2(DevicePath) // 发送命令取ID_2
            }
            break
          case 3:
            {
              if (UK_Data.LastError != 0) { window.alert(`取得ID错误，错误码为：${UK_Data.LastError.toString()}`); s_simnew1.Socket_UK.close(); return false }
              ID_2 = UK_Data.return_value// 获得返回的UK的ID_2
              // sessionStorage.setItem('keyID', toHex(ID_1) + toHex(ID_2))
              that.setState({
                getvalue: that.toHex(ID_1) + that.toHex(ID_2)
              })
              // setStore('keyID', toHex(ID_1) + toHex(ID_2))
              //! !!!!注意，这里一定要主动提交，
              // frmlogin.submit();

              // 所有工作处理完成后，关掉Socket
            }
            break
        }
      }
      s_simnew1.Socket_UK.onclose = function () {

      }
      return true
    } catch (e) {
      alert(`${e.name}: ${e.message}`)
    }
  }

  getvalue = () => {
    const { bConnect } = this.state
    const that = this
    // if (getStore('token')&&sessionStorage.getItem('keyID')) return// 如果已自动登录则退出
    // 如果是IE10及以下浏览器，则使用AVCTIVEX控件的方式
    if (navigator.userAgent.indexOf('MSIE') > 0 && !navigator.userAgent.indexOf('opera') > -1) {
      setTimeout(Handle_IE10, 1000)
      return
    }
    try {
      const s_pnp = new SoftKey3W()
      s_pnp.Socket_UK.onopen = function () {
        that.setState({
          bConnect: 1
        })// 代表已经连接，用于判断是否安装了客户端服务
        setTimeout(function () {
          that.loginClick()
        }, 500)
      }

      // 在使用事件插拨时，注意，一定不要关掉Sockey，否则无法监测事件插拨
      s_pnp.Socket_UK.onmessage = function got_packet(Msg) {
        const PnpData = JSON.parse(Msg.data)
        if (PnpData.type == 'PnpEvent')// 如果是插拨事件处理消息
        {
          if (PnpData.IsIn) {
          } else {
            // localStorage.clear()
            // sessionStorage.clear()
            // router.push({
            //   path: '/login'
            // })
            // userLogout().then(res => {
            //   router.push({
            //     path: '/login'
            //   })
            // })
            // alert("UKEY已被拨出，被拨出的锁的路径是：" + PnpData.DevicePath);
          }
        }
      }

      s_pnp.Socket_UK.onclose = function () {

      }
      setTimeout(this.err_Connect, 3000)// 如果在一定时间内还没有连接成功，就提示要安装服务
    } catch (e) {
      alert(`${e.name}: ${e.message}`)
      return false
    }
  }

  err_Connect = () => {
    const { bConnect } = this.state
    if (bConnect == 1) return
    alert('未能连接服务程序，请确定服务程序是否安装。')
  }

  toHex = (n) => {
    const { digitArray } = this.state
    let result = ''
    let start = true

    for (let i = 32; i > 0;) {
      i -= 4
      const digit = (n >> i) & 0xf

      if (!start || digit != 0) {
        start = false
        result += digitArray[digit]
      }
    }

    return (result == '' ? '0' : result)
  }

  Handle_IE10 = () => {
    try {
      let DevicePath;
      var s_simnew1;
      // 创建或控件

      var s_simnew1 = new ActiveXObject('Syunew3A.s_simnew3')

      DevicePath = s_simnew1.FindPort(0)// '来查找加密锁，0是指查找默认端口的锁
      if (s_simnew1.LastError != 0) {
        window.alert('未发现加密锁，请插入加密锁'); return false
      }
      // 获取锁的ID
      frmlogin.KeyID.value = this.toHex(s_simnew1.GetID_1(DevicePath)) + this.toHex(s_simnew1.GetID_2(DevicePath))
      if (s_simnew1.LastError != 0) {
        window.alert(`获取ID错误,错误码是${s_simnew1.LastError.toString()}`)
        return false
      }
      frmlogin.submit()
      return true

    } catch (e) {
      alert(`${e.name}: ${e.message}。可能是没有安装相应的控件或插件`)
      return false
    }
  }


  render() {
    const {
      submitting1,
      form,
      levellist2,
      submitting,
      rolelist,
      userdetail,
      newdeptlist,
      newqueryofflist,
      queryusercompany,
      listdict,
      newusercomlist,
      complist,
    } = this.props;
    const { getFieldDecorator } = form;
    const { location, selectlist1, selectedRows, orderflag, getvalue } = this.state;

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
    const onCancelCancel = () => {
      router.push('/system/user_list');
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );
    const columns = [
      {
        title: '公司编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '公司名称',
        dataIndex: 'name',
        width: 100,
      },
    ];

    const columns1 = [
      {
        title: '操作',
        width: 30,
        render: record => {
          return !orderflag ?
            <Popconfirm title="是否要删除此负责公司？" onConfirm={() => this.delChange1(record)}>
              <a>删除</a>
            </Popconfirm>
            : ''
        }
      },
      {
        title: '公司编号',
        dataIndex: 'code',
        width: 30,
      },
      {
        title: '公司名称',
        dataIndex: 'name',
        width: 30,
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            用户管理
          </div>
          <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="所属大区公司">
                  {getFieldDecorator('office', {
                    initialValue:
                      isNotBlank(userdetail) &&
                        isNotBlank(userdetail.area) &&
                        isNotBlank(userdetail.area.parentIds)
                        ? userdetail.area.parentIds.split(',')
                        : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择大区公司',
                      },
                    ],
                  })(
                    <Cascader
                      disabled={orderflag}
                      options={newqueryofflist}

                      style={{ width: '100%' }}
                      allowClear
                      fieldNames={{ label: 'name', value: 'id' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="所属区域">
                  {getFieldDecorator('area', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.dictArea)
                        ? userdetail.dictArea
                        : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择所属区域',
                      },
                    ],
                  })(
                    <Select
                      disabled={orderflag}
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.props.children.indexOf(input) >= 0
                      }
                      allowClear
                      notFoundContent={null}
                      style={{ width: '100%' }}

                    >
                      {isNotBlank(listdict) &&
                        isNotBlank(listdict.list) &&
                        listdict.list.length > 0 &&
                        listdict.list.map(item => (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="所属部门">
                  {getFieldDecorator('dept', {
                    initialValue:
                      isNotBlank(userdetail) &&
                        isNotBlank(userdetail.dept) &&
                        isNotBlank(userdetail.dept.parentIds)
                        ? userdetail.dept.parentIds.split(',')
                        : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择部门',
                      },
                    ],
                  })(
                    <Cascader
                      disabled={orderflag}
                      options={newdeptlist}

                      style={{ width: '100%' }}
                      allowClear
                      fieldNames={{ label: 'name', value: 'id' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="工号">
                  {getFieldDecorator('no', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.no) ? userdetail.no : '',
                    rules: [
                      {
                        required: false,
                        message: '自动生成工号',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="姓名">
                  {getFieldDecorator('name', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.name) ? userdetail.name : '',

                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="登录名">
                  {getFieldDecorator('loginName', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.loginName)
                        ? userdetail.loginName
                        : '',

                    rules: [
                      {
                        required: true,
                        message: '请输入登录名',
                      },
                    ],
                  })(<Input autoComplete="off" disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label="密码"
                  help={
                    !isNotBlank(location) ||
                      !isNotBlank(location.query) ||
                      !isNotBlank(location.query.id)
                      ? ''
                      : '若不修改密码，请留空'
                  }
                >
                  {getFieldDecorator('Password', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.Password)
                        ? userdetail.Password
                        : '',
                    rules: [
                      {
                        message: '请输入密码',
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input type="password" autoComplete="new-password" disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="确认密码">
                  {getFieldDecorator('newPassword', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.newPassword)
                        ? userdetail.newPassword
                        : '',
                    rules: [
                      {
                        message: '请输入确认密码',
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input
                      disabled={orderflag}
                      type="password"
                      onBlur={this.handleConfirmBlur}
                      autoComplete="new-password"

                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="ic卡号">
                  {getFieldDecorator('icCode', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.icCode) ? userdetail.icCode : '',
                  })(<Input style={{ width: '100%' }} disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="性别">
                  {getFieldDecorator('sex', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.sex) ? userdetail.sex : '',
                    rules: [
                      {
                      },
                    ],
                  })(
                    <Radio.Group disabled={orderflag}>
                      <Radio value="0">女</Radio>
                      <Radio value="1">男</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.phone) ? userdetail.phone : '',
                  })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="角色类型">
                  {getFieldDecorator('roleList', {

                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.roleList)
                        ? userdetail.roleList.map(item => item.id)
                        : [],
                    rules: [
                      {
                        required: true,
                        message: '请选择角色类型',
                      },
                    ],
                  })(
                    <Select
                      disabled={orderflag}
                      allowClear
                      mode="multiple"
                      notFoundContent={null}
                      style={{ width: '100%' }}

                    >
                      {isNotBlank(rolelist) &&
                        isNotBlank(rolelist.list) &&
                        rolelist.list.length > 0 &&
                        rolelist.list.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="在职状态">
                  {getFieldDecorator('status', {
                    initialValue:
                      isNotBlank(userdetail) && isNotBlank(userdetail.status) ? userdetail.status : '',
                    rules: [
                      {
                      },
                    ],
                  })(
                    <Radio.Group disabled={orderflag}>
                      <Radio value="0">在职</Radio>
                      <Radio value="1">离职</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="绑定加密">
                  {getFieldDecorator('equiIds', {
                    initialValue: isNotBlank(getvalue) ? getvalue :
                      isNotBlank(userdetail) && isNotBlank(userdetail.equiIds) ? userdetail.equiIds : '',
                    rules: [
                      {
                      },
                    ],
                  })(
                    <Input disabled style={{ width: '50%' }} />
                  )}
                  <Button
                    type="primary"
                    style={{ marginLeft: '8px' }}
                    onClick={this.getvalue}
                  >
                    获取
                  </Button>
                </FormItem>
              </Col>
            </Row>

            <FormItem {...formItemLayout} label="负责分公司">
              <Button
                type="primary"
                loading={submitting}
                disabled={!isNotBlank(selectedRows) || (isNotBlank(selectedRows) && selectedRows.length <= 0) || orderflag}
                onClick={this.handleModalChange1}
              >
                选择
              </Button>
            </FormItem>
            <Collapse defaultActiveKey="1">
              <Panel header="请选择负责分公司" key="1">
                <StandardTable
                  bordered

                  scroll={{ x: 250 }}
                  selectedRows={selectedRows}
                  defaultExpandAllRows
                  data={complist}

                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </Panel>
            </Collapse>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'user').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'user')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <span>
                  <Button type="primary" onClick={this.onsave} loading={submitting1}>
                    保存
                    </Button>
                  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1}>
                    提交
                    </Button>
                </span>
              }
              <Button onClick={onCancelCancel} style={{ marginLeft: 8 }}>
                返回{' '}
              </Button>
            </FormItem>
          </Form>
        </Card>

        <Card type="inner" title="已选择负责公司">
          <div>
            <Table
              rowKey="id"
              bordered
              dataSource={isNotBlank(selectlist1) && selectlist1.length > 0 ? selectlist1 : []}
              columns={columns1}
            // size="small" 
            // onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default SysUserForm;

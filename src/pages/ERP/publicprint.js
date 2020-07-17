import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Col,
  Row,
  Form,
  Input,
  Select,
  Button,
  Card,
  Modal,
  DatePicker,
  message,
  Upload,
  Icon,
  InputNumber,
  Cascader,
} from 'antd';
import Moment from 'moment';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './publicprint.less';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { TextArea } = Input;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const {
    handleModalVisible,
    userlist,
    selectflag,
    selectuser,
    levellist,
    levellist2,
    newdeptlist,
    form,
    dispatch,
  } = props;
  const { getFieldDecorator } = form;

  const selectcolumns = [
    {
      title: '操作',
      width: 150,
      render: record => (
        <Fragment>
          <a onClick={() => selectuser(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '编号',
      dataIndex: 'no',
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
      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
    });
  };

  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'sysuser/fetch',
      payload: {
        current: 1,
        pageSize: 10,
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
      type: 'sysuser/fetch',
      payload: params,
    });
  };

  const renderSimpleForm = () => {
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('no')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属大区">
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
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="所属分公司">
              {getFieldDecorator('office.id', {
                initialValue: '',
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
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属部门">
              {getFieldDecorator('dept', {
                initialValue: '',
              })(
                <Cascader
                  options={newdeptlist}
                  
                  style={{ width: '100%' }}
                  allowClear
                  fieldNames={{ label: 'name', value: 'id' }}
                />
              )}
            </FormItem>
          </Col>
          <div>
            <span style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
              </Button>
            </span>
          </div>
        </Row>
      </Form>
    );
  };

  return (
    <Modal
      title="选择业务员"
      visible={selectflag}
      
      onCancel={() => handleModalVisible()}
      width="80%"
    >
      
      <div>
        
        <div>{renderSimpleForm()}</div>
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

const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, cpClientList, selectkhflag, selectcustomer } = props;
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
      title: '客户编码', 
      dataIndex: 'code', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '用户', 
      dataIndex: 'user.id', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '客户公司', 
      dataIndex: 'clientCpmpany', 
      inputType: 'text', 
      width: 240, 
      editable: true, 
    },

    {
      title: '客户分类', 
      dataIndex: 'classify', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '客户级别', 
      dataIndex: 'level', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '联系人', 
      dataIndex: 'name', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '联系地址', 
      dataIndex: 'address', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '邮箱', 
      dataIndex: 'email', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '移动电话', 
      dataIndex: 'phone', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '电话', 
      dataIndex: 'tel', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '传真', 
      dataIndex: 'fax', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '税号', 
      dataIndex: 'dutyParagraph', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '开户账号', 
      dataIndex: 'openNumber', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '开户银行', 
      dataIndex: 'openBank', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '开户地址', 
      dataIndex: 'openAddress', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '开户电话', 
      dataIndex: 'openTel', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '创建者', 
      dataIndex: 'createBy.id', 
      inputType: 'text', 
      width: 100, 
      editable: false, 
    },

    {
      title: '更新时间',
      dataIndex: 'finishDate',
      editable: true,
      inputType: 'dateTime',
      width: 100,
      sorter: true,
      render: val => <span>{Moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '备注信息', 
      dataIndex: 'remarks', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
  ];

  return (
    <Modal
      title="选择客户"
      visible={selectkhflag}
      
      onCancel={() => handleModalVisiblekh()}
      width="80%"
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={cpClientList}
        columns={columnskh}
      />
    </Modal>
  );
});

const CreateFormjc = Form.create()(props => {
  const { handleModalVisiblejc, cpCollecClientList, selectjcflag, selectjc } = props;
  const columnsjc = [
    {
      title: '操作',
      width: 150,
      render: record => (
        <Fragment>
          <a onClick={() => selectjc(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '名称', 
      dataIndex: 'name', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '返点', 
      dataIndex: 'rebates', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
    {
      title: '备注信息', 
      dataIndex: 'remarks', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
  ];

  return (
    <Modal
      title="选择集采客户"
      visible={selectjcflag}
      
      onCancel={() => handleModalVisiblejc()}
      width="80%"
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={cpCollecClientList}
        columns={columnsjc}
      />
    </Modal>
  );
});

const CreateFormcode = Form.create()(props => {
  const { handleModalVisiblecode, cpCollecCodeList, selectcodeflag, selectcode } = props;
  const columnscode = [
    {
      title: '操作',
      width: 150,
      render: record => (
        <Fragment>
          <a onClick={() => selectcode(record)}>选择</a>
        </Fragment>
      ),
    },
    {
      title: '名称', 
      dataIndex: 'name', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '编码', 
      dataIndex: 'code', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },

    {
      title: '金额', 
      dataIndex: 'money', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
      render:text=>(getPrice(text))
    },

    {
      title: '备注信息', 
      dataIndex: 'remarks', 
      inputType: 'text', 
      width: 100, 
      editable: true, 
    },
  ];

  return (
    <Modal
      title="选择集采编码"
      visible={selectcodeflag}
      
      onCancel={() => handleModalVisiblecode()}
      width="80%"
    >
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        data={cpCollecCodeList}
        columns={columnscode}
      />
    </Modal>
  );
});

@connect(
  ({
    cpBusinessIntention,
    loading,
    sysuser,
    cpClient,
    cpCollecClient,
    cpCollecCode,
    syslevel,
    sysdept,
  }) => ({
    ...cpBusinessIntention,
    ...sysuser,
    ...cpClient,
    ...cpCollecClient,
    ...cpCollecCode,
    ...syslevel,
    ...sysdept,
    submitting: loading.effects['form/submitRegularForm'],
  })
)
@Form.create()
class CpBusinessIntentionForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: {},
			addfileList: [],
			fileList: [],
			orderflag: false,
			selectflag: false,
			selectdata: {},
			selectkhflag: false,
			selectjcflag:false,
			selectcodeflag:false,
			selectcodedata:{},
			selectjcdata:{},
			selectkhdata: {},
			sumbitflag:false,
			location: getLocation(),
		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const { location } = this.state
		if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
			dispatch({
				type: 'cpBusinessIntention/cpBusinessIntention_Get',
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
				}
			});
		}
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'insurance_company',
			},
			callback: data => {
				this.setState({
					insuranceCompany: data
				})
			}
		});

		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'brand',
			},
			callback: data => {
				this.setState({
					brand: data
				})
			}
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
				type: 'collect_customer',
			},
			callback: data => {
				this.setState({
					collectCustomer: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'orderStatus',
			},
			callback: data => {
				this.setState({
					orderStatus: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'orderType',
			},
			callback: data => {
				this.setState({
					orderType: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'business_project',
			},
			callback: data => {
				this.setState({
					business_project: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'business_dicth',
			},
			callback: data => {
				this.setState({
					business_dicth: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'business_type',
			},
			callback: data => {
				this.setState({
					business_type: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'settlement_type',
			},
			callback: data => {
				this.setState({
					settlement_type: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'payment_methodd',
			},
			callback: data => {
				this.setState({
					payment_methodd: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'old_need',
			},
			callback: data => {
				this.setState({
					old_need: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'make_need',
			},
			callback: data => {
				this.setState({
					make_need: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'quality_need',
			},
			callback: data => {
				this.setState({
					quality_need: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'oils_need',
			},
			callback: data => {
				this.setState({
					oils_need: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'guise_need',
			},
			callback: data => {
				this.setState({
					guise_need: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'installation_guide',
			},
			callback: data => {
				this.setState({
					installation_guide: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'maintenance_project',
			},
			callback: data => {
				this.setState({
					maintenance_project: data
				})
			}
		});
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'is_photograph',
			},
			callback: data => {
				this.setState({
					is_photograph: data
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
		dispatch({
			type: 'dict/dict',
			payload: {
				type: 'client_level',
			},
			callback: data => {
				this.setState({
					client_level: data
				})
			}
		});
	}
	componentWillUnmount() {
		const { dispatch, form } = this.props;
		form.resetFields();
		dispatch({
			type: 'cpBusinessIntention/clear',
		});
		this.setState({
			selectflag:false,
			selectkhflag:false,
			selectjcflag:false,
			selectcodeflag:false,
			selectdata:{},
			selectkhdata:{},
			selectjcdata:{},
			selectcodedata:{},
		})
	}

	handleSubmit = e => {
		const { dispatch, form, cpBusinessIntentionGet } = this.props;
		const { addfileList, selectkhdata, selectdata, previewVisible, location ,selectjcdata,selectcodedata} = this.state;
		e.preventDefault();
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({
					sumbitflag:true
				})
				const value = { ...values };
				if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.photo = addfileList.join('|')
				} else {
					value.photo = '';
				}

				if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
					value.id = location.query.id;
				}
				value.intentionPrice = setPrice(value.intentionPrice)
				value.deliveryDate = Moment(value.deliveryDate).format("YYYY-MM-DD")
				value.client = {}
				value.user = {}
				value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)) ? cpBusinessIntentionGet.client.id : '')
				value.user.id = (isNotBlank(selectdata) && isNotBlank(selectdata.id)) ? selectdata.id :
					((isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user)) ? cpBusinessIntentionGet.user.id : (getStorage('userid') ? getStorage('userid') : ''))

				value.orderStatus = 1
				dispatch({
					type: 'cpBusinessIntention/cpBusinessIntention_Add',
					payload: { ...value },
					callback: () => {
						this.setState({
							addfileList: [],
							fileList: [],
						});
						router.push('/business/process/cp_business_intention_list');
					}
				})
			}
		});
	}

	onsave = (e) => {
		const { dispatch, form, cpBusinessIntentionGet } = this.props;
		const { addfileList, selectkhdata, selectdata, location ,selectjcdata,selectcodedata} = this.state;
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
				value.intentionPrice = setPrice(value.intentionPrice)
				value.deliveryDate = Moment(value.deliveryDate).format("YYYY-MM-DD")
				value.client = {}
				value.user = {}
				value.client.id = (isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id)) ? selectkhdata.id : ((isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)) ? cpBusinessIntentionGet.client.id : '')
				value.user.id = (isNotBlank(selectdata) && isNotBlank(selectdata.id)) ? selectdata.id : ((isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user)) ? cpBusinessIntentionGet.user.id : getStorage('userid'))
				value.orderStatus = 0
				dispatch({
					type: 'cpBusinessIntention/cpBusinessIntention_Add',
					payload: { ...value },
					callback: (res) => {
						router.push(`/business/process/cp_business_intention_form?id=${res.data.id}`);
					}
				})
			}
		});
	}

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
		const { orderflag } = this.state
		if (!orderflag) {
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
		}

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
					name: 'businessIntention'
				},
				callback: (res) => {
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
		if (isNotBlank(info.file) && isNotBlank(info.file.size)) {
			const isimg = info.file.type.indexOf('image') >= 0;
			const isLt10M = info.file.size / 1024 / 1024 <= 10;
			if (info.file.status === 'done') {
				if (isLt10M && isimg) {
					this.setState({ fileList: info.fileList });
				}
			} else {
				this.setState({ fileList: info.fileList });
			}
		}
	};
	onselect = () => {
		const {dispatch} = this.props
		dispatch({
			type: 'sysuser/fetch',
			payload:{
				current:1,
				pageSize:10
			},
			callback:()=>{
				this.setState({
			selectflag: true
		})
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
	}

	onselectjc = () => {
		const {dispatch} = this.props
		dispatch({
			type: 'cpCollecClient/cpCollecClient_List',
			payload: {
			  pageSize: 10,
			  status:1
			},
			callback:()=>{
				this.setState({
					selectjcflag: true
				})
			}
		  });
	}
	onselectkh = () => {
		const {dispatch} = this.props
		const that = this
		dispatch({
			type: 'cpClient/cpClient_List',
			payload: {
				pageSize: 10,
			},
			callback:()=>{
				that.setState({
				selectkhflag: true
				})
			}
		});
	}
	onselectcode = () => {
		const {dispatch} = this.props
		const that = this
		this.setState({
				selectcodeflag: true
				})	
		}
	handleModalVisible = flag => {
		this.setState({
			selectflag: !!flag
		});
	};

	handleModalVisiblekh = flag => {
		this.setState({
			selectkhflag: !!flag
		});
	};

	handleModalVisiblecode = flag => {
		this.setState({
			selectcodeflag: !!flag
		});
	};

	handleModalVisiblejc = flag => {
		this.setState({
			selectjcflag: !!flag
		})
	};

	selectuser = (record) => {
		this.setState({
			selectdata: record,
			selectflag: false
		})
	}

	selectcustomer = (record) => {
		
		this.setState({
			selectkhdata: record,
			selectkhflag: false
		})
	}

	selectjc = (record) => {
		
		const {dispatch} = this.props
		this.setState({
			selectjcdata: record,
			selectjcflag: false
		})
		dispatch({
            type: 'cpCollecCode/cpCollecCode_List',
            payload: {
             pageSize: 10,
			  id:record.id
            }
          });
	}

	selectcode = (record) => {
		
		this.setState({
			selectcodedata: record,
			selectcodeflag: false
		})
	}

	onUndo = (record) => {
		Modal.confirm({
			title: '撤销该意向单',
			content: '确定撤销该意向单吗？',
			okText: '确认',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => this.undoClick(record),
		});
	}

	undoClick = (id) => {
		const { dispatch } = this.props
		dispatch({
			type: 'cpBusinessIntention/cpBusinessIntention_undo',
			payload: {
				id
			},
			callback: () => {
				router.goBack();
			}
		})
	}

	showPrint=()=>{
		console.log(321)
		window.print()
	}
	render() {
		const { orderflag, selectflag, selectdata, selectkhflag, selectkhdata, fileList, previewImage, previewVisible ,selectjcflag, selectjcdata ,selectcodeflag , selectcodedata ,sumbitflag} = this.state;
		const { submitting, cpBusinessIntentionGet, userlist, cpClientList ,cpCollecClientList ,cpCollecCodeList ,levellist, levellist2, newdeptlist ,dispatch} = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;

		console.log(fileList)

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
		const parentMethods = {
			handleAdd: this.handleAdd,
			handleModalVisible: this.handleModalVisible,
			selectuser: this.selectuser,
			handleSearch:this.handleSearch,
			handleFormReset:this.handleFormReset,
			
			userlist,
			levellist, levellist2, newdeptlist,dispatch
		}

		const parentMethodskh = {
			handleAddkh: this.handleAddkh,
			handleModalVisiblekh: this.handleModalVisiblekh,
			
			selectcustomer: this.selectcustomer,
			cpClientList
			
		}

		const parentMethodsjc = {
			handleAddjc: this.handleAddjc,
			handleModalVisiblejc: this.handleModalVisiblejc,
			
			selectjc: this.selectjc,
			cpCollecClientList
			
		}
		const parentMethodscode = {
			handleAddcode: this.handleAddcode,
			handleModalVisiblecode: this.handleModalVisiblecode,
			
			selectcode: this.selectcode,
			cpCollecCodeList
			
		}

		return (
			<PageHeaderWrapper>
				<Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
					
					<Card title="基本信息"  bordered={false}>
						<Row gutter={16}>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='订单状态'>
									{getFieldDecorator('orderStatus', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.orderStatus) ? ((cpBusinessIntentionGet.orderStatus === 0 || cpBusinessIntentionGet.orderStatus === '0') ? '未处理' : '已处理') : '',    
										rules: [
											{
												required: false,
												message: '请选择订单状态',
											},
										],
									})(
										<Input
										disabled
										style={cpBusinessIntentionGet.orderStatus === 1 || cpBusinessIntentionGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }} />
									)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='意向单号'>
										<Input
										disabled
										value={isNotBlank(cpBusinessIntentionGet)&&isNotBlank(cpBusinessIntentionGet.id)?cpBusinessIntentionGet.id:''} />
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='订单分类'>
									{getFieldDecorator('orderType', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.orderType) ? cpBusinessIntentionGet.orderType : '',    
										rules: [
											{
												required: true,
												message: '请选择订单分类',
											},
										],
									})(
										<Select
										    disabled ={orderflag}
											style={{ width: '100%' }}
											
											showSearch
											allowClear
										>
											{
												isNotBlank(this.state.orderType) && this.state.orderType.length > 0 && this.state.orderType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='业务项目'>
									{getFieldDecorator('project', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.project) ? cpBusinessIntentionGet.project : '',    
										rules: [
											{
												required: true,
												message: '请选择业务项目',
											},
										],
									})(
										<Select
											style={{ width: '100%' }}
											
											disabled={orderflag}
											allowClear
										>
											{
												isNotBlank(this.state.business_project) && this.state.business_project.length > 0 && this.state.business_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='业务渠道'>
									{getFieldDecorator('dicth', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.dicth) ? cpBusinessIntentionGet.dicth : '',    
										rules: [
											{
												required: true,
												message: '请选择业务渠道',
											},
										],
									})(
										<Select
											style={{ width: '100%' }}
											
											disabled={orderflag}
											allowClear
										>
											{
												isNotBlank(this.state.business_dicth) && this.state.business_dicth.length > 0 && this.state.business_dicth.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='业务分类'>
									{getFieldDecorator('businessType', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.businessType) ? cpBusinessIntentionGet.businessType : '',    
										rules: [
											{
												required: true,
												message: '请选择业务分类',
											},
										],
									})(
										<Select
											style={{ width: '100%' }}
											
											disabled={orderflag}
											allowClear
										>
											{
												isNotBlank(this.state.business_type) && this.state.business_type.length > 0 && this.state.business_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='结算类型'>
									{getFieldDecorator('settlementType', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.settlementType) ? cpBusinessIntentionGet.settlementType : '',    
										rules: [
											{
												required: true,
												message: '请选择结算类型',
											},
										],
									})(
										<Select
											style={{ width: '100%' }}
											
											disabled={orderflag}
											allowClear
										>
											{
												isNotBlank(this.state.settlement_type) && this.state.settlement_type.length > 0 && this.state.settlement_type.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='保险公司'>
									{getFieldDecorator('insuranceCompanyId', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.insuranceCompanyId) ? cpBusinessIntentionGet.insuranceCompanyId : '',     
										rules: [
											{
												required: false,   
												message: '请选择保险公司',
												
											},
										],
									})(
										<Select
											style={{ width: '100%' }}
											
											disabled={orderflag}
											allowClear
										>
											{
											isNotBlank(this.state.insuranceCompany) && this.state.insuranceCompany.length > 0 && this.state.insuranceCompany.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='品牌'>
									{getFieldDecorator('brand', {
										initialValue: isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.brand) ? cpBusinessIntentionGet.brand : '',     
										rules: [
											{
												required: true,   
												message: '请选择品牌',
												
											},
										],
									})(
										<Select
											style={{ width: '100%' }}
											
											disabled={orderflag}
											allowClear
										>
											{
											isNotBlank(this.state.brand) && this.state.brand.length > 0 && this.state.brand.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
											}
										</Select>
										)}
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='集采客户'>
								{getFieldDecorator('collectClientId', {
										initialValue: isNotBlank(selectjcdata) && isNotBlank(selectjcdata.name) ?selectjcdata.name : (isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.collectClientId) ? cpBusinessIntentionGet.collectClientId.id :'')  ,   
										rules: [
											{
												required: false,   
												message: '请选择集采客户',
												
											},
										],
									})( 							
									<Input
									    style={{width:'50%'}}
										disabled
									/>)
								}
									<Button type="primary" style={{marginLeft:'8px'}} onClick={this.onselectjc} loading={submitting} disabled={orderflag}>选择</Button>
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='集采编码'>
								 {getFieldDecorator('collectCode', {
										initialValue: isNotBlank(selectcodedata) && isNotBlank(selectcodedata.code) ?
										selectcodedata.code : (isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.collectCode) ? cpBusinessIntentionGet.collectCode: ''),    
										rules: [
											{
												required: false,   
												message: '请选择集采编码',
												
											},
										],
									})(
										<Input
									    style={{width:'50%'}}
										disabled
										/>
									)
								 }
									<Button type="primary" style={{marginLeft:'8px'}} onClick={this.onselectcode} loading={submitting} disabled={orderflag||!isNotBlank(selectcodedata)}>选择</Button>
								</FormItem>
							</Col>
						</Row>
					</Card>

					<Card title="业务员信息"   bordered={false}>
						<Row gutter={16}>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='业务员'>
									<Input
									    style={{width:'50%'}}
										disabled
										value={isNotBlank(selectdata) && isNotBlank(selectdata.name) ?
											selectdata.name : (isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) ? cpBusinessIntentionGet.user.name : getStorage('username'))}
									/>
									<Button type="primary" style={{marginLeft:'8px'}} onClick={this.onselect} loading={submitting} disabled={orderflag}>选择</Button>
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='编号'>
									<Input
										disabled
										value={isNotBlank(selectdata) && isNotBlank(selectdata.no) ?
											selectdata.no : (isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) ? cpBusinessIntentionGet.user.no : getStorage('userno'))}
									/>
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='所属公司'>
									<Input
										disabled
										value={isNotBlank(selectdata) && isNotBlank(selectdata.companyName) ? selectdata.companyName
											: (isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) && isNotBlank(cpBusinessIntentionGet.user.office) ? cpBusinessIntentionGet.user.office.name : getStorage('companyname'))}
									/>
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='所属区域'>
									<Input
										disabled
										value={isNotBlank(selectdata) && isNotBlank(selectdata.areaName) ? selectdata.areaName
											: (isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.areaName) ? cpBusinessIntentionGet.areaName : getStorage('areaname'))}
									/>
								</FormItem>
							</Col>
							<Col lg={12} md={12} sm={24}>
								<FormItem {...formItemLayout} label='所属部门'>
									<Input
										disabled
										value={isNotBlank(selectdata) && isNotBlank(selectdata.dept) ?
											selectdata.dept.name : (isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) && isNotBlank(cpBusinessIntentionGet.user.dept)? cpBusinessIntentionGet.user.dept.name : getStorage('deptname'))}
									/>
								</FormItem>

							</Col>
            </Row>
          </Card>
          
          <Card title="客户信息" bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="客户">
                  <Input
                    style={{ width: '50%' }}
                    disabled
                    value={
                      isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name)
                        ? selectkhdata.name
                        : isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.client)
                        ? cpBusinessIntentionGet.client.name
                        : ''
                    }
                  />
                  <Button
                    type="primary"
                    style={{ marginLeft: '8px' }}
                    onClick={this.onselectkh}
                    loading={submitting}
                    disabled={orderflag}
                  >
                    选择
                  </Button>
                  
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="客户分类">
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    disabled
                    value={
                      isNotBlank(selectkhdata) && isNotBlank(selectkhdata.classify)
                        ? selectkhdata.classify
                        : isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.client) &&
                          isNotBlank(cpBusinessIntentionGet.client.classify)
                        ? cpBusinessIntentionGet.client.classify
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
                <FormItem {...formItemLayout} label="客户编号">
                  <Input
                    disabled
                    value={
                      isNotBlank(selectkhdata) && isNotBlank(selectkhdata.code)
                        ? selectkhdata.code
                        : isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.client)
                        ? cpBusinessIntentionGet.client.code
                        : ''
                    }
                  />
                </FormItem>
              </Col>

              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="联系人">
                  <Input
                    disabled
                    value={
                      isNotBlank(selectkhdata) && isNotBlank(selectkhdata.name)
                        ? selectkhdata.name
                        : isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.client)
                        ? cpBusinessIntentionGet.client.name
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
                      isNotBlank(selectkhdata) && isNotBlank(selectkhdata.address)
                        ? selectkhdata.address
                        : isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.client)
                        ? cpBusinessIntentionGet.client.address
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
                      isNotBlank(selectkhdata) && isNotBlank(selectkhdata.phone)
                        ? selectkhdata.phone
                        : isNotBlank(cpBusinessIntentionGet) &&
                          isNotBlank(cpBusinessIntentionGet.client)
                        ? cpBusinessIntentionGet.client.phone
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
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyEnterType)
                        ? cpBusinessIntentionGet.assemblyEnterType
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入进场类型',
                        
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {isNotBlank(this.state.approachType) &&
                        this.state.approachType.length > 0 &&
                        this.state.approachType.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="总成品牌">
                  {getFieldDecorator('assemblyBrand', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyBrand)
                        ? cpBusinessIntentionGet.assemblyBrand
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入总成品牌',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="车型/排量">
                  {getFieldDecorator('assemblyVehicleEmissions', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyVehicleEmissions)
                        ? cpBusinessIntentionGet.assemblyVehicleEmissions
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入车型/排量',
                        
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="年份">
                  {getFieldDecorator('assemblyYear', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyYear)
                        ? cpBusinessIntentionGet.assemblyYear
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入年份',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="总成型号">
                  {getFieldDecorator('assemblyModel', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyModel)
                        ? cpBusinessIntentionGet.assemblyModel
                        : '', 
                    rules: [
                      {
                        required: true, 
                        message: '请输入总成型号',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="钢印号">
                  {getFieldDecorator('assemblySteelSeal', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblySteelSeal)
                        ? cpBusinessIntentionGet.assemblySteelSeal
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入钢印号',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="VIN码">
                  {getFieldDecorator('assemblyVin', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyVin)
                        ? cpBusinessIntentionGet.assemblyVin
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入VIN码',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="其他识别信息">
                  {getFieldDecorator('assemblyMessage', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyMessage)
                        ? cpBusinessIntentionGet.assemblyMessage
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入其他识别信息',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="故障代码">
                  {getFieldDecorator('assemblyFaultCode', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyFaultCode)
                        ? cpBusinessIntentionGet.assemblyFaultCode
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入故障代码',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="本次故障描述" className="allinputstyle">
                  {getFieldDecorator('assemblyErrorDescription', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.assemblyErrorDescription)
                        ? cpBusinessIntentionGet.assemblyErrorDescription
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入本次故障描述',
                        
                      },
                    ],
                  })(<TextArea disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="照片上传" className="allimgstyle">
                  
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
                    {(isNotBlank(fileList) && fileList.length >= 9) || orderflag
                      ? null
                      : uploadButton}
                  </Upload>
                  
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="配件信息" bordered={false}>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="销售明细" className="allinputstyle">
                  {getFieldDecorator('salesParticular', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.salesParticular)
                        ? cpBusinessIntentionGet.salesParticular
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入销售明细',
                        
                      },
                    ],
                  })(<TextArea disabled={orderflag} />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="一级信息" bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="意向单价">
                  {getFieldDecorator('intentionPrice', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.intentionPrice)
                        ? getPrice(cpBusinessIntentionGet.intentionPrice)
                        : '', 
                    rules: [
                      {
                        required: true, 
                        message: '请输入意向单价',
                        
                      },
                    ],
                  })(
                    <InputNumber
                      disabled={orderflag}
                      style={{ width: '100%' }}
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                      precision={2}
                      max={100000000}
                      min={0}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="交货时间">
                  {getFieldDecorator('deliveryDate', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.deliveryDate)
                        ? Moment(cpBusinessIntentionGet.deliveryDate)
                        : null,
                    rules: [
                      {
                        required: true, 
                        message: '请选择交货时间',
                      },
                    ],
                  })(
                    <DatePicker
                      
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      disabled={orderflag}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="付款方式">
                  {getFieldDecorator('paymentMethod', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.paymentMethod)
                        ? cpBusinessIntentionGet.paymentMethod
                        : '', 
                    rules: [
                      {
                        required: true,
                        message: '请选择付款方式',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {isNotBlank(this.state.payment_methodd) &&
                        this.state.payment_methodd.length > 0 &&
                        this.state.payment_methodd.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="旧件需求">
                  {getFieldDecorator('oldNeed', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.oldNeed)
                        ? cpBusinessIntentionGet.oldNeed
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择旧件需求',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.old_need) &&
                        this.state.old_need.length > 0 &&
                        this.state.old_need.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="开票需求">
                  {getFieldDecorator('makeNeed', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.makeNeed)
                        ? cpBusinessIntentionGet.makeNeed
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入开票需求',
                        
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.make_need) &&
                        this.state.make_need.length > 0 &&
                        this.state.make_need.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="质保项时间">
                  {getFieldDecorator('qualityTime', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.qualityTime)
                        ? cpBusinessIntentionGet.qualityTime
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入质保项时间',
                        
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="质量要求">
                  {getFieldDecorator('qualityNeed', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.qualityNeed)
                        ? cpBusinessIntentionGet.qualityNeed
                        : '', 
                    rules: [
                      {
                        required: true,
                        message: '请选择质量要求',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.quality_need) &&
                        this.state.quality_need.length > 0 &&
                        this.state.quality_need.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="油品要求">
                  {getFieldDecorator('oilsNeed', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.oilsNeed)
                        ? cpBusinessIntentionGet.oilsNeed
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择油品要求',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.oils_need) &&
                        this.state.oils_need.length > 0 &&
                        this.state.oils_need.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="外观要求">
                  {getFieldDecorator('guiseNeed', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.guiseNeed)
                        ? cpBusinessIntentionGet.guiseNeed
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择外观要求',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.guise_need) &&
                        this.state.guise_need.length > 0 &&
                        this.state.guise_need.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="安装指导">
                  {getFieldDecorator('installationGuide', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.installationGuide)
                        ? cpBusinessIntentionGet.installationGuide
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择安装指导',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.installation_guide) &&
                        this.state.installation_guide.length > 0 &&
                        this.state.installation_guide.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="物流要求">
                  {getFieldDecorator('logisticsNeed', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.logisticsNeed)
                        ? cpBusinessIntentionGet.logisticsNeed
                        : '', 
                    rules: [
                      {
                        required: true, 
                        message: '请输入物流要求',
                        
                      },
                    ],
                  })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label="其他约定事项"
                  className="allinputstyle"
                  className="allinputstyle"
                >
                  {getFieldDecorator('otherBuiness', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.otherBuiness)
                        ? cpBusinessIntentionGet.otherBuiness
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入其他约定事项',
                        
                      },
                    ],
                  })(<TextArea  disabled={orderflag} />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="其他信息" bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="维修项目">
                  {getFieldDecorator('maintenanceProject', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.maintenanceProject)
                        ? cpBusinessIntentionGet.maintenanceProject
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择维修项目',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.maintenance_project) &&
                        this.state.maintenance_project.length > 0 &&
                        this.state.maintenance_project.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="行程里程">
                  {getFieldDecorator('tripMileage', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.tripMileage)
                        ? cpBusinessIntentionGet.tripMileage
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入行程里程',
                      },
                    ],
                  })(<InputNumber disabled={orderflag} precision={2} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="车牌号">
                  {getFieldDecorator('plateNumber', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.plateNumber)
                        ? cpBusinessIntentionGet.plateNumber
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入车牌号',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="是否拍照">
                  {getFieldDecorator('isPhotograph', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.isPhotograph)
                        ? cpBusinessIntentionGet.isPhotograph
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择是否拍照',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }} disabled={orderflag}>
                      {isNotBlank(this.state.is_photograph) &&
                        this.state.is_photograph.length > 0 &&
                        this.state.is_photograph.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="定损员">
                  {getFieldDecorator('partFee', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.partFee)
                        ? cpBusinessIntentionGet.partFee
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入定损员',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="事故单号">
                  {getFieldDecorator('accidentNumber', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.accidentNumber)
                        ? cpBusinessIntentionGet.accidentNumber
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入事故单号',
                        
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="发货地址" className="allinputstyle">
                  {getFieldDecorator('shipAddress', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.shipAddress)
                        ? cpBusinessIntentionGet.shipAddress
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入发货地址',
                        
                      },
                    ],
                  })(<TextArea disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="维修历史" className="allinputstyle">
                  {getFieldDecorator('maintenanceHistory', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.maintenanceHistory)
                        ? cpBusinessIntentionGet.maintenanceHistory
                        : '', 
                    rules: [
                      {
                        required: true, 
                        message: '请输入维修历史',
                        
                      },
                    ],
                  })(<TextArea disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="事故说明" className="allinputstyle">
                  {getFieldDecorator('accidentExplain', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.accidentExplain)
                        ? cpBusinessIntentionGet.accidentExplain
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入事故说明',
                        
                      },
                    ],
                  })(<TextArea  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                  {getFieldDecorator('remarks', {
                    initialValue:
                      isNotBlank(cpBusinessIntentionGet) &&
                      isNotBlank(cpBusinessIntentionGet.remarks)
                        ? cpBusinessIntentionGet.remarks
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请输入备注信息',
                      },
                    ],
                  })(<TextArea style={{ minHeight: 32 }} rows={2} disabled={orderflag} />)}
                </FormItem>
              </Col>
            </Row>
          </Card>

          <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
            <Button className="printBtn" type="primary" onClick={this.showPrint}>
              打印
            </Button>
            
          </FormItem>
        </Form>
        <CreateForm {...parentMethods} selectflag={selectflag} />
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateFormjc {...parentMethodsjc} selectjcflag={selectjcflag} />
        <CreateFormcode {...parentMethodscode} selectcodeflag={selectcodeflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default CpBusinessIntentionForm;

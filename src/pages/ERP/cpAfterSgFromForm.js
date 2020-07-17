import React, { PureComponent } from 'react';
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
  DatePicker,
  Col, Row
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation ,getPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './CpAfterSgFromForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpAfterSgFrom, loading }) => ({
  ...cpAfterSgFrom,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpAfterSgFrom/cpAfterSgFrom_Add'],
  submitting2: loading.effects['cpupdata/cpAfterSgFrom_update'],
}))
@Form.create()
class CpAfterSgFromForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      orderflag: false,
      updataflag: true,
      confirmflag: true,
      haomiao: '',
      updataname: '取消锁定',
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAfterSgFrom/cpAfterSgFrom_Get',
        payload: {
          id: location.query.id,
        },
        callback: (res) => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1') {
            this.setState({ orderflag: true })
          } else {
            this.setState({ orderflag: false })
          }
          dispatch({
            type: 'sysarea/getFlatCode',
            payload: {
              id: location.query.id,
              type: 'SHSG'
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
              type: 'SHSG'
            },
            callback: (imgres) => {
              this.setState({
                srcimg1: imgres
              })
            }
          })

          // if(isNotBlank(res.data.qualityTime)&&isNotBlank(res.data.permitDate)){
          // 	const monnumber = res.data.qualityTime.split(',')[0]*12+res.data.qualityTime.split(',')[1]
          // 	const haom =  Number(new Date(res.data.permitDate).getTime()+2592000*monnumber)



          // 	alert(moment(new Date(haom)))
          // 	this.setState({
          // 		haomiao: moment(new Date(haom))
          // 	})
          // }


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
              addfileList: res.data.img1.split('|'),
              fileList: photoUrl
            })
          }
        }
      });
      // dispatch({
      //   type: 'cpPurchaseDetail/getOutBoundDetail_Line',
      //   payload: {
      //     id: location.query.id
      //   }
      // })

    }
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'interiorType',
      },
      callback: data => {
        this.setState({
          interiorType: data
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
      type: 'cpAfterSgFrom/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, updataflag } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.img1 = addfileList.join('|')
        } else {
          value.img1 = '';
        }
        if (isNotBlank(value.oldTime)) {
          value.oldTime = moment(value.oldTime).format('YYYY-MM-DD')
        }
        if (isNotBlank(value.planEndDate)) {
          value.planEndDate = moment(value.planEndDate).format('YYYY-MM-DD')
        }
        if (isNotBlank(value.planStartDate)) {
          value.planStartDate = moment(value.planStartDate).format('YYYY-MM-DD')
        }
        value.orderStatus = 1
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        if (updataflag) {
          dispatch({
            type: 'cpAfterSgFrom/cpAfterSgFrom_Add',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/accessories/process/cp_after_sg_from_form?id=${location.query.id}`);
              // router.push('/accessories/process/cp_after_sg_from_list');
            }
          })
        } else {
          dispatch({
            type: 'cpupdata/cpAfterSgFrom_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              router.push(`/accessories/process/cp_after_sg_from_form?id=${location.query.id}`);
              // router.push('/accessories/process/cp_after_sg_from_list');
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
      router.push(`/accessories/process/cp_after_sg_from_form?id=${location.query.id}`);
    }
  }

  onsave = () => {
    const { dispatch, form } = this.props;
    const { addfileList, location, updataflag } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
          value.img1 = addfileList.join('|')
        } else {
          value.img1 = '';
        }
        if (isNotBlank(value.oldTime)) {
          value.oldTime = moment(value.oldTime).format('YYYY-MM-DD')
        }
        if (isNotBlank(value.planEndDate)) {
          value.planEndDate = moment(value.planEndDate).format('YYYY-MM-DD')
        }
        if (isNotBlank(value.planStartDate)) {
          value.planStartDate = moment(value.planStartDate).format('YYYY-MM-DD')
        }
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        if (updataflag) {
          value.orderStatus = 0
          dispatch({
            type: 'cpAfterSgFrom/cpAfterSgFrom_Add',
            payload: { ...value },
            callback: () => {
            }
          })
        } else {
          value.orderStatus = 1
          dispatch({
            type: 'cpupdata/cpAfterSgFrom_update',
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

  onCancelCancel = () => {
    router.push('/accessories/process/cp_after_sg_from_list');
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
    const { dispatch } = this.props
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

  onUndo = (record) => {
    Modal.confirm({
      title: '撤销该售后施工单',
      content: '确定撤销该售后施工单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(record),
    });
  }

  undoClick = (id) => {
    const { dispatch } = this.props
    const { confirmflag, location } = this.state
    const that = this
    setTimeout(function () {
      that.setState({
        confirmflag: true
      })
    }, 1000)

    if (confirmflag) {
      this.setState({
        confirmflag: false
      })

      dispatch({
        type: 'cpRevocation/cpAfterSgFrom_revocation',
        payload: {
          id
        },
        callback: () => {
          router.push(`/accessories/process/cp_after_sg_from_form?id=${location.query.id}`);
          // router.push('/accessories/process/cp_after_sg_from_list');
        }
      })
    }
  }

  render() {
    const { fileList, previewVisible, previewImage, orderflag, updataflag, updataname, srcimg, srcimg1, haomiao } = this.state;
    const { submitting1, submitting2, submitting, cpAfterSgFromGet ,getOutBoundDetailLine} = this.props;
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
        width: 240,          
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
        title: '需求数量',        
        dataIndex: 'number',   
        inputType: 'text',   
        width: 150,          
        editable: true,    
        render:(text,res)=>{
				  if(isNotBlank(res.id)){
					  return text
				  }
				  return `总数量:${text}`
			  }  
      },
      {
        title: '库存数量',        
        dataIndex: 'repertoryNumber',   
        inputType: 'text',   
        width: 100,          
        editable: false,      
      },
      {
        title: '库存单价',
        dataIndex: 'repertoryPrice',
        inputType: 'text',
        width: 150,
        editable: false,
        render:(text,res)=>{
          if(isNotBlank(res.id)){
            return getPrice(text)
          }
          return `总金额:${getPrice(text)}`
        }
      },
      {
			  title: '创建时间',
			  dataIndex: 'createDate',
			  editable: false,
			  inputType: 'dateTime',
			  width: 150,
			  sorter: true,
			  render: val =>{
				  if(isNotBlank(val)){
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
				if(isNotBlank(val)){
					return moment(val).format('YYYY-MM-DD HH:mm:ss')
					 }
					 return ''
			  }
			},
      {
        title: '备注信息',        
        dataIndex: 'cpBillMaterial.remarks',   
        inputType: 'text',   
        width: 100,          
        editable: false,      
      },
    ]


    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            售后施工单
      </div>
          {isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.id) && <div style={{ position: 'absolute', right: '24%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              单号
        </span><img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          {isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.orderCode) && <div style={{ position: 'absolute', right: '8%', top: '25px', zIndex: '1' }}>
            <span style={{ width: '20px', fontSize: '12px', display: 'inline-block', position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}>
              编号
        </span><img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} style={{ width: '80px', height: '80px', display: 'inline-block' }} alt="" />
          </div>}
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='订单状态'>
                    {getFieldDecorator('orderStatus', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.orderStatus) ? ((cpAfterSgFromGet.orderStatus === 0 || cpAfterSgFromGet.orderStatus === '0') ? '未处理' : '已处理') : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入订单状态',
                        },
                      ],
                    })(<Input disabled style={cpAfterSgFromGet.orderStatus === 1 || cpAfterSgFromGet.orderStatus === '1' ? { color: '#87d068' } : { color: '#f50' }} />)}
                  </FormItem>
                </Col>
                {/* <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='售后单号'>
                {getFieldDecorator('entrustCode', {
											initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.entrustCode) ? cpAfterSgFromGet.entrustCode : '',     
											rules: [
												{
													required: true,   
													message: '请输入售后单号',
												},
											],
										})(<Input  disabled />)}
              </FormItem>
            </Col> */}
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后单号'>
                    {getFieldDecorator('orderCode', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.orderCode) ? cpAfterSgFromGet.orderCode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label='历史单号' className="allinputstyle">
                    {getFieldDecorator('historyCode', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.historyCode) ? cpAfterSgFromGet.historyCode : '',
                      rules: [
                        {
                          required: false,
                          message: '售后单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后申请单号'>
                    {getFieldDecorator('applyCode', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.applyCode) ? cpAfterSgFromGet.applyCode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后申请单号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后次数'>
                    {getFieldDecorator('entrustNumber', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.entrustNumber) ? cpAfterSgFromGet.entrustNumber : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后次数',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="质保终止日期">
                    {getFieldDecorator('endDate', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.endDate) ? cpAfterSgFromGet.endDate : null,
                    })(
                      <Input disabled />

                      //   <DatePicker
                      //     
                      //     format="YYYY-MM-DD"
                      //     style={{ width: '100%' }}
                      //     disabled
                      //   />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后类型'>
                    {getFieldDecorator('entrustType', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.entrustType) ? cpAfterSgFromGet.entrustType : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入售后类型',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        disabled={orderflag}
                        allowClear
                      >
                        {
                          isNotBlank(this.state.interiorType) && this.state.interiorType.length > 0 && this.state.interiorType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='本次故障描述'>
                    {getFieldDecorator('z', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.z) ? cpAfterSgFromGet.z : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入本次故障描述',
                          max: 5000,
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后地址'>
                    {getFieldDecorator('afterAddress', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.afterAddress) ? cpAfterSgFromGet.afterAddress : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后地址',
                          max: 500,
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    {getFieldDecorator('linkman', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.linkman) ? cpAfterSgFromGet.linkman : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入联系人',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='电话'>
                    {getFieldDecorator('phone', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.phone) ? cpAfterSgFromGet.phone : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入电话',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label="计划开始日期">
                    {getFieldDecorator('planStartDate', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.planStartDate) ? moment(cpAfterSgFromGet.planStartDate) : null,
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
                  <FormItem {...formItemLayout} label="计划结束日期">
                    {getFieldDecorator('planEndDate', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.planEndDate) ? moment(cpAfterSgFromGet.planEndDate) : null,
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
                  <FormItem {...formItemLayout} label='计划人数'>
                    {getFieldDecorator('planNumber', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.planNumber) ? cpAfterSgFromGet.planNumber : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入计划人数',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='处理方式'>
                    {getFieldDecorator('processMode', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.processMode) ? cpAfterSgFromGet.processMode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入处理方式',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后人员'>
                    <Input disabled value={isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.afterUser) && isNotBlank(cpAfterSgFromGet.afterUser.name) ? cpAfterSgFromGet.afterUser.name : ''} />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='售后安排'>
                    {getFieldDecorator('afterArrangement', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.afterArrangement) ? cpAfterSgFromGet.afterArrangement : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入售后安排',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='维修方案'>
                    {getFieldDecorator('maintenancePlan', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.maintenancePlan) ? cpAfterSgFromGet.maintenancePlan : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入维修方案',
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='旧件返回日期'>
                    {getFieldDecorator('oldTime', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.oldTime) ? moment(cpAfterSgFromGet.oldTime) : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入旧件返回日期',
                        },
                      ],
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
                  <FormItem {...formItemLayout} label='现场描述'>
                    {getFieldDecorator('sceneDescription', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.sceneDescription) ? cpAfterSgFromGet.sceneDescription : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入现场描述',
                          max: 500,
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车牌号'>
                    <Input disabled value={isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.plateNumber) ? cpAfterSgFromGet.plateNumber : ''} />
                  </FormItem></Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="照片上传" className="allimgstyle">
                    <Upload
                      disabled={orderflag && updataflag}
                      accept="image/*"
                      onChange={this.handleUploadChange}
                      onRemove={this.handleRemove}
                      beforeUpload={this.handlebeforeUpload}
                      fileList={fileList}
                      listType="picture-card"
                      onPreview={this.handlePreview}
                    >
                      {(isNotBlank(fileList) && fileList.length >= 4) || (orderflag && updataflag) ? null : uploadButton}
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="更换内容" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='更换配件'>
                    {getFieldDecorator('changePj', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.changePj) ? cpAfterSgFromGet.changePj : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入更换配件',
                        },
                      ],
                    })(
                      <Select
                        disabled={orderflag && updataflag}
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option key='0' value='否'>否</Option>
                        <Option key='1' value='是'>是</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='更换总成'>
                    {getFieldDecorator('changeZc', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.changeZc) ? cpAfterSgFromGet.changeZc : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入更换总成',
                        },
                      ],
                    })(
                      <Select
                        disabled={orderflag && updataflag}
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option key='0' value='否'>否</Option>
                        <Option key='1' value='是'>是</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='报件内容'>
                    {getFieldDecorator('quoteDescription', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.quoteDescription) ? cpAfterSgFromGet.quoteDescription : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入报件内容',
                          max: 500,
                        },
                      ],
                    })(<Input disabled={orderflag && updataflag} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="业务员信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='业务员'>
                    <Input
                      style={{ width: '100%' }}
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.user) ? cpAfterSgFromGet.user.name : getStorage('username'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='编号'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.user) ? cpAfterSgFromGet.user.no : getStorage('userno'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系方式'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.user) ? cpAfterSgFromGet.user.phone : getStorage('phone'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属大区'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.user) && isNotBlank(cpAfterSgFromGet.user.area) ? cpAfterSgFromGet.user.area.name : getStorage('companyname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属公司'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.user) && isNotBlank(cpAfterSgFromGet.user.office) ? cpAfterSgFromGet.user.office.name : getStorage('companyname'))}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属区域'>
                    <Input
                      disabled
                      value={isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.user) && isNotBlank(cpAfterSgFromGet.user.areaName) ? cpAfterSgFromGet.user.areaName : getStorage('areaname')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='所属部门'>
                    <Input
                      disabled
                      value={isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.user) && isNotBlank(cpAfterSgFromGet.user.dept) ? cpAfterSgFromGet.user.dept.name : getStorage('deptname')}
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
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.client) ? cpAfterSgFromGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户分类'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.client) && isNotBlank(cpAfterSgFromGet.client.classify) ? cpAfterSgFromGet.client.classify : '')}
                    >
                      {
                        isNotBlank(this.state.classify) && this.state.classify.length > 0 && this.state.classify.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='客户编号'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.client) ? cpAfterSgFromGet.client.code : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系人'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.client) ? cpAfterSgFromGet.client.name : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='联系地址'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.client) ? cpAfterSgFromGet.client.address : '')}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='移动电话'>
                    <Input
                      disabled
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.client) ? cpAfterSgFromGet.client.phone : '')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="总成信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成型号'>
                    <Input
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assmblyBuildId) && isNotBlank(cpAfterSgFromGet.assmblyBuildId.assemblyModel) ? cpAfterSgFromGet.assmblyBuildId.assemblyModel : '')}

                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成号'>
                    <Input
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assmblyBuildId) && isNotBlank(cpAfterSgFromGet.assmblyBuildId.assemblyCode) ? cpAfterSgFromGet.assmblyBuildId.assemblyCode : '')}

                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='总成品牌'>
                    <Input
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assmblyBuildId) && isNotBlank(cpAfterSgFromGet.assmblyBuildId.assemblyBrand) ? cpAfterSgFromGet.assmblyBuildId.assemblyBrand : '')}

                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='车型/排量'>
                    <Input
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assmblyBuildId) && isNotBlank(cpAfterSgFromGet.assmblyBuildId.vehicleModel) ? cpAfterSgFromGet.assmblyBuildId.vehicleModel : '')}

                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='年份'>
                    <Input
                      value={(isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assmblyBuildId) && isNotBlank(cpAfterSgFromGet.assmblyBuildId.assemblyYear) ? cpAfterSgFromGet.assmblyBuildId.assemblyYear : '')}

                      disabled
                    />
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='进场类型'>
                    {getFieldDecorator('assemblyEnterType', {
                      initialValue: (isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.maintenanceProject) ? cpAfterSgFromGet.maintenanceProject : ''),
                      rules: [
                        {
                          required: false,
                          message: '请输入进场类型',
                        },
                      ],
                    })(<Select
                      allowClear
                      disabled
                      style={{ width: '100%' }}
                    >
                      {
                        isNotBlank(this.state.approachType) && this.state.approachType.length > 0 && this.state.approachType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                      }
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='钢印号'>
                    {getFieldDecorator('assemblySteelSeal', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assemblySteelSeal) ? cpAfterSgFromGet.assemblySteelSeal : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入钢印号',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='VIN码'>
                    {getFieldDecorator('assemblyVin', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assemblyVin) ? cpAfterSgFromGet.assemblyVin : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入VIN码',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='其他识别信息'>
                    {getFieldDecorator('assemblyMessage', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assemblyMessage) ? cpAfterSgFromGet.assemblyMessage : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入其他识别信息',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <FormItem {...formItemLayout} label='故障代码'>
                    {getFieldDecorator('assemblyFaultCode', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.assemblyFaultCode) ? cpAfterSgFromGet.assemblyFaultCode : '',
                      rules: [
                        {
                          required: false,
                          message: '请输入故障代码',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col lg={24} md={24} sm={24}>
                  <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                    {getFieldDecorator('remarks', {
                      initialValue: isNotBlank(cpAfterSgFromGet) && isNotBlank(cpAfterSgFromGet.remarks) ? cpAfterSgFromGet.remarks : '',
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
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterSgFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterSgFrom')[0].children.filter(item => item.name == '二次修改')
                  .length > 0 &&
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!orderflag}>
                  {updataname}
                </Button>
              }
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterSgFrom').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'cpAfterSgFrom')[0].children.filter(item => item.name == '修改')
                  .length > 0 && <span>
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.onsave} loading={submitting2 || submitting1} disabled={orderflag && updataflag}>
                    保存
  </Button>
                  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting2 || submitting1} disabled={orderflag && updataflag}>
                    提交
  </Button>
                  {orderflag &&
                    <Button style={{ marginLeft: 8 }} loading={submitting1 || submitting2} onClick={() => this.onUndo(cpAfterSgFromGet.id)}>
                      撤销
  </Button>
                  }
                </span>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
          </Button>
            </FormItem>
          </Form>
{/* 
          <div className={styles.standardList}>
            <Card bordered={false}>
              <StandardTable
                scroll={{ x: 1400 }}
                data={getOutBoundDetailLine}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChange}
              />
            </Card>
          </div> */}
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpAfterSgFromForm;
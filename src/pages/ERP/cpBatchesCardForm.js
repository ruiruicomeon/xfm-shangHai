import React, { PureComponent ,Fragment} from 'react';
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
  Row,
  Col,
  DatePicker,
  Modal,
  TreeSelect,
  Popconfirm
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getStorage } from '@/utils/localStorageUtils';
import { parse, stringify } from 'qs';
import styles from './CpBatchesCardForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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
          cpBatchesCardGet
        } = props;
        const Stoken = { token: getStorage('token') };
        const propsUpload = {
          name: 'list',
          accept: '.xls,.xlsx,.xlsm',
          fileList: fileL,
          headers: Stoken,
          action: '/api/Beauty/beauty/cpBatchesCard/import',
          data:cpBatchesCardGet,
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
            if (isimg && isLt10M) {
              handleFileList(fileList);
            }
          },
        };
        return (
          <Modal
            title="导入质保清单"
            visible={modalImportVisible}
            destroyOnClose
            footer={null}
            onCancel={() => handleImportVisible()}
          >
            <Row>
              <Col span={6} offset={4}>
                <Upload {...propsUpload}>
                  <Button>
                    <Icon type="upload" /> 上传导入质保清单
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Modal>
        );
      });

const CreateFormForm = Form.create()(props => {
  const { FormVisible, form, handleFormAdd, handleFormVisible, modalRecord, form: { getFieldDecorator }, changecode,
    cpBillMaterialList, selectuser, handleSelectRows, selectedRows, showTable, showcpwenz,cpBatchesCardGet,
    showcpzim,cphdata,cpzim, selwenz, selzim, selinputcp , editdata ,editYear ,incpzim ,uploadButton
    ,editMonth , selectyear , selectmonth ,monthdata,yeardata ,showinputcp ,handleUploadChange,handleRemove,handlebeforeUpload,handlePreview ,fileList} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      form.resetFields();
      const values = { ...fieldsValue };
      values.qualityTime = `${selectyear},${selectmonth}`
      values.plateNumber =  (isNotBlank(selwenz)?selwenz:'')+(isNotBlank(selzim)?selzim:'')+(isNotBlank(selinputcp)?selinputcp:'')
      values.money = setPrice(values.money)
      values.startDate = moment(values.startDate).format("YYYY-MM-DD")
      // values.startDate = moment(values.startDate)
      handleFormAdd(values);
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

  const modelsearch = (e) => {
    changecode(e.target.value)
  }

  const handleFormVisiblehide = () => {
    form.resetFields();
    handleFormVisible()
  }

  return (
    <Modal
      title="新增明细"
      visible={FormVisible}
      onOk={okHandle}
      width='80%'
      onCancel={() => handleFormVisiblehide()}
    >
      
      <Row gutter={12}>
        {/* <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label=''>
            {getFieldDecorator('number', {
              initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.number) ? getPrice(modalRecord.number) :
              (isNotBlank(editdata) && isNotBlank(editdata.number) ? editdata.number : 1),     
              rules: [
                {
                  required: false,   
                  message: '请输入数量'
                },
              ],
            })(<InputNumber
              style={{ width: '100%' }}
              
              precision={0}
              min={1}
              
            />)}
          </FormItem>
        </Col> */}
        
        <Col lg={24} md={24} sm={24}>
    <FormItem {...formItemLayout} label='车牌号' className="allinputstyle">
      {getFieldDecorator('cphao', {
													initialValue: '',     
													rules: [
														{
															required: false,   
															message: '请输入车牌号',
														},
													],
												})
													(
  <span>
    <Select
      allowClear
      onChange={showcpwenz}
      style={{ width: '30%' }}
      value={selwenz}
    >
      {
																	isNotBlank(cphdata) && cphdata.length > 0 && cphdata.map(d => <Option key={d.id} value={d.name}>{d.name}</Option>)
																}
    </Select>
    <Select
      allowClear
      onChange={showcpzim}
      style={{ width: '30%' }}
      value={selzim}
    >
      {
																	isNotBlank(incpzim) && incpzim.length > 0 && incpzim.map(d => <Option key={d.name} value={d.name}>{d.name}</Option>)
																}
    </Select>
    <Input
      placeholder='请输入5位车牌号'
      onChange={showinputcp}
      style={{ width: '40%' }}
      value={selinputcp}
    />
  </span>
													)}
    </FormItem>
  </Col>
  <Col lg={12} md={12} sm={24}>
    <FormItem {...formItemLayout} label='质保单号'>
        <Input disabled value={isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.id) ? cpBatchesCardGet.id: ''} style={{ width: '100%' }} />
    </FormItem>
  </Col>
  <Col lg={12} md={12} sm={24}>
    <FormItem {...formItemLayout} label='行程里程'>
      {getFieldDecorator('tripMileage', {
													initialValue:isNotBlank(editdata) && isNotBlank(editdata.tripMileage) ? editdata.tripMileage: '',     
													rules: [
														{
															required: false,   
															message: '请输入行程里程',
														},
													],
												})(<Input  style={{ width: '100%' }} />)}
    </FormItem>
  </Col>
  <Col lg={12} md={12} sm={24}>
    <FormItem {...formItemLayout} label='VIN'>
    {getFieldDecorator('vin', {
												initialValue: isNotBlank(editdata) && isNotBlank(editdata.assemblyVin) ? editdata.assemblyVin : '',     
												rules: [
													{
														required: false,   
														message: '请输入17位的VIN码',
														max: 17,
														min: 17
													},
												],
											})(<Input placeholder='请输入17位VIN码' />)}
    </FormItem>
  </Col>
  <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='质保时间'>
                {getFieldDecorator('zbtime', {
											rules: [
												{
													// required: !!((selthis == 1 && selthis1 == 1) || (selthis == 2 && selthis1 == 1) || (isNotBlank(selthis) && selthis != 1 && selthis != 2 && selthis1 == 1)
													// 	|| (isNotBlank(selthis) && selthis1 == 2) || (isNotBlank(selthis1) && (selthis1 != 2 || selthis1 != 1))),   
													required:false,
													message: '请选择质保时间',
												},
											],
										})(
  <div>
    <Select
      allowClear
      style={{ width: '50%' }}
      value={`${selectyear} 年`}
      onChange={editYear}
    >
      {
														isNotBlank(yeardata) && yeardata.length > 0 && yeardata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
													}
    </Select>
    <Select
      allowClear
      style={{ width: '50%' }}
      value={`${selectmonth} 月`}
      onChange={editMonth}
    >
      {
														isNotBlank(monthdata) && monthdata.length > 0 && monthdata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
													}
    </Select>
  </div>
										)
										}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="质保开始时间">
                {getFieldDecorator('startDate', {
											initialValue: isNotBlank(editdata) && isNotBlank(editdata.startDate) ? moment(editdata.startDate) : null,
											rules: [
												{
													required: false,   
													message: '请选择质保开始时间',
												},
											],
										})(
  <DatePicker
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
										)
										}
              </FormItem>
            </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem {...formItemLayout} label='金额'>
            {getFieldDecorator('money', {
              initialValue: (isNotBlank(editdata) && isNotBlank(editdata.money) ? getPrice(editdata.money) : 0),     
              rules: [
                {
                  required: false,   
                  message: '金额',
                },
              ],
            })(<InputNumber style={{ width: '100%' }}  />)}
          </FormItem>
        </Col>
					<Col lg={24} md={24} sm={24}>
						<FormItem {...formItemLayout} label="照片上传" className="allimgstyle">
							<Upload
							accept="image/*"
							onChange={handleUploadChange}
							onRemove={handleRemove}
							beforeUpload={handlebeforeUpload}
							fileList={fileList}
							listType="picture-card"
							onPreview={handlePreview}
							>
							{(isNotBlank(fileList) && fileList.length >= 9)  ? null : uploadButton}
							</Upload>
						</FormItem>
						</Col>
        <Col lg={24} md={24} sm={24}>
          <FormItem {...formItemLayout} label='备注信息' className="allinputstyle">
            {getFieldDecorator('remarks', {
              initialValue: (isNotBlank(editdata) && isNotBlank(editdata.remarks) ? editdata.remarks :''),     
              rules: [
                {
                  required: false,   
                  message: '备注信息',
                  
                },
              ],
            })(<Input  />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
})

@connect(({ cpBatchesCard, loading }) => ({
  ...cpBatchesCard,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpBatchesCardForm extends PureComponent {
 constructor(props) {
    super(props);
    this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    orderflag:false,
    confirmflag :true,
    location:getLocation(),
    cpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
			{ name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
			{ name: 'Y' }, { name: 'Z' }],
			incpzim: [],
			selinputcp: '',
			selwenz: '',
      selzim: '',
      selectyear: 0,
      selectmonth: 0,
      importFileList:[]
  }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const {location } =this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpBatchesCard/cpBatchesCard_Get',
        payload: {
          id: location.query.id,
        },
        callback:(res)=>{
          if (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='CBC').length>0
					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='CBC')[0].children.filter(item=>item.name=='修改')
					.length>0&&res.data.orderStatus === 0 || res.data.orderStatus === '0' ) {
						this.setState({ orderflag: false })
					} else {
						this.setState({ orderflag: true })
					}
          dispatch({
            type: 'cpBatchesCard/get_CpBatchesCardDetailList',
            payload: {
              parent: location.query.id,
              pageSize:30
            }
          })
        }
      });
    }

     	dispatch({
		  type: 'dict/dict',
		  payload: {
			type: 'del_flag',
		  },
		  callback: data => {
			this.setState({
			  del_flag : data
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


  // 关闭页面清除数据
  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpBatchesCard/clear',
    });
  }

  handleSubmit = () => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location } = this.state;
    // e.preventDefault();
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

		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }

        value.orderStatus = 1

        dispatch({
          type:'cpBatchesCard/cpBatchesCard_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/accessories/process/cp_batches_card_form?id=${location.query.id}`);
            // router.goBack();
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch,  form } = this.props;
    const { addfileList ,location } = this.state;
    // e.preventDefault();
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

		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }

        value.orderStatus = 0

        dispatch({
          type:'cpBatchesCard/cpBatchesCard_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            // router.goBack();
          }
        })
      }
    });
  };

  handleFormAdd = (values) => {
    const { dispatch ,cpBatchesCardGet } = this.props
    const { location, modalRecord  ,editdata ,addfileList} = this.state
    const vals = { ...values }

    if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
      vals.image = addfileList.join('|')
    } else {
      vals.image = '';
    }

    if (isNotBlank(editdata) && isNotBlank(editdata.id)) {
      vals.id = editdata.id
    }
    dispatch({
      type: 'cpBatchesCard/post_CpBatchesCardDetail',
      payload: {
        orderStatus:0,
        orderCode:isNotBlank(cpBatchesCardGet)&&isNotBlank(cpBatchesCardGet.orderCode)?cpBatchesCardGet.orderCode:'',
        parent: isNotBlank(location.query.id)?location.query.id:'',
        // ids:  isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? modalRecord.id : (isNotBlank(editdata) && isNotBlank(editdata.cpBillMaterial) && isNotBlank(editdata.cpBillMaterial.id) ? editdata.cpBillMaterial.id : ''),
        ...vals,
      }
      ,
      callback: () => {
        this.setState({
          FormVisible: false,
          selinputcp: '',
			selwenz: '',
      selzim: '',
      selectyear: 0,
			selectmonth: 0,
          editdata:{},
          addfileList:[],
          fileList:[]
        })
        dispatch({
          type: 'cpBatchesCard/get_CpBatchesCardDetailList',
          payload: {
            parent: location.query.id,
            pageSize:30
          }
        })
      }
    })
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
					name: 'cpBatchesCardForm'
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


  // handlebeforeUpload = file => {
  //   const { addfileList } = this.state;
  //   const isimg = file.type.indexOf('image') >= 0;
  //   if (!isimg) {
  //     message.error('请选择图片文件!');
  //   }
  //   const isLt10M = file.size / 1024 / 1024 <= 10;
  //   if (!isLt10M) {
  //     message.error('文件大小需为10M以内');
  //   }
  //   if (isimg && isLt10M) {
  //     if (!isNotBlank(addfileList) || addfileList.length <= 0) {
  //       this.setState({
  //         addfileList: [file],
  //       });
  //     } else {
  //       this.setState({
  //         addfileList: [...addfileList, file],
  //       });
  //     }
  //   }
  //   return isLt10M && isimg;
  // };

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


  showForm = () => {
    this.setState({
      FormVisible: true
    })
  }

  handleFormVisible =()=>{
    this.setState({
      FormVisible: false,
      editdata:{},
    fileList:[],
    addfileList:[],
    selwenz:'',
     selzim:'',
      selinputcp:'',
       selectyear:'',
        selectmonth:''
    })
  }

  showinputcp = (e) => {
		const { selwenz, selzim, selinputcp } = this.state
		if (isNotBlank(e.target.value)) {
			this.setState({
				selinputcp: e.target.value
			})
		} else {
			this.setState({
				selinputcp: ''
			})
		}
		if (isNotBlank(e.target.value) && isNotBlank(selwenz) && isNotBlank(selzim)) {
			this.props.form.setFieldsValue({
				cphao: '1'
			});
		} else {
			this.props.form.setFieldsValue({
				cphao: ''
			});
		}
	}

	showcpzim = (e) => {
		const { selwenz, selzim, selinputcp } = this.state
		console.log(e)
		if (isNotBlank(e)) {
			this.setState({
				selzim: e
			})
		} else {
			this.setState({
				selzim: ''
			})
		}
		if (isNotBlank(selinputcp) && isNotBlank(selwenz) && isNotBlank(e)) {
			this.props.form.setFieldsValue({
				cphao: '1'
			});
		} else {
			this.props.form.setFieldsValue({
				cphao: ''
			});
		}
	}

	showcpwenz = (e) => {
		const { cpzim, selwenz, selzim, selinputcp } = this.state
		console.log(e)
		if (isNotBlank(e)) {
			this.setState({
				selwenz: e
			})
			if (e == '京' ) {
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' },{ name: 'E' }, { name: 'F' }, { name: 'G' },
          { name: 'H' },{ name: 'J' }, { name: 'K' },{name: 'L' },{ name: 'M' },{ name: 'N' },{ name: 'O' },{ name: 'P' },{ name: 'Q' },{ name: 'R' }, { name: 'Y' }]
        })
			}
			else if (e == '藏' || e == '台') {
				this.setState({
					incpzim: cpzim.slice(0, 7)
				})
			} else if (e == '川' || e == '粤') {
				this.setState({
					incpzim: cpzim
				})
			} else if (e == '鄂' || e == '皖' || e == '云') {
				this.setState({
					incpzim: cpzim.slice(0, 17)
				})
			} else if (e == '甘' || e == '辽') {
				this.setState({
					incpzim: cpzim.slice(0, 14)
				})
			} else if (e == '贵' || e == '吉') {
				this.setState({
					incpzim: cpzim.slice(0, 9)
				})
			} else if (e == '黑'|| e == '桂'  || e == '新') {
				this.setState({
					incpzim: cpzim.slice(0, 16)
				})
			}
			else if (e == '冀') {
				this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
          { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'R' },{ name: 'T' }
        ]
				})
			} else if (e == '晋' || e == '蒙' || e == '赣') {
				this.setState({
					incpzim: cpzim.slice(0, 12)
				})
			} else if(e == '鲁'){
        this.setState({
          incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
          { name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'Y' }]
        })
      } else if (e == '陕') {
        this.setState({
          incpzim: cpzim.slice(0, 20)
        })
      }else if (e == '闽') {
				this.setState({
					incpzim: cpzim.slice(0, 10)
				})
			} else if (e == '宁' || e == '琼') {
				this.setState({
					incpzim: cpzim.slice(0, 5)
				})
			} else if (e == '青' || e == '渝') {
				this.setState({
					incpzim: cpzim.slice(0, 8)
				})
			} else if (e == '湘' || e == '豫') {
				this.setState({
					incpzim: cpzim.slice(0, 18)
				})
			}
			else if (e == '苏') {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
					{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'U' }
				]
				})
			} else if (e == '浙') {
				this.setState({
					incpzim: cpzim.slice(0, 11)
				})
			} else if (e == '港' || e == '澳') {
				this.setState({
					incpzim: cpzim.slice(0, 1)
				})
			} else if (e == '沪') {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
					{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'Q' },{ name: 'R' },{ name: 'Z' }
				]
				})
			} else if (e == '津') {
				this.setState({
					incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' },{name: 'I' } ,{ name: 'J' }, { name: 'K' }, { name: 'L' },
          { name: 'M' }, { name: 'N' }, {name: 'O'  }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
          { name: 'Y' }, { name: 'Z' }]
				})
			}
		} else {
			this.setState({
				incpzim: [],
				selwenz:''
			})
		}
		if (isNotBlank(selinputcp) && isNotBlank(e) && isNotBlank(selzim)) {
			this.props.form.setFieldsValue({
				cphao: '1'
			});
		} else {
			this.props.form.setFieldsValue({
				cphao: ''
			});
		}
	}

  editYear = (val) => {
		if (isNotBlank(val)) {
			this.props.form.setFieldsValue({
				zbtime: isNotBlank(val) ? val : '',
			});
			this.setState({ selectyear: val })
		} else {
			this.props.form.setFieldsValue({
				zbtime: '',
			});
			this.setState({ selectyear: 0 })
		}
	}

	editMonth = (val) => {
		if (isNotBlank(val)) {
			this.props.form.setFieldsValue({
				zbtime: isNotBlank(val) ? val : '',
			});
			this.setState({ selectmonth: val })
		} else {
			this.props.form.setFieldsValue({
				zbtime: '',
			});
			this.setState({ selectmonth: 0 })
		}
	}

  edithtis = (res) => {

    const {cpzim} = this.state

    if (isNotBlank(res) && isNotBlank(res.image)) {
      let photoUrl = res.image.split('|')
      photoUrl = photoUrl.map((item) => {
        return {
          id: getFullUrl(item),
          uid: getFullUrl(item),
          url: getFullUrl(item),
          name: getFullUrl(item)
        }
      })
      this.setState({
        addfileList: res.image.split('|'),
        fileList: photoUrl
      })
    }


    if (isNotBlank(res.qualityTime)) {
      // this.props.form.setFieldsValue({
      //   zbtime: res.qualityTime
      // });
      this.setState({
        selectyear: res.qualityTime.split(',')[0],
        selectmonth: res.qualityTime.split(',')[1]
      })
    }
    if (isNotBlank(res.plateNumber)) {
      const newselwenz = res.plateNumber.slice(0, 1)
      this.setState({
        selwenz: res.plateNumber.slice(0, 1),
        selzim: res.plateNumber.slice(1, 2),
        selinputcp: res.plateNumber.slice(2),
      })
      // if (isNotBlank(res.plateNumber.slice(0, 1)) && isNotBlank(res.data.plateNumber.slice(1, 2)) && isNotBlank(res.data.plateNumber.slice(2))) {
      //   this.props.form.setFieldsValue({
      //     cphao: '1'
      //   });
      // } else {
      //   this.props.form.setFieldsValue({
      //     cphao: ''
      //   });
      // }

      if (isNotBlank(newselwenz)) {
        if (newselwenz == '京' ) {
        	this.setState({
            incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' },{ name: 'E' }, { name: 'F' }, { name: 'G' },
            { name: 'H' },{ name: 'J' }, { name: 'K' },{name: 'L' },{ name: 'M' },{ name: 'N' },{ name: 'O' },{ name: 'P' },{ name: 'Q' },{ name: 'R' }, { name: 'Y' }]
          })
        }
        else if ( newselwenz == '藏' || newselwenz == '台') {
          this.setState({
            incpzim: cpzim.slice(0, 7)
          })
        } else if (newselwenz == '川' || newselwenz == '粤') {
          this.setState({
            incpzim: cpzim
          })
        } else if (newselwenz == '鄂' || newselwenz == '皖' || newselwenz == '云') {
          this.setState({
            incpzim: cpzim.slice(0, 17)
          })
        } else if (newselwenz == '甘' || newselwenz == '辽') {
          this.setState({
            incpzim: cpzim.slice(0, 14)
          })
        } else if (newselwenz == '贵' || newselwenz == '吉') {
          this.setState({
            incpzim: cpzim.slice(0, 9)
          })
        } else if (newselwenz == '黑' || newselwenz == '桂'  || newselwenz == '新') {
          this.setState({
            incpzim: cpzim.slice(0, 16)
          })
        }
        else if (newselwenz == '冀') {
          this.setState({
            incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
									{ name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'R' },{ name: 'T' }
								]
          })
        } else if (newselwenz == '晋' || newselwenz == '蒙' || newselwenz == '赣') {
          this.setState({
            incpzim: cpzim.slice(0, 12)
          })
        } else if(newselwenz == '鲁'){
          this.setState({
            incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' },
            { name: 'M' }, { name: 'N' }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'Y' }]
          })
        } else if (newselwenz == '陕') {
          this.setState({
            incpzim: cpzim.slice(0, 20)
          })
        } else if (newselwenz == '闽') {
          this.setState({
            incpzim: cpzim.slice(0, 10)
          })
        } else if (newselwenz == '宁' || newselwenz == '琼') {
          this.setState({
            incpzim: cpzim.slice(0, 5)
          })
        } else if (newselwenz == '青' || newselwenz == '渝') {
          this.setState({
            incpzim: cpzim.slice(0, 8)
          })
        } else if (newselwenz == '湘' || newselwenz == '豫') {
          this.setState({
            incpzim: cpzim.slice(0, 18)
          })
        }
        else if (newselwenz == '苏') {
          this.setState({
            incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
            { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'U' }
          ]
          })
        } else if (newselwenz == '浙') {
          this.setState({
            incpzim: cpzim.slice(0, 11)
          })
        } else if (newselwenz == '港' || newselwenz == '澳') {
          this.setState({
            incpzim: cpzim.slice(0, 1)
          })
        } else if (newselwenz == '沪') {
          this.setState({
            incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },{ name: 'F' },{ name: 'G' },
            { name: 'H' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' },{ name: 'N' },{ name: 'Q' },{ name: 'R' },{ name: 'Z' }
          ]
          })
        } else if (newselwenz == '津') {
          this.setState({
            incpzim: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' },{name: 'I' } ,{ name: 'J' }, { name: 'K' }, { name: 'L' },
            { name: 'M' }, { name: 'N' }, {name: 'O'  }, { name: 'P' }, { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' },
            { name: 'Y' }, { name: 'Z' }]
          })
        }
      } else {
        this.setState({
          incpzim: []
        })
      }
    }

    this.setState({
      editdata: res,
      FormVisible: true
    })
  }

  handleDeleteClick = (id) => {
    const { dispatch } = this.props
    const { location } = this.state
    dispatch({
      type: 'cpBatchesCard/delete_CpBatchesCardDetail',
      payload: {
        id
      },
      callback: (res) => {
        dispatch({
          type: 'cpBatchesCard/get_CpBatchesCardDetailList',
          payload: {
            parent: location.query.id,
            pageSize:30
          }
        })
      }
    });
  }


  onUndo = (record) => { 
    Modal.confirm({
      title: '撤销该质保清单',
      content: '确定撤销该质保清单吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.undoClick(record),
    });
  }

  undoClick = (id) => {
	const { dispatch } = this.props
	const {confirmflag,location}= this.state
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
    dispatch({
      type: 'cpBatchesCard/cpBatchesCard_Revocation',
      payload: {
        id
      },
      callback: () => {

        router.push(`/accessories/process/cp_batches_card_form?id=${location.query.id}`);
      }
	})
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
			parent: location.query.id,
			// intentionId: location.query.id,
		};
		dispatch({
			type: 'cpBatchesCard/get_CpBatchesCardDetailList',
      payload: params,
		});
	};

  handleUpldExportClick = type => {
    const params = { 
      'user.id':isNotBlank(getStorage('userid'))?getStorage('userid'):''
    }
    window.open(`/api/Beauty/beauty/cpBatchesCard/import?${stringify(params)}`);
    };

    handleImportVisible = flag => {
      this.setState({
        modalImportVisible: !!flag,
        importFileList: [],
      });
    };
  
    UploadFileVisible = flag => {
      const {dispatch} = this.props
      const {location} = this.state
      this.setState({
        modalImportVisible: !!flag,
        importFileList: [],
      });
      dispatch({
        type: 'cpBatchesCard/get_CpBatchesCardDetailList',
        payload:{
          parent: location.query.id,
          pageSize:30
        },
      });
    };
  
    handleFileList = fileData => {
      this.setState({
        importFileList: fileData,
      });
    };

    handleImportVisible = flag => {
      this.setState({
        modalImportVisible: !!flag,
        importFileList: [],
      });
    };

  render() {
    const { fileList, previewVisible, previewImage ,FormVisible ,editdata , cpzim, 
      incpzim, selwenz, selzim, selinputcp, selectyear,selectmonth ,orderflag ,modalImportVisible ,importFileList} = this.state;
    const { submitting, cpBatchesCardGet ,getCpBatchesCardDetailList} = this.props;
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

    const cphdata = [{ id: 1, name: '京' }, { id: 2, name: '津' }, { id: 3, name: '沪' }, { id: 4, name: '渝' }, { id: 5, name: '冀' },
		{ id: 6, name: '豫' }, { id: 7, name: '云' }, { id: 8, name: '辽' }, { id: 9, name: '黑' }, { id: 10, name: '湘' }, { id: 11, name: '皖' },
		{ id: 12, name: '鲁' }, { id: 13, name: '新' }, { id: 14, name: '苏' }, { id: 15, name: '浙' }, { id: 16, name: '赣' }, { id: 17, name: '鄂' }, { id: 18, name: '桂' },
		{ id: 19, name: '甘' }, { id: 20, name: '晋' }, { id: 21, name: '蒙' }, { id: 22, name: '陕' }, { id: 23, name: '吉' }, { id: 24, name: '闽' }, { id: 25, name: '贵' },
		{ id: 26, name: '粤' }, { id: 27, name: '青' }, { id: 28, name: '藏' }, { id: 29, name: '川' }, { id: 30, name: '宁' }, { id: 31, name: '琼' }, { id: 32, name: '港' },
		{ id: 33, name: '澳' }, { id: 33, name: '台' }]

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

      const columns = [
        {
          title: '操作',
          width: 100,
          render: (text, record) => {
              return !orderflag?
              <Fragment>
                <a onClick={() => this.edithtis(record)}>修改</a>
              </Fragment>
              :
              ''
           },
        },
        // {
        //   title: '单号',        
        //   dataIndex: 'id',
        //   align: 'center',  
        //   inputType: 'text',   
        //   width: 150,          
        //   editable: false,      
        // },
        {
          title: '订单编号',        
          dataIndex: 'orderCode',
          align: 'center',  
          inputType: 'text',   
          width: 200,          
          editable: false,      
        },
        {
          title: '车牌号',        
          dataIndex: 'plateNumber',
          align: 'center',  
          inputType: 'text',   
          width: 150,          
          editable: false,      
        },
        {
          title: '行程里程',        
          dataIndex: 'tripMileage',
          align: 'center',  
          inputType: 'text',   
          width: 150,          
          editable: false,      
        },
        {
          title: 'VIN',        
          dataIndex: 'vin',
          align: 'center',  
          inputType: 'text',   
          width: 150,          
          editable: false,      
        },
        {
          title: '质保时间',        
          dataIndex: 'qualityTime',
          align: 'center',  
          inputType: 'text',   
          width: 150,          
          editable: false,     
          render:(text)=>{
            if(isNotBlank(text)){
              return `${text.split(',')[0]}年${text.split(',')[1]}个月`
            }
            return ''
          } 
        },
        {
          title: '质保开始时间',        
          dataIndex: 'startDate',
          align: 'center',  
          inputType: 'text',   
          width: 150,          
          editable: false,      
        },
        {
          title: '图片',
          dataIndex: 'image',
          align: 'center' , 
          width: 200,
          render: (text) => {
            if (isNotBlank(text)) {
              const images = text.split('|').map((item) => {
                if (isNotBlank(item)) {
                  return <img
                    key={item}
                    onClick={() => this.handleImage(getFullUrl(item))}
                    style={{ height: 50, width: 50, marginRight: 10 }}
                    alt="example"
                    src={getFullUrl(item)}
                  />
                }
                return null;
              })
              return <div>{images}</div>
            }
            return '';
          },
        },
        {
          title: '备注',        
          dataIndex: 'remarks',
          align: 'center',  
          inputType: 'text',   
          width: 150,          
          editable: false,      
        },
        {
          title: '基础操作',
          width: 100,
          render: (text, record) => {
            return !orderflag?<Fragment>
                <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </Fragment>
              :''
            // }
            // return ''
          },
        }

    ]


    const yeardata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
		]
		const monthdata = [
			{
				key: 0,
				value: 0
			},
			{
				key: 1,
				value: 1
			},
			{
				key: 2,
				value: 2
			},
			{
				key: 3,
				value: 3
			},
			{
				key: 4,
				value: 4
			},
			{
				key: 5,
				value: 5
			},
			{
				key: 6,
				value: 6
			},
			{
				key: 7,
				value: 7
			},
			{
				key: 8,
				value: 8
			},
			{
				key: 9,
				value: 9
			},
			{
				key: 10,
				value: 10
			},
			{
				key: 11,
				value: 11
			},
			{
				key: 12,
				value: 12
			},
		]

      const that =this
    
      const parentImportMethods = {
        UploadFileVisible: this.UploadFileVisible,
        handleImportVisible: this.handleImportVisible,
        fileL: importFileList,
        handleFileList: this.handleFileList,
        cpBatchesCardGet

      };

    const parentMethodForms = {
      handleFormAdd: this.handleFormAdd,
      handleFormVisible: this.handleFormVisible,
      showcpwenz:this.showcpwenz,
      showcpzim :this.showcpzim,
      showcpzim:this.showcpzim,
      editYear:this.editYear,
      editMonth:this.editMonth,
      showinputcp:this.showinputcp,
      handlePreview:this.handlePreview,
      handlebeforeUpload:this.handlebeforeUpload,
      handleRemove:this.handleRemove,
      handleUploadChange:this.handleUploadChange,
      uploadButton,
      fileList,
      selectyear,
      selectmonth,
      cphdata,
      cpzim, selwenz, selzim, selinputcp,
      incpzim,
      monthdata, yeardata,
      cpBatchesCardGet,
      // searchcode: this.searchcode,
      // changecode: this.changecode,
      // submitting1,
      // selectForm: this.selectForm,
      // showTable: this.showTable,
      FormVisible,
      // billid,
      editdata,
      that
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
        <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
							质保清单
        </div>
          {/* <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
			   <FormItem {...formItemLayout} label='order_status'>
				  {getFieldDecorator('orderStatus', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.orderStatus) ? cpBatchesCardGet.orderStatus : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:  true ,   // 是否必填
						message: '请输入order_status',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='order_code'>
				  {getFieldDecorator('orderCode', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.orderCode) ? cpBatchesCardGet.orderCode : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:  true ,   // 是否必填
						message: '请输入order_code',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='plate_number'>
				  {getFieldDecorator('plateNumber', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.plateNumber) ? cpBatchesCardGet.plateNumber : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入plate_number',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='trip_mileage'>
				  {getFieldDecorator('tripMileage', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.tripMileage) ? cpBatchesCardGet.tripMileage : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入trip_mileage',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='assembly_build_id'>
				  {getFieldDecorator('assemblyBuildId', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.assemblyBuildId) ? cpBatchesCardGet.assemblyBuildId : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入assembly_build_id',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
				<FormItem {...formItemLayout} label="zb_date">
				  {getFieldDecorator('zbDate', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.zbDate) ? Moment(cpBatchesCardGet.zbDate):null,
				  })(
					<DatePicker
					  
					  format="YYYY-MM-DD"
					  style={{ width: '100%' }}
					/>
				  )}
				</FormItem>
				<FormItem {...formItemLayout} label="start_date">
				  {getFieldDecorator('startDate', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.startDate) ? Moment(cpBatchesCardGet.startDate):null,
				  })(
					<DatePicker
					  
					  format="YYYY-MM-DD"
					  style={{ width: '100%' }}
					/>
				  )}
				</FormItem>
				<FormItem {...formItemLayout} label="remarks">
				  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.remarks) ? cpBatchesCardGet.remarks : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:  false ,
						message: '请输入remarks',
					  },
					],
				  })(
					<TextArea
					  style={{ minHeight: 32 }}
					  
					  rows={2}
					/>
				  )}
				</FormItem>
			   <FormItem {...formItemLayout} label='parent'>
				  {getFieldDecorator('parent', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.parent) ? cpBatchesCardGet.parent : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:  true ,   // 是否必填
						message: '请输入parent',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem>
				<FormItem {...formItemLayout} label='money'>
				  {getFieldDecorator('money', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.money) ? cpBatchesCardGet.money : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,
						message: '请输入money',
					  },
					],
				  })(
					<InputNumber
					  style={{ width: '100%' }}
					  
					  min={0}
					  max={100000}
					/>
				  )}
				</FormItem>
			   <FormItem {...formItemLayout} label='x'>
				  {getFieldDecorator('x', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.x) ? cpBatchesCardGet.x : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入x',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='y'>
				  {getFieldDecorator('y', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.y) ? cpBatchesCardGet.y : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入y',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='z'>
				  {getFieldDecorator('z', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.z) ? cpBatchesCardGet.z : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入z',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
			   <FormItem {...formItemLayout} label='type'>
				  {getFieldDecorator('type', {
					initialValue: isNotBlank(cpBatchesCardGet) && isNotBlank(cpBatchesCardGet.type) ? cpBatchesCardGet.type : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
					rules: [
					  {
						required:   false ,   // 是否必填
						message: '请输入type',
						max: 64,
					  },
					],
				  })(<Input  />)}
				</FormItem>
				<FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
				  <Button type="primary" htmlType="submit" loading={submitting}>
					提交
				  </Button>
				  <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
					取消
				  </Button>
				</FormItem>
          </Form> */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'CBC').length > 0
								&& JSON.parse(getStorage('menulist')).filter(item => item.target == 'CBC')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                  <span>
          <Button type="primary"  disabled={orderflag} onClick={this.onsave} loading={submitting}>
					    保存
				  </Button>
          <Button type="primary"   disabled={orderflag}  style={{ marginLeft: 8 }} onClick={this.handleSubmit} loading={submitting}>
					    提交
				  </Button>
          <Button type="primary"  disabled={orderflag} style={{ marginLeft: 8 }} onClick={this.showForm} loading={submitting}>
					    新增明细
				  </Button>
          {
										(cpBatchesCardGet.orderStatus === 1 || cpBatchesCardGet.orderStatus === '1') &&
										<Button style={{ marginLeft: 8 }} onClick={() => this.onUndo(cpBatchesCardGet.id)}>
											撤销
</Button>
                  }
            </span>
                  }
            <Button style={{ marginLeft: 8 }} onClick={() => this.handleImportVisible(true)}>
					   导入
				  </Button>
				  <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
					  返回
				  </Button>
          </div>
        </Card>

        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <StandardEditTable
                scroll={{ x: 1400 }}
                 data={getCpBatchesCardDetailList}
                bordered
                columns={columns}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>

        {/* <div className={styles.standardList}>
      <Card bordered={false} title='物料明细'>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator} />
          <Table
            scroll={{ x: 1400 }}
            // components={components}
            // rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columnswlin}
            onChange={this.handleStandardTableChange1}
          />
        </div> 
      </Card>
    </div> */}

        <CreateFormForm {...parentMethodForms} FormVisible={FormVisible} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default CpBatchesCardForm;
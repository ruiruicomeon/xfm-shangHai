/**
 * 结算单
 */
import React, { PureComponent } from 'react';
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
  DatePicker,
  Row,
  Col,
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpOfferFormForm.less';
import moment from 'moment';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpOfferForm, loading }) => ({
  ...cpOfferForm,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpOfferForm/update_CpOfferForm'],
  submitting2: loading.effects['cpupdata/cpOfferForm_update'],
}))
@Form.create()
class CpOfferFormForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      fileList: [],
      updataflag: true,
      selectyear:0,
			selectmonth:0,
      updataname: '取消锁定',
      confirmflag :true,
      location: getLocation(),
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    const { dispatch } = this.props;
    const { location } = this.state;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpOfferForm/cpOfferForm_Get',
        payload: {
          id: location.query.id,
        },
        callback: res => {
          if (res.data.orderStatus === 1 || res.data.orderStatus === '1' || res.data.orderStatus === 2 || res.data.orderStatus === '2'||(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSettlementForm').length>0
					&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSettlementForm')[0].children.filter(item=>item.name=='修改').length==0)) {
						this.setState({ orderflag: true })
					} else {
						this.setState({ orderflag: false })
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
          if(isNotBlank(res.data.qualityDate)){
						this.setState({
							selectyear:res.data.qualityDate.split(',')[0],
							selectmonth:res.data.qualityDate.split(',')[1]
						})
					}
          dispatch({
            type: 'sysarea/getFlatCode',
            payload:{
            id:location.query.id,
            type:'BJ'
            },
            callback:(imgres)=>{
            this.setState({
            srcimg:imgres
            })
            }
            })
          dispatch({
            type: 'sysarea/getFlatOrderdCode',
            payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'BJ'
            },
            callback:(imgres)=>{
            this.setState({
            srcimg1:imgres
            })
            }
            })
        },
      });
    }
    dispatch({
      type: 'dict/dict',
      callback: data => {
        const insuranceCompany = [];
        const brand = [];
        const approachType = [];
        const collectCustomer = [];
        const orderType = [];
        const business_project = [];
        const business_dicth = [];
        const business_type = [];
        const settlement_type = [];
        const payment_methodd = [];
        const old_need = [];
        const make_need = [];
        const quality_need = [];
        const oils_need = [];
        const guise_need = [];
        const installation_guide = [];
        const is_photograph = [];
        const maintenance_project = [];
        const del_flag = [];
        const classify = [];
        const client_level = [];
        const area = [];
        const offerType =[]
        data.forEach(item => {
          if (item.type == 'insurance_company') {
            insuranceCompany.push(item);
          }
          if (item.type == 'brand') {
            brand.push(item);
          }
          if (item.type == 'approach_type') {
            approachType.push(item);
          }
          if (item.type == 'collect_customer') {
            collectCustomer.push(item);
          }
          if (item.type == 'orderType') {
            orderType.push(item);
          }
          if (item.type == 'business_project') {
            business_project.push(item);
          }
          if (item.type == 'business_dicth') {
            business_dicth.push(item);
          }
          if (item.type == 'business_type') {
            business_type.push(item);
          }
          if (item.type == 'settlement_type') {
            settlement_type.push(item);
          }
          if (item.type == 'payment_methodd') {
            payment_methodd.push(item);
          }
          if (item.type == 'old_need') {
            old_need.push(item);
          }
          if (item.type == 'make_need') {
            make_need.push(item);
          }
          if (item.type == 'quality_need') {
            quality_need.push(item);
          }
          if (item.type == 'oils_need') {
            oils_need.push(item);
          }
          if (item.type == 'guise_need') {
            guise_need.push(item);
          }
          if (item.type == 'installation_guide') {
            installation_guide.push(item);
          }
          if (item.type == 'maintenance_project') {
            maintenance_project.push(item);
          }
          if (item.type == 'is_photograph') {
            is_photograph.push(item);
          }
          if (item.type == 'del_flag') {
            del_flag.push(item);
          }
          if (item.type == 'classify') {
            classify.push(item);
          }
          if (item.type == 'client_level') {
            client_level.push(item);
          }
          if (item.type == 'area') {
            area.push(item);
          }
          if(item.type == 'offerType'){ 
            offerType.push(item)
          }
        });
        this.setState({
          insuranceCompany,
          brand,
          approachType,
          collectCustomer,
          orderType,
          business_project,
          business_dicth,
          business_type,
          settlement_type,
          payment_methodd,
          old_need,
          make_need,
          quality_need,
          oils_need,
          guise_need,
          installation_guide,
          maintenance_project,
          is_photograph,
          del_flag,
          classify,
          client_level,
          area,
          offerType
        });
      },
    });
  }

  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpOfferForm/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, updataflag ,selectyear,selectmonth} = this.state;
    e.preventDefault();
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
        value.qualityDate =`${selectyear} , ${selectmonth}`
        value.oldTime = moment(values.oldTime).format('YYYY-MM-DD');
        value.workingDate = moment(values.workingDate).format('YYYY-MM-DD');
        value.returnedDate = moment(values.returnedDate).format('YYYY-MM-DD');
        value.orderStatus = 1;
        if (updataflag) {
          dispatch({
            type: 'cpOfferForm/update_CpOfferForm',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              // router.push('/business/process/cp_settlement_form_list');
              router.push(`/business/process/cp_settlement_form_form?id=${location.query.id}`);
            },
          });
        } else {
          dispatch({
            type: 'cpupdata/cpOfferForm_update',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
              // router.push('/business/process/cp_settlement_form_list');
              router.push(`/business/process/cp_settlement_form_form?id=${location.query.id}`);
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
      router.push(`/business/process/cp_settlement_form_form?id=${location.query.id}`);
    }
  };

  onsave = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location, updataflag,qualityDate,selectmonth ,selectyear} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.qualityDate =`${selectyear} , ${selectmonth}`
        value.oldTime = moment(values.oldTime).format('YYYY-MM-DD');
        value.workingDate = moment(values.workingDate).format('YYYY-MM-DD');
        value.returnedDate = moment(values.returnedDate).format('YYYY-MM-DD');
        if (updataflag) {
          value.orderStatus = 0;
          dispatch({
            type: 'cpOfferForm/update_CpOfferForm',
            payload: { ...value },
            callback: () => {
              this.setState({
                addfileList: [],
                fileList: [],
              });
            },
          });
        } else {
          value.orderStatus = 1;
          dispatch({
            type: 'cpupdata/cpOfferForm_update',
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

  onrejected = e => {
    const { dispatch, form } = this.props;
    const { addfileList, location } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {};
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }
        value.orderStatus = 1;
        value.approvals = 2;
        dispatch({
          type: 'cpOfferForm/update_CpOfferForm',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/business/process/cp_settlement_form_list');
          },
        });
      }
    });
  };

  onCancelCancel = () => {
    router.push('/business/process/cp_settlement_form_list');
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

  goprint = () => {
    const { location } = this.state;
    const w = window.open('about:blank');
    w.location.href = `/#/Task_FinalStatement?id=${location.query.id}`;
  };

  onUndo = (record) => {
		Modal.confirm({
			title: '撤销该结算单',
			content: '确定撤销该结算单吗？',
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
			type: 'cpOfferForm/cpOfferForm_revocationJS',
			payload: {
				id
			},
			callback: () => {
        router.push(`/business/process/cp_settlement_form_form?id=${location.query.id}`);
				// router.push('/business/process/cp_settlement_form_list');
			}
    })
  }
  }

  editYear =(val)=>{
		if(isNotBlank(val)){
			this.setState({selectyear:val})
		}else{
			this.setState({selectyear:0})
		}	
	}

	editMonth =(val)=>{
		if(isNotBlank(val)){
			this.setState({selectmonth:val})
		}else{
			this.setState({selectmonth:0})
		}	
	}

  render() {
    const { fileList, previewVisible, previewImage, updataflag, updataname,orderflag ,srcimg,srcimg1,selectmonth, selectyear,} = this.state;
    const {submitting1,submitting2, submitting, cpOfferFormGet } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const yeardata = [
			{
				key:0,
				value:0
			},
			{
				key:1,
				value:1
			},
			{
				key:2,
				value:2
			},
			{
				key:3,
				value:3
			},
			{
				key:4,
				value:4
			},
			{
				key:5,
				value:5
			},
			{
				key:6,
				value:6
			},
			{
				key:7,
				value:7
			},
			{
				key:8,
				value:8
			},
			{
				key:9,
				value:9
			},
			{
				key:10,
				value:10
			},
		]
		const monthdata = [
			{
				key:0,
				value:0
			},
			{
				key:1,
				value:1
			},
			{
				key:2,
				value:2
			},
			{
				key:3,
				value:3
			},
			{
				key:4,
				value:4
			},
			{
				key:5,
				value:5
			},
			{
				key:6,
				value:6
			},
			{
				key:7,
				value:7
			},
			{
				key:8,
				value:8
			},
			{
				key:9,
				value:9
			},
			{
				key:10,
				value:10
			},
			{
				key:11,
				value:11
			},
			{
				key:12,
				value:12
			},
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
		return (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
结算单
      </div>
      {isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.id)&&<div style={{position: 'absolute', right: '24%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
单号
        </span><img src={isNotBlank(srcimg)&&isNotBlank(srcimg.msg)?getFullUrl(`/${srcimg.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                  </div>}
      {isNotBlank(cpOfferFormGet)&&isNotBlank(cpOfferFormGet.orderCode)&&<div style={{position: 'absolute', right: '8%',top: '25px', zIndex: '1'}}>
        <span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
编号
        </span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '80px',height:'80px',display:'inline-block'}} alt="" />
                                                                         </div>}
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <Card title="基本信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='单号'>
                {getFieldDecorator('intentionid', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.id) ? cpOfferFormGet.id : '',     
										rules: [
											{
												required: false,   
												message: '请输入单号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="订单编号" className="allinputstyle">
                {getFieldDecorator('orderCode', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.orderCode)
                        ? cpOfferFormGet.orderCode
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入订单编号',
                      },
                    ],
                  })(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="订单分类">
                {getFieldDecorator('orderType', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.orderType)
                        ? cpOfferFormGet.orderType
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择订单分类',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      disabled
                    >
                      {isNotBlank(this.state.orderType) &&
                        this.state.orderType.length > 0 &&
                        this.state.orderType.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="业务项目">
                {getFieldDecorator('project', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.project)
                        ? cpOfferFormGet.project
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择业务项目',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      disabled
                    >
                      {isNotBlank(this.state.business_project) &&
                        this.state.business_project.length > 0 &&
                        this.state.business_project.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="业务渠道">
                {getFieldDecorator('dicth', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.dicth)
                        ? cpOfferFormGet.dicth
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择业务渠道',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      disabled
                    >
                      {isNotBlank(this.state.business_dicth) &&
                        this.state.business_dicth.length > 0 &&
                        this.state.business_dicth.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="业务分类">
                {getFieldDecorator('businessType', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.businessType)
                        ? cpOfferFormGet.businessType
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择业务分类',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      disabled
                    >
                      {isNotBlank(this.state.business_type) &&
                        this.state.business_type.length > 0 &&
                        this.state.business_type.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="结算类型">
                {getFieldDecorator('settlementType', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.settlementType)
                        ? cpOfferFormGet.settlementType
                        : '', 
                    rules: [
                      {
                        required: false,
                        message: '请选择结算类型',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      disabled
                    >
                      {isNotBlank(this.state.settlement_type) &&
                        this.state.settlement_type.length > 0 &&
                        this.state.settlement_type.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="保险公司">
                {getFieldDecorator('insuranceCompanyId', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.insuranceCompanyId)
                        ? cpOfferFormGet.insuranceCompanyId
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入保险公司',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      disabled
                      allowClear
                    >
                      {isNotBlank(this.state.insuranceCompany) &&
                        this.state.insuranceCompany.length > 0 &&
                        this.state.insuranceCompany.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="品牌">
                {getFieldDecorator('brand', {
                    initialValue:
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.brand)
                        ? cpOfferFormGet.brand
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请输入品牌',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      disabled
                      allowClear
                    >
                      {isNotBlank(this.state.brand) &&
                        this.state.brand.length > 0 &&
                        this.state.brand.map(d => (
                          <Option key={d.id} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                    </Select>
                  )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="集采客户">
               <Input  value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.collectClientId)&& isNotBlank(cpOfferFormGet.collectClientId.name)
                        ? cpOfferFormGet.collectClientId.name
                        : ''} disabled />
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="集采编码">
               <Input   value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.collectCode)
                    ? cpOfferFormGet.collectCode
                    : ''} disabled />
              </FormItem>
            </Col>
          </Row>
        </Card>

        <Card title="业务员信息" className={styles.card} bordered={false}>
                <Row gutter={16}>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='业务员'>
                      <Input
                        
                        disabled
                        value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) ? cpOfferFormGet.user.name : '')}
                      />
                    </FormItem>

                  </Col>

                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='编号'>
                      <Input
                        disabled
                        value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) ? cpOfferFormGet.user.no : '')}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='所属公司'>
                      <Input
                        
                        disabled
                        value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) && isNotBlank(cpOfferFormGet.user.office) ? cpOfferFormGet.user.office.name : '')}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <FormItem {...formItemLayout} label='所属区域'>
                      <Select
                        allowClear
                        
                        notFoundContent={null}
                        style={{ width: '100%' }}
                        value={(isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) && isNotBlank(cpOfferFormGet.user.dictArea) ? cpOfferFormGet.user.dictArea : '')}
                        
                        disabled
                      >
                        {
                          isNotBlank(this.state.area) && this.state.area.length > 0 && this.state.area.map(item =>
                            <Option value={item.value} key={item.value}>
                              {item.label}
                            </Option>
                          )
                        }
                      </Select>
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
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client)&&
                      isNotBlank(cpOfferFormGet.client.clientCpmpany) ? cpOfferFormGet.client.clientCpmpany
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
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client)
                        ? cpOfferFormGet.client.classify
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
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client)
                        ? cpOfferFormGet.client.code
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
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client)
                        ? cpOfferFormGet.client.name
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
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client)
                        ? cpOfferFormGet.client.address
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
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client)
                        ? cpOfferFormGet.client.phone
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
                      isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.assemblyEnterType)
                        ? cpOfferFormGet.assemblyEnterType
                        : '', 
                    rules: [
                      {
                        required: false, 
                        message: '请选择进场类型',
                      },
                    ],
                  })(
                    <Select disabled allowClear style={{ width: '100%' }}>
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
              <FormItem {...formItemLayout} label='品牌'>
                {getFieldDecorator('assemblyBrand', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id)?isNotBlank(cpOfferFormGet.cab.assemblyBrand)?cpOfferFormGet.cab.assemblyBrand:''
							:isNotBlank(cpOfferFormGet.assemblyBrand) ? cpOfferFormGet.assemblyBrand : '',     
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
              <FormItem {...formItemLayout} label='车型/排量'>
                {getFieldDecorator('assemblyVehicleEmissions', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id)?isNotBlank(cpOfferFormGet.cab.assemblyVehicleEmissions)?cpOfferFormGet.cab.assemblyVehicleEmissions:''
										:isNotBlank(cpOfferFormGet.assemblyVehicleEmissions) ? cpOfferFormGet.assemblyVehicleEmissions : '',     
										rules: [
											{
												required: false,   
												message: '请输入车型/排量',
											},
										],
									})(<Input disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='年份'>
                {getFieldDecorator('assemblyYear', {
									initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id)?isNotBlank(cpOfferFormGet.cab.assemblyYear)?cpOfferFormGet.cab.assemblyYear:''
									:isNotBlank(cpOfferFormGet.assemblyYear) ? cpOfferFormGet.assemblyYear : '',
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
              <FormItem {...formItemLayout} label='总成型号'>
                {getFieldDecorator('assemblyModel', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id)?isNotBlank(cpOfferFormGet.cab.assemblyModel)?cpOfferFormGet.cab.assemblyModel:''
										:isNotBlank(cpOfferFormGet.assemblyModel) ? cpOfferFormGet.assemblyModel : '',
										rules: [
											{
												required: false,   
												message: '请输入总成型号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='总成号'>
                {getFieldDecorator('assemblyCode', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id)?isNotBlank(cpOfferFormGet.cab.assemblyCode)?cpOfferFormGet.cab.assemblyCode:''
										:isNotBlank(cpOfferFormGet.assemblyCode) ? cpOfferFormGet.assemblyCode : '',
										rules: [
											{
												required: false,   
												message: '请输入总成型号',
											},
										],
									})(<Input  disabled />)}
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="相片显示" className="allimgstyle">
                {getFieldDecorator('photo', {
                    initialValue: '',
                  })(
                    <Upload
                      accept="image/*"
                      onChange={this.handleUploadChange}
                      onRemove={this.handleRemove}
                      beforeUpload={this.handlebeforeUpload}
                      fileList={fileList}
                      listType="picture-card"
                      onPreview={this.handlePreview}
                    />
                  )}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="报价信息" bordered={false}>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='委托项目'>
                {getFieldDecorator('entrustProject', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.entrustProject) ? cpOfferFormGet.entrustProject : '',     
										rules: [
											{
												required: false,   
												message: '请输入委托项目',
											},
										],
									})(<Select
  allowClear
  style={{ width: '100%' }}
  
  disabled={orderflag}
									>
  {
                      isNotBlank(this.state.maintenance_project) && this.state.maintenance_project.length > 0 && this.state.maintenance_project.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                    }
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='注意事项'>
                {getFieldDecorator('noticeMatter', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.noticeMatter) ? cpOfferFormGet.noticeMatter : '',     
										rules: [
											{
												required: false,   
												message: '请输入注意事项',
											},
										],
									})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='无质量担保项目'>
                {getFieldDecorator('noQualityProject', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.noQualityProject) ? cpOfferFormGet.noQualityProject : '',     
										rules: [
											{
												required: false,   
												message: '请输入无质量担保项目',
											},
										],
									})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='质量担保项目'>
                {getFieldDecorator('qualityProject', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.qualityProject) ? cpOfferFormGet.qualityProject : '',     
										rules: [
											{
												required: false,   
												message: '请输入质量担保项目',
											},
										],
									})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='结算方式约定'>
                {getFieldDecorator('settlementAgreement', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.settlementAgreement) ? cpOfferFormGet.settlementAgreement : '',     
										rules: [
											{
												required: false,   
												message: '请输入结算方式约定',
											},
										],
									})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="旧件返回时间">
                {getFieldDecorator('oldTime', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.oldTime) ? moment(cpOfferFormGet.oldTime) : null,
									})(
  <DatePicker
    disabled={updataflag}
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='报价类型'>
                {getFieldDecorator('offerType', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.offerType) ? cpOfferFormGet.offerType : '',     
										rules: [
											{
												required: false,   
												message: '请输入报价类型',
											},
										],
									})(<Select
  allowClear
  style={{ width: '100%' }}
  
  disabled={orderflag&&updataflag}
									>
  {
											isNotBlank(this.state.offerType) && this.state.offerType.length > 0 && this.state.offerType.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
										}
</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="结算日期">
                {getFieldDecorator('workingDate', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.workingDate) ? moment(cpOfferFormGet.workingDate) : null,
									})(
  <DatePicker
    disabled={updataflag}
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='其他约定事项'>
                {getFieldDecorator('otherMatter', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.otherMatter) ? cpOfferFormGet.otherMatter : '',     
										rules: [
											{
												required: false,   
												message: '请输入其他约定事项',
											},
										],
									})(<Input  disabled={updataflag} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="默认回款时间">
                {getFieldDecorator('returnedDate', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.returnedDate) ? moment(cpOfferFormGet.returnedDate) : null,
									})(
  <DatePicker
    disabled={updataflag}
    
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
									)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label="质保时间">
                <Select
                  allowClear
                  style={{ width: '50%' }}
                  disabled={orderflag}
                  value={`${this.state.selectyear} 年`}
                  onChange={this.editYear}
                >
                  {
												isNotBlank(yeardata) && yeardata.length > 0 && yeardata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
											}
                </Select>
                <Select
                  allowClear
                  style={{ width: '50%' }}
                  disabled={orderflag}
                  value={`${this.state.selectmonth} 月`}
                  onChange={this.editMonth}
                >
                  {
												isNotBlank(monthdata) && monthdata.length > 0 && monthdata.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
											}
                </Select>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem {...formItemLayout} label='金额合计'>
                <Input disabled  value={isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.totalMoney) ? (isNotBlank(cpOfferFormGet.collectCode)?getPrice(getPrice(cpOfferFormGet.totalMoney)):getPrice(cpOfferFormGet.totalMoney)): ''} />
              </FormItem>
            </Col>
            <Col lg={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                {getFieldDecorator('remarks', {
										initialValue: isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.remarks) ? cpOfferFormGet.remarks : '',     
										rules: [
											{
												required: false,
												message: '请输入备注信息',
											},
										],
									})(
  <TextArea
    disabled={updataflag}
    style={{ minHeight: 32 }}
    
    rows={2}
  />
									)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={this.goprint}>
							打印
          </Button>      
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSettlementForm').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSettlementForm')[0].children.filter(item=>item.name=='二次更改')
.length>0&&
					<Button style={{ marginLeft: 8 }} type="primary" onClick={this.onupdata} disabled={!cpOfferFormGet.orderStatus==1}>
  {updataname}
</Button>
						}
          {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSettlementForm').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpSettlementForm')[0].children.filter(item=>item.name=='修改')
.length>0&&
<span>
  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onsave} loading={submitting2||submitting1} disabled={updataflag&&orderflag}>
							保存
  </Button>
  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting2||submitting1} disabled={updataflag&&orderflag}>
							提交
  </Button>
  {
							(cpOfferFormGet.orderStatus === 1 || cpOfferFormGet.orderStatus === '1') &&
							<Button style={{ marginLeft: 8 }} loading={submitting2||submitting1} onClick={() => this.onUndo(cpOfferFormGet.id)}>
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
    </Card>
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  </PageHeaderWrapper>
		);
	}
}
export default CpOfferFormForm;

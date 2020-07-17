import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  message,
  Icon,
  Modal,
  Row,Col
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation ,getPrice ,setPrice} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpPjEntrepotForm.less';
import StandardTable from '@/components/StandardTable';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
Object.keys(obj)
  .map(key => obj[key])
  .join(',');
const CreateFormgs = Form.create()(props => {
	const { handleModalVisiblegs, complist, selectgsflag, selectgs ,dispatch,form , form: { getFieldDecorator } } = props;
	const columnskh = [
		{
			title: '操作',
      width: 100,
      align: 'center' , 
			render: record => (
  <Fragment>
    <a onClick={() => selectgs(record)}>
						选择
    </a>
  </Fragment>
			),
		},
    {
      title: '分公司编号',
      dataIndex: 'code',
      align: 'center' , 
      width: 150,
    },
    {
      title: '分公司名称',
      dataIndex: 'name',
      align: 'center' , 
      width: 200,
    },
    {
      title: '公司图标',
      dataIndex: 'logo',
      align: 'center' , 
      width: 150,
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
      title: '所属大区',
      dataIndex: 'area.name',
      align: 'center' , 
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'master',
      align: 'center' , 
      width: 150,
    },
    {
      title: '负责人电话',
      dataIndex: 'zipCode',
      align: 'center' , 
      width: 150,
    },
    {
      title: '抬头中文',
      dataIndex: 'rise',
      align: 'center' , 
      width: 150,
    },
    {
      title: '电话1',
      dataIndex: 'phone',
      align: 'center' , 
      width: 150,
    },
    {
      title: '抬头英文',
      dataIndex: 'enrise',
      align: 'center' , 
      width: 150,
    },
    {
      title: '电话2',
      dataIndex: 'twoPhone',
      align: 'center' , 
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center' , 
      width: 200,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      align: 'center' , 
      width: 150,
    },
    {
      title: '网址',
      dataIndex: 'website',
      align: 'center' , 
      width: 150,
    }
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
  const handleFormReset = () => {
    form.resetFields();
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
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
			type: 'company/query_comp',
			payload: params,
		});
	};
  const handleSearch =(e)=> {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10
      };
      if(!isNotBlank(fieldsValue.name)){
        values.name = ''
      }
      dispatch({
        type: 'company/query_comp',
        payload: values,
      });
    });
  };
	return (
  <Modal
    title='选择所属公司'
    visible={selectgsflag}
    onCancel={() => handleModalVisiblegs()}
    width='80%'
		>
    <Form onSubmit={handleSearch}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="公司名称">
            {getFieldDecorator('name')(<Input  />)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
              </Button>
            </span>
          </div>
        </Col>
      </Row>
    </Form>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={complist}
      columns={columnskh}
    />
  </Modal>
	);
});
@connect(({ cpPjEntrepot, loading ,company}) => ({
  ...cpPjEntrepot,
  ...company,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpPjEntrepot/cpPjEntrepot_Add'],
}))
@Form.create()
class CpPjEntrepotForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      orderflag:false,
      location: getLocation()
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpPjEntrepot/cpPjEntrepot_Get',
        payload: {
          id: location.query.id,
        }
      });
      dispatch({
        type: 'sysarea/getFlatCode',
        payload: {
          id: isNotBlank(location.query.id) ? location.query.id : '',
          type: 'PJCAK'
        },
        callback: (srcres) => {
          this.setState({
            srcimg: srcres
          })
        }
      })
    }
    if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPjEntrepot').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPjEntrepot')[0].children.filter(item=>item.name=='修改')
    .length>0){
         this.setState({
             orderflag:false
         })
    }else{
      this.setState({
        orderflag:true
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
      type: 'cpPjEntrepot/clear',
    });
  }

  onsave = ()=> {
    const { dispatch, form ,cpPjEntrepotGet} = this.props;
    const { addfileList, location ,selectgsdata} = this.state;
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
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }

        if(isNotBlank(value.totalMoney )){
           value.totalMoney = setPrice(value.totalMoney)
        }
       

        value.office = {}
        value.office.id = isNotBlank(selectgsdata)&&isNotBlank(selectgsdata.id)?selectgsdata.id:
        (isNotBlank(cpPjEntrepotGet)&&isNotBlank(cpPjEntrepotGet.office)&&isNotBlank(cpPjEntrepotGet.office.id)?cpPjEntrepotGet.office.id:'')
        value.orderStatus = 0
        dispatch({
          type: 'cpPjEntrepot/cpPjEntrepot_Add',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/basicManagement/warehouse/cp_warehouse/cp_pj_entrepot_form?id=${isNotBlank(res.data)&&isNotBlank(res.data.id)?res.data.id:''}`)
          }
        })
      }
    });
  };

  handleSubmit = e => {
    const { dispatch, form ,cpPjEntrepotGet} = this.props;
    const { addfileList, location ,selectgsdata} = this.state;
    e.preventDefault();
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
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }

        if(isNotBlank(value.totalMoney )){
          value.totalMoney = setPrice(value.totalMoney)
       }

        value.office = {}
        value.office.id = isNotBlank(selectgsdata)&&isNotBlank(selectgsdata.id)?selectgsdata.id:
        (isNotBlank(cpPjEntrepotGet)&&isNotBlank(cpPjEntrepotGet.office)&&isNotBlank(cpPjEntrepotGet.office.id)?cpPjEntrepotGet.office.id:'')
        value.orderStatus = 1
        dispatch({
          type: 'cpPjEntrepot/cpPjEntrepot_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicManagement/warehouse/pj_warehouse/cp_pj_entrepot_list');
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicManagement/warehouse/pj_warehouse/cp_pj_entrepot_list');
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

  onselectgs=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'company/query_comp',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
    this.setState({
			selectgsflag: true
		})
  }

  selectgs = (record) => {
		this.setState({
			selectgsdata: record,
			selectgsflag: false
		})
  }

  handleModalVisiblegs = flag => {
		this.setState({
			selectgsflag: !!flag
		});
  };

  render() {
    const { fileList, previewVisible, previewImage ,selectgsflag,selectgsdata ,orderflag ,srcimg } = this.state;
    const {submitting1, submitting, cpPjEntrepotGet,complist ,dispatch} = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const parentMethodsgs = {
			handleModalVisiblegs: this.handleModalVisiblegs,
			selectgs: this.selectgs,
      complist,
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
          <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
配件仓库
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='仓库二维码'>
                  {isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.id) && <div>
                    <img
                      src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} 
                      style={{width:'100px'}}
                      alt=""
                    />
                  </div>}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='仓库名'>
                  {getFieldDecorator('name', {
                initialValue: isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.name) ? cpPjEntrepotGet.name : '',     
                rules: [
                  {
                    required: true,   
                    message: '请输入仓库名',
                    max: 255,
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='所属分公司'>
                  <Input
                    disabled
                    style={{width:'50%'}}
                    
                    value={isNotBlank(selectgsdata)&& isNotBlank(selectgsdata.name)?selectgsdata.name:
          (isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.office)&& isNotBlank(cpPjEntrepotGet.office.name) ? cpPjEntrepotGet.office.name : '')}
                  />
                  <Button disabled={orderflag} type="primary" style={{marginLeft:'8px'}} onClick={this.onselectgs} loading={submitting}>选择</Button>
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='负责人'>
                  {getFieldDecorator('principal', {
                initialValue: isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.principal) ? cpPjEntrepotGet.principal : '',     
                rules: [
                  {
                    required: true,   
                    message: '请输入负责人',
                    max: 255,
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='联系电话'>
                  {getFieldDecorator('phone', {
                initialValue: isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.phone) ? cpPjEntrepotGet.phone : '',     
                rules: [
                  {
                    required: true,   
                    message: '请输入联系电话',
                    max: 255,
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='库存总金额'>
                  {getFieldDecorator('totalMoney', {
                initialValue: isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.totalMoney) ? getPrice(cpPjEntrepotGet.totalMoney) : '',     
                rules: [
                  {
                    required: true,   
                    message: '请输入库存总金额',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='自采百分比'>
                  {getFieldDecorator('since', {
                initialValue: isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.since) ? cpPjEntrepotGet.since : '',     
                rules: [
                  {
                    required: true,   
                    message: '请输入自采百分比',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                  {getFieldDecorator('remarks', {
                initialValue: isNotBlank(cpPjEntrepotGet) && isNotBlank(cpPjEntrepotGet.remarks) ? cpPjEntrepotGet.remarks : '',     
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32 ,textAlign:'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPjEntrepot').length>0
&& JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpPjEntrepot')[0].children.filter(item=>item.name=='修改')
.length>0&&<span>
  <Button type="primary" onClick={this.onsave} loading={submitting1}>
                保存
  </Button>
  <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit" loading={submitting1}>
                提交
  </Button>
</span>}
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
        <CreateFormgs {...parentMethodsgs} selectgsflag={selectgsflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpPjEntrepotForm;
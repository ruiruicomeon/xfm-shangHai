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
  Col,Row
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl,getLocation ,getPrice,setPrice} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardEditTable from '@/components/StandardEditTable';
import StandardTable from '@/components/StandardTable';
import styles from './CpCollecCodeForm.less';

const CreateFormjc = Form.create()(props => {
	const { handleModalVisiblejc, cpCollecClientList, selectjcflag, selectjc, selectedRows, handleSelectRows } = props;
	const columnskh = [
		{
			title: '操作',
      width: 100,
      fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectjc(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '名称',        
			dataIndex: 'name',   
      inputType: 'text',
      align: 'center' ,   
			width: 100,          
			editable:  true  ,      
 		},
 		{
			title: '返点',        
			dataIndex: 'rebates',   
      inputType: 'text',  
      align: 'center' , 
			width: 100,          
			editable:  true  ,      
 		},
 		{
      title: '备注信息',   
      align: 'center' ,     
			dataIndex: 'remarks',   
			inputType: 'text',   
			width: 150,          
			editable:  true  ,      
 		},
	];
	return (
  <Modal
    title='选择集采客户'
    visible={selectjcflag}
    onCancel={() => handleModalVisiblejc()}
    width='80%'
		>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      data={cpCollecClientList}
      columns={columnskh}
    />
  </Modal>
	);
});
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ cpCollecCode, loading ,cpCollecClient}) => ({
  ...cpCollecCode,
  ...cpCollecClient,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpCollecCode/cpCollecCode_Add'],
}))
@Form.create()
class CpCollecCodeForm extends PureComponent {
  constructor(props) {
		super(props);
	this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    location: getLocation()
  }
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch} = this.props;
    const {location} = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpCollecCode/cpCollecCode_Get',
        payload: {
          id: location.query.id,
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

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpCollecCode/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch,  form ,cpCollecCodeGet} = this.props;
    const { addfileList ,location ,selectjcdata} = this.state;
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
        if(isNotBlank(value.money)){
         value.money = setPrice(value.money)
        }
        value.orderStatus = 1
        value.collecClient = {}
        value.collecClient.id = isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(cpCollecCodeGet)&&
        isNotBlank(cpCollecCodeGet.collecClient)&&isNotBlank(cpCollecCodeGet.collecClient.id)?cpCollecCodeGet.collecClient.id:''
		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }
        dispatch({
          type:'cpCollecCode/cpCollecCode_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.goBack();
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch,  form ,cpCollecCodeGet} = this.props;
    const { addfileList ,location ,selectjcdata} = this.state;
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
        if(isNotBlank(value.money)){
         value.money = setPrice(value.money)
        }
        value.orderStatus = 0 
        value.collecClient = {}
        value.collecClient.id = isNotBlank(selectjcdata)&&isNotBlank(selectjcdata.id)?selectjcdata.id:isNotBlank(cpCollecCodeGet)&&
        isNotBlank(cpCollecCodeGet.collecClient)&&isNotBlank(cpCollecCodeGet.collecClient.id)?cpCollecCodeGet.collecClient.id:''
		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        }
        dispatch({
          type:'cpCollecCode/cpCollecCode_Add',
          payload: { ...value },
            callback: (res) => {
              router.push(`/basicManagement/basis/cp_collec_Code_form?id=${res.data.id}`)
          }
        })
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

  selectjc = (record) => {
    const { dispatch } = this.props
		this.props.form.setFieldsValue({
			collectClientId: isNotBlank(record)&&isNotBlank(record.id)?record.id:'',
		});
		this.setState({
			selectjcdata: record,
			selectjcflag: false
		})
		dispatch({
			type: 'cpCollecCode/cpCollecCode_List',
			payload: {
				pageSize: 10,
				id: record.id
			}
		});
  }

  handleModalVisiblejc=()=>{
    this.setState({
			selectjcflag: false
		})
  }

  onselect = ()=>{
    const {dispatch} = this.props
    dispatch({
      type: 'cpCollecClient/cpCollecClient_List',
      payload: {
        pageSize: 10,
        status:1
      }
    });
    this.setState({
			selectjcflag: true
		})
  }

  render() {
    const { fileList, previewVisible, previewImage ,selectjcflag,selectjcdata} = this.state;
    const {submitting1, submitting, cpCollecCodeGet ,cpCollecClientList } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
		const parentMethodsjc = {
			handleAddjc: this.handleAddjc,
			handleModalVisiblejc: this.handleModalVisiblejc,
			selectjc: this.selectjc,
			cpCollecClientList
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
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='集采客户'>
                  <Input
                    style={{ width: '50%' }}
                    disabled
                    value={isNotBlank(selectjcdata) && isNotBlank(selectjcdata.name) ?
											selectjcdata.name : (isNotBlank(cpCollecCodeGet) && isNotBlank(cpCollecCodeGet.collecClient)&& isNotBlank(cpCollecCodeGet.collecClient.name)  ? cpCollecCodeGet.collecClient.name : '')}
                  />
                  <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselect} loading={submitting}>选择</Button>
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='名称'>
                  {getFieldDecorator('name', {
					initialValue: isNotBlank(cpCollecCodeGet) && isNotBlank(cpCollecCodeGet.name) ? cpCollecCodeGet.name : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入名称',
						max: 255,
					  },
					],
				  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='编码'>
                  {getFieldDecorator('code', {
					initialValue: isNotBlank(cpCollecCodeGet) && isNotBlank(cpCollecCodeGet.code) ? cpCollecCodeGet.code : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入编码',
						max: 255,
					  },
					],
				  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='金额'>
                  {getFieldDecorator('money', {
					initialValue: isNotBlank(cpCollecCodeGet) && isNotBlank(cpCollecCodeGet.money) ? getPrice(cpCollecCodeGet.money) : '',     
					rules: [
					  {
						required:   false ,   
						message: '请输入金额',
					  },
					],
				  })(<Input  />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allinputstyle">
                  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpCollecCodeGet) && isNotBlank(cpCollecCodeGet.remarks) ? cpCollecCodeGet.remarks : '',     
					rules: [
					  {
						required:  false ,
						message: '请输入备注信息',
					  },
					],
				  })(
  <TextArea
    style={{ minHeight: 32 }}
    
    rows={2}
  />
				  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              <Button type="primary" onClick={this.onsave} loading={submitting1}>
					  保存
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1}>
					提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
					返回
              </Button>
            </FormItem>
          </Form>
        </Card>
        <CreateFormjc {...parentMethodsjc} selectjcflag={selectjcflag} /> 
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpCollecCodeForm;
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
  Modal,
  TreeSelect,
  Row,Col
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { isNotBlank, getFullUrl ,getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpStorageForm.less';
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
  const { handleModalVisiblekw, cpEntrepotList, selectkwflag, selectkw ,dispatch ,form 
    ,form: { getFieldDecorator } ,that} = props;
	const columnskh = [
		{
			title: '操作',
			width: 150,
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
			dataIndex: 'name',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
     {
			title: '所属公司',        
			dataIndex: 'office.name',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
	  {
        title: '更新时间',
        dataIndex: 'finishDate',
        editable:   true  ,
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
			dataIndex: 'remarks',   
			inputType: 'text',   
			width: 100,          
			editable:  true  ,      
 		},
  ];
  const  handleFormReset = () => {
    form.resetFields();
    that.setState({
      cksearch:{}
    })
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
      ...that.state.cksearch,
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
			if( values[item] instanceof moment){
			  values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
			}
			return item;
      });
      
      that.setState({
        cksearch:values
      })

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
    
    const handleModalVisiblekwin = ()=>{
      form.resetFields();
      that.setState({
         cksearch:{}
      })
      handleModalVisiblekw()
    }

	return (
  <Modal
    title='选择所属仓库'
    visible={selectkwflag}
    onCancel={() => handleModalVisiblekwin()}
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
      data={cpEntrepotList}
      columns={columnskh}
    />
  </Modal>
	);
});
@connect(({ cpStorage, loading ,cpEntrepot}) => ({
  ...cpStorage,
  ...cpEntrepot,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpStorage/cpStorage_Add'],
}))
@Form.create()
class CpStorageForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    selectkwflag:false,
    selectkwdata:[],
    orderflag:false,
    location: getLocation()
  }
}

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch } = this.props;
    const {location} = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpStorage/cpStorage_Get',
        payload: {
          id: location.query.id,
        }
      });
      dispatch({
        type: 'sysarea/getFlatCode',
        payload: {
          id: isNotBlank(location.query.id) ? location.query.id : '',
          type: 'ZCKW'
        },
        callback: (srcres) => {
          this.setState({
            srcimg: srcres
          })
        }
      })
    }
    if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='CpStorage').length>0
    && JSON.parse(getStorage('menulist')).filter(item=>item.target=='CpStorage')[0].children.filter(item=>item.name=='修改')
    .length>0){
        this.setState({
           orderflag :false
        })
    }else{
      this.setState({
        orderflag :true
     })
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
      type: 'cpStorage/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch,  form ,cpStorageGet} = this.props;
    const { addfileList,location ,selectkwdata} = this.state;
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
		if(isNotBlank(location.query) && isNotBlank(location.query.id)){
          value.id = location.query.id;
        } 
        
        value.entrepotId = isNotBlank(selectkwdata)&&isNotBlank(selectkwdata.id)?selectkwdata.id:
        (isNotBlank(cpStorageGet)&&isNotBlank(cpStorageGet.entrepotId)?cpStorageGet.entrepotId:'')
        value.orderStatus = 1
        dispatch({
          type:'cpStorage/cpStorage_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push('/basicManagement/warehouse/cp_warehouse/cp_storage_list');
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/basicManagement/warehouse/cp_warehouse/cp_storage_list');
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

  onselectkw=()=>{
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

  render() {
    const { fileList, previewVisible, previewImage ,selectkwdata,selectkwflag ,orderflag,srcimg} = this.state;
    const { submitting1,submitting, cpStorageGet ,cpEntrepotList ,dispatch} = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const that = this

    const parentMethodskw = {
			handleModalVisiblekw: this.handleModalVisiblekw,
			selectkw: this.selectkw,
      cpEntrepotList ,
      dispatch,
      that
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
成品库位
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='库位二维码'>
              {isNotBlank(cpStorageGet) && isNotBlank(cpStorageGet.id) && <div>
                <img
                  src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} 
                  style={{width:'100px'}}
                  alt=""
                />
              </div>}
            </FormItem>
            <FormItem {...formItemLayout} label='库位'>
              {getFieldDecorator('name', {
					initialValue: isNotBlank(cpStorageGet) && isNotBlank(cpStorageGet.name) ? cpStorageGet.name : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入库位',
						max: 255,
					  },
					],
				  })(<Input  disabled={orderflag} />)}
            </FormItem>
            <FormItem {...formItemLayout} label='所属仓库'>
              <Input
                disabled
                
                value={isNotBlank(selectkwdata)&& isNotBlank(selectkwdata.name)?selectkwdata.name:
          (isNotBlank(cpStorageGet) && isNotBlank(cpStorageGet.entrepotName)? cpStorageGet.entrepotName : '')}
              />
              <Button disabled={orderflag} type="primary" style={{marginLeft:'8px'}} onClick={this.onselectkw} loading={submitting}>选择</Button>
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpStorageGet) && isNotBlank(cpStorageGet.remarks) ? cpStorageGet.remarks : '',     
					rules: [
					  {
						required:  false ,
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32 ,textAlign:'center'}}>
              {!orderflag&&
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
      </PageHeaderWrapper>
    );
  }
}
export default CpStorageForm;
import React, { PureComponent ,Fragment } from 'react';
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
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl ,getLocation} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CpEntrepotForm.less';
import StandardTable from '@/components/StandardTable';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const CreateFormgs = Form.create()(props => {
	const { handleModalVisiblegs, complist, selectgsflag, selectgs } = props;
	const columnskh = [
		{
			title: '操作',
      width: 150,
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
      width: 150,
    },
    {
      title: '分公司名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '公司图标',
      dataIndex: 'logo',
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
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'master',
      width: 150,
    },
    {
      title: '负责人电话',
      dataIndex: 'zipCode',
      width: 150,
    },
    {
      title: '抬头中文',
      dataIndex: 'rise',
      width: 150,
    },
    {
      title: '电话1',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '抬头英文',
      dataIndex: 'enrise',
      width: 150,
    },
    {
      title: '电话2',
      dataIndex: 'twoPhone',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 200,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      width: 150,
    },
    {
      title: '网址',
      dataIndex: 'website',
      width: 150,
    }
	];
	return (
		<Modal
			title='选择所属公司'
			visible={selectgsflag}
			onCancel={() => handleModalVisiblegs()}
			width='80%'
		>
			<StandardTable
				bordered
				scroll={{ x: 1050 }}
				data={complist}
				columns={columnskh}
			/>
		</Modal>
	);
});
@connect(({ cpEntrepot, loading ,company }) => ({
  ...cpEntrepot,
  ...company,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CpEntrepotForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
    selectgsdata:[],
    selectgsflag:false,
    location: getLocation()
  }
}
  componentDidMount() {
    const { dispatch } = this.props;
    const {location} = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpEntrepot/cpEntrepot_Get',
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
      type: 'cpEntrepot/clear',
    });
  }
  handleSubmit = e => {
    const { dispatch, form ,cpEntrepotGet} = this.props;
    const { addfileList ,location ,selectgsdata } = this.state;
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
        value.office = {}
        value.office.id = isNotBlank(selectgsdata)&&isNotBlank(selectgsdata.companyId)?selectgsdata.companyId:
        (isNotBlank(cpEntrepotGet)&&isNotBlank(cpEntrepotGet.office)&&isNotBlank(cpEntrepotGet.office.id)?cpEntrepotGet.office.id:'')
        value.orderStatus = 1
        value.type = 2
        dispatch({
          type:'cpEntrepot/cpEntrepot_Add',
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
    const { fileList, previewVisible, previewImage ,selectgsflag,selectgsdata} = this.state;
    const { submitting, cpEntrepotGet,complist } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const parentMethodsgs = {
			handleModalVisiblegs: this.handleModalVisiblegs,
			selectgs: this.selectgs,
			complist
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
			   <FormItem {...formItemLayout} label='仓库名'>
				  {getFieldDecorator('name', {
					initialValue: isNotBlank(cpEntrepotGet) && isNotBlank(cpEntrepotGet.name) ? cpEntrepotGet.name : '',     
					rules: [
					  {
						required:  true ,   
						message: '请输入仓库名',
						max: 255,
					  },
					],
				  })(<Input  />)}
				</FormItem>
        <FormItem {...formItemLayout} label='所属分公司'>
				  <Input  value={isNotBlank(selectgsdata)&& isNotBlank(selectgsdata.name)?selectgsdata.name:
          (isNotBlank(cpEntrepotGet) && isNotBlank(cpEntrepotGet.office)&& isNotBlank(cpEntrepotGet.office.name) ? cpEntrepotGet.office.name : '')}/>
          <Button type="primary" style={{marginLeft:'8px'}} onClick={this.onselectgs} loading={submitting}>选择</Button>
				</FormItem>
				<FormItem {...formItemLayout} label="备注信息">
				  {getFieldDecorator('remarks', {
					initialValue: isNotBlank(cpEntrepotGet) && isNotBlank(cpEntrepotGet.remarks) ? cpEntrepotGet.remarks : '',     
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
				<FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
				  <Button type="primary" htmlType="submit" loading={submitting}>
					提交
				  </Button>
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
export default CpEntrepotForm;
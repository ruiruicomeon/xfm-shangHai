import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Tree, Card ,message , Upload , Icon , Modal ,Row,Col }  from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { isNotBlank ,getLocation , getFullUrl} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getStorage } from '@/utils/localStorageUtils';

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ loading, sysrole, company }) => ({
  ...sysrole,
  ...company,
  submitting: loading.effects['sysrole/add'],
  submitting1: loading.effects['company/add_comp']
}))
@Form.create()
class CompanyFrom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
			previewImage: {},
      addfileList: [],
      orderflag:false,
      location: getLocation(),
    };
  }

  componentDidMount() {
    const { dispatch, form } = this.props;
    const {location} = this.state
    form.resetFields();
    if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'company/company_detail',
        payload: {id: location.query.id },
        callback: (res) => {
          if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='office').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='office')[0].children.filter(item=>item.name=='修改')
          .length>0){
                this.setState({
                    orderflag:false 
                })
          }else{
             this.setState({
               orderflag:true
             })
          }
          if (isNotBlank(res.data) && isNotBlank(res.data.logo)) {
						let photoUrl = res.data.logo.split('|')
						photoUrl = photoUrl.map((item) => {
							return {
								id: getFullUrl(item),
								uid: getFullUrl(item),
								url: getFullUrl(item),
								name: getFullUrl(item)
							}
						})
						this.setState({
							addfileList: res.data.logo.split('|'),
							fileList: photoUrl
            })
					}
        },
      });
    }
    dispatch({
      type: 'sysrole/dicts',
      payload: { type: 'sys_data_scope' },
    });
    dispatch({
      type: 'company/fetch1',
      payload: { type: 1 },
    });
  }

       componentWillUnmount() {
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
          type: 'company/clear',
        });
      }

  handleCancel = () => this.setState({ previewVisible: false });

  handleSubmit = e => {
    const {form ,dispatch} = this.props
    const {location ,addfileList} = this.state
    e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values,id: location.query.id};
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.logo = addfileList.join('|')
				} else {
					value.logo = '';
				}
        if(isNotBlank(location.query.id)){
          value.id = location.query.id
        }else{
          delete value.id
        }
        dispatch({
          type: 'company/add_comp',
          payload: value,
          callback: () => {
            setTimeout(
              this.setState(() => {
                form.resetFields();
                return {
                  location: {},
                  checkedKeys: [],
                };
              }),
              2000
            );
            router.push('/basic/company_list')
          },
        });
      }
    });
  };

  onsave = () => {
    const {form ,dispatch} = this.props
    const {location ,addfileList} = this.state
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values,id: location.query.id};
        if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
					value.logo = addfileList.join('|')
				} else {
					value.logo = '';
				}
        if(isNotBlank(location.query.id)){
          value.id = location.query.id
        }else{
          delete value.id
        }
        dispatch({
          type: 'company/add_comp',
          payload: value,
          callback: (res) => {
                router.push(`/basic/company_form?id=${res.data.id}`)
          },
        });
      }
    });
  };

  renderTreeNodes = data => (
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    })
  );

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
					name: 'company'
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

  render() {
    const { submitting1,submitting, dispatch, form ,companylist ,detailcom ,orderflag}= this.props;
    const { getFieldDecorator } = form;
    const {fileList, previewImage, previewVisible} = this.state
    console.log(companylist)
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
      dispatch(routerRedux.push('/basic/company_list'));
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图标</div>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
公司管理
          </div>
          <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}> 
                <FormItem {...formItemLayout} label="公司图标">
                  <Upload
                    accept="image/*"
                    onChange={this.handleUploadChange}
                    onRemove={this.handleRemove}
                    beforeUpload={this.handlebeforeUpload}
                    fileList={fileList}
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    disabled={orderflag}
                  >
                    {(isNotBlank(fileList) && fileList.length >= 1)? null : uploadButton}
                  </Upload>
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="分公司编号">
                  {getFieldDecorator('code', {
                initialValue:isNotBlank(detailcom)&&isNotBlank(detailcom.code)? detailcom.code: '',
                rules: [
                  {
                    required: true,
                    message: '分公司编号',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="分公司名称">
                  {getFieldDecorator('name', {
                initialValue: isNotBlank(detailcom)&&isNotBlank(detailcom.name)? detailcom.name: '',
                rules: [
                  {
                    required: true,
                    message: '分公司编号',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='所属大区'>
                  {getFieldDecorator('area', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.area) ? detailcom.area.id : '',
                rules: [
                  {
                    required: true,
                    message: '所属大区',
                  },
                ],
              })(
                <Select
                  allowClear
                  notFoundContent={null}
                  style={{ width: '100%' }}
                  
                  disabled={orderflag}
                >
                  {
                    isNotBlank(companylist) && isNotBlank(companylist.list) && companylist.list.length > 0 && companylist.list.map((item) => (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="负责人">
                  {getFieldDecorator('master', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.master) ? detailcom.master : '',
                rules: [
                  {
                    required: true,
                    message: '负责人',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="负责人电话">
                  {getFieldDecorator('zipCode', {
                initialValue: isNotBlank(detailcom) && isNotBlank(detailcom.zipCode) ? detailcom.zipCode : '',
                rules: [
                  {
                    required: true,
                    message: '负责人电话',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="中文抬头">
                  {getFieldDecorator('rise', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.rise) ? detailcom.rise : '',
                rules: [
                  {
                    required: true,
                    message: '中文',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="英文抬头">
                  {getFieldDecorator('enrise', {
                initialValue: isNotBlank(detailcom) && isNotBlank(detailcom.enrise) ? detailcom.enrise : '',
                rules: [
                  {
                    required: true,
                    message: '英文抬头',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.phone) ? detailcom.phone : '',
                rules: [
                  {
                    required: true,
                    message: '电话',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="电话2">
                  {getFieldDecorator('twoPhone', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.twoPhone) ? detailcom.twoPhone : '',
                rules: [
                  {
                    message: '电话2',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="传真">
                  {getFieldDecorator('fax', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.fax) ? detailcom.fax : '',
                rules: [
                  {
                    required: true,
                    message: '传真',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label="网址">
                  {getFieldDecorator('website', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.website) ? detailcom.website : '',
                rules: [
                  {
                    required: true,
                    message: '网址',
                  },
                ],
              })(<Input  disabled={orderflag} />)}
                </FormItem>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="地址" className="allinputstyle">
                  {getFieldDecorator('address', {
                initialValue:isNotBlank(detailcom) && isNotBlank(detailcom.address) ? detailcom.address : '',
                rules: [
                  {
                    required: true,
                    message: '地址',
                  },
                ],
              })(<TextArea  disabled={orderflag} rows={2} />)}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='office').length>0
          && JSON.parse(getStorage('menulist')).filter(item=>item.target=='office')[0].children.filter(item=>item.name=='修改')
          .length>0&&
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
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CompanyFrom;

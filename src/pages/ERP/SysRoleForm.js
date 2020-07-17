import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button , Tree, Card , Radio } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank ,getLocation} from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

const { TreeNode } = Tree;
const FormItem = Form.Item;

@connect(({ loading, sysrole }) => ({
  ...sysrole,
  submitting: loading.effects['sysrole/add'],
  
  officeList: sysrole.formData.officeList,
  menuList: sysrole.formData.menuList,
  dictsData: sysrole.dicts,
}))
@Form.create()
class SysRoleFrom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
      checkedKeys: [],
      defaultExpandAll: true,
      location: getLocation(),
      orderflag:false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const {location} = this.state
    
      if(isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpBusinessIntention').length>0
      && JSON.parse(getStorage('menulist')).filter(item=>item.target=='cpBusinessIntention')[0].children.filter(item=>item.name=='修改')
      .length>0){
          this.setState({orderflag:false})
      }else{
        this.setState({orderflag:true})
      }

    if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'sysrole/form_data',
        payload: { id: location.query.id },
        callback: response => {
          this.setState({
            checkedKeys: response.data.role.menuIdList,
          });
          
        },
      });
    }else{
      dispatch({
        type: 'sysrole/form_data'
      });
    }
  }

       componentWillUnmount() {
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
          type: 'sysrole/clear',
        });
      }

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  handleSubmit = e => {
    const {form,dispatch} = this.props
    const {location,checkedKeys} = this.state
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values,id: location.query.id};
        
        const { formData } = this.props;
        let oldName = '';
        if (isNotBlank(formData)&&isNotBlank(formData.role.name)
        ) {
          oldName = formData.role.name;
        }
        value.oldName = oldName;
        let oldEnname = '';

        if(isNotBlank(location.query.id)){
          value.id = location.query.id
        }else{
          delete value.id
        }

        if (
          isNotBlank(formData)&&isNotBlank(formData.role.enname)
        ) {
          oldEnname = formData.role.enname;
        }
        value.oldEnname = oldEnname;

        value.menuIds = checkedKeys;

        dispatch({
          type: 'sysrole/add_role',
          payload: value,
          callback: () => {
            setTimeout(
              this.setState(() => {
                
                return {
                  location: {},
                  checkedKeys: [],
                };
              }),
              2000
            );
            dispatch(routerRedux.push('/system/role_list'));
          },
        });
        
      }
    });
  };

  onsave = () => {
    const {form,dispatch} = this.props
    const {location,checkedKeys} = this.state
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values,id: location.query.id};
        
        const { formData } = this.props;
        let oldName = '';
        if (isNotBlank(formData)&&isNotBlank(formData.role.name)
        ) {
          oldName = formData.role.name;
        }
        value.oldName = oldName;
        let oldEnname = '';

        if(isNotBlank(location.query.id)){
          value.id = location.query.id
        }else{
          delete value.id
        }

        if (
          isNotBlank(formData)&&isNotBlank(formData.role.enname)
        ) {
          oldEnname = formData.role.enname;
        }
        value.oldEnname = oldEnname;

        value.menuIds = checkedKeys;

        dispatch({
          type: 'sysrole/add_role',
          payload: value,
          callback: (res) => {
          router.push(`/system/sys-role/form?id=${res.data.id}`);
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

  render() {
    const { submitting, dispatch, formData, menuList ,form} = this.props;
    const { getFieldDecorator } = form;
    const { checkedKeys ,defaultExpandAll ,orderflag} = this.state;
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
      dispatch(routerRedux.push('/system/role_list'));
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{fontWeight:550,fontSize:28,textAlign:'center'}}>
角色管理
          </div>
          <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>

            <FormItem {...formItemLayout} label="角色名称">
              {getFieldDecorator('name', {
                initialValue:isNotBlank(formData)&&isNotBlank(formData.role)&&isNotBlank(formData.role.name)? formData.role.name: '',
                
                rules: [
                  {
                    required: true,
                    message: '角色名称',
                  },
                ],
              })(<Input disabled={orderflag}  />)}
            </FormItem>

            <FormItem {...formItemLayout} label="英文名称">
              {getFieldDecorator('enname', {
                initialValue:isNotBlank(formData)&&isNotBlank(formData.role)&&isNotBlank(formData.role.enname)? formData.role.enname: '',
                
                rules: [
                  {
                    required: true,
                    message: '英文名称',
                  },
                ],
              })(<Input disabled={orderflag}  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否查看本身">
              {getFieldDecorator('useable', {
                initialValue:isNotBlank(formData)&&isNotBlank(formData.role)&&isNotBlank(formData.role.useable)? formData.role.useable: '',
                
                rules: [
                  {
                    required: true,
                    message: '是否查看本身',
                  },
                ],
              })( <Radio.Group disabled={orderflag}>
                <Radio.Button value="0">
                  否
                </Radio.Button>
                <Radio.Button value="1">
                  是
                </Radio.Button>
              </Radio.Group>)}
            </FormItem>
            <FormItem {...formItemLayout} label="角色授权">
              {getFieldDecorator('menuIds', {
                initialValue:isNotBlank(formData)&&isNotBlank(formData.role)&&isNotBlank(formData.role.menuIds)? formData.menuIds: '',
              })(
                <Tree
                  checkable
                  defaultExpandAll={defaultExpandAll}
                  onCheck={this.onCheck}
                  checkedKeys={checkedKeys}
                  disabled={orderflag}
                >
                  {this.renderTreeNodes(
                    isNotBlank(menuList)? menuList: []
                  )}
                </Tree>
              )}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {
                isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item=>item.target=='role').length>0
                && JSON.parse(getStorage('menulist')).filter(item=>item.target=='role')[0].children.filter(item=>item.name=='修改')
                .length>0&&
                <span>
                  <Button type="primary" onClick={this.onsave} loading={submitting}>
                保存
                  </Button>
                  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting}>
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
      </PageHeaderWrapper>
    );
  }
}
export default SysRoleFrom;

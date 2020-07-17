import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Tree, Card, Empty, Row, Col, Upload, Modal, Collapse } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getLocation, getDateDiff ,getFullUrl} from '@/utils/utils';
import moment from 'moment';
import styles from './calendar.less'

const { TreeNode } = Tree;
const { Panel } = Collapse;
const FormItem = Form.Item;
@connect(({ loading, sysrole, sysdept }) => ({
  ...sysrole,
  ...sysdept,
  submitting: loading.effects['sysrole/add'],
  officeList: sysrole.formData.officeList,
  menuList: sysrole.formData.menuList,
  dictsData: sysrole.dicts,
}))
@Form.create()
class calendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    dispatch({
      type: 'sysdept/getSysDocList',
      payload: {
        pageSize: 10,
        type:3
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'sysdept/clear',
    });
  }

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  handleSubmit = e => {
    const { form, dispatch } = this.props
    const { location, checkedKeys } = this.state
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values, id: location.query.id };
        const { formData } = this.props;
        let oldName = '';
        if (isNotBlank(formData) && isNotBlank(formData.role.name)
        ) {
          oldName = formData.role.name;
        }
        value.oldName = oldName;
        let oldEnname = '';
        if (isNotBlank(location.query.id)) {
          value.id = location.query.id
        } else {
          delete value.id
        }
        if (
          isNotBlank(formData) && isNotBlank(formData.role.enname)
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

  onSelect = value => {
    this.setState({
      value,
      selectedValue: value,
    });
  };

  onPanelChange = value => {
    this.setState({ value });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const { dispatch, form, getsysdoclist } = this.props;
    const { previewVisible, previewImage } = this.state;
    return (
      <div>
        <div style={{ fontWeight: 550, fontSize: 28, marginBottom:'16px', textAlign: 'center' }}>
          公告
        </div>
        <Row gutter={16}>
          {isNotBlank(getsysdoclist) && isNotBlank(getsysdoclist.list) && getsysdoclist.list.length > 0 ? getsysdoclist.list.map((item) => (
            <Col lg={8} md={10} sm={10} xs={24} style={{marginTop:8}}>
              <Card key={item.id} title={`标题：${item.description}`} bordered={false}>
                <div>
                  <span>发布人：</span>
                  <span className='item_message'>{isNotBlank(item.createBy) && isNotBlank(item.createBy.name) ? item.createBy.name : ''}</span>
                </div>
                <div>
                  <span>时间：</span>
                  <span className='item_message'>{isNotBlank(item.createDate) ? item.createDate : ''}</span>
                </div>
                <Collapse style={{ marginTop:8 }}>
                  <Panel header="查看详细" key="1">
                    <div>
                      <p>
                        <span>内容：</span>
                        <span className='item_message'>{isNotBlank(item.remarks) ? item.remarks : ''}</span>
                      </p>
                      <p>
                        <span>图片：</span>
                        <Upload
                          accept="image/*"
                          disabled
                          fileList={isNotBlank(item.path)?item.path.split('|').map((itempath) => {
                            return {
                              id: getFullUrl(itempath),
                              uid: getFullUrl(itempath),
                              url: getFullUrl(itempath),
                              name: getFullUrl(itempath)
                            }
                          }):[]}
                          listType="picture-card"
                          onPreview={this.handlePreview}
                        />
                      </p>
                    </div>
                  </Panel>
                </Collapse>
              </Card>
            </Col>
          ))
            : <Empty style={{ marginTop: '28px' }} description='暂无公告' />
          }
        </Row>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div> 
    )
  }
}
export default calendar;

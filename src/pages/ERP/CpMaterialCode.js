/**
 * 物料编码查询
 */
import React, { PureComponent, Fragment } from 'react';
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
  Row, Col,
  Spin
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, getPrice } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { stringify } from 'qs'
import StandardTable from '@/components/StandardTable';
import styles from './CpMaterialCode.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ cpBillMaterial, loading, cpOneCode, cpTwoCode }) => ({
  ...cpBillMaterial,
  ...cpOneCode,
  ...cpTwoCode,
  submitting: loading.effects['cpBillMaterial/getMaterial_Query'],
}))
@Form.create()
class CpMaterialCode extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectdata: {},
      billCode: '',
      location: getLocation()
    }
  }

  componentDidMount() { }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpBillMaterial/clear',
    });
  }

  onCancelCancel = () => {
    router.push('/basicManagement/materials/cp_bill_material_list');
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


  handleMaterialCodeChange = e => {
    const { value } = e.target
    if (value) {
      this.setState({ billCode: value })
    }
  }

  handleSearchCode = () => {
    const { dispatch } = this.props
    const { billCode } = this.state
    if (isNotBlank(billCode)) {
      dispatch({
        type: 'cpBillMaterial/getMaterial_Query',
        payload: {
          billCode,
          startDate: moment().startOf('month').format('YYYY-MM-DD'),
          endDate: moment().endOf('month').format('YYYY-MM-DD'),
        }
      })
    } else {
      message.warning('请输入物料编码')
    }
  }

  handleUpldExportClick = () => {
    const { billCode } = this.state
    if (isNotBlank(billCode)) {
      const params = {
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
        billCode,
        'user.id': isNotBlank(getStorage('userid')) ? getStorage('userid') : ''
      }
      window.open(`/api/Beauty/beauty/statisticsReport/exportMaterialQuery?${stringify(params)}`);
    } else {
      message.warning('请先查询物料编码')
    }
  }

  render() {
    const { previewVisible, previewImage, billCode, } = this.state;
    const { submitting, getMaterialQueryDate, form: { getFieldDecorator } } = this.props;


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

    const colLayout = {
      lg: 12,
      md: 12,
      sm: 24,
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <FormItem label="物料编码" {...formItemLayout}>
            <Input placeholder="请输入物料编码" onChange={e => this.handleMaterialCodeChange(e)} style={{ width: '60%' }} value={billCode} />
            <Button type="primary" onClick={() => { this.handleSearchCode() }} style={{ margin: '0 10px' }}>查询</Button>
            <Button onClick={() => this.handleUpldExportClick()}>导出</Button>
          </FormItem>
        </Card>
        <Spin spinning={submitting || false} size="large">
          <Card bordered={false}>
            <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
              物料编码查询
            </div>
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
              <Row>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='物料编码'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.billCode) ? getMaterialQueryDate.cpBillMaterial.billCode : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='物料名称'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.name) ? getMaterialQueryDate.cpBillMaterial.name : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='一级编码'>
                    <Input style={{ width: '100%' }} disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.one) ? getMaterialQueryDate.cpBillMaterial.one.code : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='二级编码'>
                    <Input style={{ width: '100%' }} disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.two) ? getMaterialQueryDate.cpBillMaterial.two.code : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='一级编码型号'>
                    <Input
                      disabled
                      value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.one) ? getMaterialQueryDate.cpBillMaterial.one.model : ''}
                    />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='二级编码名称'>
                    <Input
                      disabled
                      value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.two) ? getMaterialQueryDate.cpBillMaterial.two.name : ''}
                    />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='原厂编码'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.originalCode) ? getMaterialQueryDate.cpBillMaterial.originalCode : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='配件厂商'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.rCode) ? getMaterialQueryDate.cpBillMaterial.rCode : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='单位'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.unit) ? getMaterialQueryDate.cpBillMaterial.unit : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='库存数量'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.balanceNumber) ? getMaterialQueryDate.balanceNumber : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='库存金额'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.balanceMoney) ? getPrice(getMaterialQueryDate.balanceMoney) : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='库存单价'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.balancePrice) ? getPrice(getMaterialQueryDate.balancePrice) : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='仓库'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpPjEntrepot) && isNotBlank(getMaterialQueryDate.cpPjEntrepot.name) ? getMaterialQueryDate.cpPjEntrepot.name : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='库位'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpPjStorage) && isNotBlank(getMaterialQueryDate.cpPjStorage.name) ? getMaterialQueryDate.cpPjStorage.name : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='销售价格'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.salesPrice) ? getPrice(getMaterialQueryDate.salesPrice) : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='状态'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.status) ? getMaterialQueryDate.cpBillMaterial.status : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='创建时间'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.createDate) ? getMaterialQueryDate.cpBillMaterial.createDate : ''} value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.cpBillMaterial) && isNotBlank(getMaterialQueryDate.cpBillMaterial.createDate) ? getMaterialQueryDate.cpBillMaterial.createDate : ''} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label='备注信息'>
                    <Input disabled value={isNotBlank(getMaterialQueryDate) && isNotBlank(getMaterialQueryDate.remarks) && isNotBlank(getMaterialQueryDate.remarks) ? getMaterialQueryDate.remarks : ''} />
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpMaterialCode;
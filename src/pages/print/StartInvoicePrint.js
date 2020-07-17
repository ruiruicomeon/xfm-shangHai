/**
 * 业务管理 -> Zc施工单  完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpStartInvoice, loading }) => ({
  ...cpStartInvoice,
  submitting: loading.effects['form/submitRegularForm'],
}))
class Task_Zc_Construction extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      srcimg: '',
      srcimg1: ''
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpStartInvoice/cpStartInvoice_Get',
      payload: {
        id: isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      },
      callback: (res) => {
        if (isNotBlank(res.data.type) && (res.data.type == 2 || res.data.type == '拆分开票')) {
          dispatch({
            type: 'cpStartInvoice/cpInvoiceDetail_List',
            payload: {
              invoiceId: location.query.id,
              remarks: 1,
              pageSize: 50
            }
          })
        }
        if (isNotBlank(res.data.type) && (res.data.type == '6edc254f-5390-4efc-824d-a3b9e4017af0' || res.data.type == '合并开票')) {
          dispatch({
            type: 'cpStartInvoice/cpInvoiceDetail_List',
            payload: {
              invoiceId: location.query.id,
              pageSize: 50
            }
          })
        }
        setTimeout(() => {
          window.print()
        }, 1000);
        // dispatch({
        //   type: 'sysarea/getFlatOrderdCode',
        //   payload: {
        //     id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
        //     type: 'ZCSGD'
        //   },
        //   callback: (srcres) => {
        //     setTimeout(() => {
        //       window.print()
        //     }, 1000);
        //     this.setState({
        //       srcimg1: srcres
        //     })
        //   }
        // })
      },
    });

    // dispatch({
    //   type: 'sysarea/getFlatCode',
    //   payload: {
    //     id: isNotBlank(location.query.id) ? location.query.id : '',
    //     type: '1'
    //   },
    //   callback: (srcres) => {
    //     this.setState({
    //       srcimg: srcres
    //     })
    //   }
    // })

  }

  showtitle = (type) => {
    if (type == '拆分开票') {
      return '税票(拆分)申请单'
    } else if (type == '合并开票') {
      return '税票(合并)申请单'
    } else if (type == '分批开票') {
      return '税票(分批)申请单'
    }
    else if (type == '按单开票') {
      return '税票(按单)申请单'
    } else {
      return '税票申请单'
    }
  }

  render() {
    const { cpStartInvoiceGet, cpInvoiceDetailList } = this.props;

    const { srcimg, srcimg1 } = this.state




    return (
      <div style={{ color: '#000', overflow: 'hidden', paddingLeft: '6mm', paddingRight: '6mm', width: '200mm', boxSizing: 'border-box' }}>
        <p>&nbsp;</p>
        <div>
          <div style={{ float: 'left' }}>
            <div style={{ position: 'absolute', top: '100mm', left: '160mm' }}>
              <img src={require('../../assets/zhang.png')} style={{ width: '30mm' }} />
              {/* {/* <img src="../Images/XFM2017001_8.png" style={{ width: '30mm', height: '30mm' }} /> */}
            </div>
            <table
              style={{ width: '188mm', clear: 'both', fontSize: '14px' }}
              cellSpacing={0}
              cellPadding={0}
              border={0}
              align="left"
            >
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center', width: '20mm', height: '20mm' }}>
                    <span>
                      <img src="./XFM_Logo.jpg" width={60} />
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '18px' }}>
                      <span>上海新孚美变速箱技术服务有限公司</span>
                      <br />
                      <span style={{ fontSize: '14px' }}>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                      <br /> <strong style={{ fontSize: '24px' }}>{this.showtitle(cpStartInvoiceGet.type)} &nbsp;&nbsp;</strong>
                    </strong>
                  </td>
                  {/* <td style={{ textAlign: 'center', height: '20mm' }}>
                <span style={{display:'inline-block'}}>
                  <img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} width={80} />
                  <p style={{textAlign:'center'}}>单号</p>
                </span>
              </td>
              <td style={{ textAlign: 'center', height: '20mm' }}>
                <span style={{marginLeft:'20px',display:'inline-block'}}>
                  <img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} width={80} />
                  <p style={{textAlign:'center'}}>编号</p>
                </span>
              </td> */}
                </tr>
              </tbody>
            </table>
          </div>
          {isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.type) && (cpStartInvoiceGet.type == 2 || cpStartInvoiceGet.type == '拆分开票') ?
            <div style={{ float: 'left' }}>
              <table align="left" border={1} cellPadding={1} className="thin" style={{ width: '188mm' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '30mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 订单编号</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.orderCode) ? cpStartInvoiceGet.orderCode : ''}</span></td>
                    <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 客户名称</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet.type) && cpStartInvoiceGet.type == '6edc254f-5390-4efc-824d-a3b9e4017af0' ? (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.clientCpmpany) ? cpStartInvoiceGet.client.clientCpmpany :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.collectClientId) && isNotBlank(cpStartInvoiceGet.collectClientId.name) ? cpStartInvoiceGet.collectClientId.name : '') : (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.clientCpmpany) ? cpStartInvoiceGet.client.clientCpmpany : '')}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 业务发生日期</td>
                    <td style={{ width: '60mm' }}>
                      <div>
                        <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.startDate) ? cpStartInvoiceGet.startDate : ''}</span></div></td>
                    <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 拟定回款日期</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.startDate) ? cpStartInvoiceGet.startDate : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', height: '10mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 代办事项</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.commissionMatter) ? cpStartInvoiceGet.commissionMatter : ''}</span></td>
                    <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 金额</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.receivableMoney) ? getPrice(cpStartInvoiceGet.receivableMoney) : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 税票内容</td>
                    <td colSpan={3}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.makeRemarks) ? cpStartInvoiceGet.makeRemarks : ''}</span></td>
                  </tr>
                  <tr>
                    <td nowrap="noWrap" style={{ height: '10mm', width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 开票方</td>
                    <td colSpan={3} nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.drawer) ? cpStartInvoiceGet.drawer : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 开票方式</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.makeNeed) ? cpStartInvoiceGet.makeNeed : ''}</span></td>
                  </tr>
                </tbody>
              </table>

              {isNotBlank(cpInvoiceDetailList) &&
                cpInvoiceDetailList.length > 0
                && cpInvoiceDetailList.map((Item, idnex) => {
                  return <span>
                    <table align="left" border={1} cellPadding={1} className="thin" style={{ width: '188mm' }}>
                      <tbody>
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', height: '10mm' }}> 开票资料内容{idnex + 1}</td></tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 客户名称</td>
                          <td colSpan={3} nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.clientName) ? Item.clientName : ''}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 地址</td>
                          <td colSpan={3} nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.address) ? Item.address : ''}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 电话</td>
                          <td nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.tel) ? Item.tel : ''}</span></td>
                          <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 税号</td>
                          <td nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.duty) ? Item.duty : ''}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 开户行</td>
                          <td nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.account) ? Item.account : ''}</span></td>
                          <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 账号</td>
                          <td nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.account) ? Item.account : ''}</span></td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="left" border={1} cellPadding={1} className="thin" style={{ width: '188mm' }}>
                      <tbody>
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', height: '10mm' }}> 税票邮递资料{idnex + 1}</td></tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 客户名称</td>
                          <td colSpan={3} nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.clientName1) ? Item.clientName1 : ''}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 地址</td>
                          <td colSpan={3} nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.address1) ? Item.address1 : ''}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 联系人</td>
                          <td nowrap="noWrap" style={{ width: '64mm' }}>
                            <span>{isNotBlank(Item) && isNotBlank(Item.likeMan) ? Item.likeMan : ''}</span></td>
                          <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 手机</td>
                          <td nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.phone) ? Item.phone : ''}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 电话</td>
                          <td nowrap="noWrap" >
                            <span>{isNotBlank(Item) && isNotBlank(Item.tel1) ? Item.tel1 : ''}</span></td>
                          <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 邮编</td>
                          <td nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.postcode) ? Item.postcode : ''}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}>快递公司</td>
                          <td nowrap="noWrap" >
                            <span>{isNotBlank(Item) && isNotBlank(Item.company) ? Item.company : ''}</span></td>
                          <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}>寄出日期</td>
                          <td nowrap="noWrap">
                            <span>{isNotBlank(Item) && isNotBlank(Item.sendDate) ? (Item.sendDate) : null}</span></td>
                        </tr>
                        <tr>
                          <td style={{ width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 备注</td>
                          <td colSpan={3}>
                            <span>{isNotBlank(Item) && isNotBlank(Item.remarks) ? Item.remarks : ''}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </span>
                })
              }
              {/* </tbody>
            </table> */}
            </div>
            :
            <div style={{ float: 'left' }}>
              <table align="left" border={1} cellPadding={1} className="thin" style={{ width: '188mm' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '30mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 订单编号</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.orderCode) ? cpStartInvoiceGet.orderCode : ''}</span></td>
                    <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 客户名称</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet.type) && cpStartInvoiceGet.type == '6edc254f-5390-4efc-824d-a3b9e4017af0' ? (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.clientCpmpany) ? cpStartInvoiceGet.client.clientCpmpany :
                        isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.collectClientId) && isNotBlank(cpStartInvoiceGet.collectClientId.name) ? cpStartInvoiceGet.collectClientId.name : '') : (isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.client) && isNotBlank(cpStartInvoiceGet.client.clientCpmpany) ? cpStartInvoiceGet.client.clientCpmpany : '')}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 业务发生日期</td>
                    <td style={{ width: '60mm' }}>
                      <div>
                        <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.startDate) ? cpStartInvoiceGet.startDate : ''}</span></div></td>
                    <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 拟定回款日期</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.startDate) ? cpStartInvoiceGet.startDate : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', height: '10mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 代办事项</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.commissionMatter) ? cpStartInvoiceGet.commissionMatter : ''}</span></td>
                    <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 金额</td>
                    <td style={{ width: '60mm' }}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.receivableMoney) ? getPrice(cpStartInvoiceGet.receivableMoney) : ''}</span></td>
                  </tr>

                  {isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.type) && (cpStartInvoiceGet.type == '6edc254f-5390-4efc-824d-a3b9e4017af0' || cpStartInvoiceGet.type == '合并开票') && isNotBlank(cpInvoiceDetailList) &&
                    cpInvoiceDetailList.length > 0
                    && cpInvoiceDetailList.map((Item, idx) => {
                     return <tr>
                        <td style={{ width: '30mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>订单编号{idx + 1}</td>
                        <td style={{ width: '60mm' }}>
                          <span>{isNotBlank(Item) && isNotBlank(Item.duty) ? Item.duty : ''}</span></td>
                        <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 金额{idx + 1}</td>
                        <td style={{ width: '60mm' }}>
                          <span>{isNotBlank(Item) && isNotBlank(Item.invoiceMoney) ? getPrice(Item.invoiceMoney) : ''}</span></td>
                      </tr>
                    })
                  }

                  <tr>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 税票内容</td>
                    <td colSpan={3}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.makeRemarks) ? cpStartInvoiceGet.makeRemarks : ''}</span></td>
                  </tr>
                  <tr>
                    <td nowrap="noWrap" style={{ height: '10mm', width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 开票方</td>
                    <td colSpan={3} nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.drawer) ? cpStartInvoiceGet.drawer : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 开票方式</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.makeNeed) ? cpStartInvoiceGet.makeNeed : ''}</span></td>
                    {/* <td style={{ width: '30mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}> 快递单号</td>
                <td nowrap="noWrap">
                  <span /></td> */}
                  </tr>
                  {/* <tr>
                <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 寄出日期</td>
                <td nowrap="noWrap">
                  <span>2019-08-28</span></td>
                <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 开票日期</td>
                <td nowrap="noWrap">
                  <span>2019-08-28</span></td>
              </tr> */}
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', height: '10mm' }}> 开票资料内容</td></tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 客户名称</td>
                    <td colSpan={3} nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.clientName) ? cpStartInvoiceGet.clientName : ''}</span></td>
                  </tr>
                  {/* <tr>
                <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 开票方式</td>
                <td colSpan={3} nowrap="noWrap">
                  <div>
                    <span>增票</span></div></td>
              </tr> */}
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 地址</td>
                    <td colSpan={3} nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.address) ? cpStartInvoiceGet.address : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 电话</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.tel) ? cpStartInvoiceGet.tel : ''}</span></td>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 税号</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.duty) ? cpStartInvoiceGet.duty : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 开户行</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.account) ? cpStartInvoiceGet.account : ''}</span></td>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 账号</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.account) ? cpStartInvoiceGet.account : ''}</span></td>
                  </tr>
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', height: '10mm' }}> 税票邮递资料</td></tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 客户名称</td>
                    <td colSpan={3} nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.clientName1) ? cpStartInvoiceGet.clientName1 : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 地址</td>
                    <td colSpan={3} nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.address1) ? cpStartInvoiceGet.address1 : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 联系人</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.likeMan) ? cpStartInvoiceGet.likeMan : ''}</span></td>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 手机</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.phone) ? cpStartInvoiceGet.phone : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}> 电话</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.tel1) ? cpStartInvoiceGet.tel1 : ''}</span></td>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 邮编</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.postcode) ? cpStartInvoiceGet.postcode : ''}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', height: '10mm', backgroundColor: 'rgb(211, 211, 211)' }}>快递公司</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.company) ? cpStartInvoiceGet.company : ''}</span></td>
                    <td style={{ height: '10mm', width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}>寄出日期</td>
                    <td nowrap="noWrap">
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.sendDate) ? (cpStartInvoiceGet.sendDate) : null}</span></td>
                  </tr>
                  <tr>
                    <td style={{ width: '30mm', textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)' }}> 备注</td>
                    <td colSpan={3}>
                      <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.remarks) ? cpStartInvoiceGet.remarks : ''}</span></td>
                  </tr>
                </tbody>
              </table></div>
          }
          <br />
          <table align="left" style={{ width: '188mm', float: 'left' }}>
            <tbody>
              <tr>
                <td style={{ width: '70mm', height: '15mm' }}> 申请人：
                <span>{isNotBlank(cpStartInvoiceGet) && isNotBlank(cpStartInvoiceGet.applyUser) ? cpStartInvoiceGet.applyUser : ''}</span></td>
                <td> 前台：</td>
                <td> 财务：</td></tr>
              {/* <img src={require('../../assets/zhang.png')} style={{ width: '30mm', position: "absolute", left: '50%', transform: 'translateX(-50%)' }} /> */}
            </tbody>
          </table>
          <table style={{ width: '188mm' }}>
            <tbody>
              <tr>
                <td colSpan={2} style={{ height: '15mm' }}>
                  <p> &nbsp;</p>
                  <hr size={1} style={{ borderTop: '2px solid #000' }} />
                  <p style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '14px' }}>
                      <strong>
                        <span>上海新孚美变速箱技术服务有限公司</span>&nbsp; 地址：
                      <span>上海市闵行区兴梅路658号C座</span></strong>
                      <br />
                      <strong>
                        <span style={{ fontSize: '14px' }}>电话：
                        <span>021-54856975 021-51078886</span>&nbsp; 传真：
                        <span>021-64051851</span></span>
                      </strong>
                    </span>
                  </p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Task_Zc_Construction;

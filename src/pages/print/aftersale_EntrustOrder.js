/**
 * 售后管理 -> 售后委托单  完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpBusinessIntention, cpAfterEntrustFrom, loading }) => ({
  ...cpBusinessIntention,
  ...cpAfterEntrustFrom,
  submitting: loading.effects['cpAfterEntrustFrom/cpAfterEntrustFrom_Get'],
}))
class aftersale_EntrustOrder extends PureComponent {

  constructor(props) {
		super(props);
		this.state = {
      srcimg:'',
      srcimg1:''
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpAfterEntrustFrom/cpAfterEntrustFrom_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn:1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'SHWT'
          },
          callback:(srcres)=>{
            setTimeout(() => {
              window.print()
            }, 1000);
            this.setState({
            srcimg1:srcres
            })
          }
        })
      },
    });

    dispatch({
      type: 'sysarea/getFlatCode',
      payload:{
      id:isNotBlank(location.query.id)?location.query.id:'',
      type:'SHWT'
      },
      callback:(srcres)=>{
      this.setState({
      srcimg:srcres
      })
      }
      })
  }

  render() {
    const { cpAfterEntrustFromGet } = this.props;
    const {srcimg,srcimg1} =this.state

    return (
      <div style={{color:'#000',paddingLeft:'6mm',paddingRight:'6mm',width:'200mm',boxSizing:'border-box'}}>
        {/* <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '200mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            <tr>
              <td style={{ width: '374px' }}>
                <span>
                  <span style={{ fontFamily: 'C39HrP60DlTt', fontSize: '50px' }}>
                    *FM0215AWD171114001*
                  </span>
                </span>
              </td>
              <td style={{ textAlign: 'right', width: '374px' }}>
                <span />
              </td>
            </tr>
          </tbody>
        </table> */}
        <p> &nbsp;</p>
        <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '188mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            <tr>
              <td style={{ width: '20mm', height: '20mm', textAlign: 'center' }}>
                <span>
                <img src="./XFM_Logo.jpg" width={60} />
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '18px' }}>
                  <span>上海新孚美变速箱技术服务有限公司</span>
                  <br />
                  <span style={{fontSize:'14px'}}>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                </strong>
                <br /> <strong style={{ fontSize: '24px' }}>售后委托单 &nbsp;&nbsp;</strong>
              </td>
              <td style={{ textAlign: 'center', height: '20mm' }}>
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
              </td>
            </tr>
          </tbody>
        </table>
        <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '188mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            <tr>
              <td
                colSpan={7}
                style={{
                  height: '8mm',
                  textAlign: 'center',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>基础信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ height: '7mm', width:'10%',textAlign: 'right',backgroundColor: 'rgb(204, 204, 204)' }}>单据状态：</td>
              {/*  */}
              <td style={{ borderBottom: '1px solid #000000',width:'168px'}}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.orderStatus)
                    ? cpAfterEntrustFromGet.orderStatus
                    : ''}
                </span>
              </td>
              <td
                style={{
                  width: '73.890625px',
                  textAlign: 'center',
                   width:'10%',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
                nowrap="nowrap"
              >
                单号：
              </td>
              <td style={{ borderBottom: '1px solid #000000',width:'170px'}}>
                <span> {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.id)
                    ? cpAfterEntrustFromGet.id
                    : ''}</span>
              </td>
              <td
                style={{
                  width: '73.890625px',
                  textAlign: 'right',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
                nowrap="nowrap"
              >
                日期：
              </td>
              <td style={{ borderBottom: '1px solid #000000'}}>
              <span> {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.createDate)
                    ? cpAfterEntrustFromGet.createDate
                    : ''}</span>
              </td>
            </tr>
           
              {/* <td style={{ height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}>申请单号：</td>
              
              <td style={{ borderBottom: '1px solid #000000', }}>
                <span>SH1502171121003...</span>
              </td> */}
               <tr>
              <td
                style={{
                  width: '73.890625px',
                  textAlign: 'right',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
                nowrap="nowrap"
              >
                质保日期：
              </td>
              <td style={{ borderBottom: '1px solid #000000', }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.qualityTime)&&cpAfterEntrustFromGet.qualityTime!=','
                    ? cpAfterEntrustFromGet.qualityTime.split(',')[0]+'年'+
                    cpAfterEntrustFromGet.qualityTime.split(',')[1]+'月'
                    : ''
              }</span>
              </td>
              <td style={{ height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}>
                <span style={{ textAlign: 'right' }}>订单编号：</span>
              </td>
              <td style={{ borderBottom: '1px solid #000000', }}>
                <div>
                  <span>
                    {isNotBlank(cpAfterEntrustFromGet) &&
                    isNotBlank(cpAfterEntrustFromGet.orderCode)
                      ? cpAfterEntrustFromGet.orderCode
                      : ''}
                  </span>
                </div>
              </td>
              </tr>
              {/* <td
                style={{
                  width: '73.890625px',
                  textAlign: 'right',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
              >
                售后类型：
              </td>
              <td style={{ borderBottom: '1px solid #000000', width: '155.171875px' }}>
                <span>质保期内...</span>
              </td> */}
           
            {/* <tr> */}
              {/* <td style={{ height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}>
                <span style={{ textAlign: 'right' }}>订单编号：</span>
              </td>
              
              <td style={{ borderBottom: '1px solid #000000', }}>
                <div>
                  <span>
                    {isNotBlank(cpAfterEntrustFromGet) &&
                    isNotBlank(cpAfterEntrustFromGet.orderCode)
                      ? cpAfterEntrustFromGet.orderCode
                      : ''}
                  </span>
                </div>
              </td> */}
              {/* <td
                style={{
                  width: '73.890625px',
                  textAlign: 'right',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
              >
                &nbsp;
              </td>
              <td style={{ borderBottom: '1px solid #000000', }}>&nbsp;</td>
              <td
                style={{
                  width: '73.890625px',
                  textAlign: 'right',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
              >
                &nbsp;
              </td>
              <td style={{ borderBottom: '1px solid #000000', width: '155.171875px' }}> &nbsp;</td>
            </tr> */}
            {/* <tr>
              <td style={{ height: '7mm',width:'15%',textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}>
                本次故障描述：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000', }}
              >
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.errorDescription)
                    ? cpAfterEntrustFromGet.errorDescription
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ height: '7mm',textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}>售后地址：</td>
              <td colSpan={5} style={{ borderBottom: '1px solid #000000', }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.afterAddress)
                    ? cpAfterEntrustFromGet.afterAddress
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ height: '7mm',textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}> 备注：</td>
              
              <td colSpan={5} style={{ borderBottom: '1px solid #000000', }}>
                <span>备注...</span>
              </td>
            </tr> */}
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: 'center',
                  height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>业务员信息</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
                nowrap="nowrap"
              >
                分公司：
              </td>
             
              <td
                colSpan={5}
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.user) &&
                  isNotBlank(cpAfterEntrustFromGet.user.office)
                    ? cpAfterEntrustFromGet.user.office.name
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                业务员：
              </td>
             
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
              <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.user) &&
                  isNotBlank(cpAfterEntrustFromGet.user.name)
                    ? cpAfterEntrustFromGet.user.name:''}
                </span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                员工编码：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.user)
                    ? cpAfterEntrustFromGet.user.no
                    : ''}
                </span>
              </td>
              {/* <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                所属区域：
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.areaName)
                    ? cpAfterEntrustFromGet.areaName
                    : ''}
                </span>
              </td> */}
            </tr>
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: 'center',
                  height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>客户信息</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
                nowrap="nowrap"
              >
                客户分类：
              </td>
             
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.client) &&
                  isNotBlank(cpAfterEntrustFromGet.client.classify)
                    ? cpAfterEntrustFromGet.client.classify
                    : ''}
                </span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                联系人：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.client) &&
                  isNotBlank(cpAfterEntrustFromGet.client.name)
                    ? cpAfterEntrustFromGet.client.name
                    : ''}</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                客户编号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client)
                    ? cpAfterEntrustFromGet.client.code
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                客户：
              </td>
             
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.client) &&
                  isNotBlank(cpAfterEntrustFromGet.client.clientCpmpany) ? cpAfterEntrustFromGet.client.clientCpmpany
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              {/* <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                联系人：
              </td>
             
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client)
                    ? cpAfterEntrustFromGet.client.name
                    : ''}
                </span>
              </td> */}
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                联系方式：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client)
                    ? cpAfterEntrustFromGet.client.phone
                    : ''}
                </span>
              </td>
              {/* <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                电话\传真：
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <span>电话/传真...</span>
              </td> */}
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                联系地址：
              </td>
             
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.client)
                    ? cpAfterEntrustFromGet.client.address
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: 'center',
                  height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>产品信息</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                总成型号：
              </td>
             
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyModel) ? cpAfterEntrustFromGet.assmblyBuild.assemblyModel : ''}</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                总成品牌：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyBrand) ? cpAfterEntrustFromGet.assmblyBuild.assemblyBrand : ''}</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车型/排量
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.vehicleModel) ? cpAfterEntrustFromGet.assmblyBuild.vehicleModel : ''}</span>
              </td>
            </tr>
            <tr>
            <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                年份：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild) && isNotBlank(cpAfterEntrustFromGet.assmblyBuild.assemblyYear) ? cpAfterEntrustFromGet.assmblyBuild.assemblyYear : ''}</span>
              </td>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                钢印号：
              </td>
             
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assemblySteelSeal) ? cpAfterEntrustFromGet.assemblySteelSeal : ''}</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                维修项目：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.maintenanceProject) ? cpAfterEntrustFromGet.maintenanceProject : '')}</span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                技术参数：
              </td>
             
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.technicalParameters)
                    ? cpAfterEntrustFromGet.technicalParameters
                    : ''}
                </span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                行程里程：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                  <span>{(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.tripMileage) ? cpAfterEntrustFromGet.tripMileage : '')}</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车牌号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                  <span>{(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.plateNumber) ? cpAfterEntrustFromGet.plateNumber : '')}</span>
              </td>
            </tr>
            <tr>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                其他识别信息：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.assemblyMessage) ? cpAfterEntrustFromGet.assemblyMessage : ''}</span>
              </td>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                历史单号：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {	(isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.historyCode) ? cpAfterEntrustFromGet.historyCode : '')}
                </span>
              </td>
              {/* <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车型\排量：
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <span>传祺 GS4 1.3T/1.5T/2.0...</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                其他信息：
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <div
                  style={{
                    width: '40mm',
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {isNotBlank(cpAfterEntrustFromGet) &&
                  isNotBlank(cpAfterEntrustFromGet.assemblyMessage)
                    ? cpAfterEntrustFromGet.assemblyMessage
                    : ''}
                </div>
              </td> */}
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                维修历史：
              </td>
              <td  colSpan={5} style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.maintenanceHistory) ? cpAfterEntrustFromGet.maintenanceHistory : ''}
                </span>
              </td>
              </tr>
              <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                备注信息：
              </td>
              <td  colSpan={5} style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.remarks) ? cpAfterEntrustFromGet.remarks : ''}
                </span>
                </td>
              </tr>
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: 'center',
                  height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <b>故障反馈</b>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                联系人：
              </td>
             
              <td
               
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.linkman) ? cpAfterEntrustFromGet.linkman : ''}</span>
              </td>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                电话：
              </td>
             
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.phone) ? cpAfterEntrustFromGet.phone : ''}</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
               是否收费：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.ischarge) ? cpAfterEntrustFromGet.ischarge : ''}</span>
              </td>
            </tr>
            <tr>
            <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                售后地址：
              </td>
              <td  colSpan={5} style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.afterAddress) ? cpAfterEntrustFromGet.afterAddress : ''}
                </span>
                </td>
            </tr>
            <tr>
            <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                故障描述：
              </td>
              <td  colSpan={5} style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.z) ? cpAfterEntrustFromGet.z : ''}
                </span>
                </td>
            </tr>
            {/* <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                档位：
              </td>
             
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <span>0...</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车速：
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <span>0...</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                维修类型：
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <span>总成维修类型...</span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                引擎转速：
              </td>
             
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                <span>0...</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                &nbsp;
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                &nbsp;
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                &nbsp;
              </td>
              <td nowrap="noWrap" style={{ borderBottom: '1px solid #000000' }}>
                &nbsp;
              </td>
            </tr> */}
             <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: 'center',
                  height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>售后方案</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }} nowrap="noWrap"
              >
                计划开始时间：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planStartDate) ? (cpAfterEntrustFromGet.planStartDate):null}
                </span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                计划结束时间：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
              <span>{isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planEndDate) ? (cpAfterEntrustFromGet.planEndDate):null}</span>
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                派发人：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.planNumberName) ? cpAfterEntrustFromGet.planNumberName : ''}
                </span>
              </td>
            </tr>
            <tr>
            <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                处理方试：
              </td>
              <td  colSpan={5} style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.processMode) ? cpAfterEntrustFromGet.processMode : ''}
                </span>
                </td>
            </tr>
            <tr>
            <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }} nowrap="noWrap"
              >
                售后安排：
              </td>
              <td  colSpan={5} style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.afterArrangement) ? cpAfterEntrustFromGet.afterArrangement : ''}
                </span>
                </td>
            </tr>
            <tr>
              <td
                nowrap="noWrap"
                style={{
                  borderTopStyle: 'solid',
                  borderBottomSize: '1px',
                  borderBottomStyle: 'solid',
                  borderLeftStyle: 'solid',
                  borderTopColor: 'rgb(0, 0, 0)',
                  borderBottomColor: 'rgb(0, 0, 0)',
                  borderLeftColor: 'rgb(0, 0, 0)',
                  textAlign: 'right',
                }}
              >
                客户确认：
              </td>
              <td
                nowrap="noWrap"
                style={{
                  borderTopStyle: 'solid',
                  borderBottomSize: '1px',
                  borderBottomStyle: 'solid',
                  borderLeftStyle: 'solid',
                  borderTopColor: 'rgb(0, 0, 0)',
                  borderBottomColor: 'rgb(0, 0, 0)',
                  borderLeftColor: 'rgb(0, 0, 0)',
                  textAlign: 'right',
                }}
              >
                &nbsp;
              </td>
              <td
                colSpan={5}
                style={{
                  borderTopStyle: 'solid',
                  borderRightStyle: 'solid',
                  borderBottomSize: '1px',
                  borderBottomStyle: 'solid',
                  borderTopColor: 'rgb(0, 0, 0)',
                  borderRightColor: 'rgb(0, 0, 0)',
                  borderBottomColor: 'rgb(0, 0, 0)',
                  height: '10mm',
                }}
              >
                &nbsp;
              </td>
            </tr>
            <tr>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                下单人：
              </td>
              <td style={{ height: '8mm' }}>
              {isNotBlank(cpAfterEntrustFromGet) && isNotBlank(cpAfterEntrustFromGet.createBy)&& isNotBlank(cpAfterEntrustFromGet.createBy.name) ? cpAfterEntrustFromGet.createBy.name : ''}
              </td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                经手人：
              </td>
              <td nowrap="noWrap"> &nbsp;</td>
              <td
                nowrap="noWrap"
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                客户签字：
              </td>
              <td nowrap="noWrap"> &nbsp;</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>
                地址：<span>上海市闵行区兴梅路658号C座</span>&nbsp;电话：
                <span>021-54856975 021-51078886</span>&nbsp; 传真：<span>021-64051851</span>
                &nbsp;网址：<span>www.fm960.com.cn</span>
                <br /> &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default aftersale_EntrustOrder;

/**
 * 业务管理 -> Zc施工单  完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpCarloadConstructionForm, loading }) => ({
  ...cpCarloadConstructionForm,
  submitting: loading.effects['form/submitRegularForm'],
}))
class Task_Zc_Construction extends PureComponent {

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
      type: 'cpCarloadConstructionForm/cpCarloadConstructionForm_Get',
      payload: {
        id: isNotBlank(location)&&isNotBlank(location.query)&&isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn:1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'ZCSGD'
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
      type:'1'
      },
      callback:(srcres)=>{
      this.setState({
      srcimg:srcres
      })
      }
      })

  }

  render() {
    const { cpCarloadConstructionFormGet } = this.props;

    const {srcimg,srcimg1 } = this.state

    return (
      <div style={{color:'#000',overflow:'hidden',paddingLeft:'6mm',paddingRight:'6mm',width:'200mm',boxSizing:'border-box'}}>
        <p> &nbsp;</p>
            {/* <table
          style={{ width: '188mm', clear: 'both', fontSize: '14px' }}
          cellSpacing={0}
          cellPadding={0}
          border={0}
          align="left"
        >
          <tbody>
            <tr>
              <td style={{ width: '375px' }}> &nbsp;</td>
              <td style={{ textAlign: 'right', width: '374px' }}>
                <span>
                  <span style={{ fontFamily: 'C39HrP60DlTt', fontSize: '50px' }}>
                    *AA0104190918001*
                  </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table> */}
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
                  <span style={{fontSize:'14px'}}>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                  <br /> <strong style={{ fontSize: '24px' }}>整车施工单 &nbsp;&nbsp;</strong>
                </strong>
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
        {/* <div style={{ display: 'block', textAlign: 'center', clear: 'both' }}>
          <div
            style={{
              height: '15mm',
              overflow: 'hidden',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <span>
              <span style={{ fontFamily: 'C39HrP60DlTt', fontSize: '30px' }}>
                *FM0141RM191230023*
              </span>
            </span>
          </div>
        </div>
        <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '198mm', fontSize: '14px', clear: 'both', backgroundColor: '#fff' }}
        >
          <tbody>
            <tr>
              <td style={{ width: '20mm', height: '15mm', textAlign: 'center' }}>
                <span>
                <img src="./XFM_Logo.jpg" width={60} />
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <p>
                  <strong style={{ fontSize: '20px' }}>
                    <span>上海新孚美-BYD</span>
                  </strong>
                  <br />
                  <strong style={{ fontSize: '20px' }}>
                    <span>Shanghai xinfumei-BYD</span>
                  </strong>
                </p>
                <p>
                  <strong style={{ fontSize: '28px' }}>AT施工单 &nbsp; &nbsp; &nbsp;&nbsp;</strong>
                </p>
              </td>
            </tr>
          </tbody>
        </table> */}
        <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          //  textAlign: 'left',
          style={{ width: '188mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            <tr>
              <td
                colSpan={6}
                style={{ height: '8mm', textAlign: 'center', background: 'rgb(153, 153, 153)' }}
                
              >
                {/* <span style={{ fontSize: '14px' }}> */}
                  <strong>基础信息</strong>
                {/* </span> */}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  height: '7mm',
                  width: '95px',
                  textAlign: 'right',
                  background: 'rgb(204, 204, 204)',
                }}
              >
                
                <span style={{ fontSize: '14px' }} nowrap="nowrap">单据状态：</span>
              </td>
              <td
                style={{
                  width: '20%',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <span>
                  {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.orderStatus)?cpCarloadConstructionFormGet.orderStatus:''}
                </span>
              </td>
              <td style={{  textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                订单编号：
              </td>
              <td style={{ width: '22%', borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.orderCode)
                      ? cpCarloadConstructionFormGet.orderCode
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{  textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                订单日期：
              </td>
              <td
                style={{
                  width: '20%',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <span> {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.createDate)
                      ? cpCarloadConstructionFormGet.createDate
                      : ''}</span>
              </td>
            </tr>
             <tr>
              <td style={{ height: '7mm', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                维修班组：
              </td>
              <td
                style={{
                  width: '23%',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <div>
                {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceCrew)&&(cpCarloadConstructionFormGet.maintenanceCrew.name) ? cpCarloadConstructionFormGet.maintenanceCrew.name : ''}
                </div>
              </td>
              <td style={{ width: '10%', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                下单人：
              </td>
              <td style={{ width: '23%', borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                  {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.createBy)&&(cpCarloadConstructionFormGet.createBy.name) ? cpCarloadConstructionFormGet.createBy.name : ''}
                  </span>
                </div>
              </td>
              <td style={{ width: '10%', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                下单日期：
              </td>
              <td
                style={{
                  width: '23%',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <div>
              <span>{isNotBlank(cpCarloadConstructionFormGet)&&(cpCarloadConstructionFormGet.finishDate) ? cpCarloadConstructionFormGet.finishDate : ''}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ height: '7mm', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                客户：
              </td>
              <td
                style={{
                  width: '23%',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client)&& isNotBlank(cpCarloadConstructionFormGet.client.clientCpmpany)
                      ? cpCarloadConstructionFormGet.client.clientCpmpany
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ height: '7mm', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                客户编号：
              </td>
              <td
                style={{
                  width: '23%',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.client) && isNotBlank(cpCarloadConstructionFormGet.client.code)? cpCarloadConstructionFormGet.client.code : ''}
                  </span>
                </div>
              </td>
              <td style={{ height: '7mm', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                保险公司：
              </td>
              <td
                style={{
                  width: '22%',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.insuranceCompanyId)? cpCarloadConstructionFormGet.insuranceCompanyId : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', height: '8mm', background: 'rgb(153, 153, 153)' }}
              >
                <strong>
                业务员信息
                </strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}
              nowrap="nowrap"
              >
                分公司：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) &&
                    isNotBlank(cpCarloadConstructionFormGet.user) &&
                    isNotBlank(cpCarloadConstructionFormGet.user.office)&&
                    isNotBlank(cpCarloadConstructionFormGet.user.office.name)
                      ? cpCarloadConstructionFormGet.user.office.name
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                业务员:
              </td>
              <td
                
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <span>{isNotBlank(cpCarloadConstructionFormGet) &&
                    isNotBlank(cpCarloadConstructionFormGet.user) &&
                    isNotBlank(cpCarloadConstructionFormGet.user.name)
                      ? cpCarloadConstructionFormGet.user.name
                      : ''}</span>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                员工编码：
              </td>
              <td
                
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                }}
              >
                <span>
                  {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.user)&& isNotBlank(cpCarloadConstructionFormGet.user.no)
                    ? cpCarloadConstructionFormGet.user.no
                    : ''}
                </span>
              </td>
            </tr>   
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', height: '8mm', background: 'rgb(153, 153, 153)' }}
              >
                <strong>
                  <span style={{ fontSize: '14px' }}>产品信息</span>
                </strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                总成型号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpCarloadConstructionFormGet) &&
                  isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) &&
                  isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyModel)
                    ? cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyModel
                    : ''}
                </span>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                年份：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpCarloadConstructionFormGet) &&
                  isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) &&
                  isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyYear)
                    ? cpCarloadConstructionFormGet.cpAssemblyBuild.assemblyYear
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                品牌：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.brand)
                    ? cpCarloadConstructionFormGet.brand
                    : ''}
                </span>
              </td>
            </tr>
            <tr> 
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                车型\排量：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  width: '23%',
                  height: '7%',
                }}
              >
                <span>
                  {isNotBlank(cpCarloadConstructionFormGet) &&
                  isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild) &&
                  isNotBlank(cpCarloadConstructionFormGet.cpAssemblyBuild.vehicleModel)
                    ? cpCarloadConstructionFormGet.cpAssemblyBuild.vehicleModel
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                VIN码：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyVin)
                      ? cpCarloadConstructionFormGet.assemblyVin
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                钢印号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblySteelSeal)
                      ? cpCarloadConstructionFormGet.assemblySteelSeal
                      : ''}
                  </span>
                </div>
              </td>
              </tr>
              <tr> 
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                 故障代码:
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyFaultCode)
                      ? cpCarloadConstructionFormGet.assemblyFaultCode
                      : ''}
                  </span>
                </div>
              </td>
              </tr>
              <tr> 
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
              本次故障描述:
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}
              colSpan={5}
              rowSpan={1}
              >
                      <div
                  style={{
                    width: '40mm',
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyErrorDescription)
                      ? cpCarloadConstructionFormGet.assemblyErrorDescription
                      : ''}
                </div>
              </td>
              </tr>
              <tr>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                其他信息：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}
              colSpan={5}
              rowSpan={1}
              >
                <div
                  style={{
                    width: '40mm',
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.assemblyMessage)
                    ? cpCarloadConstructionFormGet.assemblyMessage
                    : ''}
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', height: '8mm', background: 'rgb(153, 153, 153)' }}
              >
                <b>一级信息</b>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                外观要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                      {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.guiseNeed) ? cpCarloadConstructionFormGet.guiseNeed : ''}
                  </span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                物流要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>{isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.logisticsNeed) ? cpCarloadConstructionFormGet.logisticsNeed : ''}</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                质量要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.qualityNeed)
                      ? cpCarloadConstructionFormGet.qualityNeed
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap"> 
                安装指导:
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                    <span>{isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.installationGuide) ? cpCarloadConstructionFormGet.installationGuide : ''}</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                油品要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.oilsNeed)
                      ? cpCarloadConstructionFormGet.oilsNeed
                      : ''}
                  </span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                旧件：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.oldNeed)
                      ? cpCarloadConstructionFormGet.oldNeed
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                其他约定事项：
              </td>
              <td
                colSpan={5}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  textAlign: 'left',
                  width: '170px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    // width: '170mm',
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                  }}
                >
                  {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.otherBuiness) ? cpCarloadConstructionFormGet.otherBuiness : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', height: '8mm', background: 'rgb(153, 153, 153)' }}
              >
                <span style={{ fontSize: '14px' }}>
                  <strong>其他信息</strong>
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                交货日期：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                <span>{isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.deliveryDate) ? (cpCarloadConstructionFormGet.deliveryDate) : ''}</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                里程：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
          <span>{isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.tripMileage) ? cpCarloadConstructionFormGet.tripMileage : ''}</span>
                </div>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                车牌号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.plateNumber)
                      ? cpCarloadConstructionFormGet.plateNumber
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
                 <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                检测人：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.testingUser)
                      ? cpCarloadConstructionFormGet.testingUser
                      : ''}
                  </span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                维修项目：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <strong>
                    <span >
                      <span>
                        {isNotBlank(cpCarloadConstructionFormGet) &&
                        isNotBlank(cpCarloadConstructionFormGet.maintenanceProject)
                          ? cpCarloadConstructionFormGet.maintenanceProject
                          : ''}
                      </span>
                    </span>
                  </strong>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                是否拍照：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.isPhotograph)
                      ? cpCarloadConstructionFormGet.isPhotograph
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                检测结果：
              </td>
              <td
                colSpan={3}
                style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', width: '170mm' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span
                    style={{
                      display: 'block',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.carloadTestingResult) ? cpCarloadConstructionFormGet.carloadTestingResult : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                故障编码：
              </td>
              <td
                style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', width: '170mm' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span
                    style={{
                      display: 'block',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.carloadFaultCode) ? cpCarloadConstructionFormGet.carloadFaultCode : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                发货地址：
              </td>
              <td
                colSpan={5}
                style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', width: '170mm' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span
                    style={{
                      display: 'block',
                      // width: '170mm',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.shipAddress) ? cpCarloadConstructionFormGet.shipAddress : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                维修历史：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div>
                    <span
                      style={{
                        display: 'block',
                        // width: '170mm',
                        wordBreak: 'keep-all',
                        wordWrap: 'break-word',
                      }}
                    >
                      {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.maintenanceHistory)
                        ? cpCarloadConstructionFormGet.maintenanceHistory
                        : ''}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                备注：
              </td>
              <td
                colSpan={5}
                style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', width: '170px' }}
              >
                <div>
                  <span
                    style={{
                      display: 'block',
                      // width: '170mm',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {isNotBlank(cpCarloadConstructionFormGet) && isNotBlank(cpCarloadConstructionFormGet.remarks)
                      ? cpCarloadConstructionFormGet.remarks
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
             <tr>
              <td
                colSpan={6}
                style={{ height: '8mm', textAlign: 'center', background: 'rgb(153, 153, 153)' }}
              >
                <strong style={{ backgroundColor: 'rgb(153, 153, 153)' }}>整车登记</strong>
              </td>
            </tr>
            <tr>
              <td nowrap="noWrap" style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                随车物品：
              </td>
              <td
                colSpan={5}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderRightWidth: '1px',
                  borderRightStyle: 'solid',
                  borderTopWidth: '1px',
                  borderTopStyle: 'solid',
                  height: '7mm',
                  borderBottom: '1px solid #000000',
                }}
              >
                <div>
                  <span></span>
                </div>
              </td>
            </tr> 
            <tr>
              <td style={{ height: '7mm', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                <span style={{ fontSize: '14px' }}>仪表显示：</span>
              </td>
              <td style={{ width: '23%', borderBottomWidth: '1px' }}>
                <div>
                  <span></span>
                </div>
              </td>
              <td style={{ width: '10%', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                行驶证：
              </td>
              <td style={{ width: '23%' }}>
                <div>
                  <span></span>
                </div>
              </td>
              <td style={{ width: '10%', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                其他信息：
              </td>
              <td style={{ width: '23%', borderBottomWidth: '1px' }}>
                <div>
                  <span></span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '20mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                备注：
              </td>
              <td colSpan={5} style={{ height: '30mm', border: '1px solid #000000' }}>
                <div>
                  <span>
                  </span>
                </div>
              </td>
            </tr> 
             <tr>
              <td style={{ textAlign: 'right', height: '20mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                附加信息：
              </td>
              <td colSpan={5} style={{ height: '30mm', border: '1px solid #000000' }}>
                <div>
                  <span></span>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={6}  style={{ textAlign: 'center' }}>
                地址：<span>上海市闵行区兴梅路658号C座</span>&nbsp;&nbsp; 电话：
                <span>021-54856975</span>&nbsp;&nbsp; 传真：<span>021-64051851</span>
                &nbsp;&nbsp; 网址：<span>www.fm960.com.cn</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Task_Zc_Construction;

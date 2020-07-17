/**
 * 业务管理 -> At施工单 完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpAtWorkForm, loading }) => ({
  ...cpAtWorkForm,
  submitting: loading.effects['form/submitRegularForm'],
}))
class Task_At_Construction extends PureComponent {

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
      type: 'cpAtWorkForm/cpAtWorkForm_Get',
      payload: {
        id: isNotBlank(location)&&isNotBlank(location.query)&&isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn:1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'ATSGD'
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
      type:'0'
      },
      callback:(srcres)=>{
      this.setState({
      srcimg:srcres
      })
      }
      })

  }

  render() {
    const { cpAtWorkFormGet } = this.props;
    const {srcimg,srcimg1 } = this.state

    return (
      <div style={{color:'#000',overflow:'hidden',paddingLeft:'6mm',paddingRight:'6mm',width:'200mm',boxSizing:'border-box'}}>
        <p> &nbsp;</p>
            {/* <table
          style={{ width: '200mm', clear: 'both', fontSize: '14px' }}
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
                  <br /> <strong style={{ fontSize: '24px' }}>总成施工单 &nbsp;&nbsp;</strong>
                </strong>
              </td>     <td style={{ textAlign: 'center', height: '20mm' }}>
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
          style={{ width: '188mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            <tr>
              <td
                colSpan={6}
                style={{ height: '8mm', textAlign: 'center', background: 'rgb(153, 153, 153)' }}
              >
                  <strong>基础信息</strong>
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
                  {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.orderStatus)?cpAtWorkFormGet.orderStatus:''}
                </span>
              </td>
              <td style={{  textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                订单编号：
              </td>
              <td style={{ width: '23%', borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.orderCode)
                      ? cpAtWorkFormGet.orderCode
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
                <span> {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.createDate)
                      ? cpAtWorkFormGet.createDate
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
                {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.maintenanceCrew)&&(cpAtWorkFormGet.maintenanceCrew.name) ? cpAtWorkFormGet.maintenanceCrew.name : ''}
                </div>
              </td>
              <td style={{ width: '10%', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                下单人：
              </td>
              <td style={{ width: '23%', borderBottom: '1px solid #000000' }}>
                <div>
                  <span> {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.createBy)&&(cpAtWorkFormGet.createBy.name) ? cpAtWorkFormGet.createBy.name : ''}</span>
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
                  <span>{isNotBlank(cpAtWorkFormGet)&&(cpAtWorkFormGet.finishDate) ? cpAtWorkFormGet.finishDate : ''}</span>
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client)&& isNotBlank(cpAtWorkFormGet.client.clientCpmpany)
                      ? cpAtWorkFormGet.client.clientCpmpany
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.client)&&isNotBlank(cpAtWorkFormGet.client.code) ? cpAtWorkFormGet.client.code : ''}
                  </span>
                </div>
              </td>
              <td style={{ height: '7mm', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                保险公司：
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.insuranceCompanyId) ? cpAtWorkFormGet.insuranceCompanyId : ''}
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
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                分公司：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) &&
                    isNotBlank(cpAtWorkFormGet.user) &&
                    isNotBlank(cpAtWorkFormGet.user.office)
                    &&isNotBlank(cpAtWorkFormGet.user.office.name)
                      ? cpAtWorkFormGet.user.office.name
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
                <span>{isNotBlank(cpAtWorkFormGet) &&
                    isNotBlank(cpAtWorkFormGet.user) &&
                    isNotBlank(cpAtWorkFormGet.user.name)
                      ? cpAtWorkFormGet.user.name
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
                  {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.user)&& isNotBlank(cpAtWorkFormGet.user.no)
                    ? cpAtWorkFormGet.user.no
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
                  {isNotBlank(cpAtWorkFormGet) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.assemblyModel)
                    ? cpAtWorkFormGet.cpAssemblyBuild.assemblyModel
                    : ''}
                </span>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                年份：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAtWorkFormGet) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.assemblyYear)
                    ? cpAtWorkFormGet.cpAssemblyBuild.assemblyYear
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                品牌：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.brand)
                    ? cpAtWorkFormGet.brand
                    : ''}
                </span>
              </td>
              {/* <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                大号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>6HDT35-...</span>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                小号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>1...</span>
              </td> */}
            </tr>
            {/* <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                技术参数：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                年份：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpAtWorkFormGet) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.assemblyYear)
                    ? cpAtWorkFormGet.cpAssemblyBuild.assemblyYear
                    : ''}
                </span>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                总成号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>6HDT35-1...</span>
              </td>
            </tr>*/}
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
                  {isNotBlank(cpAtWorkFormGet) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild) &&
                  isNotBlank(cpAtWorkFormGet.cpAssemblyBuild.vehicleModel)
                    ? cpAtWorkFormGet.cpAssemblyBuild.vehicleModel
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                VIN码：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyVin)
                      ? cpAtWorkFormGet.assemblyVin
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblySteelSeal)
                      ? cpAtWorkFormGet.assemblySteelSeal
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyFaultCode)
                      ? cpAtWorkFormGet.assemblyFaultCode
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyErrorDescription)
                      ? cpAtWorkFormGet.assemblyErrorDescription
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
                  {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyMessage)
                    ? cpAtWorkFormGet.assemblyMessage
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
                      {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.guiseNeed) ? cpAtWorkFormGet.guiseNeed : ''}
                  </span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                物流要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>{isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.logisticsNeed) ? cpAtWorkFormGet.logisticsNeed : ''}</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                质量要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.qualityNeed)
                      ? cpAtWorkFormGet.qualityNeed
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
                    <span>{isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.installationGuide) ? cpAtWorkFormGet.installationGuide : ''}</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                油品要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.oilsNeed)
                      ? cpAtWorkFormGet.oilsNeed
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.oldNeed)
                      ? cpAtWorkFormGet.oldNeed
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
                    width: '170mm',
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                  }}
                >
                  {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.otherBuiness) ? cpAtWorkFormGet.otherBuiness : ''}
                </span>
              </td>
            </tr>
            {/* <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', height: '8mm', background: 'rgb(153, 153, 153)' }}
              >
                <strong>
                  <span style={{ fontSize: '14px' }}>二级信息</span>
                </strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                外观要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.guiseNeed)
                      ? cpAtWorkFormGet.guiseNeed
                      : ''}
                  </span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                覆盖件：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>无...</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                安装指导：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.installationGuide)
                      ? cpAtWorkFormGet.installationGuide
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                包装要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>...</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                其他约定事项：
              </td>
              <td
                colSpan={3}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.otherBuiness)
                      ? cpAtWorkFormGet.otherBuiness
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', height: '8mm', background: 'rgb(153, 153, 153)' }}
              >
                <span style={{ fontSize: '14px' }}>
                  <b>故障现象</b>
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                故障描述：
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
                    width: '170mm',
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                  }}
                >
                  {isNotBlank(cpAtWorkFormGet) &&
                  isNotBlank(cpAtWorkFormGet.assemblyErrorDescription)
                    ? cpAtWorkFormGet.assemblyErrorDescription
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                售后故障反馈：
              </td>
              <td
                colSpan={5}
                
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                  textAlign: 'left',
                }}
              >
                <div>
                  <span>...</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                故障代码：
              </td>
              <td
                colSpan={3}
                
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0, 0, 0)',
                  textAlign: 'left',
                }}
              >
                <span>
                  {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.assemblyFaultCode)
                    ? cpAtWorkFormGet.assemblyFaultCode
                    : ''}
                </span>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                引擎转速：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                运动状态：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>...</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                冷车\热车：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>...</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                发生频率：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>...</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                档位：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>...</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                车速：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>...</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }}>
                维修类型：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>...</span>
                </div>
              </td>
            </tr> */}
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
                <span>{isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.deliveryDate) ? cpAtWorkFormGet.deliveryDate : null}</span>
                </div>
              </td>
              <td  style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                里程：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
          <span>{isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.tripMileage) ? cpAtWorkFormGet.tripMileage : ''}</span>
                </div>
              </td>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                车牌号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.plateNumber)
                      ? cpAtWorkFormGet.plateNumber
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.testingUser)
                      ? cpAtWorkFormGet.testingUser
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
                    <span style={{ color: 'rgb(255, 0, 0)' }}>
                      <span>
                        {isNotBlank(cpAtWorkFormGet) &&
                        isNotBlank(cpAtWorkFormGet.maintenanceProject)
                          ? cpAtWorkFormGet.maintenanceProject
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
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.isPhotograph)
                      ? cpAtWorkFormGet.isPhotograph
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
                      // width: '170mm',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.carloadTestingResult) ? cpAtWorkFormGet.carloadTestingResult : ''}
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
                      // width: '170mm',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.carloadFaultCode) ? cpAtWorkFormGet.carloadFaultCode : ''}
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
                      width: '170mm',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.shipAddress) ? cpAtWorkFormGet.shipAddress : ''}
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
                        width: '170mm',
                        wordBreak: 'keep-all',
                        wordWrap: 'break-word',
                      }}
                    >
                      {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.maintenanceHistory)
                        ? cpAtWorkFormGet.maintenanceHistory
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
                      width: '170mm',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    
                    {isNotBlank(cpAtWorkFormGet) && isNotBlank(cpAtWorkFormGet.remarks)
                      ? cpAtWorkFormGet.remarks
                      : ''}
                  </span>
                </div>
              </td>
            </tr>

            {/* <tr>
              <td style={{ textAlign: 'right', height: '7mm', background: 'rgb(204, 204, 204)' }}>
                附加信息：
              </td>
              <td colSpan={5}  style={{ borderBottom: '1px solid #000000'}}>
                <div
                // style={{  width: '170mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}
                >
                  <span
                    style={{
                      display: 'block',
                      // width: '170mm',
                      // wordBreak: 'keep-all',
                      // wordWrap: 'break-word',
                    }}
                  >
                    海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号
                    海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号
                    海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号海市闵行区兴梅路658号
                  </span>
                </div>
              </td>
            </tr> */}
            {/* <tr>
              <td
                colSpan={6}
                style={{ height: '8mm', textAlign: 'center', background: 'rgb(153, 153, 153)' }}
              >
                <b>结束</b>
              </td>
            </tr> */}
          </tbody>
        </table>

        <p> &nbsp;</p>
        <div style={{ clear: 'both', width: '188mm', display: 'block' }}>
          地址：<span>上海市闵行区兴梅路658号</span>&nbsp; 电话：<span>021-54856975</span>传真：
          <span>021-64051851</span>&nbsp;网址：<span>www.fm960.com.cn</span>
        </div>
      </div>
    );
  }
}

export default Task_At_Construction;

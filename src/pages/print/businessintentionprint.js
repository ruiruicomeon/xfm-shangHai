/**
 * 业务意向单  完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpBusinessIntention, loading }) => ({
  ...cpBusinessIntention,
  submitting: loading.effects['form/submitRegularForm'],
}))
class businessintentionprint extends PureComponent {

  constructor(props) {
		super(props);
		this.state = {
      srcimg:''
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpBusinessIntention/cpBusinessIntention_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn:1
      },
      callback: () => {
        setTimeout(() => {
          window.print()
        }, 1000); 
      },
    });

    dispatch({
      type: 'sysarea/getFlatCode',
      payload:{
        id:isNotBlank(location.query.id) ? location.query.id : '',
        type:'YWY'
      },
      callback:(res)=>{
        this.setState({
          srcimg:res
        })
      }
    })


  }

  render() {
    const { cpBusinessIntentionGet } = this.props;
    const {srcimg} = this.state

    return (
      <div style={{ color: '#000' ,paddingLeft:'6mm',paddingRight:'6mm',width:'200mm',boxSizing:'border-box' }}>
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
                  <br /> <strong style={{ fontSize: '24px' }}>业务意向单 &nbsp;&nbsp;</strong>
                </strong>
              </td>
              <td style={{ textAlign: 'center', width: '20mm', height: '20mm' }}>
                <span style={{marginLeft:'10px',display:'inline-block'}}>
                  <img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} width={80} />
                  <p style={{textAlign:'center'}}>单号</p>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <table
          style={{ width: '188mm', clear: 'both', fontSize: '14px' }}
          cellSpacing={0}
          cellPadding={0}
          border={0}
          align="left"
        >
          <tbody>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '8mm' }}
              >
                <strong>基础信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)',width: '9px', height: '7mm' }} nowrap="noWrap">
                单据状态：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '168px',
                }}
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.orderStatus) ? cpBusinessIntentionGet.orderStatus : ''}
                </span>
              </td>
              {/* <td style={{ textAlign: 'right', width: '90px', background: 'rgb(204, 204, 204)' }}>
                意向单类型：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '168px',
                }}
              >
                <span>常规...</span>
              </td> */}
              <td style={{ textAlign: 'right', width: '80px', background: 'rgb(204,204,204)' }} nowrap="noWrap">
                订单日期：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '170px',
                }}
              >
                <span> {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.createDate) ? cpBusinessIntentionGet.createDate : ''}</span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '8mm' }}
              >
                <strong>业务员信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                分公司：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.user) &&
                    isNotBlank(cpBusinessIntentionGet.user.office) &&
                    isNotBlank(cpBusinessIntentionGet.user.office.name)
                    ? cpBusinessIntentionGet.user.office.name
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}  nowrap="nowrap">
                业务员：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) && isNotBlank(cpBusinessIntentionGet.user.name)
                    ? cpBusinessIntentionGet.user.name
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                员工编码：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) && isNotBlank(cpBusinessIntentionGet.user.no)
                    ? cpBusinessIntentionGet.user.no
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                所属大区：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.user) &&
                    isNotBlank(cpBusinessIntentionGet.user.area) &&
                    isNotBlank(cpBusinessIntentionGet.user.area.name)
                    ? cpBusinessIntentionGet.user.area.name
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                所属公司：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) && isNotBlank(cpBusinessIntentionGet.user.office) ? cpBusinessIntentionGet.user.office.name : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                所属部门：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.user) && isNotBlank(cpBusinessIntentionGet.user.dept) ? cpBusinessIntentionGet.user.dept.name : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '8mm' }}
              >
                <strong>客户信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                客户分类：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.client) &&
                    isNotBlank(cpBusinessIntentionGet.client.classify)
                    ? cpBusinessIntentionGet.client.classify
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                联系人  ：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px', 
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>{isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client) ? cpBusinessIntentionGet.client.name : ''}</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                客户编号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)
                    && isNotBlank(cpBusinessIntentionGet.client.code)
                    ? cpBusinessIntentionGet.client.code
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                客户：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.client) &&
                    isNotBlank(cpBusinessIntentionGet.client.clientCpmpany) 
                    ? cpBusinessIntentionGet.client.clientCpmpany
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                联系人：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)
                    && isNotBlank(cpBusinessIntentionGet.client.name)
                    ? cpBusinessIntentionGet.client.name
                    : ''}
                </span>
              </td> */}
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                联系方式：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
             
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)
                    && isNotBlank(cpBusinessIntentionGet.client.phone)
                    ? cpBusinessIntentionGet.client.phone
                    : ''}
                </span>
              </td>
              {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                电话\传真：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span />
              </td> */}
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                联系地址：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.client)
                    && isNotBlank(cpBusinessIntentionGet.client.address)
                    ? cpBusinessIntentionGet.client.address
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '8mm' }}
              >
                <strong>产品信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                总成型号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.assemblyModel)
                    ? cpBusinessIntentionGet.assemblyModel
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                钢印号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>{isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.assemblySteelSeal) ? cpBusinessIntentionGet.assemblySteelSeal : ''}</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                VIN码：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>{isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.assemblyVin) ? cpBusinessIntentionGet.assemblyVin : ''}</span>
              </td>
            </tr>
            <tr>
              {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                技术参数：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>1...</span>
              </td> */}
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                年份：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.assemblyYear)
                    ? cpBusinessIntentionGet.assemblyYear
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                品牌：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.assemblyBrand)
                    ? cpBusinessIntentionGet.assemblyBrand
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                车型\排量：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.assemblyVehicleEmissions)
                    ? cpBusinessIntentionGet.assemblyVehicleEmissions
                    : ''}
                </span>
              </td>
              {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                总成号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>1...</span>
              </td> */}
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                其他信息：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
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
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.assemblyMessage)
                    ? cpBusinessIntentionGet.assemblyMessage
                    : ''}
                </div>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                故障代码：
              </td>
              <td
                colSpan={3}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
 
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.assemblyFaultCode)
                    ? cpBusinessIntentionGet.assemblyFaultCode
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                故障描述：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
   
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
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.assemblyErrorDescription)
                    ? cpBusinessIntentionGet.assemblyErrorDescription
                    : ''}
                </div>
              </td>
            </tr>

            {/* <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '5mm' }}
              >
                <b>故障现象</b>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                故障描述：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                  isNotBlank(cpBusinessIntentionGet.assemblyErrorDescription)
                    ? cpBusinessIntentionGet.assemblyErrorDescription
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                故障代码：
              </td>
              <td
                colSpan={3}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                  isNotBlank(cpBusinessIntentionGet.assemblyFaultCode)
                    ? cpBusinessIntentionGet.assemblyFaultCode
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                引擎转速：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>1...</span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                运动状态：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>滑行状态...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                冷车\热车：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>冷车状态...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                发生频率：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>经常发生...</span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                档位：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>1...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                车速：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>1...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                维修类型：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>...</span>
              </td>
            </tr> */}
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '8mm' }}
              >
                <strong>一级信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                意向价格：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
             
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.intentionPrice)
                    ? getPrice(cpBusinessIntentionGet.intentionPrice)
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                付款方式：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.paymentMethod)
                    ? cpBusinessIntentionGet.paymentMethod
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                质量要求：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.qualityNeed)
                    ? cpBusinessIntentionGet.qualityNeed
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                开票信息：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
      
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.makeNeed)
                    ? cpBusinessIntentionGet.makeNeed
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                物流要求：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
    
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.logisticsNeed)
                    ? cpBusinessIntentionGet.logisticsNeed
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                旧件：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
    
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.oldNeed)
                    ? cpBusinessIntentionGet.oldNeed
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                交货日期：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.deliveryDate)
                    ? cpBusinessIntentionGet.deliveryDate
                    : null}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                质保时间：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                 <span>{isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.qualityTime) && cpBusinessIntentionGet.qualityTime!=',' ?  `${cpBusinessIntentionGet.qualityTime.split(',')[0]}年${cpBusinessIntentionGet.qualityTime.split(',')[1]}个月` : ''}</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                外观要求：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.guiseNeed)
                    ? cpBusinessIntentionGet.guiseNeed
                    : ''}
                </span>
              </td>
            </tr>
            {/* <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                质保时间：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                 <span>{isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.qualityTime) && cpBusinessIntentionGet.qualityTime!=',' ?  `${cpBusinessIntentionGet.qualityTime.split(',')[0]}年${cpBusinessIntentionGet.qualityTime.split(',')[1]}个月` : ''}</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                外观要求：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.guiseNeed)
                    ? cpBusinessIntentionGet.guiseNeed
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                质量要求：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>{isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.qualityNeed) ? cpBusinessIntentionGet.qualityNeed : ''}</span>
              </td>
            </tr> */}
            {/* <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '5mm' }}
              >
                <strong>二级信息</strong>
              </td>
            </tr> */}
            <tr>

              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                安装指导：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.installationGuide)
                    ? cpBusinessIntentionGet.installationGuide
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                油品要求：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.oilsNeed)
                    ? cpBusinessIntentionGet.oilsNeed
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                其他约定：
              </td>
              <td
                colSpan={3}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.otherBuiness)
                    ? cpBusinessIntentionGet.otherBuiness
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '8mm' }}
              >
                <strong>其他信息</strong>
              </td>
            </tr>
            <tr>
              {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                维修公司：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span />
              </td> */}
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                维修项目：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.maintenanceProject)
                    ? cpBusinessIntentionGet.maintenanceProject
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                里程：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.tripMileage)
                    ? cpBusinessIntentionGet.tripMileage
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                保险公司：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.insuranceCompanyId)
                    ? cpBusinessIntentionGet.insuranceCompanyId
                    : ''}
                </span>
              </td>
            </tr>
            {/* <tr> */}
            {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                钢印号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                  isNotBlank(cpBusinessIntentionGet.assemblySteelSeal)
                    ? cpBusinessIntentionGet.assemblySteelSeal
                    : ''}
                </span>
              </td> */}
            {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                车架号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>1...</span>
              </td> */}
            {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                保险公司：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                nowrap="nowrap"
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                  isNotBlank(cpBusinessIntentionGet.insuranceCompanyId)
                    ? cpBusinessIntentionGet.insuranceCompanyId
                    : ''}
                </span>
              </td> */}
            {/* </tr> */}
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }}>
                车牌号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.plateNumber)
                    ? cpBusinessIntentionGet.plateNumber
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                是否拍照：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.isPhotograph)
                    ? cpBusinessIntentionGet.isPhotograph
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                事故单号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.accidentNumber)
                    ? cpBusinessIntentionGet.accidentNumber
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                事故说明：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.accidentExplain)
                    ? cpBusinessIntentionGet.accidentExplain
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                维修历史：
              </td>
              <td
                colSpan={5}
                rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
               
              >
                <span>
                  {isNotBlank(cpBusinessIntentionGet) &&
                    isNotBlank(cpBusinessIntentionGet.maintenanceHistory)
                    ? cpBusinessIntentionGet.maintenanceHistory
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="noWrap">
                备注：
              </td>
              <td colSpan={5} rowSpan={1} nowrap="nowrap">
                <span>
                  {isNotBlank(cpBusinessIntentionGet) && isNotBlank(cpBusinessIntentionGet.remarks)
                    ? cpBusinessIntentionGet.remarks
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  borderTopWidth: '1px',
                  borderTopColor: 'rgb(0,0,0)',
                  borderTopStyle: 'solid',
                  borderLeftWidth: '1px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: 'rgb(0,0,0)',
                  textAlign: 'right',
                }}
                nowrap="nowrap"
              >
                客户确认：
              </td>
              <td
                colSpan={5}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  borderRightWidth: '1px',
                  borderRightStyle: 'solid',
                  borderTopColor: 'rgb(0,0,0)',
                  borderTopWidth: '1px',
                  borderTopStyle: 'solid',
                  height: '10mm',
                  borderRightColor: 'rgb(0,0,0)',
                }}
              >
                &nbsp;
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                下单人：
              </td>
              <td style={{ height: '8mm' }}>
                <span />
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                经手人：
              </td>
              <td nowrap="nowrap"> &nbsp;</td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                客户签字：
              </td>
              <td nowrap="nowrap"> &nbsp;</td>
            </tr>
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', paddingTop: '5px' }} >
                地址：<span>上海市闵行区兴梅路658号C座</span>&nbsp; &nbsp;电话：
                <span>021-54856975 021-51078886</span>&nbsp; &nbsp;传真：<span>021-64051851</span>
                &nbsp; &nbsp; 网址：<span>www.fm960.com.cn</span>
                <br /> &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default businessintentionprint;

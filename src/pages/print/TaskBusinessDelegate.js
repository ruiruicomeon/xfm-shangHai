/**
 * 业务管理 -> 业务委托单   完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpBusinessOrder, loading }) => ({
  ...cpBusinessOrder,
  submitting: loading.effects['form/submitRegularForm'],
}))
class TaskBusinessDelegate extends PureComponent {

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
      type: 'cpBusinessOrder/cpBusinessOrder_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn:1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'YWW'
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
      type:'YWW'
      },
      callback:(srcres)=>{
      this.setState({
      srcimg:srcres
      })
      }
      })
  }

  render() {
    const { cpBusinessOrderGet } = this.props;
    const {srcimg,srcimg1} =this.state

    return (
      <div style={{ color: '#000',paddingLeft:'6mm',paddingRight:'6mm',width:'200mm',boxSizing:'border-box' }}>
        <p> &nbsp;</p>
        {/* <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '200mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            <tr>
              <td style={{ width: '374.953125px' }}>
                <span>
                  <span style={{ fontFamily: 'C39HrP60DlTt', fontSize: '30px' }}>
                    *FM0509BFD191226001*
                  </span>
                </span>
              </td>
              <td style={{ textAlign: 'right', width: '374.953125px' }}>
                <span>
                  <span style={{ fontFamily: 'C39HrP60DlTt', fontSize: '30px' }}>
                    *AB0509191226003*
                  </span>
                </span>
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
              <td style={{ width: '20mm', height: '20mm', textAlign: 'center' }}>
                <span>
                  <img src="./XFM_Logo.jpg" width={60} />
                </span>
              </td>
              <td style={{ textAlign: 'center' }} >
                <strong style={{ fontSize: '18px' }}>
                  <span>上海新孚美变速箱技术服务有限公司</span>
                  <br />
                  <span style={{fontSize:'14px'}}>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                </strong>
                <br /> <strong style={{ fontSize: '24px' }}>业务委托单 &nbsp;&nbsp;</strong>
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
                colSpan={6}
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
              <td style={{width: '95px', textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}>单据状态：</td>
              <td style={{ borderBottom: '1px solid #000000', width: '168px' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderStatus)?cpBusinessOrderGet.orderStatus:''}
                </span>
              </td>
              <td
                style={{
                  // width: '168px',
                  width: '80px',
                  textAlign: 'right',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
                nowrap="nowrap"
              >
                订单编号：
              </td>
              <td
                colSpan={3}
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000', width: '147.875px' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.orderCode)
                    ? cpBusinessOrderGet.orderCode
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  width: '73.890625px',
                  textAlign: 'right',
                  backgroundColor: 'rgb(204, 204, 204)',
                }}
                nowrap="nowrap"
              >
                订单日期：
              </td>
              <td style={{ borderBottom: '1px solid #000000', width: '155.171875px' }}>
                <span>{isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.createDate)
                  ? cpBusinessOrderGet.createDate
                  : ''}</span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '5mm' }}
              >
                <strong>业务员信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.user) &&
                    isNotBlank(cpBusinessOrderGet.user.office) &&
                    isNotBlank(cpBusinessOrderGet.user.office.name)
                    ? cpBusinessOrderGet.user.office.name
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.name)
                    ? cpBusinessOrderGet.user.name
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.no)
                    ? cpBusinessOrderGet.user.no
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right',width:'10%', background: 'rgb(204,204,204)' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.user) &&
                    isNotBlank(cpBusinessOrderGet.user.area) &&
                    isNotBlank(cpBusinessOrderGet.user.area.name)
                    ? cpBusinessOrderGet.user.area.name
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.office) ? cpBusinessOrderGet.user.office.name : ''}
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user) && isNotBlank(cpBusinessOrderGet.user.dept) ? cpBusinessOrderGet.user.dept.name : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '5mm' }}
              >
                <strong>客户信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.client) &&
                    isNotBlank(cpBusinessOrderGet.client.classify)
                    ? cpBusinessOrderGet.client.classify
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                联系人：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>{isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)  && isNotBlank(cpBusinessOrderGet.client.name)? cpBusinessOrderGet.client.name : ''}</span>
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    && isNotBlank(cpBusinessOrderGet.client.code)
                    ? cpBusinessOrderGet.client.code
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.client) &&
                    isNotBlank(cpBusinessOrderGet.client.clientCpmpany)? cpBusinessOrderGet.client.clientCpmpany
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    && isNotBlank(cpBusinessOrderGet.client.name)
                    ? cpBusinessOrderGet.client.name
                    : ''}
                </span>
              </td>
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    && isNotBlank(cpBusinessOrderGet.client.phone)
                    ? cpBusinessOrderGet.client.phone
                    : ''}
                </span>
              </td>
              {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                电话\传真：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span />
              </td> */}
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    && isNotBlank(cpBusinessOrderGet.client.address)
                    ? cpBusinessOrderGet.client.address
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '5mm' }}
              >
                <strong>产品信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.assemblyModel)
                    ? cpBusinessOrderGet.assemblyModel
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
                <span>{isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblySteelSeal) ? cpBusinessOrderGet.assemblySteelSeal : ''}</span>
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
                <span>{isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyVin) ? cpBusinessOrderGet.assemblyVin : ''}</span>
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.assemblyYear)
                    ? cpBusinessOrderGet.assemblyYear
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.assemblyBrand)
                    ? cpBusinessOrderGet.assemblyBrand
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.assemblyVehicleEmissions)
                    ? cpBusinessOrderGet.assemblyVehicleEmissions
                    : ''}
                </span>
              </td>
              {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                总成号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.assemblyMessage)
                    ? cpBusinessOrderGet.assemblyMessage
                    : ''}
                </div>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.assemblyFaultCode)
                    ? cpBusinessOrderGet.assemblyFaultCode
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.assemblyErrorDescription)
                    ? cpBusinessOrderGet.assemblyErrorDescription
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
                
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.assemblyErrorDescription)
                    ? cpBusinessOrderGet.assemblyErrorDescription
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
                
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.assemblyFaultCode)
                    ? cpBusinessOrderGet.assemblyFaultCode
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                引擎转速：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
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
                
              >
                <span>滑行状态...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                冷车\热车：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>冷车状态...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                发生频率：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
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
                
              >
                <span>1...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                车速：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>1...</span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                维修类型：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>...</span>
              </td>
            </tr> */}
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '5mm' }}
              >
                <strong>一级信息</strong>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.intentionPrice)
                    ? getPrice(cpBusinessOrderGet.intentionPrice)
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.paymentMethod)
                    ? cpBusinessOrderGet.paymentMethod
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.qualityNeed)
                    ? cpBusinessOrderGet.qualityNeed
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.makeNeed)
                    ? cpBusinessOrderGet.makeNeed
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.logisticsNeed)
                    ? cpBusinessOrderGet.logisticsNeed
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.oldNeed)
                    ? cpBusinessOrderGet.oldNeed
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap" >
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.deliveryDate)
                    ? cpBusinessOrderGet.deliveryDate
                    : null}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.guiseNeed)
                    ? cpBusinessOrderGet.guiseNeed
                    : ''}
                </span>
              </td>
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.installationGuide)
                    ? cpBusinessOrderGet.installationGuide
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.oilsNeed)
                    ? cpBusinessOrderGet.oilsNeed
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap">
                质保时间：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>{isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.qualityTime) && cpBusinessOrderGet.qualityTime!=',' ?  `${cpBusinessOrderGet.qualityTime.split(',')[0]}年${cpBusinessOrderGet.qualityTime.split(',')[1]}个月` : ''}</span>
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
               colSpan={5}
               rowSpan={1}
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.otherBuiness)
                    ? cpBusinessOrderGet.otherBuiness
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', background: 'rgb(153,153,153)', height: '5mm' }}
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.maintenanceProject)
                    ? cpBusinessOrderGet.maintenanceProject
                    : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} nowrap="nowrap" >
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.tripMileage)
                    ? cpBusinessOrderGet.tripMileage
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.insuranceCompanyId)
                    ? cpBusinessOrderGet.insuranceCompanyId
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
                
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.assemblySteelSeal)
                    ? cpBusinessOrderGet.assemblySteelSeal
                    : ''}
                </span>
              </td> */}
            {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
                车架号：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                }}
                
              >
                <span>1...</span>
              </td> */}
            {/* <td style={{ textAlign: 'right', background: 'rgb(204,204,204)' }} >
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
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.insuranceCompanyId)
                    ? cpBusinessOrderGet.insuranceCompanyId
                    : ''}
                </span>
              </td> */}
            {/* </tr> */}
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.plateNumber)
                    ? cpBusinessOrderGet.plateNumber
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.isPhotograph)
                    ? cpBusinessOrderGet.isPhotograph
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.accidentNumber)
                    ? cpBusinessOrderGet.accidentNumber
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.accidentExplain)
                    ? cpBusinessOrderGet.accidentExplain
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
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
                  {isNotBlank(cpBusinessOrderGet) &&
                    isNotBlank(cpBusinessOrderGet.maintenanceHistory)
                    ? cpBusinessOrderGet.maintenanceHistory
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204,204,204)', height: '7mm' }} nowrap="nowrap">
                备注：
              </td>
              <td colSpan={5} rowSpan={1} >
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.remarks)
                    ? cpBusinessOrderGet.remarks
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
            {/* <tr>
              <td
                colSpan={6}
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
              >
                分公司：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.user) &&
                  isNotBlank(cpBusinessOrderGet.user.office)
                    ? cpBusinessOrderGet.user.office.name
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                客户经理：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                员工编码：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.user)
                    ? cpBusinessOrderGet.user.no
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                所属大区：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.user) &&
                  isNotBlank(cpBusinessOrderGet.user.dictArea)
                    ? cpBusinessOrderGet.user.dictArea
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
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
              >
                客户分类：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    ? cpBusinessOrderGet.client.classify
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                客户级别：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>A...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                客户编号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    ? cpBusinessOrderGet.client.code
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                公司名称：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.client) &&
                  isNotBlank(cpBusinessOrderGet.client.user) &&
                  isNotBlank(cpBusinessOrderGet.client.user.office) &&
                  isNotBlank(cpBusinessOrderGet.client.user.office.name)
                    ? cpBusinessOrderGet.client.user.office.name
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                联系人：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    ? cpBusinessOrderGet.client.name
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                联系方式：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  ‭
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    ? cpBusinessOrderGet.client.phone
                    : ''}
                  ‬
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                电话\传真：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
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
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.client)
                    ? cpBusinessOrderGet.client.address
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
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
                <span>VIN</span>：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyVin)
                    ? cpBusinessOrderGet.assemblyVin
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                大号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                小号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                技术参数：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                年份：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) &&
                  isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.assemblyYear)
                    ? cpBusinessOrderGet.cpAssemblyBuild.assemblyYear
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                总成号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                品牌：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.brand)
                    ? cpBusinessOrderGet.brand
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车型\排量：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.cpAssemblyBuild) &&
                  isNotBlank(cpBusinessOrderGet.cpAssemblyBuild.vehicleModel)
                    ? cpBusinessOrderGet.cpAssemblyBuild.vehicleModel
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                其他信息：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <div
                  style={{
                    width: '40mm',
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.assemblyMessage)
                    ? cpBusinessOrderGet.assemblyMessage
                    : ''}
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: 'center',
                 height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <b>故障现象</b>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                故障描述：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.assemblyErrorDescription)
                    ? cpBusinessOrderGet.assemblyErrorDescription
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                故障代码：
              </td>
              <td
                colSpan={3}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.assemblyFaultCode)
                    ? cpBusinessOrderGet.assemblyFaultCode
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                引擎转速：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                运动状态：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>滑行状态...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                冷车\热车：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>冷车状态...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                发生频率：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>经常发生...</span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                档位：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车速：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                维修类型：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>总成维修类型...</span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: 'center',
                 height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>一级信息</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                意向价格：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>1600.0000...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                付款方式：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.paymentMethod)
                    ? cpBusinessOrderGet.paymentMethod
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                质量要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.qualityNeed)
                    ? cpBusinessOrderGet.qualityNeed
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                开票信息：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>增票...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                物流要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.logisticsNeed)
                    ? cpBusinessOrderGet.logisticsNeed
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                旧件：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.oldNeed)
                    ? cpBusinessOrderGet.oldNeed
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                业务类型：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>维修...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                总成类型：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>维修...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                交货日期：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.deliveryDate)
                    ? moment(cpBusinessOrderGet.deliveryDate).format('YYYY-MM-DD')
                    : null}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                保质期：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.qualityTime)
                    ? cpBusinessOrderGet.qualityTime
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                &nbsp;
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                &nbsp;
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                &nbsp;
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                &nbsp;
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: 'center',
                 height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>二级信息</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                外观要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.guiseNeed)
                    ? cpBusinessOrderGet.guiseNeed
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                覆盖件：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>有...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                安装指导：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.installationGuide)
                    ? cpBusinessOrderGet.installationGuide
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                油品要求：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.oilsNeed)
                    ? cpBusinessOrderGet.oilsNeed
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                运费承担：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>其他...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                其他约定：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.otherBuiness)
                    ? cpBusinessOrderGet.otherBuiness
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: 'center',
                 height: '8mm',
                  backgroundColor: 'rgb(153, 153, 153)',
                }}
              >
                <strong>其他信息</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                维修公司：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                维修项目：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.maintenanceProject)
                    ? cpBusinessOrderGet.maintenanceProject
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                里程：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.tripMileage)
                    ? cpBusinessOrderGet.tripMileage
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                钢印号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.assemblySteelSeal)
                    ? cpBusinessOrderGet.assemblySteelSeal
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车架号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>...</span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                保险公司：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.insuranceCompanyId)
                    ? cpBusinessOrderGet.insuranceCompanyId
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                车牌号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.plateNumber)
                    ? cpBusinessOrderGet.plateNumber
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                是否拍照：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.isPhotograph)
                    ? cpBusinessOrderGet.isPhotograph
                    : ''}
                </span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                事故单号：
              </td>
              <td  style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.accidentNumber)
                    ? cpBusinessOrderGet.accidentNumber
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                事故说明：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.accidentExplain)
                    ? cpBusinessOrderGet.accidentExplain
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                维修历史：
              </td>
              <td
                colSpan={5}
                
                rowSpan={1}
                style={{ borderBottom: '1px solid #000000' }}
              >
                <span>
                  {isNotBlank(cpBusinessOrderGet) &&
                  isNotBlank(cpBusinessOrderGet.maintenanceHistory)
                    ? cpBusinessOrderGet.maintenanceHistory
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: 'right', height: '7mm', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                备注：
              </td>
              <td colSpan={5}  rowSpan={1}>
                <span>
                  {isNotBlank(cpBusinessOrderGet) && isNotBlank(cpBusinessOrderGet.remarks)
                    ? cpBusinessOrderGet.remarks
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td
                
                style={{
                  borderTopStyle: 'solid',
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
                colSpan={5}
                style={{
                  borderTopStyle: 'solid',
                  borderRightStyle: 'solid',
                  borderBottomStyle: 'solid',
                  borderTopColor: 'rgb(0, 0, 0)',
                  borderRightColor: 'rgb(0, 0, 0)',
                  borderBottomColor: 'rgb(0, 0, 0)',
                  height: '10mm',
                }}
              >
                &nbsp;
              </td>
            </tr> */}
            <tr>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                下单人：
              </td>
              <td style={{height: '8mm', }}>
                <span></span>
              </td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                经手人：
              </td>
              <td > &nbsp;</td>
              <td
                
                style={{ textAlign: 'right', backgroundColor: 'rgb(204, 204, 204)' }}
              >
                客户签字：
              </td>
              <td > &nbsp;</td>
            </tr>
            {/* <tr>
            {isNotBlank(cpBusinessOrderGet)&&isNotBlank(cpBusinessOrderGet.id)&&<div style={{position:'relative'}}>
			<span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
				单号</span><img src={isNotBlank(srcimg)&&isNotBlank(srcimg.msg)?getFullUrl(`/${srcimg.msg}`):''} style={{width: '60px',height:'60px',}} alt="" /></div>}
        </td>
        <td colSpan={2.5} rowSpan={1} style={{ textAlign: 'center'}}>
				{isNotBlank(cpBusinessOrderGet)&&isNotBlank(cpBusinessOrderGet.orderCode)&&<div style={{position: 'relative'}}>
			<span style={{width:'20px',fontSize:'12px',display:'inline-block',position:'absolute',left:'-20px',top:'50%',transform:'translateY(-50%)'}}>
				编号</span><img src={isNotBlank(srcimg1)&&isNotBlank(srcimg1.msg)?getFullUrl(`/${srcimg1.msg}`):''} style={{width: '60px',height:'60px',}} alt="" /></div>}
           </td>
            </tr> */}
            <tr>
              <td colSpan={6}  style={{ textAlign: 'center' }}>
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

export default TaskBusinessDelegate;

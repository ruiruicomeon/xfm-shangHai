/**
 * 业务管理 -> 放行单 完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ releaseOrder, loading }) => ({
  ...releaseOrder,
  submitting: loading.effects['form/submitRegularForm'],
}))
class Task_ReleasePermit extends PureComponent {

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
      type: 'releaseOrder/releaseOrder_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn:1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'FXD'
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
      type:'FXD'
      },
      callback:(srcres)=>{
      this.setState({
      srcimg:srcres
      })
      }
      })

  }

  render() {
    const { releaseOrderGet } = this.props;
    const {srcimg,srcimg1} =this.state

    return (
      <div style={{color:'#000',paddingLeft:'6mm',paddingRight:'6mm',width:'200mm',boxSizing:'border-box'}}>
        <p> &nbsp;</p>
        <table align="left" 
              cellSpacing={0}
              cellPadding={0}
              border={0}
              style={{ width: '188mm', clear: 'both', fontSize: '14px'  }}>
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
                  <br /> <strong style={{ fontSize: '24px' }}>放行单 &nbsp;&nbsp;</strong>
                </strong>
              </td>
              {/* <td  style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '28px', textAlign: 'center' }}>
                  <span>上海天脉汽车销售服务有限公司</span>&nbsp; &nbsp; &nbsp;&nbsp;
                </strong>
              </td> */}
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
            {/* <tr>
              <td  style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '24px' }}>放行单 &nbsp; &nbsp; &nbsp;</strong>
              </td>
            </tr> */}
             <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '285mm', fontSize: '14px', clear: 'both', height: '20mm' }}
        >
            <tbody>
            <tr>
              <td colSpan={1} >
                &nbsp;
              </td>
              <td  style={{ textAlign: 'center' }}>
                &nbsp;
              </td>
            </tr>
            <tr>
              <td colSpan={2} >
                <table
                  align="left"
                  border={1}
                  cellPadding={3}
                  cellSpacing={0}
                  className="thin"
                  style={{ width: '188mm' }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: '20mm', height: '8mm' }} nowrap="nowrap"> 单号</td>
                      <td style={{ width: '40mm' }}>
                        <span
                          style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.id)
                              ? releaseOrderGet.id
                              : ''}
                        </span>
                      </td>
                      <td style={{ width: '25mm', textAlign: 'right' }} nowrap="nowrap"> 订单编号</td>
                      <td style={{ width: '50mm' }}>
                        <div>
                          <span>
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.orderCode)
                              ? releaseOrderGet.orderCode
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ width: '25mm', textAlign: 'right' }} nowrap="nowrap"> 日期</td>
                      <td style={{ width: '40mm' }}>
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.finishDate) ? releaseOrderGet.finishDate : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '8mm' }} nowrap="nowrap"> 客户</td>
                      <td >
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.client)&& isNotBlank(releaseOrderGet.client.clientCpmpany) ? releaseOrderGet.client.clientCpmpany
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td  style={{ textAlign: 'right' }} nowrap="nowrap">
                        总成型号
                      </td>
                      <td >
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) &&
                            isNotBlank(releaseOrderGet.assemblyModel)
                              ? releaseOrderGet.assemblyModel
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td  style={{ textAlign: 'right' }} nowrap="nowrap">
                        物流要求
                      </td>
                      <td >
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.logistics) ? releaseOrderGet.logistics : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '8mm' }}>
                        <span style={{ textAlign: 'right' }} nowrap="nowrap">发货人</span>
                      </td>
                      <td >
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.shipper)
                              ? releaseOrderGet.shipper
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td  style={{ textAlign: 'right' }} nowrap="nowrap">
                        物流公司
                      </td>
                      <td >
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) &&
                            isNotBlank(releaseOrderGet.logisticsOffice)
                              ? releaseOrderGet.logisticsOffice
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td  style={{ textAlign: 'right' }} nowrap="nowrap">
                        货运单号
                      </td>
                      <td >
                        <div>
                          <span>
                            {isNotBlank(releaseOrderGet) &&
                            isNotBlank(releaseOrderGet.logisticsCode)
                              ? releaseOrderGet.logisticsCode
                              : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '8mm' }} nowrap="nowrap"> 运费</td>
                      <td >
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.freight)
                              ? getPrice(releaseOrderGet.freight)
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td  style={{ textAlign: 'right' }} nowrap="nowrap">
                        件数
                      </td>
                      <td >
                        <div>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.number)
                              ? releaseOrderGet.number
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td  style={{ textAlign: 'right' }} nowrap="nowrap">
                        &nbsp;
                      </td>
                      <td > &nbsp;</td>
                    </tr>
                    <tr>
                      <td style={{ height: '8mm' }} nowrap="nowrap"> 送货地址</td>
                      <td colSpan={5}  rowSpan={1}>
                        <div>
                          <span>
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.shipAddress)
                              ? releaseOrderGet.shipAddress
                              : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '8mm' }} nowrap="nowrap"> 备注</td>
                      <td colSpan={5} style={{ height: '8mm' }}>
                        <div>
                          <span>
                            {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.remarks)
                              ? releaseOrderGet.remarks
                              : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td colSpan={2} >
                &nbsp;
              </td>
            </tr>
            <tr>
              <td colSpan={2} >
                审核人： &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 门卫： &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 发货人：
                {isNotBlank(releaseOrderGet) && isNotBlank(releaseOrderGet.shipper)
                  ? releaseOrderGet.shipper
                  : ''}
              </td>
            </tr>
          </tbody>
        </table>
        <p> &nbsp;</p>
        <p>
          &nbsp;
          <br /> <strong style={{ fontSize: '24px', whiteSpace: 'nowrap' }}>&nbsp;</strong>
        </p>
      </div>
    );
  }
}

export default Task_ReleasePermit;

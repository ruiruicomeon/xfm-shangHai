/**
 * 业务意向单  完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpMoneyChange, loading }) => ({
  ...cpMoneyChange,
  submitting: loading.effects['form/submitRegularForm'],
}))
class businessintentionprint extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      srcimg: ''
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpMoneyChange/cpMoneyChange_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      },
      callback: (res) => {

        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload: {
            id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
            type: 'JEBD'
          },
          callback: (imgres) => {
            setTimeout(() => {
              window.print()
            }, 1000);
            this.setState({
              srcimg1: imgres
            })
          }
        })
      },
    });

    dispatch({
      type: 'sysarea/getFlatCode',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        type: 'JEBD'
      },
      callback: (res) => {
        this.setState({
          srcimg: res
        })
      }
    })


  }

  render() {
    const { cpMoneyChangeGet } = this.props;
    const { srcimg, srcimg1 } = this.state

    return (
      <div style={{ color: '#000', paddingLeft: '6mm', paddingRight: '6mm', width: '200mm', boxSizing: 'border-box' }}>
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
                  <span style={{ fontSize: '14px' }}>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                  <br /> <strong style={{ fontSize: '24px' }}>金额变更申请单 &nbsp;&nbsp;</strong>
                </strong>
              </td>
              <td style={{ textAlign: 'center', height: '20mm' }}>
                <span style={{ display: 'inline-block' }}>
                  <img src={isNotBlank(srcimg) && isNotBlank(srcimg.msg) ? getFullUrl(`/${srcimg.msg}`) : ''} width={80} />
                  <p style={{ textAlign: 'center' }}>单号</p>
                </span>
              </td>
              <td style={{ textAlign: 'center', height: '20mm' }}>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>
                  <img src={isNotBlank(srcimg1) && isNotBlank(srcimg1.msg) ? getFullUrl(`/${srcimg1.msg}`) : ''} width={80} />
                  <p style={{ textAlign: 'center' }}>编号</p>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <table align="left" cellPadding={1}
          style={{ width: '188mm', clear: 'both', fontSize: '14px' }}
        >
          <tbody> <tr>  <td>
            <table align="center" border={1} className="thin" style={{}}>
              <tbody>
                <tr>
                  <td style={{ width: '20mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>
                    订单编号</td>       <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.orderCode) ? cpMoneyChangeGet.orderCode : ''}</span></td>
                  <td style={{ width: '20mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>客户</td>
                  <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client) && isNotBlank(cpMoneyChangeGet.client.clientCpmpany)  ? cpMoneyChangeGet.client.clientCpmpany: ''}</span></td>
                </tr>      <tr>       <td style={{ width: '20mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>        联系人</td>       <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.client)&& isNotBlank(cpMoneyChangeGet.client.name)  ? cpMoneyChangeGet.client.name : ''}</span></td>
                  <td style={{ width: '20mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>        业务经理</td>
                  <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.user) ? cpMoneyChangeGet.user.name : ''}</span></td>    </tr>      <tr>
                  <td style={{ width: '20mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>        总成型号</td>
                  <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.cpAssemblyBuild) && isNotBlank(cpMoneyChangeGet.cpAssemblyBuild.assemblyModel)  ? cpMoneyChangeGet.cpAssemblyBuild.assemblyModel: ''}</span></td>
                    <td style={{ width: '20mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>
                    申请类别</td>       <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.applyType) ? cpMoneyChangeGet.applyType : ''}</span></td>    </tr>      <tr>
                  <td style={{ width: '20mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>        申请金额</td>
                  <td style={{ width: '78mm', textAlign: 'center' }}>
      <div><span>{isNotBlank(cpMoneyChangeGet) &&isNotBlank(cpMoneyChangeGet.applyMoney) ? (isNotBlank(cpMoneyChangeGet.isGroup)&&cpMoneyChangeGet.isGroup==1?getPrice(getPrice(cpMoneyChangeGet.applyMoney)):getPrice(cpMoneyChangeGet.applyMoney)) : ''}</span></div>     </td>       <td style={{ width: '20mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>        成本金额</td>       <td style={{ width: '78mm', textAlign: 'center' }}>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.costTotalMoney) ? getPrice(cpMoneyChangeGet.costTotalMoney): ''}</td>    </tr>      <tr>       <td style={{ width: '20mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>        应收金额</td>
                  <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.receivable) ? (isNotBlank(cpMoneyChangeGet.isGroup)&&cpMoneyChangeGet.isGroup==1?getPrice(getPrice(cpMoneyChangeGet.receivable)):getPrice(cpMoneyChangeGet.receivable)) : ''}</span></td>
                  <td style={{ width: '20mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>
                    变更金额</td>       <td style={{ width: '78mm', textAlign: 'center' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.changeMoney) ? (isNotBlank(cpMoneyChangeGet.isGroup)&&cpMoneyChangeGet.isGroup==1?getPrice(getPrice(cpMoneyChangeGet.changeMoney)):getPrice(cpMoneyChangeGet.changeMoney) ) : ''}</span></td>    </tr>      <tr>
                  <td colSpan={4} style={{ height: '50mm', verticalAlign: 'top' }}>        <div style={{ lineHeight: '1.5em' }}>
      申请理由：</div>        <div style={{ lineHeight: '1.5em' }}><span>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.applyReason) ? cpMoneyChangeGet.applyReason : ''}</span></div>     </td>    </tr>      <tr>       <td colSpan={4} style={{ height: '50mm', verticalAlign: 'top' }}>        <div>         审核人建议：</div>     </td>    </tr>      <tr>       <td style={{ width: '20mm', height: '10mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>
                  操作人</td>       <td style={{ width: '78mm', textAlign: 'center' }}>{isNotBlank(cpMoneyChangeGet) && isNotBlank(cpMoneyChangeGet.createBy) && isNotBlank(cpMoneyChangeGet.createBy.name) ? cpMoneyChangeGet.createBy.name : ''}&nbsp;</td>       <td style={{ width: '20mm', backgroundColor: '#d3d3d3', textAlign: 'center' }}>        审核人</td>       <td style={{ width: '78mm', textAlign: 'center' }}>
                    {isNotBlank(cpMoneyChangeGet)&&isNotBlank(cpMoneyChangeGet.oneUser) && isNotBlank(cpMoneyChangeGet.oneUser.name) ? cpMoneyChangeGet.oneUser.name : ''}&nbsp;{isNotBlank(cpMoneyChangeGet)&&isNotBlank(cpMoneyChangeGet.twoUser) && isNotBlank(cpMoneyChangeGet.twoUser.name) ? cpMoneyChangeGet.twoUser.name : ''}&nbsp;{isNotBlank(cpMoneyChangeGet)&&isNotBlank(cpMoneyChangeGet.threeUser) && isNotBlank(cpMoneyChangeGet.threeUser.name) ? cpMoneyChangeGet.threeUser.name : ''}&nbsp;{isNotBlank(cpMoneyChangeGet)&&isNotBlank(cpMoneyChangeGet.fourUser) && isNotBlank(cpMoneyChangeGet.fourUser.name) ? cpMoneyChangeGet.fourUser.name : ''}&nbsp;{isNotBlank(cpMoneyChangeGet)&&isNotBlank(cpMoneyChangeGet.fiveUser) && isNotBlank(cpMoneyChangeGet.fiveUser.name) ? cpMoneyChangeGet.fiveUser.name : ''}</td>    </tr>   </tbody>  </table> </td></tr>  <tr>   <td colSpan={2} style={{ height: '15mm' }}>
                      <p>     &nbsp;</p>    <hr size={1} style={{ borderTop: '2px solid #000' }} />
                      <p style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '14px' }}><strong><span>上海新孚美变速箱技术服务有限公司</span>&nbsp; &nbsp;地址：<span>上海市闵行区兴梅路658号C座</span></strong></span><br />     <strong><span style={{ fontSize: '14px' }}>电话：<span>021-54856975 021-51078886</span>&nbsp; &nbsp;传真：<span>021-64051851</span></span></strong></p> </td></tr> </tbody></table>

      </div>
    );
  }
}

export default businessintentionprint;

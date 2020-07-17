/**
 * 报价单    完成
 * 维修费用构成  没有对应字段
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpOfferForm, loading }) => ({
  ...cpOfferForm,
  submitting: loading.effects['form/submitRegularForm'],
}))
class Task_PriceSheet extends PureComponent {

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
      type: 'cpOfferForm/cpOfferForm_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload: {
            id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
            type: 'BJ'
          },
          callback: (srcres) => {
            setTimeout(() => {
              window.print()
            }, 1000);
            this.setState({
              srcimg1: srcres
            })
          }
        })
      },
    });


    dispatch({
      type: 'sysarea/getFlatCode',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        type: 'BJ'
      },
      callback: (srcres) => {
        this.setState({
          srcimg: srcres
        })
      }
    })

    dispatch({
      type: 'cpOfferForm/cpOffer_Detail_List',
      payload: {
        pageSize: 100,
        cpOfferId: isNotBlank(location.query.id) ? location.query.id : '',
      }
    });
  }

  render() {
    const { cpOfferFormGet, cpOfferDetailList } = this.props;
    const { srcimg, srcimg1 } = this.state

    const arr = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

    let alltol = 0

    isNotBlank(cpOfferDetailList) && isNotBlank(cpOfferDetailList.list) && cpOfferDetailList.list.length > 0 && cpOfferDetailList.list.map((item, index) => {
      alltol += parseFloat(item.totaoPrice)
    })

    return (
      <div style={{ color: '#000', paddingLeft: '6mm', paddingRight: '6mm', width: '200mm', boxSizing: 'border-box' }}>
        {/* <div style={{ float: 'left' }}> */}

        <p> &nbsp;</p>
        {/* <div style={{ position: 'absolute', top: '240mm', left: '150mm' }}>
            <img src="../Images/XFM2017001_8.png" style={{ width: '30mm', height: '30mm' }} />
          </div> */}
        <table align="left" cellPadding={1} cellSpacing={1} style={{ float: 'left', width: '188mm', clear: 'both', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td rowSpan={2} style={{ width: '25mm', height: '20mm' }}>
                <span>
                  <img src="./XFM_Logo.jpg" width={60} />
                </span>
              </td>
              <td style={{ textAlign: 'center', width: '175mm' }}>
                <strong style={{ fontSize: '20px' }}>
                  <span>上海新孚美变速箱技术服务有限公司</span>
                  <br />
                  <span style={{ fontSize: '14px' }}>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
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
        {/* </div> */}
        {/* <div style={{ float: 'left' }}> */}

        <table align="left" style={{ float: 'left', width: '188mm', clear: 'both', fontSize: '14px' }}>

          <tbody>

            <tr>

              <td
                style={{
                  textAlign: 'center',
                  width: '130mm',
                  backgroundColor: 'rgb(211, 211, 211)',
                }}
              >

                <strong>
                  <span style={{ fontSize: '26px' }}>报价单</span>
                </strong>
              </td>
              <td style={{ width: '50mm' }}>

                <table
                  align="right"
                  border={1}
                  cellPadding={1}
                  className="thin"
                  style={{ height: '20mm', width: '65mm' }}
                >

                  <tbody>

                    <tr>

                      <td style={{ width: '20mm', height: '5mm' }} nowrap="nowrap"> 委托书号</td>
                      <td style={{ width: '45mm' }}>
                        <span
                          style={{ width: '45mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.orderCode)
                            ? cpOfferFormGet.orderCode
                            : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '5mm' }} nowrap="nowrap"> 日期</td>
                      <td >

                        <div>
                          <span
                            style={{
                              width: '30mm',
                              wordBreak: 'keep-all',
                              wordWrap: 'break-word',
                            }}
                          >
                            <span> {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.createDate)
                              ? cpOfferFormGet.createDate
                              : ''}</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '5mm' }} nowrap="nowrap"> 联系人</td>
                      <td >
                        <span
                          style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) && isNotBlank(cpOfferFormGet.user.name) ? cpOfferFormGet.user.name : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '5mm' }} nowrap="nowrap"> 联系电话</td>
                      <td >

                        <div>
                          <span
                            style={{
                              width: '40mm',
                              wordBreak: 'keep-all',
                              wordWrap: 'break-word',
                            }}
                          >
                            {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.user) && isNotBlank(cpOfferFormGet.user.phone) ? cpOfferFormGet.user.phone : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        {/* </div>
        <div style={{ float: 'left' }}> */}
        <table align="left" cellPadding={1} style={{ float: 'left', width: '188mm', clear: 'both', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td colSpan={2} style={{ width: '75mm' }}>
                <table align="center" border={1} className="thin" style={{ height: '15mm' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '20mm', height: '5mm', backgroundColor: '#d3d3d3' }} nowrap="nowrap">
                        客户名称
                        </td>
                      <td style={{ width: '56mm', textAlign: 'center' }}>
                        <span
                          style={{ width: '56mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) && isNotBlank(cpOfferFormGet.client.clientCpmpany) ? cpOfferFormGet.client.clientCpmpany : ''}
                        </span>
                      </td>
                      <td style={{ width: '20mm', backgroundColor: '#d3d3d3' }} nowrap="nowrap"> 联系人</td>
                      <td style={{ width: '40mm', textAlign: 'center' }}>
                        <span
                          style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.name : ''}

                        </span>
                      </td>
                      <td style={{ width: '20mm', backgroundColor: '#d3d3d3' }} nowrap="nowrap"> 手机</td>
                      <td style={{ width: '40mm', textAlign: 'center' }}>
                        <span
                          style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.phone : ''}

                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '5mm', backgroundColor: '#d3d3d3' }} nowrap="nowrap"> 地址</td>
                      <td style={{ width: '54mm' }}>

                        <div style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              width: '56mm',
                              wordBreak: 'keep-all',
                              wordWrap: 'break-word',
                            }}
                          >
                            {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.client) ? cpOfferFormGet.client.address : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ backgroundColor: '#d3d3d3' }} nowrap="nowrap"> 型号</td>
                      <td>

                        <div style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              width: '40mm',
                              wordBreak: 'keep-all',
                              wordWrap: 'break-word',
                            }}
                          >
                            {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id) ? isNotBlank(cpOfferFormGet.cab.assemblyModel) ? cpOfferFormGet.cab.assemblyModel : ''
												: isNotBlank(cpOfferFormGet.assemblyModel) ? cpOfferFormGet.assemblyModel : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ backgroundColor: '#d3d3d3' }} nowrap="nowrap"> 车型</td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.cab) && isNotBlank(cpOfferFormGet.cab.id) ? isNotBlank(cpOfferFormGet.cab.vehicleModel) ? cpOfferFormGet.cab.vehicleModel : ''
												: isNotBlank(cpOfferFormGet.assemblyVehicleEmissions) ? cpOfferFormGet.assemblyVehicleEmissions : ''}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/* <td style={{ backgroundColor: '#d3d3d3' }}> 电话</td>
                        <td>
                          
                          <div style={{ textAlign: 'center' }}>
                            <span
                              style={{
                                width: '40mm',
                                wordBreak: 'keep-all',
                                wordWrap: 'break-word',
                              }}
                            />
                          </div>
                        </td>
                        <td style={{ backgroundColor: '#d3d3d3' }}> 传真</td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            ...</span>
                        </td>
                      </tr>
                      <tr>
                        
                        <td style={{ height: '5mm', backgroundColor: '#d3d3d3' }}>
                          车牌号码
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{ width: '56mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                          >
                            ...
                            </span>
                        </td> */}
            {/* </tr> */}
            <tr>

              <td style={{ width: '79mm' }}>

                <table align="left" border={1} cellPadding={1} className="thin">

                  <tbody>

                    <tr>

                      <td
                        style={{
                          width: '20mm',
                          height: '11mm',
                          backgroundColor: 'rgb(211, 211, 211)',
                        }}
                        nowrap="nowrap"
                      >

                        委托项目
                        </td>
                      <td style={{ width: '55mm', textAlign: 'center' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.entrustProject) ? cpOfferFormGet.entrustProject : ''}
                        </span>
                      </td>
                    </tr>
                    {/* <tr>
                        
                        <td style={{ height: '15mm', backgroundColor: 'rgb(211, 211, 211)' }}>
                          
                          维修投诉内容
                        </td>
                        <td style={{ width: '55mm' }}>
                          
                          <div style={{ textAlign: 'center' }}>
                            <span
                              style={{
                                width: '55mm',
                                wordBreak: 'keep-all',
                                wordWrap: 'break-word',
                              }}
                            >
                              FM-6红 12L 828元 福元西路更换出油品...
                            </span>
                          </div>
                        </td>
                      </tr> */}
                    <tr>

                      <td style={{ height: '12mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        注意事项
                        </td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.noticeMatter) ? cpOfferFormGet.noticeMatter : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '12mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        质量担保项目
                        </td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.qualityProject) ? cpOfferFormGet.qualityProject : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '12mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        无质量担保项目
                        </td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.noQualityProject) ? cpOfferFormGet.noQualityProject : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '11mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        结算方式约定
                        </td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.settlementAgreement) ? cpOfferFormGet.settlementAgreement : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '11mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        报价类型
                        </td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>

                        <div>
                          <span
                            style={{
                              width: '55mm',
                              wordBreak: 'keep-all',
                              wordWrap: 'break-word',
                            }}
                          >
                            {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.offerType) ? cpOfferFormGet.offerType : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '12mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        其他约定
                        </td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.otherMatter) ? cpOfferFormGet.otherMatter : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>

                      <td style={{ height: '11mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        车牌号
  </td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.plateNumber) ? cpOfferFormGet.plateNumber : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '11mm', backgroundColor: 'rgb(211, 211, 211)' }} nowrap="nowrap">

                        故障描述
</td>
                      <td style={{ textAlign: 'center', width: '55mm' }}>
                        <span
                          style={{ width: '55mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(cpOfferFormGet) && isNotBlank(cpOfferFormGet.errorDescription) ? cpOfferFormGet.errorDescription : ''}
                        </span>
                      </td>
                    </tr>
                    <tr >
                      <td colSpan={2} style={{ width: '75mm', height: '30mm', verticalAlign: 'top', position: 'relative' }} >
                        <img src={require('../../assets/zhang.png')} style={{ width: '30mm', position: "absolute", left: '50%', transform: 'translateX(-50%)' }} />
                        <p style={{ position: 'relative', zIndex: 1 }}>

                          说明：
                            <br />
                            1、本维修委托单为双方委托的法律依据，并作为结算、质保的凭证。2本单的复印件、传真件同正本具有相同的法律效率。
                          </p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ height: '15mm', verticalAlign: 'top' }}>
                        <strong>尊敬的客户敬请在此处签字盖章确认：</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style={{ verticalAlign: 'top' }}>

                <table
                  align="left"
                  border={1}
                  cellPadding={1}
                  className="thin"
                >

                  <colgroup>

                    <col style={{ width: '10%' }} /> <col style={{ width: '45%' }} />
                    <col style={{ width: '10%' }} /> <col style={{ width: '15%' }} />
                    <col style={{ width: '20%' }} />
                  </colgroup>
                  <tbody>

                    <tr>

                      <td
                        colSpan={5}
                        style={{
                          height: '5mm',
                          textAlign: 'center',
                          width: '120mm',
                          backgroundColor: 'rgb(211, 211, 211)',
                        }}
                      >

                        零配件明细表
                        </td>
                    </tr>
                    <tr>
                      <td style={{ width: '15mm', height: '5mm', textAlign: 'center' }}>
                        序号
                        </td>
                      <td style={{ width: '55mm', height: '5mm', textAlign: 'center' }}>
                        名称
                        </td>
                      <td style={{ width: '10mm', height: '5mm', textAlign: 'center' }}>
                        数量
                        </td>
                      <td style={{ width: '20mm', height: '5mm', textAlign: 'center' }}>
                        单价
                        </td>
                      <td style={{ width: '20mm', height: '5mm', textAlign: 'center' }}>
                        金额
                        </td>
                    </tr>
                    {
                      isNotBlank(cpOfferDetailList) && isNotBlank(cpOfferDetailList.list) && cpOfferDetailList.list.length > 0 ?
                        cpOfferDetailList.list.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ height: '10mm', width: '15mm' }}>
                                <div style={{ textAlign: 'center' }}>
                                  <span
                                    style={{
                                      width: '10mm',
                                      wordBreak: 'keep-all',
                                      wordWrap: 'break-word',
                                    }}
                                  >
                                    {Number(index) + 1}
                                  </span>
                                </div>
                              </td>
                              <td >

                                <div>
                                  <span
                                    style={{
                                      width: '55mm',
                                      wordBreak: 'keep-all',
                                      wordWrap: 'break-word',
                                    }}
                                  >
                                    {isNotBlank(item) && isNotBlank(item.name) ? item.name : null}
                                  </span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span
                                  style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                                >
                                  {isNotBlank(item) && isNotBlank(item.number) ? item.number : null}
                                </span>
                              </td>
                              <td >
                                <div style={{ textAlign: 'center' }}>
                                  <span
                                    style={{
                                      width: '18mm',
                                      wordBreak: 'keep-all',
                                      wordWrap: 'break-word',
                                    }}
                                  >
                                    {isNotBlank(item) && isNotBlank(item.price) ? getPrice(item.price) : null}
                                  </span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span
                                  style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                                >
                                  {isNotBlank(item) && isNotBlank(item.totaoPrice) ? getPrice(item.totaoPrice) : null}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                        : null}
                    {isNotBlank(arr) && (!isNotBlank(cpOfferDetailList.list) || cpOfferDetailList.list.length < 12) && arr.splice(!isNotBlank(cpOfferDetailList.list) ? 0 : cpOfferDetailList.list.length).map(() => {
                      return (<tr style={{ height: '10mm', width: '15mm' }} >
                        <td style={{ textAlign: 'center', height: '10mm' }}>
                          <div>
                            <span />
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div>
                            <span />
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span />
                        </td>
                      </tr>
                      )
                    })
                    }
                    <tr style={{ height: '56px' }}>
                      <td
                        colSpan={3}
                        style={{ height: '5mm', width: '112mm', textAlign: 'right' }}
                      >

                        合&nbsp; &nbsp; &nbsp; &nbsp; 计：&nbsp;
                        </td>
                      <td
                        colSpan={2}
                        style={{ height: '5mm', textAlign: 'center', width: '112mm' }}
                      >

                        <div>
                          <span
                            style={{
                              width: '18mm',
                              wordBreak: 'keep-all',
                              wordWrap: 'break-word',
                            }}
                          >
                            {getPrice(alltol)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/* <tr> */}

            {/* <td style={{ width: '75mm' }}>
                  
                  <table
                    align="left"
                    border={1}
                    cellPadding={1}
                    className="thin"
                    style={{ width: '75mm' }}
                  >
                    
                    <tbody>
                        
                    </tbody>
                  </table>
                </td> */}
            {/* <td style={{ verticalAlign: 'top', width: '125mm', height: '40mm' }}>
                  
                  <table align="left"  className="thin" style={{ width: '120mm',textAlign:'center' }}>
                    <tbody>
                       <tr>
                          <img src={require('../../assets/zhang.png')} style={{width:'30mm'}} />
                      </tr>
                    </tbody>
                  </table> 
                </td> */}
            {/* </tr> */}
            <tr>

              <td colSpan={2} style={{ height: '15mm' }}>

                <p> &nbsp;</p> <hr size={1} style={{ borderTop: '2px solid #000' }} />
                <p style={{ textAlign: 'center' }}>

                  <span style={{ fontSize: '14px' }}>
                    <strong>
                      <span>上海新孚美变速箱技术服务有限公司</span>&nbsp; 地址：
                        <span>上海市闵行区兴梅路658号C座</span>
                    </strong>
                  </span>
                  <br />
                  <strong>
                    <span style={{ fontSize: '14px' }}>
                      电话：<span>021-54856975 021-51078886</span>&nbsp; 传真：
                        <span>021-64051851</span>
                    </span>
                  </strong>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      // </div>
    );
  }
}

export default Task_PriceSheet;

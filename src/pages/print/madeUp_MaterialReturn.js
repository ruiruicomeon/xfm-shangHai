/**
 *  成品管理-> 退料单  完成
 *  */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpPurchaseDetail, cpQuitFrom, loading }) => ({
  ...cpPurchaseDetail,
  ...cpQuitFrom,
  submitting: loading.effects['form/submitRegularForm'],
}))
class madeUp_MaterialReturn extends PureComponent {

  constructor(props) {
		super(props);
		this.state = {
      srcimg:[],
      srcimg1:''
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpQuitFrom/cpQuitFrom_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn:1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload:{
            id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
            type:'PJTL'
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
      type:'PJTL'
      },
      callback:(srcres)=>{
      this.setState({
      srcimg:srcres.msg.split('|')
      })
      }
      })
    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: {
        strageType: 2,
        // intentionId: isNotBlank(location.query.id) ? location.query.id : '',
        purchaseId: isNotBlank(location.query.id) ? location.query.id : '',
        pageSize: 50,
      },
    });
  }
  convertCurrency = (money) => {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '元';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
      //超出最大处理数字
      return '';
    }
    if (money == 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
      integerNum = money;
      decimalNum = '';
    } else {
      parts = money.split('.');
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      var zeroCount = 0;
      var IntLen = integerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = integerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          //归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q];
        }
      }
      chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
      var decLen = decimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = decimalNum.substr(i, 1);
        if (n != '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (chineseStr == '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
      chineseStr += cnInteger;
    }
    return chineseStr;
  }

  render() {
    const { cpQuitFromGet, cpPurchaseDetailList } = this.props;

    const { srcimg,srcimg1} = this.state
    const arr = [{}, {}, {}, {}, {}, {}]

    return (
      <div style={{ color: '#000' , paddingLeft: '6mm', paddingRight: '6mm', width: '200mm', boxSizing: 'border-box' }}>
        <p> &nbsp;</p>
        <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '188mm', height: '15mm', fontSize: '14px', clear: 'both' }}
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
                </strong>
                <br />
                <strong style={{ fontSize: '14px' }}>
                  <span>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                </strong>
                <br />
                <strong style={{ fontSize: '24px' }}>
                  退料单 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            </strong>
              </td>
              <td style={{ textAlign: 'center', height: '20mm' }}>
                <span style={{display:'inline-block'}}>
                  <img src={isNotBlank(srcimg) && isNotBlank(srcimg[0]) ? getFullUrl(`/${srcimg[0]}`) : ''} width={80} />
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
          //  align="left" cellPadding={1} cellSpacing={1} style={{color:'#000'}}
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '188mm', height: '15mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            {/* <tr>
            <td colSpan={9}  style={{ whiteSpace: 'nowrap', height: '15mm' }}>
              <p style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '22px' }}>
                  <strong>
                    <span>上海新孚美变速箱技术服务有限公司</span>退货单
                  </strong>
                </span>
              </p>
            </td>
          </tr> */}

            <tr>
              <td
                style={{ textAlign: 'right', width: '12%', height: '5mm', background: '#cccccc' }}
                nowrap="nowrap"
              >
                单号：
              </td>
              <td style={{ borderBottom: '1px solid #000000', width: '22%', }}>
                <div>
                  <span>   {isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.id)
                    ? cpQuitFromGet.id
                    : ''}</span>
                </div>
              </td>
              <td style={{ textAlign: 'right', width: '12%', background: '#cccccc' }}
              nowrap="nowrap"
              >
                订单单号：
              </td>
              <td style={{ borderBottom: '1px solid #000000', width: '22%', }}>
                <div>
                  <span>
                    {isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.orderCode)
                      ? cpQuitFromGet.orderCode
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', width: '10%', background: '#cccccc' }} nowrap="nowrap">
                日 &nbsp; &nbsp;&nbsp; 期：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>{isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.createDate)
                    ? cpQuitFromGet.createDate
                    : ''}</span>
                </div>
              </td>
            </tr>
            <tr>
            <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                仓库:
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpQuitFromGet) &&
                      isNotBlank(cpQuitFromGet.pjEntrepot) &&
                      isNotBlank(cpQuitFromGet.pjEntrepot.name)
                      ? cpQuitFromGet.pjEntrepot.name
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                客户:
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpQuitFromGet) &&
                      isNotBlank(cpQuitFromGet.client) &&
                      isNotBlank(cpQuitFromGet.client.clientCpmpany)
                      ? cpQuitFromGet.client.clientCpmpany
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                退料人：
              </td>
              <td colSpan={3} rowSpan={1} style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>  {isNotBlank(cpQuitFromGet) &&
                    isNotBlank(cpQuitFromGet.createBy) &&
                    isNotBlank(cpQuitFromGet.createBy.name)
                    ? cpQuitFromGet.createBy.name
                    : ''}</span>
                </div>
              </td>
            </tr>
            {/* <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }}>
                联 系&nbsp;人：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>  {isNotBlank(cpQuitFromGet) &&
                    isNotBlank(cpQuitFromGet.cpSupplier) &&
                    isNotBlank(cpQuitFromGet.cpSupplier.linkman)
                    ? cpQuitFromGet.cpSupplier.linkman
                    : ''}</span>
                </div>
              </td>
              <td style={{ textAlign: 'right', background: '#cccccc' }}> 供应商编号：</td>
              <td  style={{ whiteSpace: 'nowrap' }}>
                <div>
                  <span>
                    {isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.cpSupplier) && isNotBlank(cpQuitFromGet.cpSupplier.id)
                      ? cpQuitFromGet.cpSupplier.id
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', background: '#cccccc' }}>
                电 &nbsp; &nbsp; &nbsp;话：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>  {isNotBlank(cpQuitFromGet) &&
                    isNotBlank(cpQuitFromGet.cpSupplier) &&
                    isNotBlank(cpQuitFromGet.cpSupplier.phone)
                    ? cpQuitFromGet.cpSupplier.phone
                    : ''}</span>
                </div>
              </td>
            </tr> */}
          </tbody>
        </table>
        {/* <td
              colSpan={2}
              
              style={{ width: '19mm', whiteSpace: 'nowrap', height: '6mm' }}
            >
              <span style={{ fontSize: '14px' }}>购货单位：</span>
            </td>
            <td  style={{ width: '65mm', whiteSpace: 'nowrap', height: '6mm' }}>
              <span style={{ fontSize: '14px' }}>
                <span style={{ width: '50mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  芜湖阿利瑞汽车配件...
                </span>
              </span>
            </td>
            <td colSpan={3}  style={{ width: '30mm', whiteSpace: 'nowrap' }}>
              &nbsp;
            </td>
            <td  style={{ width: '19mm', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '14px' }}>退货单号：</span>
            </td>
            <td colSpan={2}  style={{ width: '40mm', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '14px' }}>
                <span style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  CF0607191230003...
                </span>
              </span>
            </td> */}
        {/* </tr> */}
        {/* <tr>
            <td
              colSpan={2}
              
              style={{ width: '19mm', whiteSpace: 'nowrap', height: '8mm' }}
            >
              <span style={{ fontSize: '14px' }}>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 址：</span>
            </td>
            <td  style={{ width: '65mm', whiteSpace: 'nowrap', height: '6mm' }}>
              <span style={{ width: '65mm', wordBreak: 'keep-all', wordWrap: 'break-word' }} />
            </td>
            <td colSpan={2}  style={{ width: '15mm', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '14px' }}>电话</span>：
            </td>
            <td  style={{ width: '20mm', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '14px' }}>
                <span style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  15385607998...
                </span>
              </span>
            </td>
            <td  rowSpan={1}>
              <span style={{ fontSize: '14px' }}>退货日期：</span>
            </td>
            <td
              colSpan={2}
              
              rowSpan={1}
              style={{ width: '25mm', whiteSpace: 'nowrap' }}
            >
              <span style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                2019.12.30...
              </span>
            </td>
          </tr> */}
        <table
          align="left"
          border={1}
          bordercolor="#000000"
          cellPadding={1}
          className="thin"
          style={{
            width: '188mm',
            borderCollapse: 'collapse',
            fontSize: '14px',
            clear: 'both',
            height: '65mm',
          }}
        >
          <tbody>
            {/* <tr>
            <td   style={{ whiteSpace: 'nowrap', height: '20mm' }}>
              <table align="center" border={1} className="thin">
                <tbody> */}
            <tr>
              <td
                
                style={{ textAlign: 'center', width: '5%', height: '5mm', background: '#cccccc' }}
              >
                <span style={{ fontSize: '14px' }}>序号</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '23mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>编码</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '35mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>商品名称</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '25mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>型号</span>
              </td>
              {/* <td
                      
                      style={{ textAlign: 'center', width: '18mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>类别</span>
                    </td> */}
              <td
                
                style={{ textAlign: 'center', width: '25mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>原厂编码</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '12mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>数量</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '10mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>单位</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '15mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>单价</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '18mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>金额</span>
              </td>
              <td
                
                style={{ textAlign: 'center', width: '18mm', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '14px' }}>库位</span>
              </td>
            </tr>

            {isNotBlank(cpPurchaseDetailList) &&
              isNotBlank(cpPurchaseDetailList.list) &&
              cpPurchaseDetailList.list.length > 0
              ? cpPurchaseDetailList.list.map((Item, index) => {
                return (
                  <tr key={index}>
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '10mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {Number(index) + 1}
                      </span>
                    </td>
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '23mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.billCode)
                          ? Item.cpBillMaterial.billCode
                          : ''}
                      </span>
                    </td>
                    <td  style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '35mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.name)
                          ? Item.cpBillMaterial.name
                          : ''}
                      </div>
                    </td>
                    <td
                      
                      style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                    >
                      <div
                        style={{
                          display: 'block',
                          width: '25mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          height: '4mm',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.oneCodeModel)
                          ? Item.cpBillMaterial.oneCodeModel
                          : ''}
                      </div>
                    </td>
                    {/* <td  style={{ textAlign: 'center' }}>
                              <span
                                style={{
                                  width: '18mm',
                                  wordBreak: 'keep-all',
                                  wordWrap: 'break-word',
                                }}
                              >
                                阀体总成...
                              </span>
                            </td> */}
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '25mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.originalCode)
                          ? Item.cpBillMaterial.originalCode
                          : ''}
                      </span>
                    </td>
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '12mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {isNotBlank(Item) && isNotBlank(Item.number) ? Item.number : ''}
                      </span>
                    </td>
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '10mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.unit)
                          ? Item.cpBillMaterial.unit
                          : ''}
                      </span>
                    </td>
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '15mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {isNotBlank(Item) && isNotBlank(Item.price) ? getPrice(Item.price) : ''}
                      </span>
                    </td>
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '18mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {isNotBlank(Item) && isNotBlank(Item.money) ? getPrice(Item.money) : ''}
                      </span>
                    </td>
                    <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          width: '18mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                        }}
                      >
                        {isNotBlank(Item) && isNotBlank(Item.cpPjStorage)&& isNotBlank(Item.cpPjStorage.name) ? Item.cpPjStorage.name: ''}
                      </span>
                    </td>
                  </tr>
                );
              })
              : ''}

            {isNotBlank(arr) && (!isNotBlank(cpPurchaseDetailList.list) || cpPurchaseDetailList.list.length < 6) && arr.splice(!isNotBlank(cpPurchaseDetailList.list) ? 0 : cpPurchaseDetailList.list.length).map(() => {
              return (
                <tr>
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '35mm',
                        wordBreak: 'keep-all',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div
                      style={{
                        display: 'block',
                        width: '25mm',
                        wordBreak: 'keep-all',
                        wordWrap: 'break-word',
                        height: '4mm',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    />
                  </td>
                  {/* <td  style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td> */}
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  <td  style={{ textAlign: 'center' }}>
                    <span
                      style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                    />
                  </td>
                  {/* </tr>
                </tbody>
              </table> */}
                  {/* </td> */}
                </tr>
              )
            })
            }
          </tbody>
        </table>
        <div style={{ clear: 'both', height: '15mm', width: '188mm', fontSize: '14px' }}>
          {/* 去税金额：<span>1300.00</span>&nbsp; &nbsp;&nbsp;
          <span style={{ whiteSpace: 'nowrap' }}>大写：</span>
          <span>壹仟叁佰元</span> */}
          &nbsp; &nbsp; 金额：<span>{getPrice(cpQuitFromGet.money)}</span>&nbsp; &nbsp; 大写：
          <span>{this.convertCurrency(getPrice(cpQuitFromGet.money))}</span>
          <br /> 制单人：<span>{isNotBlank(cpQuitFromGet) && isNotBlank(cpQuitFromGet.createBy) && isNotBlank(cpQuitFromGet.createBy.name)
            ? cpQuitFromGet.createBy.name
            : ''}</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;经手人： &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
领料人：
          <br /> 地址：<span>上海市闵行区兴梅路658号</span>&nbsp;电话：
          <span>021-54856975 021-51078886</span>&nbsp;传真：<span>021-64051851</span>&nbsp;网址：
          <span>www.fm960.com.cn</span>
        </div>
      </div>
    );
  }
}

export default madeUp_MaterialReturn;

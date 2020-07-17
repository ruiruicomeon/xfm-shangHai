/**
 *  成品管理-> 入库单 完成
 *  */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpInStorageFrom, cpPurchaseDetail, loading }) => ({
  ...cpInStorageFrom,
  ...cpPurchaseDetail,
  submitting: loading.effects['form/submitRegularForm'],
}))
class madeUp_PutStorage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      srcimg: [],
      srcimg1: ''
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpInStorageFrom/cpInStorageFrom_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload: {
            id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
            type: 'PJRK'
          },
          callback: (srcres) => {
            setTimeout(() => {
              window.print()
            }, 1500);
            this.setState({
              srcimg1: srcres
            })
          }
        })
      },
    });

    window.onafterprint = this.afterPrint

    dispatch({
      type: 'sysarea/getFlatCode',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        type: 'PJRK'
      },
      callback: (srcres) => {
        this.setState({
          srcimg: srcres.msg.split('|')
        })
      }
    })


    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: {
        // intentionId: location.query.id,
        // strageType: 1,
        pageSize: 50,
        purchaseId: isNotBlank(location.query.id) ? location.query.id : '',
      },
    });
  }

  afterPrint = () => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpInStorageFrom/cpInStorageFrom_print_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        Number: 1
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
    const { cpInStorageFromGet, cpPurchaseDetailList } = this.props;
    const { srcimg, srcimg1 } = this.state

    const arr = [{}, {}, {}, {}]

    return (
      <div style={{ color: '#000', paddingLeft: '6mm', paddingRight: '6mm', width: '200mm', boxSizing: 'border-box' }}>
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
            border: 'none'
          }}
        >
          <thead style={{ display: 'table-header-group' }}>
            <tr style={{ border: 'none' }}>
              <td colSpan='9' style={{ border: 'none' }}>
                <p> &nbsp;</p>
                <table
                  align="left"
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ width: '188mm', height: '15mm', fontSize: '14px', clear: 'both', pageBreakAfter: 'always' }}
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
                          入库单 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </strong>
                      </td>
                      <td style={{ textAlign: 'center', height: '20mm' }}>
                        <span style={{ display: 'inline-block' }}>
                          <img src={isNotBlank(srcimg) && isNotBlank(srcimg[0]) ? getFullUrl(`/${srcimg[0]}`) : ''} width={80} />
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
              </td>
            </tr>
            <tr style={{ border: 'none' }}>
              <td colSpan='9' style={{ border: 'none' }}>
                <table
                  align="left"
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ width: '188mm', fontSize: '14px', clear: 'both', height: '15mm' }}
                >
                  <tbody>
                    <tr>
                      {/* <td
                style={{ textAlign: 'right', width: '10%', height: '5mm', background: '#cccccc' }}
              >
                入库单号：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>CA0647191230002...</span>
                </div>
              </td> */}
                      <td style={{ textAlign: 'right', width: '12%', background: '#cccccc' }} nowrap="nowrap">
                        订单单号：
              </td>
                      <td style={{ borderBottom: '1px solid #000000', width: '22%', }}>
                        <div>
                          <span>
                            {isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.orderCode)
                              ? cpInStorageFromGet.orderCode
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', width: '12%', background: '#cccccc' }} nowrap="nowrap">
                        日 &nbsp; &nbsp;&nbsp; 期：
              </td>
                      <td style={{ borderBottom: '1px solid #000000', width: '22%', }}>
                        <div>
                          <span>{isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.createDate)
                            ? cpInStorageFromGet.createDate
                            : ''}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', width: '12%', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                        供 &nbsp;应&nbsp;商：
              </td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>
                            {isNotBlank(cpInStorageFromGet) &&
                              isNotBlank(cpInStorageFromGet.cpSupplier) &&
                              isNotBlank(cpInStorageFromGet.cpSupplier.name)
                              ? cpInStorageFromGet.cpSupplier.name
                              : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                        地 &nbsp; &nbsp; &nbsp;址：
              </td>
                      <td colSpan={3} rowSpan={1} style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>  {isNotBlank(cpInStorageFromGet) &&
                            isNotBlank(cpInStorageFromGet.cpSupplier) &&
                            isNotBlank(cpInStorageFromGet.cpSupplier.address)
                            ? cpInStorageFromGet.cpSupplier.address
                            : ''}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                        联 系&nbsp;人：
              </td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>  {isNotBlank(cpInStorageFromGet) &&
                            isNotBlank(cpInStorageFromGet.cpSupplier) &&
                            isNotBlank(cpInStorageFromGet.cpSupplier.linkman)
                            ? cpInStorageFromGet.cpSupplier.linkman
                            : ''}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                        电 &nbsp; &nbsp; &nbsp;话：
              </td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>  {isNotBlank(cpInStorageFromGet) &&
                            isNotBlank(cpInStorageFromGet.cpSupplier) &&
                            isNotBlank(cpInStorageFromGet.cpSupplier.phone)
                            ? cpInStorageFromGet.cpSupplier.phone
                            : ''}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap"> 供应商编号：</td>
                      <td colSpan={3} nowrap="noWrap" rowSpan={1} style={{ whiteSpace: 'nowrap' }}>
                        <div>
                          <span>
                            {isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.cpSupplier) && isNotBlank(cpInStorageFromGet.cpSupplier.id)
                              ? cpInStorageFromGet.cpSupplier.id
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
              <td
                style={{ textAlign: 'center', width: '5%', height: '5mm', background: '#cccccc' }}
              >
                序号
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '15%',
                  whiteSpace: 'nowrap',
                }}
              >
                物料编码
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '20%',
                  whiteSpace: 'nowrap',
                }}
              >
                物料名称
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '10%',
                  whiteSpace: 'nowrap',
                }}
              >
                原厂编码
              </td>
              <td
                nowrap="noWrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '10%',
                  whiteSpace: 'nowrap',
                }}
              >
                型号
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '5%',
                  whiteSpace: 'nowrap',
                }}
              >
                单位
              </td>
              <td
                nowrap="noWrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '5%',
                  whiteSpace: 'nowrap',
                }}
              >
                数量
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '10%',
                  whiteSpace: 'nowrap',
                }}
              >
                单价
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '10%',
                  whiteSpace: 'nowrap',
                }}
              >
                金额
              </td>
              {/* <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '25%',
                  whiteSpace: 'nowrap',
                }}
              >
                  二维码
              </td> */}
            </tr>
          </thead>
          <tbody>
            {isNotBlank(cpPurchaseDetailList) &&
              isNotBlank(cpPurchaseDetailList.list) &&
              cpPurchaseDetailList.list.length > 0
              ? cpPurchaseDetailList.list.map((item, Index) => {
                return (
                  <tr key={Index}>
                    <td style={{ textAlign: 'center', height: '10mm' }}>
                      <span>{Number(Index) + 1}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '14px' }}>
                        <span>
                          {isNotBlank(item) &&
                            isNotBlank(item.cpBillMaterial) &&
                            isNotBlank(item.cpBillMaterial.billCode)
                            ? item.cpBillMaterial.billCode
                            : ''}
                        </span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '14px' }}>
                        <span>
                          {isNotBlank(item) &&
                            isNotBlank(item.cpBillMaterial) &&
                            isNotBlank(item.cpBillMaterial.name)
                            ? item.cpBillMaterial.name
                            : null}
                        </span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>{isNotBlank(item) &&
                        isNotBlank(item.cpBillMaterial) &&
                        isNotBlank(item.cpBillMaterial.originalCode)
                        ? item.cpBillMaterial.originalCode
                        : null}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) &&
                          isNotBlank(item.cpBillMaterial) &&
                          isNotBlank(item.cpBillMaterial.one) &&
                          isNotBlank(item.cpBillMaterial.one.model)
                          ? item.cpBillMaterial.one.model
                          : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) &&
                          isNotBlank(item.cpBillMaterial) &&
                          isNotBlank(item.cpBillMaterial.unit)
                          ? item.cpBillMaterial.unit
                          : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) &&
                          isNotBlank(item.number)
                          ? item.number
                          : 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div>
                        <span>
                          {isNotBlank(item) && isNotBlank(item.price) && isNotBlank(item.price)
                            ? getPrice(item.price)
                            : 0}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div>
                        <span>
                          {isNotBlank(item) && isNotBlank(item.money) && isNotBlank(item.money)
                            ? getPrice(item.money)
                            : 0}
                        </span>
                      </div>
                    </td>
                    {/* <td style={{ textAlign: 'center' }}>
                        <span>
                          <img src={isNotBlank(srcimg) && isNotBlank(srcimg[Index+1]) ? getFullUrl(`/${srcimg[Index+1]}`) : ''} width={80} />
                          <p> {isNotBlank(item) &&
                          isNotBlank(item.cpBillMaterial) &&
                          isNotBlank(item.cpBillMaterial.billCode)
                          ? item.cpBillMaterial.billCode
                          : ''}</p>
                        </span>
                      </td> */}
                  </tr>
                );
              })
              : null}

            {isNotBlank(arr) && (!isNotBlank(cpPurchaseDetailList.list) || cpPurchaseDetailList.list.length < 6) && arr.splice(!isNotBlank(cpPurchaseDetailList.list) ? 0 : cpPurchaseDetailList.list.length).map(() => {
              return (
                <tr>
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
                  <td style={{ textAlign: 'center' }}>
                    <span />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span />
                  </td>
                  {/* <td style={{ textAlign: 'center' }}>
                <span />
              </td> */}
                </tr>
              )
            })
            }

            <tr style={{ clear: 'both', height: '15mm', width: '188mm', fontSize: '14px', border: 'none' }}>
              {/* 去税金额：<span>1300.00</span>&nbsp; &nbsp;&nbsp;
          <span style={{ whiteSpace: 'nowrap' }}>大写：</span>
          <span>壹仟叁佰元</span> */}
              <td colSpan='9' style={{ border: 'none' }}>
                &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 金额：<span>{getPrice(cpInStorageFromGet.money)}</span>&nbsp; &nbsp; 大写：
          <span>{this.convertCurrency(getPrice(cpInStorageFromGet.money))}</span>
                <br /> 制单人：<span>{isNotBlank(cpInStorageFromGet) && isNotBlank(cpInStorageFromGet.createBy) && isNotBlank(cpInStorageFromGet.createBy.name)
                  ? cpInStorageFromGet.createBy.name
                  : ''}</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;经手人： &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          领料人：
          <br /> 地址：<span>上海市闵行区兴梅路658号</span>&nbsp;电话：
          <span>021-54856975 021-51078886</span>&nbsp;传真：<span>021-64051851</span>&nbsp;网址：
          <span>www.fm960.com.cn</span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }
}

export default madeUp_PutStorage;

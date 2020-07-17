/**
 *  成品管理-> 出库单   完成
 *  */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpOutStorageFrom, loading, cpPurchaseDetail }) => ({
  ...cpOutStorageFrom,
  ...cpPurchaseDetail,
  submitting: loading.effects['form/submitRegularForm'],
}))
class madeUp_OutStorage extends PureComponent {

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
      type: 'cpOutStorageFrom/cpOutStorageFrom_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload: {
            id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
            type: 'PJCK'
          },
          callback: (srcres) => {
            setTimeout(() => {
              window.print()
            }, 2000);
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
        type: 'PJCK'
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
        // strageType: 2,
        pageSize: 50,
        purchaseId: isNotBlank(location.query.id) ? location.query.id : '',
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
    const { cpOutStorageFromGet, cpPurchaseDetailList } = this.props;
    const { srcimg, srcimg1 } = this.state

    const arr = [{}, {}, {}, {}, {}, {}]

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
            height: '55mm',
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
                  style={{ width: '188mm', height: '20mm', fontSize: '14px', clear: 'both' }}
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
                          出库单 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
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
              </td></tr>
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
                      <td
                        style={{ textAlign: 'right', width: '12%', height: '5mm', background: '#cccccc' }}
                        nowrap="nowrap"
                      >
                        出库单号：
              </td>
                      <td style={{ borderBottom: '1px solid #000000', width: '23%', }}>
                        <div>
                          <span> {isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.id)
                            ? cpOutStorageFromGet.id
                            : ''}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', width: '12%', background: '#cccccc' }} nowrap="nowrap">
                        订单编号：
              </td>
                      <td style={{ borderBottom: '1px solid #000000', width: '24%', }}>
                        <div>
                          <span>
                            {isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.orderCode)
                              ? cpOutStorageFromGet.orderCode
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                        日 &nbsp; &nbsp;&nbsp; 期：
              </td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>  {isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.createDate)
                            ? cpOutStorageFromGet.createDate
                            : ''}</span>
                        </div>
                      </td>
                    </tr>
                    {/* <tr> */}

                    {/* <td style={{ textAlign: 'right', background: '#cccccc' }}>
                地 &nbsp; &nbsp; &nbsp;址：
              </td>
              <td colSpan={3} rowSpan={1} style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>大通...</span>
                </div>
              </td> */}
                    {/* <td style={{ textAlign: 'right', background: '#cccccc' }}>
                日 &nbsp; &nbsp;&nbsp; 期：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>2019-12-30...</span>
                </div>
              </td> */}
                    {/* </tr> */}
                    <tr>
                      <td style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                        客 &nbsp; &nbsp; &nbsp;户：
              </td>
                      <td colSpan={3} nowrap="noWrap" rowSpan={1} style={{ whiteSpace: 'nowrap' }}>
                        <div>
                          <span>
                            {isNotBlank(cpOutStorageFromGet) &&
                              isNotBlank(cpOutStorageFromGet.formType) && (cpOutStorageFromGet.formType == 5 || cpOutStorageFromGet.formType == 6)
                              ? (isNotBlank(cpOutStorageFromGet.createBy) && isNotBlank(cpOutStorageFromGet.createBy.name) ? cpOutStorageFromGet.createBy.name : '')
                              : (isNotBlank(cpOutStorageFromGet.client) && isNotBlank(cpOutStorageFromGet.client.clientCpmpany) ? cpOutStorageFromGet.client.clientCpmpany : '')}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', background: '#cccccc' }} nowrap="nowrap">
                        出库类型：
              </td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>{isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.stirageType)
                            ? cpOutStorageFromGet.stirageType : ''}</span>
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
                  width: '5%',
                  whiteSpace: 'nowrap',
                }}
              >
                单位
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
              ? cpPurchaseDetailList.list.map((Item, idnex) => {
                return (
                  <tr key={idnex}>
                    <td style={{ textAlign: 'center', height: '10mm' }}>
                      <span>{Number(idnex) + 1}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '14px' }}>
                        <span>
                          {isNotBlank(Item) &&
                            isNotBlank(Item.cpBillMaterial) &&
                            isNotBlank(Item.cpBillMaterial.billCode)
                            ? Item.cpBillMaterial.billCode
                            : ''}
                        </span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '14px' }}>
                        <span>
                          {isNotBlank(Item) &&
                            isNotBlank(Item.cpBillMaterial) &&
                            isNotBlank(Item.cpBillMaterial.name)
                            ? Item.cpBillMaterial.name
                            : null}
                        </span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.originalCode)
                          ? Item.cpBillMaterial.originalCode
                          : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>{isNotBlank(Item) &&
                        isNotBlank(Item.cpBillMaterial) &&
                        isNotBlank(Item.cpBillMaterial.one) &&
                        isNotBlank(Item.cpBillMaterial.one.model)
                        ? Item.cpBillMaterial.one.model
                        : null}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(Item) && isNotBlank(Item.number) ? Item.number : ''}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.unit)
                          ? Item.cpBillMaterial.unit
                          : ''}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div>
                        <span>
                          {isNotBlank(Item) && isNotBlank(Item.price) ? getPrice(Item.price) : ''}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div>
                        <span>
                          {isNotBlank(Item) && isNotBlank(Item.money) ? getPrice(Item.money) : ''}
                        </span>
                      </div>
                    </td>
                    {/* <td style={{ textAlign: 'center' }}>
                      <span>
                      <img src={isNotBlank(srcimg) && isNotBlank(srcimg[idnex+1]) ? getFullUrl(`/${srcimg[idnex+1]}`) : ''} width={80} />
                      <p> {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.billCode)
                          ? Item.cpBillMaterial.billCode
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

            <tr style={{ clear: 'both', height: '8mm', width: '188mm', fontSize: '14px' }}>
              <td colspan="9" style={{ border: 'none' }}>
                <strong>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 合计：<span>{getPrice(cpOutStorageFromGet.money)}</span>&nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 大写：
            <span>{this.convertCurrency(getPrice(cpOutStorageFromGet.money))}</span>
                </strong>
                <br /> 制单人：<span>{isNotBlank(cpOutStorageFromGet) && isNotBlank(cpOutStorageFromGet.createBy) && isNotBlank(cpOutStorageFromGet.createBy.name)
                  ? cpOutStorageFromGet.createBy.name
                  : ''}</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;经手人： &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp;领料人：
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

export default madeUp_OutStorage;

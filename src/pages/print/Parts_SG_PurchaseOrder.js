/**
 *  配件申购单打印
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpSubscribeFrom, loading }) => ({
  ...cpSubscribeFrom,
  submitting: loading.effects['cpSubscribeFrom/cpSubscribeFrom_DateilGte'],
}))
class Parts_SG_PurchaseOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      srcimg: '',
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpSubscribeFrom/cpSubscribeFrom_DateilGte',
        payload: {
          id: location.query.id,
          tag: 10,
          pageSize: 10,
        },
      })
      dispatch({
        type: 'cpSubscribeFrom/cpSubscribeFrom_DateilList',
        payload: { parent: location.query.id, current: 1, pageSize: 10, },
        callback: () => {
          // setTimeout(() => {
          //   window.print()
          // }, 1000);
        },
      });
    }

    // dispatch({
    //   type: 'sysarea/getFlatCode',
    //   payload: {
    //     id: location.query.id,
    //     type: 'ZCCG'
    //   },
    //   callback: (imgres) => {
    //     this.setState({
    //       srcimg: imgres.msg.split('|')
    //     })
    //   }
    // })
  }


  convertCurrency = (money) => {

    const cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');

    const cnIntRadice = new Array('', '拾', '佰', '仟');

    const cnIntUnits = new Array('', '万', '亿', '兆');

    const cnDecUnits = new Array('角', '分', '毫', '厘');

    const cnInteger = '整';

    const cnIntLast = '元';

    const maxNum = 999999999999999.9999;

    let integerNum;

    let decimalNum;

    let chineseStr = '';

    let parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
      return '';
    }
    if (money == 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
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
    const { CpMaterlalPurchaseDetail, CpMaterlalPurchaseDetailList } = this.props;
    const { srcimg } = this.state

    let alltol = 0

    isNotBlank(CpMaterlalPurchaseDetailList) && isNotBlank(CpMaterlalPurchaseDetailList.list) && CpMaterlalPurchaseDetailList.list.length > 0 && CpMaterlalPurchaseDetailList.list.map((item, index) => {
      alltol += parseFloat(item.money)
    })


    return (
      <div style={{ color: '#000', paddingLeft: '6mm', paddingRight: '6mm', width: '200mm', boxSizing: 'border-box' }}>
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
                  <span >Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                </strong>
                <br />
                <strong style={{ fontSize: '24px' }}>
                  材料申购单 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </strong>
              </td>
              <td style={{ textAlign: 'center', height: '20mm' }}>
                <span style={{ display: 'inline-block' }}>
                  <img src={isNotBlank(srcimg) && isNotBlank(srcimg[0]) ? getFullUrl(`/${srcimg[0]}`) : ''} width={80} />
                  <p style={{ textAlign: 'center' }}>单号</p>
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
          style={{ width: '188mm', fontSize: '14px', clear: 'both', height: '20mm' }}
        >
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', background: 'rgb(204, 204, 204)',width:'20mm' }} nowrap="nowrap">
                供货单位
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(CpMaterlalPurchaseDetail) &&
                      isNotBlank(CpMaterlalPurchaseDetail.cpSupplier) &&
                      isNotBlank(CpMaterlalPurchaseDetail.cpSupplier.name)
                      ? CpMaterlalPurchaseDetail.cpSupplier.name
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                用 &nbsp; &nbsp; &nbsp;途
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(CpMaterlalPurchaseDetail) &&
                      isNotBlank(CpMaterlalPurchaseDetail.purpose) &&
                      isNotBlank(CpMaterlalPurchaseDetail.purpose)
                      ? CpMaterlalPurchaseDetail.purpose
                      : null}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                备 &nbsp; &nbsp; &nbsp;注：
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(CpMaterlalPurchaseDetail) &&
                      isNotBlank(CpMaterlalPurchaseDetail.remark) &&
                      isNotBlank(CpMaterlalPurchaseDetail.remark)
                      ? CpMaterlalPurchaseDetail.remark
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ textAlign: 'center', width: '10mm', height: '5mm', background: '#cccccc' }}
              >
                序号
              </td>
              <td nowrap="nowrap" style={{ textAlign: 'center', background: '#cccccc', width: '20mm', whiteSpace: 'nowrap', }}>
                入库单号
              </td>
              <td nowrap="nowrap" style={{ textAlign: 'center', background: '#cccccc', width: '25mm', whiteSpace: 'nowrap', }}>
                发票类型
              </td>
              <td nowrap="noWrap" style={{ textAlign: 'center', background: '#cccccc', width: '20mm', whiteSpace: 'nowrap', }} >
                物料编码
              </td>
              <td nowrap="noWrap" style={{ textAlign: 'center', background: '#cccccc', width: '35mm', whiteSpace: 'nowrap', }} >
                名称
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '18mm',
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
                  width: '20mm',
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
                  width: '20mm',
                  whiteSpace: 'nowrap',
                }}
              >
                金额
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '22mm',
                  whiteSpace: 'nowrap',
                }}
              >
                备注
              </td>
            </tr>
            {isNotBlank(CpMaterlalPurchaseDetailList) &&
              isNotBlank(CpMaterlalPurchaseDetailList.list) &&
              CpMaterlalPurchaseDetailList.list.length > 0
              ? CpMaterlalPurchaseDetailList.list.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{ textAlign: 'center', height: '10mm' }}>
                      <span>{Number(index) + 1}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.storageId) ? item.storageId : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.makeNeed) ? item.makeNeed : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.cpBillMaterial) && isNotBlank(item.cpBillMaterial.billCode) ? item.cpBillMaterial.billCode : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.cpBillMaterial) && isNotBlank(item.cpBillMaterial.name) ? item.cpBillMaterial.name : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.numbers) ? item.numbers : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.price) ? getPrice(item.price) : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.money) ? getPrice(item.money) : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.remarks) ? item.remarks : null}
                      </span>
                    </td>
                  </tr>
                );
              })
              : null}
          </tbody>
        </table>
        <div style={{ clear: 'both', height: '6mm', width: '188mm', fontSize: '14px' }}>
          <strong style={{ float: 'right' }}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 合计：
            <span>{getPrice(alltol)}</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; 大写：<span>{this.convertCurrency(getPrice(alltol))}</span>
          </strong>
        </div>
        <div style={{ clear: 'both', height: '6mm', width: '188mm', fontSize: '14px' }}>
          <span>
            {isNotBlank(CpMaterlalPurchaseDetail) && isNotBlank(CpMaterlalPurchaseDetail.monthBelongs) ? moment(CpMaterlalPurchaseDetail.monthBelongs).format('YYYY-MM') : null}</span>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;请购人：
          &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp;审核：
        </div>
        <div style={{ clear: 'both', height: '6mm', width: '188mm', fontSize: '14px' }}>
          地址：<span>上海市闵行区兴梅路658号C座</span>&nbsp; &nbsp; &nbsp; &nbsp;电话：
          <span>021-54856975 021-51078886</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp;传真：<span>021-64051851</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;网址：
          <span>www.fm960.com.cn</span>
        </div>
      </div>
    );
  }
}

export default Parts_SG_PurchaseOrder;

/**
 *  配件采购-> 总成采购单 完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpZcPurchaseFrom, cpPurchaseDetail, loading }) => ({
  ...cpZcPurchaseFrom,
  ...cpPurchaseDetail,
  submitting: loading.effects['form/submitRegularForm'],
}))
class Parts_ZC_PurchaseOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      srcimg: '',
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpZcPurchaseFrom/cpZcPurchaseFrom_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      }
    });


    window.onafterprint = this.afterPrint

    dispatch({
      type: 'sysarea/getFlatCode',
      payload: {
        id: location.query.id,
        type: 'ZCCG'
      },
      callback: (imgres) => {
        this.setState({
          srcimg: imgres.msg.split('|')
        })
      }
    })

    dispatch({
      type: 'cpPurchaseDetail/cpPurchaseDetail_List',
      payload: {
        // strageType: 2,
        // intentionId: location.query.id,
        purchaseId: isNotBlank(location.query.id) ? location.query.id : '',
        pageSize: 50,
        ooType:1
      },
      callback: () => {
        setTimeout(() => {
          window.print()
        }, 1000);
      },
    });
  }

  afterPrint = () => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpZcPurchaseFrom/cpZcPurchaseFrom_print_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        printNumber: 1
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
    const { cpZcPurchaseFromGet, cpPurchaseDetailList } = this.props;
    const { srcimg } = this.state

    let alltol = 0

    isNotBlank(cpPurchaseDetailList) && isNotBlank(cpPurchaseDetailList.list) && cpPurchaseDetailList.list.length > 0 && cpPurchaseDetailList.list.map((item, index) => {
      alltol += parseFloat(item.money)
    })


    return (
      <div style={{ color: '#000', paddingLeft: '6mm', paddingRight: '6mm', width: '200mm', boxSizing: 'border-box' }}>
        <p> &nbsp;</p>
        {/*  <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '200mm', height: '10mm', fontSize: '14px', clear: 'both' }}
        >
          <tbody>
            <tr>
              <td style={{ width: '10%' }}> &nbsp;</td>
              <td style={{ textAlign: 'center', width: '80%' }}>
                <span>
                  <span style={{ fontFamily: 'C39HrP60DlTt', fontSize: '50px' }}>
                    *DI0214191230001* 
                  </span>
                </span>
              </td>
              <td style={{ textAlign: 'right', width: '10%' }}>
                <span style={{ fontSize: '14px' }}>
                  <span>
                    页码：<span tdata="pageNO">#</span>/<span tdata="pageCount">#</span>
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
                  总成采购订单 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
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
              <td style={{ width: '10%', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                采购单号：
              </td>
              <td style={{ width: '40%', borderBottom: '1px solid #000000' }}>
                <span> {isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.id)
                  ? cpZcPurchaseFromGet.id
                  : ''}</span>
              </td>
              <td style={{ width: '10%', textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                下单日期：
              </td>
              <td style={{ width: '40%', borderBottom: '1px solid #000000' }}>
                <div>
                  <span> {isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.createDate)
                    ? cpZcPurchaseFromGet.createDate
                    : ''}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">入库类型：</td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.storageType)
                      ? cpZcPurchaseFromGet.storageType
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap"> 所属公司：</td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpZcPurchaseFromGet) &&
                    isNotBlank(cpZcPurchaseFromGet.user) &&
                    isNotBlank(cpZcPurchaseFromGet.user.office)
                    && isNotBlank(cpZcPurchaseFromGet.user.office.name)
                    ? cpZcPurchaseFromGet.user.office.name
                    : null}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                供 &nbsp;应&nbsp;商：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpZcPurchaseFromGet) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier.name)
                      ? cpZcPurchaseFromGet.supplier.name
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                联 系&nbsp;人：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpZcPurchaseFromGet) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier.linkman)
                      ? cpZcPurchaseFromGet.supplier.linkman
                      : ''}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                电 &nbsp; &nbsp; &nbsp;话：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpZcPurchaseFromGet) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier.phone)
                      ? cpZcPurchaseFromGet.supplier.phone
                      : ''}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                传 &nbsp; &nbsp; &nbsp;真：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <span>
                  {isNotBlank(cpZcPurchaseFromGet) &&
                    isNotBlank(cpZcPurchaseFromGet.supplier) &&
                    isNotBlank(cpZcPurchaseFromGet.supplier.fax)
                    ? cpZcPurchaseFromGet.supplier.fax
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', background: 'rgb(204, 204, 204)' }} nowrap="nowrap">
                地 &nbsp; &nbsp; &nbsp;址：
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpZcPurchaseFromGet) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier) &&
                      isNotBlank(cpZcPurchaseFromGet.supplier.address)
                      ? cpZcPurchaseFromGet.supplier.address
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
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '35mm',
                  whiteSpace: 'nowrap',
                }}
              >
                总成型号
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '25mm',
                  whiteSpace: 'nowrap',
                }}
              >
                总成号
              </td>
              <td
                nowrap="noWrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '20mm',
                  whiteSpace: 'nowrap',
                }}
              >
                大号
              </td>
              <td
                nowrap="noWrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '20mm',
                  whiteSpace: 'nowrap',
                }}
              >
                小号
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
                品牌
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
                车型
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
                年份
              </td>
              {/* <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '18mm',
                  whiteSpace: 'nowrap',
                }}
              >
                技术参数
              </td> */}
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '22mm',
                  whiteSpace: 'nowrap',
                }}
              >
                需求日期
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
                采购数量
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '24mm',
                  whiteSpace: 'nowrap',
                }}
              >
                采购单价
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '24mm',
                  whiteSpace: 'nowrap',
                }}
              >
                采购金额
              </td>
              <td
                nowrap="nowrap"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '2omm',
                  whiteSpace: 'nowrap',
                }}
              >
                发票类型
              </td>
            </tr>
            {isNotBlank(cpPurchaseDetailList) &&
              isNotBlank(cpPurchaseDetailList.list) &&
              cpPurchaseDetailList.list.length > 0
              ? cpPurchaseDetailList.list.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{ textAlign: 'center', height: '10mm' }}>
                      <span>{Number(index) + 1}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.assemblyBuild) && isNotBlank(item.assemblyBuild.assemblyModel)
                          ? item.assemblyBuild.assemblyModel
                          : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.assemblyBuild) && isNotBlank(item.assemblyBuild.assemblyCode)
                          ? item.assemblyBuild.assemblyCode
                          : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.assemblyBuild) && isNotBlank(item.assemblyBuild.maxCode) ? item.assemblyBuild.maxCode : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.assemblyBuild) && isNotBlank(item.assemblyBuild.minCode) ? item.assemblyBuild.minCode : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.assemblyBuild) && isNotBlank(item.assemblyBuild.assemblyBrand)
                          ? item.assemblyBrand
                          : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.assemblyBuild) && isNotBlank(item.assemblyBuild.vehicleModel)
                          ? item.assemblyBuild.vehicleModel
                          : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.assemblyBuild) && isNotBlank(item.assemblyBuild.assemblyYear)
                          ? item.assemblyBuild.assemblyYear
                          : null}
                      </span>
                    </td>
                    {/* <td style={{ textAlign: 'center', fontSize: '12px' }}>
                        <span>无../</span>
                      </td> */}
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.needDate) ? item.needDate : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.number) ? item.number : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.price) ? getPrice(item.price) : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span>
                        {isNotBlank(item) && isNotBlank(item.money) ? getPrice(item.money) : null}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px' }}>
                      <div
                        style={{
                          width: '20mmmm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <span>
                          {isNotBlank(item) && isNotBlank(item.makeNeed) ? item.makeNeed : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
              : null}
          </tbody>
        </table>
        <div style={{ clear: 'both', height: '6mm', width: '188mm', fontSize: '14px' }}>
          <strong>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 合计：
              <span>{getPrice(alltol)}</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
         &nbsp; &nbsp; &nbsp;
              &nbsp; &nbsp; &nbsp; &nbsp; 大写：<span>{this.convertCurrency(getPrice(alltol))}</span>
          </strong>
        </div>
        <div style={{ clear: 'both', height: '6mm', width: '188mm', fontSize: '14px' }}>
          制单人：<span>
            {isNotBlank(cpZcPurchaseFromGet) && isNotBlank(cpZcPurchaseFromGet.createBy) && isNotBlank(cpZcPurchaseFromGet.createBy.name)
              ? cpZcPurchaseFromGet.createBy.name
              : ''}</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;经手人：
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

export default Parts_ZC_PurchaseOrder;

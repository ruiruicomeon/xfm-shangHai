/**
 * 作业管理 -> 报件单  完成
 *  */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import { Item } from 'gg-editor';
import styles from './jobmanage_ToQuote.less';

@connect(({ cpSingelForm, loading, cpBillMaterial }) => ({
  ...cpSingelForm,
  ...cpBillMaterial,
  submitting: loading.effects['form/submitRegularForm'],
}))
class jobmanage_ToQuote extends PureComponent {

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
      type: 'cpSingelForm/cpSingelForm_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      },
      callback: (res) => {
        dispatch({
          type: 'sysarea/getFlatOrderdCode',
          payload: {
            id: isNotBlank(res.data) && isNotBlank(res.data.orderCode) ? res.data.orderCode : '',
            type: 'BJD'
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
        type: 'BJD'
      },
      callback: (srcres) => {
        this.setState({
          srcimg: srcres.msg.split('|')
        })
      }
    })

    dispatch({
      type: 'cpBillMaterial/cpBillMaterial_middle_List',
      payload: {
        pageSize: 100,
        singelId: isNotBlank(location.query.id) ? location.query.id : '',
      },
    });
  }


  afterPrint = () => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpSingelForm/cpSingelForm_print_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        printNumber: 1
      },
    });
  }

  // showCode=(res)=>{
  //   const {dispatch} = this.prop
  //   let wlcode = ''
  //   dispatch({
  //     type: 'sysarea/getFlatCode',
  //     payload:{
  //     id:isNotBlank(res)?res:'',
  //     type:'BJD'
  //     },
  //     callback:(srcres)=>{
  //     this.setState({
  //     srcimg:srcres
  //     })
  //     }
  //     })
  // }



  render() {
    const { cpSingelFormGet, cpBillMaterialMiddleList } = this.props;
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
            border: 'none'
            // height: '185mm',
          }}
        >

          <thead style={{ display: 'table-header-group' }}>
            <tr style={{ border: 'none' }}>
              <td colSpan='7' style={{ border: 'none' }}>
                <p> &nbsp;</p>
                <table
                  align="left"
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ width: '188mm', height: '25mm', fontSize: '14px', clear: 'both' }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: '20mm', height: '25mm', textAlign: 'center' }}>
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
                          报件单 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
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
              <td colSpan='7' style={{ border: 'none' }}>
                <table
                  align="left"
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ width: '188mm', fontSize: '14px', clear: 'both', height: '20mm' }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{ textAlign: 'right', width: '10%', height: '5mm', background: '#cccccc' }}
                        nowrap="nowrap"
                      >
                        报件单号：
              </td>
                      <td style={{ borderBottom: '1px solid #000000', width: '25%', }}>
                        <div>
                          <span>
                            {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.id)
                              ? cpSingelFormGet.id
                              : ''}
                          </span>
                        </div>
                      </td>
                      {/* <td style={{ textAlign: 'right', width: '10%', background: '#cccccc' }}>
                老 单 号：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span />
                </div>
              </td> */}
                      <td style={{ textAlign: 'right', width: '10%', background: '#cccccc' }}
                        nowrap="nowrap"
                      >
                        日 &nbsp; &nbsp;&nbsp; 期：
              </td>
                      <td style={{ borderBottom: '1px solid #000000', width: '23%', }}>
                        <div>
                          <span> {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.createDate)
                            ? cpSingelFormGet.createDate
                            : ''}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', width: '10%', background: '#cccccc' }}
                        nowrap="nowrap"
                      > 报 件 人：</td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span><span> {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.createBy) && isNotBlank(cpSingelFormGet.createBy.name)
                            ? cpSingelFormGet.createBy.name
                            : ''}</span></span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', background: '#cccccc' }}
                        nowrap="nowrap"
                      > 订单编号：</td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>
                            {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.orderCode)
                              ? cpSingelFormGet.orderCode
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', background: '#cccccc' }}
                        nowrap="nowrap"
                      > 报件类型：</td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <div>
                          <span>
                            {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.type) && (cpSingelFormGet.type == 4 || cpSingelFormGet.type == 5) ? '内部订单报件'
                              : isNotBlank(cpSingelFormGet.quoteType) ? cpSingelFormGet.quoteType : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', background: '#cccccc' }}
                        nowrap="nowrap"
                      > 产品代码：</td>
                      <td style={{ borderBottom: '1px solid #000000' }}>
                        <span>
                          {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.productCode)
                            ? cpSingelFormGet.productCode
                            : ''}
                        </span>
                      </td>
                      {/* <td style={{ textAlign: 'right', background: '#cccccc' }}> 报件班组：</td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span />
                </div>
              </td> */}
                    </tr>
                    {/* <tr> */}
                    {/* <td style={{ textAlign: 'right', background: '#cccccc' }}>
                等 &nbsp; &nbsp; &nbsp;级：
              </td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>D</span>
                </div>
              </td> */}
                    {/* <td style={{ textAlign: 'right', background: '#cccccc' }}> 报件类型：</td>
              <td style={{ borderBottom: '1px solid #000000' }}>
                <div>
                  <span>
                    {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.quoteType)
                      ? cpSingelFormGet.quoteType
                      : ''}
                  </span>
                </div>
              </td> */}
                    {/* </tr> */}
                    <tr>
                      <td style={{ textAlign: 'right', background: '#cccccc' }}
                        nowrap="nowrap"
                      >
                        客 &nbsp; &nbsp; &nbsp;户：
              </td>
                      <td colSpan={3} nowrap="noWrap" style={{ whiteSpace: 'nowrap' }}>
                        <span style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                          {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.type) && (cpSingelFormGet.type == 5 || cpSingelFormGet.type == 6) ? (isNotBlank(cpSingelFormGet.user) && isNotBlank(cpSingelFormGet.user.name) ? cpSingelFormGet.user.name : '') : isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.client) && isNotBlank(cpSingelFormGet.client.clientCpmpany)
                            ? cpSingelFormGet.client.clientCpmpany
                            : ''}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', background: '#cccccc' }}
                        nowrap="nowrap"
                      >
                        总成型号：
              </td>
                      <td nowrap="noWrap" style={{ whiteSpace: 'nowrap' }}>
                        <span style={{ width: '40mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                          {isNotBlank(cpSingelFormGet) && isNotBlank(cpSingelFormGet.cpAssemblyBuild) && isNotBlank(cpSingelFormGet.cpAssemblyBuild.assemblyModel) ?
                            cpSingelFormGet.cpAssemblyBuild.assemblyModel : ''}
                        </span>
                      </td>
                      {/* <td style={{ textAlign: 'right', background: '#cccccc' }}> 变 速 箱：</td>
              <td>
                <span />
              </td> */}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td
                colspan="1"
                style={{
                  textAlign: 'center',
                  width: '5%',
                  height: '5mm',
                  background: 'rgb(204, 204, 204)',
                }}
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
                colspan="1"
                style={{
                  textAlign: 'center',
                  background: '#cccccc',
                  width: '25%',
                  whiteSpace: 'nowrap',
                }}
              >
                物料名称
              </td>
              <td
                nowrap="noWrap"
                style={{
                  textAlign: 'center',
                  width: '15%',
                  whiteSpace: 'nowrap',
                  background: 'rgb(204, 204, 204)',
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
                  width: '10%',
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
              {/* <td
                nowrap="noWrap"
                style={{
                  textAlign: 'center',
                  width: '30%',
                  whiteSpace: 'nowrap',
                  background: 'rgb(204, 204, 204)',
                }}
              >
                二维码
              </td> */}
            </tr>
          </thead>
          <tbody>

            {isNotBlank(cpBillMaterialMiddleList) &&
              isNotBlank(cpBillMaterialMiddleList.list) &&
              cpBillMaterialMiddleList.list.length > 0
              ? cpBillMaterialMiddleList.list.map((Item, index) => {
                if (isNotBlank(Item) && isNotBlank(Item.id)) {
                  return (
                    <tr key={index} >
                      <td style={{ textAlign: 'center', height: '10mm' }}>
                        <span>{Number(index) + 1}</span>
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
                            {isNotBlank(Item.cpBillMaterial) && isNotBlank(Item.cpBillMaterial.name)
                              ? Item.cpBillMaterial.name
                              : ''}
                          </span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{ width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                        >
                          {isNotBlank(Item.cpBillMaterial) && isNotBlank(Item.cpBillMaterial.originalCode)
                            ? Item.cpBillMaterial.originalCode
                            : ''}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span> {isNotBlank(Item.cpBillMaterial) && isNotBlank(Item.cpBillMaterial.one) && isNotBlank(Item.cpBillMaterial.one.model)
                          ? Item.cpBillMaterial.one.model
                          : ''}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span>
                          {isNotBlank(Item) && isNotBlank(Item.number) ? Item.number : ' '}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span>{isNotBlank(Item) && isNotBlank(Item.cpBillMaterial) && (Item.cpBillMaterial.unit) ? Item.cpBillMaterial.unit : ' '}</span>
                      </td>
                      {/* <td style={{ textAlign: 'center' }}>
                        <span>
                          <img src={isNotBlank(srcimg) && isNotBlank(srcimg[index+1]) ? getFullUrl(`/${srcimg[index+1]}`) : ''} width={80} />
                          <p> {isNotBlank(Item) &&
                          isNotBlank(Item.cpBillMaterial) &&
                          isNotBlank(Item.cpBillMaterial.billCode)
                          ? Item.cpBillMaterial.billCode
                          : ''}</p>
                        </span>
                      </td> */}
                    </tr>
                  );

                }
                return ''
              })
              : ''}

            {isNotBlank(arr) && (!isNotBlank(cpBillMaterialMiddleList.list) || cpBillMaterialMiddleList.list.length < 6) && arr.splice(!isNotBlank(cpBillMaterialMiddleList.list) ? 0 : cpBillMaterialMiddleList.list.length).map(() => {
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
                    <span style={{ width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word' }} />
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
              <td colSpan="7" style={{ border: 'none' }}>
                地址：<span>上海市闵行区兴梅路658号C座</span>&nbsp;&nbsp;电话：
          <span>021-54856975 021-51078886</span>&nbsp;&nbsp;传真：<span>021-64051851</span>&nbsp;&nbsp;网址：
          <span>www.fm960.com.cn</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default jobmanage_ToQuote;

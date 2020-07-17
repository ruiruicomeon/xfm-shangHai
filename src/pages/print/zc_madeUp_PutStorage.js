/**
 * 总成入库单
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpProduct, loading }) => ({
    ...cpProduct,
    submitting: loading.effects['form/submitRegularForm'],
}))
class zcMadeUpPutStorage extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            srcimg: '',
            srcimg1:''
        }
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        dispatch({
            type: 'cpProduct/cpProduct_Get',  
            payload: {
                id: isNotBlank(location.query.id) ? location.query.id : '',
                genTableColumn: 1
            },
            callback: (res) => {
              dispatch({
                type: 'sysarea/getFlatOrderdCode',
                payload:{
                id:isNotBlank(res.data)&&isNotBlank(res.data.zcPurchaseCode)?res.data.zcPurchaseCode:'',
                type:'ZCRK'
                },
                callback:(imgres)=>{
                this.setState({
                srcimg1:imgres
                })
                }
                })
                setTimeout(() => {
                    window.print()
                }, 1000);
            },
        });

        dispatch({
          type: 'sysarea/getFlatCode',
          payload:{
          id:location.query.id,
          type:'ZCRK'
          },
          callback:(imgres)=>{
          this.setState({
            srcimg:imgres.msg.split('|')[0]
          })
          }
          })


    }

    render() {
        const { cpProductGet } = this.props;
        const { srcimg ,srcimg1} = this.state

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
  {/* <table border={0} cellPadding={0} cellSpacing={0} style={{width: '188mm', height: '10mm', fontSize: '14px', clear: 'both'}}>
          <tbody>
            <tr>
              <td style={{width: '10%'}}> &nbsp;</td> 
              <td style={{textAlign: 'center', width: '80%'}}><span><span style={{fontFamily: 'C39HrP60DlTt', fontSize: '50px'}}>*{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.zcPurchaseCode) ? cpProductGet.zcPurchaseCode : ''}*</span></span></td> 
              <td style={{textAlign: 'right', width: '10%'}}> &nbsp;</td> 
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
                  <br /> <strong style={{ fontSize: '24px' }}>总成入库单 &nbsp;&nbsp;</strong>
                </strong>
              </td>
              <td style={{ textAlign: 'center', height: '20mm' }}>
                <span style={{ display: 'inline-block' }}>
                  <img src={isNotBlank(srcimg) ? getFullUrl(`/${srcimg}`) : ''} width={80} />
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
        {/* <table border={0} cellPadding={0} cellSpacing={0} style={{width: '195mm', height: '20mm', fontSize: '14px', clear: 'both'}}>
          <tbody>
            <tr>
              <td style={{width: '20mm', height: '20mm', textAlign: 'center'}}><span><img src="Download.aspx?GID=a42e51c1058f4c22a8cbce330b9f3258&OutType=Inline&FROM_SESSION_ID=3whnsmnlbdggmjbu232hpc32&t=637243645384071831" width={60} /></span></td> 
              <td style={{textAlign: 'center'}}> <strong style={{fontSize: '20px'}}><span>上海新孚美 - 配件中心</span></strong><br /> <strong style={{fontSize: '20px'}}><span>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span></strong><br /> <strong style={{fontSize: '20px'}}>成品总成入库单 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</strong></td> 
            </tr> 
          </tbody>
        </table> */}
        <div style={{height: '2mm', lineHeight: '2mm', display: 'block'}}>
          &nbsp;
        </div>
        <table border={0} cellPadding={5} cellSpacing={0} style={{width: '188mm'}}>
          <tbody>
            <tr>
              <td nowrap="noWrap" style={{width: '20mm', whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}>入库单号：</span></td> 
              <td nowrap="nowrap" style={{width: '75mm', borderBottom: '1px solid #000000'}}> <span style={{fontSize: '14px'}}><span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.zcPurchaseCode) ? cpProductGet.zcPurchaseCode : ''}</span></span></td> 
              <td nowrap="noWrap" style={{width: '20mm', whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}>入库日期：</span></td> 
              <td nowrap="nowrap" style={{width: '75mm', borderBottom: '1px solid #000000'}}> <span style={{fontSize: '14px'}}><span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.createDate) ? cpProductGet.createDate : ''}</span></span></td> 
            </tr> 
            <tr>
              <td nowrap="noWrap" style={{whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>大&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 号：</span></span></td> 
      <td nowrap="nowrap" style={{borderBottom: '1px solid #000000'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.maxCode) ? cpProductGet.assemblyBuild.maxCode : ''}</span></span></span></td> 
              <td nowrap="noWrap" style={{whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>供&nbsp; 应 &nbsp;商：</span></span></td> 
      <td nowrap="nowrap" style={{borderBottom: '1px solid #000000'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.supplier) && isNotBlank(cpProductGet.supplier.name) ? cpProductGet.supplier.name:''}</span></span></span></td> 
            </tr> 
            <tr>
              <td nowrap="noWrap" style={{height: '2mm', whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}>金额：</span></td> 
              <td nowrap="nowrap" style={{borderBottom: '1px solid #000000'}}> 
                <div>
      <span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.money) ?getPrice(cpProductGet.money) : ''}</span>
                </div> </td> 
              <td nowrap="noWrap" style={{whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}>销售单号：</span></td> 
      <td nowrap="nowrap" style={{borderBottom: '1px solid #000000'}}><span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.supplierCode) ? cpProductGet.supplierCode : ''}</span></td> 
            </tr> 
            <tr>
              <td nowrap="noWrap" style={{height: '2mm', whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}>质量标准：</span></td> 
              <td nowrap="nowrap" style={{borderBottom: '1px solid #000000'}}> 
                <div>
      <span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.quality) ? cpProductGet.quality : ''}</span>
                </div> </td> 
              <td nowrap="noWrap" style={{whiteSpace: 'nowrap', backgroundColor: 'rgb(204, 204, 204)'}}> <span style={{fontSize: '14px'}}>油品情况：</span></td> 
              <td nowrap="nowrap" style={{borderBottom: '1px solid #000000'}}> 
                <div>
      <span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.oils) ? cpProductGet.oils : ''}</span>
                </div> </td> 
            </tr> 
          </tbody>
        </table>
        <div style={{height: '2mm', lineHeight: '2mm', display: 'block'}}>
          &nbsp;
        </div>
        <table border={1} cellPadding={2} className="thin" style={{width: '188mm'}}>
          <tbody>
            <tr>
              <td nowrap="nowrap" style={{width: '35mm'}}> <span style={{fontSize: '14px'}}>总成编码</span></td> 
              <td nowrap="nowrap" style={{width: '18mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>总成型号</span></span></td> 
              <td nowrap="nowrap" style={{width: '18mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>总成号</span></span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>品牌</span></span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>车型排量</span></span></td> 
              <td nowrap="nowrap" style={{width: '10mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>数量</span></span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>仓库</span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>库位</span></td> 
            </tr> 
            <tr>
              <td> <span style={{fontSize: '14px'}}><span style={{width: '35mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpProductGet)&& isNotBlank(cpProductGet.purchaseCode) ? cpProductGet.purchaseCode : ''}</span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpProductGet)&& isNotBlank(cpProductGet.assemblyBuild) && isNotBlank(cpProductGet.assemblyBuild.assemblyModel) ? cpProductGet.assemblyBuild.assemblyModel : ''}</span></span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.assemblyCode) ? cpProductGet.assemblyBuild.assemblyCode : ''}</span></span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '12px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} />{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.assemblyBrand) ? cpProductGet.assemblyBuild.assemblyBrand : ''}</span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.vehicleModel) ? cpProductGet.assemblyBuild.vehicleModel : ''}</span></span></span></td> 
      <td nowrap="nowrap"> <span style={{fontSize: '12px'}}><span style={{fontSize: '14px'}}><span style={{width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.number) ? cpProductGet.number : ''}</span></span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.cpEntrepot) && isNotBlank(cpProductGet.cpEntrepot.name) ? cpProductGet.cpEntrepot.name : ''}</span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.storage) && isNotBlank(cpProductGet.storage.name) ? cpProductGet.storage.name : ''}</span></span></td> 
            </tr> 
            <tr>
              <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>总成类型：</span></td> 
      <td colSpan={7}><span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.assemblyBuild)&& isNotBlank(cpProductGet.assemblyBuild.assemblyType) ? cpProductGet.assemblyBuild.assemblyType : ''}</span></td> 
            </tr> 
            <tr>
              <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 注：</span></td> 
              <td colSpan={7}> <span style={{fontSize: '14px'}}>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.remarks) ? cpProductGet.remarks : ''}<span /></span></td> 
            </tr> 
          </tbody>
        </table>
        <table border={0} cellPadding={5} cellSpacing={0} style={{width: '188mm'}}>
          <tbody>
            <tr>
              <td style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>制 单 人：</span></td> 
      <td colSpan={5} style={{verticalAlign: 'bottom'}}> <span style={{fontSize: '14px'}}><span>{isNotBlank(cpProductGet) && isNotBlank(cpProductGet.createBy)&& isNotBlank(cpProductGet.createBy.name) ? cpProductGet.createBy.name : ''}</span></span></td> 
              <td style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>审 &nbsp; &nbsp;核：</span></td> 
              <td colSpan={2} nowrap="nowrap" style={{verticalAlign: 'bottom'}}> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
            </tr> 
            <tr>
              <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>地 &nbsp; &nbsp; &nbsp;址：</span></td> 
              <td colSpan={5} nowrap="nowrap" rowSpan={1}> <span style={{fontSize: '14px'}}><span>上海市闵行区兴梅路658号C座</span></span></td> 
              <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>电 &nbsp; &nbsp;话：</span></td> 
              <td colSpan={2} nowrap="nowrap"> <span style={{fontSize: '14px'}}><span>021-54856975</span></span></td> 
            </tr> 
          </tbody>
        </table>
            </div>
        );
    }
}

export default zcMadeUpPutStorage;

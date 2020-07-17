/**
 * 总成出库单
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpOutProduct, loading }) => ({
    ...cpOutProduct,
    submitting: loading.effects['form/submitRegularForm'],
}))
class businessintentionprint extends PureComponent {

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
            type: 'cpOutProduct/cpOutProduct_Get',
            payload: {
                id: isNotBlank(location.query.id) ? location.query.id : '',
                genTableColumn: 1
            },
            callback: (res) => {
                dispatch({
                    type: 'sysarea/getFlatOrderdCode',
                    payload:{
                    id:isNotBlank(res.data)&&isNotBlank(res.data.orderCode)?res.data.orderCode:'',
                    type:'ZCCK'
                    },
                    callback:(imgres)=>{
                        setTimeout(() => {
                            window.print()
                        }, 1000);
                    this.setState({
                    srcimg1:imgres
                    })
                    }
                    })

            },
        });

        dispatch({
            type: 'sysarea/getFlatCode',
            payload:{
            id:location.query.id,
            type:'ZCCK'
            },
            callback:(imgres)=>{
            this.setState({
                srcimg:imgres.msg.split('|')[0]
            })
            }
            })


    }

    render() {
        const { cpOutProductGet } = this.props;
        const { srcimg ,srcimg1 } = this.state

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
                  <br /> <strong style={{ fontSize: '24px' }}>总成出库单 &nbsp;&nbsp;</strong>
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

    <table align="center" cellPadding={1} cellSpacing={5} style={{width: '188mm'}}>
        <tbody>
          {/* <tr>
            <td colSpan={9} nowrap="nowrap" style={{textAlign: 'center'}}> <h2> <br /> <strong><span style={{fontSize: '20px'}}><span>上海新孚美变速箱技术服务有限公司</span></span></strong></h2> <p> <span style={{fontSize: '16px'}}>成品出库单</span><br /> &nbsp;</p> </td> 
          </tr>  */}
          <tr>
            <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>单号：</span></td> 
    <td colSpan={2} nowrap="nowrap" style={{width: '30mm'}}> <span style={{fontSize: '14px'}}><span style={{width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.id) ? cpOutProductGet.id : ''}</span></span></td> 
            {/* <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>业&nbsp; 务 员：</span></td> 
            <td colSpan={2} nowrap="nowrap" style={{width: '22mm'}}> <span style={{fontSize: '14px'}}><span style={{width: '22mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td>  */}
            <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>出库日期：</span></td> 
            <td colSpan={2} nowrap="nowrap" style={{width: '32mm'}}> <span style={{fontSize: '14px'}}><span style={{width: '32mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.createDate) ? cpOutProductGet.createDate : ''}</span></span></td> 
           <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>订单编号：</span></td> 
            <td colSpan={2} nowrap="nowrap"> <span style={{fontSize: '14px'}}><span style={{width: '32mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.orderCode) ? cpOutProductGet.orderCode : ''}</span></span></td> 
          </tr> 
          {/* <tr>
            <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>客户名称：</span></td> 
            <td colSpan={2} nowrap="nowrap"> <span style={{fontSize: '14px'}}><span style={{width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>3bfb30dfa97848ea801c1f2f21e3ad74</span></span></td> 
            <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>所属区域：</span></td> 
            <td colSpan={2} nowrap="nowrap"> <span style={{fontSize: '14px'}}><span style={{width: '22mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
            <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>订单编号：</span></td> 
            <td colSpan={2} nowrap="nowrap"> <span style={{fontSize: '14px'}}><span style={{width: '32mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.orderCode) ? cpOutProductGet.orderCode : ''}</span></span></td> 
          </tr>  */}
          <tr>
            <td nowrap="nowrap" style={{height: '6mm', verticalAlign: 'top'}}> <span style={{fontSize: '14px'}}>大&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 号：</span></td> 
        <td colSpan={2} nowrap="nowrap" style={{verticalAlign: 'top'}}> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.maxCode) ? cpOutProductGet.assemblyBuild.maxCode : ''}</span></span></td> 
            <td nowrap="nowrap" style={{verticalAlign: 'top'}}> <span style={{fontSize: '14px'}}>出库类型：</span></td> 
        <td colSpan={2} nowrap="nowrap" style={{verticalAlign: 'top'}}> <span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} />{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.zcStirageType) ? cpOutProductGet.zcStirageType : ''}</span></td> 
            <td nowrap="nowrap" style={{verticalAlign: 'top'}}> <span style={{fontSize: '14px'}}>仓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库：</span></td> 
        <td colSpan={2} nowrap="nowrap" style={{verticalAlign: 'top'}}> <span style={{fontSize: '14px'}}><span style={{width: '32mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.cpEntrepot)&& isNotBlank(cpOutProductGet.cpEntrepot.name)  ?cpOutProductGet.cpEntrepot.name : ''}</span></span></td> 
          </tr> 
          <tr>
            <td colSpan={9} nowrap="nowrap"> 
              <table align="left" border={1} cellPadding={2} className="thin" style={{width: '190mm'}}>
                <tbody>
                <tr>
              <td nowrap="nowrap" style={{width: '35mm'}}> <span style={{fontSize: '14px'}}>总成编码</span></td> 
              <td nowrap="nowrap" style={{width: '18mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>总成型号</span></span></td> 
              <td nowrap="nowrap" style={{width: '18mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>总成号</span></span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>品牌</span></span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>车型排量</span></span></td> 
              <td nowrap="nowrap" style={{width: '10mm'}}> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}>数量</span></span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>金额</span></td> 
              <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>库位</span></td> 
            </tr> 
            <tr>
              <td> <span style={{fontSize: '14px'}}><span style={{width: '35mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet)&& isNotBlank(cpOutProductGet.purchaseCode) ? cpOutProductGet.purchaseCode : ''}</span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet)&& isNotBlank(cpOutProductGet.assemblyBuild) && isNotBlank(cpOutProductGet.assemblyBuild.assemblyModel) ? cpOutProductGet.assemblyBuild.assemblyModel : ''}</span></span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild)&& isNotBlank(cpOutProductGet.assemblyBuild.assemblyCode) ? cpOutProductGet.assemblyBuild.assemblyCode : ''}</span></span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '12px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} />{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild)&& isNotBlank(cpOutProductGet.assemblyBuild.assemblyBrand) ? cpOutProductGet.assemblyBuild.assemblyBrand : ''}</span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.assemblyBuild)&& isNotBlank(cpOutProductGet.assemblyBuild.vehicleModel) ? cpOutProductGet.assemblyBuild.vehicleModel : ''}</span></span></span></td> 
      <td nowrap="nowrap"> <span style={{fontSize: '12px'}}><span style={{fontSize: '14px'}}><span style={{width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.number) ? cpOutProductGet.number : ''}</span></span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.money) ?getPrice(cpOutProductGet.money) : ''}</span></span></td> 
      <td> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.storage) && isNotBlank(cpOutProductGet.storage.name) ? cpOutProductGet.storage.name : ''}</span></span></td> 
            </tr> 
                  {/* <tr>
                    <td nowrap="nowrap" style={{width: '32mm'}}> <span style={{fontSize: '14px'}}>总成编码</span></td> 
                    <td nowrap="nowrap" style={{width: '22mm'}}> <span style={{fontSize: '14px'}}>原始订单号</span></td> 
                    <td nowrap="nowrap" style={{width: '25mm'}}> <span style={{fontSize: '14px'}}>原始客户</span></td> 
                    <td nowrap="nowrap" style={{width: '18mm'}}> <span style={{fontSize: '14px'}}>总成型号</span></td> 
                    <td nowrap="nowrap" style={{width: '18mm'}}> <span style={{fontSize: '14px'}}>总成号</span></td> 
                    <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>品牌</span></td> 
                    <td nowrap="nowrap" style={{width: '20mm'}}> <span style={{fontSize: '14px'}}>车型排量</span></td> 
                    <td nowrap="nowrap" style={{width: '10mm'}}> <span style={{fontSize: '14px'}}>数量</span></td> 
                    <td nowrap="nowrap" style={{width: '18mm'}}> <span style={{fontSize: '14px'}}>金额</span></td> 
                  </tr> 
                  <tr>
                    <td> <span style={{fontSize: '14px'}}><span style={{width: '32mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
                    <td> <span style={{fontSize: '14px'}}><span style={{width: '22mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
                    <td> <span style={{fontSize: '14px'}}><span style={{width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
                    <td> <span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>001-FMD</span></span></td> 
                    <td> <span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
                    <td> <span style={{fontSize: '12px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
                    <td> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>POLO1.4</span></span></td> 
                    <td nowrap="nowrap"> <span style={{fontSize: '14px'}}><span style={{width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>1</span></span></td> 
                    <td nowrap="nowrap"> <span style={{fontSize: '14px'}}><span style={{width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>500.00</span></span></td> 
                  </tr>  */}
                  <tr>
                    <td nowrap="nowrap"> 备&nbsp;&nbsp; 注：</td> 
                    <td colSpan={8}> <span style={{fontSize: '14px'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.remarks) ? cpOutProductGet.remarks : ''}<span /></span></td> 
                  </tr> 
                </tbody> 
              </table> </td> 
          </tr> 
          <tr>
            <td nowrap="nowrap" style={{height: '6mm', verticalAlign: 'bottom'}}> <span style={{fontSize: '14px'}}>制单人：</span></td> 
            <td colSpan={2} nowrap="nowrap" style={{verticalAlign: 'bottom'}}> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>{isNotBlank(cpOutProductGet) && isNotBlank(cpOutProductGet.createBy)&& isNotBlank(cpOutProductGet.createBy.name) ? cpOutProductGet.createBy.name : ''}</span></span></td> 
            <td colSpan={2} nowrap="nowrap"> &nbsp;</td> 
            <td nowrap="nowrap"> &nbsp;</td> 
            <td nowrap="nowrap" style={{verticalAlign: 'bottom'}}> <span style={{fontSize: '14px'}}>审核：</span></td> 
            <td colSpan={2} nowrap="nowrap" style={{verticalAlign: 'bottom'}}> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}} /></span></td> 
          </tr> 
          <tr>
            <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>地&nbsp;&nbsp;&nbsp; 址：</span></td> 
            <td colSpan={4} nowrap="nowrap"> <span style={{fontSize: '14px'}}><span>上海市闵行区兴梅路658号C座</span></span></td> 
            <td nowrap="nowrap"> &nbsp;</td> 
            <td nowrap="nowrap"> <span style={{fontSize: '14px'}}>电话：</span></td> 
            <td colSpan={2} nowrap="nowrap"> <span style={{fontSize: '14px'}}><span style={{width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word'}}>021-54856975</span></span></td> 
          </tr> 
        </tbody>
      </table>

            </div>
        );
    }
}

export default businessintentionprint;

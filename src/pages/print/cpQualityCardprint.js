/**
 * 业务管理 -> 质量保证   完成
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpQualityCard, loading }) => ({
  ...cpQualityCard,
  submitting: loading.effects['form/submitRegularForm'],
}))
class cpQualityCardprint extends PureComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpQualityCard/cpQualityCard_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
        genTableColumn: 1
      },
      callback: () => {
        setTimeout(() => {
          window.print()
        }, 1000); 
      },
    });
  }

  render() {
    const { cpQualityCardGet } = this.props;


    return (
      <div style={{ color: '#000' ,paddingLeft:'6mm',paddingRight:'6mm',width:'200mm',boxSizing:'border-box'}}>
        <p> &nbsp;</p>
        <p> &nbsp;</p>
        <table
          align="left"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '188mm', fontSize: '14px', clear: 'both',marginBottom:'20px' }}
        >
          <tbody>
            <tr>
              <td style={{ width: '20mm', height: '20mm', textAlign: 'center' }}>
                <span>
                  <img src="./XFM_Logo.jpg" width={60} />
                </span>
              </td>
              <td style={{ textAlign: 'center' }} >
                <strong style={{ fontSize: '18px' }}>
                  <span>上海新孚美变速箱技术服务有限公司</span>
                  <br />
                  <span style={{fontSize:'14px'}}>Shanghai xinfumei auto transmission Technicl Services Co.,Ltd</span>
                </strong>
                <br /> <strong style={{ fontSize: '24px' }}>质量保证卡 &nbsp;&nbsp;</strong>
              </td>
              {/* <td style={{ textAlign: 'center', height: '20mm' }}>
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
              </td> */}
            </tr>
          </tbody>
        </table>
        <div style={{fontSize:'16px',marginBottom:'8px'}}>&nbsp; &nbsp;&nbsp; &nbsp;承蒙选择孚美公司的产品服务,谨此为谢!我们将根据本卡事项提供相应的保修服务,请小心保管,在申请保修时敬请出示.</div>
        <table
          align="left"
          border={1}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: '188mm', fontSize: '14px', clear: 'both' ,marginBottom:'8px'}}
        >
          <tbody>
            {/* <tr>
              <td colSpan={6}>承蒙选择孚美公司的产品服务,谨此为谢!我们将根据本卡事项提供相应的保修服务,请小心保管,在申请保修时敬请出示.</td></tr>*/}
            <tr>
              <td style={{ textAlign: 'right', width: '95px', height: '7mm' }} >
                名称：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '168px',
                }}
                colSpan={3}
                rowSpan={1}
              >
                <span>
                  {isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.client) && isNotBlank(cpQualityCardGet.client.clientCpmpany) ? cpQualityCardGet.client.clientCpmpany : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', width: '95px', height: '7mm' }}>
                产品号码：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '168px',
                }}
              >
                <span>
                  {isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.assemblyBuildId)&& isNotBlank(cpQualityCardGet.assemblyBuildId.assemblyModel) ? cpQualityCardGet.assemblyBuildId.assemblyModel : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', width: '95px', height: '7mm' }}>
                委托书：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '168px',
                }}
              >
                <span>
                  {isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.orderCode) ? cpQualityCardGet.orderCode : ''}
                </span>
              </td>
              <td style={{ textAlign: 'right', width: '95px', height: '7mm' }}>
                钢印：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '168px',
                }}
              >
                <span>
                  
                </span>
              </td>
              <td style={{ textAlign: 'right', width: '95px', height: '7mm' }}>
                出厂日期：
              </td>
              <td
                style={{
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgb(0,0,0)',
                  width: '168px',
                }}
              >
                <span>
                  {isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.createDate) ? cpQualityCardGet.createDate : ''}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{fontSize:'15px',marginBottom:'8px'}}>
              质量担保期限：
            </div>
            <div>
            &nbsp; &nbsp;&nbsp; &nbsp;孚美公司对意思服务项目提供保修服务,自 <span style={{fontWeight:650}}> {isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.zbDate) ? cpQualityCardGet.zbDate : ''} </span> 日起至 <span style={{fontWeight:650}}> {isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.expireDate) ? cpQualityCardGet.expireDate : ''} </span> 日止
            </div>
        <div style={{fontSize:'15px',margin:'16px 0 8px 0'}}>质量保修范围：</div>
        <table 
            align="left"
            border={1}
            cellPadding={0}
            cellSpacing={0}
            style={{ width: '188mm', fontSize: '14px', clear: 'both' ,marginBottom:'10px' }}
            // tableLayout = 'fixed'
            >
              
          <tbody>
            <tr>
                <td>AT质保范围</td>
                <td>CVT质保范围</td>
            </tr>
            <tr style={{height:'20mm'}}>
                <td style={{textAlign:'Center',verticalAlign:'middle'}}>{isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.atScope) ? cpQualityCardGet.atScope : ''}</td>
                <td style={{textAlign:'Center',verticalAlign:'middle'}}>{isNotBlank(cpQualityCardGet) && isNotBlank(cpQualityCardGet.cvtScope) ? cpQualityCardGet.cvtScope : ''}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr style={{fontSize:'15px'}}>
              下列情况不属于保修范围：
            </tr>

            <tr>
              <ul style={{listStyle:'disc',marginBottom:'8px'}}>
                <li>未更换的电子控制单元</li>
                <li>更换壳体,更换差速器等单项目维修</li>
                <li>孚美提示但客户拒接更换的部件</li>
                <li>因外力撞击所造成的损坏</li>
                <li>因整车电子控制系统故障引发的变速箱工作不良</li>
                <li>因散热器堵塞，进水等引发的故障</li>
                <li>因作为赛车,牵引车使用造成的变速箱损伤</li>
                <li>因大修后5000公里未做换油首保的变速箱</li>
              </ul>
            </tr>
            <p> &nbsp;</p>
            <tr style={{textAlign:'right'}}>
              <p>上海新孚美变速箱技术有限公司</p>
              <p>日期:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日 </p>
            </tr>
            <p> &nbsp;</p>
            <p> &nbsp;</p>
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                地址：<span>上海市闵行区兴梅路658号C座</span>&nbsp;电话：
                <span>021-54856975 021-51078886</span>&nbsp; 传真：<span>021-64051851</span>
                &nbsp;网址：<span>www.fm960.com.cn</span>
                <br /> &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default cpQualityCardprint;

/**
 *  成品管理-> 拆件入库单   没有-------
 *  */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, getPrice, setPrice } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';

@connect(({ cpInStorageFrom, loading }) => ({
  ...cpInStorageFrom,
  submitting: loading.effects['form/submitRegularForm'],
}))
class madeUp_DisconnentPutStorage extends PureComponent {
  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'cpInStorageFrom/cpInStorageFrom_Get',
      payload: {
        id: isNotBlank(location.query.id) ? location.query.id : '',
      },
      callback: () => {
        setTimeout(() => {
          window.print()
        }, 1000); 
      },
    });
  }

  render() {
    const {} = this.props;

    return (
      <table align="center" cellPadding={1} cellSpacing={1} style={{color:'#000'}}>
        <tbody>
          <tr>
            <td colSpan={9} nowrap="nowrap" style={{ whiteSpace: 'nowrap', height: '15mm' }}>
              <p style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '22px' }}>
                  <strong>
                    <span>上海新孚美 - 方向机中心</span>拆件入库单
                  </strong>
                </span>
              </p>
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              nowrap="nowrap"
              style={{ width: '19mm', whiteSpace: 'nowrap', height: '6mm' }}
            >
              <span style={{ fontSize: '14px' }}>仓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 库：</span>
            </td>
            <td nowrap="nowrap" style={{ width: '65mm', whiteSpace: 'nowrap', height: '6mm' }}>
              <span style={{ fontSize: '14px' }}>
                <span style={{ width: '65mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  方向机配件库
                </span>
              </span>
            </td>
            <td colSpan={3} nowrap="nowrap" style={{ width: '30mm', whiteSpace: 'nowrap' }}>
              &nbsp;
            </td>
            <td nowrap="nowrap" style={{ width: '19mm', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '14px' }}>入库单号：</span>
            </td>
            <td colSpan={2} nowrap="nowrap" style={{ width: '40mm', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '14px' }}>
                <span style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  CC0134191230005
                </span>
              </span>
              <span style={{ fontSize: '14px' }}>
                <span style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  页码1
                </span>
              </span>
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              nowrap="nowrap"
              style={{ width: '19mm', whiteSpace: 'nowrap', height: '8mm' }}
            >
              <span style={{ fontSize: '14px' }}>钢&nbsp;印 号：</span>
            </td>
            <td nowrap="nowrap" style={{ width: '65mm', whiteSpace: 'nowrap', height: '6mm' }}>
              <span style={{ width: '65mm', wordBreak: 'keep-all', wordWrap: 'break-word' }} />
            </td>
            <td colSpan={2} nowrap="nowrap" style={{ width: '15mm', whiteSpace: 'nowrap' }}>
              &nbsp;
            </td>
            <td nowrap="nowrap" style={{ width: '20mm', whiteSpace: 'nowrap' }}>
              &nbsp;
            </td>
            <td nowrap="nowrap" rowSpan={1}>
              <span style={{ fontSize: '14px' }}>入库日期：</span>
            </td>
            <td
              colSpan={2}
              nowrap="nowrap"
              rowSpan={1}
              style={{ width: '25mm', whiteSpace: 'nowrap' }}
            >
              <span style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                2019.12.30
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={9} nowrap="nowrap" style={{ whiteSpace: 'nowrap', height: '20mm' }}>
              <table align="center" border={1} className="thin">
                <tbody>
                  <tr>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '10mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>序号</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '23mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>编码</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '30mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>商品名称</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '16mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>型号</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '18mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>类别</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '25mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>原厂编码</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '12mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>数量</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '10mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>单位</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '15mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>单价</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '18mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>金额</span>
                    </td>
                    <td
                      nowrap="nowrap"
                      style={{ textAlign: 'center', width: '15mm', whiteSpace: 'nowrap' }}
                    >
                      <span style={{ fontSize: '14px' }}>仓位</span>
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        1
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        424916013
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        方向机大轴总成（别克君越）
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        方向机EPS-P
                      </div>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        方向机
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        1.0
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        件
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        150.0000
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        150.0000
                      </span>
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      >
                        物料管理
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap">
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap">
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '23mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          width: '16mm',
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '12mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '10mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '18mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                    <td nowrap="nowrap" style={{ textAlign: 'center' }}>
                      <span
                        style={{ width: '15mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              colSpan={9}
              nowrap="nowrap"
              style={{
                textAlign: 'center',
                whiteSpace: 'nowrap',
                height: '5mm',
                verticalAlign: 'bottom',
              }}
            >
              <span style={{ fontSize: '16px' }}>
                &nbsp;&nbsp; 合计：
                <span style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  150.0000
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 大写：
                <span style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  壹佰伍拾元
                </span>
                &nbsp;
              </span>
              <hr />
            </td>
          </tr>
          <tr>
            <td colSpan={9} nowrap="nowrap">
              <span style={{ fontSize: '14px' }}>
                制单员：
                <span style={{ width: '20mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  刘丹
                </span>
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style={{ fontSize: '14px' }}>&nbsp;</span>
              <span style={{ fontSize: '14px' }}>经手人：</span>
              <span style={{ fontSize: '14px' }}>
                <span style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  刘丹
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              <span style={{ fontSize: '14px' }}>审核：</span>
              <span style={{ width: '30mm', wordBreak: 'keep-all', wordWrap: 'break-word' }} />
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              nowrap="nowrap"
              style={{ width: '90mm', whiteSpace: 'nowrap', height: '8mm' }}
            >
              <span style={{ fontSize: '14px' }}>
                地&nbsp;&nbsp; &nbsp;址：
                <span style={{ width: '65mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  上海市闵行区兴梅路658号C座
                </span>
              </span>
            </td>
            <td colSpan={2} nowrap="nowrap" rowSpan={1}>
              <span style={{ fontSize: '14px' }}>
                电话：
                <span style={{ width: '25mm', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                  021-54856975
                </span>
              </span>
            </td>
            <td colSpan={3} nowrap="nowrap" rowSpan={1}>
              &nbsp;
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default madeUp_DisconnentPutStorage;

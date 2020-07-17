import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal, Switch
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import SearchTableList from '@/components/SearchTableList';
import moment from 'moment';
import styles from './CpSupplierList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({ cpSupplier, loading }) => ({
  ...cpSupplier,
  loading: loading.models.cpSupplier,
}))
@Form.create()

class quickQuery extends PureComponent {

  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    array: [],
  }

  componentDidMount() {

  }

  ongoto = (topath) => {
    router.push(topath);
  }

  render() {
    const querydata = [
      { name: 'BOM', topath: '/must_bom_query' },
    ]
    return (
      <div className={styles.standardList} style={{ textAlign: 'center' ,marginTop: '60px' }}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>必须件管理</div>
            {isNotBlank(querydata) && querydata.length > 0 && querydata.map((item) => {
              return <div><Button type="primary" style={{ width: '40%', fontSize:'18px',height:'48px', textAlign: 'center', marginBottom: '12px' }} onClick={() => {this.ongoto(item.topath) }}>{item.name}</Button></div>
           })
            }
          </div>
        </Card>
      </div>
    );
  }

}
export default quickQuery;
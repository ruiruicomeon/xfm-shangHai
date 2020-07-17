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
    if(isNotBlank(topath)){
    router.push(topath);
    }
  }

  render() {

    // 可编辑列表 需要固定操作参数   【编辑，保存，取消】

    const querydata = [
      { name: 'BOM', topath: '/bom_query_out' },
      { name: '培训资料查询(未开通)', topath: '' },
      { name: '进度查询(未开通)', topath: '' },
      // { name: '整车报工', topath: '' },
      { name: '其他(未开通)', topath: '' },
    ]


    return (
      <div className={styles.standardList} style={{ textAlign: 'center' }}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div style={{ textAlign: 'center', fontWeight: 550, fontSize: 28, marginBottom: '16px' }}>资料查询</div>
            {isNotBlank(querydata) && querydata.length > 0 && querydata.map((item) => {
              return <div><Button  type="primary" style={{ width: '40%', fontSize:'18px',height:'48px', textAlign: 'center', marginBottom: '12px' }} onClick={() => {this.ongoto(item.topath) }}>{item.name}</Button></div>
           })
            }
          </div>
        </Card>
      </div>

      // <SearchFormgys {...parentSearchMethodsgys} searchVisiblegys={searchVisiblegys} />
      //   </PageHeaderWrapper>
    );
  }

}
export default quickQuery;
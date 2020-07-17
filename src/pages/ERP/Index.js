
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Spin } from 'antd';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import { getStorage } from '@/utils/localStorageUtils';
import { isNotBlank } from '@/utils/utils';
@connect(() => ({}))
class Index extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if(isNotBlank(getStorage('token'))){
      router.push('/monthly_statistics')
    } else{
      router.push('/user/login')
    }
  }

  render() {
    return (
      <div style={{ height: '100vh', backgroundColor: '#FFFFFF', paddingTop: '56px' }}>
        <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
      </div>
    );
  }
}
export default Index;

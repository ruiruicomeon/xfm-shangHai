import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert, Form, } from 'antd';
import Login from '@/components/Login';
import { isNotBlank } from '@/utils/utils';
// import { setAuthority } from '../../utils/authority';
// import { reloadAuthorized } from '../../utils/Authorized';
// import { getStorage } from '@/utils/localStorageUtils';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
  constructor(props) {
    super(props);
    setTimeout(this.onTabChange, 500);
  }

    state = {
      type: 'mobile',
    };

  onTabChange = type => {
    if (isNotBlank(type)) {
      this.setState({ type });
    } else {
      window.WxLogin({
        id: 'login_container',
        appid: 'wx43d4e13cd713d3ed',
        scope: 'snsapi_login',
        redirect_uri: '/api/Beauty/callback?client_name=wechatWebClient',
        state: 'login',
      });
    }
    // this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
        callback: () => {
          dispatch({
            type: 'login/get_token'
          })
        }
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting, } = this.props;
    const { type } = this.state;

    const errMsg = () => {
      if (login.status === 'error' && isNotBlank(login.msg)) {
        return this.renderMessage(login.msg);
      }
      // if (login.status === 'error' && !isNotBlank(login.msg)) {
      //   return this.renderMessage("账号密码错误--admin/admin");
      // }
      return '';
    }

    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="mobile" tab="微信登录" />
          <div
            id="login_container"
            style={
              type === 'account'
                ? { marginLeft: '25px', display: 'none' }
                : { marginLeft: '25px', display: '' }
            }
          />
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {errMsg()}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>

          {type === 'account' ? <Submit loading={submitting}>登录</Submit> : null}
          {/* <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit> */}

        </Login>
      </div>
    );
  }
}

export default LoginPage;

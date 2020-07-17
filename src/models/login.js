import { routerRedux } from 'dva/router';
import { login, logout, getToken } from '@/services/api';
import { setStorage } from '../utils/localStorageUtils';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { setAuthority } from '../utils/authority';
import { parse ,stringify } from 'qs';
import { message } from 'antd';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *get_token({ payload ,callback }, { call ,put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getToken, value);
      if (isNotBlank(response) && isNotBlank(response.data) && isNotBlank(response.data.id) ){
        setStorage('userid', isNotBlank(response.data.id)?response.data.id:'');
        setStorage('username', isNotBlank(response.data.name)?response.data.name:'');
        setStorage('areaname', isNotBlank(response.data.areaName)?response.data.areaName:'');
        setStorage('companyname', isNotBlank(response.data.companyName)?response.data.companyName:'');
        setStorage('companyId',isNotBlank(response.data.company)&&isNotBlank(response.data.company.id)?response.data.company.id:'');
        setStorage('userno', isNotBlank(response.data.no)?response.data.no:'');
        setStorage('area', isNotBlank(response.data.area)&&isNotBlank(response.data.area.name)?response.data.area.name:'');
        setStorage('deptname', isNotBlank(response.data.dept)&&isNotBlank(response.data.dept.name)?response.data.dept.name:'');
        setStorage('phone', isNotBlank(response.data.phone)?response.data.phone:'');
        setStorage('roles', isNotBlank(response.data.roles)?response.data.roles:'');

        let qxarr = []
        if(isNotBlank(response.data.menuList)&&response.data.menuList.length>0){
          setStorage('menulist',JSON.stringify(response.data.menuList));
          response.data.menuList.map(item=>{
            qxarr.push(item.target)
          })
          setAuthority(qxarr);
          reloadAuthorized();
        }else{
          setAuthority(['isnull'])
          reloadAuthorized();
        }
        yield put(routerRedux.push('/monthly_statistics'));
        if(callback) callback()
      }
    },
    *login({ payload, callback }, { call, put }) {
      const a = `${payload.username}:${payload.password}`;
      const base64Str = window.btoa(a);
      const loginMsg = { Authorization: `Basic ${base64Str}` };
      const response = yield call(login, loginMsg);
      // Login successfully
      if (!isNotBlank(response) || response.success === 0 || response.success === '0') {

        message.error('账号或密码错误!') 
        response.status = 'error';
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (isNotBlank(response) && (response.success === 1 || response.success === '1')) {
        // setStorage('TOKEN_ADMIN', response.data);
        setStorage('token', response.data);
        if (callback) callback();
        // yield put(routerRedux.push('/'));
      }
    },
    *logout({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      yield call(logout,value);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });

      localStorage.removeItem('userid')
      localStorage.removeItem('username')
      localStorage.removeItem('areaname')
      localStorage.removeItem('companyname')
      localStorage.removeItem('companyId')
      localStorage.removeItem('area')
      localStorage.removeItem('deptname')
      localStorage.removeItem('phone')
      localStorage.removeItem('roles')
      localStorage.removeItem('token')
      localStorage.removeItem('antd-pro-authority')
      localStorage.removeItem('menulist')
      localStorage.removeItem('userno')

      // reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },
    *logout401(_, { call, put }) {
      yield call(logout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });

      localStorage.removeItem('userid')
      localStorage.removeItem('username')
      localStorage.removeItem('areaname')
      localStorage.removeItem('companyname')
      localStorage.removeItem('companyId')
      localStorage.removeItem('area')
      localStorage.removeItem('deptname')
      localStorage.removeItem('phone')
      localStorage.removeItem('roles')
      localStorage.removeItem('token')
      localStorage.removeItem('antd-pro-authority')
      localStorage.removeItem('menulist')
      localStorage.removeItem('userno')
      // reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

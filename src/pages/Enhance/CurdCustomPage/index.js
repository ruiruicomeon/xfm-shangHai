import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, message, Button, Menu, Dropdown, Icon, Modal } from 'antd';
import { Curd } from 'antd-curd';
import renderCard from './CustomCard';
import { modelName } from '../models/curdPage.ts';
import setFormItemsConfig from './map';
import styles from './index.less';

@connect(({ [modelName]: model, loading }) => ({
  data: model.data,
  detail: model.detail,
  fetchLoading: loading.effects[`${modelName}/fetch`],
  detailLoading: loading.effects[`${modelName}/detail`],
  createLoading: loading.effects[`${modelName}/create`],
  updateLoading: loading.effects[`${modelName}/update`],
  deleteLoading: loading.effects[`${modelName}/delete`],
}))
class TableList extends PureComponent {
  state = {
    customModelVisible: false,
    selectedRows: [],
  };

  queryArgsConfig = [
    {
      type: 'string',
      field: 'name',
      formItemProps: {
        label: '姓名',
      },
    },
    {
      type: 'string',
      field: 'nickname',
      formItemProps: {
        label: '昵称',
      },
    },
    {
      type: 'string',
      field: 'habit',
      formItemProps: {
        label: '爱好',
      },
    },
  ];

  columns = [
    {
      title: '公式照',
      dataIndex: 'avatar',
      render: value => (
        <div className={styles.avatarWrapper}>
          <Avatar src={value} size="large" />
        </div>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (value, record) => (
        <a href={record.profile} target="_blank" rel="noreferrer noopener">
          {value}
        </a>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '生日',
      dataIndex: 'birthday',
    },
    {
      title: '特长',
      dataIndex: 'speciality',
    },
    {
      title: '爱好',
      dataIndex: 'habit',
    },
  ];

  render() {
    const { customModelVisible, selectedRows } = this.state;
    const actionsConfig = {
      extraActions: [
        {
          key: 13,
          title: '外务',
          handleClick: record => message.info(`调用 ${record.name} 的外务事件`),
        },
        {
          key: 14,
          title: '兼职',
          handleClick: record => message.info(`调用 ${record.name} 的兼职事件`),
        },
        {
          key: 15,
          title: '弹出子组件',
          handleClick: () => this.setState({ customModelVisible: true }),
        },
      ],
      confirmKeys: [
        [4, record => `确定查看 ${record.name} 的详情吗？`],
        [12, () => `确定删除吗？`],
        [13, record => `确定让 ${record.name} 出外务吗？`],
        14,
      ],
    };

    return (
      <Curd modelName={modelName} {...this.props}>
        <Curd.QueryPanel queryArgsConfig={this.queryArgsConfig} />
        <Curd.CurdList
          renderItem={renderCard}
          actionsConfig={actionsConfig}
          setFormItemsConfig={setFormItemsConfig}
          popupType="modal"
          popupProps={{
            modalConfig: {
              width: 800,
            },
            cols: 2,
          }}
          operators={[<TableActions key="more" selectedRows={selectedRows} />]}
          selectedRows={selectedRows}
          onSelectRow={rows => this.setState({ selectedRows: rows })}
          {...this.props}
        />
        <CustomModal
          title="弹出子组件"
          visible={customModelVisible}
          onCancel={() => this.setState({ customModelVisible: false })}
          okButtonProps={{ style: { display: 'none' } }}
        />
      </Curd>
    );
  }
}

export default TableList;

function TableActions(props) {
  const { __curd__ } = props;
  if (!__curd__) return null;
  const {
    state: { selectedRows },
  } = __curd__;
  const menu = (
    <Menu>
      <Menu.Item key="remove">删除</Menu.Item>
      <Menu.Item key="approval">批量审批</Menu.Item>
    </Menu>
  );
  return (
    selectedRows.length > 0 && (
      <span>
        <Button>批量操作</Button>
        <Dropdown overlay={menu}>
          <Button>
            更多操作 <Icon type="down" />
          </Button>
        </Dropdown>
      </span>
    )
  );
}

function CustomModal(props) {
  const { __curd__, ...rest } = props;
  if (!__curd__) return null;
  return (
    <Modal {...rest}>
      <Button
        onClick={() => {
          __curd__.handleSearch();
          rest.onCancel();
        }}
      >
        重新搜索
      </Button>
    </Modal>
  );
}

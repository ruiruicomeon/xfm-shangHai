import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import { Resizable } from 'react-resizable';
import styles from './index.less';
import { isNotBlank } from '@/utils/utils';


const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};


function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      columns
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (
      isNotBlank(nextProps) &&
      isNotBlank(nextProps.selectedRows) &&
      nextProps.selectedRows.length === 0
    ) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRowKeys);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const { selectedRowKeys, needTotalList, columns } = this.state;
    const { pageSizeFalse, data = {}, rowKey, ...rest } = this.props;
    const { list = [], pagination, msg } = data;

    const components = {
      header: {
        cell: ResizeableTitle,
      },
    };

    const columnsDrag = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => {
        return {
          width: column.width,
          onResize: this.handleResize(index),
        }
      },
    }));

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '50', '100'],
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    const map = () => {
      needTotalList.map(item => (
        <span style={{ marginLeft: 8 }} key={item.dataIndex}>
          {item.title}
          总计&nbsp;
          <span style={{ fontWeight: 600 }}>
            {item.render ? item.render(item.total) : item.total}
          </span>
        </span>
      ))
    }


    const tableAlert = (
      <div className={styles.tableAlert}>
        <Alert
          message={
            <Fragment>
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? '总条数 ' : null}
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ?
                <a style={{ fontWeight: 600 }}>
                  {isNotBlank(paginationProps) && isNotBlank(paginationProps.total) && parseInt(paginationProps.total, 10) > 0 ? paginationProps.total : '0'}
                </a> : null}
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? ' 条' : null}
              &nbsp;&nbsp;
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? "已选择 " : null}
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> : null}
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? " 项 " : null}
              &nbsp;&nbsp;
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ?
                map() : null}
              {isNotBlank(msg) && isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? msg : ''}
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ?
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a> : null
              }
            </Fragment>
          }
          type="info"
          showIcon
        />
      </div>
    );
    delete rest.columns
    return (
      <div className={styles.standardTable}>
        {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? tableAlert : ''}
        <Table
          components={components}
          rowKey={rowKey || 'id'}
          rowSelection={isNotBlank(rowSelection) && isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? rowSelection : null}
          dataSource={list}
          columns={columnsDrag || []}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;

/**
 * 可拖拽表格
 */
import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Alert,
} from 'antd';
import styles from './index.less';
import { Resizable } from 'react-resizable';
import { isNotBlank } from '@/utils/utils';


function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}


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



class DragTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns} = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      editingKey: '',
      columns
    };
  }

  static getDerivedStateFromProps(nextProps) {
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

  isEditing = record => {
    const { editingKey } = this.state;
    if (isNotBlank(record) && isNotBlank(editingKey)) {
      return (record.key || record.id) === editingKey;
    }
    return false;
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save = (form, key) => {
    const { onSaveData } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (onSaveData) {
        onSaveData(key, row);
      }
      this.setState({ editingKey: '' });
    });
  };

  edit = key => {
    this.setState({ editingKey: key });
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
    const { pageSizeFalse, rowKey, pagination ,dataSource , components , ...rest} = this.props;
  

    const componentsT = {
      header: {
        cell: ResizeableTitle,
      },
      ...components
    };

   
    const columnsTabless = columns.map((col, index) => ({
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
      ));
    };

    const tableAlert = (
      <div className={styles.tableAlert}>
        <Alert
          message={
            <Fragment>
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? '总条数 ' : null}
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? (
                <a style={{ fontWeight: 600 }}>
                  {isNotBlank(paginationProps) &&
                    isNotBlank(paginationProps.total) &&
                    parseInt(paginationProps.total, 10) > 0
                    ? paginationProps.total
                    : '0'}
                </a>
              ) : null}
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? ' 条' : null}
              &nbsp;&nbsp;
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll'
                ? '已选择 '
                : null}
              {isNotBlank(rest) &&
                isNotBlank(rest.selectedRows) &&
                rest.selectedRows !== 'nullAll' ? (
                  <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>
                ) : null}
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll'
                ? ' 项 '
                : null}
              &nbsp;&nbsp;
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll'
                ? map()
                : null}
              {isNotBlank(rest) &&
                isNotBlank(rest.selectedRows) &&
                rest.selectedRows !== 'nullAll' ? (
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                ) : null}
            </Fragment>
          }
          type="info"
          showIcon
        />
      </div>
    )

    delete rest.columns
    return (
      <div className={styles.standardTable}>
        <Table
          components={componentsT}
          rowKey={rowKey || 'id'}
          rowSelection={isNotBlank(rowSelection) && isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? rowSelection : null}
          dataSource={dataSource}
          columns={columnsTabless || []}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          rowClassName="editable-row"
          {...rest}
        />
      </div>
    );
  }
}

export default DragTable;

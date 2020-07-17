import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  message,
  Icon,
  Modal,
  Row, Col
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation ,getPrice ,setPrice} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import styles from './CpBillMaterialForm.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


    const CreateForm = Form.create()(props => {
      const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, form: { getFieldDecorator },
        getcpBillmaterialList1, selectuser, handleSelectRows, selectedRows, dispatch, location, that } = props;
      const selectcolumns = [
        {
          title: '操作',
          width: 100,
          align: 'center',
          render: record => (
            <Fragment>
              <a onClick={() => selectuser(record)}>
                选择
              </a>
            </Fragment>
          ),
        },
        {
          title: '物料编码',
          dataIndex: 'billCode',
          align: 'center',
          inputType: 'text',
          width: 150,
          editable: true,
        },
        {
          title: '一级编码',
          dataIndex: 'oneCode',
          align: 'center',
          inputType: 'text',
          width: 100,
          editable: true,
        },
        {
          title: '二级编码',
          dataIndex: 'twoCode',
          align: 'center',
          inputType: 'text',
          width: 100,
          editable: true,
        },
        {
          title: '一级编码型号',
          dataIndex: 'oneCodeModel',
          align: 'center',
          inputType: 'text',
          width: 100,
          editable: true,
        },
        {
          title: '二级编码名称',
          dataIndex: 'twoCodeModel',
          align: 'center',
          inputType: 'text',
          width: 100,
          editable: true,
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          inputType: 'text',
          width: 300,
          editable: true,
        },
        {
          title: '原厂编码',
          dataIndex: 'originalCode',
          inputType: 'text',
          align: 'center',
          width: 100,
          editable: true,
        },
        {
          title: '配件厂商',
          dataIndex: 'rCode',
          inputType: 'text',
          align: 'center',
          width: 100,
          editable: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          inputType: 'text',
          align: 'center',
          width: 100,
          editable: true,
        },
        {
          title: '更新时间',
          dataIndex: 'finishDate',
          editable: true,
          inputType: 'dateTime',
          align: 'center',
          width: 150,
          sorter: true,
          render: (val) => {
            if (isNotBlank(val)) {
              return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
            return ''
          }
        },
        {
          title: '备注信息',
          dataIndex: 'remarks',
          align: 'center',
          inputType: 'text',
          width: 150,
          editable: true,
        }
      ]
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
      };
      const handleSearch = (e) => {
        e.preventDefault();
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const values = {
            ...fieldsValue,
          };
          Object.keys(values).map((item) => {
            if (values[item] instanceof moment) {
              values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
            }
            return item;
          });
    
          that.setState({
            wlsearch: values,
            pageCurrent: 1,
            pagePageSize: 10
          })
    
          dispatch({
            type: 'cpBillMaterial/get_cpBill_caterialList1',
            payload: {
              // purchaseId: location.query.id,
              pageSize: 10,
              ...values,
              current: 1,
              tag: 1
            }
          });
        });
      };
      const handleFormReset = () => {
        form.resetFields();
        that.setState({
          wlsearch: {},
          pageCurrent: 1,
          pagePageSize: 10
        })
        dispatch({
          type: 'cpBillMaterial/get_cpBill_caterialList1',
          payload: {
            // purchaseId: location.query.id,
            pageSize: 10,
            current: 1,
            tag: 1
          }
        });
      };
      const handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {});
        const params = {
          ...that.state.wlsearch,
          current: pagination.current,
          pageSize: pagination.pageSize,
          ...filters,
          // purchaseId: location.query.id,
        };
    
        that.setState({
          pageCurrent: pagination.current,
          pagePageSize: pagination.pageSize
        })
    
        if (sorter.field) {
          params.sorter = `${sorter.field}_${sorter.order}`;
        }
        dispatch({
          type: 'cpBillMaterial/get_cpBill_caterialList1',
          payload: params,
        });
      };
    
      const handleModalVisiblein = () => {
        // form.resetFields();
        // that.setState({
        //   wlsearch: {}
        // })
        handleModalVisible()
      }
    
      return (
        <Modal
          title='物料选择'
          visible={modalVisible}
          onCancel={() => handleModalVisiblein()}
          width='80%'
        >
          <Form onSubmit={handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="物料编码">
                  {getFieldDecorator('billCode', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="一级编码">
                  {getFieldDecorator('oneCode', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="二级编码">
                  {getFieldDecorator('twoCode', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="一级编码型号">
                  {getFieldDecorator('oneCodeModel', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="二级编码名称">
                  {getFieldDecorator('twoCodeModel', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="名称">
                  {getFieldDecorator('name', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="原厂编码">
                  {getFieldDecorator('originalCode', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="配件厂商">
                  {getFieldDecorator('rCode', {
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                      重置
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
          <StandardTable
            bordered
            scroll={{ x: 1050 }}
            // selectedRows={selectedRows}
            onChange={handleStandardTableChange}
            // onSelectRow={handleSelectRows}
            data={getcpBillmaterialList1}
            columns={selectcolumns}
          />
        </Modal>
      );
    });

// const CreateForm = Form.create()(props => {
//   const { handleModalVisible, cpOneCodeList, selectflag, selectuser, dispatch, form, form: { getFieldDecorator }, searchval, that } = props;
//   const columnsone = [
//     {
//       title: '操作',
//       width: 100,
//       align: 'center',
//       fixed: 'left',
//       render: record => (
//         <Fragment>
//           <a onClick={() => selectuser(record)}>
//             选择
//     </a>
//         </Fragment>
//       ),
//     },
//     {
//       title: '编号',
//       dataIndex: 'code',
//       inputType: 'text',
//       align: 'center',
//       width: 100,
//       editable: true,
//     },
//     {
//       title: '品牌',
//       dataIndex: 'brand',
//       inputType: 'text',
//       align: 'center',
//       width: 100,
//       editable: true,
//     },
//     {
//       title: '车型',
//       dataIndex: 'vehicleEmissions',
//       inputType: 'text',
//       align: 'center',
//       width: 100,
//       editable: true,
//     },
//     {
//       title: '变速箱型号',
//       dataIndex: 'model',
//       inputType: 'text',
//       align: 'center',
//       width: 100,
//       editable: true,
//     },
//     {
//       title: '更新时间',
//       dataIndex: 'finishDate',
//       editable: true,
//       inputType: 'dateTime',
//       align: 'center',
//       width: 150,
//       sorter: true,
//       render: (val) => {
//         if (isNotBlank(val)) {
//           return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
//         }
//         return ''
//       }
//     },
//     {
//       title: '备注信息',
//       dataIndex: 'remarks',
//       inputType: 'text',
//       align: 'center',
//       width: 150,
//       editable: true,
//     },
//   ];
//   const formItemLayout = {
//     labelCol: {
//       xs: { span: 24 },
//       sm: { span: 7 },
//     },
//     wrapperCol: {
//       xs: { span: 24 },
//       sm: { span: 12 },
//       md: { span: 10 },
//     },
//   };
//   const handleFormReset = () => {
//     form.resetFields();
//     that.setState({
//       searchval: {}
//     })
//     dispatch({
//       type: 'cpOneCode/cpOneCode_List',
//       payload: {
//         current: 1,
//         pageSize: 10
//       },
//     });
//   };
//   const handleStandardTableChange = (pagination, filtersArg, sorter) => {
//     const filters = Object.keys(filtersArg).reduce((obj, key) => {
//       const newObj = { ...obj };
//       newObj[key] = getValue(filtersArg[key]);
//       return newObj;
//     }, {});
//     const params = {
//       current: pagination.current,
//       pageSize: pagination.pageSize,
//       ...searchval,
//       ...filters,
//     };
//     if (sorter.field) {
//       params.sorter = `${sorter.field}_${sorter.order}`;
//     }
//     dispatch({
//       type: 'cpOneCode/cpOneCode_List',
//       payload: params,
//     });
//   };
//   const handleSearch = (e) => {
//     e.preventDefault();
//     form.validateFields((err, fieldsValue) => {
//       if (err) return;
//       const values = {
//         ...fieldsValue,
//       };

//       if (!isNotBlank(fieldsValue.code)) {
//         values.code = ''
//       }

//       if (!isNotBlank(fieldsValue.model)) {
//         values.model = ''
//       }
//       if (!isNotBlank(fieldsValue.brand)) {
//         values.brand = ''
//       }
//       if (!isNotBlank(fieldsValue.vehicleEmissions)) {
//         values.vehicleEmissions = ''
//       }

//       that.setState({
//         searchval: { ...values }
//       })



//       dispatch({
//         type: 'cpOneCode/cpOneCode_List',
//         payload: {
//           ...values,
//           current: 1,
//           pageSize: 10
//         }
//       });
//     });
//   };

//   const handleModalVisiblein = () => {
//     // form.resetFields();
//     // that.setState({
//     //   searchval:{}
//     // })
//     handleModalVisible()
//   }

//   return (
//     <Modal
//       title='一级编码'
//       visible={selectflag}
//       onCancel={() => handleModalVisiblein()}
//       width='80%'
//     >
//       <Form onSubmit={handleSearch}>
//         <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
//           <Col md={8} sm={24}>
//             <FormItem {...formItemLayout} label="编号">
//               {getFieldDecorator('code')(<Input />)}
//             </FormItem>
//           </Col>
//           <Col md={8} sm={24}>
//             <FormItem {...formItemLayout} label="车型">
//               {getFieldDecorator('vehicleEmissions')(<Input />)}
//             </FormItem>
//           </Col>
//           <Col md={8} sm={24}>
//             <FormItem {...formItemLayout} label="品牌">
//               {getFieldDecorator('brand')(<Input />)}
//             </FormItem>
//           </Col>
//           <Col md={8} sm={24}>
//             <FormItem {...formItemLayout} label="变形箱型号">
//               {getFieldDecorator('model')(<Input />)}
//             </FormItem>
//           </Col>
//           <Col md={8} sm={24}>
//             <div style={{ overflow: 'hidden' }}>
//               <span style={{ marginBottom: 24 }}>
//                 <Button type="primary" htmlType="submit">
//                   查询
//               </Button>
//                 <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
//                   重置
//               </Button>
//               </span>
//             </div>
//           </Col>
//         </Row>
//       </Form>
//       <StandardTable
//         bordered
//         scroll={{ x: 1050 }}
//         onChange={handleStandardTableChange}
//         data={cpOneCodeList}
//         columns={columnsone}
//       />
//     </Modal>
//   );
// });
const CreateFormkh = Form.create()(props => {
  const { handleModalVisiblekh, cpTwoCodeList, selectkhflag, selectcustomer
    , dispatch, form, form: { getFieldDecorator }, twovals, that } = props;
  const columnstwo = [
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: record => (
        <Fragment>
          <a onClick={() => selectcustomer(record)}>
            选择
    </a>
        </Fragment>
      ),
    },
    {
      title: '代码',
      dataIndex: 'code',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      inputType: 'text',
      width: 150,
      editable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      editable: false,
      inputType: 'dateTime',
      align: 'center',
      width: 150,
      sorter: true,
      render: (val) => {
        if (isNotBlank(val)) {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
        return ''
      }
    },
    {
      title: '备注信息',
      dataIndex: 'remarks',
      inputType: 'text',
      align: 'center',
      width: 150,
      editable: true,
    }
  ];
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };


  const handleFormReset = () => {
    form.resetFields();
    that.setState({
      twovals: {}
    })
    dispatch({
      type: 'cpTwoCode/cpTwoCode_List',
      payload: {
        current: 1,
        pageSize: 10
      },
    });
  };

  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...twovals,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cpTwoCode/cpTwoCode_List',
      payload: params,
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (!isNotBlank(fieldsValue.code)) {
        values.code = ''
      }

      if (!isNotBlank(fieldsValue.name)) {
        values.name = ''
      }

      that.setState({
        twovals: { ...values }
      })

      dispatch({
        type: 'cpTwoCode/cpTwoCode_List',
        payload: {
          ...values,
          current: 1,
          pageSize: 10
        },
      });
    });
  };

  const handleModalVisiblekhin = () => {
    // form.resetFields();
    // that.setState({
    //   twovals:{}
    // })
    handleModalVisiblekh()
  }

  return (
    <Modal
      title='二级编码'
      visible={selectkhflag}
      onCancel={() => handleModalVisiblekhin()}
      width='80%'
    >
      <Form onSubmit={handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="代码">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
              </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                  重置
              </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
      <StandardTable
        bordered
        scroll={{ x: 1050 }}
        onChange={handleStandardTableChange}
        data={cpTwoCodeList}
        columns={columnstwo}
      />
    </Modal>
  );
});

const CreateFormkw = Form.create()(props => {
	const { handleModalVisiblekw, cpEntrepotList, selectkwflag, selectkw ,dispatch ,form ,form: { getFieldDecorator }} = props;
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center' ,
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectkw(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '仓库名',        
			dataIndex: 'name',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '所属公司',        
			dataIndex: 'office.name',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
			inputType: 'dateTime',
			align: 'center' ,
			width: 150,
			sorter: true,
			render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
		},
		{
			title: '备注信息',        
			dataIndex: 'remarks', 
			align: 'center' ,  
			inputType: 'text',   
			width: 150,          
			editable: true,      
		},
	];
	const  handleFormReset = () => {
		form.resetFields();
		dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
		  payload: {
			pageSize: 10,
			current: 1,
		  },
		});
	  };
	  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});
		const params = {
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
			payload: params,
		});
	};
	  const formItemLayout = {
		labelCol: {
		  xs: { span: 24 },
		  sm: { span: 7 },
		},
		wrapperCol: {
		  xs: { span: 24 },
		  sm: { span: 12 },
		  md: { span: 10 },
		},
	  };
	 const handleSearch = (e) => {
		e.preventDefault();
		form.validateFields((err, fieldsValue) => {
		  if (err) return;
		  const values = {
			...fieldsValue,
		  };
		  Object.keys(values).map((item) => {
			if( values[item] instanceof moment){
			  values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
			}
			return item;
		  });
		  dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
			payload: {
			  ...values,
			  pageSize: 10,
			  current: 1,
			},
		  });
		});
	  };
	return (
  <Modal
    title='选择所属仓库'
    visible={selectkwflag}
    onCancel={() => handleModalVisiblekw()}
    width='80%'
		>
    <Row>
      <Form onSubmit={handleSearch}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="仓库名">
            {getFieldDecorator('name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
                查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
          </span>
        </Col>
      </Form>
    </Row>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpEntrepotList}
      columns={columnskh}
    />
  </Modal>
	);
});
const CreateForminkw = Form.create()(props => {
	const { handleModalVisibleinkw, cpStorageList, selectinkwflag, selectinkw ,dispatch ,form 
		,form: { getFieldDecorator } ,that} = props;
	const columnskh = [
		{
			title: '操作',
			width: 100,
			align: 'center' ,
			fixed: 'left',
			render: record => (
  <Fragment>
    <a onClick={() => selectinkw(record)}>
						选择
    </a>
  </Fragment>
			),
		},
		{
			title: '配件仓库',        
			dataIndex: 'entrepotName',   
			inputType: 'text',
			align: 'center' ,   
			width: 150,          
			editable: true,      
		},
		{
			title: '库位',        
			dataIndex: 'name',   
			inputType: 'text',   
			width: 100,          
			editable: true,      
		},
		{
			title: '更新时间',
			dataIndex: 'finishDate',
			editable: true,
			inputType: 'dateTime',
			align: 'center' ,
			width: 150,
			sorter: true,
			render: (val)=>{
					if(isNotBlank(val)){
					 return	<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
					}
					return ''
				}
		},
		{
			title: '备注信息',        
			dataIndex: 'remarks',   
			inputType: 'text', 
			align: 'center' ,  
			width: 150,          
			editable: true,      
		},
	];
	const handleSearch = (e) => {
		e.preventDefault();
		form.validateFields((err, fieldsValue) => {
		  if (err) return;
		  const values = {
			...fieldsValue,
		  };
		  Object.keys(values).map((item) => {
			if( values[item] instanceof moment){
			  values[item] = values[item].format('YYYY-MM-DD HH:mm:ss');
			}
			return item;
		  });

		  that.setState({
			kwsearch:values
		  })

		  dispatch({
			type: 'cpStorage/cpStorage_List',
			payload: {
			  ...values,
			  pageSize: 10,
			  current: 1,
			},
		  });
		});
	  };
	  const formItemLayout = {
		labelCol: {
		  xs: { span: 24 },
		  sm: { span: 7 },
		},
		wrapperCol: {
		  xs: { span: 24 },
		  sm: { span: 12 },
		  md: { span: 10 },
		},
	  };
	  const handleFormReset = () => {
		// form.resetFields();
		// that.setState({
		// 	kwsearch:{}
		// })
		dispatch({
		  type: 'cpStorage/cpStorage_List',
		  payload: {
			pageSize: 10,
			current: 1,
		  },
		});
	  };
	  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});
		const params = {
			...that.state.kwsearch,
			current: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}
		dispatch({
			type: 'cpStorage/cpStorage_List',
			payload: params,
		});
	};

	const handleModalVisibleinkwin = ()=>{
		form.resetFields();
		that.setState({
			kwsearch:{}
		})
		handleModalVisibleinkw()
	}

	return (
  <Modal
    title='选择所属库位'
    visible={selectinkwflag}
    onCancel={() => handleModalVisibleinkw()}
    width='80%'
		>
    <Row>
      <Form onSubmit={handleSearch}>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="仓库名">
            {getFieldDecorator('entrepotName', {
						initialValue: ''
					  })(
  <Input  />
					  )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem {...formItemLayout} label="库位名">
            {getFieldDecorator('name', {
						initialValue: ''
					  })(
  <Input  />
					  )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
                查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
            </Button>
          </span>
        </Col>
      </Form>
    </Row>
    <StandardTable
      bordered
      scroll={{ x: 1050 }}
      onChange={handleStandardTableChange}
      data={cpStorageList}
      columns={columnskh}
    />
  </Modal>
	);
});

@connect(({ cpAccessoriesSalesPrice, loading, cpOneCode, cpTwoCode ,cpEntrepot,cpStorage ,cpBillMaterial}) => ({
  ...cpAccessoriesSalesPrice,
  ...cpOneCode,
  ...cpTwoCode,
  ...cpEntrepot,
  ...cpStorage,
  ...cpBillMaterial,
  submitting: loading.effects['form/submitRegularForm'],
  submitting1: loading.effects['cpAccessoriesSalesPrice/getCpSalesAccessoriesMoney'],
}))
@Form.create()
class CpBillMaterialForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: {},
      addfileList: [],
      selectflag: false,
      selectdata: {},
      orderflag: false,
      selectkhflag: false,
      selectkhdata: {},
      searchval: {},
      twovals: {},
      selectinkwdata: [],
			selectkwdata: [],
			selectkwflag: false,
			selectinkwflag: false,
      location: getLocation()
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { location } = this.state
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'cpAccessoriesSalesPrice/get_CpSalesAccessoriesMoney',
        payload: {
          id: location.query.id,
        },
        callback:(res)=>{
          this.props.form.setFieldsValue({
						ck: isNotBlank(res.data) && isNotBlank(res.data.cpEntrepot) && isNotBlank(res.data.cpEntrepot.name) ? res.data.cpEntrepot.name : '',
						kw: isNotBlank(res.data) && isNotBlank(res.data.storage) && isNotBlank(res.data.storage.name) ? res.data.storage.name : ''
					});
        }
      });
    }
    if (isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'aPrice').length > 0
      && JSON.parse(getStorage('menulist')).filter(item => item.target == 'aPrice')[0].children.filter(item => item.name == '修改')
        .length > 0) {
      this.setState({
        orderflag: false
      })
    } else {
      this.setState({
        orderflag: true
      })
    }

    dispatch({
      type: 'cpTwoCode/cpTwoCode_List',
      payload: {
        pageSize: 10,
      }
    }); dispatch({
      type: 'cpOneCode/cpOneCode_List',
      payload: {
        pageSize: 10,
      }
    });

    dispatch({
			type: 'cpEntrepot/cpEntrepot_List',
			payload: {
				current: 1,
				pageSize: 10
			}
		})

    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'del_flag',
      },
      callback: data => {
        this.setState({
          del_flag: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'start_status',
      },
      callback: data => {
        this.setState({
          startStatus: data
        })
      }
    });
    dispatch({
      type: 'dict/dict',
      payload: {
        type: 'unit',
      },
      callback: data => {
        this.setState({
          unit: data
        })
      }
    });

    dispatch({
      type: 'cpBillMaterial/get_cpBill_caterialList1',
      payload: {
        pageSize: 10,
        tag:1
      }
    });

    dispatch({
      type: 'cpOneCode/cpOneCode_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'cpTwoCode/cpTwoCode_List',
      payload: {
        pageSize: 10,
      }
    });
  }

  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'cpAccessoriesSalesPrice/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, form, getCpSalesAccessoriesMoney } = this.props;
    const { addfileList, location, selectkhdata, selectdata ,selectkwdata ,selectinkwdata ,modalRecord} = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }


        value.cpBillMaterial = {}
        value.cpBillMaterial.id =  isNotBlank(modalRecord) && isNotBlank(modalRecord.id)?modalRecord.id :(isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.cpBillMaterial)
        && isNotBlank(getCpSalesAccessoriesMoney.cpBillMaterial.id) ? getCpSalesAccessoriesMoney.cpBillMaterial.id : '')
        // value.cpEntrepot = {}
				// value.cpEntrepot.Id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id : (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.cpEntrepot)
				//   && isNotBlank(getCpSalesAccessoriesMoney.cpEntrepot.id) ? getCpSalesAccessoriesMoney.cpEntrepot.id : '')
				// value.storage = {}
				// value.storage.id = isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id) ? selectinkwdata.id : (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.storage)
				// 	&& isNotBlank(getCpSalesAccessoriesMoney.storage.id) ? getCpSalesAccessoriesMoney.storage.id : '')

        value.salesPrice = isNotBlank(value.salesPrice)?setPrice(value.salesPrice):''   
        // value.one = {}
        // value.two = {}
        // value.one.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
        //   (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.one) && isNotBlank(getCpSalesAccessoriesMoney.one.id) ? getCpSalesAccessoriesMoney.one.id : '')
        // value.two.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id :
        //   (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.two) && isNotBlank(getCpSalesAccessoriesMoney.two.id) ? getCpSalesAccessoriesMoney.two.id : '')
        dispatch({
          type: 'cpAccessoriesSalesPrice/getCpSalesAccessoriesMoney',
          payload: { ...value },
          callback: (res) => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.push(`/warehouse/process/cp_accessoriesSales_price_form?id=${res.data.id}`);
          }
        })
      }
    });
  };

  onsave = () => {
    const { dispatch, form, getCpSalesAccessoriesMoney } = this.props;
    const { addfileList, location, selectkhdata, selectdata ,selectkwdata ,selectinkwdata ,modalRecord} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
          value.id = location.query.id;
        }

        value.cpBillMaterial = {}
        value.cpBillMaterial.id =  isNotBlank(modalRecord) && isNotBlank(modalRecord.id)?modalRecord.id :(isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.cpBillMaterial)
        && isNotBlank(getCpSalesAccessoriesMoney.cpBillMaterial.id) ? getCpSalesAccessoriesMoney.cpBillMaterial.id : '')

        // value.cpEntrepot = {}
				// value.cpEntrepot.Id = isNotBlank(selectkwdata) && isNotBlank(selectkwdata.id) ? selectkwdata.id : (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.cpEntrepot)
				//   && isNotBlank(getCpSalesAccessoriesMoney.cpEntrepot.id) ? getCpSalesAccessoriesMoney.cpEntrepot.id : '')
				// value.storage = {}
				// value.storage.id = isNotBlank(selectinkwdata) && isNotBlank(selectinkwdata.id) ? selectinkwdata.id : (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.storage)
				// 	&& isNotBlank(getCpSalesAccessoriesMoney.storage.id) ? getCpSalesAccessoriesMoney.storage.id : '')
        value.salesPrice = isNotBlank(value.salesPrice)?setPrice(value.salesPrice):'' 
        // value.one = {}
        // value.two = {}
        // value.one.id = isNotBlank(selectdata) && isNotBlank(selectdata.id) ? selectdata.id :
        //   (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.one) && isNotBlank(getCpSalesAccessoriesMoney.one.id) ? getCpSalesAccessoriesMoney.one.id : '')
        // value.two.id = isNotBlank(selectkhdata) && isNotBlank(selectkhdata.id) ? selectkhdata.id :
        //   (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.two) && isNotBlank(getCpSalesAccessoriesMoney.two.id) ? getCpSalesAccessoriesMoney.two.id : '')
        dispatch({
          type: 'cpAccessoriesSalesPrice/CpSalesAccessoriesMoney_Save',
          payload: { ...value },
          callback: (res) => {
            router.push(`/warehouse/process/cp_accessoriesSales_price_form?id=${res.data.id}`);
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.push('/warehouse/process/cp_accessoriesSales_price_list');
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleImage = url => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  };

  handleRemove = file => {
    this.setState(({ fileList, addfileList }) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      const newaddfileList = addfileList.slice();
      newaddfileList.splice(index, 1);
      return {
        fileList: newFileList,
        addfileList: newaddfileList,
      };
    });
  };

  handlebeforeUpload = file => {
    const { addfileList } = this.state;
    const isimg = file.type.indexOf('image') >= 0;
    if (!isimg) {
      message.error('请选择图片文件!');
    }
    const isLt10M = file.size / 1024 / 1024 <= 10;
    if (!isLt10M) {
      message.error('文件大小需为10M以内');
    }
    if (isimg && isLt10M) {
      if (!isNotBlank(addfileList) || addfileList.length <= 0) {
        this.setState({
          addfileList: [file],
        });
      } else {
        this.setState({
          addfileList: [...addfileList, file],
        });
      }
    }
    return isLt10M && isimg;
  };

  handleUploadChange = info => {
    const isimg = info.file.type.indexOf('image') >= 0;
    const isLt10M = info.file.size / 1024 / 1024 <= 10;
    if (info.file.status === 'done') {
      if (isLt10M && isimg) {
        this.setState({ fileList: info.fileList });
      }
    } else {
      this.setState({ fileList: info.fileList });
    }
  };

  onselect = () => {
    this.setState({
      selectflag: true
    })
  }

  onselectkh = () => {

    this.setState({
      selectkhflag: true
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  handleModalVisiblekh = flag => {
    this.setState({
      selectkhflag: !!flag
    });
  };

  selectuser = (res) => {
    const { dispatch } = this.props;
    const { selectedRows, location } = this.state;
    this.setState({
      modalVisible: false,
      modalRecord: res,
      billid: res.billCode
    })
  }

  // selectuser = (record) => {
  //   this.setState({
  //     selectdata: record,
  //     selectflag: false
  //   })
  // }

  selectcustomer = (record) => {
    this.setState({
      selectkhdata: record,
      selectkhflag: false
    })
  }

	handleModalVisibleinkw = flag => {
		this.setState({
			selectinkwflag: !!flag
		});
	};

	handleModalVisiblekw = flag => {
		this.setState({
			selectkwflag: !!flag
		});
  };
  
  selectinkw = (record) => {
		const {getCpSalesAccessoriesMoney} = this.props
		this.props.form.setFieldsValue({
			kw: isNotBlank(record) && isNotBlank(record.name) ? record.name :
			(isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.storage) && isNotBlank(getCpSalesAccessoriesMoney.storage.name) ? getCpSalesAccessoriesMoney.storage.name : '')
		  });
		this.setState({
			selectinkwdata: record,
			selectinkwflag: false
		})
	}

	selectkw = (record) => {
		const { dispatch ,getCpSalesAccessoriesMoney ,form } = this.props
		const {location ,selectkwdata,selectinkwdata} = this.state
		dispatch({
			type: 'cpStorage/cpStorage_List',
			payload: {
				pageSize: 10,
				pjEntrepotId: record.id
			}
		});
		this.props.form.setFieldsValue({
			ck: isNotBlank(record) && isNotBlank(record.name) ? record.name :
			(isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.storage) && isNotBlank(getCpSalesAccessoriesMoney.storage.entrepotName) ? getCpSalesAccessoriesMoney.storage.entrepotName : '')
		  });
		this.setState({
			selectkwdata: record,
			selectkwflag: false
		})
		// const value = form.getFieldsValue()
		// if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
		// 	value.id = location.query.id;
		// }
		// value.cpEntrepot = {}
		// value.cpEntrepot.Id = isNotBlank(record) && isNotBlank(record.id) ? record.id :''
	  //   value.orderStatus = -1
		// dispatch({
		// 	type: 'cpProduct/cpProduct_save_Add',
		// 	payload: { ...value },
		// 	callback: () => {
		// 	}
		// })
  }
  
  onselectkw = () => {
		const { dispatch } = this.props;
		this.setState({
			selectkwflag: true
		})
  }
  
  showKwtable = () => {
		const { dispatch } = this.props
		this.setState({
			selectinkwflag: true
		});
  }
  
  onselectwl=()=>{
    this.setState({
      modalVisible:true
    })
  }

  render() {
    const { fileList, previewVisible, previewImage, modalVisible, selectdata, selectkhflag, selectkhdata, selectkwdata, selectkwflag, selectinkwflag, 
			selectinkwdata, orderflag , searchval, twovals ,modalRecord} = this.state;
    const { submitting1, submitting, getCpSalesAccessoriesMoney, cpOneCodeList, cpEntrepotList, cpStorageList  , cpTwoCodeList, dispatch ,getcpBillmaterialList1 } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const that = this

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectuser: this.selectuser,
      getcpBillmaterialList1,
      modalRecord,
      location,
      dispatch,
      // selectedRows,
      handleSelectRows: this.handleSelectRows,
      that
    };

    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleModalVisible: this.handleModalVisible,
    //   selectuser: this.selectuser,
    //   dispatch,
    //   that,
    //   searchval,
    //   cpOneCodeList
    // }
    const parentMethodskh = {
      handleAddkh: this.handleAddkh,
      handleModalVisiblekh: this.handleModalVisiblekh,
      selectcustomer: this.selectcustomer,
      dispatch,
      cpTwoCodeList,
      twovals,
      that
    }

    const parentMethodskw = {
			handleModalVisiblekw: this.handleModalVisiblekw,
			selectkw: this.selectkw,
			cpEntrepotList,
			dispatch,
			that
		}
		const parentMethodsinkw = {
			handleModalVisibleinkw: this.handleModalVisibleinkw,
			selectinkw: this.selectinkw,
			cpStorageList,
			dispatch,
			that
		}

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontWeight: 550, fontSize: 28, textAlign: 'center' }}>
            配件销售价格表
          </div>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='物料编码'>
                  <Input style={{ width: '50%' }} disabled value={isNotBlank(modalRecord) && isNotBlank(modalRecord.billCode) ? modalRecord.billCode:isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.billCode) ? getCpSalesAccessoriesMoney.billCode : ''} />
                  <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectwl} loading={submitting} disabled={orderflag}>选择</Button>
                </FormItem>

              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='一级编码'>
                  <Input  disabled value={isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCode) ? modalRecord.oneCode: (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.oneCode) ? getCpSalesAccessoriesMoney.oneCode : '')} />
                  {/* <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselect} loading={submitting} disabled={orderflag}>选择</Button> */}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='一级编码型号'>
                  <Input
                    disabled
                    value={isNotBlank(modalRecord) && isNotBlank(modalRecord.oneCodeModel) ? modalRecord.oneCodeModel:
                      (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.oneCodeModel) ? getCpSalesAccessoriesMoney.oneCodeModel : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='二级编码'>
                  <Input disabled value={isNotBlank(modalRecord) && isNotBlank(modalRecord.twoCode) ? modalRecord.twoCode: (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.twoCode) ? getCpSalesAccessoriesMoney.twoCode : '')} />
                  {/* <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.onselectkh} loading={submitting} disabled={orderflag}>选择</Button> */}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='二级编码名称'>
                  <Input
                    disabled

                    value={isNotBlank(modalRecord) && isNotBlank(modalRecord.twoCodeModel) ? modalRecord.twoCodeModel:
                      (isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.twoCodeModel) ? getCpSalesAccessoriesMoney.twoCodeModel : '')}
                  />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label='名称'
                >
                 <Input disabled value={isNotBlank(modalRecord) && isNotBlank(modalRecord.name) ? modalRecord.name:isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.name) ? getCpSalesAccessoriesMoney.name : ''} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='原厂编码'>
                  <Input disabled value={isNotBlank(modalRecord) && isNotBlank(modalRecord.originalCode) ? modalRecord.originalCode:isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.originalCode) ? getCpSalesAccessoriesMoney.originalCode : ''} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='配件厂商'>
                 <Input disabled value={isNotBlank(modalRecord)&&isNotBlank(modalRecord.rCode) ? modalRecord.rCode:isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.rCode) ? getCpSalesAccessoriesMoney.rCode : ''} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='单位'>
                <Select
                    disabled
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {
                      isNotBlank(this.state.unit) && this.state.unit.length > 0 && this.state.unit.map(d => <Option key={d.id} value={d.value}>{d.label}</Option>)
                    }
                  </Select>
                </FormItem>
              </Col>
  
              <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='销售价格'>
                  {getFieldDecorator('salesPrice', {
                    initialValue: isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.salesPrice) ? getPrice(getCpSalesAccessoriesMoney.salesPrice) : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入销售价格',
                      },
                    ],
                  })(<Input disabled={orderflag} />)}
                </FormItem>
              </Col>
              {/* <Col lg={12} md={12} sm={24}>
                <FormItem {...formItemLayout} label='状态'>
                  {getFieldDecorator('status', {
                    initialValue: isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.status) ? getCpSalesAccessoriesMoney.status : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择状态',
                      },
                    ],
                  })(<Select
                    disabled
                    value={isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.status) ? getCpSalesAccessoriesMoney.status : ''}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {
                      isNotBlank(this.state.startStatus) && this.state.startStatus.length > 0 && this.state.startStatus.map(d => <Option key={d.id} value={d.label}>{d.label}</Option>)
                    }
                  </Select>)}
                </FormItem>
              </Col> */}
              {/* <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="备注信息" className="allimgstyle">
                  {getFieldDecorator('remarks', {
                    initialValue: isNotBlank(getCpSalesAccessoriesMoney) && isNotBlank(getCpSalesAccessoriesMoney.remarks) ? getCpSalesAccessoriesMoney.remarks : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入备注信息',
                      },
                    ],
                  })(
                    <TextArea
                      disabled={orderflag}
                      style={{ minHeight: 32 }}

                      rows={2}
                    />
                  )}
                </FormItem>
              </Col> */}
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: 'center' }}>
              {isNotBlank(getStorage('menulist')) && JSON.parse(getStorage('menulist')).filter(item => item.target == 'aPrice').length > 0
                && JSON.parse(getStorage('menulist')).filter(item => item.target == 'aPrice')[0].children.filter(item => item.name == '修改')
                  .length > 0 &&
                <span>
                  <Button type="primary" onClick={this.onsave} loading={submitting1}>
                    保存
  </Button>
                  {/* <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting1}>
                    提交
  </Button> */}
                </span>
              }
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {/* <CreateForm {...parentMethods} selectflag={selectflag} /> */}
        <CreateFormkh {...parentMethodskh} selectkhflag={selectkhflag} />
        <CreateForminkw {...parentMethodsinkw} selectinkwflag={selectinkwflag} />
         <CreateFormkw {...parentMethodskw} selectkwflag={selectkwflag} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default CpBillMaterialForm;
import React, { Component } from 'react';
import { Button, Tabs, Select, Table, Modal, message, Input, Icon } from 'antd';
import { Link } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import './style.scss';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Launch extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    putInStatus: [{
      name: '投放中',
      id: 0
    },{
      name: '暂停中',
      id: 1
    }],
    putID: '', // 投放状态ID
    planList: [], // 广告计划列表数据
    total: '', // 总共的数据条数
    batchIds: '', // 批量id集合
    visibleRemove: false, // 删除确认框
    selectedRowKeys: [], // 批量选择集合
    type: '', // 确认框执行的方法类别(1、批量开启，2、批量关闭，3、批量删除)
    rowData: '', // 当前列的数据
    name: '', // 查询名称
    searchListName: 'planList', // 根据切换更改接口地址名称
  }

  componentDidMount () {
    this.getPlanList()
  }

  // tab切换回调
  TabCallback = (key) => {
    this.setState({
      searchListName: key === 1 ? 'planList' : 'selectAdList'
    }, () => {
      this.getPlanList()
    })
  }

  // 监听广告计划用户下拉
  handleChangeStatus = (value) => {
    this.setState({
      putID: value
    })
  }

  // 获取广告计划列表
  getPlanList = () => {
    const { pageNum, pageSize, putID, name, searchListName  } = this.state;

    HttpRequest(`/plan/${searchListName}`, "POST", {
      type: 1,
      pageNum,
      pageSize,
      name,
      state: putID
    }, res => {
      this.setState({
        planList: res.data.ls,
        total: res.data.totalNum
      })
    })
  }

  // 查询pageNum数据
  onChangePage = (number) => {
    this.setState({
      pageNum: number
    }, () => {
      this.getPlanList()
    })
  }

  // 获取批量ids
  getBatchDeleteIds = (selectedRowKeys, selectedRows) => {
    let batchIds = [];
    selectedRows.forEach(item => {
      batchIds.push(item.id)
    })

    this.setState({
      selectedRowKeys,
      batchIds: batchIds.join(',')
    })
  }

  // 确定删除确定框,广告计划批量删除
  okModalRemove = () => {
    const { batchIds, type } = this.state;
    
    if (type === 3) {
      HttpRequest("/plan/delPlans", "POST", {
        ids: batchIds
      }, res => {
        message.success("删除成功！");
        this.setState({
          visibleRemove: false,
          selectedRowKeys: []
        }, () => {
          this.getPlanList()
        })
      })
    } else if (type === 2) {
      this.batchUpdatePlans(1)
    } else if (type === 1) {
      this.batchUpdatePlans(0)
    } else if (type === 4) {
      this.singleUpdatePlans()
    }
  }

  // 取消删除确定框
  cancelModalRemove = () => {
    this.setState({
      visibleRemove: false
    })
  }

  // 开启批量确认框
  showBatchDeleteModal = (type, rowData) => {
    const { batchIds, visibleRemove } = this.state;
    if (type === 4) {
      this.setState({
        visibleRemove: true,
        type,
        rowData
      })

      Modal.confirm({
        title: '提示：',
        content: '确认本次操作？',
        visible: visibleRemove,
        okText: '确认',
        cancelText: '取消',
        onOk: this.okModalRemove,
        onCancel: this.cancelModalRemove
      });
    } else {
      if (!batchIds) {
        message.warning('请选择数据！')
      } else {
        this.setState({
          visibleRemove: true,
          type
        })

        Modal.confirm({
          title: '提示：',
          content: '确认本次操作？',
          visible: visibleRemove,
          okText: '确认',
          cancelText: '取消',
          onOk: this.okModalRemove,
          onCancel: this.cancelModalRemove
        });
      }
    }
  }

  // 切换创建状态
  switchCreateStatus = () => {
    this.setState({
      isCreate: true
    })
  }

  // 返回列表视图
  backListView = () =>{
    this.setState({
      isCreate: false
    })
  }

  // 批量修改状态
  batchUpdatePlans = (state) => {
    const { batchIds } = this.state;

    HttpRequest("/plan/updatePlans", "POST", {
      ids: batchIds,
      state: state
    }, res => {
      if (Number(res.code) === 200) {
        message.success('修改成功！')
        this.getPlanList()
      }
    })
  }

  // 单个修改状态
  singleUpdatePlans = () => {
    const { rowData } = this.state;
    HttpRequest("/plan/updatePlans", "POST", {
      ids: rowData.id,
      state: rowData.state === 0 ? 1 : 0
    }, res => {
      if (Number(res.code) === 200) {
        message.success('修改成功！')
        this.getPlanList()
      }
    })
  }

  // 监听广告名称input
  onChangeSearch = (e) => {
    this.setState({
      name: e.target.value.trim()
    })
  }

  // 点击搜索
  clickQuery = () => {
    this.setState({
      pageNum: 1
    }, () => {
      this.getPlanList()
    })
  }

  render () {
    const {putInStatus, planList, pageNum, pageSize, total, selectedRowKeys} = this.state;
    const columns = [{
      title: '计划名称',
      dataIndex: 'name',
    }, {
      title: '计划ID',
      dataIndex: 'id',
    }, {
      title: '展示',
      dataIndex: 'channelId',
      render: (text, record) => {
        return <span>{ record.planData ? record.planData.showNum : "" }</span>
      }
    }, {
      title: '点击',
      dataIndex: 'moneyType',
      render: (text, record) => {
        return <span>{ record.planData ? record.planData.clickNum : "" }</span>
      }
    }, {
      title: '点击率',
      dataIndex: 'putType',
      render: (text, record) => {
        return <span>{ record.planData ? record.planData.clickRate : "" }</span>
      }
    }, {
      title: 'CPC',
      dataIndex: 'userId',
      render: (text, record) => {
        return <span>{ record.planData ? record.planData.cpc : "" }</span>
      }
    }, {
      title: 'CPM',
      dataIndex: 'money1',
      render: (text, record) => {
        return <span>{ record.planData ? record.planData.cpm : "" }</span>
      }
    }, {
      title: '花费',
      dataIndex: 'money2',
      render: (text, record) => {
        return <span>{ record.planData ? record.planData.cost : "" }</span>
      }
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <div className="operation-group">
            <Icon type="play-circle" onClick={this.showBatchDeleteModal.bind(this, 4, record)} />
          </div>
        )
      }
    }, {
      title: '状态',
      dataIndex: 'state',
      render: (text, record) => {
        return <span>{ record.state === 0 ? "投放中" : "暂停中" }</span>
      }
    }, {
      title: '每日预算',
      dataIndex: 'dayMoney',
    }];

    // 批量表格
    const rowSelection = {
      onChange: this.getBatchDeleteIds,
      // 设置禁止操作
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
      selectedRowKeys
    };

    return (
      <section className="content-box launch-box">
        <div className="content-top">
          <h4>投放管理</h4>
          <div className="launch-top-button">
            <Link to="/content/create-plan"><Button type="primary" onClick={ this.switchCreateStatus }>创建新广告</Button></Link>
          </div>
        </div>

        <div className="launch-tabs">
          <Tabs defaultActiveKey="1" animated={false} onChange={this.TabCallback}>
            <TabPane tab="广告计划" key="1">
              {/* <CreatePlan backListView={ this.backListView } /> */}
              <div className="plan-examine">
                <div className="operation-row">
                  <a onClick={ this.showBatchDeleteModal.bind(this, 1) }>批量开启投放</a>
                  <a onClick={ this.showBatchDeleteModal.bind(this, 2) }>批量暂停投放</a>
                  <a onClick={ this.showBatchDeleteModal.bind(this, 3) }>批量删除</a>
                </div>

                <div className="table-box">
                  <div className="table-top">
                    <h5>详细数据</h5>

                    <div className="search-condition">
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="投放状态"
                        optionFilterProp="children"
                        onChange={this.handleChangeStatus}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {
                          putInStatus.map((item, index) => {
                            return <Option key={ index } value={ item.id }>{ item.name }</Option>
                          })
                        }
                      </Select>

                      <Input style={{ width: 200, margin: "0 15px" }} placeholder="广告计划名称" onChange={ this.onChangeSearch } />

                      <Button className="search-button" type="primary" shape="circle" icon="search" onClick={ this.clickQuery } />
                    </div>
                  </div>

                  <Table 
                    rowKey={(record, index) => index}
                    rowSelection={rowSelection} 
                    columns={columns} 
                    dataSource={planList} 
                    pagination={{ showQuickJumper: true, total, current: pageNum, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${total} 条`}}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tab="广告" key="2">
              {/* <CreatePlan backListView={ this.backListView } /> */}
              <div className="plan-examine">
                <div className="operation-row">
                  <a onClick={ this.showBatchDeleteModal.bind(this, 1) }>批量开启投放</a>
                  <a onClick={ this.showBatchDeleteModal.bind(this, 2) }>批量暂停投放</a>
                  <a onClick={ this.showBatchDeleteModal.bind(this, 3) }>批量删除</a>
                </div>

                <div className="table-box">
                  <div className="table-top">
                    <h5>详细数据 <span style={{marginLeft: 20}}>每日预算：500</span></h5>

                    <div className="search-condition">
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="投放状态"
                        optionFilterProp="children"
                        onChange={this.handleChangeStatus}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {
                          putInStatus.map((item, index) => {
                            return <Option key={ index } value={ item.id }>{ item.name }</Option>
                          })
                        }
                      </Select>

                      <Input style={{ width: 200, margin: "0 15px" }} placeholder="广告计划名称" onChange={ this.onChangeSearch } />

                      <Button className="search-button" type="primary" shape="circle" icon="search" onClick={ this.clickQuery } />
                    </div>
                  </div>

                  <Table 
                    rowKey={(record, index) => index}
                    rowSelection={rowSelection} 
                    columns={columns} 
                    dataSource={planList} 
                    pagination={{ showQuickJumper: true, total, current: pageNum, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${total} 条`}}
                  />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </section>
    )
  }
}

export default Launch;
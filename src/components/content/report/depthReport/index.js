import React, { Component } from 'react';
import {  TreeSelect, Button, DatePicker, Tree, Tooltip as TooltipAntd, Table, Icon, message } from 'antd';
import { Chart, Tooltip, Axis, Bar, Line, Point, Legend, Guide } from 'viser-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import HttpRequest from '@/utils/fetch';
import './style.scss';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = Tree.TreeNode;
const dateFormat = 'YYYY-MM-DD';

/**
 * 树形菜单
 */
const treeData = [{
  title: '基本',
  key: '0-0',
  children: [{
    parent: '基本',
    title: '小时报',
    key: '0-0-0',
  }, {
    parent: '基本',
    title: '日报',
    key: '0-0-1',
  }, {
    parent: '基本',
    title: '周报',
    key: '0-0-2',
  }],
}, {
  title: '活动',
  key: '0-1',
}, {
  title: '物料',
  key: '0-2',
}, {
  title: '资源',
  key: '0-3',
  children: [
    { parent: '资源', title: '供应方平台', key: '0-3-0-0' },
    { parent: '资源', title: 'HeroApp', key: '0-3-0-1' },
    { parent: '资源', title: '广告位', key: '0-3-0-2' },
  ],
}, {
  title: '终端',
  key: '0-4',
  children: [
    { parent: '终端', title: '操作系统', key: '0-4-0-0' },
    { parent: '终端', title: '上网方式', key: '0-4-0-1' },
    { parent: '终端', title: '运营商', key: '0-4-0-2' },
  ],
}, {
  title: '受众',
  key: '0-5',
  children: [
    { parent: '受众', title: '地域', key: '0-5-0-0' },
  ],
}];

/**
 * 图表
 */
const scale = [{
  dataKey: 'totalCost',
  min: 0
}, {
  dataKey: 'totalClick',
  alias: '点击数',
  min: 0
}, {
  dataKey: 'totalShow',
  alias: '展示数',
  min: 0
}];

/*二级 - start*/
const twoTreeData = [{
  label: '广告位',
  value: '0-0',
  key: '0-0'
}, {
  label: '广告',
  value: '0-1',
  key: '0-1'
}, {
  label: '渠道',
  value: '0-2',
  key: '0-2'
}];
/*二级 - end*/

/** 表格 - start */
let columns = [{
  title: "时间",
  key: 'hour',
  dataIndex: 'hour'
}, {
  title: "展示数",
  key: 'totalShow',
  dataIndex: 'totalShow',
  sorter: (a, b) => a.totalShow - b.totalShow
}, {
  title: "点击数",
  key: 'totalClick',
  dataIndex: 'totalClick',
  sorter: (a, b) => a.totalClick - b.totalClick,
}, {
  title: "CTR（%）",
  render: (text, record) => {
    return <span>{`${(record.totalClick / record.totalShow).toFixed(2)*100}%`}</span>
  },
  sorter: (a, b) => (a.totalClick / a.totalShow) - (b.totalClick / b.totalShow),
}];
/** 表格 - end */

class DepthReport extends Component {
  state = {
    second: [], // 二级维度
    selectedKeys: ['0-0-0'],
    chartName:'基本-小时报', // 图标名称
    pageSize: 100,
    pageNum: 1,
    time: moment(new Date()).format(dateFormat), // 日期
    planId: '', // 广告计划ID
    dataSource: [], // 列表
    planInfo: '', // 计划信息
  }

  componentDidMount () {
    const { match } = this.props;
    this.setState({
      planId: match.params.id
    }, () => {
      this.selPlan()
      this.deepTable()
    })
  }

  // 日期监听
  onChangeDate = (date, dateString) => {
    console.log(date, dateString)
    this.setState({
      time: dateString
    }, () => {
      this.deepTable()
    })
  }

  // 无法选择未来的日子
	disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  }

  onSelect = (selectedKeys, info) => {
    const selectedNodes = info.selectedNodes[0];

    if (info.selectedNodes.length) {
      if (!selectedNodes.props.dataRef && selectedKeys.length) {
        this.setState({ selectedKeys, chartName: (selectedNodes.props.parent ? selectedNodes.props.parent + '-' : '') + selectedNodes.props.title  });
      }
    }
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  // 二级维度
  onChangeSecond = (value) => {
    this.setState({ second: value }, () => {
      this.deepTable()
    });
  }

  // 深度报表
  deepTable = () => {
    const { planId, pageSize, pageNum, second, time } = this.state;
    let pos = false, ad = false, channel = false;
    const setSecond = new Set(second);

    if (setSecond.has('0-1')) { // 广告
      ad = true
    }

    if (setSecond.has('0-0')) { // 广告位
      pos = true
    } 

    if (setSecond.has('0-2')) { // 渠道
      channel = true
    }

    HttpRequest("/count/deepTable", "POST", {
      time,
      pos,
      ad,
      channel,
      planId,
      pageNum,
      pageSize
    }, res => {
      if (res.data.ls && res.data.ls.length) {
        res.data.ls.forEach(item => {
          item.hour = `${item.hour.split(' ')[1]}:00`
        })

        this.setState({
          dataSource: res.data.ls
        })
      }
    })
  }

  // 删除指定的表格列
  columnsRemove = (str) => {
    columns.forEach((item, index) => {
      if (item.title === str) {
        columns.splice(index, 1)
      }
    })
  }

  // 查询单个计划
  selPlan = () => {
    HttpRequest("/plan/selPlan", "POST", {
      id: this.state.planId
    }, res => {
      this.setState({
        planInfo: res.data
      })
    })
  }

  // 提取插入的位置
  columnsSplice = (str, add, link) => {
    let num = 0, index = '';

    columns.forEach((item, idx) => {
      if (item.title === str) {
        num ++;
      }

      if (item.title === link) {
        index = idx;
      }
    })

    if (num === 0) {
      if (str === '广告位') {
        columns.splice(index, 0, add)
      } else if (str === '广告') {
        columns.splice(1, 0, add)
      } else if (str === '渠道') {
        if (index === '') {
          columns.splice(1, 0, add)
        } else {
          columns.splice(2, 0, add)
        }
      }
    }
  }

  // 删除列表
  removeList = (str) => {
    columns.forEach((item, index) => {
      if (item.title === str) {
        columns.splice(index, 1)
      }
    })
  }

  // 导出
  deepOutCsv = () => {
    if (!this.state.dataSource.length) {
      message.warning('无数据')
      return false
    }

    const { planId, pageSize, pageNum, second, time } = this.state;
    let pos = false, ad = false, channel = false;
    const setSecond = new Set(second);

    if (setSecond.has('0-1')) { // 广告
      ad = true
    }

    if (setSecond.has('0-0')) { // 广告位
      pos = true
    } 

    if (setSecond.has('0-2')) { // 渠道
      channel = true
    }

    HttpRequest("/count/deepOutCsv", "POST", {
      time,
      pos,
      ad,
      channel,
      planId,
      pageNum,
      pageSize
    }, res => {
      window.open(encodeURI(res.data));
    })
  }

  render () {
    const { selectedKeys, chartName, second, dataSource, planInfo } = this.state;
    
    const tProps = {
      treeData: twoTreeData,
      value: second,
      onChange: this.onChangeSecond,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '二级维度',
      className: 'ant-select-second',
      style: {
        width: 260,
      },
      dropdownStyle: { maxHeight: 400, overflow: 'auto' }
    };

    // 根据勾选维度显示列表
    const setSecond = new Set(second);
    if (setSecond.has('0-0')) { // 广告位
      this.columnsSplice('广告位', {
        title: "广告位",
        key: 'posName',
        dataIndex: 'posName'
      }, '展示数');
    } else {
      this.removeList('广告位');
    }
    
    if (setSecond.has('0-1')) { // 广告
      this.columnsSplice('广告', {
        title: "广告",
        key: 'adName',
        dataIndex: 'adName'
      });
    } else {
      this.removeList('广告');
    }
    
    if (setSecond.has('0-2')) { // 渠道
      this.columnsSplice('渠道', {
        title: "渠道",
        key: 'channelName',
        dataIndex: 'channelName'
      }, '广告');
    } else {
      this.removeList('渠道');
    }
    
    return (
      <section className="depth-box">
        <div className="content-top">
          <h4><Link to="/content/report/real-time"><Icon type="left" /> 深度报表</Link></h4>

          <div className="launch-top-button">
            <DatePicker 
              defaultValue={moment(new Date(), dateFormat)} 
              format={dateFormat} 
              allowClear={false} 
              onChange={this.onChangeDate}
              disabledDate={this.disabledDate}
            />
          </div>
        </div>

        <div className="depth-info">
          <span>状态：{ planInfo.state === 0 ? '暂停': '投放中' }</span>
          <span>广告主：{ planInfo.userName }</span>
          <span>投放日期：</span>
        </div>

        <div className="depth-main">
          <div className="tree-mnue">
            <Tree
              defaultExpandAll={true}
              onSelect={this.onSelect}
              selectedKeys={selectedKeys}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </div>

          <div className="chart-box">
            <div className="chart-content">
              <h6 className="chart-name">{chartName}</h6>
              
              <div className="chart-frame">
                {
                  dataSource.length 
                  ?
                  <Chart forceFit height={400} padding={[20, 50, 95, 80]} data={dataSource} scale={scale} defs={{ 'totalShow': { alias: '展示数' }, totalClick: { alias: '点击数' } }}>
                    <Tooltip 
                    itemTpl='<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {value}</li>' />
                    <Legend
                      custom
                      allowAllCanceled
                      items={[
                        {value: '展示数', marker: {symbol: 'square', fill: '#008ed2', radius: 5} },
                        {value: '点击数', marker: {symbol: 'hyphen', stroke: '#00c3f0', radius: 5, lineWidth: 3} }
                      ]}
                      onClick={(ev, chart) => {
                        const item = ev.item;
                        const value = item.value;
                        const checked = ev.checked;
                        const geoms = chart.getAllGeoms();
                        for (let i = 0; i < geoms.length; i++) {
                          const geom = geoms[i];
                          if (geom.getYScale().field === value) {
                            if (checked) {
                              geom.show();
                            } else {
                              geom.hide();
                            }
                          }
                        }
                      }}
                    />
                    <Axis
                      dataKey="totalClick"
                      grid={null}
                    />
                    <Guide type="text" content="展示数" position={["0%", "0"]} style={{ fill: '#008ed2' }} top={true} />
                    <Guide type="text" content="点击数" position={["96%", "0"]} style={{ fill: '#00c3f0' }} top={true} />
                    <Bar position="hour*totalShow" color="#008ed2" />
                    <Line position="hour*totalClick" color="#00c3f0" size={3} />
                    <Point shape="circle" position="hour*totalClick" color="#fff" style={{ stroke: '#00c3f0', lineWidth: 1 }} size={3} />
                  </Chart>
                  :
                  <p style={{ textAlign: 'center', margin: '10px' }}>无数据</p>
                }
              </div>
            </div>

            <div className="table-frame">
              <div className="search-group">
                <div className="group">
                  <TreeSelect {...tProps} />
                </div>

                <div className="group">
                  <TooltipAntd placement="top" title="导出">
                    <Button className="export-button" type="primary" icon="export" onClick={this.deepOutCsv} />
                  </TooltipAntd>
                </div>
              </div>

              <div className="table-box">
                <Table 
                  rowKey={(record, index) => index}
                  columns={columns} 
                  dataSource={dataSource} 
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default DepthReport;
import React, { Component } from 'react';
import {  TreeSelect, Button, DatePicker, Tree, Tooltip as TooltipAntd, Table, Icon  } from 'antd';
import { Chart, Tooltip, Axis, Bar, Line, Point, Legend, Guide } from 'viser-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './style.scss';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = Tree.TreeNode;
const dateFormat = 'YYYY/MM/DD';
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
const data = [
  { time: '10:10', call: 4, waiting: 2, people: 2 },
  { time: '10:15', call: 2, waiting: 6, people: 3 },
  { time: '10:20', call: 13, waiting: 2, people: 5 },
  { time: '10:25', call: 9, waiting: 9, people: 1 },
  { time: '10:30', call: 5, waiting: 2, people: 3 },
  { time: '10:35', call: 8, waiting: 2, people: 1 },
  { time: '10:40', call: 13, waiting: 1, people: 2 }
];

const scale = [{
  dataKey: 'call',
  min: 0
}, {
  dataKey: 'people',
  min: 0
}, {
  dataKey: 'waiting',
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
  label: '日期',
  value: '0-2',
  key: '0-2'
}];
/*二级 - end*/

/** 表格 - start */
const columns = [{
  title: "渠道",
  key: 'outMoney1',
  dataIndex: 'outMoney1',
}, {
  title: "展示数",
  key: 'outMoney3',
  dataIndex: 'outMoney3',
  sorter: (a, b) => a.outMoney3 - b.outMoney3
}, {
  title: "独立展示数",
  key: 'outMoney4',
  dataIndex: 'outMoney4',
  sorter: (a, b) => a.outMoney4 - b.outMoney4,
}, {
  title: "点击数",
  key: 'outMoney5',
  dataIndex: 'outMoney5',
  sorter: (a, b) => a.outMoney5 - b.outMoney5,
}, {
  title: "独立点击数",
  key: 'outMoney6',
  dataIndex: 'outMoney6',
  sorter: (a, b) => a.outMoney6 - b.outMoney6,
}, {
  title: "CTR（%）",
  key: 'outMoney7',
  dataIndex: 'outMoney7',
  sorter: (a, b) => a.outMoney7 - b.outMoney7,
}];

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  time: '2017-05-20',
  inMoney: '西湖区湖底公园1号',
  outMoney: 36,  
  outMoney1: 20,  
  outMoney2: 40, 
  outMoney3: 50, 
  outMoney4: 11,  
  outMoney5: 77, 
  outMoney6: 88,
}, {
  key: '2',
  name: '胡彦祖',
  time: '2017-05-30',
  inMoney: '西湖区湖底公园1号',
  outMoney: 13,  
  outMoney1: 40,  
  outMoney2: 10, 
  outMoney3: 77, 
  outMoney4: 55,  
  outMoney5: 88, 
  outMoney6: 66,
}];
/** 表格 - end */

class DepthReport extends Component {
  state = {
    second: [], // 二级维度
    selectedKeys: ['0-0-0'],
    chartName:'基本-小时报', // 图标名称
  }

  // 日期监听
  onChangeDate = (date, dateString) => {
    console.log(date, dateString)
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
    this.setState({ second: value });
  }

  // 提取插入的位置
  columnsSplice = (str, add) => {
    let num = '', isBol = false, targetStr = '';
    if (str === '渠道') {
      targetStr = '广告位'
    } else if (str === '广告') {
      str = '渠道'
      targetStr = '广告'
    } else if (str === '时间') {
      targetStr = '时间'
    }

    columns.forEach((item, index) => {
      if (item.title === str) {
        if (str === '渠道' && targetStr === '广告') {
          console.log(index)
          num = index - 1;
        } else {
          num = index + 1;
        }
      }
      if (item.title === targetStr) {
        isBol = true;
      }
    })

    if (!isBol) {
      if (str === '时间') {
        columns.unshift(add)
      } else {
        num = num < 0 ? 0 : num === 0 ? 1 : num
        columns.splice(num, 0, add)
      }
    }
  }

  // 删除指定的表格列
  columnsRemove = (str) => {
    columns.forEach((item, index) => {
      if (item.title === str) {
        columns.splice(index, 1)
      }
    })
  }

  render () {
    const { selectedKeys, chartName, second } = this.state;
    
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
      this.columnsSplice('渠道', {
        title: "广告位",
        key: 'outMoney2',
        dataIndex: 'outMoney2',
      })
    } else {
      this.columnsRemove('广告位')
    }
    
    if (setSecond.has('0-1')) { // 广告
      this.columnsSplice('广告', {
        title: "广告",
        key: 'outMoney',
        dataIndex: 'outMoney',
      })
    } else {
      this.columnsRemove('广告')
    }
    
    if (setSecond.has('0-2')) { // 日期
      this.columnsSplice('时间', {
        title: "时间",
        key: 'time',
        dataIndex: 'time',
        sorter: (a, b) => moment(a.time).format('X') - moment(b.time).format('X'),
      })
    } else {
      this.columnsRemove('时间')
    }
    
    return (
      <section className="depth-box">
        <div className="content-top">
          <h4><Link to="/content/report/real-time"><Icon type="left" /> 广告主</Link></h4>

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
          <span>状态：</span>
          <span>广告主：</span>
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
                <Chart forceFit height={400} data={data} scale={scale}>
                  <Tooltip />
                  <Legend
                    custom
                    allowAllCanceled
                    items={[
                      {value: 'waiting', marker: {symbol: 'square', fill: '#008ed2', radius: 5} },
                      {value: 'people', marker: {symbol: 'hyphen', stroke: '#00c3f0', radius: 5, lineWidth: 3} }
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
                    dataKey="people"
                    grid={null}
                  />
                  <Guide type="text" content="展示数" position={["0%", "0"]} style={{ fill: '#008ed2' }} top={true} />
                  <Guide type="text" content="点击数" position={["96%", "0"]} style={{ fill: '#00c3f0' }} top={true} />
                  <Bar position="time*waiting" color="#008ed2" />
                  <Line position="time*people" color="#00c3f0" size={3} />
                  <Point shape="circle" position="time*people" color="#fff" style={{ stroke: '#00c3f0', lineWidth: 1 }} size={3} />
                </Chart>
              </div>
            </div>

            <div className="table-frame">
              <div className="search-group">
                <div className="group">
                  <TreeSelect {...tProps} />
                </div>

                <div className="group">
                  <TooltipAntd placement="top" title="导出">
                    <Button className="export-button" type="primary" icon="export" />
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
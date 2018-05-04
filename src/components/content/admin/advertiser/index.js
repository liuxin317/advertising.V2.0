import React, { Component } from 'react';
import { Button, Input, Table } from 'antd';
import { Link } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import './style.scss';

const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '客户名称',
  dataIndex: 'cname',
  key: 'cname',
}, {
  title: '行业',
  dataIndex: 'industry',
  key: 'industry',
}, {
  title: 'AM',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '联系人电话',
  dataIndex: 'phone',
  key: 'phone',
}, {
  title: '负责BD',
  dataIndex: 'bd',
  key: 'bd',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  key: 'createTime',
}, {
  title: '操作',
  render : (text, record) => {
    var path = `/content/admin/new-advertiser/${record.id}`;
    return <div><Link to={path}>编辑</Link></div>
  }
}];

class Advertiser extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    total: '', // 总共的数据条数
    name: '', //查询名称
    advertiserList: [], // 广告主列表
  }

  componentDidMount () {
    this.getUserList()
  }

  // 获取广告主列表
  getUserList = () => {
    const { pageNum, pageSize, name } = this.state;
    HttpRequest("/sys/userList", "POST", {
      pageNum,
      pageSize,
      name
    }, res => {
      this.setState({
        total: res.data.totalNum,
        advertiserList: res.data.ls
      })
    })
  }

  // 监听input框
  onChangeInput = (name, e) => {
    let obj = {};
    obj[name] = e.target.value.trim();

    this.setState({
      ...obj
    })
  }

  render () {
    const { pageNum, pageSize, total, advertiserList } = this.state;

    return (
      <section className="advertiser-box">
        <div className="content-top">
          <h4>广告主管理</h4>
          <div className="launch-top-button">
            <Button type="primary"><Link to="/content/admin/new-advertiser/new">新建广告主</Link></Button>
          </div>
        </div>

        <div className="advertiser-tables">
          <div className="search-condition">
            <Input style={{ width: 200, margin: "0 15px" }} placeholder="输入广告主名称" onChange={ this.onChangeInput.bind(this, 'name') } />
            <Button className="search-button" type="primary" shape="circle" icon="search" onClick={ this.getUserList } />
          </div>

          <div className="table-box">
            <Table 
              rowKey={(record, index) => index}
              columns={columns} 
              dataSource={advertiserList} 
              pagination={{ showQuickJumper: true, total, current: pageNum, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${total} 条`}}
            />
          </div>
        </div>
      </section>
    )
  }
}

export default Advertiser;
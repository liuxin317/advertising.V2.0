import React, { Component } from 'react';
import { Button, Input, Table } from 'antd';
import './style.scss';

const columns = [{
  title: 'ID',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '客户名称',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '行业',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'AM',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '联系人电话',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '负责BD',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '创建时间',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '操作',
  dataIndex: 'address',
  key: 'address',
  render : (text, record) => {
    return <a>编辑</a>
  }
}];

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

class Advertiser extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    total: '', // 总共的数据条数
  }

  render () {
    const { pageNum, pageSize, total } = this.state;

    return (
      <section className="advertiser-box">
        <div className="content-top">
          <h4>广告主管理</h4>
          <div className="launch-top-button">
            <Button type="primary">新建广告主</Button>
          </div>
        </div>

        <div className="advertiser-tables">
          <div className="search-condition">
            <Input style={{ width: 200, margin: "0 15px" }} placeholder="输入广告主名称" onChange={ null } />
            <Button className="search-button" type="primary" shape="circle" icon="search" onClick={ null } />
          </div>

          <div className="table-box">
            <Table 
              rowKey={(record, index) => index}
              columns={columns} 
              dataSource={dataSource} 
              pagination={{ showQuickJumper: true, total, current: pageNum, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${total} 条`}}
            />
          </div>
        </div>
      </section>
    )
  }
}

export default Advertiser;
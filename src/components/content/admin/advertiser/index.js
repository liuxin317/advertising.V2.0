import React, { Component } from 'react';
import { Button, Input, Table } from 'antd';
import { Link } from 'react-router-dom';
import './style.scss';

const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '客户名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '行业',
  dataIndex: 'hy',
  key: 'hy',
}, {
  title: 'AM',
  dataIndex: 'am',
  key: 'am',
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
  dataIndex: 'time',
  key: 'time',
}, {
  title: '操作',
  render : (text, record) => {
    return <a>编辑</a>
  }
}];

const dataSource = [{
  id: '1',
  name: '胡彦斌',
  am: 32,
  hy: '西湖区湖底公园1号',
  bd: 20,
  time: 123,
  phone: 18200110585
}, {
  id: '2',
  name: '胡彦斌',
  am: 32,
  hy: '西湖区湖底公园1号',
  bd: 20,
  time: 123,
  phone: 18200110585
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
            <Button type="primary"><Link to="/content/admin/new-advertiser">新建广告主</Link></Button>
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
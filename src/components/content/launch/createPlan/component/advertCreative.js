import React, { Component } from 'react';
import { Button } from 'antd';
// 上传创意
import CreativeUpload from './creativeUpload';

class AdvertCreative extends Component {
  state = {
    creativeList: [{ // 创意列表
      name: "创意1",
      id: 1,
      url: "",
      active: true
    }],
    creativeID: 1, // 当前创意ID 
  }

  // 切换黑白名单
  switchCreativeList= (id) => {
    const { creativeList } = this.state;
    let deepCreativeList= JSON.parse(JSON.stringify(creativeList));

    deepCreativeList.forEach(item => {
      if (item.id === id) {
        item.active = true
      } else {
        item.active = false
      }
    })

    this.setState({
      creativeList: deepCreativeList,
      creativeID: id
    })
  }

  // 添加创意
  addCreative = () => {
    const { creativeList } = this.state;
    let deepCreativeList= JSON.parse(JSON.stringify(creativeList));
    const len = creativeList.length;

    let obj = {
      url: "",
      active: false
    }
    
    obj.name = `创意${len + 1}`
    obj.id = len + 1

    deepCreativeList.push(obj)

    this.setState({
      creativeList: deepCreativeList
    })
  }

  render () {
    const { creativeList } = this.state;

    return (
      <section className="create-plan__group">
        <h2>广告创意</h2>

        <div className="creative-box">
          <ul className="creative-list">
            {
              creativeList.map(item => {
                return <li className={ item.active ? "active" : "" } key={item.id} onClick={ this.switchCreativeList.bind(this, item.id) }>{item.name}</li>
              })
            }

            <li className="add-creative" onClick={this.addCreative}>添加创意</li>
          </ul>
          
          {/* 上传创意 */}
          <CreativeUpload />
        </div>

        {/* 提交 */}
        <Button type="primary" className="next-step" style={{ marginTop: 30 }}>提交</Button>
      </section>
    )
  }
}

export default AdvertCreative;
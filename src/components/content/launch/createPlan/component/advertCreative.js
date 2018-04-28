import React, { Component } from 'react';
import { Button, Icon } from 'antd';
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

  // 删除新增的创意
  closeSelf = (id, e) => {
    e.stopPropagation(); // 阻止冒泡事件

    const { creativeList } = this.state;
    let deepCreativeList= JSON.parse(JSON.stringify(creativeList));

    deepCreativeList.forEach((item, index) => {
      if (item.id === id) {
        deepCreativeList.splice(index, 1)
      }
    })

    this.setState({
      creativeList: deepCreativeList
    })
  }

  // 提交
  nextStep = () => {
    const { creativeList } = this.state;
    let arr = [];
    creativeList.forEach(item => {
      let name = `creativity${item.id}`
      arr.push(this.refs[name].passParentData())
    })
    this.props.getOriginalitys(arr);
  }

  render () {
    const { creativeList, creativeID } = this.state;

    return (
      <section className="create-plan__group">
        <h2>广告创意</h2>

        <div className="creative-box">
          <ul className="creative-list">
            {
              creativeList.map(item => {
                return (
                  <li className={ item.active ? "active" : "" } key={item.id} onClick={ this.switchCreativeList.bind(this, item.id) }>
                    { item.id === 1 ? "" : <Icon className="close-style" type="close" onClick={ this.closeSelf.bind(this, item.id) } /> } {item.name}
                  </li>
                )
              })
            }

            <li className="add-creative" onClick={this.addCreative}>添加创意</li>
          </ul>
          
          {/* 上传创意,对应生成相应的信息填写 */}
          {
            creativeList.map(item => {
              return <CreativeUpload ref={`creativity${item.id}`} key={item.id} type={item.id} creativeID={creativeID}  />
            })
          }
        </div>

        {/* 提交 */}
        <Button type="primary" className="next-step" style={{ marginTop: 30 }} onClick={this.nextStep}>提交</Button>
      </section>
    )
  }
}

export default AdvertCreative;
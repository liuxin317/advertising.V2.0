import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import Store from '@/store';
import Type from '@/action/Type';
import HttpRequest from '@/utils/fetch.js';
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
    dataSource: [], // 广告位列表
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.two) {
      Store.dispatch({ type: Type.AD_CEATE_TWO, payload: { adCreateTwo: true } });

      // 根据屏幕高度来添加.create-plan的paddingBottom
      let winH = window.innerHeight;
      let adCreativeH = document.querySelector('#ad_creative').offsetHeight;
      if (winH > adCreativeH) {
        document.querySelector('.create-plan').style.paddingBottom = (winH - adCreativeH + 30) + 'px';
      }
      // this.selMaterials()
    }
    
    if (this.props.selectedRows !== nextProps.selectedRows) {
      if (nextProps.selectedRows.length) {
        this.setState({
          dataSource: nextProps.selectedRows
        })
      } else {
        this.getPos()
      }
    }
  }

  // 获取广告版位接口
  getPos = () => {
    HttpRequest("/plan/selPosList", "POST", {
      channelIds: ''
    }, res => {
      this.setState({
        dataSource: res.data
      })
    })
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

    deepCreativeList.forEach(item => {
      item.active = false
    })

    let obj = {
      url: "",
      active: true
    }
    
    obj.name = `创意${len + 1}`
    obj.id = len + 1

    deepCreativeList.push(obj)

    this.setState({
      creativeList: deepCreativeList,
      creativeID: obj.id
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
    let num = 0;

    creativeList.forEach(item => {
      let name = `creativity${item.id}`
      arr.push(this.refs[name].passParentData())
    })

    arr.forEach(item => {
      if (!item.url === '') {
        message.warning(`请上传创意${item.type}的创意！`)
        num++
        return false
      } else if (!item.logo) {
        message.warning(`请上传创意${item.type}的头像！`)
        num++
        return false
      } else if (!item.text) {
        message.warning(`请填写创意${item.type}的广告文案！`)
        num++
        return false
      } else if (!item.descs) {
        message.warning(`请填写创意${item.type}的广告描述！`)
        num++
        return false
      }
    })

    // 判断广告创意是否填写完毕
    if (num === 0) {
      this.props.getOriginalitys(arr);
    }
  }

  // 获取素材库
  selMaterials = () => {
    HttpRequest("/plan/selMaterials", "POST", {}, res => {

    })
  }

  render () {
    const { creativeList, creativeID, dataSource } = this.state;
    const { two, selectedRows } = this.props;

    return (
      <section className={`create-plan__group ${ two ? '' : 'none' }`} id="ad_creative" style={{ height: 900 }}>
        <h2 id="originality">广告创意</h2>

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
              return <CreativeUpload ref={`creativity${item.id}`} key={item.id} type={item.id} creativeID={creativeID} dataSource={dataSource}  />
            })
          }
        </div>

        {/* 提交 */}
        <div className="operation" style={{ marginTop: 30 }}>
          <Button type="primary" className="next-step" onClick={this.nextStep}>提交</Button>
          <Link to="/content/launch"><Button>返回上级</Button></Link>
        </div>
      </section>
    )
  }
}

export default AdvertCreative;
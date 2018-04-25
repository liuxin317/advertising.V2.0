import React, { Component } from 'react';
import { Checkbox } from 'antd';
import area from '@/configure/area';
import './style.scss';

console.log(area);

// 提取一级地区
class ExtractOneLevelRegion extends Component {
    render () {
        const { regionData } = this.props;

        return (
            <div className="one-level">
                {
                    regionData.map((item, index) => {
                        return <div key={index} className="region-row"><Checkbox>{item.name}</Checkbox></div>
                    })
                }
            </div>
        )
    }
}

class RegLinkage extends Component {

    state = {
        regionData: area, // 地区数据
    }

    render () {
        const { regionData } = this.state;

        return (
            <section className="linkage-box">
                <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: 'auto' }}>已选择：</label>
                    <div className="input-group">
                        <span className="already-chosen">四川省</span>
                        <span className="already-chosen">四川省</span>
                        <a className="clear-chosen">清空</a>
                    </div>
                </div>

                <div className="linkage-content">
                    <div className="linkage-group">
                        <ExtractOneLevelRegion regionData={ regionData } />
                    </div>
                    <div className="linkage-group"></div>
                    <div className="linkage-group"></div>
                </div>
            </section> 
        )
    }
}

export default RegLinkage;
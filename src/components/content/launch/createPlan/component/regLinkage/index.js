import React, { Component } from 'react';
import { Checkbox, Icon } from 'antd';
import area from '@/configure/area';
import './style.scss';

// 提取三级地区
class ExtractThreeLevelRegion extends Component {
    // 监听三级勾选状态
    onChangeThreeAll = (data, e) => {
        let item = JSON.parse(JSON.stringify(data));
        item.checked = e.target.checked
        item.indeterminate = false;

        this.props.replaceCombinData(item, 3)
    }

    render () {
        const { regionData } = this.props;
        let area = regionData ? regionData.area : [];

        return (
            <div className="one-level">
                {
                    area.map((item, index) => {
                        return (
                            <div key={index} className="region-row">
                                <Checkbox checked={ item.checked } indeterminate={ item.indeterminate } onChange={ this.onChangeThreeAll.bind(this, item) }></Checkbox>
                                <div className="region-name">
                                    <span>{item.name}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

// 提取二级地区
class ExtractTwoLevelRegion extends Component {
    // 拿取下级地区数据
    lowerLevelData = (data) => {
        this.props.accessTertiaryData(data)
    }

    // 监听二级勾选状态
    onChangeTwoAll = (data, e) => {
        let item = JSON.parse(JSON.stringify(data));
        item.checked = e.target.checked
        item.indeterminate = false;

        if (item.area && item.area.length) {
            item.area.forEach(m => {
                m.checked = e.target.checked
            })
        }
        
        this.props.replaceCombinData(item, 2)
    }

    render () {
        const { regionData } = this.props;
        let city = regionData ? regionData.city : [];
        
        return (
            <div className="one-level">
                {
                    city.map((item, index) => {
                        return (
                            <div key={index} className="region-row">
                                <Checkbox checked={ item.checked } indeterminate={ item.indeterminate } onChange={ this.onChangeTwoAll.bind(this, item) }></Checkbox>
                                <div className={ item.active ? "region-name active" : "region-name" } onClick={ this.lowerLevelData.bind(this, item) }>
                                    <span>{item.name}</span>
                                    <Icon type="right" />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

// 提取一级地区
class ExtractOneLevelRegion extends Component {
    // 拿取下级地区数据
    lowerLevelData = (data) => {
        this.props.getSecondaryData(data)
    }

    // 监听一级勾选状态
    onChangeOneAll = (data, e) => {
        let item = JSON.parse(JSON.stringify(data));
        item.checked = e.target.checked
        item.indeterminate = false;

        if (item.city && item.city.length) {
            item.city.forEach(d => {
                d.checked = e.target.checked

                if (d.area && d.area.length) {
                    d.area.forEach(m => {
                        m.checked = e.target.checked
                    })
                }
            })
        }
        
        this.props.replaceCombinData(item, 1)
    }

    render () {
        const { regionData } = this.props;

        return (
            <div className="one-level">
                {
                    regionData.map((item, index) => {
                        return (
                            <div key={index} className="region-row">
                                <Checkbox checked={ item.checked } indeterminate={ item.indeterminate } onChange={ this.onChangeOneAll.bind(this, item) }></Checkbox>
                                <div className={ item.active ? "region-name active" : "region-name" } onClick={ this.lowerLevelData.bind(this, item) }>
                                    <span>{item.name}</span>
                                    <Icon type="right" />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

class RegLinkage extends Component {
    state = {
        regionData: area, // 地区数据
        secondaryData: "", // 二级数据
        tertiaryData: "", // 三级数据
        selectData: [], // 选中的数据
    }

    // 添加id
    addID = (data, id) => {
        data.forEach((item, index) => {
            if (id) {
                item.id = id + '-' + index;
            } else {
                item.id = index + 1;
            }

            if (item.city && item.city.length) {
                this.addID(item.city, item.id)
            } else if (item.area && item.area.length) {
                this.addID(item.area, item.id)
            }
        })
    }

    // 获取二级数据
    getSecondaryData = (data) => {
        const { regionData } = this.state;
        let deepRegionData = JSON.parse(JSON.stringify(regionData)); // 一级数据

        deepRegionData.forEach(item => {
            if (item.id === data.id) {
                item.active = true
            } else {
                item.active = false
            }
        })

        this.setState({
            regionData: deepRegionData,
            secondaryData: data,
            tertiaryData: ""
        })
    }

    // 获取三级数据
    accessTertiaryData = (data) => {
        const { secondaryData } = this.state;
        let deepSecondaryData = JSON.parse(JSON.stringify(secondaryData)); // 二级数据

        deepSecondaryData.city.forEach(item => {
            if (item.id === data.id) {
                item.active = true
            } else {
                item.active = false
            }
        })

        this.setState({
            secondaryData: deepSecondaryData,
            tertiaryData: data
        })
    }

    // 替换合并数据
    replaceCombinData = (data, idx) => {
        const { regionData, secondaryData, tertiaryData } = this.state;
        let deepRegionData = JSON.parse(JSON.stringify(regionData)); // 一级数据
        let deepSecondaryData = JSON.parse(JSON.stringify(secondaryData)); // 二级数据
        let deepTertiaryData = JSON.parse(JSON.stringify(tertiaryData)); // 三级数据

        deepRegionData.forEach((item, cc) => {
            if (idx === 1) { // 一级更新
                if (item.id === data.id) {
                    deepRegionData[cc] = data // 一级

                    if (deepSecondaryData && String(deepSecondaryData.id).startsWith(String(data.id), 0)) { // 二级
                        this.recursiveChecked(deepSecondaryData.city, data.checked)
                    }

                    if (deepTertiaryData && String(deepTertiaryData.id).startsWith(String(data.id), 0)) { // 二级
                        this.recursiveChecked(deepTertiaryData.area, data.checked)
                    }
                }
            }           
            
            if (idx === 2) { // 二级更新
                if (item.city && item.city.length) {// 进入二级
                    let oneIndeterminate = 0; // 检测二级勾选个数判断一级选框样式

                    item.city.forEach((two, index) => {
                        if (two.id === data.id) {
                            item.city[index] = data; // 一级

                            if (deepSecondaryData) { // 二级
                                deepSecondaryData.city.forEach((upTwo, index) => {
                                    if (upTwo.id === data.id) {
                                        deepSecondaryData.city[index] = data;

                                        if (data.checked) {
                                            oneIndeterminate++
                                        }
                                    } else {
                                        if (upTwo.checked) {
                                            oneIndeterminate++
                                        }
                                    }
                                })
                            }

                            if (deepTertiaryData && String(deepTertiaryData.id).startsWith(String(data.id), 0)) { // 三级
                                this.recursiveChecked(deepTertiaryData.area, data.checked)
                            }

                            if (deepSecondaryData.city.length === oneIndeterminate) { // 判断一级选框样式
                                item.indeterminate = false
                                item.checked = true
                            } else {
                                if (oneIndeterminate > 0) {
                                    item.indeterminate = true
                                    item.checked = false
                                } else {
                                    item.indeterminate = false
                                    item.checked = false
                                }
                            }
                        }
                    })
                }
            }

            if (idx === 3) { // 三级更新
                let oneAllIndeterminate = 0;
                let oneAllChecked = 0;
                let twoIndeterminate = 0;

                if (item.city && item.city.length) {// 进入二级

                    item.city.forEach((two, index) => {
                        if (two.area && two.area.length) {// 进入三级
                            two.area.forEach((three, c) => {
                                if (three.id === data.id) {
                                    two.area[c] = data; // 一级三
                                    
                                    if (deepTertiaryData) { // 三级
                                        deepTertiaryData.area.forEach((upThree, d) => {
                                            if (upThree.id === data.id) {
                                                deepTertiaryData.area[d] = data
                                                if (data.checked) {
                                                    twoIndeterminate++
                                                }
                                            } else {
                                                if (upThree.checked) {
                                                    twoIndeterminate++
                                                }
                                            }
                                        })

                                        deepSecondaryData.city.forEach((upTwo, e) => { // 二级
                                            if (String(data.id).startsWith(String(upTwo.id), 0)) {
                                                if (deepTertiaryData.area.length === twoIndeterminate) { // 判断二级选框样式
                                                    upTwo.indeterminate = false
                                                    upTwo.checked = true
                                                } else {
                                                    if (twoIndeterminate > 0) {
                                                        upTwo.indeterminate = true
                                                        upTwo.checked = false
                                                    } else {
                                                        upTwo.indeterminate = false
                                                        upTwo.checked = false
                                                    }
                                                }

                                                if (upTwo.indeterminate) {
                                                    oneAllIndeterminate++
                                                }

                                                if (upTwo.checked) {
                                                    oneAllChecked++
                                                }
                                            } else {
                                                if (upTwo.indeterminate) {
                                                    oneAllIndeterminate++
                                                }

                                                if (upTwo.checked) {
                                                    oneAllChecked++
                                                }
                                            }

                                            // 更新二级下级的数据
                                            if (upTwo.area && upTwo.area.length) {
                                                upTwo.area.forEach((level, index) => {
                                                    if (level.id === data.id) {
                                                        upTwo.area[index] = data
                                                    }
                                                })
                                            }
                                        })
                                    }

                                    if (deepSecondaryData.city.length === oneAllChecked) { // 三级更新一级选框样式
                                        item.checked = true;
                                        item.indeterminate = false;
                                    } else {
                                        if (oneAllChecked > 0 || oneAllIndeterminate > 0) {
                                            item.checked = false;
                                            item.indeterminate = true;
                                        } else {
                                            item.checked = false;
                                            item.indeterminate = false;
                                        }
                                    }
                                }
                            })
                        }
                    })
                }

                // 一级二
                if (item.id === deepSecondaryData.id) {
                    item.city = deepSecondaryData.city;
                }
            }
        })

        this.setState({
            regionData: deepRegionData,
            secondaryData: deepSecondaryData,
            tertiaryData: deepTertiaryData
        })

        this.extractSelectedData(deepRegionData)
    }

    // 递归改变checked
    recursiveChecked = (data, active, type) => {
        data.forEach(item => {
            item.checked = active
            if (type) {
                item.indeterminate = active
            } else {
                item.indeterminate = false
            }

            if (item.city && item.city.length) {
                this.recursiveChecked(item.city, active, type)
            } else if (item.area && item.area.length) {
                this.recursiveChecked(item.area, active, type)
            }
        })
    }

    // 提取选中数据
    extractSelectedData = (data) => {
        let selectData = [];

        data.forEach(item => {
            if (item.checked) {
                selectData.push(item.name)
            } else {
                if (item.city && item.city.length) {
                    item.city.forEach(two => {
                        if (two.checked) {
                            selectData.push(two.name)
                        } else {
                            if (two.area && two.area.length) {
                                two.area.forEach(three => {
                                    if (three.checked) {
                                        selectData.push(three.name)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })

        this.setState({
            selectData
        }, () => {
            this.props.acceptLocalData(this.state.selectData)
        })
    }

    // 清空选择数据
    clearSelectData = () => {
        const { regionData, secondaryData, tertiaryData } = this.state;
        let deepRegionData = JSON.parse(JSON.stringify(regionData)); // 一级数据
        let deepSecondaryData = JSON.parse(JSON.stringify(secondaryData)); // 二级数据
        let deepTertiaryData = JSON.parse(JSON.stringify(tertiaryData)); // 三级数据

        this.recursiveChecked(deepRegionData, false, true);
        if (deepSecondaryData) {
            this.recursiveChecked(deepSecondaryData.city, false, true);
        }

        if (deepTertiaryData) {
            this.recursiveChecked(deepTertiaryData.area, false, true);
        }

        this.setState({
            selectData: [],
            regionData: deepRegionData,
            tertiaryData: deepTertiaryData,
            secondaryData: deepSecondaryData
        }, () => {
            this.props.acceptLocalData(this.state.selectData)
        })
    }

    render () {
        const { regionData, secondaryData, tertiaryData, selectData } = this.state;

        return (
            <section className="linkage-box">
                <div className="create-group">
                    <label className="name" htmlFor="name" style={{ width: 'auto' }}>已选择：</label>
                    <div className="input-group">
                        {
                            selectData.map((item, index) => {
                                return <span key={index} className="already-chosen">{item}</span>
                            })
                        }
                        <span className="already-chosen clear-chosen" onClick={ this.clearSelectData }>清空</span>
                    </div>
                </div>

                <div className="linkage-title">
                    <div className="name">省：</div>
                    <div className="name">市：</div>
                    <div className="name">区：</div>
                </div>

                <div className="linkage-content">
                    <div className="linkage-group">
                        <ExtractOneLevelRegion 
                            regionData={ regionData } 
                            getSecondaryData={ this.getSecondaryData } 
                            replaceCombinData={ this.replaceCombinData } 
                        />
                    </div>
                    <div className="linkage-group">
                        <ExtractTwoLevelRegion 
                            regionData={ secondaryData } 
                            accessTertiaryData={ this.accessTertiaryData }
                            replaceCombinData={ this.replaceCombinData } 
                        />
                    </div>
                    <div className="linkage-group">
                        <ExtractThreeLevelRegion 
                            regionData={ tertiaryData }
                            replaceCombinData={ this.replaceCombinData } 
                        />
                    </div>
                </div>
            </section> 
        )
    }
}

export default RegLinkage;
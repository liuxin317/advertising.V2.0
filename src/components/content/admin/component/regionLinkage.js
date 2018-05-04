import React, { Component } from 'react';
import area from '@/configure/area';
import { Select } from 'antd';

const Option = Select.Option;

const styles = {
  'region-linkage': {
    'display': 'flex',
    'alignItems': 'center'
  }
}

class RegionLinkage extends Component {
  state = {
    regionData: area, // 地区数据
    selectProvince: [], // 选中的省级数据
    selectCity: [], // 选中的市级数据
    selectArea: '', // 选中的区/县数据
    defaultProvince: '请选择省', // 默认的省级
    defaultCity: '请选择市', // 默认的市级
    defaultArea: '请选择区/县', // 默认的区县级
    init: '', // 默认值
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.init) {
      this.setState({
        init: nextProps.init,
        defaultProvince: Number(nextProps.init.split(',')[0])
      }, () => {
        const { defaultProvince } = this.state;
        let deepRegionData = JSON.parse(JSON.stringify(this.state.regionData));

        deepRegionData.forEach(item => {
          if (String(defaultProvince) === String(item.id)) {
            this.setState({
              selectProvince: item.city,
              defaultCity: String(nextProps.init.split(',')[1])
            }, () => {
              const { defaultCity } = this.state;
              let deepSelectProvince = JSON.parse(JSON.stringify(this.state.selectProvince));

              deepSelectProvince.forEach(d => {
                if (defaultCity === String(d.id)) {
                  this.setState({
                    selectCity: d.area,
                    defaultArea: String(nextProps.init.split(',')[2])
                  })
                }
              })
            })
          }
        })
      })
    }
  }

  // 监听省级联动
  onChangeProvince = (value, option) => {
    console.log(value)
    this.setState({
      selectProvince: option.props.item.city,
      defaultProvince: value,
      defaultCity: '请选择市',
      defaultArea: '请选择区/县',
      selectCity: []
    })

    this.props.backSelectData('')
  }

  // 监听市级联动
  onChangeCity = (value, option) => {
    const { show } = this.props;
    const { defaultProvince } = this.state;

    this.setState({
      selectCity: option.props.item.area,
      defaultCity: value,
      defaultArea: '请选择区/县',
    })

    if (show === 2) {
      this.props.backSelectData({defaultProvince, defaultCity: value})
    } else {
      this.props.backSelectData('')
    }
  }

  // 监听区/县联动
  onChangeArea = (value, option) => {
    const { defaultProvince, defaultCity } = this.state;

    this.setState({
      selectArea: option.props.item,
      defaultArea: value
    })

    this.props.backSelectData({defaultProvince, defaultCity, defaultArea: value})
  }

  render () {
    const { regionData, selectProvince, selectCity, defaultCity, defaultArea, defaultProvince } = this.state;
    const { show } = this.props;

    return (
      <section style={ styles['region-linkage'] }>
        <Select placeholder="请选择省" value={ defaultProvince } style={{ width: 200 }} onChange={this.onChangeProvince}>
          {
            regionData.map(item => {
              return <Option value={item.id} item={item} key={item.id}>{ item.name }</Option>
            })
          }
        </Select>

        <Select placeholder="请选择市" value={ defaultCity } style={{ width: 200, marginLeft: 10 }} onChange={this.onChangeCity}>
          {
            selectProvince.map(item => {
              return <Option value={item.id} item={item} key={item.id}>{ item.name }</Option>
            })
          }
        </Select>
        
        {
          show === 2
          ?
          ""
          :
          <Select placeholder="请选择区/县" value={ defaultArea } style={{ width: 200, marginLeft: 10 }} onChange={this.onChangeArea}>
            {
              selectCity.map(item => {
                return <Option value={item.id} item={item} key={item.id}>{ item.name }</Option>
              })
            }
          </Select>
        }
      </section>
    )
  }
}

export default RegionLinkage;
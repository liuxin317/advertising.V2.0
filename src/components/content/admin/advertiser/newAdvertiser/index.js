import React, { Component } from 'react';
import { Icon, Input, InputNumber, Select } from 'antd';
import { Link } from 'react-router-dom';
import './style.scss';

const Option = Select.Option;

const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

class NewAdvertiser extends Component {
    state = {
        cities: cityData[provinceData[0]],
        secondCity: cityData[provinceData[0]][0],
    }

    handleProvinceChange = (value) => {
        this.setState({
            cities: cityData[value],
            secondCity: cityData[value][0],
        });
    }

    onSecondCityChange = (value) => {
        this.setState({
            secondCity: value,
        });
    }

    render () {
        const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
        const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);

        return (
            <section className="new-edit__box">
                <h4 className="cloumn-name"><Link to="/content/admin/advertiser"><Icon type="left" /> 新建广告主</Link></h4> 

                <div className="cloumn-group">
                    <h6 className="title">企业信息</h6>

                    <div className="input-group">
                        <label className="name"><em>*</em> 企业名称：</label>
                        <div className="main">
                            <Input />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 营业执照编码：</label>
                        <div className="main">
                            <InputNumber min={0} onChange={null} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 营业执照注册地：</label>
                        <div className="main">
                            <Select defaultValue={provinceData[0]} style={{ width: 150 }} onChange={this.handleProvinceChange}>
                                {provinceOptions}
                            </Select>
                            <Select value={this.state.secondCity} style={{ width: 150, marginLeft: 10 }} onChange={this.onSecondCityChange}>
                                {cityOptions}
                            </Select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 营业执照/企业资质证明：</label>
                        <div className="main">
                            <InputNumber min={0} onChange={null} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default NewAdvertiser;
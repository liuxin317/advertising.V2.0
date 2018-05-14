import React, { Component } from 'react';
import { Icon, Input, InputNumber, Select, Button, message } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import HttpRequest from '@/utils/fetch';
import './style.scss';

// 地区联动组件
import RegionLinkage from '../../component/regionLinkage';

// 上传组件
import PicturesWall from '../../component/picturesWall';

const { TextArea } = Input;
const Option = Select.Option;

class NewAdvertiser extends Component {
    state = {
        cName: '', // 企业名称
        cNum: '', // 企业编码
        cAddress: '', // 企业执照注册地址
        cImg: '', // 企业执照
        network: '', // 企业官网
        icp: '', // icp备案
        text: '', // 行业描述
        aptitude: '', // 行业资质
        adAptitude: '', //广告资质
        bd: '', // BD
        bdPhone: '', // bd电话
        address: '', // 联系地址
        detailedAddress: '', // 详细地址
        industry: '', // 行业
        name: '', // AM名称
        phone: '', // AM电话
        industryOneList: [], // 行业数据
        industryOneId: '请选择行业类别', // 行业一级ID
        industryTwoList: [], // 行业二级数据
        industryTwoId: '请选择行业', // 行业二级ID
        AMList: [], // AM列表
        AMPhoneList: [], // AM电话列表
        isNowEdit: 1, // 是否是新建或者编辑页面（1、新建，2编辑）
        redirect: false, // 跳转状态
        editPassImgNum: 0, // 编辑初始传入已上传图片标志
    }

    componentDidMount() {
        const { match } = this.props;

        this.getQueryIndustrys()
        this.getQueryAms()

        if (match.params) {
            let isNowEdit = '';

            if (match.params.state !== 'new') { // 编辑页面
                this.getQueryUser()
                isNowEdit = 2
            } else {
                isNowEdit = 1
            }

            this.setState({
                isNowEdit
            })
        }
    }

    // 接受地区联动返回的数据
    backSelectData = (ids) => {
        let address = '';

        if (ids) {
            let arr = [];

            for (let val in ids) {
                arr.push(ids[val])
            }

            address = arr.join(',')
        } else {
            address = ''
        }

        console.log(address)

        this.setState({
            address
        })
    }

    // 接受企业执照注册地址返回的数据
    backSelectDataCAddress = (ids) => {
        let cAddress = '';

        if (ids) {
            let arr = [];

            for (let val in ids) {
                arr.push(ids[val])
            }

            cAddress = arr.join(',')
        } else {
            cAddress = ''
        }

        console.log(cAddress)

        this.setState({
            cAddress
        })
    }

    // 上传营业执照返回的成功的数据
    backUploadDataICP = (data) => {
        let icp = '';

        if (data && data.length) {
            let url = [];
            data.forEach(item => {
                let d = item.response.data;
                url.push(d)
            })

            icp = url.join(',')
        } else {
            icp = ''
        }

        console.log(icp)

        this.setState({
            icp
        })
    }

    // 上传ICP备案返回的成功的数据
    backUploadDataCImg = (data) => {
        let cImg = '';

        if (data && data.length) {
            let url = [];
            data.forEach(item => {
                let d = item.response.data;
                url.push(d)
            })

            cImg = url.join(',')
        } else {
            cImg = ''
        }

        console.log(cImg)

        this.setState({
            cImg
        })
    }
    
    // 上传行业资质返回的成功的数据
    backUploadDataAptitude = (data) => {
        let aptitude = '';

        if (data && data.length) {
            let url = [];
            data.forEach(item => {
                let d = item.response.data;
                url.push(d)
            })

            aptitude = url.join(',')
        } else {
            aptitude = ''
        }

        console.log(aptitude)

        this.setState({
            aptitude
        })
    }

    // 上传广告资质返回的成功的数据
    backUploadDataAdAptitude = (data) => {
        let adAptitude = '';

        if (data && data.length) {
            let url = [];
            data.forEach(item => {
                let d = item.response.data;
                url.push(d)
            })

            adAptitude = url.join(',')
        } else {
            adAptitude = ''
        }

        console.log(adAptitude)

        this.setState({
            adAptitude
        })
    }

    // 监听输入框
    onChangeInput = (name, e) => {
        let obj = {};
        obj[name] = e.target.value.trim()

        this.setState({
            ...obj
        })
    }

    // 监听数字输入框
    onChangeInputNumber = (name, value) => {
        let obj = {};
        obj[name] = value
        console.log(name, value)

        this.setState({
            ...obj
        })
    }

    // 确认新建/修改
    confirmNew = () => {
        const { cName, cNum, cAddress, cImg, network, icp, text, aptitude, adAptitude, address, detailedAddress, bd, bdPhone, industry, name, phone } = this.state;

        if (!cName) {
            message.warning('请填写企业名称！')
        } else if (!cNum) {
            message.warning('请填写营业执照编号！')
        } else if (!cAddress) {
            message.warning('请选择营业执照注册地！')
        } else if (!cImg) {
            message.warning('请上传营业执照/企业资质证明！')
        } else if (!network) {
            message.warning('请填写公司官网！')
        } else if (!icp) {
            message.warning('请上传官方ICP备案！')
        } else if (!industry) {
            message.warning('请选择行业！')
        } else if (!text) {
            message.warning('请填写品牌描述/推广内容！')
        } else if (!address) {
            message.warning('请选择联系地址！')
        } else if (!detailedAddress) {
            message.warning('请填写详细地址！')
        } else {
            let obj = { cName, cNum, cAddress, cImg, network, icp, text, aptitude, adAptitude, address: address + ',' + detailedAddress, bd, bdPhone, industry, name, phone };
            if (this.state.isNowEdit !== 1) {
                obj.id = this.props.match.params.state
            }
            this.addEditUser(obj)
        }
    }

    // 新建编辑接口
    addEditUser = (data) => {
        const { isNowEdit } = this.state;
        let str = isNowEdit === 1 ? 'addUser' : 'updateUser';

        HttpRequest(`/sys/${str}`, "POST", {
            userJson: JSON.stringify(data)
        }, res => {
            message.success(`${isNowEdit === 1 ? '创建成功！' : '保存成功！'}`);

            setTimeout(() => {
                this.setState({
                    redirect: true
                })
            }, 1000)
        })
    }

    // 行业接口
    getQueryIndustrys = () => {
        HttpRequest("/sys/queryIndustrys", "POST", {}, res => {
            this.setState({
                industryOneList: res.data
            })
        })
    }

    // 监听slelect
    onChangeSlelected = (value, option) => {
        let item = option.props.item;

        this.setState({
            industryOneId: value,
            industryTwoList: JSON.parse(item.json).cList,
            industryTwoId: '请选择行业',
            industry: ''
        })
    }

    // 监听二级select
    onChangeSlelectedTwo = (value) => {
        this.setState({
            industryTwoId: value,
            industry: `${this.state.industryOneId},${value}`
        })
    }

    // 获取AM和AM电话接口
    getQueryAms = () => {
        HttpRequest("/sys/queryAms", "POST", {}, res => {
            this.setState({
                AMList: res.data,
                AMPhoneList: res.data[0].phones,
                name: res.data[0].name,
                phone: res.data[0].phones[0]
            })
        })
    }

    // 监听AM下拉
    onSelectedAM = (value, option) => {
        let item = option.props.item;
        this.setState({
            name: item.name,
            AMPhoneList: item.phones,
            phone: item.phones[0]
        })
    }

    // 监听AMPhone下拉
    onSelectedAMPhone = (value) => {
        this.setState({
            phone: value
        })
    }

    // 编辑界面查询信息接口
    getQueryUser = () => {
        const { match } = this.props;

        HttpRequest("/sys/queryUser", "POST", {
            id: match.params.state
        }, res => {
            let data = res.data;

            this.setState({
                cName: data.cName,
                cNum: data.cNum,
                cAddress: data.cAddress,
                cImg: data.cImg,
                network: data.network,
                icp: data.icp,
                industry: data.industry,
                text: data.text,
                aptitude: data.aptitude,
                adAptitude: data.adAptitude,
                name: data.name,
                phone: data.phone,
                address: data.address,
                bd: data.bd,
                bdPhone: data.bdPhone,
                detailedAddress: data.address.split(',')[3],
                industryOneId: data.industry.split(',')[0],
            }, () => {
                const { industryOneId, AMList, name } = this.state;
                let deepIndustryOneList = JSON.parse(JSON.stringify(this.state.industryOneList));

                deepIndustryOneList.forEach(item => {
                    let jos = JSON.parse(item.json);
                    
                    if (String(jos.no) === String(industryOneId)) {
                        this.setState({
                            industryTwoList: jos.cList,
                            industryTwoId: data.industry.split(',')[1]
                        })
                    }
                })

                AMList.forEach(item => {
                    if (name === item.name) {
                        this.setState({
                            AMPhoneList: item.phones
                        })
                    }
                })

                this.setState({
                    editPassImgNum: 1
                })
            })
        })
    }

    render () {
        const { industryOneList, industryTwoList, industryOneId, industryTwoId, AMList, AMPhoneList, phone, name, cName, icp, cNum, aptitude, adAptitude, cAddress, address, network, text, bd, bdPhone, detailedAddress, cImg, isNowEdit, redirect, editPassImgNum } = this.state;
        
        if (redirect) {
            return <Redirect pudh to="/content/admin/advertiser" />
        }

        return (
            <section className="new-edit__box">
                <h4 className="cloumn-name"><Link to="/content/admin/advertiser"><Icon type="left" /> { isNowEdit === 1 ? '新建广告主' : '编辑广告主' }</Link></h4> 

                {/* 企业信息 */}
                <div className="cloumn-group">
                    <h6 className="title">企业信息</h6>

                    <div className="input-group">
                        <label className="name"><em>*</em> 企业名称：</label>
                        <div className="main">
                            <Input value={ cName } onChange={ this.onChangeInput.bind(this, 'cName') } />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 营业执照编码：</label>
                        <div className="main">
                            <Input value={ cNum } onChange={this.onChangeInput.bind(this, 'cNum')} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 营业执照注册地：</label>
                        <div className="main">
                            <RegionLinkage init={ cAddress } show={ 2 } backSelectData={ this.backSelectDataCAddress } />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 营业执照/企业资质证明：</label>
                        <div className="main">
                            <PicturesWall init={ isNowEdit === 1 ? '' : editPassImgNum === 0 ? cImg : '' } type={4} backUploadData={ this.backUploadDataCImg } />
                        </div>
                    </div>
                </div>

                {/* 运营信息 */}
                <div className="cloumn-group">
                    <h6 className="title">运营信息</h6>

                    <div className="input-group">
                        <label className="name"><em>*</em> 公司官网：</label>
                        <div className="main">
                            <Input value={ network } onChange={ this.onChangeInput.bind(this, 'network') } />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 官方ICP备案：</label>
                        <div className="main">
                            <PicturesWall init={ isNowEdit === 1 ? '' : editPassImgNum === 0 ? icp : '' } type={5} backUploadData={ this.backUploadDataICP } />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 行业：</label>
                        <div className="main">
                            <Select placeholder="请选行业类型" value={industryOneId} onChange={this.onChangeSlelected} style={{ width: 200 }}>
                                {
                                    industryOneList.map((item, index) => {
                                        let handleItem = JSON.parse(item.json)
                                        return <Option item={item} value={handleItem.no} key={index}>{handleItem.name}</Option>
                                    })
                                }
                            </Select>

                            <Select placeholder="请选行业" value={industryTwoId} onChange={this.onChangeSlelectedTwo} style={{ width: 200, marginLeft: 10 }}>
                                {
                                    industryTwoList.map((item, index) => {
                                        return <Option value={item.no} key={index}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 品牌描述/推广内容：</label>
                        <div className="main">
                            <TextArea value={ text } onChange={this.onChangeInput.bind(this, 'text')} rows={4} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name">行业资质：</label>
                        <div className="main">
                            <PicturesWall init={ isNowEdit === 1 ? '' : editPassImgNum === 0 ? aptitude : '' } type={6} backUploadData={ this.backUploadDataAptitude } />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name">广告资质：</label>
                        <div className="main">
                            <PicturesWall init={ isNowEdit === 1 ? '' : editPassImgNum === 0 ? adAptitude : '' } type={7} backUploadData={ this.backUploadDataAdAptitude } />
                        </div>
                    </div>
                </div>

                {/* 联系信息 */}
                <div className="cloumn-group">
                    <h6 className="title">联系信息</h6>

                    <div className="input-group">
                        <label className="name"><em>*</em> AM：</label>
                        <div className="main">
                            <Select style={{ width: 200 }} value={name} onChange={this.onSelectedAM}>
                                {
                                    AMList.map(item => {
                                        return <Option item={item} value={item.id} key={item.id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> AM联系电话：</label>
                        <div className="main">
                            <Select value={phone} style={{ width: 200 }} onChange={this.onSelectedAMPhone}>
                                {
                                    AMPhoneList.map((item, index) => {
                                        return <Option value={item} key={index}>{item}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name"><em>*</em> 联系地址：</label>
                        <div className="main">
                            <RegionLinkage init={ address } backSelectData={ this.backSelectData } />
                            <TextArea value={ detailedAddress } onChange={this.onChangeInput.bind(this, 'detailedAddress')} rows={4} style={{ marginTop: 10 }} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name">负责BD：</label>
                        <div className="main">
                            <Input value={ bd } onChange={this.onChangeInput.bind(this, 'bd')} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="name">负责BD手机：</label>
                        <div className="main">
                            <InputNumber value={ bdPhone } min={0} onChange={this.onChangeInputNumber.bind(this, 'bdPhone')} />
                        </div>
                    </div>
                </div>

                {/* 按钮 */}
                <div className="btn-group">
                    <Button type="primary" onClick={ this.confirmNew }>确认</Button>
                    <Link to="/content/admin/advertiser"><Button style={{ marginLeft: 60 }}>取消</Button></Link>
                </div>
            </section>
        )
    }
}

export default NewAdvertiser;
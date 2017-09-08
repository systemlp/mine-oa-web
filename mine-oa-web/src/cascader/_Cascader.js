import React, {Component} from 'react';
import {Cascader, Button} from 'antd';

const region = [
    {
        value: '310000',
        label: '上海市',
        children: [
            {
                value: '310100',
                label: '上海市',
                children: [
                    {
                        value: '310101',
                        label: '黄浦区'
                    }, {
                        value: '310104',
                        label: '徐汇区'
                    }
                ]
            }
        ]
    }, {
        value: '320000',
        label: '江苏省',
        children: [
            {
                value: '320100',
                label: '南京市',
                children: [
                    {
                        value: '320101',
                        label: '市辖区',
                        disabled: true
                    }, {
                        value: '320102',
                        label: '玄武区'
                    }
                ]
            }
        ]
    }
];

const _region = [
    {
        value: '310000',
        label: '上海市',
        isLeaf: false
    }, {
        value: '320000',
        label: '江苏省',
        isLeaf: false
    }
];

const size = ['large', 'default', 'small'];

export default class _Cascader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRegion: '还没选择地址哦',
            _region
        };
    }
    render() {
        return (
            <div>
                <h1>级联选择</h1>
                <dl>
                    <dt>
                        <h2>基本，选择即改变，支持搜索</h2>
                    </dt>
                    <dd>
                        <Cascader options={region} onChange={(value) => console.log(value)} changeOnSelect showSearch placeholder="请选择所在地"/>
                    </dd>
                    <dt>
                        <h2>默认值</h2>
                    </dt>
                    <dd>
                        <Cascader options={region} defaultValue={['310000', '310100', '310101']} onChange={(value) => console.log(value)} placeholder="请选择所在地"/>
                    </dd>
                    <dt>
                        <h2>自定义</h2>
                    </dt>
                    <dd>
                        {this.state.selectedRegion}
                        <Cascader options={region} onChange={(value, selectedOptions) => this.setState({
                            selectedRegion: selectedOptions.map(o => o.label).join(', ')
                        })}>
                            <Button>请选择所在地</Button>
                        </Cascader>
                    </dd>
                    <dt>
                        <h2>悬停显示下一级,自定义选中后显示文本</h2>
                    </dt>
                    <dd>
                        <Cascader size={`${size[2]}`} options={region} expandTrigger='hover' displayRender={(label, selectedOptions) => label[label.length - 1]} placeholder="请选择所在地"/>
                    </dd>
                    <dt>
                        <h2>动态加载子集</h2>
                    </dt>
                    <dd>
                        <Cascader options={this.state._region} loadData={(selectedOptions)=>{
                          const curOption = selectedOptions[selectedOptions.length - 1];
                          curOption.loading = true;
                          setTimeout(() => {
                              curOption.loading = false;
                              curOption.children = [
                                  {
                                      label: `${curOption.label} Dynamic 1`,
                                      value: '动态获取的值'
                                  }
                              ];
                              this.setState({
                                  _region: [...this.state._region]
                              });
                          }, 600);
                        }} changeOnSelect placeholder="请选择所在地"/>
                    </dd>
                </dl>
            </div>
        )
    }
}

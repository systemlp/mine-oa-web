import React, {Component} from 'react';
import {Button, Affix} from 'antd';

class _Affix extends Component {
    render() {
        return (
            <div style={{
                height: 960
            }}>
                <h1>固钉</h1>
                <dl>
                    <dt>
                        <h2>距页面顶部固定</h2>
                        <h3>原理：监听target（默认window）滚动，距顶部距离达到offsetTop后，使用fix绝对定位</h3>
                    </dt>
                    <dd>
                        <Affix offsetTop={100} onChange={(affixed) => console.log(affixed?'定住了':'还原了')}>
                            <Button>我可以固定在页面上哦</Button>
                        </Affix>
                    </dd>
                    <dt>
                        <h2>距页面底部固定</h2>
                        <h3>原理：监听target（默认window）滚动，距底部距离达到offsetBottom后，使用fix绝对定位</h3>
                    </dt>
                    <dd>
                        <Affix offsetBottom={100}>
                            <Button>我可以固定在页面上哦</Button>
                        </Affix>
                    </dd>
                    <dt>
                        <h2>相对容器固定</h2>
                        <h3>原理：监听target（默认window）滚动，距顶部距离达到offsetTob后，使用fix绝对定位</h3>
                    </dt>
                    <dd>
                        <div ref="affixContnet" style={{
                            height: 150,
                            overflow: 'auto',
                            background: '#ccc'
                        }}>
                            <div style={{
                                height: 200,
                                paddingTop: 30
                            }}>
                                <Affix target={() => this.refs.affixContnet}>
                                    <Button>我可以固定在页面上哦</Button>
                                </Affix>
                            </div>
                        </div>

                    </dd>
                </dl>
            </div>
        )
    }
}
export default _Affix;

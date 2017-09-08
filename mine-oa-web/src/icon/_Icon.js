import React, {Component} from 'react';
import {Icon} from 'antd';

export default class _Icon extends Component {
    render() {
        return (
            <div>
                <h1>图标</h1>
                <dl>
                    <dt>
                        详情请参考<a href="https://ant.design/components/icon-cn/" target="_blank">antd图标</a>
                    </dt>
                    <dd>
                        <Icon type="apple" style={{
                            fontSize: 18
                        }}/>&nbsp;
                        <Icon type="chrome" spin/>
                    </dd>
                </dl>
            </div>
        )
    }
}

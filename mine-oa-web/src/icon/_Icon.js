import React, {Component} from 'react';
import {Icon} from 'antd';
import { Picker, Emoji  } from 'emoji-mart';

export default class _Icon extends Component {
  state = {
    emoji: ':disappointed:'
  };
  render() {
    return (
      <div>
        <h1>图标</h1>
        <textarea defaultValue={this.state.emoji} />
        <Picker
          set='emojione'
          title=''
          onClick={ (emoji, event) => {
            this.setState({emoji:emoji.colons})
          }}/>
        <dl>
          <dt>
            详情请参考<a href="http://design.alipay.com/develop/web/components/icon/" target="_blank" rel="noopener noreferrer">antd图标</a>
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

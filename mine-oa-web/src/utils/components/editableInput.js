import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Input, Select} from 'antd';

const Option = Select.Option;

export class EditableInput extends Component {
  render() {
    const {value, editable, onChange} = this.props;
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => {
                  const newValue = e.target.value.trim();
                  this.props.onChange(value:newValue);
                }}
              />
            </div>
            :
            <div>
              {value.toString() || ''}
            </div>
        }
      </div>
    );
  }
}

export class EditableSelect extends Component {
  render() {
    const {obj, editable, data} = this.props;
    return (
      <div>
        {
          editable ?
            <div>
              <Select className="width-per-100" defaultValue={obj.value} onChange={(value) => {
                this.props.onChange(value.split('_'));
              }}>
                {data.map((item) => {
                  <Option value={`${item.value}_${item.text}`}>{item.text}</Option>
                })}
              </Select>
            </div>
            :
            <div>
              {obj.text || ''}
            </div>
        }
      </div>
    );
  }
}

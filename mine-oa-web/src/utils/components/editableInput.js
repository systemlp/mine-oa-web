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
                  onChange(newValue);
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
    const {data, editable, dataSource, allowClear} = this.props;
    return (
      <div>
        {
          editable ?
            <div>
              <Select className="width-per-100" value={data.value?`${data.value}_${data.text}`:null} allowClear={allowClear} onChange={(value) => {
                this.props.onChange(value? value.split('_') : undefined);
              }}>
                {dataSource.map((item) => {
                  return <Option key={`${item.value}_${item.text}`} value={`${item.value}_${item.text}`}>{item.text}</Option>
                })}
              </Select>
            </div>
            :
            <div>
              {data.text || ''}
            </div>
        }
      </div>
    );
  }
}

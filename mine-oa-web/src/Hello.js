import React, {Component} from 'react'

class Hello extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'Alice'
        }
    }
    componentWillMount() {
        console.log('componentWillMount -> Hello组件渲染前')
    }
    componentDidMount() {
        console.log('componentDidMount -> Hello组件第一次渲染后')
    }
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps -> Hello组件更新props')
    }
    componentWillUpdate() {
        console.log('componentWillUpdate -> Hello组件更新前')
    }
    componentDidUpdate() {
        console.log('componentDidUpdate  -> Hello组件更新后')
    }
    shouldComponentUpdate() {
        console.log('shouldComponentUpdate -> return true执行渲染，false禁止重新渲染')
        return true
    }
    changeName = () => {
        let state = this.state
        state.name = this.state.name === 'Alice'
            ? 'Lucy'
            : 'Alice'
        this.setState(state)
    }
    render() {
        return <div>
            <p>{this.props.desc}</p>
            <h1>
                <span onClick={this.changeName}>Hello {this.state.name}!</span>
            </h1>
        </div>
    }
}

export default Hello

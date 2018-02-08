import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducer';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import App from './App';
import Home from './home/Home';
import _Button from './button/_Button';
import _Icon from './icon/_Icon';
import _Grid from './grid/_Grid';
import _Affix from './affix/_Affix';
import _Cascader from './cascader/_Cascader';
import Hello from './Hello';
import ECharts from './echarts/ECharts';
import Login from './login/components/Login';
import UserData from './user/components/userData';
import Dept from './organization/dept/components/dept';
import Position from './organization/position/components/position';
import Employee from './organization/employee/components/employee';
import Menu from './organization/menu/components/menu';
import Role from './organization/role/components/role';
// import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers);

render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/login" component={Login}/>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="org">
                  <Route path="dept" component={Dept}/>
                  <Route path="position" component={Position}/>
                  <Route path="employee" component={Employee}/>
                  <Route path="menu" component={Menu}/>
                  <Route path="role" component={Role}/>
                </Route>
                <Route path="echarts" component={ECharts}/>
                <Route path="button" component={_Button}/>
                <Route path="icon" component={_Icon}/>
                <Route path="grid" component={_Grid}/>
                <Route path="affix" component={_Affix}/>
                <Route path="cascader" component={_Cascader}/>
                <Route path="Hello" component={Hello}/>
                <Route path="userData" component={UserData}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('root'));
// registerServiceWorker();

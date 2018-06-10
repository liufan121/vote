
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
//投票主页
import Index from './main'
import './Adaptive'


ReactDOM.render(
  <BrowserRouter>
      <div>
        <Switch>
          <Route path='/' component={Index} />
        </Switch>
      </div>
  </BrowserRouter>,
  document.getElementById('root')
);

// import logo from './logo.svg';
import './App.css';
// App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Booths from './components/Booths';
import Payments from './components/Payments';
import Notifications from './components/Notifications';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/booths" component={Booths} />
        <Route path="/payments" component={Payments} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;

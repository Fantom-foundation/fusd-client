import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from '../Header';
import Home from '../../pages/Home'
import Connect from '../../pages/Connect'

import './style.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/connect">
            <Connect />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

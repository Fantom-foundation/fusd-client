import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from '../../pages/Home'
import Connect from '../../pages/Connect'
import Account from '../../pages/Account'
import Vault from '../../pages/Vault'

import './style.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/connect">
            <Connect />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/vault">
            <Vault />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;

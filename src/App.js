import './App.css';
import './firebase';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

import Home from './pages/Home'
import Bargen from './pages/BarcodeGenerator'
import Barscan from './pages/BarcodeScanner'
import MonthEndBarscan from './pages/monthEndScanner'
import Announcements from './pages/announcements';


function App() {
  return (
    <div>      
        <Router>
          <div>
            <Switch>
              <Route exact path="/">
                <Home/>
              </Route>
              <Route path="/barcode_generator">
                <Bargen/>
              </Route>
              <Route path="/barcode_scanner">
                <Barscan/>
              </Route>
              <Route path="/monthend_barcode_scanner">
                <MonthEndBarscan/>
              </Route>
              <Route path="/announcements">
                <Announcements/>
              </Route>
            </Switch>
          </div>
        </Router>

      </div>
    // </div>
  );
}

export default App;

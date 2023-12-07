import Home from './Components/Home/Home';
import app from '@feathersjs/feathers'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login feathers={app}/>}/>
          <Route path='/home/*' element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

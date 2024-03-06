import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import About from './components/About'
import Header from './components/Header'
import MyContainer from './components/MyContainer';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<><Header /> <MyContainer /></>} />
          <Route path="/about" element={<><Header /> <About /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

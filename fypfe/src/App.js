import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './components/Home/Homepage.js';
import Aboutpage from './components/About/Aboutpage';
import Testpage from './components/Testing/Testpage';
function App() {
  return (
    <>
    <div className="App">
      <Routes>
        <Route path="/" element={ <Homepage/> } />
        <Route path="about" element={ <Aboutpage/> } />
        <Route path="test" element={ <Testpage/> } />
      </Routes>
    </div>      
    </>
    // <div className="App">
    //   <Homepage/>
    // </div>
  );
}

export default App;

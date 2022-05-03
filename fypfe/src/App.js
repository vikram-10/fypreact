import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './components/Home/Homepage.js';
import Aboutpage from './components/About/Aboutpage';
import Testpage from './components/Testing/Testpage';
import Registerpage from './components/Register/Registerpage';
import Dashboard from './components/Dashboard/Dashboardpage';
import ProtectedRoute from './components/Items/ProtectedRoute';
import SendImage from './components/Sendimage/SendImage';
import RecieveImage from './components/RecieveImage/RecieveImage';
import Requests from './components/Requests/Requests';



function App() {
  return (
    <>
    <div className="App">
      <Routes>
        <Route path="/" element={ <Homepage/> } />
        <Route path="about" element={ <Aboutpage/> } />
        <Route path="test" element={ <Testpage/> } />
        <Route path="/register" element={ <Registerpage/> } />
        <Route path='/dashboard' element={ <Dashboard/> } />
        <Route path='dashboard/requests' element={ <Requests/> } />
        <Route path='dashboard/send-image' element={ <SendImage/> } />
        <Route path='dashboard/recieved-images' element={ <RecieveImage/> } />
        {/* <ProtectedRoute path="/dashboard" component={Dashboard} auth={false}/> */}
      </Routes>
    </div>      
    </>
    // <div className="App">
    //   <Homepage/>
    // </div>
  );
}

export default App;

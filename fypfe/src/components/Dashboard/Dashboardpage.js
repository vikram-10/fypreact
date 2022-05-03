import './Dashboardpage.css';
import Drawer from '../Items/Drawer';
import HeaderBar from '../Home/HeaderBar';
import {Routes, Route} from 'react-router-dom';
import SendImage from '../Sendimage/SendImage';

function Registerpage(){
return(
        <>
<Drawer/>
<Routes>
<Route path='/send-image' element={ <SendImage/> } />
</Routes>
        </>
    )
}

export default Registerpage
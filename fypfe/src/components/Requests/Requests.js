import './requests.css';
import Drawer from '../Items/Drawer';
import Requeststable from './Requeststable';

export default function Requests(){
    return(
        <>
        <Drawer/>
        <div className='dataTableSizer'>
        <Requeststable/>
        </div>
        </>
    )
}

import './recieveimage.css';
import Drawer from '../Items/Drawer';
import RecievedImagetable from './RecievedImagetable';

export default function RecieveImage(){
    return(
        <>
        <Drawer/>
        <div className='dataTableSizer'>
        <RecievedImagetable/>
        </div>
        </>
    )
}

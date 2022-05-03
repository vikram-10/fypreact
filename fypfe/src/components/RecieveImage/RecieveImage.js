import './recieveimage.css';
import Drawer from '../Items/Drawer';
import DataTable from '../Items/Datatable';

export default function RecieveImage(){
    return(
        <>
        <Drawer/>
        <div className='dataTableSizer'>
        <DataTable/>
        </div>
        </>
    )
}

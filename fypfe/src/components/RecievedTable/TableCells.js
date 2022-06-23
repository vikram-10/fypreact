import Drawer from '../Items/Drawer';
import axios from 'axios';
import { requirePropFactory } from '@mui/material';
import * as tf from "@tensorflow/tfjs";
import DashboardHeader from '../DashboardHeader/Dashboardheader';
import IPFSInboxContract from "../Sendimage/IPFSInbox.json";
import getWeb3 from "../Sendimage/getWeb3";
import truffleContract from "truffle-contract";


export default function TableCells(props){



    return(
        <>
                     <tr>
                    <th scope="row">{props.count}</th>
                    <td>{props.fromA}</td>
                    <td>{props.filehash}</td>
                    </tr>
        </>
    )
}


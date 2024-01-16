import React, {useEffect, useState} from 'react';
import {Button, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import alarmsApiService from "../../services/alarmsApiServices";
import AddAlarm from "./addAlarm";

interface TableRowData {
    id: number;
    time: string;
    days: string;
    description: string;
    active: boolean;
}

const ListAlarm: React.FC = () => {
    const [dataAlarms, setDataAlarms]= useState<TableRowData[]>([])
    const [modalVisible, setModalVisible]= useState<boolean>(false)

    useEffect(() => {
        getAllAlarms()
    }, []);

    const getAllAlarms =()=>{
        alarmsApiService.getAlarms({}).then(result=>{
            console.log('result', result)
            setDataAlarms(result?.data?.alarms)
        })
    }
    return (
        <div>
            {modalVisible && <AddAlarm modalAdd={modalVisible} setModal={setModalVisible}/>}
        <TableContainer>
            <Button variant="contained" onClick={()=>setModalVisible(!modalVisible)}>Ajouter Alarm</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Days</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataAlarms.map((row:TableRowData) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.days}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={row.active}
                                    //onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                {row.active}</TableCell>
                            <TableCell>
                                {/*<Button variant="contained" onClick={() => handleClick(row.id)}>Click me</Button>*/}
                                {/*<Button variant="contained" onClick={() => handleClick(row.id)}>Click me</Button>*/}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
}

export default ListAlarm;

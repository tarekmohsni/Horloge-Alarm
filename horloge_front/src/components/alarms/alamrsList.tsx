import React, {useEffect, useState} from 'react';
import {Button, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import alarmsApiService from "../../services/alarmsApiServices";
import AddAlarm from "./addAlarm";
import {daysString} from "../../helpers/stringHelpers";

interface TableRowData {
    id: number;
    time: string;
    days: string[];
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

    const handleSwitchChange = (id: number) => {
        // Effectuez l'appel API pour mettre à jour le statut actif de l'alarme avec l'ID spécifié
        const updatedDataAlarms = [...dataAlarms];
        const alarmToUpdate = updatedDataAlarms.find((alarm) => alarm.id === id);
        if (alarmToUpdate) {
            // Inverser le statut localement
            const status = !alarmToUpdate.active;
            alarmToUpdate.active = status;
            alarmsApiService.updateAlarmStatus(id, status)
                .then((result) => {
                    console.log('result', result);
                    setDataAlarms(updatedDataAlarms);
                })
                .catch((error) => {
                    alarmToUpdate.active = !alarmToUpdate.active;
                    setDataAlarms(updatedDataAlarms);
                    console.error('Error updating alarm status:', error);
                });
        }
    };

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
                            <TableCell>{daysString(row.days)}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={row.active}
                                    onChange={() => handleSwitchChange(row.id)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                {row.active ? 'Active' : 'Inactive'}</TableCell>
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

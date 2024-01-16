import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import alarmsApiService from "../../services/alarmsApiServices";
import AddAlarm from "./addAlarm";
import {daysString} from "../../helpers/stringHelpers";
import '../../styles/style.css'
import dayjs from "dayjs";

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
    const [modalDelete, setModalDelete]= useState<boolean>(false)
    const [alarmIDToDelete, setAlarmIDToDelete]= useState<number>(0)

    useEffect(() => {

        getAllAlarms()
    }, []);

    useEffect(() => {

        const intervalId = scheduleNextMinute();

        // Nettoyer le planificateur à la sortie du composant
        return () => {
            clearTimeout(intervalId);
        };
    }, [dataAlarms]);

    const checkAlarmTimes = () => {
        dataAlarms
            .filter((row) => row.active) // Filtrer uniquement les alarmes actives
            .forEach((row) => {
                if (isAlarmTime(row.time, row.days)) {
                    console.log('Time', row.time);
                    showNotification(row.description);
                }
            });
    };

    const scheduleNextMinute = () => {
        const now = dayjs();
        const nextMinute = now.add(1, 'minute').startOf('minute');
        const timeUntilNextMinute = nextMinute.diff(now);

        return setTimeout(() => {
            checkAlarmTimes();
            scheduleNextMinute();
        }, timeUntilNextMinute);
    };

    const showNotification = (alarmDescription: string) => {
        if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification(`Alarm: ${alarmDescription}`, {
                        body: 'It\'s time for your alarm!',
                    });
                }
            });
        }
    };

    const isAlarmTime = (alarmTime: string, days: string[]) => {
        const currentTime = dayjs();
        const day = currentTime.format('dddd');
        const formattedTime = currentTime.format('HH:mm');
        const isDay=days.includes(day)
        console.log('isDay', isDay)
        console.log('currentTime', formattedTime)
         console.log(alarmTime === formattedTime)
         return isDay && alarmTime === formattedTime ;
    };

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

    const handleEditAlarm =()=>{

    }

    const handleDeleteAlarm =(alarm_id:number)=>{
        setModalDelete(!modalDelete);
        setAlarmIDToDelete(alarm_id)
    }

    const deleteAlarm=()=>{
        alarmsApiService.deleteAlarm(alarmIDToDelete).then(result=>{

        })
    }

    return (
        <div>
            {modalVisible && <AddAlarm modalAdd={modalVisible} setModal={setModalVisible}/>}
            {modalDelete && <Dialog
                open={modalDelete}
                keepMounted
                onClose={()=>setModalDelete(!modalDelete)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setModalDelete(!modalDelete)}>Cancel</Button>
                    <Button onClick={deleteAlarm}>Delete</Button>
                </DialogActions>
            </Dialog>}
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
                                <Button className="ms-2" variant="contained" onClick={() => handleEditAlarm()}>Edit</Button>
                                <Button className="ms-2" variant="contained" onClick={() => handleDeleteAlarm(row.id)}>Delete</Button>
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

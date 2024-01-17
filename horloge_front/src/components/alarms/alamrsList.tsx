import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow
} from '@mui/material';
import alarmsApiService from "../../services/alarmsApiServices";
import AddAlarm from "./addAlarm";
import {daysString} from "../../helpers/stringHelpers";
import '../../styles/style.css'
import dayjs from "dayjs";
import {NotifyError, NotifySuccess} from "./notification";
// @ts-ignore
import sound from "../../sounds/alarm-sound.mp3"

export interface TableRowData {
    id: number;
    time: string;
    days: string[];
    description: string;
    active: boolean;
}

const ListAlarm: React.FC = () => {
    const [dataAlarms, setDataAlarms]= useState<TableRowData[]>([])
    const [allAlarms, setAllAlarms]= useState<TableRowData[]>([])
    const [alarmRow, setAlarmRow]= useState<TableRowData|null>(null)
    const [modalVisible, setModalVisible]= useState<boolean>(false)
    const [modalDelete, setModalDelete]= useState<boolean>(false)
    const [alarmIDToDelete, setAlarmIDToDelete]= useState<number>(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        getAllAlarms()
    }, [modalVisible,page,rowsPerPage,loading]);

    useEffect(() => {

        const intervalId = scheduleNextMinute();

        return () => {
            clearTimeout(intervalId);
        };
    }, [dataAlarms]);

    const checkAlarmTimes = () => {
        allAlarms.filter((alarm)=>alarm.active)
            .forEach((row,index) => {
                if (isAlarmTime(row.time, row.days)) {
                    showNotification(row.time);
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

    const showNotification = (time: string) => {
        playNotificationSound();
        NotifySuccess("le temps de votre alarm "+time)
    };

    const playNotificationSound = () => {
        const audio = new Audio(sound);
        audio.play();
    };

    const isAlarmTime = (alarmTime: string, days: string[]) => {
        const currentTime = dayjs();
        const day = currentTime.format('dddd');
        const formattedTime = currentTime.format('HH:mm');
        const isDay=days.includes(day)
         return isDay && alarmTime === formattedTime ;
    };

    const getAllAlarms =()=>{
        const params ={page : page, pageSize : rowsPerPage }
        alarmsApiService.getAlarms(params).then(result=>{
            console.log('result', result)
            setDataAlarms(result?.data?.alarmsPerPage);
            setAllAlarms(result?.data.AllAlarms)
            setCount(result?.data?.count)
            setLoading(false);
        }).catch(err=>{
            NotifyError("Veuillez réessayer")
        })
    }

    const handleSwitchChange = (id: number) => {
        const updatedDataAlarms = [...dataAlarms];
        const allActiveAlarms = [...allAlarms]
        const alarmToUpdate = updatedDataAlarms.find((alarm) => alarm.id === id);
        const activeAlarmToUpdate = allActiveAlarms.find((alarm) => alarm.id === id);

        if (alarmToUpdate && activeAlarmToUpdate) {
            const status = !alarmToUpdate.active;
            alarmToUpdate.active = status;
            activeAlarmToUpdate.active = status;
            alarmsApiService.updateAlarmStatus(id, status)
                .then((result) => {
                    const dataResult=result?.data
                    if(dataResult.success){
                        setDataAlarms(updatedDataAlarms);
                        setAllAlarms(allActiveAlarms)
                        NotifySuccess('Success to change alarm status')
                    }else{
                        NotifyError(dataResult.message)
                    }

                })
                .catch((error) => {
                    alarmToUpdate.active = !alarmToUpdate.active;
                    activeAlarmToUpdate.active = status;
                    setDataAlarms(updatedDataAlarms);
                    setAllAlarms(allActiveAlarms)
                    NotifyError('Error updating alarm status: '+error )
                });
        }
    };

    const handleEditAlarm =(dataAlarm:TableRowData)=>{
        setModalVisible(!modalVisible)
        setAlarmRow(dataAlarm)
    }

    const handleDeleteAlarm =(alarm_id:number)=>{
        setModalDelete(!modalDelete);
        setAlarmIDToDelete(alarm_id)
    }

    const deleteAlarm=()=>{
        alarmsApiService.deleteAlarm(alarmIDToDelete).then(result=>{
            const dataResult=result?.data
            if(dataResult.success){
                setModalDelete(!modalDelete)
                setLoading(true)
                NotifySuccess('Alarm delete with success')
            }else{
                setModalDelete(!modalDelete)
                setLoading(true)
                NotifyError(dataResult.message )
            }

        }).catch(error=>{
            NotifyError('Error deleting alarm status: '+error )
        })
    }

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>

            {modalVisible && <AddAlarm modalAdd={modalVisible} setModal={setModalVisible} dataAlarm={alarmRow}/>}
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
            {loading ? (
                <CircularProgress />):(
                    <div>
        <TableContainer>

            <Button variant="contained" onClick={()=>{setAlarmRow(null);setModalVisible(!modalVisible)}}>Ajouter Alarm</Button>
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
                                <Button className="ms-2" variant="contained" onClick={() => handleEditAlarm(row)}>Edit</Button>
                                <Button className="ms-2" variant="contained" onClick={() => handleDeleteAlarm(row.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5,10, 25, 100]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
                    </div>)}
        </div>
    );
}

export default ListAlarm;

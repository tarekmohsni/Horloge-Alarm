import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, FormControlLabel, FormGroup,
    FormLabel, Grid, TextField
} from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import '../../styles/style.css'
import alarmsApiService from "../../services/alarmsApiServices";
import dayjs, {Dayjs} from "dayjs";
import {TableRowData} from "./alamrsList";
import {clear} from "@testing-library/user-event/dist/clear";
import {NotifyError, NotifyInfo, NotifySuccess} from "./notification";

interface AddAlarmProps {
    modalAdd: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    dataAlarm: TableRowData | null;
}
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddAlarm: React.FC<AddAlarmProps> = ({modalAdd,setModal,dataAlarm})=>{
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(dayjs());
    const [description, setDescription] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    useEffect(() => {
        if(dataAlarm !== null ){
            setSelectedDays(dataAlarm.days)
            const combinedDateTime = dayjs().set('hour', parseInt(dataAlarm.time.split(':')[0])).set('minute', parseInt(dataAlarm.time.split(':')[1]));
            setSelectedTime(combinedDateTime)
            setDescription(dataAlarm.description)
        }
    }, []);
    const handleClose = () => {
        setModal(!modalAdd);
    };
    const handleDayCheckboxChange = (day: string) => {
        const updatedDays = selectedDays.includes(day)
            ? selectedDays.filter((selectedDay) => selectedDay !== day)
            : [...selectedDays, day];
        console.log('updatedDays',updatedDays)

        setSelectedDays(updatedDays);
    };

    const handleAddNewAlarm =()=>{
        if (!selectedTime) {
            NotifyInfo('Le temps est requis.');
            return;
        }

        if (!selectedDays.length) {
            NotifyInfo('Au moins un jour doit être sélectionné.');
            return;
        }
        const objAlarm={
            time: dayjs(selectedTime).format('HH:mm'),
            days: selectedDays,
            description: description
        }
        if(dataAlarm !== null){
            alarmsApiService.updateAlarm(dataAlarm.id,objAlarm).then(result=>{
                const dataResultEdit=result?.data
                if(dataResultEdit.success){
                    setModal(!modalAdd)
                    NotifySuccess(dataResultEdit?.message)
                }else{
                    NotifyError(dataResultEdit?.message)
                }
            }).catch(error=>{
                NotifyError("Please, try again")
            })
        }else{
            alarmsApiService.addAlarm(objAlarm).then(result=>{
                console.log("result", result)
                const dataResultAdd=result?.data
                if(dataResultAdd.success){
                    setModal(!modalAdd)
                    NotifySuccess(dataResultAdd?.message)
                }else{
                    NotifyError(dataResultAdd?.message)
                }
            }).catch(error=>{
                NotifyError("Please, try again")
            })
        }

    }

    const handleTimeChange = (newTime:any) => {
        console.log('time', newTime)
        setSelectedTime(newTime);
    };

    const handleDescriptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };
    return(
        <div>
        <Dialog
            open={modalAdd}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                    <label className="label">Time:</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimePicker']}>
                            <TimePicker label="Choisir votre alarm"
                                        value={selectedTime}
                                        onChange={handleTimeChange}/>
                            {selectedTime && (
                                <div>
                                <p>
                                    Heure sélectionnée : {dayjs(selectedTime).format('HH:mm')}
                                </p>
                                </div>
                            )}
                        </DemoContainer>
                    </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                        <label className="label">Days:</label>
                            <div>
                         {daysOfWeek.map((day) => (
                        <FormControlLabel
                            key={day}
                            control={
                                <Checkbox
                                    checked={selectedDays.includes(day)}
                                    onChange={() => handleDayCheckboxChange(day)}
                                />
                            }
                            label={day}
                        />
                    ))}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <label className="label"></label>
                            <TextField id="description" label="Description" variant="standard"
                                       value={description}
                                       onChange={handleDescriptionChange}/>
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleAddNewAlarm}>Add Alarm</Button>
            </DialogActions>
        </Dialog>
        </div>
    )

}
export default AddAlarm
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
import dayjs from "dayjs";

interface AddAlarmProps {
    modalAdd: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddAlarm: React.FC<AddAlarmProps> = ({modalAdd,setModal})=>{
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

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
            setAlertMessage('Le temps est requis.');
            setShowAlert(true);
            return;
        }

        if (!selectedDays.length) {
            setAlertMessage('Au moins un jour doit être sélectionné.');
            setShowAlert(true);
            return;
        }
        const objAlarm={
            time: dayjs(selectedTime).format('HH:mm'),
            days: selectedDays,
            description: description
        }
        console.log("selectedTime", typeof selectedTime)
        console.log('dataaa', objAlarm)

        alarmsApiService.addAlarm(objAlarm).then(result=>{
            console.log("result", result)
        })
    }

    const handleTimeChange = (newTime:any) => {
        console.log('time', newTime)
        setSelectedTime(newTime);
    };

    const handleDescriptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };
    return(
        <Dialog
            open={modalAdd}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            {showAlert && (
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                    {alertMessage}
                </Alert>
            )}
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
                                <p>
                                    Heure sélectionnée : {dayjs(selectedTime).format('HH:mm')}
                                </p>
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
    )

}
export default AddAlarm
import { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import ListAlarm from "./alarms/alamrsList";
import {Button} from "@mui/material";

function MyClock() {
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setValue(new Date()), 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <p>Current time:</p>
            <Clock value={value} />
            <ListAlarm/>
        </div>
    );
}
export default MyClock
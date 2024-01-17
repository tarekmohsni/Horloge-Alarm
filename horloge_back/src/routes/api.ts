import { Router } from 'express';
import alarmController from '../controllers/alarmController';


let router = Router();

let apiRouters = function () {
    router.post('/api/alarm/save', alarmController.addAlarm);
    router.get('/api/alarms', alarmController.getAllAlarm);
    router.delete('/api/alarm/:alarm_id', alarmController.deleteAlarm);
    router.patch('/api/alarm/:alarm_id', alarmController.updateAlarmStatus);
    router.put('/api/alarm/:alarm_id', alarmController.updateAlarm);

    return router;
};

export = apiRouters;
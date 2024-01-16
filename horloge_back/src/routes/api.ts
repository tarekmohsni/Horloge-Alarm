import { Router } from 'express';
import alarmController from '../controllers/alarmController';


let router = Router();

let apiRouters = function () {
    router.post('/api/alarm/save', alarmController.addAlarm);
    router.get('/api/alarms', alarmController.getAllAlarm);
    router.delete('/api/alarm/:alarm_id', alarmController.deleteAlarm)

    return router;
};

export = apiRouters;
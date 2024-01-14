import { Router } from 'express';
import alarmController from '../controllers/alarmController';


let router = Router();

let apiRouters = function () {
    // ... other routes

    router.post('/api/alarm/save', alarmController.addAlarm);
    router.get('/api/alarms', alarmController.getAllAlarm);

    // ... other routes

    return router;
};

export = apiRouters;
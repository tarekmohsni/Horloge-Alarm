import { Request, Response, NextFunction } from 'express';
import AlarmBo from '../business_objects/alarmBo';

const _alarmBo = new AlarmBo();

export = {
    addAlarm: (req: Request, res: Response, next: NextFunction) => {
        _alarmBo.addAlarm(req, res, next);
    },
    getAllAlarm: (req: Request, res: Response, next: NextFunction) => {
        _alarmBo.getAllAlarm(req, res, next);
    },
    deleteAlarm:(req: Request, res: Response, next: NextFunction)=>{
        _alarmBo.deleteAlarm(req, res, next)
    },
    updateAlarmStatus:(req: Request, res: Response, next:NextFunction)=>{
        _alarmBo.updateAlarmStatus(req, res, next)
    }
};

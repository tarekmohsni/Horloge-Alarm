import { Request, Response, NextFunction } from 'express';
import { models } from '../config/database';

class AlarmBo {

    async addAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            const { time, description, days } = req.body;

            if (!time) {
                return res.status(404).json({
                    success: false,
                    message: 'Please, choose time',
                });
            }

            const newAlarm = await models.Alarm.create({ time, description, days });

            res.json({
                success: true,
                alarm: newAlarm,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    async getAllAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            const alarms = await models.Alarm.findAll();

            res.json({
                success: true,
                alarms,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    async deleteAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            const alarm_id = req.params.alarm_id;

            await models.Alarm.destroy({
                where: {
                    id: alarm_id
                }
            });

            res.json({
                success: true
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    async updateAlarmStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const alarm_id = req.params.alarm_id;
            const { active } = req.body;

            if (active === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide the "active" status',
                });
            }

            await models.Alarm.update(
                { active },
                {
                    where: {
                        id: alarm_id
                    }
                }
            );

            res.json({
                success: true
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }


}

export = AlarmBo;

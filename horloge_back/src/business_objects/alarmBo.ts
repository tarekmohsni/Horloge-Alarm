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

            if (!days) {
                return res.status(404).json({
                    success: false,
                    message: 'Please, choose days',
                });
            }

            if (time && !this.isValidTimeFormat(time)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time format. Please provide a valid time in HH:mm format.',
                });
            }

            const newAlarm = await models.Alarm.create({ time, description, days });

            res.json({
                success: true,
                message: 'Add alarm with success.',
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
            const { page = 1, pageSize = 5 } = req.query;
            const parsedPage = parseInt(page as string, 10);
            const parsedPageSize = parseInt(pageSize as string, 10);
             const offset = Math.max(parsedPage * parsedPageSize, 0);

            const { count, rows: alarmsPerPage } = await models.Alarm.findAndCountAll({
                limit: parseInt(pageSize as string, 10),
                offset: offset,
            });

            const AllAlarms = await models.Alarm.findAll();

            const totalPages = Math.ceil(count / parsedPageSize);

            res.json({
                success: true,
                alarmsPerPage,
                AllAlarms,
                totalPages,
                count
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
            const alarm_id = parseInt(req.params.alarm_id, 10);

            if (isNaN(alarm_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid alarm_id provided',
                });
            }

            const deletedRowCount = await models.Alarm.destroy({
                where: {
                    id: alarm_id
                }
            });

            if (deletedRowCount !== 1) {
                return res.status(404).json({
                    success: false,
                    message: 'Alarm not found or not deleted',
                });
            }

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
            const alarm_id = parseInt(req.params.alarm_id, 10);
            const { active } = req.body;

            if (isNaN(alarm_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid alarm_id provided',
                });
            }
            if (active === undefined || typeof active !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid "active" status (boolean)',
                });
            }

            const [updatedRowsCount, updatedRows] = await models.Alarm.update(
                { active },
                {
                    where: {
                        id: alarm_id
                    },
                    returning: true,
                }
            );

            if (updatedRowsCount !== 1) {
                return res.status(404).json({
                    success: false,
                    message: 'Alarm not found or not updated',
                });
            }

            res.json({
                success: true,
                updatedAlarm: updatedRows[0],
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    async updateAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            const alarm_id = req.params.alarm_id;
            const { time, description, days } = req.body;

            if (time && !this.isValidTimeFormat(time)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time format. Please provide a valid time in HH:mm format.',
                });
            }

            if (!days) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide at least one field to update',
                });
            }

            const existingAlarm = await models.Alarm.findOne({
                where: {
                    id: alarm_id
                }
            });

            if (!existingAlarm) {
                return res.status(404).json({
                    success: false,
                    message: 'Alarm not found',
                });
            }

            // Effectuez la mise à jour
            const updatedAlarm = await models.Alarm.update(
                { time, description, days },
                {
                    where: {
                        id: alarm_id
                    },
                    returning: true,
                }
            );

            res.json({
                success: true,
                message: 'Update Alarm with success',
            });
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    // Fonction utilitaire pour valider le temps
    isValidTimeFormat(time: string): boolean {
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }


}

export = AlarmBo;

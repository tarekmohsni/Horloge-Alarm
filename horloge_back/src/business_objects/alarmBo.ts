import { Request, Response, NextFunction } from 'express';
import { models } from '../config/database';

class AlarmBo {

    // Function to add a new alarm
    async addAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            // Extracting data from the request body
            const { time, description, days } = req.body;

            // Checking if the 'time' and 'days' are provided
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

            // Validating the time format
            if (time && !this.isValidTimeFormat(time)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time format. Please provide a valid time in HH:mm format.',
                });
            }

            // Creating a new alarm in the database
            const newAlarm = await models.Alarm.create({ time, description, days });

            res.json({
                success: true,
                message: 'Add alarm with success.',
            });
        } catch (err) {
            // Handling errors
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    // Function to get all alarms with pagination
    async getAllAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            // Extracting pagination parameters from the request query
            const { page = 1, pageSize = 5 } = req.query;
            const parsedPage = parseInt(page as string, 10);
            const parsedPageSize = parseInt(pageSize as string, 10);
            const offset = Math.max(parsedPage * parsedPageSize, 0);

            // Fetching alarms for the requested page
            const { count, rows: alarmsPerPage } = await models.Alarm.findAndCountAll({
                limit: parseInt(pageSize as string, 10),
                offset: offset,
            });

            // Fetching all alarms (for total count)
            const AllAlarms = await models.Alarm.findAll();

            // Calculating total pages for pagination
            const totalPages = Math.ceil(count / parsedPageSize);

            res.json({
                success: true,
                alarmsPerPage,
                AllAlarms,
                totalPages,
                count
            });
        } catch (err) {
            // Handling errors
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    // Function to delete an alarm by ID
    async deleteAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            // Parsing and validating the alarm ID from the request parameters
            const alarm_id = parseInt(req.params.alarm_id, 10);

            if (isNaN(alarm_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid alarm_id provided',
                });
            }

            // Deleting the alarm from the database
            const deletedRowCount = await models.Alarm.destroy({
                where: {
                    id: alarm_id
                }
            });

            // Checking if the alarm was deleted successfully
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
            // Handling errors
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    // Function to update the status of an alarm (active or inactive)
    async updateAlarmStatus(req: Request, res: Response, next: NextFunction) {
        try {
            // Parsing and validating the alarm ID from the request parameters
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

            // Updating the status of the alarm in the database
            const [updatedRowsCount, updatedRows] = await models.Alarm.update(
                { active },
                {
                    where: {
                        id: alarm_id
                    },
                    returning: true,
                }
            );

            // Checking if the alarm was updated successfully
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
            // Handling errors
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    // Function to update an existing alarm
    async updateAlarm(req: Request, res: Response, next: NextFunction) {
        try {
            // Parsing and validating the alarm ID from the request parameters
            const alarm_id = req.params.alarm_id;
            const { time, description, days } = req.body;

            // Validating the time format
            if (time && !this.isValidTimeFormat(time)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time format. Please provide a valid time in HH:mm format.',
                });
            }

            // Checking if 'days' is provided for updating
            if (!days) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide at least one field to update',
                });
            }

            // Fetching the existing alarm from the database
            const existingAlarm = await models.Alarm.findOne({
                where: {
                    id: alarm_id
                }
            });

            // Checking if the alarm exists
            if (!existingAlarm) {
                return res.status(404).json({
                    success: false,
                    message: 'Alarm not found',
                });
            }

            // Updating the alarm in the database
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
            // Handling errors
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    // Utility function to validate the time format
    isValidTimeFormat(time: string): boolean {
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }
}

export = AlarmBo;

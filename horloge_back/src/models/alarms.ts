import { Model, DataTypes, Sequelize } from 'sequelize';

interface AlarmAttributes {
    id: number;
    time: string;
    description: string;
}

class Alarm extends Model<AlarmAttributes> implements AlarmAttributes {
    public id!: number;
    public time!: string;
    public description!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initAlarmModel = (sequelize: Sequelize) => {
    Alarm.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            time: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Alarm',
            tableName: 'alarms'
        }
    );

    return Alarm;
};

export { initAlarmModel, Alarm };
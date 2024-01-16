import axios, { AxiosResponse } from "axios";

interface ResponseData {
    alarms: any,
    success: boolean
}

interface AlarmData{
    time: string,
    days: string[],
    description: string
}

class AlarmService {
    getAlarms(params: any): Promise<AxiosResponse<ResponseData>> {
        return axios.get<ResponseData>("http://localhost:2000/api/alarms", { params });
    }

    addAlarm(data: any): Promise<AxiosResponse<AlarmData>> {
        return axios.post("http://localhost:2000/api/alarm/save", data);
    }

    deleteAlarm(alarm_id: number): Promise<AxiosResponse<any>> {
        return axios.delete(`http://localhost:2000/api/alarm/${alarm_id}`);
    }

    updateAlarmStatus(alarm_id: number, active: boolean): Promise<AxiosResponse<any>> {
        return axios.patch(`http://localhost:2000/api/alarm/${alarm_id}`, { active });
    }

}

const alarmsApiService = new AlarmService();

export default alarmsApiService;

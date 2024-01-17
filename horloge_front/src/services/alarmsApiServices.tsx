import axios, { AxiosResponse } from "axios";

interface ResponseData {
    AllAlarms: any,
    success: boolean,
    totalPages: number,
    alarmsPerPage: any,
    count: number
}

interface AlarmData{
    time: string,
    days: string[],
    description: string
}

interface AlarmAdd{
    success: boolean,
    message: string,

}

class AlarmService {
    getAlarms(params: any): Promise<AxiosResponse<ResponseData>> {
        return axios.get<ResponseData>("http://localhost:2000/api/alarms", { params });
    }

    addAlarm(data: AlarmData): Promise<AxiosResponse<AlarmAdd>> {
        return axios.post("http://localhost:2000/api/alarm/save", data);
    }

    deleteAlarm(alarm_id: number): Promise<AxiosResponse<any>> {
        return axios.delete(`http://localhost:2000/api/alarm/${alarm_id}`);
    }

    updateAlarmStatus(alarm_id: number, active: boolean): Promise<AxiosResponse<any>> {
        return axios.patch(`http://localhost:2000/api/alarm/${alarm_id}`, { active });
    }

    updateAlarm(alarm_id:number, data: AlarmData): Promise<AxiosResponse<any>> {
        return axios.put(`http://localhost:2000/api/alarm/${alarm_id}`, data)
    }

}

const alarmsApiService = new AlarmService();

export default alarmsApiService;

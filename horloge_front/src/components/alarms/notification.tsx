import {toast, ToastOptions} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const options:ToastOptions = {position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"}

export const NotifySuccess = (message:string) => toast.success(message , options)
export const NotifyError = (message:string) => toast.error(message,  options)
export const NotifyInfo = (message:string) => toast.info(message,  options)
import {Alert} from "@mui/material";
import React from "react";
import {toast, ToastContainer, ToastOptions} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const options:ToastOptions = {position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"}

export const NotifySuccess = (message:any) => toast.success(message , options)
export const NotifyError = (message:any) => toast.error(message,  options)
export const NotifyInfo = (message:any) => toast.info(message,  options)
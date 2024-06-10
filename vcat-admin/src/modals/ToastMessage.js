import React, { useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';
import { observer } from "mobx-react";
import AppConfig from './AppConfig';

function ToastMessage() {
    const toast = useRef(null);
    const { status, success, error } = AppConfig;
    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success !', detail: message, life: 3000 });
    };
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error!', detail: message, life: 3000 });
    };
    useEffect(() => {
        if (success || error) {
            if (success) showSuccess(success);
            if (error) showError(error);
            AppConfig.setMessage('', true);
            AppConfig.setMessage('', false);
        }
    },[success,error]);
    return <Toast ref={toast} />;
}

export default observer(ToastMessage);
import { notification } from "antd"

const errorHandler = (error: any) => {
    if (!navigator.onLine) {
        notification.config({
            duration: 15,
            maxCount: 1
        })

        notification.error({
            message: "No internet connection",
            description: 'Cannot connect to the Internet, Check your internet network'
        })

        return {
            success: false,
            result: null,
            message: 'Cannot connect to the Internet, Check your internet network'
        }
    }

    const { response } = error

    if (!response) {
        notification.config({
            duration: 20,
            maxCount: 1,
        });

        notification.error({
            message: 'Problem connecting to server',
            description: 'Cannot connect to the server, Try again later',
        });
        return {
            success: false,
            result: null,
            message: 'Cannot connect to the server, Contact your Account administrator',
        };
    }

    if (response && response.data && response.data.jwtExpired) {
        // notification.config({
        //     duration: 20,
        //     maxCount: 1,
        // });

        // notification.error({
        //     message: 'Session Expired',
        //     description: 'Your session has expired, Please login again',
        // });
        // return {
        //     success: false,
        //     result: null,
        //     message: 'Session Expired',
        // };
    }
    return
}

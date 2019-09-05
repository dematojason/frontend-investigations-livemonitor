var LiveMonitor;
(function (LiveMonitor) {
    var CircuitStatus;
    (function (CircuitStatus) {
        CircuitStatus[CircuitStatus["ENABLED"] = 0] = "ENABLED";
        CircuitStatus[CircuitStatus["DISABLED"] = 1] = "DISABLED";
        CircuitStatus[CircuitStatus["SHUTDOWN"] = 2] = "SHUTDOWN";
        CircuitStatus[CircuitStatus["RESERVED"] = 3] = "RESERVED";
        CircuitStatus[CircuitStatus["OUT_OF_SERVICE"] = 4] = "OUT_OF_SERVICE";
    })(CircuitStatus = LiveMonitor.CircuitStatus || (LiveMonitor.CircuitStatus = {}));
    var CallStatus;
    (function (CallStatus) {
        CallStatus[CallStatus["ON"] = 0] = "ON";
        CallStatus[CallStatus["OFF"] = 1] = "OFF";
        CallStatus[CallStatus["BLOCKED"] = 2] = "BLOCKED";
        CallStatus[CallStatus["NOT_RECORDED"] = 3] = "NOT_RECORDED";
    })(CallStatus = LiveMonitor.CallStatus || (LiveMonitor.CallStatus = {}));
    var CtrlMsgType;
    (function (CtrlMsgType) {
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_RANGE_BEGIN"] = 2024] = "WM_CTRL_MSG_RANGE_BEGIN";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_FIRE_EVENT"] = 2025] = "WM_CTRL_MSG_FIRE_EVENT";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_DISCONNECT"] = 2026] = "WM_CTRL_MSG_DISCONNECT";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_CONNECT"] = 2027] = "WM_CTRL_MSG_CONNECT";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_REGISTER"] = 2028] = "WM_CTRL_MSG_REGISTER";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_UNREGISTER"] = 2029] = "WM_CTRL_MSG_UNREGISTER";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_LICENSE_LOGON"] = 2030] = "WM_CTRL_MSG_LICENSE_LOGON";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_LICENSE_LOGOFF"] = 2031] = "WM_CTRL_MSG_LICENSE_LOGOFF";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_EVENT_DISCONNECTED"] = 2032] = "WM_CTRL_MSG_EVENT_DISCONNECTED";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_EVENT_CONNECTED"] = 2033] = "WM_CTRL_MSG_EVENT_CONNECTED";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_EVENT_REGISTERED"] = 2034] = "WM_CTRL_MSG_EVENT_REGISTERED";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_EVENT_UNREGISTERED"] = 2035] = "WM_CTRL_MSG_EVENT_UNREGISTERED";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_LICENSE_LOGGED_ON"] = 2036] = "WM_CTRL_MSG_LICENSE_LOGGED_ON";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_LICENSE_LOGGED_OFF"] = 2037] = "WM_CTRL_MSG_LICENSE_LOGGED_OFF";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_EVENT_CALLSTART"] = 2038] = "WM_CTRL_MSG_EVENT_CALLSTART";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_EVENT_CALLEND"] = 2039] = "WM_CTRL_MSG_EVENT_CALLEND";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_EVENT_CALLBLOCK"] = 2040] = "WM_CTRL_MSG_EVENT_CALLBLOCK";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_START_MONITOR"] = 2041] = "WM_CTRL_MSG_START_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_END_MONITOR"] = 2042] = "WM_CTRL_MSG_END_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_STARTED_MONITOR"] = 2043] = "WM_CTRL_MSG_STARTED_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_ENDED_MONITOR"] = 2044] = "WM_CTRL_MSG_ENDED_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_PAUSED_MONITOR"] = 2045] = "WM_CTRL_MSG_PAUSED_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_RESUMED_MONITOR"] = 2046] = "WM_CTRL_MSG_RESUMED_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_SECURITY_LOGGED_ON"] = 2047] = "WM_CTRL_MSG_SECURITY_LOGGED_ON";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_SECURITY_LOGGED_OFF"] = 2048] = "WM_CTRL_MSG_SECURITY_LOGGED_OFF";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_RANGE_END"] = 2049] = "WM_CTRL_MSG_RANGE_END";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_START_REMOTE_MONITOR"] = 2050] = "WM_CTRL_MSG_START_REMOTE_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_STARTED_REMOTE_MONITOR"] = 2051] = "WM_CTRL_MSG_STARTED_REMOTE_MONITOR";
        CtrlMsgType[CtrlMsgType["WM_CTRL_MSG_SEND_ALARM"] = 2052] = "WM_CTRL_MSG_SEND_ALARM";
    })(CtrlMsgType = LiveMonitor.CtrlMsgType || (LiveMonitor.CtrlMsgType = {}));
    var DeviceType;
    (function (DeviceType) {
        DeviceType[DeviceType["ANY"] = 0] = "ANY";
        DeviceType[DeviceType["PHONE"] = 1] = "PHONE";
        DeviceType[DeviceType["VISITOR_VIDEO"] = 2] = "VISITOR_VIDEO";
        DeviceType[DeviceType["INMATE_VIDEO"] = 3] = "INMATE_VIDEO";
        DeviceType[DeviceType["PAYMENT_KIOSK"] = 4] = "PAYMENT_KIOSK";
    })(DeviceType = LiveMonitor.DeviceType || (LiveMonitor.DeviceType = {}));
    var SignalRConnectionState;
    (function (SignalRConnectionState) {
        SignalRConnectionState[SignalRConnectionState["CONNECTING"] = 0] = "CONNECTING";
        SignalRConnectionState[SignalRConnectionState["CONNECTED"] = 1] = "CONNECTED";
        SignalRConnectionState[SignalRConnectionState["RECONNECTING"] = 2] = "RECONNECTING";
        SignalRConnectionState[SignalRConnectionState["DISCONNECTED"] = 3] = "DISCONNECTED";
    })(SignalRConnectionState = LiveMonitor.SignalRConnectionState || (LiveMonitor.SignalRConnectionState = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=Enums.js.map
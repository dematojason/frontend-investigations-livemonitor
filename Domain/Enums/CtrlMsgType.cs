﻿
// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public enum CtrlMsgType
	{
		WM_CTRL_MSG_RANGE_BEGIN = 2024,
		WM_CTRL_MSG_FIRE_EVENT,
		WM_CTRL_MSG_DISCONNECT,
		WM_CTRL_MSG_CONNECT,
		WM_CTRL_MSG_REGISTER,
		WM_CTRL_MSG_UNREGISTER,
		WM_CTRL_MSG_LICENSE_LOGON,
		WM_CTRL_MSG_LICENSE_LOGOFF,
		WM_CTRL_MSG_EVENT_DISCONNECTED,
		WM_CTRL_MSG_EVENT_CONNECTED,
		WM_CTRL_MSG_EVENT_REGISTERED,
		WM_CTRL_MSG_EVENT_UNREGISTERED,
		WM_CTRL_MSG_LICENSE_LOGGED_ON,
		WM_CTRL_MSG_LICENSE_LOGGED_OFF,
		WM_CTRL_MSG_EVENT_CALLSTART, // 38
		WM_CTRL_MSG_EVENT_CALLEND, // 39
		WM_CTRL_MSG_EVENT_CALLBLOCK,
		WM_CTRL_MSG_START_MONITOR,
		WM_CTRL_MSG_END_MONITOR,
		WM_CTRL_MSG_STARTED_MONITOR,
		WM_CTRL_MSG_ENDED_MONITOR,
		WM_CTRL_MSG_PAUSED_MONITOR,
		WM_CTRL_MSG_RESUMED_MONITOR,
		WM_CTRL_MSG_SECURITY_LOGGED_ON,
		WM_CTRL_MSG_SECURITY_LOGGED_OFF,
		WM_CTRL_MSG_RANGE_END,
		WM_CTRL_MSG_START_REMOTE_MONITOR,
		WM_CTRL_MSG_STARTED_REMOTE_MONITOR,
		WM_CTRL_MSG_SEND_ALARM
	}
}
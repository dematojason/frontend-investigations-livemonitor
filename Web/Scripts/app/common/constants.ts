namespace LiveMonitor {
	export class EventNames {
		readonly addCallStartMsg: string;
		readonly addCallEndMsg: string;
		readonly getRtcmMessages: string;
		readonly removeAllMessages: string;

		readonly onConnected: string;
		readonly onDisconnected: string;
		readonly onAddCallStartMsg: string;
		readonly onAddCallEndMsg: string;
		readonly onRedirectToLogin: string;
		readonly onRemoveAllMessages: string;
	}

	export class ImageSources {
		readonly pauseCallHistory: string;
		readonly clearCallHistory: string;
		readonly clearAlertHistory: string;
		readonly disconnectCall: string;
		readonly cycleMode: string;
		readonly listenMode: string;
		readonly offMode: string;
		readonly parkMode: string;
	}

	export class Constants {
		public static readonly applicationName: string = 'LiveMonitor';
		public static readonly circuitsHubName: string = 'circuitsHub';
		public static readonly signalREventNames: EventNames = {
			addCallStartMsg: 'addCallStartMsg',
			addCallEndMsg: 'addCallEndMsg',
			getRtcmMessages: 'getRtcmMessages',
			removeAllMessages: 'removeAllMessages',

			onConnected: 'signalRConnected',
			onDisconnected: 'signalRDisconnected',
			onAddCallStartMsg: 'broadcastAddCallStartMsg',
			onAddCallEndMsg: 'broadcastAddCallEndMsg',
			onRedirectToLogin: 'broadcastRedirectToLogin',
			onRemoveAllMessages: 'broadcastRemoveAllMessages'
		}
		public static readonly imgSources: ImageSources = {
			pauseCallHistory: '/Images/pause-call-history.svg',
			//clearCallHistory: '/Images/clear-call-history.svg',
			clearCallHistory: '/Images/broom-icon-circled.svg',
			clearAlertHistory: '/Images/clear-alert-history.svg',
			disconnectCall: '/Images/disconnect-call.svg',
			cycleMode: '/Images/cycle-calls.svg',
			listenMode: '/Images/listen.svg',
			//offMode: '/Images/circle-cross.svg',
			offMode: '/Images/power-btn.svg',
			parkMode: '/Images/park-car.svg'
		}
		public static readonly unauthorizedExpiredToken = 'expired_token';
		public static readonly unauthorizedReqRoles = 'required_roles';
		public static readonly unauthorizedUnauthenticated = 'unauthenticated';
	}

	export class Permissions {
		public static readonly view: string = 'LiveMonitor_View';
	}
}
namespace LiveMonitor {
	export interface IRtcmMsg {
		header: RtcmMsgHeader;
	}

	export class RtcmMsgHeader {
		public eventCode: CtrlMsgType;
		public ani: string;
		public callId: number;
		public lineId: number;
		public unitId: number;
		public pin: string;
		public siteId: string;
		public calledNumber: string;
		public startDateTime: string;
		public inmateFirstName: string;
		public inmateMiddleName: string;
		public inmateLastName: string;
	}

	export class EventCallStartMsg implements IRtcmMsg {
		public header: RtcmMsgHeader;
		public data: EventCallStartData;
	}

	export class EventCallEndMsg implements IRtcmMsg {
		public header: RtcmMsgHeader;
		public data: EventCallEndData;
	}

	export class EventCallStartData {
		public maxDuration: number;
		public recorded: boolean;
	}

	export class EventCallEndData {
		public terminateCode: string;
		public blockCode: string;
		public duration: number;
	}
}
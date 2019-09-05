namespace LiveMonitor {
	export class Call {
		public callId: number;
		public lineId: number;
		public unitId: number;
		public pin: string;
		public inmateFirstName: string;
		public inmateMiddleName: string;
		public inmateLastName: string;
		public get inmateName(): string {
			return FormatHelper.getNameDisplay(this.inmateFirstName, this.inmateMiddleName, this.inmateLastName);
		}
		public docId: string;
		public calledNumber: string;
		public terminateCode: string;
		public blockCode: string;
		public callTimer: number;
		public curDuration: number;
		public maxDuration: number;
		public startTime: string;
		public endTime: string | null;
		public callStatus: CallStatus;
	}
}
namespace LiveMonitor {
	export class SignalRError extends BaseError {
		public status: number = 500;
		public userMsg: string;

		constructor(errObj: Object, userMsg: string) {
			super(errObj as string);

			this.userMsg = userMsg;
		}
	}
}
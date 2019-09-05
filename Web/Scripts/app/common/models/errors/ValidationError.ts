namespace LiveMonitor {
	export class ValidationError extends BaseError {
		public userMsg: string;

		constructor(internalMsg: string, userMsg: string) {
			super(internalMsg);

			this.name = 'ValidationError';
			this.userMsg = userMsg;
		}
	}
}
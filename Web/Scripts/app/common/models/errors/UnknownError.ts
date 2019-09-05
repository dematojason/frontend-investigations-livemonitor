namespace LiveMonitor {
	/**
	 * Should be used for when the error data type is unknown.
	 */
	export class UnknownError extends BaseError {
		userMsg: string;
		errObj?: any;

		constructor(errObj: any, userMsg: string | null) {
			super();

			if (CommonHelper.isNullOrUndef(errObj) || CommonHelper.isNullUndefOrBlank(errObj.name)) {
				this.name = 'UnknownError';
			} else {
				this.name = errObj.name;
			}

			this.errObj = errObj;
			this.userMsg = userMsg === null ? 'An unexpected error has occurred' : userMsg;
		}
	}
}
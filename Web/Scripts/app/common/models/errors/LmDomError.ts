namespace LiveMonitor {
	export class LmDomError extends BaseError {
		public userMsg: string;

		constructor(domException: DOMException, userMsg: string | null) {
			//let internalMsg: string | null = CommonHelper.isNullOrUndef(domException) ? userMsg : domException.message;
			let internalMsg: string;
			if (CommonHelper.isNullOrUndef(domException) || CommonHelper.isNullUndefOrBlank(domException.message)) {
				internalMsg = userMsg === null ? 'DOM Error thrown' : userMsg;
			} else {
				internalMsg = domException.message;
			}

			super(internalMsg);
			this.name = CommonHelper.isNullOrUndef(domException) ? 'LogicError' : domException.name;

			this.userMsg = userMsg === null ? internalMsg : userMsg;
		}
	}
}
namespace LiveMonitor {
	/**
	 * Combines different types of http rejection responses into a single error class.
	 */
	export class HttpError extends BaseError {
		public status: number;
		public httpMethod: string | null;
		public url: string | null;
		public userMsg: string;

		private readonly _defUserMsg: string;
		private readonly _defStatusCode: number;
		private readonly _defHttpMethod: string;


		constructor(errObj: any | Response, httpMethod: string | null, userMsg: string | null, status: number | null, url: string | null) {
			// Both angularjs rejected promise (for http calls) and Response types have
			// statusText property which is used here for the internal message.
			let internalMsg: string;
			if (CommonHelper.isNullOrUndef(errObj) || CommonHelper.isNullOrUndef(errObj.statusText)) {
				internalMsg = 'Unexpected error contacting server';
			} else {
				internalMsg = errObj.statusText;
			}

			// Base class properties.
			super(internalMsg);
			this.name = 'HttpError';
			this._defUserMsg = internalMsg;
			this._defStatusCode = 500;
			this._defHttpMethod = 'UNKNOWN';

			this.userMsg = userMsg === null ? this._defUserMsg : userMsg;

			if (CommonHelper.isNullOrUndef(errObj)) {
				this.createCustom(httpMethod, status, url);
			} else {
				this.createFromErr(errObj, httpMethod);
			}

			if (errObj instanceof Response) {
				this.status = errObj.status;
				this.httpMethod = httpMethod === null ? 'UNKNOWN' : httpMethod;
				this.url = errObj.url;
			} else {
				this.status = errObj.status;
				this.httpMethod = errObj.config.method;
				this.url = errObj.config.url;
			}

			const val: any = undefined;
		}

		private createCustom(httpMethod: string | null, status: number | null, url: string | null) {
			this.status = status === null ? this._defStatusCode : status;
			this.httpMethod = httpMethod === null ? this._defHttpMethod : httpMethod;
			this.url = url;
		}

		private createFromErr(errObj: any | Response, httpMethod: string | null) {
			if (errObj instanceof Response) {
				this.status = errObj.status;
				this.httpMethod = httpMethod === null ? this._defHttpMethod : httpMethod;
				this.url = errObj.url;
			} else {
				this.status = errObj.status;
				this.httpMethod = errObj.config.method;
				this.url = errObj.config.url;
			}
		}
	}
}
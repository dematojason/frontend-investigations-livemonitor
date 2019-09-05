namespace LiveMonitor {
	export abstract class ErrorHelper {
		/**
		 * Workaround for making typescript catch block errors [kind of] type-safe.
		 * @param err The error object
		 * @param msg [Optional] The user message
		 */
		public static getLiveMonitorError(err: any, msg: string | null): ILiveMonitorError {
			if (!CommonHelper.isNullOrUndef(err) && err instanceof BaseError) {
				return err;
			} else {
				return new UnknownError(err, msg);
			}
		}
	}
}
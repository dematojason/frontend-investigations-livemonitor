namespace LiveMonitor {
	export abstract class BaseError extends Error implements ILiveMonitorError {
		public userMsg: string;

		//protected constructor(internalMsg: string | undefined) {
		//	super(internalMsg);
		//}
	}
}
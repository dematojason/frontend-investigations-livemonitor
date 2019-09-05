namespace LiveMonitor.Services {
	'use strict';

	export interface ICircuitService {
		getCtrlMsgTypeDisplay(type: CtrlMsgType): string;
	}

	class CircuitService implements ICircuitService {
		static $inject = ['$http'];
		constructor(private readonly _$http: ng.IHttpService) {
		}

		public getCtrlMsgTypeDisplay(type: CtrlMsgType): string {
			switch (type) {
				case CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART:
					return "Call Start";
				case CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND:
					return "Call End";
				default:
					return "N/A";
			}
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.CircuitService', CircuitService);
}
namespace LiveMonitor.Dashboard {
	'use strict';

	interface IDashboardScope {
		newMsgHeader: RtcmMsgHeader;
		newStartMsgData: EventCallStartData;
		newEndMsgData: EventCallEndData;
		rtcmMessages: Array<IRtcmMsg>;
		titleStartMsgTable: string;
		titleEndMsgTable: string;

		addRtcmMsg(): void;
		removeAllMessages(): void;
		onCallStartSelected(): void;
		onCallEndSelected(): void;
	}

	export class DashboardController implements IDashboardScope {
		public $scope: ng.IScope;
		public callStatus = CallStatus;
		public newMsgHeader: RtcmMsgHeader = new RtcmMsgHeader();
		public newStartMsgData: EventCallStartData = new EventCallStartData();
		public newEndMsgData: EventCallEndData = new EventCallEndData();
		public rtcmMessages: Array<IRtcmMsg> = new Array<IRtcmMsg>();
		public titleStartMsgTable: string = '';
		public titleEndMsgTable: string = '';
		public isConnected: boolean = false;
		public connectionId: string = 'Not Connected';
		public selectedNewCallMsgType: CtrlMsgType;

		private readonly _maxLen: number = 20;

		$onInit = (): void => { };

		static $inject = [
			'$scope',
			'$timeout',
			'LiveMonitor.Services.CircuitService',
			'LiveMonitor.Services.CircuitsHubProxyService',
			'LiveMonitor.Services.LogService',
			'LiveMonitor.Services.NotifierService'
		];
		constructor(
			$scope: ng.IScope,
			private readonly _$timeout: ng.ITimeoutService,
			private readonly _circuitService: Services.ICircuitService,
			private readonly _circuitsHubProxyService: Services.ICircuitsHubProxyService,
			private readonly _logService: Services.ILogService,
			private readonly _notifier: Services.INotifierService
		) {
			this.$scope = $scope;
			this.titleStartMsgTable = "[Probably] Live Call Start Messages";
			this.titleEndMsgTable = "[Probably] Live Call End Messages";
			this.setInputDefaults();
			this.activate();
			this.isConnected = true;
		}


		public activate(): void {
			//this.$scope.$on(Constants.signalREventNames.onConnected,
			//	(event, args): void => {
			//		this._$timeout((): void => {
			//			this.onConnectedToSignalR(args.connectionId);
			//		});
			//	});

			this.$scope.$on(Constants.signalREventNames.onAddCallStartMsg,
				(event, args): void => {
					this._$timeout((): void => {
						const msg: EventCallStartMsg = args.msg as EventCallStartMsg;

						this.rtcmMessages.unshift(msg);
						if (this.rtcmMessages.length > this._maxLen) {
							this.rtcmMessages.pop();
						}
					});
				});

			this.$scope.$on(Constants.signalREventNames.onAddCallEndMsg,
				(event, args): void => {
					this._$timeout((): void => {
						const msg: EventCallEndMsg = args.msg as EventCallEndMsg;

						this.rtcmMessages.unshift(msg);
						if (this.rtcmMessages.length > this._maxLen) {
							this.rtcmMessages.pop();
						}
					});
				});

			this.$scope.$on(Constants.signalREventNames.onRemoveAllMessages,
				(event, args): void => {
					this._$timeout((): void => {
						this.rtcmMessages = new Array<IRtcmMsg>();
					});
				});
		}

		public addRtcmMsg(): void {
			switch (this.selectedNewCallMsgType) {
				case CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART:
					// Send message object
					this.addCallStartMsg(this.newStartMsgData);

					// Reset input data
					this.setInputDefaults();

					break;
				case CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND:
					// Send message object
					this.addCallEndMsg(this.newEndMsgData);

					// Reset input data
					this.setInputDefaults();

					break;
				default:
					throw new Error("Invalid RTCM Message Type");
			}
		}

		public removeAllMessages(): void {
			this._circuitsHubProxyService.removeAllMessages().then(
				(): void => {
					this._notifier.success('Successfully removed all messages', 'Messages Removed');
				}, (err: any): void => {
					this._logService.logError('Failed to remove all RTCM messages', err);
					this._notifier.error('An unexpected error occurred. Failed to remove messages.', 'Application Error');
				});
		}

		private addCallStartMsg(msgData: EventCallStartData): void {
			const msg: EventCallStartMsg = new EventCallStartMsg();
			msg.header = this.getHeader();
			msg.data = msgData;

			this._circuitsHubProxyService.addCallStartMsg(msg).then(
				(): void => {
					this._notifier.success('Successfully added call start message', 'Message Added');
				}, (err: any): void => {
					this._logService.logError('Failed to add call start message', err);
					this._notifier.error('An unexpected error occurred. Failed to add call start message.', 'Application Error');
				});
		}

		private addCallEndMsg(msgData: EventCallEndData): void {
			const msg: EventCallEndMsg = new EventCallEndMsg();
			msg.header = this.getHeader();
			msg.data = msgData;

			if (msg.data.blockCode !== '00') {
				msg.header.eventCode = CtrlMsgType.WM_CTRL_MSG_EVENT_CALLBLOCK;
			}

			this._circuitsHubProxyService.addCallEndMsg(msg).then(
				(): void => {
					this._notifier.success('Successfully added call end message', 'Message Added');
				}, (err: any): void => {
					this._logService.logError('Failed to add call end message', err);
					this._notifier.error('An unexpected error occurred. Failed to add call end message.', 'Application Error');
				});
		}

		private getHeader(): RtcmMsgHeader {
			const result: RtcmMsgHeader = new RtcmMsgHeader();
			result.eventCode = this.selectedNewCallMsgType;
			result.callId = this.newMsgHeader.callId;
			result.ani = this.newMsgHeader.ani;
			result.siteId = this.newMsgHeader.siteId;
			result.lineId = this.newMsgHeader.lineId;
			result.unitId = this.newMsgHeader.unitId;
			return result;
		}

		public getCtrlMsgTypeDisplay(type: CtrlMsgType): string {
			return this._circuitService.getCtrlMsgTypeDisplay(type);
		}

		public getCallStartMessages(): Array<EventCallStartMsg> {
			const result: Array<EventCallStartMsg> = new Array<EventCallStartMsg>();

			if (!this.rtcmMessages || this.rtcmMessages.length === 0) {
				return result;
			}

			for (let i = this.rtcmMessages.length - 1; i >= 0; i--) {
				if (this.rtcmMessages[i].header.eventCode === CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART) {
					result.push(this.rtcmMessages[i] as EventCallStartMsg);
				}
			}

			return result;
		}

		public getCallEndMessages(): Array<EventCallEndMsg> {
			const result: Array<EventCallEndMsg> = new Array<EventCallEndMsg>();

			if (!this.rtcmMessages || this.rtcmMessages.length === 0) {
				return result;
			}

			for (let i = this.rtcmMessages.length - 1; i >= 0; i--) {
				if (this.rtcmMessages[i].header.eventCode === CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND) {
					result.push(this.rtcmMessages[i] as EventCallEndMsg);
				}
			}

			return result;
		}

		public onCallStartSelected(): void {
			this.selectedNewCallMsgType = CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART;
		}

		public onCallEndSelected(): void {
			this.selectedNewCallMsgType = CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND;
		}

		//private onConnectedToSignalR(connectionId: string): void {
		//	this.$scope.$apply((): void => {
		//		this.isConnected = true;
		//		this.connectionId = connectionId;

		//		this._circuitsHubProxyService.getRtcmMessages().then(
		//			(result) => {
		//				this.rtcmMessages = result;
		//			}, (err) => {

		//				console.log(err);
		//			});
		//	});
		//}

		public setInputDefaults(): void {
			// Set defaults for header
			this.newMsgHeader = this.getDefHeader(this.selectedNewCallMsgType);

			// Set defaults for new call start message data
			this.newStartMsgData = new EventCallStartData();
			this.newStartMsgData.maxDuration = 900;

			// Set defaults for new call end message data
			this.newEndMsgData = new EventCallEndData();
			this.newEndMsgData.terminateCode = '15';
			this.newEndMsgData.blockCode = '00';
			this.newEndMsgData.duration = 69;
		}

		private getDefHeader(eventCode: CtrlMsgType): RtcmMsgHeader {
			const result: RtcmMsgHeader = new RtcmMsgHeader();
			result.eventCode = eventCode;
			result.callId = 1;
			result.ani = '7324241002';
			result.pin = '0000448540';
			result.siteId = 'S001022111';
			result.calledNumber = '8566301739';
			result.startDateTime = '20190211094712';
			result.lineId = 1;
			result.unitId = 1;

			return result;
		}
	}

	angular
		.module('LiveMonitor.Dashboard')
		.controller('DashboardController', DashboardController);
}
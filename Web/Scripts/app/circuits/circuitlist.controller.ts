

interface ICircuitListScope {
	circuits: Array<LiveMonitor.ICircuit>;
	title: string;

	isPageLoading: boolean;
}

namespace LiveMonitor.Circuits {
	class CircuitListDefaults {
		public disposeEvent: string = 'liveMonitor.locationChangeStart.leavingCircuits';
		public settings: CircuitModeSettings = new CircuitModeSettings();
		public title: string = 'Live Calls';
		public inmateTypeaheadTooltipText: string = "Type to search inmates, then select chosen inmate from the list";

		public disconnectingCall: boolean = false;
		public isPageLoading: boolean = true;
		public loadingCircuits: boolean = true;
		public loadingFacilities: boolean = true;
		public facilitiesSelected: boolean = true;
		public showCtxMenu: boolean = false;
		public dialogModalOpen: boolean = false;
		public isLoadingInmateTypeahead: boolean = false;
		public closingCtxMenu: boolean = false;
		public ctxMenuFromCircuits: boolean = false;
		public ctxMenuPausedHistory: boolean = false;
		public showFacility: boolean = false;

		public pauseCallHistoryImgSrc: string = Constants.imgSources.pauseCallHistory;
		public clearCallHistoryImgSrc: string = Constants.imgSources.clearCallHistory;
		public clearAlertHistoryImgSrc: string = Constants.imgSources.clearAlertHistory;
		public disconnectCallImgSrc: string = Constants.imgSources.disconnectCall;
		public pauseCallHistoryActive: boolean = false;

		public cycleImgSrc: string = Constants.imgSources.cycleMode;
		public listenImgSrc: string = Constants.imgSources.listenMode;
		public offImgSrc: string = Constants.imgSources.offMode;
		public parkImgSrc: string = Constants.imgSources.parkMode;
		public cycleModeActive: boolean = false;
		public listenModeActive: boolean = false;
		public offModeActive: boolean = true;
		public parkModeActive: boolean = false;
	}

	export class CircuitListController implements ICircuitListScope, CircuitListDefaults {
		public callStatus = CallStatus;
		public ctrlMsgType = CtrlMsgType;
		public ctxMenuCircuit: LiveCircuitEntry | null;
		public ctxMenuId: string = 'circuitCtxMenu';
		public circuitsTableBodyId: string = 'circuitsTableBody';
		public circuits: Array<LiveCircuitEntry> = new Array<LiveCircuitEntry>();
		public disposeEvent: string;
		public facilities: Array<Facility> = new Array<Facility>();
		public rtcmMessages: Array<ICallMsg> = new Array<ICallMsg>();
		public selectedCircuit: LiveCircuitEntry | null;
		public settings: CircuitModeSettings;
		public title: string;
		public inmateTypeaheadTooltipText: string;

		public facilityOptions: Array<MultiselectOption> = [];

		// Flags/Statuses
		public disconnectingCall: boolean;
		public isPageLoading: boolean;
		public loadingCircuits: boolean;
		public loadingFacilities: boolean;
		public facilitiesSelected: boolean;
		public showCtxMenu: boolean;
		public dialogModalOpen: boolean;
		public isLoadingInmateTypeahead: boolean;
		public closingCtxMenu: boolean;
		public ctxMenuFromCircuits: boolean;
		public ctxMenuPausedHistory: boolean;
		public showFacility: boolean;

		// Actions
		public pauseCallHistoryImgSrc: string;
		public clearCallHistoryImgSrc: string;
		public clearAlertHistoryImgSrc: string;
		public disconnectCallImgSrc: string;
		public pauseCallHistoryActive: boolean;

		// Modes
		public cycleImgSrc: string;
		public listenImgSrc: string;
		public offImgSrc: string;
		public parkImgSrc: string;
		public cycleModeActive: boolean;
		public listenModeActive: boolean;
		public offModeActive: boolean;
		public parkModeActive: boolean;

		// Signal-R
		public isConnectedSignalR: boolean = false;
		public signalRConnectionId: string;

		private _defaults: CircuitListDefaults;
		private _cyclePromise: any;
		private _inmatesTypeaheadLimitTo: number = 15;
		private _recreateCyclePromise: boolean = false;
		private _maxMessages: number = 500;
		private _minSecondsPerCycle: number = 15;
		private _prevCycleCircuit: LiveCircuitEntry | null = null;
		private _startingCycleCircuit: LiveCircuitEntry | null = null;


		$onInit = (): void => { }

		static $inject = [
			'LiveMonitor.Services.CircuitsHubProxyService',
			'LiveMonitor.Services.AudioService',
			'LiveMonitor.Services.BasicModalService',
			'LiveMonitor.Services.InmateService',
			'LiveMonitor.Services.ProdigyApiService',
			'LiveMonitor.Services.LogService',
			'LiveMonitor.Services.NotifierService',
			'LiveMonitor.Services.UserApiService',
			'$interval',
			'$scope',
			'$timeout',
			'$window'
		];
		constructor(
			public readonly circuitsHub: Services.ICircuitsHubProxyService, // This is being used for access to $scope.$on broadcasts
			private readonly _audioService: Services.IAudioService,
			private readonly _basicModal: Services.IBasicModalService,
			private readonly _inmateService: Services.IInmateService,
			private readonly _prodigyApiService: Services.IProdigyApiService,
			private readonly _logService: Services.ILogService,
			private readonly _notifier: Services.INotifierService,
			private readonly _userService: Services.IUserApiService,
			private readonly _$interval: ng.IIntervalService,
			private readonly _$scope: ng.IScope,
			private readonly _$timeout: ng.ITimeoutService,
			private readonly _$window: ng.IWindowService
		) {
			this._defaults = new CircuitListDefaults();
			CommonHelper.mapProperties(this, this._defaults);

			this.disposeEvents();
			this.loadFacilities(); // This loads facilities and circuits.
			this.activateEvents();

			this.isPageLoading = false;
		}


		// #region Audio

		public toggleCycleMode(): boolean {
			if (this.cycleModeActive) {
				this.setCycleMode(false);
			} else {
				this.setCycleMode(true);

				this.setCyclePromise();
			}

			return true; // Always return true indicating toggle action as valid.
		}

		public toggleListenMode(): boolean {
			if (this.listenModeActive) {
				this.setListenMode(false);
			} else {
				this.setListenMode(true);

				if (this.selectedCircuit) {
					this.tryPlayAudio(this.selectedCircuit);
				}
			}

			return true; // Always return true indicating toggle action as valid.
		}

		public toggleOffMode(): boolean {
			let result: boolean;

			if (this.offModeActive) {
				result = this.setOffMode(false);
			} else {
				result = this.setOffMode(true);

				this.listenModeActive = false;
				this.parkModeActive = false;
				this.setCycleMode(false);

				this.broadcastStopPlayingCircuit();
			}

			return result;
		}

		public toggleParkMode(): boolean {
			if (this.parkModeActive) {
				this.setParkMode(false);
			} else {
				this.setParkMode(true);

				if (this.selectedCircuit) {
					this.tryPlayAudio(this.selectedCircuit);
				}
			}

			return true; // Always return true indicating toggle action as valid.
		}

		private setCycleMode(enable: boolean): void {
			if (enable === this.cycleModeActive) {
				return;
			}

			if (enable) {
				this.cycleModeActive = true;

				this.listenModeActive = false;
				this.parkModeActive = false;
				this.setOffMode(false);
			} else {
				this.cycleModeActive = false;
				this._$interval.cancel(this._cyclePromise);

				if (!this.listenModeActive && !this.offModeActive && !this.parkModeActive) {
					this.setOffMode(true);
				}
			}
		}

		private setListenMode(enable: boolean): void {
			if (enable === this.listenModeActive) {
				return;
			}

			if (enable) {
				this.listenModeActive = true;

				this.parkModeActive = false;
				this.setCycleMode(false);
				this.setOffMode(false);
			} else {
				this.listenModeActive = false;

				if (!this.cycleModeActive && !this.offModeActive && !this.parkModeActive) {
					this.setOffMode(true);
				}
			}
		}

		/**
		 * Tries to set off mode to parameter enable.
		 * Returns true if the action was carried out successfully.
		 * @param enable Value to set offModeActive to.
		 */
		private setOffMode(enable: boolean): boolean {
			if (enable) {
				this.offModeActive = true;
				return true;
			} else if (this.cycleModeActive || this.listenModeActive || this.parkModeActive) {
				// Only unpress off mode if there is another mode enabled.
				this.offModeActive = false;
				return true;
			}

			return false;
		}

		private setParkMode(enable: boolean): void {
			if (enable === this.parkModeActive) {
				return;
			}

			if (this.parkModeActive) {
				this.parkModeActive = false;

				if (!this.cycleModeActive && !this.listenModeActive && !this.offModeActive) {
					this.setOffMode(true);
				}
			} else {
				this.parkModeActive = true;

				this.listenModeActive = false;
				this.setCycleMode(false);
				this.setOffMode(false);
			}
		}

		public togglePauseCallHistory(): void {
			if (this.pauseCallHistoryActive) {
				this.pauseCallHistoryActive = false;
			} else {
				this.pauseCallHistoryActive = true;
				this.ctxMenuPausedHistory = false;
			}
		}

		public clearCallHistory(): void {
			this.rtcmMessages = new Array<ICallMsg>();
		}

		private changeCircuitSelection(newVal: LiveCircuitEntry | null): void {
			this.selectedCircuit = newVal;
			this._$scope.$broadcast('changeSelectedCircuit', newVal);
		}

		public disconnectSelectedCall(): void {
			if (this.selectedCircuit === null || this.selectedCircuit === undefined || !this.circuitHasActiveCall(this.selectedCircuit)) {
				this._notifier.warning('Please select a circuit with a currently active call!', 'Invalid Circuit Selected');
			} else {
				this.disconnectCall(this.selectedCircuit.ani);
			}
		}

		public disconnectCall(ani: string): void {
			if (this.disconnectingCall) {
				return;
			}

			this.broadcastStopPlayingCircuit();

			const circuit: LiveCircuitEntry | null = this.findCircuitByAni(ani);
			let dialogMsg: string = 'Are you sure you want to disconnect the current call on circuit ';
			if (circuit !== null && circuit !== undefined) {
				dialogMsg += circuit.description;
			}

			let reconnectOnCancel: boolean = true;
			const reconnectCircuit: LiveCircuitEntry | null = angular.copy(this.selectedCircuit);
			if (this.offModeActive) {
				reconnectOnCancel = false;
			}

			this._basicModal.showModal('DISCONNECT CALL', dialogMsg, 'Yes', 'No')
				.result.then(() => {
					this.disconnectingCall = true;

					this._audioService.disconnectCall(ani)
						.then((): void => {
							const msgTitle: string | undefined = circuit === null || circuit === undefined ? undefined : circuit.description;
							this._notifier.success(`Successfully disconnected call`, msgTitle);

							this.disconnectingCall = false;
						}, (err: any): void => {
							this._notifier.error('An unexpected error has occurred. Failed to disconnect call.');
							this._logService.logError('Failed to disconnect call', err);
							this.disconnectingCall = false;
						});
				}, () => {
					// If user selected 'No', start streaming again if they were listening.
					if (reconnectOnCancel) {
						this.setSelectedCircuit(reconnectCircuit!.ani, reconnectCircuit!.call.callId, false);
					}
				});
		}

		public setSelectedCircuit(ani: string, callId: number, checkMatch?: boolean | null | undefined): void {
			if (ani === null || ani === undefined) {
				this._notifier.warning('Invalid row selected!');
				return;
			}

			const circuit: LiveCircuitEntry | null = this.findCircuitByAni(ani);
			if (circuit === null) {
				this._notifier.warning('Could not find circuit for selected row!');
				return;
			}

			let matchesSelected: boolean = false;
			if (CommonHelper.isDefined(checkMatch) && checkMatch) {
				if (this.selectedCircuit !== null) {
					matchesSelected = this.isLiveCircuitMatch(this.selectedCircuit, ani, callId);
				}
			}

			if (this.offModeActive) {
				if (matchesSelected) {
					// Deselect if clicking an already selected row.
					this.changeCircuitSelection(null);
				} else {
					this.changeCircuitSelection(circuit);
				}
			} else {
				if (matchesSelected) {
					// Already playing selected call
					console.log('Selected already playing');
					return;
				}

				if (this.cycleModeActive) {
					// Cancel any existing cycle, change to listen mode, then play selected
					this._$interval.cancel(this._cyclePromise);
					this.setListenMode(true);
				}

				this.tryPlayAudio(circuit);
			}
		}

		private tryPlayAudio(circuit: LiveCircuitEntry): void {
			if (this.circuitHasActiveCall(circuit)) {
				this.changeCircuitSelection(circuit);
				this.broadcastPlayCircuitAudio(circuit);
			} else {
				this.changeCircuitSelection(null); // Deselect any selected circuit since it's not playable.
				this._notifier.warning('No active call to listen to!', `Circuit ${circuit!.description}`);
			}
		}

		private setCyclePromise(): void {
			this._$interval.cancel(this._cyclePromise); // Cancel promise just in case.

			// Invoke once to start cycle.
			this.onCycle();

			let msPerCycle: number;
			if (this.settings.secondsPerCycle === null || this.settings.secondsPerCycle === undefined || this.settings.secondsPerCycle === 0) {
				msPerCycle = this._defaults.settings.secondsPerCycle;
			} else if (this.settings.secondsPerCycle % 1 !== 0) {
				msPerCycle = this._defaults.settings.secondsPerCycle;
			} else {
				msPerCycle = this.settings.secondsPerCycle * 1000;
			}

			// Invoke every n seconds.
			this._cyclePromise = this._$interval((): void => {
				if (this._recreateCyclePromise) {
					this._recreateCyclePromise = false;
					this.setCyclePromise();
				} else {
					this.onCycle();
				}
			}, msPerCycle);
		}

		private onCycle(): void {
			let haveStartingCircuit: boolean;
			let searchByCircuit: LiveCircuitEntry | null = null;
			let newCircuit: LiveCircuitEntry | null;

			if (this._startingCycleCircuit) {
				haveStartingCircuit = true;
				searchByCircuit = this._startingCycleCircuit;
				newCircuit = this._startingCycleCircuit;
				this._prevCycleCircuit = null;
			} else {
				haveStartingCircuit = false;

				//searchAni = this._prevCycleCircuit.ani;
				if (this._prevCycleCircuit) {
					searchByCircuit = this._prevCycleCircuit;
					newCircuit = this.findNextActiveCircuit(this._prevCycleCircuit.ani);
				} else {
					newCircuit = this.findNextActiveCircuit(null);
				}
			}

			if (newCircuit === null || newCircuit === undefined) {
				if (haveStartingCircuit) {
					this._notifier.warning('Invalid row selected!');
					this._startingCycleCircuit = null;
				} else {
					this._notifier.warning('No circuit with a currently active call to cycle to!');
					this._prevCycleCircuit = null;
				}
			} else if (searchByCircuit === null || searchByCircuit === undefined) {
				this.changeCircuitSelection(newCircuit);
				//this.selectedCircuit = newCircuit;
				this.broadcastChangePlayingCircuit(newCircuit);
				this._prevCycleCircuit = newCircuit;
			} else if (this.isLiveCircuitMatch(newCircuit, searchByCircuit.ani, searchByCircuit.call.callId)) {
				// Just stay on current circuit since it's the only one with an active call.
				return;
			} else {
				if (haveStartingCircuit && !this.circuitHasActiveCall(newCircuit)) {
					this._notifier.warning('The selected circuit has no active call to listen to!');
				} else {
					this.changeCircuitSelection(newCircuit);
					//this.selectedCircuit = newCircuit;
					this.broadcastChangePlayingCircuit(newCircuit);
					this._prevCycleCircuit = newCircuit;
				}

				this._startingCycleCircuit = null;
			}
		}

		public onCallEnd(): void {
			this._notifier.info('Call has ended', `Circuit ${this.selectedCircuit!.description}`);
			if (this.cycleModeActive) {
				this.setCyclePromise();
			}
		}

		// Returns true if circuit was found and has current active call.
		private broadcastPlayCircuitAudio(circuit: LiveCircuitEntry): void {
			if (circuit === null || circuit === undefined) {
				this._notifier.warning('Invalid circuit selected!');
			}

			// ReSharper disable once QualifiedExpressionMaybeNull
			if (circuit !== null && circuit.call !== null) {
				if (circuit.call.callStatus === CallStatus.ON) {
					this._$scope.$broadcast('playCircuitAudio', circuit);
				} else {
					this._notifier.warning('There is currently no live call to play on the selected circuit.');
				}
			} else {
				this._notifier.warning('Invalid circuit selected!');
			}
		}

		private broadcastChangePlayingCircuit(circuit: LiveCircuitEntry): void {
			if (circuit !== null && circuit !== undefined) {
				if (circuit.call.callStatus === CallStatus.ON) {
					this._$scope.$broadcast('changePlayingCircuit', circuit);
				} else {
					this._notifier.warning('There is currently no live call to play on the selected circuit.');
				}
			} else {
				this._notifier.warning('Invalid circuit selected!');
			}
		}

		private broadcastStopPlayingCircuit(): void {
			this._$scope.$broadcast('stopPlayingCircuit');
		}

		// #endregion Audio

		// #region Circuits

		public getCallStatusTitle(callStatus: CallStatus): string {
			let result: string = 'Status Unknown';

			switch (callStatus) {
				case CallStatus.ON:
					result = 'Ongoing Call';
					break;
				case CallStatus.OFF:
					result = 'No Call';
					break;
				case CallStatus.BLOCKED:
					result = 'Call Blocked';
					break;
				case CallStatus.NOT_RECORDED:
					result = 'Not Recorded';
					break;
			}

			return result;
		}

		public onSelectedFacilitiesChanged = _.debounce(this.loadCircuits, 1000);
		private _prevSelectedSiteIds: Array<string> = new Array<string>();

		private loadCircuits(): void {
			this.loadingCircuits = true;

			const selectedSiteIds: Array<string> = this.getSelectedSiteIds();

			// Only run load if there has been a change since the last time circuits were loaded.
			if (_.isEqual(this._prevSelectedSiteIds, selectedSiteIds)) {
				this.loadingCircuits = false;
				return;
			}

			this._prevSelectedSiteIds = angular.copy(selectedSiteIds);

			if (selectedSiteIds.length > 0) {
				this.facilitiesSelected = true;

				if (selectedSiteIds.length > 1) {
					this.showFacility = true;
				} else {
					this.showFacility = false;
				}

				this._prodigyApiService.getCircuits(selectedSiteIds)
					.then((result: Array<CircuitDto>): void => {
						this.circuits = new Array<LiveCircuitEntry>();
						for (let i = 0; i < result.length; i++) {
							this.circuits.push({ ...result[i], facilityName: this.getFacilityName(result[i].siteId), call: new Call() });
						}

						// Reset call history
						this.clearCallHistory();

						this.loadingCircuits = false;
					}, (err: any): void => {
						switch (err.status) {
							case 200:
								// If it returns with a redirect, the status returns 200
								// even though we're in the error callback function...
								// So just continue on and let browser redirect.
								break;
							default:
								this._logService.logError('Error loading circuit list', err);
								this._notifier.error('An unexpected error occurred when trying to load circuits', 'Application Error');
								break;
						}
						this.loadingCircuits = false;
					});
			} else {
				this._$scope.$apply(() => {
					this.facilitiesSelected = false;
					this.circuits = new Array<LiveCircuitEntry>();
					this.clearCallHistory();
					this.loadingCircuits = false;
				});
			}
		}

		private getSelectedSiteIds(): Array<string> {
			const selectedSiteIds: Array<string> = new Array<string>();
			for (let i = 0; i < this.facilityOptions.length; i++) {
				if (this.facilityOptions[i].selected) {
					selectedSiteIds.push(this.facilityOptions[i].data);
				}
			}
			return selectedSiteIds;
		}

		private loadFacilities(): void {
			this.loadingFacilities = true;

			this._userService.getFacilities()
				.then((result: Array<any>): void => {
					const tempOptions: MultiselectOption[] = [];
					let index: number = 0;
					Object.keys(result).forEach((key) => {
						this.facilities.push({ siteId: key, name: result[key] });

						tempOptions.push({ id: index, label: result[key], selected: true, data: key });
						index++;
					});

					// Sort by facility name ascending
					this.facilityOptions = _.sortBy(tempOptions, (item) => {
						return item.label.toLowerCase();
					});

					if (this.facilityOptions.length > 1) {
						this.showFacility = true;
					} else {
						this.showFacility = false;
					}

					this.loadingFacilities = false;

					this.loadCircuits();
				}, (err: any): void => {
					this.facilities = new Array<Facility>();
					this.circuits = new Array<LiveCircuitEntry>();

					this._logService.logError('Error loading facility list', err);
					this._notifier.error('An unexpected error occurred when trying to load facility list', 'Application Error');

					this.loadingFacilities = false;
				});
		}

		private getFacilityName(siteId: string): string {
			for (let i = 0; i < this.facilities.length; i++) {
				if (this.facilities[i].siteId.toUpperCase() === siteId.toUpperCase()) {
					return this.facilities[i].name;
				}
			}

			return '';
		}

		private callStarted(msg: CallStartMsg, circuit: LiveCircuitEntry): void {
			// New call, clear possibly existing call info
			circuit.call = new Call();

			// Update call data for matching circuit.
			this.setCallHeaders(circuit.call, msg.header);
			circuit.call.maxDuration = msg.data.maxDuration;
			circuit.call.startTime = angular.copy(msg.msgTime);

			if (msg.data.recorded) {
				circuit.call.callStatus = CallStatus.ON;
				if (CommonHelper.isDefined(this.selectedCircuit)) {
					if (this.parkModeActive && this.selectedCircuit.ani === circuit.ani) {
						this.broadcastPlayCircuitAudio(circuit);
					}
				}
			} else {
				circuit.call.callStatus = CallStatus.NOT_RECORDED;
			}
		}

		private callEnded(msg: CallEndMsg, circuit: LiveCircuitEntry): void {
			if (!circuit.call) {
				circuit.call = new Call();
			}

			// Update call data for matching circuit.
			this.setCallHeaders(circuit.call, msg.header);
			circuit.call.terminateCode = msg.data.terminateCode;
			circuit.call.blockCode = msg.data.blockCode;
			circuit.call.curDuration = msg.data.duration;
			circuit.call.endTime = angular.copy(msg.msgTime);

			const blockCodeInt: number = parseInt(msg.data.blockCode);
			circuit.call.callStatus = (blockCodeInt === 0) ? CallStatus.OFF : CallStatus.BLOCKED;
		}

		private isLiveCircuitMatch(circuit: LiveCircuitEntry | null, ani: string | null, callId: number | null): boolean {
			if (circuit) {
				if (circuit.call) {
					return circuit.ani === ani && circuit.call.callId === callId;
				} else {
					return circuit.ani === ani && callId === null;
				}
			}

			return ani === null && callId === null;
		}

		private circuitHasActiveCall(circuit: LiveCircuitEntry | null): circuit is LiveCircuitEntry {
			if (circuit !== null && circuit !== undefined) {
				if (circuit.call !== null && circuit.call !== undefined) {
					return circuit.call.callStatus === CallStatus.ON;
				}
			}

			return false;
		}

		private findCircuitByAni(ani: string | null): LiveCircuitEntry | null {
			if (ani === null || ani === undefined) {
				return null;
			}

			for (let i = 0; i < this.circuits.length; i++) {
				if (this.circuits[i].ani === ani) {
					return this.circuits[i];
				}
			}

			return null;
		}

		private findNextActiveCircuit(prevAni: string | null): LiveCircuitEntry | null {
			let prevCircuitIndex: number | null = null;

			if (prevAni === null) {
				for (let i = 0; i < this.circuits.length; i++) {
					if (this.circuits[i].call !== null &&
						this.circuits[i].call !== undefined &&
						this.circuits[i].call.callStatus === CallStatus.ON) {
						return this.circuits[i];
					}
				}

				return null;
			} else {
				for (let i = 0; i < this.circuits.length; i++) {
					if (this.circuits[i].ani === prevAni) {
						prevCircuitIndex = i;
						break;
					}
				}
			}

			// If prevAni was provided, start with circuit at subsequent index.
			let curIndex: number = prevCircuitIndex === null ? 0 : prevCircuitIndex + 1;
			let ct: number = 0;
			let curCircuit: LiveCircuitEntry;
			while (ct < this.circuits.length) {
				if (curIndex === this.circuits.length) {
					curIndex = 0;
				}

				curCircuit = this.circuits[curIndex];
				if (curCircuit.call !== null &&
					curCircuit.call !== undefined &&
					curCircuit.call.callStatus === CallStatus.ON) {
					return curCircuit;
				}

				curIndex++;
				ct++;
			}

			return null;
		}

		private setCallHeaders(call: Call, header: RtcmMsgHeader): void {
			call.callId = header.callId;
			call.lineId = header.lineId;
			call.unitId = header.unitId;

			call.pin = header.pin;
			call.calledNumber = header.calledNumber;
			call.inmateFirstName = header.inmateFirstName;
			call.inmateMiddleName = header.inmateMiddleName;
			call.inmateLastName = header.inmateLastName;
		}

		// #endregion Circuits

		// #region Signal-R

		private activateEvents(): void {
			this._$scope.$on(Constants.signalREventNames.onConnected,
				(event: ng.IAngularEvent, args: any): void => {
					this._$timeout((): void => {
						this.isConnectedSignalR = true;
						this.signalRConnectionId = args.connectionId;
					});
				});

			this._$scope.$on(Constants.signalREventNames.onAddCallStartMsg,
				(event: ng.IAngularEvent, args: any): void => {
					this._$timeout((): void => {
						const msg: CallStartMsg = args.msg as CallStartMsg;
						const circuit: LiveCircuitEntry | null = this.findCircuitByAni(msg.header.ani);

						if (circuit) {
							msg.currentStatus = (msg.data.recorded) ? CallStatus.ON : CallStatus.NOT_RECORDED;

							const startTime: string | null = FormatHelper.getTimeDisplay(msg.header.startDateTime);
							msg.msgTime = startTime === null ? '' : startTime;

							// Update row in circuit table
							this.callStarted(msg, circuit);

							msg.facilityName = this.getFacilityName(msg.header.siteId);
							msg.circuitName = circuit.description;
							msg.inmateName = FormatHelper.getNameDisplay(msg.header.inmateFirstName, msg.header.inmateMiddleName, msg.header.inmateLastName);

							// Add to message history table
							this.addRtcmMsg(msg);

							this.checkAlerts(msg);
						}
					});
				});

			this._$scope.$on(Constants.signalREventNames.onAddCallEndMsg,
				(event: ng.IAngularEvent, args: any): void => {
					this._$timeout((): void => {
						const msg: CallEndMsg = args.msg as CallEndMsg;
						const circuit: LiveCircuitEntry | null = this.findCircuitByAni(msg.header.ani);

						// TODO Move call block event to separate message from RTCM
						if (parseInt(msg.data.blockCode) !== 0) {
							msg.header.eventCode = CtrlMsgType.WM_CTRL_MSG_EVENT_CALLBLOCK;
							msg.currentStatus = CallStatus.BLOCKED;
						} else {
							msg.currentStatus = CallStatus.OFF;
						}

						if (circuit) {
							const startTime: string | null = FormatHelper.getTimeDisplay(msg.header.startDateTime);
							const endTime: string | null = FormatHelper.getEndTimeDisplay(startTime, msg.data.duration);
							msg.msgTime = endTime === null ? '' : endTime;

							if (!CommonHelper.isDefined(msg.facilityName)) {
								msg.facilityName = this.getFacilityName(msg.header.siteId);
							}

							// Update row in circuit table
							this.callEnded(msg, circuit);

							msg.circuitName = circuit.description;
							msg.inmateName = FormatHelper.getNameDisplay(msg.header.inmateFirstName, msg.header.inmateMiddleName, msg.header.inmateLastName);

							// Add to message history table
							this.addRtcmMsg(msg);
						}
					});
				});

			this._$scope.$watch(() => this.settings.secondsPerCycle,
				(oldValue: number, newValue: number) => {
					if (oldValue !== newValue) {
						if (this.settings.secondsPerCycle !== null && this.settings.secondsPerCycle !== undefined) {
							if (this.settings.secondsPerCycle < this._minSecondsPerCycle) {
								this.settings.secondsPerCycle = this._minSecondsPerCycle;
								this._notifier.warning(`Minimum seconds per cycle is ${this._minSecondsPerCycle}`);
							}
						}
						this._recreateCyclePromise = true;
					}
				});

			// If right-click context menu is open, close it on user clicking elsewhere.
			$(document).bind('click',
				(event) => {
					if (!this.showCtxMenu) {
						return;
					}

					const ctxMenu = $(`#${this.ctxMenuId}`);
					const isClickedOfCtxMenu = ctxMenu.find(event.target).length > 0;

					if (isClickedOfCtxMenu) {
						return;
					}

					this._$scope.$apply(() => {
						this.toggleCircuitCtxMenu(false);
					});
				});

			this._$window.addEventListener('scroll', () => {
				this.closeCtxMenu();
			});
		}

		private addRtcmMsg(msg: ICallMsg): void {
			if (!this.pauseCallHistoryActive) {
				let msgFound: boolean = false;
				if (msg.currentStatus === CallStatus.OFF) {
					for (let i = 0; i < this.rtcmMessages.length; i++) {
						if (this.isCallMatch(this.rtcmMessages[i], msg)) {
							// Update the call status and time field.
							const msgToChange: ICallMsg = this.rtcmMessages[i];
							this._$timeout((): void => {
								msgToChange.currentStatus = msg.currentStatus;
								msgToChange.msgTime = msg.msgTime;
							});

							msgFound = true;
							break;
						}
					}
				}

				if (!msgFound) {
					this.rtcmMessages.unshift(msg);
					if (this.rtcmMessages.length > this._maxMessages) {
						this.rtcmMessages.pop();
					}
				}
			}
		}

		private isCallMatch(callMsg1: ICallMsg, callMsg2: ICallMsg): boolean {
			return (callMsg1.header.callId === callMsg2.header.callId &&
				callMsg1.header.lineId === callMsg2.header.lineId &&
				callMsg1.header.unitId === callMsg2.header.unitId);
		}

		// #endregion Signal-R

		// #region Context Menu

		public openCircuitCtxMenu($event, circuit: LiveCircuitEntry): void {
			// If right click
			if ($event.which === 3) {
				$event.preventDefault();

				this.ctxMenuFromCircuits = true;

				this.toggleCircuitCtxMenu(true, circuit);
				this.setCircuitCtxMenuPosition($event.clientY, $event.clientX);
			}
		}

		public openCircuitCtxMenuFromMsg($event, msg: ICallMsg): void {
			// If right click
			if ($event.which === 3) {
				$event.preventDefault();

				this.ctxMenuFromCircuits = false;

				const circuit: LiveCircuitEntry | null = this.findCircuitByAni(msg.header.ani);
				if (CommonHelper.isDefined(circuit)) {
					if (!this.pauseCallHistoryActive) {
						this.pauseCallHistoryActive = true;
						this.ctxMenuPausedHistory = true;
					}

					this.toggleCircuitCtxMenu(true, circuit);
					this.setCircuitCtxMenuPosition($event.clientY, $event.clientX);
				}
			}
		}

		private closeCtxMenu(): void {
			if (!this.showCtxMenu) {
				return;
			}

			if (!this.closingCtxMenu) {
				this.closingCtxMenu = true;

				this._$window.requestAnimationFrame(() => {
					$(`#${this.ctxMenuId}`)[0].style.display = 'none';

					if (this.ctxMenuPausedHistory) {
						this.pauseCallHistoryActive = false;
						this.ctxMenuPausedHistory = false;
					}

					this.closingCtxMenu = false;
				});
			}
		}

		public ctxMenuSelectCircuit(): void {
			this.selectCtxMenuCircuit();

			this.toggleCircuitCtxMenu(false);
		}

		public ctxMenuListen(): void {
			// Order here matters.
			// Select circuit function will act differently depending on which mode is enabled.
			this.setListenMode(true);
			this.selectCtxMenuCircuit();

			if (this.selectedCircuit) {
				this.tryPlayAudio(this.selectedCircuit);
			}

			this.toggleCircuitCtxMenu(false);
		}

		public ctxMenuPark(): void {
			// Order here matters.
			// Select circuit function acts differently depending on which mode is enabled.
			this.setParkMode(true);
			this.selectCtxMenuCircuit();

			this.toggleCircuitCtxMenu(false);
		}

		public ctxMenuCreateCalledNumberAlert(): void {
			let added: boolean = false;
			if (CommonHelper.isDefined(this.ctxMenuCircuit) && CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
				if (CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.calledNumber)) {
					this.addNumberAlert(this.ctxMenuCircuit.call.calledNumber);
					added = true;
				}
			}

			if (!added) {
				this._notifier.warning('This circuit does not have a called phone number to add an alert for!');
			}

			this.toggleCircuitCtxMenu(false);
		}

		public ctxMenuCreateInmateAlert(): void {
			let added: boolean = false;
			if (CommonHelper.isDefined(this.ctxMenuCircuit) && CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
				if (CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.pin)) {
					const alertInmateAccount: InmateAccount = new InmateAccount();
					alertInmateAccount.pin = this.ctxMenuCircuit.call.pin;
					alertInmateAccount.siteId = this.ctxMenuCircuit.siteId;
					alertInmateAccount.nameDisplay = this.ctxMenuCircuit.call.inmateName;
					alertInmateAccount.apin = FormatHelper.getApinFromPin(this.ctxMenuCircuit.call.pin);

					this.addInmateAlert(alertInmateAccount);
					added = true;
				}
			}

			if (!added) {
				this._notifier.warning('Circuit does not have an inmate to add an alert for!');
			}

			this.toggleCircuitCtxMenu(false);
		}

		public ctxMenuDisconnectCall(): void {
			// Order here matters
			this.selectCtxMenuCircuit();
			this.toggleCircuitCtxMenu(false);
			this.disconnectSelectedCall();
		}

		public ctxMenuClearCallHistory(): void {
			this.clearCallHistory();
			this.toggleCircuitCtxMenu(false);
		}

		public ctxMenuCircuitHasActiveCall(): boolean {
			if (CommonHelper.isDefined(this.ctxMenuCircuit) && CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
				return (this.ctxMenuCircuit.call.callStatus === CallStatus.ON);
			}

			return false;
		}

		public ctxMenuCircuitHasCalledNum(): boolean {
			if (CommonHelper.isDefined(this.ctxMenuCircuit) && CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
				return (CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.calledNumber));
			}

			return false;
		}

		public ctxMenuCircuitHasInmate(): boolean {
			if (CommonHelper.isDefined(this.ctxMenuCircuit) && CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
				return (CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.pin) && CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.siteId));
			}

			return false;
		}

		public ctxMenuCancel(): void {
			this.toggleCircuitCtxMenu(false);
		}

		private selectCtxMenuCircuit(): void {
			this.setSelectedCircuit(this.ctxMenuCircuit!.ani, this.ctxMenuCircuit!.call!.callId, true);
		}

		private toggleCircuitCtxMenu(open: boolean, circuit?: LiveCircuitEntry): void {
			if (open) {
				if (CommonHelper.isDefined(circuit)) {
					this.ctxMenuCircuit = angular.copy(circuit);
					this.showCtxMenu = true;
				}
			} else {
				this.ctxMenuCircuit = null;
				this.showCtxMenu = false;
				($(`#${this.ctxMenuId}`)[0]).style.display = 'none';

				if (this.ctxMenuPausedHistory) {
					this.pauseCallHistoryActive = false;
					this.ctxMenuPausedHistory = false;
				}
			}
		}

		private setCircuitCtxMenuPosition(top: any, left: any): void {
			const ctxMenu = $(`#${this.ctxMenuId}`)[0];

			ctxMenu.style.display = 'block';
			ctxMenu.style.left = `${left}px`;
			ctxMenu.style.top = `${top}px`;
		}

		// #endregion Context Menu

		// #region Alerts

		private checkAlerts(msg: CallStartMsg): void {
			this.checkAlertCalledNumber(msg);
			this.checkAlertInmate(msg);
		}

		private checkAlertCalledNumber(msg: CallStartMsg): void {
			if (!this.dialogModalOpen && msg.header.calledNumber === this.settings.alertCalledNumber) {
				let alertNumber: PhoneNumber | null = null;
				for (let i = 0; i < this.settings.alertSelectedNumbers.length; i++) {
					if (this.settings.alertSelectedNumbers[i].cleaned === msg.header.calledNumber) {
						alertNumber = this.settings.alertSelectedNumbers[i];
						break;
					}
				}

				if (alertNumber !== null) {
					// ReSharper disable once QualifiedExpressionMaybeNull
					let dialogMsg: string = `The phone number '${alertNumber.display}' is being called`;
					if (CommonHelper.isDefinedNotWhitespace(msg.inmateName)) {
						dialogMsg += ` by ${msg.inmateName}. Would you like to start listening?`;
					} else {
						dialogMsg += '. Would you like to start listening?';
					}

					this.dialogModalOpen = true;
					this._basicModal.showModal('Phone # Called Alert', dialogMsg, 'Yes', 'No').result.then(
						() => { // User selected "Yes"
							// Order here matters.
							this.setListenMode(true);
							this.setSelectedCircuit(msg.header.ani, msg.header.callId, true);

							if (this.selectedCircuit) {
								this.tryPlayAudio(this.selectedCircuit);
							}

							this.dialogModalOpen = false;
						}, () => { // User selected "No"
							this.dialogModalOpen = false;
						});
				}
			}
		}

		private checkAlertInmate(msg: CallStartMsg): void {
			if (!this.dialogModalOpen) {
				let found: boolean = false;
				let inmateName: string = '';
				for (let i = 0; i < this.settings.alertSelectedInmates.length; i++) {
					if (this.settings.alertSelectedInmates[i].pin === msg.header.pin && this.settings.alertSelectedInmates[i].siteId === msg.header.siteId) {
						found = true;
						inmateName = this.settings.alertSelectedInmates[i].nameDisplay;
						break;
					}
				}

				if (found) {
					const dialogMsg: string = `The inmate '${inmateName}' has started a call. Would you like to start listening?`;

					this.dialogModalOpen = true;
					this._basicModal.showModal('Inmate Alert', dialogMsg, 'Yes', 'No').result.then(
						() => { // User selected "Yes"
							// Order here matters.
							this.setListenMode(true);
							this.setSelectedCircuit(msg.header.ani, msg.header.callId, true);

							if (this.selectedCircuit) {
								this.tryPlayAudio(this.selectedCircuit);
							}

							this.dialogModalOpen = false;
						}, () => { // User selected "No"
							this.dialogModalOpen = false;
						});
				}
			}
		}

		public keypressAddNumberAlert($event): void {
			if ($event.which === 13) {
				$event.preventDefault();

				this.addNumberAlert(this.settings.alertCalledNumber);
			}
		}

		public addNumberAlert(number: string): void {
			const cleanedNumber: string = FormatHelper.getOnlyDigits(number);

			if (cleanedNumber.length !== 10) {
				this._notifier.warning('Phone numbers must contain exactly 10 digits.', 'Invalid Called Number Alert');
				return;
			}

			if (this.calledNumberAlertExists(cleanedNumber)) {
				this._notifier.warning('There is already an alert for that phone number!', 'Duplicate Called Number Alert');
			} else {
				const alertCalledNumber: PhoneNumber = new PhoneNumber();
				alertCalledNumber.display = FormatHelper.getPhoneDisplay(cleanedNumber);
				alertCalledNumber.cleaned = cleanedNumber;

				this.settings.alertSelectedNumbers.push(alertCalledNumber);
				this.settings.alertCalledNumber = '';

				this._notifier.success(`Phone alert added for phone number ${alertCalledNumber.display}`, 'Phone Alert Added');
			}
		}

		public removeNumberAlert(index) {
			this.settings.alertSelectedNumbers.splice(index, 1);
		}

		public calledNumberAlertExists(cleanedNumber: string): boolean {
			for (let i = 0; i < this.settings.alertSelectedNumbers.length; i++) {
				if (this.settings.alertSelectedNumbers[i].cleaned === cleanedNumber) {
					return true;
				}
			}

			return false;
		}

		public formatInmate(record) {
			return record ? `${record.name} (${record.facilityName})` : '';
		}

		public addInmateAlert($model: InmateAccount) {
			if (this.inmateAlertExists($model.pin, $model.siteId)) {
				this._notifier.warning('There is already an alert for that inmate!', 'Duplicate Inmate Alert');
			} else {
				this.settings.alertSelectedInmates.push($model);
				this._notifier.success(`Inmate alert added for inmate ${$model.nameDisplay}`, 'Inmate Alert Added');
			}
		}

		public removeInmateAlert(index) {
			this.settings.alertSelectedInmates.splice(index, 1);
		}

		public inmateAlertExists(pin: string, siteId: string): boolean {
			for (let i = 0; i < this.settings.alertSelectedInmates.length; i++) {
				if (this.settings.alertSelectedInmates[i].pin === pin &&
					this.settings.alertSelectedInmates[i].siteId === siteId) {
					return true;
				}
			}

			return false;
		}

		public searchInmates(viewValue) {
			this.isLoadingInmateTypeahead = true;

			const selectedSiteIds: Array<string> | null = this.getSelectedSiteIds();
			return this._inmateService.getInmates(viewValue, selectedSiteIds).then(
				(result: any) => {
					var returnResults: Array<any> = [];

					for (let i = 0; i < result.length && i < this._inmatesTypeaheadLimitTo - 1; i++) {
						returnResults.push(result[i]);
					}

					this.isLoadingInmateTypeahead = false;
					return returnResults;
				}, (): void => {
					this._notifier.error('Application Error', 'Unable to search for inmates.');
					this.isLoadingInmateTypeahead = false;
				});
		}

		// #endregion Alerts

		private disposeEvents(): void {
			// $interval doesn't handle disposal on leaving page, so handle it here.
			this._$scope.$on(this.disposeEvent,
				(): void => {
					console.log(`circuitlist.controller this._$scope.$on('${this.disposeEvent}')`);
					this._$interval.cancel(this._cyclePromise);
				});

			this._$window.onbeforeunload = (): void => {
				console.log('circuitlist.controller cancelling cycle');
				this._$interval.cancel(this._cyclePromise);
			}
		}
	}

	// #region Interfaces/Classes

	export interface ICallMsg {
		header: RtcmMsgHeader;
		currentStatus: CallStatus;
		circuitName: string;
		msgTime: string;
		inmateName: string;
	}

	export class CallStartMsg implements EventCallStartMsg, ICallMsg {
		header: RtcmMsgHeader;
		data: EventCallStartData;
		currentStatus: CallStatus;
		facilityName: string;
		circuitName: string;
		msgTime: string;
		inmateName: string;
	}

	export class CallEndMsg implements EventCallEndMsg, ICallMsg {
		header: RtcmMsgHeader;
		data: EventCallEndData;
		currentStatus: CallStatus;
		facilityName: string;
		circuitName: string;
		msgTime: string;
		inmateName: string;
	}

	export class CircuitModeSettings {
		secondsPerCycle: number = 30;
		alertInmate: string = '';
		alertCalledNumber: string = '';
		alertSelectedInmates: Array<InmateAccount> = new Array<InmateAccount>();
		alertSelectedNumbers: Array<PhoneNumber> = new Array<PhoneNumber>();
	}

	export class PhoneNumber {
		display: string;
		cleaned: string;
	}

	export class Facility {
		public siteId: string;
		public name: string;
	}

	// #endregion Interfaces/Classes

	angular
		.module('LiveMonitor.Circuits')
		.controller('CircuitListController', CircuitListController);
}
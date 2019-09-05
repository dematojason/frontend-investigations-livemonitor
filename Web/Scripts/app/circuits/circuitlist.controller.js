var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var LiveMonitor;
(function (LiveMonitor) {
    var Circuits;
    (function (Circuits) {
        var CircuitListDefaults = /** @class */ (function () {
            function CircuitListDefaults() {
                this.disposeEvent = 'liveMonitor.locationChangeStart.leavingCircuits';
                this.settings = new CircuitModeSettings();
                this.title = 'Live Calls';
                this.inmateTypeaheadTooltipText = "Type to search inmates, then select chosen inmate from the list";
                this.disconnectingCall = false;
                this.isPageLoading = true;
                this.loadingCircuits = true;
                this.loadingFacilities = true;
                this.facilitiesSelected = true;
                this.showCtxMenu = false;
                this.dialogModalOpen = false;
                this.isLoadingInmateTypeahead = false;
                this.closingCtxMenu = false;
                this.ctxMenuFromCircuits = false;
                this.ctxMenuPausedHistory = false;
                this.showFacility = false;
                this.pauseCallHistoryImgSrc = LiveMonitor.Constants.imgSources.pauseCallHistory;
                this.clearCallHistoryImgSrc = LiveMonitor.Constants.imgSources.clearCallHistory;
                this.clearAlertHistoryImgSrc = LiveMonitor.Constants.imgSources.clearAlertHistory;
                this.disconnectCallImgSrc = LiveMonitor.Constants.imgSources.disconnectCall;
                this.pauseCallHistoryActive = false;
                this.cycleImgSrc = LiveMonitor.Constants.imgSources.cycleMode;
                this.listenImgSrc = LiveMonitor.Constants.imgSources.listenMode;
                this.offImgSrc = LiveMonitor.Constants.imgSources.offMode;
                this.parkImgSrc = LiveMonitor.Constants.imgSources.parkMode;
                this.cycleModeActive = false;
                this.listenModeActive = false;
                this.offModeActive = true;
                this.parkModeActive = false;
            }
            return CircuitListDefaults;
        }());
        var CircuitListController = /** @class */ (function () {
            function CircuitListController(circuitsHub, // This is being used for access to $scope.$on broadcasts
            _audioService, _basicModal, _inmateService, _prodigyApiService, _logService, _notifier, _userService, _$interval, _$scope, _$timeout, _$window) {
                this.circuitsHub = circuitsHub;
                this._audioService = _audioService;
                this._basicModal = _basicModal;
                this._inmateService = _inmateService;
                this._prodigyApiService = _prodigyApiService;
                this._logService = _logService;
                this._notifier = _notifier;
                this._userService = _userService;
                this._$interval = _$interval;
                this._$scope = _$scope;
                this._$timeout = _$timeout;
                this._$window = _$window;
                this.callStatus = LiveMonitor.CallStatus;
                this.ctrlMsgType = LiveMonitor.CtrlMsgType;
                this.ctxMenuId = 'circuitCtxMenu';
                this.circuitsTableBodyId = 'circuitsTableBody';
                this.circuits = new Array();
                this.facilities = new Array();
                this.rtcmMessages = new Array();
                this.facilityOptions = [];
                // Signal-R
                this.isConnectedSignalR = false;
                this._inmatesTypeaheadLimitTo = 15;
                this._recreateCyclePromise = false;
                this._maxMessages = 500;
                this._minSecondsPerCycle = 15;
                this._prevCycleCircuit = null;
                this._startingCycleCircuit = null;
                this.$onInit = function () { };
                this.onSelectedFacilitiesChanged = _.debounce(this.loadCircuits, 1000);
                this._prevSelectedSiteIds = new Array();
                this._defaults = new CircuitListDefaults();
                LiveMonitor.CommonHelper.mapProperties(this, this._defaults);
                this.disposeEvents();
                this.loadFacilities(); // This loads facilities and circuits.
                this.activateEvents();
                this.isPageLoading = false;
            }
            // #region Audio
            CircuitListController.prototype.toggleCycleMode = function () {
                if (this.cycleModeActive) {
                    this.setCycleMode(false);
                }
                else {
                    this.setCycleMode(true);
                    this.setCyclePromise();
                }
                return true; // Always return true indicating toggle action as valid.
            };
            CircuitListController.prototype.toggleListenMode = function () {
                if (this.listenModeActive) {
                    this.setListenMode(false);
                }
                else {
                    this.setListenMode(true);
                    if (this.selectedCircuit) {
                        this.tryPlayAudio(this.selectedCircuit);
                    }
                }
                return true; // Always return true indicating toggle action as valid.
            };
            CircuitListController.prototype.toggleOffMode = function () {
                var result;
                if (this.offModeActive) {
                    result = this.setOffMode(false);
                }
                else {
                    result = this.setOffMode(true);
                    this.listenModeActive = false;
                    this.parkModeActive = false;
                    this.setCycleMode(false);
                    this.broadcastStopPlayingCircuit();
                }
                return result;
            };
            CircuitListController.prototype.toggleParkMode = function () {
                if (this.parkModeActive) {
                    this.setParkMode(false);
                }
                else {
                    this.setParkMode(true);
                    if (this.selectedCircuit) {
                        this.tryPlayAudio(this.selectedCircuit);
                    }
                }
                return true; // Always return true indicating toggle action as valid.
            };
            CircuitListController.prototype.setCycleMode = function (enable) {
                if (enable === this.cycleModeActive) {
                    return;
                }
                if (enable) {
                    this.cycleModeActive = true;
                    this.listenModeActive = false;
                    this.parkModeActive = false;
                    this.setOffMode(false);
                }
                else {
                    this.cycleModeActive = false;
                    this._$interval.cancel(this._cyclePromise);
                    if (!this.listenModeActive && !this.offModeActive && !this.parkModeActive) {
                        this.setOffMode(true);
                    }
                }
            };
            CircuitListController.prototype.setListenMode = function (enable) {
                if (enable === this.listenModeActive) {
                    return;
                }
                if (enable) {
                    this.listenModeActive = true;
                    this.parkModeActive = false;
                    this.setCycleMode(false);
                    this.setOffMode(false);
                }
                else {
                    this.listenModeActive = false;
                    if (!this.cycleModeActive && !this.offModeActive && !this.parkModeActive) {
                        this.setOffMode(true);
                    }
                }
            };
            /**
             * Tries to set off mode to parameter enable.
             * Returns true if the action was carried out successfully.
             * @param enable Value to set offModeActive to.
             */
            CircuitListController.prototype.setOffMode = function (enable) {
                if (enable) {
                    this.offModeActive = true;
                    return true;
                }
                else if (this.cycleModeActive || this.listenModeActive || this.parkModeActive) {
                    // Only unpress off mode if there is another mode enabled.
                    this.offModeActive = false;
                    return true;
                }
                return false;
            };
            CircuitListController.prototype.setParkMode = function (enable) {
                if (enable === this.parkModeActive) {
                    return;
                }
                if (this.parkModeActive) {
                    this.parkModeActive = false;
                    if (!this.cycleModeActive && !this.listenModeActive && !this.offModeActive) {
                        this.setOffMode(true);
                    }
                }
                else {
                    this.parkModeActive = true;
                    this.listenModeActive = false;
                    this.setCycleMode(false);
                    this.setOffMode(false);
                }
            };
            CircuitListController.prototype.togglePauseCallHistory = function () {
                if (this.pauseCallHistoryActive) {
                    this.pauseCallHistoryActive = false;
                }
                else {
                    this.pauseCallHistoryActive = true;
                    this.ctxMenuPausedHistory = false;
                }
            };
            CircuitListController.prototype.clearCallHistory = function () {
                this.rtcmMessages = new Array();
            };
            CircuitListController.prototype.changeCircuitSelection = function (newVal) {
                this.selectedCircuit = newVal;
                this._$scope.$broadcast('changeSelectedCircuit', newVal);
            };
            CircuitListController.prototype.disconnectSelectedCall = function () {
                if (this.selectedCircuit === null || this.selectedCircuit === undefined || !this.circuitHasActiveCall(this.selectedCircuit)) {
                    this._notifier.warning('Please select a circuit with a currently active call!', 'Invalid Circuit Selected');
                }
                else {
                    this.disconnectCall(this.selectedCircuit.ani);
                }
            };
            CircuitListController.prototype.disconnectCall = function (ani) {
                var _this = this;
                if (this.disconnectingCall) {
                    return;
                }
                this.broadcastStopPlayingCircuit();
                var circuit = this.findCircuitByAni(ani);
                var dialogMsg = 'Are you sure you want to disconnect the current call on circuit ';
                if (circuit !== null && circuit !== undefined) {
                    dialogMsg += circuit.description;
                }
                var reconnectOnCancel = true;
                var reconnectCircuit = angular.copy(this.selectedCircuit);
                if (this.offModeActive) {
                    reconnectOnCancel = false;
                }
                this._basicModal.showModal('DISCONNECT CALL', dialogMsg, 'Yes', 'No')
                    .result.then(function () {
                    _this.disconnectingCall = true;
                    _this._audioService.disconnectCall(ani)
                        .then(function () {
                        var msgTitle = circuit === null || circuit === undefined ? undefined : circuit.description;
                        _this._notifier.success("Successfully disconnected call", msgTitle);
                        _this.disconnectingCall = false;
                    }, function (err) {
                        _this._notifier.error('An unexpected error has occurred. Failed to disconnect call.');
                        _this._logService.logError('Failed to disconnect call', err);
                        _this.disconnectingCall = false;
                    });
                }, function () {
                    // If user selected 'No', start streaming again if they were listening.
                    if (reconnectOnCancel) {
                        _this.setSelectedCircuit(reconnectCircuit.ani, reconnectCircuit.call.callId, false);
                    }
                });
            };
            CircuitListController.prototype.setSelectedCircuit = function (ani, callId, checkMatch) {
                if (ani === null || ani === undefined) {
                    this._notifier.warning('Invalid row selected!');
                    return;
                }
                var circuit = this.findCircuitByAni(ani);
                if (circuit === null) {
                    this._notifier.warning('Could not find circuit for selected row!');
                    return;
                }
                var matchesSelected = false;
                if (LiveMonitor.CommonHelper.isDefined(checkMatch) && checkMatch) {
                    if (this.selectedCircuit !== null) {
                        matchesSelected = this.isLiveCircuitMatch(this.selectedCircuit, ani, callId);
                    }
                }
                if (this.offModeActive) {
                    if (matchesSelected) {
                        // Deselect if clicking an already selected row.
                        this.changeCircuitSelection(null);
                    }
                    else {
                        this.changeCircuitSelection(circuit);
                    }
                }
                else {
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
            };
            CircuitListController.prototype.tryPlayAudio = function (circuit) {
                if (this.circuitHasActiveCall(circuit)) {
                    this.changeCircuitSelection(circuit);
                    this.broadcastPlayCircuitAudio(circuit);
                }
                else {
                    this.changeCircuitSelection(null); // Deselect any selected circuit since it's not playable.
                    this._notifier.warning('No active call to listen to!', "Circuit " + circuit.description);
                }
            };
            CircuitListController.prototype.setCyclePromise = function () {
                var _this = this;
                this._$interval.cancel(this._cyclePromise); // Cancel promise just in case.
                // Invoke once to start cycle.
                this.onCycle();
                var msPerCycle;
                if (this.settings.secondsPerCycle === null || this.settings.secondsPerCycle === undefined || this.settings.secondsPerCycle === 0) {
                    msPerCycle = this._defaults.settings.secondsPerCycle;
                }
                else if (this.settings.secondsPerCycle % 1 !== 0) {
                    msPerCycle = this._defaults.settings.secondsPerCycle;
                }
                else {
                    msPerCycle = this.settings.secondsPerCycle * 1000;
                }
                // Invoke every n seconds.
                this._cyclePromise = this._$interval(function () {
                    if (_this._recreateCyclePromise) {
                        _this._recreateCyclePromise = false;
                        _this.setCyclePromise();
                    }
                    else {
                        _this.onCycle();
                    }
                }, msPerCycle);
            };
            CircuitListController.prototype.onCycle = function () {
                var haveStartingCircuit;
                var searchByCircuit = null;
                var newCircuit;
                if (this._startingCycleCircuit) {
                    haveStartingCircuit = true;
                    searchByCircuit = this._startingCycleCircuit;
                    newCircuit = this._startingCycleCircuit;
                    this._prevCycleCircuit = null;
                }
                else {
                    haveStartingCircuit = false;
                    //searchAni = this._prevCycleCircuit.ani;
                    if (this._prevCycleCircuit) {
                        searchByCircuit = this._prevCycleCircuit;
                        newCircuit = this.findNextActiveCircuit(this._prevCycleCircuit.ani);
                    }
                    else {
                        newCircuit = this.findNextActiveCircuit(null);
                    }
                }
                if (newCircuit === null || newCircuit === undefined) {
                    if (haveStartingCircuit) {
                        this._notifier.warning('Invalid row selected!');
                        this._startingCycleCircuit = null;
                    }
                    else {
                        this._notifier.warning('No circuit with a currently active call to cycle to!');
                        this._prevCycleCircuit = null;
                    }
                }
                else if (searchByCircuit === null || searchByCircuit === undefined) {
                    this.changeCircuitSelection(newCircuit);
                    //this.selectedCircuit = newCircuit;
                    this.broadcastChangePlayingCircuit(newCircuit);
                    this._prevCycleCircuit = newCircuit;
                }
                else if (this.isLiveCircuitMatch(newCircuit, searchByCircuit.ani, searchByCircuit.call.callId)) {
                    // Just stay on current circuit since it's the only one with an active call.
                    return;
                }
                else {
                    if (haveStartingCircuit && !this.circuitHasActiveCall(newCircuit)) {
                        this._notifier.warning('The selected circuit has no active call to listen to!');
                    }
                    else {
                        this.changeCircuitSelection(newCircuit);
                        //this.selectedCircuit = newCircuit;
                        this.broadcastChangePlayingCircuit(newCircuit);
                        this._prevCycleCircuit = newCircuit;
                    }
                    this._startingCycleCircuit = null;
                }
            };
            CircuitListController.prototype.onCallEnd = function () {
                this._notifier.info('Call has ended', "Circuit " + this.selectedCircuit.description);
                if (this.cycleModeActive) {
                    this.setCyclePromise();
                }
            };
            // Returns true if circuit was found and has current active call.
            CircuitListController.prototype.broadcastPlayCircuitAudio = function (circuit) {
                if (circuit === null || circuit === undefined) {
                    this._notifier.warning('Invalid circuit selected!');
                }
                // ReSharper disable once QualifiedExpressionMaybeNull
                if (circuit !== null && circuit.call !== null) {
                    if (circuit.call.callStatus === LiveMonitor.CallStatus.ON) {
                        this._$scope.$broadcast('playCircuitAudio', circuit);
                    }
                    else {
                        this._notifier.warning('There is currently no live call to play on the selected circuit.');
                    }
                }
                else {
                    this._notifier.warning('Invalid circuit selected!');
                }
            };
            CircuitListController.prototype.broadcastChangePlayingCircuit = function (circuit) {
                if (circuit !== null && circuit !== undefined) {
                    if (circuit.call.callStatus === LiveMonitor.CallStatus.ON) {
                        this._$scope.$broadcast('changePlayingCircuit', circuit);
                    }
                    else {
                        this._notifier.warning('There is currently no live call to play on the selected circuit.');
                    }
                }
                else {
                    this._notifier.warning('Invalid circuit selected!');
                }
            };
            CircuitListController.prototype.broadcastStopPlayingCircuit = function () {
                this._$scope.$broadcast('stopPlayingCircuit');
            };
            // #endregion Audio
            // #region Circuits
            CircuitListController.prototype.getCallStatusTitle = function (callStatus) {
                var result = 'Status Unknown';
                switch (callStatus) {
                    case LiveMonitor.CallStatus.ON:
                        result = 'Ongoing Call';
                        break;
                    case LiveMonitor.CallStatus.OFF:
                        result = 'No Call';
                        break;
                    case LiveMonitor.CallStatus.BLOCKED:
                        result = 'Call Blocked';
                        break;
                    case LiveMonitor.CallStatus.NOT_RECORDED:
                        result = 'Not Recorded';
                        break;
                }
                return result;
            };
            CircuitListController.prototype.loadCircuits = function () {
                var _this = this;
                this.loadingCircuits = true;
                var selectedSiteIds = this.getSelectedSiteIds();
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
                    }
                    else {
                        this.showFacility = false;
                    }
                    this._prodigyApiService.getCircuits(selectedSiteIds)
                        .then(function (result) {
                        _this.circuits = new Array();
                        for (var i = 0; i < result.length; i++) {
                            _this.circuits.push(__assign({}, result[i], { facilityName: _this.getFacilityName(result[i].siteId), call: new LiveMonitor.Call() }));
                        }
                        // Reset call history
                        _this.clearCallHistory();
                        _this.loadingCircuits = false;
                    }, function (err) {
                        switch (err.status) {
                            case 200:
                                // If it returns with a redirect, the status returns 200
                                // even though we're in the error callback function...
                                // So just continue on and let browser redirect.
                                break;
                            default:
                                _this._logService.logError('Error loading circuit list', err);
                                _this._notifier.error('An unexpected error occurred when trying to load circuits', 'Application Error');
                                break;
                        }
                        _this.loadingCircuits = false;
                    });
                }
                else {
                    this._$scope.$apply(function () {
                        _this.facilitiesSelected = false;
                        _this.circuits = new Array();
                        _this.clearCallHistory();
                        _this.loadingCircuits = false;
                    });
                }
            };
            CircuitListController.prototype.getSelectedSiteIds = function () {
                var selectedSiteIds = new Array();
                for (var i = 0; i < this.facilityOptions.length; i++) {
                    if (this.facilityOptions[i].selected) {
                        selectedSiteIds.push(this.facilityOptions[i].data);
                    }
                }
                return selectedSiteIds;
            };
            CircuitListController.prototype.loadFacilities = function () {
                var _this = this;
                this.loadingFacilities = true;
                this._userService.getFacilities()
                    .then(function (result) {
                    var tempOptions = [];
                    var index = 0;
                    Object.keys(result).forEach(function (key) {
                        _this.facilities.push({ siteId: key, name: result[key] });
                        tempOptions.push({ id: index, label: result[key], selected: true, data: key });
                        index++;
                    });
                    // Sort by facility name ascending
                    _this.facilityOptions = _.sortBy(tempOptions, function (item) {
                        return item.label.toLowerCase();
                    });
                    if (_this.facilityOptions.length > 1) {
                        _this.showFacility = true;
                    }
                    else {
                        _this.showFacility = false;
                    }
                    _this.loadingFacilities = false;
                    _this.loadCircuits();
                }, function (err) {
                    _this.facilities = new Array();
                    _this.circuits = new Array();
                    _this._logService.logError('Error loading facility list', err);
                    _this._notifier.error('An unexpected error occurred when trying to load facility list', 'Application Error');
                    _this.loadingFacilities = false;
                });
            };
            CircuitListController.prototype.getFacilityName = function (siteId) {
                for (var i = 0; i < this.facilities.length; i++) {
                    if (this.facilities[i].siteId.toUpperCase() === siteId.toUpperCase()) {
                        return this.facilities[i].name;
                    }
                }
                return '';
            };
            CircuitListController.prototype.callStarted = function (msg, circuit) {
                // New call, clear possibly existing call info
                circuit.call = new LiveMonitor.Call();
                // Update call data for matching circuit.
                this.setCallHeaders(circuit.call, msg.header);
                circuit.call.maxDuration = msg.data.maxDuration;
                circuit.call.startTime = angular.copy(msg.msgTime);
                if (msg.data.recorded) {
                    circuit.call.callStatus = LiveMonitor.CallStatus.ON;
                    if (LiveMonitor.CommonHelper.isDefined(this.selectedCircuit)) {
                        if (this.parkModeActive && this.selectedCircuit.ani === circuit.ani) {
                            this.broadcastPlayCircuitAudio(circuit);
                        }
                    }
                }
                else {
                    circuit.call.callStatus = LiveMonitor.CallStatus.NOT_RECORDED;
                }
            };
            CircuitListController.prototype.callEnded = function (msg, circuit) {
                if (!circuit.call) {
                    circuit.call = new LiveMonitor.Call();
                }
                // Update call data for matching circuit.
                this.setCallHeaders(circuit.call, msg.header);
                circuit.call.terminateCode = msg.data.terminateCode;
                circuit.call.blockCode = msg.data.blockCode;
                circuit.call.curDuration = msg.data.duration;
                circuit.call.endTime = angular.copy(msg.msgTime);
                var blockCodeInt = parseInt(msg.data.blockCode);
                circuit.call.callStatus = (blockCodeInt === 0) ? LiveMonitor.CallStatus.OFF : LiveMonitor.CallStatus.BLOCKED;
            };
            CircuitListController.prototype.isLiveCircuitMatch = function (circuit, ani, callId) {
                if (circuit) {
                    if (circuit.call) {
                        return circuit.ani === ani && circuit.call.callId === callId;
                    }
                    else {
                        return circuit.ani === ani && callId === null;
                    }
                }
                return ani === null && callId === null;
            };
            CircuitListController.prototype.circuitHasActiveCall = function (circuit) {
                if (circuit !== null && circuit !== undefined) {
                    if (circuit.call !== null && circuit.call !== undefined) {
                        return circuit.call.callStatus === LiveMonitor.CallStatus.ON;
                    }
                }
                return false;
            };
            CircuitListController.prototype.findCircuitByAni = function (ani) {
                if (ani === null || ani === undefined) {
                    return null;
                }
                for (var i = 0; i < this.circuits.length; i++) {
                    if (this.circuits[i].ani === ani) {
                        return this.circuits[i];
                    }
                }
                return null;
            };
            CircuitListController.prototype.findNextActiveCircuit = function (prevAni) {
                var prevCircuitIndex = null;
                if (prevAni === null) {
                    for (var i = 0; i < this.circuits.length; i++) {
                        if (this.circuits[i].call !== null &&
                            this.circuits[i].call !== undefined &&
                            this.circuits[i].call.callStatus === LiveMonitor.CallStatus.ON) {
                            return this.circuits[i];
                        }
                    }
                    return null;
                }
                else {
                    for (var i = 0; i < this.circuits.length; i++) {
                        if (this.circuits[i].ani === prevAni) {
                            prevCircuitIndex = i;
                            break;
                        }
                    }
                }
                // If prevAni was provided, start with circuit at subsequent index.
                var curIndex = prevCircuitIndex === null ? 0 : prevCircuitIndex + 1;
                var ct = 0;
                var curCircuit;
                while (ct < this.circuits.length) {
                    if (curIndex === this.circuits.length) {
                        curIndex = 0;
                    }
                    curCircuit = this.circuits[curIndex];
                    if (curCircuit.call !== null &&
                        curCircuit.call !== undefined &&
                        curCircuit.call.callStatus === LiveMonitor.CallStatus.ON) {
                        return curCircuit;
                    }
                    curIndex++;
                    ct++;
                }
                return null;
            };
            CircuitListController.prototype.setCallHeaders = function (call, header) {
                call.callId = header.callId;
                call.lineId = header.lineId;
                call.unitId = header.unitId;
                call.pin = header.pin;
                call.calledNumber = header.calledNumber;
                call.inmateFirstName = header.inmateFirstName;
                call.inmateMiddleName = header.inmateMiddleName;
                call.inmateLastName = header.inmateLastName;
            };
            // #endregion Circuits
            // #region Signal-R
            CircuitListController.prototype.activateEvents = function () {
                var _this = this;
                this._$scope.$on(LiveMonitor.Constants.signalREventNames.onConnected, function (event, args) {
                    _this._$timeout(function () {
                        _this.isConnectedSignalR = true;
                        _this.signalRConnectionId = args.connectionId;
                    });
                });
                this._$scope.$on(LiveMonitor.Constants.signalREventNames.onAddCallStartMsg, function (event, args) {
                    _this._$timeout(function () {
                        var msg = args.msg;
                        var circuit = _this.findCircuitByAni(msg.header.ani);
                        if (circuit) {
                            msg.currentStatus = (msg.data.recorded) ? LiveMonitor.CallStatus.ON : LiveMonitor.CallStatus.NOT_RECORDED;
                            var startTime = LiveMonitor.FormatHelper.getTimeDisplay(msg.header.startDateTime);
                            msg.msgTime = startTime === null ? '' : startTime;
                            // Update row in circuit table
                            _this.callStarted(msg, circuit);
                            msg.facilityName = _this.getFacilityName(msg.header.siteId);
                            msg.circuitName = circuit.description;
                            msg.inmateName = LiveMonitor.FormatHelper.getNameDisplay(msg.header.inmateFirstName, msg.header.inmateMiddleName, msg.header.inmateLastName);
                            // Add to message history table
                            _this.addRtcmMsg(msg);
                            _this.checkAlerts(msg);
                        }
                    });
                });
                this._$scope.$on(LiveMonitor.Constants.signalREventNames.onAddCallEndMsg, function (event, args) {
                    _this._$timeout(function () {
                        var msg = args.msg;
                        var circuit = _this.findCircuitByAni(msg.header.ani);
                        // TODO Move call block event to separate message from RTCM
                        if (parseInt(msg.data.blockCode) !== 0) {
                            msg.header.eventCode = LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLBLOCK;
                            msg.currentStatus = LiveMonitor.CallStatus.BLOCKED;
                        }
                        else {
                            msg.currentStatus = LiveMonitor.CallStatus.OFF;
                        }
                        if (circuit) {
                            var startTime = LiveMonitor.FormatHelper.getTimeDisplay(msg.header.startDateTime);
                            var endTime = LiveMonitor.FormatHelper.getEndTimeDisplay(startTime, msg.data.duration);
                            msg.msgTime = endTime === null ? '' : endTime;
                            if (!LiveMonitor.CommonHelper.isDefined(msg.facilityName)) {
                                msg.facilityName = _this.getFacilityName(msg.header.siteId);
                            }
                            // Update row in circuit table
                            _this.callEnded(msg, circuit);
                            msg.circuitName = circuit.description;
                            msg.inmateName = LiveMonitor.FormatHelper.getNameDisplay(msg.header.inmateFirstName, msg.header.inmateMiddleName, msg.header.inmateLastName);
                            // Add to message history table
                            _this.addRtcmMsg(msg);
                        }
                    });
                });
                this._$scope.$watch(function () { return _this.settings.secondsPerCycle; }, function (oldValue, newValue) {
                    if (oldValue !== newValue) {
                        if (_this.settings.secondsPerCycle !== null && _this.settings.secondsPerCycle !== undefined) {
                            if (_this.settings.secondsPerCycle < _this._minSecondsPerCycle) {
                                _this.settings.secondsPerCycle = _this._minSecondsPerCycle;
                                _this._notifier.warning("Minimum seconds per cycle is " + _this._minSecondsPerCycle);
                            }
                        }
                        _this._recreateCyclePromise = true;
                    }
                });
                // If right-click context menu is open, close it on user clicking elsewhere.
                $(document).bind('click', function (event) {
                    if (!_this.showCtxMenu) {
                        return;
                    }
                    var ctxMenu = $("#" + _this.ctxMenuId);
                    var isClickedOfCtxMenu = ctxMenu.find(event.target).length > 0;
                    if (isClickedOfCtxMenu) {
                        return;
                    }
                    _this._$scope.$apply(function () {
                        _this.toggleCircuitCtxMenu(false);
                    });
                });
                this._$window.addEventListener('scroll', function () {
                    _this.closeCtxMenu();
                });
            };
            CircuitListController.prototype.addRtcmMsg = function (msg) {
                if (!this.pauseCallHistoryActive) {
                    var msgFound = false;
                    if (msg.currentStatus === LiveMonitor.CallStatus.OFF) {
                        var _loop_1 = function (i) {
                            if (this_1.isCallMatch(this_1.rtcmMessages[i], msg)) {
                                // Update the call status and time field.
                                var msgToChange_1 = this_1.rtcmMessages[i];
                                this_1._$timeout(function () {
                                    msgToChange_1.currentStatus = msg.currentStatus;
                                    msgToChange_1.msgTime = msg.msgTime;
                                });
                                msgFound = true;
                                return "break";
                            }
                        };
                        var this_1 = this;
                        for (var i = 0; i < this.rtcmMessages.length; i++) {
                            var state_1 = _loop_1(i);
                            if (state_1 === "break")
                                break;
                        }
                    }
                    if (!msgFound) {
                        this.rtcmMessages.unshift(msg);
                        if (this.rtcmMessages.length > this._maxMessages) {
                            this.rtcmMessages.pop();
                        }
                    }
                }
            };
            CircuitListController.prototype.isCallMatch = function (callMsg1, callMsg2) {
                return (callMsg1.header.callId === callMsg2.header.callId &&
                    callMsg1.header.lineId === callMsg2.header.lineId &&
                    callMsg1.header.unitId === callMsg2.header.unitId);
            };
            // #endregion Signal-R
            // #region Context Menu
            CircuitListController.prototype.openCircuitCtxMenu = function ($event, circuit) {
                // If right click
                if ($event.which === 3) {
                    $event.preventDefault();
                    this.ctxMenuFromCircuits = true;
                    this.toggleCircuitCtxMenu(true, circuit);
                    this.setCircuitCtxMenuPosition($event.clientY, $event.clientX);
                }
            };
            CircuitListController.prototype.openCircuitCtxMenuFromMsg = function ($event, msg) {
                // If right click
                if ($event.which === 3) {
                    $event.preventDefault();
                    this.ctxMenuFromCircuits = false;
                    var circuit = this.findCircuitByAni(msg.header.ani);
                    if (LiveMonitor.CommonHelper.isDefined(circuit)) {
                        if (!this.pauseCallHistoryActive) {
                            this.pauseCallHistoryActive = true;
                            this.ctxMenuPausedHistory = true;
                        }
                        this.toggleCircuitCtxMenu(true, circuit);
                        this.setCircuitCtxMenuPosition($event.clientY, $event.clientX);
                    }
                }
            };
            CircuitListController.prototype.closeCtxMenu = function () {
                var _this = this;
                if (!this.showCtxMenu) {
                    return;
                }
                if (!this.closingCtxMenu) {
                    this.closingCtxMenu = true;
                    this._$window.requestAnimationFrame(function () {
                        $("#" + _this.ctxMenuId)[0].style.display = 'none';
                        if (_this.ctxMenuPausedHistory) {
                            _this.pauseCallHistoryActive = false;
                            _this.ctxMenuPausedHistory = false;
                        }
                        _this.closingCtxMenu = false;
                    });
                }
            };
            CircuitListController.prototype.ctxMenuSelectCircuit = function () {
                this.selectCtxMenuCircuit();
                this.toggleCircuitCtxMenu(false);
            };
            CircuitListController.prototype.ctxMenuListen = function () {
                // Order here matters.
                // Select circuit function will act differently depending on which mode is enabled.
                this.setListenMode(true);
                this.selectCtxMenuCircuit();
                if (this.selectedCircuit) {
                    this.tryPlayAudio(this.selectedCircuit);
                }
                this.toggleCircuitCtxMenu(false);
            };
            CircuitListController.prototype.ctxMenuPark = function () {
                // Order here matters.
                // Select circuit function acts differently depending on which mode is enabled.
                this.setParkMode(true);
                this.selectCtxMenuCircuit();
                this.toggleCircuitCtxMenu(false);
            };
            CircuitListController.prototype.ctxMenuCreateCalledNumberAlert = function () {
                var added = false;
                if (LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit) && LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
                    if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.calledNumber)) {
                        this.addNumberAlert(this.ctxMenuCircuit.call.calledNumber);
                        added = true;
                    }
                }
                if (!added) {
                    this._notifier.warning('This circuit does not have a called phone number to add an alert for!');
                }
                this.toggleCircuitCtxMenu(false);
            };
            CircuitListController.prototype.ctxMenuCreateInmateAlert = function () {
                var added = false;
                if (LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit) && LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
                    if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.pin)) {
                        var alertInmateAccount = new LiveMonitor.InmateAccount();
                        alertInmateAccount.pin = this.ctxMenuCircuit.call.pin;
                        alertInmateAccount.siteId = this.ctxMenuCircuit.siteId;
                        alertInmateAccount.nameDisplay = this.ctxMenuCircuit.call.inmateName;
                        alertInmateAccount.apin = LiveMonitor.FormatHelper.getApinFromPin(this.ctxMenuCircuit.call.pin);
                        this.addInmateAlert(alertInmateAccount);
                        added = true;
                    }
                }
                if (!added) {
                    this._notifier.warning('Circuit does not have an inmate to add an alert for!');
                }
                this.toggleCircuitCtxMenu(false);
            };
            CircuitListController.prototype.ctxMenuDisconnectCall = function () {
                // Order here matters
                this.selectCtxMenuCircuit();
                this.toggleCircuitCtxMenu(false);
                this.disconnectSelectedCall();
            };
            CircuitListController.prototype.ctxMenuClearCallHistory = function () {
                this.clearCallHistory();
                this.toggleCircuitCtxMenu(false);
            };
            CircuitListController.prototype.ctxMenuCircuitHasActiveCall = function () {
                if (LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit) && LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
                    return (this.ctxMenuCircuit.call.callStatus === LiveMonitor.CallStatus.ON);
                }
                return false;
            };
            CircuitListController.prototype.ctxMenuCircuitHasCalledNum = function () {
                if (LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit) && LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
                    return (LiveMonitor.CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.calledNumber));
                }
                return false;
            };
            CircuitListController.prototype.ctxMenuCircuitHasInmate = function () {
                if (LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit) && LiveMonitor.CommonHelper.isDefined(this.ctxMenuCircuit.call)) {
                    return (LiveMonitor.CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.call.pin) && LiveMonitor.CommonHelper.isDefinedNotWhitespace(this.ctxMenuCircuit.siteId));
                }
                return false;
            };
            CircuitListController.prototype.ctxMenuCancel = function () {
                this.toggleCircuitCtxMenu(false);
            };
            CircuitListController.prototype.selectCtxMenuCircuit = function () {
                this.setSelectedCircuit(this.ctxMenuCircuit.ani, this.ctxMenuCircuit.call.callId, true);
            };
            CircuitListController.prototype.toggleCircuitCtxMenu = function (open, circuit) {
                if (open) {
                    if (LiveMonitor.CommonHelper.isDefined(circuit)) {
                        this.ctxMenuCircuit = angular.copy(circuit);
                        this.showCtxMenu = true;
                    }
                }
                else {
                    this.ctxMenuCircuit = null;
                    this.showCtxMenu = false;
                    ($("#" + this.ctxMenuId)[0]).style.display = 'none';
                    if (this.ctxMenuPausedHistory) {
                        this.pauseCallHistoryActive = false;
                        this.ctxMenuPausedHistory = false;
                    }
                }
            };
            CircuitListController.prototype.setCircuitCtxMenuPosition = function (top, left) {
                var ctxMenu = $("#" + this.ctxMenuId)[0];
                ctxMenu.style.display = 'block';
                ctxMenu.style.left = left + "px";
                ctxMenu.style.top = top + "px";
            };
            // #endregion Context Menu
            // #region Alerts
            CircuitListController.prototype.checkAlerts = function (msg) {
                this.checkAlertCalledNumber(msg);
                this.checkAlertInmate(msg);
            };
            CircuitListController.prototype.checkAlertCalledNumber = function (msg) {
                var _this = this;
                if (!this.dialogModalOpen && msg.header.calledNumber === this.settings.alertCalledNumber) {
                    var alertNumber = null;
                    for (var i = 0; i < this.settings.alertSelectedNumbers.length; i++) {
                        if (this.settings.alertSelectedNumbers[i].cleaned === msg.header.calledNumber) {
                            alertNumber = this.settings.alertSelectedNumbers[i];
                            break;
                        }
                    }
                    if (alertNumber !== null) {
                        // ReSharper disable once QualifiedExpressionMaybeNull
                        var dialogMsg = "The phone number '" + alertNumber.display + "' is being called";
                        if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(msg.inmateName)) {
                            dialogMsg += " by " + msg.inmateName + ". Would you like to start listening?";
                        }
                        else {
                            dialogMsg += '. Would you like to start listening?';
                        }
                        this.dialogModalOpen = true;
                        this._basicModal.showModal('Phone # Called Alert', dialogMsg, 'Yes', 'No').result.then(function () {
                            // Order here matters.
                            _this.setListenMode(true);
                            _this.setSelectedCircuit(msg.header.ani, msg.header.callId, true);
                            if (_this.selectedCircuit) {
                                _this.tryPlayAudio(_this.selectedCircuit);
                            }
                            _this.dialogModalOpen = false;
                        }, function () {
                            _this.dialogModalOpen = false;
                        });
                    }
                }
            };
            CircuitListController.prototype.checkAlertInmate = function (msg) {
                var _this = this;
                if (!this.dialogModalOpen) {
                    var found = false;
                    var inmateName = '';
                    for (var i = 0; i < this.settings.alertSelectedInmates.length; i++) {
                        if (this.settings.alertSelectedInmates[i].pin === msg.header.pin && this.settings.alertSelectedInmates[i].siteId === msg.header.siteId) {
                            found = true;
                            inmateName = this.settings.alertSelectedInmates[i].nameDisplay;
                            break;
                        }
                    }
                    if (found) {
                        var dialogMsg = "The inmate '" + inmateName + "' has started a call. Would you like to start listening?";
                        this.dialogModalOpen = true;
                        this._basicModal.showModal('Inmate Alert', dialogMsg, 'Yes', 'No').result.then(function () {
                            // Order here matters.
                            _this.setListenMode(true);
                            _this.setSelectedCircuit(msg.header.ani, msg.header.callId, true);
                            if (_this.selectedCircuit) {
                                _this.tryPlayAudio(_this.selectedCircuit);
                            }
                            _this.dialogModalOpen = false;
                        }, function () {
                            _this.dialogModalOpen = false;
                        });
                    }
                }
            };
            CircuitListController.prototype.keypressAddNumberAlert = function ($event) {
                if ($event.which === 13) {
                    $event.preventDefault();
                    this.addNumberAlert(this.settings.alertCalledNumber);
                }
            };
            CircuitListController.prototype.addNumberAlert = function (number) {
                var cleanedNumber = LiveMonitor.FormatHelper.getOnlyDigits(number);
                if (cleanedNumber.length !== 10) {
                    this._notifier.warning('Phone numbers must contain exactly 10 digits.', 'Invalid Called Number Alert');
                    return;
                }
                if (this.calledNumberAlertExists(cleanedNumber)) {
                    this._notifier.warning('There is already an alert for that phone number!', 'Duplicate Called Number Alert');
                }
                else {
                    var alertCalledNumber = new PhoneNumber();
                    alertCalledNumber.display = LiveMonitor.FormatHelper.getPhoneDisplay(cleanedNumber);
                    alertCalledNumber.cleaned = cleanedNumber;
                    this.settings.alertSelectedNumbers.push(alertCalledNumber);
                    this.settings.alertCalledNumber = '';
                    this._notifier.success("Phone alert added for phone number " + alertCalledNumber.display, 'Phone Alert Added');
                }
            };
            CircuitListController.prototype.removeNumberAlert = function (index) {
                this.settings.alertSelectedNumbers.splice(index, 1);
            };
            CircuitListController.prototype.calledNumberAlertExists = function (cleanedNumber) {
                for (var i = 0; i < this.settings.alertSelectedNumbers.length; i++) {
                    if (this.settings.alertSelectedNumbers[i].cleaned === cleanedNumber) {
                        return true;
                    }
                }
                return false;
            };
            CircuitListController.prototype.formatInmate = function (record) {
                return record ? record.name + " (" + record.facilityName + ")" : '';
            };
            CircuitListController.prototype.addInmateAlert = function ($model) {
                if (this.inmateAlertExists($model.pin, $model.siteId)) {
                    this._notifier.warning('There is already an alert for that inmate!', 'Duplicate Inmate Alert');
                }
                else {
                    this.settings.alertSelectedInmates.push($model);
                    this._notifier.success("Inmate alert added for inmate " + $model.nameDisplay, 'Inmate Alert Added');
                }
            };
            CircuitListController.prototype.removeInmateAlert = function (index) {
                this.settings.alertSelectedInmates.splice(index, 1);
            };
            CircuitListController.prototype.inmateAlertExists = function (pin, siteId) {
                for (var i = 0; i < this.settings.alertSelectedInmates.length; i++) {
                    if (this.settings.alertSelectedInmates[i].pin === pin &&
                        this.settings.alertSelectedInmates[i].siteId === siteId) {
                        return true;
                    }
                }
                return false;
            };
            CircuitListController.prototype.searchInmates = function (viewValue) {
                var _this = this;
                this.isLoadingInmateTypeahead = true;
                var selectedSiteIds = this.getSelectedSiteIds();
                return this._inmateService.getInmates(viewValue, selectedSiteIds).then(function (result) {
                    var returnResults = [];
                    for (var i = 0; i < result.length && i < _this._inmatesTypeaheadLimitTo - 1; i++) {
                        returnResults.push(result[i]);
                    }
                    _this.isLoadingInmateTypeahead = false;
                    return returnResults;
                }, function () {
                    _this._notifier.error('Application Error', 'Unable to search for inmates.');
                    _this.isLoadingInmateTypeahead = false;
                });
            };
            // #endregion Alerts
            CircuitListController.prototype.disposeEvents = function () {
                var _this = this;
                // $interval doesn't handle disposal on leaving page, so handle it here.
                this._$scope.$on(this.disposeEvent, function () {
                    console.log("circuitlist.controller this._$scope.$on('" + _this.disposeEvent + "')");
                    _this._$interval.cancel(_this._cyclePromise);
                });
                this._$window.onbeforeunload = function () {
                    console.log('circuitlist.controller cancelling cycle');
                    _this._$interval.cancel(_this._cyclePromise);
                };
            };
            CircuitListController.$inject = [
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
            return CircuitListController;
        }());
        Circuits.CircuitListController = CircuitListController;
        var CallStartMsg = /** @class */ (function () {
            function CallStartMsg() {
            }
            return CallStartMsg;
        }());
        Circuits.CallStartMsg = CallStartMsg;
        var CallEndMsg = /** @class */ (function () {
            function CallEndMsg() {
            }
            return CallEndMsg;
        }());
        Circuits.CallEndMsg = CallEndMsg;
        var CircuitModeSettings = /** @class */ (function () {
            function CircuitModeSettings() {
                this.secondsPerCycle = 30;
                this.alertInmate = '';
                this.alertCalledNumber = '';
                this.alertSelectedInmates = new Array();
                this.alertSelectedNumbers = new Array();
            }
            return CircuitModeSettings;
        }());
        Circuits.CircuitModeSettings = CircuitModeSettings;
        var PhoneNumber = /** @class */ (function () {
            function PhoneNumber() {
            }
            return PhoneNumber;
        }());
        Circuits.PhoneNumber = PhoneNumber;
        var Facility = /** @class */ (function () {
            function Facility() {
            }
            return Facility;
        }());
        Circuits.Facility = Facility;
        // #endregion Interfaces/Classes
        angular
            .module('LiveMonitor.Circuits')
            .controller('CircuitListController', CircuitListController);
    })(Circuits = LiveMonitor.Circuits || (LiveMonitor.Circuits = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=circuitlist.controller.js.map
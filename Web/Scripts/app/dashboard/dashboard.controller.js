var LiveMonitor;
(function (LiveMonitor) {
    var Dashboard;
    (function (Dashboard) {
        'use strict';
        var DashboardController = /** @class */ (function () {
            function DashboardController($scope, _$timeout, _circuitService, _circuitsHubProxyService, _logService, _notifier) {
                this._$timeout = _$timeout;
                this._circuitService = _circuitService;
                this._circuitsHubProxyService = _circuitsHubProxyService;
                this._logService = _logService;
                this._notifier = _notifier;
                this.callStatus = LiveMonitor.CallStatus;
                this.newMsgHeader = new LiveMonitor.RtcmMsgHeader();
                this.newStartMsgData = new LiveMonitor.EventCallStartData();
                this.newEndMsgData = new LiveMonitor.EventCallEndData();
                this.rtcmMessages = new Array();
                this.titleStartMsgTable = '';
                this.titleEndMsgTable = '';
                this.isConnected = false;
                this.connectionId = 'Not Connected';
                this._maxLen = 20;
                this.$onInit = function () { };
                this.$scope = $scope;
                this.titleStartMsgTable = "[Probably] Live Call Start Messages";
                this.titleEndMsgTable = "[Probably] Live Call End Messages";
                this.setInputDefaults();
                this.activate();
                this.isConnected = true;
            }
            DashboardController.prototype.activate = function () {
                //this.$scope.$on(Constants.signalREventNames.onConnected,
                //	(event, args): void => {
                //		this._$timeout((): void => {
                //			this.onConnectedToSignalR(args.connectionId);
                //		});
                //	});
                var _this = this;
                this.$scope.$on(LiveMonitor.Constants.signalREventNames.onAddCallStartMsg, function (event, args) {
                    _this._$timeout(function () {
                        var msg = args.msg;
                        _this.rtcmMessages.unshift(msg);
                        if (_this.rtcmMessages.length > _this._maxLen) {
                            _this.rtcmMessages.pop();
                        }
                    });
                });
                this.$scope.$on(LiveMonitor.Constants.signalREventNames.onAddCallEndMsg, function (event, args) {
                    _this._$timeout(function () {
                        var msg = args.msg;
                        _this.rtcmMessages.unshift(msg);
                        if (_this.rtcmMessages.length > _this._maxLen) {
                            _this.rtcmMessages.pop();
                        }
                    });
                });
                this.$scope.$on(LiveMonitor.Constants.signalREventNames.onRemoveAllMessages, function (event, args) {
                    _this._$timeout(function () {
                        _this.rtcmMessages = new Array();
                    });
                });
            };
            DashboardController.prototype.addRtcmMsg = function () {
                switch (this.selectedNewCallMsgType) {
                    case LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART:
                        // Send message object
                        this.addCallStartMsg(this.newStartMsgData);
                        // Reset input data
                        this.setInputDefaults();
                        break;
                    case LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND:
                        // Send message object
                        this.addCallEndMsg(this.newEndMsgData);
                        // Reset input data
                        this.setInputDefaults();
                        break;
                    default:
                        throw new Error("Invalid RTCM Message Type");
                }
            };
            DashboardController.prototype.removeAllMessages = function () {
                var _this = this;
                this._circuitsHubProxyService.removeAllMessages().then(function () {
                    _this._notifier.success('Successfully removed all messages', 'Messages Removed');
                }, function (err) {
                    _this._logService.logError('Failed to remove all RTCM messages', err);
                    _this._notifier.error('An unexpected error occurred. Failed to remove messages.', 'Application Error');
                });
            };
            DashboardController.prototype.addCallStartMsg = function (msgData) {
                var _this = this;
                var msg = new LiveMonitor.EventCallStartMsg();
                msg.header = this.getHeader();
                msg.data = msgData;
                this._circuitsHubProxyService.addCallStartMsg(msg).then(function () {
                    _this._notifier.success('Successfully added call start message', 'Message Added');
                }, function (err) {
                    _this._logService.logError('Failed to add call start message', err);
                    _this._notifier.error('An unexpected error occurred. Failed to add call start message.', 'Application Error');
                });
            };
            DashboardController.prototype.addCallEndMsg = function (msgData) {
                var _this = this;
                var msg = new LiveMonitor.EventCallEndMsg();
                msg.header = this.getHeader();
                msg.data = msgData;
                if (msg.data.blockCode !== '00') {
                    msg.header.eventCode = LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLBLOCK;
                }
                this._circuitsHubProxyService.addCallEndMsg(msg).then(function () {
                    _this._notifier.success('Successfully added call end message', 'Message Added');
                }, function (err) {
                    _this._logService.logError('Failed to add call end message', err);
                    _this._notifier.error('An unexpected error occurred. Failed to add call end message.', 'Application Error');
                });
            };
            DashboardController.prototype.getHeader = function () {
                var result = new LiveMonitor.RtcmMsgHeader();
                result.eventCode = this.selectedNewCallMsgType;
                result.callId = this.newMsgHeader.callId;
                result.ani = this.newMsgHeader.ani;
                result.siteId = this.newMsgHeader.siteId;
                result.lineId = this.newMsgHeader.lineId;
                result.unitId = this.newMsgHeader.unitId;
                return result;
            };
            DashboardController.prototype.getCtrlMsgTypeDisplay = function (type) {
                return this._circuitService.getCtrlMsgTypeDisplay(type);
            };
            DashboardController.prototype.getCallStartMessages = function () {
                var result = new Array();
                if (!this.rtcmMessages || this.rtcmMessages.length === 0) {
                    return result;
                }
                for (var i = this.rtcmMessages.length - 1; i >= 0; i--) {
                    if (this.rtcmMessages[i].header.eventCode === LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART) {
                        result.push(this.rtcmMessages[i]);
                    }
                }
                return result;
            };
            DashboardController.prototype.getCallEndMessages = function () {
                var result = new Array();
                if (!this.rtcmMessages || this.rtcmMessages.length === 0) {
                    return result;
                }
                for (var i = this.rtcmMessages.length - 1; i >= 0; i--) {
                    if (this.rtcmMessages[i].header.eventCode === LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND) {
                        result.push(this.rtcmMessages[i]);
                    }
                }
                return result;
            };
            DashboardController.prototype.onCallStartSelected = function () {
                this.selectedNewCallMsgType = LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART;
            };
            DashboardController.prototype.onCallEndSelected = function () {
                this.selectedNewCallMsgType = LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND;
            };
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
            DashboardController.prototype.setInputDefaults = function () {
                // Set defaults for header
                this.newMsgHeader = this.getDefHeader(this.selectedNewCallMsgType);
                // Set defaults for new call start message data
                this.newStartMsgData = new LiveMonitor.EventCallStartData();
                this.newStartMsgData.maxDuration = 900;
                // Set defaults for new call end message data
                this.newEndMsgData = new LiveMonitor.EventCallEndData();
                this.newEndMsgData.terminateCode = '15';
                this.newEndMsgData.blockCode = '00';
                this.newEndMsgData.duration = 69;
            };
            DashboardController.prototype.getDefHeader = function (eventCode) {
                var result = new LiveMonitor.RtcmMsgHeader();
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
            };
            DashboardController.$inject = [
                '$scope',
                '$timeout',
                'LiveMonitor.Services.CircuitService',
                'LiveMonitor.Services.CircuitsHubProxyService',
                'LiveMonitor.Services.LogService',
                'LiveMonitor.Services.NotifierService'
            ];
            return DashboardController;
        }());
        Dashboard.DashboardController = DashboardController;
        angular
            .module('LiveMonitor.Dashboard')
            .controller('DashboardController', DashboardController);
    })(Dashboard = LiveMonitor.Dashboard || (LiveMonitor.Dashboard = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=dashboard.controller.js.map
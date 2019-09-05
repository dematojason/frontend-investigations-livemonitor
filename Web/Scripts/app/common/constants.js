var LiveMonitor;
(function (LiveMonitor) {
    var EventNames = /** @class */ (function () {
        function EventNames() {
        }
        return EventNames;
    }());
    LiveMonitor.EventNames = EventNames;
    var ImageSources = /** @class */ (function () {
        function ImageSources() {
        }
        return ImageSources;
    }());
    LiveMonitor.ImageSources = ImageSources;
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        Constants.applicationName = 'LiveMonitor';
        Constants.circuitsHubName = 'circuitsHub';
        Constants.signalREventNames = {
            addCallStartMsg: 'addCallStartMsg',
            addCallEndMsg: 'addCallEndMsg',
            getRtcmMessages: 'getRtcmMessages',
            removeAllMessages: 'removeAllMessages',
            onConnected: 'signalRConnected',
            onDisconnected: 'signalRDisconnected',
            onAddCallStartMsg: 'broadcastAddCallStartMsg',
            onAddCallEndMsg: 'broadcastAddCallEndMsg',
            onRedirectToLogin: 'broadcastRedirectToLogin',
            onRemoveAllMessages: 'broadcastRemoveAllMessages'
        };
        Constants.imgSources = {
            pauseCallHistory: '/Images/pause-call-history.svg',
            //clearCallHistory: '/Images/clear-call-history.svg',
            clearCallHistory: '/Images/broom-icon-circled.svg',
            clearAlertHistory: '/Images/clear-alert-history.svg',
            disconnectCall: '/Images/disconnect-call.svg',
            cycleMode: '/Images/cycle-calls.svg',
            listenMode: '/Images/listen.svg',
            //offMode: '/Images/circle-cross.svg',
            offMode: '/Images/power-btn.svg',
            parkMode: '/Images/park-car.svg'
        };
        Constants.unauthorizedExpiredToken = 'expired_token';
        Constants.unauthorizedReqRoles = 'required_roles';
        Constants.unauthorizedUnauthenticated = 'unauthenticated';
        return Constants;
    }());
    LiveMonitor.Constants = Constants;
    var Permissions = /** @class */ (function () {
        function Permissions() {
        }
        Permissions.view = 'LiveMonitor_View';
        return Permissions;
    }());
    LiveMonitor.Permissions = Permissions;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=constants.js.map
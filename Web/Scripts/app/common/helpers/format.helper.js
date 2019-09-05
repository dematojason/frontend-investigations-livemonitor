var LiveMonitor;
(function (LiveMonitor) {
    var FormatHelper = /** @class */ (function () {
        function FormatHelper() {
        }
        FormatHelper.getDurationDisplay = function (seconds) {
            var result = '0s';
            if (seconds) {
                var hrs = Math.floor(seconds / 3600);
                var min = Math.floor((seconds % 3600) / 60);
                var sec = Math.floor(seconds % 60);
                result = sec + "s";
                if (min > 0 || hrs > 0) {
                    result = min + "m " + result;
                    if (hrs > 0) {
                        result = hrs + "h " + result;
                    }
                }
            }
            return result;
        };
        FormatHelper.getNameDisplay = function (firstName, middleName, lastName) {
            if (firstName || middleName || lastName) {
                var result = '';
                if (lastName) {
                    result = lastName;
                    if (firstName) {
                        result += ", " + firstName;
                        if (middleName) {
                            result += " " + middleName;
                        }
                    }
                }
                else if (firstName) {
                    result = firstName;
                    if (middleName) {
                        result += " " + middleName;
                    }
                }
                return FormatHelper.camelize(result);
            }
            else {
                return '';
            }
        };
        FormatHelper.getPhoneDisplay = function (phone) {
            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(phone)) {
                if (phone.length < 10) {
                    return phone;
                }
                var cleaned = this.getOnlyDigits(phone);
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (LiveMonitor.CommonHelper.isDefined(match)) {
                    return "(" + match[1] + ") " + match[2] + "-" + match[3];
                }
                return cleaned;
            }
            else {
                return '';
            }
        };
        FormatHelper.getOnlyDigits = function (val) {
            if (LiveMonitor.CommonHelper.isDefined(val)) {
                return val.replace(/[^0-9]/g, '');
            }
            return '';
        };
        FormatHelper.getApinFromPin = function (pin) {
            var apin = angular.copy(pin);
            while (apin.charAt(0) === '0') {
                apin = apin.substr(1);
            }
            return apin;
        };
        FormatHelper.camelize = function (val) {
            if (val === null || val === undefined) {
                return val;
            }
            val = val.toLowerCase();
            var splitVals = val.split(' ');
            for (var i = 0; i < splitVals.length; i++) {
                splitVals[i] = splitVals[i].charAt(0).toUpperCase() + splitVals[i].slice(1);
            }
            return splitVals.join(' ');
        };
        FormatHelper.getTimeDisplay = function (val) {
            if (val === null || val === undefined || val === '') {
                return val;
            }
            // Switch will sometimes send this.
            if (val === 'NULL') {
                return null;
            }
            // Assuming format is 'yyyyMMddHHmmss'
            if (val.length === 14) {
                val = val.substring(8);
                var hr = val.substring(0, 2);
                var min = val.substring(2, 4);
                var sec = val.substring(4, 6);
                return hr + ":" + min + ":" + sec;
            }
            return val;
        };
        // Duration is in seconds
        FormatHelper.getEndTimeDisplay = function (startTime, duration) {
            if (startTime === null || startTime === undefined || startTime === '') {
                return startTime;
            }
            if (duration === null || duration === undefined || duration === 0) {
                return startTime;
            }
            var timeComponents = startTime.split(':');
            if (timeComponents.length !== 3) {
                return startTime;
            }
            var hr = parseInt(timeComponents[0]);
            var min = parseInt(timeComponents[1]);
            var sec = parseInt(timeComponents[2]) + duration;
            if (sec < 60) {
                return this.createTimeResult(hr, min, sec);
            }
            var secRemainder = sec % 60;
            min = min + ((sec - secRemainder) / 60);
            sec = secRemainder;
            if (min < 60) {
                return this.createTimeResult(hr, min, sec);
            }
            var minRemainder = min % 60;
            hr = hr + ((min - minRemainder) / 60);
            min = minRemainder;
            if (hr < 24) {
                return this.createTimeResult(hr, min, sec);
            }
            hr = hr - 24;
            return this.createTimeResult(hr, min, sec);
        };
        FormatHelper.createTimeResult = function (hr, min, sec) {
            return FormatHelper.twoDigit(hr) + ":" + FormatHelper.twoDigit(min) + ":" + FormatHelper.twoDigit(sec);
        };
        FormatHelper.twoDigit = function (val) {
            if (val === null || val === undefined) {
                return null;
            }
            if (val < 10) {
                return "0" + val;
            }
            return val.toString();
        };
        FormatHelper.getCircuitDisplay = function (description, ani) {
            var result = 'N/A';
            var descrHasVal = false;
            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(description)) {
                descrHasVal = true;
                result = description;
            }
            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(ani)) {
                if (descrHasVal) {
                    result += " (" + ani + ")";
                }
                else {
                    result = ani;
                }
            }
            return result;
        };
        FormatHelper.getInmateDisplay = function (name, pin) {
            var result = 'N/A';
            var nameHasVal = false;
            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(name)) {
                nameHasVal = true;
                result = name;
            }
            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(pin)) {
                var apin = FormatHelper.getApinFromPin(pin);
                if (nameHasVal) {
                    result += " (" + apin + ")";
                }
                else {
                    result = apin;
                }
            }
            return result;
        };
        return FormatHelper;
    }());
    LiveMonitor.FormatHelper = FormatHelper;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=format.helper.js.map
var LiveMonitor;
(function (LiveMonitor) {
    var UniqueIdType;
    (function (UniqueIdType) {
        UniqueIdType[UniqueIdType["NONE"] = 0] = "NONE";
        UniqueIdType[UniqueIdType["ACTIVE_BUTTON"] = 1] = "ACTIVE_BUTTON";
        UniqueIdType[UniqueIdType["COLLAPSIBLE"] = 2] = "COLLAPSIBLE";
        UniqueIdType[UniqueIdType["MULTISELECT"] = 3] = "MULTISELECT";
        UniqueIdType[UniqueIdType["MODAL"] = 4] = "MODAL";
        UniqueIdType[UniqueIdType["CTX_MENU"] = 5] = "CTX_MENU";
    })(UniqueIdType = LiveMonitor.UniqueIdType || (LiveMonitor.UniqueIdType = {}));
    var CommonHelper = /** @class */ (function () {
        function CommonHelper() {
        }
        /**
         * Loops through the properties of fromObj and sets the values of any properties
         * with matching names in toObj.
         * Note: Both toObj and fromObj instances must already be initialized.
         * @param {T} toObj - An object instance to map property values to.
         * @param {TH} fromObj - An instance of the class to take the property names & values from.
         */
        CommonHelper.mapProperties = function (toObj, fromObj) {
            Object.keys(fromObj).forEach(function (key) {
                toObj[key] = fromObj[key];
            });
        };
        /**
         * Returns true if the parameter obj is undefined or null.
         * @deprecated Use isDefined method for typescript compiler's cooperation.
         * @param obj The object to check
         */
        CommonHelper.isNullOrUndef = function (obj) {
            return (obj === undefined || obj === null);
        };
        /**
         * Returns true if the parameter obj is undefined, null, blank, or only contains whitespace.
         * Javascript equivalent of C#'s String.IsNullOrWhitespace().
         * @deprecated Use isDefinedNotWhitespace for typescript compiler's cooperation.
         * @param obj The string to check
         */
        CommonHelper.isNullUndefOrBlank = function (obj) {
            return (obj === undefined || obj === null || obj.trim() === '');
        };
        /**
         * Returns true if the parameter value is not undefined nor null.
         * This function is a type guard. For more info on typescript type guards, see
         * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
         * @param value The value to check
         */
        CommonHelper.isDefined = function (value) {
            return (typeof (value) !== 'undefined' && value !== null);
        };
        /**
         * Returns true if the parameter value is not undefined, null, nor an empty string.
         * This function is a type guard. For more info on typescript type guards, see
         * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
         * @param value
         */
        CommonHelper.isDefinedNotWhitespace = function (value) {
            if (this.isDefined(value)) {
                return value.trim() !== '';
            }
            return false;
        };
        /**
         * Generates a unique ID based on the parameter type.
         * @param {UniqueIdType} type The type to get the count for.
         */
        CommonHelper.getUniqueId = function (type) {
            if (type === undefined || type === null) {
                for (var i = 0; i < this._typeCounts.length; i++) {
                    if (this._typeCounts[i].type === UniqueIdType.NONE) {
                        this._typeCounts[i].count++;
                        return angular.copy(this._typeCounts[i].count);
                    }
                }
                throw new Error('Invalid Unique ID Type');
            }
            for (var i = 0; i < this._typeCounts.length; i++) {
                if (this._typeCounts[i].type === type) {
                    this._typeCounts[i].count++;
                    return angular.copy(this._typeCounts[i].count);
                }
            }
            throw new Error('Invalid Unique ID Type');
        };
        CommonHelper._typeCounts = [
            { type: UniqueIdType.NONE, count: 0 },
            { type: UniqueIdType.ACTIVE_BUTTON, count: 0 },
            { type: UniqueIdType.COLLAPSIBLE, count: 0 },
            { type: UniqueIdType.MULTISELECT, count: 0 },
            { type: UniqueIdType.MODAL, count: 0 },
            { type: UniqueIdType.CTX_MENU, count: 0 }
        ];
        return CommonHelper;
    }());
    LiveMonitor.CommonHelper = CommonHelper;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=common.helper.js.map
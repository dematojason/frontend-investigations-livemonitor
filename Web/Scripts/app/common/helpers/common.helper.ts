namespace Empty {
	export type String = '';
	export type Object = Record<string, never>;
	export type Array = never[];
}

namespace LiveMonitor {
	export enum UniqueIdType {
		NONE = 0,
		ACTIVE_BUTTON,
		COLLAPSIBLE,
		MULTISELECT,
		MODAL,
		CTX_MENU
	}

	export abstract class CommonHelper {
		/**
		 * Loops through the properties of fromObj and sets the values of any properties
		 * with matching names in toObj.
		 * Note: Both toObj and fromObj instances must already be initialized.
		 * @param {T} toObj - An object instance to map property values to.
		 * @param {TH} fromObj - An instance of the class to take the property names & values from.
		 */
		public static mapProperties<T extends TH, TH>(toObj: T, fromObj: TH): void {
			Object.keys(fromObj).forEach((key) => {
				toObj[key] = fromObj[key];
			});
		}

		/**
		 * Returns true if the parameter obj is undefined or null.
		 * @deprecated Use isDefined method for typescript compiler's cooperation.
		 * @param obj The object to check
		 */
		public static isNullOrUndef(obj: any): boolean {
			return (obj === undefined || obj === null);
		}

		/**
		 * Returns true if the parameter obj is undefined, null, blank, or only contains whitespace.
		 * Javascript equivalent of C#'s String.IsNullOrWhitespace().
		 * @deprecated Use isDefinedNotWhitespace for typescript compiler's cooperation.
		 * @param obj The string to check
		 */
		public static isNullUndefOrBlank(obj: string | null): boolean {
			return (obj === undefined || obj === null || obj.trim() === '');
		}

		/**
		 * Returns true if the parameter value is not undefined nor null.
		 * This function is a type guard. For more info on typescript type guards, see
		 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
		 * @param value The value to check
		 */
		public static isDefined<T>(value: T | undefined | null): value is T {
			return (typeof(value) !== 'undefined' && value !== null);
		}

		/**
		 * Returns true if the parameter value is not undefined, null, nor an empty string.
		 * This function is a type guard. For more info on typescript type guards, see
		 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
		 * @param value
		 */
		public static isDefinedNotWhitespace(value: string | undefined | null): value is string {
			if (this.isDefined(value)) {
				return value.trim() !== '';
			}

			return false;
		}

		private static _typeCounts = [
			{ type: UniqueIdType.NONE, count: 0 },
			{ type: UniqueIdType.ACTIVE_BUTTON, count: 0 },
			{ type: UniqueIdType.COLLAPSIBLE, count: 0 },
			{ type: UniqueIdType.MULTISELECT, count: 0 },
			{ type: UniqueIdType.MODAL, count: 0 },
			{ type: UniqueIdType.CTX_MENU, count: 0 }
		];

		/**
		 * Generates a unique ID based on the parameter type.
		 * @param {UniqueIdType} type The type to get the count for.
		 */
		public static getUniqueId(type: UniqueIdType | null | undefined): number {
			if (type === undefined || type === null) {
				for (let i = 0; i < this._typeCounts.length; i++) {
					if (this._typeCounts[i].type === UniqueIdType.NONE) {
						this._typeCounts[i].count++;
						return angular.copy(this._typeCounts[i].count);
					}
				}

				throw new Error('Invalid Unique ID Type');
			}

			for (let i = 0; i < this._typeCounts.length; i++) {
				if (this._typeCounts[i].type === type) {
					this._typeCounts[i].count++;
					return angular.copy(this._typeCounts[i].count);
				}
			}

			throw new Error('Invalid Unique ID Type');
		}
	}
}
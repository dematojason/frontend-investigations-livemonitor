namespace LiveMonitor {
	export abstract class FormatHelper {
		public static getDurationDisplay(seconds: number): string {
			let result: string = '0s';

			if (seconds) {
				const hrs: number = Math.floor(seconds / 3600);
				const min: number = Math.floor((seconds % 3600) / 60);
				const sec: number = Math.floor(seconds % 60);

				result = `${sec}s`;

				if (min > 0 || hrs > 0) {
					result = `${min}m ${result}`;

					if (hrs > 0) {
						result = `${hrs}h ${result}`;
					}
				}
			}

			return result;
		}

		public static getNameDisplay(firstName: string | null, middleName: string | null, lastName: string | null): string {
			if (firstName || middleName || lastName) {
				let result: string = '';
				if (lastName) {
					result = lastName;
					if (firstName) {
						result += `, ${firstName}`;

						if (middleName) {
							result += ` ${middleName}`;
						}
					}
				} else if (firstName) {
					result = firstName;

					if (middleName) {
						result += ` ${middleName}`;
					}
				}

				return FormatHelper.camelize(result);
			} else {
				return '';
			}
		}

		public static getPhoneDisplay(phone: string): string {
			if (CommonHelper.isDefinedNotWhitespace(phone)) {
				if (phone.length < 10) {
					return phone;
				}

				const cleaned: string = this.getOnlyDigits(phone);
				const match: RegExpMatchArray | null = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

				if (CommonHelper.isDefined(match)) {
					return `(${match[1]}) ${match[2]}-${match[3]}`;
				}

				return cleaned;
			} else {
				return '';
			}
		}

		public static getOnlyDigits(val: string): string {
			if (CommonHelper.isDefined(val)) {
				return val.replace(/[^0-9]/g, '');
			}

			return '';
		}

		public static getApinFromPin(pin: string): string {
			let apin: string = angular.copy(pin);

			while (apin.charAt(0) === '0') {
				apin = apin.substr(1);
			}

			return apin;
		}

		public static camelize(val: string): string {
			if (val === null || val === undefined) {
				return val;
			}

			val = val.toLowerCase();
			const splitVals: string[] = val.split(' ');

			for (let i = 0; i < splitVals.length; i++) {
				splitVals[i] = splitVals[i].charAt(0).toUpperCase() + splitVals[i].slice(1);
			}

			return splitVals.join(' ');
		}

		public static getTimeDisplay(val: string): string | null {
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
				const hr: string = val.substring(0, 2);
				const min: string = val.substring(2, 4);
				const sec: string = val.substring(4, 6);

				return `${hr}:${min}:${sec}`;
			}

			return val;
		}

		// Duration is in seconds
		public static getEndTimeDisplay(startTime: string | null, duration: number) {
			if (startTime === null || startTime === undefined || startTime === '') {
				return startTime;
			}

			if (duration === null || duration === undefined || duration === 0) {
				return startTime;
			}

			const timeComponents: string[] = startTime.split(':');
			if (timeComponents.length !== 3) {
				return startTime;
			}

			let hr: number = parseInt(timeComponents[0]);
			let min: number = parseInt(timeComponents[1]);
			let sec: number = parseInt(timeComponents[2]) + duration;

			if (sec < 60) {
				return this.createTimeResult(hr, min, sec);
			}

			const secRemainder: number = sec % 60;
			min = min + ((sec - secRemainder) / 60);
			sec = secRemainder;

			if (min < 60) {
				return this.createTimeResult(hr, min, sec);
			}

			const minRemainder: number = min % 60;
			hr = hr + ((min - minRemainder) / 60);
			min = minRemainder;

			if (hr < 24) {
				return this.createTimeResult(hr, min, sec);
			}

			hr = hr - 24;
			return this.createTimeResult(hr, min, sec);
		}

		private static createTimeResult(hr: number, min: number, sec: number) {
			return `${FormatHelper.twoDigit(hr)}:${FormatHelper.twoDigit(min)}:${FormatHelper.twoDigit(sec)}`;
		}

		public static twoDigit(val: number): string | null {
			if (val === null || val === undefined) {
				return null;
			}

			if (val < 10) {
				return `0${val}`;
			}

			return val.toString();
		}

		public static getCircuitDisplay(description: string | null | undefined, ani: string | null | undefined): string {
			let result: string = 'N/A';
			let descrHasVal: boolean = false;

			if (CommonHelper.isDefinedNotWhitespace(description)) {
				descrHasVal = true;
				result = description;
			}

			if (CommonHelper.isDefinedNotWhitespace(ani)) {
				if (descrHasVal) {
					result += ` (${ani})`;
				} else {
					result = ani;
				}
			}

			return result;
		}

		public static getInmateDisplay(name: string | null | undefined, pin: string | null | undefined): string {
			let result: string = 'N/A';
			let nameHasVal: boolean = false;

			if (CommonHelper.isDefinedNotWhitespace(name)) {
				nameHasVal = true;
				result = name;
			}

			if (CommonHelper.isDefinedNotWhitespace(pin)) {
				const apin: string = FormatHelper.getApinFromPin(pin);

				if (nameHasVal) {
					result += ` (${apin})`;
				} else {
					result = apin;
				}
			}

			return result;
		}
	}
}
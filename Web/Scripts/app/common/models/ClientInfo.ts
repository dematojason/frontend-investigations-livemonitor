namespace LiveMonitor {
	export class ClientInfo {
		private _browserName: string;
		public get browserName(): string {
			return this._browserName;
		}

		private _browserVersion: string;
		public get browserVersion(): string {
			return this._browserVersion;
		}

		private _osName: string;
		public get osName(): string {
			return this._osName;
		}

		private _osVersion: string;
		public get osVersion(): string {
			return this._osVersion;
		}

		private _appName: string = navigator.appName;
		private _appVer: string = navigator.appVersion;
		private _userAgt: string = navigator.userAgent;
		private readonly _clientStrings: ClientString[] = [
			{ name: 'Windows 10', reg: /(Windows 10.0|Windows NT 10.0)/ },
			{ name: 'Windows 8.1', reg: /(Windows 8.1|Windows NT 6.3)/ },
			{ name: 'Windows 8', reg: /(Windows 8|Windows NT 6.2)/ },
			{ name: 'Windows 7', reg: /(Windows 7|Windows NT 6.1)/ },
			{ name: 'Windows Vista', reg: /Windows NT 6.0/ },
			{ name: 'Windows Server 2003', reg: /Windows NT 5.2/ },
			{ name: 'Windows XP', reg: /(Windows NT 5.1|Windows XP)/ },
			{ name: 'Windows 2000', reg: /(Windows NT 5.0|Windows 2000)/ },
			{ name: 'Windows ME', reg: /(Win 9x 4.90|Windows ME)/ },
			{ name: 'Windows 98', reg: /(Windows 98|Win98)/ },
			{ name: 'Windows 95', reg: /(Windows 95|Win95|Windows_95)/ },
			{ name: 'Windows NT 4.0', reg: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
			{ name: 'Windows CE', reg: /Windows CE/ },
			{ name: 'Windows 3.11', reg: /Win16/ },
			{ name: 'Android', reg: /Android/ },
			{ name: 'Open BSD', reg: /OpenBSD/ },
			{ name: 'Sun OS', reg: /SunOS/ },
			{ name: 'Linux', reg: /(Linux|X11)/ },
			{ name: 'iOS', reg: /(iPhone|iPad|iPod)/ },
			{ name: 'Mac OS X', reg: /Mac OS X/ },
			{ name: 'Mac OS', reg: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
			{ name: 'QNX', reg: /QNX/ },
			{ name: 'UNIX', reg: /UNIX/ },
			{ name: 'BeOS', reg: /BeOS/ },
			{ name: 'OS/2', reg: /OS\/2/ },
			{ name: 'Search Bot', reg: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
		];

		constructor() {
			this.setOsProps();
			this.setBrowserProps();
		}

		private setBrowserProps(): void {
			let temp: any;
			let propsSet: boolean = false;
			let uaMatch: RegExpMatchArray = this._userAgt.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

			if (/trident/i.test(uaMatch[1])) {
				temp = /\brv[ :]+(\d+)/g.exec(this._userAgt) || [];

				this._browserName = 'IE';
				this._browserVersion = temp[1] || 'N/A';
				propsSet = true;
			} else if (uaMatch[1] === 'Chrome') {
				temp = this._userAgt.match(/\b(OPR|Edge)\/(\d+)/);
				if (temp != null) {
					this._browserName = temp[1].replace('OPR', 'Opera');
					this._browserVersion = temp[2];
					propsSet = true;
				}
			}

			if (!propsSet) {
				uaMatch = uaMatch[2] ? [uaMatch[1], uaMatch[2]] : [this._appName, this._appVer, '-?'];
				if ((temp = this._userAgt.match(/version\/(\d+)/i)) != null) {
					uaMatch.splice(1, 1, temp[1]);
				}

				this._browserName = uaMatch[0];
				this._browserVersion = uaMatch[1];
			}
		}

		private setOsProps(): void {
			let osName: string = '-';
			let osVersion: string | null = '-';

			for (let i = 0; i < this._clientStrings.length; i++) {
				const cs = this._clientStrings[i];
				if (cs.reg.test(this._userAgt)) {
					osName = cs.name;
					break;
				}
			}

			let osResult: RegExpExecArray | null;
			if (/Windows/.test(osName)) {
				osResult = /Windows (.*)/.exec(osName);
				if (osResult !== null) {
					osVersion = osResult[1];
				}
				osName = 'Windows';
			}

			switch (osName) {
				case 'Mac OS X':
					osResult = /Mac OS X (10[\.\_\d]+)/.exec(this._userAgt);
					if (osResult !== null) {
						osVersion = osResult[1];
					}
					break;
				case 'Android':
					osResult = /Android ([\.\_\d]+)/.exec(this._userAgt);
					if (osResult !== null) {
						osVersion = osResult[1];
					}
					break;
				case 'iOS':
					const tmp: RegExpExecArray | null = /OS (\d+)_(\d+)_?(\d+)?/.exec(this._appVer);
					if (tmp !== null) {
						osVersion = `${tmp[1]}.${tmp[2]}.${(tmp[3] as any | 0)}`;
					}
					break;
			}

			this._osName = osName;
			this._osVersion = osVersion;
		}
	}

	class ClientString {
		public name: string;
		public reg: RegExp;
	}
}
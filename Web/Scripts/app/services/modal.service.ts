namespace LiveMonitor.Services {
	export interface IBasicModalService {
		showModal(title: string, msgBody: string, confirmBtnText?: string, denyBtnText?: string): any;
	}

	class BasicModalService implements IBasicModalService {
		static $inject = ['$uibModal'];
		constructor(private readonly _$uibModal: any) {
		}

		public showModal(title: string, msgBody: string, confirmBtnText?: string, denyBtnText?: string) {
			let confirmText = confirmBtnText;
			let denyText = denyBtnText;

			if (confirmBtnText === null || confirmBtnText === undefined) {
				confirmText = 'OK';
			}

			if (denyBtnText === null || denyBtnText === undefined) {
				denyText = 'Cancel';
			}

			const modalInstance = this._$uibModal.open({
				templateUrl: 'Templates/components/basicModal.html',
				controller: 'basicModalController',
				size: 'md',
				resolve: {
					title: () => { return title; },
					msgBody: () => { return msgBody; },
					confirmBtnText: () => { return confirmText; },
					denyBtnText: () => { return denyText; }
				}
			});

			return modalInstance;
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.BasicModalService', BasicModalService);
}
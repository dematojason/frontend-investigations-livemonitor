namespace LiveMonitor {
	export interface ICircuit {
		ani: string;
		siteId: string;
		scheduleId: string;
		circuitStatus: CircuitStatus;
		description: string;
		recordingLevel: string;
		deviceTypeId: number;
	}

	export class CircuitDto implements ICircuit {
		public ani: string;
		public siteId: string;
		public scheduleId: string;
		public circuitStatus: CircuitStatus;
		public description: string;
		public recordingLevel: string;
		public deviceTypeId: number;
	}

	export class LiveCircuitEntry implements ICircuit {
		public ani: string;
		public siteId: string;
		public scheduleId: string;
		public circuitStatus: CircuitStatus;
		public description: string;
		public recordingLevel: string;
		public deviceTypeId: number;
		public facilityName: string;
		public call: Call;
	}
}
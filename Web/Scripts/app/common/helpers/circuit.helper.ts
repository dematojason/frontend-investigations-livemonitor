namespace LiveMonitor {
	export abstract class CircuitHelper {
		/**
		 * Checks to see if the calls of @param c1 and @param c2 are the same.
		 * @param c1 The first LiveCircuitEntry
		 * @param c2 The second LiveCircuitEntry
		 */
		public static isCallMatch(c1: LiveCircuitEntry, c2: LiveCircuitEntry): boolean {
			if (CommonHelper.isDefined(c1) && CommonHelper.isDefined(c2)) {
				if (CommonHelper.isDefined(c1.call) && CommonHelper.isDefined(c2.call)) {
					return (c1.call.callId === c2.call.callId && c1.ani === c2.ani && c1.call.unitId === c2.call.unitId && c1.call.lineId === c2.call.lineId);
				}
			}

			return false;
		}
	}
}
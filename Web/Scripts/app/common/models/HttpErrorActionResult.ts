namespace LiveMonitor {
	export class ActionResultErr {
		config: ActionResultErrConfig;
		data: ActionResultErrData;
		status: number | null;
		statusText: string | null;
	}

	class ActionResultErrConfig {
		data: any | null;
		method: string | null;
		url: string | null;
	}

	class ActionResultErrData {
		message: string;

		// Fields for validation errors
		modelState: any;

		// Fields for internal server errors
		exceptionMessage: string | null;
		exceptionType: string | null;
		stackTrace: string | null;
	}
}
/*
 * {data: {…}, status: 500, headers: ƒ, config: {…}, statusText: "Internal Server Error", …}
	config:
		data: null
		headers: {Accept: "application/json, text/plain, *//* ", Content-Type: "application / json; charset = utf - 8"}
		jsonpCallbackParam: "callback"
		method: "POST"
		paramSerializer: ƒ ngParamSerializer(params)
		transformRequest: [ƒ]
		transformResponse: [ƒ]
		url: "/api/audio/test?msg=Test message"
		__proto__: Object
	data:
		exceptionMessage: "Test exception thrown"
		exceptionType: "System.ArgumentException"
		message: "An error has occurred."
		stackTrace: "   at CpcLiveMonitor.Web.Controllers.API.AudioController.Test(String msg) in C:\Repos\LiveMonitor\Web\Controllers\API\AudioController.cs:line 145"
		__proto__: Object
	headers: ƒ(name)
	status: 500
	statusText: "Internal Server Error"
	xhrStatus: "complete"
	__proto__: Object
 */
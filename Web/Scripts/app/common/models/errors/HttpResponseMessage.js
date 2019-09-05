var LiveMonitor;
(function (LiveMonitor) {
    var HttpResponseMessage = /** @class */ (function () {
        function HttpResponseMessage() {
        }
        return HttpResponseMessage;
    }());
    LiveMonitor.HttpResponseMessage = HttpResponseMessage;
    var HttpStatusCode;
    (function (HttpStatusCode) {
        HttpStatusCode[HttpStatusCode["CONTINUE"] = 100] = "CONTINUE";
        HttpStatusCode[HttpStatusCode["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
        HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
        HttpStatusCode[HttpStatusCode["CREATED"] = 201] = "CREATED";
        HttpStatusCode[HttpStatusCode["ACCEPTED"] = 202] = "ACCEPTED";
        HttpStatusCode[HttpStatusCode["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
        HttpStatusCode[HttpStatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
        HttpStatusCode[HttpStatusCode["RESET_CONTENT"] = 205] = "RESET_CONTENT";
        HttpStatusCode[HttpStatusCode["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
        HttpStatusCode[HttpStatusCode["AMBIGUOUS"] = 300] = "AMBIGUOUS";
        HttpStatusCode[HttpStatusCode["MOVED"] = 301] = "MOVED";
        HttpStatusCode[HttpStatusCode["REDIRECT"] = 302] = "REDIRECT";
        HttpStatusCode[HttpStatusCode["REDIRECT_METHOD"] = 303] = "REDIRECT_METHOD";
        HttpStatusCode[HttpStatusCode["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
        HttpStatusCode[HttpStatusCode["USE_PROXY"] = 305] = "USE_PROXY";
        HttpStatusCode[HttpStatusCode["UNUSED"] = 306] = "UNUSED";
        HttpStatusCode[HttpStatusCode["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
        HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
        HttpStatusCode[HttpStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
        HttpStatusCode[HttpStatusCode["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
        HttpStatusCode[HttpStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
        HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
        HttpStatusCode[HttpStatusCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
        HttpStatusCode[HttpStatusCode["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
        HttpStatusCode[HttpStatusCode["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
        HttpStatusCode[HttpStatusCode["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
        HttpStatusCode[HttpStatusCode["CONFLICT"] = 409] = "CONFLICT";
        HttpStatusCode[HttpStatusCode["GONE"] = 410] = "GONE";
        HttpStatusCode[HttpStatusCode["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
        HttpStatusCode[HttpStatusCode["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
        HttpStatusCode[HttpStatusCode["REQUEST_ENTITY_TOO_LARGE"] = 413] = "REQUEST_ENTITY_TOO_LARGE";
        HttpStatusCode[HttpStatusCode["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
        HttpStatusCode[HttpStatusCode["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
        HttpStatusCode[HttpStatusCode["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
        HttpStatusCode[HttpStatusCode["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
        HttpStatusCode[HttpStatusCode["UPGRADE_REQUIRED"] = 426] = "UPGRADE_REQUIRED";
        HttpStatusCode[HttpStatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
        HttpStatusCode[HttpStatusCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
        HttpStatusCode[HttpStatusCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
        HttpStatusCode[HttpStatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
        HttpStatusCode[HttpStatusCode["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
        HttpStatusCode[HttpStatusCode["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    })(HttpStatusCode = LiveMonitor.HttpStatusCode || (LiveMonitor.HttpStatusCode = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=HttpResponseMessage.js.map
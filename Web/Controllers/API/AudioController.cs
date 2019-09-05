using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using CpcLiveMonitor.Web.Handlers;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Web.Authentication;
using MailmanInterop;
using MailmanInterop.Models;
using Newtonsoft.Json;

namespace CpcLiveMonitor.Web.Controllers.API
{
	[RoutePrefix("api/audio")]
	public class AudioController : BaseApiController
	{
		[HttpGet, Route("live-stream")]
		[LMAuthorize(LMRoles.LM_VIEW)]
		public HttpResponseMessage GetLiveStream(Int32 callId, Int32 lineId, Int32 unitId, String ani)
		{
			HttpResponseMessage response = Request.CreateResponse();

			try
			{
				Boolean startStreaming = false;
				String argsStr = $"args: lineId: {lineId}, unitId: {unitId}, ani: {ani}, callId: {callId}";
				UInt32 responseCode = 0;

				// Only send monitor start request if the stream does not already exist.
				if (AudioHandler.IsExistingStream(callId))
				{
					_logger.LogInfo($"No monitor start request sent. Stream already exists.\r\n\t{argsStr}");
					startStreaming = true;
				}
				else
				{
					MailmanResponse mailmanResponse = CircuitsInterop.MonitorRequestStart(callId, lineId, unitId, ani);
					responseCode = CircuitsInterop.GetResponseCode(mailmanResponse);

					//CircuitsInterop.MonitorRequestStart(callId, lineId, unitId, ani, false);
					//responseCode = ResponseCodes.LM_OK;

					_logger.LogInfo($"Monitor start request sent.\r\n\t{argsStr}\r\n\tResponseCode: {responseCode}");

					switch (responseCode)
					{
						case ResponseCodes.LM_OK:
							startStreaming = true;
							AudioHandler.CreateNewStream(callId);

							break;
						case ResponseCodes.LM_INVALID_INFO:
						case ResponseCodes.LM_MONITOR_REQ_INVALID:
							response.StatusCode = HttpStatusCode.BadRequest;

							break;
						case ResponseCodes.LM_NO_MONITORING_SESSION:
						case ResponseCodes.LM_INTERNAL_ERROR:
						case ResponseCodes.LM_COMM_FAILURE:
						case ResponseCodes.LM_NOT_REGISTERED:
							response.StatusCode = HttpStatusCode.InternalServerError;

							break;
						default:
							response.StatusCode = HttpStatusCode.InternalServerError;

							break;
					}
				}

				if (startStreaming)
				{
					CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);

					response.Content = new PushStreamContent(
						async (outputStream, httpContent, context) =>
						{
							await AudioHandler.WriteToAsync(outputStream, httpContent, context, callId, lineId, unitId, ani, session.Username);
						},
						new MediaTypeHeaderValue("audio/wav")
					);

					_logger.LogInfo($"User '{session.Username}' started streaming call ID: {callId}");

					response.StatusCode = HttpStatusCode.OK;
				}
				else
				{
					_logger.LogWarning($"Request Monitor Start returned response code: {responseCode}\r\n\t{argsStr}");
				}

				return response;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Exception in GetLiveStream");
				response.StatusCode = HttpStatusCode.InternalServerError;
				response.Content = new StringContent("Error retrieving live stream audio data");
				return response;
			}
		}

		/// <summary>
		/// Writes <see cref="bytes"/> to the memory stream to be read and played to the subscribed client(s).
		/// </summary>
		/// <param name="bytes">A raw PCM audio packet.</param>
		/// <returns>
		///	200 - Call-start event broadcasted successfully | 
		/// 400 - Unabled to read <paramref name="bytes"/> or the length of <paramref name="bytes"/> is zero |
		/// 500 - Unexpected error occurred
		/// </returns>
		[HttpPost, Route("live-stream/add")]
		public async Task<IHttpActionResult> AddToLiveStream(Byte[] bytes)
		{
			try
			{
				if (bytes == null)
				{
					String msg = "bytes parameter is null";
					_logger.LogWarning(msg);
					return BadRequest(msg);
				}

				if (bytes.Length == 0)
				{
					String msg = "bytes parameter contains zero elements";
					_logger.LogWarning(msg);
					return BadRequest(msg);
				}

				await AudioHandler.WriteToBuffer(bytes);

				return Ok();
			}
			catch (Exception ex)
			{
				String errMsg = "Exception in AddToLiveStream";
				_logger.LogError(ex, errMsg);

				return InternalServerError(ex);
			}
		}

		/// <summary>
		/// Stops the live stream of the current user if a stream exists.
		/// </summary>
		/// <returns><c>true</c> if a live stream for the current user exists and was flagged to stop; otherwise <c>false</c></returns>
		[HttpPost, Route("live-stream/stop")]
		public IHttpActionResult StopLiveStream()
		{
			try
			{
				CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);

				if (String.IsNullOrWhiteSpace(session.Username))
				{
					return Ok(false);
				}

				Boolean result = AudioHandler.FlagForceStopStream(session.Username);
				if (result)
				{
					_logger.LogInfo($"Flagged stream for user '{session.Username}' to be stopped.");
				}

				return Ok(result);
			}
			catch (Exception ex)
			{
				String errMsg = "Exception in AudioController.StopLiveStream";
				_logger.LogError(ex, errMsg);

				return InternalServerError(ex);
			}
		}

		[HttpPost, Route("live-stream/request-monitor-end")]
		//[LMAuthorize(LMRoles.LM_VIEW)]
		public IHttpActionResult RequestMonitorEnd(MonitorRequestArgs args)
		{
			try
			{
				if (ModelState.IsValid)
				{
					// Send end request if there are no active listeners on that call.
					if (AudioHandler.GetActiveListenerCt(args.CallId) < 1)
					{
						MailmanResponse mailmanResponse = CircuitsInterop.MonitorRequestEnd(args.CallId, args.LineId, args.UnitId, args.Ani);
						UInt32 responseCode = CircuitsInterop.GetResponseCode(mailmanResponse);

						//CircuitsInterop.MonitorRequestEnd(args.CallId, args.LineId, args.UnitId, args.Ani, false);
						//UInt32 responseCode = ResponseCodes.LM_OK;

						_logger.LogInfo($"Sent monitor end request for call ID: {args.CallId}");

						IHttpActionResult result;

						switch (responseCode)
						{
							case ResponseCodes.LM_OK:
							case ResponseCodes.LM_NO_MONITORING_SESSION: // Monitor session already ended
								return Ok();
							case ResponseCodes.LM_INVALID_INFO:
							case ResponseCodes.LM_MONITOR_REQ_INVALID:
								result = BadRequest();
								break;
							case ResponseCodes.LM_INTERNAL_ERROR:
							case ResponseCodes.LM_COMM_FAILURE:
							case ResponseCodes.LM_NOT_REGISTERED:
								result = InternalServerError();
								break;
							default:
								result = InternalServerError();
								break;
						}

						// Reaching this point means ResponseCode was something other than OK
						_logger.LogWarning($"Request Monitor End returned response code: {responseCode}\r\n\targs: {JsonConvert.SerializeObject(args)}");
						return result;
					}

					return Ok();
				}

				return BadRequest(ModelState);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error sending call monitoring request");
				return InternalServerError(ex);
			}
		}

		[HttpPost, Route("disconnect-call")]
		[LMAuthorize(LMRoles.LM_VIEW)]
		public IHttpActionResult DisconnectCall(String ani)
		{
			try
			{
				if (String.IsNullOrWhiteSpace(ani))
					return BadRequest();

				CircuitsInterop.Shutdown(ani);

				CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);
				_logger.LogInfo($"User '{session.Username}' disconnected call on circuit '{ani}'");

				return Ok();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error trying to disconnect call");
				return InternalServerError(ex);
			}
		}
	}
}
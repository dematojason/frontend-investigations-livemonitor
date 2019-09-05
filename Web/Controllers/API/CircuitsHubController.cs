using System;
using System.Threading.Tasks;
using System.Web.Http;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Web.Repositories;
using CpcLiveMonitor.Web.Utilities.Extensions;

namespace CpcLiveMonitor.Web.Controllers.API
{
	/// <summary>
	/// Methods for interfacing with call event message broadcasts.
	/// </summary>
	[RoutePrefix("api/circuits-hub")]
	public class CircuitsHubController : BaseApiController
	{
		/// <summary>
		/// Broadcasts a new call-start event to the live monitor clients which the message pertains to.
		/// </summary>
		/// <param name="msg">The call-start event arguments object.</param>
		/// <returns>
		///	200 - Call-start event broadcasted successfully | 
		/// 400 - Unable to deserialize <paramref name="msg"/> arguments object |
		/// 500 - Unexpected error occurred
		/// </returns>
		[HttpPost, Route("messages/call-start/add")]
		public async Task<IHttpActionResult> AddCallStartMessage([FromBody] EventCallStartMsg msg)
		{
			try
			{
				if (msg?.Header == null || msg.Data == null)
				{
					_logger.LogWarning("Unable to deserialize EventCallStartMsg object. msg, msg.header or msg.data was null.");
					return BadRequest("Unable to deserialize EventCallStartMsg object.");
				}

				try
				{
					msg.PopulateInmateNames();
					msg.SetIsRecorded();
				}
				catch (Exception prodigyEx)
				{
					_logger.LogError(prodigyEx, $"Error getting inmate info within AddCallStartMessage pin: {msg.Header?.Pin ?? "null"} | site ID: {msg.Header?.SiteId ?? "null"}");
				}

				EventCallStartMsg addedMsg = await CircuitsMsgRepo.AddAndBroadcast(msg);

				if (addedMsg == null)
				{
					ArgumentException argEx = new ArgumentException("Unable to broadcast event call start message");
					_logger.LogError(argEx, "addedMsg returned null in add call-start message.");
					return InternalServerError(argEx);
				}

				return Ok();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error adding RTCM call-start message.");
				return InternalServerError(ex);
			}
		}

		/// <summary>
		/// Broadcasts a new call-end event to the live monitor clients which the message pertains to.
		/// </summary>
		/// <param name="msg">The call-end event arguments object.</param>
		/// <returns>
		///	200 - Response executed successfully | 
		/// 400 - Unable to deserialize <paramref name="msg"/> arguments object |
		/// 500 - Unexpected error occurred
		/// </returns>
		[HttpPost, Route("messages/call-end/add")]
		public async Task<IHttpActionResult> AddCallEndMessage([FromBody] EventCallEndMsg msg)
		{
			try
			{
				if (msg?.Header == null || msg.Data == null)
				{
					_logger.LogWarning("Unable to deserialize EventCallEndMsg object. msg, msg.header, or msg.data was null.");
					return BadRequest("Unable to deserialize EventCallEndMsg object.");
				}

				try
				{
					msg.PopulateInmateNames();
				}
				catch (Exception prodigyEx)
				{
					_logger.LogError(prodigyEx, $"Error getting inmate info within AddCallStartMessage pin: {msg.Header?.Pin ?? "null"} | site ID: {msg.Header?.SiteId ?? "null"}");
				}

				EventCallEndMsg addedMsg = await CircuitsMsgRepo.AddAndBroadcast(msg);

				if (addedMsg == null)
				{
					ArgumentException argEx = new ArgumentException("Unable to broadcast event call end message");
					_logger.LogError(argEx, "addedMsg returned null in add call-end message.");
					return InternalServerError(argEx);
				}

				return Ok();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error adding RTCM call-end message.");
				return InternalServerError(ex);
			}
		}
	}
}
using System;
using System.Web.Http;
using CpcLiveMonitor.Domain.DTOs;
using CpcLiveMonitor.Web.Authentication;

namespace CpcLiveMonitor.Web.Controllers.API
{
	[RoutePrefix("api/log")]
	public class LogController : BaseApiController
	{
		[HttpPost, Route("write")]
		//[LMAuthorize(LMRoles.LM_VIEW)]
		public IHttpActionResult Write(WriteLogArgs args)
		{
			try
			{
				if (ModelState.IsValid)
				{
					_logger.Log(args.LogLevel, $"{args.ShortDescription}\r\n\t URL: {args.Url ?? "N/A"}\r\n{args.ErrorAsJson}");

					//CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);
					//Logging loggingArgs = LoggingHelper.GetLoggingDto(args, session);
					//new UtilityServiceLoggingProxyNetPipe().LogMessageFireAndForget(loggingArgs);

					return Ok();
				}

				return BadRequest();
			}
			catch (Exception ex)
			{
				try
				{
					_logger.LogError(ex, "Failed to write to log at api/log/write");
				}
				catch
				{
					// No more we can do here.
				}

				return InternalServerError(ex);
			}
		}
	}
}
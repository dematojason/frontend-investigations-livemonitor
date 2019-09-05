using System;
using System.Collections.Generic;
using System.Web.Http;
using CpcLiveMonitor.Web.Authentication;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Web.Repositories;
using Newtonsoft.Json;

namespace CpcLiveMonitor.Web.Controllers.API
{
	[RoutePrefix("api/circuits")]
	public class CircuitController : BaseApiController
	{
		[HttpPost, Route("get-circuits")]
		[LMAuthorize(LMRoles.LM_VIEW)]
		public IHttpActionResult GetCircuits(GetCircuitArguments args)
		{
			try
			{
				if (ModelState.IsValid)
				{
					List<Circuit> result = CircuitRepo.GetCircuits(args);
					_logger.LogInfo($"GetCircuits results: {result?.Count ?? 0}");
					_logger.LogInfo($"GetCircuits args: {JsonConvert.SerializeObject(args)}");

					return Ok(result);
				}

				return BadRequest(ModelState);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error trying to get circuits");
				return InternalServerError(ex);
			}
		}
	}
}
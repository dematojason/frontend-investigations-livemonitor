using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using CpcLiveMonitor.Utility;
using CpcLiveMonitor.Web.Authentication;
using CpcLiveMonitor.Utility.Dtos;

namespace CpcLiveMonitor.Web.Controllers.API
{
	[RoutePrefix("api/inmates")]
	public class InmateController : BaseApiController
	{
		[HttpPost, Route("load")]
		[LMAuthorize(LMRoles.LM_VIEW)]
		public async Task<IHttpActionResult> LoadInmates(GetInmateArgs args)
		{
			try
			{
				if (ModelState.IsValid)
				{
					List<InmateAccountDto> result = await DbAccessor.LoadInmateAccounts(args);

					return Ok(result);
				}

				return BadRequest(ModelState);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Failed to load ");
				return InternalServerError(ex);
			}
		}
	}
}
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Web.Authentication;
using CpcLiveMonitor.Web.Handlers;
using CpcLiveMonitor.Web.Repositories;

namespace CpcLiveMonitor.Web.Controllers.API
{
	[RoutePrefix("api/users")]
	public class UserController : BaseApiController
	{
		[HttpGet, Route("facilities")]
		[LMAuthorize(LMRoles.LM_VIEW)]
		public IHttpActionResult Facilities()
		{
			try
			{
				_logger.LogInfo("Getting list of current user's facilities...");

				CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);

				DomainFacilityArguments args = new DomainFacilityArguments();
				args.DomainId = session.DomainId;

				// <SiteId, Name>
				Dictionary<String, Object> domainFacilities = DomainFacilityRepo.GetDomainFacilities(args);

				_logger.LogInfo($"Domain facilities retrieved {domainFacilities?.Count ?? 0}");

				return Ok(domainFacilities);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Failed to load current user's domain facilities.");
				return InternalServerError(ex);
			}
		}
	}
}
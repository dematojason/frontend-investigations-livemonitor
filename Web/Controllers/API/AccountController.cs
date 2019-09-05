using System;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Utility.EntityFramework.Scidyn;
using CpcLiveMonitor.Web.Authentication;
using CpcLiveMonitor.Web.Handlers;
using CpcLiveMonitor.Web.Repositories;

namespace CpcLiveMonitor.Web.Controllers.API
{
	[RoutePrefix("api/account")]
	public class AccountController : BaseApiController
	{
		[LMAuthenticate(RequiredRoles = new[] { LMRoles.LM_VIEW })]
		[HttpPost, Route("login")]
		[EnableCors(origins: "*", headers: "*", methods: "*")]
		public IHttpActionResult Login([FromBody] LoginArguments loginArgs)
		{
			try
			{
				LoginResponse result = GetLoginResponse();

				return Ok(result);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error attempting to log in user.");
				return InternalServerError(); // Don't return specific error, user not authenticated yet.
			}
		}

		[LMAuthenticate(RequiredRoles = new[] { LMRoles.LM_VIEW })]
		[HttpPost, Route("kinetic-login")]
		[EnableCors(origins: "*", headers: "*", methods: "*")]
		public IHttpActionResult KineticLogin([FromBody] LoginArguments args)
		{
			try
			{
				LoginResponse result = GetLoginResponse();

				return Ok(result);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error attempting to log in Kinetic Console user.");
				return InternalServerError();
			}
		}

		private LoginResponse GetLoginResponse()
		{
			CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);
			User user = AccountRepo.GetKcUser(session.Username);

			LoginResponse result = new LoginResponse();
			result.FirstName = user.FirstName;
			result.LastName = user.LastName;
			result.Username = user.UserName;
			result.Email = user.Email;
			result.IsMilitaryDisplay = false; // TODO Get from db
			result.Permissions = session.LMRoles;

			return result;
		}

		[HttpPost, Route("logout")]
		public IHttpActionResult Logout()
		{
			try
			{
				CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);
				session.Reset();

				return Ok();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error attempting to log out user.");
				return InternalServerError();
			}
		}

		[HttpGet, Route("register")]
		public IHttpActionResult Register()
		{
			// Tell IIS to create a session by setting a session variable.
			HttpContext.Current.Session["GIVEMECOOKIE"] = "GIVEMECOOKIENOW";

			return Ok();
		}

		[HttpGet, Route("authenticated")]
		public IHttpActionResult Authenticated()
		{
			try
			{
				if (HttpContext.Current?.User != null)
				{
					return Ok(HttpContext.Current.User.Identity.IsAuthenticated);
				}

				return Ok(false);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error checking if user is authenticated.");
				return InternalServerError();
			}
		}
	}
}
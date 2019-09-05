using System;
using System.Web.Mvc;

namespace CpcLiveMonitor.Web.Controllers
{
	[RoutePrefix("account")]
	public class AccountController : Controller
	{
		[Route("login")]
		public ActionResult Login(String token)
		{
			if (!String.IsNullOrWhiteSpace(token))
			{
				ViewBag.Token = token;
			}

			return this.View();
		}
	}
}
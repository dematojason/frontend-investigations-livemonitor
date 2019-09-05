using System;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.SessionState;
using ProdigyFlatFileLogger;

namespace CpcLiveMonitor.Web
{
	public class MvcApplication : HttpApplication
	{
		private static readonly ILogger _logger = new Logger();

		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();
			GlobalConfiguration.Configure(WebApiConfig.Register);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
		}

		protected void Application_PostAuthorizeRequest()
		{
			HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
		}

		protected void Application_BeginRequest(Object sender, EventArgs e)
		{
			if (!Request.IsLocal)
			{
				switch (Request.Url.Scheme)
				{
					case "https":
						Response.AddHeader("Strict-Transport-Security", "max-age=300");
						break;
					case "http":
						String path = "https://" + Request.Url.Host + Request.Url.PathAndQuery;
						try
						{
							String logMsg = "Redirect http to https:";
							logMsg += $"\tsrc 'http://{Request.Url.Host}{Request.Url.PathAndQuery}'";
							logMsg += $"\tdest '{path}'";
							_logger.LogInfo(logMsg);
						}
						catch
						{
							// Can't do anything, move on.
						}
						Response.Status = "301 Moved Permanently";
						Response.AddHeader("Location", path);
						break;
				}
			}
		}
	}
}
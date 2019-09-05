using System;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using CpcLiveMonitor.Web.Handlers;
using CpcLiveMonitor.Web.Utilities.Helpers;

namespace CpcLiveMonitor.Web.Authentication
{
	// ReSharper disable once InconsistentNaming
	public class LMAuthorizeAttribute : ActionFilterAttribute
	{
		public String[] RequiredRoles { get; set; }


		public LMAuthorizeAttribute(params String[] requiredRoles)
		{
			this.RequiredRoles = requiredRoles ?? new String[] { };
		}

		public override void OnActionExecuting(HttpActionContext actionContext)
		{
			// Check if the class or method has AllowAnonymousAttribute defined.
			Boolean allowAnonymous = actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Count > 0
									 || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Count > 0;

			if (!allowAnonymous)
			{
				try
				{
					CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);

					if (session.IsAuthenticated)
					{
						if (session.IsTokenExpired)
						{
							SetUnauthorizedRedirect(actionContext, Constants.UNAUTHORIZED_EXPIRED_TOKEN);
						}
						else if (!session.HasRoles(RequiredRoles))
						{
							SetUnauthorizedRedirect(actionContext, Constants.UNAUTHORIZED_REQUIRED_ROLES);
						}
					}
					else
					{
						SetUnauthorizedRedirect(actionContext, Constants.UNAUTHORIZED_UNAUTHENTICATED);
					}
				}
				catch (Exception ex)
				{
					SetInternalServerError(actionContext);
					actionContext.Response.Headers.Add("Error", ex.Message);
					if (ex.InnerException != null)
					{
						actionContext.Response.Headers.Add("ErrorInner", ex.InnerException.Message);
					}
				}
			}
		}

		private static void SetInternalServerError(HttpActionContext actionContext)
		{
			try
			{
				CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);
				session.Reset();
			}
			catch (Exception)
			{
				// Try to reset session, but could have been cause of this method call, so have to carry on.
			}

			actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.InternalServerError);
		}

		private static void SetUnauthorizedRedirect(HttpActionContext actionContext, String reasonPhrase)
		{
			CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);
			session.Reset();

			HttpResponseMessage response = actionContext.Request.CreateResponse(HttpStatusCode.Redirect);
			response.ReasonPhrase = reasonPhrase;

			Uri redirectUri = new Uri(UrlHelper.GetLoginRedirectUrl());

			response.Headers.Location = redirectUri;
			actionContext.Response = response;
		}
	}
}
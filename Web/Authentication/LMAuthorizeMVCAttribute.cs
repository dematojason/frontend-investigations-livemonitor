using System;
using System.Diagnostics;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using CpcLiveMonitor.Web.Handlers;

// ReSharper disable InconsistentNaming

namespace CpcLiveMonitor.Web.Authentication
{
	/// <summary>
	/// Attribute for authorizing current user within an MVC controller class/method.
	/// </summary>
	[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
	public class LMAuthorizeMVCAttribute : ActionFilterAttribute
	{
		public String[] RequiredRoles { get; set; }


		public LMAuthorizeMVCAttribute(params String[] requiredRoles)
		{
			this.RequiredRoles = requiredRoles ?? new String[] { };
		}


		public override void OnActionExecuted(ActionExecutedContext actionContext)
		{
			base.OnActionExecuted(actionContext);
		}

		public override void OnActionExecuting(ActionExecutingContext actionContext)
		{
			// Check if the class or method has AllowAnonymousAttribute defined.
			Boolean allowAnonymous = actionContext.ActionDescriptor.GetCustomAttributes(typeof(AllowAnonymousAttribute), false).Length > 0 ||
									 actionContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(AllowAnonymousAttribute), false).Length > 0;

			if (!allowAnonymous)
			{
				try
				{
					Boolean userAuthorized = false;

					CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);

					if (session.IsAuthenticated && !session.IsTokenExpired)
					{
						userAuthorized = session.HasRoles(RequiredRoles);
					}

					if (!userAuthorized)
					{
						SetUnauthorized(actionContext);
					}
				}
				catch (Exception ex)
				{
					Debug.WriteLine(ex.Message);
					if (ex.InnerException != null)
					{
						Debug.WriteLine(ex.InnerException.Message);
					}

					SetUnauthorized(actionContext);
				}
			}

			base.OnActionExecuting(actionContext);
		}

		public override void OnResultExecuted(ResultExecutedContext resultContext)
		{
			base.OnResultExecuted(resultContext);
		}

		public override void OnResultExecuting(ResultExecutingContext resultContext)
		{
			base.OnResultExecuting(resultContext);
		}

		private static void SetUnauthorized(ActionExecutingContext actionContext)
		{
			CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);
			session.Reset();

			RouteValueDictionary loginRoute = new RouteValueDictionary
			{
				{"controller", "Account" },
				{"action", "Login" }
			};
			actionContext.Result = new RedirectToRouteResult(loginRoute);
		}
	}
}
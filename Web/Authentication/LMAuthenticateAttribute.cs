using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Web;
//using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Domain.DTOs;
using CpcLiveMonitor.Utility.EntityFramework.Scidyn;
using CpcLiveMonitor.Utility.Helpers;
using CpcLiveMonitor.Web.Handlers;
using CpcLiveMonitor.Web.Repositories;
using CpcLiveMonitor.Web.Utilities.Helpers;
using Newtonsoft.Json;
using ProdigyFlatFileLogger;

namespace CpcLiveMonitor.Web.Authentication
{
	// ReSharper disable once InconsistentNaming
	[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
	public class LMAuthenticateAttribute : AuthorizationFilterAttribute
	{
		private readonly ILogger _logger = new Logger();
		public String[] RequiredRoles { get; set; } = { };


		public override void OnAuthorization(HttpActionContext actionContext)
		{
			Boolean allowAnonymous = actionContext.ActionDescriptor.GetCustomAttributes<System.Web.Http.AllowAnonymousAttribute>().Count > 0
								|| actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<System.Web.Http.AllowAnonymousAttribute>().Count > 0;

			if (!allowAnonymous)
			{
				CurrentSessionHandler session = new CurrentSessionHandler(HttpContext.Current.Session);

				try
				{
					LoginArgs loginArgs;
					String authToken = null;
					// Get request body object
					using (StreamReader sr = new StreamReader(actionContext.Request.Content.ReadAsStreamAsync().Result))
					{
						sr.BaseStream.Position = 0;
						String srStr = sr.ReadToEnd();
						_logger.LogInfo(srStr);
						loginArgs = JsonConvert.DeserializeObject<LoginArgs>(srStr);

						if (!String.IsNullOrWhiteSpace(loginArgs?.Token))
						{
							_logger.LogInfo("Logging in Kinetic Console user with token...");
							authToken = loginArgs.Token;
						}
					}

					// ReSharper disable once ConstantConditionalAccessQualifier
					if ((String.IsNullOrWhiteSpace(loginArgs?.Username) || String.IsNullOrWhiteSpace(loginArgs.Password)) && String.IsNullOrWhiteSpace(loginArgs?.Token))
					{
						SetUnauthorized(actionContext, session);
					}
					else
					{
						if (authToken == null)
						{
							LoginArguments loginArguments = new LoginArguments();
							loginArguments.Username = loginArgs.Username;
							loginArguments.Password = loginArgs.Password;

							authToken = AccountRepo.RetrieveAuthToken(loginArguments);
						}

						LoginData loginData = AccountRepo.GetLoginData(authToken);

						_logger.LogInfo($"LoginData retrieved: {JsonConvert.SerializeObject(loginData)}");

						String[] userRoles = AccountRepo.GetKcUserPermissions(loginData.UserId).ToArray();

						_logger.LogInfo($"User Roles retrieved: {JsonConvert.SerializeObject(userRoles)}");

						Boolean userAuthorized = false;
						if (!String.IsNullOrWhiteSpace(authToken))
						{
							session.LMRoles = userRoles;
							userAuthorized = session.HasRoles(RequiredRoles);
							if (!userAuthorized)
							{
								_logger.LogWarning($"User does not have required roles.\r\n\tRequired Roles: {JsonConvert.SerializeObject(RequiredRoles)}");
							}
						}
						else
						{
							_logger.LogWarning("User has invalid auth token");
						}

						if (userAuthorized)
						{
							// Give IIS a few seconds to create the session ID if it hasn't already been created
							CookieHeaderValue sessionId = null;
							Int32 tryCt = 0;
							while (tryCt < 10)
							{
								sessionId = actionContext.Request.Headers.GetCookies("ASP.NET_SessionId").FirstOrDefault();
								if (sessionId != null)
								{
									break;
								}

								Thread.Sleep(500);
								tryCt++;
							}

							if (sessionId == null)
							{
								_logger.LogWarning("Unable to find ASP.NET SessionId");
								SetUnauthorized(actionContext, session);
							}
							else
							{
								User user = AccountRepo.GetKcUser(loginData.UserId);

								LMUser lmUser = new LMUser();
								lmUser.AuthToken = authToken;
								lmUser.TokenExpiresUtc = DateTime.UtcNow.AddSeconds(loginData.ExpirationSeconds);
								lmUser.IsAuthenticated = true;
								lmUser.UserName = loginData.UserId;
								lmUser.Roles = userRoles;
								lmUser.SessionId = sessionId["ASP.NET_SessionId"].Value;
								lmUser.DomainId = user.DomainId;

								lmUser.DomainName = Caching.GetDomainName(user.DomainId);

								session.AuthToken = authToken;
								session.TokenExpiresUtc = DateTime.UtcNow.AddSeconds(loginData.ExpirationSeconds);
								session.IsAuthenticated = true;
								session.Username = loginData.UserId;
								session.DomainId = user.DomainId;

								// Remove DomainUser if exists so Signal-R connection ID for this user is reset.
								DomainUsersHandler.RemoveDomainUser(lmUser.UserName);

								// Add new DomainUser
								DomainUsersHandler.AddDomainUser(user.DomainId, lmUser);

								_logger.LogInfo($"User '{lmUser.UserName}' successfully logged in");
								_logger.LogInfo($"User Info: {JsonConvert.SerializeObject(lmUser)}");

								base.OnAuthorization(actionContext);
							}
						}
						else
						{
							SetUnauthorized(actionContext, session);
							_logger.LogWarning($"User does not have required permissions. Required roles: {JsonConvert.SerializeObject(RequiredRoles)}");
						}
					}
				}
				catch (Exception ex)
				{
					SetUnauthorized(actionContext, session);
					actionContext.Response.Headers.Add("Error", ex.Message);
					_logger.LogError(ex, "Error authenticating user");

					if (ex.InnerException != null)
					{
						actionContext.Response.Headers.Add("ErrorInner", ex.InnerException.Message);
						_logger.LogError(ex.InnerException, "Error authenticating user (Inner Exception)");
					}
				}
			}
		}

		private void SetUnauthorized(HttpActionContext actionContext, CurrentSessionHandler session)
		{
			session.Reset();

			actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
		}
	}
}
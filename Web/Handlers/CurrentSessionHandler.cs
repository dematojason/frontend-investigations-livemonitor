using System;
using System.Linq;
using System.Web.SessionState;
// ReSharper disable InconsistentNaming

namespace CpcLiveMonitor.Web.Handlers
{
	public class CurrentSessionHandler
	{
		public String AuthToken
		{
			get => _sessionState["AuthToken"]?.ToString();
			set => _sessionState["AuthToken"] = value;
		}

		public Int32 DomainId
		{
			get
			{
				if (Int32.TryParse(_sessionState["DomainId"]?.ToString(), out Int32 domainId))
				{
					return domainId;
				}

				return 0;
			}
			set => _sessionState["DomainId"] = value;
		}

		public Boolean IsAuthenticated
		{
			get => (Boolean?)_sessionState["IsAuthenticated"] ?? false;
			set => _sessionState["IsAuthenticated"] = value;
		}

		public Boolean IsTokenExpired
		{
			get
			{
				if (this.TokenExpiresUtc > DateTime.UtcNow)
				{
					return false;
				}

				return true;
			}
		}

		public String[] LMRoles
		{
			get
			{
				Object userRolesObj = _sessionState["LMRoles"];
				if (userRolesObj == null)
				{
					return new String[] { };
				}

				try
				{
					String[] userRoles = (String[])userRolesObj;
					return userRoles;
				}
				catch
				{
					return new String[] { };
				}
			}

			set => _sessionState["LMRoles"] = value;
		}

		public DateTime? TokenExpiresUtc
		{
			get
			{
				if (DateTime.TryParse(_sessionState["TokenExpiresUtc"]?.ToString(), out DateTime tokenExpiresUtc))
				{
					return tokenExpiresUtc;
				}

				return null;
			}

			set => _sessionState["TokenExpiresUtc"] = value;
		}

		public String Username
		{
			get => _sessionState["Username"]?.ToString();
			set => _sessionState["Username"] = value;
		}

		private readonly HttpSessionState _sessionState;


		public CurrentSessionHandler(HttpSessionState sessionState)
		{
			_sessionState = sessionState;
		}


		public void Reset()
		{
			this.AuthToken = null;
			this.DomainId = 0;
			this.IsAuthenticated = false;
			this.LMRoles = null;
			this.TokenExpiresUtc = null;
			this.Username = null;
		}

		public Boolean HasRoles(String[] requiredRoles)
		{
			String[] userRoles = this.LMRoles;

			if (requiredRoles?.Length > 0)
			{
				if (userRoles != null && userRoles.Length > 0)
				{
					// Set hasRole to true if they have ADMIN_BACK_OFFICE role.
					foreach (String userRole in userRoles)
					{
						if (userRole == Authentication.LMRoles.ADMIN_BACK_OFFICE)
						{
							return true;
						}
					}

					// Return true if all RequiredRoles elements exist in userRoles.
					return !requiredRoles.Except(userRoles).Any();
				}
			}
			else
			{
				return true;
			}

			return false;
		}
	}
}
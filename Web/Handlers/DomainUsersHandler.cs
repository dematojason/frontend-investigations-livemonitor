using System;
using System.Collections.Generic;
using CpcLiveMonitor.Domain;

namespace CpcLiveMonitor.Web.Handlers
{
	public static class DomainUsersHandler
	{
		private static readonly TalkingStick _domainUsersTalkingStick = new TalkingStick();
		private static readonly Dictionary<Int32, List<LMUser>> _domainUsers = new Dictionary<Int32, List<LMUser>>();


		public static void RemoveDomainUser(String username)
		{
			foreach (KeyValuePair<Int32, List<LMUser>> keyVal in _domainUsers)
			{
				for (Int32 i = 0; i < _domainUsers[keyVal.Key].Count; i++)
				{
					if (_domainUsers[keyVal.Key][i].UserName == username)
					{
						lock (_domainUsersTalkingStick)
						{
							_domainUsers[keyVal.Key].RemoveAt(i);
						}
					}
				}
			}
		}

		public static void AddDomainUser(Int32 domainId, LMUser user)
		{
			lock (_domainUsersTalkingStick)
			{
				if (_domainUsers.ContainsKey(domainId))
				{
					_domainUsers[domainId].Add(user);
				}
				else
				{
					_domainUsers.Add(domainId, new List<LMUser> { user });
				}
			}
		}

		/// <summary>
		/// Adds relationship between Signal-R connection ID and a user's session ID.
		/// </summary>
		/// <param name="sessionId">Current user's ASP.NET session ID</param>
		/// <param name="connectionId">Signal-R connetion ID</param>
		/// <returns>The user's domain name.</returns>
		public static String AddConnectionId(String sessionId, String connectionId)
		{
			foreach (KeyValuePair<Int32, List<LMUser>> keyVal in _domainUsers)
			{
				foreach (LMUser user in _domainUsers[keyVal.Key])
				{
					if (user.SessionId == sessionId)
					{
						user.ConnectionId = connectionId;
						return user.DomainName;
					}
				}
			}

			throw new KeyNotFoundException();
		}

		public static LMUser GetUser(String sessionId)
		{
			foreach (KeyValuePair<Int32, List<LMUser>> keyVal in _domainUsers)
			{
				foreach (LMUser user in _domainUsers[keyVal.Key])
				{
					if (user.SessionId == sessionId)
					{
						return user;
					}
				}
			}

			throw new KeyNotFoundException();
		}
	}

	public class LMUser
	{
		public Int32 DomainId { get; set; }
		public String DomainName { get; set; }
		public String SessionId { get; set; }
		public String ConnectionId { get; set; }
		public String AuthToken { get; set; }
		public DateTime TokenExpiresUtc { get; set; }
		public Boolean IsAuthenticated { get; set; }
		public String UserName { get; set; }
		public String[] Roles { get; set; }
	}
}
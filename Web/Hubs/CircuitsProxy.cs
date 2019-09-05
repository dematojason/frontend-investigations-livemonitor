using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Utility.Helpers;
using CpcLiveMonitor.Web.Handlers;
using CpcLiveMonitor.Web.Repositories;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace CpcLiveMonitor.Web.Hubs
{
	[HubName("circuitsHub")]
	public class CircuitsProxy : Hub<ICircuitsHubCallbacks>, ICircuitsHubCalls
	{
		public override async Task OnConnected()
		{
			String sessionId = Context.Request.Cookies["ASP.NET_SessionId"].Value;
			String domain;

			try
			{
				domain = DomainUsersHandler.AddConnectionId(sessionId, Context.ConnectionId);
			}
			catch (KeyNotFoundException)
			{
				// The user has not logged in with the current session ID.
				await Clients.Caller.BroadcastRedirectToLogin();
				return;
			}

			await Groups.Add(Context.ConnectionId, domain);

			await base.OnConnected();
		}

		public IEnumerable<IRtcmMsg> GetRtcmMessages()
		{
			return CircuitsMsgRepo.GetAllMessages();
		}
	}
}
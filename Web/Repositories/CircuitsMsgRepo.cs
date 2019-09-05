using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CpcLiveMonitor.Web.Handlers;
using CpcLiveMonitor.Web.Hubs;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Utility.Helpers;
using Microsoft.AspNet.SignalR;

namespace CpcLiveMonitor.Web.Repositories
{
	public class CircuitsMsgRepo
	{
		private static readonly IHubContext _circuitsHub = GlobalHost.ConnectionManager.GetHubContext<CircuitsProxy>();


		#region Add

		public static TArgs AddMessage<TArgs>(TArgs msg)
			where TArgs : IRtcmMsg
		{
			return CircuitsMsgHandler.AddNewMsg(msg);
		}

		public static async Task<TArgs> AddAndBroadcast<TArgs>(TArgs msg)
			where TArgs : IRtcmMsg
		{
			IRtcmMsg addedMsg;

			List<String> domains;
			switch (msg.Header.EventCode)
			{
				case CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART:
					EventCallStartMsg callStartMsg = msg as EventCallStartMsg;
					addedMsg = CircuitsMsgHandler.AddNewMsg(callStartMsg);

					domains = Caching.GetDomains(addedMsg.Header.SiteId);
					await _circuitsHub.Clients.Groups(domains).BroadcastAddCallStartMsg(addedMsg);

					break;
				case CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND:
					EventCallEndMsg callEndMsg = msg as EventCallEndMsg;
					addedMsg = CircuitsMsgHandler.AddNewMsg(callEndMsg);

					domains = Caching.GetDomains(addedMsg.Header.SiteId);
					await _circuitsHub.Clients.Groups(domains).BroadcastAddCallEndMsg(addedMsg);

					break;
				default:
					throw new ArgumentException($"Message type {msg.Header.EventCode} not supported");
			}

			return (TArgs)addedMsg;
		}

		#endregion Add

		#region Remove

		public static void ClearAllMessages()
		{
			CircuitsMsgHandler.ClearMessages();
		}

		#endregion Remove

		#region Get

		public static IRtcmMsg[] GetAllMessages()
		{
			return CircuitsMsgHandler.GetMessages();
		}

		#endregion Get
	}
}
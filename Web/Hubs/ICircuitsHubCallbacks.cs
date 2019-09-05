using System;
using System.Threading.Tasks;
using CpcLiveMonitor.Domain;

namespace CpcLiveMonitor.Web.Hubs
{
	public interface ICircuitsHubCallbacks
	{
		Task BroadcastAddCallStartMsg(EventCallStartMsg msg);
		Task BroadcastAddCallEndMsg(EventCallEndMsg msg);
		Task BroadcastRedirectToLogin();
		Task BroadcastRemoveAllMessages();
		Task BroadcastRemoveRtcmMsg(Int32 id);
	}
}
using System.Collections.Generic;
using CpcLiveMonitor.Domain;

namespace CpcLiveMonitor.Web.Hubs
{
	public interface ICircuitsHubCalls
	{
		IEnumerable<IRtcmMsg> GetRtcmMessages();
	}
}
using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	[Serializable]
	public class EventCallStartMsg : IRtcmMsg
	{
		public RtcmMsgHeader Header { get; set; }
		public EventCallStartData Data { get; set; }
	}
}
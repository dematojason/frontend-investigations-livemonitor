using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	[Serializable]
	public class EventCallEndMsg : IRtcmMsg
	{
		public RtcmMsgHeader Header { get; set; }
		public EventCallEndData Data { get; set; }
	}
}
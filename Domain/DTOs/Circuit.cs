using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class Circuit
	{
		public String Ani { get; set; }
		public String SiteId { get; set; }
		public String ScheduleId { get; set; }
		public String Description { get; set; }
		public String RecordingLevel { get; set; }
		public Call CurrentCall { get; set; }
	}
}
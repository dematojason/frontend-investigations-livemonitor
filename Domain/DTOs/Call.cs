using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class Call
	{
		public Int32 CallId { get; set; }
		public Int32 LineId { get; set; }
		public String Pin { get; set; }
		public String DocId { get; set; }
		public String CalledNumber { get; set; }
		public String TerminateCode { get; set; }
		public String BlockCode { get; set; }
		public Int32 CallTimer { get; set; }
		public String StartDateTime { get; set; }
		public Int32 CurDuration { get; set; }
		public Int32 MaxDuration { get; set; }
		public String Ucid { get; set; }
		public CallStatus CallStatus { get; set; }
	}
}

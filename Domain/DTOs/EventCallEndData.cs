using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class EventCallEndData
	{
		/// <summary>
		/// The two-character code representing the way the call was terminated.
		/// </summary>
		public String TerminateCode { get; set; }

		/// <summary>
		/// The two-character code representing the reason the call was blocked.
		/// Can be "00" indicating the call was not blocked.
		/// </summary>
		public String BlockCode { get; set; }

		/// <summary>
		/// The duration of the call measured in seconds.
		/// </summary>
		public Int32 Duration { get; set; }
	}
}
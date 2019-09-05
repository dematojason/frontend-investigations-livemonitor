using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class EventCallStartData
	{
		/// <summary>
		/// The maximum duration the call could be
		/// </summary>
		public Int32 MaxDuration { get; set; }

		/// <summary>
		/// Whether or not the call will be recorded
		/// </summary>
		public Boolean Recorded { get; set; }
	}
}
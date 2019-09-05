using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class GetInmateArguments
	{
		public String InmateId { get; set; }

		public String SiteId { get; set; }

		public Guid InmateRefId { get; set; }
	}
}
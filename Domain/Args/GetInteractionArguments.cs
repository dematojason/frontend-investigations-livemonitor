using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class GetInteractionArguments
	{
		public String Ani { get; set; }

		public String ExternalIdentifier { get; set; }

		public String InmateId { get; set; }

		public String SiteId { get; set; }
	}
}
using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class PinPhone
	{
		public String Pin { get; set; }

		public String SiteId { get; set; }

		public String PhoneNumber { get; set; }

		public Boolean Active { get; set; }

		public DateTime? ActivationDate { get; set; }

		public Boolean Restricted { get; set; }

		public String TimingClassId { get; set; }

		public Boolean Untimed { get; set; }

		public String AllowedInteractionsPerInterval { get; set; }

		public Decimal? InteractionInterval { get; set; }

		public Decimal? InteractionsThisInterval { get; set; }

		public String RecordingLevel { get; set; }
	}
}
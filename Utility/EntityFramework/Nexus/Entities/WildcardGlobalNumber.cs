using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class WildcardGlobalNumber
	{
		public String Phone { get; set; }

		public String Description { get; set; }

		public DateTime EntryDate { get; set; }

		public Boolean Alert { get; set; }

		public Boolean Restricted { get; set; }

		public Boolean CallsNotTimed { get; set; }

		public Boolean DoNotValidate { get; set; }

		public Boolean Active { get; set; }

		public Boolean Allowed { get; set; }

		public String SpeedDialCode { get; set; }

		public String SiteId { get; set; }

		public String RecordingLevelId { get; set; }
	}
}
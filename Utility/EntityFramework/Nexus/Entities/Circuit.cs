
// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class Circuit
	{
		public string Ani { get; set; }

		public string SiteId { get; set; }

		public string UnitId { get; set; }

		public string ScheduleId { get; set; }

		public string TimingClassId { get; set; }

		public decimal? OutOfService { get; set; }

		public string Description { get; set; }

		public string SGroup { get; set; }

		public string DGroup { get; set; }

		public string RecordingLevel { get; set; }

		public bool? DaylightSavingsTime { get; set; }

		public decimal? TimeZoneOffset { get; set; }

		public bool? SecurePin { get; set; }

		public int PhoneOptions { get; set; }

		public string FreeCallTimingClass { get; set; }

		public string CallTypeId { get; set; }
	}
}
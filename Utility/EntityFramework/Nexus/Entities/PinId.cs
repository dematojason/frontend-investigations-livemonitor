using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class PinId
	{
		public string Pin { get; set; }

		public string Apin { get; set; }

		public string Name { get; set; }

		public DateTime? DateEntered { get; set; }

		public bool? Active { get; set; }

		public DateTime? ActivationDate { get; set; }

		public decimal? Balance { get; set; }

		public decimal? Reserve { get; set; }

		public string SiteId { get; set; }

		public string DocId { get; set; }

		public string Dob { get; set; }

		public string Location { get; set; }

		public DateTime? ReleaseDate { get; set; }

		public DateTime? BookingDate { get; set; }

		public Guid? InmateReferenceId { get; set; }

		public int? CircuitGroupId { get; set; }

		public string AllowedInteractionsPerInterval { get; set; }

		public decimal? InteractionInterval { get; set; }

		public decimal? InteractionsThisInterval { get; set; }

		public decimal? RemainingFreeCallCount { get; set; }

		public string TimingClassId { get; set; }

		public string RecordingLevel { get; set; }

		public decimal? RemainingFreeMinuteCount { get; set; }

		public decimal? RemainingFreeCostAmount { get; set; }

		public string Pin2 { get; set; }

		public string Mailbox { get; set; }
	}
}
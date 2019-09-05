using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	[Serializable]
	public class Inmate
	{
		public Int32 Id { get; set; }

		public String SiteId { get; set; }

		public String PinId { get; set; }

		public String Apin { get; set; }

		public Boolean Active { get; set; }

		public String FirstName { get; set; }

		public String MiddleName { get; set; }

		public String LastName { get; set; }

		public DateTime DateOfBirth { get; set; }

		public String InmateIdentifierAtFacility { get; set; }

		public Decimal PinDebitBalance { get; set; }

		public Decimal PinDebitReserve { get; set; }

		public String Location { get; set; }

		public Int32 CircuitGroupId { get; set; }

		public DateTime ReleaseDate { get; set; }

		public DateTime DateEntered { get; set; }

		public InmateStatus InmateStatus { get; set; }

		public String Pin2 { get; set; }

		public String Mailbox { get; set; }
	}
}

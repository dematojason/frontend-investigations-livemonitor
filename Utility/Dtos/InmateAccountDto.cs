using System;
using CpcLiveMonitor.Utility.Extensions;

namespace CpcLiveMonitor.Utility.Dtos
{
	public class InmateAccountDto
	{
		public String Apin { get; set; }
		public Decimal Balance { get; set; }
		public String Dob { get; set; }
		public String DocId { get; set; }
		public String FacilityName { get; set; }
		public Guid InmateRefId { get; set; }
		public String Name { get; set; }
		public String Pin { get; set; }
		public Boolean PinActive { get; set; }
		public Int32 PinId { get; set; }
		public String SiteId { get; set; }
		public String NameDisplay => this.Name.FormatName();
		public String PinDisplay
		{
			get
			{
				try
				{
					String dobFormatted = $"{this.Dob.Substring(4, 2)}/{this.Dob.Substring(6)}/{this.Dob.Substring(0, 4)}";
					return $"{this.Name} @ {this.FacilityName} (ACCT#: {this.Apin}, DOB: {dobFormatted}, DOCID: {this.DocId})";
				}
				catch
				{
					return $"{this.Name} @ {this.FacilityName} (ACCT#: {this.Apin}, DOB: {this.Dob}, DOCID: {this.DocId})"; ;
				}
			}
		}
	}
}
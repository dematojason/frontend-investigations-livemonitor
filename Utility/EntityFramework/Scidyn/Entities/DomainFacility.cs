using System;
using CpcLiveMonitor.Utility.Dtos;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class DomainFacility
	{
		/// <summary>
		/// Primary Key
		/// </summary>
		public Int32 Id { get; set; }

		/// <summary>
		/// Domain ID that references dbo.tblDomains
		/// </summary>
		public Int32? DomainId { get; set; }

		/// <summary>
		/// Facility ID that references dbo.tblfacilities
		/// </summary>
		public Int32? FacilityId { get; set; }

		/// <summary>
		/// No idea wtf this column is for. Defaults to false though.
		/// </summary>
		public Boolean BaseGroup { get; set; }

		/// <summary>
		/// The facility
		/// </summary>
		public virtual Facility Facility { get; set; }

		/// <summary>
		/// The domain
		/// </summary>
		public virtual Domain Domain { get; set; }


		public DomainFacilityDto ConvertToDto()
		{
			DomainFacilityDto result = new DomainFacilityDto();
			result.Domain = this.Domain.ConvertToDto();
			result.Facility = this.Facility.ConvertToDto();

			return result;
		}
	}
}
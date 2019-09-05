using System;
using System.Collections.Generic;
using CpcLiveMonitor.Utility.Dtos;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class Facility
	{
		/// <summary>
		/// Primary key.
		/// </summary>
		public Int32 Id { get; set; }

		/// <summary>
		/// Name of the facility.
		/// </summary>
		public String Name { get; set; }

		/// <summary>
		/// Site ID.
		/// </summary>
		public String SiteId { get; set; }

		private ICollection<DomainFacility> _domainFacilities;
		public virtual ICollection<DomainFacility> DomainFacilities
		{
			get => _domainFacilities ?? (_domainFacilities = new List<DomainFacility>());
			protected set => _domainFacilities = value;
		}


		public FacilityDto ConvertToDto()
		{
			FacilityDto result = new FacilityDto();
			result.Name = this.Name;
			result.SiteId = this.SiteId;

			return result;
		}
	}
}
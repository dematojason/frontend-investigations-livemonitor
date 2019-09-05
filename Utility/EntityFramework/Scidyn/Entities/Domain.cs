using System;
using System.Collections.Generic;
using CpcLiveMonitor.Utility.Dtos;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class Domain
	{
		/// <summary>
		/// Primary key.
		/// </summary>
		public Int32 Id { get; set; }

		/// <summary>
		/// Name of the domain.
		/// </summary>
		public String Name { get; set; }

		private ICollection<DomainFacility> _domainFacilities;
		public virtual ICollection<DomainFacility> DomainFacilities
		{
			get => _domainFacilities ?? (_domainFacilities = new List<DomainFacility>());
			protected set => _domainFacilities = value;
		}


		public DomainDto ConvertToDto()
		{
			DomainDto result = new DomainDto();
			result.Id = this.Id;
			result.Name = this.Name;

			return result;
		}
	}
}

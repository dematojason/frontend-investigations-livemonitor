using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	internal class DomainFacilityMap : EntityTypeConfiguration<DomainFacility>
	{
		public DomainFacilityMap()
		{
			// Primary Key
			HasKey(t => t.Id);

			// Properties
			Property(t => t.DomainId);

			Property(t => t.FacilityId);

			Property(t => t.BaseGroup)
				.IsRequired();

			// Table & Column Mappings
			ToTable("KC_DomainFacilityXref");
			Property(t => t.Id).HasColumnName("rep_id");
			Property(t => t.DomainId).HasColumnName("domain_id");
			Property(t => t.FacilityId).HasColumnName("facility_id");
			Property(t => t.BaseGroup).HasColumnName("base_group");

			// References
			HasRequired(t => t.Domain)
				.WithMany(t => t.DomainFacilities) // Domain may be owned by many DomainFacility objects
				.HasForeignKey(t => t.DomainId);

			HasRequired(t => t.Facility)
				.WithMany(t => t.DomainFacilities)
				.HasForeignKey(t => t.FacilityId);
		}
	}
}
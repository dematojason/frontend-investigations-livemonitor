using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	internal class FacilityMap : EntityTypeConfiguration<Facility>
	{
		public FacilityMap()
		{
			// Primary Key
			HasKey(t => t.Id);

			// Properties
			Property(t => t.Name)
				.IsRequired()
				.HasMaxLength(100);

			Property(t => t.SiteId)
				.IsRequired()
				.HasMaxLength(10);

			// Table and Column Mappings
			ToTable("vwFacility");
			Property(t => t.Id).HasColumnName("id");
			Property(t => t.Name).HasColumnName("name");
			Property(t => t.SiteId).HasColumnName("site_id");
		}
	}
}
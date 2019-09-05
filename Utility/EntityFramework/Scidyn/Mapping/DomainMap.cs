using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	internal class DomainMap : EntityTypeConfiguration<Domain>
	{
		public DomainMap()
		{
			// Primary Key
			HasKey(t => t.Id);

			// Properties
			Property(t => t.Name)
				.IsRequired()
				.HasMaxLength(64);

			// Table and Column Mappings
			ToTable("KC_Domains");
			Property(t => t.Id).HasColumnName("domain_id");
			Property(t => t.Name).HasColumnName("domain_name");
		}
	}
}
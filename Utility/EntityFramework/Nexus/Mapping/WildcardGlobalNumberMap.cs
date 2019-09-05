using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class WildcardGlobalNumberMap : EntityTypeConfiguration<WildcardGlobalNumber>
	{
		public WildcardGlobalNumberMap()
		{
			// Primary Key
			HasKey(t => t.Phone);

			// Properties
			Property(t => t.Phone)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(16);

			Property(t => t.Description)
				.IsFixedLength()
				.HasMaxLength(20);

			Property(t => t.EntryDate);

			Property(t => t.Active);

			Property(t => t.Allowed);

			Property(t => t.Alert);

			Property(t => t.Restricted);

			Property(t => t.SiteId)
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.CallsNotTimed);

			Property(t => t.DoNotValidate);

			Property(t => t.SpeedDialCode)
				.IsFixedLength()
				.HasMaxLength(2);

			Property(t => t.RecordingLevelId)
				.IsFixedLength()
				.HasMaxLength(1);


			// Table & Column Mappings
			ToTable("WCGLOBAL");
			Property(t => t.Phone).HasColumnName("phone");
			Property(t => t.Description).HasColumnName("id");
			Property(t => t.Active).HasColumnName("active");
			Property(t => t.Alert).HasColumnName("alert");
			Property(t => t.EntryDate).HasColumnName("entdate");
			Property(t => t.Restricted).HasColumnName("rxstrict");
			Property(t => t.SiteId).HasColumnName("site_id");
			Property(t => t.CallsNotTimed).HasColumnName("untimed");
			Property(t => t.DoNotValidate).HasColumnName("novalidate");
			Property(t => t.SpeedDialCode).HasColumnName("speedcode");
			Property(t => t.RecordingLevelId).HasColumnName("reclev");
			Property(t => t.Allowed).HasColumnName("allows");
		}
	}
}
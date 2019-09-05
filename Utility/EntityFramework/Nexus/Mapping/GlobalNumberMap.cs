using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class GlobalNumberMap : EntityTypeConfiguration<GlobalNumber>
	{
		public GlobalNumberMap()
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

			Property(t => t.TimingClassId)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.CallsNotTimed);

			Property(t => t.NoPinRequired);

			Property(t => t.DoNotValidate);

			Property(t => t.SpeedDialCode)
				.IsFixedLength()
				.HasMaxLength(2);

			Property(t => t.RecordingLevelId)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.InteractionInterval);

			Property(t => t.AllowedInteractionsPerInterval)
				.IsFixedLength()
				.HasMaxLength(2);

			Property(t => t.InteractionsThisInterval);


			// Table & Column Mappings
			ToTable("GLOBALS");
			Property(t => t.Phone).HasColumnName("Phone");
			Property(t => t.Description).HasColumnName("Id");
			Property(t => t.Active).HasColumnName("active");
			Property(t => t.Alert).HasColumnName("alert");
			Property(t => t.EntryDate).HasColumnName("entdate");
			Property(t => t.Restricted).HasColumnName("rxstrict");
			Property(t => t.SiteId).HasColumnName("site_id");
			Property(t => t.TimingClassId).HasColumnName("tmclass");
			Property(t => t.CallsNotTimed).HasColumnName("untimed");
			Property(t => t.NoPinRequired).HasColumnName("nopinreq");
			Property(t => t.DoNotValidate).HasColumnName("novalidate");
			Property(t => t.SpeedDialCode).HasColumnName("speedcode");
			Property(t => t.RecordingLevelId).HasColumnName("reclev");
			Property(t => t.Allowed).HasColumnName("allows");
			Property(t => t.AllowedInteractionsPerInterval).HasColumnName("cpi");
			Property(t => t.InteractionsThisInterval).HasColumnName("periodpegs");
			Property(t => t.InteractionInterval).HasColumnName("period");
		}
	}
}

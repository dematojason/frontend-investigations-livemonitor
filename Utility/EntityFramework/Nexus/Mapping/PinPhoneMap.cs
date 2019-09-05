using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class PinPhoneMap : EntityTypeConfiguration<PinPhone>
	{
		public PinPhoneMap()
		{
			// Primary Key
			HasKey(t => new { t.Pin, t.SiteId, t.PhoneNumber });

			// Properties
			Property(t => t.Pin)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.SiteId)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.PhoneNumber)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(15);

			Property(t => t.Active)
				.IsRequired();

			Property(t => t.ActivationDate);

			Property(t => t.Restricted)
				.IsRequired();

			Property(t => t.TimingClassId)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.Untimed)
				.IsRequired();

			Property(t => t.InteractionInterval);

			Property(t => t.AllowedInteractionsPerInterval)
				.IsFixedLength()
				.HasMaxLength(2);

			Property(t => t.InteractionsThisInterval);

			Property(t => t.RecordingLevel)
				.IsFixedLength()
				.HasMaxLength(1);


			// Table & Column Mappings
			ToTable("PINPHONE");
			Property(t => t.Pin).HasColumnName("pin");
			Property(t => t.SiteId).HasColumnName("site_id");
			Property(t => t.PhoneNumber).HasColumnName("Phone");
			Property(t => t.Active).HasColumnName("phactive");
			Property(t => t.ActivationDate).HasColumnName("act_date");
			Property(t => t.Restricted).HasColumnName("rxstrict");
			Property(t => t.TimingClassId).HasColumnName("tmclass");
			Property(t => t.Untimed).HasColumnName("untimed");
			Property(t => t.InteractionInterval).HasColumnName("period");
			Property(t => t.AllowedInteractionsPerInterval).HasColumnName("phonecpi");
			Property(t => t.InteractionsThisInterval).HasColumnName("periodpegs");
			Property(t => t.RecordingLevel).HasColumnName("reclev");
		}
	}
}
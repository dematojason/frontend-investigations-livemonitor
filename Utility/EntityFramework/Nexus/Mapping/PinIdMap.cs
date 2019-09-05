using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
    public class PinIdMap : EntityTypeConfiguration<PinId>
    {
		public PinIdMap()
		{
			// Primary Key
			HasKey(t => new { t.Apin, t.SiteId });

			// Properties
			Property(t => t.Apin)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.SiteId)
				.IsFixedLength()
				.IsRequired()
				.HasMaxLength(10);

			Property(t => t.Pin)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.Name)
				.IsFixedLength()
				.HasMaxLength(40);

			Property(t => t.DocId)
				.IsFixedLength()
				.HasMaxLength(15);

			Property(t => t.Dob)
				.IsFixedLength()
				.HasMaxLength(8);

			Property(t => t.Location)
				.HasMaxLength(50);

			Property(t => t.InteractionInterval);

			Property(t => t.AllowedInteractionsPerInterval)
				.IsFixedLength()
				.HasMaxLength(2);

			Property(t => t.InteractionsThisInterval);

			Property(t => t.TimingClassId)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.RecordingLevel)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.RemainingFreeCallCount);

			Property(t => t.RemainingFreeMinuteCount);

			Property(t => t.RemainingFreeCostAmount);

			Property(t => t.Pin2)
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.Mailbox)
				.IsFixedLength()
				.HasMaxLength(15);

			// Table & Column Mappings
			ToTable("PINID");
			Property(t => t.Apin).HasColumnName("apin");
			Property(t => t.SiteId).HasColumnName("site_id");
			Property(t => t.Pin).HasColumnName("pin");
			Property(t => t.Name).HasColumnName("name");
			Property(t => t.DateEntered).HasColumnName("edate");
			Property(t => t.Active).HasColumnName("pinactive");
			Property(t => t.ActivationDate).HasColumnName("act_date");
			Property(t => t.Balance).HasColumnName("balance");
			Property(t => t.Reserve).HasColumnName("reserve");
			Property(t => t.DocId).HasColumnName("docid");
			Property(t => t.Dob).HasColumnName("dob");
			Property(t => t.Location).HasColumnName("location");
			Property(t => t.ReleaseDate).HasColumnName("release_date");
			Property(t => t.BookingDate).HasColumnName("booking_date");
			Property(t => t.InmateReferenceId).HasColumnName("InmateRefId");
			Property(t => t.CircuitGroupId).HasColumnName("CktGrpId");
			Property(t => t.InteractionInterval).HasColumnName("period");
			Property(t => t.AllowedInteractionsPerInterval).HasColumnName("pincpi");
			Property(t => t.InteractionsThisInterval).HasColumnName("periodpegs");
			Property(t => t.TimingClassId).HasColumnName("tmclass");
			Property(t => t.RecordingLevel).HasColumnName("reclev");
			Property(t => t.RemainingFreeCallCount).HasColumnName("pegct");
			Property(t => t.RemainingFreeMinuteCount).HasColumnName("minutect");
			Property(t => t.RemainingFreeCostAmount).HasColumnName("moneyct");
			Property(t => t.Pin2).HasColumnName("pin2");
			Property(t => t.Mailbox).HasColumnName("mailbox");
		}
	}
}
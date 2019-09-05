using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class CircuitMap : EntityTypeConfiguration<Circuit>
	{
		public CircuitMap()
		{
			// Primary Key
			HasKey(t => t.Ani);

			// Properties
			Property(t => t.Ani)
				.IsRequired()
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.SiteId)
				.IsFixedLength()
				.HasMaxLength(10);

			Property(t => t.UnitId)
				.IsFixedLength()
				.HasMaxLength(6);

			Property(t => t.ScheduleId)
				.IsFixedLength()
				.HasMaxLength(2);

			Property(t => t.TimingClassId)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.OutOfService);

			Property(t => t.Description)
				.IsFixedLength()
				.HasMaxLength(12);

			Property(t => t.SGroup)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.DGroup)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.RecordingLevel)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.DaylightSavingsTime);

			Property(t => t.TimeZoneOffset);

			Property(t => t.SecurePin);

			Property(t => t.PhoneOptions)
				.IsRequired();

			Property(t => t.FreeCallTimingClass)
				.IsFixedLength()
				.HasMaxLength(1);

			Property(t => t.CallTypeId)
				.IsFixedLength()
				.HasMaxLength(2);

			// Table & Column Mappings
			ToTable("CKTPARMS");
			Property(t => t.Ani).HasColumnName("ani");
			Property(t => t.SiteId).HasColumnName("site_id");
			Property(t => t.UnitId).HasColumnName("unitid");
			Property(t => t.ScheduleId).HasColumnName("schedule");
			Property(t => t.TimingClassId).HasColumnName("class");
			Property(t => t.OutOfService).HasColumnName("override");
			Property(t => t.Description).HasColumnName("string");
			Property(t => t.SGroup).HasColumnName("sgrp");
			Property(t => t.DGroup).HasColumnName("dgrp");
			Property(t => t.RecordingLevel).HasColumnName("reclev");
			Property(t => t.DaylightSavingsTime).HasColumnName("dst");
			Property(t => t.TimeZoneOffset).HasColumnName("timezone");
			Property(t => t.SecurePin).HasColumnName("securepin");
			Property(t => t.PhoneOptions).HasColumnName("phoneopts");
			Property(t => t.CallTypeId).HasColumnName("call_type");
			Property(t => t.FreeCallTimingClass).HasColumnName("freecalltimeclass");
		}
	}
}
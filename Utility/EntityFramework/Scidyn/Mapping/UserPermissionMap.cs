using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class UserPermissionMap : EntityTypeConfiguration<UserPermission>
	{
		public UserPermissionMap()
		{
			// Primary Key
			HasKey(t => t.Name);

			// Properties
			Property(t => t.PermissionGroupId)
				.IsRequired();

			Property(t => t.PermissionGroupName)
				.IsRequired()
				.HasMaxLength(50);

			Property(t => t.Name)
				.IsRequired()
				.HasMaxLength(50);

			Property(t => t.UserName)
				.HasMaxLength(50);

			// Table & Column Mappings
			ToTable("vwUserPermissions");
			Property(t => t.PermissionGroupId).HasColumnName("PermissionSetId");
			Property(t => t.PermissionGroupName).HasColumnName("PermissionGroupName");
			Property(t => t.Name).HasColumnName("PermissionName");
			Property(t => t.UserName).HasColumnName("UserName");
		}
	}
}

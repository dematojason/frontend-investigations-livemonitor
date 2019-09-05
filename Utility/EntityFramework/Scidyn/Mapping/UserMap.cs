using System.Data.Entity.ModelConfiguration;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class UserMap : EntityTypeConfiguration<User>
	{
		public UserMap()
		{
			// Primary Key
			HasKey(t => t.Id);

			// Properties
			Property(t => t.UserName)
				.IsRequired()
				.HasMaxLength(50);

			Property(t => t.Password)
				.IsRequired();

			Property(t => t.Email)
				.IsRequired()
				.HasMaxLength(50);

			Property(t => t.FirstName)
				.IsRequired()
				.HasMaxLength(50);

			Property(t => t.LastName)
				.IsRequired()
				.HasMaxLength(50);

			Property(t => t.DomainId);

			// Table & Column Mappings
			ToTable("KC_Users");
			Property(t => t.Id).HasColumnName("id");
			Property(t => t.UserName).HasColumnName("username");
			Property(t => t.Password).HasColumnName("password");
			Property(t => t.Email).HasColumnName("email");
			Property(t => t.FirstName).HasColumnName("firstName");
			Property(t => t.LastName).HasColumnName("lastName");
			Property(t => t.DomainId).HasColumnName("domain_id");
		}
	}
}
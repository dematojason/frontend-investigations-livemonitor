using System.Data.Entity;

namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class ScidynContext : DbContext
	{
		public DbSet<Domain> Domains { get; set; }
		public DbSet<Facility> Facilities { get; set; }
		public DbSet<DomainFacility> DomainFacilities { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<UserPermission> UserPermissions { get; set; }


		static ScidynContext()
		{
			Database.SetInitializer<ScidynContext>(null);
		}

		public ScidynContext()
			: base("Name=ScidynDbConnection")
		{
		}


		protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
			modelBuilder.Configurations.Add(new DomainFacilityMap());
			modelBuilder.Configurations.Add(new DomainMap());
			modelBuilder.Configurations.Add(new FacilityMap());
			modelBuilder.Configurations.Add(new UserMap());
			modelBuilder.Configurations.Add(new UserPermissionMap());
		}
	}
}
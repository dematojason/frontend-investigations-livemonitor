using System.Data.Entity;

namespace CpcLiveMonitor.Utility.EntityFramework.Nexus
{
	public class NexusContext : DbContext
	{
		public DbSet<Circuit> Circuits { get; set; }
		public DbSet<GlobalNumber> GlobalNumbers { get; set; }
		public DbSet<PinId> PinIds { get; set; }
		public DbSet<PinPhone> PinPhones { get; set; }
		public DbSet<WildcardGlobalNumber> WildcardGlobalNumbers { get; set; }


		static NexusContext()
		{
			Database.SetInitializer<NexusContext>(null);
		}

#if LOCALDB
        public NexusContext() : base("Name=NexusDbConnection_Local") { }
#else
		public NexusContext() : base("Name=NexusDbConnection") { }
#endif

		protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
			modelBuilder.Configurations.Add(new CircuitMap());
			modelBuilder.Configurations.Add(new GlobalNumberMap());
			modelBuilder.Configurations.Add(new PinIdMap());
			modelBuilder.Configurations.Add(new PinPhoneMap());
			modelBuilder.Configurations.Add(new WildcardGlobalNumberMap());
		}
	}
}
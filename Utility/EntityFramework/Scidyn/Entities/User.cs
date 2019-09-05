using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class User
	{
		public Int32 Id { get; set; }
		public String UserName { get; set; }
		public String Password { get; set; }
		public String Email { get; set; }
		public String FirstName { get; set; }
		public String LastName { get; set; }
		public Int32 DomainId { get; set; }
	}
}
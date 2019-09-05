using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class LoginResponse
	{
		public String FirstName { get; set; }
		public String LastName { get; set; }
		public String Username { get; set; }
		public String Email { get; set; }
		public Boolean IsMilitaryDisplay { get; set; }
		public String[] Permissions { get; set; } = { };
	}
}
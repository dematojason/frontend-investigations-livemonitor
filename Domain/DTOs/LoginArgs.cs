using System;

namespace CpcLiveMonitor.Domain.DTOs
{
	public class LoginArgs
	{
		public String Username { get;set; }
		public String Password { get; set; }
		public String Token { get; set; }
	}
}
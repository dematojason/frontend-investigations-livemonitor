using System.ComponentModel.DataAnnotations;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class LoginArguments
	{
		[Required]
		public string Username { get; set; }

		[Required]
		public string Password { get; set; }
	}
}
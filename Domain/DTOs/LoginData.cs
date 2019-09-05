
// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class LoginData
	{
		public string UserId { get; set; }

		public string UserDisplayName { get; set; }

		public long ExpirationSeconds { get; set; }
	}
}
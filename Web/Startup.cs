using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Newtonsoft.Json;
using Owin;

[assembly: OwinStartup(typeof(CpcLiveMonitor.Web.Startup))]
namespace CpcLiveMonitor.Web
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			HubConfiguration hubConfig = new HubConfiguration();
			hubConfig.EnableDetailedErrors = true;
			hubConfig.EnableJSONP = true;

			// Tell SignalR to serialize front-end objects' properties as camelCase
			// instead of SignalR's default ProperCase
			JsonSerializerSettings settings = new JsonSerializerSettings();
			settings.ContractResolver = new SignalRContractResolver();
			settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
			JsonSerializer serializer = JsonSerializer.Create(settings);
			GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);

			app.MapSignalR(hubConfig);
		}
	}
}
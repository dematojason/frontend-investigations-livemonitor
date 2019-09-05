using System.Net.Http.Formatting;
using System.Web.Http;
using Newtonsoft.Json.Serialization;

namespace CpcLiveMonitor.Web
{
	public static class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
			config.EnableCors();

			// Web API routes
			config.MapHttpAttributeRoutes();
			config.Formatters.Clear();
			config.Formatters.Add(new JsonMediaTypeFormatter());
			config.Formatters.Add(new BsonMediaTypeFormatter());

			config.Routes.MapHttpRoute(
				name: "DefaultApi",
				routeTemplate: "api/{controller}/{action}/{id}",
				defaults: new { id = RouteParameter.Optional }
			);

			// Tell serializer to serialize objects' properties as camelCase for front-end and ProperCase for back-end.
			JsonMediaTypeFormatter jsonformatter = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
			jsonformatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
		}
	}
}
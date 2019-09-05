using System;
using System.Reflection;
using Microsoft.AspNet.SignalR.Infrastructure;
using Newtonsoft.Json.Serialization;

namespace CpcLiveMonitor.Web
{
	/// <summary>
	/// Contract resolver for handling SignalR's default behavior of ProperCase properties in front-end objects.
	/// </summary>
	public class SignalRContractResolver : IContractResolver
	{
		private readonly Assembly _assembly;
		private readonly IContractResolver _camelCaseContractResolver;
		private readonly IContractResolver _defaultContractSerializer;

		public SignalRContractResolver()
		{
			_assembly = typeof(Connection).Assembly;
			_camelCaseContractResolver = new CamelCasePropertyNamesContractResolver();
			_defaultContractSerializer = new DefaultContractResolver();
		}

		public JsonContract ResolveContract(Type type)
		{
			if (type.Assembly.Equals(_assembly))
				return _defaultContractSerializer.ResolveContract(type);

			return _camelCaseContractResolver.ResolveContract(type);
		}
	}
}
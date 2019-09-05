using System;
using System.Collections.Generic;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class GetCircuitArguments
	{
		public List<String> AniList { get; set; }
		public List<String> SiteList { get; set; }
	}
}
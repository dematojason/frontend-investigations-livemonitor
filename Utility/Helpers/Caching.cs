using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.Caching;
using CpcLiveMonitor.Utility.Dtos;

namespace CpcLiveMonitor.Utility.Helpers
{
	public static class Caching
	{
		private static readonly Int32 _cacheReloadFrequencyMinutes = Int32.Parse(ConfigurationManager.AppSettings["CacheReloadFrequencyMinutes"]);


		public static String GetDomainName(Int32 domainId)
		{
			List<DomainDto> domains = GetDomains();
			foreach (DomainDto domain in domains)
			{
				if (domain.Id == domainId)
				{
					return domain.Name;
				}
			}

			throw new ArgumentException($"No domain with ID {domainId} was found");
		}

		public static List<String> GetDomains(String siteId)
		{
			List<String> domains = new List<String>();

			Dictionary<FacilityDto, List<DomainDto>> facilityDomains = GetFacilityDomains();
			foreach (KeyValuePair<FacilityDto, List<DomainDto>> keyVal in facilityDomains)
			{
				if (keyVal.Key.SiteId == siteId)
				{
					domains = keyVal.Value.Select(d => d.Name).ToList();
					break;
				}
			}

			return domains;
		}

		private static List<DomainDto> GetDomains()
			=> GetObjectFromCache("Domains", _cacheReloadFrequencyMinutes, DbAccessor.LoadAllDomains);

		private static Dictionary<FacilityDto, List<DomainDto>> GetFacilityDomains()
			=> GetObjectFromCache("FacilityDomains", _cacheReloadFrequencyMinutes, DbAccessor.LoadAllFacilityDomains);

		/// <summary>
		/// Gets and sets objects to the memory cache.
		/// </summary>
		/// <typeparam name="TResult">The type of the object to be returned.</typeparam>
		/// <param name="itemName">The name to be used when storing the object in the cache.</param>
		/// <param name="cacheTimeMinutes">How long to cache this object for before it should be refreshed.</param>
		/// <param name="getItemFunc">A parameterless function to call if the object isn't in the cache or needs to be refreshed.</param>
		/// <returns>An object of the type <see cref="TResult"/>.</returns>
		public static TResult GetObjectFromCache<TResult>(String itemName, Int32 cacheTimeMinutes, Func<TResult> getItemFunc)
		{
			ObjectCache cache = MemoryCache.Default;

			TResult cachedObj = (TResult)cache[itemName];
			if (cachedObj == null)
			{
				CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
				cacheItemPolicy.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheTimeMinutes);
				cachedObj = getItemFunc();
				cache.Set(itemName, cachedObj, cacheItemPolicy);
			}

			return cachedObj;
		}
	}
}
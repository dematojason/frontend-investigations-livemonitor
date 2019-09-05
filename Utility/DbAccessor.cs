
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using CpcLiveMonitor.Utility.Dtos;
using CpcLiveMonitor.Utility.EntityFramework.Scidyn;
using CpcLiveMonitor.Utility.Helpers;

namespace CpcLiveMonitor.Utility
{
	public static class DbAccessor
	{
		public static List<DomainDto> LoadAllDomains()
		{
			List<DomainDto> result = new List<DomainDto>();

			using (ScidynContext ctx = new ScidynContext())
			{
				List<Domain> domains = ctx.Domains.ToList();
				foreach (Domain domain in domains)
				{
					result.Add(domain.ConvertToDto());
				}
			}

			return result;
		}

		public static List<FacilityDto> LoadAllFacilities()
		{
			List<FacilityDto> result = new List<FacilityDto>();

			using (ScidynContext ctx = new ScidynContext())
			{
				List<Facility> facilities = ctx.Facilities.ToList();
				foreach (Facility facility in facilities)
				{
					result.Add(facility.ConvertToDto());
				}
			}

			return result;
		}

		public static Dictionary<FacilityDto, List<DomainDto>> LoadAllFacilityDomains()
		{
			Dictionary<FacilityDto, List<DomainDto>> facilityDomains = new Dictionary<FacilityDto, List<DomainDto>>();

			using (ScidynContext ctx = new ScidynContext())
			{
				List<DomainFacility> domainFacilities = ctx.DomainFacilities.Include("Domain").Include("Facility").ToList();

				// Convert list of domains and the facilities they belong to into
				// a list of facilities and what domains contain them.
				foreach (DomainFacility domainFacility in domainFacilities)
				{
					DomainDto domainDto = domainFacility.Domain.ConvertToDto();

					FacilityDto key = facilityDomains.Keys.FirstOrDefault(k => k.SiteId == domainFacility.Facility.SiteId);

					if (key == null)
					{
						facilityDomains.Add(domainFacility.Facility.ConvertToDto(), new List<DomainDto> { domainDto });
					}
					else
					{
						facilityDomains[key].Add(domainDto);
					}
				}
			}

			return facilityDomains;
		}

		public static List<DomainFacilityDto> LoadAllDomainFacilities()
		{
			List<DomainFacilityDto> domainFacilities = new List<DomainFacilityDto>();

			using (ScidynContext ctx = new ScidynContext())
			{
				foreach (DomainFacility domainFacility in ctx.DomainFacilities.ToList())
				{
					domainFacilities.Add(domainFacility.ConvertToDto());
				}
			}

			return domainFacilities;
		}

		public static async Task<List<InmateAccountDto>> LoadInmateAccounts(GetInmateArgs args)
		{
			List<SqlParameter> parameters = new List<SqlParameter>();
			parameters.AddSqlParam("@Search", args.Search);
			parameters.AddSqlParam("@FacilityFilters", args.SiteIds);

			return (await SqlHelper.InvokeStoredProcAsync<InmateAccountDto>(ConfigurationManager.ConnectionStrings["ScidynDbConnection"].ToString(), 
				"uspSearchInmateForTypeahead",
				parameters)).ToList();
		}
	}
}
using System;
using System.Collections.Generic;
using System.Linq;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Utility.EntityFramework.Scidyn;

namespace CpcLiveMonitor.Web.Repositories
{
	public class DomainFacilityRepo
	{
		public static Dictionary<String, Object> GetDomainFacilities(DomainFacilityArguments args)
		{
			Dictionary<String, Object> result = new Dictionary<String, Object>();

			List<Facility> facilities = GetFacilities(args.UserId, args.DomainId);
			foreach (Facility facility in facilities)
			{
				result.Add(facility.SiteId, facility.Name);
			}

			return result;
		}

		private static List<Facility> GetFacilities(String userId = "", Int32 domainId = 0)
		{
			using (ScidynContext ctx = new ScidynContext())
			{
				if (domainId == 0 && !string.IsNullOrEmpty(userId))
				{
					User kineticConsoleUser = ctx.Users.FirstOrDefault(x => x.UserName == userId);
					if (kineticConsoleUser != null)
					{
						domainId = kineticConsoleUser.DomainId;
					}
				}

				List<Facility> facilities = (domainId == 0 ? ctx.Facilities.ToList() : ctx.DomainFacilities.Where(x => x.DomainId == domainId).Select(y => y.Facility).ToList());

				return facilities;
			}
		}
	}
}
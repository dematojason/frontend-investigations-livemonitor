using System;
using System.Linq;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Utility.EntityFramework.Nexus;
using CpcLiveMonitor.Utility.Helpers;

namespace CpcLiveMonitor.Web.Repositories
{
	public class InmateRepo
	{
		public static Inmate GetInmate(GetInmateArguments args)
		{
			String strPinId = args.InmateId;

			if (!String.IsNullOrWhiteSpace(strPinId))
				strPinId = StringHelper.ApinToPinId(strPinId);

			if (String.IsNullOrWhiteSpace(strPinId) || String.IsNullOrWhiteSpace(args.SiteId))
				throw new ArgumentException("Invalid inmate ID or site ID");

			using (NexusContext ctx = new NexusContext())
			{
				PinId currentInmate = ctx.PinIds.FirstOrDefault(x => x.SiteId == args.SiteId && x.Pin == strPinId);

				if (currentInmate == null)
				{
					throw new ArgumentException("Invalid inmate Id");
				}

				Inmate wsInmate = new Inmate
				{
					PinId = currentInmate.Pin,
					InmateIdentifierAtFacility = currentInmate.InmateReferenceId.GetValueOrDefault().ToString(),
					Apin = currentInmate.Apin,
					SiteId = currentInmate.SiteId,
					DateOfBirth = StringHelper.DobToDateTime(currentInmate.Dob).GetValueOrDefault(),
					ReleaseDate = (currentInmate.ReleaseDate ?? DateTime.Parse("1/1/1900")),
					DateEntered = (currentInmate.DateEntered ?? DateTime.Parse("1/1/1900")),
					Pin2 = currentInmate.Pin2,
					Location = currentInmate.Location,
					Mailbox = currentInmate.Mailbox,
					FirstName = currentInmate.Name,
					MiddleName = "",
					LastName = ""

				};

				//  split single name field in pin table to first, middle last
				String[] str = StringHelper.NameParts(currentInmate.Name);
				wsInmate.FirstName = str[0];
				wsInmate.MiddleName = str[1];
				wsInmate.LastName = str[2];

				if (currentInmate.Active.HasValue && currentInmate.Active.Value)
				{
					wsInmate.InmateStatus = InmateStatus.Active;
				}
				else
				{
					if (wsInmate.ReleaseDate > DateTime.Parse("1/1/1900"))
					{
						wsInmate.InmateStatus = InmateStatus.Released;
					}
					else
					{
						wsInmate.InmateStatus = InmateStatus.Inactive;
					}
				}

				return wsInmate;
			}
		}
	}
}
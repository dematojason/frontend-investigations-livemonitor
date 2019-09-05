using System;
using System.Collections.Generic;
using System.Linq;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Utility.EntityFramework.Nexus;
using CpcLiveMonitor.Utility.Helpers;
using Circuit = CpcLiveMonitor.Utility.EntityFramework.Nexus.Circuit;

namespace CpcLiveMonitor.Web.Repositories
{
	public class CircuitRepo
	{
		public static List<Domain.Circuit> GetCircuits(Domain.GetCircuitArguments args)
		{
			List<Domain.Circuit> result = new List<Domain.Circuit>();
			List<Circuit> circuits;

			if (args == null)
				throw new ArgumentException("Invalid arguments");

			using (NexusContext ctx = new NexusContext())
			{
				if (args.SiteList?.Count > 0)
				{
					circuits = ctx.Circuits.Where(c => args.SiteList.Contains(c.SiteId)).ToList();
				}
				else if (args.AniList?.Count > 0)
				{
					circuits = ctx.Circuits.Where(c => args.AniList.Contains(c.Ani)).ToList();
				}
				else
				{
					throw new ArgumentException("Either a site ID or ANI is required");
				}
			}

			if (circuits.Count > 0)
			{
				foreach (Circuit circuit in circuits.OrderBy(c => c.SiteId).ThenBy(c => c.Ani))
				{
					Domain.Circuit resultCircuit = new Domain.Circuit
					{
						Ani = circuit.Ani,
						Description = circuit.Description,
						ScheduleId = circuit.ScheduleId,
						RecordingLevel = circuit.RecordingLevel,
						SiteId = circuit.SiteId
					};
					result.Add(resultCircuit);
				}
			}

			return result;
		}

		public static RecordingLevel GetRecordingLevel(GetInteractionArguments args)
		{
			using (NexusContext ctx = new NexusContext())
			{
				Circuit circuit = ctx.Circuits.FirstOrDefault(c => c.Ani == args.Ani && c.SiteId == args.SiteId);
				if (circuit == null)
					throw new ArgumentException("Invalid ANI or Site ID");

				return GetRecordingLevel(args.Ani, args.SiteId, args.InmateId, args.ExternalIdentifier, circuit.RecordingLevel);
			}
		}

		private static RecordingLevel GetRecordingLevel(String ani, String siteId, String inmateId, String calledNumber, String initialRecordingLevel)
		{
			Int32 combinedRecordingLevel = 0;
			String strPinId = inmateId;
			if (!String.IsNullOrEmpty(strPinId))
			{
				strPinId = StringHelper.ApinToPinId(strPinId);
			}

			GlobalNumber global = GetGlobalNumbers(siteId).FirstOrDefault(x => x.Phone == calledNumber);

			using (NexusContext nexusContext = new NexusContext())
			{
				PinId pin = nexusContext.PinIds.FirstOrDefault(x => x.Pin == strPinId && x.SiteId == siteId);
				PinPhone pinPhone = nexusContext.PinPhones.FirstOrDefault(x => x.PhoneNumber == calledNumber && x.Pin == strPinId && x.SiteId == siteId);

				if (String.IsNullOrEmpty(initialRecordingLevel) && !String.IsNullOrEmpty((ani)))
				{
					Circuit circuit = nexusContext.Circuits.FirstOrDefault(x => x.Ani == ani);
					if (circuit != null)
					{
						initialRecordingLevel = circuit.RecordingLevel;
					}
				}

				if (!String.IsNullOrEmpty(initialRecordingLevel))
				{
					Int32.TryParse(initialRecordingLevel, out Int32 circuitRecordingLevel);
					combinedRecordingLevel = circuitRecordingLevel;
				}

				if (pin != null && !String.IsNullOrEmpty(pin.RecordingLevel))
				{
					Int32.TryParse(pin.RecordingLevel, out Int32 pinRecordingLevel);
					combinedRecordingLevel |= pinRecordingLevel;
				}

				if (pinPhone != null && !String.IsNullOrEmpty(pinPhone.RecordingLevel))
				{
					Int32.TryParse(pinPhone.RecordingLevel, out Int32 pinPhoneRecordingLevel);
					combinedRecordingLevel |= pinPhoneRecordingLevel;
				}
				else if (global != null && global.Allowed)
				{
					Int32.TryParse(global.RecordingLevelId, out Int32 globalRecordingLevel);
					combinedRecordingLevel |= globalRecordingLevel;
				}

				if (combinedRecordingLevel == (Int32)RecordingLevel.Record)
				{
					return RecordingLevel.Record;
				}

				if ((combinedRecordingLevel & (Int32)RecordingLevel.DoNotRecord) > 0)
				{
					return RecordingLevel.DoNotRecord;
				}

				return RecordingLevel.Impartial;
			}
		}

		private static List<GlobalNumber> GetGlobalNumbers(String siteId, Boolean restrictedOnly = false)
		{
			NexusContext nexusContext = new NexusContext();
			List<GlobalNumber> globals = nexusContext.GlobalNumbers.Where(x => (x.SiteId == null || x.SiteId.ToUpper() == "GLOBAL" || x.SiteId == siteId) && x.Active && (!restrictedOnly || x.Restricted)).ToList();
			IQueryable<WildcardGlobalNumber> wildcards = nexusContext.WildcardGlobalNumbers.Where(x => (x.SiteId == null || x.SiteId.ToUpper() == "GLOBAL" || x.SiteId == siteId) && x.Active && (!restrictedOnly || x.Restricted));

			foreach (WildcardGlobalNumber wildcardGlobalNumber in wildcards)
			{
				Char[] wildcardArray = wildcardGlobalNumber.Phone.ToCharArray();
				Char[] newPhone = wildcardGlobalNumber.Phone.ToCharArray();

				for (Int32 i = 0; i < wildcardArray.Length; i++)
				{
					if (wildcardArray[i] == '*')
					{
						for (Char j = '0'; j <= '9'; j++)
						{
							newPhone[i] = j;
							String resultString = new String(newPhone);
							if (resultString.Contains('*'))
							{
								break;
							}
							else
							{
								GlobalNumber wildcardResult = new GlobalNumber
								{
									Active = wildcardGlobalNumber.Active,
									Alert = wildcardGlobalNumber.Alert,
									CallsNotTimed = wildcardGlobalNumber.CallsNotTimed,
									Description = wildcardGlobalNumber.Description,
									DoNotValidate = wildcardGlobalNumber.DoNotValidate,
									EntryDate = wildcardGlobalNumber.EntryDate,
									NoPinRequired = false,
									Phone = resultString,
									RecordingLevelId = wildcardGlobalNumber.RecordingLevelId,
									Restricted = wildcardGlobalNumber.Restricted,
									SiteId = wildcardGlobalNumber.SiteId,
									SpeedDialCode = wildcardGlobalNumber.SpeedDialCode,
									TimingClassId = String.Empty
								};
								globals.Add(wildcardResult);
							}
						}
					}
				}
			}

			return globals;
		}
	}
}

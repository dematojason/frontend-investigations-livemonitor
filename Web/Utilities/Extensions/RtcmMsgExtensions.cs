using System;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Web.Repositories;

namespace CpcLiveMonitor.Web.Utilities.Extensions
{
	public static class RtcmMsgExtensions
	{
		public static void PopulateInmateNames(this IRtcmMsg msg)
		{
			if (!msg.IsDataValid())
			{
				return;
			}

			GetInmateArguments args = new GetInmateArguments();
			args.InmateId = msg.Header.Pin;
			args.SiteId = msg.Header.SiteId;

			Inmate inmate = InmateRepo.GetInmate(args);
			if (inmate != null)
			{
				msg.Header.InmateFirstName = inmate.FirstName;
				msg.Header.InmateMiddleName = inmate.MiddleName;
				msg.Header.InmateLastName = inmate.LastName;
			}
		}

		public static void SetIsRecorded(this EventCallStartMsg msg)
		{
			if (!msg.IsDataValid() || String.IsNullOrWhiteSpace(msg.Header?.CalledNumber))
			{
				return;
			}

			GetInteractionArguments args = new GetInteractionArguments();
			args.Ani = msg.Header.Ani;
			args.InmateId = msg.Header.Pin;
			args.ExternalIdentifier = msg.Header.CalledNumber;
			args.SiteId = msg.Header.SiteId;

			RecordingLevel recordingLevel = CircuitRepo.GetRecordingLevel(args);

			msg.Data.Recorded = recordingLevel != RecordingLevel.DoNotRecord;
		}

		private static Boolean IsDataValid(this IRtcmMsg msg)
		{
			return !(String.IsNullOrWhiteSpace(msg?.Header?.Pin) || String.IsNullOrWhiteSpace(msg.Header?.SiteId));
		}
	}
}
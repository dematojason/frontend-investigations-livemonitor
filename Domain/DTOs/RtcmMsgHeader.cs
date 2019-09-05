using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class RtcmMsgHeader
	{
		/// <summary>
		/// Signifies the type of RTCM message
		/// </summary>
		public CtrlMsgType EventCode { get; set; }

		/// <summary>
		/// The identifier of the phone call
		/// </summary>
		public Int32 CallId { get; set; }

		/// <summary>
		/// The ANI of the circuit the RTCM message is regarding
		/// </summary>
		public String Ani { get; set; }

		/// <summary>
		/// The PIN/Account # of the inmate that made/is making a call.
		/// </summary>
		public String Pin { get; set; }

		/// <summary>
		/// The site ID of the facility where the ANI's circuit is located
		/// </summary>
		public String SiteId { get; set; }

		/// <summary>
		/// The identifier of the specific line between the circuit and switch handling the call
		/// </summary>
		public Int32 LineId { get; set; }

		/// <summary>
		/// The identifier of the switch handling the call.
		/// </summary>
		public Int32 UnitId { get; set; }

		/// <summary>
		/// The called phone number.
		/// </summary>
		public String CalledNumber { get; set; }

		/// <summary>
		/// The start date time of the phone call (yyyyMMddHHmmss).
		/// </summary>
		public String StartDateTime { get; set; }

		/// <summary>
		/// Given name of the inmate making the call.
		/// This value is currently (2019-04-15) generated within Live Monitor
		/// after receiving the inmate's PIN from RTCM.
		/// </summary>
		public String InmateFirstName { get; set; } = null;

		/// <summary>
		/// Middle name of the inmate making the call.
		/// This value is currently (2019-04-15) generated within Live Monitor
		/// after receiving the inmate's PIN from RTCM.
		/// </summary>
		public String InmateMiddleName { get; set; } = null;

		/// <summary>
		/// Surname of the inmate making the call.
		/// This value is currently (2019-04-15) generated within Live Monitor
		/// after receiving the inmate's PIN from RTCM.
		/// </summary>
		public String InmateLastName { get; set; } = null;
	}
}
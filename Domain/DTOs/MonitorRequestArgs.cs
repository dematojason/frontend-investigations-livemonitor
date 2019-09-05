using System;
using System.ComponentModel.DataAnnotations;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Domain
{
	public class MonitorRequestArgs
	{
		[Required]
		public Int32 CallId { get; set; }

		[Required]
		public Int32 LineId { get; set; }

		[Required]
		public Int32 UnitId { get; set; }

		[Required, MinLength(10), MaxLength(10)]
		public String Ani { get; set; }
	}
}
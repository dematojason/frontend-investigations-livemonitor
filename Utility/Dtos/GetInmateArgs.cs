using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CpcLiveMonitor.Utility.Dtos
{
	public class GetInmateArgs
	{
		public List<String> SiteIds { get; set; } = new List<String>();

		[Required]
		public String Search { get; set; }
	}
}
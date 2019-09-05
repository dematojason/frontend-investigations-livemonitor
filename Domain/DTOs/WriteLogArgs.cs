using System;
using Newtonsoft.Json;

namespace CpcLiveMonitor.Domain.DTOs
{
	public class WriteLogArgs
	{
		public String ApplicationName => "Live Monitor";
		public String Url { get; set; }
		public String UserAgent { get; set; }
		public String LogLevel { get; set; }
		public String ShortDescription { get; set; }
		public Object Data { get; set; }
		public String ErrorAsJson => this.Data == null ? String.Empty : JsonConvert.SerializeObject(this.Data);
	}
}
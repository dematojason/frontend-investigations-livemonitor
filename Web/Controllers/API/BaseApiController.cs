using ProdigyFlatFileLogger;
using System.Web.Http;

namespace CpcLiveMonitor.Web.Controllers.API
{
	public class BaseApiController : ApiController
	{
		// ReSharper disable once InconsistentNaming
		protected static readonly ILogger _logger = new Logger();
	}
}
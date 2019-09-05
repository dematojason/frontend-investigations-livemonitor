using System.Web.Mvc;
using CpcLiveMonitor.Web.Authentication;

namespace CpcLiveMonitor.Web.Controllers
{
	public class HomeController : Controller
	{
		[LMAuthorizeMVC]
		public ActionResult Index()
		{
			return this.View();
		}
	}
}
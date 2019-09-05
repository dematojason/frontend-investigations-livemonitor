using System;

namespace CpcLiveMonitor.Web.Utilities.Helpers
{
	public static class UrlHelper
	{
		public static String GetLoginRedirectUrl()
		{
			String result;

			if (ConfigBuildHelper.RunningAsRelease())
				result = "https://psi.live/account/login#!/";
			else if (ConfigBuildHelper.RunningAsDev())
				result = "https://192.168.1.40:6998/account/login#!/";
			else if (ConfigBuildHelper.RunningAsLocal())
				result = "http://localhost:59445/account/login#!/";
			else
				throw new ArgumentException("Invalid configuration build");

			return result;
		}
	}
}
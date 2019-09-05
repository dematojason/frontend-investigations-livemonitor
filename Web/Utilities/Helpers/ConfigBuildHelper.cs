using System;
using System.Diagnostics;
// ReSharper disable InvocationIsSkipped

namespace CpcLiveMonitor.Web.Utilities.Helpers
{
	public static class ConfigBuildHelper
	{
		private static Boolean _local;
		private static Boolean _dev;
		private static Boolean _release;

		public static Boolean RunningAsLocal()
		{
			CheckLocal();
			return _local;
		}

		public static Boolean RunningAsDev()
		{
			CheckDev();
			return _dev;
		}

		public static Boolean RunningAsRelease()
		{
			CheckRelease();
			return _release;
		}

		[Conditional("LOCAL")]
		private static void CheckLocal()
		{
			_local = true;
		}

		[Conditional("RELEASE")]
		private static void CheckDev()
		{
			_dev = true;
		}

		[Conditional("RELEASE")]
		private static void CheckRelease()
		{
			_release = true;
		}
	}
}
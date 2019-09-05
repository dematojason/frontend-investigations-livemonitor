using System;
using System.Diagnostics;
using System.IO;
using System.Web;
using System.Web.Hosting;
using System.Web.Optimization;
using CpcLiveMonitor.Web.Utilities.Helpers;

namespace CpcLiveMonitor.Web
{
	public class BundleConfig
	{
		private static readonly String _libScriptsPath = "~/Scripts/lib";
		private static readonly String _libStylesPath = "~/Content";
		private static readonly String _appScriptsPath = "~/Scripts/app";
		private static readonly String _appStylesPath = "~/Styles";

		public static void RegisterBundles(BundleCollection bundles)
		{
			// Enable bundling and minification unless running locally.
			BundleTable.EnableOptimizations = !ConfigBuildHelper.RunningAsLocal() && !ConfigBuildHelper.RunningAsDev();

			//CleanupUnusedFiles();
			BundleTable.VirtualPathProvider = new ScriptBundlePathProvider(HostingEnvironment.VirtualPathProvider);
			AddLibBundles(bundles);
			AddAppBundles(bundles);
			bundles.IgnoreList.Ignore("*Spec.js");
		}

		private static void AddLibBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
				$"{_libScriptsPath}/jquery-{{version}}.js"));

			bundles.Add(new ScriptBundle("~/bundles/signalr").Include(
				$"{_libScriptsPath}/jquery.signalR-{{version}}.js"));

			bundles.Add(new ScriptBundle("~/bundles/angular").Include(
				$"{_libScriptsPath}/angular.js",
				$"{_libScriptsPath}/angular-cookies.js",
				$"{_libScriptsPath}/angular-animate.js",
				$"{_libScriptsPath}/angular-loader.js",
				$"{_libScriptsPath}/angular-route.js",
				$"{_libScriptsPath}/angular-sanitize.js",
				$"{_libScriptsPath}/angular-touch.js",
				$"{_libScriptsPath}/angular-aria.js",
				$"{_libScriptsPath}/angular-messages.js",
				$"{_libScriptsPath}/angular-material.js",
				$"{_libScriptsPath}/angular-toastr.js",
				$"{_appScriptsPath}/widgets/lib/angularjs-dropdown-multiselect.js"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
				$"{_libScriptsPath}/bootstrap.js",
				$"{_libScriptsPath}/ui-bootstrap-tpls.js"));

			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
				$"{_libScriptsPath}/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/other").Include(
				$"{_libScriptsPath}/underscore.js"));

			bundles.Add(new StyleBundle("~/Content/css")
				.Include(
					$"{_libStylesPath}/bootstrap.css", 
					$"{_libStylesPath}/bootstrap-theme.css")
				.Include($"{_libStylesPath}/angular-toastr.css")
				.Include($"{_libStylesPath}/fontawesome-all.css", new CssRewriteUrlTransform())
				.Include($"{_appStylesPath}/normalize.css")
				.Include($"{_appStylesPath}/tables.css")
				.Include($"{_appStylesPath}/site.css"));
		}

		private static void AddAppBundles(BundleCollection bundles)
		{
			ScriptBundle scriptBundle = new ScriptBundle("~/bundles/app");

			scriptBundle.Include(
				// Order matters, so setup core app first
				$"{_appScriptsPath}/app.module.js",
				$"{_appScriptsPath}/app.core.module.js")
				// then get any other top level js files
				.IncludeDirectory($"{_appScriptsPath}", "*.js", false)
				// then get all nested module js files
				.IncludeDirectory($"{_appScriptsPath}", "*.module.js", true)
				// finally, get all the other js files
				.IncludeDirectory($"{_appScriptsPath}", "*.js", true);

			bundles.Add(scriptBundle);
		}

		[Conditional("DEBUG")]
		private static void CleanupUnusedFiles()
		{
			String appDirFullPath = HttpContext.Current.Server.MapPath($"~/{_appScriptsPath}");
			if (Directory.Exists(appDirFullPath))
			{
				String[] jsFiles = Directory.GetFiles(appDirFullPath, "*.js", SearchOption.AllDirectories);
				foreach (String jsFile in jsFiles)
				{
					String tsFile = jsFile.Remove(jsFile.Length - 3, 3) + ".ts";
					if (!File.Exists(tsFile) && !jsFile.EndsWith("spec.js"))
					{
						File.Delete(jsFile);
						String map = jsFile + ".map";
						if (File.Exists(map)) File.Delete(map);
					}
				}
			}
		}
	}

	internal class ScriptBundlePathProvider : VirtualPathProvider
	{
		private readonly VirtualPathProvider _virtualPathProvider;

		public ScriptBundlePathProvider(VirtualPathProvider virtualPathProvider)
		{
			_virtualPathProvider = virtualPathProvider;
		}

		public override bool FileExists(string virtualPath)
		{
			return _virtualPathProvider.FileExists(virtualPath);
		}

		public override VirtualFile GetFile(string virtualPath)
		{
			return _virtualPathProvider.GetFile(virtualPath);
		}

		public override VirtualDirectory GetDirectory(string virtualDir)
		{
			return _virtualPathProvider.GetDirectory(virtualDir);
		}

		public override bool DirectoryExists(string virtualDir)
		{
			return _virtualPathProvider.DirectoryExists(virtualDir);
		}
	}
}
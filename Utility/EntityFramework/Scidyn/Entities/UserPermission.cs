using System;

// ReSharper disable once CheckNamespace
namespace CpcLiveMonitor.Utility.EntityFramework.Scidyn
{
	public class UserPermission
	{
		public Int32 PermissionGroupId { get; set; }
		public String PermissionGroupName { get; set; }
		public String Name { get; set; }
		public String UserName { get; set; }
	}
}
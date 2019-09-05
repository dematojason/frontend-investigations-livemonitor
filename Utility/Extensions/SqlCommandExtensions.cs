using System.Collections.Generic;
using System.Data.SqlClient;

namespace CpcLiveMonitor.Utility.Extensions
{
	public static class SqlCommandExtensions
	{
		public static void AddParameters(this SqlCommand cmd, List<SqlParameter> parameters)
		{
			if (parameters?.Count > 0)
			{
				foreach (SqlParameter param in parameters)
				{
					cmd.Parameters.Add(param);
				}
			}
		}
	}
}
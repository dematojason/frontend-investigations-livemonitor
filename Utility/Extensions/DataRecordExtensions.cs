using System;
using System.Collections.Generic;
using System.Data;

namespace CpcLiveMonitor.Utility.Extensions
{
	public static class DataRecordExtensions
	{
		/// <summary>
		/// Checks the <see cref="IDataRecord"/> to see if there is a field with a name matching that of <paramref name="colName"/>.
		/// This comparison is NOT case sensitive.
		/// </summary>
		/// <param name="dr"></param>
		/// <param name="colName">The column name.</param>
		/// <returns>Returns <c>true</c> if the column exists; otherwise <c>false</c>.</returns>
		/// <example>
		/// <code>
		///		using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
		///		{
		///			PropertyInfo[] properties = typeof(MyCustomClass).GetProperties();
		///			List&lt;PropertyInfo&gt; existingProperties = new List&lt;PropertyInfo&gt;();
		///
		///			foreach (PropertyInfo prop in properties)
		///			{
		///				if (reader.HasColumn(prop.Name))
		///				{
		///					existingProperties.Add(prop);
		///				}
		///			}
		///		}
		/// </code>
		/// </example>
		public static Boolean HasColumn(this IDataRecord dr, String colName)
		{
			for (Int32 i = 0; i < dr.FieldCount; i++)
			{
				if (dr.GetName(i).Equals(colName, StringComparison.CurrentCultureIgnoreCase))
				{
					return true;
				}
			}

			return false;
		}

		/// <summary>
		/// Enumerates the <see cref="IDataReader"/> instance.
		/// </summary>
		/// <param name="reader"></param>
		/// <example>
		/// <code>
		///		using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
		///		{
		///			foreach (IDataRecord record in reader.Enumerate())
		///			{
		///				// Do Stuff
		///			}
		///		}
		/// </code>
		/// </example>
		public static IEnumerable<IDataRecord> Enumerate(this IDataReader reader)
		{
			while (reader.Read())
			{
				yield return reader;
			}
		}
	}
}
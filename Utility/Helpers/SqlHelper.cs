using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using CpcLiveMonitor.Utility.Extensions;

namespace CpcLiveMonitor.Utility.Helpers
{
	public static class SqlHelper
	{
		/// <summary>
		/// Executes the stored procedure <paramref name="procName"/> and parses the return data into an <see cref="IEnumerable{TResult}"/>.
		/// </summary>
		/// <typeparam name="TResult">The type of the elements in the returned IEnumerable.</typeparam>
		/// <param name="connectionString">The connection string.</param>
		/// <param name="procName">The name of the stored procedure to execute.</param>
		/// <param name="parameters">The SQL parameters for the stored procedure.</param>
		/// <returns>
		/// An <see cref="IEnumerable{TResult}"/> parsed from the stored procedure results.
		/// Null value is returned if no results were found.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// <paramref name="connectionString"/> is null or whitespace
		/// -or- <paramref name="procName"/> is null or whitespace.
		/// </exception>
		/// <exception cref="InvalidCastException">
		/// Unable to cast <see cref="Object"/> returned from the stored procedure to type <typeparamref name="TResult"/>.
		/// </exception>
		/// <exception cref="DbException">
		/// An error occurred while executing the command text.
		/// </exception>
		/// <exception cref="SqlException">
		/// Multiple possible causes. See the SqlException.Number property for more information.
		/// </exception>
		public static async Task<IEnumerable<TResult>> InvokeStoredProcAsync<TResult>(String connectionString, String procName, List<SqlParameter> parameters)
			where TResult : new()
		{
			return await InvokeSqlAsync<TResult>(connectionString, procName, true, parameters);
		}

		/// <summary>
		/// Executes the SQL query or stored procedure <paramref name="queryOrProc"/> and parses the first entry
		/// of the return data into an instance of <see cref="TResult"/>.
		/// </summary>
		/// <typeparam name="TResult">Type of returned object.</typeparam>
		/// <param name="connectionString">The connection string.</param>
		/// <param name="queryOrProc">The SQL query or stored procedure name to execute.</param>
		/// <param name="isProc">
		/// If <c>true</c>, the value of <paramref name="queryOrProc"/> is a stored procedure name;
		/// otherwise the value of <paramref name="queryOrProc"/> is a SQL query.
		/// </param>
		/// <param name="parameters">The SQL parameters for the SQL query/stored procedure.</param>
		/// <returns>
		/// An <see cref="IEnumerable{TResult}"/> parsed from the SQL query or stored procedure results.
		/// Null value is returned if no results were found.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// <paramref name="connectionString"/> is null or whitespace
		/// -or- <paramref name="queryOrProc"/> is null or whitespace.
		/// </exception>
		/// <exception cref="InvalidCastException">
		/// Unable to cast <see cref="Object"/> returned from the SQL query/stored procedure to type <typeparamref name="TResult"/>.
		/// </exception>
		/// <exception cref="DbException">
		/// An error occurred while executing the command text.
		/// </exception>
		/// <exception cref="SqlException">
		/// Multiple possible causes. See the SqlException.Number property for more information.
		/// </exception>
		public static async Task<IEnumerable<TResult>> InvokeSqlAsync<TResult>(String connectionString, String queryOrProc, Boolean isProc, List<SqlParameter> parameters)
			where TResult : new()
		{
			return await InvokeSqlAsync(GenerateObjectList<TResult>, connectionString, queryOrProc, isProc, parameters);
		}

		/// <summary>
		/// Executes the SQL query or stored procedure <paramref name="queryOrProc"/> and parses the first entry
		/// of the return data into an instance of <see cref="TResult"/>.
		/// </summary>
		/// <typeparam name="TResult">Type of returned object.</typeparam>
		/// <param name="parseData">
		/// The delegate used to parse the <see cref="SqlDataReader"/> returned from the SQL query or
		/// stored procedure into the returned <typeparamref name="TResult"/> object.
		/// </param>
		/// <param name="connectionString">The connection string.</param>
		/// <param name="queryOrProc">The SQL query or stored procedure name to execute.</param>
		/// <param name="isProc">
		/// If <c>true</c>, the value of <paramref name="queryOrProc"/> is a stored procedure name;
		/// otherwise the value of <paramref name="queryOrProc"/> is a SQL query.
		/// </param>
		/// <param name="parameters">The SQL parameters for the SQL query/stored procedure.</param>
		/// <returns>
		/// The returned value of the <paramref name="parseData"/> delegate.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// <paramref name="connectionString"/> is null or whitespace
		/// -or- <paramref name="queryOrProc"/> is null or whitespace.
		/// </exception>
		/// <exception cref="SqlException">
		/// SQL Server returned an error while executing the command text
		/// -or- a timeout occurred during a streaming operation.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// The <see cref="SqlConnection"/> closed or dropped during a streaming operation.
		/// -or- Context Connection=true is specified in <paramref name="connectionString"/>.
		/// </exception>
		/// <exception cref="IOException">
		/// An error occurred in <see cref="System.IO.Stream"/>, <see cref="System.Xml.XmlReader"/> or
		/// <see cref="System.IO.TextReader"/> object during a streaming operation. For more
		/// information about streaming, see SqlClient Streaming Support.
		/// </exception>
		/// <exception cref="ObjectDisposedException">
		/// The <see cref="System.IO.Stream"/>, <see cref="System.Xml.XmlReader"/> or <see cref="System.IO.TextReader"/>
		/// object was closed during a streaming operation. For more information about streaming, see SqlClient
		/// Streaming Support.
		/// </exception>
		public static async Task<TResult> InvokeSqlAsync<TResult>(Func<SqlDataReader, TResult> parseData, String connectionString, String queryOrProc, Boolean isProc, List<SqlParameter> parameters)
			where TResult : new()
		{
			if (String.IsNullOrWhiteSpace(connectionString)) throw new ArgumentNullException(connectionString);
			if (String.IsNullOrWhiteSpace(queryOrProc)) throw new ArgumentNullException(queryOrProc);

			try
			{
				TResult result;

				using (SqlConnection con = new SqlConnection(connectionString))
				{
					if (con.State == ConnectionState.Closed)
						con.Open();

					using (SqlCommand cmd = new SqlCommand(queryOrProc, con))
					{
						if (isProc)
							cmd.CommandType = CommandType.StoredProcedure;

						if (parameters?.Count > 0)
							cmd.AddParameters(parameters);

						using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
						{
							result = parseData(reader);
						}
					}

					if (con.State != ConnectionState.Closed)
						con.Close();
				}

				return result;
			}
			catch (Exception ex)
			{
				ex.Data.Add(nameof(queryOrProc), queryOrProc);

				if (parameters?.Count > 0)
				{
					foreach (SqlParameter param in parameters)
					{
						ex.Data.Add(param.ParameterName, param.Value);
					}
				}

				throw;
			}
		}

		/// <summary>
		/// Populates a list of objects from the <paramref name="reader" />.
		/// </summary>
		/// <param name="reader">Contains the data that will populate the returned <see cref="List{TResult}"/>.</param>
		/// <typeparam name="TResult">The type of the elements in the returned list.</typeparam>
		/// <example>
		/// <code>
		///		using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
		///		{
		///			List&lt;MyCustomClass&gt; results = HelperParsing.GenerateObjectList&lt;MyCustomClass&gt;(reader);
		///
		///			return results;
		///		}
		/// </code>
		/// </example>
		public static List<TResult> GenerateObjectList<TResult>(SqlDataReader reader) where TResult : new()
		{
			if (reader == null) throw new ArgumentNullException(nameof(reader));

			List<TResult> results = new List<TResult>();

			// Cache only properties existing as columns in SQL data reader.
			List<PropertyInfo> properties = GetPropertiesWithFields<TResult>(reader);

			Boolean hasResults = false;
			foreach (IDataRecord record in reader.Enumerate())
			{
				TResult obj = GenerateObject<TResult>(record, properties);

				results.Add(obj);

				hasResults = true;
			}

			if (hasResults)
				return results;

			return null;
		}

		/// <summary>
		/// Returns a list of properties that have names corresponding with a field found in <see cref="SqlDataReader"/> <paramref name="reader"/>.
		/// </summary>
		/// <typeparam name="TValue">Type of the object to retrieve the returned list of <see cref="PropertyInfo"/> from.</typeparam>
		/// <param name="reader">The reader containing the columns to be compared.</param>
		/// <example>
		///	<code>
		///		using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
		/// 	{
		///			List&lt;PropertyInfo&gt; properties = HelperParsing.GetPropertiesWithFields&lt;MyCustomClass&gt;(reader);
		///			List&lt;MyCustomClass&gt; results = new List&lt;MyCustomClass&gt;();
		///
		///			while (reader.Read())
		/// 		{
		/// 			MyCustomClass item = HelperParsing.GenerateObject&lt;MyCustomClass&gt;(reader, properties);
		/// 			results.Add(item);
		/// 		}
		/// 
		/// 		return results;
		/// 	}
		/// </code>
		/// </example>
		public static List<PropertyInfo> GetPropertiesWithFields<TValue>(SqlDataReader reader)
		{
			List<PropertyInfo> results = new List<PropertyInfo>();
			PropertyInfo[] props = typeof(TValue).GetProperties();

			foreach (PropertyInfo prop in props)
			{
				if (reader.HasColumn(prop.Name))
				{
					results.Add(prop);
				}
			}

			return results;
		}

		/// <summary>
		/// Creates a new instance of type <typeparamref name="TResult"/> and populates its properties based on <paramref name="record"/> and <paramref name="properties"/>.
		/// Any properties with no matching field found in <paramref name="record"/> with be set to the property type's default value.
		/// </summary>
		/// <typeparam name="TResult">The type of the object returned.</typeparam>
		/// <param name="record">Contains the data that will populate the returned instance of <typeparamref name="TResult"/>.</param>
		/// <param name="properties">The properties to be given value from a field found in <paramref name="record"/>.</param>
		/// <exception cref="ArgumentNullException">
		///		Thrown if <paramref name="record"/> is null.
		/// </exception>
		/// <example>
		/// <code>
		/// 	using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
		/// 	{
		/// 		List&lt;MyCustomClass&gt; results = new List&lt;MyCustomClass&gt;();
		///			PropertyInfo[] properties = typeof(MyCustomClass).GetProperties();
		/// 
		/// 		while (reader.Read())
		/// 		{
		/// 			MyCustomClass item = HelperParsing.GenerateObject&lt;MyCustomClass&gt;(reader, properties);
		/// 			results.Add(item);
		/// 		}
		/// 
		/// 		return results;
		/// 	}
		/// </code>
		/// </example>
		public static TResult GenerateObject<TResult>(IDataRecord record, IEnumerable<PropertyInfo> properties) where TResult : new()
		{
			if (record == null) throw new ArgumentNullException(nameof(record));

			if (properties == null)
			{
				properties = typeof(TResult).GetProperties();
			}

			TResult result = new TResult();

			foreach (PropertyInfo prop in properties)
			{
				result.PopulateObjectProperty(prop, record);
			}

			return result;
		}

		/// <summary>
		/// Sets the value of the property within <paramref name="item"/> based on the matching field found in <paramref name="record"/>.
		/// </summary>
		/// <typeparam name="TArg">The type of the object to be populated.</typeparam>
		/// <param name="item">The object containing <paramref name="prop"/> to be given value.</param>
		/// <param name="prop">The property to set the value of within <paramref name="item"/>.</param>
		/// <param name="record">The data record containing the field value matching that of <paramref name="prop"/>.</param>
		/// <exception cref="ArgumentNullException">
		///		Thrown if <paramref name="prop"/> is null or <paramref name="record"/> is null.
		/// </exception>
		/// <example>
		/// <code>
		///		using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
		/// 	{
		/// 		List&lt;MyCustomClass&gt; results = new List&lt;MyCustomClass&gt;();
		///			PropertyInfo[] properties = typeof(MyCustomClass).GetProperties();
		/// 
		/// 		while (reader.Read())
		/// 		{
		///				MyCustomClass item = new MyCustomClass();
		///				foreach (PropertyInfo prop in typeof(MyCustomClass).GetProperties())
		///				{
		///					item.PopulateObjectProperty(prop, reader);
		///				}
		///
		///				results.Add(item);
		/// 		}
		/// 
		/// 		return results;
		/// 	}
		/// </code>
		/// </example>
		public static void PopulateObjectProperty<TArg>(this TArg item, PropertyInfo prop, IDataRecord record)
		{
			if (prop == null) throw new ArgumentNullException(nameof(prop));
			if (record == null) throw new ArgumentNullException(nameof(record));

			try
			{
				Int32 ordinal = record.GetOrdinal(prop.Name);
				Object val;

				// Check if property can be assigned null value
				if (!prop.PropertyType.IsValueType || Nullable.GetUnderlyingType(prop.PropertyType) != null)
				{
					// Property value can be null
					val = record.IsDBNull(ordinal) ? null : record[prop.Name];
				}
				else
				{
					// Property value cannot be null.
					// If the data record field is null, set the value to the type's default value.
					val = record.IsDBNull(ordinal) ? Activator.CreateInstance(prop.PropertyType) : record[prop.Name];
				}

				prop.SetValue(item, val);
			}
			catch (Exception ex)
			{
				ex.Data.Add("Data", $"Failed to parse property: {prop.Name}");
				throw;
			}
		}

		/// <summary>
		/// Adds a new instance of <see cref="SqlParameter"/>. If <paramref name="val"/> is null, a <see cref="SqlParameter"/> with the value <see cref="DBNull.Value"/> is added.
		/// </summary>
		/// <typeparam name="T">The data type of <paramref name="val"/>.</typeparam>
		/// <param name="parameters"></param>
		/// <param name="paramName">The SQL parameter name.</param>
		/// <param name="val">The SQL parameter value.</param>
		/// <param name="sqlDbType">The SQL data type desired.</param>
		public static void AddSqlParam<T>(this List<SqlParameter> parameters, String paramName, T val, SqlDbType? sqlDbType = null)
		{
			if (String.IsNullOrWhiteSpace(paramName))
			{
				throw new ArgumentException("The parameter name cannot be null or empty!", nameof(paramName));
			}

			parameters = parameters.Validate();

			SqlParameter param;

			if (val == null)
			{
				param = new SqlParameter(paramName, DBNull.Value);
			}
			else if (val is IEnumerable<String>)
			{
				// Without doing below casts, String.Join would call an incorrect overload method for what we want here.
				IEnumerable valEnumerable = val as IEnumerable;
				String pipeDelimitedString = String.Join("|", valEnumerable.Cast<Object>());

				param = new SqlParameter(paramName, pipeDelimitedString);
			}
			else
			{
				param = new SqlParameter(paramName, val);
			}

			if (sqlDbType != null)
			{
				param.SqlDbType = (SqlDbType)sqlDbType;
			}

			parameters.Add(param);
		}

		/// <summary>
		/// Validates <paramref name="parameters"/>. Should be called before any parameters are added.
		/// </summary>
		private static List<SqlParameter> Validate(this List<SqlParameter> parameters)
		{
			return parameters ?? new List<SqlParameter>();
		}
	}
}
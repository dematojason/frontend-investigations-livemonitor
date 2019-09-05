using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CpcLiveMonitor.Utility.Extensions
{
	public static class StringExtensions
	{
		/// <summary>
		/// Formats a person name <see cref="String"/> by capitalizing the first letter of each name and sorting the names (if string value contains multiple names).
		/// </summary>
		/// <param name="name"></param>
		/// <returns>A formatted person name.</returns>
		public static String FormatName(this String name)
		{
			try
			{
				// i.e. input: "RICHBURG,JOSHUA BRYAN" or "PEEK, DANIEL THOMAS"
				// i.e. output: "Joshua Bryan Richburg" or "Daniel Thomas Peek"
				name = name.ToLowerInvariant();

				TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
				name = ti.ToTitleCase(name);

				String[] names = name.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);

				String result;
				switch (names.Length)
				{
					case 1:
						result = names[0];
						break;
					case 2:
						result = $"{names[1]} {names[0]}";
						break;
					case 3:
						result = $"{names[1]} {names[2]} {names[0]}";
						break;
					default:
						result = String.Empty;
						break;
				}

				return result;
			}
			catch (Exception)
			{
				return name;
			}
		}
	}
}
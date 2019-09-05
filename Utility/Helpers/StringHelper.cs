using System;
using System.Text.RegularExpressions;

namespace CpcLiveMonitor.Utility.Helpers
{
	public static class StringHelper
	{
		public static String ApinToPinId(String apin)
		{
			String returnValue = apin.Trim();
			if (returnValue.Length == 0)
			{
				return String.Empty;
			}

			returnValue = Regex.Replace(returnValue, "[ABC]", "2", RegexOptions.IgnoreCase);
			returnValue = Regex.Replace(returnValue, "[DEF]", "3", RegexOptions.IgnoreCase);
			returnValue = Regex.Replace(returnValue, "[GHI]", "4", RegexOptions.IgnoreCase);
			returnValue = Regex.Replace(returnValue, "[JKL]", "5", RegexOptions.IgnoreCase);
			returnValue = Regex.Replace(returnValue, "[MNO]", "6", RegexOptions.IgnoreCase);
			returnValue = Regex.Replace(returnValue, "[PQRS]", "7", RegexOptions.IgnoreCase);
			returnValue = Regex.Replace(returnValue, "[TUV]", "8", RegexOptions.IgnoreCase);
			returnValue = Regex.Replace(returnValue, "[WXYZ]", "9", RegexOptions.IgnoreCase);

			return returnValue.PadLeft(10, '0');
		}

		public static DateTime? DobToDateTime(String dob)
		{
			if (!String.IsNullOrEmpty(dob) && dob.Length == 8)
			{
				DateTime.TryParse(dob.Substring(4, 2) + "/" + dob.Substring(6, 2) + "/" + dob.Substring(0, 4), out DateTime dateTime);
				if (dateTime <= DateTime.Parse("1/1/1901"))
				{
					return null;
				}

				return dateTime;
			}

			return null;
		}

		public static String[] NameParts(String fullName)
		{
			String[] strReturnValue = new String[3];
			if (!String.IsNullOrEmpty(fullName))
			{
				String firstName = String.Empty;
				String middleName = String.Empty;
				String lastName = String.Empty;
				String[] inputValues = fullName.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
				if (inputValues.Length == 2)
				{
					fullName = inputValues[1] + " " + inputValues[0];
				}

				inputValues = fullName.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
				if (inputValues.Length > 0)
				{
					lastName = inputValues[inputValues.Length - 1];
					if (inputValues.Length > 2)
					{
						middleName = inputValues[inputValues.Length - 2];
					}
					if (!String.IsNullOrEmpty(lastName) && !String.IsNullOrEmpty(middleName))
					{
						firstName = fullName.Replace(lastName, "").Replace(middleName, "").Trim();
					}
					else if (!String.IsNullOrEmpty(lastName))
					{
						firstName = fullName.Replace(lastName, "");
					}
				}
				strReturnValue[0] = firstName;
				strReturnValue[1] = middleName;
				strReturnValue[2] = lastName;
			}

			return strReturnValue;
		}
	}
}
using System;
using System.Collections.Generic;
using System.Linq;
using CpcLiveMonitor.Domain;
using CpcLiveMonitor.Utility.EntityFramework.Scidyn;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Serializers;

namespace CpcLiveMonitor.Web.Repositories
{
	public class AccountRepo
	{
		private static readonly String _serverToken = System.Configuration.ConfigurationManager.AppSettings["TokenSecret"];


		public static String RetrieveAuthToken(LoginArguments loginArgs)
		{
			if (String.IsNullOrWhiteSpace(loginArgs.Username) || String.IsNullOrWhiteSpace(loginArgs.Password))
				throw new ArgumentException("Invalid username and/or password.");

			LoginData loginData = VerifyLogin(loginArgs.Username, loginArgs.Password);

			String loginToken = new JwtBuilder()
				.WithAlgorithm(new HMACSHA256Algorithm())
				.WithSecret(_serverToken)
				.AddClaim("exp", loginData.ExpirationSeconds)
				.AddClaim("userid", loginData.UserId)
				.AddClaim("name", loginData.UserDisplayName)
				.Build();

			return loginToken;
		}

		private static LoginData VerifyLogin(String username, String password)
		{
			LoginData loginData = new LoginData();

			using (ScidynContext scidyn = new ScidynContext())
			{
				User user = scidyn.Users.FirstOrDefault(x => x.UserName == username);
				if (user != null && !String.IsNullOrWhiteSpace(user.Password))
				{
					if (BCrypt.Net.BCrypt.Verify(password, user.Password))
					{
						loginData.UserId = user.UserName;
						loginData.ExpirationSeconds = DateTimeOffset.UtcNow.AddHours(8.0).ToUnixTimeSeconds();
						loginData.UserDisplayName = (!String.IsNullOrWhiteSpace(user.FirstName) ? user.FirstName + " " : "") + user.LastName;
					}
				}
			}

			if (String.IsNullOrWhiteSpace(loginData.UserId))
				throw new ArgumentException("Login information does not match an existing account");

			return loginData;
		}

		public static User GetKcUser(String username)
		{
			if (String.IsNullOrWhiteSpace(username))
				throw new ArgumentException("Invalid username value");

			User result;

			using (ScidynContext ctx = new ScidynContext())
			{
				result = ctx.Users.FirstOrDefault(k => k.UserName == username);
			}

			return result;
		}

		public static List<String> GetKcUserPermissions(String username)
		{
			if (String.IsNullOrWhiteSpace(username))
				throw new ArgumentException("Invalid username");

			List<String> result = new List<String>();

			using (ScidynContext ctx = new ScidynContext())
			{
				List<UserPermission> permissions = ctx.UserPermissions.Where(k => k.UserName == username).ToList();

				if (permissions.Count > 0)
				{
					result = permissions.Select(p => p.Name).ToList();
				}
			}

			return result;
		}

		public static LoginData GetLoginData(String userToken)
		{
			//return new SecuritySrvProxy().GetLoginDataFromToken(userToken);
			if (String.IsNullOrWhiteSpace(userToken))
				throw new ArgumentException("Invalid token");

			LoginData loginData = DecryptToken(userToken);
			return loginData;
		}

		private static LoginData DecryptToken(String token)
		{
			if (String.IsNullOrWhiteSpace(token))
				throw new SignatureVerificationException("Invalid token");

			IJsonSerializer serializer = new JsonNetSerializer();
			IDateTimeProvider provider = new UtcDateTimeProvider();
			IJwtValidator validator = new JwtValidator(serializer, provider);
			IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
			IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder);

			Dictionary<String, Object> payload = decoder.DecodeToObject<Dictionary<String, Object>>(token, _serverToken, verify: true);

			if (payload == null || !payload.ContainsKey("exp") || !payload.ContainsKey("userid") || !payload.ContainsKey("name"))
			{
				throw new SignatureVerificationException("Incomplete token");
			}

			Int32.TryParse(payload["exp"].ToString(), out Int32 expiresInSeconds);

			LoginData loginData = new LoginData();
			loginData.UserId = payload["userid"].ToString();
			loginData.UserDisplayName = payload["name"].ToString();
			loginData.ExpirationSeconds = Math.Max(GetSecondsToExpiration(expiresInSeconds), -1);

			return loginData;
		}

		private static Int32 GetSecondsToExpiration(Int64 secondsFromEpoch)
		{
			Int64 secondsSinceEpoch = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
			return (Int32)(secondsFromEpoch - secondsSinceEpoch);
		}
	}
}
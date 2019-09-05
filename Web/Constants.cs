using System;

namespace CpcLiveMonitor.Web
{
	public class Constants
	{
		public static readonly Byte[] RIFF_HEADER = { 82, 73, 70, 70 };
		public static readonly Byte[] FORMAT_WAVE = { 87, 65, 86, 69 };
		public static readonly Byte[] FORMAT_TAG = { 102, 109, 116, 32 };
		public static readonly Byte[] AUDIO_FORMAT = { 1, 0 };
		public static readonly Byte[] SUBCHUNK_ID = { 100, 97, 116, 97 };
		
		public static readonly UInt16 CHANNELS = 1;
		public static readonly UInt16 BIT_DEPTH = 16;
		public static readonly Int32 SAMPLE_RATE = 8000;

		public static readonly Int32 BYTE_RATE = SAMPLE_RATE * CHANNELS * (BIT_DEPTH / 8);
		public static readonly Int32 BLOCK_ALIGN = CHANNELS * (BIT_DEPTH / 8);
		public static readonly Int32 BIT_RATE_KBPS = SAMPLE_RATE * BIT_DEPTH * CHANNELS / 1000;

		public static readonly String UNAUTHORIZED_EXPIRED_TOKEN = "expired_token";
		public static readonly String UNAUTHORIZED_REQUIRED_ROLES = "required_roles";
		public static readonly String UNAUTHORIZED_UNAUTHENTICATED = "unauthenticated";

		public static readonly String CLIENT_MESSAGE_DEFAULT = "An unexpected problem has occurred. Please try again.";
		public static readonly String CLIENT_MESSAGE_ERROR_GETINMATE = "Unable to find inmate.";
	}
}
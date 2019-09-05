using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace CpcLiveMonitor.Domain
{
	/// <summary>
	/// Used for storing data related to a specific audio stream
	/// </summary>
	public class AudioData
	{
		private readonly TalkingStick _theMemStreamTalkingStick = new TalkingStick();

		private MemoryStream _memStream = new MemoryStream();
		private Int32 _activeListenerCounter;


		/// <summary>
		/// Number of users listening to audio produced by this object's memory stream
		/// </summary>
		public Int32 ActiveListenerCt => _activeListenerCounter;

		/// <summary>
		/// Default buffer size for transporting bytes from saved memory stream to output stream.
		/// </summary>
		public Int32 DefBufferSize { get; set; } = 8000;


		public void IncrementListenerCt()
		{
			Interlocked.Increment(ref _activeListenerCounter);
		}

		public void DecrementListenerCt()
		{
			Interlocked.Decrement(ref _activeListenerCounter);
		}

		public Task<Int32> ReadMemStreamAsync(Int64 readPos, Byte[] buffer, Int32 offset, Int32 count)
		{
			lock (_theMemStreamTalkingStick)
			{
				_memStream.Seek(readPos, SeekOrigin.Begin);
				return _memStream.ReadAsync(buffer, offset, count);
			}
		}

		public Task WriteToMemStreamAsync(Byte[] input, Int32 offset, Int32 count)
		{
			lock (_theMemStreamTalkingStick)
			{
				_memStream.Seek(0, SeekOrigin.End);
				return _memStream.WriteAsync(input, offset, count);
			}
		}

		public void DisposeMemStream()
		{
			lock (_theMemStreamTalkingStick)
			{
				_memStream?.Dispose();
				_memStream = null;
			}
		}

		public Boolean CanReadMemStream()
		{
			lock (_theMemStreamTalkingStick)
			{
				// If there's data 
				return _memStream != null && _memStream.Length > 1000 && _memStream.CanRead;
			}
		}

		public Int64 GetMemStreamLength()
		{
			lock (_theMemStreamTalkingStick)
			{
				//return _memStream.Length;
				Int64 curPos = _memStream.Position;

				_memStream.Seek(0, SeekOrigin.End);
				Int64 result = _memStream.Position;

				_memStream.Seek(curPos, SeekOrigin.Begin);

				return result;
			}
		}
	}
}
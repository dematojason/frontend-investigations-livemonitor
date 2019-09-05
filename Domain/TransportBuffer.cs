using System;

namespace CpcLiveMonitor.Domain
{
	public class TransportBuffer
	{
		public Int32 Length { get; set; }
		public Byte[] Data { get; set; }

		public Guid UniqueId { get; }

		public TransportBuffer()
		{
			this.UniqueId = Guid.NewGuid();
		}

		public TransportBuffer(Int32 bufferSize)
		{
			this.UniqueId = Guid.NewGuid();
			this.Data = new Byte[bufferSize];
			this.Length = 0;
		}
	}
}
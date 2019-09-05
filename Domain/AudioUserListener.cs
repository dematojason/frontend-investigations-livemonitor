using System;

namespace CpcLiveMonitor.Domain
{
	public class AudioUserListener
	{
		private readonly TalkingStick _audioUserTaklingStick = new TalkingStick();

		private Boolean _forceStop;
		private Int32 _callIdListeningTo;


		/// <summary>
		/// Flag that signifies the current stream the user is listening to should stop streaming.
		/// </summary>
		public Boolean ForceStop
		{
			get => _forceStop;
			set
			{
				lock (_audioUserTaklingStick)
				{
					_forceStop = value;
				}
			}
		}

		/// <summary>
		/// Call ID of the audio stream the user is listening to
		/// </summary>
		public Int32 CallIdListeningTo
		{
			get => _callIdListeningTo;
			set
			{
				lock (_audioUserTaklingStick)
				{
					_callIdListeningTo = value;
				}
			}
		}
	}
}
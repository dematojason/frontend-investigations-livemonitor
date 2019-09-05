using System;
using System.Configuration;
using CpcLiveMonitor.Domain;

namespace CpcLiveMonitor.Web.Handlers
{
	public static class CircuitsMsgHandler
	{
		private static Int32 _curMsgCt;
		private static readonly Int32 _maxMessagesInMemoryCount = Int32.Parse(ConfigurationManager.AppSettings["MaxMessagesInMemoryCount"]);

		private static readonly TalkingStick _msgTalkingStick = new TalkingStick();
		private static IRtcmMsg[] _msgArr = new IRtcmMsg[_maxMessagesInMemoryCount];


		public static TArgs AddNewMsg<TArgs>(TArgs msg)
			where TArgs : IRtcmMsg
		{
			lock (_msgTalkingStick)
			{
				Boolean isMaxMsgCtReached = _curMsgCt == _maxMessagesInMemoryCount;
				Int32 elementsToCopyCount = isMaxMsgCtReached
					? _maxMessagesInMemoryCount - 1 // Copy all but the last element (because last element will be removed)
					: _curMsgCt; // Copy all elements currently in array

				// Shift elements and insert new msg to first index of new array
				IRtcmMsg[] tempArr = new IRtcmMsg[_maxMessagesInMemoryCount];
				Array.Copy(_msgArr, 0, tempArr, 1, elementsToCopyCount);
				tempArr[0] = msg;

				_msgArr = tempArr;

				if (!isMaxMsgCtReached)
					_curMsgCt++;
			}

			return msg;
		}

		public static void ClearMessages()
		{
			lock (_msgTalkingStick)
			{
				_msgArr = new IRtcmMsg[_maxMessagesInMemoryCount];
				_curMsgCt = 0;
			}
		}

		public static IRtcmMsg[] GetMessages()
		{
			IRtcmMsg[] result = new IRtcmMsg[0];

			if (_curMsgCt == 0)
				return result;

			lock (_msgTalkingStick)
			{
				result = new IRtcmMsg[_curMsgCt];
				Array.Copy(_msgArr, 0, result, 0, _curMsgCt);
			}

			return result;
		}
	}
}
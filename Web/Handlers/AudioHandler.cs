using System;
using System.Collections.Concurrent;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using CpcLiveMonitor.Domain;
using MailmanInterop;
using MailmanInterop.Models;
using Newtonsoft.Json;
using ProdigyFlatFileLogger;

namespace CpcLiveMonitor.Web.Handlers
{
	public static class AudioHandler
	{
		private static readonly ILogger _logger = new Logger();

		private static readonly ConcurrentDictionary<Int32, AudioData> _audioStreams = new ConcurrentDictionary<Int32, AudioData>();
		private static readonly ConcurrentDictionary<String, AudioUserListener> _userListeners = new ConcurrentDictionary<String, AudioUserListener>();


		/// <summary>
		/// Append <paramref name="input"/> bytes to memory stream.
		/// </summary>
		/// <param name="input">Bytes to append</param>
		public static async Task WriteToBuffer(Byte[] input)
		{
			// Separate call ID and data chunk
			// First 2 bytes will be call ID
			Byte[] callIdBuffer = new Byte[2];
			Buffer.BlockCopy(input, 0, callIdBuffer, 0, 2);
			Int16 callId = BitConverter.ToInt16(callIdBuffer, 0);

			Byte[] inputDataChunk = new Byte[input.Length - 2];
			Buffer.BlockCopy(input, 2, inputDataChunk, 0, inputDataChunk.Length);

			if (_audioStreams.TryGetValue(callId, out AudioData audioData))
			{
				if (audioData.GetMemStreamLength() == 0)
				{
					_logger.LogInfo($"Writing initial data of {inputDataChunk.Length} bytes for call ID: {callId}");
				}

				await WriteToAudioDataMemStream(audioData, inputDataChunk);
			}
			else
			{
				//_logger.LogWarning($"Audio stream object does not exist with call ID: {callId}");

				//// Create new audiodata object
				//audioData = new AudioData();

				//// Add new audiodata object to dictionary and write input bytes
				//if (_audioStreams.TryAdd(callId, audioData))
				//{
				//	_logger.LogInfo($"Created new audio data object for call ID: {callId}");
				//	await WriteToAudioDataMemStream(audioData, inputDataChunk);
				//	_logger.LogInfo($"Finished writing initial data of {inputDataChunk.Length} bytes for call ID: {callId}");
				//}
				//else
				//{
				//	throw new Exception($"Failed to create new audio stream object with call ID {callId}");
				//}
			}
		}

		public static Boolean IsExistingStream(Int32 callId)
		{
			if (_audioStreams.TryGetValue(callId, out AudioData _))
			{
				return true;
			}

			return false;
		}

		public static void CreateNewStream(Int32 callId)
		{
			AudioData newAudioStream = new AudioData();

			if (_audioStreams.TryAdd(callId, newAudioStream))
			{
				_logger.LogInfo($"Created new audio data object for call ID: {callId}");
			}
			else
			{
				throw new Exception($"Failed to create new audio stream object with call ID: {callId}");
			}
		}

		private static async Task WriteToAudioDataMemStream(AudioData audioData, Byte[] inputDataChunk)
		{
			// Covnert 8-bit to 16-bit depth
			//Byte[] inputConverted = Convert8BitTo16Bit(inputDataChunk);

			//await audioData.WriteToMemStreamAsync(inputConverted, 0, inputConverted.Length);
			await audioData.WriteToMemStreamAsync(inputDataChunk, 0, inputDataChunk.Length);
		}

		private static Byte[] Convert8BitTo16Bit(Byte[] input)
		{
			Int32 inputSamples = input.Length;
			Byte[] output = new Byte[inputSamples * 2];
			Int32 outputIndex = 0;
			for (Int32 i = 0; i < inputSamples; i++)
			{
				output[outputIndex] = input[i];
				outputIndex++;

				output[outputIndex] = input[i];
				outputIndex++;
			}

			return output;
		}

		/// <summary>
		/// Writes stored memory stream to <paramref name="outputStream"/>.
		/// </summary>
		/// <param name="outputStream"></param>
		/// <param name="content"></param>
		/// <param name="context"></param>
		/// <param name="callId"></param>
		/// <param name="ani"></param>
		/// <param name="username"></param>
		/// <param name="lineId"></param>
		/// <param name="unitId"></param>
		public static async Task WriteToAsync(Stream outputStream, HttpContent content, TransportContext context, Int32 callId, Int32 lineId, Int32 unitId, String ani, String username)
		{
			AudioData audioData = null;

			try
			{
				if (callId <= 0) throw new ArgumentException("AudioHandler.WriteToAsync - Invalid call ID value");
				if (String.IsNullOrWhiteSpace(username)) throw new ArgumentException("AudioHandler.WriteToAsync - Invalid username value");

				if (_audioStreams == null)
				{
					// This SHOULD never happen, but just to be safe..
					throw new ArgumentException("AudioHandler.WriteToAsync - _audioStreams is null");
				}

				// Try retrieving audio data
				// Retries to make sure sufficient time is given to
				// method that creates audio data object and stream.
				Int32 ct = 0;
				while (ct < 10)
				{
					if (_audioStreams.TryGetValue(callId, out audioData))
					{
						break;
					}

					Thread.Sleep(500);
					ct++;
				}

				if (audioData == null) throw new ArgumentException($"AudioData requested and not found for username '{username}', call ID {callId}");

				// Wait for data to be written before reading.
				ct = 0;
				while (ct < 10)
				{
					if (audioData.CanReadMemStream())
					{
						break;
					}

					Thread.Sleep(500);
					ct++;
				}

				// Check if we can read from audioData and write to outputStream
				CheckReadWrite(audioData, outputStream, callId);

				AudioUserListener newListener = new AudioUserListener();
				newListener.ForceStop = false;
				newListener.CallIdListeningTo = callId;

				if (!_userListeners.TryAdd(username, newListener))
				{
					// TryAdd can fail if key already exists, but there are other reasons for failing,
					// so check here to make sure key already existing is the reason.
					if (_userListeners.TryGetValue(username, out AudioUserListener existingListener))
					{
						if (existingListener.CallIdListeningTo != callId)
						{
							// The key did already exist, it just still had an old call ID.
							// So update the existing user listener with the new call ID.
							if (!_userListeners.TryUpdate(username, newListener, existingListener))
							{
								throw new ArgumentException($"Existing user listener '{username}' could not be updated with new call ID {callId}.");
							}
						}
					}
					else
					{
						throw new ArgumentException($"Unable to add new user listener '{username}' to audio stream for call ID {callId}.");
					}
				}

				// ReSharper disable once PossibleNullReferenceException
				// Null check on audio data is done in CheckReadWrite method.
				audioData.IncrementListenerCt();

				// Create transport buffers; One reads from memory, while the 
				// other writes to output stream. Then they swap jobs. Rinse and repeat.
				TransportBuffer[] transportBuffers =
				{
					new TransportBuffer(audioData.DefBufferSize),
					new TransportBuffer(audioData.DefBufferSize)
				};

				Int32 bufNum = 0;

				// Start reading towards the end of stream to get more up-to-date data
				// Subtract 1000 so that it's not reading too close to the process that's writing to memstream
				Int64 readPos = audioData.GetMemStreamLength() - 1000;

				_logger.LogInfo($"User '{username}': Starting stream, Call ID {callId}");

				Task<Int32> readTask = audioData.ReadMemStreamAsync(readPos, transportBuffers[bufNum].Data, 0, transportBuffers[bufNum].Data.Length);
				Task writeTask = null;

				Int32 retryCt = 0;
				Int32 maxRetryCt = 50;
				Int32 sleepMsBetweenAttempts = 100;

				while (CheckIsListening(username))
				{
					await readTask;

					transportBuffers[bufNum].Length = readTask.Result;
					readPos += transportBuffers[bufNum].Length; // Update read position.

					// If zero bytes were read, there's currently no data left to read.
					if (readTask.Result == 0)
					{
						if (retryCt >= maxRetryCt)
						{
							break;
						}

						// Wait, then retry
						Thread.Sleep(sleepMsBetweenAttempts);

						readTask = audioData.ReadMemStreamAsync(readPos, transportBuffers[bufNum].Data, 0, transportBuffers[bufNum].Data.Length);

						retryCt++;
						continue;
					}

					// Data found, reset retry count
					retryCt = 0;

					if (writeTask != null)
					{
						await writeTask;
						outputStream.Flush();
					}

					writeTask = outputStream.WriteAsync(transportBuffers[bufNum].Data, 0, transportBuffers[bufNum].Length);

					// Reset currently active transport buffer length for later update of read position
					transportBuffers[bufNum].Length = 0;

					// Switch active transport buffers
					bufNum ^= 1; //bufNum == 0 ? 1 : 0

					readTask = audioData.ReadMemStreamAsync(readPos, transportBuffers[bufNum].Data, 0, transportBuffers[bufNum].Data.Length);
				}

				if (writeTask != null)
				{
					await writeTask;
				}
			}
			catch (HttpException)
			{
				// Remote host closed the connection
				_logger.LogInfo($"Front-end aborted stream for username: '{username ?? "NULL"}'; call ID: {callId}");
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Exception thrown in AudioHandler.WriteToAsync");
			}
			finally
			{
				_logger.LogInfo($"User '{username ?? "NULL"}': ending stream; call ID {callId}");

				if (!String.IsNullOrWhiteSpace(username))
				{
					if (_userListeners.TryRemove(username, out AudioUserListener listener))
					{
						_logger.LogInfo($"Removed audio user listener username '{username}', call ID: {listener.CallIdListeningTo}");
					}
					else
					{
						_logger.LogWarning($"Failed to remove audio user listener with username '{username}', call ID: {listener?.CallIdListeningTo ?? 0}");
					}
				}
				else
				{
					_logger.LogWarning("Cannot remove audio listener because username was null or whitespace.");
				}

				if (audioData != null)
				{
					audioData.DecrementListenerCt();

					Int32 activeListenerCt = GetActiveListenerCt(callId);
					if (activeListenerCt < 1)
					{
						SendMonitorEndRequest(callId, lineId, unitId, ani);

						// No listeners left on current audio stream;
						// Safe to dispose memory stream and remove audio data object from dictionary of active streams.
						audioData.DisposeMemStream();

						if (_audioStreams.TryRemove(callId, out AudioData _))
						{
							_logger.LogInfo($"Removed audio stream from stack, call ID: {callId}");
						}
						else
						{
							// ReSharper disable once ConstantNullCoalescingCondition
							_logger.LogError($"Failed to remove audio data stream after disposing. Username: '{username ?? "NULL"}', call ID: {callId}");
						}
					}
					else
					{
						_logger.LogInfo($"Active listener count of {activeListenerCt}. call ID: {callId}");
					}
				}

				// Signal that output stream is done being written to and dispose.
				outputStream.Flush();
				outputStream.Dispose();
			}
		}

		public static void SendMonitorEndRequest(Int32 callId, Int32 lineId, Int32 unitId, String ani)
		{
			try
			{
				// Send end request if there are no active listeners on that call.
				if (GetActiveListenerCt(callId) < 1)
				{
					MailmanResponse mailmanResponse = CircuitsInterop.MonitorRequestEnd(callId, lineId, unitId, ani);
					UInt32 responseCode = CircuitsInterop.GetResponseCode(mailmanResponse);

					_logger.LogInfo($"Sent monitor end request for call ID: {callId}");

					if (responseCode == ResponseCodes.LM_OK || responseCode == ResponseCodes.LM_NO_MONITORING_SESSION)
					{
						return;
					}

					_logger.LogWarning($"Request Monitor End returned response code: {responseCode}\r\n\targs: lineId: {lineId}, unitId: {unitId}, ani: {ani}, callId: {callId}");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, $"Failed to send monitor end request.\r\n\targs: lineId: {lineId}, unitId: {unitId}, ani: {ani}, callId: {callId}");
			}
		}

		public static Int32 GetActiveListenerCt(Int32 callId)
		{
			if (_audioStreams.TryGetValue(callId, out AudioData audioData))
			{
				return audioData.ActiveListenerCt;
			}

			return 0;
		}

		private static Boolean CheckIsListening(String username)
		{
			if (_userListeners.TryGetValue(username, out AudioUserListener listener))
			{
				if (listener.ForceStop)
				{
					if (_userListeners.TryRemove(username, out AudioUserListener __))
					{
						_logger.LogInfo($"Force stopping user '{username}' stream listening on call ID: {listener.CallIdListeningTo}");
						return false;
					}

					throw new ArgumentException($"Failed to remove audio user listener {username} for audio call ID: {listener.CallIdListeningTo}");
				}
			}
			else
			{
				return false;
			}

			return true;
		}

		private static void CheckReadWrite(AudioData audioData, Stream outputStream, Int32 callId)
		{
			String opExMsg = null;
			if (audioData == null)
				opExMsg = $"Could not find audio data. Call ID {callId}";
			else if (!audioData.CanReadMemStream())
				opExMsg = $"No data to read from memory stream or cannot read from memory stream. Call ID {callId}";
			else if (!outputStream.CanWrite)
				opExMsg = $"Cannot write to output stream. Call ID {callId}";

			if (opExMsg != null)
			{
				throw new InvalidOperationException(opExMsg);
			}
		}

		public static Boolean FlagForceStopStream(String username)
		{
			if (_userListeners.TryGetValue(username, out AudioUserListener listener))
			{
				listener.ForceStop = true;
				return true;
			}

			return false;
		}
	}
}
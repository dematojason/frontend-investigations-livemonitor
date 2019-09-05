namespace LiveMonitor.Widgets {
	interface ICircuitAudioBindings {
		disposeEvent: string;
		onCallEnd: () => any;
		showFacility: boolean;
	}

	class CircuitAudioComponent implements ng.IComponentOptions {
		public bindings: any;
		public controller: any;
		public controllerAs: string;
		public templateUrl: string;

		constructor() {
			this.bindings = {
				disposeEvent: '@',
				onCallEnd: '&',
				showFacility: '<'
			};
			this.controller = CircuitAudioController;
			this.controllerAs = 'vm';
			this.templateUrl = 'Templates/components/circuitaudio.html';
		}
	}

	class CircuitAudioController implements ICircuitAudioBindings {
		// #region Bindings

		public disposeEvent: string;
		public onCallEnd: () => any;
		public showFacility: boolean;

		// #endregion Bindings

		// #region Class Variables

		public circuitInfo: LiveCircuitEntry | null;
		public circuitInfoDisplay: any;

		public audioCtx: AudioContext;
		public volume: number;
		public buffering: boolean;
		public playableCircuitSelected: boolean;
		public stopping: boolean;
		public loadingPlay: boolean;
		public abortingFetch: boolean;
		public closingAudioContext: boolean;
		public endingStream: boolean;
		public streamingAudio: boolean;

		private _analyser: AnalyserNode;
		private _audioStack: Array<AudioBufferSegment>;
		private _canvas: HTMLCanvasElement;
		private _canvasCtx: CanvasRenderingContext2D | null;
		private _drawingVisual: boolean = false;
		private _fetchAbortCtrl: AbortController;
		private _fetchAbortSignal: AbortSignal;
		private _fetchAborted: boolean;
		private _gainNode: GainNode;
		private _defGainVal: number;
		private _hasCancelled: boolean;
		private _nextTime: number;
		private _queuedCircuit: LiveCircuitEntry | null;
		private _scheduleBuffersTimeoutId: ng.IPromise<void> | null;
		private _volBeforeMute: number;
		private _visualType: string;

		// #endregion Class Variables


		static $inject = [
			'LiveMonitor.Services.AudioService',
			'LiveMonitor.Services.LogService',
			'LiveMonitor.Services.NotifierService',
			'$q',
			'$rootScope',
			'$scope',
			'$timeout',
			'$window'
		];
		constructor(
			private readonly _audioService: Services.IAudioService,
			private readonly _logService: Services.ILogService,
			private readonly _notifier: Services.INotifierService,
			private readonly _$q: ng.IQService,
			private readonly _$rootScope: ng.IRootScopeService,
			private readonly _$scope: ng.IScope,
			private readonly _$timeout: ng.ITimeoutService,
			private readonly _$window: ng.IWindowService
		) {
			console.log('circuitAudio.component constructor');
			this.disposeEvent = '';
			this.circuitInfo = new LiveCircuitEntry();
			this.showFacility = false;

			this.volume = 50;
			this.buffering = false;
			this.playableCircuitSelected = false;
			this.stopping = false;
			this.loadingPlay = false;
			this.abortingFetch = false;
			this.closingAudioContext = false;
			this.endingStream = false;
			this.streamingAudio = false;

			this._audioStack = [];
			this._canvas = document.getElementById('audioCanvas') as HTMLCanvasElement;
			this._canvasCtx = this._canvas.getContext('2d');
			this._defGainVal = .5;
			this._hasCancelled = false;
			this._fetchAborted = false;
			this._nextTime = 0;
			this._queuedCircuit = null;
			this._scheduleBuffersTimeoutId = null;
			this._volBeforeMute = 50;
			this._visualType = 'sine';
		}

		$onInit() {
			console.log('$onInit()');
			this._$window.onbeforeunload = (): void => {
				console.log('$window.onbeforeunload');
				if (this.buffering || this.streamingAudio) {
					this.tryStop().then(
						(): void => {
							// Yay. Now keep going.
						},
						(err): void => {
							console.log(err);
							// Not much we can do here.. User is trying to leave the page, so let them.
						});
				}
			}

			this._$scope.$on('playCircuitAudio',
				(event, args: LiveCircuitEntry): void => {
					console.log('$scope.$on.playCircuitAudio');
					if (args === null || args === undefined) {
						this._notifier.warning('Invalid circuit selected!');
					} else if (this.stopping) {
						// Queue the circuit to be played once the dispose process 
						// from the previous play request is finished.
						this._queuedCircuit = angular.copy(args);
						console.log('Queued circuit');
					} else if (this.buffering || this.streamingAudio) {
						if (CommonHelper.isDefined(this.circuitInfo) && CommonHelper.isDefined(this.circuitInfo.call)) {
							if (CircuitHelper.isCallMatch(this.circuitInfo, args)) {
								console.log('Same call that is already playing; don\'t do anything');
								// Same call that is already playing; don't do anything.
								return;
							}
						}

						console.log('trying stop...');
						this.tryStop().then(
							(): void => {
								console.log('playCircuitAudio tryStop() success');
								this.circuitInfo = args;
								this.tryPlay();
							},
							(err): void => {
								console.log('playCircuitAudio tryStop() fail');
								console.log(err);
							});
					} else {
						console.log('trying play...');
						this.circuitInfo = args;
						this.tryPlay();
					}
				});

			this._$scope.$on('changePlayingCircuit',
				(event, args: LiveCircuitEntry): void => {
					console.log('$scope.$on.changePlayingCircuit');
					if (args === null || args === undefined) {
						console.log('args is null or undefined');
						this._notifier.warning('Invalid circuit selected!');
					} else if (this.stopping) {
						// Queue the circuit to be played once the dispose process 
						// from the previous play request is finished.
						this._queuedCircuit = angular.copy(args);
						console.log('Queued circuit');
					} else if (this.buffering || this.streamingAudio) {
						this.tryStop().then(
							(): void => {
								this.circuitInfo = args;
								this.tryPlay();
							},
							(err): void => {
								console.log(err);
							});
					} else {
						this.circuitInfo = args;
						this.tryPlay();
					}
				});

			this._$scope.$on('stopPlayingCircuit',
				(): void => {
					console.log('$scope.$on.stopPlayingCircuit');
					if (this.stopping) {
						return;
					}

					if (this.buffering || this.streamingAudio) {
						this._queuedCircuit = null;
						this.tryStop();
					}
				});

			this._$scope.$on('changeSelectedCircuit',
				(event, args: LiveCircuitEntry | null): void => {
					if (CommonHelper.isDefined(args)) {
						if (!this.circuitInfoDisplay) {
							this.circuitInfoDisplay = {};
						}

						this.circuitInfoDisplay.calledNumber = 'N/A';
						this.circuitInfoDisplay.startTime = 'N/A';
						this.circuitInfoDisplay.endTime = 'N/A';

						this.circuitInfoDisplay.facilityName = args.facilityName;
						this.circuitInfoDisplay.circuitDescription = FormatHelper.getCircuitDisplay(args.description, args.ani);

						if (CommonHelper.isDefined(args.call)) {
							this.circuitInfoDisplay.inmate = FormatHelper.getInmateDisplay(args.call.inmateName, args.call.pin);

							if (CommonHelper.isDefinedNotWhitespace(args.call.calledNumber)) {
								this.circuitInfoDisplay.calledNumber = angular.copy(args.call.calledNumber);
							}

							if (CommonHelper.isDefinedNotWhitespace(args.call.startTime)) {
								this.circuitInfoDisplay.startTime = angular.copy(args.call.startTime);
							}

							if (CommonHelper.isDefinedNotWhitespace(args.call.endTime)) {
								this.circuitInfoDisplay.endTime = angular.copy(args.call.endTime);
							}
						}
					} else {
						this.circuitInfoDisplay = null;
					}
				});

			this.createAndFillCanvas();
		}

		$onChanges(changes) {
			if (changes.disposeEvent && changes.disposeEvent.currentValue && changes.disposeEvent.currentValue !== '') {
				this._$rootScope.$on(changes.disposeEvent.currentValue,
					(): void => {
						console.log('$rootScope.$on(changes.disposeEvent.currentValue)');
						this.tryStop();
					});
			}
		}

		// #region Live Streaming

		private getLiveStreamData(url: string): Promise<void> {
			console.log('getLiveStreamData()');
			this.streamingAudio = true;
			this._fetchAbortCtrl = new AbortController();
			this._fetchAbortSignal = this._fetchAbortCtrl.signal;

			// Handle manual fetch aborted because sometimes the call to
			// this._fetchAbortSignal.abort() doesn't fire the 2nd callback
			// function that is defined in the reader.read() call below.
			this._fetchAborted = false;
			this._fetchAbortSignal.addEventListener('abort',
				() => {
					console.log('abort event fired');
					this._fetchAborted = true;
				});

			return fetch(url, { method: 'GET', signal: this._fetchAbortSignal })
				.then((response: Response) => {
					if (!response.ok) {
						console.log('fetch response not ok');
						this._logService.logError('Failed to retrieve call audio. Response returned unsuccessful', response);
						this._notifier.error('Failed to retrieve call audio.', 'Application Error');

						this.streamingAudio = false;
						throw new HttpError(response, 'GET', 'Unable to retrieve call audio', null, null);
					}

					return response;
				})
				.then((response: Response) => {
					const that = this;

					if (response.body === null) {
						console.log('response.body is null');
						this._logService.logError('Retrieve call audio returned null body.', response);
						this._notifier.error('Failed to retrieve call audio.', 'Application Error');

						this.streamingAudio = false;
						throw new HttpError(response, 'GET', 'Unable to retrieve call audio', null, null);
					}

					const reader: ReadableStreamDefaultReader<Uint8Array> = response.body.getReader();
					const read = () => {
						reader.read()
							.then(({ value, done }) => {
								if (done) {
									console.log('Fetch complete.');
									this.playableCircuitSelected = false;
									this._hasCancelled = true;

									this.buffering = false;
									this.streamingAudio = false;

									this._$timeout((): void => {
										// wait until schedule buffers is cancelled before
										// resetAudio function sets _hasCancelled to false.
										this.resetAudio();

										// Let the get live stream function return before calling 
										// the onCallEnd callback (which in some cases will start
										// trying to play a new call).
										this.onCallEnd();
									}, 500);

									return; // Fetch complete
								} else if (this._fetchAborted) {
									this.buffering = false;
									this.streamingAudio = false;
									console.log('Fetch aborted');
									return;
								} else {
									if (value && value.buffer) {
										const buffer: ArrayBuffer = value.buffer;
										const segment: AudioBufferSegment = new AudioBufferSegment;

										that._audioStack.push(segment);

										const wavChunk: ArrayBuffer = AudioHelper.prependWavHeader(buffer);
										that.audioCtx.decodeAudioData(wavChunk)
											.then((wavChunkBuffer: AudioBuffer) => {
												segment.buffer = wavChunkBuffer;

												if (that._scheduleBuffersTimeoutId === null) {
													that.scheduleBuffers();
												}
											}).catch((err: DOMException) => {
												console.log('decodeAudioData chunk fail');
												this._logService.logError('Failed to decode call audio.', err);
												this._notifier.error('Failed to play call audio.', 'Application Error');

												console.log(err);
											});
									}
								}

								// Continue reading
								read();
							}, () => {
								// fetch has been aborted
								this.buffering = false;
								this.streamingAudio = false;
								console.log('Fetch aborted');
							});
					};

					read(); // Start reading
				}).catch((err: any) => {
					if (err.toString().indexOf('The user aborted a request') === -1) {
						this._notifier.error('Failed to retrieve call audio', 'Application Error');
						console.log(`Error thrown fetching call audio: ${err}`);
					} else {
						console.log('User aborted fetch request.');
					}

					this.buffering = false;
					this.streamingAudio = false;
				});
		}

		private play(): ng.IPromise<void> {
			console.log('play()');
			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			try {
				if (this.buffering || this.streamingAudio) {
					deferred.reject('There is already audio buffering or streaming');
				} else {
					if (!CommonHelper.isDefined(this.circuitInfo)) {
						this._notifier.error('Could not find selected circuit', 'Circuit Not Found');

						this.buffering = false;
						this.playableCircuitSelected = false;
						deferred.reject('CircuitInfo is null or undefined');
					} else if (!CommonHelper.isDefined(this.circuitInfo.call)) {
						this._notifier.warning('There is no live call to listen to on this circuit!');

						this.buffering = false;
						this.playableCircuitSelected = false;
						deferred.reject('No current call to listen to on selected circuit');
					} else if (this.circuitInfo.call.callStatus === CallStatus.ON) {
						this.buffering = true;

						this.resetAudio();

						const args: MonitorRequestArgs = new MonitorRequestArgs();
						args.ani = this.circuitInfo.ani;
						args.callId = this.circuitInfo.call.callId;
						args.lineId = this.circuitInfo.call.lineId;
						args.unitId = this.circuitInfo.call.unitId;

						this.getLiveStreamData(`api/audio/live-stream?callId=${args.callId}&lineId=${args.lineId}&unitId=${args.unitId}&ani=${args.ani}`).then(
							(): void => {
								this.buffering = false;
								this.playableCircuitSelected = true;
								deferred.resolve();
							}, (err: any): void => {
								console.log('getLiveStreamData fail');
								console.log(err);

								this._notifier.error('Failed to retrieve live audio data', 'Application Error');

								this.playableCircuitSelected = false;
								this.buffering = false;
								deferred.reject(err);
							});
					} else {
						this._notifier.warning('There is no live call to listen to on this circuit!');

						this.buffering = false;
						this.playableCircuitSelected = false;
						deferred.reject('No current call to listen to on selected circuit');
					}
				}
			} catch (err) {
				this.buffering = false;
				this.playableCircuitSelected = false;

				deferred.reject(err);
			}

			return deferred.promise;
		}

		private scheduleBuffers(): void {
			if (this._hasCancelled) {
				console.log('_hasCancelled true');
				this._scheduleBuffersTimeoutId = null;
				return;
			}

			while (
				this._audioStack.length > 0 &&
				this._audioStack[0].buffer !== undefined &&
				this._nextTime < this.audioCtx.currentTime + 5
			) {
				const currentTime: number = this.audioCtx.currentTime;

				const currentSource: AudioBufferSourceNode = this.audioCtx.createBufferSource();

				// Remove & get first buffer segment from audio stack
				let currentSegment: AudioBufferSegment | undefined = this._audioStack.shift();

				if (CommonHelper.isNullOrUndef(currentSegment)) {
					// Pretty sure this is caught and user is notified by calling function... not 100% sure though.
					//this._notifier.error('Unable to play the selected call audio', 'Application Error');
					throw new Error('Unable to decode audio');
				}

				currentSegment = currentSegment as AudioBufferSegment;

				// Give source node current segment to play
				currentSource.buffer = AudioHelper.padBuffer(currentSegment.buffer);

				currentSource.connect(this._gainNode);
				this._gainNode.connect(this._analyser);
				this._analyser.connect(this.audioCtx.destination); // Connect current source node to client listening device

				this.visualize();

				let duration: number = currentSource.buffer!.duration;
				let offset: number = 0;

				if (currentTime > this._nextTime) {
					this.buffering = true;

					offset = currentTime - this._nextTime;
					this._nextTime = currentTime + 5;
					duration = duration - offset;

					// Buffer for 5 seconds, then continue playback.
					this._$timeout(() => {
						this.buffering = false;
					},
						5000);
				}

				currentSource.start(this._nextTime, offset);
				currentSource.stop(this._nextTime + duration);

				// Make the next buffer wait the length of the last buffer before being played
				this._nextTime += duration;
			}

			this._scheduleBuffersTimeoutId = this._$timeout(() => this.scheduleBuffers(), 300);
		}

		public tryPlay(): void {
			console.log('tryPlay()');
			if (this.loadingPlay) {
				console.log('loadingPlay is true');
				return;
			}

			this.loadingPlay = true;

			this.play().then(
				(): void => {
					this.loadingPlay = false;
					this._notifier.success('Playing call audio', `Circuit ${this.circuitInfo!.description}`);
				},
				(err): void => {
					console.log('this.play() fail');
					console.log(err);
					this.loadingPlay = false;

					this._notifier.warning(`Failed to play call audio`, `Circuit ${this.circuitInfo!.description}`);
					this.tryStop();
				});
		}

		public tryPlayQueuedCircuit(): void {
			console.log('tryPlayQueuedCircuit()');
			if (this._queuedCircuit !== null) {
				console.log('playing queued circuit');
				this.circuitInfo = angular.copy(this._queuedCircuit);
				this._queuedCircuit = null;
				this.tryPlay();
			} else {
				console.log('no queued circuit to play');
			}
		}

		// #endregion Live Streaming

		// #region Stream Disposal

		private abortFetch(): ng.IPromise<void> {
			console.log('abortFetch()');
			this.abortingFetch = true;

			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			if (this._fetchAbortCtrl === null || this._fetchAbortCtrl === undefined) {
				console.log('abortFetch: There is no live call to stop!');

				this.abortingFetch = false;
				deferred.reject('abortFetch: There is no live call to stop!');
			} else {
				this._fetchAbortCtrl.abort();
				console.log('fetch abort invoked.');

				this.abortingFetch = false;
				deferred.resolve();
			}

			return deferred.promise;
		}

		private closeAudioContext(): ng.IPromise<void> {
			console.log('closeAudioContext()');
			this.closingAudioContext = true;

			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			if (this.audioCtx && this.audioCtx.state !== "closed") {
				this.audioCtx.close()
					.then((): void => {
						this.closingAudioContext = false;
						deferred.resolve();
					}, (err: any): void => {
						console.log('this.audioCtx.close() fail');
						console.log('closeAudioContext: Failed to close audio context:');
						console.log(err);

						this.closingAudioContext = false;
						deferred.reject(err);
					});
			} else {
				this.closingAudioContext = false;
				deferred.resolve();
			}

			return deferred.promise;
		}

		private endStream(): ng.IPromise<void> {
			console.log('endStream()');
			this.endingStream = true;

			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			// Tell Mailman to stop sending data
			if (this.circuitInfo !== null && this.circuitInfo !== undefined) {
				// Tell server to stop sending data
				this._audioService.stopLiveStream().then(
					(): void => {
						this.endingStream = false;
						deferred.resolve();
					}, (err: any): void => {
						console.log(err);
						this._logService.logError('endStream: Failed to stop live call audio stream.', err);

						this.endingStream = false;
						deferred.reject(err);
					});
			} else {
				console.log('Current call invalid');

				this.endingStream = false;
				deferred.reject('Current call invalid');
			}

			return deferred.promise;
		}

		private resetAudio(): void {
			console.log('resetAudio()');
			this._nextTime = 0;
			this._audioStack = [];
			this._hasCancelled = false;
			this._scheduleBuffersTimeoutId = null;

			this.closeAudioContext();
			this.audioCtx = new AudioContext();

			this._gainNode = this.audioCtx.createGain();
			this.setVolume(this.volume);

			this._analyser = this.audioCtx.createAnalyser();
		}

		private stop(): ng.IPromise<void> {
			console.log('stop()');
			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			this._hasCancelled = true;

			const p1: ng.IPromise<void> = this.abortFetch();
			const p2: ng.IPromise<void> = this.closeAudioContext();
			const p3: ng.IPromise<void> = this.endStream();

			// Reset canvas to blank.
			this.createAndFillCanvas();

			this._$q.all([p1, p2, p3]).then(
				(): void => {
					this.streamingAudio = false;
					this.buffering = false;
					this.closingAudioContext = false;
					this.endingStream = false;
					this._hasCancelled = false;

					// Sometimes visualize function runs while closing.
					// Re-clear the canvas in case that happens
					this.createAndFillCanvas();

					deferred.resolve();
				}, (err): void => {
					console.log('stop promises fail');
					this.streamingAudio = false;
					this.buffering = false;
					this.closingAudioContext = false;
					this.endingStream = false;
					this._hasCancelled = false;

					// Sometimes visualize function runs while closing.
					// Re-clear the canvas in case that happens
					this.createAndFillCanvas();

					deferred.reject(err);
				});

			return deferred.promise;
		}

		public tryStop(): ng.IPromise<void> {
			console.log('tryStop()');
			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			if (this.stopping) {
				deferred.resolve();
			}

			this.stopping = true;

			this.stop().then(
				(): void => {
					this.stopping = false;

					if (this._queuedCircuit !== null) {
						this.tryPlayQueuedCircuit();
					}

					deferred.resolve();
				},
				(err): void => {
					console.log('Failed to stop audio stream:');
					console.log(err);
					this.stopping = false;

					if (this._queuedCircuit !== null) {
						this.tryPlayQueuedCircuit();
					}

					deferred.reject(err);
				});

			return deferred.promise;
		}

		// #endregion Stream Disposal

		// #region Audio Canvas

		private createAndFillCanvas(): void {
			this._$timeout((): void => {
				const audioEle = document.querySelector('.audio-section');
				if (CommonHelper.isDefined(audioEle)) {
					const intendedWidth: number = audioEle.clientWidth;
					this._canvas.setAttribute('width', intendedWidth.toString());

					if (CommonHelper.isDefined(this._canvasCtx)) {
						this._canvasCtx.clearRect(0, 0, intendedWidth, this._canvas.height);
						this._canvasCtx.fillRect(0, 0, intendedWidth, this._canvas.height);
					}
				}
			});
		}

		private visualize(): void {
			if (this.buffering || this._drawingVisual) {
				return;
			}

			this._drawingVisual = true;

			const width: number = parseInt($('#audioCanvas').attr('width'));
			const height: number = parseInt($('#audioCanvas').css('height'));

			let bufferLen: number;
			let dataArr: Uint8Array;

			if (this._visualType === 'sine') {
				this._analyser.fftSize = 512;
				bufferLen = this._analyser.fftSize;
				dataArr = new Uint8Array(bufferLen);

				if (this._canvasCtx === null) {
					this._drawingVisual = false;
					return;
				}

				this._canvasCtx.clearRect(0, 0, width, height);

				var drawSine = () => {
					if (this._hasCancelled || !this.streamingAudio) {
						return;
					}

					if (this._canvasCtx === null) {
						this._drawingVisual = false;
						return;
					}

					this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
					this._canvasCtx.fillRect(0, 0, width, height);

					if (!this.buffering) {
						requestAnimationFrame(drawSine);
						this._analyser.getByteTimeDomainData(dataArr);

						this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
						this._canvasCtx.fillRect(0, 0, width, height);

						this._canvasCtx.lineWidth = 2;
						this._canvasCtx.strokeStyle = '#18d501';

						this._canvasCtx.beginPath();

						const sliceWidth: number = width * 1.0 / bufferLen;
						let x: number = 0;

						for (let i = 0; i < bufferLen; i++) {
							const v: number = dataArr[i] / 128.0;
							const y: number = v * height / 2;

							if (i === 0) {
								this._canvasCtx.moveTo(x, y);
							} else {
								this._canvasCtx.lineTo(x, y);
							}

							x += sliceWidth;
						}

						this._canvasCtx.lineTo(width, height / 2);
						this._canvasCtx.stroke();
					}
				};

				drawSine();
			} else if (this._visualType === 'bars') {
				this._analyser.fftSize = 128;
				bufferLen = this._analyser.frequencyBinCount;
				dataArr = new Uint8Array(bufferLen);

				if (this._canvasCtx === null) {
					this._drawingVisual = false;
					return;
				}

				this._canvasCtx.clearRect(0, 0, width, height);

				var drawBars = (): void => {
					if (this._canvasCtx === null) {
						this._drawingVisual = false;
						return;
					}

					this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
					this._canvasCtx.fillRect(0, 0, width, height);

					if (!this.buffering) {
						requestAnimationFrame(drawBars);
						this._analyser.getByteFrequencyData(dataArr);

						this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
						this._canvasCtx.fillRect(0, 0, width, height);

						const barWidth: number = (width / bufferLen) * 2.5;
						let barHeight: number;
						let x: number = 0;

						for (let i = 0; i < bufferLen; i++) {
							barHeight = dataArr[i] / 2;

							this._canvasCtx.fillStyle = `rgb(${barHeight / 2},254,${barHeight / 2})`;
							this._canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

							x += barWidth + 1;
						}
					}
				};

				drawBars();
			}

			this._drawingVisual = false;
		}

		// #endregion Audio Canvas

		// #region Volume

		public muteUnmute(): void {
			if (this.volume === 0) {
				this.unmute();
			} else {
				this.mute(this.volume);
			}
		}

		private mute(prevAudioVol: number): void {
			// Save volume before muting
			this._$timeout((): void => {
				this._volBeforeMute = prevAudioVol;
				this.volume = 0;

				if (this._gainNode !== undefined) {
					this._gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
				}
			}, 1); // Probably don't need timeout?
		}

		public onVolumeChange(): void {
			this.setVolume(this.volume);
		}

		private setVolume(vol: number): void {
			// Check if the user has used the slider to change the volume to zero.
			if (vol === 0) {
				// Send a previous volume value of 50 as default.
				// This way, if the user clicks unmute after using the slider
				// to change the volume to zero, the volume should go back to 50.
				this.mute(50);
			} else if (this._gainNode) {
				this._gainNode.gain.setValueAtTime(vol / 100, this.audioCtx.currentTime);
			}
		}

		private unmute(): void {
			if (this._volBeforeMute === 0) {
				this.volume = 50;

				if (this._gainNode) {
					this._gainNode.gain.setValueAtTime(this._defGainVal, this.audioCtx.currentTime);
				}
			} else {
				this.volume = this._volBeforeMute;

				if (this._gainNode) {
					this._gainNode.gain.setValueAtTime(this._volBeforeMute / 100, this.audioCtx.currentTime);
				}
			}
		}

		// #endregion Volume
	}

	class AudioBufferSegment {
		buffer: AudioBuffer;
	}

	angular
		.module('LiveMonitor.Widgets')
		.component('circuitAudio', new CircuitAudioComponent());
}
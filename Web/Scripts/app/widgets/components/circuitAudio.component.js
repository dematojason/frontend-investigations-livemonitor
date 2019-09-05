var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        var CircuitAudioComponent = /** @class */ (function () {
            function CircuitAudioComponent() {
                this.bindings = {
                    disposeEvent: '@',
                    onCallEnd: '&',
                    showFacility: '<'
                };
                this.controller = CircuitAudioController;
                this.controllerAs = 'vm';
                this.templateUrl = 'Templates/components/circuitaudio.html';
            }
            return CircuitAudioComponent;
        }());
        var CircuitAudioController = /** @class */ (function () {
            function CircuitAudioController(_audioService, _logService, _notifier, _$q, _$rootScope, _$scope, _$timeout, _$window) {
                this._audioService = _audioService;
                this._logService = _logService;
                this._notifier = _notifier;
                this._$q = _$q;
                this._$rootScope = _$rootScope;
                this._$scope = _$scope;
                this._$timeout = _$timeout;
                this._$window = _$window;
                this._drawingVisual = false;
                console.log('circuitAudio.component constructor');
                this.disposeEvent = '';
                this.circuitInfo = new LiveMonitor.LiveCircuitEntry();
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
                this._canvas = document.getElementById('audioCanvas');
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
            CircuitAudioController.prototype.$onInit = function () {
                var _this = this;
                console.log('$onInit()');
                this._$window.onbeforeunload = function () {
                    console.log('$window.onbeforeunload');
                    if (_this.buffering || _this.streamingAudio) {
                        _this.tryStop().then(function () {
                            // Yay. Now keep going.
                        }, function (err) {
                            console.log(err);
                            // Not much we can do here.. User is trying to leave the page, so let them.
                        });
                    }
                };
                this._$scope.$on('playCircuitAudio', function (event, args) {
                    console.log('$scope.$on.playCircuitAudio');
                    if (args === null || args === undefined) {
                        _this._notifier.warning('Invalid circuit selected!');
                    }
                    else if (_this.stopping) {
                        // Queue the circuit to be played once the dispose process 
                        // from the previous play request is finished.
                        _this._queuedCircuit = angular.copy(args);
                        console.log('Queued circuit');
                    }
                    else if (_this.buffering || _this.streamingAudio) {
                        if (LiveMonitor.CommonHelper.isDefined(_this.circuitInfo) && LiveMonitor.CommonHelper.isDefined(_this.circuitInfo.call)) {
                            if (LiveMonitor.CircuitHelper.isCallMatch(_this.circuitInfo, args)) {
                                console.log('Same call that is already playing; don\'t do anything');
                                // Same call that is already playing; don't do anything.
                                return;
                            }
                        }
                        console.log('trying stop...');
                        _this.tryStop().then(function () {
                            console.log('playCircuitAudio tryStop() success');
                            _this.circuitInfo = args;
                            _this.tryPlay();
                        }, function (err) {
                            console.log('playCircuitAudio tryStop() fail');
                            console.log(err);
                        });
                    }
                    else {
                        console.log('trying play...');
                        _this.circuitInfo = args;
                        _this.tryPlay();
                    }
                });
                this._$scope.$on('changePlayingCircuit', function (event, args) {
                    console.log('$scope.$on.changePlayingCircuit');
                    if (args === null || args === undefined) {
                        console.log('args is null or undefined');
                        _this._notifier.warning('Invalid circuit selected!');
                    }
                    else if (_this.stopping) {
                        // Queue the circuit to be played once the dispose process 
                        // from the previous play request is finished.
                        _this._queuedCircuit = angular.copy(args);
                        console.log('Queued circuit');
                    }
                    else if (_this.buffering || _this.streamingAudio) {
                        _this.tryStop().then(function () {
                            _this.circuitInfo = args;
                            _this.tryPlay();
                        }, function (err) {
                            console.log(err);
                        });
                    }
                    else {
                        _this.circuitInfo = args;
                        _this.tryPlay();
                    }
                });
                this._$scope.$on('stopPlayingCircuit', function () {
                    console.log('$scope.$on.stopPlayingCircuit');
                    if (_this.stopping) {
                        return;
                    }
                    if (_this.buffering || _this.streamingAudio) {
                        _this._queuedCircuit = null;
                        _this.tryStop();
                    }
                });
                this._$scope.$on('changeSelectedCircuit', function (event, args) {
                    if (LiveMonitor.CommonHelper.isDefined(args)) {
                        if (!_this.circuitInfoDisplay) {
                            _this.circuitInfoDisplay = {};
                        }
                        _this.circuitInfoDisplay.calledNumber = 'N/A';
                        _this.circuitInfoDisplay.startTime = 'N/A';
                        _this.circuitInfoDisplay.endTime = 'N/A';
                        _this.circuitInfoDisplay.facilityName = args.facilityName;
                        _this.circuitInfoDisplay.circuitDescription = LiveMonitor.FormatHelper.getCircuitDisplay(args.description, args.ani);
                        if (LiveMonitor.CommonHelper.isDefined(args.call)) {
                            _this.circuitInfoDisplay.inmate = LiveMonitor.FormatHelper.getInmateDisplay(args.call.inmateName, args.call.pin);
                            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(args.call.calledNumber)) {
                                _this.circuitInfoDisplay.calledNumber = angular.copy(args.call.calledNumber);
                            }
                            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(args.call.startTime)) {
                                _this.circuitInfoDisplay.startTime = angular.copy(args.call.startTime);
                            }
                            if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(args.call.endTime)) {
                                _this.circuitInfoDisplay.endTime = angular.copy(args.call.endTime);
                            }
                        }
                    }
                    else {
                        _this.circuitInfoDisplay = null;
                    }
                });
                this.createAndFillCanvas();
            };
            CircuitAudioController.prototype.$onChanges = function (changes) {
                var _this = this;
                if (changes.disposeEvent && changes.disposeEvent.currentValue && changes.disposeEvent.currentValue !== '') {
                    this._$rootScope.$on(changes.disposeEvent.currentValue, function () {
                        console.log('$rootScope.$on(changes.disposeEvent.currentValue)');
                        _this.tryStop();
                    });
                }
            };
            // #region Live Streaming
            CircuitAudioController.prototype.getLiveStreamData = function (url) {
                var _this = this;
                console.log('getLiveStreamData()');
                this.streamingAudio = true;
                this._fetchAbortCtrl = new AbortController();
                this._fetchAbortSignal = this._fetchAbortCtrl.signal;
                // Handle manual fetch aborted because sometimes the call to
                // this._fetchAbortSignal.abort() doesn't fire the 2nd callback
                // function that is defined in the reader.read() call below.
                this._fetchAborted = false;
                this._fetchAbortSignal.addEventListener('abort', function () {
                    console.log('abort event fired');
                    _this._fetchAborted = true;
                });
                return fetch(url, { method: 'GET', signal: this._fetchAbortSignal })
                    .then(function (response) {
                    if (!response.ok) {
                        console.log('fetch response not ok');
                        _this._logService.logError('Failed to retrieve call audio. Response returned unsuccessful', response);
                        _this._notifier.error('Failed to retrieve call audio.', 'Application Error');
                        _this.streamingAudio = false;
                        throw new LiveMonitor.HttpError(response, 'GET', 'Unable to retrieve call audio', null, null);
                    }
                    return response;
                })
                    .then(function (response) {
                    var that = _this;
                    if (response.body === null) {
                        console.log('response.body is null');
                        _this._logService.logError('Retrieve call audio returned null body.', response);
                        _this._notifier.error('Failed to retrieve call audio.', 'Application Error');
                        _this.streamingAudio = false;
                        throw new LiveMonitor.HttpError(response, 'GET', 'Unable to retrieve call audio', null, null);
                    }
                    var reader = response.body.getReader();
                    var read = function () {
                        reader.read()
                            .then(function (_a) {
                            var value = _a.value, done = _a.done;
                            if (done) {
                                console.log('Fetch complete.');
                                _this.playableCircuitSelected = false;
                                _this._hasCancelled = true;
                                _this.buffering = false;
                                _this.streamingAudio = false;
                                _this._$timeout(function () {
                                    // wait until schedule buffers is cancelled before
                                    // resetAudio function sets _hasCancelled to false.
                                    _this.resetAudio();
                                    // Let the get live stream function return before calling 
                                    // the onCallEnd callback (which in some cases will start
                                    // trying to play a new call).
                                    _this.onCallEnd();
                                }, 500);
                                return; // Fetch complete
                            }
                            else if (_this._fetchAborted) {
                                _this.buffering = false;
                                _this.streamingAudio = false;
                                console.log('Fetch aborted');
                                return;
                            }
                            else {
                                if (value && value.buffer) {
                                    var buffer = value.buffer;
                                    var segment_1 = new AudioBufferSegment;
                                    that._audioStack.push(segment_1);
                                    var wavChunk = LiveMonitor.AudioHelper.prependWavHeader(buffer);
                                    that.audioCtx.decodeAudioData(wavChunk)
                                        .then(function (wavChunkBuffer) {
                                        segment_1.buffer = wavChunkBuffer;
                                        if (that._scheduleBuffersTimeoutId === null) {
                                            that.scheduleBuffers();
                                        }
                                    }).catch(function (err) {
                                        console.log('decodeAudioData chunk fail');
                                        _this._logService.logError('Failed to decode call audio.', err);
                                        _this._notifier.error('Failed to play call audio.', 'Application Error');
                                        console.log(err);
                                    });
                                }
                            }
                            // Continue reading
                            read();
                        }, function () {
                            // fetch has been aborted
                            _this.buffering = false;
                            _this.streamingAudio = false;
                            console.log('Fetch aborted');
                        });
                    };
                    read(); // Start reading
                }).catch(function (err) {
                    if (err.toString().indexOf('The user aborted a request') === -1) {
                        _this._notifier.error('Failed to retrieve call audio', 'Application Error');
                        console.log("Error thrown fetching call audio: " + err);
                    }
                    else {
                        console.log('User aborted fetch request.');
                    }
                    _this.buffering = false;
                    _this.streamingAudio = false;
                });
            };
            CircuitAudioController.prototype.play = function () {
                var _this = this;
                console.log('play()');
                var deferred = this._$q.defer();
                try {
                    if (this.buffering || this.streamingAudio) {
                        deferred.reject('There is already audio buffering or streaming');
                    }
                    else {
                        if (!LiveMonitor.CommonHelper.isDefined(this.circuitInfo)) {
                            this._notifier.error('Could not find selected circuit', 'Circuit Not Found');
                            this.buffering = false;
                            this.playableCircuitSelected = false;
                            deferred.reject('CircuitInfo is null or undefined');
                        }
                        else if (!LiveMonitor.CommonHelper.isDefined(this.circuitInfo.call)) {
                            this._notifier.warning('There is no live call to listen to on this circuit!');
                            this.buffering = false;
                            this.playableCircuitSelected = false;
                            deferred.reject('No current call to listen to on selected circuit');
                        }
                        else if (this.circuitInfo.call.callStatus === LiveMonitor.CallStatus.ON) {
                            this.buffering = true;
                            this.resetAudio();
                            var args = new LiveMonitor.MonitorRequestArgs();
                            args.ani = this.circuitInfo.ani;
                            args.callId = this.circuitInfo.call.callId;
                            args.lineId = this.circuitInfo.call.lineId;
                            args.unitId = this.circuitInfo.call.unitId;
                            this.getLiveStreamData("api/audio/live-stream?callId=" + args.callId + "&lineId=" + args.lineId + "&unitId=" + args.unitId + "&ani=" + args.ani).then(function () {
                                _this.buffering = false;
                                _this.playableCircuitSelected = true;
                                deferred.resolve();
                            }, function (err) {
                                console.log('getLiveStreamData fail');
                                console.log(err);
                                _this._notifier.error('Failed to retrieve live audio data', 'Application Error');
                                _this.playableCircuitSelected = false;
                                _this.buffering = false;
                                deferred.reject(err);
                            });
                        }
                        else {
                            this._notifier.warning('There is no live call to listen to on this circuit!');
                            this.buffering = false;
                            this.playableCircuitSelected = false;
                            deferred.reject('No current call to listen to on selected circuit');
                        }
                    }
                }
                catch (err) {
                    this.buffering = false;
                    this.playableCircuitSelected = false;
                    deferred.reject(err);
                }
                return deferred.promise;
            };
            CircuitAudioController.prototype.scheduleBuffers = function () {
                var _this = this;
                if (this._hasCancelled) {
                    console.log('_hasCancelled true');
                    this._scheduleBuffersTimeoutId = null;
                    return;
                }
                while (this._audioStack.length > 0 &&
                    this._audioStack[0].buffer !== undefined &&
                    this._nextTime < this.audioCtx.currentTime + 5) {
                    var currentTime = this.audioCtx.currentTime;
                    var currentSource = this.audioCtx.createBufferSource();
                    // Remove & get first buffer segment from audio stack
                    var currentSegment = this._audioStack.shift();
                    if (LiveMonitor.CommonHelper.isNullOrUndef(currentSegment)) {
                        // Pretty sure this is caught and user is notified by calling function... not 100% sure though.
                        //this._notifier.error('Unable to play the selected call audio', 'Application Error');
                        throw new Error('Unable to decode audio');
                    }
                    currentSegment = currentSegment;
                    // Give source node current segment to play
                    currentSource.buffer = LiveMonitor.AudioHelper.padBuffer(currentSegment.buffer);
                    currentSource.connect(this._gainNode);
                    this._gainNode.connect(this._analyser);
                    this._analyser.connect(this.audioCtx.destination); // Connect current source node to client listening device
                    this.visualize();
                    var duration = currentSource.buffer.duration;
                    var offset = 0;
                    if (currentTime > this._nextTime) {
                        this.buffering = true;
                        offset = currentTime - this._nextTime;
                        this._nextTime = currentTime + 5;
                        duration = duration - offset;
                        // Buffer for 5 seconds, then continue playback.
                        this._$timeout(function () {
                            _this.buffering = false;
                        }, 5000);
                    }
                    currentSource.start(this._nextTime, offset);
                    currentSource.stop(this._nextTime + duration);
                    // Make the next buffer wait the length of the last buffer before being played
                    this._nextTime += duration;
                }
                this._scheduleBuffersTimeoutId = this._$timeout(function () { return _this.scheduleBuffers(); }, 300);
            };
            CircuitAudioController.prototype.tryPlay = function () {
                var _this = this;
                console.log('tryPlay()');
                if (this.loadingPlay) {
                    console.log('loadingPlay is true');
                    return;
                }
                this.loadingPlay = true;
                this.play().then(function () {
                    _this.loadingPlay = false;
                    _this._notifier.success('Playing call audio', "Circuit " + _this.circuitInfo.description);
                }, function (err) {
                    console.log('this.play() fail');
                    console.log(err);
                    _this.loadingPlay = false;
                    _this._notifier.warning("Failed to play call audio", "Circuit " + _this.circuitInfo.description);
                    _this.tryStop();
                });
            };
            CircuitAudioController.prototype.tryPlayQueuedCircuit = function () {
                console.log('tryPlayQueuedCircuit()');
                if (this._queuedCircuit !== null) {
                    console.log('playing queued circuit');
                    this.circuitInfo = angular.copy(this._queuedCircuit);
                    this._queuedCircuit = null;
                    this.tryPlay();
                }
                else {
                    console.log('no queued circuit to play');
                }
            };
            // #endregion Live Streaming
            // #region Stream Disposal
            CircuitAudioController.prototype.abortFetch = function () {
                console.log('abortFetch()');
                this.abortingFetch = true;
                var deferred = this._$q.defer();
                if (this._fetchAbortCtrl === null || this._fetchAbortCtrl === undefined) {
                    console.log('abortFetch: There is no live call to stop!');
                    this.abortingFetch = false;
                    deferred.reject('abortFetch: There is no live call to stop!');
                }
                else {
                    this._fetchAbortCtrl.abort();
                    console.log('fetch abort invoked.');
                    this.abortingFetch = false;
                    deferred.resolve();
                }
                return deferred.promise;
            };
            CircuitAudioController.prototype.closeAudioContext = function () {
                var _this = this;
                console.log('closeAudioContext()');
                this.closingAudioContext = true;
                var deferred = this._$q.defer();
                if (this.audioCtx && this.audioCtx.state !== "closed") {
                    this.audioCtx.close()
                        .then(function () {
                        _this.closingAudioContext = false;
                        deferred.resolve();
                    }, function (err) {
                        console.log('this.audioCtx.close() fail');
                        console.log('closeAudioContext: Failed to close audio context:');
                        console.log(err);
                        _this.closingAudioContext = false;
                        deferred.reject(err);
                    });
                }
                else {
                    this.closingAudioContext = false;
                    deferred.resolve();
                }
                return deferred.promise;
            };
            CircuitAudioController.prototype.endStream = function () {
                var _this = this;
                console.log('endStream()');
                this.endingStream = true;
                var deferred = this._$q.defer();
                // Tell Mailman to stop sending data
                if (this.circuitInfo !== null && this.circuitInfo !== undefined) {
                    // Tell server to stop sending data
                    this._audioService.stopLiveStream().then(function () {
                        _this.endingStream = false;
                        deferred.resolve();
                    }, function (err) {
                        console.log(err);
                        _this._logService.logError('endStream: Failed to stop live call audio stream.', err);
                        _this.endingStream = false;
                        deferred.reject(err);
                    });
                }
                else {
                    console.log('Current call invalid');
                    this.endingStream = false;
                    deferred.reject('Current call invalid');
                }
                return deferred.promise;
            };
            CircuitAudioController.prototype.resetAudio = function () {
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
            };
            CircuitAudioController.prototype.stop = function () {
                var _this = this;
                console.log('stop()');
                var deferred = this._$q.defer();
                this._hasCancelled = true;
                var p1 = this.abortFetch();
                var p2 = this.closeAudioContext();
                var p3 = this.endStream();
                // Reset canvas to blank.
                this.createAndFillCanvas();
                this._$q.all([p1, p2, p3]).then(function () {
                    _this.streamingAudio = false;
                    _this.buffering = false;
                    _this.closingAudioContext = false;
                    _this.endingStream = false;
                    _this._hasCancelled = false;
                    // Sometimes visualize function runs while closing.
                    // Re-clear the canvas in case that happens
                    _this.createAndFillCanvas();
                    deferred.resolve();
                }, function (err) {
                    console.log('stop promises fail');
                    _this.streamingAudio = false;
                    _this.buffering = false;
                    _this.closingAudioContext = false;
                    _this.endingStream = false;
                    _this._hasCancelled = false;
                    // Sometimes visualize function runs while closing.
                    // Re-clear the canvas in case that happens
                    _this.createAndFillCanvas();
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            CircuitAudioController.prototype.tryStop = function () {
                var _this = this;
                console.log('tryStop()');
                var deferred = this._$q.defer();
                if (this.stopping) {
                    deferred.resolve();
                }
                this.stopping = true;
                this.stop().then(function () {
                    _this.stopping = false;
                    if (_this._queuedCircuit !== null) {
                        _this.tryPlayQueuedCircuit();
                    }
                    deferred.resolve();
                }, function (err) {
                    console.log('Failed to stop audio stream:');
                    console.log(err);
                    _this.stopping = false;
                    if (_this._queuedCircuit !== null) {
                        _this.tryPlayQueuedCircuit();
                    }
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            // #endregion Stream Disposal
            // #region Audio Canvas
            CircuitAudioController.prototype.createAndFillCanvas = function () {
                var _this = this;
                this._$timeout(function () {
                    var audioEle = document.querySelector('.audio-section');
                    if (LiveMonitor.CommonHelper.isDefined(audioEle)) {
                        var intendedWidth = audioEle.clientWidth;
                        _this._canvas.setAttribute('width', intendedWidth.toString());
                        if (LiveMonitor.CommonHelper.isDefined(_this._canvasCtx)) {
                            _this._canvasCtx.clearRect(0, 0, intendedWidth, _this._canvas.height);
                            _this._canvasCtx.fillRect(0, 0, intendedWidth, _this._canvas.height);
                        }
                    }
                });
            };
            CircuitAudioController.prototype.visualize = function () {
                var _this = this;
                if (this.buffering || this._drawingVisual) {
                    return;
                }
                this._drawingVisual = true;
                var width = parseInt($('#audioCanvas').attr('width'));
                var height = parseInt($('#audioCanvas').css('height'));
                var bufferLen;
                var dataArr;
                if (this._visualType === 'sine') {
                    this._analyser.fftSize = 512;
                    bufferLen = this._analyser.fftSize;
                    dataArr = new Uint8Array(bufferLen);
                    if (this._canvasCtx === null) {
                        this._drawingVisual = false;
                        return;
                    }
                    this._canvasCtx.clearRect(0, 0, width, height);
                    var drawSine = function () {
                        if (_this._hasCancelled || !_this.streamingAudio) {
                            return;
                        }
                        if (_this._canvasCtx === null) {
                            _this._drawingVisual = false;
                            return;
                        }
                        _this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                        _this._canvasCtx.fillRect(0, 0, width, height);
                        if (!_this.buffering) {
                            requestAnimationFrame(drawSine);
                            _this._analyser.getByteTimeDomainData(dataArr);
                            _this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                            _this._canvasCtx.fillRect(0, 0, width, height);
                            _this._canvasCtx.lineWidth = 2;
                            _this._canvasCtx.strokeStyle = '#18d501';
                            _this._canvasCtx.beginPath();
                            var sliceWidth = width * 1.0 / bufferLen;
                            var x = 0;
                            for (var i = 0; i < bufferLen; i++) {
                                var v = dataArr[i] / 128.0;
                                var y = v * height / 2;
                                if (i === 0) {
                                    _this._canvasCtx.moveTo(x, y);
                                }
                                else {
                                    _this._canvasCtx.lineTo(x, y);
                                }
                                x += sliceWidth;
                            }
                            _this._canvasCtx.lineTo(width, height / 2);
                            _this._canvasCtx.stroke();
                        }
                    };
                    drawSine();
                }
                else if (this._visualType === 'bars') {
                    this._analyser.fftSize = 128;
                    bufferLen = this._analyser.frequencyBinCount;
                    dataArr = new Uint8Array(bufferLen);
                    if (this._canvasCtx === null) {
                        this._drawingVisual = false;
                        return;
                    }
                    this._canvasCtx.clearRect(0, 0, width, height);
                    var drawBars = function () {
                        if (_this._canvasCtx === null) {
                            _this._drawingVisual = false;
                            return;
                        }
                        _this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                        _this._canvasCtx.fillRect(0, 0, width, height);
                        if (!_this.buffering) {
                            requestAnimationFrame(drawBars);
                            _this._analyser.getByteFrequencyData(dataArr);
                            _this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                            _this._canvasCtx.fillRect(0, 0, width, height);
                            var barWidth = (width / bufferLen) * 2.5;
                            var barHeight = void 0;
                            var x = 0;
                            for (var i = 0; i < bufferLen; i++) {
                                barHeight = dataArr[i] / 2;
                                _this._canvasCtx.fillStyle = "rgb(" + barHeight / 2 + ",254," + barHeight / 2 + ")";
                                _this._canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
                                x += barWidth + 1;
                            }
                        }
                    };
                    drawBars();
                }
                this._drawingVisual = false;
            };
            // #endregion Audio Canvas
            // #region Volume
            CircuitAudioController.prototype.muteUnmute = function () {
                if (this.volume === 0) {
                    this.unmute();
                }
                else {
                    this.mute(this.volume);
                }
            };
            CircuitAudioController.prototype.mute = function (prevAudioVol) {
                var _this = this;
                // Save volume before muting
                this._$timeout(function () {
                    _this._volBeforeMute = prevAudioVol;
                    _this.volume = 0;
                    if (_this._gainNode !== undefined) {
                        _this._gainNode.gain.setValueAtTime(0, _this.audioCtx.currentTime);
                    }
                }, 1); // Probably don't need timeout?
            };
            CircuitAudioController.prototype.onVolumeChange = function () {
                this.setVolume(this.volume);
            };
            CircuitAudioController.prototype.setVolume = function (vol) {
                // Check if the user has used the slider to change the volume to zero.
                if (vol === 0) {
                    // Send a previous volume value of 50 as default.
                    // This way, if the user clicks unmute after using the slider
                    // to change the volume to zero, the volume should go back to 50.
                    this.mute(50);
                }
                else if (this._gainNode) {
                    this._gainNode.gain.setValueAtTime(vol / 100, this.audioCtx.currentTime);
                }
            };
            CircuitAudioController.prototype.unmute = function () {
                if (this._volBeforeMute === 0) {
                    this.volume = 50;
                    if (this._gainNode) {
                        this._gainNode.gain.setValueAtTime(this._defGainVal, this.audioCtx.currentTime);
                    }
                }
                else {
                    this.volume = this._volBeforeMute;
                    if (this._gainNode) {
                        this._gainNode.gain.setValueAtTime(this._volBeforeMute / 100, this.audioCtx.currentTime);
                    }
                }
            };
            // #endregion Class Variables
            CircuitAudioController.$inject = [
                'LiveMonitor.Services.AudioService',
                'LiveMonitor.Services.LogService',
                'LiveMonitor.Services.NotifierService',
                '$q',
                '$rootScope',
                '$scope',
                '$timeout',
                '$window'
            ];
            return CircuitAudioController;
        }());
        var AudioBufferSegment = /** @class */ (function () {
            function AudioBufferSegment() {
            }
            return AudioBufferSegment;
        }());
        angular
            .module('LiveMonitor.Widgets')
            .component('circuitAudio', new CircuitAudioComponent());
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=circuitAudio.component.js.map
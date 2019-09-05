
//class AudioBufferSegment {
//	public buffer: AudioBuffer;
//}

//interface ITestingController {
//	audioCtx: AudioContext;
//	bufferSource: AudioBufferSourceNode;
//	pcmProcessor: ScriptProcessorNode;

//	playAudio(): void;
//}

//namespace LiveMonitor.Testing {
//	export class TestingController implements ITestingController {
//		public audioCtx: AudioContext;
//		public bufferSource: AudioBufferSourceNode;
//		public pcmProcessor: ScriptProcessorNode;

//		public audioUrl: string = 'api/audio/live-stream';

//		public scheduleBuffersTimeoutId: ng.IPromise<void> = null;
//		public audioStack: Array<AudioBufferSegment> = [];
//		public nextTime: number = 0;
//		public hasCancelled: boolean = false;

//		$onInit = (): void => { }

//		static $inject = ['$window', '$timeout'];
//		constructor(private readonly _$window: ng.IWindowService, private readonly _$timeout: ng.ITimeoutService) {
//			const audioCtxOptions: AudioContextOptions = {
//				sampleRate: 8000
//			};
//		}

//		public playAudio(): void {
//			var arrayBuffer = new ArrayBuffer(2);
//			var uint8Arr = new Uint8Array(arrayBuffer);
//			var uint16Arr = new Uint16Array(arrayBuffer);
//			uint8Arr[0] = 0xAA;
//			uint8Arr[1] = 0xBB;
//			if (uint16Arr[0] === 0xBBAA) {
//				console.log('LITTLE ENDIAN');
//			}

//			if (uint16Arr[0] === 0xAABB) {
//				console.log('BIG ENDIAN');
//			}


//			//this.initAudioProcessors();
//			this.nextTime = 0;
//			this.audioStack = [];
//			this.hasCancelled = false;
//			this.audioCtx = new AudioContext();
//			this.scheduleBuffersTimeoutId = null;

//			this.getAudioData(this.audioUrl);
//			//this.startAudio();
//		}

//		private getAudioData(url): void {
//			fetch(url).then((response: Response) => {
//				const that = this;

//				if (response.body === null) {

//				}
//				const reader = response.body.getReader();
//				console.log('Reader retrieved from body.');

//				let bytesReceived = 0;
//				let rest: ArrayBuffer | null = null;

//				const read = () => {
//					console.log('Starting initial read...');
//					reader.read().then(
//						({ value, done }) => {
//							if (done) {
//								console.log('Fetch Complete');
//								return;
//							} else {
//								bytesReceived += value.length;
//								console.log(`Received ${bytesReceived} bytes so far...`);

//								if (value && value.buffer) {
//									let buffer: ArrayBuffer | null;
//									let segment: AudioBufferSegment;

//									if (rest !== null) {
//										console.log('Concatenating remaining bytes from previous chunk...');
//										buffer = that.concatBytes(rest, value.buffer);
//									} else {
//										buffer = value.buffer;
//									}

//									if (buffer.byteLength % 2 !== 0) {
//										console.log('Chunk byte length not divisible by 2... Dealing with your shit...');
//										rest = buffer.slice(-2, -1);
//										buffer = buffer.slice(0, -1);
//									} else {
//										console.log('Chunk byte length looks good. Carry on.');
//										rest = null;
//									}

//									segment = new AudioBufferSegment();

//									that.audioStack.push(segment);

//									const testin: ArrayBuffer = that.prependWavHeader(buffer);
//									//const testin: ArrayBuffer = (new Uint8Array(buffer)).buffer;
//									that.audioCtx.decodeAudioData(testin).then(
//										(testinBuffer) => {
//											segment.buffer = testinBuffer;

//											if (that.scheduleBuffersTimeoutId === null) {
//												that.scheduleBuffers();
//											}
//										},
//										(err) => {
//											console.log(`Error decoding audio: ${err}`);
//										});
//								}
//							}

//							// Continue reading
//							read();
//						}
//					);
//				}

//				// Start reading
//				read();
//			})
//				.catch((err): void => {
//					console.log(err);
//				});
//		}

//		private scheduleBuffers() {
//			if (this.hasCancelled) {
//				this.scheduleBuffersTimeoutId = null;

//				return;
//			}

//			while (
//				this.audioStack.length > 0 &&
//				this.audioStack[0].buffer !== undefined &&
//				this.nextTime < this.audioCtx.currentTime + 2
//			) {
//				const currentTime: number = this.audioCtx.currentTime;
//				const source: AudioBufferSourceNode = this.audioCtx.createBufferSource();
//				const segment: AudioBufferSegment = this.audioStack.shift();

//				source.buffer = this.pad(segment.buffer); // Tell source what to play
//				source.connect(this.audioCtx.destination); // Connect to client speakers

//				if (this.nextTime == 0) {
//					this.nextTime = currentTime + 0.2; // add latency
//				}

//				let duration: number = source.buffer.duration;
//				let offset: number = 0;

//				if (currentTime > this.nextTime) {
//					offset = currentTime - this.nextTime;
//					this.nextTime = currentTime;
//					duration = duration - offset;
//				}

//				source.start(this.nextTime, offset);
//				source.stop(this.nextTime + duration);

//				this.nextTime += duration; // Make the next buffer wait the length of the last buffer before being played
//			}

//			this.scheduleBuffersTimeoutId = this._$timeout(() => this.scheduleBuffers(), 200);
//		}

//		private pad(buffer: AudioBuffer): AudioBuffer {
//			const currentSample: Float32Array = new Float32Array(1);

//			buffer.copyFromChannel(currentSample, 0, 0);

//			let wasPositive: boolean = currentSample[0] > 0;

//			for (let i = 0; i < buffer.length; i += 1) {
//				buffer.copyFromChannel(currentSample, 0, i);

//				if ((wasPositive && currentSample[0] < 0) || (!wasPositive && currentSample[0] > 0)) {
//					break;
//				}

//				currentSample[0] = 0;
//				buffer.copyToChannel(currentSample, 0, i);
//			}

//			buffer.copyFromChannel(currentSample, 0, buffer.length - 1);

//			wasPositive = currentSample[0] > 0;

//			for (let i = buffer.length - 1; i > 0; i -= 1) {
//				buffer.copyFromChannel(currentSample, 0, i);

//				if ((wasPositive && currentSample[0] < 0) || (!wasPositive && currentSample[0] > 0)) {
//					break;
//				}

//				currentSample[0] = 0;
//				buffer.copyToChannel(currentSample, 0, i);
//			}

//			return buffer;
//		}

//		private prependWavHeader(data: ArrayBuffer): ArrayBuffer {
//			const header: ArrayBuffer = new ArrayBuffer(44);
//			const d: DataView = new DataView(header);

//			const totalSampleCt: number = (data.byteLength / 1 / 2);

//			// ChunkID
//			d.setUint8(0, "R".charCodeAt(0));
//			d.setUint8(1, "I".charCodeAt(0));
//			d.setUint8(2, "F".charCodeAt(0));
//			d.setUint8(3, "F".charCodeAt(0));

//			// ChunkSize
//			//d.setUint32(4, 35, true);
//			d.setUint32(4, totalSampleCt + 44, true);

//			// Format
//			d.setUint8(8, "W".charCodeAt(0));
//			d.setUint8(9, "A".charCodeAt(0));
//			d.setUint8(10, "V".charCodeAt(0));
//			d.setUint8(11, "E".charCodeAt(0));

//			// Subchunk1ID
//			d.setUint8(12, "f".charCodeAt(0));
//			d.setUint8(13, "m".charCodeAt(0));
//			d.setUint8(14, "t".charCodeAt(0));
//			d.setUint8(15, " ".charCodeAt(0));

//			d.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
//			d.setUint16(20, 1, true); // Audio Format (PCM = 1)
//			d.setUint16(22, 1, true); // Number of channels (1)
//			d.setUint32(24, 8000, true); // Sample rate (8000)
//			//d.setUint32(28, 8000 * 1, true);
//			d.setUint32(28, 8000 * 2, true); // Byte rate (sample rate * channels * (bit depth / 8))
//			//d.setUint16(32, 1, true);
//			d.setUint16(32, 2, true); // Block align (channels * (bit depth / 8))
//			//d.setUint16(34, 8, true);
//			d.setUint16(34, 16, true); // Bit depth (16)

//			// Subchunk2ID
//			d.setUint8(36, "d".charCodeAt(0));
//			d.setUint8(37, "a".charCodeAt(0));
//			d.setUint8(38, "t".charCodeAt(0));
//			d.setUint8(39, "a".charCodeAt(0));

//			// Subchunk2Size
//			//d.setUint32(40, -1, true);
//			d.setUint32(40, 2 * totalSampleCt, true);

//			// Concatenate data onto new buffer.
//			return this.concatBytes(header, data);
//		}

//		private concatBytes(arr1: ArrayBuffer, arr2: ArrayBuffer): ArrayBuffer {
//			const result = new Uint8Array(arr1.byteLength + arr2.byteLength);
//			result.set(new Uint8Array(arr1), 0);
//			result.set(new Uint8Array(arr2), arr1.byteLength);

//			return result.buffer;
//		}
//	}

//	angular
//		.module('LiveMonitor.Testing')
//		.controller('TestingController', TestingController);
//}
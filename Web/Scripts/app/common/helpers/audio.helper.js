var LiveMonitor;
(function (LiveMonitor) {
    var AudioHelper = /** @class */ (function () {
        function AudioHelper() {
        }
        /**
         * Prepends bytes necessary for a wav file header to the ArrayBuffer data.
         * 16-bit, 8k, mono
         * @param data The raw PCM data to prepend with a header
         */
        AudioHelper.prependWavHeader = function (data) {
            var header = new ArrayBuffer(44);
            var d = new DataView(header);
            var totalSampleCt = (data.byteLength / 1 / 2);
            // ChunkID
            d.setUint8(0, "R".charCodeAt(0));
            d.setUint8(1, "I".charCodeAt(0));
            d.setUint8(2, "F".charCodeAt(0));
            d.setUint8(3, "F".charCodeAt(0));
            // ChunkSize
            d.setUint32(4, totalSampleCt + 44, true);
            // Format
            d.setUint8(8, "W".charCodeAt(0));
            d.setUint8(9, "A".charCodeAt(0));
            d.setUint8(10, "V".charCodeAt(0));
            d.setUint8(11, "E".charCodeAt(0));
            // Subchunk1ID
            d.setUint8(12, "f".charCodeAt(0));
            d.setUint8(13, "m".charCodeAt(0));
            d.setUint8(14, "t".charCodeAt(0));
            d.setUint8(15, " ".charCodeAt(0));
            d.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
            d.setUint16(20, 1, true); // Audio Format (PCM = 1)
            d.setUint16(22, 1, true); // Number of channels (1)
            d.setUint32(24, 8000, true); // Sample rate (8000)
            d.setUint32(28, 8000 * 2, true); // Byte rate (sample rate * channels * (bit depth / 8))
            d.setUint16(32, 2, true); // Block align (channels * (bit depth / 8))
            d.setUint16(34, 16, true); // Bit depth (16)
            // Subchunk2ID
            d.setUint8(36, "d".charCodeAt(0));
            d.setUint8(37, "a".charCodeAt(0));
            d.setUint8(38, "t".charCodeAt(0));
            d.setUint8(39, "a".charCodeAt(0));
            // Subchunk2Size
            d.setUint32(40, 2 * totalSampleCt, true);
            // Concatenate data onto new buffer.
            return this.concatBytes(header, data);
        };
        /**
         * Combines arr1 and arr2 into a single ArrayBuffer object.
         * @param arr1 The first ArrayBuffer
         * @param arr2 The second ArrayBuffer
         */
        AudioHelper.concatBytes = function (arr1, arr2) {
            var result = new Uint8Array(arr1.byteLength + arr2.byteLength);
            result.set(new Uint8Array(arr1), 0);
            result.set(new Uint8Array(arr2), arr1.byteLength);
            return result.buffer;
        };
        /**
         * Adds zero-padding to the beginning and end of the AudioBuffer
         * @param buffer The audio buffer to add padding to
         */
        AudioHelper.padBuffer = function (buffer) {
            var curSample = new Float32Array(1);
            buffer.copyFromChannel(curSample, 0, 0);
            var wasPositive = curSample[0] > 0;
            for (var i = 0; i < buffer.length; i += 1) {
                buffer.copyFromChannel(curSample, 0, i);
                if ((wasPositive && curSample[0] < 0) || (!wasPositive && curSample[0] > 0)) {
                    break;
                }
                curSample[0] = 0;
                buffer.copyToChannel(curSample, 0, i);
            }
            buffer.copyFromChannel(curSample, 0, buffer.length - 1);
            wasPositive = curSample[0] > 0;
            for (var i = buffer.length - 1; i > 0; i -= 1) {
                buffer.copyFromChannel(curSample, 0, i);
                if ((wasPositive && curSample[0] < 0) || (!wasPositive && curSample[0] > 0)) {
                    break;
                }
                curSample[0] = 0;
                buffer.copyToChannel(curSample, 0, i);
            }
            return buffer;
        };
        return AudioHelper;
    }());
    LiveMonitor.AudioHelper = AudioHelper;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=audio.helper.js.map
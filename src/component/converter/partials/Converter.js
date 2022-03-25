export const convert = (audioFileData, targetFormat) => {
  try {
    targetFormat = targetFormat.toLowerCase();
    let reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = function (event) {
        let contentType = "audio/" + targetFormat;
        let data = event.target.result;
        let blob = new Blob([new Uint8Array(data)], { type: contentType });
        let blobUrl = URL.createObjectURL(blob);
        let convertedAudio = {
          name: audioFileData.name.substring(
            0,
            audioFileData.name.lastIndexOf(".")
          ),
          format: targetFormat,
          data: blobUrl,
        };
        resolve(convertedAudio);
      };
      reader.readAsArrayBuffer(audioFileData);
    });
  } catch (e) {}
};

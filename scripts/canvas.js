const canvasEl = document.querySelector('canvas');
const shaderName = canvasEl.dataset.name;
const sandbox = new GlslCanvas(canvasEl);
window.sandbox = sandbox;

let width = 1536;
let height = 1536;

let string_frag_code;
document.addEventListener('DOMContentLoaded', () => {
  fetch(`/shaders/${shaderName}.frag`)
    .then((res) => res.text())
    .then((fragmentText) => {
      string_frag_code = fragmentText;
      sandbox.load(string_frag_code);
    });
});

function setUniform(name, value) {
  sandbox.setUniform(`u_${name}`, value);
}
window.setUniform = setUniform;

function updateRatio(ratio) {
  if (ratio === '1:1') {
    width = 1536;
    height = 1536;
  } else if (ratio === '4:5') {
    width = 1536;
    height = 1920;
  } else if (ratio === '16:9') {
    width = 1536;
    height = 864;
  }

  canvasEl.width = width;
  canvasEl.height = height;
  sandbox.forceRender = true;
}
window.updateRatio = updateRatio;

function download(
  format,
  exportWidth = 4000,
  aspectRatio = '1:1',
  fileName = 'file',
  quality = 1
) {
  const previousWidth = width;
  const previousHeight = height;

  let finalWidth;
  if (+exportWidth) {
    finalWidth = +exportWidth;
  } else {
    finalWidth = 4000;
  }

  if (aspectRatio === '1:1') {
    canvasEl.width = finalWidth;
    canvasEl.height = finalWidth;
  } else if (aspectRatio === '4:5') {
    canvasEl.width = finalWidth;
    canvasEl.height = (finalWidth * 5) / 4;
  } else if (aspectRatio === '16:9') {
    canvasEl.width = finalWidth;
    canvasEl.height = (finalWidth * 9) / 16;
  }

  sandbox.forceRender = true;
  sandbox.render();
  canvasEl.toBlob(
    (blob) => {
      fileSaver.saveAs(blob, fileName);
    },
    `image/${format}`,
    quality
  );

  canvasEl.width = previousWidth;
  canvasEl.height = previousHeight;
  sandbox.forceRender = true;
}
window.download = download;

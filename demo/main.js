const iframeElement = document.querySelector('#origo-map');
const buttonElement = document.querySelector('#button');

function sendMessage(message) {
  const iframeOrigin = new URL(iframeElement.src).origin;
  iframeElement.contentWindow.postMessage(message, iframeOrigin);
}

buttonElement.addEventListener('click', () => sendMessage('done'));

window.addEventListener('message', (message) => console.log(message.data));

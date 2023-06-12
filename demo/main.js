const iframeElement = document.querySelector('#origo-map');
const buttonElement = document.querySelector('#button');
const parcelButtonElement = document.querySelector('#parcelButton');

function sendMessage(message) {
  const iframeOrigin = new URL(iframeElement.src).origin;
  iframeElement.contentWindow.postMessage(message, iframeOrigin);
}

buttonElement.addEventListener('click', () => sendMessage({ targetPlugin: 'origonbketuna', type: 'mapstate', data: {} }));
parcelButtonElement.addEventListener('click', () => {
  let parcel = document.querySelector('#parcelInput').value;
  sendMessage({ targetPlugin: 'origonbketuna', type: 'parcel', data: { id: parcel } });
});

window.addEventListener('message', (message) => console.log('msg recieved from iframe: ', message.data));

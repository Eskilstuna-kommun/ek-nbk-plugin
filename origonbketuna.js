import Origo from 'Origo';

const Origonbketuna = function Origonbketuna(options = {}) {
  return Origo.ui.Component({
    name: 'origonbketuna',
    onInit() {
      window.addEventListener('message', (message) => {
        console.log(message.data);
        window.parent.postMessage('pong', window.location.ancestorOrigins[0]);
      });
    },
    onAdd(evt) {

    },
    render() {

    }
  });
};

export default Origonbketuna;

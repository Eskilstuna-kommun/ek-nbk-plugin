import Origo from 'Origo';
import SizeControl from './size-control';
import SetScaleControl from './set-scale-control';

const Origonbketuna = function Origonbketuna(options = {}) {
  const {
    paperSizes = ['a4', 'a3', 'a2', 'a1'],
    scales,
    initialScale
  } = options;

  const dom = Origo.ui.dom;
  let viewer;
  let wrapperElement;
  let sizeControl;
  let setScaleControl;

  function postMessage(message) {
    window.parent.postMessage(message, window.location.ancestorOrigins[0]);
  }

  function onMessage(message) {
    console.log(message.data);
    postMessage('pong');
  }

  function setSize(size) {
    console.log(size);
  }

  function setScale(scale) {
    console.log(scale);
  }

  return Origo.ui.Component({
    name: 'origonbketuna',
    onInit() {
      window.addEventListener('message', onMessage);

      wrapperElement = Origo.ui.Element({
        cls: 'o-search-wrapper absolute top-left rounded box-shadow bg-white',
        style: {
          'flex-wrap': 'wrap',
          overflow: 'visible',
          left: '4rem'
        }
      });

      // Size control
      sizeControl = SizeControl({
        initialSize: paperSizes[0],
        sizes: paperSizes
      });
      sizeControl.on('change:size', setSize);

      // Scale control
      setScaleControl = SetScaleControl({
        scales,
        initialScale
      });

      setScaleControl.on('change:scale', setScale);
    },
    onAdd(evt) {
      viewer = evt.target;

      this.addComponents([wrapperElement, sizeControl, setScaleControl]);
      this.render();
    },
    render() {
      const mapEl = document.getElementById(viewer.getMain().getId());

      let htmlString = wrapperElement.render();
      let el = dom.html(htmlString);
      mapEl.appendChild(el);

      htmlString = sizeControl.render();
      el = dom.html(htmlString);
      document.getElementById(wrapperElement.getId()).appendChild(el);

      htmlString = setScaleControl.render();
      el = dom.html(htmlString);
      document.getElementById(wrapperElement.getId()).appendChild(el);

      this.dispatch('render');
    }
  });
};

export default Origonbketuna;

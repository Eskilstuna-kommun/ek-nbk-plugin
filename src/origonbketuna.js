import Origo from 'Origo';
import SizeControl from './size-control';
import SetScaleControl from './set-scale-control';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke } from 'ol/style';
import { Feature } from 'ol';
import LineString from 'ol/geom/LineString';

const Origonbketuna = function Origonbketuna(options = {}) {
  const pluginName = 'origonbketuna';
  const {
    paperSizes = {
      a4: [210, 297],
      a3: [297, 420],
      a2: [420, 594],
      a1: [594, 841]
    },
    paperSize = 'a4',
    scales = ['1:400', '1:800', '1:1000', '1:10000'],
    initialScale = '1:400'
  } = options;

  const dom = Origo.ui.dom;
  const vectorSource = new VectorSource();
  let viewer;
  let map;
  let wrapperElement;
  let sizeControl;
  let setScaleControl;
  let previewFeature;
  let selectedScale;
  let selectedSize = paperSize;

  function postMessage(message) {
    window.parent.postMessage(message, window.location.ancestorOrigins[0]);
  }

  async function onMessage(message) {
    const data = message.data;
    if (data !== 'done') {
      return;
    }

    const mapState = await saveMapState();
    postMessage(mapState);
  }

  async function saveMapState() {
    const coordinates = previewFeature.getGeometry().getCoordinates();
    const p1 = coordinates[0];
    const p2 = coordinates[2];

    const result = {
      paperSize: selectedSize.toUpperCase(),
      scale: selectedScale * 1000,
      extent: [p1, p2]
    };

    viewer.permalink.addParamsToGetMapState(pluginName, (state) => {
      state[pluginName] = result;
    });
    const response = await viewer.permalink.saveStateToServer(viewer);

    result.mapStateId = response.mapStateId;

    return result;
  }

  function createPreviewFeature(center, size, scale) {
    const paperDims = paperSizes[size];
    const width = (paperDims[1] / 1000) * scale * 1000;
    const height = (paperDims[0] / 1000) * scale * 1000;

    const p1 = [center[0] - width / 2, center[1] + height / 2];
    const p2 = [p1[0] + width, p1[1]];
    const p3 = [p2[0], p2[1] - height];
    const p4 = [p1[0], p3[1]];

    const lineString = new LineString([p1, p2, p3, p4, p1]);

    return new Feature(lineString);
  }

  function updatePreviewFeature(size, scale) {
    if (previewFeature) {
      vectorSource.removeFeature(previewFeature);
    }

    previewFeature = createPreviewFeature(
      map.getView().getCenter(),
      size,
      scale
    );
    vectorSource.addFeature(previewFeature);

    const extent = previewFeature.getGeometry().getExtent();
    map.getView().fit(extent, { padding: [100, 100, 100, 100] });
  }

  function setSize(size) {
    selectedSize = size;
    updatePreviewFeature(selectedSize, selectedScale);
  }

  function setScale(scale) {
    selectedScale = scale;
    updatePreviewFeature(selectedSize, selectedScale);
  }

  return Origo.ui.Component({
    name: pluginName,
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
        initialSize: paperSize,
        sizes: Object.keys(paperSizes)
      });
      sizeControl.on('change:size', (x) => setSize(x.size));

      // Scale control
      setScaleControl = SetScaleControl({
        scales,
        initialScale
      });

      setScaleControl.on('change:scale', (x) => setScale(x.scale));
    },
    onAdd(evt) {
      viewer = evt.target;
      map = viewer.getMap();

      this.addComponents([wrapperElement, sizeControl, setScaleControl]);
      this.render();
    },
    render() {
      const mapEl = document.getElementById(viewer.getMain().getId());

      // Render wrapper
      let htmlString = wrapperElement.render();
      let el = dom.html(htmlString);
      mapEl.appendChild(el);

      // Render SizeControl
      htmlString = sizeControl.render();
      el = dom.html(htmlString);
      document.getElementById(wrapperElement.getId()).appendChild(el);

      // Render SetScaleControl
      htmlString = setScaleControl.render();
      el = dom.html(htmlString);
      document.getElementById(wrapperElement.getId()).appendChild(el);

      // Create map layer for preview rectangle
      const style = new Style({
        stroke: new Stroke({
          color: '#ff000066',
          width: 2
        })
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style,
        group: 'none'
      });
      map.addLayer(vectorLayer);

      // Update the preview rectangle when panning/zooming
      let lastCenter = map.getView().getCenter();
      map.on('moveend', () => {
        const center = map.getView().getCenter();
        const dx = center[0] - lastCenter[0];
        const dy = center[1] - lastCenter[1];
        previewFeature.getGeometry().translate(dx, dy);
        lastCenter = center;
      });

      this.dispatch('render');
    }
  });
};

export default Origonbketuna;

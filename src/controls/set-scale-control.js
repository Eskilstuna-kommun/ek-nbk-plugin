import Origo from 'Origo';

export default function SetScaleControl(options = {}) {
  const {
    scales = [],
    initialScale
  } = options;

  let selectScale;

  /**
   * Parses a formatted scale string and returns the denominator as a number
   * @param {any} scale
   */
  function parseScale(scale) {
    return parseInt(scale.replace(/\s+/g, '').split(':').pop(), 10);
  }

  return Origo.ui.Component({
    onInit() {
      selectScale = Origo.ui.Dropdown({
        cls: 'o-scalepicker text-black flex',
        contentCls: 'bg-grey-lighter text-smallest rounded',
        buttonCls: 'bg-white border text-black',
        buttonIconCls: 'black',
        text: 'Välj skala'
      });
      this.addComponents([selectScale]);
    },
    onChangeScale(evt) {
      const scaleDenominator = parseScale(evt);
      this.dispatch('change:scale', { scale: scaleDenominator / 1000 });
      selectScale.setButtonText(evt);
    },
    onRender() {
      this.dispatch('render');
      selectScale.setItems(scales);
      document.getElementById(selectScale.getId()).addEventListener('dropdown:select', (evt) => {
        this.onChangeScale(evt.target.textContent);
      });

      if (initialScale) {
        this.onChangeScale(initialScale);
      }
    },
    render() {
      return `
      <div class="padding-top-large"></div>
      <h6>Välj utskriftsskala</h6>
      <div class="padding-smaller o-tooltip active">
        ${selectScale.render()}
      </div>`;
    }
  });
}

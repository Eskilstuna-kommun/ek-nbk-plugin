import Origo from 'Origo';
import titleCase from './utils/titlecase';
import round2 from './utils/round';

export default function SizeControl({ initialSize, sizes }) {
  const sizeButtons = sizes.map((size) => Origo.ui.Button({
    cls: 'grow light text-smaller',
    text: titleCase(size),
    state: initialSize === size ? 'active' : 'initial',
    style: { width: `${String(round2(100 / sizes.length, 1))}%` },
    ariaLabel: titleCase(size)
  }));

  const sizeControl = Origo.ui.ToggleGroup({
    cls: 'flex button-group divider-horizontal rounded bg-inverted border',
    components: sizeButtons,
    style: { height: '2rem', display: 'flex' }
  });
  sizeButtons.forEach((sizeButton, index) => {
    sizeButton.on('click', () => sizeControl.dispatch('change:size', { size: sizes[index] }));
  });

  return sizeControl;
}

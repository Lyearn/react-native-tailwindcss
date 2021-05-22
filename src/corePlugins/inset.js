import generator from '../util/generator';

import top from './top';
import bottom from './bottom';
import left from './left';
import right from './right';

export default ({theme}) => ({
    ...generator.generate('inset', ['top', 'bottom', 'left', 'right'], theme.inset, [
        ['x', ['left', 'right']],
        ['y', ['top', 'bottom']],
    ]),
    ...top({theme}),
    ...bottom({theme}),
    ...left({theme}),
    ...right({theme}),
});

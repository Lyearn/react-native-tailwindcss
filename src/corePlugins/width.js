import _pickBy from 'lodash/pickBy';
import generator from '../util/generator';

export default ({theme}) => {
    const updatedWidthConfig = _pickBy(theme.width, (_, key) => {
        return !['max', 'min', 'screen'].includes(key);
    });

    return generator.generate('w', 'width', updatedWidthConfig);
};

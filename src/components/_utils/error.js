import { formatMessage } from 'umi/locale';

export default function error(code) {
    return formatMessage({id:`error.${code}`});
}
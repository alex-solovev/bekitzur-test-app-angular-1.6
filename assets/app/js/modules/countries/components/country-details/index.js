import CountryDetailsTpl from 'string-loader!./country-details.tpl.html';
import CountryDetailsCtrl from './country-details.controller';

export default {
    template: CountryDetailsTpl,
    controller: CountryDetailsCtrl,
    bindings: {
        country: '<'
    }
};
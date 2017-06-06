import CountriesListTpl from 'string-loader!./countries-list.tpl.html';
import CountriesListCtrl from './countries-list.controller';

export default {
    template: CountriesListTpl,
    controller: CountriesListCtrl,
    bindings: {
        countries: '<'
    }
};
import RegionDetailsTpl from 'string-loader!./region-details.tpl.html';
import RegionDetailsCtrl from './region-details.controller';

export default {
    template: RegionDetailsTpl,
    controller: RegionDetailsCtrl,
    bindings: {
        region: '<'
    }
};
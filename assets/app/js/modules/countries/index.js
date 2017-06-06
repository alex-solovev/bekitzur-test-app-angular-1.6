import angular from 'angular';
import uirouter from 'angular-ui-router';

import routes from './countries.routes';

import CountriesList from './components/countries-list';
import CountryDetails from './components/country-details';
import RegionDetails from './components/region-details';

import CountriesService from './services/countries.service';
import RegionsService from './services/regions.service';

export default angular
    .module('app.countries', [ uirouter, CountriesService, RegionsService ])
    .component('countriesList', CountriesList)
    .component('countryDetails', CountryDetails)
    .component('regionDetails', RegionDetails)
    // .service('CountriesService', CountriesService)
    // .service('RegionsService', RegionsService)
    .config(routes)
    .name;
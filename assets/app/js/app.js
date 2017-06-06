import angular from 'angular';
import uirouter from 'angular-ui-router';

import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import '../scss/main.scss';

import routing from './routing';
import countries from './modules/countries';

export default angular
                    .module('app', ['ngMaterial', uirouter, countries])
                    .config(routing);
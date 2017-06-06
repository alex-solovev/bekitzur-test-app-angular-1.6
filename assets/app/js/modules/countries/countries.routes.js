routes.$inject = ['$stateProvider'];

function routes($stateProvider) {
    $stateProvider
        .state('countries', {
            url: '/countries',
            component: 'countriesList',
            resolve: {
                countries: ['CountriesService', function (CountriesService) {
                    return CountriesService.getCountriesList();
                }]
            }
        })
        .state('country', {
            url: '/countries/:countryName',
            component: 'countryDetails',
            params: {
                countryName: '',
                countryId: ''
            },
            resolve: {
                country: ['$stateParams', 'CountriesService', ($stateParams, CountriesService) => {
                    return CountriesService.getCountryDetails($stateParams.countryId, $stateParams.countryName);
                }]
            }
        })
        .state('region', {
            url: '/countries/:countryName/:regionName',
            component: 'regionDetails',
            params: {
                countryName: '',
                regionName: '',
                regionId: ''
            },
            resolve: {
                region: ['$stateParams', 'RegionsService', ($stateParams, RegionsService) => {
                    return RegionsService.getRegionDetails($stateParams.regionId, $stateParams.regionName);
                }]
            }
        });
}

export default routes;
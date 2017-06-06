import wdk from 'wikidata-sdk';

class CountriesService {
    constructor($http, $cacheFactory, $q, $mdToast) {
        this.$http = $http;
        this.$mdToast = $mdToast;
        this.$q = $q;
        this.cachedItems = $cacheFactory('cachedCountries');
    }

    getCountriesList() {
        let deferred = this.$q.defer(),
            cachedCountries = this.cachedItems.get('countries')

        if (cachedCountries) {
            deferred.resolve(cachedCountries);
        }

        const url = wdk.sparqlQuery(
            `SELECT ?country ?countryLabel WHERE {
                    {
                        SELECT * WHERE {
                          ?country wdt:P31 wd:Q6256.
                        }
                    }
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
                } ORDER BY ?countryLabel`
        );

        this.$http({
            method: 'GET',
            url
        }).then(
            response => {
                let result = response.data.results.bindings.map((item) => {
                    return {
                        title: item.countryLabel.value,
                        countryId: item.country.value.split('/').filter((chunk) => /^Q/.test(chunk))[0]
                    };
                });

                this.cachedItems.put('countries', result);
                deferred.resolve(this.cachedItems.get('countries'));
            },
            error => {
                deferred.reject(error);
                this.$mdToast.showSimple('Failed to load countries list, please, try again later');
            }
        );

        return deferred.promise;
    }

    getCountryDetails(countryId, countryName) {
        let deferred = this.$q.defer();

        let makeRequest = (countryId) => {
            let url = wdk.sparqlQuery(
                `SELECT 
                  ?capitalLabel 
                  ?officialLanguageLabel 
                  ?countryLabel 
                  ?populationLabel 
                  ?websiteLabel 
                  ?flagImageLabel 
                  ?coatOfArmsLabel
            
                WHERE {  
                  BIND(wd:${countryId} AS ?c)
                  
                  ?c wdt:P36 ?capital .
                  ?c wdt:P17 ?country .
                  ?c wdt:P1082 ?population .
                  ?c wdt:P41 ?flagImage .
                  OPTIONAL { ?c wdt:P94 ?coatOfArms }
                  OPTIONAL { ?c wdt:P37 ?officialLanguage }
                  OPTIONAL { ?c wdt:P856 ?website }
                  
                  SERVICE wikibase:label {
                    bd:serviceParam wikibase:language "en" .
                  }
                } 
                
                LIMIT 1`
            );

            this.$http({ method: 'GET', url }).then(
                response => {
                    deferred.resolve({
                        ...response.data.results.bindings[0],
                        countryId
                    });
                },
                error => {
                    deferred.reject(error);
                    this.$mdToast.showSimple('Failed to load country details, please, try again later');
                }
            );
        };

        if (!countryId) {
            this.$http.get(wdk.getWikidataIdsFromWikipediaTitles(countryName)).then(
                response => {
                    countryId = Object.keys(response.data.entities)[0];
                    makeRequest(countryId);
                },
                error => {
                    deferred.reject(error);
                    this.$mdToast.showSimple('Failed to load country details, please, try again later');
                }
            );
        } else {
            makeRequest(countryId);
        }

        return deferred.promise;
    }

    getCountrySiblings(countryId) {
        let deferred = this.$q.defer();

        let url = wdk.sparqlQuery(
            `SELECT
              ?siblings
              ?siblingsLabel
            
            WHERE {  
              BIND(wd:${countryId} AS ?c)
            
              ?c wdt:P47 ?siblings .
              
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
            } ORDER BY ?siblingsLabel`
        );

        this.$http({ method: 'GET', url }).then(
            response => {
                deferred.resolve(response.data.results.bindings.map(item => {
                    return {
                        ...item,
                        siblings: {
                            value: item.siblings.value.split('/').filter((chunk) => /^Q/.test(chunk))[0]
                        }
                    };
                }));
            },
            error => {
                deferred.reject(error);
                this.$mdToast.showSimple('Failed to load country siblings, please, try again later');
            }
        );

        return deferred.promise;
    }
}

export default angular.module('services.CountriesService', [])
    .service('CountriesService', CountriesService)
    .name;
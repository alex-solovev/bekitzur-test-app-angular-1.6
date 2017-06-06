import wdk from 'wikidata-sdk';

class RegionsService {
    constructor($http, $q, $mdToast) {
        this.$http = $http;
        this.$q = $q;
        this.$mdToast = $mdToast;
    }

    getRegionsList(countryId) {
        let deferred = this.$q.defer();

        let url = wdk.sparqlQuery(
            `SELECT 
              ?regionsLabel
              ?regions
            
            WHERE {
              wd:${countryId} wdt:P150 ?regions .
              
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
            } ORDER BY ?regionsLabel`
        );

        this.$http({ method: 'GET', url }).then(
            response => deferred.resolve(response.data.results.bindings.map(item => {
                return {
                    ...item,
                    regions: {
                        value: item.regions.value.split('/').filter((chunk) => /^Q/.test(chunk))[0]
                    }
                };
            })),
            error => {
                deferred.reject(error);
                this.$mdToast.showSimple('Failed to load regions list, please, try again later');
            }
        );

        return deferred.promise;
    }

    getRegionDetails(regionId, regionName) {
        let deferred = this.$q.defer();

        let makeRequest = (regionId) => {
            const url = wdk.sparqlQuery(
                `SELECT 
              ?capitalLabel 
              ?officialLanguageLabel 
              ?countryLabel 
              ?populationLabel 
              ?websiteLabel 
              ?flagImageLabel 
              ?coatOfArmsLabel
            
            WHERE {  
              BIND(wd:${regionId} AS ?c)
              
              OPTIONAL { ?c wdt:P36 ?capital }
              OPTIONAL {  ?c wdt:P17 ?country }
              OPTIONAL { ?c wdt:P41 ?flagImage }
              OPTIONAL { ?c wdt:P1082 ?population }
              OPTIONAL { ?c wdt:P94 ?coatOfArms }
              OPTIONAL { ?c wdt:P37 ?officialLanguage }
              OPTIONAL { ?c wdt:P856 ?website }
              
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
            } 
            
            LIMIT 1`
            );

            this.$http({
                method: 'GET',
                url
            }).then(
                response => {
                    deferred.resolve({
                        ...response.data.results.bindings[0],
                        regionName,
                        regionId
                    });
                },
                error => {
                    deferred.reject(error);
                    this.$mdToast.showSimple('Failed to load region details, please, try again later');
                }
            );
        };

        if (!regionId) {
            this.$http.get(wdk.getWikidataIdsFromWikipediaTitles(regionName)).then(
                response => {
                    regionId = Object.keys(response.data.entities)[0];
                    makeRequest(regionId);
                },
                error => {
                    deferred.reject(error);
                    this.$mdToast.showSimple('Failed to load region details, please, try again later');
                }
            );
        } else {
            makeRequest(regionId);
        }

        return deferred.promise;
    }

    getRegionCities(regionId) {
        let deferred = this.$q.defer();

        const url = wdk.sparqlQuery(
            `SELECT 
              ?cityLabel
            
            WHERE {  
              BIND(wd:${regionId} AS ?r)
              
              ?city wdt:P131 ?r
            
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
            }`
        );

        this.$http({ method: 'GET', url }).then(
            response => deferred.resolve(response.data.results.bindings.filter(item => {
                return !/^Q(\d)/.test(item.cityLabel.value);
            })),
            error => {
                deferred.reject(error);
                this.$mdToast.showSimple('Failed to load region cities, please, try again later');
            }
        );

        return deferred.promise;
    }
}

export default angular.module('services.RegionsService', [])
    .service('RegionsService', RegionsService)
    .name;
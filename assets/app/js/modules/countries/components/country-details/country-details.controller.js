class CompanyDetailsCtrl {
    constructor(CountriesService, RegionsService) {
        this.regions = undefined;
        this.siblings = undefined;

        this.$onChanges = () => {
            if (this.country) {
                RegionsService.getRegionsList(this.country.countryId).then(
                    response => this.regions = response,
                    error => console.error(error)
                );

                CountriesService.getCountrySiblings(this.country.countryId).then(
                    response => this.siblings = response,
                    error => console.error(error)
                );
            }
        };
    }
}

CompanyDetailsCtrl.$inject = ['CountriesService', 'RegionsService'];

export default CompanyDetailsCtrl;
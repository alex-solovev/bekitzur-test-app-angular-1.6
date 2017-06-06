class RegionDetailsCtrl {
    constructor(RegionsService) {
        this.cities = undefined;

        this.$onChanges = () => {
            if (this.region) {
                RegionsService.getRegionCities(this.region.regionId).then(
                    response => this.cities = response,
                    error => console.error(error)
                );
            }
        };
    }
}

RegionDetailsCtrl.$inject = ['RegionsService'];

export default RegionDetailsCtrl;
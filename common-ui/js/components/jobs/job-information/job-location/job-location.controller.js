class jobLocationController {
    constructor (
        $state,
        $stateParams,
        $window,
        jobTitleFilter
    ) {
        'ngInject';

        this.$state           = $state;
        this.$stateParams     = $stateParams;
        this.jobTitleFilter   = jobTitleFilter;
        this.$window          = $window;
    }

    $onInit () {
      this.elevationPhotos = this.house.Photo;
      this.elevationPhotosVisible = true;

      if (this.$window.innerWidth <= 480) {
        this.isMobile = true;
    } else {
        this.isMobile = false;
    }
    }

    get JobTitle() {
      return this.jobTitleFilter(this.house.AddressInformation, true)
    }

    get JobAddress() {
      return this.jobTitleFilter(this.house.AddressInformation)
    }

}

export default jobLocationController;

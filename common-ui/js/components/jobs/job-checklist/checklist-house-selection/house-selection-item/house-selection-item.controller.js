class houseSelectionItemController {
    constructor (jobTitleFilter, UI_ENUMS, BASE_IMAGE_URL) {
        'ngInject';

        this.jobTitleFilter  = jobTitleFilter;

        this.defaultPhotoUrl = UI_ENUMS.IMAGES.DEFAULT_PHOTO;
        this.BASE_IMAGE_URL  = BASE_IMAGE_URL;
    }

    $onInit () {
        this.photoUrl = this.getPhotoUrl();
    }

    getPhotoUrl () {
        let photoUrl;
        let index = 0;

        while (!photoUrl && index < this.house.Photo.length) {
            photoUrl = this.house.Photo[index];

            index += 1;
        }

        return photoUrl ? this.BASE_IMAGE_URL + photoUrl : this.defaultPhotoUrl;
    }

    showElevationPhotos () {
        this.onUpdateHousePhoto({
            HouseId : this.house.HouseId
        });
    }

    get HouseTitle () {
        return this.jobTitleFilter(this.house.AddressInformation);
    }
}

export default houseSelectionItemController;

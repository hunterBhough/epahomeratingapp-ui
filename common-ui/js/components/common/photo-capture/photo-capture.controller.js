class PhotoCaptureController {
    constructor ($log, CameraService, UI_ENUMS, CONTEXT, AssetPathService, AssetLocalService, SyncService, BASE_IMAGE_URL, $cordovaFile) {
        'ngInject';
        this.$log = $log;
        this.CameraService = CameraService;
        this.SyncService = SyncService;
        this.AssetPathService = AssetPathService;
        this.AssetLocalService = AssetLocalService;
        this.localBaseUrl = BASE_IMAGE_URL;
        this.defaultPhotoUrl = UI_ENUMS.IMAGES.DEFAULT_PHOTO;
        this.$cordovaFile = $cordovaFile;

        this.photoActionLabelEnum = {
            ADD    : 'Add Photo',
            CHANGE : 'Change Photo'
        };

        this.CONTEXT_IS_APP = CONTEXT === UI_ENUMS.CONTEXT.APP;
    }

    // Call assetpath service to get baseURL

    $onInit () {
        this.$log.log('[PhotoCaptureController] initialized');
        this.s3BaseUrl = this.AssetPathService.getBaseURL('IMAGE');
        this.allowAddPhoto = this.CONTEXT_IS_APP;
        if (this.newPhoto) {
            this.photoUrl = this.photo
                ? `${this.localBaseUrl}${this.photo}`
                : this.defaultPhotoUrl;
        } else {
            this.photoUrl = this.photo
                ? `${this.s3BaseUrl}${this.photo}`
                : this.defaultPhotoUrl;
        }

        this.photoActionLabel
            = this.photoUrl === this.defaultPhotoUrl
                ? this.photoActionLabelEnum.ADD
                : this.photoActionLabelEnum.CHANGE;
    }

    addPhoto ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.CameraService.getPhoto().then(photo => {
            this.photoUrl = `${this.localBaseUrl}${photo}`;
            this.newPhoto = true;
            this.photoActionLabel = this.photoActionLabelEnum.CHANGE;

            this.onPhotoCapture({
                photo
            });

            this.photoActionLabel = this.photoActionLabelEnum.CHANGE;
        });
    }

    $onChanges (changes) {
        if (changes.photo && !changes.photo.isFirstChange()) {
            if (!changes.photo.currentValue) {
                this.photoUrl = this.defaultPhotoUrl;
                this.photoActionLabel = this.photoActionLabelEnum.ADD;
            } else {
                this.photo = changes.photo.currentValue;
                let assetAvailable = this.AssetLocalService.checkIfAssetAvailable(this.photo);
                if (assetAvailable === true) {
                    let imageData = `file://${this.localBaseUrl}${this.photo}`;
                    let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
                    let path =  imageData.substring(0, imageData.lastIndexOf('/') + 1);
                    this.$cordovaFile.readAsDataURL(path, filename).then(res => {
                        this.photoUrl = res;
                    });
                    // this.photoUrl = `${this.localBaseUrl}${this.photo}`;
                } else {
                    this.photoUrl = `${this.s3BaseUrl}${this.photo}`;
                }
                this.newPhoto = false;
                this.$log.log(`[PhotoCaptureController] onChange photoUrl: ${this.photoUrl}`);
                this.photoActionLabel = this.photoActionLabelEnum.CHANGE;
            }
        }
    }

    get isCollapsed () {
        return (
            this.collapsed === 'true' && this.photoUrl === this.defaultPhotoUrl
        );
    }
}

export default PhotoCaptureController;

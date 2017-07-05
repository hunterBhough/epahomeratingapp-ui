import moment from 'moment';

class ChecklistCommentsController {
    constructor (BASE_IMAGE_URL, AuthenticationService) {
        'ngInject';

        this.BASE_IMAGE_URL  = BASE_IMAGE_URL;
        this.user            = AuthenticationService.getUserInfo();
    }

    $onInit () {
        this.state = 'list';
        this.id    = this.itemId.replace(/\s/g, '_');
    }

    formatTimestamp (timestamp) {
        return moment(timestamp).format('MMMM Do YYYY, h:mm a');
    }

    setState (state) {
        this.state = state;

        this.newCommentText     = '';
        this.newCommentPhotoUrl = '';
    }

    handlePhotoCapture (photo) {
        this.newCommentPhotoUrl = photo;
    }

    postComment () {
        if (this.newCommentText || this.newCommentPhotoUrl !== '') {
            //TODO: make a stub user service that provides user id.
            const comment = {
                'PhotoUrl'  : this.newCommentPhotoUrl,
                'Comment'   : this.newCommentText,
                'User'      : this.user,
                'Timestamp' : moment().format()
            };

            this.onComment({
                comment : comment
            });

            this.postCommentForm.$setPristine();
            this.postCommentForm.$setUntouched();
        }

        this.setState('list');
    }
}

export default ChecklistCommentsController;

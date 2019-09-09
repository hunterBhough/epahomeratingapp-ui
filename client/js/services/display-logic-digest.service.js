import _cloneDeep from 'lodash/cloneDeep';
import digestRem from '../../../common-ui/js/digest/rem.json';
import digestEnergy from '../../../common-ui/js/digest/energy.json';

class DisplayLogicDigestService {
    constructor ($http, $q, API_URL, FootNotesService) {
        'ngInject';

        this.$http = $http;
        this.$q    = $q;

        this.FootNotesService = FootNotesService;

        this.API_URL   = API_URL;

        // this.digest = this.$http({
        //     method  : 'GET',
        //     url     : this.API_URL.DISPLAY_LOGIC_DIGEST
        // });

        this.digest = this.$q((resolve, reject) => {
          resolve(digestRem);
        })

        this.digest.then((digest) => {
            this.syncDigest = digest;
        });
        console.warn('INITIATE DIGEST');
    }

    getPromise () {
        console.warn('CALLED GET PROMISE');
        return this.digest;
    }

    get (id) {
      console.warn('CALLED GET ID');

        let checklistItemDisplay = this.digest
            .then(digest => {
                let checklistItem = _cloneDeep(digest.data.ChecklistItems[id]);
                checklistItem.Footnotes = this.FootNotesService.fetchData(id).Footnotes;
                return checklistItem;
            });


        return checklistItemDisplay;
    }

    getSync (id) {
        return this.syncDigest.data.ChecklistItems[id];
    }

    getEnum (Name) {
        return this.$q((resolve, reject) => {
            this.digest
                .then(digest => {
                    if (digest.data.Enums[Name]) {
                        resolve(digest.data.Enums[Name]);
                    } else {
                        reject('Not Found');
                    }
                });
        });
    }

    getDecimal (Name) {
      console.warn('CALLED GET DECIMAL');

        return this.$q((resolve, reject) => {
            this.digest
                .then(digest => {
                    if (digest.data.Decimals[Name]) {
                        resolve(digest.data.Decimals[Name]);
                    } else {
                        reject('Not Found');
                    }
                });
        });
    }

    getInteger (Name) {
        return this.$q((resolve, reject) => {
            this.digest
                .then(digest => {
                    if (digest.data.Integers[Name]) {
                        resolve(digest.data.Integers[Name]);
                    } else {
                        reject('Not Found');
                    }
                });
        });
    }

    getString (Name) {
        return this.$q((resolve, reject) => {
            this.digest
                .then(digest => {
                    if (digest.data.Strings[Name]) {
                        resolve(digest.data.Strings[Name]);
                    } else {
                        reject('Not Found');
                    }
                });
        });
    }

    getOrder () {
      console.warn('CALLED GET ORDER', this);

        return this.digest.then((digest) => {
            return digest.data.Order;
        });
    }
}

export default DisplayLogicDigestService;

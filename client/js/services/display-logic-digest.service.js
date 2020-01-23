import _cloneDeep from 'lodash/cloneDeep';
import digestRem from 'epahomeratingapp-ui/common-ui/js/digest/rem.json';
import digestEnergy from 'epahomeratingapp-ui/common-ui/js/digest/energy.json';

const DIGEST_TYPE = {
    ENERGY : 'ENERGYGAUGE',
    REM    : 'REMRATE'
};

class DisplayLogicDigestService {
    constructor ($http, $q, API_URL, FootNotesService, S3Service) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.S3Service = S3Service;

        this.FootNotesService = FootNotesService;

        this.API_URL = API_URL;
    }

    setDigest (type) {
        switch (type) {
        case DIGEST_TYPE.ENERGY:
            this.digest = this.getDigest('energy');
            break;
        case DIGEST_TYPE.REM:
            this.digest = this.getDigest('rem');
            break;
        default:
            this.digest = this.$q();
        }

        this.digest.then(digest => {
            this.syncDigest = digest;
        });
    }

    getDigest(type) {
        return this.S3Service.get(`display-logc-digest-${type}.json`, 'display-logic-digest').then(digest => {
            return JSON.parse(digest.Body);
        })
    }

    getPromise () {
        return this.digest;
    }

    get (id) {
        let checklistItemDisplay = this.digest.then(digest => {
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
            this.digest.then(digest => {
                if (digest.data.Enums[Name]) {
                    resolve(digest.data.Enums[Name]);
                } else {
                    reject('Not Found');
                }
            });
        });
    }

    getDecimal (Name) {
        return this.$q((resolve, reject) => {
            this.digest.then(digest => {
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
            this.digest.then(digest => {
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
            this.digest.then(digest => {
                if (digest.data.Strings[Name]) {
                    resolve(digest.data.Strings[Name]);
                } else {
                    reject('Not Found');
                }
            });
        });
    }

    getOrder () {
        return this.digest.then(digest => {
            return digest.data.Order;
        });
    }
}

export default DisplayLogicDigestService;

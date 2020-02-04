import _cloneDeep from 'lodash/cloneDeep';

const DIGEST_TYPE = {
    ENERGY : 'ENERGYGAUGE',
    REM    : 'REMRATE'
};

class DisplayLogicDigestService {
    constructor ($http, $q, API_URL, FootNotesService) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;

        this.FootNotesService = FootNotesService;

        this.API_URL = API_URL;

        this.digestEnergy = this.$http({
            method  : 'GET',
            url     : `${this.API_URL.DISPLAY_LOGIC_DIGEST}/energy`
        });
        this.digestRem = this.$http({
            method  : 'GET',
            url     : `${this.API_URL.DISPLAY_LOGIC_DIGEST}/rem`
        });

        this.digestRem.then(digest => {
            this.syncDigest = digest;
        });

    }

    setDigest (type) {
        this.digest = this.getDigest(type);
    }

    getDigest (xmlType) {
        let digestPromise;
        switch (xmlType) {
        case DIGEST_TYPE.ENERGY:
            digestPromise = this.digestEnergy;
            break;
        case DIGEST_TYPE.REM:
            digestPromise = this.digestRem;
            break;
        default:
            digestPromise = this.$q();
        }
        return digestPromise;
    }

    getPromise () {
        return this.digest;
    }

    get (id) {
        let checklistItemDisplay = this.digest.then(digest => {
            let checklistItem = _cloneDeep(digest.data.ChecklistItems[id]);
            if (checklistItem) { // TODO? find a better solution than ignoring undefined checklistItems
                checklistItem.Footnotes = this.FootNotesService.fetchData(id).Footnotes;
            }
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

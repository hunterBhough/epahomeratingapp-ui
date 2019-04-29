/* globals navigator, Connection */

import moment from 'moment';

const SECOND_IN_MS   = 1000;
const MINS_IN_MS     = 60 * SECOND_IN_MS;
const MAX_DATE_DELTA = 60 * MINS_IN_MS;

class JobHistory {
    constructor (UI_ENUMS, CONTEXT) {
        'ngInject';

        this.HISTORY = {
            CATEGORIES        : UI_ENUMS.HISTORY_CATEGORIES,
            SUBCATEGORIES     : UI_ENUMS.HISTORY_SUBCATEGORIES,
            TITLES            : UI_ENUMS.HISTORY_TITLES,
            SHORT_DESCRIPTION : UI_ENUMS.HISTORY_SHORT_DESCRIPTION
        };

        this.CONTEXT_IS_APP = CONTEXT === UI_ENUMS.CONTEXT.APP;
    }

    getShortDescription (historyData) {
        let description = '';
        if (historyData.Category === this.HISTORY.CATEGORIES.EDITED) {
            description = this.HISTORY.SHORT_DESCRIPTION[historyData.Category];
        } else {
            description = this.HISTORY.SHORT_DESCRIPTION[historyData.Category][historyData.Subcategory];
        }

        return description;
    }

    serializeHistoryRecord (historyData) {
        return [
            historyData.DateTime,
            historyData.Category,
            historyData.Subcategory,
            historyData.UserId,
            historyData.UserName,
            historyData.Data,
            historyData.LatLongAccuracy,
            historyData.Sample
        ];
    }

    deserializeHistoryRecord (historyData) {
        // if history record is in old format
        if (historyData.Description !== undefined) {
            return {
                DateTime        : new Date(historyData.DateTime),
                Category        : this.HISTORY.CATEGORIES.UNKNOWN,
                Subcategory     : this.HISTORY.CATEGORIES.UNKNOWN,
                UserId          : undefined,
                UserName        : historyData.User,
                Data            : historyData.Data,
                LatLongAccuracy : undefined,
                Sample          : undefined
            };
        }

        const [
            DateTime,
            Category,
            Subcategory,
            UserId,
            UserName,
            Data,
            LatLongAccuracy,
            Sample
        ] = historyData;

        return {
            DateTime : new Date(DateTime),
            Category,
            Subcategory,
            UserId,
            UserName,
            Data,
            LatLongAccuracy,
            Sample
        };
    }

    groupHistory (history) {
        let index;
        let groupedHistory = [];
        let previousRecord = history[0];
        let historyGroup  = [previousRecord];

        for (index = 1; index < history.length; index++) {
            const historyRecord = history[index];
            const dateTimeDelta = new Date(historyRecord.DateTime) - new Date(previousRecord.DateTime);

            if (previousRecord.UserId !== historyRecord.UserId
                || dateTimeDelta > MAX_DATE_DELTA
                || previousRecord.Category !== historyRecord.Category
                || (previousRecord.Category !== this.HISTORY.CATEGORIES.EDITED && previousRecord.Subcategory !== historyRecord.Subcategory)
                || previousRecord.Sample !== historyRecord.Sample) {

                groupedHistory.push(historyGroup);
                historyGroup = [historyRecord];
            } else {
                historyGroup.push(historyRecord);
            }

            previousRecord = historyRecord;
        }

        if (historyGroup.length > 0) {
            groupedHistory.push(historyGroup);
        }

        return groupedHistory;
    }

    deserializeHistory (history) {
        return history.map((historyRecord) => {
            return this.deserializeHistoryRecord(historyRecord);
        });
    }

    updateHistory (history) {
        return history.map((historyRecord) => {
            if (Array.isArray(historyRecord)) {
                return historyRecord;
            }

            let category    = this.HISTORY.CATEGORIES.MANAGE;
            let subcategory = this.HISTORY.SUBCATEGORIES.MANAGE.UPDATED;
            const date      = new Date(historyRecord.DateTime);

            switch (historyRecord.Description) {
            case 'Created' :
                category    = this.HISTORY.CATEGORIES.MANAGE;
                subcategory = this.HISTORY.SUBCATEGORIES.MANAGE.CREATED;
                break;
            case 'Updated response' :
                category    = this.HISTORY.CATEGORIES.EDITED;
                subcategory = this.HISTORY.SUBCATEGORIES.EDITED.UPDATE_FINAL;
                break;
            case 'Updated mrf data' :
                category    = this.HISTORY.CATEGORIES.EDITED;
                subcategory = this.HISTORY.SUBCATEGORIES.EDITED.EDIT_MRF;
                break;
            case 'Deleted' :
                category    = this.HISTORY.CATEGORIES.MANAGE;
                subcategory = this.HISTORY.SUBCATEGORIES.MANAGE.DELETED;
                break;
            case 'Archived' :
                category    = this.HISTORY.CATEGORIES.MANAGE;
                subcategory = this.HISTORY.SUBCATEGORIES.MANAGE.ARCHIVED;
                break;
            case 'Restored' :
                category    = this.HISTORY.CATEGORIES.MANAGE;
                subcategory = this.HISTORY.SUBCATEGORIES.MANAGE.UNDELETED;
                break;
            }

            return this.serializeHistoryRecord({
                DateTime        : date.toUTCString(),
                Category        : category,
                Subcategory     : subcategory,
                UserId          : undefined,
                UserName        : historyRecord.User,
                Data            : undefined,
                LatLongAccuracy : undefined,
                Sample          : undefined
            });
        });
    }

    mapReduceHistory (history) {
        return history.map((historyGroup) => {
            const isEditedCategory = historyGroup[0].Category === this.HISTORY.CATEGORIES.EDITED;
            let details;
            const map = {
                showMap     : true,
                coordinates : []
            };

            if (this.CONTEXT_IS_APP && navigator.connection.type === Connection.NONE) {
                map.showMap = false;
            }

            if (map.showMap) {
                map.coordinates
                    = historyGroup
                        .filter((historyRecord) => {
                            return historyRecord.LatLongAccuracy;
                        })
                        .map((historyRecord) => {
                            return historyRecord.LatLongAccuracy;
                        });

                if (map.coordinates.length === 0) {
                    map.showMap = false;
                }
            }

            if (isEditedCategory) {
                const durationInMs  = historyGroup[historyGroup.length - 1].DateTime - historyGroup[0].DateTime;
                const duplicates    = {
                    UPDATE_PREDRYWALL : [],
                    UPDATE_FINAL      : []
                };

                const subQuantities = historyGroup.reduce((quantities, historyRecord) => {
                    const subcategory = historyRecord.Subcategory;

                    if (subcategory === this.HISTORY.SUBCATEGORIES.EDITED.UPDATE_PREDRYWALL
                        || subcategory === this.HISTORY.SUBCATEGORIES.EDITED.UPDATE_FINAL) {
                        let itemId;

                        try {
                            itemId = historyRecord.Data.match(/\[(.*?)\]/)[1];
                        } catch (error) {
                            itemId = historyRecord.Data;
                        }

                        if (historyRecord.Data && !duplicates[subcategory].includes(itemId)) {
                            duplicates[subcategory].push(itemId);
                            quantities[subcategory] += 1;
                        } else if (historyRecord.Data === undefined || historyRecord.Data === null) {
                            quantities[subcategory] += 1;
                        }
                    } else {
                        quantities[subcategory] += 1;
                    }


                    return quantities;
                }, {
                    'COMMENT'           : 0,
                    'COMMENT_PHOTO'     : 0,
                    'PROVIDER_COMMENT'  : 0,
                    'EDIT_MRF'          : 0,
                    'PHOTO'             : 0,
                    'UPDATE_PREDRYWALL' : 0,
                    'UPDATE_FINAL'      : 0
                });

                details = [];

                details.push(`Total Editing Time: ${moment.duration({milliseconds : durationInMs}).humanize()}`);

                Object.keys(subQuantities).forEach((key) => {
                    if (subQuantities[key] > 0) {
                        details.push(`${subQuantities[key]} ${this.HISTORY.TITLES.EDITED[key]}`);
                    }
                });
            }

            return {
                title   : isEditedCategory ? this.HISTORY.SHORT_DESCRIPTION.EDITED : this.HISTORY.TITLES[historyGroup[0].Category][historyGroup[0].Subcategory],
                sample  : historyGroup[0].Sample,
                date    : historyGroup[0].DateTime,
                user    : historyGroup[0].UserName,
                data    : !isEditedCategory ? historyGroup[0].Data : undefined,
                details,
                map
            };
        });
    }

    parseHistory (history) {
        let parsedHistory = this.deserializeHistory(history);

        parsedHistory.sort((a, b) => {
            const aDateTime = a.DateTime;
            const bDateTime = b.DateTime;

            if (aDateTime > bDateTime) {
                return 1;
            } else if (aDateTime < bDateTime) {
                return -1;
            } else if (aDateTime.toUTCString() === bDateTime.toUTCString()) {
                return 0;
            }
        });

        parsedHistory = this.groupHistory(parsedHistory);

        return this.mapReduceHistory(parsedHistory);
    }
}

export default JobHistory;

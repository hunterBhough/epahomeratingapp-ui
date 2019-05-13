class ChecklistItemController {
    constructor ($stateParams, DisplayLogicDigestService, JobChecklistStateService, CONTEXT, UI_ENUMS, $http) {
        'ngInject';

        this.$stateParams = $stateParams;
        this.$http        = $http;

        this.DisplayLogicDigestService = DisplayLogicDigestService;
        this.JobChecklistStateService  = JobChecklistStateService;

        this.ANY                   = UI_ENUMS.ANY;
        this.CHECKLIST_ITEM_STATUS = UI_ENUMS.CHECKLIST_ITEM_STATUS;
        this.RATING_TYPES          = UI_ENUMS.RATING_TYPES;
        this.RESPONSES             = UI_ENUMS.RESPONSES;
        this.CONTEXT_IS_ADMIN      = CONTEXT !== UI_ENUMS.CONTEXT.APP;

        this.jobRatingType     = this.JobChecklistStateService.getJob().RatingType;
        this.isOmitted         = false;
    }

    $onInit () {
        let currentHousePlanId = this.JobChecklistStateService.currentHouse.HousePlan[0]._id;
        let filterStatus       = this.$stateParams.statusId || '';

        this
            .DisplayLogicDigestService
            .get(this.itemId)
            .then(checklistItem => {
                this.checklistItem = checklistItem;

                return this.JobChecklistStateService.getChecklistItemResponse(this.itemId, this.itemCategory, this.itemCategoryProgress);
            })
            .then(response => {
                this.isFiltered = false;

                this.response = response.Response;

                if (filterStatus === this.ANY.Any.Key) {
                    this.isFiltered = false;
                } else if (filterStatus === this.CHECKLIST_ITEM_STATUS['to-do'].Key) {
                    this.isFiltered = this.response !== undefined;
                } else if (filterStatus === this.CHECKLIST_ITEM_STATUS['must-correct'].Key) {
                    this.isFiltered = this.response === undefined || this.response[0] !== this.RESPONSES.MustCorrect.Key;
                } else {
                    this.isFiltered = false;
                }

                if (this.omitRatingType()) {
                    this.isOmitted = true;
                }

                this
                    .JobChecklistStateService
                    .registerItemStatusQuery(`${this.itemCategory}:${this.itemCategoryProgress}:${this.itemId}`, this.statusQuery.bind(this));

                if (this.checklistItem.Type === 'SubItem-Default') {
                    this.isOmitted = true;

                    this
                        .JobChecklistStateService
                        .registerSubItem(this.itemId, this.omitItem.bind(this));
                }
            });

        this.housePlanIds
             = this
                .JobChecklistStateService
                .getChecklistItemHouseplanIds(this.itemId, this.itemCategory, this.itemCategoryProgress);


        this.isApplicable = this.housePlanIds.indexOf(currentHousePlanId) >= 0;
    }

    // callback for subitems to change if ommitted via a parent selection. still need to account for hers, so re-apply that filter
    omitItem (isOmitted) {
        this.isOmitted = isOmitted;

        if (this.omitRatingType()) {
            this.isOmitted = true;
        }
    }

    omitRatingType () {
        return this.jobRatingType === this.RATING_TYPES.HERS.Key && this.checklistItem.RatingType === this.RATING_TYPES.EnergyStar.Key;
    }

    statusQuery () {
        return {
            isApplicable : this.isApplicable,
            isFiltered   : this.isFiltered,
            isOmitted    : this.isOmitted || this.checklistItem.Options !== undefined
        };
    }
}

export default ChecklistItemController;

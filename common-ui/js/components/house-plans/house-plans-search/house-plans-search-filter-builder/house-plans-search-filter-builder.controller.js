class SearchFilterBuilderController {
    constructor ($stateParams, UI_ENUMS) {
        'ngInject';

        this.$stateParams = $stateParams;

        this.param   = UI_ENUMS.HOUSE_PLANS_SEARCH_PARAMS.BUILDER;
    }

    $onInit () {
        if (this.$stateParams[this.param]) {
            this.keywords = decodeURIComponent(this.$stateParams[this.param]);
        } else {
            this.reset();
        }

        this.registerFilter({
            filter : {
                reset     : this.reset.bind(this),
                serialize : this.serialize.bind(this)
            }
        });
    }

    reset () {
        this.keywords = '';
    }

    serialize () {
        let filter;

        if (this.keywords.length > 0) {
            filter = {
                filterKey  : this.param,
                filterName : this.keywords,
                param      : {}
            };

            filter.param[this.param] = encodeURIComponent(this.keywords);
        }

        return filter;
    }
}

export default SearchFilterBuilderController;
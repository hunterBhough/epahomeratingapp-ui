import ChecklistItemClass from '../checklist-item.class';

class ChecklistTotalDuctLeakageTestStrategyController extends ChecklistItemClass {
    $onInit () {
        super
            .$onInit()
            .then(() => {
                this.itemData       = this.itemData || {selectedOptionIndex : 0};
                this.selectedOption = this.display.Options[this.itemData.selectedOptionIndex];
                this.onSelectOption(false);

                this.itemDataListener = this.$rootScope.$on(this.MESSAGING.UPDATE_CHECKLIST_ITEM_DATA, (event, response) => {
                    this.onSiblingSetItemData(response);
                });
            });
    }

    onSelectOption (setItemData) {
        for (let index in this.display.Options) {
            let omitItem = true;

            if (this.selectedOption === this.display.Options[index]) {
                this.itemData.selectedOptionIndex = index;
                omitItem = false;
            }

            this.JobChecklistStateService.omitSubItem(
                setItemData,
                this.display.Options[index].Show,
                {
                    'Category'         : this.itemCategory,
                    'CategoryProgress' : this.itemCategoryProgress,
                },
                omitItem
            );
        }

        if (setItemData) {
            this.setItemData(this.itemData);
        }
    }

    onSiblingSetItemData (response) {
        if (response.CategoryProgress !== this.itemCategoryProgress && response.ItemData.selectedOptionIndex !== this.itemData.selectedOptionIndex) {
            this.itemData.selectedOptionIndex = response.ItemData.selectedOptionIndex;
            this.selectedOption = this.display.Options[this.itemData.selectedOptionIndex];
            this.setItemData(this.itemData);
        }
    }

    $onDestroy () {
        // unregister listeners
        this.itemDataListener();
    }
}

export default ChecklistTotalDuctLeakageTestStrategyController;

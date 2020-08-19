class PopoverService {
    constructor ($log, $q) {
        'ngInject';

        this.$log     = $log;
        this.$q       = $q;
        this.popovers = {};
    }

    registerPopover (popover) {
        console.warn('register popover', popover);

        this.popovers[popover.id] = popover;
    }

    deregisterPopover (popoverId) {
        if (this.popovers[popoverId]) {
            delete this.popovers[popoverId];
        }
    }

    openPopover (popoverId) {
        console.warn('opening popover', popoverId);
        return this.$q((resolve, reject) => {
            if (this.popovers[popoverId]) {
                this.popovers[popoverId].open({
                    resolve,
                    reject
                });
            } else {
                reject(`popover ${popoverId} not registered`);
            }
        });
    }

    closePopover (popoverId) {
        console.warn('closing popover', popoverId, JSON.stringify(this.popovers));
        return this.$q((resolve, reject) => {
            if (this.popovers[popoverId]) {
                this.popovers[popoverId].close({
                    resolve,
                    reject
                });
            } else {
                reject(`popover ${popoverId} not registered`);
            }
        });
    }
}

export default PopoverService;

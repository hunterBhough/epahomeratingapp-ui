import _filter from 'lodash/filter';

class ManufacturersService {
    constructor (UI_ENUMS) {
        'ngInject';

        this.FILTERED_MANUFACTURERS = {
            HVAC         : _filter(UI_ENUMS.MANUFACTURERS, (manufacturer) => {
                return manufacturer.type.hvac;
            }),
            WATER_HEATER : _filter(UI_ENUMS.MANUFACTURERS, (manufacturer) => {
                return manufacturer.type.waterHeater;
            })
        };
    }

    getFilteredManufacturers (equipmentType, filter) {
        if (filter === '') {
            return this.FILTERED_MANUFACTURERS[equipmentType];
        } else {
            return this.filterManufacturers(equipmentType, filter);
        }
    }

    filterManufacturers (equipmentType, filter) {
        return _filter(this.FILTERED_MANUFACTURERS[equipmentType], (manufacturer) => {
            return manufacturer.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
        });
    }
}

export default ManufacturersService;

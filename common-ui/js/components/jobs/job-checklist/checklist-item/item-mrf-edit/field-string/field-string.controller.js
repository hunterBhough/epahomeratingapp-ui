import MrfEditField from '../field.class.js';
import moment from 'moment';


class MrfEditFieldStringController extends MrfEditField {
    sanitize () {
        this.value = this.SanitizeService.sanitize(this.value);
    }

    $onInit () {
        this.DisplayLogicDigestService
            .getString(this.stringName)
            .then((string) => {
                this.stringType = string;
                this.stringFound = true;
            })
            .catch((error) => {
                this.stringFound = false;
            });

        this.date = this.date === undefined ? false : this.date;

        this.dateTime = this.date ? this.formatDate(this.value, 'YYYY-MM-DD') : null;
    }

    onDateChange (newDate) {
        this.value = this.formatDate(newDate, 'MM-DD-YYYY');

        this.onChange(this.value);
    }

    formatDate (date, format) {
        if (moment(date).isValid()) {
            switch (format) {
            case 'YYYY-MM-DD':
                return moment(date).format('YYYY-MM-DD');
            case 'MM-DD-YYYY':
                return moment(date).format('l');
            }
        } else {
        //TODO: error?
        }
    }
}

export default MrfEditFieldStringController;

//TODO: put this in a config somewhere.
const MAX_SAMPLE_SIZE = 7;

import _findIndex from 'lodash/findIndex';

class JobDetailController {
    constructor ($state, DialogService, JobsService, UI_ENUMS, $window) {
        'ngInject';

        this.context           = $state.current.name === UI_ENUMS.STATE_NAME.JOB_NEW ? 'new' : 'edit';
        this.JOB_STATUS        = UI_ENUMS.JOB_STATUS;

        this.ratingTypeOptions = UI_ENUMS.RATING_TYPES;
        this.DialogService     = DialogService;
        this.JobsService       = JobsService;
        this.$window           = $window;

        this.DIALOG            = UI_ENUMS.DIALOG.CONFIRM_CHANGE_SAMPLE_SET;
    }

    $onInit () {
        if (this.$window.innerWidth <= 480) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }

        this.isSampleSet       = this.job.Secondary.length > 0;
        this.currentLocation   = this.job.Primary.HouseId;

        const ratingStarted    = this.ratingStarted(this.job);
        this.canEditSampleSet  = !ratingStarted;
        this.canEditRatingType = !ratingStarted;
        this.canEditHouesPlans = !ratingStarted;

        this.testingBtnGroup = {
          EnergyGauge: {
            Key: 'energy-gauge',
            Name: 'EnergyGauge'
          },
          RemRate: {
            Key: 'rem-rate',
            Name: 'REM / Ekotrope'
          }
        }
        
        this.dropdownText = 'Sample 1 (Primary)';
    }

    ratingStarted (job) {
        const progress = job.Progress;
        let total      = 0;

        if (job.JobInitiated) {
            return true;
        }

        if (!progress) {
            return false;
        }

        total += progress.PreDrywall.MustCorrect;
        total += progress.PreDrywall.Verified;

        total += progress.Final.MustCorrect;
        total += progress.Final.Verified;

        return total > 0;
    }

    setTab (houseId) {
        this.currentLocation = houseId;

        switch (houseId) {
        case this.job.Primary.HouseId:
            this.dropdownText = 'Sample 1 (Primary)';
            break;
        default:
            this.job.Secondary.map((job, index) => {
                if(job.HouseId === houseId) {
                    this.dropdownText = `Sample ${index + 2}`;
                }
            });
        }
    }

    ariaCurrent (houseId) {
        return this.currentLocation === houseId;
    }

    onSubmit () {
        this.submitJob({
            job : this.job
        });
    }

    onCancel () {
        window.history.back();
    }

    setRatingType (ratingType) {
        this.job.RatingType = ratingType[0];
    }

    setHousePlanType (housePlanType) {
        this.job.HousePlanVendor = (
          function(housePlanType) {
            switch(housePlanType) {
              case 'rem-rate':
                return {
                  Vendor: 'REMRATE',
                  Version: '15.7'
                }
              case 'energy-gauge':
                return {
                  Vendor: 'ENERGYGAUGE',
                  Version: '15.7'
                }
            }
          }
        )(housePlanType[0]);
    }

    addSample () {
        if (!this.canAddSample) {
            return;
        }

        this.job.Secondary.push(this.JobsService.getNewSample());

        this.setTab(this.job.Secondary[this.job.Secondary.length - 1].HouseId);
    }

    deleteSample () {
        let index = _findIndex(this.job.Secondary, {HouseId : this.currentLocation});

        if (index === 0) {
            this.setTab(this.job.Primary.HouseId);
        } else {
            this.setTab(this.job.Secondary[index - 1].HouseId);
        }

        this.job.Secondary.splice(index, 1);
    }

    clearAllSamples () {
        this.setTab(this.job.Primary.HouseId);

        this.job.Secondary = [];
    }

    handleSampleSetToggleChange (isOn) {
        if (this.isSampleSet && !isOn) {
            this.clearAllSamples();
        }
        this.isSampleSet = isOn;
    }

    get canAddSample () {
        return (this.isSampleSet && this.job.Secondary.length < (MAX_SAMPLE_SIZE - 1));
    }

    get canDeleteLocation () {
        return this.currentLocation !== this.job.Primary.HouseId;
    }
}

export default JobDetailController;

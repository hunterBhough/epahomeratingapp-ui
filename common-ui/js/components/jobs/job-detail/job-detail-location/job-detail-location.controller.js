/* eslint-disable no-nested-ternary */
/* global File, FileReader */

import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import xmlToJSON from 'xmltojson';

class JobDetailLocationController {
    constructor (UI_ENUMS, $scope, $timeout, S3_CONFIG, DialogService, $q) {
        'ngInject';

        this.ratingTypeOptions      = UI_ENUMS.RATING_TYPES;
        this.showDetails            = 'HousePlanLibrary';
        this.showFileDetails        = 'File';

        this.$scope                 = $scope;
        this.$timeout               = $timeout;
        this.s3Bucket               = `${S3_CONFIG.S3_BUCKET_NAME_PREFIX}-rating-company`;
        this.DialogService          = DialogService;
        this.$q                     = $q;
    }

    $onInit () {
        this.gatherReports();
    }

    //might not need
    generateHvacFileLinks (files) {
        return files.map((file) => {
            return 'https://s3.amazonaws.com/' + this.s3Bucket + '/' + file.Key;
        });
    }

    gatherReports () {
        let hvacDesignReports           = [];
        let raterDesignReviewChecklists = [];

        this.location.HousePlan.forEach((housePlan) => {
            let locationHousePlan = _find(this.housePlans.housePlan, {_id : housePlan._id});

            //Skip house plans uploaded from computer
            if (locationHousePlan === undefined) {
                return;
            }

            if (locationHousePlan.HvacDesignReport && locationHousePlan.HvacDesignReport.length > 0) {
                hvacDesignReports.push(...locationHousePlan.HvacDesignReport);
            }
            if (locationHousePlan.RaterDesignReviewChecklist && locationHousePlan.RaterDesignReviewChecklist.length > 0) {
                raterDesignReviewChecklists.push(...locationHousePlan.RaterDesignReviewChecklist);
            }
        });

        this.housePlansHVACDesignReports           = hvacDesignReports;
        this.housePlansRaterDesignReviewChecklists = raterDesignReviewChecklists;
    }

    libraryHousePlanOnSelect () {
        // auto pop builder name
        if (this.location.HousePlan.length === 0) {
            return;
        }

        const selectedHousePlan = _find(this.housePlans.housePlan, (o) => {
            return o._id === this.location.HousePlan[0]._id;
        });

        if (selectedHousePlan !== undefined) {
            this.location.Builder                             = _isEmpty(selectedHousePlan.BuilderName) ? '' : selectedHousePlan.BuilderName;
            this.location.AddressInformation.CommunityName    = _isEmpty(selectedHousePlan.CommunityName) ? '' : selectedHousePlan.CommunityName;
            this.location.AddressInformation.Address1         = _isEmpty(selectedHousePlan.StreetAddress) ? '' : selectedHousePlan.StreetAddress;
            this.location.AddressInformation.CityMunicipality = _isEmpty(selectedHousePlan.City) ? '' : selectedHousePlan.City;
            this.location.AddressInformation.StateCode        = _isEmpty(selectedHousePlan.State) ? '' : selectedHousePlan.State;
            this.location.AddressInformation.ZipCode          = _isEmpty(selectedHousePlan.ZipCode) ? '' : selectedHousePlan.ZipCode;
            this.location.HvacDesignReport                    = _isEmpty(selectedHousePlan.HvacDesignReport) ? [] : selectedHousePlan.HvacDesignReport;
            this.location.RaterDesignReviewChecklist          = _isEmpty(selectedHousePlan.RaterDesignReviewChecklist) ? [] : selectedHousePlan.RaterDesignReviewChecklist;
        }

        this.gatherReports();
    }

    localHousePlanOnSelect () {
        let self = this;

        this.$timeout(function waitFormRender () {
            if (self.location.HousePlan[0] instanceof File) {

                let reader = new FileReader();
                reader.readAsText(self.location.HousePlan[0]);

                reader.onloadend = function readXMLSuccess () {
                    let remJSON = xmlToJSON.parseString(reader.result, {childrenAsArray : false});

                    // const setHousePlanType = (housePlanType) => {
                    //     switch (housePlanType) {
                    //     case 'rem-rate':
                    //         return {
                    //             Vendor  : 'REMRATE',
                    //             Version : '15.7',
                    //         };
                    //     case 'energy-gauge':
                    //         return {
                    //             Vendor  : 'ENERGYGAUGE',
                    //             Version : '15.7',
                    //         };
                    //     }
                    // };

                    let parseRem = () => {
                        self.location.Builder                             = remJSON.buildingfile.building.projectinfo.buildername && remJSON.buildingfile.building.projectinfo.buildername._text ? _isEmpty(remJSON.buildingfile.building.projectinfo.buildername._text.toString()) ? '' : remJSON.buildingfile.building.projectinfo.buildername._text.toString() : '';
                        self.location.AddressInformation.CommunityName    = remJSON.buildingfile.building.projectinfo.developmentname && remJSON.buildingfile.building.projectinfo.developmentname._text ? _isEmpty(remJSON.buildingfile.building.projectinfo.developmentname._text.toString()) ? '' : remJSON.buildingfile.building.projectinfo.developmentname._text.toString() : '';
                        self.location.AddressInformation.Address1         = remJSON.buildingfile.building.projectinfo.propertyaddress && remJSON.buildingfile.building.projectinfo.propertyaddress._text ? _isEmpty(remJSON.buildingfile.building.projectinfo.propertyaddress._text.toString()) ? '' : remJSON.buildingfile.building.projectinfo.propertyaddress._text.toString() : '';
                        self.location.AddressInformation.CityMunicipality = remJSON.buildingfile.building.projectinfo.propertycity && remJSON.buildingfile.building.projectinfo.propertycity._text ? _isEmpty(remJSON.buildingfile.building.projectinfo.propertycity._text.toString()) ? '' : remJSON.buildingfile.building.projectinfo.propertycity._text.toString() : '';
                        self.location.AddressInformation.StateCode        = remJSON.buildingfile.building.projectinfo.propertystate && remJSON.buildingfile.building.projectinfo.propertystate._text ? _isEmpty(remJSON.buildingfile.building.projectinfo.propertystate._text.toString()) ? '' : remJSON.buildingfile.building.projectinfo.propertystate._text.toString() : '';
                        self.location.AddressInformation.ZipCode          = remJSON.buildingfile.building.projectinfo.propertyzip && remJSON.buildingfile.building.projectinfo.propertyzip._text ? _isEmpty(remJSON.buildingfile.building.projectinfo.propertyzip._text.toString()) ? '' : remJSON.buildingfile.building.projectinfo.propertyzip._text.toString() : '';
                    };

                    let parseEnergy = () => {
                        self.location.Builder = remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.BUILDER && remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.BUILDER._text ? _isEmpty(remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.BUILDER._text.toString()) ? '' : remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.BUILDER._text.toString() : '';
                        self.location.AddressInformation.CommunityName = remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.DEVELOPMENT && remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.DEVELOPMENT._text ? _isEmpty(remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.DEVELOPMENT._text.toString()) ? '' : remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.DEVELOPMENT._text.toString() : '';
                        self.location.AddressInformation.Address1 = remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ADDRESS && remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ADDRESS._text ? _isEmpty(remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ADDRESS._text.toString()) ? '' : remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ADDRESS._text.toString() : '';
                        self.location.AddressInformation.CityMunicipality = remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.CITY && remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.CITY._text ? _isEmpty(remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.CITY._text.toString()) ? '' : remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.CITY._text.toString() : '';
                        self.location.AddressInformation.StateCode = remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.STATE && remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.STATE._text ? _isEmpty(remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.STATE._text.toString()) ? '' : remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.STATE._text.toString() : '';
                        self.location.AddressInformation.ZipCode = remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ZIP && remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ZIP._text ? _isEmpty(remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ZIP._text.toString()) ? '' : remJSON.ENERGYGAUGE.TEMPPROJ.TEMPPROJRecord.ZIP._text.toString() : '';
                    };

                    // if (remJSON.buildingfile && self.job.HousePlanVendor.Vendor !== 'ENERGYGAUGE') {
                    //     try {
                    //         self.job.HousePlanVendor = setHousePlanType('rem-rate');
                    //         parseRem();
                    //     } catch (error) {
                    //         self.location.HousePlan.pop();
                    //         self.DialogService
                    //             .openDialog('dialog-parse-error');
                    //     }
                    // } else if (remJSON.ENERGYGAUGE && self.job.HousePlanVendor.Vendor !== 'REMRATE') {
                    //     try {
                    //         self.job.HousePlanVendor = setHousePlanType('energy-gauge');
                    //         parseEnergy();
                    //     } catch (error) {
                    //         self.location.HousePlan.pop();
                    //         self.DialogService
                    //             .openDialog('dialog-parse-error');
                    //     }
                    // } else {
                    //     self.location.HousePlan.pop();
                    //     self.DialogService
                    //         .openDialog('dialog-parse-error');
                    // }
                    switch (self.job.HousePlanVendor.Vendor) {
                    case 'ENERGYGAUGE':
                        try {
                            parseEnergy();
                        } catch (error) {
                            self.DialogService
                                .openDialog('dialog-parse-error');
                        }
                        break;
                    case 'REMRATE':
                        try {
                            parseRem();
                        } catch (error) {
                            self.DialogService
                                .openDialog('dialog-parse-error');
                        }
                        break;
                    }

                    self.location.HvacDesignReport                    = [];
                    self.location.RaterDesignReviewChecklist          = [];
                    self.$scope.$apply();
                };
            }
        });
    }
}

export default JobDetailLocationController;

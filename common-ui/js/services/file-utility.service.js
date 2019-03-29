/* global File */

class FileUtilityService {

    constructor ($log) {
        'ngInject';
    }

    /**
     * Check if file is PDF and less than 2 MB
     * @param  {File}      file file to validify
     * @return {Boolean}   validity
     */
    isValidPdf (file) {
        return file.type === 'application/pdf' && ((file.size / 1048576) < 2);
    }

    gatherJobFiles (job) {
        let jobFileMap = {};
        let jobFiles   = [];

        job.Primary.HvacDesignReport.forEach((hvacDesignReport, index) => {
            if (hvacDesignReport instanceof File) {
                const token = `Primary:0:HvacDesignReport:${hvacDesignReport.name}`;

                jobFiles.push({
                    file  : hvacDesignReport,
                    token : token
                });

                jobFileMap[token] = {
                    type      : 'Primary',
                    index     : 0,
                    fileType  : 'HvacDesignReport',
                    fileIndex : index
                };
            }
        });

        job.Primary.RaterDesignReviewChecklist.forEach((raterDesignReviewChecklist, index) => {
            if (raterDesignReviewChecklist instanceof File) {
                const token = `Primary:0:RaterDesignReviewChecklist:${raterDesignReviewChecklist.name}`;

                jobFiles.push({
                    file  : raterDesignReviewChecklist,
                    token : token
                });

                jobFileMap[token] = {
                    type      : 'Primary',
                    index     : 0,
                    fileType  : 'RaterDesignReviewChecklist',
                    fileIndex : index
                };
            }
        });

        job.Secondary.forEach((location, locationIndex) => {
            location.HvacDesignReport.forEach((hvacDesignReport, index) => {
                if (hvacDesignReport instanceof File) {
                    const token = `Secondary:${locationIndex}:HvacDesignReport:${hvacDesignReport.name}`;

                    jobFiles.push({
                        file  : hvacDesignReport,
                        token : token
                    });

                    jobFileMap[token] = {
                        type      : 'Secondary',
                        index     : locationIndex,
                        fileType  : 'HvacDesignReport',
                        fileIndex : index
                    };
                }
            });

            location.RaterDesignReviewChecklist.forEach((raterDesignReviewChecklist, index) => {
                if (raterDesignReviewChecklist instanceof File) {
                    const token = `Secondary:${locationIndex}:RaterDesignReviewChecklist:${raterDesignReviewChecklist.name}`;

                    jobFiles.push({
                        file  : raterDesignReviewChecklist,
                        token : token
                    });

                    jobFileMap[token] = {
                        type      : 'Secondary',
                        index     : locationIndex,
                        fileType  : 'RaterDesignReviewChecklist',
                        fileIndex : index
                    };
                }
            });
        });

        return {
            jobFiles,
            jobFileMap
        };
    }
}

export default FileUtilityService;

import MANUFACTURERS from './components/common/enums/manufacturers';

const CATEGORIES = {
    'walls' : {
        Name : 'Walls',
        Key  : 'Walls'
    },
    'ceilings-roof' : {
        Name : 'Ceilings & Roofs',
        Key  : 'CeilingsRoofs'
    },
    'foundation-floors' : {
        Name : 'Foundation & Floors',
        Key  : 'FoundationFloors'
    },
    'tests' : {
        Name : 'Tests',
        Key  : 'Tests'
    },
    'hvac-water' : {
        Name : 'HVAC & Water',
        Key  : 'HvacWater'
    },
    'plugloads-lighting-pv' : {
        Name : 'Plug Loads, Lighting, PV',
        Key  : 'PlugLoadsLightingPv'
    }
};

const HISTORY_CATEGORIES = {
    'EDITED'  : 'EDITED',
    'MANAGE'  : 'MANAGE',
    'STATUS'  : 'STATUS',
    'UNKNOWN' : 'UNKNOWN'
};

const HISTORY_SUBCATEGORIES = {
    'EDITED' : {
        'COMMENT'           : 'COMMENT',
        'COMMENT_PHOTO'     : 'COMMENT_PHOTO',
        'PROVIDER_COMMENT'  : 'PROVIDER_COMMENT',
        'EDIT_MRF'          : 'EDIT_MRF',
        'PHOTO'             : 'PHOTO',
        'UPDATE_PREDRYWALL' : 'UPDATE_PREDRYWALL',
        'UPDATE_FINAL'      : 'UPDATE_FINAL'
    },
    'STATUS' : {
        'COMPLETED'             : 'COMPLETED',
        'INTERNAL_REVIEW'       : 'INTERNAL_REVIEW',
        'PROVIDER_COMMENT'      : 'PROVIDER_COMMENT',
        'SUBMITTED_TO_PROVIDER' : 'SUBMITTED_TO_PROVIDER',
        'DECLINED_BY_PROVIDER'  : 'DECLINED_BY_PROVIDER',
        'REGISTERED'            : 'REGISTERED'
    },
    'MANAGE' : {
        'CREATED'    : 'CREATED',
        'DELETED'    : 'DELETED',
        'UNDELETED'  : 'UNDELETED',
        'ARCHIVED'   : 'ARCHIVED',
        'UNARCHIVED' : 'UNARCHIVED',
        'UPDATED'    : 'UPDATED'
    }
};

const HISTORY_TITLES = {
    'EDITED' : {
        'COMMENT'           : 'comment(s)',
        'COMMENT_PHOTO'     : 'photo(s) in comment(s)',
        'PROVIDER_COMMENT'  : 'provider comment updated', // this is deprecated in favor of the 'STATUS.PROVIDER_COMMENT' records. keeping here for existing records
        'EDIT_MRF'          : 'minimum rated feature(s) edited',
        'PHOTO'             : 'elevation photo(s)',
        'UPDATE_PREDRYWALL' : 'pre-drywall status update(s)',
        'UPDATE_FINAL'      : 'final status update(s)'
    },
    'STATUS' : {
        'COMPLETED'             : 'Completed',
        'INTERNAL_REVIEW'       : 'Flagged for Internal Review',
        'SUBMITTED_TO_PROVIDER' : 'Submitted to Provider',
        'DECLINED_BY_PROVIDER'  : 'Declined by Provider',
        'REGISTERED'            : 'Marked as Registered',
        'PROVIDER_COMMENT'      : 'Job Comments Edited',
    },
    'MANAGE' : {
        'CREATED'    : 'Created',
        'DELETED'    : 'Deleted',
        'UNDELETED'  : 'Restored',
        'ARCHIVED'   : 'Archived',
        'UNARCHIVED' : 'Restored from Archive',
        'UPDATED'    : 'Updated'
    },
    'UNKNOWN' : {
        'UNKNOWN'    : 'Unknown'
    }
};

const HISTORY_SHORT_DESCRIPTION = {
    'EDITED' : 'Edited',
    'STATUS' : {
        'COMPLETED'             : 'Completed',
        'INTERNAL_REVIEW'       : 'Flagged',
        'SUBMITTED_TO_PROVIDER' : 'Submitted',
        'DECLINED_BY_PROVIDER'  : 'Declined',
        'REGISTERED'            : 'Registered',
        'PROVIDER_COMMENT'      : 'Job Comment'
    },
    'MANAGE' : {
        'CREATED'    : 'Created',
        'DELETED'    : 'Deleted',
        'UNDELETED'  : 'Restored',
        'ARCHIVED'   : 'Archived',
        'UNARCHIVED' : 'Restored',
        'UPDATED'    : 'Updated'
    }
};

const CATEGORY_PROGRESS = {
    'pre-drywall' : {
        Name : 'Pre-Drywall',
        Key  : 'PreDrywall'
    },
    'final' : {
        Name : 'Final',
        Key  : 'Final'
    }
};

const CONTEXT = {
    'APP'   : 'app',
    'ADMIN' : 'admin'
};

const CHECKLIST_ITEM_STATUS = {
    'to-do' : {
        Name : 'To-do',
        Key  : 'ToDo'
    },
    'must-correct' : {
        Name : 'Must Correct',
        Key  : 'MustCorrect'
    }
};

const DIALOG = {
    ADD_PROVIDER_COMPANY      : 'dialog-add-provider-company',
    ADD_RATING_COMPANY        : 'dialog-add-rating-company',
    CONFIRM_CHANGE_SAMPLE_SET : 'dialog-confirm-change-sample-set',
    REMOVE_PROVIDER_COMPANY   : 'dialog-remove-provider-company',
    REMOVE_RATING_COMPANY     : 'dialog-remove-rating-company',
    MAKE_JOB_OFFLINE          : 'dialog-make-job-offline',
    UNDO_JOB_OFFLINE          : 'dialog-undo-job-offline',
    LEAKAGE_TEST_EXEMPTION    : 'dialog-leakage-test-exemption',
    SUBMIT_TO_PROVIDER        : 'dialog-submit-to-provider',
    DECLINE_JOB               : 'dialog-decline-jobs',
    DELETE_JOB                : 'dialog-delete-job',
    ARCHIVE_JOB               : 'dialog-archive-job',
    DOWNLOAD_ERROR            : 'dialog-download-error',
    DOCUMENT_VIEWER_ERROR     : 'dialog-document-viewer-error'
};

const DROPDOWN = {
    JOB_INFO            : 'dropdown-job-info',
    USER_MENU           : 'user-menu',
    USER_COMPANIES_MENU : 'user-companies-menu'
};

const IMAGES = {
    DEFAULT_PHOTO : 'img/job-photo-default.svg'
};

const ELEVATION_PHOTOS = [
    {
        Key  : 0,
        Name : 'Front (main)'
    },
    {
        Key  : 1,
        Name : 'Back'
    },
    {
        Key  : 2,
        Name : 'Left'
    },
    {
        Key  : 3,
        Name : 'Right'
    }
];

const JOB_PAGE_TAB = {
    ACTIVE                : 'Active',
    INTERNAL_REVIEW       : 'Internal Review',
    HISTORY               : 'History',
    OFFLINE_JOBS          : 'Offline Jobs',
    SUBMITTED_TO_PROVIDER : 'Submitted to Provider',
    COMPLETED             : 'Completed'
};

const JOB_STATUS = {
    ACTIVE                : 'Active',
    COMPLETED             : 'Completed',
    SUBMITTED_TO_PROVIDER : 'Submitted to Provider',
    APPROVED              : 'Approved',
    REGISTERED            : 'Registered',
    DELETED               : 'Deleted',
    ARCHIVED              : 'Archived'
};

const JOB_PROGRESS = {
    'active' : {
        Name : 'Active',
        Key  : 'Active'
    },
    'completed' : {
        Name : 'Completed',
        Key  : 'Completed'
    },
    'internal-review' : {
        Name : 'Internal Review',
        Key  : 'InternalReview'
    },
    'submitted-to-provider' : {
        Name : 'Submitted to Provider',
        Key  : 'Submitted to Provider'
    },
    'approved' : {
        Name : 'Approved',
        Key  : 'Approved'
    },
    'registered' : {
        Name : 'Registered',
        Key  : 'Registered'
    },
    'deleted' : {
        Name : 'Deleted',
        Key  : 'Deleted'
    }
};

const MESSAGING = {
    SET_TOP_PAD                      : 'SET_TOP_PAD',
    SET_BOTTOM_PAD                   : 'SET_BOTTOM_PAD',
    UPDATE_HOUSE_PHOTO               : 'UPDATE_HOUSE_PHOTO',
    SHOW_FOOTNOTE                    : 'SHOW_FOOTNOTE',
    UPDATE_CHECKLIST_RESPONSE        : 'UPDATE_CHECKLIST_RESPONSE',
    UPDATE_CHECKLIST_ITEM_DATA       : 'UPDATE_CHECKLIST_ITEM_DATA',
    SET_CHECKLIST_RESPONSE_TOTALS    : 'SET_CHECKLIST_RESPONSE_TOTALS',
    UPDATE_CHECKLIST_RESPONSE_TOTALS : 'UPDATE_CHECKLIST_RESPONSE_TOTALS',
    UPDATE_MRF_DATA                  : 'UPDATE_MRF_DATA',
    POST_COMMENT                     : 'POST_COMMENT',
    VIEW_HVAC_DESIGN_REPORT          : 'VIEW_HVAC_DESIGN_REPORT',
    HOUSE_PLAN_NEW                   : 'HOUSE_PLAN_NEW',
    HOUSE_PLAN_NEW_BULK              : 'HOUSE_PLAN_NEW_BULK',
    HOUSE_PLAN_UPDATE                : 'HOUSE_PLAN_UPDATE',
    HOUSE_PLAN_DELETE                : 'HOUSE_PLAN_DELETE',
    JOB_AVAILABLE_OFFLINE            : 'JOB_AVAILABLE_OFFLINE',
    ASSET_DOWNLOADED                 : 'ASSET_DOWNLOADED',
    ASSET_BEING_UPLOADED_FOR_JOB     : 'ASSET_BEING_UPLOADED_FOR_JOB',
    ASSET_UPLOADED_FOR_JOB           : 'ASSET_UPLOADED_FOR_JOB',
    ALL_JOB_ASSET_FINISHED_SYNCING   : 'ALL_JOB_ASSET_FINISHED_SYNCING',
    DB_START_SYNC                    : 'DB_START_SYNC',
    DB_PAUSE_SYNC                    : 'DB_PAUSE_SYNC',
    DB_ERROR_SYNC                    : 'DB_ERROR_SYNC',
    DEVICE_OFFLINE                   : 'DEVICE_OFFLINE',
    DEVICE_ONLINE                    : 'DEVICE_ONLINE',
    REFRESH_JOBS_LIST                : 'REFRESH_JOBS_LIST',
    REFRESH_JOBS_LIST_FINISH         : 'REFRESH_JOBS_LIST_FINISH',
    USER_AUTHORIZATION_UPDATE        : 'USER_AUTHORIZATION_UPDATE',
    INVALID_JWT                      : 'INVALID_JWT',
    UPDATE_JOB_HISTORY               : 'UPDATE_JOB_HISTORY'
};

const MODAL = {
    COMPLETE_JOB                : 'modal-complete-job',
    DOWNLOAD_REM_XML            : 'modal-download-rem-xml',
    EDIT_HVAC_EQUIPMENT         : 'modal-edit-hvac-equipment',
    EDIT_WATER_HEATER_EQUIPMENT : 'modal-edit-water-heater-equipment',
    EDIT_USER                   : 'modal-edit-user',
    OPEN_JOB                    : 'modal-open-job',
    PROVIDER_JOB_COMMENTS       : 'modal-provider-job-comments',
    SHOW_FOOTNOTE               : 'modal-show-footnote',
    SHOW_HISTORY                : 'modal-show-history'
};

const POPOVER = {
    JOB_SEARCH         : 'job-search-popover',
    HOUSE_PLANS_SEARCH : 'house-plans-search-popover'
};

const ANY = {
    'Any' : {
        Name : 'Any',
        Key  : 'Any'
    },
};

const RATING_TYPES = {
    'EnergyStar' : {
        Name : 'ENERGY STAR Rating',
        Key  : 'energy-star'
    },
    'HERS' : {
        Name : 'HERS Rating Only',
        Key  : 'hers'
    }
};

const JOB_TYPES = {
    'SampleSet' : {
        Name : 'Sample Set',
        Key  : 'sampleSet'
    },
    'IndividualHouse' : {
        Name : 'Individual House',
        Key  : 'individualHouse'
    }
};

const RESPONSES = {
    NotApplicable : {
        Name  : 'N/A',
        Class : 'btn-response',
        Key   : 'NotApplicable'
    },
    BuilderVerified : {
        Name  : 'Builder Verified',
        Class : 'btn-response',
        Key   : 'BuilderVerified'
    },
    MustCorrect : {
        Name  : 'Must Correct',
        Class : 'btn-error',
        Key   : 'MustCorrect'
    },
    RaterVerified : {
        Name  : 'Rater Verified',
        Class : 'btn-response',
        Key   : 'RaterVerified'
    }
};

const SEARCH_PARAMS = {
    AVAILABLE_OFFLINE             : 'availableOffline',
    BUILDER                       : 'builder',
    HOUSE_PLAN                    : 'housePlan',
    INSPECTION_STAGE              : 'inspectionStage',
    INTERNAL_REVIEW               : 'internalReview',
    JOB_TYPE                      : 'jobType',
    KEYWORDS                      : 'keywords',
    MUST_CORRECT                  : 'mustCorrect',
    PROGRESS_LEVEL                : 'progressLevel',
    RATER                         : 'rater',
    RATING_TYPE                   : 'ratingType',
    STATUS                        : 'status',
    PAGE                          : 'page'
};

const HOUSE_PLANS_SEARCH_PARAMS = {
    BUILDER                       : 'builder',
    KEYWORDS                      : 'keywords'
};

const STATUS = {
    LAST_UPDATED    : 'Last Updated :now:',
    UP_TO_DATE      : 'Up to Date',
    SYNCING         : 'Syncing',
    SYNC_INCOMPLETE : 'Sync Incomplete'
};

const STATUS_CLASSNAME = {
    OFFLINE           : 'sync-status-offline', // grey w/ checkmark
    ONLINE_UP_TO_DATE : 'sync-status-online', // green w/ checkmark
    SYNCING           : 'sync-status-syncing', // blue border
    LOCAL_UNSYNCED    : 'sync-status-local-unsynced', // yellow with -
    SYNC_INCOMPLETE   : 'sync-status-incomplete' // red with x
};

const STATE_NAME = {
    DIAGNOSTICS                       : 'diagnostics',
    LOGIN                             : 'login',
    NOT_AUTHORIZED                    : 'not-authorized',
    PROGRESS                          : 'progress',
    TEMPLATE_LIBRARY                  : 'template-library',
    TEMPLATE_LIBRARY_NEW              : 'template-library.new',
    TEMPLATE_LIBRARY_EDIT             : 'template-library.edit',
    TEMPLATE_LIBRARY_EDIT_BULK        : 'template-library.edit-bulk',
    TEMPLATE_LIBRARY_SEARCH           : 'template-library-search',
    TEMPLATE_LIBRARY_SEARCH_NEW       : 'template-library-search.new',
    TEMPLATE_LIBRARY_SEARCH_EDIT      : 'template-library-search.edit',
    TEMPLATE_LIBRARY_SEARCH_EDIT_BULK : 'template-library-search.edit-bulk',
    JOBS                              : 'jobs',
    JOBS_SEARCH                       : 'jobs-search',
    JOBS_PROVIDER                     : 'jobs-provider',
    JOBS_PROVIDER_SEARCH              : 'jobs-provider-search',
    JOB_NEW                           : 'job-new',
    JOB_EDIT                          : 'job-edit',
    JOB_CHECKLIST                     : 'job-checklist',
    JOB_CHECKLIST_CATEGORY            : 'job-checklist.category',
    JOB_CHECKLIST_HISTORY             : 'job-checklist.history',
    JOB_CHECKLIST_INFORMATION         : 'job-checklist.information',
    JOB_CHECKLIST_STATUS              : 'job-checklist.status',
    JOB_CHECKLIST_REVIEW              : 'job-checklist-review',
    JOB_CHECKLIST_REVIEW_CATEGORY     : 'job-checklist-review.category',
    JOB_CHECKLIST_REVIEW_HISTORY      : 'job-checklist-review.history',
    JOB_CHECKLIST_REVIEW_INFORMATION  : 'job-checklist-review.information',
    PRIVACY_POLICY                    : 'privacy-policy',
    SUPPORT                           : 'support',
    SUPPORT_USER_GUIDE                : 'support-user-guide',
    SUPPORT_USER_GUIDE_DESKTOP        : 'support-user-guide-desktop',
    SUPPORT_USER_GUIDE_MOBILE         : 'support-user-guide-mobile',
    SUPPORT_USER_GUIDE_PROVIDER       : 'support-user-guide-provider',
    SUPPORT_FAQ                       : 'support-faq',
    RATING_COMPANIES                  : 'rating-companies',
    PROVIDERS                         : 'providers',
    USERS                             : 'users',
    USER_EDIT                         : 'user-edit',
    USER_RESET_PASSWORD               : 'user-reset-password',
    USER_REGISTER                     : 'user-register',
    USER_SETTINGS                     : 'user-settings'
};

const SYNC_STATUS = {
    UP      : 'sync-up',
    DOWN    : 'sync-down',
    ERROR   : 'sync-error',
    OFFLINE : 'sync-offline'
};

const USER_TYPE = {
    ADMIN       : 'ADMIN',
    RATER       : 'RATER',
    PROVIDER    : 'PROVIDER',
    QA          : 'QA'
};

const VALIDATION_MESSAGE = {
    USER_NAME        : 'Please enter a valid username. Username must be at least 7 characters and can only contain letters, numbers, or the characters "@ _ - ."',
    PASSWORD         : 'Please enter a valid password. Password must be at least 8 characters, contain one uppercase letter, one number, and one special character (@$!%*#?&).',
    CONFIRM_PASSWORD : 'Passwords must be valid and match.'
};

export default {
    CATEGORIES,
    CATEGORY_PROGRESS,
    CHECKLIST_ITEM_STATUS,
    CONTEXT,
    DIALOG,
    DROPDOWN,
    ELEVATION_PHOTOS,
    HISTORY_CATEGORIES,
    HISTORY_SUBCATEGORIES,
    HISTORY_TITLES,
    HISTORY_SHORT_DESCRIPTION,
    IMAGES,
    JOB_PAGE_TAB,
    JOB_STATUS,
    JOB_PROGRESS,
    MANUFACTURERS,
    MESSAGING,
    MODAL,
    POPOVER,
    ANY,
    JOB_TYPES,
    RATING_TYPES,
    RESPONSES,
    SEARCH_PARAMS,
    HOUSE_PLANS_SEARCH_PARAMS,
    STATE_NAME,
    STATUS,
    STATUS_CLASSNAME,
    SYNC_STATUS,
    USER_TYPE,
    VALIDATION_MESSAGE
};

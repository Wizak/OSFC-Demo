const API_URL = process.env.EXPO_PUBLIC_API_URL;
const GALLERY_STORAGE_KEY = process.env.EXPO_PUBLIC_GALLERY_STORAGE_KEY;
const BARCODES_STORAGE_KEY = process.env.EXPO_PUBLIC_BARCODES_STORAGE_KEY;
const USER_SETTINGS_KEY = process.env.EXPO_PUBLIC_USER_SETTINGS_KEY;

const AllowedRolesToUseApp = [ 'osfc_manager', 'osfc_employee' ];
const HumanRole = {
    'osfc_manager': 'Manager',
    'osfc_employee': 'Employee',
};

const YesNoEnum = {
    false: 'No',
    true: 'Yes',
};

const PreviewOnlyExts = ['gif', 'jpg', 'jpeg', 'png', 'pdf'];


export { 
    API_URL, GALLERY_STORAGE_KEY, 
    BARCODES_STORAGE_KEY, USER_SETTINGS_KEY,
    AllowedRolesToUseApp, HumanRole, YesNoEnum,
    PreviewOnlyExts,
};

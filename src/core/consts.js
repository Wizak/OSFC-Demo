const API_URL = process.env.EXPO_PUBLIC_API_URL;
const GALLERY_STORAGE_KEY = process.env.EXPO_PUBLIC_GALLERY_STORAGE_KEY;

const AllowedRolesToUseApp = [ 'osfc_manager', 'osfc_employee' ];
const HumanRole = {
    'osfc_manager': 'Manager',
    'osfc_employee': 'Employee',
};


export { 
    API_URL, GALLERY_STORAGE_KEY, 
    AllowedRolesToUseApp, HumanRole 
};

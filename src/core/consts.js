const GALLERY_STORAGE_KEY = process.env.EXPO_PUBLIC_GALLERY_STORAGE_KEY;
const BARCODES_STORAGE_KEY = process.env.EXPO_PUBLIC_BARCODES_STORAGE_KEY;
const USER_SETTINGS_KEY = process.env.EXPO_PUBLIC_USER_SETTINGS_KEY;
const USER_STORE_KEY = process.env.EXPO_PUBLIC_USER_STORE_KEY;

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
const ApisServersList = [
  {
    label: 'OSFC Production Server',
    value: 'https://osfc.userlogin.eu',
  }, {
    label: 'OSFC Test Server',
    value: 'http://osfc-test.userlogin.eu:8000',
  }, {
    label: 'LeadSoft Test Server',
    value: 'http://ec2-16-16-143-21.eu-north-1.compute.amazonaws.com:8000',
  },
];

const ExecutionEnvironment = { 
  Bare: 'bare', 
  Standalone: 'standalone', 
  StoreClient: 'storeClient',
};


export { 
  GALLERY_STORAGE_KEY, BARCODES_STORAGE_KEY, 
  USER_SETTINGS_KEY, USER_STORE_KEY,
  AllowedRolesToUseApp, HumanRole, YesNoEnum,
  PreviewOnlyExts, ApisServersList, ExecutionEnvironment,
};

// User form data interface
export interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    pin: string;
    vendorSpecificId: string;
  }
  
  // API response interface for prefilling the form
  export interface UserDataApiResponse {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  }
  
  // Database record interface
  export interface UserRecord extends UserFormData {
    timestamp: string;
  }
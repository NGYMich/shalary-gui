import {environment} from "../../../environments/environment";
import {CellClassParams} from "ag-grid-community";

export const commonEducationLevels = ['Bootcamp', 'High School Graduate', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate Degree', 'Other']
export const commonCurrencies = ['EUR (€)', 'USD ($)', 'GBP (£)', 'JPY (¥)', 'CHF (₣)', 'AUD (AU$)', 'CAD (C$)'];
export const commonGenders = ['Male', 'Female']
export const commonContractTypes = ['Full-time', 'Part-time', 'Freelance', 'Internship', 'Apprenticeship']
export const commonSectors = [
  '',
  'Information Technology',
  'Agriculture',
  'Construction',
  'Marketing',
  'Hospitality and catering',
  'Public',
  'Manufacturing',
  'Health',
  'Business',
  'Finance',
  'Education',
  'Telecommunication',
  'Industrial',
  'Tourism, transports and logistics',
  'Real Estate',
  'Culture and sports',
  'Retail',
  'Other'
].sort()

export const commonNgxGraphColorScheme = {domain: ['crimson', 'orange', 'darkgreen', 'darkblue']}


export class AppConstants {
  private static API_BASE_URL = environment.baseUrl;
  private static OAUTH2_URL = AppConstants.API_BASE_URL + "oauth2/authorization/";
  private static REDIRECT_URL = "?redirect_uri=" + environment.baseGuiUrl + "login";
  static API_URL = AppConstants.API_BASE_URL + "api/";
  static AUTH_API = AppConstants.API_URL + "auth/";
  static GOOGLE_AUTH_URL = AppConstants.OAUTH2_URL + "google" + AppConstants.REDIRECT_URL;
  static FACEBOOK_AUTH_URL = AppConstants.OAUTH2_URL + "facebook" + AppConstants.REDIRECT_URL;
  static GITHUB_AUTH_URL = AppConstants.OAUTH2_URL + "github" + AppConstants.REDIRECT_URL;
  static LINKEDIN_AUTH_URL = AppConstants.OAUTH2_URL + "linkedin" + AppConstants.REDIRECT_URL;
  static SIGN_UP_DIALOG_WIDTH = '500px';
  static SIGN_UP_DIALOG_HEIGHT = '600px';
  static LOGIN_DIALOG_WIDTH = '500px';
  static LOGIN_DIALOG_HEIGHT = '550px';

}


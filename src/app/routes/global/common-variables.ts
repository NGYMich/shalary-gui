import {environment} from "../../../environments/environment";
import {CellClassParams} from "ag-grid-community";

export const commonEducationLevels = ['Bootcamp', 'High School Graduate', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate Degree', 'Other']
export const commonCurrencies = ['EUR (€)', 'USD ($)', 'GBP (£)', 'JPY (¥)', 'CHF (₣)', 'AUD (AU$)', 'CAD (C$)'];
export const commonGenders = ['Male', 'Female']
export const commonContractTypes = ['Full-time', 'Part-time', 'Freelance', 'Internship', 'Apprenticeship']
export const commonSectors = [
  'Information Technology (IT)',
  'Health Care',
  'Business',
  'Finance / Banking',
  'Education',
  'Communication Services',
  'Industrials',
  'Hospitality, hotels and restaurants',
  'Energy, water and sanitation',
  'Tourism, transports and travelling',
  'Real Estate',
  'Culture and sports',
  'Other'
]

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

export function totalSalaryCellStyle(params: CellClassParams) {
  let style = {
    height: '100%',
    display: 'flex ',
    'align-items': 'center',
    'background-color': '',
    'color': 'black'
  };
  let salary = params.value;
  if (salary < 3)
    style["background-color"] = ''
  else if (salary < 20000)
    style["background-color"] = '#f8f8e7'
  else if (salary < 30000)
    style["background-color"] = '#f3f3d3'
  else if (salary < 40000)
    style["background-color"] = '#f0f0cb'
  else if (salary < 60000)
    style["background-color"] = '#eeeec3'
  else if (salary < 80000)
    style["background-color"] = '#eaeab3'
  else if (salary >= 80000)
    style["background-color"] = '#d5d56c'
  return style
}


export function totalYearsOfExperienceCellStyle(params: CellClassParams) {
  let style = {height: '100%', display: 'flex ', 'align-items': 'center', 'background-color': '', color: 'black',};
  let experience = params.value;

  if (experience < 3)
    style["background-color"] = '#dadada'
  else if (experience < 6)
    style["background-color"] = '#cdcdcd'
  else if (experience < 9)
    style["background-color"] = '#c0c0c0'
  else if (experience < 20)
    style["background-color"] = '#b4b4b4'
  else if (experience >= 20)
    style["background-color"] = '#a7a7a7'


  return style;
}

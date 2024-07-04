import { IBaseModelAttributes } from "../types";

export interface IProfile<T = string> extends IBaseModelAttributes<T> {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  aboutMe: string;
  profilePhotoUrl: string;
  coverPhotoUrl: string;
  logoUrl: string;
  socialMedias: ISocial[];
  projects: IProject[];
  profileStyle: IProfileStyle;
  educations: IEducation[];
  languages: ILanguage[];
  companies: ICompany[];
  skills: string[];
  awards: IAward[];
  certificates: ICertificate[];
  hobbies: string[];
}

export interface ISocial<T = string> {
  _id: T;
  name: SocialMediasEnum;
  url: string;
}

export enum SocialMediasEnum {
  FACEBOOK = "facebook",
  LinkedIn = "linkedin",
}

export interface IProject<T = string> {
  _id: T;
  name: string;
  link: string;
  description: string;
}

export interface IProfileStyle {
  primaryColor: string;
}

export interface IEducation<T = string> {
  institution?: string;
  _id: T;
}

export interface ILanguage<T = string> {
  _id: T;
  name: string;
  /**SocialMediasEnum
   * proficiency will be number between 0 and 10, based on that number label can be made
   */
  proficiency: number;
}

export interface ICompany<T = string> {
  _id: T;
  companyName: string;
  industry: string;
  jobTitle: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorksHere: boolean;
}

export interface IAward<T = string> {
  _id: T;
  title: string;
  name: string;
  awardedOn: Date;
  description: string;
}
export interface ICertificate<T = string> {
  _id: T;
  title: string;
  name: string;
  issuedBy: string;
  awardedOn: Date;
}

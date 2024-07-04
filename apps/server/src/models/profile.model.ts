import mongoose, { Schema, Document } from "mongoose";
import {
  IAward,
  ICertificate,
  ICompany,
  IEducation,
  ILanguage,
  IProfile,
  IProfileStyle,
  IProject,
  ISocial,
  SocialMediasEnum,
} from "@repo/types/lib/schema/profile";
import { baseSchema } from "./baseSchema";

const SocialSchema = new Schema<ISocial<mongoose.Types.ObjectId>>({
  ...baseSchema,
  name: { type: String, enum: Object.values(SocialMediasEnum), required: true },
  url: { type: String, required: true },
});

const ProjectSchema = new Schema<IProject<mongoose.Types.ObjectId>>({
  ...baseSchema,
  name: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
});

const ProfileStyleSchema = new Schema<IProfileStyle>({
  primaryColor: { type: String, required: true },
});

const EducationSchema = new Schema<IEducation<mongoose.Types.ObjectId>>({
  ...baseSchema,
  institution: { type: String, required: false },
});

const LanguageSchema = new Schema<ILanguage<mongoose.Types.ObjectId>>({
  ...baseSchema,
  name: { type: String, required: true },
  proficiency: { type: Number, min: 0, max: 10, required: true },
});

const CompanySchema = new Schema<ICompany<mongoose.Types.ObjectId>>({
  ...baseSchema,
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  jobTitle: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyWorksHere: { type: Boolean, required: true },
});

const AwardSchema = new Schema<IAward<mongoose.Types.ObjectId>>({
  ...baseSchema,
  title: { type: String, required: true },
  name: { type: String, required: true },
  awardedOn: { type: Date, required: true },
  description: { type: String, required: true },
});

const CertificateSchema = new Schema<ICertificate<mongoose.Types.ObjectId>>({
  ...baseSchema,
  title: { type: String, required: true },
  name: { type: String, required: true },
  issuedBy: { type: String, required: true },
  awardedOn: { type: Date, required: true },
});

// Define the Profile schema
const ProfileSchema = new Schema<IProfile<mongoose.Types.ObjectId>>(
  {
    ...baseSchema,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    aboutMe: { type: String, required: true },
    profilePhotoUrl: { type: String, required: true },
    coverPhotoUrl: { type: String, required: true },
    logoUrl: { type: String, required: true },
    socialMedias: { type: [SocialSchema], required: true },
    projects: { type: [ProjectSchema], required: true },
    profileStyle: { type: ProfileStyleSchema, required: true },
    educations: { type: [EducationSchema], required: true },
    languages: { type: [LanguageSchema], required: true },
    companies: { type: [CompanySchema], required: true },
    skills: { type: [String], required: true },
    awards: { type: [AwardSchema], required: true },
    certificates: { type: [CertificateSchema], required: true },
    hobbies: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

export const ProfileModel = mongoose.model<IProfile<mongoose.Types.ObjectId>>(
  "Profile",
  ProfileSchema
);

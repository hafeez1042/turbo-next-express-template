import { IProfile } from "@repo/types/lib/schema/profile";
import { Repository } from "./Repository";
import mongoose, { FilterQuery } from "mongoose";
import { ProfileModel } from "../models/profile.model";

class ProfileRepository extends Repository<
  IProfile,
  IProfile<mongoose.Types.ObjectId>
> {
  constructor() {
    super(ProfileModel);
  }

  getSearchQuery = (searchString: string): FilterQuery<any> => {
    return { role: { $regex: searchString, $options: "i" } };
  };

  accessor(item) {
    return item.toJSON();
  }

  mutator(item) {
    return {
      ...item,
    };
  }
}

const profileRepository = new ProfileRepository();
export { profileRepository };

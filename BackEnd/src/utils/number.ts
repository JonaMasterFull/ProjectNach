import { User } from "../models/user";

export const getNextConsecutive = async (storeType: "Elektra" | "ShopingBaz"): Promise<number> => {
    const lastUser = await User.findOne({ storeType })
      .sort({ consecutiveNumber: -1 })
      .select("consecutiveNumber");
  
    return (lastUser?.consecutiveNumber ?? 0) + 1;
  }
  
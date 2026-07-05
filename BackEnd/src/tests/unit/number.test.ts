import { User } from "../../models/user";
import { getNextConsecutive } from "../../utils/number";

jest.mock("../../models/user", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe("getNextConsecutive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve 1 si no hay usuarios previos", async () => {
    (User.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      }),
    });

    await expect(getNextConsecutive("Elektra")).resolves.toBe(1);
  });

  it("incrementa el último consecutivo", async () => {
    (User.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ consecutiveNumber: 5 }),
      }),
    });

    await expect(getNextConsecutive("ShopingBaz")).resolves.toBe(6);
  });
});

import { describe, expect, it, vi } from "vitest";
import { usersCreate } from "../../welcome/actions/usersCreate.action";
import { usersApi } from "../../welcome/api/users.api";
import { encryptName } from "../../utils/crypto";

vi.mock("../../welcome/api/users.api", () => ({
  usersApi: {
    post: vi.fn(),
  },
}));

vi.mock("../../utils/crypto", () => ({
  encryptName: vi.fn(),
}));

describe("usersCreate", () => {
  it("encripta el nombre y envía storeType al API", async () => {
    vi.mocked(encryptName).mockResolvedValue("nombre-encriptado");
    vi.mocked(usersApi.post).mockResolvedValue({
      data: {
        numeroEncriptado: "num-enc",
        encryptedName: "nombre-encriptado",
        storeType: "Elektra",
      },
    });

    const result = await usersCreate("María", "Elektra");

    expect(encryptName).toHaveBeenCalledWith("María");
    expect(usersApi.post).toHaveBeenCalledWith("/users", {
      encryptedName: "nombre-encriptado",
      storeType: "Elektra",
    });
    expect(result.numeroEncriptado).toBe("num-enc");
  });
});

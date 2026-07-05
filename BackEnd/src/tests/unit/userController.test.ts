import { Request, Response } from "express";
import { createUserController } from "../../controllers/userController";
import { User } from "../../models/user";
import { getNextConsecutive } from "../../utils/number";
import { encryptConsecutive } from "../../utils/crypto";

jest.mock("../../models/user");
jest.mock("../../utils/number");
jest.mock("../../utils/crypto");

const mockResponse = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status } as unknown as Response;
  return { res, status, json };
}

describe("createUserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("responde 400 si falta encryptedName", async () => {
    const req = { body: { storeType: "Elektra" } } as Request;
    const { res, status, json } = mockResponse();

    await createUserController(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("encryptedName"),
      }),
    );
  });

  it("responde 400 si storeType es inválido", async () => {
    const req = {
      body: { encryptedName: "abc", storeType: "Otro" },
    } as Request;
    const { res, status, json } = mockResponse();

    await createUserController(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("storeType"),
      }),
    );
  });

  it("responde 201 al crear usuario correctamente", async () => {
    (getNextConsecutive as jest.Mock).mockResolvedValue(1);
    (User.create as jest.Mock).mockResolvedValue({});
    (encryptConsecutive as jest.Mock).mockReturnValue("encrypted-num");

    const req = {
      body: { encryptedName: "nombre-enc", storeType: "Elektra" },
    } as Request;
    const { res, status, json } = mockResponse();

    await createUserController(req, res);

    expect(getNextConsecutive).toHaveBeenCalledWith("Elektra");
    expect(User.create).toHaveBeenCalledWith({
      consecutiveNumber: 1,
      encryptedName: "nombre-enc",
      storeType: "Elektra",
    });
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      numeroEncriptado: "encrypted-num",
      encryptedName: "nombre-enc",
      storeType: "Elektra",
    });
  });

  it("responde 409 en conflicto de índice único", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getNextConsecutive as jest.Mock).mockResolvedValue(1);
    (User.create as jest.Mock).mockRejectedValue({ code: 11000 });

    const req = {
      body: { encryptedName: "nombre-enc", storeType: "Elektra" },
    } as Request;
    const { res, status, json } = mockResponse();

    await createUserController(req, res);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Conflicto"),
      }),
    );

    errorSpy.mockRestore();
  });

  it("responde 500 cuando ocurre un error inesperado", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getNextConsecutive as jest.Mock).mockRejectedValue(new Error("DB caída"));

    const req = {
      body: { encryptedName: "nombre-enc", storeType: "Elektra" },
    } as Request;
    const { res, status, json } = mockResponse();

    await createUserController(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: "Error al crear el usuario",
      error: "DB caída",
    });

    errorSpy.mockRestore();
  });

  it("responde 500 con error que no es instancia de Error", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getNextConsecutive as jest.Mock).mockRejectedValue("fallo raro");

    const req = {
      body: { encryptedName: "nombre-enc", storeType: "Elektra" },
    } as Request;
    const { res, status, json } = mockResponse();

    await createUserController(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: "Error al crear el usuario",
      error: "fallo raro",
    });

    errorSpy.mockRestore();
  });
});

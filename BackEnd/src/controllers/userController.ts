import { Request, Response } from "express";
import { User } from "../models/user";
import { getNextConsecutive } from "../utils/number";
import { encryptConsecutive } from "../utils/crypto";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { encryptedName, storeType } = req.body;

    if (!encryptedName) {
      return res.status(400).json({
        message: "encryptedName es requerido (debe venir encriptado desde el frontend)",
      });
    }

    if (!storeType || !["Elektra", "ShopingBaz"].includes(storeType)) {
      return res.status(400).json({
        message: "storeType es requerido y debe ser Elektra o ShopingBaz",
      });
    }

    const consecutiveNumber = await getNextConsecutive(storeType);

    await User.create({
      consecutiveNumber,
      encryptedName,
      storeType,
    });

    return res.status(201).json({
      numeroEncriptado: encryptConsecutive(consecutiveNumber),
      encryptedName,
      storeType,
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        message: "Conflicto al generar el consecutivo. Intenta de nuevo.",
      });
    }

    return res.status(500).json({
      message: "Error al crear el usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};


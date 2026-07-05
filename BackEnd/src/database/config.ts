import mongoose from "mongoose";
import { environment } from "../config/environment";
import { User } from "../models/user";

export const dbConnection = async (): Promise<void> => {
    try {
        await mongoose.connect(environment.URL_DATABASE);
        await User.syncIndexes();
        console.log('✅ Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
}
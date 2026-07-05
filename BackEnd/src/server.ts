import { environment } from "./config/environment";
import { dbConnection } from "./database/config";
import { createApp } from "./app";

const Server = async () => {
  const app = createApp();
  const port = environment.PORT || 3000;

  try {
    await dbConnection();
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ El puerto ${port} ya está en uso. Usa otro.`);
      process.exit(1);
    }
    console.error(`❌ Error en el servidor: ${err.message}`);
  });
}

Server();

export const getEnvCredentials = (): { secret: string; salt: string } => {
  const secret = import.meta.env.VITE_APP_SECRET;
  const salt = import.meta.env.VITE_SALT;

  if (!secret || !salt) {
    throw new Error("VITE_APP_SECRET y VITE_SALT deben estar definidos en .env");
  }

  return { secret, salt };
};

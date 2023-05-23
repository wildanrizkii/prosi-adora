/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

export const dbConfig = {
  MYSQL_HOST: "localhost",
  MYSQL_PORT: "3306",
  MYSQL_DATABASE: "si apotek adora",
  MYSQL_USER: "root",
  MYSQL_PASSWORD: "",
};

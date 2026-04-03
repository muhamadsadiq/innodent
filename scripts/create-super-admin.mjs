import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return "";
  return process.argv[idx + 1] || "";
}

function printUsage() {
  console.log("Usage:");
  console.log("  npm run admin:create-super -- --email <email> --password <password> --name \"<full name>\"");
  console.log("");
  console.log("Or via environment variables:");
  console.log("  SUPER_ADMIN_EMAIL=<email> SUPER_ADMIN_PASSWORD=<password> SUPER_ADMIN_NAME=\"<full name>\" npm run admin:create-super");
}

async function main() {
  const showHelp = process.argv.includes("--help") || process.argv.includes("-h");
  if (showHelp) {
    printUsage();
    return;
  }

  const email = (getArgValue("--email") || process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = (getArgValue("--password") || process.env.SUPER_ADMIN_PASSWORD || "").trim();
  const name = (getArgValue("--name") || process.env.SUPER_ADMIN_NAME || "Super Admin").trim();

  if (!email || !password) {
    console.error("Missing required values: email and password.");
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      email,
      name,
      password: hash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log(existing ? "Updated existing user to SUPER_ADMIN." : "Created SUPER_ADMIN user.");
  console.log(`Email: ${user.email}`);
  console.log(`Name: ${user.name}`);
  console.log(`Role: ${user.role}`);
}

main()
  .catch((err) => {
    console.error("Failed to create SUPER_ADMIN:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { db } from "./index.js";
import { users } from "./schema/index.js";
import { hashPassword } from "../utils/password.js";
import { logger } from "../utils/logger.js";
import { eq } from "drizzle-orm";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createAdmin() {
  const rl = readline.createInterface({ input, output });

  console.log("\n╔════════════════════════════════════╗");
  console.log("║     Create Admin User              ║");
  console.log("╚════════════════════════════════════╝\n");

  try {
    // name
    let name = "";
    while (!name || name.length < 3 || name.length > 255) {
      name = (await rl.question("Enter admin name (min 3 chars): ")).trim();
      if (name.length < 3) {
        console.log("❌ Name must be at least 3 characters.");
      }
    }

    // email
    let email = "";
    while (!email || !EMAIL_REGEX.test(email)) {
      email = (await rl.question("Enter admin email: ")).trim().toLowerCase();
      if (!EMAIL_REGEX.test(email)) {
        console.log("❌ Please enter a valid email address.");
      }
    }

    // Check if email already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      console.log(`\n❌ A user with email "${email}" already exists.`);
      rl.close();
      process.exit(1);
    }

    // password
    let password = "";
    while (!password || password.length < 6) {
      password = (await rl.question("Enter password (min 6 chars): ")).trim();
      if (password.length < 6) {
        console.log("❌ Password must be at least 6 characters.");
      }
    }

    // confirm password
    const confirmPassword = (
      await rl.question("Confirm password: ")
    ).trim();

    if (password !== confirmPassword) {
      console.log("\n❌ Passwords do not match.");
      rl.close();
      process.exit(1);
    }

    rl.close();

    const hashedPassword = await hashPassword(password);

    const [admin] = await db
      .insert(users)
      .values({
        name,
        email,
        hashedPassword,
        role: "admin",
        emailVerified: true,
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    console.log(`\n✅ Admin user created successfully!`);
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}\n`);

    process.exit(0);
  } catch (err) {
    rl.close();
    logger.error(err, "Failed to create admin user");
    process.exit(1);
  }
}

createAdmin();

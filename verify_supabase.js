const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env manually
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Testing Supabase connection with URL:", url);

async function verify() {
  console.log("\n--- Testing with Service Role Key ---");
  const adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data: users, error: usersErr } = await adminClient.from("users").select("id, email, fullName, role").limit(5);
    if (usersErr) {
      console.error("Error querying users table:", usersErr);
    } else {
      console.log("Success! Found users:", users);
    }

    const { data: profiles, error: profErr } = await adminClient.from("profiles").select("id, displayName, profession").limit(5);
    if (profErr) {
      console.error("Error querying profiles table:", profErr);
    } else {
      console.log("Success! Found profiles:", profiles);
    }
  } catch (err) {
    console.error("Exception testing admin client:", err);
  }

  console.log("\n--- Testing with Anon / Publishable Key ---");
  const anonClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data: pubProfiles, error: pubErr } = await anonClient.from("profiles").select("id, displayName").limit(5);
    if (pubErr) {
      console.log("Anon query response/error (note RLS):", pubErr);
    } else {
      console.log("Success! Anon query found profiles:", pubProfiles);
    }
  } catch (err) {
    console.error("Exception testing anon client:", err);
  }
}

verify();

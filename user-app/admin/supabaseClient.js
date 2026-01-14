import { createClient } from "@supabase/supabase-js";

/* =========================
   SUPABASE CONFIG
========================= */
const supabaseUrl = "https://wbpgmgtoyzlnawvsfeiu.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* =========================
   STORAGE CONFIG
========================= */
const STORAGE_BUCKET = "crunchtime";

/* =========================
   STORAGE HELPERS
========================= */
function getFileExtension(file) {
  return file.name.split(".").pop();
}

function buildPath(folder, id, ext) {
  return `${folder}/${id}.${ext}`;
}

/* =========================
   GENERIC UPLOAD
========================= */
async function uploadFile({ file, folder, id }) {
  const ext = getFileExtension(file);
  const path = buildPath(folder, id, ext);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/* =========================
   STORAGE FUNCTIONS (NEW)
========================= */

// Profile picture
export async function uploadProfilePicture(file, userId) {
  return uploadFile({ file, folder: "profile_pictures", id: userId });
}

// Vendor image
export async function uploadVendorImage(file, vendorId) {
  return uploadFile({ file, folder: "vendor_images", id: vendorId });
}

// Restaurant menu (PDF / image)
export async function uploadRestaurantMenu(file, restaurantId) {
  return uploadFile({ file, folder: "restaurant_menus", id: restaurantId });
}

// Driver documents (license, ID, etc.)
export async function uploadDriverDocument(file, driverId) {
  return uploadFile({ file, folder: "driver_documents", id: driverId });
}

// List files in a folder
export async function listStoredFiles(folder) {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(folder);

  if (error) {
    console.error("List files error:", error);
    return [];
  }
  return data;
}

// Delete stored file
export async function deleteStoredFile(path) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    console.error("Delete file error:", error);
    return false;
  }
  return true;
}

/* =========================
   ADMIN DATA
========================= */
export async function fetchAdmin() {
  const { data, error } = await supabase
    .from("Admin")
    .select(`
      id,
      username,
      income_amount,
      expense_amount,
      withdraw_amount,
      total_income_amount,
      order_total_amount,
      restaurant_name,
      restaurant_menu,
      establishment
    `)
    .single();

  if (error) {
    console.error("Error fetching admin:", error);
    return null;
  }
  return data;
}

/* =========================
   DRIVERS
========================= */
export async function loadDrivers() {
  const { data, error } = await supabase
    .from("Driver")
    .select("id, driver_name, driver_ride_history, driver_payment, status");

  if (error) {
    console.error("Error fetching drivers:", error);
    return;
  }

  const container = document.getElementById("driversContainer");
  if (!container) return;

  container.innerHTML = "";

  data.forEach((driver) => {
    container.innerHTML += `
      <div class="driver-card">
        <h4>${driver.driver_name}</h4>
        <p>Rides: ${driver.driver_ride_history}</p>
        <p>Payment: ${driver.driver_payment}</p>
        <p>Status: ${driver.status ?? "active"}</p>
        <button onclick="cancelDriver('${driver.id}')">Cancel</button>
      </div>
    `;
  });
}

export async function cancelDriver(driverId) {
  const { error } = await supabase
    .from("Driver")
    .update({ status: "canceled" })
    .eq("id", driverId);

  if (error) {
    console.error("Cancel driver failed:", error);
  } else {
    alert("Driver canceled");
    loadDrivers();
  }
}

/* =========================
   VENDORS
========================= */
export async function loadVendors() {
  const { data, error } = await supabase
    .from("Vendor")
    .select("id, vendor_name, items, history_orders");

  if (error) {
    console.error("Error fetching vendors:", error);
    return;
  }

  const container = document.getElementById("vendorsContainer");
  if (!container) return;

  container.innerHTML = "";

  data.forEach((vendor) => {
    container.innerHTML += `
      <div class="vendor-card">
        <h4>${vendor.vendor_name}</h4>
        <p>Items: ${vendor.items}</p>
        <p>Orders: ${vendor.history_orders}</p>
      </div>
    `;
  });
}

/* =========================
   ROLE MANAGEMENT
========================= */
export async function fetchRoleManagement() {
  const { data, error } = await supabase
    .from("role_management")
    .select(`
      user_accounts_email,
      vendor_accounts_email,
      driver_accounts_email
    `);

  if (error) {
    console.error("Role management error:", error);
    return [];
  }

  return data.map((role) => ({
    userEmail: role.user_accounts_email,
    vendorEmail: role.vendor_accounts_email,
    driverEmail: role.driver_accounts_email,
  }));
}

/* =========================
   PAGE LOAD
========================= */
window.onload = async () => {
  if (!window.isAuthenticated) {
    document.getElementById("loginModal").style.display = "flex";
    return;
  }

  document.getElementById("loginModal").style.display = "none";

  initCharts();
  updateMonthlyData("January");

  await loadDrivers();
  await loadVendors();

  const roles = await fetchRoleManagement();
  console.log("Role emails:", roles);
};

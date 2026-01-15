const express = require('express');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

const app = express();
app.use(express.json());

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set securely
const supabase = createClient(supabaseUrl, supabaseKey);

// Twilio credentials from environment variables or hardcoded (not recommended)
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || 'AC031642049dd74fcc581b0fd106936a4f';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '1447e415a2fc483bd2bfbea57451d55d';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+27795349327'; // Twilio phone number

const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Fetch Vendor data
async function fetchVendor() {
  const { data: Vendor, error } = await supabase
    .from('Vendor')
    .select('*');

  if (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }
  return Vendor;
}

// Fetch Drivers data
async function fetchDrivers() {
  const { data: Drivers, error } = await supabase
    .from('Drivers')
    .select(`
      id,
      vendor,
      item,
      price,
      stock,
      email,
      password,
      manage_item,
      manage_orders_Customer_name,
      manage_order_total,
      manage_order_status,
      manage_users,
      payment_history
    `);

  if (error) {
    console.error('Error fetching drivers:', error);
    return null;
  }
  return Drivers;
}

// Fetch Admin data
async function fetchAdmin() {
  const { data: Admin, error } = await supabase
    .from('Admin')
    .select('*')
      .select()
    .single();
  if (error) {
    console.error('Error fetching admin:', error);
    return null;
  }
  return Admin;
}

// CRUD for Vendor
async function createVendor(vendorData) {
  const { data, error } = await supabase
    .from('Vendor')
    .insert([vendorData]);
  if (error) {
    console.error('Error creating vendor:', error);
    return null;
  }
  return data;
}
async function updateVendor(id, updateData) {
  const { data, error } = await supabase
    .from('Vendor')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating vendor:', error);
    return null;
  }
  return data;
}
async function deleteVendor(id) {
  const { data, error } = await supabase
    .from('Vendor')
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error deleting vendor:', error);
    return null;
  }
  return data;
}

// CRUD for Drivers
async function createDriver(driverData) {
  const { data, error } = await supabase
    .from('Drivers')
    .insert([driverData])
    .select()
    .single();
  if (error) {
    console.error('Error creating driver:', error);
    return null;
  }
  return data;
}
async function updateDriver(id, updateData) {
  const { data, error } = await supabase
    .from('Drivers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating driver:', error);
    return null;
  }
  return data;
}
async function deleteDriver(id) {
  const { data, error } = await supabase
    .from('Drivers')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting driver:', error);
    return null;
  }
  return data;
}

// CRUD for Admin
async function createAdmin(adminData) {
  const { data, error } = await supabase
    .from('Admin')
    .insert([adminData])
    .select()
    .single();
  if (error) {
    console.error('Error creating admin:', error);
    return null;
  }
  return data;
}
async function updateAdmin(id, updateData) {
  const { data, error } = await supabase
    .from('Admin')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating admin:', error);
    return null;
  }
  return data;
}
async function deleteAdmin(id) {
  const { data, error } = await supabase
    .from('Admin')
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error deleting admin:', error);
    return null;
  }
  return data;
}

// Payment Record Management
async function createPaymentRecord(amount, item_name, paymentUrl, status='Pending') {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ amount, item_name, payment_url: paymentUrl, status, created_at: new Date() }]);
  if (error) {
    console.error('Error creating payment record:', error);
    return null;
  }
  return data;
}
async function updatePaymentStatus(paymentId, newStatus) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status: newStatus })
    .eq('id', paymentId)
    .select()
    .single();
  if (error) {
    console.error('Error updating payment status:', error);
    return null;
  }
  return data;
}

// SMS sending via Twilio
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;
  try {
    const msg = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });
    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error('Error sending SMS:', err);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Save PayFast payment link and in DB
app.post('/save-payfast-payment', async (req, res) => {
  const { amount, item_name } = req.body;
  const merchantID = '10004002';
  const merchantKey = 'q1cd2rdny4a53';
  const return_url = 'https://yourdomain.com/return';
  const cancel_url = 'https://yourdomain.com/cancel';

  const pfData = {
    merchant_id: merchantID,
    merchant_key: merchantKey,
    amount,
    item_name,
    return_url,
    cancel_url,
  };

  const dataString = Object.keys(pfData)
    .sort()
    .map(k => `${k}=${pfData[k]}`)
    .join('&');
  const signature = crypto.createHash('md5').update(dataString).digest('hex');

  const paymentUrl = `https://www.payfast.co.za/eng/process?${Object.entries(pfData)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')}&signature=${signature}`;

  const paymentRecord = await createPaymentRecord(amount, item_name, paymentUrl);
  if (!paymentRecord) {
    return res.status(500).json({ error: 'Failed to create payment record' });
  }
  res.json({ paymentUrl });
});

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
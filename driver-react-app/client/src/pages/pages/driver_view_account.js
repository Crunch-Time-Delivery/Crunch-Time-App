// Initialize Supabase
  const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY; // actual key
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // Sample driver data; replace with actual data as needed
  const driver = {
    name: 'John',
    surname: 'Doe',
    plate: 'ABC1234',
    contact: '0712345678',
    email: 'john.doe@example.com'
  };

  function loadDriverAccount() {
    const container = document.getElementById('driverAccountContainer');
    container.innerHTML = `
      <h2>Driver Account</h2>
      <div class="card">
        <!-- Profile Icon with overlay button -->
        <div style="position: relative; width: 60px; height: 60px; margin: auto;">
          <div id="profileIcon" style="
            width: 50px; height: 50px; 
            border-radius: 50%; 
            background-color: #ccc; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 24px; 
            color: #fff;
            margin: auto;
            background-size: cover;
            background-position: center;
          ">👤</div>
          <label for="picUpload"></label>
          <input type="file" id="picUpload" accept="image/*" style="display: none;" />
        </div>
        <div class="row"><strong>Name</strong><span>${driver.name} ${driver.surname}</span></div>
        <div class="row"><strong>Plate No</strong><span>${driver.plate}</span></div>
        <div class="row"><strong>Contact</strong><span>${driver.contact}</span></div>
        <div class="row"><strong>Email</strong><span>${driver.email}</span></div>
      </div>
    `;

    // Setup upload handler
    const picInput = document.getElementById('picUpload');
    const profileIcon = document.getElementById('profileIcon');

    // Set "+" icon for label
    const label = document.querySelector("label[for='picUpload']");
    label.innerHTML = "+";

    label.onclick = () => {
      document.getElementById('picUpload').click();
    };

    picInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        profileIcon.style.backgroundImage = `url(${e.target.result})`;
        profileIcon.style.backgroundSize = 'cover';
        profileIcon.textContent = '';
        localStorage.setItem('driverProfilePic', e.target.result);
      };
      reader.readAsDataURL(file);
    });

    // Load saved pic if exists
    const savedPic = localStorage.getItem('driverProfilePic');
    if (savedPic) {
      profileIcon.style.backgroundImage = `url(${savedPic})`;
      profileIcon.style.backgroundSize = 'cover';
      profileIcon.textContent = '';
    }
  }

  // Call the function to load the account page
  loadDriverAccount();

  // Function to load drivers from Supabase
  async function loadDrivers() {
    const { data: Drivers, error } = await supabase
      .from('Drivers')
      .select(`
        id,
        driver_name,
        contact,
        plate_no,
        email
      `);
    document.getElementById('output').textContent = error ? 'Error: ' + error.message : JSON.stringify(Drivers, null, 2);
  }

  // Example: Call loadDrivers() to fetch data
  loadDrivers();
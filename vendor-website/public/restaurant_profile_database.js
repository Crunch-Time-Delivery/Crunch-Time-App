// supabase.js - Single JS file for managing restaurant profiles

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY'; // replace with your actual key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Function to create table and insert initial data (run once)
async function setupDatabase() {
  // Create the table if it doesn't exist
  await supabase
    .rpc('create_restaurants_table')
    .catch(async (err) => {
      if (err.code !== '42710') { // 'duplicate_table' error code
        console.error('Error creating table:', err);
      }
    });

  // Insert initial data
  const initialData = [
    { name: 'KFC, Parow', category: 'Fast Food', rating: 4.4, description: 'Sponsored - 5 min', image_url: 'Images/RS KFC .jpeg' },
    { name: 'Sannes Palace', category: 'Fast Food', rating: 4.5, description: '20 min - 0.5 km', image_url: 'Images/RS PALACE .jpg' },
    { name: 'DK Spot & Kota Restaurant', category: 'Fast Food', rating: 4.0, description: 'Uber Eats HDP-Owned - 16 min - 0.6 km', image_url: 'Images/RS KOTA .jpg' },
    { name: 'Nondyebo Eatery', category: 'Fast Food', rating: 3.3, description: '10 min - 0.6 km', image_url: 'Images/RS NONDYEBO.jpg' },
    { name: 'Rodeo Spur Halaal', category: 'Burgers', rating: 4.4, description: '', image_url: 'Images/spur.jpg' },
    { name: 'RocoMamas Rondebosch', category: 'Burgers', rating: 4.0, description: 'Uber Eats HDP-Owned - 16 min - 0.6 km', image_url: 'Images/img.jpg' },
    { name: 'Krispy King Rondebosch', category: 'Burgers', rating: 3.3, description: '10 min - 0.6 km', image_url: 'Images/fried_chicken.jpg' },
    { name: 'Khao Hom Halal Thai Cuisine', category: 'Asian', rating: 4.4, description: '', image_url: 'Images/download.png' },
    { name: 'Somma Asian Restaurant Rondebosch', category: 'Asian', rating: 4.0, description: 'Uber Eats HDP-Owned - 16 min - 0.6 km', image_url: 'Images/asian_(1).jpg' },
    { name: 'La Inferno\'s Pizzeria (Kromboom)', category: 'Pizza', rating: 4.4, description: 'Sponsored - 5 min - 4.4 km', image_url: 'Images/wood-pizza.png' },
    { name: 'Romans Pizza', category: 'Pizza', rating: 3.3, description: '10 min - 0.6 km', image_url: 'Images/roman_pizza.jpg' },
    { name: 'Debonairs Pizza', category: 'Pizza', rating: 4.0, description: '', image_url: 'Images/download (1).png' },
  ];

  for (const restaurant of initialData) {
    await supabase
      .from('restaurants')
      .upsert(restaurant);
  }

  console.log('Database setup complete.');
}

// Function to fetch all restaurants
async function fetchRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*');
  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
  return data;
}

// Function to update a restaurant profile
async function updateRestaurant(id, updatedData) {
  const { data, error } = await supabase
    .from('restaurants')
    .update(updatedData)
    .eq('id', id);
  if (error) {
    console.error('Error updating restaurant:', error);
    return null;
  }
  return data;
}

// Example usage:

// Uncomment to run setup once
// setupDatabase();

// Fetch all restaurants
// fetchRestaurants().then(restaurants => console.log(restaurants));

// Update example
// updateRestaurant(1, { name: 'Updated Name', rating: 4.7 }).then(updated => console.log('Updated:', updated));
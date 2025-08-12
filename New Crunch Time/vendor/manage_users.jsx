import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey =  process.env.SUPABASE_KEY // replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

function ManageUsers() {
  const [users, setUsers] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  // Fetch users from Supabase on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      alert(error.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchUsers();
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Manage Users</h1>
      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {/* Users Table */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn edit" onClick={() => alert('Edit user logic here')}>Edit</button>
                    <button className="btn delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

ReactDOM.render(<ManageUsers />, document.getElementById('root'));


useEffect(() => {
  const subscription = supabase
    .from('notifications')
    .on('INSERT', payload => {
      console.log('New notification:', payload.new);
      // handle the new data, e.g., show notification or update state
    })
    .subscribe();

  return () => {
    supabase.removeSubscription(subscription);
  };
}, []);
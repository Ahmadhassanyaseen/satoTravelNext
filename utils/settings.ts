export async function getSettings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      websiteTitle: 'Default Title',
      description: 'Default Description',
      logo: '/assets/images/logo.png',
      email: 'contact@example.com',
      phone: '+1234567890',
      address: 'Default Address',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
      },
    };
  }
} 
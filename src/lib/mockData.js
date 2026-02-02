/**
 * Mock Data Utilities
 * Helper functions for creating and managing mock data for development/testing
 */

const MOCK_USERS_KEY = 'mock_users';

/**
 * Create a default mock user for testing
 * @returns {Object} Mock user object
 */
export function createMockUser() {
  return {
    id: 'mock_user_1',
    phone: '09123456789',
    password: '123456',
    name: 'کاربر تست',
  };
}

/**
 * Initialize mock users in localStorage
 * Creates a default mock user if none exists
 */
export function initializeMockUsers() {
  if (typeof window === 'undefined') return;

  try {
    const existingUsers = localStorage.getItem(MOCK_USERS_KEY);
    
    if (!existingUsers) {
      // Create default mock user
      const mockUser = createMockUser();
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([mockUser]));
      console.log('✅ Mock user created:', {
        phone: mockUser.phone,
        password: mockUser.password,
      });
    } else {
      // Check if mock user exists
      const users = JSON.parse(existingUsers);
      const mockUser = createMockUser();
      const userExists = users.some((u) => u.phone === mockUser.phone);
      
      if (!userExists) {
        users.push(mockUser);
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
        console.log('✅ Mock user added:', {
          phone: mockUser.phone,
          password: mockUser.password,
        });
      }
    }
  } catch (error) {
    console.error('Failed to initialize mock users:', error);
  }
}

/**
 * Get mock user credentials for display
 * @returns {Object} Mock user credentials
 */
export function getMockUserCredentials() {
  const mockUser = createMockUser();
  return {
    phone: mockUser.phone,
    password: mockUser.password,
  };
}

/**
 * Clear all mock users (useful for testing)
 */
export function clearMockUsers() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MOCK_USERS_KEY);
  console.log('✅ Mock users cleared');
}


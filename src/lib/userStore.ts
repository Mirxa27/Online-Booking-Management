import { User } from './types';
import bcrypt from 'bcryptjs'; // For creating a dummy user

// In-memory store for users
const users: User[] = [];

// Initialize with dummy data
(async () => {
  if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && users.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    users.push({
      id: '0',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      phone: '123-456-7890',
      bio: 'This is a test user bio.',
      languagePreferences: 'en',
      profilePhotoUrl: '',
      verificationStatus: 'email_verified', // Assuming verified for easier testing of wishlist
      emailVerified: true,
      wishlistIds: ['L1', 'L3'], // Pre-populate with some wishlist items
    });
    const hashedUser2Password = await bcrypt.hash('securepass', 10);
    users.push({
        id: '1', email: 'user2@example.com', password: hashedUser2Password,
        name: 'User Two', phone: '', bio: '', languagePreferences: 'en',
        profilePhotoUrl: '', verificationStatus: 'not_verified', emailVerified: false,
        wishlistIds: [],
    });
    console.log('Mock user store initialized with dummy data, including wishlists.');
  }
})();


export const userDb = {
  async findByEmail(email: string): Promise<User | undefined> {
    return users.find(user => user.email === email);
  },

  async findById(id: string): Promise<User | undefined> {
    return users.find(user => user.id === id);
  },

  async createUser(userData: Omit<User, 'id' | 'verificationStatus' | 'emailVerified' | 'profilePhotoUrl' | 'phone' | 'bio' | 'languagePreferences' | 'name' | 'wishlistIds'> & Partial<User>): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      phone: userData.phone || '',
      bio: userData.bio || '',
      languagePreferences: userData.languagePreferences || 'en',
      profilePhotoUrl: userData.profilePhotoUrl || '',
      verificationStatus: 'not_verified',
      emailVerified: false,
      wishlistIds: [], // Initialize with empty wishlist
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  },

  async addToListingToWishlist(userId: string, listingId: string): Promise<User | undefined> {
    const user = await this.findById(userId);
    if (!user) return undefined;

    if (!user.wishlistIds) {
      user.wishlistIds = [];
    }
    if (!user.wishlistIds.includes(listingId)) {
      user.wishlistIds.push(listingId);
      return this.updateUser(userId, { wishlistIds: user.wishlistIds });
    }
    return user; // Return user even if ID already exists, no change needed
  },

  async removeListingFromWishlist(userId: string, listingId: string): Promise<User | undefined> {
    const user = await this.findById(userId);
    if (!user || !user.wishlistIds) return undefined;

    const initialLength = user.wishlistIds.length;
    user.wishlistIds = user.wishlistIds.filter(id => id !== listingId);

    if (user.wishlistIds.length < initialLength) {
      return this.updateUser(userId, { wishlistIds: user.wishlistIds });
    }
    return user; // Return user even if ID was not found, no change needed
  },

  async getWishlistIds(userId: string): Promise<string[]> {
    const user = await this.findById(userId);
    return user?.wishlistIds || [];
  },

  getAllUsers(): User[] {
    return [...users];
  }
};

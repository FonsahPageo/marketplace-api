import { createUserService, getUserByIdentity } from '../../src/models/userModel.js';
import pool from '../../src/config/db.js';

describe('User Model', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
  });

  it('should create a user', async () => {
    const user = await createUserService(
      'john',
      'doe',
      'johndoe',
      'johndoe@example.com',
      'Password@123', 'user'
    );
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('should get user by username', async () => {
    await createUserService(
      'john',
      'doe',
      'johndoe',
      'johndoe@example.com',
      'Password@123', 'user');
    const user = await getUserByIdentity('johndoe');
    expect(user).not.toBeNull();
    expect(user.username).toBe('johndoe');
  });
});

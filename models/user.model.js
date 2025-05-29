const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT } = require('../config/constants');

const userModel = () => {
  // In-memory store (would be DB in production)
  let users = [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin123', 8),
      role: 'admin'
    },
    {
      id: 2,
      username: 'user',
      password: bcrypt.hashSync('user123', 8),
      role: 'user'
    }
  ];

  let dbConnection = null;

  // Public API
  return {
    connectDB: (connection) => {
      dbConnection = connection;
      return true;
    },

    findByUsername: async (username) => {
      try {
        if (dbConnection) {
          // Future DB implementation
          // return await dbConnection.collection('users').findOne({ username });
        }
        return users.find(user => user.username === username) || null;
      } catch (error) {
        throw new Error(`User lookup failed: ${error.message}`);
      }
    },

    verifyPassword: async (user, password) => {
      try {
        return bcrypt.compareSync(password, user.password);
      } catch (error) {
        throw new Error(`Password verification failed: ${error.message}`);
      }
    },

    generateToken: (user) => {
      try {
        return jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role
          },
          JWT.SECRET,
          { expiresIn: JWT.EXPIRES_IN }
        );
      } catch (error) {
        throw new Error(`Token generation failed: ${error.message}`);
      }
    },

    getAllUsers: async () => {
      try {
        if (dbConnection) {
          // Future DB implementation
          // return await dbConnection.collection('users').find({}, { projection: { password: 0 } }).toArray();
        }
        return users.map(({ password, ...user }) => user);
      } catch (error) {
        throw new Error(`Failed to get users: ${error.message}`);
      }
    }
  };
};

module.exports = userModel();
import * as UserModel from '../models/user.model.js';

export const register = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const existingUser = await UserModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const newUser = await UserModel.createUser(username);
    // Im MVP geben wir den ganzen User zurück, inkl. ID, die das Frontend braucht.
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering new user.' });
  }
};

export const login = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username required' });

  const user = await UserModel.findUserByUsername(username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
};
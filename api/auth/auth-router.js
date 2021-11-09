const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require('./auth-middleware');

router.post(
  '/register',
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 6);
      // eslint-disable-line
      const newUser = { username, password: hash };
      const user = await User.add(newUser);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await User.findBy({ username });
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `welcome ${username}` });
    } else {
      next({ status: 401, message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/logout', async (req, res, next) => {
  if (!req.session.user) {
    res.status(200).json({ message: 'no session' });
  } else {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ message: 'logged out' });
      }
    });
  }
});

module.exports = router;

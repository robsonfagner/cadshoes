const express = require('express');


const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');


// @route    POST /auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/',[
    check('email', 'Please include a valid email').isEmail(),
    check('senha', 'senha is required').exists()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, senha } = req.body

    try{
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'Usuário não existe' }] })
        }else{
            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Senha Incorreta' }] });
            }else{
                const payload = {
                    user: {
                    id: user.id
                    }
                }

                jwt.sign( payload, config.get('jwtSecret'), { expiresIn: '5 days' },
                    (err, token) => {
                      if (err) throw err;
                      res.json({ token });
                    }
                  );
            }
        }

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }

})

module.exports = router;
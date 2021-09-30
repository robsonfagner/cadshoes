const express = require('express');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleaware/auth')


// @route    GET /user/:email
// @desc     DETAIL user
// @access   Public
router.get('/:email', [], async(req, res, next)=> {
  try{
    let param_email = req.params["email"]
    const user = await User.findOne({email : param_email})
    if(user){
      res.json(user)
    }else{
      res.status(404).send({"error" : "user not found"})
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

// @route    DELETE /user/:userId
// @desc     DELETE user
// @access   Public
router.delete('/:email', async (req, res, next)=> {
  try{
    let  param_email =  req.params["email"]
    const user = await User.findOneAndDelete({ email: param_email})
      if (user){
        res.json(user)    
     
    }else{
      res.status(404).send({"error" : "user not exist"})
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

// @route    PUT /user/:userId
// @desc     EDIT user
// @access   Public
router.put('/:email',[
  check('email', 'email is not valid').isEmail(),
  check('nome').not().isEmpty(),
  check('senha', 'Please enter a password with 6 or more characters').isLength({min : 6}),
  check('funcao', 'Please inserct yor function').not().isEmpty(),
  check('endereco', 'Please inserct your adress').not().isEmpty()


], async(req, res, next)=> {
  try{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    let param_email = req.params["email"]
    let { nome, email, senha, funcao, endereco } = req.body
    let update = { nome, email, senha, funcao, endereco };
    
    const salt = await bcrypt.genSalt(10);
    update.senha = await bcrypt.hash(senha, salt);
    
    let user = await User.findOneAndReplace({email : param_email}, update, {new: true})
    if(user){
      res.json(user)
    }else{
      res.status(404).send({"error" : "user not found"})
    }
    
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    PATCH /user/:email
// @desc     PARTIAL EDIT user
// @access   Public
router.patch('/:email', [
check('email', 'email is not valid').isEmail(),
check('senha', 'Please enter a password with 6 or more characters').isLength({min : 6}),
],
 async (request, res, next) => {
  try {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() })
      return
    }
    const param_email = request.params.email
    const salt = await bcrypt.genSalt(10)
    
    let bodyRequest = request.body

    if(bodyRequest.senha){
      bodyRequest.senha = await bcrypt.hash(bodyRequest.senha, salt)
    }
    console.log(bodyRequest)
    const update = { $set: bodyRequest }
    const user = await User.findOneAndUpdate({email:param_email}, update, { new: true })
    if (user) {
      res.send(user)

    }else{
      res.status(404).send({"error" : "user not exist"})
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

// @route    GET /user
// @desc     LIST user
// @access   Public
router.get('/', async(req, res, next)=> {
  try{
    const user = await User.find({})
    if (user){
    res.json(user)
  }else{res.status(404).send({'error': 'Not found'})}
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

// @route    POST /user
// @desc     CREATE user
// @access   Public
router.post('/',[
  check('email', 'email is not valid').isEmail(),
  check('nome').not().isEmpty(),
  check('senha', 'Please enter a password with 6 or more characters').isLength({min : 6}),
  check('funcao', 'Insira sua funcao' ).not().isEmpty(),
  check('endereco','insira seu endereco').not().isEmpty()
], async (req, res, next) => {
  try{
    let { nome, email, senha, funcao, endereco } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }else{
      let usuario = new User({nome, email, senha, funcao, endereco})
      
      const salt = await bcrypt.genSalt(10);
      usuario.senha = await bcrypt.hash(senha, salt);

      await usuario.save()     
      
      if (usuario.id){
        res.json(usuario);
      }
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


module.exports = router;

const express = require('express');
const { getUser, postUser, putUser, deleteUser } = require('../Controller/UserController');

const router = express.Router();

router.get('/get', getUser);
router.post('/post', postUser);
router.put('/put/:id', putUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;

const controllers = require('./../controllers/controllers');

const express = require('express');

const router = express.Router();

router.get('/', controllers.home);
router.get('/register', controllers.registerPage);
router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.get('/logout', controllers.logout);
router.get('/app', controllers.app);

router.get('/user_dirs', controllers.userDirs);
router.get('/user_files', controllers.userFiles);

router.get('/new_dir', controllers.newDirPage);
router.post('/new_dir', controllers.newDir);
router.get('/new_file', controllers.newFilePage);
router.post('/new_file', controllers.newFile);

router.get('/show_file/:folderName/:fileName', controllers.showFile);
router.get('/show_result/:folderName/:fileName', controllers.showResult);
router.get('/show_focus/:folderName/:fileName', controllers.showFocus);

router.post('/delete_file', controllers.delFile);
router.post('/delete_folder', controllers.delFolder);
router.post('/rerun', controllers.rerun);

module.exports = router;
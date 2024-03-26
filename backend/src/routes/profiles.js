import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { ProfileModel } from '../models/Profile.js';
import { ChatModel } from '../models/chat.js';


const router = express.Router();

const __dirname = path.resolve(path.dirname(''));
console.log(__dirname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'src', 'assets', 'uploads');
    console.log('Upload directory path:', uploadDir);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const filename = `${uniqueFilename}${fileExtension}`;
    cb(null, filename);
  },
});

const uploads = multer({ storage: storage });

router.post('/', uploads.single('imageFile'), async (req, res) => {
  try {
    const { name, userOwner } = req.body;

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const profile = new ProfileModel({
      imageUrl: req.file.filename,
      name,
      userOwner,
    });

    const result = await profile.save();

    fs.access(req.file.path, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('Error checking file existence:', err);
      } else {
        console.log('File exists in the uploads directory');
      }
    });

    res.status(201).json({
      createdProfile: result,
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await ProfileModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post('/save-conversation', async (req, res) => {
  try {
    const {chatId} = req.body;

    const chat= await ChatModel.findById(conversationId);
    if (!chat) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const profile = await ProfileModel.findOne({ userOwner: chat.userOwner });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.chatId=chatId
    await profile.save();

    res.status(200).json({ message: 'Conversation ID saved to profile successfully' });
  } catch (err) {
    console.error('Error saving conversation ID to profile:', err);
    res.status(500).json({ error: err.message });
  }
});

export { router as profileRouter };
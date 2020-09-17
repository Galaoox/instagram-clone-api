import multer, { DiskStorageOptions } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

export default multer({ storage });

import multer from "multer";

//temp storing data in the disk
//cd = Call back
const storage = multer.diskStorage({
  //temp folder to save the data
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  //filename
  filename: function (req, file, cb) {
    // console.log(file.originalname);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

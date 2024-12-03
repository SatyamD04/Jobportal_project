import multer from "multer";

const storage= multer.memoryStorage();
export const singleUpload =multer({storage}).single("file"); //---file name must be same, which is used in signup-----

import multer from 'multer';

const storage = multer.diskStorage({
    destination : (req , file , callBack)=>{
        callBack(null , "./public/images");
    },
    filename : (req , file , callBack) =>{
       const uniqueName =  Date.now() + file.originalname
       callBack(null , uniqueName);
    }
})

const upload = multer({
    storage : storage
})

export default upload;
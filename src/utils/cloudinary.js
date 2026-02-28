import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath){
                return null
            }else{
              const response =   await cloudinary.uploader.upload(localFilePath,{
                    resource_type:"image"
                })
                console.log("File is uploades cloudinary", response.url);
                return response
            }
        } catch (error) {
            fs.unlinkSync(localFilePath) //remove file locally saved 
            return null;
        }
    }

    export {uploadCloudinary}
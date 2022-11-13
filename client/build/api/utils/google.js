const fs = require('fs');
const { Readable } = require('stream');
const { google } = require("googleapis");
const authenticateGoogle = () => {
    const auth = new google.auth.GoogleAuth({
      keyFile: `${__dirname}/juyy-368219-d191b1fc36a8.json`,
      scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
  };

  const uploadToGoogleDrive = async (file, auth,folder) => {
    const fileMetadata = {
      name: file.originalname,
      parents: [folder], // Change it according to your desired parent folder id
    };
    const media = {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer),
    };
  
    const driveService = google.drive({ version: "v3", auth });
    // driveService.files.create()
  
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    return response;
  };
  const createFolder = async (auth, folder)=>{
    const driveService = google.drive({ version: "v3", auth });
    var fileMetadata = {
         name : folder,
         mimeType : 'application/vnd.google-apps.folder',
         parents: ['1PWdm5e6EsvBAb6MBO3n6TxYqQo-rZAAn']
      }
    const resp = await driveService.files.create({
        resource: fileMetadata,
        fields: 'id'
      })  
    return resp
  }
  module.exports = {authenticateGoogle, uploadToGoogleDrive, createFolder}
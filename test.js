const Client = require( 'ftn-client');
const fs = require('fs');

const client = new Client({
  language: 'en', //default language
  region: 'EU' //default region
})

(async () => {
  //Start the client
  await client.start()
  
  //Get BR News
  const BRnews = client.BRNews;
  for(const thisNew of BRnews.news) {
    if(thisNew.stream !== null) {
      //Download MP4 Buffer
      //Default client language and 720p resolution
      const video = await thisNew.stream.downloadStream();
      
      //Create MP4 file
      fs.writeFileSync(thisNew.stream.fileName, video);
    }
  }
})()
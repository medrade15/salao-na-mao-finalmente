const mongoose = require('mongoose');

const URI = process.env.MONGO_URI || 'mongodb+srv://medrade15:HRCiPSeS32GwDszV@salao-na-mao.gszvze8.mongodb.net/salao?retryWrites=true&w=majority';



mongoose
  .connect(URI)
  .then(() => console.log('DB is Up!'))
  .catch((err) => console.log(err));

  //HRCiPSeS32GwDszV//
  //c2OrbgFFFRhOmQy9//

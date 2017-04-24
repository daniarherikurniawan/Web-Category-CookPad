sudo nodemon --watch controller/ --watch dbconfig/ --watch dbhelper/  --watch routes/ --watch bin/www --watch app.js

30
use simplegramdb
db.createCollection("users")
db.createCollection("posts")
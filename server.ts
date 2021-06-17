import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import { CityRouter } from './src/server/routes/cities';
import { RnProxy } from './src/server/routes/rnProxy';


const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(process.env.PORT || 3000, function() {
    console.log(`Server now listening on ${port}.`);
});

// Allow any method from any host and log requests
app.use(cors());

// Handle POST requests that come in formatted as JSON
app.use(express.json());

app.use('/cities', CityRouter.cityRouter);
app.use('/proxy', RnProxy.proxyRouter);

// Serve only the static files from the dist directory
app.use(express.static(__dirname + '/dist/my-app'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/my-app/index.html'));
});



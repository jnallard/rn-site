import * as express from 'express';
import axios from 'axios';
import { Md5 } from 'ts-md5';

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query);

  const server = req.query.server;
  const parameters = JSON.parse(req.query.param);
  const cookie = req.query.cookie;
  const urlQueryPath = req.query.urlQueryPath;
  const hash = Md5.hashAsciiStr(req.query.param);
  console.log({ hash });
  
  axios({
    method: "post",
    url: `https://${server}.railnation-game.com/web/rpc/flash.php?${urlQueryPath}`,
    data: {"client":1,"checksum":-1,"parameters":parameters,"hash":hash},
    headers: { cookie: cookie }
  }).then(r => {
    if (r.data.Errorcode == 1) {
      res.statusCode = 400;
      res.send({errorMessage: "Unable to connect to Rail Nation server", error: r.data});
      return;
    }
    res.send(r.data);
  }).catch(error => {
    if (error.message == "Request failed with status code 404") {
      res.statusCode = 404;
      res.send({errorMessage: "RN Server not found", error});
      return;
    }
    res.send(error);
  });
});

export class RnProxy {
  static proxyRouter = router;
};

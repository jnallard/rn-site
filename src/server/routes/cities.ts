import * as express from 'express';
import axios from 'axios';

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query);
  
  axios({
    method: 'post',
    url: 'https://com5.railnation-game.com/web/rpc/flash.php?interface=LocationInterface&method=getTownDetails&short=96',
    data: {"client":1,"checksum":-1,"parameters":[req.query.param],"hash":req.query.hash},
    headers: { cookie: req.query.cookie}
  }).then(r => {
    if (r.data.Errorcode == 1) {
      res.statusCode = 400;
      res.send({error: "Unable to connect to Rail Nation server"});
      return;
    }
    res.send(r.data);
  }).catch(error => {
    res.send(error);
  });
});

export class CityRouter {
  static cityRouter = router;
};

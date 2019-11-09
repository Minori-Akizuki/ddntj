var url = require('url');
var Log4js = require('log4js');
// log4js設定
Log4js.configure('js/config/log-config.json');
var systemLogger = Log4js.getLogger();

exports.apis = function(db_master, rooms){
    var _apis = {
        /**
         * api
         * リクエスト受けとって適切なレスポンスを返す受け口
         * @param {IncomingMessage} req
         * @param {ServerResponse} res
         */
        api : function(req, res){
            systemLogger.debug(req.url);
            var urlinfo = url.parse(req.url, true)
            var requestpath =  urlinfo.pathname;
            var output;
            systemLogger.info(`request to ${requestpath}`)
            if(requestpath=='/api/'){
                systemLogger.debug('status check');
                res.writeHead(200,{'Content-Type': 'application/json'})
                res.write('{"status":"ok"}');
                res.end();
            } else {
                res.writeHead(404,{'Content-Type': 'application/json'})
                res.write(`{"status":"api not found"}`);
                return res.end();
            }
        }
    }
    return _apis;
}
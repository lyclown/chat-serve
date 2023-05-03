import Router from 'koa-router';
import CryptoJS from 'crypto-js';
import {generateUserIDByPhoneNumber} from '../utils/tim/tim.js'
const router = new Router();

// 以下参数需要替换为你的tim应用的信息
const SDK_APP_ID = process.env.SDK_APP_ID;
const SECRET_KEY = process.env.SECRET_KEY;
router.post('/login', async (ctx) => {
  const { phone, password } = ctx.request.body;

  // 通过手机号创建userID
const userID = generateUserIDByPhoneNumber(phone);
  // 生成userSig
  const currentTime = Math.floor(Date.now() / 1000);
  const expiredTime = currentTime + 86400;
  const random = Math.floor(Math.random() * 65535);
  const plainText = `TLS.appid_at_3rd:${SDK_APP_ID}\nTLS.account_type:0\nTLS.identifier:${userID}\nTLS.sdk_appid:${SDK_APP_ID}\nTLS.time:${currentTime}\nTLS.expire_after:${expiredTime}\nTLS.version:2.0\nTLS.sig_nonce:${random}`;
  const hmacResult = CryptoJS.HmacSHA256(plainText, SECRET_KEY);
  const userSig = encodeURIComponent(
    CryptoJS.enc.Base64.stringify(hmacResult)
  );

  // 返回userID和userSig
  ctx.body = {
    userID,
    userSig,
    sdkAppID:SDK_APP_ID
  };
});

export default router;

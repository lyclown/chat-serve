import crypto from 'crypto';

export function generateUserIDByPhoneNumber(phoneNumber) {
    // 去除电话号码中的非数字字符
    const digits = phoneNumber.replace(/\D/g, '');
    // 在数字前添加前缀 "user_"
    const userID = `user_${digits}`;
    return signUserID(userID, process.env.USER_ID_SECRET);
  }
  function signUserID(userID, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(userID);
    const signature = hmac.digest('hex');
    return signature;
  }
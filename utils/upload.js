// import mime from 'mime-types';
import fs from 'fs';
import path from 'path';
import filesize from 'filesize';
export async function uploadFile(ctx, uploadDir) {
    const file = ctx.request.files.files;
    console.log(file)
    // 验证文件类型
    const {mimetype,size,originalFilename} = file
    // const fileType = mime.lookup(mimetype);
    if (!['image/jpeg', 'image/png'].includes(mimetype)) {
        throw new Error('只允许上传JPEG或PNG格式的图片！');
    }

    // 验证文件大小
    if (size > 5 * 1024 * 1024) {
        throw new Error('上传文件的大小不能超过5MB！');
    }

    // // 验证文件名
    // const fileName = path.basename(file.name, path.extname(file.name)).toLowerCase();
    // if (originalFilename.includes('sensitive')) {
    //     throw new Error('上传的文件名包含敏感词汇！');
    // }

    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(`${uploadDir}/${file.name}`);

    reader.pipe(stream);
    // 返回文件的URL或其他信息
    return {
        success: true,
        message: '文件上传成功！',
        fileUrl: `${uploadDir}/${file.name}`,
        fileSize: filesize(fileSize),
        fileType: fileType,
        fileName: fileName,
    };
}

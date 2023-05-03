// 处理messages数组，取前三个和后3个数据
export const handleMessages = (res)=>{
    const {messages} = res;
    // if(messages[0] && messages[0].role !=='system'){
    //     messages.unshift({role:'system',content:'You are a prompt expert in the image extension model Dalle 2. Whenever I make a request for you, I reply to your sorted prompt statements in English'})
    // }
    const length = messages.length;
    if(length <= 6) return messages
    return messages.slice(0, 3).concat(messages.slice(-3))
}
export function getFilePath(url) {
    return new URL(url, import.meta.url)
}
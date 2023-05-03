import pkg from 'xmind';
const { Workbook, Topic, Zipper, Summary, Marker } = pkg;
import { JSDOM } from 'jsdom'
import fs from 'fs'
import markdown from 'markdown'
import { join } from 'path';
// 获取文件路径
function getFilePath(url) {
    return new URL(url, import.meta.url)
}
function parseMarkdownToHtml(path) {
    // 读取 Markdown 文件
    const markdownFile = fs.readFileSync(getFilePath(path), 'utf-8');
    // 将 Markdown 转换为 HTML
    const html = markdown.parse(markdownFile);
    // 使用 JSDOM 解析 HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;
    return document;
}
function getChildTextNodes(node) {
    let content = '';
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeType === 3) {
        content+=childNode.textContent.trim()
      }
    }
    return content || '示例文字';
  }
const document = parseMarkdownToHtml('./../example/file.md')
class TopicNode {
    constructor(node) {
        this.title = getChildTextNodes(node);
        this.nodeName = node.nodeName;
        this.children = Array.from(node.children).map(child => new TopicNode(child));
        this.noteText = '';
        this.imgUrl = './tmp/image.png'
        this.marker = null;
        this.summary = null;
        this.zipper = null
        this.topic = null
    }
 
    addChild(childNode) {
        this.children.push(childNode);
    }
    addNoteText() {
        this.topic.note(this.title)
    }
    addZipper(zipper){
        this.zipper = zipper
    }
    addTopic(topic){
        this.topic = topic
    }
    addImage(){
        const imageKey = this.topic.image();
        const ctx = fs.readFileSync(getFilePath(this.imgUrl));
        this.zipper.updateManifestMetadata(imageKey, ctx);
    }
    addMarker(marker) {
        this.marker = marker;
    }
    addTitle(){
        this.topic.add({title:this.title})
    }

    addSummary(summary) {
        this.summary = summary;
    }
    toTopic(workbook, topicSheet, parentTopic, marker,zipper) {
        parentTopic = parentTopic || new Topic({ sheet: topicSheet });
        if (marker) {
            this.addMarker(marker);
        }
        if(zipper){
            this.addZipper(zipper)
        }
        if(parentTopic){
            this.addTopic(parentTopic)
        }
        switch (this.nodeName) {
            case 'IMG':
                // this.addImage()
                break;
            case 'P':
                this.addNoteText()
                break;
            default:
                this.addTitle()
        }
        this.children.forEach(childNode => {
            parentTopic = parentTopic.on(parentTopic.cid(this.title))
            childNode.toTopic(workbook, topicSheet, parentTopic, marker,zipper);
        });
    }
}
async function createXmindFromDom(rootNode, options = {}) {
    const rootTopicNode = new TopicNode(rootNode);
    const workbook = new Workbook();
    const topicSheet = workbook.createSheet('Sheet 1', rootTopicNode.title);
    const marker = new Marker();
    const zipper = new Zipper({
        path:options.path,
        workbook,
        filename: options.filename || 'MyFirstMap.xmind',
    });
    rootTopicNode.toTopic(workbook, topicSheet, null, marker,zipper);
    const status = await zipper.save()
    status && console.log(`Saved ${options.path}/${options.filename}`);
}
// 检查节点是否包含文本节点
function hasTextNodes(node) {
    if (node.nodeName === 'BODY') return true
    for (let i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];
        if (child.nodeType === 3 && child.textContent.trim() !== '') {
            return true;
        }
    }
    return false;
}
// 删除没有子文本节点的节点
function removeEmptyNodes(node) {
    // 遍历子节点
    for (let i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];
        // 如果子节点是元素节点，则递归处理该子节点
        if (child.nodeType === 1) {
            removeEmptyNodes(child);
        }
    }
    // 如果当前节点没有子文本节点，则删除当前节点，并将子节点添加到父节点上
    if (node.nodeType === 1 && node.childNodes.length > 0 && !hasTextNodes(node)) {
        let parent = node.parentNode;
        while (node.childNodes.length > 0) {
            let child = node.childNodes[0];
            parent.insertBefore(child, node);
        }
        parent.removeChild(node);
    }
}
// 处理dom节点，将md格式转换成的html处理成可以生成xmind的结构
function processDomNode(parentNode) {
    const headings = ['H6', 'H5', 'H4', 'H3', 'H2', 'H1'];
    for (let i = 0; i < headings.length; i++) {
        headings[i] = headings[i].toUpperCase();
    }
    let fragment = document.createDocumentFragment();
    const children = getNonEmptyChildNodes(parentNode);
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (headings.includes(child.tagName)) {
            const childNumber = getNumberFromHeading(child);
            const nextHeadingIndex = children.slice(i + 1).findIndex(node => {
                if (headings.includes(node.tagName)) {
                    const nodeNumber = getNumberFromHeading(node);
                    return nodeNumber <= childNumber;
                }
                return false;

            });
            const endIndex = nextHeadingIndex >= 0 ? i + 1 + nextHeadingIndex : children.length;
            for (let j = i + 1; j < endIndex; j++) {
                fragment.appendChild(children[j]);
            }
            child.appendChild(fragment)
        }
    }
}
// 获取标题的数字
function getNumberFromHeading(heading) {
    return parseInt(heading.tagName.slice(1), 10);
}
// 获取非空文本节点
function getNonEmptyChildNodes(parentNode) {
    return Array.from(parentNode.childNodes).filter(node => {
        return !(node.nodeType === 3 && /^\s*$/.test(node.textContent));
    });
}
removeEmptyNodes(document.body)
processDomNode(document.body)
createXmindFromDom(document.body,{path:'./example/xmind'});
import Quill from 'quill'
let BlockEmbed = Quill.import('blots/block/embed')

class CustomVideoBlot extends BlockEmbed {
  static create(value) {
    let node = super.create()
    node.setAttribute('src', value.url)
    node.setAttribute('poster', value.poster)
    value.controls && node.setAttribute('controls', value.controls)
    value.autoplay && node.setAttribute('autoplay', value.autoplay)
    return node
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      poster: node.getAttribute('poster'),
      controls: node.getAttribute('controls'),
      autoplay: node.getAttribute('autoplay')
    }
  }
}
CustomVideoBlot.blotName = 'customVideo'
CustomVideoBlot.tagName = 'video'

export const registerBlot = () => {
  Quill.register(CustomVideoBlot)
}

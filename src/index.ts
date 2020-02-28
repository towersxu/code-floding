require('./style.css?raw')
import utils from './utils'


interface TreeResult {
  el: HTMLElement,
  length: number // 子节点数量
}


export class formatJSON {
  el: HTMLElement;
  originJSONObject: object;
  constructor (json: string, el: HTMLElement) {
    this.el = el;
    this.originJSONObject = {}

    try {
      this.originJSONObject = JSON.parse(json)
    } catch (e) {
      this.el.appendChild(document.createTextNode('字符串格式错误'))
      return
    }

    let res = this.createTree(this.originJSONObject)
    let braceRight = this.createBrace(true, res.length)
    this.el.appendChild(braceRight)
    this.el.appendChild(res.el)
    this.el.append(this.createBrace(false))
    this.el.addEventListener('click', function (e: MouseEvent) {
      const element = <HTMLElement>e.target
      if (element.className.indexOf('js-operator-show') !== -1) { // 展开
        element.className ='js-operator-show operator hide';
        (<HTMLElement>element.nextSibling).className = 'js-operator-hide operator show';
        (<HTMLElement>element.parentNode.nextSibling).className = 'hide'
      }
      if (element.className.indexOf('js-operator-hide') !== -1) { // 收起
        (<HTMLElement>element.previousSibling).className ='js-operator-show operator show';
        element.className = 'js-operator-hide operator hide';
        (<HTMLElement>element.parentNode.nextSibling).className = 'show'
      }
    })
  }
  createTree (obj: object, parent?: HTMLElement): TreeResult {
    const keys = Object.keys(obj)
    const ul = document.createElement('ul');
    let res: TreeResult = {
      el: ul,
      length: keys.length
    }
    keys.forEach(key => {
      let li = this.createTreeItem(key);
      const value = obj[key]
      if (utils.isObject(value)) {
        let result = this.createTree(value, li)
        li.append(this.createBrace(true, result.length))
        li.append(result.el)
        res.length += result.length // 应该是总的子元素吧
        li.append(this.createBrace(false))
      } else {
        li.append(this.createItemValue(value))
      }
      ul.append(li)
    })
    return res
  }
  createBrace (isRight: boolean, childrenNumber?: number) {
    const brace = document.createElement('span')
    brace.append(isRight ? '{' : '}')
    if (isRight && childrenNumber) {
      const opr = document.createElement('span')
      opr.append('-')
      opr.className ='operator js-operator-show'
      brace.appendChild(opr)
      
      const cn = document.createElement('span')
      cn.className = 'js-operator-hide operator hide'
      cn.innerText = '' + childrenNumber.toString() + '...'
      brace.appendChild(cn)
    }
    return brace

  }
  createTreeItem (tag: string) {
    const li = document.createElement('li')
    return li
  }
  createItemValue (value: string): HTMLElement {
    let span = document.createElement('span')
    span.innerText = value
    return span
  }
}
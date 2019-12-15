const items = document.getElementById('items')
const fs = require('fs')

// get readerJS content
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString()
})

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// listen to "Done" message from reader window
window.addEventListener('message', e => {
  // check for correct message
  if (e.data.action === 'delete-reader-item') {
    // delete item at given index
    this.delete(e.data.itemIndex)

    // close reader window
    e.source.close()
  }
})

// delete item
exports.delete = index => {
  // remove item from DOM
  items.removeChild(items.childNodes[index])

  // remove from storage
  this.storage.splice(index, 1)

  // persist
  this.save()

  // select prev or next item
  if (this.storage.length) {
    const newSelectedItemIndex = index === 0 ? 0 : index - 1
    document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
  }
}

// get selected item index
exports.getSelectedItem = () => {
  const currentItem = document.getElementsByClassName('read-item selected')[0]
  let itemIndex = 0
  let child = currentItem
  while((child = child.previousSibling) != null) {
    itemIndex++
  }
  return { node: currentItem, index: itemIndex }
}

// persist storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// set item as selected
exports.select = e => {
  const prevSelected = this.getSelectedItem().node
  if (prevSelected) {
    prevSelected.classList.remove('selected')
  }
  e.currentTarget.classList.add('selected')
}

// move to newly selected item
exports.changeSelection = direction => {
  const currentItem = this.getSelectedItem().node

  // handle up/down
  if (direction === 'ArrowUp' && currentItem && 
      currentItem.previousSibling && currentItem.previousSibling.classList) {
    currentItem.classList.remove('selected')
    currentItem.previousSibling.classList.add('selected')
    currentItem.previousSibling.scrollIntoView(true)
  } else if (direction === 'ArrowDown' && currentItem &&
    currentItem.nextElementSibling && currentItem.nextElementSibling.classList) {
    currentItem.classList.remove('selected')
    currentItem.nextElementSibling.classList.add('selected')
    currentItem.nextElementSibling.scrollIntoView(false)
  }
}

// open selected item
exports.open = () => {
  // only if we have items (in case of menu open)
  if (!this.storage.length) return

  const selectedItem = this.getSelectedItem()
  const contentUrl = selectedItem.node.dataset.url
  
  // open item in proxy BrowserWindow
  const readerWin = window.open(contentUrl, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#dedede,
    nodeIntegration=0,
    contextIsolation=1
  `)

  // inject javascript with specific item index (selectedItem.index)
  readerWin.eval(readerJS.replace('{{index}}', selectedItem.index))
}

// add new item
exports.addItem = (item, isNew = false) => {
  const itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'read-item')
  itemNode.setAttribute('data-url', item.url)
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`
  items.appendChild(itemNode)

  // attach click handler for selection
  itemNode.addEventListener('click', this.select)

  // attach doubleclick handler for opening
  itemNode.addEventListener('dblclick', this.open)

  // if this is the first item, select it
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected')
  }

  if (isNew) {
    this.storage.push(item)
    this.save()
  }
}

// add items from storage when app loads
this.storage.forEach(item => {
  this.addItem(item)
})

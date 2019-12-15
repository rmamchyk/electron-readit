const items = document.getElementById('items')

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// persist storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// set item as selected
exports.select = e => {
  const prevSelected = document.getElementsByClassName('read-item selected')[0]
  if (prevSelected) {
    prevSelected.classList.remove('selected')
  }
  e.currentTarget.classList.add('selected')
}

// move to newly selected item
exports.changeSelection = direction => {
  const currentItem = document.getElementsByClassName('read-item selected')[0]

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

  const selectedItem = document.getElementsByClassName('read-item selected')[0]
  const contentUrl = selectedItem.dataset.url
  console.log(contentUrl)
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

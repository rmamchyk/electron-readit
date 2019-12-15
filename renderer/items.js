const items = document.getElementById('items')

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// persist storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// add new item
exports.addItem = (item, isNew = false) => {
  const itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'read-item')
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`
  items.appendChild(itemNode)

  if (isNew) {
    this.storage.push(item)
    this.save()
  }
}

// add items from storage when app loads
this.storage.forEach(item => {
  this.addItem(item)
})

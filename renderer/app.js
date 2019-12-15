const { ipcRenderer } = require('electron')
const items = require('./items')

const showModal = document.getElementById('show-modal'),
      closeModal = document.getElementById('close-modal'),
      modal = document.getElementById('modal'),
      addItem = document.getElementById('add-item'),
      itemUrl = document.getElementById('url'),
      search = document.getElementById('search')

// filter items with 'search' input
search.addEventListener('keyup', e => {
  // loop items
  Array.from(document.getElementsByClassName('read-item')).forEach(item => {
    // hide items that don't match search value
    const hasMatch = item.innerText.toLowerCase().includes(search.value)
    item.style.display = hasMatch ? 'flex' : 'none'
  })
})

// navigate item selection with up/down arrows
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key)
  }
})

// disable/enable modal buttons
const toggleModalButtons = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false
    addItem.style.opacity = 1
    addItem.innerText = 'Add Item'
    closeModal.style.display = 'inline'
  } else {
    addItem.disabled = true
    addItem.style.opacity = 0.5
    addItem.innerText = 'Adding...'
    closeModal.style.display = 'none'
  }
}

// show/hide modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex'
  itemUrl.focus()
})
closeModal.addEventListener('click', e => {
  modal.style.display = 'none'
})

// handle new item
addItem.addEventListener('click', e => {
  if (itemUrl.value) {
    // send new item url to main process
    ipcRenderer.send('new-item', itemUrl.value)
    toggleModalButtons()
  }
})

// listen to keyboard submit
itemUrl.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    addItem.click()
  }
})

// listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  // add new item to items list
  items.addItem(newItem, true)

  toggleModalButtons()
  itemUrl.value = ''
  modal.style.display = 'none'
})


const usersContainer = document.getElementById('user-list')
const userForm = document.getElementById('user-form')
const usersElement = document.getElementById('users-wrapper')
const nameUserInput = document.getElementById('input-name') 
const emailUserInput = document.getElementById('input-email') 
const notify = document.getElementById('notify')
const notifyText = document.getElementById('notify-text')
const icUserFormBtn = document.getElementById('ic-left')
const popup = document.getElementById('popup')
const popupInnerUser = document.getElementById('popup-inner-user')

/* ----- buttons ----- */
const reloadUsersBtn = document.getElementById('reload-user-btn')
const addUserBtn = document.getElementById('add-user-btn')
const updateUserBtn = document.getElementById('update-user-btn')
const deleteUserBtn = document.getElementById('delete-user-btn')
const userFormBtn = document.getElementById('btn-user-form')
const loadMoreBtn = document.getElementById('btn-load-more')
const notifiBtnOk = document.getElementById('notifi-btn-ok')
const notifiBtnCancel = document.getElementById('notifi-btn-cancel')
/* ------------------- */

let users = []
let selectedUser = null
let firstOpen = true
let opened = false

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const getUsers = () => {
  loadMoreBtn.style.opacity = '0'
  usersElement.innerHTML = 
  `<span style="font-family: 'Poppins', san-serif; opacity: 0.5;">Loading...</span>`
  fetch('https://reqres.in/api/users?page=1')
    .then(response => response.json())
    .then(result => {
      setTimeout(() => {
        users = result.data
        renderUsers(users)
      }, 1500)
    })
    .catch(err => console.error(err))
}

getUsers()

const renderUsers = (users) => {
  usersElement.innerHTML = ''
  for(let i = 0; i < users.length; i++) {
    let itemElement = document.createElement('div')
    itemElement.setAttribute('class', 'user')
    itemElement.innerHTML = 
    `
      <img src="${users[i].avatar}" alt="avatar"/>
      <div class="infos-wrapper">
        <div class="infos">
          <h3 class="user-name">${users[i].first_name + ' ' + users[i].last_name}</h3>
          <p class="user-email">${users[i].email}</p>
        </div>
      </div>
    ` 
    itemElement.onclick = () => {
      setSelectedUser(users[i])
      openUserForm()
    }
    usersElement.appendChild(itemElement) 
  }
  loadMoreBtn.style.opacity = '1'
}

const resetSelectedUser = () => {
  selectedUser = null
  updateUserBtn.style.display = 'none'
  deleteUserBtn.style.display = 'none'
  nameUserInput.value = ''
  emailUserInput.value = ''
  addUserBtn.style.display = 'inline-block'
  reloadUsersBtn.style.display = 'inline-block'
}

const setSelectedUser = user => {
  selectedUser = user
  addUserBtn.style.display = 'none'
  reloadUsersBtn.style.display = 'none'
  updateUserBtn.style.display = 'inline-block'
  deleteUserBtn.style.display = 'inline-block'
  nameUserInput.value = selectedUser.first_name + ' ' + selectedUser.last_name
  emailUserInput.value = selectedUser.email
}

const addNewUser = (name, email) => 
  [
    ...users,
    { 
      id: getRandomInteger(1, 1000),
      first_name: name, 
      last_name: '',
      email,
      avatar: 'https://tinyurl.com/3447zdrm'
    }
  ]

const editUser = (name, email) => {
  const userUpdate = users.find(user => user.id === selectedUser.id)
  userUpdate.first_name = name
  userUpdate.last_name = ''
  userUpdate.email = email
}

const removeUser = id => {
  const removeIndex = users.findIndex(user => user.id === id)
  users.splice(removeIndex, 1)
}

const displayNofify = text => {
  notify.style.width = '400px'
  notify.style.height = '60px'
  setTimeout(() => {
    notifyText.style.opacity = '1'
  }, 300)
  notifyText.innerHTML = text
  setTimeout(() => {
    notifyText.style.opacity = '0'
  }, 4600)
  setTimeout(() => {
    notify.style.width = '0px'
    notify.style.height = '0px'
  }, 4800)
}

reloadUsersBtn.onclick = () => getUsers()

addUserBtn.onclick = () => {
  const userName = nameUserInput.value
  const userEmail = emailUserInput.value
  users = addNewUser(userName, userEmail)
  renderUsers(users)
  displayNofify('Thêm user thành công')
}

deleteUserBtn.onclick = () => {
  popup.style.display = 'block'
  popupInnerUser.innerHTML = 
  `
    <img src="${selectedUser.avatar}" alt="avatar"/>
    <div class="infos-wrapper">
      <div class="infos">
        <h3 class="user-name">${selectedUser.first_name + ' ' + selectedUser.last_name}</h3>
        <p class="user-email">${selectedUser.email}</p>
      </div>
    </div>
  `
}

popup.onclick = () => popup.style.display = 'none'
notifiBtnCancel.onclick = () => popup.style.display = 'none'

notifiBtnOk.onclick = () => {
  removeUser(selectedUser.id)
  renderUsers(users)
  popup.style.display = 'none'
  displayNofify(`Xóa user #${selectedUser.id} thành công`)
  resetSelectedUser()
}

updateUserBtn.onclick = () => {
  editUser(nameUserInput.value, emailUserInput.value)
  renderUsers(users)
  displayNofify(`Cập nhật user #${selectedUser.id} thành công`)
  resetSelectedUser()
}

const openUserForm = () => {
  opened = true
  if(firstOpen) {
    resetSelectedUser()
    firstOpen = false
  }
  icUserFormBtn.style.transform = 'rotate(180deg)'
  setTimeout(() => {
    usersContainer.style.width = window.innerWidth <= 912 ? '100%' : '50%'
    userForm.style.opacity = '1'
  }, 200)
  userForm.style.display = 'flex'
  userForm.style.width = window.innerWidth <= 912 ? '100%' : '50%'
}

const closeUserForm = () => {
  opened = false
  icUserFormBtn.style.transform = 'rotate(0deg)'
  usersContainer.style.width = '100%'
  userForm.style.opacity = '0'
  userForm.style.width = '0px'
  setTimeout(() => {
    userForm.style.display = 'none'
  }, 720)
}

userFormBtn.onclick = () => {
  if(!opened) openUserForm()
  else closeUserForm()
}
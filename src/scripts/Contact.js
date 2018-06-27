const $ = require("jquery")
const ContactCollectionModule = require("./ContactCollection")
const ContactListModule = require("./ContactList")

//gets id of current contact and passes it to the method in contact collection for deleting contacts then re-renders the dom
const deleteContact = () => {
  console.log("delete button clicked", event.currentTarget.parentNode.id)
  const contactId = event.currentTarget.parentNode.id
  ContactCollectionModule.deleteContact(contactId)
  .then(() => {
    ContactListModule.buildContactList()
  })
}

//gets id of current contact and passes it to the method in contact collection for editing contacts then gets the response(the selected contact) and rerenders the dom after changes are made
const editContact = () => {
  const contactId = event.currentTarget.parentNode.id
  ContactCollectionModule.getContact(contactId)
  .then((response) => {
    console.log("contact to be edited", response);
    buildEditContactForm(response)
  })
}

//builds edit form and fills out form with already selected contact values which allows you to change them and also sets the edit button to call a function that handles updating the database with the newly changed info
const buildEditContactForm = (contact) => {
  const editContactArticle = document.createElement("article")
  editContactArticle.className = "edit-contact-article"

  const nameSection = document.createElement("section")

  const nameLabel = document.createElement("label")
  nameLabel.textContent = "Name: "
  nameSection.appendChild(nameLabel)

  const nameField = document.createElement("input")
  nameField.setAttribute("type", "text")
  nameField.className = "name-edit-field"
  nameField.value = contact.name
  nameSection.appendChild(nameField)

  editContactArticle.appendChild(nameSection)

  const phoneSection = document.createElement("section")

  const phoneLabel = document.createElement("label")
  phoneLabel.textContent = "Phone: "
  phoneSection.appendChild(phoneLabel)

  const phoneField = document.createElement("input")
  phoneField.setAttribute("type", "tel")
  phoneField.className = "phone-edit-field"
  phoneField.value = contact.phone
  phoneSection.appendChild(phoneField)

  editContactArticle.appendChild(phoneSection)

  const addrSection = document.createElement("section")

  const addrLabel = document.createElement("label")
  addrLabel.textContent = "Address: "
  addrSection.appendChild(addrLabel)

  const addrFieldOne = document.createElement("input")
  addrFieldOne.setAttribute("type", "text")
  addrFieldOne.className = "addr-edit-field"
  addrFieldOne.value = contact.address
  addrSection.appendChild(addrFieldOne)

  editContactArticle.appendChild(addrSection)

  const editButton = document.createElement("button")
  editButton.textContent = "Update"
  editButton.id = `${contact.id}`
  editButton.addEventListener("click", editExistingContact)
  editContactArticle.appendChild(editButton)

  document.querySelector("#display-container").appendChild(editContactArticle)
}

//grabs the id, name, phone, and address of the edited contact and puts it in the database then it removes the whole form that appeared for you to edit the contact
const editExistingContact = () => {
  const contactId = event.currentTarget.id
  const contactName = $(".name-edit-field").val()
  const contactPhone = $(".phone-edit-field").val()
  const contactAddress = $(".addr-edit-field").val()
  ContactCollectionModule.putContact(contactId, contactName, contactPhone, contactAddress)
  .then(() => {
    document.querySelector(".edit-contact-article").remove()
    ContactListModule.buildContactList()
  })
}

//creates delete button and edit button and adds the eventListeners also prints each key value to the dom
const contact = Object.create({}, {
  "createContactComponent": {
    value: function(contact) {

      const contactSection = document.createElement("section")
      contactSection.id = `${contact.id}`

      for(key in contact){
        if(key === "id") {
          const deleteButton = document.createElement("button")
          deleteButton.textContent = "Delete"
          deleteButton.addEventListener("click", deleteContact)
          contactSection.appendChild(deleteButton)

          const editButton = document.createElement("button")
          editButton.textContent = "Edit"
          editButton.addEventListener("click", editContact)
          contactSection.appendChild(editButton)
        } else {
          const paraElement = document.createElement("p")
          paraElement.textContent = `${key}: ${contact[key]}`
          contactSection.appendChild(paraElement)
        }
      }

      return contactSection
    }
  }
})

module.exports = contact

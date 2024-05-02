// TOGGLE NEW / EDIT NOTE MODAL
const addNewNoteBtn = document.querySelector('.open-new-note-modal')
const newNoteModal = document.querySelector('.create-new-note-modal')
const backgroundOverlay = document.querySelector('.background-overlay')
const closeModalBtn = document.querySelector('.close-modal-btn')
const editNoteModal = document.querySelector('.edit-note-modal')
const closEditNoteModalBtn = document.querySelector('.close-edit-modal-btn')
const reponsiveAddNewNoteBtn = document.querySelector('.reposnsive-add-new-note-btn')
const addNewNoteMenu = document.querySelector('aside')
const responsiveCloseAddNewNoteBtn = document.querySelector('.responsive-close-add-note-btn')

document.body.addEventListener('click', function(e){
    if (e.target === addNewNoteBtn) {
        backgroundOverlay.style.display = 'block'
        newNoteModal.style.display = 'block'
    }
    else if (e.target === closeModalBtn) {
        backgroundOverlay.style.display = 'none'
        newNoteModal.style.display = 'none'
    }
    else if(e.target === closEditNoteModalBtn){
        editNoteModal.style.display = 'none'
        backgroundOverlay.style.display = 'none'
    }
    else if(e.target === reponsiveAddNewNoteBtn){
        addNewNoteMenu.style.display = 'block'
    }
    else if(e.target === responsiveCloseAddNewNoteBtn){
        addNewNoteMenu.style.display = 'none'
    }
})

// Function to handle screen size change
function handleScreenSizeChange() {
    if (window.innerWidth <= 992) {
      addNewNoteMenu.style.display = 'none'
    } else {
        addNewNoteMenu.style.display = 'block'
    }
}
handleScreenSizeChange();
window.addEventListener('resize', handleScreenSizeChange);

// ADDING NEW NOTE
const notes = []
const saveNewNoteBtn = document.querySelector('.save-note-btn')
const noteTitle = document.querySelector('.note-title')
const noteCont = document.querySelector('.note-cont')
const notesContainer = document.querySelector('.notes-container')
const notesCounter = document.querySelector('.notes-counter')


saveNewNoteBtn.addEventListener('click', function(){
    const newNote = {
        title: noteTitle.value,
        content: noteCont.value,
        id: generateId()
    }

    notes.push(newNote)

    renderNotes()
    console.log(notes.length)

    noteTitle.value = ''
    noteCont.value = ''

    backgroundOverlay.style.display = 'none'
    newNoteModal.style.display = 'none'

    notesCounter.innerHTML = notes.length
    createThumbnails()
})

// Function to create individual note elements
function createIndividualNoteElement(note) {
    const individualNoteDiv = document.createElement('div');
    individualNoteDiv.classList.add('individual-note');

    const titleElement = document.createElement('h1');
    titleElement.textContent = note.title;

    const contentElement = document.createElement('p');
    contentElement.textContent = note.content;

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('individual-notes-icons');

    const editIcon = document.createElement('i');
    editIcon.classList.add('fa-solid', 'fa-pencil');
    editIcon.addEventListener('click', function(){
        editNote(note.id) //Call editNote function when edit icon is clicked
    })

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash');
    deleteIcon.addEventListener('click', function() {
        deleteNote(note.id); // Call deleteNote function when delete icon is clicked
    });

    iconsDiv.appendChild(editIcon);
    iconsDiv.appendChild(deleteIcon);

    individualNoteDiv.appendChild(titleElement);
    individualNoteDiv.appendChild(contentElement);
    individualNoteDiv.appendChild(iconsDiv);

    return individualNoteDiv;
}

// CREATE THUMBNAILS
const notesThumbnailsContainer = document.querySelector('.notes-thumbnail-container');

const createThumbnails = function() {
    let thumbnailsHtml = '';

    notes.forEach(function(note) {
        thumbnailsHtml += `
        <div class="notes-thumbnail">
            <h3>${note.title ? note.title : note.content}</h3>
        </div>`;
    });

    notesThumbnailsContainer.innerHTML = thumbnailsHtml;
};


// Function to render all notes
function renderNotes() {
    notesContainer.innerHTML = '';

    notes.forEach(function(note) {
        const individualNoteElement = createIndividualNoteElement(note);
        notesContainer.appendChild(individualNoteElement);
    });
}

// RENDER NOTES ON LOAD 
renderNotes();

// EDIT NOTE
const editModalTitle = document.querySelector('.edit-note-title');
const editModalContent = document.querySelector('.edit-note-cont');

// Function to open the modal and populate it with the note's data
function editNote(id) {
    // Find the note in the notes array with the given ID
    const note = notes.find(note => note.id === id);

    // If the note is found, open the modal and populate it with the note's data
    if (note) {
        // Populate the modal with the note's data
        editModalTitle.value = note.title;
        editModalContent.value = note.content;

        // Show the modal and overlay
        editNoteModal.style.display = 'block';
        backgroundOverlay.style.display = 'block';

        // Save the note ID in the dataset of the "Save" button
        saveEditsBtn.dataset.noteId = note.id;
    }
}

// Event listener for the "Save" button in the modal
const saveEditsBtn = document.querySelector('.save-edits-btn');
saveEditsBtn.addEventListener('click', function(){
     // Get the ID of the note being edited from the dataset of the save button
     const noteId = this.dataset.noteId;

     // Find the note in the notes array with the given ID
     const noteIndex = notes.findIndex(note => note.id === noteId);
     
     // If the note is found, update its title and content with the values from the modal input fields
     if (noteIndex !== -1) {
         const updatedTitle = editModalTitle.value;
         const updatedContent = editModalContent.value;
 
         // Update the note in the notes array
         notes[noteIndex].title = updatedTitle;
         notes[noteIndex].content = updatedContent;
 
         // Hide the modal and overlay
         editNoteModal.style.display = 'none';
         backgroundOverlay.style.display = 'none';
 
         // Re-render the notes to reflect the changes
         renderNotes();
         createThumbnails()
         console.log(notes)
     }
});

// DELETE NOTE
function deleteNote(id) {
    // Find the index of the note with the given ID
    const index = notes.findIndex(note => note.id === id);
    // If the note is found, remove it from the notes array
    if (index !== -1) {
        notes.splice(index, 1);
        renderNotes()
        notesCounter.innerHTML = notes.length
        createThumbnails()
        console.log(notes)
        
    }
}

// GENERATE UNIQUE ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// SEARCH NOTES
const searchInput = document.querySelector('.search-input')
// Function to render filtered notes
function renderFilteredNotes(filteredNotes) {
    // Clear the existing content of the notes container
    notesContainer.innerHTML = '';

    // Loop through the filtered notes array and create individual note elements
    filteredNotes.forEach(function(note) {
        const individualNoteElement = createIndividualNoteElement(note);
        // Append the individual note element to the notes container
        notesContainer.appendChild(individualNoteElement);
    });
}

// Event listener for the input field to handle search
searchInput.addEventListener('input', function() {
    // Get the search query from the input value
    const searchQuery = this.value.trim().toLowerCase();

    // Filter the notes array based on the search query
    const filteredNotes = notes.filter(function(note) {
        // Convert both the note title and search query to lowercase for case-insensitive comparison
        return note.title.toLowerCase().includes(searchQuery);
    });

    // Render the filtered notes
    renderFilteredNotes(filteredNotes);
});





// Global Query Selectors
const noteContainer = document.querySelector(".note-container");
const modalContainer = document.querySelector(".modal-container");
const form = document.querySelector("form");

// Note Class
class Note {
	constructor(title, body, hasId = true) {
		this.title = title;
		this.body = body;

		if (hasId) this.id = Math.random();
	}
}

function addNoteToList(note) {
	const noteElement = document.createElement("div");
	noteElement.classList.add("note");
	noteElement.innerHTML = `
	<span hidden>${note.id}</span>
	<h2 class="note__title">${note.title}</h2>
	<p class="note__body">${note.body}</p>
	<div class="note__btns">
		<button class="note__btn note__view">View Detail</button>
		<button class="note__btn note__delete">Delete Note</button>
		<button class="note__btn note__count">Count Vowels</button>
	</div>`;

	noteContainer.appendChild(noteElement);
}

function activateNoteModal(note) {
	const modalTitle = document.querySelector(".modal__title");
	const modalBody = document.querySelector(".modal__body");

	modalTitle.textContent = note.title;
	modalBody.textContent = note.body;

	modalContainer.classList.add("active");
}

function displayVowelCount(note) {
	const modalTitle = document.querySelector(".modal__title");
	const modalBody = document.querySelector(".modal__body");

	modalTitle.textContent = `Vowel count in '${note.title}':`;

	const vowelCount = getVowelCount(note.body);
	modalBody.innerHTML = `A: ${vowelCount.a} <br/>
	E: ${vowelCount.e} <br/>
	I: ${vowelCount.i} <br/>
	O: ${vowelCount.o} <br/>
	U: ${vowelCount.u} <br/>
	Total: ${vowelCount.total} <br/>`;

	modalContainer.classList.add("active");
}

function getVowelCount(text) {
	const output = {
		a: 0,
		e: 0,
		i: 0,
		o: 0,
		u: 0,
		total: 0,
	};

	[...text].forEach((c) => {
		switch (c) {
			case "a":
			case "A": {
				++output["a"];
				break;
			}
			case "e":
			case "E": {
				++output["e"];
				break;
			}
			case "i":
			case "I": {
				++output["i"];
				break;
			}
			case "o":
			case "O": {
				++output["o"];
				break;
			}
			case "u":
			case "U": {
				++output["u"];
				break;
			}
		}
	});

	output.total = output.a + output.e + output.i + output.o + output.u;

	return output;
}

function showMessage(msgClass) {
	var text;
	if (document.querySelector(".message") != null) document.querySelector(".message").remove();

	switch (msgClass) {
		case "alert-message": {
			text = "You must enter a title and a body.";
			break;
		}
		case "remove-message": {
			text = "Note has been removed permanently.";
			break;
		}
		default: {
			return;
		}
	}

	const formContainer = document.querySelector(".form-container");
	const message = document.createElement("div");
	message.className = `message ${msgClass}`;
	message.appendChild(document.createTextNode(text));

	formContainer.insertBefore(message, formContainer.children[2]);
	setTimeout(() => message.remove(), 2000);
}

function displayNotes() {
	const notes = getNotes();
	notes.forEach((note) => addNoteToList(note));
}

/// LOCAL STORAGE FUNCTIONS
// Retrieve notes from local storage
function getNotes() {
	let notes;
	if (localStorage.getItem("noteApp.notes") === null) {
		notes = [];
	} else {
		notes = JSON.parse(localStorage.getItem("noteApp.notes"));
	}

	return notes;
}

// Add note to local storage
function addNoteToLocalStorage(input) {
	const notes = getNotes();

	notes.forEach((note) => {
		if (note.id === input.id) {
			input.id = Math.random();
			displayNotes();
		}
	});

	notes.push(input);
	localStorage.setItem("noteApp.notes", JSON.stringify(notes));
}

// Remove note from local storage
function removeNote(id) {
	const notes = getNotes();

	notes.forEach((note, index) => {
		if (note.id === id) {
			notes.splice(index, 1);
		}
	});
	localStorage.setItem("noteApp.notes", JSON.stringify(notes));
}

/// UI FUNCTIONS
// Event: Note buttons
noteContainer.addEventListener("click", (e) => {
	if (e.target.classList.contains("note__view")) {
		const currentNote = e.target.closest(".note");
		const noteObj = new Note(
			currentNote.querySelector(".note__title").textContent,
			currentNote.querySelector(".note__body").textContent,
			false
		);

		activateNoteModal(noteObj);
	}

	if (e.target.classList.contains("note__delete")) {
		const currentNote = e.target.closest(".note");
		currentNote.remove();
		showMessage("remove-message");
		const id = currentNote.querySelector("span").textContent;

		removeNote(Number(id));
	}

	if (e.target.classList.contains("note__count")) {
		const currentNote = e.target.closest(".note");
		const noteObj = new Note(
			currentNote.querySelector(".note__title").textContent,
			currentNote.querySelector(".note__body").textContent,
			false
		);

		displayVowelCount(noteObj);
	}
});

// Event: Close Modal
const modalBtn = document.querySelector(".modal__btn").addEventListener("click", () => {
	modalContainer.classList.remove("active");
});

// Event: Submit
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const titleInput = document.querySelector("#title");
	const noteInput = document.querySelector("#note");

	// validate input
	if (titleInput.value.length > 0 && noteInput.value.length > 0) {
		const newNote = new Note(titleInput.value, noteInput.value);
		titleInput.value = "";
		noteInput.value = "";

		titleInput.focus();
		addNoteToList(newNote);
		addNoteToLocalStorage(newNote);
		showMessage("");
	} else {
		showMessage("alert-message");
	}
});

// Event: Display Notes
document.addEventListener("DOMContentLoaded", displayNotes);

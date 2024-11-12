let container = document.querySelector(".container");
let ballColors = [
	"red",
	"green",
	"blue",
	"yellow",
	"purple",
	"orange",
	"gray",
	"brown",
	"darkgrey",
];
let selected = "ball"; //selected pokazuje da je za pomeranje izabrana lopta.
let twoClicks = []; // twoClicks je niz koji pamti polja prilikom dva klika mišem: prvo polje sadrži loptu, a drugo je ciljno polje.
let foundedBall = false; // foundedBall je logička vrednost koja pokazuje da li je pronađen slobodan put ka cilju.

makeGrid(); //Calling function makeGrid that generates grid with 100 fields
let boxes = document.querySelectorAll(".box"); //Selektuju se svi HTML elementi sa klasom box
boxes.forEach((box) => box.addEventListener("click", selectBall)); // i dodaje im se click event listener, koji će pokrenuti funkciju selectBall kad se klikne na polje.
makeBalls(3); //Calling function makeBalls that sets some number of balls

// Funkcija selectBall
function selectBall() { // Ova funkcija se poziva kada korisnik klikne na polje.
	if (selected === "ball") { // Ako je selected jednako "ball", proverava se da li polje sadrži loptu (this.innerHTML !== ""). 
		if (this.innerHTML !== "") { // Ako sadrži:
			selected = null; // selected se postavlja na null (označava da je lopta izabrana).
			twoClicks[0] = this; // Prvo kliknuto polje se pamti u twoClicks[0].
		} else { // Ako polje ne sadrži loptu, prikazuje se poruka.
			alert("Selection should be ball!");
		}
	} else {
		if (this.innerHTML === "") { // Ako selected nije "ball", proverava se da li je kliknuto polje prazno.
			selected = "ball"; // Ako jeste, ažurira se selected na "ball",
			twoClicks[1] = this; //  ciljno polje se postavlja u twoClicks[1],
			this.classList.add("newBallPosition"); // a dodaje se klasa newBallPosition.
			findAllPossiblePaths(twoClicks[0]); // Poziva se findAllPossiblePaths() da proveri putanju od prvog kliknutog polja do ciljnog polja.
		} else { // Ako polje sadrži loptu, prikazuje se upozorenje.
			alert("There is a ball inside!");
		}
		if (twoClicks.length === 2 && foundedBall) { // Ako su oba polja izabrana i postoji slobodna putanja (foundedBall je true):
			twoClicks[1].innerHTML = twoClicks[0].innerHTML; // Lopta se pomera iz twoClicks[0] u twoClicks[1].
			twoClicks[0].innerHTML = ""; // Prvobitno polje se briše (innerHTML = ""), 
			twoClicks.length = 0; // a niz twoClicks se resetuje.
			resetAll(); // Funkcija resetAll čisti prethodna podešavanja.
			makeBalls(3); // Funkcija makeBalls(3) dodaje tri nove lopte na mrežu,
			checkWinnings(); // a checkWinnings proverava pobedničke nizove.
		} else { // Ako nema slobodnog puta, prikazuje se upozorenje,
			alert("There is no free path!");
			resetAll(); // a resetAll vraća sve na početno stanje.
		}
	}
}

// Funkcija checkWinnings
function checkWinnings() { // Definiše niz lines koji sadrži ofsete za horizontalne, vertikalne i dijagonalne linije za pretragu četiri uzastopna polja.
	let lines = [
		[1, 2, 3, 4],
		[-1, -2, -3, -4],
		[10, 20, 30, 40],
		[-10, -20, -30, -40],
		[11, 22, 33, 44],
		[-11, -22, -33, -44],
		[9, 18, 27, 36],
		[-9, -18, -27, -36],
	];
	boxes.forEach((box) => { // Za svako polje (box), koristi boxId kao osnovu
		let boxId = parseInt(box.id);
		let boxInner = box.innerHTML;
		lines.forEach((line) => { // i koristi lines da proveri četiri susedna polja u liniji.
			let boxOne = boxes[boxId + line[0]];
			let boxTwo = boxes[boxId + line[1]];
			let boxThree = boxes[boxId + line[2]];
			let boxFour = boxes[boxId + line[3]];

			if ( // Ako pronađe niz od četiri uzastopne lopte iste boje,
				boxOne &&
				boxTwo &&
				boxThree &&
				boxFour &&
				boxInner === boxOne.innerHTML &&
				boxInner === boxTwo.innerHTML &&
				boxInner === boxThree.innerHTML &&
				boxInner === boxFour.innerHTML &&
				boxInner !== ""
			) { // postavlja pozadinu crvenu kao indikator.
				box.style.background = "red";
				boxOne.style.background = "red";
				boxTwo.style.background = "red";
				boxThree.style.background = "red";
				boxFour.style.background = "red";
				setTimeout(() => {
					box.innerHTML = "";
					boxOne.innerHTML = "";
					boxTwo.innerHTML = "";
					boxThree.innerHTML = "";
					boxFour.innerHTML = "";
 				// Zatim, nakon 750 ms, briše te lopte sa mreže.
					box.style.background = "";
					boxOne.style.background = "";
					boxTwo.style.background = "";
					boxThree.style.background = "";
					boxFour.style.background = "";
				}, 750);
			}
		});
	});
}

// Funkcija resetAll
function resetAll() { // Resetuje:
	foundedBall = false;
	boxes.forEach((box) => {
		box.style.background = ""; // boje
		box.classList.remove("newBallPosition"); // klase
		box.removeAttribute("data-id"); // i atribut data-id svih polja.
	});
}

// Funkcija findAllPossiblePaths
function findAllPossiblePaths(selectedBall) {
	selectedBall.setAttribute("data-id", "parent"); // Postavlja data-id na "parent" za polje s loptom.
	console.log(selectedBall.id);
	let boxId = parseInt(selectedBall.id); // Inicijalizuje susedna polja za proveru (levo, desno, gore, dole).
	let leftBox = boxes[boxId - 1];
	let rightBox = boxes[boxId + 1];
	let topBox = boxes[boxId - 10];
	let bottomBox = boxes[boxId + 10];

	let possiblePaths = [];

	//left edge check
	if (
		boxId % 10 !== 0 &&
		leftBox.innerHTML === "" &&
		leftBox.getAttribute("data-id") !== "parent"
	) {
		possiblePaths.push(leftBox);
	}

	// right edge check
	if (
		boxId % 10 !== 9 &&
		rightBox.innerHTML === "" &&
		rightBox.getAttribute("data-id") !== "parent"
	) {
		possiblePaths.push(rightBox);
	}

	// top edge check
	if (
		topBox &&
		topBox.innerHTML === "" &&
		topBox.getAttribute("data-id") !== "parent"
	) {
		possiblePaths.push(topBox);
	}

	// bottom edge check
	if (
		bottomBox &&
		bottomBox.innerHTML === "" &&
		bottomBox.getAttribute("data-id") !== "parent"
	) {
		possiblePaths.push(bottomBox);
	}

	possiblePaths.forEach((box) => {
		if (!box.classList.contains("newBallPosition")) {
			// box.style.background = "#ddd";
			findAllPossiblePaths(box);
		} else {
			foundedBall = true;
		}
	});
}

function makeBalls(ballNumber) {
	let rand = Math.floor(Math.random() * boxes.length);
	let rand2 = Math.floor(Math.random() * ballColors.length);
	let randColor = ballColors[rand2];
	let randBox = boxes[rand];
	if (randBox.innerHTML === "") {
		randBox.innerHTML = `<div class="ball" style="background: ${randColor}"></div>`;
		ballNumber--;
	}
	ballNumber === 0 ? null : makeBalls(ballNumber);
}

function makeGrid() {
	let text = ``; //defining of variable let, that has empty string value
	for (let i = 0; i < 100; i++) {
		text += `
			<div class="box" id="${i}"></div>
			`.trim();
	container.innerHTML = text;
}

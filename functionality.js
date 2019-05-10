function showFile() {
	let preview = document.getElementById('show-text');
	let file = document.querySelector('input[type=file]').files[0];
	let rdr = new FileReader(file);
	rdr.onload = function (event) {
		let content = event.target.result;
		preview.textContent = content;
	}
	rdr.readAsText(file);
}

let Data = [];

function analysisDo() {
	let preview = document.getElementById('show-text');
	let text = preview.innerHTML;
	let pattern = /\n(?=\d+\/)/;
	let comp = text.split(pattern);



	for (let i=0;i<comp.length-1; i++) {
		// DATE PARSING
		let date = comp[i].substring(0, comp[i].indexOf('-'));
		let split1 = date.split(" ");
		let split2 = split1[0].split("/");
		let day = parseInt(split2[0]);
		let month = parseInt(split2[1]);
		let year = 2000 + parseInt(split2[2]);
		split2 = split1[1].split(":");
		let hour = parseInt(split2[0]);
		let minute = parseInt(split2[1]);

		// SENDER PARSING
		let text = comp[i].substring(comp[i].indexOf('-'));
		let sender = text.substring(2, text.indexOf(':'));
		let msj = text.substring(text.indexOf(':')+2)

		// DICTIONARY ENTRY BUILD
		let data = {
			"id": i+1,
			"sender" : sender,
			"date": new Date( year, month, day, hour, minute),
			"msj": msj
		};
		Data.push(data);

	}
	console.log(Data);
}

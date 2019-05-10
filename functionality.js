function showFile() {
	var preview = document.getElementById('show-text');
	var text = ""
	var file = document.querySelector('input[type=file]').files[0];
	var rdr = new FileReader(file)
	rdr.onload = function (event) {
		var content = event.target.result;
		preview.textContent = content;
	}
	rdr.readAsText(file);
}


function analysisDo() {
	var preview = document.getElementById('show-text');
	var text = preview.innerHTML;
	var comp = text.split("\n");

	var Names = {}
	var name
	var i;
	for (i=1;i<comp.length; i++) {
		var j;
		name = ""
		for ( j=17; comp[i][j] != ':'; j++){
			name = name + comp[i][j]
		}

		if (Names[name] == null) {
			Names[name] = []
		}
		var data = {
				"date": comp[i].substring(0, 8),
				"time": comp[i].substring(9, 15),
				"msj": comp[i].substring(j +1)
			}
		Names[name].push(data)
		console.log(Names)

	}

	console.log(Names)
	//console.log(comp[1])
	//var date = comp[1].substring(0, 8)
	//var time = comp[1].substring(9, 15)
	//var Name = ""
	//var i;
	//for ( i=17; comp[1][i] != ':'; i++){
	//	Name = Name + comp[1][i]
	//}
	//console.log(date)
	//console.log(time)
	//console.log(Name)
	//console.log(comp[1].substring(i +1 ))
}

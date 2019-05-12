let input, button, button2, greeting;

function setup() {
    // create canvas
    createCanvas(710, 400);

    input = createInput("", "file");
    input.position(20, 65);

    button = createButton('submit');
    button.position(input.x + input.width, 65);
    button.mousePressed(showFile);

    greeting = createElement('h2', 'Upload document:');
    greeting.position(20, 5);

    textAlign(CENTER);
    textSize(50);
}

function showFile() {
    let preview = document.getElementById('show-text');
    let file = document.querySelector('input[type=file]').files[0];
    let rdr = new FileReader(file);
    rdr.onload = function (event) {
        preview.textContent = event.target.result;
    };
    rdr.readAsText(file);
    button2 = createButton('analyze');
    button2.position(button.x + button.width, 65);
    button2.mousePressed(analysisDo);
    button2.style = 'hidden';
}

let Data = [];
let Users = {};

function analysisDo() {
    console.log("Analyzing");
    let preview = document.getElementById('show-text');
    let text_to_read = preview.innerHTML;
    let pattern = /\n(?=\d+\/\d+\/\d+)/;
    let comp = text_to_read.split(pattern);
    for (let i=0;i<comp.length-1; i++) {
        // DATE PARSING
        let date = comp[i].substring(0, comp[i].indexOf('-'));
        let split1 = date.split(" ");
        let split2 = split1[0].split("/");
        let day = parseInt(split2[0]);
        let month = parseInt(split2[1]) - 1;
        let year = 2000 + parseInt(split2[2]);
        split2 = split1[1].split(":");
        let hour = parseInt(split2[0]);
        let minute = parseInt(split2[1]);

        // SENDER PARSING
        let text = comp[i].substring(comp[i].indexOf('-'));
        let sender = text.substring(2, text.indexOf(':'));
        let msj = text.substring(text.indexOf(':')+2);

        // DICTIONARY ENTRY BUILD
        let data = {
            "id": i+1,
            "sender" : sender,
            "date": new Date( year, month, day, hour, minute),
            "msj": msj
        };
        Data.push(data);
    }
    //ANALYZE USERS
    let chunk = 1;
    for (let i=0; i < Data.length; i++){
        if (Data[i].sender in Users) {
            Users[Data[i].sender].count += 1;
            if (Data[i].sender === Data[i-1].sender) {
                chunk +=1
            }
            else {
                Users[Data[i-1].sender].chunk.push(chunk);
                chunk = 1;
                Users[Data[i].sender].delay.push((Data[i].date - Data[i - 1].date)/60000);
            }
        }
        else {
            Users[Data[i].sender] = {
                "count": 1,
                "delay": [],
                "chunk": [],
            };
        }
    }
    // PARAMETERS
    let total = Data.length;
    let start = Data[0].date;
    let last = Data[total-1].date;
    let total_text = "Total: " + total.toString();

    textSize(32);
    fill(0, 102, 153);
    text(total.toString(), 70, button.y + button.height + 32);
}
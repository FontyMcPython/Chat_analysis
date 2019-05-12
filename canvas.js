let input, button, button2, greeting;
let progress = 0;

function setup() {
    // create canvas
    createCanvas(windowWidth, windowHeight);

    input = createInput("", "file");
    input.position(width/2 - 250, 65);

    button = createButton('submit');
    button.position(input.x, input.y + input.height + 5);
    button.mousePressed(showFile);

    greeting = createElement('h2', 'Upload document:');
    greeting.position(width/2 - 250, 5);

    textAlign(CENTER);
    textSize(50);
    noLoop();
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
    button2.position(button.x + button.width, button.y);
    button2.mousePressed(analysisDo);
    button2.style = 'hidden';
}

let Data = [];
let Users = {};

let total;
let start;
let last;

function analysisDo() {
    let preview = document.getElementById('show-text');
    let text_to_read = preview.innerHTML;
    let pattern = /\n(?=\d+\/\d+\/\d+)/;
    let comp = text_to_read.split(pattern);
    let prev = new Date();
    for (let i=0;i<comp.length-1; i++) {
        let act = new Date();
        if (act - prev > 15) {
            rect(400, 400, 200*i/comp.length, 40);
            prev = act;
        }

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
    background(255);
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
    total = Data.length;
    start = Data[0].date;
    last = Data[total-1].date;

    // PRESENTATION
    background(240);
    textSize(15);
    fill(0, 102, 153);
    text(
        total.toString() + " messages between " + start.toDateString() + " and " + last.toDateString(),
        width/2 - 250,
        button.y + button.height + 32,
        300,
        200);

    console.log(prev);

    let lastAngle = 0;
    strokeWeight(0);
    for(let keys in Users) {
        fill(255 - 1.75*255*( Users[keys].count / total ), 255 - 1.75*255*( Users[keys].count / total ), 255 - 1.75*255*( Users[keys].count / total ));
        textSize(15);
        let angle = ( Users[keys].count / total )* 360;
        text(keys, width/2 + 100*cos(lastAngle), button.y + button.height + 200 + 100*sin(lastAngle));
        arc(
            width/2,
            button.y + button.height + 200,
            100,
            100,
            lastAngle,
            lastAngle + radians(angle));
        lastAngle = lastAngle + radians(angle)

    }
}
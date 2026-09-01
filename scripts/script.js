

const paycheck_field = document.getElementById("paycheck");
const person_a_input = document.getElementById("personA");
const person_b_input = document.getElementById("personB");

function sanitizeInput(a){
    a = a.replace(',','.');
    a = a.replace(/[^\d.]/g,'');
    const parts = a.split('.');
    if(parts.length > 2 ){
        a = parts[0] +'.' + parts.slice(1).join('');  
    }
    const [int,dec] = a.split('.');
    if(dec!== undefined){
        a = int + '.' + dec.slice(0,2);
    }
    return a;

}

document.querySelectorAll('.income').forEach(input => {
    input.addEventListener('input', () =>{
        const caret = input.selectionStart;
        const before = input.value;
        const after = sanitizeInput(before);
        if(after === before){
            return;
        }

        input.value = after;
        const shift = before.length - after.length;
        input.setSelectionRange(caret - shift, caret - shift);
    });
});


const BtnCalc = document.getElementById('calcBtn');
const PersAper = document.getElementById('resultAOutput');
const PersBper = document.getElementById('resultBOutput');
const PersApart = document.getElementById('PartAOutput');
const PersBpart = document.getElementById('PartBOutput');
const FieldCard = document.getElementsByClassName('field-card');
const PaycheckNote = document.getElementById('paycheck-note');

BtnCalc.addEventListener('click', ()=>{
    

    for(let i = 0; i < FieldCard.length; i++){
        FieldCard[i].classList.remove('fail');
        FieldCard[i].classList.remove('overload');
    }
    PaycheckNote.textContent = '';
    //console.log(Number.isFinite(Number(""))+ " " + Number("")) ;    // ?
    //console.log(Number.isFinite(parseFloat("")) + " " + parseFloat("")) ; // ?
    if(!Number.isFinite(parseFloat(person_a_input.value)) && !Number.isFinite(parseFloat(person_b_input.value))){
        console.log("invalid");
        FieldCard[0].classList.add('fail');
        FieldCard[1].classList.add('fail');
        return;
    }
    if(!Number.isFinite(parseFloat(person_a_input.value))) {
        FieldCard[0].classList.add('fail');
        return;
    }
    if(!Number.isFinite(parseFloat(person_b_input.value))){
        FieldCard[1].classList.add('fail');
        return;
    } 
    if(!Number.isFinite(parseFloat(paycheck_field.value))){
        FieldCard[2].classList.add('fail');
        return;
    } 
    

    if (Number(paycheck_field.value) > Number(person_a_input.value) + Number(person_b_input.value)) {
    FieldCard[2].classList.add('overload');
    PaycheckNote.textContent = ' — перевищує дохід';
    }
    

    let pers_a = Number(person_a_input.value);
    let pers_b = Number(person_b_input.value);
    let paycheck = Number(paycheck_field.value);
    //res = parseFloat(person_a_input.value) + parseFloat(person_b_input.value);
    //res = Number(person_a_input.value) + Number(person_b_input.value);
    //console.log(pers_a + " " + pers_b );

    let sum = pers_a + pers_b;
    let pers_a_part, pers_b_part, pers_a_per,pers_b_per ;

    if(sum !== pers_a || sum !== pers_b){
        
        pers_a_per = (pers_a / sum) * 100;
        pers_b_per = (pers_b / sum) * 100;
        //console.log("nice " + pers_a_per + " " + pers_b_per);
        PersAper.textContent = pers_a_per.toFixed(2);
        PersBper.textContent = pers_b_per.toFixed(2);
        pers_a_part = paycheck * (pers_a_per / 100);
        pers_b_part = paycheck * (pers_b_per / 100);
        PersApart.textContent = pers_a_part.toFixed(2);
        PersBpart.textContent = pers_b_part.toFixed(2);
        //console.log("good " + pers_a_part + " " + pers_b_part);
    }
})

function circle(){
    const results = document.querySelector('.results');
    const circleDiv = document.createElement('div');
    results.appendChild(circleDiv);
    let size = 300;
    circleDiv.className = 'circle';
    circleDiv.style.width = `${size}px`;
    circleDiv.style.height = `${size}px`;
}

circle();


const paychek_field = document.getElementById("paycheck");
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

paychek_field.addEventListener('input', () =>{
    const caret = paychek_field.selectionStart;
    const before = paychek_field.value;
    const after = sanitizeInput(before);
    if(after === before){
        return;
    }

    paychek_field.value = after;
    const shift = before.length - after.length;
    paychek_field.setSelectionRange(caret - shift, caret - shift);
});

person_a_input.addEventListener('input', () =>{
    const caret = person_a_input.selectionStart;
    const before = person_a_input.value;
    const after = sanitizeInput(before);
    if(after === before){
        return;
    }

    person_a_input.value = after;
    const shift = before.length - after.length;
    person_a_input.setSelectionRange(caret - shift, caret - shift);
});

person_b_input.addEventListener('input', () =>{
    const caret = person_b_input.selectionStart;
    const before = person_b_input.value;
    const after = sanitizeInput(before);
    if(after === before){
        return;
    }

    person_b_input.value = after;
    const shift = before.length - after.length;
    person_b_input.setSelectionRange(caret - shift, caret - shift);
});

const BtnCalc = document.getElementById('calcBtn');
const PersAper = document.getElementById('resultAOutput');
const PersBper = document.getElementById('resultBOutput');
const PersApart = document.getElementById('PartAOutput');
const PersBpart = document.getElementById('PartBOutput');
const FieldCard = document.getElementsByClassName('field-card');

function CalculatePersent(a,b){
    let persent = a/b;
    console.log(persent+'\n');
    return persent;
}

BtnCalc.addEventListener('click', ()=>{
    
    for(let i = 0; i < FieldCard.length; i++){
        FieldCard[i].classList.remove('fail');
    }
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

    
    let res; 
    let pers_a = Number(person_a_input.value);
    let pers_b = Number(person_b_input.value);
    let paycheck = Number(paychek_field.value);
    //res = parseFloat(person_a_input.value) + parseFloat(person_b_input.value);
    //res = Number(person_a_input.value) + Number(person_b_input.value);
    console.log(pers_a + " " + pers_b );

    let sum = pers_a + pers_b;
    let pers_a_part, pers_b_part, pers_a_per,pers_b_per ;

    if(sum !== pers_a || sum !== pers_b){
        
        pers_a_per = (pers_a / sum) * 100;
        pers_b_per = (pers_b / sum) * 100;
        console.log("nice " + pers_a_per + " " + pers_b_per);
        PersAper.textContent = pers_a_per.toFixed(2);
        PersBper.textContent = pers_b_per.toFixed(2);
        pers_a_part = paycheck * (pers_a_per / 100);
        pers_b_part = paycheck * (pers_b_per / 100);
        PersApart.textContent = pers_a_part.toFixed(2);
        PersBpart.textContent = pers_b_part.toFixed(2);
        console.log("good " + pers_a_part + " " + pers_b_part);
    }
    



    
})
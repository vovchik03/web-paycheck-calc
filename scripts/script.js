

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
const ResultsExtra = document.getElementById('resultsExtra');

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
        ResultsExtra.classList.add('open');
        requestAnimationFrame(() => circleDiv.classList.add('visible'));
        const budgetPersent = Math.min((paycheck / sum) * 100, 100);
        const targetAngle = budgetPersent * 3.6;
        circleDiv.style.setProperty('--persent-angle',`${targetAngle}deg`);
        animateCircleLabel(targetAngle);
        scrollToCircle();
})

// власний твін замість scrollIntoView: браузер не дає керувати тривалістю,
// а так скрол закінчується рівно тоді ж, коли доростає сектор і цифра
let scrollRaf = 0;
function scrollToCircle(){
    cancelAnimationFrame(scrollRaf);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
        window.scrollTo(0, circleTargetY());
        return;
    }
    const from = window.scrollY;
    const start = performance.now();
    const duration = 1500;                       // як transition --persent-angle
    const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;   // easeInOutCubic
        window.scrollTo(0, from + (circleTargetY() - from) * eased);
        if(t < 1){
            scrollRaf = requestAnimationFrame(tick);
        }
    };
    scrollRaf = requestAnimationFrame(tick);
}

// ціль перераховується щокадру: поки .results-extra розкривається,
// змінюється і позиція кола, і межа, до якої взагалі можна доскролити
function circleTargetY(){
    const rect = circleDiv.getBoundingClientRect();
    const centered = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(centered, max));
}

// якщо користувач сам почав крутити — не воюємо з ним
['wheel','touchstart','keydown'].forEach(type =>
    window.addEventListener(type, () => cancelAnimationFrame(scrollRaf), { passive: true }));

let labelRaf = 0;
function animateCircleLabel(targetAngle){
    cancelAnimationFrame(labelRaf);
    const tick = () => {
        const angle = parseFloat(getComputedStyle(circleDiv).getPropertyValue('--persent-angle')) || 0;
        circleLabel.textContent = `${Math.round(angle / 3.6)}%`;
        if(Math.abs(angle - targetAngle) < 0.01){
            return;
        }
        labelRaf = requestAnimationFrame(tick);
    };
    labelRaf = requestAnimationFrame(tick);
}

function circle(){
    const target = document.getElementById('resultsExtra');

    const title = document.createElement('h3');
    title.className = 'circle-title';
    title.textContent = 'ВИКОРИСТАНО БЮДЖЕТУ';
    target.appendChild(title);

    const circleDiv = document.createElement('div');
    circleDiv.className = 'circle';

    const shadowed = document.createElement('div');
    shadowed.className = 'circle__shadowed';
    const fill = document.createElement('div');
    fill.className = 'circle__fill';
    shadowed.appendChild(fill);
    circleDiv.appendChild(shadowed);

    const label = document.createElement('span');
    label.className = 'circle__label';
    label.textContent = '0%';
    circleDiv.appendChild(label);

    target.appendChild(circleDiv);
    return circleDiv;
}

const circleDiv = circle();
const circleLabel = circleDiv.querySelector('.circle__label');
const circleTitle = ResultsExtra.querySelector('.circle-title');

// коло підганяється під ширину контейнера: жорсткі 300px не влазили в .results
// на телефоні, і overflow:hidden різав саме коло разом із тінню
function layoutCircle(){
    const BORDER = 10;     // border: 5px з двох боків
    const GAP = 12;        // запас, щоб drop-shadow не впирався в межу обрізання
    const room = ResultsExtra.clientWidth - GAP * 2 - BORDER;
    const size = Math.max(180, Math.min(300, room));
    circleDiv.style.width = `${size}px`;
    circleDiv.style.height = `${size}px`;
    // висоту рахуємо під фактичний розмір, бо height:auto не анімується
    const height = 5                       // margin-top заголовка
        + circleTitle.offsetHeight
        + 20                               // margin-top кола
        + size + BORDER
        + 16;                              // нижня тінь: 4px зсуву + 10px розмиття
    ResultsExtra.style.setProperty('--extra-height', `${height}px`);
}

layoutCircle();

let layoutRaf = 0;
window.addEventListener('resize', () => {
    cancelAnimationFrame(layoutRaf);
    layoutRaf = requestAnimationFrame(layoutCircle);
});

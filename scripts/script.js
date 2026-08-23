

const paychek_field = document.getElementById("paycheck");

function sanitizeInput(a){
    a = a.replace(',','.');
    a = a.replace(/[^\d.]/g,'');
    const parts = a.split('.');
    if(parts.length > 2 ){
        a = parts[0] +'.' + parts.slice(1).join('');  
    }
    const [int,dec] = a.split('.');
    if(dex!== undefined){
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
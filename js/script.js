const container = document.querySelector(".container");
const main_zone = document.querySelector("#main-zone");
const left_zone = document.querySelector("#left-hand");
const right_zone = document.querySelector("#right-hand");
const tian_zone = document.querySelector("#tian-zone");

const stageShow = document.querySelector(".curr-stage");
const record = document.querySelector(".record-table");
const broadcast = document.querySelector(".game-broadcast");
const next_btn = document.querySelector("#next-stage-btn");
const split_btn = document.querySelector(".split-pick-btn");
const result_show =document.querySelector(".result-show");
const gua_dict = document.querySelector(".gua-dict");
const gua_dict_block = document.querySelector(".gua-dict-block");
const gua_gallery = document.querySelector('.gua-gallery');
const gua_gallery_show = document.querySelector('.gua-gallery-show');

// const gua_data_set 

let splitIndex=0; 
let nowStageIdx = -1;
let turn = 0;
let round = 0;
let n_guas = 0;
let record_guas = [];
let chosed = ""; 
let signs = [];

gua_gallery_show.hidden = true;

const render = (signs)=>{
    signs.map(sign=>{
        let newSign = document.createElement("div");
        if(sign.place=="tian-zone"){
            newSign.style.transform= "rotateZ(90deg)";
        }else{
            newSign.style.transform= `rotateZ(${Math.random()*8-4}deg) translateY(${Math.random()*8-4}px)`;
        }
    })
    for(let i=0;i<n;i++){
        
        newSign.classList.add("sign");
        if(place.id=="tian-zone"){
            newSign.style.transform= "rotateZ(90deg)";
        }else{
            newSign.style.transform= `rotateZ(${Math.random()*8-4}deg) translateY(${Math.random()*8-4}px)`;
        }
        place.appendChild(newSign);
    }
}

const startStage = async()=>{
    broadcast.style.top = "40px";
    createSigns(50,main_zone);
    next_btn.hidden = false;
    next_btn.innerText = "下一步";
}


const tianStage = async()=>{
    let tianSign = main_zone.querySelectorAll(".sign")[0];
    tianSign = [tianSign];
    sendSigns(tianSign,tian_zone);
}


const splitStage= async()=>{
    round++;
    next_btn.hidden = false;
    splitSigns();
}

const choseStage= async()=>{
    split_btn.hidden = true;
    next_btn.hidden = true;
    let total = main_zone.querySelectorAll(".sign").length
    main_zone.textContent='';
    createSigns(splitIndex,left_zone);
    createSigns(total - splitIndex,right_zone);
    left_zone.classList.add("active");
    right_zone.classList.add("active");
    function choseSide(side){
        console.log(side);
        side.querySelectorAll(".sign")[0].remove();
        left_zone.removeEventListener("click",left_choice ,true);
        left_zone.classList.remove("active");
        right_zone.removeEventListener("click",right_choice,true );
        right_zone.classList.remove("active");
        console.log("event 1")
        nowStageIdx++;
        nextStage();
    }
    let left_choice =choseSide.bind(this,left_zone);
    let right_choice =choseSide.bind(this,right_zone);
    left_zone.addEventListener("click",left_choice,true);
    right_zone.addEventListener("click",right_choice,true);
}

const divideStage= async()=>{
    sortSigns(left_zone);
    await delay(1);
    divideSigns(left_zone);
    await delay(1);
    sortSigns(right_zone);
    await delay(1);
    divideSigns(right_zone);
    await delay(1);
    let left=left_zone.querySelectorAll(".sign");
    let right=right_zone.querySelectorAll(".sign");
    createSigns(left.length + right.length,main_zone);
    await clearSigns(left);
    await clearSigns(right);
    nowStageIdx++;
    nextStage();
}
const countStage= async()=>{
    round = 0;
    await delay(0.2);
    await sortSigns(main_zone);
    await delay(1);
    let n = main_zone.querySelectorAll(".sign").length/4;
    result_show.innerHTML = `
        <h1> 此為 <span>${declareGua(n)}</span></h1>
    `;
    result_show.hidden = false;
    createGuas(n);
    record_guas.push(n);
    turn++;
    next_btn.hidden = false;
};


let stageIndex=[
    startStage,
    tianStage,
    splitStage, //[turn 1]
    choseStage, 
    divideStage,
    splitStage, //[turn 2]
    choseStage,
    divideStage,
    splitStage, //[turn 3]
    choseStage,
    divideStage,
    countStage,
];
let stageText={
    "startStage":"準備五十支籌策",
    "tianStage": "放一支籌策到上方",
    "splitStage":"將籌策分成兩堆",
    "choseStage":"選擇一邊, 移開一支籌策",
    "divideStage":"以四支為單位",
    "countStage": "*****"
}
let chinese_number = ["零","一","二","三","四","五","六","七","八","九","十"];

function nextStage(isAddNowindex=false){
    
    nowStageIdx += isAddNowindex?1:0
    
    if(nowStageIdx+1===13){
        resetSigns()
    }
    console.log(`下一個階段是: ${nowStageIdx}，${stageIndex[nowStageIdx].name}`)
    broadcast.innerHTML = `
        <h1>${stageText[stageIndex[nowStageIdx].name]}</h1>
        <small class="curr-stage">${stageIndex[nowStageIdx].name}</small>
        <h2>${chinese_number[round]}巡 </h2>
    `
    stageIndex[nowStageIdx]().name;

}


function getElementCenterPos(el){
    let pos = el.getBoundingClientRect();
    centerX = (pos.right + pos.left)/2;
    centerY = (pos.bottom + pos.top)/2;
    return [centerX,centerY]
}
function setNote(){
    zones.forEach(zone=>{
        let pos = getElementCenterPos(zone);
        console.log(pos);
        let newNote = document.createElement("div");
        newNote.classList.add("note");
        newNote.style.top  = `${pos[1]}px`;
        newNote.style.left = `${pos[0]}px`;
        container.appendChild(newNote);
    })
}
function declareGua(number){
    const gua_index = {
        6: "陰爻 之 變爻",
        7: "陽爻",
        8: "陰爻",
        9: "陽爻 之 變爻",
    }
    return gua_index[number]
}

const createSigns= async(n,place)=>{
    console.log("place name:"+place.id ,n)
    for(let i=0;i<n;i++){
        let newSign = document.createElement("div");
        newSign.classList.add("sign");
        if(place.id=="tian-zone"){
            newSign.style.transform= "rotateZ(90deg)";
        }else{
            newSign.style.transform= `rotateZ(${Math.random()*8-4}deg) translateY(${Math.random()*8-4}px)`;
        }
        place.appendChild(newSign);
    }
}
const clearSigns = async(signs)=>{
    signs.forEach(sign=>{sign.remove();});
}

function sendSigns(signs,place){
    let n_signs = signs.length;
    clearSigns(signs);
    createSigns(n_signs,place);
}

function splitSigns(){

    split_btn.hidden = false;
    let signs = main_zone.querySelectorAll(".sign");
    splitIndex = Math.floor(signs.length/2);
    updatePick(splitIndex);
}
async function divideSigns(place){
    let signs = place.querySelectorAll(".sign");
    let n_signs = signs.length;
    let n_remove = n_signs%4==0?4:n_signs%4;
    for(let i=0;i<n_remove;i++){
        signs[n_signs-i-1].remove();
        await delay(0.1);
    }
}

const leftPick = ()=>{
    if(splitIndex>1){
        splitIndex--;
        updatePick(splitIndex);
    }
}
const rightPick = ()=>{
    if(splitIndex< main_zone.querySelectorAll(".sign").length-1){
        splitIndex++;
        updatePick(splitIndex);
    }   
}

    
    
const updatePick = (index)=>{
        let signs = main_zone.querySelectorAll(".sign");
        let newSplit = document.createElement("div");
        newSplit.classList.add("split-line");
        if(main_zone.querySelector(".split-line")){
            main_zone.querySelector(".split-line").remove();
        }
        main_zone.insertBefore(newSplit,signs[index]);
    }
function resetSigns(){
    result_show.hidden =true;
    nowStageIdx = 0;
    splitIndex= 0; 
    document.querySelectorAll(".sign").forEach(sign=>{sign.remove();});
}
const sortSigns= async(place)=>{
        let signs = place.querySelectorAll(".sign");
        signs.forEach(sign=>{
            sign.style.transform="rotateZ(0deg)";
            sign.style.margin = "-1px";
        });
        signs.forEach((sign,i)=>{
            if(i%4==0){
                sign.style.marginLeft = "10px"; 
            }
        })
    }


function createGuas(output){
    if(record.childElementCount>=6)return
    let newGua = document.createElement("div");
    if(output%2==0){
        newGua.classList.add("yin");
    }else{
        newGua.classList.add("yang");
    }
    if(output%3==0){
        newGua.classList.add("variety");
    }else{
        newGua.classList.add("normal");
    }
   
    record.appendChild(newGua);
}
function clearGuas(){
    record.textContent="";
}




function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  dragElement(record);

function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

async function getGuaData(data_keyword){
    let wiki_url = "https://en.wikipedia.org/w/api.php";
    let res = await axios.get(wiki_url +
                              "?action=opensearch&format=json&limit=1&origin=*&namespace=0"+
                              "&search="+ data_keyword
                              )
    console.log(res.data)
}



function toggleGuaDict(){
    gua_dict_block.classList.toggle("show"); 
}
function showGua(gua_idx){
    let gua = gua_data_set[gua_idx];

    gua_dict.innerHTML =  `
        <h1>${gua.icon}<span>${gua.name}</span></h1>
        <h2>${gua.name+"，"+gua.intro}</h2>
    `
    gua.content.forEach(parse=>{
        let new_parse = document.createElement("p");
        new_parse.innerText = parse;
        gua_dict.appendChild(new_parse);
    });
}
//showGua(0);


function getResult(gua_list){
    const index = binaryToInt(gua_list)
    const target = gua_index_set[index]
    gua_data_set.map((gua,index)=>{
        console.log(target,gua.name)
        if(gua.name==target){
            
            showGua(index)
        }
    })
    
}
function binaryToInt(b){
    const l = b.length
    let result = 0
    for(let i=0;i<l;i++){
        result+=b[i]*(2**i)
    }
    return result
}
function createGuaGallery(dataset, targetDom){
    const documentFragment = document.createDocumentFragment()
    dataset.map(dataObj=>{
        const {name, icon ,index} = dataObj
        const new_item = document.createElement('div')
        new_item.classList.add('gua-gallery-item')
        new_item.innerHTML = `
            <h1>${icon}</h1>
            <h2>${name}</h2>
        `
        if(index<64&&index>=0){
            new_item.addEventListener('click', updateGalleryShow(index))
        }else{
            new_item.classList.add('label')
        }
        
        documentFragment.appendChild(new_item)
    })
    targetDom.appendChild(documentFragment)
}
function updateGalleryShow(index){
    return ()=>{
        
        let gua = gua_data_set[index]
        // function closeGalleryShow(){
        //     console.log(this,"close")
        //     // gua_gallery.hidden = false
        //     // gua_gallery_show.hidden = true
        // }
        gua_gallery_show.innerHTML= `
            <button class="gua-gallery-close" onclick="closeGalleryShow()"}>X</button>
            <h1>${gua.icon}&nbsp<span>${gua.name}</span></h1>
            <h2>${gua.name+'，'+gua.intro}</h2>
        `
        console.log(index)
        gua.content.forEach(parse=>{
            let new_parse = document.createElement("p");
            new_parse.innerText = parse;
            gua_gallery_show.appendChild(new_parse);
        });
        gua_gallery.hidden = true
        gua_gallery_show.hidden = false
    }
    
}
function closeGalleryShow(){
    gua_gallery.hidden = false
    gua_gallery_show.hidden = true
}
let new_dataset = [{name:'',index:10000,icon:''},...half_gua_set]
for(let i=0;i<8;i++){
    let tmp = []
    for(let j=0;j<9;j++){
        if(j===0){
            tmp[j] = half_gua_set[i]
        }else{
            tmp[j] = gua_data_set[i*8 + j - 1]
        } 
    }
    new_dataset = [...new_dataset, ...tmp]        
}

createGuaGallery(new_dataset, gua_gallery)


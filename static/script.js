
let devices;
const blocSize = 1920 / 2000;




function rgbToHex(rgb) {
    return "#" + (1 << 24 | rgb.r << 16 | rgb.g << 8 | rgb.b).toString(16).slice(1);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function createItemBox(name, type, id)
{
    let fullDiv = document.createElement("div")
    fullDiv.setAttribute("class", "boxMainDiv")
    let itemDiv = document.createElement("div")
    itemDiv.setAttribute('name', name)
    itemDiv.setAttribute("class", "box")
    itemDiv.setAttribute("appId" , id)
    let Img = document.createElement("img")
    Img.setAttribute("class", "boxLogo")
    Img.setAttribute("src", "/assets/" + type + ".png")
    let contextMenu = document.createElement("div")
    contextMenu.setAttribute("class", "itemContextMenu")
    let textContextMenu = document.createElement("p")
    textContextMenu.textContent = name
    contextMenu.style.display = "none"
    contextMenu.append(textContextMenu)
    document.getElementById("PosItems").append(contextMenu)
    itemDiv.append(Img)
    fullDiv.append(contextMenu)
    fullDiv.append(itemDiv)
    return fullDiv
}
function addPosItem(name, pos, type, id)
{
    let out = createItemBox(name, type, id)
    out.style.left = pos.x * blocSize
    out.style.top = pos.y * blocSize + 110
    out.setAttribute("hover" , "false")
    out.style.height = 66
    document.getElementById("PosItems").append(out)
}

function appendNoPosItems(Items)
{
    for (let i = 0; i < Items.length; ++i) {
        let out = createItemBox(Items[i].name, Items[i].type, Items[i].id)
        out.style.left = i * 70 + 10
        out.style.top = 25
        out.setAttribute("hover" , "false")
        out.style.height = 66
        out.classList.add("fold")
        document.getElementById("PosItems").append(out)
    } 
}

function itemHover(e)
{
    this.children[0].style.display = "block"
    this.style.height = parseFloat(this.getBoundingClientRect().height) + (this.children[0].getBoundingClientRect().height)
    this.style.top = parseFloat(this.style.top) - (this.children[0].getBoundingClientRect().height)
    this.style.width = "auto"
}

function itemUnHover(e)
{
    this.style.height = parseFloat(this.getBoundingClientRect().height) - (this.children[0].getBoundingClientRect().height)
    this.style.top = parseFloat(this.style.top) + (this.children[0].getBoundingClientRect().height)
    this.children[0].style.display = "none"
    this.style.width = "auto"
}

function mouseup(e)
{
    if (this.getBoundingClientRect().top < 100) {
        this.classList.add("fold")
    } else {
        this.classList.remove("fold")
    }
}

function colorComp(device)
{
    let first = null;
    try {
        for (let i = 0; i < device.leds.length; ++i) {
            if (i == 0)
                first = device.leds[i].color
            else {
                if (device.leds[i].color.r != first.r || device.leds[i].color.g != first.g || device.leds[i].color.b != first.b)
                    return null
            }
        }
    } catch {
        first = null
    }
    return first;
}

function createLed(led, ledName, CueIndex, id)
{
    try {
        let mainDiv = document.createElement("div")
        let text = document.createElement("p")
        let input = document.createElement("input")
        let inputParent = document.createElement("div")

        mainDiv.setAttribute("style" , "display: flex; align-items: center; margin-bottom: 0.2vw;")
        text.setAttribute("class", "infoMenuLedsText")
        text.textContent = ledName
        input.setAttribute("type", "color")
        inputParent.setAttribute("class", "colorPickerParent")
        inputParent.style.backgroundColor = rgbToHex(led.color)
        input.setAttribute("class" , "colorPicker")
        input.setAttribute("onChange", "setLedStaticColor([{ 'ledId' : ["+ led.ledId + "], 'cueIndex' : " + CueIndex +", 'id' : " + id +"}], this)")
        input.setAttribute("value", rgbToHex(led.color))
        mainDiv.append(text)
        inputParent.append(input)
        mainDiv.append(inputParent)

        document.getElementById("allMyLeds").append(mainDiv)
    } catch {}
}

function dbClick(e)
{
    let device = findDeviceById(this.children[1].getAttribute("appid"))
    let globalColor = colorComp(device)

    document.getElementById("allMyLeds").textContent = ""
    document.getElementById("ItemInfoMenu").setAttribute("name", device.name)
    document.getElementById("ItemInfoMenu").setAttribute("appid", device.id)
    document.getElementById("infoMenuImg").children[0].setAttribute("src", "assets/" + device.name + ".png")
    document.getElementById("infoMenuEffectButtons").setAttribute("name", device.name)
    if (globalColor!= null) {
        document.getElementById("globalStaticColorPicker").value = rgbToHex(globalColor)
        document.getElementById("globalStaticColorPickerParent").style.backgroundColor = rgbToHex(globalColor)
    }else {
        document.getElementById("globalStaticColorPicker").value = "#000000"
        document.getElementById("globalStaticColorPickerParent").style.backgroundColor = "#000000"
    }

    for (let i = 0; i < device.leds.length; ++i) {
        createLed(device.leds[i], "led n°" + (i + 1).toString() + ": " , device.cueIndex)
    }
    document.getElementById("ItemInfoMenu").style.display = "block"
}

function toggleCheckbox(ch)
{
    if(ch.getAttribute("value") == "0" ||ch.getAttribute("value") == null) {
        ch.setAttribute("value", "1")
        ch.children[0].style.opacity = 1
        ch.classList.add("checked")
        ch.classList.remove("unchecked")
    } else {
        ch.setAttribute("value", "0")
        ch.classList.add("unchecked")
        ch.classList.remove("checked")
        ch.children[0].style.opacity = 0
    }  
}

function checkTheBox(e)
{
    toggleCheckbox(this)
}

function loadPage()
{
    let boxs = document.querySelectorAll('.checkbox');
    boxs.forEach(function(boxs) {
        boxs.addEventListener("click", checkTheBox, false)
    })

    $.ajax({url: "/devices", success: function(result){
        devices = result.data
        let noPos = []
        for (let i = 0; i < result.data.length; ++i) {
            
            if (result.data[i].pos.x == -1)
                noPos.push (result.data[i])
            else
                addPosItem(result.data[i].name, result.data[i].pos, result.data[i].type, result.data[i].id)
        }
        appendNoPosItems(noPos)
        $(".boxMainDiv").draggable();
        let items = document.querySelectorAll('.boxMainDiv');
        items.forEach(function(item) {
            item.addEventListener("mouseenter", itemHover, false)
            item.addEventListener("mouseleave", itemUnHover, false)
            item.addEventListener("mousedown", itemUnHover, false)
            item.addEventListener("mouseup", mouseup, false)
            item.addEventListener("dblclick", dbClick, false)
        })
        items = document.querySelectorAll('.box');
    }})
    
    
}

function save()
{
    let items = document.querySelectorAll('.box');
    let out = {"data" : []}
    items.forEach(function(item) {
        let itemPos = [item.getBoundingClientRect().left, item.getBoundingClientRect().top - 110]
        let data = null
        if (itemPos[1] >= 0)
            data = {"id" : item.getAttribute("appid"), "pos" : {"x" : parseInt(itemPos[0] * 2000 / 1920) , "y" : parseInt(itemPos[1] * 2000 / 1920)}}
        else
            data = {"id" : item.getAttribute("appid"), "pos" : {"x" : -1 , "y" : -1}}

        out.data.push(data)
    })

    $.ajax({
        type: "PUT",
        url: "/devices",
        data: JSON.stringify (out),
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            console.log(result);
        },
      });
}

function findDeviceById(id)
{
    for (let i = 0; i < devices.length; ++i) {
        if (devices[i].id == id)
            return devices[i]
    }
    return null
}

function setLedsColor(devices, color, callback)
{
    $.ajax({
        type: "PUT",
        url: "/leds",
        data: JSON.stringify ({"color" : color, "devices" : devices}),
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            if (callback)
                callback(result)
        },
      });
}

function UpdateStaticGlobalColor(item, inItem)
{
    let device = findDeviceById(item)
    let devicesOut = [{"ledId" : [], "cueIndex" : device.cueIndex, "id" : device.id}]
    let color = inItem.value
    
    inItem.parentNode.style.backgroundColor = color
    for (let i = 0; i < device.leds.length; ++i)
        devicesOut[0].ledId.push(device.leds[i].ledId)
    let ledsInput = document.getElementById("allMyLeds").children

    for (let i = 0; i < ledsInput.length; ++i) {
        ledsInput[i].children[1].style.backgroundColor = color
        ledsInput[i].children[1].children[0].value = color
    }
    setLedsColor(devicesOut, hexToRgb(color))
}

function setLedStaticColor(led, inItem)
{
    inItem.parentNode.style.backgroundColor = inItem.value
    setLedsColor(led, hexToRgb(inItem.value))
}

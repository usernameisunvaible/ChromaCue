
let devices;
const blocSize = 1920 / 2000




function createItemBox(name, type)
{
    let fullDiv = document.createElement("div")
    fullDiv.setAttribute("class", "boxMainDiv")
    let itemDiv = document.createElement("div")
    itemDiv.setAttribute('name', name)
    itemDiv.setAttribute("class", "box")
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
function addPosItem(name, pos, type)
{
    let out = createItemBox(name, type)
    out.style.left = pos.x * blocSize
    out.style.top = pos.y * blocSize + 110
    out.setAttribute("hover" , "false")
    out.style.height = 66
    document.getElementById("PosItems").append(out)
}

function appendNoPosItems(Items)
{
    for (let i = 0; i < Items.length; ++i) {
        let out = createItemBox(Items[i].name, Items[i].type)
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

function dbClick(e)
{
    document.getElementById("ItemInfoMenu").style.display = "block"
}



function loadPage()
{
    $.ajax({url: "/devices", success: function(result){
        devices = result.data
        let noPos = []
        for (let i = 0; i < result.data.length; ++i) {
            
            if (result.data[i].pos.x == -1)
                noPos.push (result.data[i])
            else
                addPosItem(result.data[i].name, result.data[i].pos, result.data[i].type)
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
            data = {"name" : item.getAttribute("name"), "pos" : {"x" : parseInt(itemPos[0] * 2000 / 1920) , "y" : parseInt(itemPos[1] * 2000 / 1920)}}
        else
            data = {"name" : item.getAttribute("name"), "pos" : {"x" : -1 , "y" : -1}}

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

    
    
    
    
// 2000 | 1920
// pos    | x

let devices;
const blocSize = 1920 / 2000

function addPosItem(name, pos)
{
    let itemDiv = document.createElement("div")
    itemDiv.setAttribute('name', name)
    itemDiv.textContent = name
    itemDiv.setAttribute("class", "box")
    itemDiv.setAttribute("draggable", "true")
    
    itemDiv.style.left = pos.x * blocSize
    itemDiv.style.top = pos.y * blocSize + 110
    document.getElementById("noPosItem").append(itemDiv)
}

function addNoPosItem(name)
{
    let itemDiv = document.createElement("div")
    itemDiv.setAttribute('name', name)
    itemDiv.textContent = name
    itemDiv.setAttribute("class", "box")
    itemDiv.setAttribute("draggable", "true")
    document.getElementById("noPosItem").append(itemDiv)
}
   
function loadPage()
{
    $.ajax({url: "/devices", success: function(result){
        devices = result
        for (let i = 0; i < devices.data.length; ++i) {
            if (devices.data[i].pos.x == -1)
                addNoPosItem(devices.data[i].name)
            else {
                addPosItem(devices.data[i].name, devices.data[i].pos)
            }
        }
        $(".box").draggable();

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
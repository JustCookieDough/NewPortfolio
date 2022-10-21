const sleep = ms => new Promise(r => setTimeout(r, ms));

const line1 = document.getElementById("l1")
const line2 = document.getElementById("l2")
const line3 = document.getElementById("l3")
const introDiv = document.getElementById("introScreen")
const linkDiv = document.getElementById("links")

async function main() {
    await sleep(600)
    writeLine(line1, "hi,", 200)
    await sleep(1500)
    writeLine(line2, "i'm scott.", 125)
    await sleep(3000)
    writeLine(line3, "welcome in.", 125)
    await sleep(3000)

    introDiv.classList.add('intro-finished')
    linkDiv.classList.remove('invisible')
    linkDiv.classList.add('intro-finished')
}

async function writeLine(obj, text, delay) {
    for (let i = 0; i < text.length-1; i++){
        obj.innerHTML += text.slice(i, i+1)
        await sleep(delay)
    }
    obj.innerHTML = text
}

main()
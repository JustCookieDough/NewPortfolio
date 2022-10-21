const sleep = ms => new Promise(r => setTimeout(r, ms));

const line1 = document.getElementById("l1")
const line2 = document.getElementById("l2")
const line3 = document.getElementById("l3")
const introDiv = document.getElementById("introScreen")
const contentDiv = document.getElementById("content")

async function intro() {
    await sleep(600)
    writeLine(line1, "hi,", 200)
    await sleep(1500)
    writeLine(line2, "i'm scott.", 125)
    await sleep(3000)
    writeLine(line3, "welcome in.", 125)
    await sleep(3000)

    introDiv.classList.add('intro-finished')
    contentDiv.classList.add('intro-finished')

}

async function writeLine(obj, text, delay) {
    for (let i = 0; i < text.length-1; i++){
        obj.innerHTML += text.slice(i, i+1)
        await sleep(delay)
    }
    obj.innerHTML = text
}

function checkIfVisited() {
    let c = document.cookie
    let cString = c.split(";")[1].trim()
    return cString === "seenIntro=true" 
}

async function main() {
    if (!checkIfVisited()) {
        document.cookie = "seenIntro=true"
        intro()
    } else {
        introDiv.classList.add('no-intro')
        contentDiv.classList.add('no-intro')
    }
}

async function clearCookie() {
    document.cookie = "seenIntro=false"
}

main()

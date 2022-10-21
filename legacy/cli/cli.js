const commandLine = document.getElementById('cl')
const output = document.getElementById('out')
const shellHeader = document.getElementById('shellHeader')
var currentFolder = null; // gotta initialize this jawn

commandLine.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        runCommand(commandLine.value)
        commandLine.value = ""
        commandLine.focus()
    }
})

function runCommand(command) {
    outputLine("$ " + command)
    args = command.trim().split(" ")

    switch (args[0]) {
    case "whoami":
        outputLine("user: guest")
        break

    case "echo":
        console.log(command.slice(5), typeof(command.slice(5)))
        outputLine(command.slice(5))
        break

    case "clear":
        output.innerHTML = ""
        break

    case "ls":
        currentFolder.ls()
        break

    case "cat":
        fileIndex = currentFolder.getChild(args[1])
        if (fileIndex == -1) {
            outputLine("No such file or directory")
            break
        } else {
            let file = currentFolder.children[fileIndex]
            if (file instanceof cliFolder) {
                outputLine("Is a directory")
            }
            file.cat()
        }
        break

    case "cp":
        fileIndex = currentFolder.getChild(args[1])
        if (fileIndex == -1) {
            outputLine("No such file or directory")
            break
        } else {
            let file = currentFolder.children[fileIndex]
            if (file instanceof cliFolder) {
                outputLine("Is a directory")
            }
            file.download()
        }
        break
    
    case "cd":
        if (args[1] == ".") { break }
        if (args[1] == "..") { currentFolder = currentFolder.parent; break; }

        folderIndex = currentFolder.getChild(args[1])
        if (folderIndex == -1) {
            outputLine("No such directory")
            break
        } else {
            let folder = currentFolder.children[folderIndex]
            if (folder instanceof cliFile) {
                outputLine("Is a file")
            }
            currentFolder = folder
        }
        break

    case "reboot":
        output.innerHTML = ""
        init()
        break

    case "rm":
        if (args[1] === undefined) {outputLine("incorrect syntax: rm [-rf] name"); break}
        if (args[1].slice(0, 1) == "-" && (args[1] == "-r" || args[1] == "-rf")) {
            console.log(args[2])
            folderIndex = currentFolder.getChild(args[2])
            if (folderIndex == -1) { outputLine('file does not exist'); break }
            currentFolder.children.splice(folderIndex, 1)
        } else {
            console.log(args[1])
            fileIndex = currentFolder.getChild(args[1])
            if (fileIndex == -1) { outputLine('file does not exist'); break }
            if (currentFolder.children[fileIndex] instanceof cliFolder) { outputLine('is a folder'); break }
            console.log(currentFolder.children)
            console.log(fileIndex)
            currentFolder.children.splice(fileIndex, 1)
        }
        break

    case "help":
        outputLine("whoami: Prints the username associated with the current effective UID")
        outputLine("echo: writes input to the standard output")
        outputLine("clear: clears the terminal")
        outputLine("ls: lists the files and folders in the current directory")
        outputLine("cat: writes a files contents to the stardard output")
        outputLine("cp: downloads a file")
        outputLine("cd: changes the current directory")
        outputLine("reboot: resets the command line interface")
        outputLine("rm: removes a file (or folder if the -rf flag is used)")
        outputLine("help: displays this menu")
        break

    default:
        outputLine("command not recognized")
    }
}

function outputLine(text) {
    let line = document.createElement('t')
    line.className = "out"
    line.innerText = text
    output.appendChild(line)
}

function outputLineWHTML(text) {
    let line = document.createElement('t')
    line.className = "out"
    line.innerHTML = text
    output.appendChild(line)
}

function outputLineType(text) {
    let line = document.createElement('t')
    line.className = "out"
    output.appendChild(line)
    var i = 0;
    var timer = 10;
    var skipped = false;
    var skip = function () {
        skipped = true;
    }.bind(this);
    document.addEventListener("dblclick", skip);
    (function typer() {
        if (i < text.length) {
            var char = text.charAt(i);
            var isNewLine = char === "\n";
            line.innerHTML += isNewLine ? "<br/>" : char;
            i++;
            if (!skipped) {
                setTimeout(typer, isNewLine ? timer * 2 : timer);
            } else {
                line.innerHTML += (line.substring(i).replace(new RegExp("\n", 'g'), "<br/>")) + "<br/>";
                document.removeEventListener("dblclick", skip);
            }
        }
    })()
}


class cliFolder {
    constructor(name, children, parent) {
        this.name = name
        this.children = children
        this.parent = parent
    }

    ls() {
        outputLine('.')
        outputLine('..')
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            if (child instanceof cliFile) {
                outputLine(child.name)
            } else if (child instanceof cliFolder) {
                outputLine(child.name + "/")
            } else {
                outputLine("weird error plz fix")
            }
        }
    }

    addChild(child) {
        if (child.className == "cliFolder") {
            child.setParent(this)
        }
        this.children.push(child)
    }

    getChild(name) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].name == name) {
                return i
            }
        }
        return -1
    }

    setParent(parent) {
        this.parent = parent
    }
}

class cliFile {
    constructor(name, contents, mimeType="text/plain") {
        this.name = name;
        this.file = new Blob([contents], {type: mimeType})
    }

    async download() {
        const blobURL = URL.createObjectURL(this.file)
        var hiddenElement = document.createElement('a');
        hiddenElement.href = blobURL
        hiddenElement.download = this.name
        hiddenElement.click();
    }

    async cat() {
        let text = await this.file.text()
        for (let i = 0; i < text.length; i += 80) {
            outputLine(text.slice(i, i+80))
        }
    }
}

function init() {
    currentFolder = new cliFolder("home", [], null)
    currentFolder.setParent(currentFolder)

    currentFolder.addChild(new cliFile("test.txt", "lmao test"))
    currentFolder.addChild(new cliFile("info.txt", "info goes here")) 
    currentFolder.addChild(new cliFile("large.txt", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"))
    currentFolder.addChild(new cliFolder("code", [new cliFile("cli.html", "code goes here")], currentFolder))

    outputLine("* welcome to the angelid.es interactive command line interface!")
    outputLine("* this command line works like a very striped down bash shell,")
    outputLine("* so most commands that work in bash should work here as well.")
    outputLine("* every bit of info about me can be found in this file system,")
    outputLine("* so enjoy the look around! :D")
    outputLine("* if you don't like the cli and would prefer a traditional")
    outputLineWHTML("* website, click <a href='../trad'>here</a> ")
    outputLine("* to find out what you can do, run 'help'")
    outputLine("")
}

init()

commandLine.focus()
document.addEventListener('click', () => {
    commandLine.focus()
})
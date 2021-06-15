/*
1. JS-owe ładowanie plików w file-dialog (z opcją na przeładowywanie)
2. Po kliknięciu na dany plik umieszczenie jego zawartości w code-dialog.
 */

var curFile = null;
var directories = null;
var files = null;
var prover = '';
var guard = '';
var conditions = '';

window.onload = () => {
    console.log(curFile);
    displayFileDialog();
    displayTabs();

    // $('#rerun').click(function () { rerun(); return false; });
    // $('#delete-file').click(function () { displayFileDelForm(); return false; });
    // $('#delete-folder').click(function () { displayFolderDelForm(); return false; });
}


function clearContent(holdername) {
    console.log("No to czyścimy")
    const content = document.getElementById(holdername);
    content.innerText = "";
}

async function displayFileDialog() {
    console.log("Let's get started!");

    const Fileform = document.getElementById("delete-file-form");
    const Folderform = document.getElementById("delete-folder-form");

    Fileform.style.display = "none";
    Folderform.style.display = "none";

    await $.ajax({
        type: 'GET',
        url: 'user_dirs',
        data: {},
        success: data => {
            directories = JSON.parse(data)
        },
        error: err => {
            alert("Error fetching data!");
            console.log("GET user_dirs: ", err.statusText);
        }
    });


    await $.ajax({
        type: 'GET',
        url: 'user_files',
        data: {},
        success: data => {
            files = JSON.parse(data);
        },
        error: err => {
            alert("Error fetching data!");
            console.log("GET user_files: ", err.statusText);
        }
    });

    console.log("Data fetched!");
    console.log(directories);
    console.log(files);

    clearContent("file-dialog")

    const dialog = document.getElementById("file-dialog");

    console.log("Generujemy btns");
    directories.map(dir => {
        if (dir.fields.is_available) {
            var folderBtn = document.createElement("button");
            folderBtn.className = "folder";
            folderBtn.innerText = dir.fields.name;
            dialog.appendChild(folderBtn);
            files.map(file => {
                console.log(file.fields.parent_dir);
                if (file.fields.is_available && file.fields.parent_dir == dir.pk) {
                    var fileBtn = document.createElement("button");
                    fileBtn.className = "file";
                    fileBtn.innerText = file.fields.name;
                    fileBtn.addEventListener("click", function (e) { loadFile(e) });
                    dialog.appendChild(fileBtn);
                }
            });
        }
    });

}

function displayTabs() {
    if (curFile) {
        document.getElementsByClassName("tab-content")[0].style.display = "block";
    }
}

async function loadContent(path, holdername) {
    if (path.length > 1 && holdername) {
        jQuery.get(path, function (txt) {
            $("#" + holdername).text(txt);
        })
    }
}


// async function loadFocusContent(path) {
//     if (path.length > 1) {
//         clearContent("focus-dialog-content");
//         jQuery.get(path, function (data) {
//             const dialog = document.getElementById("focus-dialog-content");

//             console.log(data);

//             clearContent("focus-dialog-loader");

//             const arr = data.split("------------------------------------------------------------")
//             let goals = 0;
//             arr.map((str, arrIndex) => {
//                 if (str.search("Goal") >= 0) {
//                     goals++;
//                     var btn = document.createElement("button");
//                     btn.innerText = "+";
//                     // btn.style.display = "block";
//                     btn.addEventListener("click", function () {
//                         var panel = this.nextElementSibling;
//                         var header = panel.nextElementSibling;
//                         if (panel.style.display === "block") {
//                             this.innerText = "+";
//                             panel.style.display = "none";
//                             header.style.display = "block";
//                         } else {
//                             this.innerText = "-";
//                             panel.style.display = "block";
//                             header.style.display = "none";
//                         }
//                     });
//                     if (str.search("Prove: true") >= 0) {
//                         btn.title = "valid"
//                     } else if (str.search("Prove: false") >= 0) {
//                         btn.title = "invalid";
//                     } else {
//                         btn.title = "unknown";
//                     }
//                     dialog.appendChild(btn);

//                     var panel = document.createElement("pre");
//                     panel.innerText = str;
//                     panel.style.display = "none";
//                     dialog.appendChild(panel);

//                     console.log("Splitujemy")
//                     console.log(str.split('\n'));
//                     var header = document.createElement("div")
//                     header.innerText = str.split('\n')[2];
//                     header.style.display = "block";
//                     dialog.appendChild(header);
//                 }
//             })
//         })
//     }
// }

// async function loadFile(e) {
//     curFile = e.target.innerText;

//     const Fileform = document.getElementById("delete-file-form");
//     const Folderform = document.getElementById("delete-folder-form");

//     Fileform.style.display = "none";
//     Folderform.style.display = "none";

//     document.getElementById("rerun-cmd").innerText = '';

//     const codeDialogContent = document.getElementById("code-dialog-content");
//     const resultTabContent = document.getElementById("result");
//     const focusDialogContent = document.getElementById("focus-dialog-loader");

//     codeDialogContent.innerText = "Loading code dialog ...";
//     resultTabContent.innerText = "Loading result tab ...";
//     focusDialogContent.innerText = "Loading focus dialog ..."

//     const codeUrlPath = "showfile/" + curFile;
//     await loadContent(codeUrlPath, "code-dialog-content");

//     const tabsUrlPath = "showresult/" + curFile;
//     await loadContent(tabsUrlPath, "result");
//     displayTabs();

//     const focusUrlPath = "showfocus/" + curFile;
//     await loadFocusContent(focusUrlPath);
// }

// function chooseProver() {
//     const arr = $("#prover-form").serializeArray();
//     if (arr.length > 0) {
//         prover = arr[0].value;
//         console.log(prover);
//     }
// }

// function chooseConditions() {
//     const arr = $("#conditions-form").serializeArray();

//     arr.map(field => {
//         if (field.name === "guard") {
//             guard = field.value;
//         } else if (field.name === "cond") {
//             conditions += field.value;
//         }
//     })

//     console.log(guard + " " + conditions)
// }

// async function rerun() {
//     console.log("Rerun fired!")
//     if (!prover || !conditions) {
//         alert("No prover or verify condition choosen!")
//     } else {
//         await $.ajax({
//             type: 'GET',
//             url: 'rerun',
//             data: { 'prover': prover, 'guard': guard, 'conditions': conditions },
//             success: res => {
//                 console.log(res['rerun_cmd']);
//                 document.getElementById("rerun-cmd").innerText = res['rerun_cmd'];
//             },
//             error: err => {
//                 console.log("Error in rerun!");
//                 console.log("GET rerun: ", err.statusText);
//             }
//         });
//     }
// }


// function displayFileDelForm() {
//     console.log("Delete file");

//     clearContent("file-select");

//     const Fileform = document.getElementById("delete-file-form");
//     const Folderform = document.getElementById("delete-folder-form");

//     Folderform.style.display = "none";

//     const select = document.getElementById("file-select")

//     directories.map(dir => {
//         if (dir.fields.is_available) {
//             files.map(file => {
//                 if (file.fields.is_available && file.fields.parent_dir == dir.pk) {
//                     var newOption = document.createElement("option");
//                     newOption.value = file.fields.name;
//                     newOption.innerHTML = file.fields.name;
//                     select.appendChild(newOption);
//                 }
//             });
//         }
//     });

//     Fileform.style.display = "block";

// }

// function displayFolderDelForm() {
//     console.log("Delete folder")

//     clearContent("folder-select")

//     const Fileform = document.getElementById("delete-file-form");
//     const Folderform = document.getElementById("delete-folder-form");

//     Fileform.style.display = "none";

//     const select = document.getElementById("folder-select")

//     directories.map(dir => {
//         if (dir.fields.is_available) {
//             var newOption = document.createElement("option");
//             newOption.value = dir.fields.name;
//             newOption.innerHTML = dir.fields.name;
//             select.appendChild(newOption);
//         }
//     });

//     Folderform.style.display = "block";
// }

// async function deleteFile() {
//     const arr = $("#delete-file-form").serializeArray();
//     if (arr.length > 0) {
//         console.log(arr[0].value);

//         await $.ajax({
//             type: 'GET',
//             url: 'deletefile',
//             data: { 'name': arr[0].value },
//             success: res => {
//                 console.log(res);
//             },
//             error: err => {
//                 console.log("Error in deleteFile!");
//                 console.log("GET rerun: ", err.statusText);
//             }
//         });

//         displayFileDialog();
//     }
// }

// async function deleteFolder() {
//     const arr = $("#delete-folder-form").serializeArray();
//     if (arr.length > 0) {
//         console.log(arr[0].value);

//         await $.ajax({
//             type: 'GET',
//             url: 'deletedir',
//             data: { 'name': arr[0].value },
//             success: res => {
//                 console.log(res);
//             },
//             error: err => {
//                 console.log("Error in deleteFolder!");
//                 console.log("GET rerun: ", err.statusText);
//             }
//         });

//         displayFileDialog();
//     }
// }
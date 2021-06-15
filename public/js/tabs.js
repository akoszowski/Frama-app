function activateBtn(e) {
    var btns = document.getElementsByClassName("tab-btn");
    var cur = document.getElementsByClassName("active");

    if (cur.length > 0) {
        switch (cur[0].id) {
            case "prover-btn":
                document.getElementById("prover-form").style.display = "none";
                break;
            case "conditions-btn":
                document.getElementById("conditions-form").style.display = "none";
                break;
            default:
                document.getElementById("result").style.display = "none";
                break;
        }
        cur[0].className = cur[0].className.replace(" active", "");
    }

    switch (e.id) {
        case "prover-btn":
            document.getElementById("prover-form").style.display = "block";
            break;
        case "conditions-btn":
            document.getElementById("conditions-form").style.display = "block";
            break;
        default:
            document.getElementById("result").style.display = "block";
            break;
    }

    e.className += " active";
}
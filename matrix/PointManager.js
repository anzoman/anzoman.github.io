class PointManager {

    readVectors() {
        let vectorList = [];
        let list = document.getElementById("inputArea").value.trim().split("\n");
        if(list.length === 1 && list[0] == "") {
            alert("No vectors were specified in input Area.");
            return [];
        }
        for (let i = 0; i < list.length; i++) {
            if (list[i].trim().startsWith("v")) {
                let subList = list[i].trim().split(" ");
                if (subList.length == 4 && !isNaN(Number(subList[1])) && !isNaN(Number(subList[2])) && !isNaN(Number(subList[3]))) {
                    vectorList.push(new Vector4f(Number(subList[1]), Number(subList[2]), Number(subList[3])));
                } else {
                    alert("Wrong vector syntax. (Syntax example: 'v 1 2 3')");
                    return [];
                }
            } else {
                alert("Wrong vector syntax. (Syntax example: 'v 1 2 3')");
                return [];
            }
        }
        return vectorList;
    }

    writeVectors(vectorList) {
        let newRecord = "";
        for (let i = 0; i < vectorList.length; i++) {
            newRecord += `v ${vectorList[i].x} ${vectorList[i].y} ${vectorList[i].z}\n`;
        }
        document.getElementById("outputArea").value = newRecord;
    }
}
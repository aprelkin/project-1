function handleFiles(files) {

    var i = 0;
    var auswahl_div = document.getElementById('auswahl');

    var imageType = /image.*/;

    var fileList = files;

    for(i = 0; i < fileList.length; i++)
    {
        var img = document.createElement("img");
        img.height = 110;
        img.file = fileList[i];
        img.name = 'pic_'+ i;
        img.classList.add("obj");
        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(fileList[i]);
        auswahl_div.appendChild(img);
    }
    var objList = $(".obj");

    for (var i = 0; i < objList.length; i++) {

        objList[i].addEventListener('mouseover', function() {this.style.opacity = 0.8});
        objList[i].addEventListener('mouseout', function() { this.style.opacity = 1});
        objList[i].addEventListener('click', function() { $(this).remove()});
    }
}




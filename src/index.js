(function() {
    var canvas = document.getElementById('canvas');

    // Event handler to resize the canvas when the document view is changed
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
console.log("resizing");
        drawStuff();
    }
    resizeCanvas();

    function drawStuff() {
        // Do drawing here
        var bkgrd = canvas.getContext('2d');
        var text = canvas.getContext('2d');

        bkgrd.fillStyle = 'black';
        bkgrd.fillRect(0,0,canvas.width, canvas.height);

        // text.strokeRect(10,10, window.innerWidth - 20,window.innerHeight - 20);
        // text.font = '16px serif';
        // text.fillStyle = 'white';
        // text.fillText('The canvas is the blue', 30, 30);
        // text.fillText('background color seen here.', 30, 50);
        // text.fillText('It will resize if the window', 30, 70);
        // text.fillText('size is adjusted.', 30, 90);
    }
})();
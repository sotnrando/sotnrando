const mainCanvas = document.getElementById('mainCanvas');
const ctxMain = mainCanvas.getContext('2d');
ctxMain.imageSmoothingEnabled = false;

const img1 = new Image();
let img2 = new Image();

let img1Loaded = false;
let img2Loaded = false;
let img2Opacity = 0.5;
let cropMode = false;
let cropping = false;
let cropRect = null;

const img2Pos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    dragging: false,
    resizing: false,
    resizeHandleSize: 12
};

const dragOffset = { x: 0, y: 0 };

function drawMainCanvas() {
    ctxMain.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    if (img1Loaded) {
        ctxMain.drawImage(img1, 0, 0, mainCanvas.width, mainCanvas.height);
    }

    if (img2Loaded) {
        ctxMain.globalAlpha = img2Opacity;
        ctxMain.drawImage(img2, img2Pos.x, img2Pos.y, img2Pos.width, img2Pos.height);
        ctxMain.globalAlpha = 1.0;
        drawResizeHandle(img2Pos);
    }

    if (cropMode && cropping && cropRect) {
        const x = cropRect.width < 0 ? cropRect.x + cropRect.width : cropRect.x;
        const y = cropRect.height < 0 ? cropRect.y + cropRect.height : cropRect.y;
        const w = Math.abs(cropRect.width);
        const h = Math.abs(cropRect.height);
        ctxMain.strokeStyle = '#ffcc00';
        ctxMain.lineWidth = 2;
        ctxMain.strokeRect(x, y, w, h);
    }
}

function drawResizeHandle(pos) {
    ctxMain.fillStyle = '#e0c080';
    ctxMain.fillRect(
        pos.x + pos.width - pos.resizeHandleSize,
        pos.y + pos.height - pos.resizeHandleSize,
        pos.resizeHandleSize,
        pos.resizeHandleSize
    );
}

mainCanvas.addEventListener('pointerdown', e => {
    const x = e.offsetX;
    const y = e.offsetY;

    if (cropMode) {
        cropping = true;
        cropRect = { x, y, width: 0, height: 0 };
        drawMainCanvas();
        return;
    }

    const inResizeZone =
        x >= img2Pos.x + img2Pos.width - img2Pos.resizeHandleSize &&
        x <= img2Pos.x + img2Pos.width &&
        y >= img2Pos.y + img2Pos.height - img2Pos.resizeHandleSize &&
        y <= img2Pos.y + img2Pos.height;

    if (inResizeZone) {
        img2Pos.resizing = true;
    } else if (
        x >= img2Pos.x && x <= img2Pos.x + img2Pos.width &&
        y >= img2Pos.y && y <= img2Pos.y + img2Pos.height
    ) {
        img2Pos.dragging = true;
        dragOffset.x = x - img2Pos.x;
        dragOffset.y = y - img2Pos.y;
    }

    mainCanvas.setPointerCapture(e.pointerId);
});

mainCanvas.addEventListener('pointermove', e => {
    const x = e.offsetX;
    const y = e.offsetY;

    if (cropMode && cropping && cropRect) {
        cropRect.width = x - cropRect.x;
        cropRect.height = y - cropRect.y;
        drawMainCanvas();
        return;
    }

    if (img2Pos.dragging) {
        img2Pos.x = x - dragOffset.x;
        img2Pos.y = y - dragOffset.y;
        drawMainCanvas();
    } else if (img2Pos.resizing) {
        img2Pos.width = Math.max(10, x - img2Pos.x);
        img2Pos.height = Math.max(10, y - img2Pos.y);
        drawMainCanvas();
    }
});

mainCanvas.addEventListener('pointerup', () => {
    if (cropMode && cropping && cropRect) {
        applyCrop();
        cropping = false;
        cropRect = null;
        cropMode = false;
        document.getElementById('cropToggle').textContent = 'Crop Mode';
        return;
    }

    img2Pos.dragging = false;
    img2Pos.resizing = false;
});

mainCanvas.addEventListener('pointerleave', () => {
    img2Pos.dragging = false;
    img2Pos.resizing = false;
    cropping = false;
});

function applyCrop() {
    const cropX = cropRect.width < 0 ? cropRect.x + cropRect.width : cropRect.x;
    const cropY = cropRect.height < 0 ? cropRect.y + cropRect.height : cropRect.y;
    const cropW = Math.abs(cropRect.width);
    const cropH = Math.abs(cropRect.height);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropW;
    tempCanvas.height = cropH;
    const tempCtx = tempCanvas.getContext('2d');

    const srcX = cropX - img2Pos.x;
    const srcY = cropY - img2Pos.y;

    tempCtx.drawImage(
        img2,
        srcX, srcY, cropW, cropH,
        0, 0, cropW, cropH
    );

    img2 = new Image();
    img2.src = tempCanvas.toDataURL();
    img2.onload = () => {
        img2Loaded = true;
        img2Pos.width = cropW;
        img2Pos.height = cropH;
        img2Pos.x = cropX;
        img2Pos.y = cropY;
        drawMainCanvas();
    };
}

document.getElementById('img1Selector').addEventListener('change', e => {
    const src = e.target.value;
    if (src) {
        img1.src = src;
        img1.onload = () => {
            img1Loaded = true;
            drawMainCanvas();
        };
    }
});

document.getElementById('img2Input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        img2.src = URL.createObjectURL(file);
        img2.onload = () => {
            img2Loaded = true;
            const scale = Math.min(mainCanvas.width / img2.width, mainCanvas.height / img2.height);
            img2Pos.width = img2.width * scale;
            img2Pos.height = img2.height * scale;
            img2Pos.x = (mainCanvas.width - img2Pos.width) / 2;
            img2Pos.y = (mainCanvas.height - img2Pos.height) / 2;
            drawMainCanvas();
        };
    }
});

document.getElementById('opacitySlider').addEventListener('input', e => {
    img2Opacity = parseFloat(e.target.value);
    drawMainCanvas();
});

document.getElementById('cropToggle').addEventListener('click', () => {
    cropMode = !cropMode;
    cropping = false;
    cropRect = null;
    document.getElementById('cropToggle').textContent = cropMode ? '✅ Crop Mode Active' : '✂️ Crop Mode';
    drawMainCanvas();
});

document.addEventListener('keydown', e => {
    if (!img2Loaded) return;

    const step = 1;

    if (e.key === 'ArrowLeft') {
        if (e.shiftKey) img2Pos.width = Math.max(10, img2Pos.width - step);
        else if (e.altKey) img2Pos.height = Math.max(10, img2Pos.height);
        else img2Pos.x -= step;
    } else if (e.key === 'ArrowRight') {
        if (e.shiftKey) img2Pos.width += step;
        else if (e.altKey) img2Pos.height = Math.max(10, img2Pos.height);
        else img2Pos.x += step;
    } else if (e.key === 'ArrowUp') {
        if (e.shiftKey) img2Pos.height = Math.max(10, img2Pos.height - step);
        else img2Pos.y -= step;
    } else if (e.key === 'ArrowDown') {
        if (e.shiftKey) img2Pos.height += step;
        else img2Pos.y += step;
    }

    drawMainCanvas();
});

window.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('img1Selector');
    if (selector.options.length > 0) {
        selector.selectedIndex = 0;
    }
});
mainCanvas.addEventListener('pointerdown', () => {
    mainCanvas.focus();
});
window.addEventListener("keydown", function (e) {
    // Check if the pressed key is an arrow key or the Spacebar
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault(); // Prevent the default scrolling behavior
    }
}, false);



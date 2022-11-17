import React, { useRef, useEffect } from 'react'

let canvas = null
let ctx = null
let isPainting = false

export const reset = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export const changeStrokeColor = (val) => {
    if (!ctx) return
    ctx.strokeStyle = val
}

export const exportCanvas = () => {
    return canvas.toDataURL("image/png");
}

export const Canvas = props => {
    const { handlePaint, width, height } = props
    const canvasRef = useRef(null)
    const getPaintPosition = (e) => {
        const canvasSize = canvas.getBoundingClientRect();

        if (e.type === "mousemove") {
            return {
                x: e.clientX - canvasSize.left,
                y: e.clientY - canvasSize.top,
            };
        } else {
            return {
                x: e.touches[0].clientX - canvasSize.left,
                y: e.touches[0].clientY - canvasSize.top,
            };
        }
    }
    const startPosition = (e) => {
        e.preventDefault();
        isPainting = true
    }
    const finishedPosition = () => {
        isPainting = false
        ctx.beginPath();
    }
    const draw = (e) => {
        if (!isPainting) return;
        const paintPosition = getPaintPosition(e);
        ctx.lineTo(paintPosition.x, paintPosition.y);
        ctx.stroke();
        handlePaint(true)
    }
    const initCanvas = () => {
        canvas = canvasRef.current
        ctx = canvas.getContext("2d");
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.strokeStyle = '#000000'
        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mouseup", finishedPosition);
        canvas.addEventListener("mouseleave", finishedPosition);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("touchstart", startPosition);
        canvas.addEventListener("touchend", finishedPosition);
        canvas.addEventListener("touchcancel", finishedPosition);
        canvas.addEventListener("touchmove", draw);
    }

    useEffect(() => {
        initCanvas()
    }, [])

    return <canvas ref={canvasRef} id="drawCanvas" width={width} height={height}/>
}

Canvas.defaultProps = {
    width: 778,
    height: 360,
    handlePaint: () => { }
}
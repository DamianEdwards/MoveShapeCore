/// <reference path="../../node_modules/@aspnet/signalr/dist/esm/index.d.ts" />
/// <reference path="../../node_modules/@aspnet/signalr-protocol-msgpack/dist/esm/index.d.ts" />
(async function () {
    'use strict';
    const protocol = new signalR.protocols.msgpack.MessagePackHubProtocol(),
        hub = new signalR.HubConnection('/moveshape', { protocol: protocol }),
        shape = document.getElementById('shape');

    function updatePos(x, y) {
        shape.style.left = x.toString() + 'px';
        shape.style.top = y.toString() + 'px';
    }

    hub.on('PositionChanged', position => {
        console.log('Incoming position update: ' + position.x + ', ' + position.y);
        updatePos(position.x, position.y);
    });

    await hub.start();

    let mouseDown = false,
        offset = { x: 0, y: 0 };

    shape.addEventListener('touchstart', start);
    shape.addEventListener('mousedown', start);

    function start(e) {
        let data = e.touches ? e.touches.item(0) : e;
        offset.x = data.clientX - shape.offsetLeft;
        offset.y = data.clientY - shape.offsetTop;
        console.log('start: x=' + data.clientX + ', y=' + data.clientY + ', shapeLeft=' + shape.offsetLeft + ', shapeTop=' + shape.offsetTop);
        mouseDown = true;
    }

    document.addEventListener('touchend', end);
    document.addEventListener('mouseup', end);

    function end(e) {
        console.log('end');
        mouseDown = false;
    }

    document.addEventListener('touchmove', move);
    document.addEventListener('mousemove', move);

    function move(e) {
        if (mouseDown) {
            let data = e.touches ? e.touches.item(0) : e,
                newPos = { X: data.clientX - offset.x, Y: data.clientY - offset.y };
            // BUG: Have to send to server w/ PascalCase props when using MsgPack
            updatePos(newPos.X, newPos.Y);
            hub.invoke('UpdatePosition', newPos);
            console.log('move');
        }
    }
}());
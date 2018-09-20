const GET_ZOOM_LEVEL = /\d(?=,)/;

function positionRelativeToParent(element) {
  const parent = element.offsetParent;
  const parentRect = parent.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

  const [zLevel] = parent.style.transform.match(GET_ZOOM_LEVEL);
  const zoom = parseFloat(zLevel.trim());
  console.log(parent, parent.style, zoom);
  const top = rect.top - parentRect.top;
  const left = rect.left - parentRect.left;
  const relativePos = {
    top,
    left,
    // the real right/bottom are not what I actually want.
    bottom: top + rect.height,
    right: left + rect.width,
    width: rect.width,
    height: rect.height
  };

  return relativePos;
}

function processLayout(ctx, nodes, layout, isLHS = true) {
  const nodeRects = new Map(
    nodes.map((x) => [x.id, positionRelativeToParent(x)])
  );

  layout.forEach((round, rIndex, rounds) => {
    round.forEach((versus, vIndex) => {
      const nodeRect = nodeRects.get(versus.id.toString());
      const startX = isLHS ? nodeRect.right : nodeRect.left;
      const startY = nodeRect.top + nodeRect.height * 0.5;

      // next versus
      const nextRound = rounds[rIndex + 1];
      if (nextRound) {
        const nextVersus = nextRound.find(
          (_, i) => i === Math.floor(vIndex / 2)
        );
        const nextNodeRect = nodeRects.get(nextVersus.id.toString());
        const isOneToOne = round.length === 1 && nextRound.length === 1;
        console.log('RECTS => ', versus.id, nodeRect, nextNodeRect);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineWidth = 2;

        if (isOneToOne) {
          const endX = isLHS ? nextNodeRect.left : nextNodeRect.right;
          const endY = nextNodeRect.top + nextNodeRect.height * 0.5;

          ctx.lineTo(endX, endY);
          console.log(
            'one-to-one',
            `(${startX}, ${startY})`,
            `(${endX}, ${endY})`
          );
        } else {
          const endX = nextNodeRect.left + nextNodeRect.width * 0.5;
          const endY =
            vIndex % 2 === 0 ? nextNodeRect.top : nextNodeRect.bottom;

          ctx.lineTo(endX, startY);
          ctx.lineTo(endX, endY);
          console.log(
            'many-to-x',
            `(${startX}, ${startY})`,
            `(${endX}, ${endY})`
          );
        }

        ctx.stroke();
      }
    });
  });
}

export default function bracketCanvasDrawer(canvas, parent, rawLayout) {
  if (!canvas || !rawLayout.length) {
    return console.log(
      '%c Missing arg for canvas drawer: ',
      'color: royalblue',
      canvas,
      rawLayout
    );
  }

  const parentNode = canvas.parentNode;
  canvas.width = parentNode.offsetWidth;
  canvas.height = parentNode.offsetHeight;

  const ctx = canvas.getContext('2d');
  const nodes = Array.from(parent.getElementsByClassName('versus'));

  if (!nodes.length) {
    return console.log(
      '%c No nodes for canvas drawer: ',
      'color: royalblue',
      parent
    );
  }

  const midRoundIndex = Math.floor(rawLayout.length / 2);
  const layout = [...rawLayout];
  const layoutLeft = layout.slice(0, midRoundIndex + 1);
  const layoutRight = layout.slice(midRoundIndex).reverse();

  processLayout(ctx, nodes, layoutLeft);
  processLayout(ctx, nodes, layoutRight, false);
}

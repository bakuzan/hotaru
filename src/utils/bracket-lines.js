function positionRelativeToParent(element) {
  const parentRect = element.offsetParent.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const relativePos = {
    top: rect.top - parentRect.top,
    left: rect.left - parentRect.left,
    bottom: rect.bottom - parentRect.bottom,
    right: rect.right - parentRect.right,
    width: rect.width,
    height: rect.height
  };
  console.log('pos', relativePos);
  return relativePos;
}

function getNodeRectForVersus(versus, nodes) {
  const node = nodes.find((x) => x.id === versus.id.toString());
  return positionRelativeToParent(node);
}

function processLayout(ctx, nodes, layout, isLHS = true) {
  layout.forEach((round, rIndex, rounds) => {
    round.forEach((versus, vIndex) => {
      const nodeRect = getNodeRectForVersus(versus, nodes);
      const startX = isLHS ? nodeRect.left + nodeRect.width : nodeRect.left;
      const startY =
        vIndex % 2 === 0
          ? nodeRect.top + nodeRect.height * 0.25
          : nodeRect.top + nodeRect.height * 0.75;

      // next versus
      const nextRound = rounds[rIndex + 1];
      if (nextRound) {
        const nextVersus = nextRound.find(
          (_, i) => i === Math.floor(vIndex / 2)
        );
        const nextNodeRect = getNodeRectForVersus(nextVersus, nodes);
        const endX = nextNodeRect.left + nextNodeRect.width / 2;
        const endY = vIndex % 2 === 0 ? nextNodeRect.top : nextNodeRect.bottom;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        if (round.length === 1 && nextRound.length === 1) {
          const endX = isLHS
            ? nextNodeRect.left
            : nextNodeRect.left + nextNodeRect.width;
          const endY = nextNodeRect.top + nextNodeRect.height * 0.5;
          ctx.lineTo(endX, endY);
        } else {
          ctx.lineTo(endX, startY);
          ctx.lineTo(endX, endY);
        }

        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();

        console.log(rIndex, `(${startX}, ${startY})`, `(${endX}, ${endY})`);
      }
    });
  });
}

export default function bracketCanvasDrawer(canvas, parent, rawLayout) {
  canvas.width = canvas.parentNode.offsetWidth;
  canvas.height = canvas.parentNode.offsetHeight;

  const ctx = canvas.getContext('2d');
  const nodes = Array.from(parent.getElementsByClassName('versus'));

  const midRoundIndex = Math.floor(rawLayout.length / 2);
  const layout = [...rawLayout];
  const layoutLeft = layout.slice(0, midRoundIndex + 1);
  const layoutRight = layout.slice(midRoundIndex).reverse();

  processLayout(ctx, nodes, layoutLeft);
  processLayout(ctx, nodes, layoutRight, false);
}

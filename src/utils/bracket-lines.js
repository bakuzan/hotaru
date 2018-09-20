function positionRelativeToParent(element) {
  const parentRect = element.offsetParent.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

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

function getNodeRectForVersus(versus, nodes) {
  const node = nodes.find((x) => x.id === versus.id.toString());
  return positionRelativeToParent(node);
}

function processLayout(ctx, nodes, layout, isLHS = true) {
  layout.forEach((round, rIndex, rounds) => {
    round.forEach((versus, vIndex) => {
      const nodeRect = getNodeRectForVersus(versus, nodes);
      const startX = isLHS ? nodeRect.right : nodeRect.left;
      const startY = nodeRect.top + nodeRect.height * 0.5;

      // next versus
      const nextRound = rounds[rIndex + 1];
      if (nextRound) {
        const nextVersus = nextRound.find(
          (_, i) => i === Math.floor(vIndex / 2)
        );
        const nextNodeRect = getNodeRectForVersus(nextVersus, nodes);
        const isOneToOne = round.length === 1 && nextRound.length === 1;

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

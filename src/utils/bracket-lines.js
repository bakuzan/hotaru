import { isString } from './index';

const LINE_WIDTH = 2;
const NORMAL_LINE_COLOUR = '#000';
const WINNER_LINE_COLOUR = '#b22222';

function positionRelativeToParent(element) {
  const parent = element.offsetParent;
  const parentRect = parent.getBoundingClientRect();
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

function drawCharacterMidPointLine(ctx, { parentRect, parentData }, isLHS) {
  return (_, index) => {
    const direction = isLHS ? 1 : -1;
    const cOffset = index ? 0.75 : 0.25;

    const startX = isLHS ? parentRect.right : parentRect.left;
    const startY = parentRect.top + parentRect.height * cOffset;
    const endX = startX + parentRect.width * 0.5 * direction;
    const endY = parentRect.top + parentRect.height * 0.5;

    const winnerIndex = parentData.characters.findIndex(
      (x) => x.id === parentData.winnerId
    );
    console.log(parentData, winnerIndex, index, winnerIndex === index);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle =
      winnerIndex !== index ? NORMAL_LINE_COLOUR : WINNER_LINE_COLOUR;
    ctx.stroke();
  };
}

function processLayout(ctx, nodes, layout, isLHS = true) {
  const nodeRects = new Map(
    nodes.map((x) => [x.id, positionRelativeToParent(x)])
  );

  layout.forEach((round, rIndex, rounds) => {
    round.forEach((versus, vIndex) => {
      // only process those that have a next versus
      const nextRound = rounds[rIndex + 1];
      if (nextRound) {
        const versusId = versus.id.toString();
        const nodeRect = nodeRects.get(versusId);
        const halfWidth = nodeRect.width * 0.5;
        const startX = isLHS
          ? nodeRect.right + halfWidth
          : nodeRect.left - halfWidth;
        const startY = nodeRect.top + nodeRect.height * 0.5;

        const drawCharacterLines = drawCharacterMidPointLine(
          ctx,
          { parentRect: nodeRect, parentData: versus },
          isLHS
        );

        const node = nodes.find((x) => x.id === versusId);
        Array.from(node.querySelectorAll('.versus-card')).forEach(
          drawCharacterLines
        );

        const nextVersus = nextRound.find(
          (_, i) => i === Math.floor(vIndex / 2)
        );
        const nextNodeRect = nodeRects.get(nextVersus.id.toString());
        const isOneToOne = round.length === 1 && nextRound.length === 1;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        if (isOneToOne) {
          const endX = isLHS ? nextNodeRect.left : nextNodeRect.right;
          const endY = nextNodeRect.top + nextNodeRect.height * 0.5;

          ctx.lineTo(endX, endY);
        } else {
          const endX = nextNodeRect.left + nextNodeRect.width * 0.5;
          const endY =
            vIndex % 2 === 0 ? nextNodeRect.top : nextNodeRect.bottom;

          ctx.lineTo(endX, startY);
          ctx.lineTo(endX, endY);
        }

        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeStyle = nextVersus.characters.some((x) => isString(x.id))
          ? NORMAL_LINE_COLOUR
          : WINNER_LINE_COLOUR;
        ctx.stroke();
      }
    });
  });
}

export default function bracketCanvasDrawer(canvas, parent, rawLayout) {
  if (!canvas || !rawLayout.length) {
    return console.info(
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
    return console.info(
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

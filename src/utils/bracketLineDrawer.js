import { positionRelativeToParent } from '@/utils';

const LINE_WIDTH = 2;
const NORMAL_LINE_COLOUR = '#000';
const WINNER_LINE_COLOUR = '#b22222';

class BracketLineDrawer {
  constructor(canvas, parent) {
    this.__points = [];
    this.__parentEl = parent;
    this.__ctx = canvas.getContext('2d');
    this.__ctx.lineWidth = LINE_WIDTH;

    this.__plotLines = this.__plotLines.bind(this);
  }

  draw(rawLayout) {
    if (!this.__ctx || !this.__parentEl || !rawLayout.length) {
      return console.info(
        '%c Missing arg for canvas drawer: ',
        'color: royalblue',
        this.__ctx,
        rawLayout
      );
    }

    const nodes = Array.from(this.__parentEl.getElementsByClassName('versus'));
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

    const lhs = this.__processLayout(nodes, layoutLeft);
    const rhs = this.__processLayout(nodes, layoutRight, false);

    this.__points = lhs.concat(rhs);
    this.__drawPointsToCanvas();
  }

  update(matches) {
    if (!this.__points.length) return;

    const winners = this.__filterPointsByStyle(WINNER_LINE_COLOUR);
    const normals = this.__filterPointsByStyle(NORMAL_LINE_COLOUR);
    const updatedPoints = normals.map((point) => {
      let strokeStyle = point.strokeStyle;
      const match = matches.find(
        (x) => x.id === point.dataId || x.id === point.dataId2
      );

      if (point.dataId) {
        const winnerIndex =
          match && match.characters.findIndex((x) => x.id === match.winnerId);

        strokeStyle =
          winnerIndex !== point.index ? NORMAL_LINE_COLOUR : WINNER_LINE_COLOUR;
      } else if (point.dataId2) {
        strokeStyle =
          match && match.winnerId ? WINNER_LINE_COLOUR : NORMAL_LINE_COLOUR;
      }

      return { ...point, strokeStyle };
    });

    this.__points = winners.concat(updatedPoints);
    this.__drawPointsToCanvas();
  }

  // Private

  __processLayout(nodes, layout, isLHS = true) {
    const drawing = [];
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

          const drawCharacterLines = this.__drawCharacterMidPointLine(
            drawing,
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

          let lines;
          if (isOneToOne) {
            const endX = isLHS ? nextNodeRect.left : nextNodeRect.right;
            const endY = nextNodeRect.top + nextNodeRect.height * 0.5;

            lines = [[endX, endY]];
          } else {
            const endX = nextNodeRect.left + nextNodeRect.width * 0.5;
            const endY =
              vIndex % 2 === 0 ? nextNodeRect.top : nextNodeRect.bottom;

            lines = [
              [endX, startY],
              [endX, endY]
            ];
          }

          const strokeStyle = versus.winnerId
            ? WINNER_LINE_COLOUR
            : NORMAL_LINE_COLOUR;

          drawing.push({
            moveTo: [startX, startY],
            lines,
            strokeStyle,
            dataId2: versus.id
          });
        }
      });
    });

    return drawing;
  }

  __drawCharacterMidPointLine(drawing, { parentRect, parentData }, isLHS) {
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

      const moveTo = [startX, startY];
      const lines = [
        [endX, startY],
        [endX, endY]
      ];
      const strokeStyle =
        winnerIndex !== index ? NORMAL_LINE_COLOUR : WINNER_LINE_COLOUR;

      drawing.push({
        moveTo,
        lines,
        strokeStyle,
        dataId: parentData.id,
        index
      });
    };
  }

  __drawPointsToCanvas() {
    this.__drawPointForStyle(NORMAL_LINE_COLOUR);
    this.__drawPointForStyle(WINNER_LINE_COLOUR);
  }

  __drawPointForStyle(style) {
    const filtered = this.__filterPointsByStyle(style);
    if (filtered.length) {
      this.__ctx.beginPath();
      this.__ctx.strokeStyle = style;
      filtered.forEach(this.__plotLines);
      this.__ctx.stroke();
    }
  }

  __filterPointsByStyle(style) {
    return this.__points.filter((x) => x.strokeStyle === style);
  }

  __plotLines(p) {
    this.__ctx.moveTo(...p.moveTo);
    p.lines.forEach((l) => this.__ctx.lineTo(...l));
  }
}

export default BracketLineDrawer;

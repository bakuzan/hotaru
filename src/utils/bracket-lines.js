export default function bracketCanvasDrawer(canvas, nodes, layout) {
  const ctx = canvas.getContext('2d');
  // const midRoundIndex = Math.floor(layout.length / 2);
  console.log('CANVAS', ctx, layout, nodes);

  layout.forEach((round, rIndex, rounds) => {
    round.forEach((versus, vIndex) => {
      const node = nodes.find((x) => x.id === versus.id);
      const rect = node.$el.getBoundingClientRect();
      const midY = rect.height / 2;
      const midX = rect.width / 2;

      const startX = rect.left + midX;
      const startY = rect.top + midY;

      // next versus
      const nextRound = rounds[rIndex + 1];
      if (nextRound) {
        const nextVersus = nextRound.find(
          (_, i) => i === Math.floor(vIndex / 2)
        );
        const nextNode = nodes.find((x) => x.id === nextVersus.id);
        const nextRect = nextNode.$el.getBoundingClientRect();
        // const nMidY = nextRect.height / 2;
        const nMidX = nextRect.width / 2;

        const endX = nextRect.left + nMidX;
        const endY = nextRect.top;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 5;
        ctx.stroke();
        console.log(
          rIndex,
          node.id,
          `(${startX}, ${startY})`,
          `(${endX}, ${endY})`
        );
      }
    });
  });

  /*
      var rect = element.getBoundingClientRect();
      console.log(rect.top, rect.right, rect.bottom, rect.left);

      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(300,150);
      ctx.stroke();
    
    */
}

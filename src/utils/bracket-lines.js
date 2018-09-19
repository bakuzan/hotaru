export default function bracketCanvasDrawer(canvas, nodes, layout) {
  const ctx = canvas.getContext('2d');
  // const midRoundIndex = Math.floor(layout.length / 2);
  console.log('CANVAS', ctx, layout, nodes);

  layout.forEach((round, rIndex, rounds) => {
    round.forEach((versus, vIndex) => {
      const node = nodes.find((x) => Number(x.id) === versus.id.toString());
      console.log(versus.id, nodes.find((x) => x.id === versus.id.toString()));
      const startX = node.offsetLeft + node.offsetWidth;
      const startY = node.offsetTop + node.offsetHeight / 2;
      console.log(
        node.offsetHeight,
        node.offsetLeft,
        node.offsetTop,
        node.offsetWidth
      );
      // next versus
      const nextRound = rounds[rIndex + 1];
      if (nextRound) {
        const nextVersus = nextRound.find(
          (_, i) => i === Math.floor(vIndex / 2)
        );
        console.log(
          nextVersus.id,
          nodes.find((x) => x.id === nextVersus.id.toString())
        );
        const nextNode = nodes.find((x) => x.id === nextVersus.id.toString());

        const endX = nextNode.offsetLeft + nextNode.offsetWidth / 2;
        const endY = nextNode.offsetTop;

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

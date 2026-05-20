export function mockGenerateAIResponse(userInput) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        safe: '很想和你聚，但这周末我确实需要好好休息、恢复一下精力。祝你玩得开心，我们改天再约。',
        balanced: '谢谢你的邀请！这周我状态比较累，想在家里静静待两天充充电。我很在意我们的关系，改天一定好好聊。',
        direct: '这周末我去不了了，最近真的有点透支，需要独处休息。不是不想见你，改天我们再安排，好吗？',
      });
    }, 2000);
  });
}

export async function mockGenerate({ input }) {
  const data = await mockGenerateAIResponse(input);
  return [
    { tag: '安全版', content: data.safe },
    { tag: '平衡版', content: data.balanced },
    { tag: '直接版', content: data.direct },
  ];
}

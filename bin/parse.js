// util for converting output from bing AI to structured data 
const text = ``;

const items = text.split("\n").map(
    item => {
        const [, actor, chat] = item.match(/^(Authority|Journalist):\s(.+)$/);
        return {
            text: chat,
            meta: {
                isUser: actor === "Authority"
            }
        }
    }
);

console.log(JSON.stringify(items));

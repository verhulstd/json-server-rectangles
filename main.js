import "./styles.css";
import randomColor from "randomcolor";
import { delay } from "./helpers";
async function main() {
  const basePath = "http://localhost:3000/rectangles/";
  await delay(1000);
  const data = await (await fetch(basePath)).json();
  document.body.innerHTML = data
    .map(
      ({ id, x, y, width, height, color }) => `
        <div data-id="${id}" class="rectangle" style="
            left : ${x}px;
            top : ${y}px;
            width : ${width}px;
            height : ${height}px;
            background-color : ${color}; 
        "></div>
    `
    )
    .join("");

  document.body.onclick = async (e) => {
    if (
      e.target.classList.contains("rectangle") &&
      !e.target.classList.contains("blocked")
    ) {
      const oldColor = e.target.style.backgroundColor;
      const color = randomColor();
      const id = e.target.dataset.id;
      e.target.style.backgroundColor = color;
      e.target.classList.add("blocked");
      try {
        await delay(1000);
        await fetch(basePath + id, {
          method: "PATCH",
          body: JSON.stringify({
            color,
          }),
          headers: {
            "content-type": "application/json",
          },
        });
      } catch (error) {
        e.target.style.backgroundColor = oldColor;
        console.log(error);
      }
      e.target.classList.remove("blocked");
    }
  };
  document.body.ondblclick = async (e) => {
    if (e.target.classList.contains("rectangle")) {
      const id = e.target.dataset.id;
      e.target.parentNode.removeChild(e.target);
      await delay(1000);
      await fetch(basePath + id, {
        method: "DELETE",
      });
    }
  };
}

main();

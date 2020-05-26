// Change brush color on nav click
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener('click', function (event) {
    strokeSetting.color = this.style.backgroundColor;
    console.log("sdvsdvds");
    event.preventDefault();
  })
});

// Start or stop Chaos Mode when clicked
document.getElementById('chaos').addEventListener('click', function (event) {
  previousDrawingsTriggered = !previousDrawingsTriggered;
});

// Make content inside website unselectable to avoid undesired behaviour while drawing on them
function makeUnselectable(node) {
  if (node.nodeType === 1) {
    node.setAttribute("unselectable", "on");
  }
  let child = node.firstChild;
  while (child) {
    makeUnselectable(child);
    child = child.nextSibling;
  }
}
makeUnselectable(document.getElementById("contentContainer"));

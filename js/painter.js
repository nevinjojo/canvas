// Change brush color on nav click
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener('click', function (event) {
    strokeSetting.color = this.style.backgroundColor;
    event.preventDefault();
  })
});

// Start or stop Chaos Mode when clicked
$('#chaos').on('click', function () {
  previousDrawingsTriggered = !previousDrawingsTriggered;
  if (!previousDrawingsTriggered) {
    clear();
  } else {
    updateElementPositions();
  }
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


// List of elements to be styled
function updateElementPositions() {
  let elemsClassList = ['columns-main', 'w-row', 'w-container', 'text-with-image', 'boring', 'about-column', 'contact'];
  for (let className of elemsClassList) {
    let elems = document.getElementsByClassName(className);
    for (let i = 0; i < elems.length; i++) {
      elems[i].style.zIndex = '3';
    }
  }
}

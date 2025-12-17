let processes = [
  { id: 1, name: "Process A", cpu: 80, priority: 2 },
  { id: 2, name: "Process B", cpu: 60, priority: 1 }
];

function renderProcesses() {
  const list = document.getElementById("processList");
  list.innerHTML = "";

  processes.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `${p.name} | CPU: ${p.cpu}% | Priority: ${p.priority}`;
    list.appendChild(div);
  });
}

renderProcesses();

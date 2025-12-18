let processes = [
  { id: 1, name: 'Process A', cpu: 80, memory: 60, priority: 2, arrivalTime: 0 },
  { id: 2, name: 'Process B', cpu: 70, memory: 50, priority: 1, arrivalTime: 1 },
  { id: 3, name: 'Process C', cpu: 90, memory: 70, priority: 3, arrivalTime: 2 }
];

let scheduler = 'RR';
let timeQuantum = 20;
let quantumRemaining = 20;
let currentProcessId = null;
let readyQueue = [];
let tick = 0;
let isRunning = false;
let intervalId = null;
let nextId = 4;

const schedulerEl = document.getElementById('scheduler');
const timeQuantumEl = document.getElementById('timeQuantum');
const quantumContainer = document.getElementById('quantum-container');
const startPauseBtn = document.getElementById('startPause');
const addProcessBtn = document.getElementById('addProcess');
const resetBtn = document.getElementById('reset');
const processCardsEl = document.getElementById('processCards');
const readyQueueEl = document.getElementById('readyQueue');
const readyQueueContainer = document.getElementById('readyQueueContainer');
const activeCountEl = document.getElementById('activeCount');
const tickCountEl = document.getElementById('tickCount');
const quantumRemainingEl = document.getElementById('quantumRemaining');
const quantumRemainingContainer = document.getElementById('quantumRemainingContainer');

function renderProcesses() {
  processCardsEl.innerHTML = '';
  processes.forEach(proc => {
    const card = document.createElement('div');
    card.className = 'process-card';
    if (proc.id === currentProcessId && isRunning) card.classList.add('executing');

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3>${proc.name}</h3>
          <p>ID: ${proc.id}</p>
        </div>
        <button onclick="removeProcess(${proc.id})" ${isRunning ? 'disabled' : ''}>❌</button>
      </div>
      <div class="priority">Priority: ${proc.priority}</div>
      <div class="progress-container">
        <div class="progress-label"><span>CPU Usage</span><span>${proc.cpu}%</span></div>
        <div class="progress-bar">
          <div class="progress-fill cpu-fill" style="width:${proc.cpu}%">
            ${proc.cpu > 10 ? proc.cpu + '%' : ''}
          </div>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-label"><span>Memory Usage</span><span>${proc.memory}%</span></div>
        <div class="progress-bar">
          <div class="progress-fill memory-fill" style="width:${proc.memory}%">
            ${proc.memory > 10 ? proc.memory + '%' : ''}
          </div>
        </div>
      </div>
      ${proc.cpu === 0 ? '<div style="margin-top:5px;text-align:center;color:#22c55e;font-weight:bold;">✓ COMPLETED</div>' : ''}
      ${proc.id === currentProcessId && isRunning ? '<div style="margin-top:5px;text-align:center;color:#facc15;font-weight:bold;">⚡ EXECUTING</div>' : ''}
    `;
    processCardsEl.appendChild(card);
  });

  activeCountEl.textContent = processes.filter(p => p.cpu > 0).length;
  tickCountEl.textContent = tick;
  quantumRemainingEl.textContent = quantumRemaining;
}

function renderReadyQueue() {
  readyQueueEl.innerHTML = '';
  readyQueue.forEach((pid, index) => {
    const proc = processes.find(p => p.id === pid);
    if (proc) {
      const div = document.createElement('div');
      div.className = 'queue-item' + (index === 0 ? ' current' : '');
      div.textContent = proc.name;
      readyQueueEl.appendChild(div);
    }
  });
  readyQueueContainer.style.display = readyQueue.length ? 'block' : 'none';
}

function initializeQueue() {
  const activeProcesses = processes.filter(p => p.cpu > 0);
  if (scheduler === 'FCFS' || scheduler === 'RR') {
    activeProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  } else if (scheduler === 'Priority') {
    activeProcesses.sort((a, b) => a.priority - b.priority);
  }
  readyQueue = activeProcesses.map(p => p.id);
  currentProcessId = readyQueue.length ? readyQueue[0] : null;
  quantumRemaining = timeQuantum;
}

function startSimulation() {
  if (isRunning) return;
  initializeQueue();
  intervalId = setInterval(simulateTick, 1000);
  isRunning = true;
  startPauseBtn.textContent = 'Pause';
  startPauseBtn.classList.add('paused');
}

function pauseSimulation() {
  clearInterval(intervalId);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  startPauseBtn.classList.remove('paused');
}

function toggleSimulation() {
  if (isRunning) pauseSimulation();
  else startSimulation();
}

function addProcess() {
  const newProcess = {
    id: nextId,
    name: `Process ${String.fromCharCode(64 + nextId)}`,
    cpu: Math.floor(Math.random() * 40) + 60,
    memory: Math.floor(Math.random() * 40) + 40,
    priority: Math.floor(Math.random() * 5) + 1,
    arrivalTime: tick
  };

  nextId++;
  processes.push(newProcess);
  initializeQueue();
  renderProcesses();
  renderReadyQueue();
}

function removeProcess(id) {
  processes = processes.filter(p => p.id !== id);
  readyQueue = readyQueue.filter(pid => pid !== id);
  if (currentProcessId === id) currentProcessId = null;
  renderProcesses();
  renderReadyQueue();
}

function resetSimulation() {
  pauseSimulation();
  processes = [
    { id: 1, name: 'Process A', cpu: 80, memory: 60, priority: 2, arrivalTime: 0 },
    { id: 2, name: 'Process B', cpu: 70, memory: 50, priority: 1, arrivalTime: 1 },
    { id: 3, name: 'Process C', cpu: 90, memory: 70, priority: 3, arrivalTime: 2 }
  ];
  nextId = 4;
  tick = 0;
  quantumRemaining = timeQuantum;
  currentProcessId = null;
  readyQueue = [];
  initializeQueue();
  renderProcesses();
  renderReadyQueue();
}

function simulateTick() {
  tick++;
  const activeProcesses = processes.filter(p => p.cpu > 0);
  if (!activeProcesses.length) {
    pauseSimulation();
    return;
  }

  if (!currentProcessId && readyQueue.length) currentProcessId = readyQueue[0];

  if (scheduler === 'FCFS' || scheduler === 'Priority') {
    const procIndex = processes.findIndex(p => p.id === currentProcessId);
    if (procIndex !== -1) {
      processes[procIndex].cpu = Math.max(0, processes[procIndex].cpu - 10);
      processes[procIndex].memory = Math.max(0, processes[procIndex].memory - 5);
      if (processes[procIndex].cpu === 0) {
        readyQueue = readyQueue.filter(pid => pid !== currentProcessId);
        currentProcessId = readyQueue[0] || null;
      }
    }
  } else if (scheduler === 'RR') {
    if (!readyQueue.length) return;
    const currentId = readyQueue[0];
    const procIndex = processes.findIndex(p => p.id === currentId);
    if (procIndex !== -1) {
      processes[procIndex].cpu = Math.max(0, processes[procIndex].cpu - 10);
      processes[procIndex].memory = Math.max(0, processes[procIndex].memory - 5);
      quantumRemaining -= 10;
      if (processes[procIndex].cpu === 0 || quantumRemaining <= 0) {
        readyQueue.shift();
        if (processes[procIndex].cpu > 0) readyQueue.push(currentId);
        quantumRemaining = timeQuantum;
      }
      currentProcessId = readyQueue[0] || null;
    }
  }

  renderProcesses();
  renderReadyQueue();
}

schedulerEl.addEventListener('change', e => {
  scheduler = e.target.value;
  quantumContainer.style.display = scheduler === 'RR' ? 'block' : 'none';
  pauseSimulation();
  initializeQueue();
  renderProcesses();
  renderReadyQueue();
});

timeQuantumEl.addEventListener('change', e => {
  timeQuantum = Math.max(1, parseInt(e.target.value) || 10);
  quantumRemaining = timeQuantum;
});

startPauseBtn.addEventListener('click', toggleSimulation);
addProcessBtn.addEventListener('click', addProcess);
resetBtn.addEventListener('click', resetSimulation);

renderProcesses();
renderReadyQueue();

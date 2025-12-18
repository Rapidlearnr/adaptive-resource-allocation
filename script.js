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

function renderProcesses() {
  processCardsEl.innerHTML = '';
  processes.forEach(proc => {
    const card = document.createElement('div');
    card.className = 'process-card';
    if (proc.id === currentProcessId && isRunning) card.classList.add('executing');

    card.innerHTML = `
      <h3>${proc.name}</h3>
      <p>ID: ${proc.id}</p>
      <p>Priority: ${proc.priority}</p>

      <div class="progress-container">
        <div class="progress-label"><span>CPU</span><span>${proc.cpu}%</span></div>
        <div class="progress-bar">
          <div class="progress-fill cpu-fill" style="width:${proc.cpu}%"></div>
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-label"><span>Memory</span><span>${proc.memory}%</span></div>
        <div class="progress-bar">
          <div class="progress-fill memory-fill" style="width:${proc.memory}%"></div>
        </div>
      </div>

      ${proc.cpu === 0 ? '<b style="color:#22c55e">✓ COMPLETED</b>' : ''}
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
    if (!proc) return;
    const div = document.createElement('div');
    div.className = 'queue-item' + (index === 0 ? ' current' : '');
    div.textContent = proc.name;
    readyQueueEl.appendChild(div);
  });
  readyQueueContainer.style.display = readyQueue.length ? 'block' : 'none';
}

function initializeQueue() {
  const active = processes.filter(p => p.cpu > 0);

  if (scheduler === 'FCFS' || scheduler === 'RR') {
    active.sort((a, b) => a.arrivalTime - b.arrivalTime);
  }

  if (scheduler === 'Priority') {
    active.sort((a, b) => a.priority - b.priority);
  }

  readyQueue = active.map(p => p.id);
  currentProcessId = readyQueue[0] || null;
  quantumRemaining = timeQuantum;
}

function simulateTick() {
  tick++;

  if (!currentProcessId) {
    pauseSimulation();
    return;
  }

  const proc = processes.find(p => p.id === currentProcessId);
  if (!proc) return;

  if (scheduler === 'FCFS' || scheduler === 'Priority') {
    proc.cpu = Math.max(0, proc.cpu - 10);
    proc.memory = Math.max(0, proc.memory - 5);

    if (proc.cpu === 0) {
      readyQueue.shift();
      currentProcessId = readyQueue[0] || null;
    }
  }

  if (scheduler === 'RR') {
    proc.cpu = Math.max(0, proc.cpu - 10);
    proc.memory = Math.max(0, proc.memory - 5);
    quantumRemaining -= 10;

    if (proc.cpu === 0 || quantumRemaining <= 0) {
      readyQueue.shift();
      if (proc.cpu > 0) readyQueue.push(proc.id);
      quantumRemaining = timeQuantum;
      currentProcessId = readyQueue[0] || null;
    }
  }

  renderProcesses();
  renderReadyQueue();
}

function startSimulation() {
  if (isRunning) return;

  if (!readyQueue.length) {
    initializeQueue();
  }

  intervalId = setInterval(simulateTick, 1000);
  isRunning = true;
  startPauseBtn.textContent = 'Pause';
}

function pauseSimulation() {
  clearInterval(intervalId);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
}

function toggleSimulation() {
  isRunning ? pauseSimulation() : startSimulation();
}

function addProcess() {
  processes.push({
    id: nextId,
    name: `Process ${String.fromCharCode(64 + nextId)}`,
    cpu: 80,
    memory: 60,
    priority: Math.floor(Math.random() * 5) + 1,
    arrivalTime: tick
  });
  nextId++;
  initializeQueue();
  renderProcesses();
  renderReadyQueue();
}

function resetSimulation() {
  pauseSimulation();
  tick = 0;
  nextId = 4;
  processes = [
    { id: 1, name: 'Process A', cpu: 80, memory: 60, priority: 2, arrivalTime: 0 },
    { id: 2, name: 'Process B', cpu: 70, memory: 50, priority: 1, arrivalTime: 1 },
    { id: 3, name: 'Process C', cpu: 90, memory: 70, priority: 3, arrivalTime: 2 }
  ];
  initializeQueue();
  renderProcesses();
  renderReadyQueue();
}

schedulerEl.addEventListener('change', e => {
  scheduler = e.target.value;
  quantumContainer.style.display = scheduler === 'RR' ? 'block' : 'none';
  resetSimulation();
});

timeQuantumEl.addEventListener('change', e => {
  timeQuantum = Math.max(1, parseInt(e.target.value));
  quantumRemaining = timeQuantum;
});

startPauseBtn.addEventListener('click', toggleSimulation);
addProcessBtn.addEventListener('click', addProcess);
resetBtn.addEventListener('click', resetSimulation);

initializeQueue();
renderProcesses();
renderReadyQueue();


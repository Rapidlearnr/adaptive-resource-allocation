# Adaptive Resource Allocation in Multiprogramming Systems

## 1. Project Overview

This project is a simulation-based implementation of **Adaptive Resource Allocation in a Multiprogramming Operating System**. It demonstrates how an operating system manages multiple processes in memory and allocates CPU resources using different scheduling algorithms.

The project uses a visual and interactive approach to help understand how processes move through the **ready queue**, how CPU time is allocated, and how scheduling decisions affect execution.

---

## 2. Objectives

The objectives of this project are:

* To simulate a **multiprogramming environment**
* To understand **process scheduling** in an operating system
* To implement and compare different **CPU scheduling algorithms**
* To visualize process execution and ready queue behavior
* To provide a practical understanding of OS scheduling concepts

---

## 3. System Description

Each process in the system is defined by the following attributes:

* Process ID
* CPU usage
* Memory usage
* Priority
* Arrival time

The scheduler selects processes from the ready queue based on the selected scheduling algorithm. CPU and memory usage are updated on each execution cycle.

---

## 4. Scheduling Algorithms Implemented

### 4.1 First Come First Serve (FCFS)

FCFS is a **non-preemptive scheduling algorithm**. Processes are executed in the order of their arrival time. Once a process gets the CPU, it continues execution until completion.

### 4.2 Priority Scheduling

Priority Scheduling is implemented as a **non-preemptive algorithm**. Each process is assigned a priority value. The process with the highest priority (lowest numerical value) is executed first.

### 4.3 Round Robin Scheduling

Round Robin is a **preemptive scheduling algorithm**. Each process is given a fixed **time quantum**. If the process does not complete within the quantum, it is placed back into the ready queue.

---

## 5. Key Features

* Simulation of multiple active processes
* Dynamic process creation during runtime
* Visual representation of the ready queue
* CPU and memory utilization tracking
* Adjustable time quantum for Round Robin
* Start, Pause, and Reset simulation controls

---

## 6. Technologies Used

* **HTML** for structure
* **CSS** for user interface and styling
* **JavaScript** for scheduling logic and simulation

---

## 7. How the Simulation Works

* Processes are loaded into the ready queue based on arrival time or priority
* On each clock tick, CPU and memory usage are reduced
* Scheduling decisions depend on the selected algorithm
* Completed processes are marked and removed from execution

---

## 8. Academic Relevance

This project is aligned with core **Operating System concepts**, including:

* Multiprogramming
* Process management
* CPU scheduling
* Ready queue
* Time quantum

The project is suitable for OS practical examinations and viva.

---

## 9. Conclusion

The project successfully demonstrates how an operating system allocates CPU resources among multiple processes using different scheduling techniques. It helps bridge the gap between theoretical concepts and practical understanding.

---

## 10. Author

**Md Shaad Akhtar**
**Utkarsh Patel**
**Manas Mankotia**


## Process scheduling algorithms (_in operating systems_)
Implemented common scheduling algorithms used on personal computers, servers, and other kinds of interactive systems

### Round-robin
Each process is assigned a time interval, called its "quantum", during which it is allowed to run. After finishing its quantum process blocked and put to end of queue. Scheduler makes the implicit assumption that all process are equally important. The interesting issue with round robin is the length of the quantum. Setting the quantum too short causes too many process switches and lowers the CPU efficency. But setting it too long may cause poor response to short interactive requests.

### Priority scheduling
Each process is assigned a priority, and the runnable rpocess with the highest priority is allowed to run. To prevent high-priority processes from running infinitely, the scheduler may decrease the priority of the currently running process at each clock tick, or some other time interval. If this action causes its priority to drop below that of the next highest process, a process switch occurs. Priorities can be assigned to process statically or dynamically.
    It is often convenient to group processes into priority calsses and use priority scheduling among the classes, but round-robin scheduling within classes
    Priority scheduling has problem of indefinite blocking or starvation, in which low priority task can wait forever. One common solution to this problem is aging, in which priorities of jobs increases the longer they wait. Under this scheme a low-priority job will eventually get its priority raised high enough by time.

### Multilevel queue scheduling
When processes can be categorized, then multiple seperate queues can be established, each implementing whatever scheduling algorithm is most appropriate for that type of job. Scheduling must also be done between queues, that is scheduling one queue to get time relative to other queues. Common options are priority and round-robin. Processes cannot switch queues, exit queue or enter queue.

### Multilevel feedback-queue scheduling (_not implemented here_)
This scheduling is similar to multilevel queue scheduling, except jobs can be moved from one queue to another for these reasons:
        - If characteristics of process is switched between CPU-intesive to I/O intensive. 
        - If process aged, so that process has waited for a long time

### Shortest process next
This scheduling runs shortest processes, and calculates which process is shortest based on past behavior. Calculation is simple, adding the new value to current estimate and divide the sum by 2. The technique of estimating the next value in a series by taking the weighted average of the current measured value and the previous estimate is sometimes called aging

### Guaranteed scheduling  (_not implemented here_)
With n processes running, all things being equal, each one should get 1/n of the CPU cycles. System must keep track of how much CPU each process has had since its creation, then computes the amount of CPU each process is entitled to - ratio of actual CPU time. The algorithm is then run the process with the lowest ration until its ratio has moved above that of its closest competitor

### Lottery scheduling
Idea is to give processes lottery tickets for system resourses, such as CPU time. When a scheduling decision has to be made, a lottery ticket is chosen at random, and the process holding that ticket gets the resource. More important processes can be given extra tickets, to increase their idds of winning. A process holding a fraction F of the tickets will get about a fraction F of the resource in question. Coorporating processes may exchange tickets if they wish